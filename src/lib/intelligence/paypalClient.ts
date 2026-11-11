/**
 * PayPal Financial Transaction Intelligence Client
 * 
 * Complies with official PayPal REST APIs (v2/checkout/orders, webhooks).
 * Supports transparent sandbox fallback with explicit environment reporting.
 *
 * NOTE: PayPal confirms financial status and settlement between parties.
 * It does NOT inspect physical product quality or guarantee manufacturer delivery.
 */

export interface PayPalConfig {
  clientId: string;
  clientSecret: string;
  mode: "sandbox" | "live";
}

export class PayPalIntelligenceClient {
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;
  private isConfigured: boolean;

  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID || "";
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET || "";
    const isLive = process.env.PAYPAL_ENV === "production";
    this.baseUrl = isLive ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
    this.isConfigured = Boolean(this.clientId && this.clientSecret);
  }

  public getStatus() {
    return {
      isLive: process.env.PAYPAL_ENV === "production",
      isConfigured: this.isConfigured,
      environment: this.isConfigured ? (process.env.PAYPAL_ENV === "production" ? "live" : "sandbox") : "not_configured",
      notice: "PayPal handles payment execution and dispute recording. Product quality & delivery confirmation are verified via third-party inspection milestones.",
    };
  }

  /**
   * Fetches an OAuth2 bearer token from PayPal API
   */
  private async getAccessToken(): Promise<string> {
    if (!this.isConfigured) {
      throw new Error("PayPal is not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET.");
    }

    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64");
    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      throw new Error(`Failed to obtain PayPal access token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  }

  /**
   * Initiates a PayPal Order linked to a Commercial Transaction Reference
   */
  public async createOrder(params: {
    transactionId: string;
    transactionReference: string;
    amount: number;
    currency: string;
    description: string;
    returnUrl?: string;
    cancelUrl?: string;
  }) {
    if (!this.isConfigured) {
      throw new Error("PayPal is not configured. Set sandbox credentials before creating a payment.");
    }

    const token = await this.getAccessToken();
    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: params.transactionId,
          custom_id: params.transactionReference,
          description: params.description.substring(0, 127),
          amount: {
            currency_code: params.currency,
            value: params.amount.toFixed(2),
          },
        },
      ],
      application_context: {
        return_url: params.returnUrl || "http://localhost:3000/api/intelligence/paypal/return",
        cancel_url: params.cancelUrl || "http://localhost:3000/api/intelligence/paypal/cancel",
      },
    };

    const res = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(`PayPal Order Creation failed: ${JSON.stringify(err)}`);
    }

    return await res.json();
  }

  /**
   * Captures payment for an approved order
   */
  public async captureOrder(orderId: string) {
    if (!this.isConfigured) {
      throw new Error("PayPal is not configured. Set sandbox credentials before capturing a payment.");
    }

    const token = await this.getAccessToken();
    const res = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(`PayPal Capture failed: ${JSON.stringify(err)}`);
    }

    return await res.json();
  }

  /** Verify the complete event with PayPal before processing it. */
  public async verifyWebhook(headers: Headers, payload: Record<string, unknown>): Promise<boolean> {
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    const transmissionId = headers.get("paypal-transmission-id");
    const transmissionTime = headers.get("paypal-transmission-time");
    const certUrl = headers.get("paypal-cert-url");
    const authAlgo = headers.get("paypal-auth-algo");
    const transmissionSig = headers.get("paypal-transmission-sig");
    if (!webhookId || !this.isConfigured) {
      throw new Error("PayPal webhook verification is not configured.");
    }
    if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig) return false;
    const token = await this.getAccessToken();
    const response = await fetch(`${this.baseUrl}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_algo: authAlgo, cert_url: certUrl, transmission_id: transmissionId,
        transmission_sig: transmissionSig, transmission_time: transmissionTime,
        webhook_id: webhookId, webhook_event: payload,
      }),
    });
    if (!response.ok) throw new Error("PayPal webhook verification request failed.");
    const result = await response.json();
    return result.verification_status === "SUCCESS";
  }

  /**
   * Maps an already verified webhook event
   */
  public parseWebhookEvent(payload: Record<string, unknown>) {
    const eventType = String(payload.event_type || "");
    const resource = (payload.resource as Record<string, unknown>) || {};

    let eventStatus: "CREATED" | "COMPLETED" | "REFUNDED" | "DISPUTED" | "SAVED" = "SAVED";

    if (eventType === "PAYMENT.CAPTURE.COMPLETED" || eventType === "CHECKOUT.ORDER.COMPLETED") {
      eventStatus = "COMPLETED";
    } else if (eventType.includes("REFUND")) {
      eventStatus = "REFUNDED";
    } else if (eventType.includes("DISPUTE")) {
      eventStatus = "DISPUTED";
    }

    const rawAmount = resource.amount as { currency_code?: string; currencyCode?: string; value?: string } | undefined;
    const amount = rawAmount
      ? {
          currencyCode: rawAmount.currencyCode || rawAmount.currency_code || "USD",
          value: rawAmount.value || "0.00",
        }
      : undefined;

    return {
      eventType,
      eventStatus,
      orderId: (resource.id as string) || "",
      customId: (resource.custom_id as string) || "",
      amount,
      timestamp: String(payload.create_time || new Date().toISOString()),
    };
  }
}

export const payPalClient = new PayPalIntelligenceClient();
