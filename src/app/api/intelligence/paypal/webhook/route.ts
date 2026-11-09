import { NextRequest, NextResponse } from "next/server";
import { payPalClient } from "@/lib/intelligence/paypalClient";
import { INITIAL_PAYPAL_EVENTS, INITIAL_MILESTONES } from "@/lib/intelligence/store";

export async function POST(req: NextRequest) {
  try {
    const rawPayload = await req.json();
    const event = payPalClient.parseWebhookEvent(rawPayload);

    const amount = event.amount || { currencyCode: "USD", value: "0.00" };

    // Record webhook event in store
    const newEvent = {
      id: `pp_evt_${Date.now()}`,
      commercialTransactionId: event.customId || "tx_global_9921",
      paypalOrderId: event.orderId,
      status: event.eventStatus,
      amount,
      reconciled: event.eventStatus === "COMPLETED",
      createdAt: event.timestamp,
    };

    INITIAL_PAYPAL_EVENTS.push(newEvent);

    if (event.eventStatus === "COMPLETED") {
      INITIAL_MILESTONES.push({
        id: `ms_${Date.now()}`,
        transactionId: newEvent.commercialTransactionId,
        title: `PayPal Settlement Verified ($${amount.value} ${amount.currencyCode})`,
        stage: "payment_cleared",
        status: "verified",
        sourceType: "confirmed",
        evidenceReference: `PayPal Order: ${newEvent.paypalOrderId}`,
        notes: "Webhook confirmed real-time payment capture.",
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      received: true,
      eventProcessed: event.eventType,
      status: event.eventStatus,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Webhook processing error", details: (error as Error).message },
      { status: 400 }
    );
  }
}
