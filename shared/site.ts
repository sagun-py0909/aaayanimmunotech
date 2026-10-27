import { contentPages, sectorContent } from "./content";
import type { SectorContent } from "./content-types";

export type Product = {
  id: string;
  name: string;
  type: string;
  category: string;
  categorySlug: string;
  headline: string;
  description: string;
  specs: [string, string][];
  features: { title: string; body: string }[];
  /** Commercial outcomes for the operator — what the room earns, not what the therapy does. */
  gains: { title: string; body: string }[];
  image: string;
  images: string[];
  /** Product photography plus the site photography that suits the modality. */
  gallery: string[];
  /** Product videos, each with a poster frame shown before it plays. */
  videos?: { src: string; poster: string }[];
  badge?: string;
  sectors: string[];
};

const photo = (name: string) => `/images/photos/${name}.webp`;
export const plainText = (html: string) => html.replace(/<br\s*\/?>/g, " ").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

// Business line from the client's product sheet (Aurobindo Padhi, Business Head).
export const contact = {
  email: "info@aaayanimmunotech.co.in",
  phone: "+91 99580 76644",
  whatsapp: "https://wa.me/919958076644",
  city: "Hyderabad",
  region: "Hyderabad · Telangana · India",
  hours: "Mon–Fri, 9am–6pm IST",
};

// The client's full product range, star products first. Each product is photos plus one line.
// Where no photo exists yet (hypoxic oxygen, body mass analyser) the image is an AAAyan placeholder card.
type Entry = { id: string; name: string; type: string; guide: string; description: string; photos: string[]; sectors: string[]; badge?: string; videos?: { src: string; poster: string }[] };

const media = (file: string) => `/images/products/${file.includes(".") ? file : `${file}.webp`}`;

