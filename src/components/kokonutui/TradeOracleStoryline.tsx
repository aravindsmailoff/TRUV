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
import { DecryptedText } from "@/components/reactbits/DecryptedText";
import { ShinyText } from "@/components/reactbits/ShinyText";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { KokonutButton } from "./KokonutButton";
import { HoldToConfirm } from "./HoldToConfirm";

export interface TransactionStory {
  id: string;
  type: "service" | "goods";
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
    taxId: string;
  };
  stages: {
    find: { title: string; description: string; detail: string };
    agree: { title: string; contractDate: string; specs: string[]; milestones: { name: string; amount: string; status: string }[] };
    pay: { title: string; orderId: string; amountPaid: string; status: string; payeeEmail: string };
    deliver: { title: string; date: string; summary: string };
    prove: { title: string; items: { label: string; code: string; verified: boolean }[] };
    resolve: { title: string; disputeStatus: string; caAuditPackReady: boolean; explanation: string };
  };
  storySummary: string;
}

const STORIES: TransactionStory[] = [
  // SITUATION B: GOODS EXPORTS ($85,750 Pump Castings & Brass Hardware)
  {
    id: "story_goods",
    type: "goods",
    title: "Precision Machined Pump Casting & Valve Assemblies",
    badge: "Goods Export (MSME Foundry)",
    dealValueUSD: 85750,
    dealValueINR: "₹71.5 Lakhs",
    buyer: {
      name: "Marcus Vance",
      company: "Pacific Architectural Hardware LLC",
      country: "United States",
      flag: "🇺🇸",
      city: "Irvine, California",
    },
    seller: {
      name: "Rajesh Panchal",
      company: "Saurashtra Precision Pump & Foundry LLP",
      location: "Rajkot GIDC, Gujarat",
      taxId: "DGFT IEC: 0812049182 | GSTIN: 24AABCS9184P1Z3",
    },
    stages: {
      find: {
        title: "1. Buyer Discovery & Demand",
        description: "California procurement team discovers verified Indian foundry in Rajkot GIDC.",
        detail: "Demand: 5,000 investment-cast CF8M pump impellers with ±0.015mm CNC turning tolerance.",
      },
      agree: {
        title: "2. Agreement & Technical Scope Lock",
        contractDate: "2026-10-25",
        specs: [
          "ASTM A351 CF8M Stainless Casting",
          "QIMA AQL 1.5 hydro-static pressure test at 25 bar",
          "FOB Mundra Port ocean container shrink-wrap packaging",
        ],
        milestones: [
          { name: "M1: 30% Advance (Raw Materials)", amount: "$25,725 USD", status: "CAPTURED" },
          { name: "M2: QIMA Pre-Shipment Inspection", amount: "Audit Pass", status: "PASSED" },
          { name: "M3: 70% Balance against Bill of Lading", amount: "$60,025 USD", status: "ESCROW HELD" },
        ],
      },
      pay: {
        title: "3. PayPal Orders v2 Financial Rail",
        orderId: "2JM21803AA658230N",
        amountPaid: "$25,725.00 USD (30% Advance)",
        status: "CAPTURED ON-CHAIN",
        payeeEmail: "sb-knljl53833937@business.example.com",
      },
      deliver: {
        title: "4. Factory Production & Palletizing",
        date: "2026-11-09",
        summary: "5,000 units cast, CNC turned, hydro-static tested at 25 bar, and trucked to Mundra Port container terminal.",
      },
      prove: {
        title: "5. Fulfilment Evidence Documents",
        items: [
          { label: "QIMA AQL 1.5 Audit Certificate (PASSED)", code: "QIMA-AUDIT-IN-98124", verified: true },
          { label: "ICEGATE Shipping Bill (Let Export Order)", code: "SB-INMUN1-2026-981024", verified: true },
          { label: "Maersk Ocean Bill of Lading (MSKU-7491024)", code: "BL-MSK-2026-44018A", verified: true },
        ],
      },
      resolve: {
        title: "6. PayPal Dispute Protection & CA Audit Pack",
        disputeStatus: "0 Disputes / Clean Record",
        caAuditPackReady: true,
        explanation:
          "If the US buyer raises an unauthorized chargeback, TradeOracle automatically formats the signed ASTM specification, the PayPal capture reference, and the verified Maersk Bill of Lading into a rebuttal dossier directly for the PayPal Resolution Center. Chartered Accountants can export the EDPMS compliance file with 1 click.",
      },
    },
    storySummary:
      "A California buyer orders $85,750 (₹71.5 Lakhs) of cast steel valves from Rajkot. TradeOracle locks the exact metallurgical blueprint, syncs the $25,725 PayPal advance, and attaches the QIMA inspection test and container bill. If the buyer ever disputes, physical proof immediately protects the Indian seller in PayPal Resolution Center.",
  },

  // SITUATION A: SERVICE EXPORTS ($5,000 Software Agency)
  {
    id: "story_service",
    type: "service",
    title: "AI Fintech Risk Engine & React Native Mobile App",
    badge: "Service Export (Software Agency)",
    dealValueUSD: 5000,
    dealValueINR: "₹4.22 Lakhs",
    buyer: {
      name: "Jordan Miller",
      company: "Stratosphere Cloud Corp",
      country: "United States",
      flag: "🇺🇸",
      city: "Austin, Texas",
    },
    seller: {
      name: "Vikram Sen",
      company: "CodeCraft Technologies LLP",
      location: "Bengaluru, Karnataka",
      taxId: "GSTIN: 29AAHCC8812M1ZM",
    },
    stages: {
      find: {
        title: "1. Buyer Discovery & Demand",
        description: "Austin SaaS company hires Indian engineering studio for high-performance fintech API suite.",
        detail: "Scope: Next.js 16 + Node risk engine with 6 REST APIs and Figma v3.2 mobile client app.",
      },
      agree: {
        title: "2. Agreement & Technical Scope Lock",
        contractDate: "2026-10-18",
        specs: [
          "TypeScript Next.js 16 + Node backend",
          "PayPal Webhook v2 reconciliation worker",
          "99.9% uptime test suite with 45 unit tests passed",
          "Sign-off against Figma wireframe v3.2",
        ],
        milestones: [
          { name: "M1: Architecture & API Specs", amount: "$1,500 USD", status: "COMPLETED" },
          { name: "M2: Core Engine & GitHub PR Merge", amount: "$2,000 USD", status: "COMPLETED" },
          { name: "M3: QA Sign-off & Production Release", amount: "$1,500 USD", status: "IN PROGRESS" },
        ],
      },
      pay: {
        title: "3. PayPal Orders v2 Financial Rail",
        orderId: "54X810928B339812M",
        amountPaid: "$3,500.00 USD (M1 + M2 Captured)",
        status: "CAPTURED ON-CHAIN",
        payeeEmail: "sb-knljl53833937@business.example.com",
      },
      deliver: {
        title: "4. Development & Staging Release",
        date: "2026-11-08",
        summary: "Code merged into GitHub Enterprise repository. Automated Jest test suite passed with 100% coverage.",
      },
      prove: {
        title: "5. Fulfilment Evidence Documents",
        items: [
          { label: "GitHub Enterprise PR #142 Merged", code: "commit-sha-7e810a9f", verified: true },
          { label: "Live Staging Verification Sandbox", code: "https://staging-engine.internal/test-pass", verified: true },
        ],
      },
      resolve: {
        title: "6. PayPal Dispute Protection & CA Audit Pack",
        disputeStatus: "0 Disputes / Clean Record",
        caAuditPackReady: true,
        explanation:
          "If the US client claims 'nothing was delivered', TradeOracle binds the client's GitHub review approval, commit timestamps, and PayPal transaction capture into an unassailable dossier for PayPal Resolution Center.",
      },
    },
    storySummary:
      "A Texas tech company hired an Indian software studio for a $5,000 project. TradeOracle connects what was promised in the digital contract, syncs the $3,500 PayPal milestone payouts, and timestamps the GitHub PR code merges into one single audit record.",
  },
];

