import { catalogue, categories, contact, equipmentPages, guideLabels, guides, plainText, productsForLegacyCategory, sectors, type Product } from "./site";
import type { Faq } from "./content-types";
import { categorySlug, htmlToText, wordCount, type PostSummary, type PublicPost } from "./blog";

// Production host is the apex domain — www and http both 301 to it, so every canonical must match.
export const SITE = "https://aaayanimmunotech.co.in";
export const BRAND = "AAAyan Immunotech";
const DEFAULT_IMAGE = `${SITE}/images/og-default.png`;

export type SeoEntry = {
  path: string;
  title: string;
  description: string;
  ogType: "website" | "product" | "article";
  noindex?: boolean;
  changefreq: "weekly" | "monthly";
  priority: number;
  graph: Record<string, unknown>[];
  /** Absolute URL for og:image / twitter:image. Defaults to the site image. */
  image?: string;
  imageAlt?: string;
  /** Extra Open Graph properties, e.g. article:published_time. */
  extraMeta?: { property: string; content: string }[];
  /** Extra <link> tags, e.g. the blog's RSS feed. */
  links?: { rel: string; href: string; type?: string; title?: string }[];
};

type Node = Record<string, unknown>;

// Telephone and street address are omitted on purpose: the current values are placeholders, and a wrong
// NAP in structured data suppresses local ranking. Add them here once the real details are confirmed.
const ORGANIZATION: Node = {
  "@type": "Organization",
  "@id": `${SITE}/#organization`,
  name: BRAND,
  alternateName: "AAAyan",
  url: `${SITE}/`,
  logo: { "@type": "ImageObject", url: `${SITE}/images/aaayan-logo-with-name.svg`, caption: BRAND },
  description: "Supplier and turnkey installer of wellness and recovery equipment — hyperbaric oxygen chambers, whole-body cryotherapy chambers and red light therapy (photobiomodulation) systems.",
  email: contact.email,
  address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressRegion: "Telangana", addressCountry: "IN" },
  areaServed: [{ "@type": "Country", name: "India" }],
  knowsAbout: ["Hyperbaric oxygen therapy chambers", "Whole body cryotherapy chambers", "Red light therapy beds", "Photobiomodulation systems", "Wellness centre design and installation"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: contact.email,
    areaServed: "IN",
    availableLanguage: ["en"],
    hoursAvailable: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
  },
};

const WEBSITE: Node = { "@type": "WebSite", "@id": `${SITE}/#website`, url: `${SITE}/`, name: BRAND, publisher: { "@id": `${SITE}/#organization` }, inLanguage: "en-IN" };

const INSTALL_SERVICE: Node = {
  "@type": "Service",
  "@id": `${SITE}/#installation-service`,
  serviceType: "Wellness equipment supply, installation and commissioning",
  provider: { "@id": `${SITE}/#organization` },
  areaServed: [{ "@type": "Country", name: "India" }],
  description: "End-to-end supply and installation of wellness recovery equipment: site survey, civil and electrical coordination, delivery, commissioning, operator training and service support.",
  hasOfferCatalog: { "@type": "OfferCatalog", name: "Wellness equipment categories", itemListElement: categories.map((category) => ({ "@type": "OfferCatalog", name: category.label, url: `${SITE}/products/${category.slug}` })) },
};

const breadcrumb = (trail: [string, string][]): Node => ({
  "@type": "BreadcrumbList",
  itemListElement: trail.map(([name, path], index) => ({ "@type": "ListItem", position: index + 1, name, item: `${SITE}${path}` })),
});

const webPage = (type: string, path: string, name: string, extra: Node = {}): Node => ({ "@type": type, "@id": `${SITE}${path}#webpage`, url: `${SITE}${path}`, name, isPartOf: { "@id": `${SITE}/#website` }, inLanguage: "en-IN", ...extra });

const faqPage = (faqs: Faq[]): Node[] => faqs.length ? [{ "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }] : [];

const itemList = (name: string, products: Product[]): Node => ({ "@type": "ItemList", name, itemListElement: products.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, url: `${SITE}/products/${item.id}` })) });

const clamp = (value: string, max = 158) => {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.lastIndexOf(" ", max);
  return `${clean.slice(0, cut > 0 ? cut : max).replace(/[,;:.]$/, "")}…`;
};

