import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { pad } from "@/components/SiteChrome";

const photo = (name: string) => `/images/photos/${name}.webp`;

// Real equipment photography (1164–1600px) — large enough for a full-bleed hero.
const heroSlides = [
  { image: photo("hbot-chamber-residence"), alt: "Hard shell hyperbaric oxygen chamber installed in a private residence", eyebrow: "Hyperbaric oxygen", title: "Hard shell HBOT chambers", href: "/equipment/hyperbaric-oxygen-chambers" },
  { image: photo("red-light-panel"), alt: "Full body red light therapy panel in use", eyebrow: "Photobiomodulation", title: "Full body red light therapy", href: "/equipment/red-light-therapy" },
  { image: photo("hbot-multiplace-interior"), alt: "Seating inside a walk-in multiplace hyperbaric chamber", eyebrow: "Multiplace HBOT", title: "Walk-in chambers for group sessions", href: "/equipment/hyperbaric-oxygen-chambers" },
  { image: photo("red-light-bed"), alt: "Commercial red light therapy bed with the canopy open", eyebrow: "Red light therapy beds", title: "Commercial PBM beds", href: "/equipment/red-light-therapy" },
];

const gallery = [
  { image: photo("red-light-cryo-suite"), tag: "Recovery suite", title: "Red light and cryotherapy suite", href: "/equipment/cryotherapy-chambers" },
  { image: photo("clinic-chambers"), tag: "Clinical", title: "Clinical chamber suite", href: "/sectors/clinical-medical" },
  { image: photo("hbot-multiplace-interior"), tag: "Hyperbaric", title: "Multiplace HBOT interior", href: "/equipment/hyperbaric-oxygen-chambers" },
  { image: photo("lounge-private"), tag: "Private", title: "Private recovery lounge", href: "/sectors/personal-residential" },
  { image: photo("recovery-centre"), tag: "Commercial", title: "Commercial recovery centre", href: "/sectors/gyms-spas-hotels" },
  { image: photo("red-light-bed"), tag: "Photobiomodulation", title: "Red light therapy bed", href: "/equipment/red-light-therapy" },
  { image: photo("recovery-lounge-skyline"), tag: "Corporate", title: "Corporate recovery lounge", href: "/sectors/corporate-wellness" },
  { image: photo("sector-sports"), tag: "Performance", title: "Performance recovery floor", href: "/sectors/sports-performance" },
  { image: photo("hbot-chamber-residence"), tag: "Residential", title: "Hyperbaric chamber at home", href: "/sectors/personal-residential" },
  { image: photo("sector-hospitality"), tag: "Hospitality", title: "Hotel spa and recovery deck", href: "/sectors/gyms-spas-hotels" },
  { image: photo("residence-pod"), tag: "Residential", title: "Private residence suite", href: "/sectors/personal-residential" },
];

const arrowButton = "flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-[#C5A059] hover:bg-[#C5A059] hover:text-[#133E2F]";

