import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  Filter,
  Headphones,
  Menu,
  Minus,
  PackageCheck,
  Phone,
  Play,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

type Product = {
  id: string;
  name: string;
  eyebrow: string;
  category: string;
  price: string;
  description: string;
  image: string;
  tone: string;
  spec: string;
  badge?: string;
};

const products: Product[] = [
  {
    id: "hbot",
    name: "Aether HBOT 3.0",
    eyebrow: "Clinical recovery",
    category: "Hyperbaric",
    price: "On consultation",
    description: "A premium monoplace hyperbaric system engineered for clinical-grade recovery environments.",
    image: "/manus-storage/hyperbaric-room_f8b7624d.webp",
    tone: "from-[#d5d5ce] via-[#f2f0e9] to-[#c5c5be]",
    spec: "Up to 3 ATA",
    badge: "Best seller",
  },
  {
    id: "cryo",
    name: "NØRDIK Chamber",
    eyebrow: "Whole-body recovery",
    category: "Cryotherapy",
    price: "On consultation",
    description: "A sculptural whole-body cryotherapy experience built for high-throughput performance spaces.",
    image: "/manus-storage/cryotherapy-gym_647bf934.jpg",
    tone: "from-[#c7d9d7] via-[#e9eeeb] to-[#9fb9b5]",
    spec: "Electric / nitrogen-free",
  },
  {
    id: "pbm",
    name: "Luma 850 Bed",
    eyebrow: "Photobiomodulation",
    category: "Red light / PBM",
    price: "On consultation",
    description: "Full-body red light therapy with a considered footprint for premium recovery and wellness suites.",
    image: "/manus-storage/red-light-room_6bd1bed1.jpg",
    tone: "from-[#be938b] via-[#f0d7cf] to-[#813f3b]",
    spec: "660nm + 850nm",
    badge: "New arrival",
  },
  {
    id: "plunge",
    name: "Mizu Cold Plunge",
    eyebrow: "Contrast therapy",
    category: "Cold plunge",
    price: "On consultation",
    description: "A commercial-grade cold plunge with a calm, architectural silhouette for hospitality and performance use.",
    image: "/manus-storage/wellness-club_26daad98.jpg",
    tone: "from-[#cad9dc] via-[#e9f1f1] to-[#78969a]",
    spec: "Commercial capacity",
  },
  {
    id: "compression",
    name: "Velo Compression System",
    eyebrow: "Active recovery",
    category: "Compression",
    price: "On consultation",
    description: "A fast, intuitive compression station designed to complete a premium recovery circuit.",
    image: "/manus-storage/wellness-club_26daad98.jpg",
    tone: "from-[#d3c9bd] via-[#f1ece5] to-[#a7917f]",
    spec: "Multi-zone control",
  },
];

const categories = ["All equipment", "Hyperbaric", "Cryotherapy", "Red light / PBM", "Cold plunge", "Compression"];

