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
  badge?: string;
  sectors: string[];
};

const photo = (name: string) => `/images/photos/${name}.webp`;
const productImage = (name: string) => `/images/products/${name}.jpg`;
const galleryPhotos: Record<string, string[]> = {
  "infrared-sauna": ["recovery-lounge-skyline", "lounge-private"],
  "hyperbaric-oxygen-hbot": ["hbot-chamber-residence", "hbot-multiplace-interior", "clinic-chambers"],
  "dry-float-beds": ["lounge-private", "recovery-centre"],
  "float-tanks-wet": ["residence-pod", "recovery-lounge-skyline"],
  "pemf": ["recovery-centre", "sector-sports"],
  "red-light-pbm-therapy-beds": ["red-light-bed", "red-light-panel", "red-light-cryo-suite"],
  "localized-cryotherapy-chillers": ["red-light-cryo-suite", "sector-sports"],
  "whole-body-cryotherapy-chambers": ["red-light-cryo-suite", "sector-sports", "recovery-centre"],
};
const productGallery: Record<string, string[]> = {
  "infrared-sauna": ["/images/products/infrared-sauna-2.jpg"],
  "hyperbaric-oxygen-hbot": ["/images/products/hyperbaric-oxygen-hbot-2.jpg"],
  "dry-float-beds": ["/images/products/dry-float-beds-2.jpg"],
  "float-tanks-wet": ["/images/products/float-tanks-wet-2.jpg"],
  "pemf": ["/images/products/pemf-2.jpg"],
  "red-light-pbm-therapy-beds": ["/images/products/red-light-pbm-therapy-beds-2.jpg"],
  "localized-cryotherapy-chillers": ["/images/products/localized-cryotherapy-chillers-2.jpg"],
  "whole-body-cryotherapy-chambers": ["/images/products/whole-body-cryotherapy-chambers-2.jpg"],
};

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
  { name: "Infrared Sauna", slug: "infrared-sauna", label: "Infrared sauna systems", guide: "installation-requirements" },
  { name: "Hyperbaric Oxygen / HBOT", slug: "hyperbaric-oxygen-hbot", label: "Hyperbaric oxygen / HBOT", guide: "hbot-buying-guide" },
  { name: "Dry Float Beds", slug: "dry-float-beds", label: "Dry float beds", guide: "build-your-centre" },
  { name: "Wet Float Tanks", slug: "float-tanks-wet", label: "Wet float tanks", guide: "installation-requirements" },
  { name: "PEMF", slug: "pemf", label: "PEMF systems", guide: "build-your-centre" },
  { name: "Red Light / PBM Therapy Beds", slug: "red-light-pbm-therapy-beds", label: "Red light / PBM therapy beds", guide: "red-light-therapy-buying-guide" },
  { name: "Localized Cryotherapy & Chillers", slug: "localized-cryotherapy-chillers", label: "Localized cryotherapy & chillers", guide: "cryotherapy-buying-guide" },
  { name: "Whole Body Cryotherapy Chambers", slug: "whole-body-cryotherapy-chambers", label: "Whole body cryotherapy chambers", guide: "cryotherapy-buying-guide" },
];

export const categoryNames = ["All products", ...categories.map((category) => category.name)];

const product = (item: Omit<Product, "image" | "categorySlug" | "images" | "gallery">): Product => {
  const images = [productImage(item.id), ...(productGallery[item.id] ?? [])];
  return {
    ...item,
    categorySlug: categories.find((category) => category.name === item.category)?.slug ?? "",
    image: productImage(item.id),
    images,
    gallery: [...images, ...(galleryPhotos[item.id] ?? []).map(photo)],
  };
};

