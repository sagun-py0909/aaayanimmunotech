import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import type { BlogPost } from "../shared/lead-desk";
import { createLead, createPost, leadCreateSchema, leadPatchSchema, listLeads, listPosts, postCreateSchema, postPatchSchema, updateLead, updatePost } from "./store";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sessions = new Map<string, number>();
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const sessionLifetime = 8 * 60 * 60 * 1000;
const loginWindow = 15 * 60 * 1000;
const loginLimit = 10;
const crmEmail = process.env.CRM_EMAIL || (process.env.NODE_ENV === "production" ? "" : "admin@aaayan.in");
const crmPassword = process.env.CRM_PASSWORD || (process.env.NODE_ENV === "production" ? "" : "aaayan123");
const parseCookies = (header = "") => Object.fromEntries(header.split(";").map((part) => part.trim().split("=")).filter(([key, value]) => key && value).map(([key, value]) => [key, decodeURIComponent(value)]));
const requireSession = (req: express.Request, res: express.Response, next: express.NextFunction) => { const token = parseCookies(req.headers.cookie).aaayan_session; const expiresAt = token ? sessions.get(token) : undefined; if (!token || !expiresAt || expiresAt <= Date.now()) { if (token) sessions.delete(token); return res.status(401).json({ error: "Authentication required" }); } next(); };

async function startServer() {
  const app = express();
  const server = createServer(app);
  app.use(express.json());

  app.post("/api/auth/login", (req, res) => {
    const address = req.ip || "unknown";
    const attempt = loginAttempts.get(address);
    if (attempt && attempt.resetAt > Date.now() && attempt.count >= loginLimit) return res.status(429).json({ error: "Too many login attempts" });
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    if (!crmEmail || !crmPassword || email !== crmEmail || password !== crmPassword) { const current = attempt && attempt.resetAt > Date.now() ? attempt : { count: 0, resetAt: Date.now() + loginWindow }; loginAttempts.set(address, { count: current.count + 1, resetAt: current.resetAt }); return res.status(401).json({ error: "Invalid credentials" }); }
    loginAttempts.delete(address);
    const token = crypto.randomBytes(32).toString("hex");
    sessions.set(token, Date.now() + sessionLifetime);
    res.setHeader("Set-Cookie", `aaayan_session=${token}; HttpOnly; Path=/; SameSite=Strict${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
    return res.json({ authenticated: true });
  });
  app.post("/api/auth/logout", (req, res) => { const token = parseCookies(req.headers.cookie).aaayan_session; if (token) sessions.delete(token); res.setHeader("Set-Cookie", "aaayan_session=; HttpOnly; Max-Age=0; Path=/; SameSite=Strict"); return res.status(204).end(); });
  app.get("/api/auth/session", requireSession, (_req, res) => res.json({ authenticated: true }));

  app.get("/api/lead-desk", requireSession, (_req, res) => res.json({ leads: listLeads(), posts: listPosts() }));
  app.get("/api/posts/published", (_req, res) => res.json({ posts: listPosts().filter((post) => post.status === "Published") }));
  app.get("/api/posts/published/:slug", (req, res) => { const post = listPosts().find((item) => item.status === "Published" && item.slug === req.params.slug); return post ? res.json(post) : res.status(404).json({ error: "Post not found" }); });
  app.post("/api/leads", requireSession, (req, res) => { const parsed = leadCreateSchema.safeParse(req.body); if (!parsed.success) return res.status(400).json({ error: "Invalid lead", details: parsed.error.flatten() }); return res.status(201).json(createLead(parsed.data)); });
  app.patch("/api/leads/:id", requireSession, (req, res) => {
    const parsed = leadPatchSchema.safeParse(req.body); if (!parsed.success) return res.status(400).json({ error: "Invalid lead update", details: parsed.error.flatten() });
    const lead = updateLead(Number(req.params.id), parsed.data);
    return lead ? res.json(lead) : res.status(404).json({ error: "Lead not found" });
  });
  app.post("/api/posts", requireSession, (req, res) => { const parsed = postCreateSchema.safeParse(req.body); if (!parsed.success) return res.status(400).json({ error: "Invalid post", details: parsed.error.flatten() }); return res.status(201).json(createPost(parsed.data as Omit<BlogPost, "id">)); });
  app.patch("/api/posts/:id", requireSession, (req, res) => {
    const parsed = postPatchSchema.safeParse(req.body); if (!parsed.success) return res.status(400).json({ error: "Invalid post update", details: parsed.error.flatten() });
    const post = updatePost(Number(req.params.id), parsed.data);
    return post ? res.json(post) : res.status(404).json({ error: "Post not found" });
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
