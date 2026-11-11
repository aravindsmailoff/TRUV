"use client";

import type { TradeNotificationEventType, TradeRole } from "./whatsappEngine";

export async function triggerAutomatedWhatsAppAlert(params: {
  role: TradeRole;
  eventType: TradeNotificationEventType;
  orderNumber: string;
  toPhone?: string;
  buyerName?: string;
  manufacturerName?: string;
  productName?: string;
  quantity?: number;
  amountUSD?: number;
  customText?: string;
}) {
  try {
    const res = await fetch("/api/whatsapp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch {
    return { success: false };
  }
}

