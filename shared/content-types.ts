export type Action = { label: string; href: string };

export type Block =
  | { type: "p"; html: string }
  | { type: "list"; items: string[] }
  | { type: "table"; caption: string; head: string[]; rows: string[][] }
  | { type: "cards"; cards: { num: string; title: string; body: string; link?: Action }[] };

export type Faq = { question: string; answer: string };

export type ContentPage = {
  slug: string;
  kind: "equipment" | "guide";
  legacyPath: string;
  metaTitle: string;
  metaDescription: string;
  breadcrumb: string;
  eyebrow: string;
  headingHtml: string;
  ledes: string[];
  actions: Action[];
  sections: { tag: string; headingHtml: string; blocks: Block[] }[];
  cta: { headingHtml: string; body: string; actions: Action[] } | null;
  faqs: Faq[];
};

export type SectorContent = {
  slug: string;
  legacyPath: string;
  metaTitle: string;
  metaDescription: string;
  heroTag: string;
  headingHtml: string;
  subtitle: string;
  description: string;
  stats: { value: string; unit: string; label: string }[];
  equipmentTag: string;
  equipmentHeadingHtml: string;
  features: { name: string; description: string }[];
  specsTag: string;
  specsHeadingHtml: string;
  specs: [string, string][];
  enquiry: { label: string; title: string; description: string; points: string[] };
  quote: string;
  ctaHeadingHtml: string;
  ctaBody: string;
  recommended: string[];
  faqs: Faq[];
};
