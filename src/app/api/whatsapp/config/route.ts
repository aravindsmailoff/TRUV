import { NextRequest, NextResponse } from "next/server";
import {
  getWhatsAppStatusSnapshot,
  updateWhatsAppConfig,
} from "@/lib/whatsapp/whatsappEngine";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = updateWhatsAppConfig({
      autoNotifyOnEvents:
        typeof body.autoNotifyOnEvents === "boolean" ? body.autoNotifyOnEvents : undefined,
      zapierWebhookUrl:
        typeof body.zapierWebhookUrl === "string" ? body.zapierWebhookUrl : undefined,
      recipientPhones: body.recipientPhones,
    });

    return NextResponse.json({
      success: true,
      config: updated,
      snapshot: getWhatsAppStatusSnapshot(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: (err as Error).message || "Failed to update WhatsApp configuration",
      },
      { status: 400 }
    );
  }
}

