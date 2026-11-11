"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  MessageSquare,
  CheckCheck,
  Send,
  Sparkles,
  X,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  QrCode,
  RefreshCw,
  Power,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Radio,
  Zap,
  Copy,
  Check,
} from "lucide-react";

type ConnectionStatus =
  | "disconnected"
  | "connecting"
  | "qr_ready"
  | "connected"
  | "error";

type StageKey =
  | "new_order"
  | "paypal_escrow_locked"
  | "quality_inspection_passed"
  | "shipment_dispatched";

interface DispatchLogItem {
  id: string;
  timestamp: string;
  to: string;
  role: string;
  eventType: string;
  orderNumber: string;
  text: string;
  status: "sent" | "failed" | "skipped_not_connected";
  deliveryChannel?: "whatsapp_qr" | "zapier_webhook" | "both" | "none";
  zapierStatus?: "dispatched" | "not_configured" | "failed";
  messageId?: string;
  error?: string;
}

interface IncomingReplyItem {
  id: string;
  timestamp: string;
  from: string;
  pushName: string;
  text: string;
  autoReplied: boolean;
}

interface WhatsAppNotificationCenterProps {
  role: "manufacturer" | "buyer" | "service";
  recipientPhone?: string;
  recipientName?: string;
  orderNumber?: string;
  compact?: boolean;
}

