import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OLD = "C:/Yugaas/Aaayam-ImmunoTech";
const OUT = "C:/Yugaas/aaayanimmunotech/shared/content.ts";

const equipment = ["hyperbaric-oxygen-chambers", "cryotherapy-chambers", "red-light-therapy", "cold-plunge", "compression-therapy"];
const guides = ["hbot-buying-guide", "cryotherapy-buying-guide", "red-light-therapy-buying-guide", "installation-requirements", "build-your-centre", "recovery-centre-setup-guide"];
const sectorFiles = { "sector_1.html": "clinical-medical", "sector_2.html": "gyms-spas-hotels", "sector_3.html": "sports-performance", "sector_4.html": "corporate-wellness", "sector_5.html": "personal-residential" };
const suitFiles = { "suit_product_1.html": "superhuman-suite", "suit_product_2.html": "longevity-suite", "suit_product_3.html": "recovery-suite", "product_page.html": "superhuman-suite" };

const modelPatterns = [
  [/Life Capsul L-1S|\bL-1S\b/i, "life-capsul-l1s"],
  [/Life Capsul L-2S|\bL-2S\b/i, "life-capsul-l2s"],
  [/OXYL-25/i, "oxyl-25"],
  [/CryoDuo Elite 6|CryoDuo 6/i, "cryoduo-6"],
  [/CryoDuo 4/i, "cryoduo-4"],
  [/Max Miracle 9600/i, "max-miracle-9600"],
  [/Miracle 6200/i, "miracle-6200"],
  [/Miracle 5040/i, "miracle-5040"],
  [/Superhuman Suite/i, "superhuman-suite"],
  [/Longevity Suite/i, "longevity-suite"],
  [/Recovery Suite/i, "recovery-suite"],
  [/cold plunge/i, "commercial-cold-plunge"],
  [/compression/i, "compression-therapy-system"],
];

const warnings = [];
const warn = (msg) => warnings.push(msg);

function linkMap(href) {
  if (/^(https?:|mailto:|tel:|\/)/.test(href)) return href;
  const [file, hash] = href.split("#");
  if (file === "index.html" || file === "") return hash && hash.startsWith("product/") ? `/products/${hash.slice(8)}` : "/";
  const base = file.replace(/\.html$/, "");
  if (equipment.includes(base)) return `/equipment/${base}`;
  if (guides.includes(base)) return `/guides/${base}`;
  if (sectorFiles[file]) return `/sectors/${sectorFiles[file]}`;
  if (suitFiles[file]) return `/products/${suitFiles[file]}`;
  if (file === "contact.html") return "/contact";
  if (file === "suits_page.html") return "/products";
  warn(`unmapped link: ${href}`);
  return href;
}

const ENT = { mdash: "—", ndash: "–", minus: "−", deg: "°", lambda: "λ", nbsp: " ", rarr: "→", larr: "←", times: "×", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", hellip: "…", le: "≤", ge: "≥", plusmn: "±", sup2: "²", sup3: "³", micro: "µ", middot: "·", asymp: "≈", bull: "•", trade: "™", reg: "®", copy: "©", eacute: "é", apos: "’", Phi: "Φ", phi: "φ", Delta: "Δ", Omega: "Ω", alpha: "α", beta: "β", lambda: "λ" };
const decodeNamed = (s) => s.replace(/&([a-z0-9]+);/gi, (m, n) => (ENT[n] !== undefined ? ENT[n] : m)).replace(/&#(\d+);/g, (m, d) => String.fromCodePoint(Number(d)));
const text = (s = "") => decodeNamed(s.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "")).replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const html = (s = "") => decodeNamed(s)
  .replace(/\s+/g, " ")
  .replace(/\s(class|style|target|rel|id|aria-[a-z]+)="[^"]*"/g, "")
  .replace(/href="([^"]*)"/g, (m, h) => `href="${linkMap(h)}"`)
  .replace(/<br\s*\/?>/gi, "<br />")
  .trim();

const one = (src, re, label, file) => {
  const m = src.match(re);
  if (!m) { warn(`${file}: missing ${label}`); return ""; }
  return m[1];
};

function faqsFrom(src) {
  const faqs = [];
  const walk = (node) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== "object") return;
    if (node["@type"] === "FAQPage" && Array.isArray(node.mainEntity)) {
      node.mainEntity.forEach((q) => faqs.push({ question: text(q.name), answer: text(q.acceptedAnswer && q.acceptedAnswer.text) }));
    }
    Object.values(node).forEach(walk);
  };
  for (const m of src.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { walk(JSON.parse(m[1])); } catch { warn("unparseable JSON-LD block"); }
  }
  return faqs.filter((f) => f.question && f.answer);
}

const head = (src, file) => ({
  metaTitle: text(one(src, /<title>([\s\S]*?)<\/title>/, "title", file)),
  metaDescription: text(one(src, /<meta name="description" content="([^"]*)"/, "description", file)),
});

