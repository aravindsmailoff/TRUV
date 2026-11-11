import { randomUUID, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { INITIAL_QUOTES, INITIAL_RFQS } from "@/lib/buyer/buyerStore";

type DemoTrade = { id: string; access: string; quoteId: string; supplier: string; product: string; total: string; advance: string; paypalId?: string; approvalUrl?: string; captureId?: string; status: "AGREED" | "AWAITING_APPROVAL" | "COMPLETED"; busy?: boolean };
// Demonstration only. State is process-local and lost on restart; never use for real funds.
const root = globalThis as typeof globalThis & { demoPayPalTrades?: Map<string, DemoTrade> };
const trades = root.demoPayPalTrades ??= new Map<string, DemoTrade>();

function checkAccess(trade: DemoTrade | undefined, access: unknown): trade is DemoTrade {
  if (!trade || typeof access !== "string") return false;
  const a = Buffer.from(trade.access); const b = Buffer.from(access);
  return a.length === b.length && timingSafeEqual(a, b);
}
function view(t: DemoTrade) {
  return { id: t.id, quoteId: t.quoteId, supplier: t.supplier, product: t.product, total: t.total, advance: t.advance, status: t.status, paypalId: t.paypalId, approvalUrl: t.approvalUrl, captureId: t.captureId };
}
async function paypal(path: string, body: object, requestId?: string) {
  if (process.env.PAYPAL_ENV === "production") throw new Error("This demo supports PayPal sandbox only.");
  const id = process.env.PAYPAL_CLIENT_ID, secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new Error("PayPal sandbox is not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET on the server.");
  const base = "https://api-m.sandbox.paypal.com";
  let auth: Response;
  try {
    auth = await fetch(`${base}/v1/oauth2/token`, { method: "POST", headers: { Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" }, body: "grant_type=client_credentials" });
  } catch {
    throw new Error("Unable to reach PayPal sandbox from this server. Try a server with PayPal network access.");
  }
  if (!auth.ok) throw new Error("PayPal sandbox authentication failed. Check the sandbox credentials.");
  const { access_token } = await auth.json();
  const response = await fetch(`${base}${path}`, { method: "POST", headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json", ...(requestId ? { "PayPal-Request-Id": requestId } : {}) }, body: JSON.stringify(body) });
  const result = await response.json();
  if (!response.ok) throw new Error(`PayPal sandbox request failed (${response.status}): ${result.message || "Unknown error"}`);
  return result;
}
function returnBase() {
  const value = process.env.PAYPAL_RETURN_BASE_URL;
  if (!value) throw new Error("PayPal setup is incomplete: add your app URL as PAYPAL_RETURN_BASE_URL on the server.");
  const url = new URL(value);
  if (url.pathname !== "/" || url.search || url.hash || (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname)))) throw new Error("PAYPAL_RETURN_BASE_URL must be an HTTPS origin (or HTTP localhost for local development).");
  return url.origin;
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.action === "agree") {
      const quote = INITIAL_QUOTES.find(q => q.id === body.quoteId && q.status !== "rejected");
      if (!quote) return NextResponse.json({ error: "Demo quote not found." }, { status: 404 });
      const rfq = INITIAL_RFQS.find(r => r.id === quote.rfqId);
      const trade: DemoTrade = { id: randomUUID(), access: randomUUID(), quoteId: quote.id, supplier: quote.supplierName, product: rfq?.title || "Demo trade", total: quote.totalPriceUSD.toFixed(2), advance: (Math.round(quote.totalPriceUSD * 30) / 100).toFixed(2), status: "AGREED" };
      trades.set(trade.id, trade);
      return NextResponse.json({ trade: view(trade), access: trade.access });
    }
    const trade = typeof body.id === "string" ? trades.get(body.id) : undefined;
    if (!checkAccess(trade, body.access)) return NextResponse.json({ error: "Demo order not found or session expired." }, { status: 404 });
    if (body.action === "status") return NextResponse.json({ trade: view(trade) });
    if (body.action === "create") {
      if (trade.status !== "AGREED") return NextResponse.json({ trade: view(trade) });
      if (trade.busy) return NextResponse.json({ error: "Payment request already in progress." }, { status: 409 });
      const base = returnBase(); trade.busy = true;
      try {
        const order = await paypal("/v2/checkout/orders", { intent: "CAPTURE", purchase_units: [{ reference_id: trade.id, custom_id: trade.id, description: `TRUVX demo advance: ${trade.product}`.slice(0, 127), amount: { currency_code: "USD", value: trade.advance } }], payment_source: { paypal: { experience_context: { return_url: `${base}/buyer?paypal=approved`, cancel_url: `${base}/buyer?paypal=cancelled`, user_action: "PAY_NOW" } } } }, `create-${trade.id}`);
        const approval = order.links?.find((l: { rel: string; href: string }) => l.rel === "payer-action" || l.rel === "approve")?.href;
        if (typeof order.id !== "string" || !approval || new URL(approval).hostname !== "www.sandbox.paypal.com") throw new Error("PayPal did not return a valid sandbox approval link.");
        trade.paypalId = order.id; trade.approvalUrl = approval; trade.status = "AWAITING_APPROVAL";
        return NextResponse.json({ trade: view(trade) });
      } finally { trade.busy = false; }
    }
    if (body.action === "capture") {
      if (trade.status === "COMPLETED") return NextResponse.json({ trade: view(trade) });
      if (!trade.paypalId || trade.status !== "AWAITING_APPROVAL" || body.token !== trade.paypalId) return NextResponse.json({ error: "PayPal return does not match this order." }, { status: 400 });
      if (trade.busy) return NextResponse.json({ error: "Capture already in progress." }, { status: 409 });
      trade.busy = true;
      try {
        const result = await paypal(`/v2/checkout/orders/${encodeURIComponent(trade.paypalId)}/capture`, {}, `capture-${trade.id}`);
        const unit = result.purchase_units?.find((u: { reference_id?: string }) => u.reference_id === trade.id);
        const capture = unit?.payments?.captures?.[0];
        if (result.id !== trade.paypalId || result.status !== "COMPLETED" || !capture?.id || capture.status !== "COMPLETED" || capture.amount?.currency_code !== "USD" || capture.amount?.value !== trade.advance) throw new Error("PayPal did not confirm the expected capture and amount. Do not retry without checking PayPal.");
        trade.captureId = capture.id; trade.status = "COMPLETED";
        return NextResponse.json({ trade: view(trade) });
      } finally { trade.busy = false; }
    }
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Sandbox payment failed." }, { status: 400 });
  }
}
