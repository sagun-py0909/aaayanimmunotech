// Lead and blog storage. A JSON file is enough for one desk on a single always-on server; it is NOT
// enough on Vercel, where the filesystem is ephemeral and every request may hit a new instance.
// Point AAAYAN_DB_PATH at a persistent volume, or swap the read/write functions below for a
// database, before the desk is used for real leads or the blog is published from it.
import fs from "fs";
import path from "path";
import { z } from "zod";
import { blogCategories, slugPattern, type Post } from "../shared/blog";
import { seedLeads, stages, type Lead } from "../shared/lead-desk";
import { catalogue } from "../shared/site";

type Database = { leads: Lead[]; posts: Post[] };

const databasePath = process.env.AAAYAN_DB_PATH || path.resolve(process.cwd(), "server/data/lead-desk.json");

export const leadCreateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  company: z.string().trim().min(1).max(160),
  city: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).default(""),
  interest: z.string().trim().min(1).max(160),
  value: z.number().nonnegative().max(1e12),
  stage: z.enum(stages as [Lead["stage"], ...Lead["stage"][]]),
  source: z.string().trim().min(1).max(100),
  owner: z.string().trim().min(1).max(100),
  nextAction: z.string().trim().min(1).max(160),
  lastContact: z.string().trim().min(1).max(80),
  note: z.string().max(2000).default(""),
});

export const leadPatchSchema = leadCreateSchema.partial();

// What the public forms are allowed to send. Everything else about the lead (stage, owner,
// source) is decided here, not by the browser.
export const enquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  company: z.string().trim().max(160).default(""),
  city: z.string().trim().max(100).default(""),
  phone: z.string().trim().max(40).default(""),
  sector: z.string().trim().max(120).default(""),
  interest: z.string().trim().max(160).default(""),
  message: z.string().trim().max(2000).default(""),
  /** Names of shortlisted systems, when the enquiry came from the shortlist drawer. */
  shortlist: z.array(z.string().trim().max(160)).max(10).default([]),
  /** Honeypot: a real person never fills this in. */
  website: z.string().max(200).optional(),
});

export type Enquiry = z.infer<typeof enquirySchema>;

export function leadFromEnquiry(enquiry: Enquiry): Omit<Lead, "id"> {
  const interest = enquiry.shortlist.length ? enquiry.shortlist.join(" · ") : enquiry.interest || "Not specified";
  const note = [enquiry.message, enquiry.sector && `Sector: ${enquiry.sector}`, enquiry.shortlist.length && `Shortlisted: ${enquiry.shortlist.join(", ")}`]
    .filter(Boolean)
    .join("\n\n")
    .slice(0, 2000);
  return {
    name: enquiry.name,
    company: enquiry.company || "—",
    city: enquiry.city || "—",
    email: enquiry.email,
    phone: enquiry.phone,
    interest,
    value: 0,
    stage: "New enquiry",
    source: "Website enquiry",
    owner: "Unassigned",
    nextAction: "Respond to the enquiry",
    lastContact: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    note,
  };
}

function readDatabase(): Database {
  if (!fs.existsSync(databasePath)) return { leads: seedLeads, posts: [] };
  try {
    const parsed = JSON.parse(fs.readFileSync(databasePath, "utf8")) as Partial<Database>;
    return { leads: Array.isArray(parsed.leads) ? parsed.leads : seedLeads, posts: Array.isArray(parsed.posts) ? parsed.posts : [] };
  } catch {
    // A corrupt file must not take the desk down; the seed rows are obvious enough to notice.
    return { leads: seedLeads, posts: [] };
  }
}

function writeDatabase(database: Database) {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  const temporaryPath = `${databasePath}.${process.pid}.tmp`;
  fs.writeFileSync(temporaryPath, JSON.stringify(database, null, 2));
  fs.renameSync(temporaryPath, databasePath);
}

export const listLeads = () => readDatabase().leads;

export function createLead(lead: Omit<Lead, "id">) {
  const database = readDatabase();
  const created: Lead = { ...lead, id: Date.now() };
  database.leads.unshift(created);
  writeDatabase(database);
  return created;
}