export function HeroCarousel({ onExplore, onEnquire }: { onExplore: () => void; onEnquire: () => void }) {
  const [viewportRef, embla] = useEmblaCarousel({ loop: true, duration: 34 });
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    onSelect();
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla]);

  // Autoplay restarts after every slide change, pauses on hover, and respects reduced motion.
  useEffect(() => {
    if (!embla || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => embla.scrollNext(), 6000);
    return () => window.clearInterval(timer);
  }, [embla, paused, selected]);

  const slide = heroSlides[selected];

  return <section className="relative h-[92vh] min-h-[640px] max-h-[980px] overflow-hidden bg-[#133E2F] text-[#f9f7f1]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-roledescription="carousel" aria-label="Featured equipment">
    <div ref={viewportRef} className="absolute inset-0 overflow-hidden">
      <div className="flex h-full">
        {heroSlides.map((item, index) => <div key={item.image} className="relative h-full min-w-0 flex-[0_0_100%] overflow-hidden" aria-roledescription="slide" aria-label={`${index + 1} of ${heroSlides.length}`}>
          <img src={item.image} alt={item.alt} loading={index === 0 ? "eager" : "lazy"} className={`h-full w-full object-cover transition-transform duration-[7000ms] ease-out ${index === selected ? "scale-110" : "scale-100"}`} />
        </div>)}
      </div>
    </div>
    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(10,42,31,.88)_0%,rgba(10,42,31,.5)_45%,rgba(10,42,31,.08)_100%)]" />
    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(10,42,31,.85)_0%,transparent_42%)]" />

    <div className="pointer-events-none relative mx-auto flex h-full max-w-[1440px] flex-col justify-between px-5 pb-8 pt-32 lg:px-16 lg:pb-10">
      <div className="pointer-events-auto max-w-[640px]">
        <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-[#d7c79e]"><span className="h-px w-10 bg-[#d7c79e]" /> Recovery · Performance · Longevity</div>
        <h1 className="font-serif text-[clamp(3.2rem,7vw,7.5rem)] leading-[.88] tracking-[-0.045em]">Recovery equipment, <em className="font-light text-[#d6c6a1]">elevated.</em></h1>
        <p className="mt-6 max-w-[420px] text-[15px] leading-7 text-white/75">Hyperbaric, cryotherapy and red light systems — supplied and installed across India.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={onExplore} className="group inline-flex items-center gap-3 bg-[#C5A059] px-5 py-3.5 text-[10px] uppercase tracking-[0.18em] text-[#133E2F] transition hover:bg-[#f4e9cc]">Explore systems <ArrowRight size={14} className="transition group-hover:translate-x-1" /></button>
          <button onClick={onEnquire} className="inline-flex items-center gap-3 border border-white/35 px-5 py-3.5 text-[10px] uppercase tracking-[0.18em] text-white transition hover:border-white hover:bg-white/10">Talk to a specialist</button>
        </div>
      </div>

      <div className="pointer-events-auto flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <Link href={slide.href} className="group block max-w-[380px]" aria-live="polite">
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#C5A059]">{pad(selected)} / {pad(heroSlides.length - 1)} · {slide.eyebrow}</div>
          <div className="mt-2 flex items-center gap-3 font-serif text-2xl leading-tight">{slide.title}<ArrowRight size={16} className="shrink-0 transition group-hover:translate-x-1" /></div>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden gap-2 md:flex">{heroSlides.map((item, index) => <button key={item.image} onClick={() => embla?.scrollTo(index)} aria-label={`Show ${item.title}`} aria-current={index === selected} className={`relative h-14 w-20 overflow-hidden border transition ${index === selected ? "border-[#C5A059] opacity-100" : "border-white/20 opacity-55 hover:opacity-90"}`}><img src={item.image} alt="" className="h-full w-full object-cover" /></button>)}</div>
          <div className="flex gap-2"><button onClick={() => embla?.scrollPrev()} className={arrowButton} aria-label="Previous slide"><ArrowLeft size={16} /></button><button onClick={() => embla?.scrollNext()} className={arrowButton} aria-label="Next slide"><ArrowRight size={16} /></button></div>
        </div>
      </div>
    </div>
  </section>;
}

export function GalleryCarousel() {
  const [viewportRef, embla] = useEmblaCarousel({ align: "start", dragFree: true, containScroll: "trimSnaps" });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const onScroll = () => setProgress(Math.max(0, Math.min(1, embla.scrollProgress())));
    onScroll();
    embla.on("scroll", onScroll).on("reInit", onScroll);
    return () => {
      embla.off("scroll", onScroll).off("reInit", onScroll);
    };
  }, [embla]);

  return <section id="gallery" className="scroll-mt-20 overflow-hidden bg-[#133E2F] py-20 text-[#f6f1e8] lg:py-28">
    <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 px-5 lg:flex-row lg:items-end lg:px-16">
      <div><div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#C5A059]">Gallery</div><h2 className="font-serif text-[clamp(2.8rem,5vw,5.5rem)] leading-[.9] tracking-[-0.04em]">Spaces, <em className="font-light text-[#C5A059]">in detail.</em></h2></div>
      <div className="flex items-center gap-2"><button onClick={() => embla?.scrollPrev()} className={arrowButton} aria-label="Previous images"><ArrowLeft size={16} /></button><button onClick={() => embla?.scrollNext()} className={arrowButton} aria-label="Next images"><ArrowRight size={16} /></button></div>
    </div>
    <div ref={viewportRef} className="mt-12 overflow-hidden">
      <div className="flex gap-4 px-5 lg:px-16">
        {gallery.map((item, index) => <Link key={`${item.image}-${index}`} href={item.href} className="group relative aspect-[4/5] min-w-0 flex-[0_0_78%] overflow-hidden bg-[#1A4731] sm:flex-[0_0_46%] lg:flex-[0_0_31%] xl:flex-[0_0_24%]">
          <img src={item.image} alt={item.title} loading="lazy" draggable={false} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2A1F]/85 via-[#0A2A1F]/10 to-transparent" />
          <div className="absolute inset-x-5 bottom-5"><div className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059]">{pad(index)} / {item.tag}</div><div className="mt-2 flex items-center justify-between gap-3 font-serif text-2xl leading-tight">{item.title}<ArrowRight size={15} className="shrink-0 transition group-hover:translate-x-1" /></div></div>
        </Link>)}
      </div>
    </div>
    <div className="mx-auto mt-10 max-w-[1440px] px-5 lg:px-16"><div className="h-px w-full bg-white/15"><div className="h-px bg-[#C5A059] transition-[width] duration-150" style={{ width: `${Math.max(6, progress * 100)}%` }} /></div></div>
  </section>;
}
