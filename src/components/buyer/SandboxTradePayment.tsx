"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { INITIAL_QUOTES, INITIAL_RFQS } from "@/lib/buyer/buyerStore";

type Trade = { id: string; supplier: string; product: string; total: string; advance: string; status: "AGREED" | "AWAITING_APPROVAL" | "COMPLETED"; paypalId?: string; approvalUrl?: string; captureId?: string };
type Session = { id: string; access: string };
const KEY = "truvx_sandbox_trade_session";

export function SandboxTradePayment({ mode, onNavigate }: { mode: "orders" | "payments"; onNavigate: (mode: "orders" | "payments") => void }) {
  const [quoteId, setQuoteId] = useState(INITIAL_QUOTES.find(q => q.status !== "rejected")?.id || "");
  const [session, setSession] = useState<Session | null>(null);
  const [trade, setTrade] = useState<Trade | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const started = useRef(false);

  const request = useCallback(async (payload: object) => {
    const res = await fetch("/api/sandbox-trades", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed.");
    return data;
  }, []);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let saved: Session | null = null;
    try { saved = JSON.parse(sessionStorage.getItem(KEY) || "null"); } catch { sessionStorage.removeItem(KEY); }
    const params = new URLSearchParams(window.location.search);
    const outcome = params.get("paypal"), token = params.get("token");
    if (outcome) { params.delete("paypal"); params.delete("token"); params.delete("PayerID"); window.history.replaceState(null, "", `${window.location.pathname}${params.size ? `?${params}` : ""}`); }
    if (!saved?.id || !saved?.access) { if (outcome) setError("The demo order session was not found. Start a new demo order."); return; }
    setSession(saved);
    setBusy(true);
    const action = outcome === "approved" && token ? "capture" : "status";
    request({ action, ...saved, ...(action === "capture" ? { token } : {}) })
      .then(data => { setTrade(data.trade); if (outcome === "cancelled") setNotice("Approval was cancelled; no capture was confirmed."); })
      .catch(e => setError(e.message))
      .finally(() => setBusy(false));
  }, [request]);

  async function agree() {
    setBusy(true); setError(""); setNotice("");
    try { const data = await request({ action: "agree", quoteId }); const next = { id: data.trade.id, access: data.access }; sessionStorage.setItem(KEY, JSON.stringify(next)); setSession(next); setTrade(data.trade); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not create the demo order."); }
    finally { setBusy(false); }
  }
  async function createPayment() {
    if (!session) return;
    setBusy(true); setError("");
    try { const data = await request({ action: "create", ...session }); setTrade(data.trade); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not create the payment."); }
    finally { setBusy(false); }
  }
  return (
    <section className="rounded-3xl border border-[#d8e5ca] bg-white p-6 space-y-4" aria-label={mode === "orders" ? "Demo orders" : "Sandbox payments"}>
      <div><p className="text-xs uppercase font-mono text-[#4c702a]">Sandbox demo</p><h2 className="text-xl font-semibold text-[#18280e]">{mode === "orders" ? "My orders" : "Payments"}</h2><p className="mt-1 text-sm text-stone-600">{mode === "orders" ? "Choose a supplier and confirm a sample order." : "Pay the advance for your confirmed sample order."}</p></div>
      {mode === "orders" && !trade && <div className="space-y-3"><label className="block text-sm font-medium" htmlFor="demo-quote">Choose a supplier</label><select id="demo-quote" value={quoteId} onChange={e => setQuoteId(e.target.value)} className="w-full rounded-xl border border-stone-300 bg-white p-3 text-sm">{INITIAL_QUOTES.filter(q => q.status !== "rejected").map(q => <option key={q.id} value={q.id}>{q.supplierName} — {INITIAL_RFQS.find(r => r.id === q.rfqId)?.title} — ${q.totalPriceUSD.toLocaleString()}</option>)}</select><button disabled={busy || !quoteId} onClick={agree} className="rounded-xl bg-[#18280e] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Confirm order</button></div>}
      {mode === "payments" && !trade && !busy && <div className="rounded-xl bg-[#f4faed] p-4 text-sm text-stone-600"><p>No order yet. Confirm an order first.</p><button onClick={() => onNavigate("orders")} className="mt-3 font-semibold text-[#3f7308] underline">Go to My Orders</button></div>}
      {trade && <div className="rounded-xl bg-[#f4faed] p-4 space-y-2 text-sm"><p><strong>Supplier:</strong> {trade.supplier}</p><p><strong>Order:</strong> {trade.product} • ${trade.total} USD</p><p><strong>Advance:</strong> ${trade.advance} USD (30%)</p><p><strong>Payment:</strong> {trade.status === "AGREED" ? "Not started" : trade.status === "AWAITING_APPROVAL" ? "Waiting for PayPal approval" : "Paid (sandbox)"}</p>
        {mode === "orders" && <><button onClick={() => onNavigate("payments")} className="mt-2 rounded-xl bg-[#18280e] px-4 py-2 font-semibold text-white">Go to Payments</button><button disabled={busy} onClick={() => { sessionStorage.removeItem(KEY); setSession(null); setTrade(null); setError(""); setNotice(""); }} className="ml-3 mt-2 text-xs underline text-stone-600">Start a new demo</button></>}
        {mode === "payments" && <>{trade.paypalId && <p className="break-all"><strong>PayPal order:</strong> {trade.paypalId}</p>}{trade.captureId && <p className="break-all"><strong>Capture ID:</strong> {trade.captureId}</p>}{trade.status === "AGREED" && <button disabled={busy} onClick={createPayment} className="mt-2 rounded-xl bg-[#18280e] px-4 py-2 font-semibold text-white disabled:opacity-50">{busy ? "Creating…" : "Pay with PayPal"}</button>}{trade.status === "AWAITING_APPROVAL" && trade.approvalUrl && <a href={trade.approvalUrl} className="mt-2 inline-block rounded-xl bg-[#18280e] px-4 py-2 font-semibold text-white">Continue to PayPal sandbox</a>}</>}
      </div>}
      {busy && <p className="text-sm text-stone-500">Loading…</p>}{notice && <p role="status" className="text-sm text-stone-600">{notice}</p>}{error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <p className="text-xs text-stone-500">No real money is used. Orders reset when the server restarts. {mode === "payments" && <>Test payment goes to your sandbox account, not the sample supplier. <a className="underline" href="/buyer" target="_blank" rel="noreferrer">Open in a new tab</a> before paying.</>}</p>
    </section>
  );
}
