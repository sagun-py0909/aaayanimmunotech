// Lead storage. A JSON file is enough for one desk on a single always-on server; it is NOT
// enough on Vercel, where the filesystem is ephemeral and every request may hit a new instance.
// Point AAAYAN_DB_PATH at a persistent volume, or swap these four functions for a database,
// before the desk is used for real leads.
import fs from "fs";
import path from "path";
import { z } from "zod";
import { seedLeads, stages, type Lead } from "../shared/lead-desk";

type Database = { leads: Lead[] };

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
  if (!fs.existsSync(databasePath)) return { leads: seedLeads };
  try {
    const parsed = JSON.parse(fs.readFileSync(databasePath, "utf8")) as Partial<Database>;
    return { leads: Array.isArray(parsed.leads) ? parsed.leads : seedLeads };
  } catch {
    // A corrupt file must not take the desk down; the seed rows are obvious enough to notice.
    return { leads: seedLeads };
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
