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
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [connectedPhone, setConnectedPhone] = useState<string | null>(null);
  const [connectedName, setConnectedName] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [autoNotify, setAutoNotify] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState(recipientPhone);
  const [phoneSavedMsg, setPhoneSavedMsg] = useState<string | null>(null);

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
  }, [role, phoneNumber]);

  // Fetch initial status once on mount
  useEffect(() => {
    void fetchStatus();
  }, [fetchStatus]);

  // Poll rapidly while modal is open and connecting / waiting for QR scan
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

  const handleSaveConfig = async (nextPhone: string, nextAuto: boolean) => {
    try {
      const res = await fetch("/api/whatsapp/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          autoNotifyOnEvents: nextAuto,
          recipientPhones: { [role]: nextPhone },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPhoneSavedMsg("Saved!");
        setTimeout(() => setPhoneSavedMsg(null), 2500);
      }
    } catch {
      // ignore
    }
  };

  const handleSendRealMessage = async () => {
    setSending(true);
    setSendFeedback(null);
    try {
      // Save target phone first if entered
      if (phoneNumber.trim()) {
        await handleSaveConfig(phoneNumber.trim(), autoNotify);
      }
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
        setSendFeedback({
          type: "success",
          text: `Real WhatsApp message delivered to ${data.log?.to || phoneNumber}! Check WhatsApp on your phone.`,
        });
      } else {
        setSendFeedback({
          type: "error",
          text: data.log?.error || data.error || "Could not deliver WhatsApp message.",
        });
      }
      await fetchStatus();
    } catch (err) {
      setSendFeedback({
        type: "error",
        text: (err as Error).message || "Network error sending WhatsApp message",
      });
    } finally {
      setSending(false);
    }
  };

  // Preview text matching the backend formatter
  const getPreviewMessage = () => {
    if (role === "manufacturer") {
      return {
        new_order: {
          title: "📦 New Export Order Received!",
          body: `🟢 *TradeOracle — You Have Received a New Order!*\n\nNamaste ${recipientName},\n\nYou have received a confirmed export order *#${orderNumber}*:\n\n• *Buyer:* Pacific Architectural Hardware LLC (USA)\n• *Item:* 1,500 units — Solid Brass Mortise Handles\n• *Total Order Value:* $85,750 USD (approx ₹71.60 Lakhs)\n• *Advance Payment:* $25,725 USD (₹21.48 Lakhs) goes into safe PayPal Escrow before you start.\n\n✅ *What to do next:*\nReply *1* here to accept this order, or open your TradeOracle Manufacturer Dashboard.`,
        },
        paypal_escrow_locked: {
          title: "💰 Advance Money Received in PayPal!",
          body: `💰 *Advance Money Received in PayPal!*\n\nOrder: *#${orderNumber}*\nGood news! *Pacific Architectural Hardware LLC* has paid the 30% advance deposit of *$25,725 USD (approx ₹21.48 Lakhs)* into PayPal Escrow.\n\n🔒 Your payment is 100% safe. You can safely start raw material casting and production now.`,
        },
        quality_inspection_passed: {
          title: "🔍 Factory Quality Check Passed!",
          body: `🔍 *Factory Quality Check Passed!*\n\nOrder: *#${orderNumber}*\nQuality inspector visited your workshop and verified *Solid Brass Mortise Handles*.\n• Defect check: *PASSED ✓*\n• Packaging check: *PASSED ✓*\n\nYou can now dispatch the shipment to the port.`,
        },
        shipment_dispatched: {
          title: "🚢 Cargo Shipped & Final Balance Released!",
          body: `🚢 *Cargo Shipped & Final Balance Released!*\n\nOrder: *#${orderNumber}*\nContainer shipping bill verified at port.\nThe remaining 70% payment (*$60,025 USD / approx ₹50.12 Lakhs*) is being deposited into your Indian bank account via PayPal.`,
        },
      }[activeTab];
    }

    if (role === "buyer") {
      return {
        new_order: {
          title: "📦 Order Created in India",
          body: `📦 *TradeOracle Order Created (#${orderNumber})*\n\nYour Purchase Order with *Moradabad Precision Foundry* is live.\n• *Product:* 1,500 units — Solid Brass Mortise Handles\n• *Total Deal:* $85,750 USD\n• *Next Step:* Fund 30% PayPal Escrow ($25,725 USD) so the factory begins production.`,
        },
        paypal_escrow_locked: {
          title: "🔒 PayPal 30% Escrow Active",
          body: `🔒 *PayPal 30% Escrow Active (#${orderNumber})*\n\nYour $25,725 USD deposit is safely held in PayPal Escrow. *Moradabad Precision Foundry* has been notified to begin production.`,
        },
        quality_inspection_passed: {
          title: "✅ Pre-Shipment Inspection Passed",
          body: `✅ *Pre-Shipment Quality Inspection Passed (#${orderNumber})*\n\nInspectors approved your batch at *Moradabad Precision Foundry* with 0 critical defects. Photos and lab reports are ready in your Buyer Portal.`,
        },
        shipment_dispatched: {
          title: "🚢 Shipment Dispatched from India",
          body: `🚢 *Shipment Dispatched from India (#${orderNumber})*\n\nYour cargo has been cleared and loaded onto the vessel. Ocean Bill of Lading and tracking are live in your Foreign Buyer Portal.`,
        },
      }[activeTab];
    }

    return {
      new_order: {
        title: "💻 New Client Milestone Funded!",
        body: `💻 *TradeOracle — New Client Milestone Funded!*\n\nOrder: *#${orderNumber}*\nYour international client has funded *$2,500 USD (approx ₹2.09 Lakhs)* into PayPal Escrow.\n\n🔒 Funds are secured. You can start engineering work safely!`,
      },
      paypal_escrow_locked: {
        title: "🎉 PayPal Milestone Payout Released!",
        body: `🎉 *PayPal Milestone Payout Released!*\n\nOrder: *#${orderNumber}*\n*$2,500 USD (approx ₹2.09 Lakhs)* has been released to your Indian bank account.`,
      },
      quality_inspection_passed: {
        title: "🚀 Deliverable Proof Logged",
        body: `🚀 *Deliverable Proof Logged (#${orderNumber})*\n\nYour GitHub PR, staging link, and Loom walkthrough have been verified and recorded onto the transaction ledger for client approval.`,
      },
      shipment_dispatched: {
        title: "🎉 Final Service Settlement Completed",
        body: `🎉 *PayPal Final Milestone Released (#${orderNumber})*\n\nClient approved deliverables and final payout has been cleared to your bank with e-FIRC compliance.`,
      },
    }[activeTab];
  };

  const currentMsg = getPreviewMessage();
  const isConnected = status === "connected";

  return (
    <>
      {/* Trigger Button */}
      {compact ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-colors cursor-pointer border ${
            isConnected
              ? "bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#075E54] border-[#25D366]/40"
              : "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300"
          }`}
          title="Configure & test real automated WhatsApp alerts"
        >
          <div
            className={`size-2 rounded-full ${
              isConnected ? "bg-[#25D366] animate-pulse" : "bg-amber-500"
            }`}
          />
          <span>{isConnected ? "WhatsApp Live ✓" : "Link Real WhatsApp"}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-[#25D366]/10 to-[#128C7E]/10 border border-[#25D366]/30 hover:border-[#25D366] text-[#075E54] transition-all cursor-pointer group shadow-xs"
        >
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <MessageSquare className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#075E54] flex items-center gap-1.5">
                <span>{isConnected ? "WhatsApp Auto-Alerts Live" : "Connect Real WhatsApp"}</span>
                <span
                  className={`size-1.5 rounded-full ${
                    isConnected ? "bg-[#25D366] animate-ping" : "bg-amber-500"
                  }`}
                />
              </div>
              <p className="text-[10px] text-stone-500 font-mono">
                {isConnected
                  ? `Linked: ${connectedPhone}`
                  : "Scan QR once for real automated alerts"}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#128C7E] group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* Full Real WhatsApp Automation Console Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-[#efeae2] rounded-2xl shadow-2xl overflow-hidden border border-stone-300 flex flex-col max-h-[92vh]">
            {/* WhatsApp Header */}
            <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center border border-white/30">
                    <ShieldCheck className="w-5 h-5 text-[#b2eb76]" />
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-[#075E54] ${
                      isConnected ? "bg-[#25D366]" : "bg-amber-400"
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm tracking-tight">
                      TradeOracle Automated WhatsApp Engine
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isConnected
                          ? "bg-[#25D366] text-[#075E54]"
                          : "bg-amber-400 text-amber-950"
                      }`}
                    >
                      {isConnected ? "LIVE LINKED ✓" : status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100 font-mono">
                    {isConnected
                      ? `Connected device: ${connectedName || "WhatsApp"} (${connectedPhone})`
                      : "Scan QR with WhatsApp to automatically receive real order & payment messages"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* STEP 1: DEVICE PAIRING / QR CODE PANEL */}
              <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
                {isConnected ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Radio className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#18280e] flex items-center gap-1.5">
                          <span>Real WhatsApp Session Active</span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                        <p className="text-[11px] font-mono text-stone-600">
                          Linked number: <strong>{connectedPhone}</strong> ({connectedName})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-[11px] font-mono text-stone-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoNotify}
                          onChange={(e) => {
                            setAutoNotify(e.target.checked);
                            void handleSaveConfig(phoneNumber, e.target.checked);
                          }}
                          className="accent-[#075E54] w-3.5 h-3.5"
                        />
                        <span>Auto-send on new orders</span>
                      </label>

                      <button
                        type="button"
                        onClick={handleDisconnect}
                        disabled={connecting}
                        className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>Unlink</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row items-center justify-between gap-5">
                    <div className="space-y-2 flex-1">
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-[#075E54] bg-emerald-50 px-2 py-0.5 rounded">
                        <QrCode className="w-3.5 h-3.5" />
                        <span>One-Time Real WhatsApp Link (No API Keys Required)</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#18280e]">
                        Link your WhatsApp to receive real automated order alerts
                      </h4>
                      <ol className="text-[11px] text-stone-600 space-y-1 list-decimal list-inside font-mono">
                        <li>Click <strong>Generate QR Code</strong> on the right.</li>
                        <li>Open <strong>WhatsApp</strong> on your phone → <strong>Settings / Menu</strong> → <strong>Linked Devices</strong>.</li>
                        <li>Tap <strong>Link a Device</strong> and scan the QR code. Once linked, all new orders &amp; PayPal payments automatically arrive in WhatsApp!</li>
                      </ol>

                      {lastError && (
                        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-mono flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{lastError}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-center justify-center shrink-0 bg-[#f8fbf5] border border-[#d8e5ca] rounded-2xl p-4 min-w-[200px]">
                      {status === "qr_ready" && qrDataUrl ? (
                        <div className="space-y-2 text-center">
                          <img
                            src={qrDataUrl}
                            alt="WhatsApp Link QR Code"
                            className="w-40 h-40 rounded-lg border border-stone-200 bg-white mx-auto"
                          />
                          <button
                            type="button"
                            onClick={() => handleStartLink(true)}
                            className="text-[10px] font-mono text-[#075E54] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Refresh QR</span>
                          </button>
                        </div>
                      ) : status === "connecting" || connecting ? (
                        <div className="py-8 text-center space-y-2">
                          <Loader2 className="w-8 h-8 animate-spin text-[#075E54] mx-auto" />
                          <span className="text-[11px] font-mono text-stone-600 block">
                            Connecting to WhatsApp servers...
                          </span>
                        </div>
                      ) : (
                        <div className="py-4 text-center space-y-3">
                          <QrCode className="w-12 h-12 text-[#075E54]/40 mx-auto" />
                          <button
                            type="button"
                            onClick={() => handleStartLink(false)}
                            className="px-4 py-2 rounded-xl bg-[#075E54] hover:bg-[#128C7E] text-white font-mono text-xs font-bold shadow-sm cursor-pointer flex items-center gap-2"
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

              {/* STEP 2: RECIPIENT NUMBER & AUTOMATED EVENT MESSAGE DISPATCH */}
              <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                  <div>
                    <span className="text-xs font-bold text-[#18280e] block">
                      Recipient Mobile Number ({role.toUpperCase()} Alerts)
                    </span>
                    <span className="text-[10px] font-mono text-stone-500">
                      Orders, PayPal deposits &amp; shipping milestones are automatically pushed to this number
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1.5 bg-[#f4faed] px-2.5 py-1.5 rounded-lg border border-[#d8e5ca]">
                      <Smartphone className="w-3.5 h-3.5 text-[#075E54] shrink-0" />
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 98XXXXXXXX"
                        className="font-mono text-xs text-stone-900 font-bold bg-transparent focus:outline-none w-36"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveConfig(phoneNumber, autoNotify)}
                      className="px-3 py-1.5 rounded-lg bg-[#18280e] text-[#b2eb76] font-mono text-[11px] font-bold cursor-pointer hover:bg-[#284905]"
                    >
                      {phoneSavedMsg || "Save"}
                    </button>
                  </div>
                </div>

                {/* Stage Template Selector */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { key: "new_order" as StageKey, label: "1. New Order Received" },
                    { key: "paypal_escrow_locked" as StageKey, label: "2. Advance Money in PayPal" },
                    { key: "quality_inspection_passed" as StageKey, label: "3. Quality Check Passed" },
                    { key: "shipment_dispatched" as StageKey, label: "4. Shipped & Final Payout" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                        activeTab === tab.key
                          ? "bg-[#075E54] text-white"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Message Preview Bubble */}
                <div className="bg-[#efeae2] rounded-xl p-3 sm:p-4 border border-stone-200">
                  <div className="max-w-lg bg-white rounded-2xl rounded-tl-none p-3.5 shadow-xs border border-stone-200/80 space-y-1.5">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
                      <span className="font-bold text-[#075E54] flex items-center gap-1.5 text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-[#25D366]" />
                        <span>{currentMsg.title}</span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">Plain English</span>
                    </div>
                    <div className="text-[12px] text-stone-800 leading-relaxed whitespace-pre-line font-sans">
                      {currentMsg.body}
                    </div>
                    <div className="pt-1 flex justify-end items-center gap-1 text-[#25D366]">
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-mono font-bold">Auto-dispatched by TradeOracle</span>
                    </div>
                  </div>
                </div>

                {sendFeedback && (
                  <div
                    className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
                      sendFeedback.type === "success"
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                        : "bg-rose-50 border border-rose-200 text-rose-900"
                    }`}
                  >
                    {sendFeedback.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{sendFeedback.text}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
                  <span className="text-[10px] font-mono text-stone-500">
                    When an order arrives or PayPal pays, this message pushes automatically to WhatsApp.
                  </span>
                  <button
                    type="button"
                    onClick={handleSendRealMessage}
                    disabled={sending || !isConnected}
                    className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                      isConnected
                        ? "bg-[#25D366] hover:bg-[#20ba59] text-white cursor-pointer"
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
                        ? "Sending to WhatsApp..."
                        : isConnected
                        ? "Send Real WhatsApp Message Now"
                        : "Link QR Above to Send Real Message"}
                    </span>
                  </button>
                </div>
              </div>

              {/* STEP 3: REAL SERVER DISPATCH LOG & 2-WAY INCOMING REPLIES */}
              {(logs.length > 0 || incomingReplies.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white rounded-2xl border border-stone-200 p-3.5 space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-stone-500 block">
                      Recent Server WhatsApp Dispatches ({logs.length})
                    </span>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {logs.slice(0, 6).map((item) => (
                        <div
                          key={item.id}
                          className="p-2 rounded-lg bg-stone-50 border border-stone-200/80 text-[10px] font-mono flex justify-between items-start gap-2"
                        >
                          <div className="min-w-0">
                            <span className="font-bold text-stone-800 block truncate">
                              {item.orderNumber} → {item.to}
                            </span>
                            <span className="text-stone-500 block truncate">{item.eventType}</span>
                            {item.error && <span className="text-rose-600 block">{item.error}</span>}
                          </div>
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold shrink-0 ${
                              item.status === "sent"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {item.status === "sent" ? "SENT ✓" : "SKIPPED"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-stone-200 p-3.5 space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-stone-500 block">
                      2-Way Replies from WhatsApp ({incomingReplies.length})
                    </span>
                    {incomingReplies.length === 0 ? (
                      <p className="text-[11px] font-mono text-stone-400 py-4 text-center">
                        Reply &quot;1&quot; or &quot;STATUS&quot; on WhatsApp to test 2-way order automation.
                      </p>
                    ) : (
                      <div className="space-y-1.5 max-h-36 overflow-y-auto">
                        {incomingReplies.slice(0, 6).map((rep) => (
                          <div
                            key={rep.id}
                            className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200 text-[10px] font-mono"
                          >
                            <div className="flex justify-between font-bold text-[#075E54]">
                              <span>{rep.pushName} ({rep.from})</span>
                              <span>{rep.autoReplied ? "Auto-replied ✓" : "Received"}</span>
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
