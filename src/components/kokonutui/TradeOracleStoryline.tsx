"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Scale,
  CreditCard,
  Clock,
} from "lucide-react";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { KokonutButton } from "./KokonutButton";
import { HoldToConfirm } from "./HoldToConfirm";

export interface SimpleDealStepStory {
  id: string;
  title: string;
  badge: string;
  dealValueUSD: number;
  dealValueINR: string;
  buyer: {
    name: string;
    company: string;
    country: string;
    flag: string;
    city: string;
  };
  seller: {
    name: string;
    company: string;
    location: string;
    licenseLabel: string;
  };
  stages: {
    find: { title: string; description: string; detail: string };
    agree: {
      title: string;
      contractDate: string;
      specs: string[];
      milestones: { name: string; amount: string; status: string }[];
    };
    pay: {
      title: string;
      orderId: string;
      amountPaid: string;
      status: string;
      accountLabel: string;
    };
    deliver: { title: string; date: string; summary: string };
    prove: {
      title: string;
      items: { label: string; code: string }[];
    };
    resolve: {
      title: string;
      disputeStatus: string;
      explanation: string;
    };
  };
  storySummary: string;
}

const DEAL_EXAMPLE: SimpleDealStepStory = {
  id: "story_goods",
  title: "Brass & Steel Pump Parts Export Order",
  badge: "Sample Completed Export Order",
  dealValueUSD: 85750,
  dealValueINR: "₹71.5 Lakhs",
  buyer: {
    name: "Marcus Vance",
    company: "Pacific Architectural Hardware LLC",
    country: "United States",
    flag: "🇺🇸",
    city: "California, USA",
  },
  seller: {
    name: "Rajesh Panchal",
    company: "Moradabad Precision Foundry LLP",
    location: "Moradabad & Rajkot, India",
    licenseLabel: "Government Verified Indian Factory ✓",
  },
  stages: {
    find: {
      title: "1. Foreign Buyer Sends Order Request",
      description:
        "A US hardware company needs 5,000 brass and steel parts and chooses your verified Indian factory.",
      detail:
        "What they want: 5,000 strong rust-proof pump parts made to exact size drawings and packed cleanly for sea shipping.",
    },
    agree: {
      title: "2. Both Sides Agree on Price & Pieces",
      contractDate: "Oct 25, 2026",
      specs: [
        "Exact material & rust-proof finish agreed in writing",
        "Independent quality check before packing boxes",
        "Waterproof wooden crates delivered to Gujarat port",
      ],
      milestones: [
        { name: "Step 1: 30% Advance (Before Starting)", amount: "$25,725 (≈ ₹21.5 Lakhs)", status: "Paid ✓" },
        { name: "Step 2: Factory Quality Check", amount: "Inspector Check", status: "Passed ✓" },
        { name: "Step 3: 70% Balance on Ship Loading", amount: "$60,025 (≈ ₹50.0 Lakhs)", status: "Protected" },
      ],
    },
    pay: {
      title: "3. Buyer Pays 30% Advance Safely in PayPal",
      orderId: "PAYPAL-9921-ADV",
      amountPaid: "$25,725.00 USD (≈ ₹21.5 Lakhs)",
      status: "Advance Received ✓",
      accountLabel: "Linked PayPal Business Account",
    },
    deliver: {
      title: "4. Factory Makes & Packs the Goods",
      date: "Nov 9, 2026",
      summary:
        "All 5,000 units were made, tested with pressure equipment, packed in export boxes, and sent by truck to Gujarat sea port.",
    },
    prove: {
      title: "5. Inspector Approves & Shipping Proof Saved",
      items: [
        { label: "Quality Inspector Pass Report (Zero Defects)", code: "Report #QIMA-98124" },
        { label: "Port Customs Clearance Paper", code: "Port Bill #981024" },
        { label: "Ship Loading Receipt (Maersk Cargo Ship)", code: "Ship Receipt #44018A" },
      ],
    },
    resolve: {
      title: "6. Final 70% Paid & Protected Against Unfair Refunds",
      disputeStatus: "No Problems • Clean Record",
      explanation:
        "Because every agreement, quality photo, and ship loading receipt is saved in one place, the buyer cannot wrongly claim they never received the order. Your factory also gets a clean yearly summary ready to hand directly to your accountant.",
    },
  },
  storySummary:
    "See how an $85,750 (₹71.5 Lakhs) foreign order works smoothly without stress: price is locked first, 30% advance comes via PayPal before you start work, and shipping receipts protect your remaining 70%.",
};

