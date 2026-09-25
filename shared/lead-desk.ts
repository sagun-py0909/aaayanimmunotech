// The private lead desk at /crm. Nothing here is public: the API sits behind a session cookie
// and the routes are noindex (see shared/seo.ts).

export type Stage = "New enquiry" | "Qualified" | "Proposal" | "Negotiation" | "Won";

export const stages: Stage[] = ["New enquiry", "Qualified", "Proposal", "Negotiation", "Won"];

export type Lead = {
  id: number;
  name: string;
  company: string;
  city: string;
  email: string;
  phone: string;
  /** Free text, usually a product name from the catalogue. */
  interest: string;
  value: number;
  stage: Stage;
  source: string;
  owner: string;
  nextAction: string;
  lastContact: string;
  note: string;
};

// Sample rows so the desk is not empty on a fresh install. Delete them once real leads land.
export const seedLeads: Lead[] = [
  { id: 1, name: "Sample — Dr. Kavya Menon", company: "Asteria Recovery Clinic", city: "Mumbai", email: "kavya@example.com", phone: "", interest: "Hyperbaric Oxygen / HBOT", value: 6800000, stage: "Proposal", source: "Website enquiry", owner: "Unassigned", nextAction: "Send revised site plan", lastContact: "Today", note: "Sample lead. Opening a second recovery floor, needs a compact footprint and commissioning included." },
  { id: 2, name: "Sample — Rohan Batra", company: "Pulse Performance Club", city: "Bengaluru", email: "rohan@example.com", phone: "", interest: "Whole Body Cryotherapy Chambers", value: 4200000, stage: "Qualified", source: "Referral", owner: "Unassigned", nextAction: "Book site survey", lastContact: "Yesterday", note: "Sample lead. High-throughput member recovery space." },
  { id: 3, name: "Sample — Ananya Shah", company: "The Sundara", city: "Goa", email: "ananya@example.com", phone: "", interest: "Red Light / PBM Therapy Beds", value: 1650000, stage: "New enquiry", source: "Website enquiry", owner: "Unassigned", nextAction: "Qualify requirements", lastContact: "Today", note: "Sample lead. Hotel spa adding a recovery room." },
];
