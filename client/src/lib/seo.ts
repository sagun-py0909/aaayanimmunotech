import { jsonLd, metaTags, notFoundSeo, seoForPath, SITE, type SeoEntry } from "@shared/seo";

function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

// Mirrors server/app.ts: the server injects these tags on first load, this keeps them correct on client navigation.
// Blog routes depend on runtime data, so the blog pages call applySeoEntry themselves once a post has loaded.
export function applySeo(pathname: string) {
  if (pathname === "/blog" || pathname.startsWith("/blog/")) return;
  applySeoEntry(seoForPath(pathname) ?? notFoundSeo);
}

export function applySeoEntry(entry: SeoEntry) {
  document.title = entry.title;
  for (const tag of metaTags(entry)) {
    if (tag.name) upsertMeta("name", tag.name, tag.content);
    else if (tag.property) upsertMeta("property", tag.property, tag.content);
  }

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (entry.noindex) canonical?.remove();
  else {
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${SITE}${entry.path}`;
  }

  let script = document.getElementById("seo-jsonld");
  if (!entry.graph.length) script?.remove();
  else {
    if (!script) {
      script = document.createElement("script");
      script.id = "seo-jsonld";
      script.setAttribute("type", "application/ld+json");
      document.head.appendChild(script);
    }
    script.textContent = jsonLd(entry);
  }

  // Blog pages add their RSS link and article:* properties; drop them again on other routes.
  document.head.querySelectorAll('meta[property^="article:"], link[data-seo-extra], link[rel="alternate"][type="application/rss+xml"]').forEach((element) => element.remove());
  for (const tag of entry.extraMeta ?? []) {
    const element = document.createElement("meta");
    element.setAttribute("property", tag.property);
    element.setAttribute("content", tag.content);
    document.head.appendChild(element);
  }
  for (const link of entry.links ?? []) {
    const element = document.createElement("link");
    element.rel = link.rel;
    element.href = link.href;
    if (link.type) element.type = link.type;
    if (link.title) element.title = link.title;
    element.dataset.seoExtra = "";
    document.head.appendChild(element);
  }
}
