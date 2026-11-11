import { NextRequest, NextResponse } from "next/server";
import { payPalClient } from "@/lib/intelligence/paypalClient";
import { INITIAL_PAYPAL_EVENTS, INITIAL_MILESTONES, INITIAL_TRANSACTIONS } from "@/lib/intelligence/store";

// Prototype only: these IDs and records are in memory and do not survive restarts.
const processedEventIds = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
    }
    if (!await payPalClient.verifyWebhook(req.headers, payload)) {
      return NextResponse.json({ error: "Invalid PayPal webhook signature" }, { status: 401 });
    }
    const eventId = typeof payload.id === "string" ? payload.id : "";
    if (!eventId) return NextResponse.json({ error: "Missing event ID" }, { status: 400 });
    if (processedEventIds.has(eventId)) return NextResponse.json({ received: true, duplicate: true });

    const event = payPalClient.parseWebhookEvent(payload);
    // Only captures, not order approval or creation, represent completed payments.
    if (event.eventType !== "PAYMENT.CAPTURE.COMPLETED") {
      processedEventIds.add(eventId);
      return NextResponse.json({ received: true, ignored: true });
    }
    const tx = INITIAL_TRANSACTIONS.find((t) => t.transactionReference === event.customId || t.id === event.customId);
    if (!tx || !event.amount) {
      // Do not invent a transaction match. Retrying after reconciliation is safe.
      return NextResponse.json({ error: "Capture could not be matched to a transaction and amount" }, { status: 422 });
    }
    const expectedAmount = tx.paymentTerms.includes("Advance") ? tx.totalAmount * 0.3 : tx.totalAmount;
    if (event.amount.currencyCode !== tx.currency || event.amount.value !== expectedAmount.toFixed(2)) {
      return NextResponse.json({ error: "Capture amount or currency does not match the transaction" }, { status: 422 });
    }
    INITIAL_PAYPAL_EVENTS.push({
      id: eventId,
      commercialTransactionId: tx.id,
      paypalOrderId: event.orderId,
      status: "COMPLETED",
      amount: event.amount,
      reconciled: true,
      createdAt: event.timestamp,
    });
    INITIAL_MILESTONES.push({
      id: `ms_${eventId}`,
      transactionId: tx.id,
      title: `PayPal capture confirmed (${event.amount.value} ${event.amount.currencyCode})`,
      stage: "payment_cleared",
      status: "verified",
      sourceType: "confirmed",
      evidenceReference: `PayPal capture: ${event.orderId}`,
      notes: "Signature verified with PayPal. This is a payment capture, not escrow.",
      timestamp: event.timestamp,
    });
    processedEventIds.add(eventId);
    return NextResponse.json({ received: true, status: "COMPLETED" });
  } catch (error) {
    console.error("PayPal webhook processing failed:", error);
    return NextResponse.json({ error: "Webhook verification or processing failed" }, { status: 503 });
  }
}