const range: Entry[] = [
  { id: "hyperbaric-oxygen-hbot", name: "HBOT – Luxury Model", type: "Hyperbaric oxygen chamber", guide: "hbot-buying-guide", badge: "Star product", description: "Hard-shell and soft-shell hyperbaric oxygen chambers, from seated luxury models to compact home units.", photos: ["hyperbaric-oxygen-hbot.jpg", "diamond-gold", "diamond-5000-3", "hbot-5000-mono-suite", "hbot-5000-black-lounge", "hbot-blue-multiplace", "hbot-black-interior-seated"], videos: [{ src: "/videos/hbot-5000-mono.mp4", poster: "/videos/hbot-5000-mono-poster.webp" }], sectors: ["clinical-medical", "sports-performance", "gyms-spas-hotels", "personal-residential"] },
  { id: "whole-body-cryotherapy-chambers", name: "Whole Body Cryo", type: "Electric cryotherapy chamber", guide: "cryotherapy-buying-guide", description: "Nitrogen-free electric whole-body cryotherapy cabins.", photos: ["whole-body-cryo-cabin-purple", "whole-body-cryo-cabin-mist", "whole-body-cryotherapy-chambers.jpg", "wbc-4", "aurora-electric-1"], sectors: ["sports-performance", "gyms-spas-hotels", "clinical-medical"] },
  { id: "red-light-pbm-therapy-beds", name: "Red Light Bed", type: "Red light therapy bed", guide: "red-light-therapy-buying-guide", description: "Full-body red light therapy beds.", photos: ["red-light-pbm-therapy-beds.jpg", "red-light-pbm-therapy-beds-2.jpg", "red-light-bed-room", "red-light-bed-interior", "red-light-bed-session", "red-light-bed-studio-white", "red-light-bed-clamshell", "red-light-bed-tunnel"], sectors: ["clinical-medical", "gyms-spas-hotels", "sports-performance"] },
  { id: "partial-body-cryo", name: "Partial Body Cryo", type: "Nitrogen cryotherapy cabin", guide: "cryotherapy-buying-guide", description: "Nitrogen cryo cabins with the head kept outside the chamber, including a portable model.", photos: ["partial-cryo-2", "aurora-portable-1"], sectors: ["sports-performance", "gyms-spas-hotels"] },
  { id: "whale-pod", name: "Whale Pod", type: "Smart floatation pod", guide: "build-your-centre", description: "Smart floatation pod with a sculpted, whale-inspired shell.", photos: ["whalepod-1"], sectors: ["gyms-spas-hotels", "personal-residential"] },
  { id: "ir-sauna-pod", name: "IR Sauna Pod", type: "Infrared sauna pod", guide: "installation-requirements", description: "Lie-down infrared sauna capsule with red light, a built-in control panel and the head kept outside.", photos: ["ir-sauna-capsule"], sectors: ["gyms-spas-hotels", "personal-residential"] },
  { id: "float-tanks-wet", name: "Sensory Float Pod", type: "Sensory floatation tank", guide: "installation-requirements", description: "Saltwater sensory floatation pod for spas and recovery studios.", photos: ["float-tanks-wet.jpg", "float-3", "float-4", "float-2", "relaxpod-2"], sectors: ["gyms-spas-hotels", "sports-performance"] },
  { id: "localized-cryotherapy-chillers", name: "Localised Cryo", type: "Localised cryotherapy unit", guide: "cryotherapy-buying-guide", description: "Targeted cryotherapy unit with a flexible applicator hose.", photos: ["localized-cryotherapy-chillers.jpg"], sectors: ["sports-performance", "clinical-medical"] },
  { id: "cold-plunge", name: "Cold Plunge", type: "Cold plunge tub", guide: "installation-requirements", description: "Chilled, filtered cold plunge tubs.", photos: ["cold-plunge-1", "cold-plunge-2", "cold-plunge-5", "cold-plunge-4", "cold-plunge-3"], sectors: ["sports-performance", "gyms-spas-hotels", "personal-residential"] },
  { id: "red-light-panel", name: "Red Light Panel", type: "Red light therapy panel", guide: "red-light-therapy-buying-guide", description: "Free-standing full-body red light therapy panel.", photos: ["red-light-panel", "red-light-panel-3", "red-light-panel-2"], sectors: ["gyms-spas-hotels", "personal-residential"] },
  { id: "red-light-mask", name: "Red Light Mask", type: "LED face mask", guide: "red-light-therapy-buying-guide", description: "LED red light therapy face mask.", photos: ["red-light-mask"], sectors: ["gyms-spas-hotels", "personal-residential"] },
  { id: "dry-massage-bed", name: "Dry Massage Bed (Cold & Hot)", type: "Dry hydro-massage bed", guide: "build-your-centre", description: "Water-jet massage through a soft membrane, with hot and cold modes — the user stays fully clothed.", photos: ["dry-massage-bed-1", "dry-massage-bed-2", "dry-massage-bed-3"], sectors: ["gyms-spas-hotels", "personal-residential", "corporate-wellness"] },
  { id: "dry-float-beds", name: "Dry Float Bed", type: "Dry floatation bed", guide: "build-your-centre", description: "Zero-gravity dry floatation bed — a weightless feel without getting wet.", photos: ["dry-float-bed-2", "dry-float-bed-1", "dry-float-bed-4", "dry-float-bed-3"], sectors: ["gyms-spas-hotels", "corporate-wellness"] },
  { id: "bio-resonance-pod", name: "Bio Resonance Pod", type: "Wellness pod", guide: "build-your-centre", description: "Enclosed wellness pod with light and bio-resonance programmes.", photos: ["bio-resonance-pod", "bio-resonance-pod-2"], sectors: ["gyms-spas-hotels", "clinical-medical"] },
  { id: "infrared-sauna", name: "IR + FIR + Himalayan Salt Sauna Cabin", type: "Infrared sauna cabin", guide: "installation-requirements", description: "Infrared and far-infrared sauna cabins with a Himalayan salt option.", photos: ["infrared-sauna.jpg", "infrared-sauna-2.jpg", "sauna-cabin-3", "sauna-cabin-4", "sauna-cabin-6", "sauna-cabin-5", "sauna-cabin-7"], sectors: ["gyms-spas-hotels", "corporate-wellness", "personal-residential"] },
  { id: "nano-vi", name: "Nano VI", type: "Nano VI device", guide: "build-your-centre", description: "Compact tabletop Nano VI unit with a flexible breathing hose.", photos: ["nano-vi"], sectors: ["clinical-medical", "personal-residential"] },
  { id: "hydrogen-inhalation", name: "Hydrogen Inhalation", type: "Hydrogen inhalation system", guide: "build-your-centre", description: "Molecular hydrogen generator for inhalation, on castors with a front control panel.", photos: ["hydrogen-generator-1", "hydrogen-generator-2", "hydrogen-generator-3"], sectors: ["clinical-medical", "personal-residential"] },
  { id: "hydrogen-bath", name: "Hydrogen Bath", type: "Hydrogen bath system", guide: "build-your-centre", description: "Hydrogen-rich water bath system.", photos: ["hydrogen-bath-3"], sectors: ["gyms-spas-hotels", "personal-residential"] },
  { id: "hypoxic-oxygen-inhalation", name: "Hypoxic Oxygen Inhalation", type: "Hypoxic air system", guide: "build-your-centre", description: "Intermittent hypoxic–hyperoxic training: the user breathes alternating low-oxygen (8–15%) and oxygen-rich (up to 36%) air while blood oxygen is monitored.", photos: ["hypoxic-oxygen-inhalation"], sectors: ["sports-performance", "clinical-medical"] },
  { id: "pemf", name: "PEMF Bed", type: "PEMF bed", guide: "build-your-centre", description: "Full-body PEMF bed.", photos: ["pemf.jpg", "pemf-2"], sectors: ["sports-performance", "clinical-medical", "gyms-spas-hotels"] },
  { id: "body-mass-analyser", name: "Body Mass Analyser", type: "Body composition analyser", guide: "build-your-centre", description: "Body composition and body mass analyser.", photos: ["body-mass-analyser"], sectors: ["clinical-medical", "gyms-spas-hotels", "sports-performance"] },
];

