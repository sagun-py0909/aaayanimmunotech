import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { Link, useSearch } from "wouter";
import { PageShell, ProductCard } from "@/components/SiteChrome";
import { catalogue, categories } from "@/data/site";

export default function Products() {
  // The modality filter is in the URL so the nav, the footer and a shared link can all land on a filtered view.
  const search = useSearch();
  const requested = categories.find((category) => category.slug === new URLSearchParams(search).get("modality"))?.name;
  const [active, setActive] = useState(requested ?? "All products");
  useEffect(() => { setActive(requested ?? "All products"); }, [requested]);
  const selectModality = (name: string) => {
    setActive(name);
    const slug = categories.find((category) => category.name === name)?.slug;
    const url = slug ? `/products?modality=${slug}` : "/products";
    window.history.replaceState(null, "", url);
  };
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const filtered = useMemo(() => {
    const normalised = query.trim().toLowerCase();
    return catalogue.filter((product) => (active === "All products" || product.category === active) && (!normalised || `${product.name} ${product.type} ${product.category} ${product.description}`.toLowerCase().includes(normalised)));
  }, [active, query]);

  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length >= 3 ? [...current.slice(1), id] : [...current, id]);
  const reset = () => { selectModality("All products"); setQuery(""); };
  const [flagship, featured] = catalogue;

  return <PageShell eyebrow="Products" title={<>Recovery technology, <em>built around the product.</em></>} intro="Infrared sauna, HBOT, floatation, PEMF, red light and cryotherapy systems for wellness and clinical spaces across India." breadcrumb="Products" headerSlot={<div className="mt-8 grid gap-3 md:grid-cols-[1.35fr_.65fr]">
    <Link href={`/products/${flagship.id}`} className="group relative min-h-[320px] overflow-hidden bg-[#4E141D] text-white"><img src={flagship.image} alt={flagship.name} className="absolute inset-0 h-full w-full object-contain opacity-90 transition duration-700 group-hover:opacity-100" /><div className="absolute inset-0 bg-gradient-to-r from-[#2E0A10]/80 via-[#2E0A10]/25 to-transparent" /><div className="absolute inset-x-6 bottom-6 max-w-[480px]"><div className="text-[9px] uppercase tracking-[0.22em] text-[#C5A059]">01 / Flagship system</div><h2 className="mt-3 font-serif text-4xl leading-none sm:text-5xl">{flagship.name}</h2><div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-white/65"><span>{[flagship.type, flagship.headline].filter(Boolean).join(" · ")}</span><ArrowRight size={15} className="transition group-hover:translate-x-1" /></div></div></Link>
    <Link href={`/products/${featured.id}`} className="group relative min-h-[320px] overflow-hidden bg-[#4E141D] text-white"><img src={featured.image} alt={featured.name} className="absolute inset-0 h-full w-full object-contain opacity-90 transition duration-700 group-hover:opacity-100" /><div className="absolute inset-0 bg-gradient-to-t from-[#2E0A10]/85 via-[#2E0A10]/20 to-transparent" /><div className="absolute inset-x-5 bottom-5"><div className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059]">02 / Featured modality</div><h2 className="mt-3 font-serif text-3xl leading-none">{featured.name}</h2><div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.15em] text-white/65"><span>{featured.type}</span><ArrowRight size={15} className="transition group-hover:translate-x-1" /></div></div></Link>
  </div>}>
    <div className="mt-2">
        <div className="mb-5 flex flex-col gap-4 border-b border-[#4E141D]/15 pb-5 sm:flex-row sm:items-center sm:justify-between"><div className="text-[10px] uppercase tracking-[0.14em] text-[#8a7657]">{filtered.length} {filtered.length === 1 ? "system" : "systems"} available · shortlist up to three</div><div className="flex items-center gap-2 border-b border-[#4E141D]/20 pb-2 text-sm text-[#5f5b53] sm:w-[250px]"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" aria-label="Search products" className="w-full bg-transparent outline-none placeholder:text-[#8c887f]" /></div></div>
        {filtered.length === 0 ? <div className="py-24 text-center text-[#6f6a61]">No systems match that search. <button className="underline" onClick={reset}>Reset the collection</button>.</div> : <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">{filtered.map((product, index) => <ProductCard key={product.id} product={product} index={index} selected={selected.includes(product.id)} onToggle={() => toggle(product.id)} />)}</div>}
    </div>
    {selected.length > 0 && <div className="mt-14 flex flex-col items-start justify-between gap-4 border border-[#4E141D]/15 bg-[#e9e4da] p-5 sm:flex-row sm:items-center"><div><div className="text-[10px] uppercase tracking-[0.16em]">{selected.length} system{selected.length > 1 ? "s" : ""} shortlisted</div><div className="mt-1 text-xs text-[#6f6a61]">{selected.map((id) => catalogue.find((product) => product.id === id)?.name).join(" · ")}</div></div><Link href="/contact" className="inline-flex items-center gap-2 bg-[#4E141D] px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-white">Request quotation for shortlist <ArrowRight size={14} /></Link></div>}
  </PageShell>;
}
