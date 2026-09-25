// The blog at /blog. Posts are written as HTML in the lead desk (/crm?tab=blog), cleaned on the
// server when saved (server/sanitize.ts), and server-rendered for crawlers (server/blog-render.ts).

export const blogCategories = ["Buying guides", "Facility design", "Operations", "Equipment explained", "Industry news"] as const;
export type BlogCategory = (typeof blogCategories)[number];

export type Post = {
  id: number;
  slug: string;
  title: string;
  /** Falls back to the title when empty. */
  metaTitle: string;
  /** Falls back to the excerpt when empty. */
  metaDescription: string;
  excerpt: string;
  /** Already sanitised. Never store or render anything that has not been through server/sanitize.ts. */
  bodyHtml: string;
  coverImage: string;
  coverAlt: string;
  category: BlogCategory;
  tags: string[];
  /** Catalogue ids from shared/site.ts, shown as product cards under the article. */
  relatedProducts: string[];
  author: string;
  /** "published" with a future publishAt is a scheduled post; see postState. */
  status: "draft" | "published";
  /** ISO timestamp. Set when the post is published or scheduled. */
  publishAt: string | null;
  createdAt: string;
  updatedAt: string;
  /** Slugs this post used to have. They 301 to the current slug so renamed posts keep their links. */
  previousSlugs: string[];
};

/** What the public site gets: nothing about drafts or history. */
export type PublicPost = Omit<Post, "status" | "previousSlugs" | "createdAt"> & { publishAt: string };
export type PostSummary = Omit<PublicPost, "bodyHtml"> & { readingMinutes: number };

export type PostState = "draft" | "scheduled" | "live";

export const postState = (post: Pick<Post, "status" | "publishAt">, now = Date.now()): PostState =>
  post.status === "draft" || !post.publishAt ? "draft" : Date.parse(post.publishAt) > now ? "scheduled" : "live";

export const isLive = (post: Post, now = Date.now()) => postState(post, now) === "live";

export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90)
    .replace(/-+$/, "");

export const categorySlug = (category: string) => slugify(category);

export const htmlToText = (html: string) =>
  html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

export const wordCount = (html: string) => {
  const text = htmlToText(html);
  return text ? text.split(" ").length : 0;
};

export const readingMinutes = (html: string) => Math.max(1, Math.round(wordCount(html) / 220));

/** The h2 headings of a post, for the "On this page" list. The sanitiser gives every h2 an id. */
export const postHeadings = (html: string) =>
  Array.from(html.matchAll(/<h2[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/gi)).map((match) => ({ id: match[1], text: htmlToText(match[2]) }));

export const toPublicPost = ({ status: _status, previousSlugs: _previous, createdAt: _created, ...post }: Post): PublicPost => ({ ...post, publishAt: post.publishAt ?? post.updatedAt });

export const toSummary = (post: Post): PostSummary => {
  const { bodyHtml, ...rest } = toPublicPost(post);
  return { ...rest, readingMinutes: readingMinutes(bodyHtml) };
};

export const formatPostDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

// Checks shown in the editor's SEO panel. They advise; they never block publishing.
export type PostCheck = { label: string; ok: boolean; hint?: string; severity: "seo" | "rule" };

const pricePattern = /(₹|\bRs\.?\s?\d|\bINR\b|\blakhs?\b|\bcrores?\b|\bprice[sd]? (?:at|from|starts?)\b)/i;
const claimPattern = /\b(cures?|cured|treats?|treatment for|heals?|healing|guaranteed results?|clinically proven|reverses?|prevents? (?:disease|cancer|ageing|aging))\b/i;

export function postChecks(post: Pick<Post, "title" | "metaTitle" | "metaDescription" | "excerpt" | "bodyHtml" | "coverImage" | "coverAlt" | "slug">): PostCheck[] {
  // Measure what is served: without a search title the page title is "<title> | AAAyan Immunotech".
  const title = (post.metaTitle || `${post.title} | AAAyan Immunotech`).trim();
  const description = (post.metaDescription || post.excerpt).trim();
  const words = wordCount(post.bodyHtml);
  const images = Array.from(post.bodyHtml.matchAll(/<img\b[^>]*>/gi)).map((match) => match[0]);
  const missingAlt = images.filter((tag) => !/\balt="[^"]+"/i.test(tag)).length;
  const text = `${post.title} ${post.excerpt} ${htmlToText(post.bodyHtml)}`;
  return [
    { label: `Search title is ${title.length} characters`, ok: title.length >= 30 && title.length <= 60, hint: "Aim for 30–60 so Google shows it in full. Write a shorter search title if the post title is long.", severity: "seo" },
    { label: `Meta description is ${description.length} characters`, ok: description.length >= 70 && description.length <= 160, hint: "Aim for 70–160.", severity: "seo" },
    { label: "Short URL slug", ok: Boolean(post.slug) && post.slug.length <= 60, hint: "Keep the slug under 60 characters, with the main keyword in it.", severity: "seo" },
    { label: "Cover image with alt text", ok: Boolean(post.coverImage) && Boolean(post.coverAlt.trim()), hint: "The cover is used for Google and link previews.", severity: "seo" },
    { label: `${words} words`, ok: words >= 600, hint: "Articles over 600 words tend to rank; 1,000+ for competitive topics.", severity: "seo" },
    { label: "Uses subheadings (h2)", ok: /<h2\b/i.test(post.bodyHtml), hint: "Break the article up with <h2> headings. The title is the page's only h1.", severity: "seo" },
    { label: missingAlt ? `${missingAlt} image${missingAlt > 1 ? "s" : ""} missing alt text` : "Every image has alt text", ok: missingAlt === 0, severity: "seo" },
    { label: "Links to a product, guide or equipment page", ok: /href="\/(products|equipment|guides|sectors)\//i.test(post.bodyHtml), hint: "Internal links pass ranking to the pages that sell.", severity: "seo" },
    { label: "No prices", ok: !pricePattern.test(text), hint: "Site rule: equipment is quote-on-request. Remove ₹ / Rs / lakh figures.", severity: "rule" },
    { label: "No therapeutic claims", ok: !claimPattern.test(text), hint: "Site rule: describe the equipment, never health outcomes (cure, treat, heal…).", severity: "rule" },
  ];
}
