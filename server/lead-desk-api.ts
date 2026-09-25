// The private API behind /crm. Sessions are a random token in an HttpOnly cookie, held in memory:
// a restart signs the desk out, and it does not work across serverless instances. Move both the
// sessions and the store to a database before this runs anywhere but a single always-on server.
import crypto from "crypto";
import express from "express";
import { createLead, enquirySchema, leadCreateSchema, leadFromEnquiry, leadPatchSchema, listLeads, updateLead } from "./store";

const sessionLifetime = 8 * 60 * 60 * 1000;
const loginWindow = 15 * 60 * 1000;
const loginLimit = 10;

const enquiryWindow = 10 * 60 * 1000;
const enquiryLimit = 5;

const sessions = new Map<string, number>();
const enquiryAttempts = new Map<string, { count: number; resetAt: number }>();
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

// No fallback credentials: with none configured the desk cannot be signed into at all.
const crmEmail = (process.env.CRM_EMAIL || "").trim().toLowerCase();
const crmPassword = process.env.CRM_PASSWORD || "";

const parseCookies = (header = "") =>
  Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim().split("="))
      .filter(([key, value]) => key && value)
      .map(([key, value]) => [key, decodeURIComponent(value)]),
  );

const cookie = (token: string, maxAge: number) =>
  `aaayan_session=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${maxAge}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;

function requireSession(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = parseCookies(req.headers.cookie).aaayan_session;
  const expiresAt = token ? sessions.get(token) : undefined;
  if (!token || !expiresAt || expiresAt <= Date.now()) {
    if (token) sessions.delete(token);
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

export function mountLeadDesk(app: express.Express) {
  app.use("/api", express.json({ limit: "64kb" }));

  app.post("/api/auth/login", (req, res) => {
    const address = req.ip || "unknown";
    const attempt = loginAttempts.get(address);
    if (attempt && attempt.resetAt > Date.now() && attempt.count >= loginLimit) return res.status(429).json({ error: "Too many login attempts" });

    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    const ok = Boolean(crmEmail) && Boolean(crmPassword) && email === crmEmail && password === crmPassword;
    if (!ok) {
      const current = attempt && attempt.resetAt > Date.now() ? attempt : { count: 0, resetAt: Date.now() + loginWindow };
      loginAttempts.set(address, { count: current.count + 1, resetAt: current.resetAt });
      return res.status(401).json({ error: "Invalid credentials" });
    }

    loginAttempts.delete(address);
    const token = crypto.randomBytes(32).toString("hex");
    sessions.set(token, Date.now() + sessionLifetime);
    res.setHeader("Set-Cookie", cookie(token, sessionLifetime / 1000));
    return res.json({ authenticated: true });
  });

  app.post("/api/auth/logout", (req, res) => {
    const token = parseCookies(req.headers.cookie).aaayan_session;
    if (token) sessions.delete(token);
    res.setHeader("Set-Cookie", cookie("", 0));
    return res.status(204).end();
  });

  app.get("/api/auth/session", requireSession, (_req, res) => res.json({ authenticated: true }));

  app.get("/api/leads", requireSession, (_req, res) => res.json({ leads: listLeads() }));

  app.post("/api/leads", requireSession, (req, res) => {
    const parsed = leadCreateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid lead", details: parsed.error.flatten() });
    return res.status(201).json(createLead(parsed.data));
  });

  app.patch("/api/leads/:id", requireSession, (req, res) => {
    const parsed = leadPatchSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid lead update", details: parsed.error.flatten() });
    const lead = updateLead(Number(req.params.id), parsed.data);
    return lead ? res.json(lead) : res.status(404).json({ error: "Lead not found" });
  });

  // The public quotation forms. No session: this is how a visitor becomes a lead.
  app.post("/api/enquiries", (req, res) => {
    const address = req.ip || "unknown";
    const attempt = enquiryAttempts.get(address);
    if (attempt && attempt.resetAt > Date.now() && attempt.count >= enquiryLimit) return res.status(429).json({ error: "Too many enquiries. Please email us instead." });

    const parsed = enquirySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid enquiry", details: parsed.error.flatten() });

    const current = attempt && attempt.resetAt > Date.now() ? attempt : { count: 0, resetAt: Date.now() + enquiryWindow };
    enquiryAttempts.set(address, { count: current.count + 1, resetAt: current.resetAt });

    // A filled honeypot is a bot: answer as if it worked, and keep it out of the desk.
    if (parsed.data.website) return res.status(201).json({ received: true });

    createLead(leadFromEnquiry(parsed.data));
    return res.status(201).json({ received: true });
  });

  // Anything else under /api is not a page; answer as API rather than falling through to the SPA.
  app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));
}
