import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";
import { Link } from "wouter";
import { ProductCard, SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { catalogue, contact, sectors } from "@/data/site";

const steps = [
  { title: "Tell us about your space", body: "Room size, power supply and how many sessions a day you expect. We check the site before you order." },
  { title: "Get a clear quotation", body: "One written quote covering the equipment, delivery and installation — no hidden line items." },
  { title: "We install and train", body: "Our engineers install and test the equipment, train your staff and stay on for service." },
];

// Kept deliberately short: the client asked for a simple, well-informed page — what we sell, how buying works, how to reach us.
export default function Home() {
  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#4E141D]">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden bg-[#4E141D] text-white">
          <img src="/images/photos/hbot-chamber-residence.webp" alt="Hard shell hyperbaric oxygen chamber installed in a private residence" className="absolute inset-0 h-full w-full -scale-x-100 object-cover" />
          <div className="absolute inset-0 bg-[#2E0A10]/65" />
          <div className="relative mx-auto max-w-[1200px] px-5 pb-20 pt-36 lg:px-10 lg:pb-28 lg:pt-44">
            <h1 className="max-w-[760px] font-serif text-[clamp(2.4rem,5vw,4.5rem)] leading-[1.02] tracking-[-0.02em]">Recovery and wellness equipment, supplied and installed across India.</h1>
            <p className="mt-6 max-w-[560px] text-lg leading-8 text-white/85">Hyperbaric oxygen chambers, cryotherapy, red light therapy beds, infrared saunas, float tanks and PEMF — for clinics, hospitals, gyms, hotels, sports teams and homes.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/products" className="inline-flex items-center gap-2 bg-[#C5A059] px-6 py-4 text-sm font-medium text-[#3D0F17] transition hover:bg-[#f4e9cc]">See our products <ArrowRight size={16} /></Link>
              <Link href="/contact" className="inline-flex items-center gap-2 border border-white/50 px-6 py-4 text-sm font-medium transition hover:bg-white/10">Get a quotation</Link>
            </div>
          </div>
        </section>

        <section id="products" className="scroll-mt-20 px-5 py-20 lg:px-10">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="font-serif text-[clamp(2rem,3.5vw,3rem)] leading-tight">Our products</h2>
            <p className="mt-3 max-w-[620px] text-base leading-7 text-[#5f5b53]">Every system is sold on quotation, because the right model depends on your room and how you will use it.</p>
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
              {catalogue.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </section>

        <section className="bg-[#e9e4da] px-5 py-20 lg:px-10">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="font-serif text-[clamp(2rem,3.5vw,3rem)] leading-tight">How it works</h2>
            <ol className="mt-10 grid gap-8 md:grid-cols-3">
              {steps.map((step, index) => <li key={step.title}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4E141D] font-medium text-white">{index + 1}</div>
                <h3 className="mt-5 font-serif text-2xl">{step.title}</h3>
                <p className="mt-2 text-base leading-7 text-[#5f5b53]">{step.body}</p>
              </li>)}
            </ol>
          </div>
        </section>

        <section className="px-5 py-20 lg:px-10">
          <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-[clamp(2rem,3.5vw,3rem)] leading-tight">About AAAyan Immunotech</h2>
              <p className="mt-5 text-base leading-8 text-[#4f4b43]">We are a wellness equipment supplier based in {contact.city}. We help you choose the right equipment, install it properly and keep it running — with a site survey before you buy, installation by our own engineers, staff training and ongoing service.</p>
              <p className="mt-4 text-base leading-8 text-[#4f4b43]">Want to read more first? Our <Link href="/guides" className="underline decoration-[#bca477] underline-offset-4">buying guides</Link> explain costs and installation needs, and the <Link href="/blog" className="underline decoration-[#bca477] underline-offset-4">blog</Link> answers common questions.</p>
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-[0.12em] text-[#8a7657]">Who we work with</h3>
              <ul className="mt-5 divide-y divide-[#4E141D]/15 border-y border-[#4E141D]/15">
                {sectors.map((sector) => <li key={sector.slug}><Link href={`/sectors/${sector.slug}`} className="flex items-center justify-between gap-4 py-4 text-lg transition hover:text-[#8C6D2F]">{sector.title}<ArrowRight size={16} className="shrink-0" /></Link></li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-[#4E141D] px-5 py-20 text-white lg:px-10">
          <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="font-serif text-[clamp(2rem,3.5vw,3rem)] leading-tight">Talk to us</h2>
              <p className="mt-3 max-w-[560px] text-base leading-7 text-white/75">Tell us what you are planning and we will suggest the right equipment and send a quotation.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 bg-[#C5A059] px-6 py-4 text-sm font-medium text-[#3D0F17] transition hover:bg-[#f4e9cc]"><Phone size={16} />{contact.phone}</a>
              <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-white/40 px-6 py-4 text-sm font-medium transition hover:bg-white/10"><MessageCircle size={16} />WhatsApp</a>
              <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2 border border-white/40 px-6 py-4 text-sm font-medium transition hover:bg-white/10"><Mail size={16} />Email</a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