// Titles for the three suites keep the keyword targeting from SEO/keyword-map.md.
const productTitles: Record<string, string> = {
  "superhuman-suite": "Full Body Red Light Therapy Bed | Superhuman Suite",
  "longevity-suite": "Photobiomodulation Bed India | Longevity Suite",
  "recovery-suite": "PBM Bed for Sports Team | Recovery Suite",
};

function buildEntries(): SeoEntry[] {
  const entries: SeoEntry[] = [
    {
      path: "/",
      title: `Wellness Equipment Supplier India | ${BRAND}`,
      description: "Wellness equipment supplier in India. Hyperbaric oxygen chambers, whole body cryotherapy chambers and commercial red light therapy beds. Request pricing.",
      ogType: "website",
      changefreq: "weekly",
      priority: 1,
      graph: [ORGANIZATION, WEBSITE, INSTALL_SERVICE, webPage("WebPage", "/", `Wellness Equipment Supplier India | ${BRAND}`, { about: { "@id": `${SITE}/#organization` } })],
    },
    {
      path: "/products",
      title: "Wellness Equipment Supplier India | Product Range",
      description: "The full AAAyan Immunotech range: hyperbaric oxygen chambers, whole body cryotherapy chambers and commercial photobiomodulation beds supplied across India.",
      ogType: "website",
      changefreq: "weekly",
      priority: 0.9,
      graph: [webPage("CollectionPage", "/products", "Product Range"), itemList("AAAyan Immunotech product range", catalogue), breadcrumb([["Home", "/"], ["Product Range", "/products"]])],
    },
  ];

  for (const page of equipmentPages) {
    const path = `/equipment/${page.slug}`;
    const products = productsForLegacyCategory(page.slug);
    entries.push({
      path,
      title: page.metaTitle,
      description: page.metaDescription,
      ogType: "website",
      changefreq: "monthly",
      priority: 0.9,
      graph: [webPage("CollectionPage", path, page.metaTitle), ...(products.length ? [itemList(page.breadcrumb, products)] : []), ...faqPage(page.faqs), breadcrumb([["Home", "/"], ["Equipment", "/products"], [page.breadcrumb, path]])],
    });
  }

  for (const item of catalogue) {
    const path = `/products/${item.id}`;
    entries.push({
      path,
      title: productTitles[item.id] ?? `${item.name} — ${item.type} | ${BRAND}`,
      description: clamp(`${item.description} Supplied, installed and serviced by AAAyan Immunotech. Request a quotation.`),
      ogType: "product",
      changefreq: "monthly",
      priority: 0.8,
      // No `offers`: pricing is quote-on-request, and a placeholder price would violate structured-data policy.
      graph: [
        {
          "@type": "Product",
          "@id": `${SITE}${path}#product`,
          name: item.name,
          description: item.description,
          category: item.type,
          image: item.images.map((image) => `${SITE}${image}`),
          brand: { "@type": "Brand", name: BRAND },
          url: `${SITE}${path}`,
          additionalProperty: item.specs.map(([name, value]) => ({ "@type": "PropertyValue", name, value })),
          isRelatedTo: { "@id": `${SITE}/#installation-service` },
        },
        breadcrumb([["Home", "/"], ["Product Range", "/products"], [item.name, path]]),
      ],
    });
  }

  entries.push({
    path: "/sectors",
    title: `Sectors We Install In: Clinical, Commercial & Corporate | ${BRAND}`,
    description: "Wellness infrastructure for medical clinics, hotels and spas, sports facilities, corporate campuses and private residences. Site survey to staff training, end to end.",
    ogType: "website",
    changefreq: "monthly",
    priority: 0.8,
    graph: [webPage("CollectionPage", "/sectors", "Sectors"), breadcrumb([["Home", "/"], ["Sectors", "/sectors"]])],
  });

  for (const sector of sectors) {
    const path = `/sectors/${sector.slug}`;
    entries.push({
      path,
      title: sector.metaTitle,
      description: sector.metaDescription,
      ogType: "website",
      changefreq: "monthly",
      priority: 0.8,
      graph: [
        { "@type": "Service", "@id": `${SITE}${path}#service`, serviceType: sector.title, name: `${sector.title} equipment supply and installation`, provider: { "@id": `${SITE}/#organization` }, areaServed: [{ "@type": "Country", name: "India" }], description: sector.metaDescription },
        ...faqPage(sector.faqs),
        breadcrumb([["Home", "/"], ["Sectors", "/sectors"], [sector.title, path]]),
      ],
    });
  }

  entries.push({
    path: "/guides",
    title: `Wellness Equipment Buying Guides India | ${BRAND}`,
    description: "Cost guides for HBOT, cryotherapy and red light therapy equipment, chamber installation requirements, and how to set up a wellness or recovery centre in India.",
    ogType: "website",
    changefreq: "monthly",
    priority: 0.7,
    graph: [webPage("CollectionPage", "/guides", "Buying guides"), breadcrumb([["Home", "/"], ["Guides", "/guides"]])],
  });

  for (const page of guides) {
    const path = `/guides/${page.slug}`;
    entries.push({
      path,
      title: page.metaTitle,
      description: page.metaDescription,
      ogType: "article",
      changefreq: "monthly",
      priority: 0.8,
      graph: [webPage("WebPage", path, plainText(page.headingHtml)), ...faqPage(page.faqs), breadcrumb([["Home", "/"], ["Guides", "/guides"], [guideLabels[page.slug] ?? page.breadcrumb, path]])],
    });
  }

  entries.push(
    {
      path: "/support",
      title: `Installation, Commissioning & Service Support | ${BRAND}`,
      description: "Site survey, installation, commissioning, operator training and service contracts for hyperbaric, cryotherapy and red light therapy equipment across India.",
      ogType: "website",
      changefreq: "monthly",
      priority: 0.6,
      graph: [webPage("WebPage", "/support", "Support"), breadcrumb([["Home", "/"], ["Support", "/support"]])],
    },
    {
      path: "/contact",
      title: "Wellness Equipment Supplier Hyderabad | Contact AAAyan",
      description: "Contact AAAyan Immunotech, wellness equipment supplier in Hyderabad. Hyperbaric, cryotherapy and red light therapy bed enquiries across India.",
      ogType: "website",
      changefreq: "monthly",
      priority: 0.7,
      graph: [ORGANIZATION, webPage("ContactPage", "/contact", "Contact & Request a Quote", { about: { "@id": `${SITE}/#organization` } }), breadcrumb([["Home", "/"], ["Contact", "/contact"]])],
    },
  );

  // The private lead desk: served like any other route, but never indexed and never in the sitemap.
  for (const [path, title] of [["/login", "Lead desk sign in"], ["/crm", "Lead desk"]] as const) {
    entries.push({ path, title: `${title} | ${BRAND}`, description: "Private workspace.", ogType: "website", noindex: true, changefreq: "monthly", priority: 0, graph: [] });
  }

  return entries;
}