export function WhatsAppNotificationCenter({
  role = "manufacturer",
  recipientPhone = "",
  recipientName = "Moradabad Precision Foundry LLP",
  orderNumber = "ORD-USA-9921",
  compact = false,
}: WhatsAppNotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [channelMode, setChannelMode] = useState<"qr" | "zapier">("qr");
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [connectedPhone, setConnectedPhone] = useState<string | null>(null);
  const [connectedName, setConnectedName] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [autoNotify, setAutoNotify] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState(recipientPhone);
  const [zapierWebhookUrl, setZapierWebhookUrl] = useState("");
  const [savedToastMsg, setSavedToastMsg] = useState<string | null>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const [activeTab, setActiveTab] = useState<StageKey>("new_order");
  const [logs, setLogs] = useState<DispatchLogItem[]>([]);
  const [incomingReplies, setIncomingReplies] = useState<IncomingReplyItem[]>([]);

  const [connecting, setConnecting] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendFeedback, setSendFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/whatsapp/connect", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setStatus(data.status);
        setQrDataUrl(data.qrDataUrl || null);
        setConnectedPhone(data.connectedPhone || null);
        setConnectedName(data.connectedName || null);
        setLastError(data.lastError || null);
        setLogs(data.logs || []);
        setIncomingReplies(data.incomingReplies || []);
        if (data.config) {
          setAutoNotify(Boolean(data.config.autoNotifyOnEvents));
          if (data.config.zapierWebhookUrl && !zapierWebhookUrl) {
            setZapierWebhookUrl(data.config.zapierWebhookUrl);
          }
          const savedForRole = data.config.recipientPhones?.[role];
          if (savedForRole && !phoneNumber) {
            setPhoneNumber(savedForRole);
          } else if (!phoneNumber && data.connectedPhone) {
            setPhoneNumber(data.connectedPhone);
          }
        }
      }
    } catch {
      // ignore poll error
    }
  }, [role, phoneNumber, zapierWebhookUrl]);

  useEffect(() => {
    void fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(
      () => {
        void fetchStatus();
      },
      status === "qr_ready" || status === "connecting" ? 2000 : 5000
    );
    return () => clearInterval(interval);
  }, [isOpen, status, fetchStatus]);

  const handleStartLink = async (freshQr = false) => {
    setConnecting(true);
    setSendFeedback(null);
    setLastError(null);
    try {
      const res = await fetch("/api/whatsapp/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: freshQr ? "fresh_qr" : "connect" }),
      });
      const data = await res.json();
      if (data.status) setStatus(data.status);
      if (data.qrDataUrl) setQrDataUrl(data.qrDataUrl);
      if (data.connectedPhone) setConnectedPhone(data.connectedPhone);
      if (data.connectedName) setConnectedName(data.connectedName);
      if (data.lastError) setLastError(data.lastError);
    } catch (err) {
      setLastError((err as Error).message || "Failed to connect");
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setConnecting(true);
    try {
      const res = await fetch("/api/whatsapp/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disconnect" }),
      });
      const data = await res.json();
      setStatus(data.status || "disconnected");
      setQrDataUrl(null);
      setConnectedPhone(null);
      setConnectedName(null);
    } finally {
      setConnecting(false);
    }
  };

  const handleSaveConfig = async (
    nextPhone: string,
    nextAuto: boolean,
    nextZapierUrl: string
  ) => {
    try {
      const res = await fetch("/api/whatsapp/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          autoNotifyOnEvents: nextAuto,
          zapierWebhookUrl: nextZapierUrl,
          recipientPhones: { [role]: nextPhone },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedToastMsg("Saved");
        setTimeout(() => setSavedToastMsg(null), 2200);
      }
    } catch {
      // ignore
    }
  };

  const handleSendRealMessage = async () => {
    setSending(true);
    setSendFeedback(null);
    try {
      await handleSaveConfig(phoneNumber.trim(), autoNotify, zapierWebhookUrl.trim());
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toPhone: phoneNumber.trim() || connectedPhone,
          role,
          eventType: activeTab,
          orderNumber,
          manufacturerName: recipientName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const channelText =
          data.log?.deliveryChannel === "both"
            ? "WhatsApp Device + Zapier Webhook"
            : data.log?.deliveryChannel === "zapier_webhook"
            ? "Zapier Catch Hook"
            : "Linked WhatsApp Device";
        setSendFeedback({
          type: "success",
          text: `Automated message dispatched via ${channelText} to ${
            data.log?.to || phoneNumber || "Zapier"
          }.`,
        });
      } else {
        setSendFeedback({
          type: "error",
          text: data.log?.error || data.error || "Could not dispatch automated message.",
        });
      }
      await fetchStatus();
    } catch (err) {
      setSendFeedback({
        type: "error",
        text: (err as Error).message || "Network error sending message",
      });
    } finally {
      setSending(false);
    }
  };

  const getPreviewMessage = () => {
    if (role === "manufacturer") {
      return {
        new_order: {
          title: "New Export Order Received",
          body: `TradeOracle — You Have Received a New Order!\n\nNamaste ${recipientName},\n\nConfirmed export order #${orderNumber}:\n• Buyer: Pacific Architectural Hardware LLC (USA)\n• Item: 1,500 units — Solid Brass Mortise Handles\n• Total Value: $85,750 USD (approx ₹71.60 Lakhs)\n• Advance Payment: $25,725 USD (₹21.48 Lakhs) is locked safely in PayPal Escrow before you start.\n\nReply 1 here to accept this order, or open your TradeOracle Manufacturer Dashboard.`,
        },
        paypal_escrow_locked: {
          title: "Advance Money Received in PayPal",
          body: `Advance Money Received in PayPal!\n\nOrder: #${orderNumber}\nPacific Architectural Hardware LLC has deposited 30% ($25,725 USD / approx ₹21.48 Lakhs) into PayPal Escrow.\n\nYour payment is protected. You can safely start casting and production now.`,
        },
        quality_inspection_passed: {
          title: "Factory Quality Check Passed",
          body: `Factory Quality Check Passed!\n\nOrder: #${orderNumber}\nQuality inspector verified your batch of Solid Brass Mortise Handles.\n• Defect check: PASSED\n• Packaging check: PASSED\n\nYou can now dispatch the shipment to Mundra Port.`,
        },
        shipment_dispatched: {
          title: "Cargo Shipped & Final Balance Released",
          body: `Cargo Shipped & Final Balance Released!\n\nOrder: #${orderNumber}\nShipping bill verified at port. The remaining 70% ($60,025 USD / approx ₹50.12 Lakhs) is being credited to your bank account via PayPal.`,
        },
      }[activeTab];
    }

    if (role === "buyer") {
      return {
        new_order: {
          title: "Order Created in India",
          body: `TradeOracle Order Created (#${orderNumber})\n\nYour Purchase Order with Moradabad Precision Foundry is live.\n• Product: 1,500 units — Solid Brass Mortise Handles\n• Total Deal: $85,750 USD\n• Next Step: Fund 30% PayPal Escrow ($25,725 USD) to initiate production.`,
        },
        paypal_escrow_locked: {
          title: "PayPal 30% Escrow Active",
          body: `PayPal 30% Escrow Active (#${orderNumber})\n\nYour $25,725 USD deposit is held safely in PayPal Escrow. The factory has been notified to start manufacturing.`,
        },
        quality_inspection_passed: {
          title: "Pre-Shipment Inspection Passed",
          body: `Pre-Shipment Quality Inspection Passed (#${orderNumber})\n\nInspectors approved your batch at Moradabad Precision Foundry with 0 critical defects. Inspection photos are live in your Buyer Portal.`,
        },
        shipment_dispatched: {
          title: "Shipment Dispatched from India",
          body: `Shipment Dispatched from India (#${orderNumber})\n\nYour cargo has been cleared and loaded onto the vessel. Ocean Bill of Lading and tracking are live in your Buyer Portal.`,
        },
      }[activeTab];
    }

    return {
      new_order: {
        title: "New Client Milestone Funded",
        body: `TradeOracle — New Client Milestone Funded!\n\nOrder: #${orderNumber}\nYour client has funded $2,500 USD (approx ₹2.09 Lakhs) into PayPal Escrow. Funds are protected so you can start engineering work safely.`,
      },
      paypal_escrow_locked: {
        title: "PayPal Milestone Payout Released",
        body: `PayPal Milestone Payout Released!\n\nOrder: #${orderNumber}\n$2,500 USD (approx ₹2.09 Lakhs) has been released to your Indian bank account.`,
      },
      quality_inspection_passed: {
        title: "Deliverable Proof Logged",
        body: `Deliverable Proof Logged (#${orderNumber})\n\nYour GitHub PR, staging link, and walkthrough video have been verified and attached to the order ledger.`,
      },
      shipment_dispatched: {
        title: "Final Service Settlement Completed",
        body: `PayPal Final Milestone Released (#${orderNumber})\n\nClient approved deliverables and final payout has been cleared to your bank with automated compliance.`,
      },
    }[activeTab];
  };

  const currentMsg = getPreviewMessage();
  const isConnected = status === "connected";
  const hasZapier = Boolean(zapierWebhookUrl.trim());
  const isAnyAutomationReady = isConnected || hasZapier;

  const sampleZapierPayload = JSON.stringify(
    {
      eventType: activeTab,
      orderNumber,
      role,
      recipientPhone: phoneNumber || "+919820012345",
      plainEnglishMessage: currentMsg.body,
      amountUSD: 85750,
      amountINRLakhs: 71.6,
    },
    null,
    2
  );

  return (
    <>
      {/* Trigger Button — Strictly aligned & themed with TradeOracle Spade Palette + Geist Sans */}
      {compact ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`inline-flex items-center gap-2 h-9 px-3.5 rounded-lg text-xs font-sans font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer border ${
            isAnyAutomationReady
              ? "bg-[#ebf7d9] hover:bg-[#b2eb76]/50 text-[#18280e] border-[#b2eb76]"
              : "bg-[#f4faed] hover:bg-[#ebf7d9] text-[#18280e] border-[#d8e5ca]"
          }`}
          title="Configure automated WhatsApp & Zapier order alerts"
        >
          <span
            className={`size-2 rounded-full shrink-0 ${
              isAnyAutomationReady ? "bg-[#3f7308] animate-pulse" : "bg-[#18280e]/40"
            }`}
          />
          <span>
            {isConnected
              ? "WhatsApp Live"
              : hasZapier
              ? "Zapier Auto On"
              : "WhatsApp Alerts"}
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-[#f4faed] hover:bg-[#ebf7d9] border border-[#d8e5ca] text-[#18280e] transition-all cursor-pointer group shadow-2xs font-sans"
        >
          <div className="flex items-center gap-2.5 text-left min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#18280e] text-[#b2eb76] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#18280e] flex items-center gap-1.5 whitespace-nowrap">
                <span>
                  {isConnected
                    ? "WhatsApp Live"
                    : hasZapier
                    ? "Zapier WhatsApp Active"
                    : "WhatsApp Automation"}
                </span>
                <span
                  className={`size-1.5 rounded-full shrink-0 ${
                    isAnyAutomationReady ? "bg-[#3f7308] animate-ping" : "bg-stone-400"
                  }`}
                />
              </div>
              <p className="text-[11px] text-stone-600 truncate">
                {isConnected
                  ? `Linked: ${connectedPhone}`
                  : hasZapier
                  ? "Zapier Catch Hook Ready"
                  : "QR Link or Zapier Hook"}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#3f7308] shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* Automation Modal — 100% TradeOracle Forest Green / Sage / Geist Sans Theme */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#18280e]/50 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#d8e5ca] flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-[#18280e] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#b2eb76] text-[#18280e] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-sm sm:text-base tracking-tight font-sans">
                      TradeOracle WhatsApp Automation
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#b2eb76] text-[#18280e]">
                      {isConnected
                        ? "QR LINKED"
                        : hasZapier
                        ? "ZAPIER HOOK"
                        : "READY TO CONNECT"}
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 mt-0.5 font-sans">
                    Automatically send plain-English order &amp; PayPal escrow updates straight to WhatsApp.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Channel Switcher Bar */}
            <div className="bg-[#f4faed] px-5 py-2.5 border-b border-[#d8e5ca] flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex rounded-lg bg-white p-1 border border-[#d8e5ca]">
                <button
                  type="button"
                  onClick={() => setChannelMode("qr")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-sans font-semibold transition-all cursor-pointer ${
                    channelMode === "qr"
                      ? "bg-[#18280e] text-[#b2eb76]"
                      : "text-stone-600 hover:text-[#18280e]"
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Direct QR Link (Zero Setup)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChannelMode("zapier")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-sans font-semibold transition-all cursor-pointer ${
                    channelMode === "zapier"
                      ? "bg-[#18280e] text-[#b2eb76]"
                      : "text-stone-600 hover:text-[#18280e]"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Zapier Catch Hook Automation</span>
                </button>
              </div>

              <label className="flex items-center gap-2 text-xs font-sans font-medium text-[#18280e] cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoNotify}
                  onChange={(e) => {
                    setAutoNotify(e.target.checked);
                    void handleSaveConfig(phoneNumber, e.target.checked, zapierWebhookUrl);
                  }}
                  className="accent-[#18280e] w-3.5 h-3.5"
                />
                <span>Auto-send on orders &amp; PayPal events</span>
              </label>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#fbfdf9]">
              {/* CHANNEL 1: DIRECT QR LINK */}
              {channelMode === "qr" && (
                <div className="bg-white rounded-2xl border border-[#d8e5ca] p-5 shadow-2xs">
                  {isConnected ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-[#ebf7d9] text-[#3f7308] flex items-center justify-center shrink-0">
                          <Radio className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#18280e] flex items-center gap-1.5">
                            <span>WhatsApp Device Connected</span>
                            <CheckCircle2 className="w-4 h-4 text-[#3f7308]" />
                          </div>
                          <p className="text-xs text-stone-600 mt-0.5">
                            Active number: <strong className="font-mono text-[#18280e]">{connectedPhone}</strong> ({connectedName})
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleDisconnect}
                        disabled={connecting}
                        className="px-3.5 py-2 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-sans font-semibold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>Unlink Device</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="space-y-2.5 flex-1">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase text-[#3f7308] bg-[#ebf7d9] px-2.5 py-1 rounded-full">
                          <QrCode className="w-3.5 h-3.5" />
                          <span>No API Keys or External Tools Required</span>
                        </span>
                        <h4 className="text-base font-bold text-[#18280e]">
                          Scan QR once to send automated messages directly to WhatsApp
                        </h4>
                        <ol className="text-xs text-stone-600 space-y-1.5 list-decimal list-inside leading-relaxed">
                          <li>Click <strong>Generate QR Code</strong> on the right.</li>
                          <li>Open <strong>WhatsApp</strong> on your phone → <strong>Linked Devices</strong> → <strong>Link a Device</strong>.</li>
                          <li>Scan the QR code. Every new order and PayPal deposit will then push automatically to WhatsApp.</li>
                        </ol>

                        {lastError && (
                          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{lastError}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-center justify-center shrink-0 bg-[#f4faed] border border-[#d8e5ca] rounded-2xl p-4 min-w-[210px]">
                        {status === "qr_ready" && qrDataUrl ? (
                          <div className="space-y-2 text-center">
                            <img
                              src={qrDataUrl}
                              alt="WhatsApp Link QR Code"
                              className="w-40 h-40 rounded-xl border border-[#d8e5ca] bg-white mx-auto"
                            />
                            <button
                              type="button"
                              onClick={() => handleStartLink(true)}
                              className="text-xs font-sans font-semibold text-[#3f7308] hover:underline inline-flex items-center gap-1 cursor-pointer"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Refresh QR Code</span>
                            </button>
                          </div>
                        ) : status === "connecting" || connecting ? (
                          <div className="py-8 text-center space-y-2">
                            <Loader2 className="w-7 h-7 animate-spin text-[#18280e] mx-auto" />
                            <span className="text-xs text-stone-600 block">
                              Generating pairing QR...
                            </span>
                          </div>
                        ) : (
                          <div className="py-4 text-center space-y-3">
                            <QrCode className="w-11 h-11 text-[#18280e]/30 mx-auto" />
                            <button
                              type="button"
                              onClick={() => handleStartLink(false)}
                              className="px-4 py-2 rounded-xl bg-[#18280e] hover:bg-[#284905] text-[#b2eb76] font-sans text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-2"
                            >
                              <QrCode className="w-4 h-4" />
                              <span>Generate QR Code</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CHANNEL 2: ZAPIER CATCH HOOK AUTOMATION */}
              {channelMode === "zapier" && (
                <div className="bg-white rounded-2xl border border-[#d8e5ca] p-5 space-y-4 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase text-[#3f7308] bg-[#ebf7d9] px-2.5 py-0.5 rounded-full mb-1.5">
                        <Zap className="w-3 h-3" />
                        <span>Zapier Trade Automation Connected</span>
                      </span>
                      <h4 className="text-sm font-bold text-[#18280e]">
                        Send Orders &amp; PayPal Milestones via Zapier Webhook → WhatsApp
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#18280e] block">
                      Zapier Catch Hook URL (Triggers automatically on New Order, RFQ &amp; PayPal Escrow)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={zapierWebhookUrl}
                        onChange={(e) => setZapierWebhookUrl(e.target.value)}
                        placeholder="https://hooks.zapier.com/hooks/catch/..."
                        className="flex-1 bg-[#f4faed] border border-[#d8e5ca] rounded-xl px-3.5 py-2 text-xs font-mono text-[#18280e] focus:outline-none focus:border-[#3f7308]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleSaveConfig(phoneNumber, autoNotify, zapierWebhookUrl)
                        }
                        className="px-4 py-2 rounded-xl bg-[#18280e] hover:bg-[#284905] text-[#b2eb76] text-xs font-sans font-semibold cursor-pointer shrink-0"
                      >
                        {savedToastMsg || "Save Hook"}
                      </button>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      In Zapier: Create a Zap → Trigger: <strong>Webhooks by Zapier (Catch Hook)</strong> → Action: <strong>WhatsApp Notifications / Twilio</strong> mapped to <code className="text-[#18280e] font-semibold">recipientPhone</code> &amp; <code className="text-[#18280e] font-semibold">plainEnglishMessage</code>.
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#f4faed] border border-[#d8e5ca] p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#3f7308]">
                        Outgoing Zapier JSON Payload Preview
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(sampleZapierPayload);
                          setCopiedPayload(true);
                          setTimeout(() => setCopiedPayload(false), 1800);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#18280e] hover:underline cursor-pointer"
                      >
                        {copiedPayload ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedPayload ? "Copied" : "Copy JSON"}</span>
                      </button>
                    </div>
                    <pre className="text-[10px] font-mono text-stone-700 overflow-x-auto leading-relaxed">
                      {sampleZapierPayload}
                    </pre>
                  </div>
                </div>
              )}

              {/* RECIPIENT PHONE & PLAIN-ENGLISH MESSAGE DISPATCH */}
              <div className="bg-white rounded-2xl border border-[#d8e5ca] p-5 space-y-4 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-sm font-bold text-[#18280e] block">
                      Recipient Mobile Number ({role === "manufacturer" ? "Factory" : role === "buyer" ? "Buyer" : "Freelancer"})
                    </span>
                    <span className="text-xs text-stone-500">
                      Plain-English order alerts automatically go to this phone number.
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-[#f4faed] px-3 py-2 rounded-xl border border-[#d8e5ca]">
                      <Smartphone className="w-4 h-4 text-[#3f7308] shrink-0" />
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 98XXXXXXXX"
                        className="font-mono text-xs text-[#18280e] font-bold bg-transparent focus:outline-none w-36"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleSaveConfig(phoneNumber, autoNotify, zapierWebhookUrl)
                      }
                      className="px-3.5 py-2 rounded-xl bg-[#ebf7d9] hover:bg-[#b2eb76] text-[#18280e] border border-[#d8e5ca] text-xs font-sans font-semibold cursor-pointer"
                    >
                      {savedToastMsg || "Save"}
                    </button>
                  </div>
                </div>

                {/* Stage Template Tabs */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "new_order" as StageKey, label: "1. New Order Received" },
                    { key: "paypal_escrow_locked" as StageKey, label: "2. Advance in PayPal" },
                    { key: "quality_inspection_passed" as StageKey, label: "3. Quality Passed" },
                    { key: "shipment_dispatched" as StageKey, label: "4. Shipped & Payout" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold transition-colors cursor-pointer ${
                        activeTab === tab.key
                          ? "bg-[#18280e] text-[#b2eb76]"
                          : "bg-[#f4faed] text-stone-700 border border-[#d8e5ca]/70 hover:bg-[#ebf7d9]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Preview Card in TradeOracle Sage Palette */}
                <div className="bg-[#f4faed] rounded-xl p-4 border border-[#d8e5ca]">
                  <div className="bg-white rounded-xl p-4 border border-[#d8e5ca]/80 space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <span className="font-bold text-[#18280e] flex items-center gap-1.5 text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-[#3f7308]" />
                        <span>{currentMsg.title}</span>
                      </span>
                      <span className="text-[10px] font-mono text-[#3f7308] bg-[#ebf7d9] px-2 py-0.5 rounded-full font-bold">
                        Plain English
                      </span>
                    </div>
                    <div className="text-xs text-stone-700 leading-relaxed whitespace-pre-line font-sans">
                      {currentMsg.body}
                    </div>
                    <div className="pt-1 flex justify-end items-center gap-1 text-[#3f7308]">
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-sans font-semibold">
                        Automated TradeOracle Alert
                      </span>
                    </div>
                  </div>
                </div>

                {sendFeedback && (
                  <div
                    className={`p-3 rounded-xl text-xs font-sans flex items-center gap-2 ${
                      sendFeedback.type === "success"
                        ? "bg-[#ebf7d9] border border-[#b2eb76] text-[#18280e]"
                        : "bg-rose-50 border border-rose-200 text-rose-900"
                    }`}
                  >
                    {sendFeedback.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-[#3f7308] shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{sendFeedback.text}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                  <span className="text-xs text-stone-500">
                    Orders &amp; PayPal escrow payments trigger this alert automatically.
                  </span>
                  <button
                    type="button"
                    onClick={handleSendRealMessage}
                    disabled={sending || !isAnyAutomationReady}
                    className={`px-4 py-2.5 rounded-xl font-sans text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs whitespace-nowrap ${
                      isAnyAutomationReady
                        ? "bg-[#18280e] hover:bg-[#284905] text-[#b2eb76] cursor-pointer"
                        : "bg-stone-200 text-stone-500 cursor-not-allowed"
                    }`}
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {sending
                        ? "Dispatching Alert..."
                        : isAnyAutomationReady
                        ? "Send Automated Alert Now"
                        : "Link QR or Add Zapier Hook Above"}
                    </span>
                  </button>
                </div>
              </div>

              {/* DISPATCH HISTORY & 2-WAY REPLIES */}
              {(logs.length > 0 || incomingReplies.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl border border-[#d8e5ca] p-4 space-y-2.5">
                    <span className="text-[11px] font-mono font-bold uppercase text-[#3f7308] block">
                      Server Dispatch History ({logs.length})
                    </span>
                    <div className="space-y-2 max-h-36 overflow-y-auto">
                      {logs.slice(0, 6).map((item) => (
                        <div
                          key={item.id}
                          className="p-2.5 rounded-xl bg-[#f4faed] border border-[#d8e5ca]/70 text-xs flex justify-between items-start gap-2"
                        >
                          <div className="min-w-0">
                            <span className="font-bold text-[#18280e] block truncate">
                              {item.orderNumber} → {item.to}
                            </span>
                            <span className="text-[11px] text-stone-500 block truncate">
                              {item.eventType} {item.deliveryChannel ? `(${item.deliveryChannel})` : ""}
                            </span>
                            {item.error && (
                              <span className="text-[11px] text-rose-600 block">{item.error}</span>
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shrink-0 ${
                              item.status === "sent"
                                ? "bg-[#b2eb76] text-[#18280e]"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {item.status === "sent" ? "SENT" : "SKIPPED"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-[#d8e5ca] p-4 space-y-2.5">
                    <span className="text-[11px] font-mono font-bold uppercase text-[#3f7308] block">
                      2-Way WhatsApp Replies ({incomingReplies.length})
                    </span>
                    {incomingReplies.length === 0 ? (
                      <p className="text-xs text-stone-400 py-4 text-center">
                        Reply &quot;1&quot; or &quot;STATUS&quot; on WhatsApp to test 2-way order automation.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-36 overflow-y-auto">
                        {incomingReplies.slice(0, 6).map((rep) => (
                          <div
                            key={rep.id}
                            className="p-2.5 rounded-xl bg-[#ebf7d9] border border-[#b2eb76] text-xs"
                          >
                            <div className="flex justify-between font-bold text-[#18280e]">
                              <span>
                                {rep.pushName} ({rep.from})
                              </span>
                              <span className="text-[#3f7308]">
                                {rep.autoReplied ? "Auto-replied ✓" : "Received"}
                              </span>
                            </div>
                            <span className="text-stone-700 block mt-0.5">&quot;{rep.text}&quot;</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
