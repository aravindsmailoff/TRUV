import Link from "next/link";
import { Navbar } from "@/components/sites/spade/Navbar";
import { Footer } from "@/components/sites/spade/Footer";

type Props = { label: string; title: string; description: string; role: string; steps: { title: string; description: string }[] };
export function SolutionPage({ label, title, description, role, steps }: Props) {
  return <div className="min-h-screen bg-white text-[#18280e]"><Navbar /><main>
    <section className="px-5 py-20 md:py-28"><div className="mx-auto max-w-6xl rounded-3xl bg-[#f0fae6] px-6 py-16 text-center md:px-12 md:py-24"><p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#4d742e]">{label}</p><h1 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">{title}</h1><p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-stone-600">{description}</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href={`/signin?role=${role}`} className="rounded-xl bg-[#18280e] px-6 py-3 text-sm font-semibold text-white">Sign in</Link><Link href={`/signup?role=${role}`} className="rounded-xl border border-stone-300 bg-white px-6 py-3 text-sm font-semibold">Request access</Link></div></div></section>
    <section className="mx-auto max-w-6xl px-5 pb-24"><div className="mb-8"><p className="font-mono text-xs uppercase tracking-widest text-[#4d742e]">How it works</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">A clearer path to trade</h2></div><div className="grid gap-4 md:grid-cols-3">{steps.map((step, i) => <div key={step.title} className="rounded-2xl border border-stone-200 bg-[#fbfdf9] p-7"><span className="font-mono text-xs text-[#6d8c4f]">0{i + 1}</span><h3 className="mt-5 text-xl font-semibold">{step.title}</h3><p className="mt-3 text-sm leading-relaxed text-stone-600">{step.description}</p></div>)}</div><p className="mt-6 text-xs text-stone-500">TRUVX is a prototype. Trade records and supplier information are sample data.</p></section>
  </main><Footer /></div>;
}