export function TradeOracleStoryline() {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [activeStep, setActiveStep] = useState<"find" | "agree" | "pay" | "deliver" | "prove" | "resolve">("agree");
  const [evidenceVerified, setEvidenceVerified] = useState(false);

  const story = STORIES[selectedStoryIndex];

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. TOP STORY HERO (Kokonut UI Bento Design with React Bits Text)          */}
      {/* ========================================================================= */}
      <SpotlightCard className="bg-white rounded-3xl border border-stone-200/90 p-6 md:p-8 shadow-xs space-y-6 relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#ebf7d9]/60 via-transparent to-transparent pointer-events-none rounded-full blur-2xl" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-[#18280e] text-[#b2eb76] font-bold text-[10px] tracking-wide uppercase">
                TradeOracle Engine
              </span>
              <span className="text-stone-300">•</span>
              <ShinyText text="ONE TRANSACTION. ONE CONNECTED RECORD." className="text-[#3f7308] font-bold text-xs" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18280e] tracking-tight font-sans">
              {story.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              {story.storySummary}
            </p>
          </div>

          {/* Archetype Switcher: Goods (Foundry) vs Service (Software Agency) */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#f4faed] border border-[#d8e5ca] shrink-0 font-mono text-xs shadow-2xs">
            <button
              onClick={() => {
                setSelectedStoryIndex(0);
                setActiveStep("agree");
              }}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                selectedStoryIndex === 0
                  ? "bg-[#18280e] text-[#b2eb76] shadow-xs"
                  : "text-stone-600 hover:text-black"
              }`}
            >
              🏭 Goods Export ($85.7k)
            </button>
            <button
              onClick={() => {
                setSelectedStoryIndex(1);
                setActiveStep("agree");
              }}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                selectedStoryIndex === 1
                  ? "bg-[#18280e] text-[#b2eb76] shadow-xs"
                  : "text-stone-600 hover:text-black"
              }`}
            >
              💻 Service Export ($5k)
            </button>
          </div>
        </div>

        {/* 2-Entity Overview Pill Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-stone-100 font-mono text-xs relative z-10">
          {/* Foreign Buyer Box */}
          <div className="p-3.5 rounded-2xl bg-[#fbfdf9] border border-stone-200/80 space-y-1">
            <span className="text-[10px] text-stone-400 font-bold uppercase block">Foreign Buyer</span>
            <div className="flex items-center gap-2">
              <span className="text-lg">{story.buyer.flag}</span>
              <strong className="text-[#18280e] text-sm">{story.buyer.company}</strong>
            </div>
            <span className="text-[11px] text-stone-500 block">
              Contact: {story.buyer.name} • {story.buyer.city}
            </span>
          </div>

          {/* Indian Provider Box */}
          <div className="p-3.5 rounded-2xl bg-[#ebf7d9]/60 border border-[#d8e5ca] space-y-1">
            <span className="text-[10px] text-[#3f7308] font-bold uppercase block">Indian Exporter</span>
            <div className="flex items-center gap-2">
              <span className="text-lg">🇮🇳</span>
              <strong className="text-[#18280e] text-sm">{story.seller.company}</strong>
            </div>
            <span className="text-[11px] text-stone-700 block truncate">
              {story.seller.taxId}
            </span>
          </div>

          {/* Deal Value & PayPal Protection */}
          <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 space-y-1 flex flex-col justify-between">
            <span className="text-[10px] text-stone-400 font-bold uppercase block">Commercial Settlement Value</span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-extrabold text-[#18280e]">
                ${story.dealValueUSD.toLocaleString()} USD
              </span>
              <span className="text-xs font-bold text-[#3f7308] bg-[#ebf7d9] px-2 py-0.5 rounded-md">
                ≈ {story.dealValueINR}
              </span>
            </div>
            <span className="text-[10px] text-emerald-800 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#3f7308]" />
              <span>PayPal Milestone Escrow Active</span>
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. 6-STAGE INTERACTIVE JOURNEY STEPPER (Find → Agree → Pay → Deliver → Prove → Resolve) */}
        {/* ========================================================================= */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-stone-400 tracking-wider">
              Transaction Lifecycle Progress
            </span>
            <span className="text-xs font-mono text-[#3f7308] font-bold">
              Click stage to inspect connected record
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 font-mono text-xs">
            {/* Step 1: Find */}
            <button
              onClick={() => setActiveStep("find")}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                activeStep === "find"
                  ? "bg-[#18280e] text-[#b2eb76] border-[#18280e] shadow-xs"
                  : "bg-white hover:bg-[#f4faed] border-stone-200 text-[#18280e]"
              }`}
            >
              <div className="flex justify-between items-center text-[10px] opacity-70 mb-1">
                <span>01. FIND</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              </div>
              <strong className="block text-xs">Discovery</strong>
            </button>

            {/* Step 2: Agree */}
            <button
              onClick={() => setActiveStep("agree")}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                activeStep === "agree"
                  ? "bg-[#18280e] text-[#b2eb76] border-[#18280e] shadow-xs"
                  : "bg-white hover:bg-[#f4faed] border-stone-200 text-[#18280e]"
              }`}
            >
              <div className="flex justify-between items-center text-[10px] opacity-70 mb-1">
                <span>02. AGREE</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              </div>
              <strong className="block text-xs">Agreement</strong>
            </button>

            {/* Step 3: Pay */}
            <button
              onClick={() => setActiveStep("pay")}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                activeStep === "pay"
                  ? "bg-[#18280e] text-[#b2eb76] border-[#18280e] shadow-xs"
                  : "bg-white hover:bg-[#f4faed] border-stone-200 text-[#18280e]"
              }`}
            >
              <div className="flex justify-between items-center text-[10px] opacity-70 mb-1">
                <span>03. PAY</span>
                <CreditCard className="w-3 h-3 text-emerald-600" />
              </div>
              <strong className="block text-xs">PayPal Rails</strong>
            </button>

            {/* Step 4: Deliver */}
            <button
              onClick={() => setActiveStep("deliver")}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                activeStep === "deliver"
                  ? "bg-[#18280e] text-[#b2eb76] border-[#18280e] shadow-xs"
                  : "bg-white hover:bg-[#f4faed] border-stone-200 text-[#18280e]"
              }`}
            >
              <div className="flex justify-between items-center text-[10px] opacity-70 mb-1">
                <span>04. DELIVER</span>
                <Clock className="w-3 h-3 text-amber-600" />
              </div>
              <strong className="block text-xs">Fulfilment</strong>
            </button>

            {/* Step 5: Prove */}
            <button
              onClick={() => setActiveStep("prove")}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                activeStep === "prove"
                  ? "bg-[#18280e] text-[#b2eb76] border-[#18280e] shadow-xs"
                  : "bg-white hover:bg-[#f4faed] border-stone-200 text-[#18280e]"
              }`}
            >
              <div className="flex justify-between items-center text-[10px] opacity-70 mb-1">
                <span>05. PROVE</span>
                <FileCheck2 className="w-3 h-3 text-emerald-600" />
              </div>
              <strong className="block text-xs">Evidence</strong>
            </button>

            {/* Step 6: Resolve */}
            <button
              onClick={() => setActiveStep("resolve")}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                activeStep === "resolve"
                  ? "bg-[#18280e] text-[#b2eb76] border-[#18280e] shadow-xs"
                  : "bg-white hover:bg-[#f4faed] border-stone-200 text-[#18280e]"
              }`}
            >
              <div className="flex justify-between items-center text-[10px] opacity-70 mb-1">
                <span>06. RESOLVE</span>
                <Scale className="w-3 h-3 text-emerald-600" />
              </div>
              <strong className="block text-xs">Dispute Ready</strong>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. ACTIVE STAGE DEEP INSPECTION CARD (With Kokonut UI Micro-Details)      */}
        {/* ========================================================================= */}
        <div className="p-5 rounded-2xl bg-[#f8fbf5] border border-[#d8e5ca] space-y-4 font-mono text-xs animate-in fade-in">
          {/* STAGE 1: FIND */}
          {activeStep === "find" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-[#18280e]">
                  Stage 1: International Counterparty Discovery &amp; Demand
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  VERIFIED BUYER DEMAND
                </span>
              </div>
              <p className="text-stone-700 leading-relaxed text-xs">{story.stages.find.description}</p>
              <div className="p-3.5 rounded-xl bg-white border border-stone-200 text-stone-800">
                <span className="text-stone-400 block text-[10px] uppercase font-bold mb-1">Demand Parameters</span>
                {story.stages.find.detail}
              </div>
            </div>
          )}

          {/* STAGE 2: AGREE */}
          {activeStep === "agree" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-[#18280e]">
                  Stage 2: Digital Agreement &amp; Specifications Lock (What Was Promised)
                </span>
                <span className="text-stone-500 text-xs">Contract Signed: {story.stages.agree.contractDate}</span>
              </div>

              {/* Specifications Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {story.stages.agree.specs.map((spec, sIdx) => (
                  <div key={sIdx} className="p-3 rounded-xl bg-white border border-stone-200 flex items-center gap-2">
                    <span className="text-[#3f7308] font-bold">✓</span>
                    <span className="text-xs text-stone-800">{spec}</span>
                  </div>
                ))}
              </div>

              {/* Milestones Schedule */}
              <div className="space-y-2">
                <span className="text-[10px] text-stone-500 uppercase font-bold block">
                  Milestone Disbursement Schedule
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {story.stages.agree.milestones.map((m, mIdx) => (
                    <div key={mIdx} className="p-3 rounded-xl bg-white border border-stone-200 flex justify-between items-center">
                      <div>
                        <strong className="text-[#18280e] block text-xs">{m.name}</strong>
                        <span className="text-[11px] text-stone-500">{m.amount}</span>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                        m.status === "CAPTURED" || m.status === "COMPLETED" || m.status === "PASSED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: PAY */}
          {activeStep === "pay" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-[#18280e]">
                  Stage 3: PayPal Financial Rails Execution (What Was Paid)
                </span>
                <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold text-[10px]">
                  STATUS: {story.stages.pay.status}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                  <span className="text-stone-500">PayPal Order ID:</span>
                  <strong className="text-[#18280e] font-mono text-sm">
                    <DecryptedText text={story.stages.pay.orderId} animateOn="view" speed={30} />
                  </strong>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                  <span className="text-stone-500">Amount Captured into Escrow:</span>
                  <strong className="text-[#3f7308] font-bold text-sm">{story.stages.pay.amountPaid}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Beneficiary Merchant Sandbox:</span>
                  <span className="text-stone-700">{story.stages.pay.payeeEmail}</span>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: DELIVER */}
          {activeStep === "deliver" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-[#18280e]">
                  Stage 4: Fulfilment Execution (What Was Delivered)
                </span>
                <span className="text-stone-500 text-xs">Date: {story.stages.deliver.date}</span>
              </div>
              <div className="p-4 rounded-xl bg-white border border-stone-200 text-stone-800 leading-relaxed text-xs">
                {story.stages.deliver.summary}
              </div>
            </div>
          )}

          {/* STAGE 5: PROVE */}
          {activeStep === "prove" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-[#18280e]">
                  Stage 5: Connected Fulfilment Proof (What Was Proved)
                </span>
                <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold text-[10px]">
                  ALL EVIDENCE CRYPTOGRAPHICALLY TIMESTAMPED
                </span>
              </div>

              <div className="space-y-2">
                {story.stages.prove.items.map((item, iIdx) => (
                  <div key={iIdx} className="p-3.5 rounded-xl bg-white border border-stone-200 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#3f7308] shrink-0" />
                      <div>
                        <strong className="text-[#18280e] block text-xs">{item.label}</strong>
                        <span className="text-[11px] text-stone-500 font-mono">
                          Ref: <DecryptedText text={item.code} animateOn="hover" speed={25} />
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      VERIFIED AUDIT
                    </span>
                  </div>
                ))}
              </div>

              {evidenceVerified && (
                <div className="p-3 rounded-xl bg-[#ebf7d9] text-[#18280e] font-bold text-xs flex items-center gap-2 animate-in fade-in">
                  <ShieldCheck className="w-4 h-4 text-[#3f7308]" />
                  <span>Statutory evidence verified and locked. Ready for PayPal Resolution Center or CA export.</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <HoldToConfirm
                  onConfirm={() => setEvidenceVerified(true)}
                  label="Hold to Verify Statutory Evidence Pack"
                  confirmedLabel="✓ Evidence Pack Audited & Locked"
                />
              </div>
            </div>
          )}

          {/* STAGE 6: RESOLVE */}
          {activeStep === "resolve" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-[#18280e]">
                  Stage 6: Dispute Assistance &amp; CA Compliance Pack (Resolve)
                </span>
                <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold text-[10px]">
                  {story.stages.resolve.disputeStatus}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2 text-stone-700 leading-relaxed text-xs">
                <span className="font-bold text-[#18280e] block">
                  Why TradeOracle Solves Cross-Border Chargeback Disputes:
                </span>
                <p>{story.stages.resolve.explanation}</p>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-stone-200">
                <span className="text-xs text-stone-500 font-mono">
                  Chartered Accountant (CA) EDPMS &amp; Inward Remittance File: <strong>READY</strong>
                </span>
                <KokonutButton
                  variant="primary"
                  size="sm"
                  withMagnet
                  onClick={() => alert("Downloading TradeOracle CA-accessible transaction pack (.ZIP)...")}
                >
                  Download CA Pack (.ZIP)
                </KokonutButton>
              </div>
            </div>
          )}
        </div>
      </SpotlightCard>
    </div>
  );
}
