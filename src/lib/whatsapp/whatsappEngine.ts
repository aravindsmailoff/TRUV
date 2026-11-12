import fs from "fs";
import path from "path";
import pino from "pino";
import QRCode from "qrcode";
import makeWASocket, {
  Browsers,
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  WASocket,
} from "@whiskeysockets/baileys";

export type WhatsAppConnectionStatus =
  | "disconnected"
  | "connecting"
  | "qr_ready"
  | "connected"
  | "error";

export type TradeRole = "manufacturer" | "buyer" | "service";

export type TradeNotificationEventType =
  | "new_order"
  | "rfq_published"
  | "paypal_escrow_locked"
  | "quality_inspection_passed"
  | "shipment_dispatched"
  | "service_milestone_funded"
  | "service_delivery_submitted"
  | "service_payout_released"
  | "custom";

export interface WhatsAppDispatchLog {
  id: string;
  timestamp: string;
  to: string;
  jid: string;
  role: TradeRole;
  eventType: TradeNotificationEventType;
  orderNumber: string;
  text: string;
  status: "sent" | "failed" | "skipped_not_connected";
  deliveryChannel?: "whatsapp_qr" | "zapier_webhook" | "both" | "none";
  zapierStatus?: "dispatched" | "not_configured" | "failed";
  messageId?: string;
  error?: string;
}

export interface WhatsAppIncomingReply {
  id: string;
  timestamp: string;
  from: string;
  pushName: string;
  text: string;
  autoReplied: boolean;
}

export interface WhatsAppConfig {
  autoNotifyOnEvents: boolean;
  zapierWebhookUrl: string;
  recipientPhones: {
    manufacturer: string;
    buyer: string;
    service: string;
  };
}

interface WhatsAppEngineGlobalState {
  sock: WASocket | null;
  status: WhatsAppConnectionStatus;
  qrRaw: string | null;
  qrDataUrl: string | null;
  connectedPhone: string | null;
  connectedName: string | null;
  lastError: string | null;
  isInitializing: boolean;
  logs: WhatsAppDispatchLog[];
  incomingReplies: WhatsAppIncomingReply[];
  config: WhatsAppConfig;
}

const AUTH_DIR = path.join(process.cwd(), ".whatsapp-auth");
const CONFIG_PATH = path.join(process.cwd(), ".whatsapp-config.json");

const DEFAULT_CONFIG: WhatsAppConfig = {
  autoNotifyOnEvents: true,
  zapierWebhookUrl: process.env.ZAPIER_TRADE_WEBHOOK_URL || "",
  recipientPhones: {
    manufacturer: "",
    buyer: "",
    service: "",
  },
};

function loadConfigFromDisk(): WhatsAppConfig {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      return {
        autoNotifyOnEvents:
          typeof parsed.autoNotifyOnEvents === "boolean" ? parsed.autoNotifyOnEvents : true,
        zapierWebhookUrl: parsed.zapierWebhookUrl || process.env.ZAPIER_TRADE_WEBHOOK_URL || "",
        recipientPhones: {
          manufacturer: parsed.recipientPhones?.manufacturer || "",
          buyer: parsed.recipientPhones?.buyer || "",
          service: parsed.recipientPhones?.service || "",
        },
      };
    }
  } catch {
    // ignore corrupt disk config
  }
  return { ...DEFAULT_CONFIG };
}

function saveConfigToDisk(config: WhatsAppConfig) {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
  } catch {
    // ignore write error
  }
}

declare global {
  var __tradeOracleWhatsAppState: WhatsAppEngineGlobalState | undefined;
}

function getState(): WhatsAppEngineGlobalState {
  if (!globalThis.__tradeOracleWhatsAppState) {
    globalThis.__tradeOracleWhatsAppState = {
      sock: null,
      status: "disconnected",
      qrRaw: null,
      qrDataUrl: null,
      connectedPhone: null,
      connectedName: null,
      lastError: null,
      isInitializing: false,
      logs: [],
      incomingReplies: [],
      config: loadConfigFromDisk(),
    };
  }
  return globalThis.__tradeOracleWhatsAppState;
}

