import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowRight, Building2, FileText, Users, CalendarClock, Check, ChevronDown, CircleDollarSign, Filter, Mail, MapPin, Phone, Plus, Search, SlidersHorizontal, Sparkles, UserRound, X } from "lucide-react";
import { toast } from "sonner";
import { Link, useSearch } from "wouter";
import { catalogue } from "@/data/site";
import { stages, type Lead, type Stage } from "@shared/lead-desk";
import BlogDesk from "./BlogDesk";

const stageTints: Record<Stage, string> = {
  "New enquiry": "bg-[#efe6dc] text-[#7d6b4e]",
  Qualified: "bg-[#e8e2d4] text-[#7a6134]",
  Proposal: "bg-[#f0e2e2] text-[#8d4550]",
  Negotiation: "bg-[#f3e6d6] text-[#946f41]",
  Won: "bg-[#e4e9e0] text-[#4d7547]",
};

const formatValue = (value: number) => `Rs ${(value / 100000).toFixed(value >= 10000000 ? 0 : 1)}L`;

// The desk has two workspaces, chosen by ?tab= so a reload or a shared link lands in the same place:
// the lead funnel (default) and the blog (?tab=blog, with &post=<id|new> for the editor).
export default function CRM() {
  const params = new URLSearchParams(useSearch());
  const tab = params.get("tab") === "blog" ? "blog" : "leads";
  const openPost = params.get("post");

  const go = (next: { tab?: "leads" | "blog"; post?: string | null }) => {
    const query = new URLSearchParams();
    if ((next.tab ?? tab) === "blog") query.set("tab", "blog");
    if (next.post) query.set("post", next.post);
    const search = query.toString();
    window.history.pushState(null, "", `/crm${search ? `?${search}` : ""}`);
    window.scrollTo(0, 0);
  };

  const signOut = () => {
    void fetch("/api/auth/logout", { method: "POST" }).finally(() => window.location.replace("/login"));
  };

  return <div className="min-h-screen bg-[#f4f1ea] text-[#4E141D]">
    <header className="border-b border-[#4E141D]/10 bg-[#4E141D] text-[#f7f3ea]">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-4 lg:px-10">
        <div className="flex items-center gap-6 lg:gap-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C5A059]/60 text-[10px] tracking-[0.2em] text-[#C5A059]">AA</span>
            <span className="hidden sm:block"><span className="block font-serif text-[17px] tracking-[0.14em]">AAAYAN</span><span className="block text-[8px] uppercase tracking-[0.3em] text-white/45">Lead desk</span></span>
          </Link>
          <nav className="flex items-center gap-1" aria-label="Desk sections">
            {([["leads", "Leads", Users], ["blog", "Blog", FileText]] as const).map(([key, label, Icon]) => <button key={key} onClick={() => go({ tab: key, post: null })} aria-current={tab === key ? "page" : undefined} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.17em] transition ${tab === key ? "bg-[#f4f1ea] text-[#4E141D]" : "text-white/60 hover:text-white"}`}><Icon size={13} />{label}</button>)}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.17em] text-white/55">
          {tab === "blog" && <a href="/blog" target="_blank" rel="noopener" className="hidden hover:text-white md:inline">View /blog</a>}
          <button onClick={signOut} className="border-l border-white/15 pl-4 text-[#C5A059] hover:text-white">Sign out</button>
        </div>
      </div>
    </header>
    {tab === "blog"
      ? <main className="mx-auto max-w-[1600px] px-5 py-8 lg:px-10 lg:py-12"><BlogDesk openId={openPost} onOpen={(post) => go({ tab: "blog", post })} /></main>
      : <LeadFunnel />}
  </div>;
}

function LeadFunnel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("All owners");
  const [showNewLead, setShowNewLead] = useState(false);

  useEffect(() => {
    fetch("/api/leads")
      .then((response) => { if (response.status === 401) { window.location.replace("/login"); return null; } return response.ok ? response.json() : Promise.reject(new Error("failed")); })
      .then((data: { leads: Lead[] } | null) => { if (data) { setLeads(data.leads); setActiveId(data.leads[0]?.id ?? null); } })
      .catch(() => toast.error("The lead desk could not be loaded"))
      .finally(() => setLoading(false));
  }, []);

  const owners = useMemo(() => ["All owners", ...Array.from(new Set(leads.map((lead) => lead.owner)))], [leads]);
  const filteredLeads = useMemo(
    () => leads.filter((lead) => `${lead.name} ${lead.company} ${lead.city} ${lead.interest}`.toLowerCase().includes(query.toLowerCase()) && (ownerFilter === "All owners" || lead.owner === ownerFilter)),
    [leads, query, ownerFilter],
  );
  const activeLead = leads.find((lead) => lead.id === activeId) || filteredLeads[0] || leads[0];
  const pipelineValue = leads.filter((lead) => lead.stage !== "Won").reduce((total, lead) => total + lead.value, 0);
  const wonValue = leads.filter((lead) => lead.stage === "Won").reduce((total, lead) => total + lead.value, 0);
  const wonCount = leads.filter((lead) => lead.stage === "Won").length;

  const moveLead = (id: number, stage: Stage) => {
    const previous = leads;
    setLeads((current) => current.map((lead) => (lead.id === id ? { ...lead, stage } : lead)));
    fetch(`/api/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stage }) })
      .then((response) => { if (!response.ok) throw new Error("failed"); toast(`Moved to ${stage}.`); })
      .catch(() => { setLeads(previous); toast.error("That change was not saved"); });
  };

  const addLead = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name")),
      company: String(form.get("company")),
      city: String(form.get("city")),
      email: String(form.get("email")),
      phone: String(form.get("phone") || ""),
      interest: String(form.get("interest")),
      value: Number(form.get("value")) || 0,
      stage: "New enquiry" as Stage,
      source: String(form.get("source") || "Manual entry"),
      owner: String(form.get("owner") || "Unassigned"),
      nextAction: "Make first contact",
      lastContact: "Just now",
      note: String(form.get("note") || ""),
    };
    fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("failed"))))
      .then((created: Lead) => { setLeads((current) => [created, ...current]); setActiveId(created.id); setShowNewLead(false); toast.success("Lead added to the funnel"); })
      .catch(() => toast.error("That lead could not be saved"));
  };

  return <>
    <main className="mx-auto max-w-[1600px] px-5 py-8 lg:px-10 lg:py-12">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <div className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#C5A059]">Commercial / CRM</div>
          <h1 className="font-serif text-[clamp(3rem,5vw,5.8rem)] leading-[.88] tracking-[-0.04em]">The lead <em className="font-light">funnel.</em></h1>
          <p className="mt-5 max-w-[560px] text-sm leading-6 text-[#706b61]">Every project from first enquiry to confident handover.</p>
        </div>
        <button onClick={() => setShowNewLead(true)} className="inline-flex items-center justify-center gap-2 self-start bg-[#4E141D] px-5 py-3.5 text-[10px] uppercase tracking-[0.17em] text-white transition hover:bg-[#C5A059] hover:text-[#3D0F17] lg:self-end"><Plus size={15} /> Add lead</button>
      </div>

      <section className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Open pipeline" value={formatValue(pipelineValue)} detail="Across active opportunities" icon={CircleDollarSign} />
        <Metric label="Won" value={formatValue(wonValue)} detail={`${wonCount} closed ${wonCount === 1 ? "opportunity" : "opportunities"}`} icon={Check} />
        <Metric label="Active leads" value={String(leads.filter((lead) => lead.stage !== "Won").length)} detail="Not yet closed" icon={UserRound} />
        <Metric label="In proposal or later" value={String(leads.filter((lead) => lead.stage === "Proposal" || lead.stage === "Negotiation").length)} detail="Quotations on the table" icon={Sparkles} />
      </section>

      <div className="mt-10 flex flex-col gap-3 border-y border-[#4E141D]/12 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 border-b border-[#4E141D]/20 pb-2 text-sm sm:w-[340px]">
          <Search size={15} className="text-[#C5A059]" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search people, companies, cities..." aria-label="Search leads" className="w-full bg-transparent outline-none placeholder:text-[#aaa399]" />
        </div>
        <div className="flex items-center gap-3">
          <Filter size={14} className="text-[#C5A059]" />
          <select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)} aria-label="Filter by owner" className="bg-transparent text-[10px] uppercase tracking-[0.13em] outline-none">{owners.map((owner) => <option key={owner}>{owner}</option>)}</select>
          <span className="hidden text-[10px] uppercase tracking-[0.13em] text-[#8b857a] sm:inline">{filteredLeads.length} leads visible</span>
        </div>
      </div>

      {loading ? <div className="py-24 text-center text-sm text-[#8b857a]">Loading the funnel…</div> : <>
        <section className="mt-7 overflow-x-auto pb-4">
          <div className="grid min-w-[1150px] grid-cols-5 gap-3">
            {stages.map((stage) => {
              const stageLeads = filteredLeads.filter((lead) => lead.stage === stage);
              return <div key={stage} className="min-h-[430px] bg-white/45 p-3">
                <div className="mb-4 flex items-center justify-between border-b border-[#4E141D]/10 pb-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.16em] text-[#8d4550]">{stage}</div>
                    <div className="mt-1 text-[10px] text-[#979187]">{stageLeads.length} {stageLeads.length === 1 ? "lead" : "leads"}</div>
                  </div>
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] ${stageTints[stage]}`}>{stageLeads.length}</span>
                </div>
                <div className="space-y-3">{stageLeads.map((lead) => <button key={lead.id} onClick={() => setActiveId(lead.id)} className={`w-full border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${activeId === lead.id ? "border-[#C5A059] bg-[#fffdf8] shadow-sm" : "border-[#4E141D]/10 bg-[#fffdf8]/70"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0"><div className="truncate text-sm font-medium">{lead.name}</div><div className="mt-1 truncate text-xs text-[#777167]">{lead.company}</div></div>
                    <span className="shrink-0 text-[9px] uppercase tracking-[0.12em] text-[#C5A059]">{lead.owner}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-[10px] text-[#777167]"><MapPin size={12} />{lead.city}<span className="text-[#c2b9aa]">/</span><span>{formatValue(lead.value)}</span></div>
                  <div className="mt-3 border-t border-[#4E141D]/10 pt-3 text-[10px] leading-4 text-[#8a847b]">{lead.interest}</div>
                </button>)}</div>
              </div>;
            })}
          </div>
        </section>

        <section className="mt-7 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="border-t border-[#4E141D]/15 pt-5">
            <div className="flex items-center justify-between">
              <div><div className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059]">Today / activity queue</div><h2 className="mt-2 font-serif text-3xl">Keep the momentum.</h2></div>
              <SlidersHorizontal size={17} className="text-[#C5A059]" />
            </div>
            <div className="mt-6 divide-y divide-[#4E141D]/10">{leads.filter((lead) => lead.stage !== "Won").slice(0, 5).map((lead) => <div key={lead.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eadfd3] text-[10px] font-medium text-[#75654a]">{lead.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div>
                <div><div className="text-sm">{lead.nextAction}</div><div className="mt-1 text-xs text-[#888178]">{lead.name} · {lead.company}</div></div>
              </div>
              <button onClick={() => setActiveId(lead.id)} className="inline-flex items-center gap-2 self-start text-[10px] uppercase tracking-[0.15em] text-[#71624b] sm:self-auto">View lead <ArrowRight size={14} /></button>
            </div>)}</div>
          </div>

          {activeLead && <aside className="border border-[#4E141D]/12 bg-[#4E141D] p-6 text-[#f6f1e8] shadow-xl shadow-[#2E0A10]/10">
            <div className="flex items-start justify-between gap-4">
              <div><div className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059]">Lead details</div><h2 className="mt-3 font-serif text-3xl leading-none">{activeLead.name}</h2><p className="mt-2 text-xs text-white/50">{activeLead.company}</p></div>
              <span className="rounded-full border border-white/15 px-2.5 py-1 text-[9px] uppercase tracking-[0.13em] text-[#C5A059]">{activeLead.stage}</span>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-4 border-y border-white/10 py-5">
              <DetailIcon icon={Building2} label="Interest" value={activeLead.interest} />
              <DetailIcon icon={CircleDollarSign} label="Opportunity" value={formatValue(activeLead.value)} />
              <DetailIcon icon={MapPin} label="Location" value={activeLead.city} />
              <DetailIcon icon={CalendarClock} label="Next action" value={activeLead.nextAction} />
            </div>
            {activeLead.note && <div className="mt-5 text-sm leading-6 text-white/65">{activeLead.note}</div>}
            <div className="mt-6 space-y-2">
              <a href={`mailto:${activeLead.email}`} className="flex items-center gap-3 text-xs text-white/75 hover:text-[#C5A059]"><Mail size={14} className="text-[#C5A059]" />{activeLead.email}</a>
              {activeLead.phone && <a href={`tel:${activeLead.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-xs text-white/75 hover:text-[#C5A059]"><Phone size={14} className="text-[#C5A059]" />{activeLead.phone}</a>}
            </div>
            <label htmlFor="move-lead" className="mt-7 block text-[9px] uppercase tracking-[0.17em] text-white/45">Move lead</label>
            <div className="relative mt-2">
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#C5A059]" />
              <select id="move-lead" value={activeLead.stage} onChange={(event) => moveLead(activeLead.id, event.target.value as Stage)} className="w-full appearance-none border border-white/15 bg-white/5 px-3 py-3 text-xs text-white outline-none">{stages.map((stage) => <option key={stage} className="text-black">{stage}</option>)}</select>
            </div>
          </aside>}
        </section>
      </>}
    </main>

    {showNewLead && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2E0A10]/60 p-5 backdrop-blur-sm">
      <form onSubmit={addLead} className="max-h-[90vh] w-full max-w-[560px] overflow-y-auto bg-[#f4f1ea] p-6 shadow-2xl sm:p-9">
        <div className="flex items-start justify-between border-b border-[#4E141D]/15 pb-5">
          <div><div className="text-[10px] uppercase tracking-[0.22em] text-[#C5A059]">New opportunity</div><h2 className="mt-2 font-serif text-4xl">Add a lead.</h2></div>
          <button type="button" onClick={() => setShowNewLead(false)} aria-label="Close"><X size={19} /></button>
        </div>
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <FormField name="name" label="Contact name" placeholder="Full name" required />
          <FormField name="company" label="Company" placeholder="Organisation" required />
          <FormField name="city" label="City" placeholder="Project location" required />
          <FormField name="email" label="Email" placeholder="you@company.com" type="email" required />
          <FormField name="phone" label="Phone" placeholder="+91" />
          <FormField name="value" label="Estimated value (Rs)" placeholder="2500000" type="number" />
          <label className="text-[9px] uppercase tracking-[0.16em] text-[#6f6a61]">Primary interest
            <select name="interest" required className="mt-2 w-full border-b border-[#4E141D]/20 bg-transparent py-3 text-sm normal-case tracking-normal outline-none focus:border-[#C5A059]">{catalogue.map((product) => <option key={product.id}>{product.name}</option>)}<option>Full recovery circuit</option></select>
          </label>
          <FormField name="owner" label="Owner" placeholder="Who is handling this?" />
        </div>
        <label className="mt-5 block text-[9px] uppercase tracking-[0.16em] text-[#6f6a61]">Note
          <textarea name="note" placeholder="Room, timeline, what they asked for..." className="mt-2 min-h-24 w-full border border-[#4E141D]/15 bg-transparent p-3 text-sm normal-case tracking-normal outline-none focus:border-[#C5A059]" />
        </label>
        <button type="submit" className="mt-7 flex w-full items-center justify-center gap-2 bg-[#4E141D] px-5 py-4 text-[10px] uppercase tracking-[0.18em] text-white hover:bg-[#C5A059] hover:text-[#3D0F17]">Add to funnel <ArrowRight size={14} /></button>
      </form>
    </div>}
  </>;
}

function Metric({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: typeof CircleDollarSign }) {
  return <div className="border-t border-[#4E141D]/15 bg-white/35 px-4 py-5">
    <div className="flex items-center justify-between text-[#C5A059]"><span className="text-[10px] uppercase tracking-[0.18em] text-[#777167]">{label}</span><Icon size={16} /></div>
    <div className="mt-5 font-serif text-3xl">{value}</div>
    <div className="mt-1 text-[11px] text-[#8d877d]">{detail}</div>
  </div>;
}

function DetailIcon({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) {
  return <div className="flex gap-2">
    <Icon size={14} className="mt-0.5 shrink-0 text-[#C5A059]" />
    <div><div className="text-[9px] uppercase tracking-[0.14em] text-white/40">{label}</div><div className="mt-1 text-xs leading-4 text-white/80">{value}</div></div>
  </div>;
}

function FormField({ name, label, placeholder, type = "text", required = false }: { name: string; label: string; placeholder: string; type?: string; required?: boolean }) {
  return <label className="text-[9px] uppercase tracking-[0.16em] text-[#6f6a61]">{label}
    <input name={name} required={required} type={type} placeholder={placeholder} className="mt-2 w-full border-b border-[#4E141D]/20 bg-transparent py-3 text-sm normal-case tracking-normal outline-none placeholder:text-[#aaa399] focus:border-[#C5A059]" />
  </label>;
}
