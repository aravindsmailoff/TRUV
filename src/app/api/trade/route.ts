import { NextRequest, NextResponse } from "next/server";
import { tradeStore } from "@/lib/trade/tradeStore";
import { createPayPalOrderForTrade, payPalTradeClient } from "@/lib/trade/paypalTradeClient";
import { elasticSearchEngine } from "@/lib/trade/elasticSearchEngine";
import { zapierAutomation } from "@/lib/trade/zapierAutomation";
import { astropodsTracker } from "@/lib/trade/astropodsTelemetry";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tradeId = searchParams.get("tradeId");
  const action = searchParams.get("action");
  const orderNumber = searchParams.get("orderNumber");

  // Astropods Telemetry
  if (action === "telemetry") {
    if (orderNumber) {
      const data = astropodsTracker.getShipmentTelemetry(orderNumber);
      return NextResponse.json({ success: true, telemetry: data });
    }
    return NextResponse.json({ success: true, shipments: astropodsTracker.getAllActiveShipments() });
  }

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
    sponsorsIntegrated: ["PayPal (Orders v2 Sandbox)", "Elastic (Semantic Match)", "Zapier (Trade Automation)", "Astropods (Satellite AIS)"],
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

      // Trigger Zapier RFQ published hook
      await zapierAutomation.triggerTradeEvent({
        eventType: "rfq.published",
        orderNumber: `RFQ-${rfq.id}`,
        buyerName: rfq.buyerName,
        manufacturerLegalName: "All Shortlisted Indian MSMEs",
        payload: {
          productName: rfq.productName,
          targetQuantity: rfq.targetQuantity,
          targetPrice: rfq.targetPricePerUnit,
        },
      });

      return NextResponse.json({ success: true, rfq });
    }

    // 2. Elastic AI Manufacturer Search & Shortlisting
    if (action === "elastic_search" || action === "match_manufacturers") {
      const { productDescription, targetMaterial, minCapacityUnits, requiredCertification } = body;
      const matches = elasticSearchEngine.searchSuitableManufacturers({
        productDescription: productDescription || "Architectural brass hardware C36000",
        targetMaterial,
        minCapacityUnits,
        requiredCertification,
      });
      return NextResponse.json({ success: true, engine: "Elasticsearch BM25 + Vector", matches });
    }

    // 3. Initiate Trade & Purchase Order
    if (action === "initiate_trade") {
      const { rfqId, manufacturerId, quoteId } = body;
      const trade = tradeStore.initiateTradeOrder({ rfqId, manufacturerId, quoteId });
      return NextResponse.json({ success: true, trade });
    }

    // 4. Create PayPal Direct Commercial Payment (Uses User's Sandbox Account)
    if (action === "create_paypal_payment") {
      const { tradeId, isAdvance = true } = body;
      const trade = tradeStore.getTrade(tradeId);
      if (!trade) {
        return NextResponse.json({ error: "Trade not found" }, { status: 404 });
      }

      const mfg = tradeStore.getManufacturer(trade.manufacturerId);
      const paymentOrder = await createPayPalOrderForTrade(trade, mfg, isAdvance);

      // Trigger Zapier milestone escrow notification
      await zapierAutomation.triggerTradeEvent({
        eventType: "paypal.milestone_30_captured",
        orderNumber: trade.orderNumber,
        buyerName: trade.buyerCompany,
        manufacturerLegalName: mfg?.legalEntityName || "Indian MSME",
        payload: {
          payPalOrderId: (paymentOrder as { id?: string }).id,
          amountUSD: isAdvance ? trade.totalAmountUSD * 0.3 : trade.totalAmountUSD,
          stage: isAdvance ? "30% Advance Escrow" : "70% Balance Settlement",
        },
      });

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