export function normalizePhoneToJid(phone: string): { digits: string; jid: string } | null {
  let digits = phone.replace(/[^0-9]/g, "");
  if (!digits) return null;
  // Remove leading 0 if entered as 098...
  if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  // If 10-digit Indian mobile number, prepend 91
  if (digits.length === 10) {
    digits = `91${digits}`;
  }
  if (digits.length < 8) return null;
  return { digits, jid: `${digits}@s.whatsapp.net` };
}

function extractPhoneFromJid(jid?: string | null): string | null {
  if (!jid) return null;
  const raw = jid.split(":")[0].split("@")[0];
  return raw ? `+${raw}` : null;
}

export function hasSavedSession(): boolean {
  try {
    return fs.existsSync(path.join(AUTH_DIR, "creds.json"));
  } catch {
    return false;
  }
}

export async function connectWhatsApp(forceFreshQr = false): Promise<{
  status: WhatsAppConnectionStatus;
  qrDataUrl: string | null;
  connectedPhone: string | null;
  connectedName: string | null;
  lastError: string | null;
}> {
  const state = getState();

  if (forceFreshQr) {
    await disconnectWhatsApp(true);
  }

  if (state.status === "connected" && state.sock) {
    return getWhatsAppStatusSnapshot();
  }

  if (state.isInitializing) {
    return getWhatsAppStatusSnapshot();
  }

  state.isInitializing = true;
  state.status = "connecting";
  state.lastError = null;

  try {
    if (!fs.existsSync(AUTH_DIR)) {
      fs.mkdirSync(AUTH_DIR, { recursive: true });
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks -- Baileys helper named with `use*` prefix, not a React hook
    const { state: authState, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
    let version: [number, number, number] | undefined;
    try {
      const latest = await fetchLatestBaileysVersion();
      version = latest.version;
    } catch {
      // fallback to default bundled version if offline
    }

    const sock = makeWASocket({
      ...(version ? { version } : {}),
      auth: authState,
      logger: pino({ level: "silent" }),
      browser: Browsers.ubuntu("TRUVX"),
      printQRInTerminal: false,
      markOnlineOnConnect: false,
      syncFullHistory: false,
    });

    state.sock = sock;

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        state.qrRaw = qr;
        try {
          state.qrDataUrl = await QRCode.toDataURL(qr, {
            width: 300,
            margin: 2,
            color: {
              dark: "#18280e",
              light: "#ffffff",
            },
          });
        } catch {
          state.qrDataUrl = null;
        }
        state.status = "qr_ready";
        state.isInitializing = false;
      }

      if (connection === "open") {
        state.status = "connected";
        state.qrRaw = null;
        state.qrDataUrl = null;
        state.isInitializing = false;
        state.lastError = null;
        state.connectedPhone = extractPhoneFromJid(sock.user?.id);
        state.connectedName = sock.user?.name || "TRUVX Linked Device";

        // Default blank recipient numbers to connected phone so user sees messages immediately during testing
        if (state.connectedPhone) {
          let changed = false;
          if (!state.config.recipientPhones.manufacturer) {
            state.config.recipientPhones.manufacturer = state.connectedPhone;
            changed = true;
          }
          if (!state.config.recipientPhones.buyer) {
            state.config.recipientPhones.buyer = state.connectedPhone;
            changed = true;
          }
          if (!state.config.recipientPhones.service) {
            state.config.recipientPhones.service = state.connectedPhone;
            changed = true;
          }
          if (changed) saveConfigToDisk(state.config);
        }
      }

      if (connection === "close") {
        state.isInitializing = false;
        const statusCode = (lastDisconnect?.error as { output?: { statusCode?: number } } | undefined)
          ?.output?.statusCode;

        if (statusCode === DisconnectReason.loggedOut) {
          state.status = "disconnected";
          state.sock = null;
          state.connectedPhone = null;
          state.connectedName = null;
          state.qrRaw = null;
          state.qrDataUrl = null;
          try {
            fs.rmSync(AUTH_DIR, { recursive: true, force: true });
          } catch {
            // ignore
          }
        } else if (
          statusCode === DisconnectReason.restartRequired ||
          statusCode === DisconnectReason.connectionClosed ||
          statusCode === DisconnectReason.connectionLost ||
          statusCode === DisconnectReason.timedOut
        ) {
          // WhatsApp requires an immediate socket restart (code 515) right after QR pairing!
          state.sock = null;
          state.status = "connecting";
          setTimeout(() => {
            void connectWhatsApp(false);
          }, 1200);
        } else {
          state.sock = null;
          state.status = "error";
          state.lastError =
            (lastDisconnect?.error as Error | undefined)?.message ||
            `WhatsApp connection closed (code ${statusCode ?? "unknown"})`;
        }
      }
    });

    // Listen for incoming WhatsApp replies (2-way automation!)
    sock.ev.on("messages.upsert", async ({ messages, type }) => {
      if (type !== "notify") return;
      for (const msg of messages) {
        if (!msg.message || msg.key.fromMe) continue;
        const remoteJid = msg.key.remoteJid;
        if (!remoteJid || remoteJid.endsWith("@g.us")) continue;

        const text =
          msg.message.conversation ||
          msg.message.extendedTextMessage?.text ||
          "";

        const trimmed = text.trim();
        if (!trimmed) continue;

        const upper = trimmed.toUpperCase();
        let autoReplyText: string | null = null;

        if (upper === "1" || upper === "ACCEPT" || upper === "CONFIRM") {
          autoReplyText =
            "✅ *Order Accepted on TRUVX!*\n\nThank you! We have confirmed your order acceptance and notified the buyer.\nYour 30% PayPal advance protection is active. TRUVX will send updates here as inspection & shipping progress.";
        } else if (upper === "STATUS" || upper === "HI" || upper === "HELLO" || upper === "HELP") {
          autoReplyText =
            "🟢 *TRUVX WhatsApp Assistant*\n\nYour account is connected to automated order & PayPal alerts.\n\nReply:\n• *1* to confirm latest pending order\n• *STATUS* to check active order escrow status";
        }

        state.incomingReplies.unshift({
          id: `wa_in_${Date.now()}`,
          timestamp: new Date().toISOString(),
          from: extractPhoneFromJid(remoteJid) || remoteJid,
          pushName: msg.pushName || "WhatsApp User",
          text: trimmed,
          autoReplied: Boolean(autoReplyText),
        });
        if (state.incomingReplies.length > 30) state.incomingReplies.pop();

        if (autoReplyText) {
          try {
            await sock.sendMessage(remoteJid, { text: autoReplyText });
          } catch {
            // ignore auto-reply failure
          }
        }
      }
    });
  } catch (err) {
    state.isInitializing = false;
    state.status = "error";
    state.lastError = (err as Error).message || "Failed to initialize WhatsApp socket";
  }

  return getWhatsAppStatusSnapshot();
}

