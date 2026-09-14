import { jsonLd, metaTags, notFoundSeo, seoForPath, SITE } from "@shared/seo";

function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

// Mirrors server/index.ts: the server injects these tags on first load, this keeps them correct on client navigation.
export function applySeo(pathname: string) {
  const entry = seoForPath(pathname) ?? notFoundSeo;
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
}