export const seoEntries = buildEntries();
const byPath = new Map(seoEntries.map((entry) => [entry.path, entry]));

export const notFoundSeo: SeoEntry = { path: "", title: `Page not found | ${BRAND}`, description: "The page you were looking for could not be found.", ogType: "website", noindex: true, changefreq: "monthly", priority: 0, graph: [] };

export const normalisePath = (pathname: string) => (pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname);

export const seoForPath = (pathname: string) => byPath.get(normalisePath(pathname));

// Every URL the legacy static site had indexed, mapped to its new home, so rankings carry over via 301.
export const legacyRedirects: Record<string, string> = {
  "/index.html": "/",
  "/suits_page.html": "/products",
  // The legacy suit pages were all red light / PBM beds, so they land on that modality.
  "/suit_product_1.html": "/products/red-light-pbm-therapy-beds",
  "/suit_product_2.html": "/products/red-light-pbm-therapy-beds",
  "/suit_product_3.html": "/products/red-light-pbm-therapy-beds",
  "/product_page.html": "/products/red-light-pbm-therapy-beds",
  "/contact.html": "/contact",
  "/blogs": "/blog",
  // The 13 model pages the redesign carried before the catalogue moved to modalities.
  ...Object.fromEntries(Object.entries({
    "oxyl-25": "hyperbaric-oxygen-hbot",
    "life-capsul-l1s": "hyperbaric-oxygen-hbot",
    "life-capsul-l2s": "hyperbaric-oxygen-hbot",
    "cryoduo-4": "whole-body-cryotherapy-chambers",
    "cryoduo-6": "whole-body-cryotherapy-chambers",
    "max-miracle-9600": "red-light-pbm-therapy-beds",
    "miracle-6200": "red-light-pbm-therapy-beds",
    "miracle-5040": "red-light-pbm-therapy-beds",
    "superhuman-suite": "red-light-pbm-therapy-beds",
    "longevity-suite": "red-light-pbm-therapy-beds",
    "recovery-suite": "red-light-pbm-therapy-beds",
    "commercial-cold-plunge": "whole-body-cryotherapy-chambers",
    "compression-therapy-system": "pemf",
  }).map(([from, to]) => [`/products/${from}`, `/products/${to}`])),
  ...Object.fromEntries(equipmentPages.map((page) => [page.legacyPath, `/equipment/${page.slug}`])),
  ...Object.fromEntries(guides.map((page) => [page.legacyPath, `/guides/${page.slug}`])),
  ...Object.fromEntries(sectors.map((sector) => [sector.legacyPath, `/sectors/${sector.slug}`])),
};

