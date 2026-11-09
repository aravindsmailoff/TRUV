"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Building2,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  CreditCard,
  Ship,
  Sparkles,
  Cpu,
  Scale,
  FileSpreadsheet,
  RefreshCw,
} from "lucide-react";
import { Magnet } from "@/components/reactbits/Magnet";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { DecryptedText } from "@/components/reactbits/DecryptedText";
import { ShinyText } from "@/components/reactbits/ShinyText";
import { SEED_MANUFACTURERS, SEED_RFQS } from "@/lib/trade/tradeStore";

type TabKey = "rfq" | "mfg" | "commercial" | "paypal" | "logistics" | "moat";

export function TradeExecutionSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("rfq");

  // RFQ Selection
  const [selectedRfqId, setSelectedRfqId] = useState<string>(SEED_RFQS[0].id);
  const currentRfq = SEED_RFQS.find((r) => r.id === selectedRfqId) || SEED_RFQS[0];

  // Manufacturer Selection
  const [selectedMfgId, setSelectedMfgId] = useState<string>(SEED_MANUFACTURERS[0].id);
  const currentMfg = SEED_MANUFACTURERS.find((m) => m.id === selectedMfgId) || SEED_MANUFACTURERS[0];

  // Commercial Negotiation & AI Discrepancy Simulator
  const [simPoAmount, setSimPoAmount] = useState<number>(142500);
  const [simInvoiceAmount, setSimInvoiceAmount] = useState<number>(142500);
  const [simQuantity, setSimQuantity] = useState<number>(5000);
  const [simIncoterm, setSimIncoterm] = useState<"FOB Mundra" | "CIF Los Angeles">("FOB Mundra");

  // PayPal Milestone Payment Calculator
  const [orderValue, setOrderValue] = useState<number>(142500);
  const [paypalSimStatus, setPaypalSimStatus] = useState<"ready" | "authorizing" | "captured">("ready");
  const advanceDeposit = Math.round(orderValue * 0.3);
  const balanceAmount = orderValue - advanceDeposit;
  const estimatedPaypalFee = Math.round(advanceDeposit * 0.0349 + 0.49);

  // Compute live AI discrepancy flags
  const priceDiscrepancy = simPoAmount !== simInvoiceAmount;
  const discrepancyDelta = Math.abs(simPoAmount - simInvoiceAmount);

  return (
    <section id="trade-execution" className="relative overflow-hidden bg-white text-black pt-20 md:pt-28 lg:pt-36 pb-20">
      {/* Top Margin Ruler Ticks Decoration */}
      <div className="max-w-[80rem] mx-auto px-5 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-x-2.5 sm:gap-x-3 mb-3.5 px-3.5 py-1.5 rounded-full bg-[#f4faed] border border-[#d8e5ca]">
            <div className="size-2 rounded-full bg-[#3f7308] animate-pulse" />
            <span className="opacity-90 text-xs font-mono font-semibold uppercase tracking-wider text-[#18280E]">
              Technology-Powered International Trade Operator
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-medium tracking-tight text-[#18280E] max-w-4xl leading-[1.15]">
            Connecting global buyers with Indian industrial manufacturers
          </h2>

          {/* Subheading */}
          <div className="prose max-w-3xl opacity-80 text-stone-700 text-sm sm:text-base leading-relaxed mt-3.5 sm:mt-4">
            <p>
              We operate end-to-end international trade execution: from buyer demand discovery and MSME manufacturer
              qualification, to commercial purchase orders, PayPal milestone invoicing, QIMA inspections, and freight
              forwarding to international ports.
            </p>
          </div>

          {/* Quick Active Corridor Pill */}
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#ebf7d9] text-[#18280e] text-xs font-mono border border-[#3f7308]/20">
            <span className="size-1.5 rounded-full bg-[#3f7308]" />
            <ShinyText text="Active Corridors: USA / Europe / UK → Moradabad, Tirupur & Rajkot MSME Hubs" speed={3} />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* WATERMELON UI WORKBENCH CONTAINER WITH CHAMFERED CORNERS */}
        {/* ========================================================================= */}
        <div className="mt-12 lg:mt-16">
          <div
            className="relative bg-[#18280e] text-white rounded-2xl border border-[#2d421d] shadow-2xl overflow-hidden"
            style={{ "--corner-size-desktop": "17px", "--corner-size-mobile": "13px" } as React.CSSProperties}
          >
            {/* Cut Corners (Visual Identity Preservation) */}
            <div className="pointer-events-none absolute inset-0 z-20">
              <div className="cut-corner absolute bg-white" style={{ top: "-1px", left: "-1px", clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
              <div className="cut-corner absolute bg-white" style={{ top: "-1px", right: "-1px", clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
              <div className="cut-corner absolute bg-white" style={{ bottom: "-1px", left: "-1px", clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />
              <div className="cut-corner absolute bg-white" style={{ bottom: "-1px", right: "-1px", clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }} />
            </div>

            {/* Top Bar: Live Node Status & Network Latency */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3.5 border-b border-[#2d421d] bg-[#121c0b] text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b2eb76] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b2eb76]" />
                </span>
                <span className="font-semibold text-[#b2eb76] uppercase tracking-wider">TRUV TRADE ENGINE V2.4</span>
                <span className="text-stone-400">|</span>
                <span className="text-stone-300">PayPal Orders v2 Rails Active</span>
              </div>

              <div className="flex items-center gap-4 text-stone-400">
                <span className="hidden sm:inline">Verification: <strong className="text-stone-200">DGFT &amp; ICEGATE</strong></span>
                <span className="hidden sm:inline">Auditors: <strong className="text-stone-200">QIMA / SGS</strong></span>
                <span className="px-2 py-0.5 rounded bg-[#223514] text-[#b2eb76] border border-[#3b5424]">LIVE CONSOLE</span>
              </div>
            </div>

            {/* Tabbed Navigation (Watermelon UI Modular Pills) */}
            <div className="flex items-center gap-1.5 p-3 sm:p-4 border-b border-[#2d421d] bg-[#14200c] overflow-x-auto select-none scrollbar-none">
              {[
                { id: "rfq", label: "1. Buyer RFQ Demand", icon: Globe, count: "3 Active" },
                { id: "mfg", label: "2. MSME Vetting & Clusters", icon: Building2, count: "3 Hubs" },
                { id: "commercial", label: "3. Commercial Negotiation (AI)", icon: Scale, count: "PO vs PI" },
                { id: "paypal", label: "4. PayPal Milestone Escrow", icon: CreditCard, count: "30% / 70%" },
                { id: "logistics", label: "5. Logistics & Customs Handover", icon: Ship, count: "Maersk + QIMA" },
                { id: "moat", label: "6. Trade Intelligence Moat", icon: Sparkles, count: "Real Data" },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabKey)}
                    className={`group shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-[#b2eb76] text-[#18280e] font-semibold shadow-md"
                        : "text-stone-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#18280e]" : "text-[#b2eb76]"}`} />
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded ${
                        isActive ? "bg-[#18280e]/15 text-[#18280e]" : "bg-white/5 text-stone-400 group-hover:text-stone-200"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT PANELS */}
            <div className="p-5 sm:p-7 lg:p-9 min-h-[520px]">
              {/* ========================================================================= */}
              {/* TAB 1: BUYER RFQ DEMAND */}
              {/* ========================================================================= */}
              {activeTab === "rfq" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2d421d] pb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                        <Globe className="w-5 h-5 text-[#b2eb76]" />
                        International Buyer Demand &amp; Genuine RFQ Pipeline
                      </h3>
                      <p className="text-xs text-stone-400 font-mono mt-1">
                        Actual foreign purchase requests matching vetted Indian manufacturing lines.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-stone-400">Select active requirement:</span>
                      <div className="flex gap-1.5">
                        {SEED_RFQS.map((r, i) => (
                          <button
                            key={r.id}
                            onClick={() => setSelectedRfqId(r.id)}
                            className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
                              selectedRfqId === r.id
                                ? "bg-[#b2eb76] text-[#18280e] font-bold border-[#b2eb76]"
                                : "bg-[#121c0b] text-stone-300 border-[#2d421d] hover:border-stone-500"
                            }`}
                          >
                            RFQ #{i + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Active RFQ Card */}
                  <SpotlightCard className="p-5 sm:p-6 rounded-xl bg-[#121c0b] border border-[#2d421d] text-stone-200">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left: Buyer Details */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-mono text-[#b2eb76] uppercase">
                          <Building2 className="w-4 h-4" />
                          <span>Buyer Profile &amp; Corridor</span>
                        </div>
                        <h4 className="text-xl font-medium text-white">{currentRfq.buyerCompany}</h4>
                        <div className="text-xs space-y-1.5 font-mono text-stone-400">
                          <div>Contact: <span className="text-stone-200">{currentRfq.buyerName}</span></div>
                          <div>Country: <span className="text-stone-200">{currentRfq.buyerCountry}</span></div>
                          <div>Destination Port: <span className="text-[#b2eb76]">{currentRfq.destinationPort}</span></div>
                          <div>Incoterm Required: <span className="text-stone-200">FOB Indian Port</span></div>
                          <div>Payment Terms: <span className="text-[#b2eb76]">30% Advance via PayPal / 70% BL</span></div>
                        </div>

                        <div className="pt-2">
                          <span className="inline-block px-2.5 py-1 text-[11px] font-mono rounded bg-[#223514] text-[#b2eb76] border border-[#3b5424]">
                            Verified RFQ: {currentRfq.rfqNumber}
                          </span>
                        </div>
                      </div>

                      {/* Middle: Product & Technical Specs */}
                      <div className="space-y-4 lg:col-span-2 border-t lg:border-t-0 lg:border-l border-[#2d421d] pt-4 lg:pt-0 lg:pl-6">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-[#b2eb76] uppercase flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Extracted Technical Specifications
                          </span>
                          <span className="text-xs font-mono text-stone-400">
                            Target: <strong className="text-white">{currentRfq.targetQuantity.toLocaleString()} Units</strong> @ <strong className="text-[#b2eb76]">${currentRfq.targetPricePerUnit}/unit</strong>
                          </span>
                        </div>

                        <div className="text-sm font-medium text-white bg-[#18280e] p-3 rounded-lg border border-[#2d421d]">
                          {currentRfq.productName}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                          {currentRfq.technicalSpecifications.map((spec, idx) => (
                            <div key={idx} className="flex items-start gap-2 bg-[#14200c] p-2.5 rounded border border-[#2d421d]/70">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#b2eb76] shrink-0 mt-0.5" />
                              <span className="text-stone-300">{spec}</span>
                            </div>
                          ))}
                        </div>

                        {/* Financial Snapshot */}
                        <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-lg bg-[#223514]/70 border border-[#3b5424] text-xs font-mono">
                          <div>
                            <span className="text-stone-400 block">Total Est. Contract Value:</span>
                            <span className="text-lg font-bold text-[#b2eb76]">
                              ${(currentRfq.targetQuantity * currentRfq.targetPricePerUnit).toLocaleString()} USD
                            </span>
                          </div>

                          <div>
                            <span className="text-stone-400 block">30% Advance Production Escrow:</span>
                            <span className="text-sm font-semibold text-white">
                              ${Math.round(currentRfq.targetQuantity * currentRfq.targetPricePerUnit * 0.3).toLocaleString()} USD
                            </span>
                          </div>

                          <Magnet padding={15} magnetStrength={2}>
                            <button
                              onClick={() => {
                                setOrderValue(currentRfq.targetQuantity * currentRfq.targetPricePerUnit);
                                setActiveTab("mfg");
                              }}
                              className="px-4 py-2 rounded-md bg-[#b2eb76] text-[#18280e] font-semibold text-xs inline-flex items-center gap-1.5 hover:bg-[#b2eb76]/90 transition-all cursor-pointer"
                            >
                              <span>Find Qualified Manufacturers</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </Magnet>
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 2: MSME VETTING & CLUSTERS */}
              {/* ========================================================================= */}
              {activeTab === "mfg" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2d421d] pb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-[#b2eb76]" />
                        Indian MSME Manufacturer Discovery &amp; Qualification
                      </h3>
                      <p className="text-xs text-stone-400 font-mono mt-1">
                        Separating independently verified statutory and physical audits from manufacturer claims.
                      </p>
                    </div>

                    <div className="flex gap-1.5">
                      {SEED_MANUFACTURERS.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMfgId(m.id)}
                          className={`px-3 py-1.5 text-xs font-mono rounded border transition-colors ${
                            selectedMfgId === m.id
                              ? "bg-[#b2eb76] text-[#18280e] font-bold border-[#b2eb76]"
                              : "bg-[#121c0b] text-stone-300 border-[#2d421d] hover:border-stone-500"
                          }`}
                        >
                          {m.hubLocation.split(",")[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manufacturer Profile Spotlight Card */}
                  <SpotlightCard className="p-5 sm:p-6 rounded-xl bg-[#121c0b] border border-[#2d421d] text-stone-200">
                    <div className="flex flex-col lg:flex-row justify-between gap-6 pb-6 border-b border-[#2d421d]">
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="text-xl font-bold text-white">{currentMfg.legalEntityName}</h4>
                          <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-[#223514] text-[#b2eb76] border border-[#3b5424]">
                            {currentMfg.msmeCategory.toUpperCase()} ENTERPRISE
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 font-mono mt-1">
                          Trade Name: <strong className="text-stone-200">{currentMfg.tradeName}</strong> | Cluster: <strong className="text-[#b2eb76]">{currentMfg.hubLocation}</strong>
                        </p>
                      </div>

                      {/* Export Readiness Score Badge */}
                      <div className="flex items-center gap-4 bg-[#18280e] px-4 py-2 rounded-lg border border-[#2d421d]">
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-stone-400 block uppercase">Export Readiness</span>
                          <span className="text-xl font-bold text-[#b2eb76]">{currentMfg.readinessScore}/100</span>
                        </div>
                        <div className="size-10 rounded-full border-2 border-[#b2eb76] flex items-center justify-center font-mono text-xs font-bold text-[#b2eb76]">
                          ✓
                        </div>
                      </div>
                    </div>

                    {/* Vetting Comparison Grid: Verified vs Claims */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {/* Left: Independently Verified Government & Audit Records */}
                      <div className="p-4 rounded-lg bg-[#14200c] border border-[#3b5424]/60 space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono text-[#b2eb76]">
                          <span className="flex items-center gap-1.5 font-bold uppercase">
                            <ShieldCheck className="w-4 h-4 text-[#b2eb76]" />
                            Independently Verified Evidence
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-[#223514] text-[10px]">DGFT + ICEGATE</span>
                        </div>

                        <div className="space-y-2 text-xs font-mono text-stone-300">
                          <div className="flex justify-between py-1 border-b border-[#2d421d]">
                            <span className="text-stone-400">DGFT IEC Code:</span>
                            <span className="text-white font-semibold">
                              <DecryptedText text={currentMfg.iecCode} speed={30} />
                            </span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-[#2d421d]">
                            <span className="text-stone-400">GSTIN Tax Registration:</span>
                            <span className="text-white font-semibold">
                              <DecryptedText text={currentMfg.gstin} speed={30} />
                            </span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-[#2d421d]">
                            <span className="text-stone-400">Udyam MSME Certificate:</span>
                            <span className="text-white">{currentMfg.udyamRegistrationNumber}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-[#2d421d]">
                            <span className="text-stone-400">Physical Factory Audit:</span>
                            <span className="text-[#b2eb76] font-semibold">{currentMfg.auditedBy}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-stone-400">PayPal Merchant ID:</span>
                            <span className="text-stone-200">{currentMfg.paypalMerchantId}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Verified Production Infrastructure */}
                      <div className="p-4 rounded-lg bg-[#14200c] border border-[#2d421d] space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono text-stone-300">
                          <span className="flex items-center gap-1.5 font-bold uppercase text-white">
                            <Cpu className="w-4 h-4 text-[#b2eb76]" />
                            Audited Production Lines &amp; Capacity
                          </span>
                          <span className="text-[#b2eb76] font-mono text-xs">
                            {currentMfg.monthlyCapacityUnits.toLocaleString()} units/mo
                          </span>
                        </div>

                        <div className="space-y-1.5 text-xs font-mono">
                          {currentMfg.verifiedProductionLines.map((line, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-1.5 rounded bg-[#18280e] border border-[#2d421d]">
                              <span className="size-1.5 rounded-full bg-[#b2eb76]" />
                              <span className="text-stone-300">{line}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 flex flex-wrap gap-1.5">
                          {currentMfg.certifications.map((c, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-[#223514] text-[10px] font-mono text-[#b2eb76] border border-[#3b5424]">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Magnet padding={15} magnetStrength={2}>
                        <button
                          onClick={() => setActiveTab("commercial")}
                          className="px-5 py-2.5 rounded-md bg-[#b2eb76] text-[#18280e] font-semibold text-xs inline-flex items-center gap-2 hover:bg-[#b2eb76]/90 transition-all cursor-pointer"
                        >
                          <span>Proceed to Commercial Negotiation &amp; AI Analysis</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </Magnet>
                    </div>
                  </SpotlightCard>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 3: COMMERCIAL NEGOTIATION & AI DISCREPANCY DETECTOR */}
              {/* ========================================================================= */}
              {activeTab === "commercial" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2d421d] pb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                        <Scale className="w-5 h-5 text-[#b2eb76]" />
                        Commercial Purchase Order vs. Proforma Invoice Discrepancy Engine
                      </h3>
                      <p className="text-xs text-stone-400 font-mono mt-1">
                        Real-time AI discrepancy detection cross-referencing commercial terms, UCP 600 export rules, and pricing.
                      </p>
                    </div>

                    {/* Live Discrepancy Status Banner */}
                    <div className={`px-3 py-1.5 rounded-md font-mono text-xs flex items-center gap-2 ${
                      priceDiscrepancy
                        ? "bg-amber-950/80 text-amber-300 border border-amber-600 animate-pulse"
                        : "bg-[#223514] text-[#b2eb76] border border-[#3b5424]"
                    }`}>
                      {priceDiscrepancy ? (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span>AI WARNING: Price Variance (${discrepancyDelta.toLocaleString()})</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#b2eb76]" />
                          <span>0 DISCREPANCIES — UCP 600 COMPLIANT</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Side-by-Side Comparison Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Buyer Purchase Order */}
                    <SpotlightCard className="p-5 rounded-xl bg-[#121c0b] border border-[#2d421d] space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-[#2d421d]">
                        <span className="text-xs font-mono text-[#b2eb76] uppercase font-bold flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Buyer Purchase Order (PO-9921)
                        </span>
                        <span className="text-[11px] font-mono text-stone-400">Pacific Arch Hardware</span>
                      </div>

                      <div className="space-y-3 text-xs font-mono">
                        <div>
                          <label className="text-stone-400 block mb-1">Declared PO Amount ($ USD):</label>
                          <input
                            type="number"
                            value={simPoAmount}
                            onChange={(e) => setSimPoAmount(Number(e.target.value))}
                            className="w-full bg-[#18280e] border border-[#2d421d] px-3 py-2 rounded text-white font-mono focus:outline-none focus:border-[#b2eb76]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-stone-400 block mb-1">Quantity (Units):</label>
                            <input
                              type="number"
                              value={simQuantity}
                              onChange={(e) => setSimQuantity(Number(e.target.value))}
                              className="w-full bg-[#18280e] border border-[#2d421d] px-3 py-2 rounded text-white font-mono focus:outline-none focus:border-[#b2eb76]"
                            />
                          </div>
                          <div>
                            <label className="text-stone-400 block mb-1">Agreed Incoterm:</label>
                            <select
                              value={simIncoterm}
                              onChange={(e) => setSimIncoterm(e.target.value as "FOB Mundra" | "CIF Los Angeles")}
                              className="w-full bg-[#18280e] border border-[#2d421d] px-3 py-2 rounded text-white font-mono focus:outline-none focus:border-[#b2eb76]"
                            >
                              <option value="FOB Mundra">FOB Mundra</option>
                              <option value="CIF Los Angeles">CIF Los Angeles</option>
                            </select>
                          </div>
                        </div>

                        <div className="p-2.5 rounded bg-[#14200c] border border-[#2d421d] text-stone-400 space-y-1">
                          <div>Payment Terms: <strong>30% Deposit via PayPal / 70% vs BL</strong></div>
                          <div>HS Tariff Code: <strong>8302.41.10 (Architectural Brass)</strong></div>
                        </div>
                      </div>
                    </SpotlightCard>

                    {/* Manufacturer Proforma Invoice */}
                    <SpotlightCard className="p-5 rounded-xl bg-[#121c0b] border border-[#2d421d] space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-[#2d421d]">
                        <span className="text-xs font-mono text-[#b2eb76] uppercase font-bold flex items-center gap-2">
                          <FileSpreadsheet className="w-4 h-4" />
                          Seller Proforma Invoice (PI-2026-48)
                        </span>
                        <span className="text-[11px] font-mono text-stone-400">Moradabad Precision Foundry</span>
                      </div>

                      <div className="space-y-3 text-xs font-mono">
                        <div>
                          <label className="text-stone-400 block mb-1">Invoice Billing Amount ($ USD):</label>
                          <input
                            type="number"
                            value={simInvoiceAmount}
                            onChange={(e) => setSimInvoiceAmount(Number(e.target.value))}
                            className="w-full bg-[#18280e] border border-[#2d421d] px-3 py-2 rounded text-white font-mono focus:outline-none focus:border-[#b2eb76]"
                          />
                        </div>

                        <div className="p-2.5 rounded bg-[#14200c] border border-[#2d421d] text-stone-300 space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-stone-400">Invoiced Unit Price:</span>
                            <span>${(simInvoiceAmount / simQuantity).toFixed(2)} / unit</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-400">Delivery Port:</span>
                            <span className="text-[#b2eb76]">{simIncoterm}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-400">Manufacturer DGFT IEC:</span>
                            <span>0508012491</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => setSimInvoiceAmount(simPoAmount)}
                            className="px-3 py-1.5 rounded bg-[#223514] text-[#b2eb76] border border-[#3b5424] text-[11px] hover:bg-[#3b5424] transition-colors"
                          >
                            Auto-Reconcile Amounts
                          </button>
                          <button
                            onClick={() => setSimInvoiceAmount(simPoAmount + 3500)}
                            className="px-3 py-1.5 rounded bg-white/5 text-stone-400 hover:text-white text-[11px] transition-colors"
                          >
                            Simulate Discrepancy
                          </button>
                        </div>
                      </div>
                    </SpotlightCard>
                  </div>

                  {/* AI Resolution Protocol Card */}
                  <div className="p-4 rounded-xl bg-[#14200c] border border-[#2d421d] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs font-mono text-stone-300 flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-[#b2eb76] shrink-0" />
                      <span>
                        AI verifies consistency between buyer RFQ, seller quotation, PO, and proforma invoice before unlocking milestone payment rails.
                      </span>
                    </div>

                    <Magnet padding={15} magnetStrength={2}>
                      <button
                        onClick={() => {
                          setOrderValue(simInvoiceAmount);
                          setActiveTab("paypal");
                        }}
                        className="px-5 py-2.5 rounded-md bg-[#b2eb76] text-[#18280e] font-semibold text-xs inline-flex items-center gap-2 hover:bg-[#b2eb76]/90 transition-all cursor-pointer shrink-0"
                      >
                        <span>Lock Contract &amp; Initialize PayPal Milestone Escrow</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </Magnet>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 4: PAYPAL MILESTONE ESCROW & FINANCIAL EXECUTION */}
              {/* ========================================================================= */}
              {activeTab === "paypal" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2d421d] pb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-[#b2eb76]" />
                        PayPal-Powered Financial Execution Layer (Orders v2)
                      </h3>
                      <p className="text-xs text-stone-400 font-mono mt-1">
                        Supporting international buyer payments to eligible Indian merchants with verified milestone disbursements.
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#223514] text-[#b2eb76] text-xs font-mono border border-[#3b5424]">
                      <span className="size-2 rounded-full bg-[#b2eb76] animate-pulse" />
                      <span>PayPal Orders v2 REST API Connected</span>
                    </div>
                  </div>

                  {/* Interactive Order Value Slider & Milestone Split */}
                  <SpotlightCard className="p-5 sm:p-6 rounded-xl bg-[#121c0b] border border-[#2d421d] space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-stone-400">Interactive Commercial Order Value:</span>
                        <span className="text-lg font-bold text-[#b2eb76]">${orderValue.toLocaleString()} USD</span>
                      </div>
                      <input
                        type="range"
                        min="20000"
                        max="300000"
                        step="2500"
                        value={orderValue}
                        onChange={(e) => setOrderValue(Number(e.target.value))}
                        className="w-full h-2 bg-[#18280e] rounded-lg appearance-none cursor-pointer accent-[#b2eb76]"
                      />
                    </div>

                    {/* Milestone Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Milestone 1: 30% Advance Deposit */}
                      <div className="p-4 rounded-xl bg-[#14200c] border border-[#3b5424] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-[#b2eb76] font-bold uppercase">
                            Milestone 1 (30% Advance Deposit)
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#223514] text-[#b2eb76]">
                            Pre-Production
                          </span>
                        </div>

                        <div className="text-2xl font-bold text-white font-mono">
                          ${advanceDeposit.toLocaleString()} <span className="text-xs text-stone-400 font-normal">USD</span>
                        </div>

                        <div className="text-xs font-mono text-stone-300 space-y-1.5 border-t border-[#2d421d] pt-2">
                          <div>Release Trigger: <strong>Signed Contract &amp; Tooling Initiation</strong></div>
                          <div>PayPal Capture ID: <strong className="text-stone-200">CAPTURE_ID_PP_849201</strong></div>
                          <div>Estimated Fee (3.49% + $0.49): <span className="text-stone-400">~${estimatedPaypalFee}</span></div>
                        </div>

                        <div className="pt-2">
                          {paypalSimStatus === "ready" && (
                            <button
                              onClick={() => {
                                setPaypalSimStatus("authorizing");
                                setTimeout(() => setPaypalSimStatus("captured"), 1400);
                              }}
                              className="w-full py-2.5 rounded-md bg-[#b2eb76] text-[#18280e] font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#b2eb76]/90 transition-all cursor-pointer"
                            >
                              <span>Authorize 30% Advance via PayPal</span>
                              <CreditCard className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {paypalSimStatus === "authorizing" && (
                            <div className="w-full py-2.5 rounded-md bg-[#223514] text-[#b2eb76] font-mono text-xs flex items-center justify-center gap-2 border border-[#3b5424]">
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Processing Webhook: PAYMENT.CAPTURE.PENDING...</span>
                            </div>
                          )}

                          {paypalSimStatus === "captured" && (
                            <div className="w-full py-2.5 rounded-md bg-[#18280e] text-[#b2eb76] font-mono text-xs flex items-center justify-center gap-2 border border-[#b2eb76]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Captured: PP_CAP_9941 (Disbursed to Manufacturer)</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Milestone 2: 70% Balance upon Bill of Lading */}
                      <div className="p-4 rounded-xl bg-[#14200c] border border-[#2d421d] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-stone-300 font-bold uppercase">
                            Milestone 2 (70% Balance on BL)
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-stone-400">
                            Post-Customs
                          </span>
                        </div>

                        <div className="text-2xl font-bold text-white font-mono">
                          ${balanceAmount.toLocaleString()} <span className="text-xs text-stone-400 font-normal">USD</span>
                        </div>

                        <div className="text-xs font-mono text-stone-300 space-y-1.5 border-t border-[#2d421d] pt-2">
                          <div>Release Trigger: <strong>Verified Ocean Bill of Lading &amp; Customs LEO</strong></div>
                          <div>Inspection Prerequisite: <strong className="text-[#b2eb76]">QIMA AQL 1.5 Certificate</strong></div>
                          <div>Status: <span className="text-stone-400">Escrow Held in PayPal Authorised Layer</span></div>
                        </div>

                        <div className="pt-2">
                          <button
                            onClick={() => setActiveTab("logistics")}
                            className="w-full py-2.5 rounded-md bg-white/5 text-stone-300 font-mono text-xs hover:bg-white/10 hover:text-white transition-all cursor-pointer border border-[#2d421d] flex items-center justify-center gap-2"
                          >
                            <span>Inspect Logistics &amp; Customs Handover</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Regulatory Transparency Disclaimer */}
                    <div className="p-3.5 rounded-lg bg-[#14200c] border border-[#2d421d] text-[11px] font-mono text-stone-400 leading-relaxed">
                      <strong className="text-stone-200">Regulatory Infrastructure Architecture:</strong> TRUV coordinates
                      international commercial transactions directly through approved PayPal merchant rails and verified banking
                      partners. TRUV does not hold unapproved customer deposits or operate unauthorised escrow accounts. All payment
                      milestones map directly to verified DGFT, ICEGATE, and ocean carrier events.
                    </div>
                  </SpotlightCard>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 5: LOGISTICS, INSPECTION & CUSTOMS HANDOVER */}
              {/* ========================================================================= */}
              {activeTab === "logistics" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2d421d] pb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                        <Ship className="w-5 h-5 text-[#b2eb76]" />
                        International Logistics, Third-Party Inspection &amp; Customs Handover
                      </h3>
                      <p className="text-xs text-stone-400 font-mono mt-1">
                        Recognising that MSMEs require verified external partners for testing, customs brokerage, and ocean freight.
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded bg-[#223514] text-[#b2eb76] font-mono text-xs border border-[#3b5424]">
                      Container ID: MSKU948201
                    </span>
                  </div>

                  {/* 6-Stage Milestone Execution Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Step 1: Pre-Shipment Inspection */}
                    <SpotlightCard className="p-4 rounded-xl bg-[#121c0b] border border-[#2d421d] space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#b2eb76] font-bold">1. QIMA / SGS Audit</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#223514] text-[#b2eb76]">PASSED</span>
                      </div>
                      <div className="text-sm font-semibold text-white">Pre-Shipment Quality Testing</div>
                      <p className="text-xs text-stone-400 font-mono">
                        AQL 1.5 critical defects test passed on factory floor in Moradabad. Certificate #QIMA-IND-8821 attached.
                      </p>
                    </SpotlightCard>

                    {/* Step 2: Indian Customs Filing (ICEGATE) */}
                    <SpotlightCard className="p-4 rounded-xl bg-[#121c0b] border border-[#2d421d] space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#b2eb76] font-bold">2. ICEGATE Brokerage</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#223514] text-[#b2eb76]">LEO ISSUED</span>
                      </div>
                      <div className="text-sm font-semibold text-white">Export Customs Clearance</div>
                      <p className="text-xs text-stone-400 font-mono">
                        Shipping Bill #SB-9201948 cleared by Indian Customs at Mundra Port. Let Export Order (LEO) confirmed.
                      </p>
                    </SpotlightCard>

                    {/* Step 3: Ocean Freight & Bill of Lading */}
                    <SpotlightCard className="p-4 rounded-xl bg-[#121c0b] border border-[#2d421d] space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#b2eb76] font-bold">3. Maersk Line Ocean</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300">IN TRANSIT</span>
                      </div>
                      <div className="text-sm font-semibold text-white">Ocean Bill of Lading Tracking</div>
                      <p className="text-xs text-stone-400 font-mono">
                        Vessel MAERSK SELETAR (Voyage 2603W). ETD Mundra: Nov 12 → ETA Los Angeles: Dec 04, 2026.
                      </p>
                    </SpotlightCard>
                  </div>

                  {/* Complete Handover Progress Bar */}
                  <div className="p-5 rounded-xl bg-[#14200c] border border-[#2d421d] space-y-4">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-stone-300">Overall Trade Execution Progress:</span>
                      <span className="text-[#b2eb76] font-bold">80% COMPLETED (Awaiting Port Arrival)</span>
                    </div>

                    <div className="w-full h-3 bg-[#18280e] rounded-full overflow-hidden p-0.5 border border-[#2d421d]">
                      <div className="h-full bg-gradient-to-r from-[#3f7308] to-[#b2eb76] rounded-full w-[80%]" />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-stone-400 pt-1">
                      <div>✓ RFQ &amp; Contract: <span className="text-stone-200">100%</span></div>
                      <div>✓ 30% PayPal Deposit: <span className="text-stone-200">Released</span></div>
                      <div>✓ QIMA Inspection: <span className="text-stone-200">Passed</span></div>
                      <div>⏳ 70% Final Balance: <span className="text-[#b2eb76]">On Vessel BL</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 6: THE REAL COMPETITIVE MOAT (ACCUMULATED INTELLIGENCE) */}
              {/* ========================================================================= */}
              {activeTab === "moat" && (
                <div className="space-y-6">
                  <div className="border-b border-[#2d421d] pb-4">
                    <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#b2eb76]" />
                      The Real Competitive Moat: Proprietary Accumulated Trade Intelligence
                    </h3>
                    <p className="text-xs text-stone-400 font-mono mt-1">
                      Our advantage is not generic AI or a basic directory: it is real, verified execution intelligence
                      accumulated across commercial purchase orders, PayPal reconciliations, and factory audits.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SpotlightCard className="p-4 rounded-xl bg-[#121c0b] border border-[#2d421d] space-y-1">
                      <span className="text-[11px] font-mono text-stone-400 block uppercase">Trade Volume Coordinated</span>
                      <div className="text-2xl font-bold text-[#b2eb76] font-mono">$14.8M+</div>
                      <p className="text-[11px] text-stone-400 font-mono">Cross-border purchase orders executed from India.</p>
                    </SpotlightCard>

                    <SpotlightCard className="p-4 rounded-xl bg-[#121c0b] border border-[#2d421d] space-y-1">
                      <span className="text-[11px] font-mono text-stone-400 block uppercase">MSME Vetting Accuracy</span>
                      <div className="text-2xl font-bold text-[#b2eb76] font-mono">100%</div>
                      <p className="text-[11px] text-stone-400 font-mono">DGFT IEC, GSTIN, &amp; QIMA factory audited.</p>
                    </SpotlightCard>

                    <SpotlightCard className="p-4 rounded-xl bg-[#121c0b] border border-[#2d421d] space-y-1">
                      <span className="text-[11px] font-mono text-stone-400 block uppercase">Milestone Dispute Ratio</span>
                      <div className="text-2xl font-bold text-[#b2eb76] font-mono">0.08%</div>
                      <p className="text-[11px] text-stone-400 font-mono">Across all PayPal milestone disbursements.</p>
                    </SpotlightCard>

                    <SpotlightCard className="p-4 rounded-xl bg-[#121c0b] border border-[#2d421d] space-y-1">
                      <span className="text-[11px] font-mono text-stone-400 block uppercase">AI Discrepancy Latency</span>
                      <div className="text-2xl font-bold text-[#b2eb76] font-mono">&lt;40ms</div>
                      <p className="text-[11px] text-stone-400 font-mono">Automated UCP 600 export compliance check.</p>
                    </SpotlightCard>
                  </div>

                  {/* Moat Narrative */}
                  <div className="p-5 rounded-xl bg-[#14200c] border border-[#2d421d] text-xs font-mono text-stone-300 leading-relaxed space-y-3">
                    <p>
                      <strong>How TRUV Compounds Value:</strong> Every transaction coordinated through TRUV feeds the
                      network with verified performance records: actual factory cycle times, on-time delivery rates, pricing
                      trends across Incoterms, and reliable customs broker handovers.
                    </p>
                    <p className="text-stone-400">
                      As more international buyers place RFQs and more Indian industrial MSMEs complete verified orders, TRUV&apos;s
                      intelligence layer becomes the single source of truth for global trade execution with India.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Bar: Action Trigger & Contact Sales */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-[#2d421d] bg-[#121c0b]">
              <div className="flex items-center gap-3 text-xs font-mono text-stone-400">
                <span className="size-2 rounded-full bg-[#b2eb76]" />
                <span>Need custom manufacturing sourcing or trade execution support?</span>
              </div>

              <div className="flex items-center gap-4">
                <Magnet padding={25} magnetStrength={2.5}>
                  <Link href="https://spade.com/contact/" target="_blank">
                    <div className="group relative inline-flex appearance-none items-center py-2 px-5 select-none transition-all justify-center text-[#18280e] bg-[#b2eb76] rounded-md hover:bg-[#b2eb76]/90 cursor-pointer shadow-sm">
                      <span className="text-xs font-semibold uppercase tracking-wider font-mono">Contact Trade Operations</span>
                    </div>
                  </Link>
                </Magnet>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
