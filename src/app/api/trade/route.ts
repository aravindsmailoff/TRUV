import { NextRequest, NextResponse } from "next/server";
import { tradeStore } from "@/lib/trade/tradeStore";
import { createPayPalOrderForTrade, payPalTradeClient } from "@/lib/trade/paypalTradeClient";
import { elasticSearchEngine } from "@/lib/trade/elasticSearchEngine";
import { zapierAutomation } from "@/lib/trade/zapierAutomation";
import { astropodsTracker } from "@/lib/trade/astropodsTelemetry";
import {
  getWhatsAppStatusSnapshot,
  sendRealWhatsAppMessage,
} from "@/lib/whatsapp/whatsappEngine";
import { notificationEngine } from "@/lib/trade/notificationEngine";

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
    verifiedCertificates: tradeStore.getVerifiedCertificates(),
    notifications: notificationEngine.getEvents(),
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

      let whatsappDispatch = null;
      if (getWhatsAppStatusSnapshot().config.autoNotifyOnEvents) {
        whatsappDispatch = await sendRealWhatsAppMessage({
          role: "manufacturer",
          eventType: "rfq_published",
          orderNumber: rfq.rfqNumber,
          buyerName: `${rfq.buyerCompany} (${rfq.buyerCountry})`,
          productName: rfq.productName,
          quantity: rfq.targetQuantity,
          amountUSD: rfq.targetQuantity * rfq.targetPricePerUnit,
        });
      }

      return NextResponse.json({ success: true, rfq, whatsappDispatch });
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

      let whatsappDispatch = null;
      if (getWhatsAppStatusSnapshot().config.autoNotifyOnEvents) {
        whatsappDispatch = await sendRealWhatsAppMessage({
          role: "manufacturer",
          eventType: "new_order",
          orderNumber: trade.orderNumber,
          buyerName: `${trade.buyerCompany} (${trade.buyerCountry})`,
          manufacturerName: trade.manufacturerName,
          productName: trade.productName,
          quantity: trade.quantityUnits,
          amountUSD: trade.totalAmountUSD,
        });
      }

      return NextResponse.json({ success: true, trade, whatsappDispatch });
    }

    // 4. Create PayPal Direct Commercial Payment (Uses User's Sandbox Account)
    if (action === "create_paypal_payment") {
      const { tradeId, isAdvance = true, amountUSD, description, orderNumber, returnUrl, cancelUrl } = body;
      const trade = tradeStore.getTrade(tradeId);

      if (typeof amountUSD === "number" && amountUSD > 0) {
        const paymentOrder = await payPalTradeClient.createTradePaymentOrder({
          tradeOrder: {
            ...(trade || tradeStore.getTrades()[0]),
            id: tradeId || `ord_${Date.now()}`,
            orderNumber: orderNumber || trade?.orderNumber || "PO-TRADE",
          },
          amountUSD,
          description: description || `TradeOracle Order Payment (${orderNumber || tradeId})`,
          returnUrl,
          cancelUrl,
        });
        return NextResponse.json({ success: true, paymentOrder, paymentState: "awaiting_approval" });
      }

      if (!trade) {
        return NextResponse.json({ error: "Trade not found" }, { status: 404 });
      }

      const mfg = tradeStore.getManufacturer(trade.manufacturerId);
      const paymentOrder = await createPayPalOrderForTrade(trade, mfg, isAdvance, {
        returnUrl,
        cancelUrl,
      });

      // An order is only a request for approval. No payment has been captured yet.
      return NextResponse.json({ success: true, paymentOrder, paymentState: "awaiting_approval" });
    }

    // 5. Update Milestone
    if (action === "advance_milestone") {
      const { tradeId, milestoneId } = body;
      const updated = tradeStore.advanceMilestone(tradeId, milestoneId);
      const trade = tradeStore.getTrade(tradeId);

      let whatsappDispatch = null;
      if (trade && getWhatsAppStatusSnapshot().config.autoNotifyOnEvents) {
        whatsappDispatch = await sendRealWhatsAppMessage({
          role: "manufacturer",
          eventType: "quality_inspection_passed",
          orderNumber: trade.orderNumber,
          buyerName: `${trade.buyerCompany} (${trade.buyerCountry})`,
          manufacturerName: trade.manufacturerName,
          productName: trade.productName,
          quantity: trade.quantityUnits,
          amountUSD: trade.totalAmountUSD,
        });
      }

      return NextResponse.json({ success: true, milestone: updated, whatsappDispatch });
    }

    // 6. Seller Packing, AI Reassurance, Buyer Notification & Government Freight Cargo Dispatch
    if (action === "seller_update_packing_cargo") {
      const {
        tradeId,
        orderNumber,
        packingStatus = "packed",
        govtCargoService = "CONCOR (Container Corp of India - Govt. of India)",
        trackingNumber,
        buyerReassuranceNote,
        useAIReassurance = true,
      } = body;

      const { trade, milestone } = tradeStore.updateSellerPackingAndCargo({
        tradeId,
        orderNumber,
        packingStatus,
        govtCargoService,
        trackingNumber,
        buyerReassuranceNote,
      });

      const finalMessage = useAIReassurance
        ? await notificationEngine.generateAIReassurance({
            orderNumber: trade.orderNumber,
            productName: trade.productName,
            packingStatus,
            govtCargoService,
            trackingNumber: trade.freightForwarder.bookingReference || "GOV-CARGO",
            buyerCompany: trade.buyerCompany,
            buyerCountry: trade.buyerCountry,
            sellerNote: buyerReassuranceNote,
          })
        : trade.sellerDispatchUpdate?.buyerReassuranceNote || "";

      if (trade.sellerDispatchUpdate && finalMessage) {
        trade.sellerDispatchUpdate.buyerReassuranceNote = finalMessage;
      }

      const notification = await notificationEngine.emitBuyerNotification({
        orderNumber: trade.orderNumber,
        eventType: "packing_cargo_updated",
        title: `Order ${packingStatus.replace(/_/g, " ")} · ${govtCargoService}`,
        message: finalMessage,
        govtCargoService,
        trackingNumber: trade.freightForwarder.bookingReference,
      });

      let whatsappDispatch = null;
      if (getWhatsAppStatusSnapshot().config.autoNotifyOnEvents) {
        whatsappDispatch = await sendRealWhatsAppMessage({
          role: "buyer",
          eventType: "shipment_dispatched",
          orderNumber: trade.orderNumber,
          buyerName: `${trade.buyerCompany} (${trade.buyerCountry})`,
          manufacturerName: trade.manufacturerName,
          productName: trade.productName,
          quantity: trade.quantityUnits,
          amountUSD: trade.totalAmountUSD,
        });
      }

      return NextResponse.json({
        success: true,
        trade,
        milestone,
        notification,
        whatsappDispatch,
      });
    }

    // 7. Seller Accepts Live Buyer RFQ -> Creates Order + Notifies Buyer
    if (action === "seller_accept_rfq") {
      const { rfqId, manufacturerName } = body;
      const trade = tradeStore.acceptRFQAndCreateOrder({ rfqId, manufacturerName });

      const aiMsg = await notificationEngine.generateAIReassurance({
        orderNumber: trade.orderNumber,
        productName: trade.productName,
        packingStatus: "accepted",
        govtCargoService: trade.freightForwarder.name,
        trackingNumber: "PENDING-PACKING",
        buyerCompany: trade.buyerCompany,
        buyerCountry: trade.buyerCountry,
        sellerNote: "Manufacturer accepted your RFQ and started production & export packing.",
      });

      const notification = await notificationEngine.emitBuyerNotification({
        orderNumber: trade.orderNumber,
        eventType: "milestone_completed",
        title: `Order Accepted by ${trade.manufacturerName}`,
        message: aiMsg,
      });

      return NextResponse.json({ success: true, trade, notification });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: "Trade execution error", details: (err as Error).message },
      { status: 500 }
    );
  }
}