export function TradeOracleStoryline() {
  const [activeStep, setActiveStep] = useState<
    "find" | "agree" | "pay" | "deliver" | "prove" | "resolve"
  >("agree");
  const [evidenceVerified, setEvidenceVerified] = useState(false);

  const story = DEAL_EXAMPLE;

  return (
    <div className="space-y-6 font-sans">
      <SpotlightCard className="bg-white rounded-3xl border border-stone-200/90 p-6 md:p-8 shadow-xs space-y-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#ebf7d9] text-[#3f7308] font-semibold text-xs mb-2">
              Simple Step-by-Step Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18280e] tracking-tight">
              {story.title}
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              {story.storySummary}
            </p>
          </div>

          <span className="px-4 py-2 rounded-xl text-xs font-bold bg-[#f4faed] text-[#18280e] border border-[#d8e5ca] shrink-0">
            {story.badge} • {story.dealValueINR}
          </span>
        </div>

        {/* Who is Buying, Who is Making, Total Price */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-stone-100 text-xs">
          <div className="p-4 rounded-2xl bg-[#fbfdf9] border border-stone-200/80 space-y-1">
            <span className="text-[11px] text-stone-500 font-semibold block">Foreign Buyer</span>
            <div className="flex items-center gap-2">
              <span className="text-lg">{story.buyer.flag}</span>
              <strong className="text-[#18280e] text-sm">{story.buyer.company}</strong>
            </div>
            <span className="text-stone-500 block">
              {story.buyer.name} • {story.buyer.city}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#ebf7d9]/60 border border-[#d8e5ca] space-y-1">
            <span className="text-[11px] text-[#3f7308] font-semibold block">Your Factory</span>
            <div className="flex items-center gap-2">
              <span className="text-lg">🇮🇳</span>
              <strong className="text-[#18280e] text-sm">{story.seller.company}</strong>
            </div>
            <span className="text-stone-700 block">{story.seller.licenseLabel}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200/80 space-y-1 flex flex-col justify-between">
            <span className="text-[11px] text-stone-500 font-semibold block">Total Order Price</span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-extrabold text-[#18280e]">
                ${story.dealValueUSD.toLocaleString()} USD
              </span>
              <span className="text-xs font-bold text-[#3f7308] bg-[#ebf7d9] px-2.5 py-0.5 rounded-md">
                ≈ {story.dealValueINR}
              </span>
            </div>
            <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3f7308]" />
              <span>Paid safely in stages via PayPal</span>
            </span>
          </div>
        </div>

        {/* 6 Clickable Plain-English Steps */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">
              Click any step below to see what happens:
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
            {[
              { id: "find" as const, num: "Step 1", label: "Buyer Asks", icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> },
              { id: "agree" as const, num: "Step 2", label: "Price Agreed", icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> },
              { id: "pay" as const, num: "Step 3", label: "30% Advance", icon: <CreditCard className="w-3.5 h-3.5 text-emerald-600" /> },
              { id: "deliver" as const, num: "Step 4", label: "Factory Makes", icon: <Clock className="w-3.5 h-3.5 text-amber-600" /> },
              { id: "prove" as const, num: "Step 5", label: "Quality & Ship", icon: <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" /> },
              { id: "resolve" as const, num: "Step 6", label: "Final Payout", icon: <Scale className="w-3.5 h-3.5 text-emerald-600" /> },
            ].map((step) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  activeStep === step.id
                    ? "bg-[#18280e] text-[#b2eb76] border-[#18280e] shadow-xs"
                    : "bg-white hover:bg-[#f4faed] border-stone-200 text-[#18280e]"
                }`}
              >
                <div className="flex justify-between items-center text-[11px] opacity-80 mb-1">
                  <span>{step.num}</span>
                  {step.icon}
                </div>
                <strong className="block text-xs">{step.label}</strong>
              </button>
            ))}
          </div>
        </div>

        {/* Active Step Plain-English Details */}
        <div className="p-5 rounded-2xl bg-[#f8fbf5] border border-[#d8e5ca] space-y-4 text-xs animate-in fade-in">
          {activeStep === "find" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-[#18280e]">{story.stages.find.title}</span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Genuine Buyer
                </span>
              </div>
              <p className="text-stone-700 leading-relaxed text-sm">{story.stages.find.description}</p>
              <div className="p-4 rounded-xl bg-white border border-stone-200 text-stone-800 text-sm leading-relaxed">
                {story.stages.find.detail}
              </div>
            </div>
          )}

          {activeStep === "agree" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-[#18280e]">{story.stages.agree.title}</span>
                <span className="text-stone-500 text-xs">Agreed on: {story.stages.agree.contractDate}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {story.stages.agree.specs.map((spec, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white border border-stone-200 flex items-start gap-2">
                    <span className="text-[#3f7308] font-bold">✓</span>
                    <span className="text-xs text-stone-800 leading-relaxed">{spec}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <span className="text-xs text-stone-600 font-bold block">How Payment Comes in 3 Steps:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {story.stages.agree.milestones.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-3.5 rounded-xl bg-white border border-stone-200 flex justify-between items-center gap-2"
                    >
                      <div>
                        <strong className="text-[#18280e] block text-xs">{m.name}</strong>
                        <span className="text-[11px] text-stone-500">{m.amount}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          m.status.includes("✓")
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeStep === "pay" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-[#18280e]">{story.stages.pay.title}</span>
                <span className="text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold text-xs">
                  {story.stages.pay.status}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2.5 text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                  <span className="text-stone-500">Payment Reference Number:</span>
                  <strong className="text-[#18280e]">{story.stages.pay.orderId}</strong>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                  <span className="text-stone-500">Advance Money Locked for You:</span>
                  <strong className="text-[#3f7308]">{story.stages.pay.amountPaid}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Where Money Arrives:</span>
                  <span className="text-stone-700 font-medium">{story.stages.pay.accountLabel}</span>
                </div>
              </div>
            </div>
          )}

          {activeStep === "deliver" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-[#18280e]">{story.stages.deliver.title}</span>
                <span className="text-stone-500 text-xs">Finished: {story.stages.deliver.date}</span>
              </div>
              <div className="p-4 rounded-xl bg-white border border-stone-200 text-stone-800 leading-relaxed text-sm">
                {story.stages.deliver.summary}
              </div>
            </div>
          )}

          {activeStep === "prove" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-[#18280e]">{story.stages.prove.title}</span>
                <span className="text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold text-xs">
                  All Receipts Saved
                </span>
              </div>

              <div className="space-y-2">
                {story.stages.prove.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    className="p-3.5 rounded-xl bg-white border border-stone-200 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#3f7308] shrink-0" />
                      <div>
                        <strong className="text-[#18280e] block text-xs">{item.label}</strong>
                        <span className="text-[11px] text-stone-500">{item.code}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      Verified ✓
                    </span>
                  </div>
                ))}
              </div>

              {evidenceVerified && (
                <div className="p-3 rounded-xl bg-[#ebf7d9] text-[#18280e] font-semibold text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#3f7308]" />
                  <span>All quality and shipping papers are locked safely for your bank and accountant.</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <HoldToConfirm
                  onConfirm={() => setEvidenceVerified(true)}
                  label="Hold to Confirm Papers Are Ready"
                  confirmedLabel="✓ Papers Confirmed & Saved"
                />
              </div>
            </div>
          )}

          {activeStep === "resolve" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-[#18280e]">{story.stages.resolve.title}</span>
                <span className="text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold text-xs">
                  {story.stages.resolve.disputeStatus}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2 text-stone-700 leading-relaxed text-sm">
                <span className="font-bold text-[#18280e] block">
                  Why You Never Lose Money to False Complaints:
                </span>
                <p>{story.stages.resolve.explanation}</p>
              </div>

              <div className="flex flex-wrap justify-between items-center gap-3 pt-2 border-t border-stone-200">
                <span className="text-xs text-stone-600">
                  Accountant &amp; Bank Tax File: <strong className="text-[#18280e]">Ready to Download</strong>
                </span>
                <KokonutButton
                  variant="primary"
                  size="sm"
                  onClick={() => alert("Downloading simple Accountant & Bank Folder (.ZIP)...")}
                >
                  Download Accountant Folder (.ZIP)
                </KokonutButton>
              </div>
            </div>
          )}
        </div>
      </SpotlightCard>
    </div>
  );
}
