import { ArrowRight, Check, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { Link, useRoute } from "wouter";
import { PageShell, ProductCard, SiteFooter, SiteHeader, pad } from "@/components/SiteChrome";
import { catalogue, categories, contact, guideLabels, sectors } from "@/data/site";
import NotFound from "./NotFound";

export function Support() {
  const services = [
    { title: "Site survey & planning", body: "Power, floor loading, access route, ventilation and heat rejection confirmed before an order is placed." },
    { title: "Installation & commissioning", body: "Positioning, pressure testing, calibration and handover documentation by our own engineers." },
    { title: "Operator training", body: "Operating protocol, contraindication screening and emergency procedure training for your staff." },
    { title: "Service & maintenance", body: "Scheduled maintenance and inspection so the equipment stays revenue-generating." },
  ];
  return <PageShell eyebrow="Support / Long-term confidence" title={<>Good equipment<br /><em>needs good support.</em></>} intro="From site survey to commissioning, training and ongoing service, the AAAyan team stays close to the project long after the purchase." breadcrumb="Support">
    <div className="grid gap-6 md:grid-cols-2">{services.map((item, index) => <div key={item.title} className="border-t border-[#1d1d1b]/20 pt-5"><div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-[#9d8251]"><span>{pad(index)}</span><ArrowRight size={14} /></div><h2 className="mt-12 font-serif text-4xl">{item.title}</h2><p className="mt-4 max-w-[400px] text-sm leading-6 text-[#6f6a61]">{item.body}</p></div>)}</div>
    <div className="mt-16 grid gap-4 md:grid-cols-2">{["installation-requirements", "build-your-centre"].map((slug) => <Link key={slug} href={`/guides/${slug}`} className="group flex items-center justify-between gap-6 bg-[#e9e4da] p-6"><div><div className="text-[9px] uppercase tracking-[0.2em] text-[#9d8251]">Guide</div><div className="mt-2 font-serif text-2xl">{guideLabels[slug]}</div></div><ArrowRight size={18} className="shrink-0 transition group-hover:translate-x-1" /></Link>)}</div>
    <div className="mt-16 bg-[#20201e] p-8 text-white lg:p-12"><div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"><div><div className="text-[10px] uppercase tracking-[0.22em] text-[#d5c59d]">Need a service conversation?</div><h2 className="mt-3 font-serif text-5xl">Let’s keep it performing.</h2></div><div className="flex flex-wrap gap-3"><Link href="/contact" className="inline-flex items-center gap-3 bg-[#d5c59d] px-5 py-3.5 text-[10px] uppercase tracking-[0.18em] text-[#1c1b18]">Contact support <ArrowRight size={14} /></Link><a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 border border-white/30 px-5 py-3.5 text-[10px] uppercase tracking-[0.18em]"><MessageCircle size={14} /> WhatsApp</a></div></div></div>
  </PageShell>;
}

export function Contact() {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Enquiry sent", { description: "A specialist will be in touch shortly." });
    event.currentTarget.reset();
  };
  const fieldClass = "mt-3 w-full border-b border-[#1d1d1b]/20 bg-transparent py-3 text-sm outline-none focus:border-[#9d8251]";
  return <div className="min-h-screen bg-[#f4f1ea] text-[#191918]"><SiteHeader /><main className="mx-auto grid max-w-[1440px] gap-14 px-5 pb-24 pt-36 lg:grid-cols-[.75fr_1.25fr] lg:px-16">
    <div>
      <div className="text-[10px] uppercase tracking-[0.28em] text-[#8a7657]">Wellness equipment supplier · {contact.city}</div>
      <h1 className="mt-5 font-serif text-[clamp(3rem,6vw,6rem)] leading-[.88]">Request a<br /><em>quotation.</em></h1>
      <p className="mt-8 max-w-[420px] text-sm leading-7 text-[#5f5b53]">Send your room dimensions, available electrical supply and expected daily session count. We return an equipment specification, an installation scope and written pricing — for hyperbaric, cryotherapy and red light therapy projects across India.</p>
      <div className="mt-12 space-y-5 text-sm text-[#5f5b53]">
        <a href={`mailto:${contact.email}`} className="flex items-center gap-3 hover:text-[#191918]"><Mail size={17} className="text-[#9d8251]" />{contact.email}</a>
        <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 hover:text-[#191918]"><Phone size={17} className="text-[#9d8251]" />{contact.phone}</a>
        <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#191918]"><MessageCircle size={17} className="text-[#9d8251]" />Chat on WhatsApp</a>
        <div className="flex items-center gap-3"><MapPin size={17} className="text-[#9d8251]" />{contact.region}</div>
        <div className="pl-8 text-xs text-[#8c887f]">{contact.hours}</div>
      </div>
    </div>
    <form onSubmit={submit} className="bg-[#e9e4da] p-6 sm:p-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="text-[10px] uppercase tracking-[0.16em] text-[#6f6a61]">Name<input required className={fieldClass} placeholder="Full name" /></label>
        <label className="text-[10px] uppercase tracking-[0.16em] text-[#6f6a61]">Work email<input required type="email" className={fieldClass} placeholder="you@company.com" /></label>
        <label className="text-[10px] uppercase tracking-[0.16em] text-[#6f6a61]">Organisation<input className={fieldClass} placeholder="Organisation or institution" /></label>
        <label className="text-[10px] uppercase tracking-[0.16em] text-[#6f6a61]">City<input className={fieldClass} placeholder="Project location" /></label>
      </div>
      <div className="mt-7 grid gap-6 sm:grid-cols-2">
        <label className="block text-[10px] uppercase tracking-[0.16em] text-[#6f6a61]">Sector<select className={fieldClass}>{sectors.map((sector) => <option key={sector.slug}>{sector.title}</option>)}<option>Exploring options</option></select></label>
        <label className="block text-[10px] uppercase tracking-[0.16em] text-[#6f6a61]">Equipment of interest<select className={fieldClass}>{catalogue.map((product) => <option key={product.id}>{product.name}</option>)}<option>Full recovery circuit</option></select></label>
      </div>
      <label className="mt-7 block text-[10px] uppercase tracking-[0.16em] text-[#6f6a61]">Tell us about your site<textarea className={`${fieldClass} min-h-[150px] resize-none`} placeholder="Room dimensions, power availability, expected session volume, timeline..." /></label>
      <button className="mt-8 inline-flex items-center gap-3 bg-[#24231f] px-5 py-4 text-[10px] uppercase tracking-[0.18em] text-white transition hover:bg-[#9d8251]">Send enquiry <ArrowRight size={14} /></button>
    </form>
  </main><SiteFooter /></div>;
}

export function ProductDetail() {
  const [, params] = useRoute<{ id: string }>("/products/:id");
  const product = catalogue.find((item) => item.id === params?.id);
  if (!product) return <NotFound />;
  const category = categories.find((item) => item.slug === product.categorySlug);
  const suited = sectors.filter((sector) => product.sectors.includes(sector.slug));
  const related = [...catalogue.filter((item) => item.id !== product.id && item.categorySlug === product.categorySlug), ...catalogue.filter((item) => item.id !== product.id && item.categorySlug !== product.categorySlug && item.sectors.some((slug) => product.sectors.includes(slug)))].slice(0, 3);
  return <div className="min-h-screen bg-[#f4f1ea] text-[#191918]"><SiteHeader /><main className="mx-auto max-w-[1440px] px-5 pb-24 pt-32 lg:px-16">
    <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#8a7657]"><Link href="/">Home</Link><span>/</span><Link href="/products">Products</Link>{category && <><span>/</span><Link href={`/equipment/${category.slug}`}>{category.label}</Link></>}<span>/</span><span>{product.name}</span></nav>
    <div className="grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
      <div className="relative aspect-square overflow-hidden bg-[#2b2a26] lg:sticky lg:top-28"><img src={product.image} alt={`${product.name} — ${product.type}`} className="h-full w-full object-cover" />{product.badge && <span className="absolute left-5 top-5 rounded-full bg-[#d5c59d] px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-[#28231a]">{product.badge}</span>}</div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#9d8251]">{product.type}</div>
        <h1 className="mt-4 font-serif text-[clamp(2.8rem,5vw,5.5rem)] leading-[.9] tracking-[-0.03em]">{product.name}</h1>
        <div className="mt-4 text-[11px] uppercase tracking-[0.16em] text-[#6f6a61]">{product.headline}</div>
        <p className="mt-7 max-w-[520px] text-[15px] leading-7 text-[#5f5b53]">{product.description}</p>
        <dl className="mt-8 border-t border-[#1d1d1b]/15">{product.specs.map(([label, value]) => <div key={label} className="grid grid-cols-[.42fr_.58fr] gap-4 border-b border-[#1d1d1b]/15 py-3.5"><dt className="text-[10px] uppercase tracking-[0.16em] text-[#8a7657]">{label}</dt><dd className="text-sm">{value}</dd></div>)}<div className="grid grid-cols-[.42fr_.58fr] gap-4 border-b border-[#1d1d1b]/15 py-3.5"><dt className="text-[10px] uppercase tracking-[0.16em] text-[#8a7657]">Commercial model</dt><dd className="text-sm">Project quotation</dd></div></dl>
        <div className="mt-8 space-y-3">{product.features.map((feature) => <div key={feature} className="flex items-center gap-3 text-sm text-[#5f5b53]"><Check size={15} className="shrink-0 text-[#9d8251]" />{feature}</div>)}</div>
        <div className="mt-8"><div className="text-[9px] uppercase tracking-[0.16em] text-[#8a7657]">Suited to</div><div className="mt-3 flex flex-wrap gap-2">{suited.map((sector) => <Link key={sector.slug} href={`/sectors/${sector.slug}`} className="rounded-full border border-[#1d1d1b]/15 px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-[#4f4b43] transition hover:border-[#9d8251] hover:text-[#9d8251]">{sector.title}</Link>)}</div></div>
        <div className="mt-10 flex flex-wrap gap-3"><Link href="/contact" className="inline-flex items-center gap-3 bg-[#24231f] px-5 py-4 text-[10px] uppercase tracking-[0.18em] text-white transition hover:bg-[#9d8251]">Request a quotation <ArrowRight size={14} /></Link>{category && <Link href={`/guides/${category.guide}`} className="inline-flex items-center gap-3 border border-[#24231f]/30 px-5 py-4 text-[10px] uppercase tracking-[0.18em]">{guideLabels[category.guide]}</Link>}</div>
      </div>
    </div>
    <div className="mt-24 grid gap-8 border-t border-[#1d1d1b]/15 pt-10 md:grid-cols-3">{[{ title: "Survey", body: "We confirm power, floor loading, access and ventilation before the order is placed." }, { title: "Commission", body: "Our own engineers install, test, calibrate and hand over the system." }, { title: "Support", body: "Operator training and a service contract keep it performing." }].map((item, index) => <div key={item.title}><div className="text-[10px] uppercase tracking-[0.18em] text-[#9d8251]">{pad(index)}</div><h2 className="mt-4 font-serif text-3xl">{item.title}</h2><p className="mt-3 text-sm leading-6 text-[#6f6a61]">{item.body}</p></div>)}</div>
    {related.length > 0 && <section className="mt-24"><div className="mb-10 flex items-end justify-between border-b border-[#1d1d1b]/15 pb-5"><h2 className="font-serif text-4xl">Completes the circuit</h2><Link href="/products" className="text-[10px] uppercase tracking-[0.18em]">Full range</Link></div><div className="grid gap-x-6 gap-y-14 md:grid-cols-2 xl:grid-cols-3">{related.map((item, index) => <ProductCard key={item.id} product={item} index={index} />)}</div></section>}
  </main><SiteFooter /></div>;
}
