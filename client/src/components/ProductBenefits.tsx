import { Bandage, Bone, Check, CircleSlash, Dumbbell, Feather, Flame, HeartPulse, Moon, PersonStanding, Scale, ScanFace, ShieldCheck, Smile, Sparkles, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import type { Benefits } from "@/data/site";

const icons: Record<string, LucideIcon> = { Bandage, Bone, Dumbbell, Flame, HeartPulse, Moon, PersonStanding, Scale, ScanFace, Smile, Sparkles };
const badgeIcons = [ShieldCheck, CircleSlash, Feather];

const reveal = (index: number) => ({ initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.3 }, transition: { duration: 0.5, delay: index * 0.05 } });

// Light from the bed's panel reaching down through skin and muscle to the cells' mitochondria.
function LightDiagram() {
  // Ray x positions and how deep each reaches: red light stops in the skin and muscle, some reaches the cells.
  const rays = [[96, 118], [128, 168], [160, 214], [192, 150], [224, 214], [256, 126], [288, 214], [320, 170]] as const;
  const cells = [[110, 236], [168, 250], [302, 246], [340, 232]];
  return <svg viewBox="0 0 360 280" className="w-full" role="img" aria-label="Red light passing through the skin and muscle to the mitochondria in the cells">
    <defs>
      <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff5a4a" stopOpacity=".95" /><stop offset="1" stopColor="#ff5a4a" stopOpacity="0" /></linearGradient>
      <linearGradient id="halo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff5a4a" stopOpacity=".35" /><stop offset="1" stopColor="#ff5a4a" stopOpacity="0" /></linearGradient>
      <radialGradient id="glow"><stop offset="0" stopColor="#C5A059" stopOpacity=".6" /><stop offset="1" stopColor="#C5A059" stopOpacity="0" /></radialGradient>
      <pattern id="fibres" width="18" height="12" patternUnits="userSpaceOnUse"><path d="M0 9 q9 -8 18 0" fill="none" stroke="#e8a090" strokeOpacity=".22" strokeWidth="1" /></pattern>
    </defs>
    <rect x="80" y="26" width="270" height="36" fill="url(#halo)" />
    <rect x="80" y="12" width="270" height="16" rx="8" fill="#2E0A10" stroke="#ff5a4a" strokeOpacity=".55" />
    {Array.from({ length: 22 }, (_, i) => <circle key={i} cx={91 + i * 12} cy="20" r="2.4" fill="#ff5a4a" />)}

    <path d="M72 80 q12 -5 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 V128 H72 Z" fill="#e8a090" fillOpacity=".22" />
    <path d="M72 80 q12 -5 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0" fill="none" stroke="#f4c3b4" strokeOpacity=".7" strokeWidth="1.4" />
    <rect x="72" y="128" width="288" height="66" fill="#e8a090" fillOpacity=".1" />
    <rect x="72" y="128" width="288" height="66" fill="url(#fibres)" />
    <rect x="72" y="194" width="288" height="86" fill="#f4f1ea" fillOpacity=".04" />
    {[128, 194].map((y) => <line key={y} x1="72" x2="360" y1={y} y2={y} stroke="#f4f1ea" strokeOpacity=".2" strokeDasharray="3 4" />)}
    {cells.map(([cx, cy]) => <g key={cx}><circle cx={cx} cy={cy} r="15" fill="none" stroke="#f4f1ea" strokeOpacity=".22" /><circle cx={cx} cy={cy} r="4" fill="#f4f1ea" fillOpacity=".15" /></g>)}

    {[["Skin", 98], ["Muscle", 156], ["& joints", 168], ["Cells", 232]].map(([label, y]) => <text key={label} x="0" y={y} fill="#f4f1ea" fillOpacity=".65" fontSize="9" letterSpacing="1.6">{String(label).toUpperCase()}</text>)}

    {rays.map(([x, depth], i) => <g key={x}>
      <rect x={x - 1.5} y="30" width="3" rx="1.5" height={depth - 30} fill="url(#ray)" />
      <motion.circle cx={x} r="2.6" fill="#ffb4a6" initial={{ cy: 32, opacity: 0 }} animate={{ cy: [32, depth - 6], opacity: [0, 1, 0] }} transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.22, ease: "easeIn" }} />
    </g>)}

    <circle cx="232" cy="238" r="44" fill="url(#glow)" />
    <circle cx="232" cy="238" r="30" fill="none" stroke="#f4f1ea" strokeOpacity=".3" />
    <g transform="translate(232 238) rotate(-12)">
      <ellipse rx="22" ry="11" fill="#2E0A10" stroke="#C5A059" strokeWidth="1.6" />
      <path d="M-16 0 q3 -8 6.5 0 t6.5 0 t6.5 0 t6.5 0 t6.5 0" fill="none" stroke="#C5A059" strokeWidth="1.3" />
    </g>
    {[[-14, 0], [0, 0.6], [14, 1.2]].map(([dx, delay]) => <motion.circle key={dx} cx={232 + dx} r="2" fill="#C5A059" initial={{ cy: 222, opacity: 0 }} animate={{ cy: [222, 202], opacity: [0, 1, 0] }} transition={{ duration: 1.8, repeat: Infinity, delay }} />)}
    <text x="232" y="276" textAnchor="middle" fill="#C5A059" fontSize="8.5" letterSpacing="1.6">MITOCHONDRIA · CELL ENERGY</text>
  </svg>;
}

