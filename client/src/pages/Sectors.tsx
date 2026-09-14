import { ArrowRight, Check } from "lucide-react";
import { Link, useRoute } from "wouter";
import { Html, PageShell, ProductCard, SiteFooter, SiteHeader, StatsStrip, pad } from "@/components/SiteChrome";
import { catalogue, sectors, type Product } from "@/data/site";
import { Faqs } from "./ContentPages";
import NotFound from "./NotFound";

export function Sectors() {
  return <PageShell eyebrow="Sectors / Where we install" title={<>Designed around<br /><em>your environment.</em></>} intro="Wellness infrastructure for medical clinics, hotels and spas, sports facilities, corporate campuses and private residences — site survey to staff training, end to end." breadcrumb="Sectors" after={<StatsStrip />}>
    <div className="space-y-5">
      {sectors.map((sector, index) => <Link key={sector.slug} href={`/sectors/${sector.slug}`} className="group grid overflow-hidden bg-[#e9e4da] lg:grid-cols-2">
        <div className={`relative min-h-[320px] overflow-hidden bg-[#1A3B63] lg:min-h-[460px] ${index % 2 ? "lg:order-2" : ""}`}>
          <img src={sector.image} alt={sector.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute left-5 top-5 rounded-full bg-[#f4f1ea]/90 px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-[#514b42]">{pad(index)} / {sector.label}</div>
        </div>
        <div className="flex flex-col justify-between gap-10 p-7 lg:p-12">
          <div>
            <h2 className="font-serif text-[clamp(2.4rem,4vw,4rem)] leading-[.92] tracking-[-0.03em]">{sector.title}</h2>
            <p className="mt-4 font-serif text-xl italic text-[#8a7657]">{sector.subtitle}</p>
            <p className="mt-6 max-w-[540px] text-sm leading-7 text-[#5f5b53]">{sector.description}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">{sector.features.slice(0, 4).map((feature) => <span key={feature.name} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.13em] text-[#4f4b43]"><Check size={13} className="shrink-0 text-[#C5A059]" />{feature.name}</span>)}</div>
          </div>
          <div className="flex items-center justify-between border-t border-[#132F4F]/15 pt-5"><span className="text-[10px] uppercase tracking-[0.14em] text-[#777067]">{sector.heroTag}</span><span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em]">Explore sector <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span></div>
        </div>
      </Link>)}
    </div>
  </PageShell>;
}