export async function disconnectWhatsApp(clearAuth = true) {
  const state = getState();
  try {
    if (state.sock) {
      if (clearAuth) {
        try {
          await state.sock.logout();
        } catch {
          // ignore if already closed
        }
      }
      state.sock.end(undefined);
    }
  } catch {
    // ignore
  }
  state.sock = null;
  state.status = "disconnected";
  state.qrRaw = null;
  state.qrDataUrl = null;
  state.connectedPhone = null;
  state.connectedName = null;
  state.isInitializing = false;
  state.lastError = null;

  if (clearAuth) {
    try {
      fs.rmSync(AUTH_DIR, { recursive: true, force: true });
    } catch {
      // ignore
    }
  }
}

export function getWhatsAppStatusSnapshot() {
  const state = getState();
  return {
    status: state.status,
    qrDataUrl: state.qrDataUrl,
    connectedPhone: state.connectedPhone,
    connectedName: state.connectedName,
    lastError: state.lastError,
    hasSavedSession: hasSavedSession(),
    config: state.config,
    logs: state.logs.slice(0, 25),
    incomingReplies: state.incomingReplies.slice(0, 15),
  };
}

export function updateWhatsAppConfig(partial: Partial<WhatsAppConfig>): WhatsAppConfig {
  const state = getState();
  state.config = {
    autoNotifyOnEvents:
      typeof partial.autoNotifyOnEvents === "boolean"
        ? partial.autoNotifyOnEvents
        : state.config.autoNotifyOnEvents,
    zapierWebhookUrl:
      typeof partial.zapierWebhookUrl === "string"
        ? partial.zapierWebhookUrl.trim()
        : state.config.zapierWebhookUrl,
    recipientPhones: {
      manufacturer:
        partial.recipientPhones?.manufacturer ?? state.config.recipientPhones.manufacturer,
      buyer: partial.recipientPhones?.buyer ?? state.config.recipientPhones.buyer,
      service: partial.recipientPhones?.service ?? state.config.recipientPhones.service,
    },
  };
  saveConfigToDisk(state.config);
  return state.config;
}

