/**
 * Zapier Cross-Border Trade Event Automation for TRUV
 *
 * Tool: Zapier (Multi-step Webhook Automations & Partner Connectors)
 * For What: Automated dispatch of operational tasks to external freight forwarders,
 * customs brokers (ICEGATE), and third-party inspection agencies (QIMA/SGS).
 * Why: Small and medium Indian manufacturers do not maintain internal export logistics
 * software. When a commercial order is confirmed or a PayPal milestone deposit is captured,
 * Zapier orchestrates real-time external communications, EDI dispatch, and calendar alerts.
 */

export interface ZapierTradeEvent {
  eventId: string;
  eventType:
    | "rfq.published"
    | "commercial_quote.accepted"
    | "paypal.milestone_30_captured"
    | "qima.inspection_booked"
    | "icegate.shipping_bill_filed"
    | "customs.leo_cleared"
    | "ocean.bill_of_lading_issued"
    | "paypal.milestone_70_settled";
  orderNumber: string;
  buyerName: string;
  manufacturerLegalName: string;
  timestamp: string;
  payload: Record<string, unknown>;
}

export class ZapierTradeAutomation {
  private webhookEndpoint: string;
  private isConfigured: boolean;

  constructor() {
    this.webhookEndpoint = process.env.ZAPIER_TRADE_WEBHOOK_URL || "";
    this.isConfigured = Boolean(this.webhookEndpoint);
  }

  /**
   * Dispatches a structured cross-border event to Zapier
   */
  public async triggerTradeEvent(event: Omit<ZapierTradeEvent, "eventId" | "timestamp">) {
    const fullEvent: ZapierTradeEvent = {
      ...event,
      eventId: `zap_evt_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    if (!this.isConfigured) {
      // Deterministic simulation log for local/sandbox run
      return {
        success: true,
        dispatched: false,
        mode: "sandbox_simulation",
        eventId: fullEvent.eventId,
        destinationApps: this.getDestinationAppsForEvent(event.eventType),
        message: `Zapier automation simulated: Routed '${event.eventType}' for ${event.orderNumber} to external partner hooks.`,
        event: fullEvent,
      };
    }

    try {
      const res = await fetch(this.webhookEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullEvent),
      });

      return {
        success: res.ok,
        dispatched: true,
        mode: "live_zapier",
        eventId: fullEvent.eventId,
        destinationApps: this.getDestinationAppsForEvent(event.eventType),
        status: res.status,
      };
    } catch (err) {
      return {
        success: false,
        dispatched: false,
        error: (err as Error).message,
        eventId: fullEvent.eventId,
      };
    }
  }

  private getDestinationAppsForEvent(eventType: ZapierTradeEvent["eventType"]): string[] {
    switch (eventType) {
      case "paypal.milestone_30_captured":
        return ["Slack (Buyer & Factory Channel)", "Google Sheets (Factory Queue)", "Gmail (Raw Material Supplier)"];
      case "qima.inspection_booked":
        return ["QIMA API / Portal", "Outlook Calendar (Factory Inspection Slot)", "WhatsApp (Plant QA Lead)"];
      case "icegate.shipping_bill_filed":
        return ["ICEGATE Customs House Agent", "Mundra Port Gate-In Scheduler", "Dropbox (Export Documents)"];
      case "customs.leo_cleared":
        return ["Maersk Line Booking EDI", "Foreign Buyer ERP Webhook", "SMS Alerts"];
      case "ocean.bill_of_lading_issued":
      case "paypal.milestone_70_settled":
        return ["PayPal Settlement Ledger", "Indian Bank EDPMS Realization", "QuickBooks / Zoho Books"];
      default:
        return ["TRUV Internal Webhook", "Foreign Buyer Email"];
    }
  }
}

export const zapierAutomation = new ZapierTradeAutomation();