const escapeAttr = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const jsonLd = (entry: SeoEntry) => JSON.stringify({ "@context": "https://schema.org", "@graph": entry.graph }).replace(/</g, "\\u003c");

export const robotsContent = (entry: SeoEntry) => (entry.noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");

export function metaTags(entry: SeoEntry): { name?: string; property?: string; content: string }[] {
  const url = `${SITE}${entry.path}`;
  return [
    { name: "description", content: entry.description },
    { name: "robots", content: robotsContent(entry) },
    { property: "og:site_name", content: BRAND },
    { property: "og:type", content: entry.ogType },
    { property: "og:title", content: entry.title },
    { property: "og:description", content: entry.description },
    { property: "og:url", content: url },
    { property: "og:image", content: entry.image ?? DEFAULT_IMAGE },
    { property: "og:image:alt", content: entry.imageAlt || entry.title },
    { property: "og:locale", content: "en_IN" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: entry.title },
    { name: "twitter:description", content: entry.description },
    { name: "twitter:image", content: entry.image ?? DEFAULT_IMAGE },
    ...(entry.extraMeta ?? []),
  ];
}

export function headTags(entry: SeoEntry): string {
  const lines = [
    `<title>${escapeAttr(entry.title)}</title>`,
    ...metaTags(entry).map((tag) => `<meta ${tag.name ? `name="${tag.name}"` : `property="${tag.property}"`} content="${escapeAttr(tag.content)}" />`),
    ...(entry.noindex ? [] : [`<link rel="canonical" href="${SITE}${entry.path}" />`]),
    ...(entry.links ?? []).map((link) => `<link rel="${link.rel}" href="${escapeAttr(link.href)}"${link.type ? ` type="${link.type}"` : ""}${link.title ? ` title="${escapeAttr(link.title)}"` : ""} />`),
    ...(entry.graph.length ? [`<script type="application/ld+json" id="seo-jsonld">${jsonLd(entry)}</script>`] : []),
  ];
  return lines.join("\n    ");
}

// Built per request: blog posts are runtime data, and scheduled posts join the sitemap when they go live.
export function sitemapXml(lastmod: string, posts: PostSummary[] = []): string {
  const url = (path: string, modified: string, changefreq: string, priority: number) => `  <url>\n    <loc>${SITE}${path}</loc>\n    <lastmod>${modified}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority.toFixed(1)}</priority>\n  </url>`;
  const urls = [
    ...seoEntries.filter((entry) => !entry.noindex).map((entry) => url(entry.path, lastmod, entry.changefreq, entry.priority)),
    url("/blog", posts[0]?.updatedAt.slice(0, 10) ?? lastmod, "weekly", 0.7),
    ...posts.map((post) => url(`/blog/${post.slug}`, post.updatedAt.slice(0, 10), "monthly", 0.6)),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

export const robotsTxt = `# robots.txt — ${BRAND}
# Wellness equipment supply & turnkey installation
# ${SITE}

User-agent: *
Allow: /
Disallow: /crm
Disallow: /login
Disallow: /api/

# AI / LLM crawlers — allowed by default.
# Switch Allow to Disallow if the brand does not want its catalogue used for model training.
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;

// ---- Blog ------------------------------------------------------------------------------------

export const BLOG_RSS = `${SITE}/blog/rss.xml`;
const rssLink = { rel: "alternate", type: "application/rss+xml", title: `${BRAND} blog`, href: BLOG_RSS };
const absolute = (url: string) => (/^https?:\/\//.test(url) ? url : `${SITE}${url.startsWith("/") ? "" : "/"}${url}`);

export function blogIndexSeo(posts: PostSummary[]): SeoEntry {
  return {
    path: "/blog",
    title: `Wellness Equipment Blog India | ${BRAND}`,
    description: "Articles from a wellness equipment supplier in India: specifying, installing and running hyperbaric, cryotherapy, red light, float and PEMF rooms.",
    ogType: "website",
    changefreq: "weekly",
    priority: 0.7,
    links: [rssLink],
    graph: [
      webPage("CollectionPage", "/blog", "Blog", { about: { "@id": `${SITE}/#organization` } }),
      { "@type": "Blog", "@id": `${SITE}/blog#blog`, url: `${SITE}/blog`, name: `${BRAND} blog`, publisher: { "@id": `${SITE}/#organization` }, inLanguage: "en-IN", blogPost: posts.slice(0, 20).map((post) => ({ "@id": `${SITE}/blog/${post.slug}#article` })) },
      breadcrumb([["Home", "/"], ["Blog", "/blog"]]),
    ],
  };
}

