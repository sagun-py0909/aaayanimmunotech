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
  /** Health benefits shown as icons below the photos; icon names are lucide-react icons. */
  benefits?: Benefits;
};

export type Benefits = {
  headline: string;
  items: { icon: string; label: string }[];
  focus: { icon: string; title: string; points: string[] }[];
  steps: string[];
  diagram?: "light";
  badges: string[];
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
// Where no photo exists yet (body mass analyser) the image is an AAAyan placeholder card.
type Entry = { id: string; name: string; type: string; guide: string; description: string; photos: string[]; sectors: string[]; badge?: string; videos?: { src: string; poster: string }[] };

const media = (file: string) => `/images/products/${file.includes(".") ? file : `${file}.webp`}`;

const range: Entry[] = [
  { id: "hyperbaric-oxygen-hbot", name: "HBOT – Luxury Model", type: "Hyperbaric oxygen chamber", guide: "hbot-buying-guide", badge: "Star product", description: "Hard-shell and soft-shell hyperbaric oxygen chambers, from seated luxury models to compact home units.", photos: ["hyperbaric-oxygen-hbot.jpg", "diamond-gold", "diamond-5000-3", "hbot-5000-mono-suite", "hbot-5000-black-lounge", "hbot-blue-multiplace", "hbot-black-interior-seated"], videos: [{ src: "/videos/hbot-5000-mono.mp4", poster: "/videos/hbot-5000-mono-poster.webp" }], sectors: ["clinical-medical", "sports-performance", "gyms-spas-hotels", "personal-residential"] },
  { id: "whole-body-cryotherapy-chambers", name: "Whole Body Cryo", type: "Electric cryotherapy chamber", guide: "cryotherapy-buying-guide", description: "Nitrogen-free electric whole-body cryotherapy cabins.", photos: ["whole-body-cryo-cabin-purple", "whole-body-cryo-cabin-mist", "whole-body-cryotherapy-chambers.jpg", "wbc-4", "aurora-electric-1"], sectors: ["sports-performance", "gyms-spas-hotels", "clinical-medical"] },
  { id: "red-light-pbm-therapy-beds", name: "Red Light Bed", type: "Red light therapy bed", guide: "red-light-therapy-buying-guide", description: "Full-body red light therapy beds.", photos: ["red-light-pbm-therapy-beds.jpg", "red-light-pbm-therapy-beds-2.jpg", "red-light-bed-session", "red-light-bed-studio-white", "red-light-bed-clamshell", "red-light-bed-tunnel", "red-light-bed-poster-benefits", "red-light-bed-poster-full-body", "red-light-bed-poster-joints"], sectors: ["clinical-medical", "gyms-spas-hotels", "sports-performance"] },
  { id: "partial-body-cryo", name: "Partial Body Cryo", type: "Nitrogen cryotherapy cabin", guide: "cryotherapy-buying-guide", description: "Nitrogen cryo cabins with the head kept outside the chamber, including a portable model.", photos: ["partial-cryo-2", "aurora-portable-1"], sectors: ["sports-performance", "gyms-spas-hotels"] },
  { id: "ir-sauna-pod", name: "IR Sauna Pod", type: "Infrared sauna pod", guide: "installation-requirements", description: "Lie-down infrared sauna capsule with red light, a built-in control panel and the head kept outside.", photos: ["ir-sauna-capsule"], sectors: ["gyms-spas-hotels", "personal-residential"] },
  { id: "float-tanks-wet", name: "Sensory Float Pod", type: "Sensory floatation tank", guide: "installation-requirements", description: "Saltwater sensory floatation pod for spas and recovery studios.", photos: ["float-tanks-wet.jpg", "float-3", "float-4", "float-2", "relaxpod-2", "whalepod-1"], sectors: ["gyms-spas-hotels", "sports-performance", "personal-residential"] },
  { id: "localized-cryotherapy-chillers", name: "Localised Cryo", type: "Localised cryotherapy unit", guide: "cryotherapy-buying-guide", description: "Targeted cryotherapy unit with a flexible applicator hose.", photos: ["localized-cryotherapy-chillers.jpg"], sectors: ["sports-performance", "clinical-medical"] },
  { id: "cold-plunge", name: "Cold Plunge", type: "Cold plunge tub", guide: "installation-requirements", description: "Chilled, filtered cold plunge tubs.", photos: ["cold-plunge-1", "cold-plunge-2", "cold-plunge-5", "cold-plunge-4", "cold-plunge-3"], sectors: ["sports-performance", "gyms-spas-hotels", "personal-residential"] },
  { id: "red-light-panel", name: "Red Light Panel", type: "Red light therapy panel", guide: "red-light-therapy-buying-guide", description: "Free-standing full-body red light therapy panel.", photos: ["red-light-panel", "red-light-panel-3", "red-light-panel-2", "red-light-panel-range-red", "red-light-panel-range-studio", "red-light-panel-stands"], sectors: ["gyms-spas-hotels", "personal-residential"] },
  { id: "red-light-mask", name: "Red Light Mask", type: "LED face mask", guide: "red-light-therapy-buying-guide", description: "LED red light therapy face mask.", photos: ["red-light-mask"], sectors: ["gyms-spas-hotels", "personal-residential"] },
  { id: "dry-massage-bed", name: "Dry Massage Bed (Cold & Hot)", type: "Dry hydro-massage bed", guide: "build-your-centre", description: "Water-jet massage through a soft membrane, with hot and cold modes — the user stays fully clothed.", photos: ["dry-massage-bed-1", "dry-massage-bed-2", "dry-massage-bed-3", "dry-massage-bed-4"], sectors: ["gyms-spas-hotels", "personal-residential", "corporate-wellness"] },
  { id: "dry-float-beds", name: "Dry Float Bed", type: "Dry floatation bed", guide: "build-your-centre", description: "Zero-gravity dry floatation bed — a weightless feel without getting wet.", photos: ["dry-float-bed-2", "dry-float-bed-1", "dry-float-bed-4", "dry-float-bed-3"], sectors: ["gyms-spas-hotels", "corporate-wellness"] },
  { id: "bio-resonance-pod", name: "Bio Resonance Pod", type: "Wellness pod", guide: "build-your-centre", description: "Enclosed wellness pod with light and bio-resonance programmes.", photos: ["bio-resonance-pod", "bio-resonance-pod-2"], sectors: ["gyms-spas-hotels", "clinical-medical"] },
  { id: "infrared-sauna", name: "IR + FIR + Himalayan Salt Sauna Cabin", type: "Infrared sauna cabin", guide: "installation-requirements", description: "Infrared and far-infrared sauna cabins with a Himalayan salt option.", photos: ["infrared-sauna.jpg", "infrared-sauna-2.jpg", "sauna-cabin-3", "sauna-cabin-4", "sauna-cabin-6", "sauna-cabin-5", "sauna-cabin-7"], sectors: ["gyms-spas-hotels", "corporate-wellness", "personal-residential"] },
  { id: "nano-vi", name: "Nano VI", type: "Nano VI device", guide: "build-your-centre", description: "Compact tabletop Nano VI unit with a flexible breathing hose.", photos: ["nano-vi", "nano-vi-2", "nano-vi-3", "nano-vi-4"], sectors: ["clinical-medical", "personal-residential"] },
  { id: "hydrogen-inhalation", name: "Hydrogen Inhalation", type: "Hydrogen inhalation system", guide: "build-your-centre", description: "Molecular hydrogen generator for inhalation, on castors with a front control panel.", photos: ["hydrogen-generator-1", "hydrogen-generator-2", "hydrogen-generator-3"], sectors: ["clinical-medical", "personal-residential"] },
  { id: "hydrogen-bath", name: "Hydrogen Bath", type: "Hydrogen bath system", guide: "build-your-centre", description: "Hydrogen-rich water bath system.", photos: ["hydrogen-bath-3"], sectors: ["gyms-spas-hotels", "personal-residential"] },
  { id: "hypoxic-oxygen-inhalation", name: "Hypoxic Oxygen Inhalation", type: "Hypoxic air system", guide: "build-your-centre", description: "Intermittent hypoxic–hyperoxic training: the user breathes alternating low-oxygen (8–15%) and oxygen-rich (up to 36%) air while blood oxygen is monitored.", photos: ["hypoxic-oxygen-inhalation"], sectors: ["sports-performance", "clinical-medical"] },
  { id: "pemf", name: "PEMF Bed", type: "PEMF bed", guide: "build-your-centre", description: "Full-body PEMF bed.", photos: ["pemf.jpg", "pemf-2"], sectors: ["sports-performance", "clinical-medical", "gyms-spas-hotels"] },
  { id: "body-mass-analyser", name: "Body Mass Analyser", type: "Body composition analyser", guide: "build-your-centre", description: "Body composition and body mass analyser.", photos: ["body-mass-analyser"], sectors: ["clinical-medical", "gyms-spas-hotels", "sports-performance"] },
];

// Old product URLs that now point at another product (merged entries).
export const productAliases: Record<string, string> = { "whale-pod": "float-tanks-wet" };

// Health benefits for every product, worded as wellness support rather than medical claims.
// The Red Light Bed copy comes from the client's own posters; the rest is general wellness wording for the client to confirm.
// `steps` is the three-step "How it works"; `diagram: "light"` swaps in the animated red-light diagram.
const redLightSteps = ["Light reaches deep", "Cells absorb it", "Body recovers"];

const benefits: Record<string, Benefits> = {
  "hyperbaric-oxygen-hbot": {
    headline: "More oxygen, faster recovery.",
    items: [
      { icon: "HeartPulse", label: "Oxygen delivery" },
      { icon: "Bandage", label: "Wound healing support" },
      { icon: "Dumbbell", label: "Sports recovery" },
      { icon: "Brain", label: "Mental clarity" },
      { icon: "Flame", label: "Soothes inflammation" },
      { icon: "BatteryCharging", label: "Energy & vitality" },
    ],
    focus: [
      { icon: "Activity", title: "Recovery & healing", points: ["Tissue repair", "Post-surgery support", "Reduced swelling"] },
      { icon: "Brain", title: "Mind & energy", points: ["Focus", "Less fatigue", "Restful sleep"] },
    ],
    steps: ["Chamber pressurises", "Blood carries more oxygen", "Tissues repair"],
    badges: ["Non-invasive", "Seated or lying", "Clinic & home models"],
  },
  "whole-body-cryotherapy-chambers": {
    headline: "Three minutes of cold, a day of recovery.",
    items: [
      { icon: "Dumbbell", label: "Muscle recovery" },
      { icon: "Flame", label: "Soothes inflammation" },
      { icon: "Bandage", label: "Pain relief" },
      { icon: "Smile", label: "Mood boost" },
      { icon: "Moon", label: "Better sleep" },
      { icon: "BatteryCharging", label: "Energy boost" },
    ],
    focus: [
      { icon: "PersonStanding", title: "Athletic recovery", points: ["Less soreness", "Faster turnaround", "Joint comfort"] },
      { icon: "Smile", title: "Feel-good cold", points: ["Endorphin lift", "Alertness", "Sleep support"] },
    ],
    steps: ["Cabin chills to deep cold", "Skin cools, core stays warm", "Circulation rebounds"],
    badges: ["Nitrogen-free", "2–3 minute sessions", "Dry cold, no water"],
  },
  "red-light-pbm-therapy-beds": {
    headline: "One session, whole-body benefits.",
    items: [
      { icon: "Bandage", label: "Pain relief" },
      { icon: "Sparkles", label: "Anti-ageing" },
      { icon: "Smile", label: "Mood boost" },
      { icon: "ScanFace", label: "Skin health" },
      { icon: "Scale", label: "Weight loss support" },
      { icon: "Dumbbell", label: "Sports injury recovery" },
      { icon: "Flame", label: "Soothes inflammation" },
      { icon: "Moon", label: "Better sleep" },
      { icon: "HeartPulse", label: "Blood circulation" },
    ],
    focus: [
      { icon: "PersonStanding", title: "Full-body recovery", points: ["Muscle recovery", "Post-activity comfort", "Local circulation", "Sleep support"] },
      { icon: "Bone", title: "Joint vitality", points: ["Inflammation response", "Eases stiffness", "Long-term joint care"] },
    ],
    steps: redLightSteps,
    diagram: "light",
    badges: ["Non-invasive", "No patches needed", "Gentle & skin-friendly"],
  },
  "partial-body-cryo": {
    headline: "Cold therapy, head kept free.",
    items: [
      { icon: "Dumbbell", label: "Muscle recovery" },
      { icon: "Flame", label: "Soothes inflammation" },
      { icon: "Bandage", label: "Pain relief" },
      { icon: "ScanFace", label: "Skin tone" },
      { icon: "Smile", label: "Mood boost" },
      { icon: "Moon", label: "Better sleep" },
    ],
    focus: [
      { icon: "PersonStanding", title: "Body recovery", points: ["Less soreness", "Joint comfort", "Faster turnaround"] },
      { icon: "BatteryCharging", title: "Energy & mood", points: ["Endorphin lift", "Alertness", "Sleep support"] },
    ],
    steps: ["Body chills, head stays out", "Blood moves to the core", "Circulation rebounds"],
    badges: ["Head kept outside", "2–3 minute sessions", "Portable model available"],
  },
  "ir-sauna-pod": {
    headline: "Deep infrared warmth, lying down.",
    items: [
      { icon: "Droplets", label: "Detox through sweat" },
      { icon: "Dumbbell", label: "Muscle relaxation" },
      { icon: "HeartPulse", label: "Blood circulation" },
      { icon: "ScanFace", label: "Skin health" },
      { icon: "Moon", label: "Better sleep" },
      { icon: "Smile", label: "Stress relief" },
    ],
    focus: [
      { icon: "Thermometer", title: "Infrared heat", points: ["Deep warmth", "Gentle sweat", "Calorie burn support"] },
      { icon: "Sun", title: "Built-in red light", points: ["Skin glow", "Recovery", "Relaxation"] },
    ],
    steps: ["Infrared warms the body", "Red light reaches the skin", "Body sweats and relaxes"],
    diagram: "light",
    badges: ["Head kept outside", "Lie-down comfort", "Built-in controls"],
  },
  "float-tanks-wet": {
    headline: "Weightless rest for body and mind.",
    items: [
      { icon: "Smile", label: "Stress relief" },
      { icon: "Moon", label: "Better sleep" },
      { icon: "Bandage", label: "Pain relief" },
      { icon: "Brain", label: "Mental clarity" },
      { icon: "Dumbbell", label: "Muscle recovery" },
      { icon: "Focus", label: "Focus & creativity" },
    ],
    focus: [
      { icon: "Waves", title: "Zero-gravity body", points: ["Spine decompression", "Joint relief", "Magnesium-rich salt"] },
      { icon: "Brain", title: "Quiet mind", points: ["Deep relaxation", "Less anxiety", "Restful sleep"] },
    ],
    steps: ["Salt water holds you up", "Senses go quiet", "Body and mind reset"],
    badges: ["Epsom salt float", "Light & sound control", "Spa-grade filtration"],
  },
  "localized-cryotherapy-chillers": {
    headline: "Targeted cold, exactly where it hurts.",
    items: [
      { icon: "Bandage", label: "Pain relief" },
      { icon: "Flame", label: "Soothes inflammation" },
      { icon: "Dumbbell", label: "Sports injury recovery" },
      { icon: "Bone", label: "Joint comfort" },
      { icon: "ScanFace", label: "Skin tightening" },
      { icon: "Activity", label: "Less swelling" },
    ],
    focus: [
      { icon: "Target", title: "Spot treatment", points: ["Knees & shoulders", "Back & neck", "Sprains"] },
      { icon: "Sparkles", title: "Aesthetic use", points: ["Face & skin", "Firmer tone", "Post-treatment calm"] },
    ],
    steps: ["Cold air flows from the hose", "Skin chills in seconds", "Swelling and pain ease"],
    badges: ["Non-invasive", "Minutes per area", "Flexible applicator"],
  },
  "cold-plunge": {
    headline: "A daily cold reset.",
    items: [
      { icon: "Dumbbell", label: "Muscle recovery" },
      { icon: "Flame", label: "Soothes inflammation" },
      { icon: "Smile", label: "Mood boost" },
      { icon: "BatteryCharging", label: "Energy boost" },
      { icon: "Moon", label: "Better sleep" },
      { icon: "ShieldPlus", label: "Resilience" },
    ],
    focus: [
      { icon: "PersonStanding", title: "Physical recovery", points: ["Less soreness", "Faster turnaround", "Circulation"] },
      { icon: "Brain", title: "Mental grit", points: ["Alertness", "Stress tolerance", "Focus"] },
    ],
    steps: ["Water is chilled and filtered", "Body responds to cold", "Recovery and alertness rise"],
    badges: ["Chilled & filtered", "Year-round cold", "Home & studio models"],
  },
  "red-light-panel": {
    headline: "Red light, wherever you stand.",
    items: [
      { icon: "ScanFace", label: "Skin health" },
      { icon: "Sparkles", label: "Anti-ageing" },
      { icon: "Bandage", label: "Pain relief" },
      { icon: "Dumbbell", label: "Muscle recovery" },
      { icon: "Moon", label: "Better sleep" },
      { icon: "HeartPulse", label: "Blood circulation" },
    ],
    focus: [
      { icon: "PersonStanding", title: "Full-body light", points: ["Muscle recovery", "Joint comfort", "Circulation"] },
      { icon: "Sparkles", title: "Skin & glow", points: ["Collagen support", "Even tone", "Fewer fine lines"] },
    ],
    steps: redLightSteps,
    diagram: "light",
    badges: ["Non-invasive", "Free-standing", "Gentle & skin-friendly"],
  },
  "red-light-mask": {
    headline: "Clinic-style light for the face.",
    items: [
      { icon: "Sparkles", label: "Anti-ageing" },
      { icon: "ScanFace", label: "Skin health" },
      { icon: "Droplets", label: "Hydrated glow" },
      { icon: "Flame", label: "Calms redness" },
      { icon: "Smile", label: "Clearer skin" },
      { icon: "Timer", label: "Quick sessions" },
    ],
    focus: [
      { icon: "Sparkles", title: "Youthful skin", points: ["Collagen support", "Fewer fine lines", "Firmer feel"] },
      { icon: "ScanFace", title: "Clear complexion", points: ["Even tone", "Calmer skin", "Healthy glow"] },
    ],
    steps: redLightSteps,
    diagram: "light",
    badges: ["Non-invasive", "Hands-free", "Gentle & skin-friendly"],
  },
  "dry-massage-bed": {
    headline: "A water massage, fully clothed.",
    items: [
      { icon: "Dumbbell", label: "Muscle relaxation" },
      { icon: "Smile", label: "Stress relief" },
      { icon: "HeartPulse", label: "Blood circulation" },
      { icon: "Bandage", label: "Back pain relief" },
      { icon: "Moon", label: "Better sleep" },
      { icon: "Thermometer", label: "Hot & cold modes" },
    ],
    focus: [
      { icon: "Waves", title: "Hydro-massage", points: ["Rolling water jets", "Adjustable pressure", "Full-body cover"] },
      { icon: "Thermometer", title: "Hot & cold", points: ["Warm to relax", "Cool to recover", "Your choice per session"] },
    ],
    steps: ["Water jets move under the membrane", "Pressure kneads the muscles", "Body relaxes, stays dry"],
    badges: ["Stay fully clothed", "No therapist needed", "Hot & cold modes"],
  },
  "dry-float-beds": {
    headline: "Weightless, without getting wet.",
    items: [
      { icon: "Smile", label: "Stress relief" },
      { icon: "Moon", label: "Better sleep" },
      { icon: "Bandage", label: "Back pain relief" },
      { icon: "Brain", label: "Mental clarity" },
      { icon: "Dumbbell", label: "Muscle recovery" },
      { icon: "HeartPulse", label: "Blood circulation" },
    ],
    focus: [
      { icon: "Waves", title: "Zero-gravity feel", points: ["Spine decompression", "Joint relief", "Even support"] },
      { icon: "Brain", title: "Deep rest", points: ["Calm mind", "Less anxiety", "Restful sleep"] },
    ],
    steps: ["Warm water fills the bed", "Body sinks onto the membrane", "Muscles let go"],
    badges: ["Stay fully clothed", "No showering after", "Warm water support"],
  },
  "bio-resonance-pod": {
    headline: "A full reset in one enclosed pod.",
    items: [
      { icon: "Smile", label: "Stress relief" },
      { icon: "Moon", label: "Better sleep" },
      { icon: "BatteryCharging", label: "Energy & vitality" },
      { icon: "HeartPulse", label: "Blood circulation" },
      { icon: "ScanFace", label: "Skin health" },
      { icon: "Brain", label: "Mental clarity" },
    ],
    focus: [
      { icon: "Sun", title: "Light programmes", points: ["Colour light", "Skin glow", "Mood lift"] },
      { icon: "Activity", title: "Bio-resonance", points: ["Relaxation", "Balance", "Whole-body wellbeing"] },
    ],
    steps: ["Choose a programme", "Light and resonance work together", "Body rebalances"],
    badges: ["Non-invasive", "Pre-set programmes", "Enclosed comfort"],
  },
  "infrared-sauna": {
    headline: "Infrared heat with Himalayan salt.",
    items: [
      { icon: "Droplets", label: "Detox through sweat" },
      { icon: "Dumbbell", label: "Muscle relaxation" },
      { icon: "HeartPulse", label: "Blood circulation" },
      { icon: "Wind", label: "Easier breathing" },
      { icon: "ScanFace", label: "Skin health" },
      { icon: "Moon", label: "Better sleep" },
    ],
    focus: [
      { icon: "Thermometer", title: "IR & far-infrared", points: ["Deep warmth", "Gentle sweat", "Joint comfort"] },
      { icon: "Mountain", title: "Himalayan salt", points: ["Salt-air ambience", "Calm atmosphere", "Respiratory comfort"] },
    ],
    steps: ["Infrared warms the body directly", "Core temperature rises gently", "Body sweats and unwinds"],
    badges: ["Lower air temperature", "Cabin sizes for 1–4", "Salt wall option"],
  },
  "nano-vi": {
    headline: "Breathe in, support repair.",
    items: [
      { icon: "ShieldPlus", label: "Cell protection" },
      { icon: "BatteryCharging", label: "Energy & vitality" },
      { icon: "Dumbbell", label: "Sports recovery" },
      { icon: "Brain", label: "Mental clarity" },
      { icon: "Moon", label: "Better sleep" },
      { icon: "Sparkles", label: "Healthy ageing" },
    ],
    focus: [
      { icon: "ShieldPlus", title: "Cell care", points: ["Oxidative stress", "Natural repair", "Healthy ageing"] },
      { icon: "Activity", title: "Performance", points: ["Recovery", "Endurance", "Daily energy"] },
    ],
    steps: ["Device energises humid air", "You breathe it through the hose", "Cells support repair"],
    badges: ["Drug-free", "Breathe at rest", "Tabletop unit"],
  },
  "hydrogen-inhalation": {
    headline: "Molecular hydrogen, breathed in.",
    items: [
      { icon: "ShieldPlus", label: "Antioxidant support" },
      { icon: "Flame", label: "Soothes inflammation" },
      { icon: "BatteryCharging", label: "Energy & vitality" },
      { icon: "Dumbbell", label: "Sports recovery" },
      { icon: "Brain", label: "Mental clarity" },
      { icon: "Moon", label: "Better sleep" },
    ],
    focus: [
      { icon: "ShieldPlus", title: "Cell protection", points: ["Oxidative stress", "Inflammation response", "Healthy ageing"] },
      { icon: "Activity", title: "Recovery", points: ["Less fatigue", "Post-exercise", "Daily wellbeing"] },
    ],
    steps: ["Water splits into hydrogen", "You breathe it through a cannula", "Hydrogen reaches the cells"],
    badges: ["Drug-free", "Breathe at rest", "Mobile on castors"],
  },
  "hydrogen-bath": {
    headline: "Soak in hydrogen-rich water.",
    items: [
      { icon: "ScanFace", label: "Skin health" },
      { icon: "ShieldPlus", label: "Antioxidant support" },
      { icon: "Smile", label: "Stress relief" },
      { icon: "Dumbbell", label: "Muscle relaxation" },
      { icon: "Moon", label: "Better sleep" },
      { icon: "HeartPulse", label: "Blood circulation" },
    ],
    focus: [
      { icon: "Droplets", title: "Skin & glow", points: ["Soft skin", "Hydration", "Even tone"] },
      { icon: "Smile", title: "Unwind", points: ["Warm soak", "Muscle ease", "Restful sleep"] },
    ],
    steps: ["System infuses the water", "Skin absorbs hydrogen", "Body relaxes and restores"],
    badges: ["Non-invasive", "Fits standard tubs", "Spa & home use"],
  },
  "hypoxic-oxygen-inhalation": {
    headline: "Altitude training at sea level.",
    items: [
      { icon: "Mountain", label: "Altitude adaptation" },
      { icon: "Activity", label: "Endurance" },
      { icon: "HeartPulse", label: "Heart & circulation" },
      { icon: "BatteryCharging", label: "Energy & vitality" },
      { icon: "Scale", label: "Metabolic health" },
      { icon: "Brain", label: "Mental clarity" },
    ],
    focus: [
      { icon: "Activity", title: "Performance", points: ["Stamina", "Oxygen efficiency", "Recovery"] },
      { icon: "HeartPulse", title: "Healthy ageing", points: ["Circulation", "Metabolism", "Resilience"] },
    ],
    steps: ["Breathe low-oxygen air", "Switch to oxygen-rich air", "Body adapts and strengthens"],
    badges: ["Blood oxygen monitored", "Breathe at rest", "Guided programmes"],
  },
  pemf: {
    headline: "Gentle pulses, full-body recovery.",
    items: [
      { icon: "Bandage", label: "Pain relief" },
      { icon: "Bone", label: "Bone & joint health" },
      { icon: "Moon", label: "Better sleep" },
      { icon: "HeartPulse", label: "Blood circulation" },
      { icon: "Dumbbell", label: "Muscle recovery" },
      { icon: "BatteryCharging", label: "Energy & vitality" },
    ],
    focus: [
      { icon: "Zap", title: "Cell energy", points: ["Cell activity", "Recovery", "Circulation"] },
      { icon: "Bone", title: "Joint & bone", points: ["Eases stiffness", "Joint comfort", "Mobility"] },
    ],
    steps: ["Bed sends magnetic pulses", "Pulses pass through the body", "Cells recharge"],
    badges: ["Non-invasive", "Lie down, fully clothed", "Silent sessions"],
  },
  "body-mass-analyser": {
    headline: "Know your body, track your progress.",
    items: [
      { icon: "Scale", label: "Body fat %" },
      { icon: "Dumbbell", label: "Muscle mass" },
      { icon: "Droplets", label: "Body water" },
      { icon: "Flame", label: "Metabolic rate" },
      { icon: "Bone", label: "Bone mass" },
      { icon: "ChartLine", label: "Progress tracking" },
    ],
    focus: [
      { icon: "Target", title: "Set goals", points: ["Fat loss", "Muscle gain", "Healthy weight"] },
      { icon: "ChartLine", title: "Track change", points: ["Session reports", "Trends over time", "Client records"] },
    ],
    steps: ["Stand on the analyser", "Sensors read body composition", "Get an instant report"],
    badges: ["Non-invasive", "Results in seconds", "Printable reports"],
  },
};

// Each product is its own category: the nav and the /products?modality= filter link straight to it.
export const categories = range.map(({ id, name, guide }) => ({ name, slug: id, label: name, guide }));

export const catalogue: Product[] = range.map(({ photos, guide: _guide, ...item }) => {
  const images = photos.map(media);
  return { ...item, headline: "", category: item.name, categorySlug: item.id, specs: [], features: [], gains: [], image: images[0], images, gallery: images, benefits: benefits[item.id] };
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
