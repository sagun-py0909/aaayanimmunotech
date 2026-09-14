import { ArrowRight, Check, Plus } from "lucide-react";
import { Link, useRoute } from "wouter";
import { Html, PageShell, ProductCard, SiteFooter, SiteHeader, pad, proseLinks, proseLinksDark } from "@/components/SiteChrome";
import { catalogue, categoryImage, equipmentPages, guideGroups, guideImages, guideLabels, guides, type Product } from "@/data/site";
import type { Action, Block, ContentPage, Faq } from "@shared/content-types";
import NotFound from "./NotFound";

const emphasis = "[&_em]:font-light [&_em]:text-[#C5A059]";

function ActionLinks({ actions, dark = false }: { actions: Action[]; dark?: boolean }) {
  return <div className="mt-9 flex flex-wrap gap-3">{actions.map((action, index) => <Link key={`${action.href}-${action.label}`} href={action.href} className={`inline-flex items-center gap-3 px-5 py-3.5 text-[10px] uppercase tracking-[0.18em] transition ${index === 0 ? (dark ? "bg-[#C5A059] text-[#1c1b18] hover:bg-[#f4e9cc]" : "bg-[#133E2F] text-white hover:bg-[#C5A059]") : (dark ? "border border-white/30 text-white hover:border-white" : "border border-[#133E2F]/30 hover:border-[#133E2F]")}`}>{action.label}{index === 0 && <ArrowRight size={14} />}</Link>)}</div>;
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return <>{blocks.map((block, index) => {
    if (block.type === "p") return <Html key={index} as="p" html={block.html} className={`max-w-[720px] text-[15px] leading-8 text-[#4f4b43] ${proseLinks}`} />;
    if (block.type === "list") return <ul key={index} className="border-t border-[#1d1d1b]/15">{block.items.map((item) => <li key={item} className="flex gap-4 border-b border-[#1d1d1b]/15 py-4"><Check size={16} className="mt-1.5 shrink-0 text-[#C5A059]" /><Html as="span" html={item} className={`text-[15px] leading-7 text-[#4f4b43] ${proseLinks}`} /></li>)}</ul>;
    if (block.type === "table") return <div key={index} className="overflow-x-auto border border-[#1d1d1b]/15 bg-[#f8f6f1]">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        {block.caption && <caption className="border-b border-[#1d1d1b]/15 px-5 py-3 text-left text-[10px] uppercase tracking-[0.18em] text-[#8a7657]">{block.caption}</caption>}
        {block.head.length > 0 && <thead><tr>{block.head.map((cell) => <th key={cell} scope="col" className="border-b border-[#1d1d1b]/15 px-5 py-3 text-[10px] font-medium uppercase tracking-[0.14em] text-[#6f6a61]"><Html as="span" html={cell} /></th>)}</tr></thead>}
        <tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex} className="border-b border-[#1d1d1b]/10 last:border-0">{row.map((cell, cellIndex) => <td key={cellIndex} className={`px-5 py-3.5 align-top leading-6 ${cellIndex === 0 ? "font-medium text-[#133E2F]" : "text-[#5f5b53]"}`}><Html as="span" html={cell} className={proseLinks} /></td>)}</tr>)}</tbody>
      </table>
    </div>;
    return <div key={index} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{block.cards.map((card) => <div key={card.title} className="flex flex-col bg-[#e9e4da] p-6"><div className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059]">{card.num}</div><h3 className="mt-6 font-serif text-2xl leading-tight">{card.title}</h3><Html as="p" html={card.body} className={`mt-3 flex-1 text-sm leading-6 text-[#5f5b53] ${proseLinks}`} />{card.link && <Link href={card.link.href} className="mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] transition hover:text-[#C5A059]">{card.link.label}<ArrowRight size={13} /></Link>}</div>)}</div>;
  })}</>;
}