export const catalogue: Product[] = [
  product({
    id: "infrared-sauna",
    name: "Infrared Sauna",
    type: "Infrared sauna system",
    category: "Infrared Sauna",
    headline: "Controlled infrared heat · Full-body use",
    badge: "01 / Infrared",
    description: "An infrared sauna system designed to deliver controlled radiant heat in a dedicated wellness environment, with a practical format for repeated sessions.",
    specs: [["Modality", "Infrared heat"], ["Use", "Wellness and recovery"], ["Format", "Dedicated sauna cabin"], ["Installation", "Site-dependent"]],
    features: [
      { title: "Infrared heating", body: "Uses infrared energy to provide controlled radiant heat." },
      { title: "Full-body sessions", body: "Designed for seated, full-body sauna sessions." },
      { title: "Wellness focused", body: "Suitable for spas, wellness centres and recovery facilities." },
      { title: "Planned installation", body: "Room, electrical and ventilation requirements can be reviewed before installation." },
    ],
    gains: [
      { title: "A service members recognise", body: "Infrared sauna is familiar to members, so it needs little explaining at the point of sale." },
      { title: "Low staffing per session", body: "Sessions run to a timer and need supervision rather than an operator in the room." },
      { title: "Fits an existing room", body: "A cabin can occupy a spare treatment room instead of new construction." },
      { title: "Pairs with cold", body: "Sits naturally beside cryotherapy or a plunge as a contrast circuit members book together." },
    ],
    sectors: ["gyms-spas-hotels", "corporate-wellness", "personal-residential"],
  }),
  product({
    id: "hyperbaric-oxygen-hbot",
    name: "Hyperbaric Oxygen / HBOT",
    type: "Hyperbaric oxygen chamber",
    category: "Hyperbaric Oxygen / HBOT",
    headline: "Controlled pressurised oxygen environment",
    badge: "02 / HBOT",
    description: "A hyperbaric oxygen therapy system designed to create a controlled pressurised environment for professional wellness and clinical applications.",
    specs: [["Modality", "Hyperbaric oxygen therapy"], ["Configuration", "Single or multiplace options"], ["Environment", "Pressurised chamber"], ["Installation", "Site survey required"]],
    features: [
      { title: "Pressurised environment", body: "Creates a controlled chamber environment for HBOT sessions." },
      { title: "Professional use", body: "Designed for clinics, recovery centres and professional facilities." },
      { title: "Multiple configurations", body: "Available in configurations suited to different facility requirements." },
      { title: "Site planning", body: "Access, power, ventilation and room requirements are assessed before installation." },
    ],
    gains: [
      { title: "A premium line on the price list", body: "HBOT sessions are the highest-value item in most recovery menus." },
      { title: "Booked in courses", body: "Clients typically buy a block of sessions, which makes revenue easier to forecast." },
      { title: "A reason to be referred", body: "Few facilities in a given city operate a chamber, which supports referrals and enquiries." },
      { title: "Planned before it is bought", body: "We confirm access, power, floor loading and ventilation first, so the room is right the first time." },
    ],
    sectors: ["clinical-medical", "sports-performance", "gyms-spas-hotels"],
  }),
  product({
    id: "dry-float-beds",
    name: "Dry Float Beds",
    type: "Dry floatation therapy bed",
    category: "Dry Float Beds",
    headline: "Zero-gravity style relaxation · No water immersion",
    badge: "03 / Dry Float",
    description: "A dry floatation bed designed to create a weightless relaxation experience without requiring the user to enter a water-filled tank.",
    specs: [["Modality", "Dry floatation"], ["Session", "Fully clothed"], ["Water use", "No immersion required"], ["Setting", "Wellness and recovery"]],
    features: [
      { title: "Dry floatation", body: "Provides a floating-style experience without water immersion." },
      { title: "Fully clothed sessions", body: "The user remains dry and clothed during a session." },
      { title: "Relaxation focused", body: "Designed for rest, relaxation and recovery environments." },
      { title: "Facility friendly", body: "Suitable for spas, wellness centres and recovery lounges." },
    ],
    gains: [
      { title: "No water plant", body: "There is no tank to fill, filter or drain, so running costs stay close to the electricity bill." },
      { title: "Short turnaround", body: "Clients stay dry and clothed, so there is no shower or changing time between bookings." },
      { title: "Easy to staff", body: "One member of staff can run the room alongside other duties." },
      { title: "Small footprint", body: "A bed fits a standard treatment room, which suits spas adding a service without building." },
    ],
    sectors: ["gyms-spas-hotels", "corporate-wellness", "personal-residential"],
  }),
  product({
    id: "float-tanks-wet",
    name: "Float Tanks — Wet",
    type: "Water floatation tank",
    category: "Wet Float Tanks",
    headline: "Water-based floatation · Sensory relaxation",
    badge: "04 / Wet Float",
    description: "A water-based float tank designed for floatation sessions in a controlled, private environment with buoyant water supporting the body.",
    specs: [["Modality", "Wet floatation"], ["Medium", "Water-based"], ["Experience", "Buoyancy and reduced sensory input"], ["Installation", "Room and plumbing dependent"]],
    features: [
      { title: "Water floatation", body: "Uses buoyant water to support the body during a session." },
      { title: "Private session format", body: "Designed for an individual floatation experience." },
      { title: "Relaxation environment", body: "Suitable for dedicated wellness and recovery spaces." },
      { title: "Installation planning", body: "Floor loading, access, water and drainage requirements should be checked in advance." },
    ],
    gains: [
      { title: "A destination service", body: "A float room gives a spa or studio something guests travel for and post about." },
      { title: "Long, high-value bookings", body: "Sessions are typically an hour, which supports a higher price per booking." },
      { title: "Planned plant room", body: "Filtration, water treatment and drainage are specified with you before the order." },
      { title: "Quiet neighbour", body: "A float room needs isolation from noise, which suits an unused corner of a building." },
    ],
    sectors: ["gyms-spas-hotels", "personal-residential", "corporate-wellness"],
  }),
  product({
    id: "pemf",
    name: "PEMF",
    type: "Pulsed electromagnetic field therapy system",
    category: "PEMF",
    headline: "Pulsed electromagnetic field sessions",
    badge: "05 / PEMF",
    description: "A PEMF system designed to deliver controlled pulsed electromagnetic field sessions in professional wellness, recovery and rehabilitation environments.",
    specs: [["Modality", "PEMF"], ["Therapy", "Pulsed electromagnetic fields"], ["Format", "System-dependent applicators"], ["Setting", "Professional wellness / recovery"]],
    features: [
      { title: "PEMF delivery", body: "Generates controlled pulsed electromagnetic fields for scheduled sessions." },
      { title: "Targeted application", body: "Applicator formats can be selected around the intended treatment area." },
      { title: "Session based", body: "Designed for repeatable, protocol-led sessions." },
      { title: "Professional setup", body: "Suitable for wellness, recovery and rehabilitation environments." },
    ],
    gains: [
      { title: "Lowest barrier to entry", body: "A PEMF system needs a bed-sized space and single-phase power." },
      { title: "Adds to an existing session", body: "Runs alongside physiotherapy, training or recovery appointments already on the books." },
      { title: "Portable between rooms", body: "Systems can be moved, so a facility can test demand before committing a room." },
      { title: "Short sessions", body: "Session lengths suit a circuit where clients move between stations." },
    ],
    sectors: ["clinical-medical", "sports-performance", "corporate-wellness"],
  }),
  product({
    id: "red-light-pbm-therapy-beds",
    name: "Red Light / PBM Therapy Beds",
    type: "Full-body photobiomodulation bed",
    category: "Red Light / PBM Therapy Beds",
    headline: "Red and near-infrared light · Full-body format",
    badge: "06 / Red Light + PBM",
    description: "A full-body photobiomodulation platform using red and near-infrared light in a bed-style format for professional wellness and recovery facilities.",
    specs: [["Modality", "Photobiomodulation"], ["Light", "Red and near-infrared"], ["Format", "Full-body bed"], ["Setting", "Clinical, wellness and recovery"]],
    features: [
      { title: "Full-body format", body: "Designed to provide a large-area light treatment surface." },
      { title: "Red + near-infrared", body: "Uses red and near-infrared wavelength ranges depending on configuration." },
      { title: "Repeatable sessions", body: "Built for scheduled sessions in professional facilities." },
      { title: "Easy access", body: "Bed-style access supports straightforward user positioning." },
    ],
    gains: [
      { title: "High throughput", body: "Short sessions and no changeover plant mean a single bed can serve a full day of bookings." },
      { title: "Membership add-on", body: "Commonly sold as an add-on tier rather than a one-off, which supports recurring revenue." },
      { title: "Straightforward install", body: "A bed needs floor space and power, with no water, gas or pressure systems." },
      { title: "Visible in a space", body: "The bed itself photographs well, which helps a facility market the service." },
    ],
    sectors: ["clinical-medical", "sports-performance", "gyms-spas-hotels"],
  }),
  product({
    id: "localized-cryotherapy-chillers",
    name: "Localized Cryotherapy & Chillers",
    type: "Localized cryotherapy system",
    category: "Localized Cryotherapy & Chillers",
    headline: "Targeted cold application · Controlled cooling",
    badge: "07 / Localized Cryo",
    description: "A localized cryotherapy system designed for targeted cold application, supported by dedicated chilling equipment for controlled operation.",
    specs: [["Modality", "Localized cryotherapy"], ["Application", "Targeted cooling"], ["System", "Cryotherapy + chiller"], ["Setting", "Professional recovery"]],
    features: [
      { title: "Localized cooling", body: "Designed for targeted rather than whole-body cold application." },
      { title: "Controlled temperature", body: "Chiller-supported operation provides controlled cooling." },
      { title: "Recovery focused", body: "Suitable for sports recovery and wellness facilities." },
      { title: "Compact planning", body: "Can be specified around the available treatment-room layout." },
    ],
    gains: [
      { title: "Entry point to cryotherapy", body: "A chiller lets a facility offer cryotherapy before committing to a full chamber." },
      { title: "Targeted, short sessions", body: "Sessions are brief and applied to one area, so they slot between appointments." },
      { title: "Compact and movable", body: "Units suit physiotherapy rooms, clinics and gym floors without a dedicated room." },
      { title: "Supports a chamber", body: "Works alongside a whole body chamber as a lower-priced option on the same menu." },
    ],
    sectors: ["sports-performance", "clinical-medical", "gyms-spas-hotels"],
  }),
  product({
    id: "whole-body-cryotherapy-chambers",
    name: "Whole Body Cryotherapy Chambers",
    type: "Whole-body cryotherapy chamber",
    category: "Whole Body Cryotherapy Chambers",
    headline: "Whole-body cold exposure · Professional chamber format",
    badge: "08 / Whole Body Cryo",
    description: "A whole-body cryotherapy chamber designed to expose the user to a controlled low-temperature environment for professional recovery and wellness sessions.",
    specs: [["Modality", "Whole-body cryotherapy"], ["Format", "Cryotherapy chamber"], ["Application", "Full-body cold exposure"], ["Installation", "Site survey required"]],
    features: [
      { title: "Whole-body format", body: "Designed for full-body exposure in a dedicated chamber." },
      { title: "Controlled cold", body: "Creates a managed low-temperature session environment." },
      { title: "Professional throughput", body: "Suitable for recovery centres, sports facilities and wellness businesses." },
      { title: "Safety planning", body: "Room layout, ventilation, operating procedures and site requirements should be assessed before installation." },
    ],
    gains: [
      { title: "The headline of a recovery floor", body: "A chamber is the service most members and athletes ask for by name." },
      { title: "Volume per hour", body: "Sessions run a few minutes, so one chamber can serve many people in a peak hour." },
      { title: "Sold as a package", body: "Session blocks and memberships suit the format, which supports repeat revenue." },
      { title: "Specified around your room", body: "Nitrogen or electric, and the capacity, are chosen against your space, power and expected volume." },
    ],
    sectors: ["sports-performance", "gyms-spas-hotels", "clinical-medical"],
  }),
];


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
