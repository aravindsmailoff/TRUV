"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  CheckCheck,
  Send,
  Phone,
  Sparkles,
  X,
  ExternalLink,
  ShieldCheck,
  BellRing,
  Smartphone,
  ChevronRight,
  Clock,
} from "lucide-react";

export interface WhatsAppMessageItem {
  id: string;
  sender: "tradeoracle" | "user";
  timestamp: string;
  title?: string;
  body: string;
  actionText?: string;
  actionUrl?: string;
  status?: "read" | "delivered" | "sent";
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
  recipientPhone = "+91 98200 12345",
  recipientName = "Moradabad Precision Foundry LLP",
  orderNumber = "ORD-USA-9921",
  compact = false,
}: WhatsAppNotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(recipientPhone);
  const [activeTab, setActiveTab] = useState<"new_order" | "advance_paid" | "quality_pass" | "payout_ready">(
    "new_order"
  );
  const [customReply, setCustomReply] = useState("");
  const [sentToast, setSentToast] = useState(false);

  // Simple plain-English templates for laymen without jargon
  const getRoleMessages = () => {
    if (role === "manufacturer") {
      return {
        new_order: {
          title: "📦 New Export Order Received!",
          body: `*TradeOracle Order Alert: ${orderNumber}*\n\nNamaste ${recipientName}!\n\nA foreign buyer has placed a confirmed order:\n\n• *Buyer:* Pacific Architectural Hardware (California, USA)\n• *Product:* 1,500 Sets Solid Brass Mortise Locksets\n• *Total Deal Value:* $85,750 USD (approx ₹71.5 Lakhs)\n• *Advance Guarantee:* $25,725 USD (approx ₹21.45 Lakhs) is already deposited into PayPal Escrow.\n\n*What you need to do now:*\n1. Confirm order and start raw material casting.\n2. You do *not* need to worry about export paperwork or bank compliance—TradeOracle handles your export shipping bills and e-FIRC automatically.\n\nReply with *1* to accept or open TradeOracle to view dimensions.`,
          time: "10:15 AM",
        },
        advance_paid: {
          title: "💰 Advance Payment Secured in PayPal",
          body: `*Payment Update: ${orderNumber}*\n\nGood news! The 30% advance deposit of *$25,725 USD (₹21.45 Lakhs)* is successfully verified and locked in your PayPal account.\n\nYour payment is 100% protected against buyer disputes while you manufacture.`,
          time: "11:30 AM",
        },
        quality_pass: {
          title: "🔍 Quality Inspection Passed",
          body: `*Inspection Update: ${orderNumber}*\n\nInspector from QIMA visited your Moradabad workshop today.\n\n• 100% dimension and brass finishing checks: *PASSED*\n• Zero export defects found.\n• Clearance certificate uploaded to customs.\n\nYou are authorized to dispatch the shipping container to Mundra Port.`,
          time: "03:45 PM",
        },
        payout_ready: {
          title: "🚢 Final Payment Deposited in Your Bank",
          body: `*Final Settlement Alert: ${orderNumber}*\n\nContainer has been loaded onto ocean vessel at Mundra Port.\n\nThe remaining balance of *$60,025 USD (approx ₹50 Lakhs)* has been released by PayPal directly to your Indian bank account.\n\nYour CA export statement (e-FIRC) is ready for download in your dashboard.`,
          time: "06:10 PM",
        },
      };
    } else if (role === "buyer") {
      return {
        new_order: {
          title: "📋 Supplier Accepted Your Order",
          body: `*TradeOracle Buyer Sourcing Alert*\n\nHello Pacific Architectural Hardware!\n\nMoradabad Precision Foundry in India has accepted your Purchase Order #${orderNumber}.\n\n• *Advance Escrow:* $25,725 USD is safely held by PayPal.\n• *Production Timeline:* 24 days.\n• *Next Step:* Our quality auditor will inspect samples before dispatch.`,
          time: "10:15 AM",
        },
        advance_paid: {
          title: "🔒 PayPal Escrow Active",
          body: `*PayPal Protection Confirmed*\n\nYour 30% deposit is held in escrow. Funds will not be disbursed until pre-shipment quality standards are met.`,
          time: "11:30 AM",
        },
        quality_pass: {
          title: "✅ Pre-Shipment Inspection Report Ready",
          body: `*Quality Audit Complete*\n\nQIMA inspectors verified all 1,500 brass locksets at the factory. 0 major defects detected. 12 high-resolution photos and lab test certificates are attached to your order record.`,
          time: "03:45 PM",
        },
        payout_ready: {
          title: "🚢 Cargo Shipped with Ocean Bill of Lading",
          body: `*Vessel Departure Alert*\n\nContainer loaded onto Maersk Line vessel at Mundra Port heading for Port of Long Beach, California. Expected arrival: 18 days. Final milestone payment released to seller.`,
          time: "06:10 PM",
        },
      };
    } else {
      // Freelancer / Service
      return {
        new_order: {
          title: "💻 New Milestone Funded on PayPal",
          body: `*TradeOracle Freelancer Alert*\n\nHello HyperScale Software Labs!\n\nYour client has funded Milestone 1 ($2,500 USD) for the Next.js PayPal Integration project.\n\n• *Escrow Status:* $2,500 held in PayPal.\n• *Requirement:* Deliver GitHub PR and Loom demo video.\n• *Protection:* Client cannot retract funds after approved delivery.`,
          time: "10:15 AM",
        },
        advance_paid: {
          title: "💵 Escrow Confirmed",
          body: `*Milestone 1 Active*\n\nClient escrow confirmed. You can start development with guaranteed payment security.`,
          time: "11:30 AM",
        },
        quality_pass: {
          title: "🚀 Delivery & Proofs Uploaded",
          body: `*Deliverables Logged*\n\nYour GitHub PR #42 and Vercel preview URL have been recorded with cryptographic evidence into the transaction ledger.`,
          time: "03:45 PM",
        },
        payout_ready: {
          title: "🎉 Payout Released to Indian Bank",
          body: `*Disbursement Complete*\n\nClient approved milestone delivery. $2,500 USD (approx ₹2.08 Lakhs) has been disbursed by PayPal to your HDFC bank account. TradeOracle generated your service export invoice.`,
          time: "06:10 PM",
        },
      };
    }
  };

  const templates = getRoleMessages();
  const currentMsg = templates[activeTab];

  const handleOpenWhatsAppWeb = () => {
    const encodedText = encodeURIComponent(currentMsg.body.replace(/\*/g, ""));
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`, "_blank");
  };

  const handleTriggerSimulatedAlert = () => {
    setSentToast(true);
    setTimeout(() => setSentToast(false), 4000);
  };

  return (
    <>
      {/* Trigger Button */}
      {compact ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#075E54] border border-[#25D366]/30 text-[11px] font-mono font-bold transition-colors cursor-pointer"
          title="Open WhatsApp Order Alerts"
        >
          <div className="size-2 rounded-full bg-[#25D366] animate-pulse" />
          <span>WhatsApp Alerts</span>
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
                <span>WhatsApp Order Updates</span>
                <span className="size-1.5 rounded-full bg-[#25D366] animate-ping" />
              </div>
              <p className="text-[10px] text-stone-500 font-mono">
                Get simple, plain-English updates on your phone
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#128C7E] group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* Real-time Toast notification preview when alert is triggered */}
      {sentToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-white border border-[#25D366] rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-300 flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5 fill-white" />
          </div>
          <div className="flex-1 min-w-0 font-sans">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#075E54]">TradeOracle WhatsApp</span>
              <span className="text-[10px] text-stone-400 font-mono">Just now</span>
            </div>
            <p className="text-xs font-semibold text-stone-900 mt-0.5 truncate">{currentMsg.title}</p>
            <p className="text-[11px] text-stone-600 line-clamp-2 mt-0.5 leading-relaxed font-mono">
              Sent to {phoneNumber}: $85,750 order details received in simple English.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSentToast(false)}
            className="text-stone-400 hover:text-stone-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Interactive WhatsApp Modal / Simulator */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#efeae2] rounded-2xl shadow-2xl overflow-hidden border border-stone-300 flex flex-col max-h-[92vh]">
            {/* WhatsApp Green Top Header */}
            <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/40">
                    <ShieldCheck className="w-5 h-5 text-[#b2eb76]" />
                  </div>
                  <span className="absolute bottom-0 right-0 size-3 rounded-full bg-[#25D366] border-2 border-[#075E54]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm tracking-tight">TradeOracle Official Verified</span>
                    <span className="text-[10px] bg-[#25D366] text-[#075E54] font-black px-1 rounded font-mono">
                      ✓ BUSINESS
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100 font-mono">
                    Instant plain-language order &amp; payment notifications
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sub-bar: Notification Stage Selector */}
            <div className="bg-[#128C7E] px-4 py-2 flex items-center justify-between text-xs font-mono text-emerald-100 border-t border-emerald-600/40 overflow-x-auto">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200 shrink-0 mr-2">
                Select Order Stage:
              </span>
              <div className="flex gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab("new_order")}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    activeTab === "new_order"
                      ? "bg-white text-[#075E54] font-bold shadow-xs"
                      : "text-emerald-100 hover:bg-white/10"
                  }`}
                >
                  1. New Order
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("advance_paid")}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    activeTab === "advance_paid"
                      ? "bg-white text-[#075E54] font-bold shadow-xs"
                      : "text-emerald-100 hover:bg-white/10"
                  }`}
                >
                  2. 30% Money in PayPal
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("quality_pass")}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    activeTab === "quality_pass"
                      ? "bg-white text-[#075E54] font-bold shadow-xs"
                      : "text-emerald-100 hover:bg-white/10"
                  }`}
                >
                  3. Quality Check
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("payout_ready")}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    activeTab === "payout_ready"
                      ? "bg-white text-[#075E54] font-bold shadow-xs"
                      : "text-emerald-100 hover:bg-white/10"
                  }`}
                >
                  4. Bank Payout
                </button>
              </div>
            </div>

            {/* Chat Body (WhatsApp Background with Doodle Pattern effect) */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 text-xs font-sans">
              {/* Privacy Warning Pill */}
              <div className="flex justify-center">
                <span className="bg-[#ffeecd] text-[#54656f] text-[10px] font-mono px-3 py-1 rounded-lg text-center shadow-xs border border-amber-200/60 max-w-md">
                  🔒 Messages are end-to-end encrypted by WhatsApp. TradeOracle verifies every buyer and transaction with PayPal payment guarantee.
                </span>
              </div>

              {/* Message Bubble */}
              <div className="flex justify-start">
                <div className="max-w-[85%] bg-white rounded-2xl rounded-tl-none p-4 shadow-sm border border-stone-200/70 space-y-2">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="font-bold text-[#075E54] flex items-center gap-1.5 text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>{currentMsg.title}</span>
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">{currentMsg.time}</span>
                  </div>

                  {/* Body text with WhatsApp styling */}
                  <div className="text-[12px] text-stone-800 leading-relaxed whitespace-pre-line font-sans">
                    {currentMsg.body}
                  </div>

                  {/* Message Action Footer */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-stone-400">Order: {orderNumber}</span>
                    <div className="flex items-center gap-1 text-[#25D366]">
                      <CheckCheck className="w-4 h-4" />
                      <span className="text-[10px] font-mono font-bold">Delivered</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bar & Direct WhatsApp Sender */}
            <div className="bg-[#f0f2f5] p-3 sm:p-4 border-t border-stone-300 space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-stone-300 flex-1">
                  <Smartphone className="w-4 h-4 text-[#075E54] shrink-0" />
                  <span className="text-[11px] text-stone-500 font-mono">Mobile Number:</span>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="flex-1 font-mono text-xs text-stone-800 font-bold focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTriggerSimulatedAlert}
                    className="px-3 py-2 rounded-lg bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <BellRing className="w-3.5 h-3.5 text-[#075E54]" />
                    <span>Test Phone Alert</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenWhatsAppWeb}
                    className="px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.98]"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-white" />
                    <span>Open in WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="text-[10px] font-mono text-stone-500 flex items-center justify-between">
                <span>💡 Layman Friendly: Zero confusing legal jargon. Pure clear payment &amp; production status.</span>
                <span className="text-[#075E54] font-bold">PayPal Escrow Protected</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

