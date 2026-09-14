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
  features: string[];
  image: string;
  badge?: string;
  sectors: string[];
};

const placeholder = (name: string) => `/images/placeholders/${name}.svg`;

export const plainText = (html: string) => html.replace(/<br\s*\/?>/g, " ").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

// The phone number and WhatsApp line are placeholders until the real business line is confirmed.
// They are deliberately kept out of structured data (see shared/seo.ts).
export const contact = {
  email: "info@aaayanimmunotech.co.in",
  phone: "+91 98765 43210",
  whatsapp: "https://wa.me/919876543210",
  city: "Hyderabad",
  region: "Hyderabad · Telangana · India",
  hours: "Mon–Fri, 9am–6pm IST",
};

export const categories = [
  { name: "Hyperbaric", slug: "hyperbaric-oxygen-chambers", label: "Hyperbaric oxygen chambers (HBOT)", guide: "hbot-buying-guide" },
  { name: "Cryotherapy", slug: "cryotherapy-chambers", label: "Whole body cryotherapy chambers", guide: "cryotherapy-buying-guide" },
  { name: "Red light / PBM", slug: "red-light-therapy", label: "Red light therapy beds & PBM", guide: "red-light-therapy-buying-guide" },
  { name: "Cold plunge", slug: "cold-plunge", label: "Commercial cold plunge tubs", guide: "installation-requirements" },
  { name: "Compression", slug: "compression-therapy", label: "Compression therapy equipment", guide: "build-your-centre" },
];

export const categoryNames = ["All equipment", ...categories.map((category) => category.name)];

const product = (item: Omit<Product, "image" | "categorySlug">): Product => ({
  ...item,
  categorySlug: categories.find((category) => category.name === item.category)?.slug ?? "",
  image: placeholder(`product-${item.id}`),
});

