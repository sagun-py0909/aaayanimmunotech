import express from "express";
import { isLive, toPublicPost, toSummary } from "../shared/blog";
import { blogIndexSeo, blogPostSeo, blogRss, headTags, legacyRedirects, notFoundSeo, robotsTxt, seoForPath, sitemapXml, type SeoEntry } from "../shared/seo";
import { livePosts, mountBlogApi } from "./blog-api";
import { blogDataScript, renderBlogIndex, renderBlogPost } from "./blog-render";
import { hasSession, mountLeadDesk } from "./lead-desk-api";
import { findPostBySlug } from "./store";
import { uploadDirectory } from "./uploads";

type AppOptions = {
  /** The built index.html, containing the <!-- SEO:START --> / <!-- SEO:END --> markers. */
  template: string;
  /** Directory of built assets to serve. Omit when a CDN serves them (Vercel). */
  staticDir?: string;
};

export function createApp({ template, staticDir }: AppOptions) {
  const app = express();
  const lastmod = new Date().toISOString().slice(0, 10);

  // index.html with the route's title, meta, canonical and JSON-LD already in the head, and optionally
  // server-rendered content in #root, so crawlers and link previews do not depend on JavaScript running.
  const page = (entry: SeoEntry, body = "", data?: unknown) =>
    template
      .replace(/<!-- SEO:START -->[\s\S]*?<!-- SEO:END -->/, () => `<!-- SEO:START -->\n    ${headTags(entry)}\n    <!-- SEO:END -->`)
      .replace('<div id="root"></div>', () => `<div id="root">${body}</div>${data === undefined ? "" : blogDataScript(data)}`);

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

  // Blog images. Names are random, so they can be cached for good.
  app.use("/uploads", express.static(uploadDirectory, { index: false, dotfiles: "deny", immutable: true, maxAge: "365d", fallthrough: false, setHeaders: (res) => res.setHeader("X-Content-Type-Options", "nosniff") }));

  // The blog editor and public blog API, then the private lead desk. Both before the static files and the SPA catch-all.
  mountBlogApi(app);
  mountLeadDesk(app);

  app.get("/sitemap.xml", (_req, res) => {
    res.type("application/xml").send(sitemapXml(lastmod, livePosts().map(toSummary)));
  });

  app.get("/blog/rss.xml", (_req, res) => {
    res.type("application/rss+xml").send(blogRss(livePosts().map(toSummary)));
  });

  if (staticDir) app.use(express.static(staticDir, { index: false }));

  app.get("/blog", (_req, res) => {
    const posts = livePosts().map(toSummary);
    res.type("html").send(page(blogIndexSeo(posts), renderBlogIndex(posts), { posts }));
  });

  app.get("/blog/:slug", (req, res) => {
    const found = findPostBySlug(req.params.slug);
    const query = req.url.slice(req.path.length);
    if (found && isLive(found.post)) {
      if (found.moved) return res.redirect(301, `/blog/${found.post.slug}${query}`);
      const post = toPublicPost(found.post);
      return res.type("html").send(page(blogPostSeo(post), renderBlogPost(post), { post }));
    }
    // Signed in to the desk: drafts and scheduled posts can be previewed on the real page, never indexed.
    if (found && !found.moved && hasSession(req)) {
      const post = toPublicPost({ ...found.post, publishAt: found.post.publishAt ?? new Date().toISOString() });
      res.setHeader("X-Robots-Tag", "noindex");
      return res.type("html").send(page(blogPostSeo(post, { noindex: true }), renderBlogPost(post), { post, preview: true }));
    }
    return res.status(404).type("html").send(page(notFoundSeo));
  });

  // Client-side routing for everything else.
  app.get("*", (req, res) => {
    const entry = seoForPath(req.path);
    res.status(entry ? 200 : 404).type("html").send(page(entry ?? notFoundSeo));
  });

  return app;
}
