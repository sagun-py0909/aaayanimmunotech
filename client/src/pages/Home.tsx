import { useState, type FormEvent } from "react";
import { ArrowRight, Check, CircleHelp, MessageCircle, Phone, ShoppingBag, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import { GalleryCarousel, HeroCarousel } from "@/components/PhotoCarousels";
import { ProductCard, SiteFooter, SiteHeader, StatsStrip, pad } from "@/components/SiteChrome";
import { catalogue, contact, guideGroups, guideLabels, guides, sectors } from "@/data/site";

const modalities = [
  { href: "/equipment/hyperbaric-oxygen-chambers", title: "Hyperbaric oxygen chambers", body: "hard shell monoplace and multiplace HBOT chambers up to 3 ATA." },
  { href: "/equipment/cryotherapy-chambers", title: "Whole body cryotherapy chambers", body: "electric, nitrogen free, four and six occupant systems." },
  { href: "/equipment/red-light-therapy", title: "Red light therapy beds", body: "full body photobiomodulation at 660nm and 850nm." },
  { href: "/equipment/cold-plunge", title: "Commercial cold plunge and compression therapy", body: "the stations that complete a circuit." },
];

const featuredProducts = catalogue.slice(0, 6);

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const toggleShortlist = (id: string) => {
    const exists = shortlist.includes(id);
    setShortlist(exists ? shortlist.filter((item) => item !== id) : shortlist.length >= 3 ? [...shortlist.slice(1), id] : [...shortlist, id]);
    toast(exists ? "Removed from shortlist" : "Added to shortlist", { description: exists ? "The system is no longer in your shortlist." : "Shortlist up to three systems for a focused quotation." });
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#132F4F] selection:bg-[#bca477] selection:text-[#132F4F]">
      <SiteHeader />
      <main id="top">
        <HeroCarousel onExplore={() => scrollToSection("catalogue")} onEnquire={() => setEnquiryOpen(true)} />

        <StatsStrip />

        <GalleryCarousel />

        <section id="sectors" className="scroll-mt-20 bg-[#132F4F] px-5 py-20 text-[#f6f1e8] lg:px-16 lg:py-28">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-12 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
              <div><div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#C5A059]">Sectors / 01</div><h2 className="font-serif text-[clamp(2.8rem,5vw,5.5rem)] leading-[.9] tracking-[-0.04em]">One standard.<br /><em className="font-light text-[#C5A059]">Five environments.</em></h2></div>
              <p className="max-w-[540px] text-sm leading-7 text-white/55 lg:justify-self-end">From a hospital HBOT unit to a hotel spa, a squad recovery room or a private residence — we specify the right equipment, footprint and support model for the space you are building.</p>
            </div>
            <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
              {sectors.map((sector, index) => <Link key={sector.slug} href={`/sectors/${sector.slug}`} className={`group relative min-h-[360px] overflow-hidden bg-[#1A3B63] ${index < 2 ? "lg:col-span-3 lg:min-h-[420px]" : "lg:col-span-2"} ${index === 4 ? "md:col-span-2 lg:col-span-2" : ""}`}>
                <img src={sector.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1C33]/90 via-[#0A1C33]/25 to-transparent" />
                <div className="absolute inset-x-5 bottom-5"><div className="text-[10px] uppercase tracking-[0.16em] text-[#C5A059]">{pad(index)} / {sector.label}</div><h3 className="mt-2 font-serif text-3xl">{sector.title}</h3><p className="mt-2 max-w-[340px] text-xs leading-5 text-white/65">{sector.subtitle}</p><span className="mt-4 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-white/75">Explore sector <ArrowRight size={13} className="transition group-hover:translate-x-1" /></span></div>
              </Link>)}
            </div>
          </div>
        </section>

        <section id="catalogue" className="scroll-mt-20 bg-[#f4f1ea] px-5 py-20 lg:px-16 lg:py-28">
          <div className="mx-auto max-w-[1440px]">
            <div className="border-b border-[#132F4F]/15 pb-9">
              <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#8a7657]">The collection / 02</div>
              <h2 className="max-w-[660px] font-serif text-[clamp(2.8rem,5vw,5.5rem)] leading-[.92] tracking-[-0.04em]">Built for <em className="font-light">better</em> recovery.</h2>
              <p className="mt-5 max-w-[540px] text-sm leading-6 text-[#5f5b53]">Hyperbaric chambers, cryotherapy chambers and photobiomodulation beds that anchor a complete recovery environment. Shortlist up to three and request a quotation.</p>
            </div>
            <div className="mt-12 grid gap-x-5 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
              {featuredProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} selected={shortlist.includes(product.id)} onToggle={() => toggleShortlist(product.id)} />)}
            </div>
            <div className="mt-16 flex justify-center"><Link href="/products" className="inline-flex items-center gap-3 bg-[#132F4F] px-6 py-4 text-[10px] uppercase tracking-[0.18em] text-white transition hover:bg-[#C5A059]">Explore the full range <ArrowRight size={14} /></Link></div>
          </div>
        </section>

        <section id="science" className="scroll-mt-20 bg-[#e9e4da] px-5 py-20 lg:px-16 lg:py-28">
          <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="relative min-h-[460px] overflow-hidden bg-[#1A3B63]"><img src="/images/placeholders/category-red-light-therapy.svg" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute left-5 top-5 rounded-full border border-white/50 px-3 py-2 text-[9px] uppercase tracking-[0.2em] text-white">Specification, made tangible</div><div className="absolute bottom-5 left-5 text-white"><div className="font-serif text-5xl">660 / 850</div><div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/75">nanometre light architecture</div></div></div>
            <div className="lg:pl-10"><div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#8a7657]">Why AAAyan / 03</div><h2 className="font-serif text-[clamp(2.8rem,5vw,5.5rem)] leading-[.9] tracking-[-0.04em]">Technology with a <em className="font-light">point of view.</em></h2><p className="mt-7 max-w-[520px] text-sm leading-7 text-[#5f5b53]">Longevity and performance infrastructure is not one machine. We curate the right circuit — hyperbaric oxygen, cold, light and compression — sized to the people, protocols and throughput it needs to serve.</p><div className="mt-9 grid gap-4 border-t border-[#132F4F]/15 pt-6 sm:grid-cols-2"><div><Sparkles size={18} className="text-[#C5A059]" /><h3 className="mt-4 font-serif text-xl">Curated, not crowded</h3><p className="mt-2 text-xs leading-5 text-[#6f6a61]">Every specification starts with your room, your power supply and your operating model.</p></div><div><CircleHelp size={18} className="text-[#C5A059]" /><h3 className="mt-4 font-serif text-xl">Human support</h3><p className="mt-2 text-xs leading-5 text-[#6f6a61]">From site survey to operator training, a specialist stays close to the project.</p></div></div><button onClick={() => setEnquiryOpen(true)} className="mt-9 inline-flex items-center gap-3 border-b border-[#132F4F] pb-2 text-[10px] uppercase tracking-[0.18em]">Talk through your project <ArrowRight size={14} /></button></div>
          </div>
        </section>

        <section id="process" className="scroll-mt-20 bg-[#f4f1ea] px-5 py-20 lg:px-16 lg:py-28">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-10 border-b border-[#132F4F]/15 pb-12 lg:grid-cols-[.7fr_1.3fr] lg:items-end"><div><div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#8a7657]">From survey to service / 04</div><h2 className="font-serif text-[clamp(2.8rem,5vw,5.5rem)] leading-[.9] tracking-[-0.04em]">A better way<br />to <em className="font-light">buy wellness.</em></h2></div><p className="max-w-[520px] text-sm leading-7 text-[#5f5b53] lg:justify-self-end">Every installation is surveyed before order, commissioned by our own engineers, and handed over with operator training and a service contract.</p></div>
            <div className="grid gap-8 pt-12 md:grid-cols-3"><Step number="01" title="Survey" body="Share your room, power supply and expected daily sessions. We confirm floor loading, access and ventilation before you order." /><Step number="02" title="Specify" body="Receive an equipment specification, an installation scope and a written quotation that covers every line item." /><Step number="03" title="Commission" body="Installation, calibration, handover documentation, operator training and scheduled service." /></div>
          </div>
        </section>

        <section id="supplier" className="scroll-mt-20 bg-[#e9e4da] px-5 py-20 lg:px-16 lg:py-28">
          <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#8a7657]">Wellness equipment supplier — India / 05</div>
              <h2 className="font-serif text-[clamp(2.6rem,4.6vw,5rem)] leading-[.92] tracking-[-0.04em]">Hyperbaric, cryotherapy and <em className="font-light text-[#C5A059]">photobiomodulation</em> equipment.</h2>
              <p className="mt-7 max-w-[620px] text-[15px] leading-8 text-[#4f4b43]">AAAyan Immunotech is a wellness equipment supplier in India, specifying, installing and servicing recovery and longevity equipment for clinics, hospitals, gyms, sports academies, hotel spas, corporate campuses and private residences.</p>
              <p className="mt-4 max-w-[620px] text-[15px] leading-8 text-[#4f4b43]">We supply three primary modalities and the stations that complete a recovery circuit around them. Every installation is surveyed before order, commissioned by our own engineers, and handed over with operator training and a service contract.</p>
              <ul className="mt-8 max-w-[620px] border-t border-[#132F4F]/15">{modalities.map((item) => <li key={item.href} className="flex gap-4 border-b border-[#132F4F]/15 py-4 text-[15px] leading-7 text-[#4f4b43]"><Check size={16} className="mt-1.5 shrink-0 text-[#C5A059]" /><span><Link href={item.href} className="font-medium text-[#132F4F] underline decoration-[#bca477] underline-offset-4">{item.title}</Link> — {item.body}</span></li>)}</ul>
              <p className="mt-6 max-w-[620px] text-[15px] leading-8 text-[#4f4b43]">Planning a facility rather than buying a single asset? <Link href="/guides/build-your-centre" className="underline decoration-[#bca477] underline-offset-4">Build Your Centre</Link> covers wellness centre setup cost in India end to end, and the <Link href="/guides/installation-requirements" className="underline decoration-[#bca477] underline-offset-4">installation requirements guide</Link> lists what your site needs before you order.</p>
              <div className="mt-9 flex flex-wrap gap-3"><button onClick={() => setEnquiryOpen(true)} className="inline-flex items-center gap-3 bg-[#132F4F] px-5 py-3.5 text-[10px] uppercase tracking-[0.18em] text-white transition hover:bg-[#C5A059]">Request a quotation <ArrowRight size={14} /></button><Link href="/guides/build-your-centre" className="inline-flex items-center gap-3 border border-[#132F4F]/30 px-5 py-3.5 text-[10px] uppercase tracking-[0.18em]">Build your centre</Link></div>
            </div>
            <div className="space-y-10 lg:pt-4">
              {guideGroups.map((group) => <div key={group.title}>
                <div className="mb-4 text-[10px] uppercase tracking-[0.22em] text-[#8a7657]">{group.title}</div>
                <div className="border-t border-[#132F4F]/15">{group.slugs.map((slug) => <Link key={slug} href={`/guides/${slug}`} className="group flex items-start justify-between gap-6 border-b border-[#132F4F]/15 py-5"><div><div className="font-serif text-2xl leading-tight">{guideLabels[slug]}</div><p className="mt-2 text-xs leading-5 text-[#6f6a61]">{guides.find((guide) => guide.slug === slug)?.metaDescription}</p></div><ArrowRight size={16} className="mt-2 shrink-0 transition group-hover:translate-x-1" /></Link>)}</div>
              </div>)}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#0F2440] px-5 py-20 text-white lg:px-16 lg:py-24"><div className="absolute right-[-8%] top-[-80%] h-[160%] w-[55%] rounded-full bg-[#a28457]/15 blur-3xl" /><div className="relative mx-auto flex max-w-[1440px] flex-col justify-between gap-10 lg:flex-row lg:items-center"><div><div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#C5A059]">Make the first move / 06</div><h2 className="max-w-[750px] font-serif text-[clamp(2.6rem,5vw,5.5rem)] leading-[.9] tracking-[-0.04em]">Find the right system<br /><em className="font-light text-[#C5A059]">for your space.</em></h2></div><div className="flex flex-wrap gap-3"><Link href="/products" className="inline-flex items-center gap-3 bg-[#C5A059] px-5 py-3.5 text-[10px] uppercase tracking-[0.18em] text-[#132F4F] transition hover:bg-[#f4e9cc]">Explore equipment <ArrowRight size={14} /></Link><button onClick={() => setEnquiryOpen(true)} className="inline-flex items-center gap-3 border border-white/30 px-5 py-3.5 text-[10px] uppercase tracking-[0.18em] transition hover:border-white">Request a quote</button></div></div></section>
      </main>

      <SiteFooter />

      {shortlist.length > 0 && <div className="fixed bottom-24 left-1/2 z-30 flex w-[calc(100%-2rem)] max-w-[610px] -translate-x-1/2 items-center justify-between gap-4 rounded-full border border-white/10 bg-[#132F4F]/95 px-4 py-3 text-white shadow-2xl backdrop-blur-xl sm:bottom-5 sm:px-5"><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C5A059] text-[#132F4F]"><ShoppingBag size={15} /></div><div><div className="text-[10px] uppercase tracking-[0.16em]">{shortlist.length} system{shortlist.length > 1 ? "s" : ""} shortlisted</div><div className="mt-0.5 text-[10px] text-white/50">Request one quotation for all of them</div></div></div><button onClick={() => setEnquiryOpen(true)} className="shrink-0 border border-[#C5A059]/80 px-3 py-2 text-[9px] uppercase tracking-[0.14em] text-[#f3e6c6] transition hover:bg-[#C5A059] hover:text-[#132F4F] sm:px-4">Request quote</button></div>}

      {enquiryOpen && <EnquiryDrawer shortlisted={shortlist.map((id) => catalogue.find((product) => product.id === id)?.name).filter((name): name is string => Boolean(name))} onClose={() => setEnquiryOpen(false)} />}
    </div>
  );
}

function Step({ number, title, body }: { number: string; title: string; body: string }) {
  return <div className="border-t border-[#132F4F]/25 pt-4"><div className="flex items-center justify-between"><span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059]">{number}</span><ArrowRight size={15} className="text-[#C5A059]" /></div><h3 className="mt-7 font-serif text-3xl">{title}</h3><p className="mt-3 max-w-[300px] text-xs leading-5 text-[#6f6a61]">{body}</p></div>;
}

function EnquiryDrawer({ shortlisted, onClose }: { shortlisted: string[]; onClose: () => void }) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Enquiry saved", { description: "A specialist will be in touch with the next step." });
    onClose();
  };
  return <div className="fixed inset-0 z-50 flex justify-end bg-[#0A1C33]/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Request a quotation"><button className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Close enquiry" /><aside className="relative z-10 h-full w-full max-w-[520px] overflow-y-auto bg-[#f4f1ea] px-6 py-7 text-[#132F4F] shadow-2xl sm:px-10"><div className="flex items-start justify-between border-b border-[#132F4F]/15 pb-6"><div><div className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059]">Get in touch</div><h2 className="mt-3 font-serif text-4xl leading-none">Request a quotation.</h2></div><button onClick={onClose} className="rounded-full border border-[#132F4F]/15 p-2" aria-label="Close"><X size={18} /></button></div><p className="mt-7 text-sm leading-6 text-[#6f6a61]">Tell us about your site and expected session volume. We return an equipment specification, an installation scope and written pricing.</p>{shortlisted.length > 0 && <div className="mt-6 rounded-sm bg-[#e9e4da] p-4"><div className="text-[9px] uppercase tracking-[0.18em] text-[#8a7657]">Your shortlist</div><div className="mt-3 space-y-2">{shortlisted.map((name) => <div key={name} className="flex items-center gap-2 text-sm"><Check size={14} className="text-[#C5A059]" />{name}</div>)}</div></div>}<form onSubmit={submit} className="mt-8 space-y-5"><Field label="Your name" placeholder="Full name" required /><Field label="Work email" placeholder="you@company.com" type="email" required /><div><label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-[#6f6a61]">Sector</label><select className="w-full border-b border-[#132F4F]/20 bg-transparent px-0 py-3 text-sm outline-none">{sectors.map((sector) => <option key={sector.slug}>{sector.title}</option>)}<option>Exploring equipment</option></select></div><Field label="City" placeholder="Where is the project located?" /><div><label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-[#6f6a61]">Tell us about your site</label><textarea className="min-h-[105px] w-full resize-none border-b border-[#132F4F]/20 bg-transparent px-0 py-3 text-sm outline-none" placeholder="Room dimensions, power availability, expected session volume..." /></div><button type="submit" className="mt-3 flex w-full items-center justify-center gap-3 bg-[#132F4F] px-5 py-4 text-[10px] uppercase tracking-[0.18em] text-white transition hover:bg-[#C5A059]">Send enquiry <ArrowRight size={14} /></button></form><div className="mt-8 space-y-3 border-t border-[#132F4F]/15 pt-6 text-xs text-[#6f6a61]"><div className="flex items-center gap-3"><Phone size={15} className="text-[#C5A059]" />Prefer a direct conversation? <span className="font-medium text-[#132F4F]">{contact.phone}</span></div><a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3"><MessageCircle size={15} className="text-[#C5A059]" />Chat on WhatsApp</a></div></aside></div>;
}

function Field({ label, placeholder, type = "text", required = false }: { label: string; placeholder: string; type?: string; required?: boolean }) {
  return <div><label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-[#6f6a61]">{label}</label><input required={required} type={type} placeholder={placeholder} className="w-full border-b border-[#132F4F]/20 bg-transparent px-0 py-3 text-sm outline-none placeholder:text-[#a19c93] focus:border-[#C5A059]" /></div>;
}
