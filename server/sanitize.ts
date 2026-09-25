// Cleans the HTML the owner writes in the blog editor. Runs on every save, so what is stored is
// already safe to render: no scripts, styles, event handlers or javascript: links, whoever holds
// the desk session.
import sanitizeHtml from "sanitize-html";
import { htmlToText, slugify } from "../shared/blog";

const videoHosts = ["www.youtube.com", "youtube.com", "www.youtube-nocookie.com", "player.vimeo.com"];

const options: sanitizeHtml.IOptions = {
  allowedTags: [
    "h2", "h3", "h4", "h5", "p", "br", "hr",
    "strong", "b", "em", "i", "u", "s", "mark", "small", "sub", "sup", "abbr",
    "blockquote", "q", "cite", "ul", "ol", "li", "dl", "dt", "dd",
    "a", "img", "figure", "figcaption", "picture", "source",
    "table", "caption", "colgroup", "col", "thead", "tbody", "tfoot", "tr", "th", "td",
    "code", "pre", "kbd", "div", "span", "section", "aside", "details", "summary", "iframe",
  ],
  allowedAttributes: {
    "*": ["id", "class", "title", "lang", "dir"],
    a: ["href", "target", "rel", "name"],
    img: ["src", "srcset", "sizes", "alt", "width", "height", "loading", "decoding"],
    source: ["srcset", "sizes", "type", "media"],
    th: ["colspan", "rowspan", "scope"],
    td: ["colspan", "rowspan"],
    col: ["span"],
    colgroup: ["span"],
    ol: ["start", "reversed", "type"],
    abbr: ["title"],
    details: ["open"],
    iframe: ["src", "width", "height", "allow", "allowfullscreen", "title", "loading"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https"], source: ["http", "https"] },
  allowProtocolRelative: false,
  allowedIframeHostnames: videoHosts,
  allowIframeRelativeUrls: false,
  // Drop the contents of these too, not just the tags.
  nonTextTags: ["script", "style", "textarea", "option", "noscript", "title"],
  // An iframe whose src was not an allowed video host is left without one; drop it entirely.
  exclusiveFilter: (frame) => frame.tag === "iframe" && !frame.attribs.src,
  transformTags: {
    // The post title is the page's h1; headings in the body start at h2.
    h1: "h2",
    h6: "h5",
    a: (tagName, attribs) => {
      const href = attribs.href || "";
      const external = /^https?:\/\//i.test(href) && !/^https?:\/\/(www\.)?aaayanimmunotech\.co\.in/i.test(href);
      if (!external) return { tagName, attribs };
      const rel = new Set((attribs.rel || "").split(/\s+/).filter(Boolean));
      rel.add("noopener");
      if (attribs.target === "_blank") rel.add("noreferrer");
      return { tagName, attribs: { ...attribs, rel: Array.from(rel).join(" ") } };
    },
    img: (tagName, attribs) => ({ tagName, attribs: { loading: "lazy", decoding: "async", ...attribs } }),
    iframe: (tagName, attribs) => ({ tagName, attribs: { loading: "lazy", ...attribs } }),
  },
};

// Every h2 gets a stable id so the article can list its sections and link to them.
function anchorHeadings(html: string) {
  const used = new Set<string>();
  return html.replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi, (whole, attributes = "", inner) => {
    const existing = /\sid="([^"]+)"/i.exec(attributes)?.[1];
    let id = existing || slugify(htmlToText(inner)) || "section";
    const base = id;
    for (let index = 2; used.has(id); index += 1) id = `${base}-${index}`;
    used.add(id);
    return existing && existing === id ? whole : `<h2${attributes.replace(/\sid="[^"]*"/i, "")} id="${id}">${inner}</h2>`;
  });
}

export const sanitizePostHtml = (html: string) => anchorHeadings(sanitizeHtml(html, options).trim());