export function updateLead(id: number, patch: Partial<Lead>) {
  const database = readDatabase();
  const index = database.leads.findIndex((lead) => lead.id === id);
  if (index < 0) return null;
  database.leads[index] = { ...database.leads[index], ...patch, id };
  writeDatabase(database);
  return database.leads[index];
}

// ---- Blog posts -------------------------------------------------------------------------------

const imagePath = z.string().trim().max(500).refine((value) => value === "" || value.startsWith("/") || /^https:\/\//.test(value), "Use a /path or an https:// URL");

// Everything a draft may hold. Only the title is required until the post is published.
export const postInputSchema = z.object({
  title: z.string().trim().min(1).max(160),
  slug: z.string().trim().max(90).regex(slugPattern, "Lowercase letters, numbers and hyphens only"),
  metaTitle: z.string().trim().max(90).default(""),
  metaDescription: z.string().trim().max(220).default(""),
  excerpt: z.string().trim().max(400).default(""),
  bodyHtml: z.string().max(300_000).default(""),
  coverImage: imagePath.default(""),
  coverAlt: z.string().trim().max(200).default(""),
  category: z.enum(blogCategories).default("Buying guides"),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
  relatedProducts: z.array(z.enum(catalogue.map((product) => product.id) as [string, ...string[]])).max(4).default([]),
  author: z.string().trim().max(80).default("AAAyan Immunotech"),
  status: z.enum(["draft", "published"]).default("draft"),
  publishAt: z.string().datetime({ offset: true }).nullable().default(null),
});

export type PostInput = z.infer<typeof postInputSchema>;

export const listPosts = () => readDatabase().posts;

export const findPost = (id: number) => readDatabase().posts.find((post) => post.id === id);

/** A post by its current slug, or by a slug it used to have (the caller 301s those). */
export function findPostBySlug(slug: string) {
  const { posts } = readDatabase();
  const current = posts.find((post) => post.slug === slug);
  if (current) return { post: current, moved: false };
  const renamed = posts.find((post) => post.previousSlugs.includes(slug));
  return renamed ? { post: renamed, moved: true } : null;
}

export class SlugTakenError extends Error {}

export function createPost(input: PostInput) {
  const database = readDatabase();
  if (database.posts.some((post) => post.slug === input.slug)) throw new SlugTakenError(input.slug);
  for (const other of database.posts) other.previousSlugs = other.previousSlugs.filter((slug) => slug !== input.slug);
  const now = new Date().toISOString();
  const created: Post = { ...input, id: Math.max(Date.now(), ...database.posts.map((post) => post.id + 1)), createdAt: now, updatedAt: now, previousSlugs: [] };
  database.posts.unshift(created);
  writeDatabase(database);
  return created;
}

export function updatePost(id: number, input: PostInput) {
  const database = readDatabase();
  const index = database.posts.findIndex((post) => post.id === id);
  if (index < 0) return null;
  if (database.posts.some((post) => post.id !== id && post.slug === input.slug)) throw new SlugTakenError(input.slug);
  const existing = database.posts[index];
  // A slug a post once went live under keeps redirecting; a draft's old slugs were never public.
  const wasPublic = existing.status === "published";
  const previousSlugs = existing.slug !== input.slug && wasPublic ? Array.from(new Set([...existing.previousSlugs, existing.slug])).filter((slug) => slug !== input.slug) : existing.previousSlugs.filter((slug) => slug !== input.slug);
  // Another post that is renamed onto a slug this post used to hold takes that URL over.
  for (const other of database.posts) if (other.id !== id) other.previousSlugs = other.previousSlugs.filter((slug) => slug !== input.slug);
  database.posts[index] = { ...existing, ...input, id, previousSlugs, updatedAt: new Date().toISOString() };
  writeDatabase(database);
  return database.posts[index];
}

export function deletePost(id: number) {
  const database = readDatabase();
  const before = database.posts.length;
  database.posts = database.posts.filter((post) => post.id !== id);
  if (database.posts.length === before) return false;
  writeDatabase(database);
  return true;
}
