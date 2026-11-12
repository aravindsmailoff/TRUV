import fs from "fs";
import path from "path";

export interface BuyerNotificationEvent {
  id: string;
  orderNumber: string;
  eventType:
    | "packing_cargo_updated"
    | "certificate_verified"
    | "rfq_submitted"
    | "milestone_completed";
  title: string;
  message: string;
  govtCargoService?: string;
  trackingNumber?: string;
  emailTo?: string;
  emailStatus: "sent_via_resend" | "queued_no_resend_key" | "failed";
  read: boolean;
  createdAt: string;
}

type SSEListener = (event: BuyerNotificationEvent) => void;

const DATA_DIR = path.join(process.cwd(), ".data");
const NOTIF_FILE = path.join(DATA_DIR, "buyer-notifications.json");

const AI_ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";
const AI_MODEL = "nvidia/nemotron-3.5-lightning-30b-a3b";

class NotificationEngine {
  private events: BuyerNotificationEvent[] = [];
  private listeners = new Set<SSEListener>();

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(NOTIF_FILE)) {
        const raw = fs.readFileSync(NOTIF_FILE, "utf8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.events = parsed;
        }
      }
    } catch {
      // Ignore disk read error
    }
  }

  private saveToDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(NOTIF_FILE, JSON.stringify(this.events.slice(0, 100), null, 2), "utf8");
    } catch {
      // Ignore disk write error
    }
  }

  public getEvents(): BuyerNotificationEvent[] {
    return this.events;
  }

  public markAllRead() {
    this.events = this.events.map((e) => ({ ...e, read: true }));
    this.saveToDisk();
  }

  public subscribe(listener: SSEListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public async generateAIReassurance(params: {
    orderNumber: string;
    productName: string;
    packingStatus: string;
    govtCargoService: string;
    trackingNumber: string;
    buyerCompany: string;
    buyerCountry: string;
    sellerNote?: string;
  }): Promise<string> {
    const fallback = `Your order ${params.orderNumber} (${params.productName}) is ${params.packingStatus.replace(/_/g, " ")} and safely secured for export to ${params.buyerCountry}. Shipment is registered with ${params.govtCargoService} (Waybill: ${params.trackingNumber}). You can relax — your goods are protected and on schedule.`;

    const apiKey = process.env.NVIDIA_API_KEY?.trim();
    if (!apiKey) return fallback;

    try {
      const res = await fetch(AI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: AI_MODEL,
          temperature: 0.2,
          max_tokens: 180,
          chat_template_kwargs: { enable_thinking: false },
          messages: [
            {
              role: "system",
              content:
                "Write a warm, clear, factual 2-sentence buyer reassurance update confirming the export order is safely packed and moving via the specified Government Freight Cargo service. Return only plain text.",
            },
            {
              role: "user",
              content: `Order: ${params.orderNumber}, Product: ${params.productName}, Buyer: ${params.buyerCompany} (${params.buyerCountry}), Status: ${params.packingStatus}, Carrier: ${params.govtCargoService}, Tracking: ${params.trackingNumber}, Seller Note: ${params.sellerNote || "Packed safely in export crates"}`,
            },
          ],
        }),
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) return fallback;
      const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const text = json.choices?.[0]?.message?.content?.trim();
      return text || fallback;
    } catch {
      return fallback;
    }
  }

  private async sendEmailViaResend(params: {
    to: string;
    subject: string;
    text: string;
  }): Promise<"sent_via_resend" | "queued_no_resend_key" | "failed"> {
    const resendKey = process.env.RESEND_API_KEY?.trim();
    if (!resendKey) return "queued_no_resend_key";

    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || "TradeOracle <onboarding@resend.dev>";
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [params.to],
          subject: params.subject,
          text: params.text,
        }),
        signal: AbortSignal.timeout(8000),
      });
      return res.ok ? "sent_via_resend" : "failed";
    } catch {
      return "failed";
    }
  }

  public async emitBuyerNotification(params: {
    orderNumber: string;
    eventType: BuyerNotificationEvent["eventType"];
    title: string;
    message: string;
    govtCargoService?: string;
    trackingNumber?: string;
    emailTo?: string;
  }): Promise<BuyerNotificationEvent> {
    const emailTo = params.emailTo || "buyer@pacifichardware.us";
    const emailStatus = await this.sendEmailViaResend({
      to: emailTo,
      subject: `[TradeOracle] ${params.orderNumber}: ${params.title}`,
      text: `${params.title}\n\n${params.message}\n${
        params.govtCargoService ? `\nGovernment Cargo Carrier: ${params.govtCargoService}` : ""
      }${params.trackingNumber ? `\nTracking / Waybill: ${params.trackingNumber}` : ""}`,
    });

    const event: BuyerNotificationEvent = {
      id: `notif_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
      orderNumber: params.orderNumber,
      eventType: params.eventType,
      title: params.title,
      message: params.message,
      govtCargoService: params.govtCargoService,
      trackingNumber: params.trackingNumber,
      emailTo,
      emailStatus,
      read: false,
      createdAt: new Date().toISOString(),
    };

    this.events.unshift(event);
    this.saveToDisk();

    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch {
        // Ignore broken SSE stream
      }
    }

    return event;
  }
}

export const notificationEngine = new NotificationEngine();

