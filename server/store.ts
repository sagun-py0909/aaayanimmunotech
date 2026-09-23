import fs from "fs";
import path from "path";
import { BlogPost, Lead, seedLeads, seedPosts } from "../shared/lead-desk";
import { z } from "zod";

type Database = { leads: Lead[]; posts: BlogPost[] };
const databasePath = process.env.AAAYAN_DB_PATH || path.resolve(process.cwd(), "server/data/lead-desk.json");
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const leadCreateSchema = z.object({ name: z.string().trim().min(1).max(120), company: z.string().trim().min(1).max(160), city: z.string().trim().min(1).max(100), email: z.string().trim().email().max(200), phone: z.string().trim().max(40), interest: z.string().trim().min(1).max(160), value: z.number().nonnegative(), stage: z.enum(["New enquiry", "Qualified", "Proposal", "Negotiation", "Won"]), source: z.string().trim().min(1).max(100), owner: z.string().trim().min(1).max(100), nextAction: z.string().trim().min(1).max(160), lastContact: z.string().trim().min(1).max(80), note: z.string().max(1000) });
export const leadPatchSchema = leadCreateSchema.partial();
export const postCreateSchema = z.object({ category: z.string().trim().min(1).max(80), title: z.string().trim().min(1).max(180), excerpt: z.string().trim().min(1).max(500), body: z.string().max(100000).default(""), date: z.string().trim().min(1).max(40), image: z.string().trim().min(1).max(500), status: z.enum(["Draft", "Published"]), slug: z.string().trim().min(1).max(180).optional() });
export const postPatchSchema = postCreateSchema.partial();

function readDatabase(): Database {
  if (!fs.existsSync(databasePath)) {
    const initial = { leads: seedLeads, posts: seedPosts };
    fs.mkdirSync(path.dirname(databasePath), { recursive: true });
    fs.writeFileSync(databasePath, JSON.stringify(initial, null, 2));
    return initial;
  }
  const database = JSON.parse(fs.readFileSync(databasePath, "utf8")) as Partial<Database>;
  return { leads: database.leads || seedLeads, posts: (database.posts || seedPosts).map((post) => ({ ...post, slug: post.slug || slugify(post.title), body: post.body || "" })) };
}

function writeDatabase(database: Database) {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  const temporaryPath = `${databasePath}.${process.pid}.tmp`;
  fs.writeFileSync(temporaryPath, JSON.stringify(database, null, 2));
  fs.renameSync(temporaryPath, databasePath);
}

export function listLeads() { return readDatabase().leads; }
export function listPosts() { return readDatabase().posts; }

export function createLead(lead: Omit<Lead, "id">) {
  const database = readDatabase();
  const created = { ...lead, id: Date.now() };
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

export function createPost(post: Omit<BlogPost, "id">) {
  const database = readDatabase();
  const created = { ...post, slug: post.slug || slugify(post.title), id: Date.now() };
  database.posts.unshift(created);
  writeDatabase(database);
  return created;
}

export function updatePost(id: number, patch: Partial<BlogPost>) {
  const database = readDatabase();
  const index = database.posts.findIndex((post) => post.id === id);
  if (index < 0) return null;
  database.posts[index] = { ...database.posts[index], ...patch, id };
  writeDatabase(database);
  return database.posts[index];
}