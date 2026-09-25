import { ArrowRight, Check, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Link, useRoute, useSearch } from "wouter";
import { motion } from "framer-motion";
import { PageShell, ProductCard, SiteFooter, SiteHeader, pad } from "@/components/SiteChrome";
import { catalogue, categories, contact, guideLabels, sectors } from "@/data/site";
import { enquiryFromForm, sendEnquiry } from "@/lib/enquiry";
import NotFound from "./NotFound";

export function Support() {
  const services = [
    { title: "Site survey & planning", body: "Power, floor loading, access route, ventilation and heat rejection confirmed before an order is placed." },
    { title: "Installation & commissioning", body: "Positioning, pressure testing, calibration and handover documentation by our own engineers." },
    { title: "Operator training", body: "Operating protocol, contraindication screening and emergency procedure training for your staff." },
    { title: "Service & maintenance", body: "Scheduled maintenance and inspection so the equipment stays revenue-generating." },
  ];
  return <PageShell eyebrow="Support / Long-term confidence" title={<>Good equipment<br /><em>needs good support.</em></>} intro="From site survey to commissioning, training and ongoing service, the AAAyan team stays close to the project long after the purchase." breadcrumb="Support">
    <div className="grid gap-6 md:grid-cols-2">{services.map((item, index) => <div key={item.title} className="border-t border-[#4E141D]/20 pt-5"><div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-[#C5A059]"><span>{pad(index)}</span><ArrowRight size={14} /></div><h2 className="mt-12 font-serif text-4xl">{item.title}</h2><p className="mt-4 max-w-[400px] text-sm leading-6 text-[#6f6a61]">{item.body}</p></div>)}</div>
    <div className="mt-16 grid gap-4 md:grid-cols-2">{["installation-requirements", "build-your-centre"].map((slug) => <Link key={slug} href={`/guides/${slug}`} className="group flex items-center justify-between gap-6 bg-[#e9e4da] p-6"><div><div className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059]">Guide</div><div className="mt-2 font-serif text-2xl">{guideLabels[slug]}</div></div><ArrowRight size={18} className="shrink-0 transition group-hover:translate-x-1" /></Link>)}</div>
    <div className="mt-16 bg-[#4E141D] p-8 text-white lg:p-12"><div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"><div><div className="text-[10px] uppercase tracking-[0.22em] text-[#C5A059]">Need a service conversation?</div><h2 className="mt-3 font-serif text-5xl">Let’s keep it performing.</h2></div><div className="flex flex-wrap gap-3"><Link href="/contact" className="inline-flex items-center gap-3 bg-[#C5A059] px-5 py-3.5 text-[10px] uppercase tracking-[0.18em] text-[#4E141D]">Contact support <ArrowRight size={14} /></Link><a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 border border-white/30 px-5 py-3.5 text-[10px] uppercase tracking-[0.18em]"><MessageCircle size={14} /> WhatsApp</a></div></div></div>
  </PageShell>;
}

export function Contact() {
  const search = useSearch();
  const [sending, setSending] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSending(true);
    try {
      await sendEnquiry(enquiryFromForm(form));
      toast.success("Enquiry sent", { description: "A specialist will be in touch shortly." });
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error && error.message === "rate-limited" ? "Too many enquiries from here. Please email or WhatsApp us." : "That enquiry did not send. Please email or WhatsApp us.");
    } finally {
      setSending(false);
    }
  };
  // A "Request a quotation" button on a product page arrives with ?product=<id>, so the form opens on that system.
  const requested = catalogue.find((item) => item.id === new URLSearchParams(search).get("product"));
  const fieldClass = "mt-3 w-full border-b border-[#4E141D]/20 bg-transparent py-3 text-sm outline-none focus:border-[#C5A059]";
  return <div className="min-h-screen bg-[#f4f1ea] text-[#4E141D]"><SiteHeader /><main className="mx-auto grid max-w-[1440px] gap-14 px-5 pb-24 pt-36 lg:grid-cols-[.75fr_1.25fr] lg:px-16">
    <div>
      <div className="text-[10px] uppercase tracking-[0.28em] text-[#8a7657]">Wellness equipment supplier · {contact.city}</div>
      <h1 className="mt-5 font-serif text-[clamp(3rem,6vw,6rem)] leading-[.88]">Request a<br /><em>quotation.</em></h1>
      <p className="mt-8 max-w-[420px] text-sm leading-7 text-[#5f5b53]">Send your room dimensions, available electrical supply and expected daily session count. We return an equipment specification, an installation scope and written pricing — for hyperbaric, cryotherapy and red light therapy projects across India.</p>
      <div className="mt-12 space-y-5 text-sm text-[#5f5b53]">
        <a href={`mailto:${contact.email}`} className="flex items-center gap-3 hover:text-[#4E141D]"><Mail size={17} className="text-[#C5A059]" />{contact.email}</a>
        <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 hover:text-[#4E141D]"><Phone size={17} className="text-[#C5A059]" />{contact.phone}</a>
        <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#4E141D]"><MessageCircle size={17} className="text-[#C5A059]" />Chat on WhatsApp</a>
        <div className="flex items-center gap-3"><MapPin size={17} className="text-[#C5A059]" />{contact.region}</div>
        <div className="pl-8 text-xs text-[#8c887f]">{contact.hours}</div>
      </div>
    </div>
    <form onSubmit={submit} className="bg-[#e9e4da] p-6 sm:p-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="text-[10px] uppercase tracking-[0.16em] text-[#6f6a61]">Name<input name="name" required className={fieldClass} placeholder="Full name" /></label>
        <label className="text-[10px] uppercase tracking-[0.16em] text-[#6f6a61]">Work email<input name="email" required type="email" className={fieldClass} placeholder="you@company.com" /></label>
        <label className="text-[10px] uppercase tracking-[0.16em] text-[#6f6a61]">Organisation<input name="company" className={fieldClass} placeholder="Organisation or institution" /></label>
        <label className="text-[10px] uppercase tracking-[0.16em] text-[#6f6a61]">City<input name="city" className={fieldClass} placeholder="Project location" /></label>
        <label className="text-[10px] uppercase tracking-[0.16em] text-[#6f6a61]">Phone<input name="phone" type="tel" className={fieldClass} placeholder="Optional, for a faster reply" /></label>
      </div>
      <div className="mt-7 grid gap-6 sm:grid-cols-2">
        <label className="block text-[10px] uppercase tracking-[0.16em] text-[#6f6a61]">Sector<select name="sector" className={fieldClass}>{sectors.map((sector) => <option key={sector.slug}>{sector.title}</option>)}<option>Exploring options</option></select></label>
        <label className="block text-[10px] uppercase tracking-[0.16em] text-[#6f6a61]">Products of interest<select name="interest" className={fieldClass} defaultValue={requested?.name}>{catalogue.map((product) => <option key={product.id}>{product.name}</option>)}<option>Full recovery circuit</option></select></label>
      </div>
      <label className="mt-7 block text-[10px] uppercase tracking-[0.16em] text-[#6f6a61]">Tell us about your site<textarea name="message" className={`${fieldClass} min-h-[150px] resize-none`} placeholder="Room dimensions, power availability, expected session volume, timeline..." /></label>
      {/* Honeypot: hidden from people, tempting to bots. */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <button type="submit" disabled={sending} className="mt-8 inline-flex items-center gap-3 bg-[#4E141D] px-5 py-4 text-[10px] uppercase tracking-[0.18em] text-white transition hover:bg-[#C5A059] disabled:opacity-60">{sending ? "Sending…" : "Send enquiry"} <ArrowRight size={14} /></button>
    </form>
  </main><SiteFooter /></div>;
}

export function ProductDetail() {
  const [, params] = useRoute<{ id: string }>("/products/:id");
  const product = catalogue.find((item) => item.id === params?.id);
  if (!product) return <NotFound />;
  const category = categories.find((item) => item.slug === product.categorySlug);
  const suited = sectors.filter((sector) => product.sectors.includes(sector.slug));
  const related = catalogue.filter((item) => item.id !== product.id && item.sectors.some((slug) => product.sectors.includes(slug))).slice(0, 3);
  const quoteHref = `/contact?product=${product.id}`;
  return <div className="min-h-screen bg-[#f4f1ea] text-[#4E141D]"><SiteHeader /><main className="mx-auto max-w-[1440px] px-5 pb-24 pt-32 lg:px-16">
    <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#8a7657]"><Link href="/">Home</Link><span>/</span><Link href="/products">Products</Link><span>/</span><span>{product.name}</span></nav>

    <div className="grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
      <div className="lg:sticky lg:top-28">
        <div className="group relative overflow-hidden rounded-[28px] border border-[#4E141D]/10 bg-[#ebe7de] p-5 shadow-[0_16px_45px_rgba(46,10,16,0.08)] sm:p-7">
          <div className="pointer-events-none absolute left-5 top-5 h-14 w-14 rounded-tl-2xl border-l border-t border-[#C5A059]/35" />
          <div className="pointer-events-none absolute bottom-5 right-5 h-14 w-14 rounded-br-2xl border-b border-r border-[#C5A059]/35" />
          <img src={product.image} alt={`${product.name} — ${product.type}`} className="mx-auto max-h-[520px] w-[88%] object-contain drop-shadow-[0_18px_22px_rgba(0,0,0,0.12)] transition duration-500 group-hover:scale-[1.015]" />
          {product.badge && <span className="absolute right-7 top-7 rounded-full bg-[#C5A059] px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-[#4E141D] shadow-sm">{product.badge}</span>}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={quoteHref} className="inline-flex flex-1 items-center justify-center gap-3 bg-[#4E141D] px-5 py-4 text-[10px] uppercase tracking-[0.18em] text-white transition hover:bg-[#C5A059]">Request a quotation <ArrowRight size={14} /></Link>
          <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 border border-[#4E141D]/25 px-5 py-4 text-[10px] uppercase tracking-[0.18em] transition hover:border-[#C5A059] hover:text-[#C5A059]"><MessageCircle size={14} /> WhatsApp</a>
        </div>
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#C5A059]">{product.type}</div>
        <h1 className="mt-4 font-serif text-[clamp(2.8rem,5vw,5.5rem)] leading-[.9] tracking-[-0.03em]">{product.name}</h1>
        <div className="mt-4 text-[11px] uppercase tracking-[0.16em] text-[#6f6a61]">{product.headline}</div>
        <p className="mt-7 max-w-[520px] text-[15px] leading-7 text-[#5f5b53]">{product.description}</p>
        <dl className="mt-9 border-t border-[#4E141D]/15">
          {product.specs.map(([label, value]) => <div key={label} className="grid grid-cols-[.42fr_.58fr] gap-4 border-b border-[#4E141D]/15 py-3.5"><dt className="text-[10px] uppercase tracking-[0.16em] text-[#8a7657]">{label}</dt><dd className="text-sm">{value}</dd></div>)}
          <div className="grid grid-cols-[.42fr_.58fr] gap-4 border-b border-[#4E141D]/15 py-3.5"><dt className="text-[10px] uppercase tracking-[0.16em] text-[#8a7657]">Commercial model</dt><dd className="text-sm">Project quotation</dd></div>
        </dl>
        <div className="mt-10 space-y-0">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#8a7657]">What the system does</h2>
          {product.features.slice(0, 4).map((feature, index) => <motion.div key={feature.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.55, delay: index * 0.08 }} className="flex items-start gap-5 border-t border-[#4E141D]/15 py-6"><span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#4E141D]/15 text-[#C5A059]"><Check size={15} /></span><div><div className="font-serif text-[22px] leading-tight">{feature.title}</div><p className="mt-2 text-sm leading-6 text-[#6f6a61]">{feature.body}</p></div></motion.div>)}
        </div>
        {suited.length > 0 && <div className="mt-9 border-t border-[#4E141D]/15 pt-6">
          <div className="text-[9px] uppercase tracking-[0.16em] text-[#8a7657]">Suited to</div>
          <div className="mt-3 flex flex-wrap gap-2">{suited.map((sector) => <Link key={sector.slug} href={`/sectors/${sector.slug}`} className="rounded-full border border-[#4E141D]/15 px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-[#4f4b43] transition hover:border-[#C5A059] hover:text-[#C5A059]">{sector.title}</Link>)}</div>
        </div>}
        {category && <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/guides/${category.guide}`} className="inline-flex items-center gap-3 border border-[#4E141D]/30 px-5 py-4 text-[10px] uppercase tracking-[0.18em] transition hover:border-[#C5A059] hover:text-[#C5A059]">{guideLabels[category.guide]} <ArrowRight size={14} /></Link>
          <Link href="/support" className="inline-flex items-center gap-3 border border-[#4E141D]/30 px-5 py-4 text-[10px] uppercase tracking-[0.18em] transition hover:border-[#C5A059] hover:text-[#C5A059]">Installation & service</Link>
        </div>}
      </div>
    </div>

    <section className="mt-24 bg-[#4E141D] px-6 py-14 text-white lg:px-14">
      <div className="flex flex-col justify-between gap-6 border-b border-white/15 pb-8 lg:flex-row lg:items-end">
        <div>
          <div className="text-[10px] uppercase tracking-[0.24em] text-[#C5A059]">What you gain</div>
          <h2 className="mt-4 max-w-[640px] font-serif text-[clamp(2.2rem,3.6vw,3.6rem)] leading-[.95] tracking-[-0.03em]">What this room adds to the business.</h2>
        </div>
        <Link href={quoteHref} className="inline-flex w-fit items-center gap-3 bg-[#C5A059] px-5 py-4 text-[10px] uppercase tracking-[0.18em] text-[#4E141D] transition hover:bg-[#f4e9cc]">Ask for the numbers <ArrowRight size={14} /></Link>
      </div>
      <div className="grid gap-x-10 gap-y-9 pt-10 md:grid-cols-2 xl:grid-cols-4">
        {product.gains.map((gain, index) => <motion.div key={gain.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.5, delay: index * 0.07 }} className="border-t border-white/20 pt-5">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059]">{pad(index)}</div>
          <h3 className="mt-4 font-serif text-2xl leading-tight">{gain.title}</h3>
          <p className="mt-3 text-sm leading-6 text-white/65">{gain.body}</p>
        </motion.div>)}
      </div>
    </section>

    <section className="mt-24">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#4E141D]/15 pb-5">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059]">Gallery</div>
          <h2 className="mt-3 font-serif text-4xl">{product.name} in place.</h2>
        </div>
        <Link href={quoteHref} className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#4E141D] transition hover:text-[#C5A059]">Plan this room <ArrowRight size={14} /></Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {product.gallery.map((image, index) => <motion.figure key={image} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: (index % 3) * 0.06 }} className="group relative overflow-hidden bg-[#ebe7de]">
          <img src={image} alt={`${product.name} — view ${index + 1}`} loading="lazy" className="aspect-[1.25] w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-[#2E0A10]/65 to-transparent px-4 py-3 text-[9px] uppercase tracking-[0.14em] text-white/90 opacity-0 transition group-hover:opacity-100"><span>{product.name}</span><span>{pad(index)}</span></figcaption>
        </motion.figure>)}
        <Link href={quoteHref} className="flex flex-col justify-between gap-8 bg-[#e9e4da] p-6 transition hover:bg-[#ded8cc]">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059]">Next step</div>
          <div>
            <div className="font-serif text-3xl leading-tight">See it specified<br />for your space.</div>
            <span className="mt-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em]">Request a quotation <ArrowRight size={14} /></span>
          </div>
        </Link>
      </div>
    </section>

    <div className="mt-24 grid gap-8 border-t border-[#4E141D]/15 pt-10 md:grid-cols-3">{[{ title: "Survey", body: "We confirm power, floor loading, access and ventilation before the order is placed." }, { title: "Commission", body: "Our own engineers install, test, calibrate and hand over the system." }, { title: "Support", body: "Operator training and a service contract keep it performing." }].map((item, index) => <div key={item.title}><div className="text-[10px] uppercase tracking-[0.18em] text-[#C5A059]">{pad(index)}</div><h2 className="mt-4 font-serif text-3xl">{item.title}</h2><p className="mt-3 text-sm leading-6 text-[#6f6a61]">{item.body}</p></div>)}</div>

    <section className="mt-16 flex flex-col items-start justify-between gap-6 bg-[#e9e4da] p-8 sm:flex-row sm:items-center lg:p-12">
      <div>
        <h2 className="font-serif text-[clamp(1.9rem,3vw,2.8rem)] leading-tight">Talk to us about an installation.</h2>
        <p className="mt-3 max-w-[560px] text-sm leading-6 text-[#6f6a61]">Send your room dimensions, power supply and expected session volume, and we return a specification, an installation scope and written pricing.</p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-3">
        <Link href={quoteHref} className="inline-flex items-center gap-3 bg-[#4E141D] px-5 py-4 text-[10px] uppercase tracking-[0.18em] text-white transition hover:bg-[#C5A059]">Request a quotation <ArrowRight size={14} /></Link>
        <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 border border-[#4E141D]/25 px-5 py-4 text-[10px] uppercase tracking-[0.18em]"><Phone size={14} /> Call</a>
      </div>
    </section>

    {related.length > 0 && <section className="mt-24"><div className="mb-10 flex items-end justify-between border-b border-[#4E141D]/15 pb-5"><h2 className="font-serif text-4xl">Completes the circuit</h2><Link href="/products" className="text-[10px] uppercase tracking-[0.18em]">Full range</Link></div><div className="grid gap-x-6 gap-y-14 md:grid-cols-2 xl:grid-cols-3">{related.map((item, index) => <ProductCard key={item.id} product={item} index={index} />)}</div></section>}
  </main><SiteFooter /></div>;
}
