import { NextRequest, NextResponse } from "next/server";
import { tradeStore } from "@/lib/trade/tradeStore";
import { createPayPalOrderForTrade, payPalTradeClient } from "@/lib/trade/paypalTradeClient";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tradeId = searchParams.get("tradeId");

  if (tradeId) {
    const trade = tradeStore.getTrade(tradeId);
    if (!trade) {
      return NextResponse.json({ error: "Trade not found" }, { status: 404 });
    }
    const rfqs = tradeStore.getRFQs().filter((r) => r.id === trade.rfqId);
    const quotes = tradeStore.getQuotes(trade.rfqId);
    const milestones = tradeStore.getMilestones(trade.id);
    return NextResponse.json({ trade, rfq: rfqs[0] || null, quotes, milestones });
  }

  return NextResponse.json({
    trades: tradeStore.getTrades(),
    rfqs: tradeStore.getRFQs(),
    paypalStatus: payPalTradeClient.getStatus(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // 1. Submit RFQ
    if (action === "submit_rfq") {
      const rfq = tradeStore.createRFQ({
        buyerName: body.buyerName,
        buyerCompany: body.buyerCompany,
        buyerCountry: body.buyerCountry,
        buyerEmail: body.buyerEmail,
        productCategory: body.productCategory,
        productName: body.productName,
        technicalSpecifications: body.technicalSpecifications || [],
        targetQuantity: Number(body.targetQuantity),
        targetPricePerUnit: Number(body.targetPricePerUnit),
        currency: body.currency || "USD",
        targetDeliveryDate: body.targetDeliveryDate || "2026-03-30",
        destinationPort: body.destinationPort || "Port of Los Angeles (USLAX)",
      });

      return NextResponse.json({ success: true, rfq });
    }

    // 2. AI Manufacturer Matching & Shortlisting
    if (action === "match_manufacturers") {
      const { rfqId } = body;
      const matched = tradeStore.matchManufacturersForRFQ(rfqId);
      return NextResponse.json({ success: true, matches: matched });
    }

    // 3. Initiate Trade & Purchase Order
    if (action === "initiate_trade") {
      const { rfqId, manufacturerId, quoteId } = body;
      const trade = tradeStore.initiateTradeOrder({ rfqId, manufacturerId, quoteId });
      return NextResponse.json({ success: true, trade });
    }

    // 4. Create PayPal Direct Commercial Payment
    if (action === "create_paypal_payment") {
      const { tradeId, isAdvance = true } = body;
      const trade = tradeStore.getTrade(tradeId);
      if (!trade) {
        return NextResponse.json({ error: "Trade not found" }, { status: 404 });
      }

      const mfg = tradeStore.getManufacturer(trade.manufacturerId);
      const paymentOrder = await createPayPalOrderForTrade(trade, mfg, isAdvance);

      return NextResponse.json({ success: true, paymentOrder });
    }

    // 5. Update Milestone
    if (action === "advance_milestone") {
      const { tradeId, milestoneId } = body;
      const updated = tradeStore.advanceMilestone(tradeId, milestoneId);
      return NextResponse.json({ success: true, milestone: updated });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: "Trade execution error", details: (err as Error).message },
      { status: 500 }
    );
  }
}