export function ProductBenefits({ benefits }: { benefits: Benefits }) {
  return <section className="mt-20 lg:mt-24">
    <div className="mb-8 border-b border-[#4E141D]/15 pb-5">
      <div className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059]">Health benefits</div>
      <h2 className="mt-3 font-serif text-[clamp(2rem,3.4vw,3rem)] leading-[1] tracking-[-0.02em]">{benefits.headline}</h2>
    </div>

    <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {benefits.items.map((item, index) => {
            const Icon = icons[item.icon] ?? Sparkles;
            return <motion.div key={item.label} {...reveal(index)} className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#4E141D]/10 bg-white/55 px-2 py-5 text-center sm:py-6 lg:flex-row lg:justify-start lg:gap-4 lg:px-5 lg:text-left">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#4E141D] text-[#C5A059] sm:h-12 sm:w-12"><Icon size={22} strokeWidth={1.6} /></span>
              <span className="text-[10px] uppercase leading-snug tracking-[0.12em] sm:text-[11px]">{item.label}</span>
            </motion.div>;
          })}
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-1">
          {benefits.focus.map((focus, index) => {
            const Icon = icons[focus.icon] ?? Sparkles;
            return <motion.div key={focus.title} {...reveal(index)} className="flex items-start gap-5 rounded-2xl bg-[#e9e4da] p-6 sm:p-7">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#C5A059]/60 text-[#4E141D]"><Icon size={26} strokeWidth={1.5} /></span>
              <div>
                <h3 className="font-serif text-2xl leading-tight">{focus.title}</h3>
                <div className="mt-3 flex flex-wrap gap-2">{focus.points.map((point) => <span key={point} className="inline-flex items-center gap-1.5 rounded-full bg-[#f4f1ea] px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-[#4f4b43]"><Check size={12} className="text-[#C5A059]" />{point}</span>)}</div>
              </div>
            </motion.div>;
          })}
        </div>
      </div>

      <motion.div {...reveal(0)} className="flex flex-col rounded-2xl bg-[#4E141D] p-6 text-white sm:p-8">
        <div className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059]">How it works</div>
        <div className="mt-5 flex flex-1 items-center"><LightDiagram /></div>
        <ol className="mt-6 grid grid-cols-3 gap-3 border-t border-white/15 pt-5">
          {["Light reaches deep", "Cells absorb it", "Body recovers"].map((step, index) => <li key={step}>
            <div className="text-[10px] tracking-[0.2em] text-[#C5A059]">0{index + 1}</div>
            <div className="mt-1.5 text-[11px] uppercase leading-snug tracking-[0.1em] text-white/85">{step}</div>
          </li>)}
        </ol>
      </motion.div>
    </div>

    <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-[#C5A059]/40 px-6 py-5">
      {benefits.badges.map((badge, index) => {
        const Icon = badgeIcons[index % badgeIcons.length];
        return <span key={badge} className="inline-flex items-center gap-2.5 text-[10px] uppercase tracking-[0.16em]"><Icon size={18} strokeWidth={1.6} className="text-[#C5A059]" />{badge}</span>;
      })}
    </div>
    <p className="mt-4 text-center text-[11px] text-[#8a7657]">Wellness support; individual results vary. Not a substitute for medical advice.</p>
  </section>;
}