const actionsFrom = (s) => [...s.matchAll(/<a href="([^"]*)" class="cp-btn[^"]*">([\s\S]*?)<\/a>/g)].map((m) => ({ label: text(m[2]), href: linkMap(m[1]) }));

function blocksFrom(body, file) {
  const blocks = [];
  const re = /<p>([\s\S]*?)<\/p>|<ul class="cp-list">([\s\S]*?)<\/ul>|<div class="cp-table-scroll">\s*<table class="cp-table">([\s\S]*?)<\/table>\s*<\/div>|<div class="cp-grid">((?:\s*<div class="cp-card">\s*<div class="cp-card-num">[\s\S]*?<\/div>[\s\S]*?<\/div>)+)\s*<\/div>/g;
  let leftover = body;
  for (const m of body.matchAll(re)) {
    leftover = leftover.replace(m[0], "");
    if (m[1] !== undefined) blocks.push({ type: "p", html: html(m[1]) });
    else if (m[2] !== undefined) blocks.push({ type: "list", items: [...m[2].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((li) => html(li[1])) });
    else if (m[3] !== undefined) {
      const caption = text((m[3].match(/<caption>([\s\S]*?)<\/caption>/) || [])[1]);
      const rows = [...m[3].matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((tr) => ({ isHead: /<th/.test(tr[1]), cells: [...tr[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g)].map((c) => html(c[1])) }));
      const headRow = rows.find((r) => r.isHead);
      blocks.push({ type: "table", caption, head: headRow ? headRow.cells : [], rows: rows.filter((r) => !r.isHead).map((r) => r.cells) });
    } else if (m[4] !== undefined) {
      const cards = [...m[4].matchAll(/<div class="cp-card">\s*<div class="cp-card-num">([\s\S]*?)<\/div>([\s\S]*?)<\/div>/g)].map((c) => {
        const link = c[2].match(/<a class="cp-card-link" href="([^"]*)">([\s\S]*?)<\/a>/);
        return { num: text(c[1]), title: text((c[2].match(/<h3>([\s\S]*?)<\/h3>/) || [])[1]), body: html((c[2].match(/<p>([\s\S]*?)<\/p>/) || [])[1] || ""), ...(link ? { link: { label: text(link[2]), href: linkMap(link[1]) } } : {}) };
      });
      blocks.push({ type: "cards", cards });
    }
  }
  if (text(leftover)) warn(`${file}: unparsed section content: ${text(leftover).slice(0, 120)}`);
  return blocks;
}

function contentPage(slug, kind) {
  const file = `${slug}.html`;
  const src = readFileSync(join(OLD, file), "utf8");
  const main = src.slice(src.indexOf('<main class="content-page">'), src.indexOf('<nav class="seo-directory"'));
  const hero = one(main, /<header class="cp-hero">([\s\S]*?)<\/header>/, "hero", file);
  const sections = [...main.matchAll(/<section class="cp-section">\s*<div class="cp-wrap">([\s\S]*?)<\/div>\s*<\/section>/g)].map((m) => {
    const body = m[1];
    const afterHeading = body.slice(body.indexOf("</h2>") + 5);
    return { tag: text(one(body, /<div class="cp-section-tag">([\s\S]*?)<\/div>/, "section tag", file)), headingHtml: html(one(body, /<h2>([\s\S]*?)<\/h2>/, "section h2", file)), blocks: blocksFrom(afterHeading, file) };
  });
  const ctaSrc = (main.match(/<section class="cp-cta">([\s\S]*?)<\/section>/) || [])[1];
  return {
    slug,
    kind,
    legacyPath: `/${file}`,
    ...head(src, file),
    breadcrumb: text(one(main, /<nav class="cp-breadcrumb"[^>]*>([\s\S]*?)<\/nav>/, "breadcrumb", file)).replace(/^Home\s*\/\s*/, ""),
    eyebrow: text(one(hero, /<div class="cp-eyebrow">([\s\S]*?)<\/div>/, "eyebrow", file)),
    headingHtml: html(one(hero, /<h1>([\s\S]*?)<\/h1>/, "h1", file)),
    ledes: [...hero.matchAll(/<p class="cp-lede">([\s\S]*?)<\/p>/g)].map((m) => html(m[1])),
    actions: actionsFrom(hero),
    sections,
    cta: ctaSrc ? { headingHtml: html(one(ctaSrc, /<h2>([\s\S]*?)<\/h2>/, "cta h2", file)), body: html(one(ctaSrc, /<p>([\s\S]*?)<\/p>/, "cta p", file)), actions: actionsFrom(ctaSrc) } : null,
    faqs: faqsFrom(src),
  };
}

function sectorPage(file, slug) {
  const src = readFileSync(join(OLD, file), "utf8");
  const features = [...src.matchAll(/<div class="feature-name">([\s\S]*?)<\/div>\s*<div class="feature-desc">([\s\S]*?)<\/div>/g)].map((m) => ({ name: text(m[1]), description: text(m[2]) }));
  const specsSection = one(src, /<section class="specs-section"[^>]*>([\s\S]*?)<\/section>/, "specs section", file);
  const firstSection = one(src, /<section class="section">([\s\S]*?)<\/section>/, "equipment section", file);
  const searchable = [text(one(src, /<p class="hero-desc">([\s\S]*?)<\/p>/, "hero desc", file)), ...features.map((f) => `${f.name} ${f.description}`)].join(" ");
  const recommended = [];
  for (const [re, id] of modelPatterns) if (re.test(searchable) && !recommended.includes(id)) recommended.push(id);
  return {
    slug,
    legacyPath: `/${file}`,
    ...head(src, file),
    heroTag: text(one(src, /<div class="hero-tag">([\s\S]*?)<\/div>/, "hero tag", file)),
    headingHtml: html(one(src, /<h1 class="hero-title">([\s\S]*?)<\/h1>/, "h1", file)),
    subtitle: text(one(src, /<p class="hero-subtitle">([\s\S]*?)<\/p>/, "subtitle", file)),
    description: text(one(src, /<p class="hero-desc">([\s\S]*?)<\/p>/, "hero desc", file)),
    stats: [...src.matchAll(/<div class="stat-num">([\s\S]*?)<span>([\s\S]*?)<\/span>\s*<\/div>\s*<div class="stat-label">([\s\S]*?)<\/div>/g)].map((m) => ({ value: text(m[1]), unit: text(m[2]), label: text(m[3]) })),
    equipmentTag: text(one(firstSection, /<div class="section-tag">([\s\S]*?)<\/div>/, "equipment tag", file)),
    equipmentHeadingHtml: html(one(firstSection, /<h2 class="section-title"[^>]*>([\s\S]*?)<\/h2>/, "equipment h2", file)),
    features,
    specsTag: text(one(specsSection, /<div class="section-tag">([\s\S]*?)<\/div>/, "specs tag", file)),
    specsHeadingHtml: html(one(specsSection, /<h2 class="section-title"[^>]*>([\s\S]*?)<\/h2>/, "specs h2", file)),
    specs: [...one(specsSection, /<table class="specs-table">([\s\S]*?)<\/table>/, "specs table", file).matchAll(/<tr>\s*<td>([\s\S]*?)<\/td>\s*<td>([\s\S]*?)<\/td>\s*<\/tr>/g)].map((m) => [text(m[1]), text(m[2])]),
    enquiry: {
      label: text(one(src, /<div class="contact-card-label">([\s\S]*?)<\/div>/, "contact label", file)),
      title: text(one(src, /<div class="contact-card-title">([\s\S]*?)<\/div>/, "contact title", file)),
      description: text(one(src, /<div class="contact-card-desc">([\s\S]*?)<\/div>/, "contact desc", file)),
      points: [...one(src, /<ul class="contact-details">([\s\S]*?)<\/ul>/, "contact list", file).matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => text(m[1])),
    },
    quote: text(one(src, /<p class="testimonial-text">([\s\S]*?)<\/p>/, "quote", file)),
    ctaHeadingHtml: html(one(src, /<h2 class="cta-title">([\s\S]*?)<\/h2>/, "cta title", file)),
    ctaBody: text(one(src, /<p class="cta-desc">([\s\S]*?)<\/p>/, "cta desc", file)),
    recommended,
    faqs: faqsFrom(src),
  };
}

const pages = [...equipment.map((slug) => contentPage(slug, "equipment")), ...guides.map((slug) => contentPage(slug, "guide"))];
const sectors = Object.entries(sectorFiles).map(([file, slug]) => sectorPage(file, slug));

for (const p of [...pages, ...sectors]) {
  const leftovers = JSON.stringify(p).match(/&[a-z]+;/gi);
  if (leftovers) warn(`${p.slug}: undecoded entities ${[...new Set(leftovers)].join(" ")}`);
}

const out = `// Copy ported from the keyword-mapped pages of the legacy static site (see SEO/keyword-map.md in the
// Aaayam-ImmunoTech repo). Page content describes equipment, specification, cost and installation only —
// no therapeutic or outcome claims.
import type { ContentPage, SectorContent } from "./content-types";

export const contentPages: ContentPage[] = ${JSON.stringify(pages, null, 2)};

export const sectorContent: SectorContent[] = ${JSON.stringify(sectors, null, 2)};
`;
writeFileSync(OUT, out);
console.log(`pages: ${pages.length} (${pages.map((p) => `${p.slug}:${p.sections.length}s/${p.faqs.length}faq`).join(", ")})`);
console.log(`sectors: ${sectors.length} (${sectors.map((s) => `${s.slug}:${s.features.length}f/${s.specs.length}spec/${s.faqs.length}faq/[${s.recommended.join(",")}]`).join(", ")})`);
console.log(warnings.length ? `WARNINGS:\n${warnings.join("\n")}` : "no warnings");
