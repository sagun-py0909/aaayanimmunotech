import express from "express";
import { mountLeadDesk } from "./lead-desk-api";
import { headTags, legacyRedirects, notFoundSeo, robotsTxt, seoForPath, sitemapXml } from "../shared/seo";

type AppOptions = {
  /** The built index.html, containing the <!-- SEO:START --> / <!-- SEO:END --> markers. */
  template: string;
  /** Directory of built assets to serve. Omit when a CDN serves them (Vercel). */
  staticDir?: string;
};

export function createApp({ template, staticDir }: AppOptions) {
  const app = express();
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

  // The private lead desk. Mounted before the static files and the SPA catch-all.
  mountLeadDesk(app);

  app.get("/sitemap.xml", (_req, res) => {
    res.type("application/xml").send(sitemapXml(lastmod));
  });

  if (staticDir) app.use(express.static(staticDir, { index: false }));

  // Client-side routing: serve index.html with the route's title, meta, canonical and JSON-LD already in the head,
  // so crawlers and link previews do not depend on JavaScript running.
  app.get("*", (req, res) => {
    const entry = seoForPath(req.path);
    const html = template.replace(/<!-- SEO:START -->[\s\S]*?<!-- SEO:END -->/, () => `<!-- SEO:START -->\n    ${headTags(entry ?? notFoundSeo)}\n    <!-- SEO:END -->`);
    res.status(entry ? 200 : 404).type("html").send(html);
  });

  return app;
}
