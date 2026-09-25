import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const out = "C:/Yugaas/aaayanimmunotech/client/public/images/placeholders";
mkdirSync(out, { recursive: true });

const soft = (l) => `fill="${l}" fill-opacity="0.08"`;

const art = {
  hbot: (l) => `
<rect x="230" y="500" width="740" height="230" rx="115" ${soft(l)}/>
<path d="M345 505V725M855 505V725"/>
<circle cx="470" cy="600" r="36"/><circle cx="600" cy="600" r="36"/><circle cx="730" cy="600" r="36"/>
<path d="M330 730L300 770M870 730L900 770"/>
<circle cx="1050" cy="520" r="44"/><path d="M1050 520L1074 494M1050 564V770M1010 770H1090"/>`,
  cryo: (l) => `
<rect x="440" y="250" width="320" height="515" rx="46" ${soft(l)}/>
<rect x="495" y="320" width="210" height="260" rx="24"/>
<path d="M520 290H680M600 620V700"/><circle cx="600" cy="660" r="10"/>
<path d="M830 460q30-30 0-60t0-60M890 500q30-30 0-60t0-60" stroke-opacity="0.55"/>
<rect x="230" y="440" width="130" height="210" rx="14" ${soft(l)}/><path d="M262 480H328M262 520H328M262 560H310"/>`,
  redlight: (l) => `
<rect x="210" y="620" width="780" height="110" rx="34" ${soft(l)}/>
<path d="M230 610C330 380 870 380 970 610"/>
<path d="M270 610C370 430 830 430 930 610" stroke-opacity="0.45"/>
<g stroke="#ff7a66" stroke-opacity="0.75" stroke-width="3"><path d="M420 530V600M510 500V600M600 490V600M690 500V600M780 530V600"/></g>
<path d="M270 730V770M930 730V770"/>`,
  plunge: (l) => `
<path d="M230 540H970L930 765H270Z" ${soft(l)}/>
<path d="M270 600q40-18 80 0t80 0t80 0t80 0t80 0t80 0t80 0t80 0t80 0"/>
<path d="M300 660q40-18 80 0t80 0t80 0t80 0t80 0t80 0t80 0" stroke-opacity="0.45"/>
<path d="M230 540V460H280"/>
<rect x="1000" y="600" width="130" height="165" rx="12" ${soft(l)}/><path d="M1030 640H1100M1030 680H1080M1000 700H948"/>`,
  compression: (l) => `
<path d="M330 330C330 300 420 300 420 330L440 690C440 740 300 750 260 730C230 715 250 690 300 690Z" ${soft(l)}/>
<path d="M515 330C515 300 605 300 605 330L625 690C625 740 485 750 445 730C415 715 435 690 485 690Z" ${soft(l)}/>
<path d="M340 420H415M345 510H425M350 600H432M525 420H600M530 510H610M535 600H617" stroke-opacity="0.5"/>
<rect x="790" y="520" width="240" height="245" rx="22" ${soft(l)}/>
<rect x="825" y="555" width="170" height="90" rx="10"/>
<circle cx="860" cy="705" r="16"/><circle cx="960" cy="705" r="16"/>
<path d="M790 600C710 600 700 380 610 370M790 640C690 640 700 470 610 460" stroke-opacity="0.7"/>`,
};

const palettes = {
  hbot: { bg1: "#132F4F", bg2: "#1F4A73", glow: "#C5A059", line: "#efe3c4" },
  cryo: { bg1: "#132F4F", bg2: "#1E5270", glow: "#bcd9d6", line: "#e6f2f0" },
  redlight: { bg1: "#132F4F", bg2: "#3A4A63", glow: "#ff7a66", line: "#f6dcd3" },
  plunge: { bg1: "#132F4F", bg2: "#1D4F70", glow: "#9ecdd3", line: "#e4f1f2" },
  compression: { bg1: "#132F4F", bg2: "#34506A", glow: "#d3b99a", line: "#f1e6d8" },
};

const icons = {
  cross: `<path d="M580 240h40v60h60v40h-60v60h-40v-60h-60v-40h60z"/>`,
  house: `<path d="M470 400L600 280L730 400M500 380V470H700V380M575 470V420H625V470"/>`,
  skyline: `<path d="M420 470V340H500V470M520 470V260H620V470M640 470V370H760V470M400 470H780"/><path d="M445 370H475M445 410H475M550 300H590M550 340H590M550 380H590M670 400H730" stroke-opacity="0.5"/>`,
  stopwatch: `<circle cx="600" cy="380" r="85"/><path d="M600 380L640 330M575 275H625M600 275V295"/>`,
  sun: `<circle cx="600" cy="360" r="55"/><path d="M600 270V245M600 475V450M510 360H485M715 360H690M536 296L518 278M682 442L664 424M536 424L518 442M682 278L664 296"/>`,
};