const trustItems = [
  { icon: ShieldCheck, value: "3 ATA", label: "clinical-grade capability" },
  { icon: PackageCheck, value: "End-to-end", label: "delivery and commissioning" },
  { icon: Headphones, value: "India-wide", label: "technical support" },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All equipment");
  const [query, setQuery] = useState("");
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const normalisedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = activeCategory === "All equipment" || product.category === activeCategory;
      const matchesQuery = !normalisedQuery || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(normalisedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const toggleShortlist = (id: string) => {
    setShortlist((current) => {
      const exists = current.includes(id);
      toast(exists ? "Removed from comparison" : "Added to comparison", {
        description: exists ? "The product is no longer in your shortlist." : "Compare up to three systems side by side.",
      });
      if (!exists && current.length >= 3) return [...current.slice(1), id];
      return exists ? current.filter((item) => item !== id) : [...current, id];
    });
  };

  const openEnquiry = (productName?: string) => {
    setEnquiryOpen(true);
    if (productName) toast(`${productName} added to your enquiry`, { description: "Tell us about your space and we will recommend the next step." });
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#191918] selection:bg-[#bca477] selection:text-[#171717]">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#161615]/95 text-[#f8f5ee] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 lg:px-10">
          <a href="#top" className="group flex items-center gap-3" aria-label="AAAYAN home">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#b7a77e]/60 text-[10px] tracking-[0.24em] text-[#d4c39b]">AA</span>
            <span className="leading-none">
              <span className="block font-serif text-[18px] tracking-[0.16em]">AAAYAN</span>
              <span className="mt-1 block text-[8px] uppercase tracking-[0.36em] text-white/55">Immunotech</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 text-[10px] uppercase tracking-[0.2em] text-white/65 lg:flex" aria-label="Primary">
            <Link href="/products" className="transition-colors hover:text-white">Shop equipment</Link>
            <Link href="/sectors" className="transition-colors hover:text-white">Sectors</Link>
            <Link href="/blogs" className="transition-colors hover:text-white">Science & journal</Link>
            <Link href="/support" className="transition-colors hover:text-white">Support</Link>
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => openEnquiry()} className="hidden border border-[#d5c59d]/70 px-4 py-2.5 text-[10px] uppercase tracking-[0.18em] text-[#f4e8c7] transition hover:bg-[#d5c59d] hover:text-[#1d1b18] sm:block">Request a quote</button>
            <button onClick={() => setMobileOpen((value) => !value)} className="rounded-full border border-white/15 p-2 lg:hidden" aria-label="Toggle menu">{mobileOpen ? <X size={18} /> : <Menu size={18} />}</button>
          </div>
        </div>
        {mobileOpen && (
          <div className="border-t border-white/10 bg-[#161615] px-5 py-4 lg:hidden">
            <div className="flex flex-col gap-4 text-[10px] uppercase tracking-[0.2em] text-white/65">
              <Link href="/products" onClick={() => setMobileOpen(false)} className="text-left">Shop equipment</Link>
              <Link href="/sectors" onClick={() => setMobileOpen(false)} className="text-left">Sectors</Link>
              <Link href="/blogs" onClick={() => setMobileOpen(false)} className="text-left">Science & journal</Link>
              <Link href="/support" onClick={() => setMobileOpen(false)} className="text-left">Support</Link>
              <button onClick={() => { setMobileOpen(false); openEnquiry(); }} className="w-fit border border-[#d5c59d]/70 px-4 py-2.5 text-[#f4e8c7]">Request a quote</button>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        <section className="relative min-h-[760px] overflow-hidden bg-[#191918] pt-24 text-[#f9f7f1] lg:min-h-[820px]">
          <img src="/manus-storage/hyperbaric-room_f8b7624d.webp" alt="Hyperbaric chamber in a premium recovery space" className="absolute inset-0 h-full w-full object-cover opacity-75" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,13,12,.95)_0%,rgba(13,13,12,.7)_42%,rgba(13,13,12,.12)_90%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(13,13,12,.84)_0%,transparent_36%)]" />
          <div className="relative mx-auto flex min-h-[680px] max-w-[1440px] flex-col justify-center px-5 pb-20 lg:px-16">
            <div className="max-w-[650px]">
              <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-[#d7c79e]"><span className="h-px w-10 bg-[#d7c79e]" /> Human potential, redefined.</div>
              <h1 className="max-w-[720px] font-serif text-[clamp(3.2rem,7vw,7.5rem)] leading-[.88] tracking-[-0.045em]">Recovery equipment, <em className="font-light text-[#d6c6a1]">elevated.</em></h1>
              <p className="mt-8 max-w-[500px] text-[15px] leading-7 text-white/72 lg:text-[17px]">Clinical-grade hyperbaric, cryotherapy and photobiomodulation systems for facilities that refuse to compromise.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <button onClick={() => scrollToSection("catalogue")} className="group inline-flex items-center gap-3 bg-[#d5c59d] px-5 py-3.5 text-[10px] uppercase tracking-[0.18em] text-[#1c1b18] transition hover:bg-[#f4e9cc]">Shop equipment <ArrowRight size={14} className="transition group-hover:translate-x-1" /></button>
                <button onClick={() => openEnquiry()} className="inline-flex items-center gap-3 border border-white/35 px-5 py-3.5 text-[10px] uppercase tracking-[0.18em] text-white transition hover:border-white hover:bg-white/10">Talk to a specialist</button>
              </div>
            </div>

            <div className="mt-auto grid max-w-[800px] grid-cols-1 gap-4 border-t border-white/20 pt-5 sm:grid-cols-3">
              {trustItems.map(({ icon: Icon, value, label }) => <div key={value} className="flex items-center gap-3"><Icon size={17} className="text-[#d5c59d]" /><div><div className="text-[11px] uppercase tracking-[0.12em] text-white">{value}</div><div className="mt-1 text-[11px] text-white/50">{label}</div></div></div>)}
            </div>
          </div>
          <button onClick={() => scrollToSection("catalogue")} className="absolute bottom-8 right-6 hidden items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-white/55 lg:flex">Explore the collection <ArrowDown size={14} /></button>
        </section>

        <section id="catalogue" className="scroll-mt-20 bg-[#f4f1ea] px-5 py-20 lg:px-16 lg:py-28">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex flex-col justify-between gap-8 border-b border-[#1d1d1b]/15 pb-9 lg:flex-row lg:items-end">
              <div>
                <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#8a7657]">The collection / 01</div>
                <h2 className="max-w-[660px] font-serif text-[clamp(2.8rem,5vw,5.5rem)] leading-[.92] tracking-[-0.04em]">Built for <em className="font-light">better</em> recovery.</h2>
                <p className="mt-5 max-w-[530px] text-sm leading-6 text-[#5f5b53]">Explore the systems that anchor a complete recovery environment. Select a category, compare your shortlist, or enquire for a tailored specification.</p>
              </div>
              <div className="flex items-center gap-2 border-b border-[#1d1d1b]/20 pb-2 text-sm text-[#5f5b53] lg:w-[270px]"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search equipment" className="w-full bg-transparent outline-none placeholder:text-[#8c887f]" /></div>
            </div>

            <div className="mt-7 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((category) => <button key={category} onClick={() => setActiveCategory(category)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.14em] transition ${activeCategory === category ? "border-[#24231f] bg-[#24231f] text-white" : "border-[#1d1d1b]/15 text-[#6f6a61] hover:border-[#24231f] hover:text-[#24231f]"}`}>{category}</button>)}
            </div>

            {filteredProducts.length === 0 ? <div className="py-24 text-center text-[#6f6a61]">No systems match that search. Try another category or <button className="underline" onClick={() => { setQuery(""); setActiveCategory("All equipment"); }}>reset the collection</button>.</div> : <div className="mt-10 grid gap-x-5 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} isShortlisted={shortlist.includes(product.id)} onCompare={() => toggleShortlist(product.id)} onEnquire={() => openEnquiry(product.name)} />)}
            </div>}
          </div>
        </section>

        <section id="solutions" className="scroll-mt-20 bg-[#20201e] px-5 py-20 text-[#f6f1e8] lg:px-16 lg:py-28">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-12 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
              <div><div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#d5c59d]">Choose your environment / 02</div><h2 className="font-serif text-[clamp(2.8rem,5vw,5.5rem)] leading-[.9] tracking-[-0.04em]">One system.<br /><em className="font-light text-[#d5c59d]">Your way.</em></h2></div>
              <p className="max-w-[540px] text-sm leading-7 text-white/55 lg:justify-self-end">From a private recovery room to a high-performance club, we help you specify the right equipment, footprint, and support model for the space you are building.</p>
            </div>
            <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[{ title: "Clinics & medical", body: "Clinical-grade systems and a considered patient experience.", image: "/manus-storage/hyperbaric-room_f8b7624d.webp" }, { title: "Performance clubs", body: "Recovery infrastructure that elevates every membership.", image: "/manus-storage/cryotherapy-gym_647bf934.jpg" }, { title: "Hospitality", body: "A wellness offering guests remember and return for.", image: "/manus-storage/wellness-club_26daad98.jpg" }, { title: "Private spaces", body: "World-class recovery, quietly integrated at home.", image: "/manus-storage/red-light-room_6bd1bed1.jpg" }].map((item) => <button key={item.title} onClick={() => openEnquiry()} className="group relative min-h-[330px] overflow-hidden text-left"><img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" /><div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" /><div className="absolute inset-x-5 bottom-5"><div className="text-[10px] uppercase tracking-[0.16em] text-[#d5c59d]">{String(["01", "02", "03", "04"][(["Clinics & medical", "Performance clubs", "Hospitality", "Private spaces"].indexOf(item.title))]).padStart(2, "0")}</div><h3 className="mt-2 font-serif text-2xl">{item.title}</h3><p className="mt-2 max-w-[230px] text-xs leading-5 text-white/62">{item.body}</p><span className="mt-4 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-white/75">Find your system <ArrowRight size={13} className="transition group-hover:translate-x-1" /></span></div></button>)}</div>
          </div>
        </section>

        <section id="science" className="scroll-mt-20 bg-[#e9e4da] px-5 py-20 lg:px-16 lg:py-28">
          <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="relative min-h-[460px] overflow-hidden bg-[#c6b9a1]"><img src="/manus-storage/red-light-room_6bd1bed1.jpg" alt="Red light therapy room" className="absolute inset-0 h-full w-full object-cover mix-blend-multiply opacity-80" /><div className="absolute left-5 top-5 rounded-full border border-white/50 px-3 py-2 text-[9px] uppercase tracking-[0.2em] text-white">Science, made tangible</div><div className="absolute bottom-5 left-5 text-white"><div className="font-serif text-5xl">660 / 850</div><div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/75">nanometre light architecture</div></div></div>
            <div className="lg:pl-10"><div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#8a7657]">Why AAAYAN / 03</div><h2 className="font-serif text-[clamp(2.8rem,5vw,5.5rem)] leading-[.9] tracking-[-0.04em]">Technology with a <em className="font-light">point of view.</em></h2><p className="mt-7 max-w-[520px] text-sm leading-7 text-[#5f5b53]">We do not fill a room with machines. We curate the right recovery circuit for the people, protocols, and performance goals it needs to serve.</p><div className="mt-9 grid gap-4 border-t border-[#1d1d1b]/15 pt-6 sm:grid-cols-2"><div><Sparkles size={18} className="text-[#9d8251]" /><h3 className="mt-4 font-serif text-xl">Curated, not crowded</h3><p className="mt-2 text-xs leading-5 text-[#6f6a61]">Every recommendation starts with your space and your operating model.</p></div><div><CircleHelp size={18} className="text-[#9d8251]" /><h3 className="mt-4 font-serif text-xl">Human support</h3><p className="mt-2 text-xs leading-5 text-[#6f6a61]">From site survey to training, a specialist stays close to the project.</p></div></div><button onClick={() => openEnquiry()} className="mt-9 inline-flex items-center gap-3 border-b border-[#24231f] pb-2 text-[10px] uppercase tracking-[0.18em]">Talk through your project <ArrowRight size={14} /></button></div>
          </div>
        </section>

        <section id="support" className="scroll-mt-20 bg-[#f4f1ea] px-5 py-20 lg:px-16 lg:py-28">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-10 border-b border-[#1d1d1b]/15 pb-12 lg:grid-cols-[.7fr_1.3fr] lg:items-end"><div><div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#8a7657]">From plan to performance / 04</div><h2 className="font-serif text-[clamp(2.8rem,5vw,5.5rem)] leading-[.9] tracking-[-0.04em]">A better way<br />to <em className="font-light">buy wellness.</em></h2></div><p className="max-w-[500px] text-sm leading-7 text-[#5f5b53] lg:justify-self-end">The future ecommerce layer can start with product discovery today. When your requirements are complex, our specialists make the path personal.</p></div>
            <div className="grid gap-8 pt-12 md:grid-cols-3"><Step number="01" title="Discover" body="Browse equipment by modality, environment, or desired outcome." /><Step number="02" title="Specify" body="Compare the right systems and share your space, capacity, and goals." /><Step number="03" title="Deploy" body="Receive a considered quote with delivery, installation, training, and support." /></div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#171716] px-5 py-20 text-white lg:px-16 lg:py-24"><div className="absolute right-[-8%] top-[-80%] h-[160%] w-[55%] rounded-full bg-[#a28457]/15 blur-3xl" /><div className="relative mx-auto flex max-w-[1440px] flex-col justify-between gap-10 lg:flex-row lg:items-center"><div><div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#d5c59d]">Make the first move / 05</div><h2 className="max-w-[750px] font-serif text-[clamp(2.6rem,5vw,5.5rem)] leading-[.9] tracking-[-0.04em]">Find the right system<br /><em className="font-light text-[#d5c59d]">for your space.</em></h2></div><div className="flex flex-wrap gap-3"><button onClick={() => scrollToSection("catalogue")} className="inline-flex items-center gap-3 bg-[#d5c59d] px-5 py-3.5 text-[10px] uppercase tracking-[0.18em] text-[#1c1b18] transition hover:bg-[#f4e9cc]">Explore equipment <ArrowRight size={14} /></button><button onClick={() => openEnquiry()} className="inline-flex items-center gap-3 border border-white/30 px-5 py-3.5 text-[10px] uppercase tracking-[0.18em] transition hover:border-white">Request a quote</button></div></div></section>
      </main>

      <footer className="bg-[#f4f1ea] px-5 py-12 lg:px-16"><div className="mx-auto flex max-w-[1440px] flex-col gap-9 lg:flex-row lg:items-end lg:justify-between"><div><div className="font-serif text-2xl tracking-[0.16em]">AAAYAN</div><div className="mt-2 text-[9px] uppercase tracking-[0.3em] text-[#7f786d]">Immunotech / Recovery infrastructure</div></div><div className="flex flex-wrap gap-x-7 gap-y-3 text-[10px] uppercase tracking-[0.16em] text-[#6f6a61]"><button onClick={() => scrollToSection("catalogue")}>Equipment</button><button onClick={() => scrollToSection("solutions")}>Solutions</button><button onClick={() => scrollToSection("science")}>Science</button><button onClick={() => scrollToSection("support")}>Support</button><button onClick={() => openEnquiry()}>Contact</button></div><div className="text-right text-[10px] leading-5 text-[#8c887f]"><div>info@aaayanimmunotech.co.in</div><div>New Delhi · India</div></div></div><div className="mx-auto mt-10 flex max-w-[1440px] justify-between border-t border-[#1d1d1b]/10 pt-5 text-[9px] uppercase tracking-[0.15em] text-[#9b968d]"><span>© 2026 AAAYAN Immunotech LLP</span><span>Privacy · Terms</span></div></footer>

      {shortlist.length > 0 && <div className="fixed bottom-5 left-1/2 z-30 flex w-[calc(100%-2rem)] max-w-[610px] -translate-x-1/2 items-center justify-between gap-4 rounded-full border border-white/10 bg-[#22221f]/95 px-4 py-3 text-white shadow-2xl backdrop-blur-xl sm:px-5"><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d5c59d] text-[#1c1b18]"><ShoppingBag size={15} /></div><div><div className="text-[10px] uppercase tracking-[0.16em]">{shortlist.length} system{shortlist.length > 1 ? "s" : ""} shortlisted</div><div className="mt-0.5 text-[10px] text-white/50">Compare the right fit for your space</div></div></div><button onClick={() => openEnquiry()} className="shrink-0 border border-[#d5c59d]/80 px-3 py-2 text-[9px] uppercase tracking-[0.14em] text-[#f3e6c6] transition hover:bg-[#d5c59d] hover:text-[#1c1b18] sm:px-4">Compare / enquire</button></div>}

      {enquiryOpen && <EnquiryDrawer shortlisted={shortlist.map((id) => products.find((product) => product.id === id)?.name).filter(Boolean) as string[]} onClose={() => setEnquiryOpen(false)} />}
    </div>
  );
}

function ProductCard({ product, index, isShortlisted, onCompare, onEnquire }: { product: Product; index: number; isShortlisted: boolean; onCompare: () => void; onEnquire: () => void }) {
  return <article className="group">
    <div className={`relative aspect-[1.04] overflow-hidden bg-gradient-to-br ${product.tone}`}>
      <img src={product.image} alt={product.name} className="h-full w-full object-cover opacity-90 mix-blend-multiply transition duration-500 group-hover:scale-105 group-hover:mix-blend-normal" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10 opacity-70" />
      <div className="absolute inset-x-4 top-4 flex items-start justify-between"><span className="rounded-full bg-[#f4f1ea]/90 px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] text-[#514b42]">{String(index + 1).padStart(2, "0")}</span>{product.badge && <span className="rounded-full bg-[#d5c59d] px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] text-[#28231a]">{product.badge}</span>}</div>
      <button onClick={onCompare} aria-label={`${isShortlisted ? "Remove" : "Add"} ${product.name} ${isShortlisted ? "from" : "to"} comparison`} className={`absolute bottom-4 right-4 flex items-center gap-2 rounded-full px-3 py-2 text-[9px] uppercase tracking-[0.12em] transition ${isShortlisted ? "bg-[#d5c59d] text-[#1c1b18]" : "bg-[#191918]/75 text-white hover:bg-[#d5c59d] hover:text-[#1c1b18]"}`}>{isShortlisted ? <Check size={13} /> : <Plus size={13} />} {isShortlisted ? "Selected" : "Compare"}</button>
    </div>
    <div className="flex items-start justify-between gap-4 pt-5"><div><div className="text-[9px] uppercase tracking-[0.2em] text-[#9d8251]">{product.eyebrow}</div><h3 className="mt-2 font-serif text-[28px] leading-none tracking-[-0.03em]">{product.name}</h3></div><div className="pt-1 text-right text-[10px] uppercase tracking-[0.1em] text-[#777067]">{product.spec}</div></div>
    <p className="mt-4 max-w-[410px] text-xs leading-5 text-[#6f6a61]">{product.description}</p>
    <div className="mt-5 flex items-center justify-between border-t border-[#1d1d1b]/12 pt-4"><span className="text-[10px] uppercase tracking-[0.13em] text-[#777067]">{product.price}</span><button onClick={onEnquire} className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-[#292720] transition hover:text-[#9d8251]">Enquire <ArrowRight size={14} /></button></div>
  </article>;
}

function Step({ number, title, body }: { number: string; title: string; body: string }) {
  return <div className="border-t border-[#1d1d1b]/25 pt-4"><div className="flex items-center justify-between"><span className="text-[10px] uppercase tracking-[0.2em] text-[#9d8251]">{number}</span><ArrowRight size={15} className="text-[#9d8251]" /></div><h3 className="mt-7 font-serif text-3xl">{title}</h3><p className="mt-3 max-w-[280px] text-xs leading-5 text-[#6f6a61]">{body}</p></div>;
}

function EnquiryDrawer({ shortlisted, onClose }: { shortlisted: string[]; onClose: () => void }) {
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Enquiry saved", { description: "A specialist will be in touch with the next step." });
    onClose();
  };
  return <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Request a quote"><button className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Close enquiry" /><aside className="relative z-10 h-full w-full max-w-[520px] overflow-y-auto bg-[#f4f1ea] px-6 py-7 text-[#1c1c1a] shadow-2xl sm:px-10"><div className="flex items-start justify-between border-b border-[#1d1d1b]/15 pb-6"><div><div className="text-[10px] uppercase tracking-[0.25em] text-[#9d8251]">Start a conversation</div><h2 className="mt-3 font-serif text-4xl leading-none">Find your fit.</h2></div><button onClick={onClose} className="rounded-full border border-[#1d1d1b]/15 p-2" aria-label="Close"><X size={18} /></button></div><p className="mt-7 text-sm leading-6 text-[#6f6a61]">Tell us a little about your space and we will guide you toward the right equipment, scope, and next step.</p>{shortlisted.length > 0 && <div className="mt-6 rounded-sm bg-[#e9e4da] p-4"><div className="text-[9px] uppercase tracking-[0.18em] text-[#8a7657]">Your shortlist</div><div className="mt-3 space-y-2">{shortlisted.map((product) => <div key={product} className="flex items-center gap-2 text-sm"><Check size={14} className="text-[#9d8251]" />{product}</div>)}</div></div>}<form onSubmit={submit} className="mt-8 space-y-5"><Field label="Your name" placeholder="Full name" required /><Field label="Work email" placeholder="you@company.com" type="email" required /><div><label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-[#6f6a61]">What are you building?</label><select className="w-full border-b border-[#1d1d1b]/20 bg-transparent px-0 py-3 text-sm outline-none"><option>Clinic or medical facility</option><option>Gym or performance club</option><option>Hotel or hospitality space</option><option>Private / residential space</option><option>Exploring equipment</option></select></div><Field label="City" placeholder="Where is the project located?" /><div><label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-[#6f6a61]">Tell us about your requirement</label><textarea className="min-h-[105px] w-full resize-none border-b border-[#1d1d1b]/20 bg-transparent px-0 py-3 text-sm outline-none" placeholder="Equipment, space, timeline, or anything else we should know..." /></div><button type="submit" className="mt-3 flex w-full items-center justify-center gap-3 bg-[#24231f] px-5 py-4 text-[10px] uppercase tracking-[0.18em] text-white transition hover:bg-[#9d8251]">Send enquiry <ArrowRight size={14} /></button></form><div className="mt-8 flex items-center gap-3 border-t border-[#1d1d1b]/15 pt-6 text-xs text-[#6f6a61]"><Phone size={15} className="text-[#9d8251]" />Prefer a direct conversation? <span className="font-medium text-[#24231f]">+91 98765 43210</span></div></aside></div>;
}

function Field({ label, placeholder, type = "text", required = false }: { label: string; placeholder: string; type?: string; required?: boolean }) {
  return <div><label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-[#6f6a61]">{label}</label><input required={required} type={type} placeholder={placeholder} className="w-full border-b border-[#1d1d1b]/20 bg-transparent px-0 py-3 text-sm outline-none placeholder:text-[#a19c93] focus:border-[#9d8251]" /></div>;
}
