import { NextRequest, NextResponse } from "next/server";
import { notificationEngine } from "@/lib/trade/notificationEngine";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("mode") === "inbox") {
    return NextResponse.json({
      events: notificationEngine.getEvents(),
      unreadCount: notificationEngine.getEvents().filter((e) => !e.read).length,
    });
  }

  const encoder = new TextEncoder();
  let cleanup: (() => void) | null = null;

  const stream = new ReadableStream({
    start(controller) {
      const send = (payload: unknown) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
        } catch {
          // Stream already closed
        }
      };

      send({ type: "connected", unreadCount: notificationEngine.getEvents().filter((e) => !e.read).length });

      const unsubscribe = notificationEngine.subscribe((event) => {
        send({ type: "notification", event });
      });

      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": keepalive\n\n"));
        } catch {
          clearInterval(heartbeat);
        }
      }, 20000);

      cleanup = () => {
        clearInterval(heartbeat);
        unsubscribe();
      };
    },
    cancel() {
      cleanup?.();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

export async function POST() {
  notificationEngine.markAllRead();
  return NextResponse.json({ success: true, unreadCount: 0 });
}