// Models and specifications from the legacy catalogue (js/data/catalog.js). Copy describes the equipment only.
export const catalogue: Product[] = [
  product({ id: "oxyl-25", name: "OXYL-25 Suite", type: "Multiplace hyperbaric oxygen chamber", category: "Hyperbaric", headline: "4 persons · 2 ATA", badge: "Flagship", description: "Walk-in multiplace hyperbaric oxygen chamber at 5.8 m³ for hospitals, corporate campuses and high-volume recovery centres.", specs: [["Capacity", "4 persons"], ["Pressure", "1.0 BAR / 2 ATA / 100 kPa"], ["O₂ capacity", "80 L"], ["Dimensions", "2926 × 1950 × 1850 mm"], ["Internal volume", "5.8 m³"]], features: ["Simultaneous multi-user sessions", "Walk-in aluminium construction with seating", "Designed for architectural integration"], sectors: ["clinical-medical", "corporate-wellness", "sports-performance"] }),
  product({ id: "cryoduo-6", name: "CryoDuo Elite 6", type: "Whole body cryotherapy chamber", category: "Cryotherapy", headline: "6 persons", badge: "High throughput", description: "Whole body cryotherapy for up to six people at once — built for elite sports headquarters and large commercial centres.", specs: [["Capacity", "6 persons"], ["Min temperature", "Down to −160°C"], ["Technology", "Nitrogen or electric"], ["Dimensions", "3925 × 2570 × 2620 mm"]], features: ["Pre-chamber and main chamber architecture", "Ventilation and oxygen monitoring safety systems", "Turnkey delivery from concept to staff training"], sectors: ["sports-performance", "gyms-spas-hotels"] }),
  product({ id: "max-miracle-9600", name: "Max Miracle 9600", type: "Commercial red light therapy bed", category: "Red light / PBM", headline: "9,600 W · 3,200 LEDs", badge: "Highest output", description: "The highest-output bed in the range, with an auto-lift for easy access and an extra-wide treatment area — built for clinics and premium commercial operators.", specs: [["Amplified LEDs", "3,200"], ["Total power", "9,600 W"], ["Power delivered", "196.48 J/cm²"], ["Dimensions", "93\" × 44\" × 58\""], ["Classification", "FDA Class II registered"]], features: ["Auto-lift system for easy access", "Integrated Miracle Tones audio", "Extra-wide treatment area with grounding bar"], sectors: ["clinical-medical", "gyms-spas-hotels"] }),
  product({ id: "life-capsul-l1s", name: "Life Capsul L-1S", type: "Monoplace hyperbaric oxygen chamber", category: "Hyperbaric", headline: "1 person · 2 ATA", description: "Monoplace hard-shell hyperbaric chamber — the reference specification for a clinic adding its first HBOT room, or a private residence.", specs: [["Capacity", "1 person"], ["Pressure", "1.0 BAR / 2 ATA"], ["O₂ capacity", "20 L"], ["Purity", "90–95%"], ["Material", "Aviation aluminium"], ["Interior", "Artificial leather"]], features: ["Aviation-grade aluminium shell", "Tablet and 24-inch screen integration", "Compact footprint for a single treatment room"], sectors: ["clinical-medical", "personal-residential"] }),
  product({ id: "life-capsul-l2s", name: "Life Capsul L-2S", type: "Dual-occupancy hyperbaric chamber", category: "Hyperbaric", headline: "2 persons · 2 ATA", description: "Dual-occupancy hyperbaric chamber for couples, athletes training in pairs, or a clinic doubling session capacity without doubling floor area.", specs: [["Capacity", "2 persons"], ["Pressure", "1.0 BAR / 2 ATA"], ["O₂ capacity", "40 L"], ["Purity", "90–95%"], ["Dimensions", "2151 × 1950 × 1850 mm"]], features: ["Premium artificial leather interior", "Integrated 43-inch screen", "Sized for spas and sports recovery centres"], sectors: ["sports-performance", "gyms-spas-hotels", "personal-residential"] }),
  product({ id: "cryoduo-4", name: "CryoDuo 4 Chamber", type: "Whole body cryotherapy chamber", category: "Cryotherapy", headline: "4 persons", description: "Four-person whole body cryotherapy chamber for high-turnover sports recovery clinics, gyms and physiotherapy departments.", specs: [["Capacity", "4 persons"], ["Min temperature", "Down to −160°C"], ["Technology", "Nitrogen or electric"], ["Dimensions", "2845 × 2570 × 2620 mm"]], features: ["Full touchscreen controls", "Automated oxygen monitoring and auto-shutdown", "Stand-by mode and remote troubleshooting"], sectors: ["clinical-medical", "sports-performance", "gyms-spas-hotels"] }),
  product({ id: "miracle-6200", name: "Miracle 6200", type: "Photobiomodulation bed", category: "Red light / PBM", headline: "6,200 W · 2,000 LEDs", description: "Commercial photobiomodulation bed with 360-degree light coverage, rated for continuous consecutive sessions.", specs: [["Amplified LEDs", "2,000"], ["Total power", "6,200 W"], ["Power delivered", "123 J/cm²"], ["Weight capacity", "450 lbs"], ["Classification", "FDA Class II registered"]], features: ["360-degree light coverage", "Heavy-gauge steel construction, fabricated in the USA", "Accessible service panels for maintenance"], sectors: ["clinical-medical", "sports-performance", "gyms-spas-hotels"] }),
  product({ id: "miracle-5040", name: "Miracle 5040", type: "Full body red light therapy table", category: "Red light / PBM", headline: "5,040 W · 2,553 LEDs", description: "Full body red light therapy table with a chair-height bench and the patented Goldilocks optimal-distance system.", specs: [["Amplified LEDs", "2,553"], ["Total power", "5,040 W"], ["Power delivered", "103 J/cm²"], ["Wavelengths", "625–670nm / 830–910nm"], ["Dimensions", "93\" × 37.5\" × 51\""], ["Classification", "FDA Class II registered"]], features: ["Patented Miracle head and foot system", "Built-in body cooling fan", "Commercial-grade powder-coated steel"], sectors: ["personal-residential", "corporate-wellness"] }),
  product({ id: "superhuman-suite", name: "Superhuman Suite", type: "Full body red light therapy bed", category: "Red light / PBM", headline: "860 LEDs · 630–940nm", description: "Full body red light therapy bed with an 860-LED medical-grade dual-chip array spanning 630–940nm, supplied across India.", specs: [["LED array", "860 medical-grade dual-chip"], ["Wavelengths", "630–940nm"], ["Quality system", "ISO 13485"]], features: ["Full-body photobiomodulation", "Supplied, installed and commissioned by AAAyan", "Operator training at handover"], sectors: ["sports-performance", "personal-residential"] }),
  product({ id: "longevity-suite", name: "Longevity Suite", type: "Photobiomodulation bed", category: "Red light / PBM", headline: "660nm + 850nm", description: "Photobiomodulation bed for longevity clinics and private installations, with medical-grade 660nm and 850nm arrays and measured irradiance.", specs: [["Wavelengths", "660nm and 850nm"], ["Arrays", "Medical-grade, measured irradiance"], ["Quality system", "ISO 13485"]], features: ["Suited to longevity clinics", "Private residence installation", "Site survey before order"], sectors: ["clinical-medical", "personal-residential"] }),
  product({ id: "recovery-suite", name: "Recovery Suite", type: "PBM bed for sports teams", category: "Red light / PBM", headline: "High output", description: "High-output photobiomodulation bed sized for squad rotation in sports teams and academies, supplied and installed across India.", specs: [["Output", "High-output photobiomodulation"], ["Sized for", "Squad rotation"], ["Quality system", "ISO 13485"]], features: ["Built for back-to-back sessions", "Team and academy installations", "Service contract available"], sectors: ["sports-performance", "corporate-wellness"] }),
  product({ id: "commercial-cold-plunge", name: "Commercial Cold Plunge", type: "Chilled plunge tub", category: "Cold plunge", headline: "Commercial duty", description: "Chilled, filtered cold plunge tubs for gyms, recovery studios, sports academies and hotel spas, sized for daily volume.", specs: [["System", "Chilled and filtered"], ["Duty", "Commercial, daily volume"], ["Installation", "Requirements supplied before order"]], features: ["Integrated chiller and filtration", "Completes a contrast-therapy circuit", "Suited to gyms, academies and hotel spas"], sectors: ["gyms-spas-hotels", "sports-performance", "corporate-wellness", "personal-residential"] }),
  product({ id: "compression-therapy-system", name: "Compression Therapy System", type: "Pneumatic sequential compression", category: "Compression", headline: "Multi-zone", description: "Pneumatic sequential compression for gyms, recovery lounges, academies and physiotherapy clinics.", specs: [["Type", "Pneumatic sequential compression"], ["Control", "Multi-zone"], ["Site needs", "Minimal — single-phase power"]], features: ["Low-footprint circuit station", "Leg, arm and hip attachments", "Complements larger modalities"], sectors: ["sports-performance", "corporate-wellness", "gyms-spas-hotels"] }),
];

const photo = (name: string) => `/images/photos/${name}.webp`;

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

// Real photography where it exists for a modality; labelled placeholders otherwise.
const categoryPhotos: Record<string, string> = {
  "hyperbaric-oxygen-chambers": "hbot-chamber-residence",
  "red-light-therapy": "red-light-panel",
};

export const categoryImage = (slug: string) => (categoryPhotos[slug] ? photo(categoryPhotos[slug]) : placeholder(`category-${slug}`));

export const stats = [
  { value: "25+", label: "Trusted customers", body: "Luxury hotels, premium clinics & private estates" },
  { value: "3+", label: "Years of excellence", body: "Delivering precision wellness innovation across India" },
  { value: "98%", label: "Client satisfaction", body: "Measured performance across all deployments" },
  { value: "5+", label: "Cities served", body: "Elite environments across the nation" },
];