const scenes = [];

// One labelled placeholder per catalogue product, drawn in its modality.
[
  ["oxyl-25", "OXYL-25 Suite", "hbot"],
  ["cryoduo-6", "CryoDuo Elite 6", "cryo"],
  ["max-miracle-9600", "Max Miracle 9600", "redlight"],
  ["life-capsul-l1s", "Life Capsul L-1S", "hbot"],
  ["life-capsul-l2s", "Life Capsul L-2S", "hbot"],
  ["cryoduo-4", "CryoDuo 4 Chamber", "cryo"],
  ["miracle-6200", "Miracle 6200", "redlight"],
  ["miracle-5040", "Miracle 5040", "redlight"],
  ["superhuman-suite", "Superhuman Suite", "redlight"],
  ["longevity-suite", "Longevity Suite", "redlight"],
  ["recovery-suite", "Recovery Suite", "redlight"],
  ["commercial-cold-plunge", "Commercial Cold Plunge", "plunge"],
  ["compression-therapy-system", "Compression Therapy System", "compression"],
].forEach(([id, label, modality]) => scenes.push({ file: `product-${id}`, label, ...palettes[modality], body: art[modality] }));

[
  ["hyperbaric-oxygen-chambers", "Hyperbaric Oxygen Chambers", "hbot"],
  ["cryotherapy-chambers", "Cryotherapy Chambers", "cryo"],
  ["red-light-therapy", "Red Light Therapy", "redlight"],
  ["cold-plunge", "Cold Plunge", "plunge"],
  ["compression-therapy", "Compression Therapy", "compression"],
].forEach(([slug, label, modality]) => scenes.push({ file: `category-${slug}`, label, ...palettes[modality], body: art[modality] }));

[
  ["clinical-medical", "Clinical &amp; Medical", "cross", "hbot", { bg1: "#132F4F", bg2: "#1F4A73", glow: "#C5A059", line: "#efe8d6" }],
  ["gyms-spas-hotels", "Gyms, Spas &amp; Hotels", "sun", "plunge", { bg1: "#132F4F", bg2: "#3D5270", glow: "#e7c98f", line: "#f5ead6" }],
  ["sports-performance", "Sports &amp; Performance", "stopwatch", "cryo", { bg1: "#132F4F", bg2: "#2B557F", glow: "#b8dcb9", line: "#e5f1e6" }],
  ["corporate-wellness", "Corporate Wellness", "skyline", "compression", { bg1: "#132F4F", bg2: "#1E4466", glow: "#b7c6d8", line: "#e6ecf3" }],
  ["personal-residential", "Personal &amp; Residential", "house", "redlight", { bg1: "#132F4F", bg2: "#394B66", glow: "#ff9b7f", line: "#f3e4d2" }],
].forEach(([slug, label, icon, modality, palette]) => scenes.push({ file: `sector-${slug}`, label, ...palette, body: (l) => `${icons[icon]}<g transform="translate(180 250) scale(0.7)">${art[modality](l)}</g>` }));

for (const s of scenes) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1000" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${s.label} placeholder">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${s.bg1}"/><stop offset="1" stop-color="${s.bg2}"/></linearGradient>
<radialGradient id="glow" cx="0.5" cy="0.58" r="0.55"><stop offset="0" stop-color="${s.glow}" stop-opacity="0.42"/><stop offset="1" stop-color="${s.glow}" stop-opacity="0"/></radialGradient>
<pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" stroke="${s.line}" stroke-opacity="0.05"/></pattern>
</defs>
<rect width="1200" height="1000" fill="url(#bg)"/>
<rect width="1200" height="1000" fill="url(#grid)"/>
<rect width="1200" height="1000" fill="url(#glow)"/>
<path d="M300 770V330a300 300 0 0 1 600 0v440" fill="none" stroke="${s.line}" stroke-opacity="0.14" stroke-width="2"/>
<path d="M0 770H1200" stroke="${s.line}" stroke-opacity="0.22" stroke-width="2"/>
<ellipse cx="600" cy="790" rx="430" ry="34" fill="#0A1C33" fill-opacity="0.18"/>
<g fill="none" stroke="${s.line}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${s.body(s.line)}</g>
<text x="60" y="930" font-family="Georgia, 'Times New Roman', serif" font-size="34" fill="${s.line}" fill-opacity="0.8" letter-spacing="4">${s.label}</text>
<text x="1140" y="930" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="${s.line}" fill-opacity="0.45" letter-spacing="5">PLACEHOLDER IMAGE</text>
</svg>
`;
  writeFileSync(join(out, `${s.file}.svg`), svg);
}
console.log(`wrote ${scenes.length} placeholders to ${out}`);