export function formatPlainEnglishWhatsAppMessage(params: {
  role: TradeRole;
  eventType: TradeNotificationEventType;
  orderNumber: string;
  buyerName?: string;
  manufacturerName?: string;
  productName?: string;
  quantity?: number;
  amountUSD?: number;
  customText?: string;
}): string {
  const {
    role,
    eventType,
    orderNumber,
    buyerName = "Pacific Architectural Hardware LLC (USA)",
    manufacturerName = "Moradabad Precision Foundry LLP",
    productName = "Solid Brass Mortise Handles",
    quantity = 1500,
    amountUSD = 85750,
    customText,
  } = params;

  if (eventType === "custom" && customText) {
    return customText;
  }

  const inrLakhs = ((amountUSD * 83.5) / 100000).toFixed(2);
  const advanceUSD = Math.round(amountUSD * 0.3);
  const advanceLakhs = ((advanceUSD * 83.5) / 100000).toFixed(2);
  const balanceUSD = Math.round(amountUSD * 0.7);
  const balanceLakhs = ((balanceUSD * 83.5) / 100000).toFixed(2);

  if (role === "manufacturer") {
    switch (eventType) {
      case "new_order":
        return `🟢 *TRUVX — You Have Received a New Order!*\n\nNamaste ${manufacturerName},\n\nYou have received a confirmed export order *#${orderNumber}*:\n\n• *Buyer:* ${buyerName}\n• *Item:* ${quantity.toLocaleString()} units — ${productName}\n• *Total Order Value:* $${amountUSD.toLocaleString()} USD (approx ₹${inrLakhs} Lakhs)\n• *Advance Payment:* $${advanceUSD.toLocaleString()} USD (₹${advanceLakhs} Lakhs) goes into safe PayPal Escrow before you start.\n\n✅ *What to do next:*\nReply *1* here to accept this order, or open your TRUVX Manufacturer Dashboard.\n_No confusing customs paperwork needed — TRUVX handles bills and bank certificates automatically._`;

      case "rfq_published":
        return `📋 *New Buyer Request on TRUVX*\n\nA verified foreign buyer (${buyerName}) wants *${quantity.toLocaleString()} units* of *${productName}*.\n• Target Budget: $${amountUSD.toLocaleString()} USD (approx ₹${inrLakhs} Lakhs)\n\nOpen your Manufacturer Dashboard to submit your price quotation.`;

      case "paypal_escrow_locked":
        return `💰 *Advance Money Received in PayPal!*\n\nOrder: *#${orderNumber}*\nGood news! *${buyerName}* has paid the 30% advance deposit of *$${advanceUSD.toLocaleString()} USD (approx ₹${advanceLakhs} Lakhs)* into PayPal Escrow.\n\n🔒 Your payment is 100% safe. You can safely start raw material casting and production now.`;

      case "quality_inspection_passed":
        return `🔍 *Factory Quality Check Passed!*\n\nOrder: *#${orderNumber}*\nQuality inspector visited your workshop and verified *${productName}*.\n• Defect check: *PASSED ✓*\n• Packaging check: *PASSED ✓*\n\nYou can now dispatch the shipment to the port.`;

      case "shipment_dispatched":
        return `🚢 *Cargo Shipped & Final Balance Released!*\n\nOrder: *#${orderNumber}*\nContainer shipping bill verified at port.\nThe remaining 70% payment (*$${balanceUSD.toLocaleString()} USD / approx ₹${balanceLakhs} Lakhs*) is being deposited into your Indian bank account via PayPal.\n\nYour CA tax & export statement (e-FIRC) is ready in your dashboard.`;

      default:
        return `🟢 *TRUVX Update for #${orderNumber}*\n\n${productName} (${quantity} units) — Total Value: $${amountUSD.toLocaleString()} USD.`;
    }
  }

  if (role === "buyer") {
    switch (eventType) {
      case "new_order":
        return `📦 *TRUVX Order Created (#${orderNumber})*\n\nYour Purchase Order with *${manufacturerName}* is live.\n• *Product:* ${quantity.toLocaleString()} units — ${productName}\n• *Total Deal:* $${amountUSD.toLocaleString()} USD\n• *Next Step:* Fund 30% PayPal Escrow ($${advanceUSD.toLocaleString()} USD) so the factory begins production.`;

      case "rfq_published":
        return `📋 *RFQ #${orderNumber} Published to Verified Indian Suppliers*\n\nYour sourcing request for *${quantity.toLocaleString()} units of ${productName}* has been sent to vetted Indian manufacturers. You will receive quotes shortly.`;

      case "paypal_escrow_locked":
        return `🔒 *PayPal 30% Escrow Active (#${orderNumber})*\n\nYour $${advanceUSD.toLocaleString()} USD deposit is safely held in PayPal Escrow. *${manufacturerName}* has been notified to begin production.`;

      case "quality_inspection_passed":
        return `✅ *Pre-Shipment Quality Inspection Passed (#${orderNumber})*\n\nInspectors approved your batch of *${productName}* at *${manufacturerName}* with 0 critical defects. Photos and lab reports are ready in your Buyer Portal.`;

      case "shipment_dispatched":
        return `🚢 *Shipment Dispatched from India (#${orderNumber})*\n\nYour cargo has been cleared and loaded onto the vessel. Ocean Bill of Lading and tracking are live in your Foreign Buyer Portal.`;

      default:
        return `🌐 *TRUVX Buyer Alert (#${orderNumber})*\n\nOrder status updated for ${productName} with ${manufacturerName}.`;
    }
  }

  // Freelancer / Service Agency
  switch (eventType) {
    case "new_order":
    case "service_milestone_funded":
      return `💻 *TRUVX — New Client Milestone Funded!*\n\nOrder: *#${orderNumber}*\nYour international client (*${buyerName}*) has funded *$${amountUSD.toLocaleString()} USD (approx ₹${inrLakhs} Lakhs)* into PayPal Escrow for *${productName}*.\n\n🔒 Funds are secured. You can start engineering work safely!`;

    case "service_delivery_submitted":
      return `🚀 *Deliverable Proof Logged (#${orderNumber})*\n\nYour GitHub PR, staging link, and Loom walkthrough have been verified and recorded onto the transaction ledger for client approval.`;

    case "service_payout_released":
    case "paypal_escrow_locked":
      return `🎉 *PayPal Milestone Payout Released!*\n\nOrder: *#${orderNumber}*\n*$${amountUSD.toLocaleString()} USD (approx ₹${inrLakhs} Lakhs)* has been released to your Indian bank account, with automated service export compliance recorded.`;

    default:
      return `💻 *TRUVX Service Update (#${orderNumber})*\n\nProject milestone update for ${productName} ($${amountUSD.toLocaleString()} USD).`;
  }
}