export function blogPostSeo(post: PublicPost, { noindex = false } = {}): SeoEntry {
  const path = `/blog/${post.slug}`;
  const image = post.coverImage ? absolute(post.coverImage) : undefined;
  const description = clamp(post.metaDescription || post.excerpt || htmlToText(post.bodyHtml), 160);
  return {
    path,
    title: post.metaTitle || `${post.title} | ${BRAND}`,
    description,
    ogType: "article",
    noindex,
    changefreq: "monthly",
    priority: 0.6,
    image,
    imageAlt: post.coverAlt,
    links: [rssLink],
    extraMeta: [
      { property: "article:published_time", content: post.publishAt },
      { property: "article:modified_time", content: post.updatedAt },
      { property: "article:section", content: post.category },
      ...post.tags.map((tag) => ({ property: "article:tag", content: tag })),
    ],
    graph: [
      ORGANIZATION,
      webPage("WebPage", path, post.title, image ? { primaryImageOfPage: { "@type": "ImageObject", url: image } } : {}),
      {
        "@type": "BlogPosting",
        "@id": `${SITE}${path}#article`,
        headline: post.title.slice(0, 110),
        description,
        ...(image ? { image: [image] } : {}),
        datePublished: post.publishAt,
        dateModified: post.updatedAt,
        author: post.author && post.author !== BRAND ? { "@type": "Person", name: post.author } : { "@id": `${SITE}/#organization` },
        publisher: { "@id": `${SITE}/#organization` },
        mainEntityOfPage: { "@id": `${SITE}${path}#webpage` },
        isPartOf: { "@id": `${SITE}/blog#blog` },
        articleSection: post.category,
        ...(post.tags.length ? { keywords: post.tags.join(", ") } : {}),
        wordCount: wordCount(post.bodyHtml),
        inLanguage: "en-IN",
      },
      breadcrumb([["Home", "/"], ["Blog", "/blog"], [post.title, path]]),
    ],
  };
}

export const blogCategoryPath = (category: string) => `/blog?category=${categorySlug(category)}`;

const xmlEscape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function blogRss(posts: PostSummary[]): string {
  const items = posts.slice(0, 30).map((post) => `    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${SITE}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishAt).toUTCString()}</pubDate>
      <category>${xmlEscape(post.category)}</category>
      <description>${xmlEscape(post.metaDescription || post.excerpt)}</description>
    </item>`);
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(`${BRAND} blog`)}</title>
    <link>${SITE}/blog</link>
    <atom:link href="${BLOG_RSS}" rel="self" type="application/rss+xml" />
    <description>Articles from a wellness equipment supplier in India.</description>
    <language>en-IN</language>
${items.join("\n")}
  </channel>
</rss>
`;
}
