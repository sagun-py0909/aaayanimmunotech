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