export function Faqs({ faqs }: { faqs: Faq[] }) {
  if (!faqs.length) return null;
  return <section className="px-5 py-20 lg:px-16 lg:py-24">
    <div className="mx-auto grid max-w-[1440px] gap-10 border-t border-[#1d1d1b]/15 pt-10 lg:grid-cols-[.75fr_1.25fr]">
      <div className="lg:sticky lg:top-28 lg:self-start"><div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#8a7657]">Questions buyers ask</div><h2 className="font-serif text-[clamp(2.2rem,3.6vw,3.8rem)] leading-[.95] tracking-[-0.03em]">Frequently asked <em className="font-light text-[#C5A059]">questions.</em></h2></div>
      <div className="border-t border-[#1d1d1b]/15">{faqs.map((faq) => <details key={faq.question} className="group border-b border-[#1d1d1b]/15 py-5">
        <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-serif text-2xl leading-tight [&::-webkit-details-marker]:hidden">{faq.question}<Plus size={18} className="mt-1.5 shrink-0 text-[#C5A059] transition group-open:rotate-45" /></summary>
        <p className="mt-4 max-w-[680px] text-sm leading-7 text-[#5f5b53]">{faq.answer}</p>
      </details>)}</div>
    </div>
  </section>;
}

function ContentLayout({ page, section, sectionHref, image, products }: { page: ContentPage; section: string; sectionHref: string; image: string; products: Product[] }) {
  const related = page.kind === "guide" ? guides.filter((item) => item.slug !== page.slug).slice(0, 4) : equipmentPages.filter((item) => item.slug !== page.slug);
  return <div className="min-h-screen bg-[#f4f1ea] text-[#191918]">
    <SiteHeader />
    <main>
      <section className="px-5 pb-16 pt-28 lg:px-16 lg:pb-20">
        <div className="mx-auto max-w-[1440px]">
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#8a7657]"><Link href="/">Home</Link><span>/</span><Link href={sectionHref}>{section}</Link><span>/</span><span>{page.breadcrumb}</span></nav>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <div className="mb-5 text-[10px] uppercase tracking-[0.28em] text-[#8a7657]">{page.eyebrow}</div>
              <Html as="h1" html={page.headingHtml} className={`font-serif text-[clamp(2.8rem,5.2vw,5.6rem)] leading-[.92] tracking-[-0.04em] ${emphasis}`} />
              <div className="mt-8 max-w-[580px] space-y-4">{page.ledes.map((lede) => <Html key={lede} as="p" html={lede} className={`text-[15px] leading-7 text-[#5f5b53] ${proseLinks}`} />)}</div>
              <ActionLinks actions={page.actions} />
            </div>
            <div className="relative aspect-[1.1] overflow-hidden bg-[#2b2a26]"><img src={image} alt="" className="h-full w-full object-cover" /></div>
          </div>
        </div>
      </section>

      {products.length > 0 && <section className="bg-[#e9e4da] px-5 py-20 lg:px-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 flex flex-col justify-between gap-6 border-b border-[#1d1d1b]/15 pb-8 lg:flex-row lg:items-end"><div><div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#8a7657]">Models in this category</div><h2 className="font-serif text-[clamp(2.2rem,3.6vw,3.8rem)] leading-[.95] tracking-[-0.03em]">{products.length} system{products.length > 1 ? "s" : ""}, <em className="font-light text-[#C5A059]">ready to specify.</em></h2></div><Link href="/products" className="inline-flex w-fit items-center gap-2 border-b border-[#133E2F] pb-2 text-[10px] uppercase tracking-[0.18em]">Full product range <ArrowRight size={14} /></Link></div>
          <div className="grid gap-x-6 gap-y-14 md:grid-cols-2 xl:grid-cols-3">{products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>
        </div>
      </section>}

      {page.sections.map((item, index) => <section key={item.headingHtml} className="px-5 py-16 lg:px-16 lg:py-20">
        <div className="mx-auto grid max-w-[1440px] gap-10 border-t border-[#1d1d1b]/15 pt-10 lg:grid-cols-[.75fr_1.25fr]">
          <div className="lg:sticky lg:top-28 lg:self-start"><div className="mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-[#8a7657]"><span>{pad(index)}</span><span className="h-px w-8 bg-[#8a7657]/50" />{item.tag}</div><Html as="h2" html={item.headingHtml} className={`font-serif text-[clamp(2.2rem,3.6vw,3.8rem)] leading-[.95] tracking-[-0.03em] ${emphasis}`} /></div>
          <div className="space-y-7"><Blocks blocks={item.blocks} /></div>
        </div>
      </section>)}

      <Faqs faqs={page.faqs} />

      {page.cta && <section className="relative overflow-hidden bg-[#171716] px-5 py-20 text-white lg:px-16 lg:py-24">
        <div className="absolute right-[-8%] top-[-80%] h-[160%] w-[55%] rounded-full bg-[#a28457]/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[1fr_.8fr] lg:items-end">
          <Html as="h2" html={page.cta.headingHtml} className="font-serif text-[clamp(2.6rem,5vw,5rem)] leading-[.92] tracking-[-0.04em] [&_em]:font-light [&_em]:text-[#C5A059]" />
          <div><Html as="p" html={page.cta.body} className={`max-w-[520px] text-sm leading-7 text-white/60 ${proseLinksDark}`} /><ActionLinks actions={page.cta.actions} dark /></div>
        </div>
      </section>}

      <section className="px-5 py-20 lg:px-16">
        <div className="mx-auto max-w-[1440px]">
          <h2 className="mb-8 font-serif text-3xl">{page.kind === "guide" ? "More buying guides" : "Other equipment categories"}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <Link key={item.slug} href={`/${item.kind === "guide" ? "guides" : "equipment"}/${item.slug}`} className="group flex min-h-[180px] flex-col justify-between bg-[#e9e4da] p-6 transition hover:bg-[#e2dccf]"><div className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059]">{item.eyebrow}</div><div className="mt-6 font-serif text-2xl leading-tight">{guideLabels[item.slug] ?? item.breadcrumb}</div><ArrowRight size={16} className="mt-5 transition group-hover:translate-x-1" /></Link>)}</div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>;
}

export function EquipmentPage() {
  const [, params] = useRoute<{ slug: string }>("/equipment/:slug");
  const page = equipmentPages.find((item) => item.slug === params?.slug);
  if (!page) return <NotFound />;
  return <ContentLayout page={page} section="Equipment" sectionHref="/products" image={categoryImage(page.slug)} products={catalogue.filter((product) => product.categorySlug === page.slug)} />;
}

export function GuidePage() {
  const [, params] = useRoute<{ slug: string }>("/guides/:slug");
  const page = guides.find((item) => item.slug === params?.slug);
  if (!page) return <NotFound />;
  return <ContentLayout page={page} section="Guides" sectionHref="/guides" image={guideImages[page.slug] ?? categoryImage("hyperbaric-oxygen-chambers")} products={[]} />;
}

export function Guides() {
  return <PageShell eyebrow="Buying guides / Build a facility" title={<>Buy with<br /><em>clarity.</em></>} intro="Cost guides for HBOT, cryotherapy and red light therapy equipment, chamber installation requirements, and how to set up a wellness or recovery centre in India." breadcrumb="Guides">
    {guideGroups.map((group, groupIndex) => <section key={group.title} className={groupIndex ? "mt-20" : ""}>
      <div className="mb-10 flex items-end justify-between border-b border-[#1d1d1b]/15 pb-5"><h2 className="font-serif text-4xl">{group.title}</h2><span className="text-[10px] uppercase tracking-[0.2em] text-[#8a7657]">{pad(groupIndex)}</span></div>
      <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3">{group.slugs.map((slug) => {
        const guide = guides.find((item) => item.slug === slug);
        if (!guide) return null;
        return <Link key={slug} href={`/guides/${slug}`} className="group block"><div className="aspect-[1.3] overflow-hidden bg-[#2b2a26]"><img src={guideImages[slug]} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div><div className="pt-5"><div className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059]">{guide.eyebrow}</div><h3 className="mt-3 font-serif text-3xl leading-[.98]">{guideLabels[slug]}</h3><p className="mt-3 text-sm leading-6 text-[#6f6a61]">{guide.metaDescription}</p><span className="mt-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em]">Read guide <ArrowRight size={14} /></span></div></Link>;
      })}</div>
    </section>)}
  </PageShell>;
}