// Each product is its own category: the nav and the /products?modality= filter link straight to it.
export const categories = range.map(({ id, name, guide }) => ({ name, slug: id, label: name, guide }));

export const catalogue: Product[] = range.map(({ photos, guide: _guide, ...item }) => {
  const images = photos.map(media);
  return { ...item, headline: "", category: item.name, categorySlug: item.id, specs: [], features: [], gains: [], image: images[0], images, gallery: images };
});


const sectorMeta = [
  { slug: "clinical-medical", title: "Clinical & Medical", label: "Flagship sector", photo: "sector-clinical" },
  { slug: "gyms-spas-hotels", title: "Gyms, Spas & Hotels", label: "Commercial", photo: "sector-hospitality" },
  { slug: "sports-performance", title: "Sports & Performance", label: "Performance", photo: "sector-sports" },
  { slug: "corporate-wellness", title: "Corporate Wellness", label: "Corporate", photo: "sector-corporate" },
  { slug: "personal-residential", title: "Personal & Residential", label: "Private", photo: "sector-personal" },
];

export type Sector = SectorContent & { title: string; label: string; image: string };

export const sectors: Sector[] = sectorMeta.flatMap(({ photo: photoName, ...meta }) => {
  const content = sectorContent.find((item) => item.slug === meta.slug);
  return content ? [{ ...content, ...meta, image: photo(photoName) }] : [];
});

export const equipmentPages = contentPages.filter((page) => page.kind === "equipment");
export const guides = contentPages.filter((page) => page.kind === "guide");

export const guideLabels: Record<string, string> = {
  "hbot-buying-guide": "HBOT equipment cost guide",
  "cryotherapy-buying-guide": "Cryotherapy chamber cost guide",
  "red-light-therapy-buying-guide": "Red light therapy bed cost guide",
  "installation-requirements": "Installation requirements",
  "build-your-centre": "Wellness centre setup cost India",
  "recovery-centre-setup-guide": "How to start a recovery centre",
};

export const guideGroups = [
  { title: "Buying guides", slugs: ["hbot-buying-guide", "cryotherapy-buying-guide", "red-light-therapy-buying-guide", "installation-requirements"] },
  { title: "Build a facility", slugs: ["build-your-centre", "recovery-centre-setup-guide"] },
];

export const guideImages: Record<string, string> = {
  "hbot-buying-guide": photo("hbot-chamber-residence"),
  "cryotherapy-buying-guide": photo("red-light-cryo-suite"),
  "red-light-therapy-buying-guide": photo("red-light-bed"),
  "installation-requirements": photo("clinic-chambers"),
  "build-your-centre": photo("recovery-centre"),
  "recovery-centre-setup-guide": photo("sector-sports"),
};

// The legacy equipment pages keep their own URLs for the rankings they carry, so they are mapped
// onto the current catalogue rather than matched on category slug.
export const legacyCategoryProducts: Record<string, string[]> = {
  "hyperbaric-oxygen-chambers": ["hyperbaric-oxygen-hbot"],
  "cryotherapy-chambers": ["whole-body-cryotherapy-chambers", "localized-cryotherapy-chillers"],
  "red-light-therapy": ["red-light-pbm-therapy-beds", "pemf"],
  "cold-plunge": ["whole-body-cryotherapy-chambers", "localized-cryotherapy-chillers", "float-tanks-wet"],
  "compression-therapy": ["pemf", "dry-float-beds"],
};

export const productsForLegacyCategory = (slug: string) =>
  (legacyCategoryProducts[slug] ?? []).flatMap((id) => catalogue.filter((item) => item.id === id));

// Real photography where it exists for a modality; the product photograph otherwise.
const categoryPhotos: Record<string, string> = {
  "hyperbaric-oxygen-chambers": "hbot-chamber-residence",
  "red-light-therapy": "red-light-panel",
  "cryotherapy-chambers": "red-light-cryo-suite",
  "cold-plunge": "recovery-centre",
  "compression-therapy": "recovery-lounge-skyline",
};

export const categoryImage = (slug: string) =>
  categoryPhotos[slug] ? photo(categoryPhotos[slug]) : productsForLegacyCategory(slug)[0]?.image ?? photo("recovery-centre");

export const stats = [
  { value: "25+", label: "Trusted customers", body: "Luxury hotels, premium clinics & private estates" },
  { value: "3+", label: "Years of excellence", body: "Delivering precision wellness innovation across India" },
  { value: "98%", label: "Client satisfaction", body: "Measured performance across all deployments" },
  { value: "5+", label: "Cities served", body: "Elite environments across the nation" },
];
