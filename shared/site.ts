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
  product({ id: "oxyl-25", name: "OXYL-25 Suite", type: "Multiplace hyperbaric oxygen chamber", category: "Hyperbaric", headline: "4 persons · 2 ATA", badge: "Flagship", description: "A walk-in multiplace hyperbaric oxygen chamber designed for professional environments, accommodating up to four persons at pressures of up to 2 ATA.", specs: [["Capacity", "4 persons"], ["Pressure", "1.0 BAR / 2 ATA / 100 kPa"], ["O₂ capacity", "80 L"], ["Dimensions", "2926 × 1950 × 1850 mm"], ["Internal volume", "5.8 m³"]], features: [{ title: "Multi-person treatment", body: "Accommodates up to 4 persons." },{ title: "Walk-in configuration", body: "Spacious walk-in chamber design." },{ title: "Up to 2 ATA", body: "Designed for hyperbaric operation up to 2 ATA." },{ title: "5.8 m³ internal volume", body: "Provides 5.8 m³ of internal chamber space." }], sectors: ["clinical-medical", "corporate-wellness", "sports-performance"] }),
  product({ id: "cryoduo-6", name: "CryoDuo Elite 6", type: "Whole body cryotherapy chamber", category: "Cryotherapy", headline: "6 persons", badge: "High throughput", description: "A six-person whole body cryotherapy chamber designed for high-throughput professional recovery environments.", specs: [["Capacity", "6 persons"], ["Min temperature", "Down to −160°C"], ["Technology", "Nitrogen or electric"], ["Dimensions", "3925 × 2570 × 2620 mm"]], features: [{ title: "6-person capacity", body: "Accommodates up to 6 persons." },{ title: "Whole body cryotherapy", body: "Designed for whole body cryotherapy sessions." },{ title: "Down to −160°C", body: "Specified minimum temperature of up to −160°C." },{ title: "Flexible technology", body: "Available with nitrogen or electric technology." }], sectors: ["sports-performance", "gyms-spas-hotels"] }),
  product({ id: "max-miracle-9600", name: "Max Miracle 9600", type: "Commercial red light therapy bed", category: "Red light / PBM", headline: "9,600 W · 3,200 LEDs", badge: "Highest output", description: "A high-output commercial red light therapy bed with 3,200 LEDs and a wide treatment area.", specs: [["Amplified LEDs", "3,200"], ["Total power", "9,600 W"], ["Power delivered", "196.48 J/cm²"], ["Dimensions", "93\" × 44\" × 58\""], ["Classification", "FDA Class II registered"]], features: [{ title: "3,200 LEDs", body: "Large LED array for full-body treatment." },{ title: "9,600 W output", body: "High total power configuration." },{ title: "Auto-lift access", body: "Automatic lift supports easier access." },{ title: "Extra-wide treatment area", body: "Designed with a wider treatment surface." }], sectors: ["clinical-medical", "gyms-spas-hotels"] }),
  product({ id: "life-capsul-l1s", name: "Life Capsul L-1S", type: "Monoplace hyperbaric oxygen chamber", category: "Hyperbaric", headline: "1 person · 2 ATA", description: "A single-person hard-shell hyperbaric oxygen chamber designed for individual professional or private use.", specs: [["Capacity", "1 person"], ["Pressure", "1.0 BAR / 2 ATA"], ["O₂ capacity", "20 L"], ["Purity", "90–95%"], ["Material", "Aviation aluminium"], ["Interior", "Artificial leather"]], features: [{ title: "Single-person chamber", body: "Designed for one person per session." },{ title: "Up to 2 ATA", body: "Specified operating pressure of up to 2 ATA." },{ title: "Aviation aluminium shell", body: "Built with an aviation-grade aluminium shell." },{ title: "Compact installation", body: "Sized for a single treatment room." }], sectors: ["clinical-medical", "personal-residential"] }),
  product({ id: "life-capsul-l2s", name: "Life Capsul L-2S", type: "Dual-occupancy hyperbaric chamber", category: "Hyperbaric", headline: "2 persons · 2 ATA", description: "A dual-occupancy hyperbaric oxygen chamber designed for two-person sessions in professional or private settings.", specs: [["Capacity", "2 persons"], ["Pressure", "1.0 BAR / 2 ATA"], ["O₂ capacity", "40 L"], ["Purity", "90–95%"], ["Dimensions", "2151 × 1950 × 1850 mm"]], features: [{ title: "Two-person capacity", body: "Accommodates 2 persons." },{ title: "Up to 2 ATA", body: "Specified operating pressure of up to 2 ATA." },{ title: "Integrated 43-inch screen", body: "Includes an integrated 43-inch screen." },{ title: "Premium interior", body: "Features an artificial leather interior." }], sectors: ["sports-performance", "gyms-spas-hotels", "personal-residential"] }),
  product({ id: "cryoduo-4", name: "CryoDuo 4 Chamber", type: "Whole body cryotherapy chamber", category: "Cryotherapy", headline: "4 persons", description: "A four-person whole body cryotherapy chamber designed for professional recovery facilities.", specs: [["Capacity", "4 persons"], ["Min temperature", "Down to −160°C"], ["Technology", "Nitrogen or electric"], ["Dimensions", "2845 × 2570 × 2620 mm"]], features: [{ title: "4-person capacity", body: "Accommodates up to 4 persons." },{ title: "Down to −160°C", body: "Specified minimum temperature of up to −160°C." },{ title: "Automated monitoring", body: "Includes oxygen monitoring and automatic shutdown." },{ title: "Touchscreen control", body: "Full touchscreen controls for operation." }], sectors: ["clinical-medical", "sports-performance", "gyms-spas-hotels"] }),
  product({ id: "miracle-6200", name: "Miracle 6200", type: "Photobiomodulation bed", category: "Red light / PBM", headline: "6,200 W · 2,000 LEDs", description: "A commercial photobiomodulation bed with 2,000 LEDs and 360-degree light coverage.", specs: [["Amplified LEDs", "2,000"], ["Total power", "6,200 W"], ["Power delivered", "123 J/cm²"], ["Weight capacity", "450 lbs"], ["Classification", "FDA Class II registered"]], features: [{ title: "2,000 LEDs", body: "Large LED array for full-body treatment." },{ title: "6,200 W output", body: "High-power commercial configuration." },{ title: "360-degree coverage", body: "Provides light coverage around the body." },{ title: "450 lb weight capacity", body: "Specified user weight capacity of 450 lb." }], sectors: ["clinical-medical", "sports-performance", "gyms-spas-hotels"] }),
  product({ id: "miracle-5040", name: "Miracle 5040", type: "Full body red light therapy table", category: "Red light / PBM", headline: "5,040 W · 2,553 LEDs", description: "A full-body red light therapy table with 2,553 LEDs and a built-in body cooling fan.", specs: [["Amplified LEDs", "2,553"], ["Total power", "5,040 W"], ["Power delivered", "103 J/cm²"], ["Wavelengths", "625–670nm / 830–910nm"], ["Dimensions", "93\" × 37.5\" × 51\""], ["Classification", "FDA Class II registered"]], features: [{ title: "2,553 LEDs", body: "Large LED array for full-body treatment." },{ title: "5,040 W output", body: "Commercial high-power configuration." },{ title: "625–670 / 830–910 nm", body: "Uses red and near-infrared wavelength ranges." },{ title: "Built-in cooling", body: "Integrated body cooling fan." }], sectors: ["personal-residential", "corporate-wellness"] }),
  product({ id: "superhuman-suite", name: "Superhuman Suite", type: "Full body red light therapy bed", category: "Red light / PBM", headline: "860 LEDs · 630–940nm", description: "A full-body photobiomodulation bed using an 860-LED medical-grade dual-chip array across 630–940 nm.", specs: [["LED array", "860 medical-grade dual-chip"], ["Wavelengths", "630–940nm"], ["Quality system", "ISO 13485"]], features: [{ title: "860 LED array", body: "Medical-grade dual-chip LED array." },{ title: "630–940 nm", body: "Broad red and near-infrared wavelength range." },{ title: "Full-body treatment", body: "Designed for full-body photobiomodulation." },{ title: "India installation", body: "Supplied, installed and commissioned by AAAyan." }], sectors: ["sports-performance", "personal-residential"] }),
  product({ id: "longevity-suite", name: "Longevity Suite", type: "Photobiomodulation bed", category: "Red light / PBM", headline: "660nm + 850nm", description: "A photobiomodulation bed using medical-grade 660 nm and 850 nm LED arrays for professional and private installations.", specs: [["Wavelengths", "660nm and 850nm"], ["Arrays", "Medical-grade, measured irradiance"], ["Quality system", "ISO 13485"]], features: [{ title: "660 nm + 850 nm", body: "Uses two specified wavelength bands." },{ title: "Measured irradiance", body: "Medical-grade arrays with measured irradiance." },{ title: "Clinic or private use", body: "Suitable for professional or private installation." },{ title: "Site survey", body: "Site requirements are reviewed before ordering." }], sectors: ["clinical-medical", "personal-residential"] }),
  product({ id: "recovery-suite", name: "Recovery Suite", type: "PBM bed for sports teams", category: "Red light / PBM", headline: "High output", description: "A high-output photobiomodulation bed designed for sports teams and academies requiring repeated sessions.", specs: [["Output", "High-output photobiomodulation"], ["Sized for", "Squad rotation"], ["Quality system", "ISO 13485"]], features: [{ title: "High-output PBM", body: "Designed for high-output photobiomodulation." },{ title: "Squad rotation", body: "Sized for repeated team sessions." },{ title: "Team installations", body: "Designed for sports teams and academies." },{ title: "Service support", body: "Service contract available." }], sectors: ["sports-performance", "corporate-wellness"] }),
  product({ id: "commercial-cold-plunge", name: "Commercial Cold Plunge", type: "Chilled plunge tub", category: "Cold plunge", headline: "Commercial duty", description: "A commercial chilled and filtered cold plunge system designed for gyms, recovery studios, sports academies and hotel spas.", specs: [["System", "Chilled and filtered"], ["Duty", "Commercial, daily volume"], ["Installation", "Requirements supplied before order"]], features: [{ title: "Chilled system", body: "Integrated chilling for cold-water use." },{ title: "Filtration", body: "Integrated water filtration system." },{ title: "Commercial duty", body: "Designed for regular daily use." },{ title: "Installation planning", body: "Site requirements supplied before ordering." }], sectors: ["gyms-spas-hotels", "sports-performance", "corporate-wellness", "personal-residential"] }),
  product({ id: "compression-therapy-system", name: "Compression Therapy System", type: "Pneumatic sequential compression", category: "Compression", headline: "Multi-zone", description: "A pneumatic sequential compression system designed for recovery, wellness and physiotherapy environments.", specs: [["Type", "Pneumatic sequential compression"], ["Control", "Multi-zone"], ["Site needs", "Minimal — single-phase power"]], features: [{ title: "Pneumatic compression", body: "Uses sequential pneumatic compression." },{ title: "Multi-zone control", body: "Supports multi-zone compression control." },{ title: "Multiple attachments", body: "Leg, arm and hip attachments available." },{ title: "Low footprint", body: "Designed as a compact recovery station." }], sectors: ["sports-performance", "corporate-wellness", "gyms-spas-hotels"] }),
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
