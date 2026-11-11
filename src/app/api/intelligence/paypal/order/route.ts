import { NextRequest, NextResponse } from "next/server";
import { payPalClient } from "@/lib/intelligence/paypalClient";
import { INITIAL_TRANSACTIONS } from "@/lib/intelligence/store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transactionId, action = "create_order", orderId } = body;

    if (action === "capture" && orderId) {
      const captureResult = await payPalClient.captureOrder(orderId);
      return NextResponse.json({ success: true, capture: captureResult });
    }

    const tx = INITIAL_TRANSACTIONS.find((t) => t.id === transactionId);
    if (!tx) {
      return NextResponse.json({ error: "Commercial transaction not found" }, { status: 404 });
    }

    // Default to 30% advance deposit if paymentTerms specify advance, else full amount
    const isAdvance = tx.paymentTerms.includes("Advance");
    const depositAmount = isAdvance ? tx.totalAmount * 0.3 : tx.totalAmount;

    const order = await payPalClient.createOrder({
      transactionId: tx.id,
      transactionReference: tx.transactionReference,
      amount: depositAmount,
      currency: tx.currency,
      description: `Advance payment for ${tx.productDescription}`,
    });

    return NextResponse.json({
      success: true,
      order,
      status: payPalClient.getStatus(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "PayPal Order operation failed", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(payPalClient.getStatus());
}

