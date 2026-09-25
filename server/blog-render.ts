// Plain HTML for the blog, placed inside #root on the first response so crawlers read the whole
// article without running JavaScript. React replaces it on load with the styled page
// (client/src/pages/Blog.tsx); `.blog-ssr` in index.css keeps it readable until then.
import { formatPostDate, readingMinutes, type PostSummary, type PublicPost } from "../shared/blog";

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Data handed to the client so the page renders without fetching it again. `<` is escaped so it cannot close the script. */
export const blogDataScript = (data: unknown) => `<script id="blog-data" type="application/json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

const nav = `<nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/blog">Blog</a></nav>`;

export function renderBlogIndex(posts: PostSummary[]) {
  const items = posts
    .map((post) => `<li><article><a href="/blog/${post.slug}"><h2>${escapeHtml(post.title)}</h2></a><p><span>${escapeHtml(post.category)}</span> · <time datetime="${post.publishAt}">${formatPostDate(post.publishAt)}</time></p><p>${escapeHtml(post.excerpt)}</p></article></li>`)
    .join("");
  return `<main class="blog-ssr">${nav}<h1>Wellness equipment blog</h1><p>Articles from a wellness equipment supplier in India.</p>${items ? `<ul>${items}</ul>` : "<p>The first articles are on their way.</p>"}</main>`;
}

export function renderBlogPost(post: PublicPost) {
  const cover = post.coverImage ? `<img src="${escapeHtml(post.coverImage)}" alt="${escapeHtml(post.coverAlt)}" />` : "";
  return `<main class="blog-ssr"><article>${nav}<p>${escapeHtml(post.category)}</p><h1>${escapeHtml(post.title)}</h1><p>${escapeHtml(post.excerpt)}</p><p>${escapeHtml(post.author)} · <time datetime="${post.publishAt}">${formatPostDate(post.publishAt)}</time> · ${readingMinutes(post.bodyHtml)} min read</p>${cover}<div class="blog-prose">${post.bodyHtml}</div></article><p><a href="/contact">Request a quotation</a></p></main>`;
}
