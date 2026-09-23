import { FormEvent, useState } from "react";
import { ArrowRight, LockKeyhole, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

export const CRM_SESSION_KEY = "aaayan-crm-session";

export function isCRMAuthenticated() {
  return window.localStorage.getItem(CRM_SESSION_KEY) === "active";
}

export default function Login() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    if (!response.ok) {
      setError("That email or password is not recognised.");
      return;
    }
    window.localStorage.setItem(CRM_SESSION_KEY, "active");
    toast.success("Welcome to the lead desk");
    navigate("/crm");
  };

  return <div className="min-h-screen bg-[#20201e] text-[#f7f3ea]">
    <div className="mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-[1fr_.72fr]">
      <section className="relative hidden overflow-hidden border-r border-white/10 lg:block"><img src="/manus-storage/hyperbaric-room_f8b7624d.webp" alt="AAAYAN recovery environment" className="absolute inset-0 h-full w-full object-cover opacity-55" /><div className="absolute inset-0 bg-gradient-to-t from-[#151514] via-[#151514]/30 to-[#151514]/10" /><div className="relative flex h-full flex-col justify-between p-12"><Link href="/" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#cdbd91]/60 text-[10px] tracking-[0.2em] text-[#d8c99f]">AA</span><span><span className="block font-serif text-[18px] tracking-[0.14em]">AAAYAN</span><span className="block text-[8px] uppercase tracking-[0.32em] text-white/50">Immunotech</span></span></Link><div><div className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#d5c59d]">Private workspace</div><h1 className="max-w-[600px] font-serif text-6xl leading-[.9] tracking-[-0.04em]">Move every<br /><em className="font-light text-[#d5c59d]">conversation</em> forward.</h1><p className="mt-6 max-w-[390px] text-sm leading-6 text-white/65">The AAAYAN lead desk keeps your commercial pipeline close, clear, and ready for the next move.</p></div><div className="text-[9px] uppercase tracking-[0.2em] text-white/45">Internal use only · AAAYAN Immunotech</div></div></section>
      <main className="flex flex-col justify-between px-6 py-7 sm:px-12 lg:px-20 lg:py-12"><div className="flex items-center justify-between lg:justify-end"><Link href="/" className="font-serif text-lg tracking-[0.14em] lg:hidden">AAAYAN</Link><Link href="/" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-white/55 hover:text-white"><X size={14} /> Exit</Link></div><div className="mx-auto w-full max-w-[390px] lg:mx-0"><div className="mb-4 flex h-11 w-11 items-center justify-center border border-[#d5c59d]/35 text-[#d5c59d]"><LockKeyhole size={18} /></div><div className="text-[10px] uppercase tracking-[0.24em] text-[#d5c59d]">Lead desk / Sign in</div><h2 className="mt-4 font-serif text-5xl leading-[.9]">Good to have<br /><em className="font-light">you back.</em></h2><p className="mt-6 text-sm leading-6 text-white/55">Sign in to access the private CRM and lead funnel.</p><form onSubmit={submit} className="mt-9 space-y-6"><label className="block text-[9px] uppercase tracking-[0.17em] text-white/50">Work email<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="you@aaayan.in" required className="mt-2 w-full border-b border-white/20 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#d5c59d]" /></label><label className="block text-[9px] uppercase tracking-[0.17em] text-white/50">Password<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Enter your password" required className="mt-2 w-full border-b border-white/20 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#d5c59d]" /></label>{error && <p className="text-xs text-[#e3a59a]">{error}</p>}<button type="submit" className="flex w-full items-center justify-center gap-3 bg-[#d5c59d] px-5 py-4 text-[10px] uppercase tracking-[0.18em] text-[#20201e] transition hover:bg-[#f1e6c9]">Enter lead desk <ArrowRight size={14} /></button></form><p className="mt-7 text-[10px] leading-5 text-white/35">Client-only access for this workspace. Connect this form to your identity provider before using it for production data.</p></div><div className="text-[9px] uppercase tracking-[0.16em] text-white/35">Need access? Contact your workspace administrator.</div></main>
    </div>
  </div>;
}