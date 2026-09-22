import { useMemo, useState } from "react";
import { ArrowDown, ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "wouter";
import { PageShell, ProductCard } from "@/components/SiteChrome";
import { catalogue, categories, categoryNames } from "@/data/site";

export default function Products() {
  const [active, setActive] = useState("All products");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const filtered = useMemo(() => {
    const normalised = query.trim().toLowerCase();
    const matching = catalogue.filter((product) => (active === "All products" || product.category === active) && (!normalised || `${product.name} ${product.type} ${product.category} ${product.description}`.toLowerCase().includes(normalised)));
    if (sortBy === "name") return [...matching].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "category") return [...matching].sort((a, b) => a.category.localeCompare(b.category));
    return matching;
  }, [active, query, sortBy]);

  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length >= 3 ? [...current.slice(1), id] : [...current, id]);
  const reset = () => { setActive("All products"); setQuery(""); setSortBy("featured"); };
  const [flagship, featured] = catalogue;

  return <PageShell eyebrow="Products / Product range" title={<>Recovery technology.<br /><em>Built around the product.</em></>} intro="Infrared sauna, HBOT, floatation, PEMF, red light / PBM and cryotherapy systems — selected for professional wellness, recovery and clinical environments across India." breadcrumb="Products" headerSlot={<div className="mt-12 grid gap-3 md:grid-cols-[1.35fr_.65fr]">
    <Link href={`/products/${flagship.id}`} className="group relative min-h-[320px] overflow-hidden bg-[#24231f] text-white"><img src={flagship.image} alt={flagship.name} className="absolute inset-0 h-full w-full object-contain opacity-90 transition duration-700 group-hover:opacity-100" /><div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/25 to-transparent" /><div className="absolute inset-x-6 bottom-6 max-w-[480px]"><div className="text-[9px] uppercase tracking-[0.22em] text-[#d5c59d]">01 / Flagship system</div><h2 className="mt-3 font-serif text-4xl leading-none sm:text-5xl">{flagship.name}</h2><div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-white/65"><span>{flagship.type} · {flagship.headline}</span><ArrowRight size={15} className="transition group-hover:translate-x-1" /></div></div></Link>
    <Link href={`/products/${featured.id}`} className="group relative min-h-[320px] overflow-hidden bg-[#314341] text-white"><img src={featured.image} alt={featured.name} className="absolute inset-0 h-full w-full object-contain opacity-90 transition duration-700 group-hover:opacity-100" /><div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" /><div className="absolute inset-x-5 bottom-5"><div className="text-[9px] uppercase tracking-[0.2em] text-[#d5c59d]">02 / Featured modality</div><h2 className="mt-3 font-serif text-3xl leading-none">{featured.name}</h2><div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.15em] text-white/65"><span>{featured.headline}</span><ArrowRight size={15} className="transition group-hover:translate-x-1" /></div></div></Link>
  </div>}>
    <div className="mt-2 grid gap-10 lg:grid-cols-[220px_1fr] lg:items-start">
      <aside className="lg:sticky lg:top-28">
        <div className="flex items-center justify-between border-b border-[#1d1d1b]/15 pb-4"><div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#24231f]"><SlidersHorizontal size={14} /> Refine</div><button onClick={reset} className="text-[9px] uppercase tracking-[0.14em] text-[#9d8251]">Reset</button></div>
        <div className="border-b border-[#1d1d1b]/15 py-5"><div className="mb-3 text-[9px] uppercase tracking-[0.18em] text-[#8a7657]">Modality</div><div className="space-y-2">{categoryNames.map((category) => <button key={category} onClick={() => setActive(category)} className={`flex w-full items-center justify-between py-1 text-left text-xs transition ${active === category ? "text-[#9d8251]" : "text-[#6f6a61] hover:text-[#24231f]"}`}><span>{category}</span><span className={`h-1.5 w-1.5 rounded-full ${active === category ? "bg-[#9d8251]" : "bg-[#c9c1b5]"}`} /></button>)}</div></div>
        <div className="border-b border-[#1d1d1b]/15 py-5"><label htmlFor="sort-products" className="mb-3 block text-[9px] uppercase tracking-[0.18em] text-[#8a7657]">Sort by</label><div className="relative"><ArrowDown size={13} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#9d8251]" /><select id="sort-products" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="w-full appearance-none border-b border-[#1d1d1b]/15 bg-transparent py-2 pr-5 text-xs text-[#4f4b43] outline-none"><option value="featured">Featured</option><option value="name">Name A–Z</option><option value="category">Modality</option></select></div></div>
        <div className="py-5"><div className="mb-3 text-[9px] uppercase tracking-[0.18em] text-[#8a7657]">Price & supply guides</div><ul className="space-y-2 text-xs text-[#6f6a61]">{categories.map((category) => <li key={category.slug}><Link href={`/guides/${category.guide}`} className="transition hover:text-[#24231f]">{category.label}</Link></li>)}</ul></div>
      </aside>
      <div>
        <div className="mb-5 flex flex-col gap-4 border-b border-[#1d1d1b]/15 pb-5 sm:flex-row sm:items-center sm:justify-between"><div className="text-[10px] uppercase tracking-[0.14em] text-[#8a7657]">{filtered.length} systems available · shortlist up to three</div><div className="flex items-center gap-2 border-b border-[#1d1d1b]/20 pb-2 text-sm text-[#5f5b53] sm:w-[250px]"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" aria-label="Search products" className="w-full bg-transparent outline-none placeholder:text-[#8c887f]" /></div></div>
        {filtered.length === 0 ? <div className="py-24 text-center text-[#6f6a61]">No systems match that search. <button className="underline" onClick={reset}>Reset the collection</button>.</div> : <div className="grid gap-x-6 gap-y-14 md:grid-cols-2 xl:grid-cols-3">{filtered.map((product, index) => <ProductCard key={product.id} product={product} index={index} selected={selected.includes(product.id)} onToggle={() => toggle(product.id)} />)}</div>}
      </div>
    </div>
    {selected.length > 0 && <div className="mt-14 flex flex-col items-start justify-between gap-4 border border-[#1d1d1b]/15 bg-[#e9e4da] p-5 sm:flex-row sm:items-center"><div><div className="text-[10px] uppercase tracking-[0.16em]">{selected.length} system{selected.length > 1 ? "s" : ""} shortlisted</div><div className="mt-1 text-xs text-[#6f6a61]">{selected.map((id) => catalogue.find((product) => product.id === id)?.name).join(" · ")}</div></div><Link href="/contact" className="inline-flex items-center gap-2 bg-[#24231f] px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-white">Request quotation for shortlist <ArrowRight size={14} /></Link></div>}
  </PageShell>;
}