export function SectorDetail() {
  const [, params] = useRoute<{ slug: string }>("/sectors/:slug");
  const sectorIndex = sectors.findIndex((item) => item.slug === params?.slug);
  const sector = sectors[sectorIndex];
  if (!sector) return <NotFound />;

  const recommendedIds = Array.from(new Set([...sector.recommended, ...catalogue.filter((product) => product.sectors.includes(sector.slug)).map((product) => product.id)]));
  const recommended = recommendedIds.map((id) => catalogue.find((product) => product.id === id)).filter((product): product is Product => Boolean(product)).slice(0, 4);
  const others = sectors.filter((item) => item.slug !== sector.slug);
  const next = sectors[(sectorIndex + 1) % sectors.length];

  return <div className="min-h-screen bg-[#f4f1ea] text-[#132F4F]">
    <SiteHeader />
    <main>
      <section className="relative overflow-hidden bg-[#132F4F] pt-24 text-[#f9f7f1]">
        <img src={sector.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,28,51,.95)_0%,rgba(10,28,51,.72)_45%,rgba(10,28,51,.15)_100%)]" />
        <div className="relative mx-auto flex min-h-[640px] max-w-[1440px] flex-col justify-end px-5 pb-16 lg:px-16">
          <nav aria-label="Breadcrumb" className="mb-10 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/55"><Link href="/" className="hover:text-white">Home</Link><span>/</span><Link href="/sectors" className="hover:text-white">Sectors</Link><span>/</span><span className="text-[#C5A059]">{sector.title}</span></nav>
          <div className="max-w-[780px]">
            <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-[#d7c79e]"><span className="h-px w-10 bg-[#d7c79e]" /> {pad(sectorIndex)} / {sector.heroTag}</div>
            <Html as="h1" html={sector.headingHtml} className="font-serif text-[clamp(3.2rem,7vw,7rem)] leading-[.88] tracking-[-0.045em] [&_em]:font-light [&_em]:text-[#d6c6a1]" />
            <p className="mt-6 font-serif text-2xl italic text-[#d6c6a1]">{sector.subtitle}</p>
            <p className="mt-6 max-w-[580px] text-[15px] leading-7 text-white/70">{sector.description}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contact" className="group inline-flex items-center gap-3 bg-[#C5A059] px-5 py-3.5 text-[10px] uppercase tracking-[0.18em] text-[#132F4F] transition hover:bg-[#f4e9cc]">Request a quotation <ArrowRight size={14} className="transition group-hover:translate-x-1" /></Link>
              <a href="#specs" className="inline-flex items-center gap-3 border border-white/35 px-5 py-3.5 text-[10px] uppercase tracking-[0.18em] text-white transition hover:border-white hover:bg-white/10">Equipment & specifications</a>
            </div>
          </div>
        </div>
      </section>

      {sector.stats.length > 0 && <section className="bg-[#132F4F] px-5 py-10 text-white lg:px-16">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">{sector.stats.map((stat) => <div key={stat.label} className="border-t border-white/15 pt-4"><div className="font-serif text-5xl leading-none">{stat.value}<span className="ml-1 text-xl text-[#C5A059]">{stat.unit}</span></div><div className="mt-3 text-[10px] uppercase tracking-[0.18em] text-white/55">{stat.label}</div></div>)}</div>
      </section>}

      <section className="px-5 py-20 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <div className="border-b border-[#132F4F]/15 pb-10"><div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#8a7657]">{sector.equipmentTag} / 01</div><Html as="h2" html={sector.equipmentHeadingHtml} className="font-serif text-[clamp(2.6rem,4.6vw,5rem)] leading-[.92] tracking-[-0.04em] [&_em]:font-light [&_em]:text-[#C5A059]" /></div>
          <div className="grid gap-x-8 gap-y-10 pt-12 md:grid-cols-2 lg:grid-cols-3">{sector.features.map((feature, index) => <div key={feature.name} className="border-t border-[#132F4F]/25 pt-4"><div className="flex items-center justify-between"><span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059]">{pad(index)}</span><ArrowRight size={15} className="text-[#C5A059]" /></div><h3 className="mt-6 font-serif text-3xl leading-tight">{feature.name}</h3><p className="mt-3 max-w-[380px] text-sm leading-6 text-[#6f6a61]">{feature.description}</p></div>)}</div>
        </div>
      </section>

      <section id="systems" className="scroll-mt-20 bg-[#e9e4da] px-5 py-20 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col justify-between gap-8 border-b border-[#132F4F]/15 pb-10 lg:flex-row lg:items-end">
            <div><div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#8a7657]">Recommended systems / 02</div><h2 className="max-w-[760px] font-serif text-[clamp(2.6rem,4.6vw,5rem)] leading-[.92] tracking-[-0.04em]">The right circuit for <em className="font-light text-[#C5A059]">{sector.title.toLowerCase()}.</em></h2></div>
            <Link href="/products" className="inline-flex w-fit items-center gap-2 border-b border-[#132F4F] pb-2 text-[10px] uppercase tracking-[0.18em]">View full range <ArrowRight size={14} /></Link>
          </div>
          <div className="mt-12 grid gap-x-6 gap-y-14 md:grid-cols-2 xl:grid-cols-4">{recommended.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>
        </div>
      </section>

      <section id="specs" className="scroll-mt-20 bg-[#132F4F] px-5 py-20 text-[#f6f1e8] lg:px-16 lg:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#C5A059]">{sector.specsTag} / 03</div>
            <Html as="h2" html={sector.specsHeadingHtml} className="font-serif text-[clamp(2.6rem,4.6vw,5rem)] leading-[.92] tracking-[-0.04em] [&_em]:font-light [&_em]:text-[#C5A059]" />
            <dl className="mt-10 border-t border-white/12">{sector.specs.map(([label, value]) => <div key={label} className="grid gap-2 border-b border-white/12 py-4 sm:grid-cols-[.4fr_.6fr]"><dt className="text-[10px] uppercase tracking-[0.16em] text-white/45">{label}</dt><dd className="text-sm leading-6 text-white/80">{value}</dd></div>)}</dl>
          </div>
          <div className="self-start bg-[#f4f1ea] p-8 text-[#132F4F] lg:p-10">
            <div className="text-[10px] uppercase tracking-[0.22em] text-[#C5A059]">{sector.enquiry.label}</div>
            <h3 className="mt-4 font-serif text-4xl leading-tight">{sector.enquiry.title}</h3>
            <p className="mt-4 text-sm leading-7 text-[#5f5b53]">{sector.enquiry.description}</p>
            <ul className="mt-6 space-y-3">{sector.enquiry.points.map((point) => <li key={point} className="flex items-start gap-3 text-sm text-[#4f4b43]"><Check size={15} className="mt-0.5 shrink-0 text-[#C5A059]" />{point}</li>)}</ul>
            <Link href="/contact" className="mt-8 inline-flex items-center gap-3 bg-[#132F4F] px-5 py-4 text-[10px] uppercase tracking-[0.18em] text-white transition hover:bg-[#C5A059]">Request a quotation <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-16 lg:py-24">
        <figure className="mx-auto max-w-[980px] text-center">
          <blockquote className="font-serif text-[clamp(1.8rem,3.2vw,3rem)] italic leading-[1.2] text-[#132F4F]">“{sector.quote}”</blockquote>
          <figcaption className="mt-8 text-[10px] uppercase tracking-[0.22em] text-[#8a7657]">AAAyan Immunotech · {sector.title}</figcaption>
        </figure>
      </section>

      <Faqs faqs={sector.faqs} />

      <section className="bg-[#e9e4da] px-5 py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 flex items-end justify-between gap-6"><div><div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#8a7657]">Other sectors / 04</div><h2 className="font-serif text-[clamp(2.2rem,3.6vw,3.8rem)] leading-[.95] tracking-[-0.03em]">Explore more environments.</h2></div><Link href={`/sectors/${next.slug}`} className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.18em] sm:inline-flex">Next: {next.title} <ArrowRight size={14} /></Link></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{others.map((item) => <Link key={item.slug} href={`/sectors/${item.slug}`} className="group relative min-h-[300px] overflow-hidden bg-[#1A3B63]"><img src={item.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#0A1C33]/90 via-[#0A1C33]/25 to-transparent" /><div className="absolute inset-x-5 bottom-5 text-white"><div className="text-[9px] uppercase tracking-[0.18em] text-[#C5A059]">{item.label}</div><h3 className="mt-2 font-serif text-2xl">{item.title}</h3><span className="mt-3 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-white/70">Explore <ArrowRight size={12} className="transition group-hover:translate-x-1" /></span></div></Link>)}</div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0F2440] px-5 py-20 text-white lg:px-16 lg:py-24"><div className="absolute right-[-8%] top-[-80%] h-[160%] w-[55%] rounded-full bg-[#a28457]/15 blur-3xl" /><div className="relative mx-auto flex max-w-[1440px] flex-col justify-between gap-10 lg:flex-row lg:items-end"><div><div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#C5A059]">Make the first move</div><Html as="h2" html={sector.ctaHeadingHtml} className="max-w-[760px] font-serif text-[clamp(2.6rem,5vw,5.2rem)] leading-[.9] tracking-[-0.04em] [&_em]:font-light [&_em]:text-[#C5A059]" /><p className="mt-6 max-w-[520px] text-sm leading-7 text-white/60">{sector.ctaBody}</p></div><div className="flex flex-wrap gap-3"><Link href="/contact" className="inline-flex items-center gap-3 bg-[#C5A059] px-5 py-3.5 text-[10px] uppercase tracking-[0.18em] text-[#132F4F] transition hover:bg-[#f4e9cc]">Request a quotation <ArrowRight size={14} /></Link><Link href="/guides/build-your-centre" className="inline-flex items-center gap-3 border border-white/30 px-5 py-3.5 text-[10px] uppercase tracking-[0.18em] transition hover:border-white">Build your centre</Link></div></div></section>
    </main>
    <SiteFooter />
  </div>;
}
