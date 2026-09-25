import { useState, type MouseEvent, type ReactNode } from "react";
import { ArrowRight, Mail, Menu, MessageCircle, Phone, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { categories, contact, equipmentPages, guideGroups, guideLabels, sectors, stats, type Product } from "@/data/site";

export const pad = (index: number) => String(index + 1).padStart(2, "0");

export const proseLinks = "[&_a]:underline [&_a]:decoration-[#bca477] [&_a]:underline-offset-4 [&_a:hover]:text-[#C5A059] [&_strong]:font-medium [&_strong]:text-[#4E141D]";
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

// A short, flat menu: the client asked for a simple site, so sectors, guides and support live in the footer.
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/guides", label: "Guides" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#3D0F17] text-[#f8f5ee]">
    <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-4 lg:px-10">
      <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="AAAyan Immunotech home">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#b7a77e]/60 text-[10px] tracking-[0.24em] text-[#d4c39b]">AA</span>
        <span className="whitespace-nowrap font-serif text-[15px] leading-none tracking-[0.1em] sm:text-[18px]">AAAYAN IMMUNOTECH</span>
      </Link>
      <nav className="hidden items-center gap-8 text-[15px] text-white/80 lg:flex" aria-label="Primary">
        {navLinks.map((link) => <Link key={link.href} href={link.href} className="transition-colors hover:text-white">{link.label}</Link>)}
      </nav>
      <div className="flex items-center gap-3">
        <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hidden items-center gap-2 bg-[#C5A059] px-4 py-2.5 text-sm font-medium text-[#3D0F17] transition hover:bg-[#f4e9cc] sm:inline-flex"><Phone size={15} />Call us</a>
        <button onClick={() => setOpen((value) => !value)} className="rounded-full border border-white/15 p-2 lg:hidden" aria-label="Toggle menu" aria-expanded={open}>{open ? <X size={18} /> : <Menu size={18} />}</button>
      </div>
    </div>
    {open && <div className="border-t border-white/10 bg-[#3D0F17] px-5 py-5 lg:hidden">
      <div className="flex flex-col gap-5 text-base text-white/85">
        {navLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}
        <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="inline-flex w-fit items-center gap-2 bg-[#C5A059] px-4 py-2.5 text-sm font-medium text-[#3D0F17]"><Phone size={15} />Call {contact.phone}</a>
      </div>
    </div>}
  </header>;
}

export function WhatsAppButton() {
  return <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Chat with AAAyan Immunotech on WhatsApp" className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-2xl shadow-[#2E0A10]/25 transition hover:scale-105"><MessageCircle size={24} /></a>;
}

// Every indexable page stays linked from every page (the legacy site's crawlable directory), just laid out plainly.
export function SiteFooter() {
  const columns = [
    { title: "Products", links: categories.map((category) => ({ href: `/products/${category.slug}`, label: category.label })) },
    // The legacy equipment pages keep their own URLs and their rankings, so they stay crawlable from every page.
    { title: "Guides & prices", links: [...guideGroups.flatMap((group) => group.slugs).map((slug) => ({ href: `/guides/${slug}`, label: guideLabels[slug] })), ...equipmentPages.map((page) => ({ href: `/equipment/${page.slug}`, label: page.breadcrumb }))] },
    { title: "Who we work with", links: sectors.map((sector) => ({ href: `/sectors/${sector.slug}`, label: sector.title })) },
    { title: "Company", links: [{ href: "/", label: "Home" }, { href: "/products", label: "All products" }, { href: "/blog", label: "Blog" }, { href: "/support", label: "Installation & support" }, { href: "/contact", label: "Contact us" }] },
  ];
  return <>
    <footer className="bg-[#3D0F17] pb-10 pt-16 text-white">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-10">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-10 md:flex-row md:items-start md:justify-between">
          <div>
            <Link href="/" className="font-serif text-2xl tracking-[0.1em]">AAAYAN IMMUNOTECH</Link>
            <p className="mt-3 max-w-[420px] text-sm leading-7 text-white/65">Wellness equipment supplier in India — we supply, install and service recovery and wellness equipment.</p>
          </div>
          <div className="space-y-3 text-sm text-white/80">
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 hover:text-white"><Phone size={15} className="text-[#C5A059]" />{contact.phone}</a>
            <a href={`mailto:${contact.email}`} className="flex items-center gap-3 hover:text-white"><Mail size={15} className="text-[#C5A059]" />{contact.email}</a>
            <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white"><MessageCircle size={15} className="text-[#C5A059]" />WhatsApp</a>
            <div className="text-white/55">{contact.region} · {contact.hours}</div>
          </div>
        </div>
        <nav aria-label="All pages" className="grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((column) => <div key={column.title}>
            <h2 className="mb-4 text-sm font-medium text-[#C5A059]">{column.title}</h2>
            <ul className="space-y-2.5 text-sm text-white/65">{column.links.map((link) => <li key={link.href}><Link href={link.href} className="transition hover:text-white">{link.label}</Link></li>)}</ul>
          </div>)}
        </nav>
        <div className="border-t border-white/10 pt-6 text-xs text-white/45">© 2026 AAAyan Immunotech. All rights reserved.</div>
      </div>
    </footer>
    <WhatsAppButton />
  </>;
}

export function StatsStrip({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return <section className={`${dark ? "bg-[#4E141D] text-white" : "bg-[#e9e4da] text-[#4E141D]"} px-5 py-14 lg:px-16 lg:py-16`}>
    <div className="mx-auto max-w-[1440px]">
      <div className={`mb-8 text-[10px] uppercase tracking-[0.28em] ${dark ? "text-[#C5A059]" : "text-[#8a7657]"}`}>By the numbers</div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        {stats.map((stat) => <div key={stat.label} className={`border-t pt-5 ${dark ? "border-white/15" : "border-[#4E141D]/15"}`}>
          <div className="font-serif text-[clamp(2.8rem,5vw,4.5rem)] leading-none tracking-[-0.03em]">{stat.value}</div>
          <div className="mt-3 text-[10px] uppercase tracking-[0.18em]">{stat.label}</div>
          <p className={`mt-2 max-w-[230px] text-xs leading-5 ${dark ? "text-white/50" : "text-[#6f6a61]"}`}>{stat.body}</p>
        </div>)}
      </div>
    </div>
  </section>;
}

export function PageShell({ eyebrow, title, intro, breadcrumb, headerSlot, after, children }: { eyebrow: string; title: ReactNode; intro: string; breadcrumb?: string; headerSlot?: ReactNode; after?: ReactNode; children: ReactNode }) {
  return <div className="min-h-screen bg-[#f4f1ea] text-[#4E141D]">
    <SiteHeader />
    <main className="pt-28">
      <section className="mx-auto max-w-[1200px] px-5 pb-12 lg:px-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-[#8a7657]"><Link href="/">Home</Link><span>/</span><span>{breadcrumb || eyebrow}</span></nav>
        <div className="border-b border-[#4E141D]/15 pb-10">
          <h1 className="font-serif text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] tracking-[-0.02em]">{title}</h1>
          <p className="mt-5 max-w-[640px] text-lg leading-8 text-[#5f5b53]">{intro}</p>
        </div>
        {headerSlot}
      </section>
      <div className="mx-auto max-w-[1200px] px-5 pb-24 lg:px-10">{children}</div>
      {after}
    </main>
    <SiteFooter />
  </div>;
}

export function ProductCard({ product }: { product: Product }) {
  return <article className="group flex flex-col">
    <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden rounded-2xl border border-[#4E141D]/10 bg-white">
      <img src={product.images[0] ?? product.image} alt={`${product.name} — ${product.type}`} loading="lazy" className="h-full w-full object-contain p-3 transition duration-500 sm:p-6 group-hover:scale-[1.03]" />
    </Link>
    <h3 className="mt-4 font-serif text-xl leading-tight sm:text-2xl"><Link href={`/products/${product.id}`}>{product.name}</Link></h3>
    <p className="mt-2 line-clamp-3 text-[13px] leading-6 text-[#5f5b53] sm:line-clamp-none sm:text-sm">{product.description}</p>
    <div className="mt-auto pt-4">
      <Link href={`/products/${product.id}`} className="inline-flex items-center gap-2 text-sm font-medium underline decoration-[#bca477] underline-offset-4 transition hover:text-[#8C6D2F]">View details <ArrowRight size={14} /></Link>
    </div>
  </article>;
}