/**
 * Sends a REAL WhatsApp message via the linked WhatsApp WebSocket (Baileys).
 * Auto-reconnects silently if saved session exists on disk.
 */
export async function sendRealWhatsAppMessage(params: {
  toPhone?: string;
  role: TradeRole;
  eventType: TradeNotificationEventType;
  orderNumber: string;
  buyerName?: string;
  manufacturerName?: string;
  productName?: string;
  quantity?: number;
  amountUSD?: number;
  customText?: string;
}): Promise<WhatsAppDispatchLog> {
  const state = getState();

  // If saved auth session exists on disk but socket isn't connected yet, try connecting once
  if (state.status !== "connected" && hasSavedSession() && !state.isInitializing) {
    await connectWhatsApp(false);
    // Give socket up to 2.5s to open if credentials are already paired
    for (let i = 0; i < 10; i++) {
      if (getState().status === "connected") break;
      await new Promise((r) => setTimeout(r, 250));
    }
  }

  const targetPhone =
    params.toPhone?.trim() ||
    state.config.recipientPhones[params.role]?.trim() ||
    state.connectedPhone ||
    "";

  const text = formatPlainEnglishWhatsAppMessage(params);
  const normalized = normalizePhoneToJid(targetPhone);
  const zapierUrl =
    state.config.zapierWebhookUrl?.trim() ||
    process.env.ZAPIER_TRADE_WEBHOOK_URL?.trim() ||
    "";

  const logEntry: WhatsAppDispatchLog = {
    id: `wa_msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    to: targetPhone || "No phone number configured",
    jid: normalized?.jid || "",
    role: params.role,
    eventType: params.eventType,
    orderNumber: params.orderNumber,
    text,
    status: "failed",
    deliveryChannel: "none",
    zapierStatus: zapierUrl ? "failed" : "not_configured",
  };

  let sentViaZapier = false;
  if (zapierUrl) {
    try {
      const amountUSD = params.amountUSD ?? 85750;
      const zRes = await fetch(zapierUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: logEntry.id,
          timestamp: logEntry.timestamp,
          source: "TRUVX Cross-Border Platform",
          channel: "whatsapp",
          eventType: params.eventType,
          role: params.role,
          orderNumber: params.orderNumber,
          recipientPhone: targetPhone,
          plainEnglishMessage: text,
          buyerName: params.buyerName || "Pacific Architectural Hardware LLC",
          manufacturerName: params.manufacturerName || "Moradabad Precision Foundry LLP",
          productName: params.productName || "Solid Brass Mortise Handles",
          quantity: params.quantity || 1500,
          amountUSD,
          amountINRLakhs: Number(((amountUSD * 83.5) / 100000).toFixed(2)),
        }),
      });
      if (zRes.ok) {
        sentViaZapier = true;
        logEntry.zapierStatus = "dispatched";
      } else {
        logEntry.zapierStatus = "failed";
      }
    } catch {
      logEntry.zapierStatus = "failed";
    }
  }

  let sentViaQr = false;
  if (state.status === "connected" && state.sock && normalized) {
    try {
      let targetJid = normalized.jid;
      try {
        const results = await state.sock.onWhatsApp(normalized.digits);
        if (results && results.length > 0 && results[0]?.jid) {
          targetJid = results[0].jid;
        }
      } catch {
        // proceed with standard JID
      }

      const sent = await state.sock.sendMessage(targetJid, { text });
      sentViaQr = true;
      logEntry.jid = targetJid;
      logEntry.messageId = sent?.key?.id || undefined;
    } catch (err) {
      logEntry.error = (err as Error).message || "Failed to send via linked WhatsApp device";
    }
  }

  if (sentViaQr && sentViaZapier) {
    logEntry.status = "sent";
    logEntry.deliveryChannel = "both";
    logEntry.error = undefined;
  } else if (sentViaQr) {
    logEntry.status = "sent";
    logEntry.deliveryChannel = "whatsapp_qr";
    logEntry.error = undefined;
  } else if (sentViaZapier) {
    logEntry.status = "sent";
    logEntry.deliveryChannel = "zapier_webhook";
    logEntry.error = undefined;
  } else {
    logEntry.status = state.status === "connected" ? "failed" : "skipped_not_connected";
    if (!logEntry.error) {
      logEntry.error = !normalized && state.status === "connected"
        ? "Invalid recipient mobile number. Include country code (e.g. +91 9820012345)."
        : "Link WhatsApp via QR code or add a Zapier Webhook URL to dispatch automated messages.";
    }
  }

  state.logs.unshift(logEntry);
  if (state.logs.length > 50) state.logs.pop();
  return logEntry;
}

