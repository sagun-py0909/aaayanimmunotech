import { useState, type MouseEvent, type ReactNode } from "react";
import { ArrowRight, Check, ChevronDown, Mail, Menu, MessageCircle, Phone, Plus, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { categories, contact, guideGroups, guideLabels, sectors, stats, type Product } from "@/data/site";

export const pad = (index: number) => String(index + 1).padStart(2, "0");

export const proseLinks = "[&_a]:underline [&_a]:decoration-[#bca477] [&_a]:underline-offset-4 [&_a:hover]:text-[#C5A059] [&_strong]:font-medium [&_strong]:text-[#133E2F]";
export const proseLinksDark = "[&_a]:underline [&_a]:decoration-[#C5A059] [&_a]:underline-offset-4 [&_strong]:font-medium [&_strong]:text-white";

// Renders ported copy that carries inline markup (<em>, <strong>, internal links) and keeps internal links client-side.
export function Html({ html, as: Tag = "div", className }: { html: string; as?: "div" | "p" | "h1" | "h2" | "h3" | "span"; className?: string }) {
  const [, navigate] = useLocation();
  const onClick = (event: MouseEvent<HTMLElement>) => {
    const href = (event.target as HTMLElement).closest("a")?.getAttribute("href");
    if (!href?.startsWith("/") || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(href);
  };
  return <Tag className={className} onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />;
}

const navLinks: { href: string; label: string; menu?: { href: string; label: string }[] }[] = [
  { href: "/products", label: "Equipment", menu: [{ href: "/products", label: "Full product range" }, ...categories.map((category) => ({ href: `/equipment/${category.slug}`, label: category.label }))] },
  { href: "/sectors", label: "Sectors", menu: sectors.map((sector) => ({ href: `/sectors/${sector.slug}`, label: sector.title })) },
  { href: "/guides", label: "Buying guides", menu: guideGroups.flatMap((group) => group.slugs).map((slug) => ({ href: `/guides/${slug}`, label: guideLabels[slug] })) },
  { href: "/support", label: "Support" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#0F3326]/95 text-[#f8f5ee] backdrop-blur-xl">
    <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 lg:px-10">
      <Link href="/" className="flex items-center gap-3" aria-label="AAAyan Immunotech home">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#b7a77e]/60 text-[10px] tracking-[0.24em] text-[#d4c39b]">AA</span>
        <span className="leading-none"><span className="block font-serif text-[18px] tracking-[0.16em]">AAAYAN</span><span className="mt-1 block text-[8px] uppercase tracking-[0.36em] text-white/55">Immunotech</span></span>
      </Link>
      <nav className="hidden items-center gap-7 text-[10px] uppercase tracking-[0.2em] text-white/65 lg:flex" aria-label="Primary">
        {navLinks.map((link) => link.menu ? <div key={link.href} className="group relative">
          <Link href={link.href} className="flex items-center gap-1.5 py-2 transition-colors hover:text-white">{link.label}<ChevronDown size={12} className="transition group-hover:rotate-180" /></Link>
          <div className="invisible absolute left-1/2 top-full w-[320px] -translate-x-1/2 pt-3 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
            <div className="border border-white/10 bg-[#0F3326] p-2 shadow-2xl shadow-[#0A2A1F]/40">
              {link.menu.map((item, index) => <Link key={item.href} href={item.href} className="flex items-center justify-between gap-3 px-3 py-3 text-white/70 transition hover:bg-white/5 hover:text-white"><span><span className="mr-3 text-[#C5A059]">{pad(index)}</span>{item.label}</span><ArrowRight size={12} className="shrink-0" /></Link>)}
            </div>
          </div>
        </div> : <Link key={link.href} href={link.href} className="transition-colors hover:text-white">{link.label}</Link>)}
      </nav>
      <div className="flex items-center gap-3">
        <Link href="/contact" className="hidden border border-[#C5A059]/70 px-4 py-2.5 text-[10px] uppercase tracking-[0.18em] text-[#f4e8c7] transition hover:bg-[#C5A059] hover:text-[#133E2F] sm:block">Request a quote</Link>
        <button onClick={() => setOpen((value) => !value)} className="rounded-full border border-white/15 p-2 lg:hidden" aria-label="Toggle menu" aria-expanded={open}>{open ? <X size={18} /> : <Menu size={18} />}</button>
      </div>
    </div>
    {open && <div className="max-h-[calc(100vh-73px)] overflow-y-auto border-t border-white/10 bg-[#0F3326] px-5 py-5 lg:hidden">
      <div className="flex flex-col gap-5 text-[10px] uppercase tracking-[0.2em] text-white/75">
        {navLinks.map((link) => <div key={link.href}>
          <Link href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>
          {link.menu && <div className="mt-3 flex flex-col gap-3 border-l border-white/10 pl-4 text-white/50">{link.menu.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}</div>}
        </div>)}
        <Link href="/contact" onClick={() => setOpen(false)} className="w-fit border border-[#C5A059]/70 px-4 py-2.5 text-[#f4e8c7]">Request a quote</Link>
      </div>
    </div>}
  </header>;
}

export function WhatsAppButton() {
  return <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Chat with AAAyan Immunotech on WhatsApp" className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-2xl shadow-[#0A2A1F]/25 transition hover:scale-105"><MessageCircle size={24} /></a>;
}

// The link columns mirror the legacy site's crawlable .seo-directory, so every page links to every indexable page.
export function SiteFooter() {
  const columns = [
    { title: "Equipment", links: categories.map((category) => ({ href: `/equipment/${category.slug}`, label: category.label })) },
    ...guideGroups.map((group) => ({ title: group.title, links: group.slugs.map((slug) => ({ href: `/guides/${slug}`, label: guideLabels[slug] })) })),
    { title: "Sectors", links: sectors.map((sector) => ({ href: `/sectors/${sector.slug}`, label: sector.title })) },
    { title: "Company", links: [{ href: "/", label: "Home" }, { href: "/products", label: "Product range" }, { href: "/support", label: "Support" }, { href: "/contact", label: `Contact — ${contact.city}` }] },
  ];
  return <>
    <footer className="bg-[#0F3326] px-5 pb-10 pt-16 text-white lg:px-16">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <Link href="/" className="font-serif text-3xl tracking-[0.16em]">AAAYAN</Link>
            <div className="mt-2 text-[9px] uppercase tracking-[0.3em] text-white/45">Immunotech · Recovery, performance & longevity</div>
            <p className="mt-6 max-w-[440px] text-sm leading-7 text-white/55">Wellness equipment supplier in India — specifying, installing and servicing hyperbaric oxygen, cryotherapy and photobiomodulation systems for environments that refuse to compromise.</p>
          </div>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:justify-end lg:gap-16">
            <div className="space-y-3 text-sm text-white/65">
              <div className="text-[9px] uppercase tracking-[0.22em] text-[#C5A059]">Direct access</div>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-3 hover:text-white"><Mail size={15} className="text-[#C5A059]" />{contact.email}</a>
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 hover:text-white"><Phone size={15} className="text-[#C5A059]" />{contact.phone}</a>
              <div className="text-xs text-white/45">{contact.region} · {contact.hours}</div>
            </div>
            <Link href="/contact" className="inline-flex w-fit items-center gap-3 bg-[#C5A059] px-5 py-3.5 text-[10px] uppercase tracking-[0.18em] text-[#133E2F] transition hover:bg-[#f4e9cc]">Request a quotation <ArrowRight size={14} /></Link>
          </div>
        </div>
        <nav aria-label="Equipment and guides" className="py-12">
          <h2 className="mb-8 font-serif text-2xl text-white/85">Wellness Equipment Supplier in India — Full Range</h2>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {columns.map((column) => <div key={column.title}>
              <h3 className="mb-4 text-[9px] uppercase tracking-[0.22em] text-[#C5A059]">{column.title}</h3>
              <ul className="space-y-3 text-xs text-white/55">{column.links.map((link) => <li key={link.href}><Link href={link.href} className="transition hover:text-white">{link.label}</Link></li>)}</ul>
            </div>)}
          </div>
        </nav>
        <div className="flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-[9px] uppercase tracking-[0.15em] text-white/40 sm:flex-row">
          <span>© 2026 AAAyan Immunotech. All rights reserved.</span>
          <span>Confidentiality assured</span>
        </div>
      </div>
    </footer>
    <WhatsAppButton />
  </>;
}

export function StatsStrip({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return <section className={`${dark ? "bg-[#133E2F] text-white" : "bg-[#e9e4da] text-[#133E2F]"} px-5 py-14 lg:px-16 lg:py-16`}>
    <div className="mx-auto max-w-[1440px]">
      <div className={`mb-8 text-[10px] uppercase tracking-[0.28em] ${dark ? "text-[#C5A059]" : "text-[#8a7657]"}`}>By the numbers</div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        {stats.map((stat) => <div key={stat.label} className={`border-t pt-5 ${dark ? "border-white/15" : "border-[#133E2F]/15"}`}>
          <div className="font-serif text-[clamp(2.8rem,5vw,4.5rem)] leading-none tracking-[-0.03em]">{stat.value}</div>
          <div className="mt-3 text-[10px] uppercase tracking-[0.18em]">{stat.label}</div>
          <p className={`mt-2 max-w-[230px] text-xs leading-5 ${dark ? "text-white/50" : "text-[#6f6a61]"}`}>{stat.body}</p>
        </div>)}
      </div>
    </div>
  </section>;
}

export function PageShell({ eyebrow, title, intro, breadcrumb, headerSlot, after, children }: { eyebrow: string; title: ReactNode; intro: string; breadcrumb?: string; headerSlot?: ReactNode; after?: ReactNode; children: ReactNode }) {
  return <div className="min-h-screen bg-[#f4f1ea] text-[#133E2F]">
    <SiteHeader />
    <main className="pt-28">
      <section className="mx-auto max-w-[1440px] px-5 pb-16 lg:px-16 lg:pb-20">
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#8a7657]"><Link href="/">Home</Link><span>/</span><span>{breadcrumb || eyebrow}</span></nav>
        <div className="grid gap-8 border-b border-[#133E2F]/15 pb-12 lg:grid-cols-[1fr_.7fr] lg:items-end">
          <div><div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#8a7657]">{eyebrow}</div><h1 className="font-serif text-[clamp(3rem,6vw,6.8rem)] leading-[.9] tracking-[-0.045em]">{title}</h1></div>
          <p className="max-w-[470px] text-sm leading-7 text-[#5f5b53] lg:justify-self-end">{intro}</p>
        </div>
        {headerSlot}
      </section>
      <div className="mx-auto max-w-[1440px] px-5 pb-24 lg:px-16">{children}</div>
      {after}
    </main>
    <SiteFooter />
  </div>;
}

export function ProductCard({ product, index, selected = false, onToggle }: { product: Product; index: number; selected?: boolean; onToggle?: () => void }) {
  return <article className="group">
    <div className="relative aspect-[1.08] overflow-hidden bg-[#1A4731]">
      <Link href={`/products/${product.id}`} aria-label={`View ${product.name}`}><img src={product.image} alt={`${product.name} — ${product.type}`} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></Link>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A2A1F]/35 to-transparent" />
      <div className="pointer-events-none absolute inset-x-4 top-4 flex justify-between"><span className="rounded-full bg-[#f4f1ea]/90 px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] text-[#514b42]">{pad(index)}</span>{product.badge && <span className="rounded-full bg-[#C5A059] px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] text-[#133E2F]">{product.badge}</span>}</div>
      {onToggle && <button onClick={onToggle} aria-label={`${selected ? "Remove" : "Add"} ${product.name} ${selected ? "from" : "to"} shortlist`} className={`absolute bottom-4 right-4 flex items-center gap-2 rounded-full px-3 py-2 text-[9px] uppercase tracking-[0.12em] transition ${selected ? "bg-[#C5A059] text-[#133E2F]" : "bg-[#133E2F]/75 text-white hover:bg-[#C5A059] hover:text-[#133E2F]"}`}>{selected ? <Check size={13} /> : <Plus size={13} />} {selected ? "Shortlisted" : "Shortlist"}</button>}
    </div>
    <div className="pt-5">
      <div className="flex items-center justify-between gap-3 text-[9px] uppercase tracking-[0.18em]"><span className="text-[#C5A059]">{product.type}</span><span className="shrink-0 text-right text-[#777067]">{product.headline}</span></div>
      <h3 className="mt-3 font-serif text-[27px] leading-[1.02] tracking-[-0.02em]"><Link href={`/products/${product.id}`}>{product.name}</Link></h3>
      <p className="mt-4 text-xs leading-5 text-[#6f6a61]">{product.description}</p>
      <div className="mt-5 flex items-center justify-between border-t border-[#133E2F]/12 pt-4"><span className="text-[10px] uppercase tracking-[0.13em] text-[#777067]">On quotation</span><Link href={`/products/${product.id}`} className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] transition hover:text-[#C5A059]">View system <ArrowRight size={14} /></Link></div>
    </div>
  </article>;
}
