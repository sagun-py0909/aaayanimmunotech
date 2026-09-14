import express from "express";
import fs from "fs";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { headTags, legacyRedirects, notFoundSeo, robotsTxt, seoForPath, sitemapXml } from "../shared/seo";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  const template = fs.readFileSync(path.join(staticPath, "index.html"), "utf-8");
  const lastmod = new Date().toISOString().slice(0, 10);

  // 301 the legacy static-site URLs (and trailing slashes) so existing rankings and links carry over.
  app.use((req, res, next) => {
    const query = req.url.slice(req.path.length);
    const target = legacyRedirects[req.path];
    if (target) return res.redirect(301, target + query);
    if (req.path.length > 1 && req.path.endsWith("/")) return res.redirect(301, req.path.replace(/\/+$/, "") + query);
    next();
  });

  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(robotsTxt);
  });

  app.get("/sitemap.xml", (_req, res) => {
    res.type("application/xml").send(sitemapXml(lastmod));
  });

  app.use(express.static(staticPath, { index: false }));

  // Client-side routing: serve index.html with the route's title, meta, canonical and JSON-LD already in the head,
  // so crawlers and link previews do not depend on JavaScript running.
  app.get("*", (req, res) => {
    const entry = seoForPath(req.path);
    const html = template.replace(/<!-- SEO:START -->[\s\S]*?<!-- SEO:END -->/, () => `<!-- SEO:START -->\n    ${headTags(entry ?? notFoundSeo)}\n    <!-- SEO:END -->`);
    res.status(entry ? 200 : 404).type("html").send(html);
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
