import { NextRequest, NextResponse } from "next/server";
import {
  sendRealWhatsAppMessage,
  TradeNotificationEventType,
  TradeRole,
} from "@/lib/whatsapp/whatsappEngine";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const role: TradeRole =
      body.role === "buyer" || body.role === "service" ? body.role : "manufacturer";
    const eventType: TradeNotificationEventType = body.eventType || "new_order";

    const result = await sendRealWhatsAppMessage({
      toPhone: body.toPhone,
      role,
      eventType,
      orderNumber: body.orderNumber || "ORD-USA-9921",
      buyerName: body.buyerName,
      manufacturerName: body.manufacturerName,
      productName: body.productName,
      quantity: body.quantity ? Number(body.quantity) : undefined,
      amountUSD: body.amountUSD ? Number(body.amountUSD) : undefined,
      customText: body.customText,
    });

    return NextResponse.json({
      success: result.status === "sent",
      log: result,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: (err as Error).message || "Failed to dispatch WhatsApp message",
      },
      { status: 500 }
    );
  }
}

