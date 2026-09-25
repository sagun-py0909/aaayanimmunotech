import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { PageShell, ProductCard } from "@/components/SiteChrome";
import { catalogue } from "@/data/site";

// Eight systems fit on one screen, so the page is just the range — no filters, sorting or search to learn.
export default function Products() {
  return <PageShell eyebrow="Products" title="Our products" intro="Infrared saunas, hyperbaric oxygen chambers, float beds and tanks, PEMF, red light therapy beds and cryotherapy — supplied, installed and serviced across India. Every system is sold on quotation." breadcrumb="Products">
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">{catalogue.map((product) => <ProductCard key={product.id} product={product} />)}</div>
    <div className="mt-16 flex flex-col items-start justify-between gap-5 rounded-2xl bg-[#e9e4da] p-8 sm:flex-row sm:items-center">
      <div><h2 className="font-serif text-3xl">Not sure which one you need?</h2><p className="mt-2 text-base leading-7 text-[#5f5b53]">Tell us about your space and who will use it — we will recommend the right system.</p></div>
      <Link href="/contact" className="inline-flex shrink-0 items-center gap-2 bg-[#4E141D] px-6 py-4 text-sm font-medium text-white transition hover:bg-[#C5A059] hover:text-[#3D0F17]">Get a quotation <ArrowRight size={16} /></Link>
    </div>
  </PageShell>;
}
