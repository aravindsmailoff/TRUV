"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
type User = { name: string; company: string; role: "buyer" | "manufacturer" | "service" };
type RFQ = { id: string; title: string; description: string; kind: string; status: string; created_at: string; buyer_name?: string };
export default function LocalWorkspace() {
  const [user, setUser] = useState<User | null>(null);
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [title, setTitle] = useState(""); const [description, setDescription] = useState("");
  const [kind, setKind] = useState("goods"); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function refresh() {
    const res = await fetch("/api/local-workspace", { cache: "no-store" });
    const data = await res.json();
    if (res.ok) { setUser(data.user); setRfqs(data.rfqs); setError(""); }
    else if (res.status !== 401) setError(data.error);
  }
  useEffect(() => { void refresh().catch(() => setError("Cannot connect to local workspace.")); }, []);
  async function send(payload: object) {
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/local-workspace", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return false; }
      await refresh(); return true;
    } catch { setError("Cannot connect to local workspace."); return false; } finally { setBusy(false); }
  }
  return <main className="min-h-screen bg-[#f4faed] p-5 text-[#18280e] md:p-10"><div className="mx-auto max-w-4xl space-y-6"><header className="flex items-center justify-between"><Link href="/" className="font-bold text-xl">TRUVX</Link>{user && <button className="text-sm underline" onClick={async () => { if (await send({action:"logout"})) {setUser(null);setRfqs([]);} }}>Sign out</button>}</header><div><h1 className="text-3xl font-semibold">Local RFQ workspace</h1><p className="mt-2 text-sm text-stone-600">A single-installation workflow. Goods requests are visible to local manufacturers; service requests are visible to local service providers.</p></div>{error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}
  {!user ? <form className="space-y-4 rounded-3xl border border-stone-200 bg-white p-7" onSubmit={async e => {e.preventDefault(); if (await send({action:"login",email,password})) setPassword("");}}><h2 className="text-xl font-semibold">Local sign in</h2><p className="text-sm text-stone-600">Create an account using the local setup script first. This sign-in is separate from the existing portal.</p><label className="block text-sm">Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full rounded-xl border p-3"/></label><label className="block text-sm">Password<input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full rounded-xl border p-3"/></label><button disabled={busy} className="rounded-xl bg-[#18280e] px-5 py-3 text-sm text-white disabled:opacity-50">Sign in</button></form> : <><p className="text-sm">Signed in as <strong>{user.name}</strong> · {user.company} · {user.role}</p>{user.role === "buyer" && <form className="space-y-4 rounded-3xl border border-stone-200 bg-white p-7" onSubmit={async e=>{e.preventDefault();if(await send({action:"create_rfq",title,description,kind})){setTitle("");setDescription("");}}}><h2 className="text-xl font-semibold">Create a request</h2><label className="block text-sm">Request type<select value={kind} onChange={e=>setKind(e.target.value)} className="mt-1 w-full rounded-xl border p-3"><option value="goods">Goods — manufacturers</option><option value="service">Service — freelancers &amp; agencies</option></select></label><label className="block text-sm">Title<input required maxLength={200} value={title} onChange={e=>setTitle(e.target.value)} className="mt-1 w-full rounded-xl border p-3"/></label><label className="block text-sm">Requirements<textarea required maxLength={5000} value={description} onChange={e=>setDescription(e.target.value)} className="mt-1 w-full rounded-xl border p-3" rows={4}/></label><button disabled={busy} className="rounded-xl bg-[#18280e] px-5 py-3 text-sm text-white disabled:opacity-50">Create request</button></form>}<section className="rounded-3xl border border-stone-200 bg-white p-7"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">{user.role === "buyer" ? "Your requests" : "Incoming requests"}</h2><button onClick={()=>void refresh()} className="text-sm underline">Refresh</button></div><div className="mt-5 space-y-3">{!rfqs.length && <p className="text-sm text-stone-500">No requests yet.</p>}{rfqs.map(r=><article key={r.id} className="rounded-xl border border-stone-200 bg-stone-50 p-4"><div className="flex flex-wrap justify-between gap-2"><strong>{r.title}</strong><span className="text-xs text-stone-500">{r.kind} · {r.status}</span></div>{r.buyer_name && <p className="mt-1 text-xs text-stone-500">From {r.buyer_name}</p>}<p className="mt-3 whitespace-pre-wrap text-sm text-stone-600">{r.description}</p><p className="mt-3 text-xs text-stone-400">{r.created_at} UTC</p></article>)}</div></section></>}
  </div></main>;
}
