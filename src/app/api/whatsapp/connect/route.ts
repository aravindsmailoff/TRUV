import { NextRequest, NextResponse } from "next/server";
import {
  connectWhatsApp,
  disconnectWhatsApp,
  getWhatsAppStatusSnapshot,
  hasSavedSession,
} from "@/lib/whatsapp/whatsappEngine";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getWhatsAppStatusSnapshot();

  // Auto-resume saved session in background if creds exist on disk
  if (snapshot.status === "disconnected" && hasSavedSession()) {
    void connectWhatsApp(false);
  }

  return NextResponse.json({
    success: true,
    ...snapshot,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action || "connect";

    if (action === "disconnect") {
      await disconnectWhatsApp(true);
      return NextResponse.json({
        success: true,
        ...getWhatsAppStatusSnapshot(),
      });
    }

    const forceFresh = action === "fresh_qr";
    await connectWhatsApp(forceFresh);

    // Wait briefly (up to 3s) so QR code or open status is often ready on the very first response
    for (let i = 0; i < 12; i++) {
      const snap = getWhatsAppStatusSnapshot();
      if (snap.status === "qr_ready" || snap.status === "connected" || snap.status === "error") {
        return NextResponse.json({
          success: true,
          ...snap,
        });
      }
      await new Promise((r) => setTimeout(r, 250));
    }

    return NextResponse.json({
      success: true,
      ...getWhatsAppStatusSnapshot(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: (err as Error).message || "Failed to connect WhatsApp session",
      },
      { status: 500 }
    );
  }
}

