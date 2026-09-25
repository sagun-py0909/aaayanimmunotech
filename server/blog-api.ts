// The blog's API. /api/desk/* is the editor inside the lead desk (session required);
// /api/blog/* is what the public site reads, and only ever returns live posts.
import express from "express";
import { isLive, postState, toPublicPost, toSummary, type Post } from "../shared/blog";
import { requireSession } from "./lead-desk-api";
import { sanitizePostHtml } from "./sanitize";
import { createPost, deletePost, findPost, findPostBySlug, listPosts, postInputSchema, SlugTakenError, updatePost, type PostInput } from "./store";
import { deleteUpload, listUploads, saveUpload, uploadLimitBytes, UploadRejectedError } from "./uploads";

/** Live posts, newest first. Scheduled posts appear on their own once publishAt passes. */
export const livePosts = (now = Date.now()) =>
  listPosts()
    .filter((post) => isLive(post, now))
    .sort((a, b) => Date.parse(b.publishAt!) - Date.parse(a.publishAt!));

// Publishing needs the parts a reader and Google see; a draft can be anything with a title.
function publishProblems(input: PostInput) {
  if (input.status !== "published") return [];
  return [
    !input.excerpt && "Add an excerpt before publishing.",
    !input.bodyHtml.trim() && "The article body is empty.",
    !input.publishAt && "Choose when to publish.",
  ].filter(Boolean) as string[];
}

function parsePost(body: unknown): { input: PostInput } | { error: string; details?: unknown } {
  const parsed = postInputSchema.safeParse(body);
  if (!parsed.success) return { error: "Invalid post", details: parsed.error.flatten() };
  const input = { ...parsed.data, bodyHtml: sanitizePostHtml(parsed.data.bodyHtml) };
  const problems = publishProblems(input);
  return problems.length ? { error: problems[0] } : { input };
}

const withState = (post: Post) => ({ ...post, state: postState(post) });

export function mountBlogApi(app: express.Express) {
  // Articles are larger than leads, so the desk gets its own body limit, checked after the session.
  app.use("/api/desk", requireSession, express.json({ limit: "1mb" }));

  app.get("/api/desk/posts", (_req, res) => res.json({ posts: listPosts().map(withState) }));

  app.get("/api/desk/posts/:id", (req, res) => {
    const post = findPost(Number(req.params.id));
    return post ? res.json(withState(post)) : res.status(404).json({ error: "Post not found" });
  });

  app.post("/api/desk/posts", (req, res) => {
    const result = parsePost(req.body);
    if ("error" in result) return res.status(400).json(result);
    try {
      return res.status(201).json(withState(createPost(result.input)));
    } catch (error) {
      if (error instanceof SlugTakenError) return res.status(409).json({ error: "Another post already uses that URL slug." });
      throw error;
    }
  });

  app.put("/api/desk/posts/:id", (req, res) => {
    const result = parsePost(req.body);
    if ("error" in result) return res.status(400).json(result);
    try {
      const post = updatePost(Number(req.params.id), result.input);
      return post ? res.json(withState(post)) : res.status(404).json({ error: "Post not found" });
    } catch (error) {
      if (error instanceof SlugTakenError) return res.status(409).json({ error: "Another post already uses that URL slug." });
      throw error;
    }
  });

  app.delete("/api/desk/posts/:id", (req, res) => (deletePost(Number(req.params.id)) ? res.status(204).end() : res.status(404).json({ error: "Post not found" })));

  // The editor's live preview, cleaned by exactly the code that cleans a save.
  app.post("/api/desk/preview", (req, res) => {
    const html = typeof req.body?.html === "string" ? req.body.html.slice(0, 300_000) : "";
    return res.json({ html: sanitizePostHtml(html) });
  });

  app.get("/api/desk/uploads", (_req, res) => res.json({ uploads: listUploads() }));

  app.post("/api/desk/uploads", express.raw({ type: "image/*", limit: uploadLimitBytes }), (req, res) => {
    if (!Buffer.isBuffer(req.body) || !req.body.length) return res.status(400).json({ error: "Send the image as the request body." });
    const name = decodeURIComponent(String(req.headers["x-file-name"] || "image"));
    try {
      return res.status(201).json(saveUpload(req.body, name));
    } catch (error) {
      if (error instanceof UploadRejectedError) return res.status(415).json({ error: error.message });
      throw error;
    }
  });

  app.delete("/api/desk/uploads/:name", (req, res) => {
    const url = `/uploads/${req.params.name}`;
    const usedBy = listPosts().filter((post) => post.coverImage === url || post.bodyHtml.includes(url));
    if (usedBy.length) return res.status(409).json({ error: `Used by “${usedBy[0].title}”${usedBy.length > 1 ? ` and ${usedBy.length - 1} more` : ""}. Remove it from the post first.` });
    return deleteUpload(req.params.name) ? res.status(204).end() : res.status(404).json({ error: "Image not found" });
  });

  app.get("/api/blog", (_req, res) => res.json({ posts: livePosts().map(toSummary) }));

  app.get("/api/blog/:slug", (req, res) => {
    const found = findPostBySlug(req.params.slug);
    if (!found || !isLive(found.post)) return res.status(404).json({ error: "Post not found" });
    if (found.moved) return res.json({ redirect: `/blog/${found.post.slug}` });
    return res.json({ post: toPublicPost(found.post) });
  });
}
