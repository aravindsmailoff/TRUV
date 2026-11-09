"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Globe,
  Building2,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Ship,
  Cpu,
  Scale,
  FileSpreadsheet,
} from "lucide-react";
import { Magnet } from "@/components/reactbits/Magnet";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { DecryptedText } from "@/components/reactbits/DecryptedText";
import { SEED_MANUFACTURERS, SEED_RFQS } from "@/lib/trade/tradeStore";

type HubKey = "rfq" | "mfg" | "discrepancy" | "paypal" | "logistics";

export function TradeExecutionSection() {
  const [activeHubTab, setActiveHubTab] = useState<HubKey>("rfq");

  // RFQ Selection
  const [selectedRfqId, setSelectedRfqId] = useState<string>(SEED_RFQS[0].id);
  const currentRfq = SEED_RFQS.find((r) => r.id === selectedRfqId) || SEED_RFQS[0];

  // Manufacturer Selection
  const [selectedMfgId, setSelectedMfgId] = useState<string>(SEED_MANUFACTURERS[0].id);
  const currentMfg = SEED_MANUFACTURERS.find((m) => m.id === selectedMfgId) || SEED_MANUFACTURERS[0];

  // Commercial Discrepancy Simulator
  const [simPoAmount, setSimPoAmount] = useState<number>(142500);
  const [simInvoiceAmount, setSimInvoiceAmount] = useState<number>(142500);
  const [simIncoterm, setSimIncoterm] = useState<"FOB Mundra" | "CIF Los Angeles">("FOB Mundra");

  // PayPal Milestone Escrow Calculator
  const [orderValue, setOrderValue] = useState<number>(142500);
  const advanceDeposit = Math.round(orderValue * 0.3);
  const balanceAmount = orderValue - advanceDeposit;

  // Discrepancy calculation
  const hasPriceVariance = simPoAmount !== simInvoiceAmount;
  const varianceDelta = Math.abs(simPoAmount - simInvoiceAmount);

  return (
    <section id="trade-execution" className="relative overflow-hidden bg-white text-black pt-16 md:pt-24 lg:pt-32 pb-20">
      <div className="max-w-[80rem] mx-auto px-5 lg:px-8 space-y-16 lg:space-y-24">
        {/* ========================================================================= */}
        {/* PART 1: THE SIGNATURE 2-COLUMN SHOWCASE (Matching Image 2 Reference)      */}
        {/* ========================================================================= */}
        <div className="flex flex-col-reverse justify-between gap-10 md:gap-8 lg:gap-12 items-end md:flex-row">
          {/* Left Text Column */}
          <div className="w-full shrink-0 md:w-1/2 md:max-w-md">
            <div className="flex w-full flex-col items-start text-left">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-x-3 sm:gap-x-4 mb-3.5">
                <div className="size-7 shrink-0 text-[#18280e]">
                  <Globe className="w-6 h-6 text-[#18280e]" />
                </div>
                <span className="opacity-80 text-xs font-mono font-semibold uppercase tracking-wider text-[#18280E]">
                  International Trade Infrastructure
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] text-[#18280E] font-medium leading-[1.15] tracking-tight">
                Connecting global buyers with Indian industrial manufacturers
              </h2>

              {/* Description */}
              <div className="mt-3.5 opacity-80 text-stone-700 text-sm sm:text-base leading-relaxed">
                <p>
                  We operate end-to-end international trade execution: from buyer demand discovery and MSME manufacturer
                  qualification, to commercial purchase orders, PayPal milestone invoicing, QIMA inspections, and freight
                  forwarding to international ports.
                </p>
              </div>

              {/* Action Button (Exact Matching Signature Button Style) */}
              <div className="flex items-center gap-x-5 mt-6 sm:mt-8">
                <Magnet padding={25} magnetStrength={3}>
                  <a href="#trade-operator-hub" className="inline-block">
                    <div className="group relative inline-flex appearance-none items-center py-2.5 px-5 select-none transition-all justify-center text-black rounded-md border border-black/15 bg-white hover:bg-[#b2eb76] hover:border-[#b2eb76] cursor-pointer shadow-xs active:scale-95">
                      <span className="text-sm font-medium relative z-10">Explore trade operations</span>
                    </div>
                  </a>
                </Magnet>
              </div>

              {/* Chamfered Stat Badge (Exact Matching Style with cut corners) */}
              <div
                className="relative bg-[#ebf7d9] inline-flex items-center gap-x-4 p-3.5 pl-4 max-lg:w-full mt-10 sm:mt-14 md:max-w-[22.625rem] border border-stone-200/60 shadow-xs cursor-default group"
                style={{ "--corner-size-desktop": "13px", "--corner-size-mobile": "9px" } as React.CSSProperties}
              >
                {/* Chamfered Cut Corners */}
                <div className="pointer-events-none absolute inset-0 z-10">
                  <div className="cut-corner absolute bg-white" style={{ top: "-1px", left: "-1px", clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
                  <div className="cut-corner absolute bg-white" style={{ top: "-1px", right: "-1px", clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
                  <div className="cut-corner absolute bg-white" style={{ bottom: "-1px", left: "-1px", clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />
                  <div className="cut-corner absolute bg-white" style={{ bottom: "-1px", right: "-1px", clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }} />
                </div>

                <div className="text-2xl font-mono font-bold text-[#18280e] shrink-0 tracking-tight">
                  <DecryptedText text="100%" animateOn="hover" speed={40} />
                </div>
                <p className="text-xs text-stone-600 font-mono uppercase tracking-wider leading-tight">
                  <DecryptedText text="DGFT IEC & GSTIN VERIFIED EVIDENCE" animateOn="hover" speed={30} />
                </p>
              </div>
            </div>
          </div>

          {/* Right Visual Column (Matching Image 2: Lifestyle background with Reticles & Alert Card) */}
          <div
            className="relative w-full flex-1 md:max-w-[47.5rem] rounded-xl overflow-hidden border border-stone-200 shadow-sm"
            style={{ "--corner-size-desktop": "17px", "--corner-size-mobile": "13px" } as React.CSSProperties}
          >
            {/* Cut Corners */}
            <div className="pointer-events-none absolute inset-0 z-20">
              <div className="cut-corner absolute bg-white" style={{ top: "-1px", left: "-1px", clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
              <div className="cut-corner absolute bg-white" style={{ top: "-1px", right: "-1px", clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
              <div className="cut-corner absolute bg-white" style={{ bottom: "-1px", left: "-1px", clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />
              <div className="cut-corner absolute bg-white" style={{ bottom: "-1px", right: "-1px", clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }} />
            </div>

            <div className="relative w-full" style={{ aspectRatio: "760/509" }}>
              {/* Background Lifestyle Image */}
              <Image
                src="/sites/spade/Relay-Placeholder-Thumbnail.jpg"
                alt="Global Trade Operations"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/35" />

              {/* ========================================================================= */}
              {/* RETICLE 1: SOURCING HUBS (Top Left Reticle matching Image 2)               */}
              {/* ========================================================================= */}
              <div className="absolute top-[18%] sm:top-[20%] left-[8%] sm:left-[10%] z-10 text-white font-mono text-[10px] sm:text-[11px] leading-tight select-none">
                <div className="relative p-2.5 sm:p-3 border border-white/20 bg-black/45 backdrop-blur-xs rounded-xs">
                  {/* Bracket Reticles */}
                  <span className="absolute -top-1 -left-1 text-white font-bold text-xs">┌</span>
                  <span className="absolute -top-1 -right-1 text-white font-bold text-xs">┐</span>
                  <span className="absolute -bottom-1 -left-1 text-white font-bold text-xs">└</span>
                  <span className="absolute -bottom-1 -right-1 text-white font-bold text-xs">┘</span>

                  <div className="flex items-center gap-1.5 text-white/90 font-medium">
                    <span className="text-[#b2eb76] text-xs">►</span>
                    <span className="tracking-wider uppercase">Sourcing Hubs</span>
                  </div>
                  <div className="mt-1 text-stone-300 text-[9px] sm:text-[10px] uppercase font-mono tracking-wide">
                    MORADABAD (BRASS) • TIRUPUR (KNITS)<br />
                    RAJKOT (PRECISION FORGINGS)
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* RETICLE 2: STATUTORY EVIDENCE (Bottom Left Reticle matching Image 2)      */}
              {/* ========================================================================= */}
              <div className="absolute bottom-[14%] sm:bottom-[16%] left-[8%] sm:left-[10%] z-10 text-white font-mono text-[10px] sm:text-[11px] leading-tight select-none">
                <div className="relative p-2.5 sm:p-3 border border-white/20 bg-black/45 backdrop-blur-xs rounded-xs">
                  {/* Bracket Reticles */}
                  <span className="absolute -top-1 -left-1 text-white font-bold text-xs">┌</span>
                  <span className="absolute -top-1 -right-1 text-white font-bold text-xs">┐</span>
                  <span className="absolute -bottom-1 -left-1 text-white font-bold text-xs">└</span>
                  <span className="absolute -bottom-1 -right-1 text-white font-bold text-xs">┘</span>

                  <div className="flex items-center gap-1.5 text-white/90 font-medium">
                    <span className="text-[#b2eb76] text-xs">►</span>
                    <span className="tracking-wider uppercase">Verified Standing</span>
                  </div>
                  <div className="mt-1 text-stone-300 text-[9px] sm:text-[10px] font-mono tracking-wide">
                    DGFT IEC: 0508012491 | GSTIN: 09AAHFM<br />
                    INSPECTION: QIMA AQL 1.5 AUDITED
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* FLOATING CHAMFERED TRANSACTION ALERT CARD (Matching Yellow Card in Image 2)*/}
              {/* ========================================================================= */}
              <div className="absolute top-[22%] sm:top-[26%] right-[6%] sm:right-[10%] z-10 w-[18rem] sm:w-[21rem]">
                <div
                  className="relative bg-[#ebf7d9] text-[#18280e] p-4 sm:p-5 shadow-2xl border border-[#3f7308]/30 font-mono transition-transform hover:scale-[1.02]"
                  style={{ "--corner-size-desktop": "14px", "--corner-size-mobile": "10px" } as React.CSSProperties}
                >
                  {/* Chamfered Cut Corners on the Alert Card */}
                  <div className="pointer-events-none absolute inset-0 z-10">
                    <div className="cut-corner absolute bg-black/40" style={{ top: "-1px", left: "-1px", clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
                    <div className="cut-corner absolute bg-black/40" style={{ top: "-1px", right: "-1px", clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
                    <div className="cut-corner absolute bg-black/40" style={{ bottom: "-1px", left: "-1px", clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />
                    <div className="cut-corner absolute bg-black/40" style={{ bottom: "-1px", right: "-1px", clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }} />
                  </div>

                  <div className="flex flex-col items-center text-center pb-3 border-b border-[#3f7308]/20">
                    <ShieldCheck className="w-6 h-6 text-[#3f7308] mb-1.5" />
                    <span className="text-xs font-bold tracking-tight uppercase">
                      PayPal Milestone Escrow Active
                    </span>
                    <span className="text-[10px] text-stone-600 mt-0.5">
                      30% Advance Released to Manufacturer
                    </span>
                  </div>

                  <div className="pt-3 flex justify-between items-baseline">
                    <div className="text-left">
                      <span className="text-xs font-bold text-stone-900 block truncate max-w-[140px]">
                        Pacific Arch Hardware
                      </span>
                      <span className="text-[10px] text-stone-500">
                        2026-11-10 09:23:16
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-[#18280e]">
                        -$42,750.00
                      </span>
                      <span className="text-[9px] text-[#3f7308] font-bold block">
                        PayPal Orders v2
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#3f7308]/20 text-[10px] text-stone-700 flex justify-between items-center">
                    <span>FOB Mundra Port</span>
                    <span className="text-[#3f7308] font-semibold">QIMA AQL 1.5 Passed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PART 2: THE INTERACTIVE TRADE OPERATOR WORKBENCH (Matching Theme 100%)   */}
        {/* ========================================================================= */}
        <div id="trade-operator-hub" className="scroll-mt-24 pt-4">
          <div
            className="relative bg-[#18280e] text-white rounded-2xl border border-[#2d421d] shadow-2xl overflow-hidden font-sans"
            style={{ "--corner-size-desktop": "17px", "--corner-size-mobile": "13px" } as React.CSSProperties}
          >
            {/* Cut Corners */}
            <div className="pointer-events-none absolute inset-0 z-20">
              <div className="cut-corner absolute bg-white" style={{ top: "-1px", left: "-1px", clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
              <div className="cut-corner absolute bg-white" style={{ top: "-1px", right: "-1px", clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
              <div className="cut-corner absolute bg-white" style={{ bottom: "-1px", left: "-1px", clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />
              <div className="cut-corner absolute bg-white" style={{ bottom: "-1px", right: "-1px", clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }} />
            </div>

            {/* Header Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3.5 border-b border-[#2d421d] bg-[#121c0b] text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b2eb76] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b2eb76]" />
                </span>
                <span className="font-semibold text-[#b2eb76] uppercase tracking-wider">TRUV TRADE CONSOLE</span>
                <span className="text-stone-400">|</span>
                <span className="text-stone-300">Active Corridors: USA / Europe → India MSMEs</span>
              </div>

              <div className="flex items-center gap-3 text-stone-400">
                <span>Statutory Rails: <strong className="text-stone-200">DGFT &amp; ICEGATE</strong></span>
                <span className="px-2 py-0.5 rounded bg-[#223514] text-[#b2eb76] border border-[#3b5424]">LIVE VERIFICATION</span>
              </div>
            </div>

            {/* Tab Navigation (Watermelon UI Modular Pills in Site Theme) */}
            <div className="flex items-center gap-1.5 p-3 sm:p-4 border-b border-[#2d421d] bg-[#14200c] overflow-x-auto select-none scrollbar-none">
              {[
                { id: "rfq", label: "1. Buyer RFQs & Demand", icon: Globe, count: "3 Active" },
                { id: "mfg", label: "2. MSME Qualification Hubs", icon: Building2, count: "3 Verified" },
                { id: "discrepancy", label: "3. Commercial PO vs Invoice (AI)", icon: Scale, count: "UCP 600" },
                { id: "paypal", label: "4. PayPal Milestone Escrow", icon: CreditCard, count: "30% / 70%" },
                { id: "logistics", label: "5. Logistics & Customs Handover", icon: Ship, count: "Maersk + QIMA" },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeHubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveHubTab(tab.id as HubKey)}
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

            {/* Interactive Panels */}
            <div className="p-5 sm:p-7 lg:p-9 min-h-[440px]">
              {/* TAB 1: BUYER RFQ */}
              {activeHubTab === "rfq" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2d421d] pb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                        <Globe className="w-5 h-5 text-[#b2eb76]" />
                        International Buyer Demand Pipeline
                      </h3>
                      <p className="text-xs text-stone-400 font-mono mt-1">
                        Collects genuine foreign purchase requirements with technical tolerances and target pricing.
                      </p>
                    </div>

                    <div className="flex gap-1.5">
                      {SEED_RFQS.map((r, i) => (
                        <button
                          key={r.id}
                          onClick={() => setSelectedRfqId(r.id)}
                          className={`px-3 py-1.5 text-xs font-mono rounded border transition-colors ${
                            selectedRfqId === r.id
                              ? "bg-[#b2eb76] text-[#18280e] font-bold border-[#b2eb76]"
                              : "bg-[#121c0b] text-stone-300 border-[#2d421d] hover:border-stone-500"
                          }`}
                        >
                          RFQ #{i + 1} ({r.buyerCountry.split(" ")[0]})
                        </button>
                      ))}
                    </div>
                  </div>

                  <SpotlightCard className="p-5 sm:p-6 rounded-xl bg-[#121c0b] border border-[#2d421d] text-stone-200">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <span className="text-xs font-mono text-[#b2eb76] uppercase font-bold">Buyer Profile</span>
                        <h4 className="text-xl font-bold text-white">{currentRfq.buyerCompany}</h4>
                        <div className="text-xs font-mono text-stone-400 space-y-1">
                          <div>Contact: <span className="text-stone-200">{currentRfq.buyerName}</span></div>
                          <div>Country: <span className="text-stone-200">{currentRfq.buyerCountry}</span></div>
                          <div>Destination Port: <span className="text-[#b2eb76]">{currentRfq.destinationPort}</span></div>
                          <div>Required Terms: <span className="text-stone-200">30% Advance PayPal / 70% BL</span></div>
                        </div>
                      </div>

                      <div className="lg:col-span-2 space-y-4 border-t lg:border-t-0 lg:border-l border-[#2d421d] pt-4 lg:pt-0 lg:pl-6">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-[#b2eb76] uppercase font-bold">{currentRfq.productName}</span>
                          <span className="text-white font-bold">{currentRfq.targetQuantity.toLocaleString()} Units @ ${currentRfq.targetPricePerUnit}/unit</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                          {currentRfq.technicalSpecifications.map((spec, idx) => (
                            <div key={idx} className="flex items-start gap-2 bg-[#14200c] p-2.5 rounded border border-[#2d421d]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#b2eb76] shrink-0 mt-0.5" />
                              <span className="text-stone-300">{spec}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center p-3 rounded-lg bg-[#223514] border border-[#3b5424] text-xs font-mono">
                          <div>
                            <span className="text-stone-400 block">Total Est. Contract Value:</span>
                            <span className="text-base font-bold text-[#b2eb76]">
                              ${(currentRfq.targetQuantity * currentRfq.targetPricePerUnit).toLocaleString()} USD
                            </span>
                          </div>
                          <div>
                            <span className="text-stone-400 block">30% Production Advance:</span>
                            <span className="text-base font-bold text-white">
                              ${Math.round(currentRfq.targetQuantity * currentRfq.targetPricePerUnit * 0.3).toLocaleString()} USD
                            </span>
                          </div>
                          <button
                            onClick={() => setActiveHubTab("mfg")}
                            className="px-3.5 py-1.5 rounded bg-[#b2eb76] text-[#18280e] font-semibold text-xs hover:bg-[#b2eb76]/90 transition-colors"
                          >
                            Match MSME Hub →
                          </button>
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </div>
              )}

              {/* TAB 2: MSME QUALIFICATION */}
              {activeHubTab === "mfg" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2d421d] pb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-[#b2eb76]" />
                        Indian Industrial MSME Clusters
                      </h3>
                      <p className="text-xs text-stone-400 font-mono mt-1">
                        Separating verified statutory and physical audits from manufacturer claims.
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

                  <SpotlightCard className="p-5 sm:p-6 rounded-xl bg-[#121c0b] border border-[#2d421d] space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xl font-bold text-white">{currentMfg.legalEntityName}</h4>
                        <p className="text-xs text-stone-400 font-mono mt-0.5">
                          Cluster: <strong className="text-[#b2eb76]">{currentMfg.hubLocation}</strong> | Category: <strong className="text-white">{currentMfg.msmeCategory} Enterprise</strong>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono text-stone-400 uppercase block">Export Readiness</span>
                        <span className="text-xl font-bold text-[#b2eb76] font-mono">{currentMfg.readinessScore}/100</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-3.5 rounded-lg bg-[#14200c] border border-[#3b5424] space-y-2 text-xs font-mono">
                        <span className="text-[#b2eb76] font-bold uppercase flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#b2eb76]" />
                          Verified Statutory Standing
                        </span>
                        <div className="space-y-1 text-stone-300">
                          <div>DGFT IEC: <strong className="text-white">{currentMfg.iecCode}</strong></div>
                          <div>GSTIN: <strong className="text-white">{currentMfg.gstin}</strong></div>
                          <div>Factory Auditor: <strong className="text-[#b2eb76]">{currentMfg.auditedBy}</strong></div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-lg bg-[#14200c] border border-[#2d421d] space-y-2 text-xs font-mono">
                        <span className="text-white font-bold uppercase flex items-center gap-1.5">
                          <Cpu className="w-4 h-4 text-[#b2eb76]" />
                          Verified Production Lines ({currentMfg.monthlyCapacityUnits.toLocaleString()} units/mo)
                        </span>
                        <div className="space-y-1 text-stone-400">
                          {currentMfg.verifiedProductionLines.slice(0, 3).map((l, i) => (
                            <div key={i} className="truncate">• {l}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </div>
              )}

              {/* TAB 3: DISCREPANCY DETECTOR */}
              {activeHubTab === "discrepancy" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2d421d] pb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                        <Scale className="w-5 h-5 text-[#b2eb76]" />
                        Commercial PO vs. Proforma Invoice Discrepancy Engine
                      </h3>
                      <p className="text-xs text-stone-400 font-mono mt-1">
                        Real-time AI discrepancy detection cross-referencing prices, quantities, and UCP 600 rules.
                      </p>
                    </div>

                    <div className={`px-3 py-1 rounded text-xs font-mono flex items-center gap-2 ${
                      hasPriceVariance
                        ? "bg-amber-950 text-amber-300 border border-amber-600 animate-pulse"
                        : "bg-[#223514] text-[#b2eb76] border border-[#3b5424]"
                    }`}>
                      {hasPriceVariance ? (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span>AI WARNING: Price Variance (${varianceDelta.toLocaleString()})</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#b2eb76]" />
                          <span>0 DISCREPANCIES — UCP 600 COMPLIANT</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SpotlightCard className="p-4 rounded-xl bg-[#121c0b] border border-[#2d421d] space-y-3 text-xs font-mono">
                      <span className="text-[#b2eb76] font-bold uppercase flex items-center gap-1.5">
                        <FileText className="w-4 h-4" /> Buyer Purchase Order (PO-9921)
                      </span>
                      <div>
                        <label className="text-stone-400 block mb-1">Declared PO Amount ($):</label>
                        <input
                          type="number"
                          value={simPoAmount}
                          onChange={(e) => setSimPoAmount(Number(e.target.value))}
                          className="w-full bg-[#18280e] border border-[#2d421d] px-3 py-1.5 rounded text-white"
                        />
                      </div>
                      <div>
                        <label className="text-stone-400 block mb-1">Incoterm:</label>
                        <select
                          value={simIncoterm}
                          onChange={(e) => setSimIncoterm(e.target.value as "FOB Mundra" | "CIF Los Angeles")}
                          className="w-full bg-[#18280e] border border-[#2d421d] px-3 py-1.5 rounded text-white"
                        >
                          <option value="FOB Mundra">FOB Mundra</option>
                          <option value="CIF Los Angeles">CIF Los Angeles</option>
                        </select>
                      </div>
                    </SpotlightCard>

                    <SpotlightCard className="p-4 rounded-xl bg-[#121c0b] border border-[#2d421d] space-y-3 text-xs font-mono">
                      <span className="text-[#b2eb76] font-bold uppercase flex items-center gap-1.5">
                        <FileSpreadsheet className="w-4 h-4" /> Seller Proforma Invoice (PI-2026-48)
                      </span>
                      <div>
                        <label className="text-stone-400 block mb-1">Invoiced Amount ($):</label>
                        <input
                          type="number"
                          value={simInvoiceAmount}
                          onChange={(e) => setSimInvoiceAmount(Number(e.target.value))}
                          className="w-full bg-[#18280e] border border-[#2d421d] px-3 py-1.5 rounded text-white"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => setSimInvoiceAmount(simPoAmount)}
                          className="px-3 py-1.5 rounded bg-[#223514] text-[#b2eb76] border border-[#3b5424] text-[11px]"
                        >
                          Auto-Reconcile
                        </button>
                        <button
                          onClick={() => setSimInvoiceAmount(simPoAmount + 2500)}
                          className="px-3 py-1.5 rounded bg-white/5 text-stone-400 text-[11px]"
                        >
                          Simulate Discrepancy
                        </button>
                      </div>
                    </SpotlightCard>
                  </div>
                </div>
              )}

              {/* TAB 4: PAYPAL ESCROW */}
              {activeHubTab === "paypal" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2d421d] pb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-[#b2eb76]" />
                        PayPal Orders v2 Milestone Escrow Layer
                      </h3>
                      <p className="text-xs text-stone-400 font-mono mt-1">
                        Supporting international buyer payments to eligible Indian merchants via approved PayPal rails.
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded bg-[#223514] text-[#b2eb76] font-mono text-xs border border-[#3b5424]">
                      REST API Orders v2 Active
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-stone-400">Transaction Value:</span>
                      <span className="text-lg font-bold text-[#b2eb76]">${orderValue.toLocaleString()} USD</span>
                    </div>
                    <input
                      type="range"
                      min="25000"
                      max="250000"
                      step="2500"
                      value={orderValue}
                      onChange={(e) => setOrderValue(Number(e.target.value))}
                      className="w-full h-2 bg-[#18280e] rounded-lg appearance-none cursor-pointer accent-[#b2eb76]"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 rounded-xl bg-[#14200c] border border-[#3b5424] space-y-2">
                        <span className="text-xs font-mono text-[#b2eb76] font-bold block uppercase">
                          Milestone 1: 30% Advance Escrow
                        </span>
                        <div className="text-2xl font-bold text-white font-mono">
                          ${advanceDeposit.toLocaleString()} <span className="text-xs text-stone-400 font-normal">USD</span>
                        </div>
                        <p className="text-xs text-stone-400 font-mono">
                          Released upon contract execution to initiate raw material tooling.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-[#14200c] border border-[#2d421d] space-y-2">
                        <span className="text-xs font-mono text-stone-300 font-bold block uppercase">
                          Milestone 2: 70% Bill of Lading Balance
                        </span>
                        <div className="text-2xl font-bold text-white font-mono">
                          ${balanceAmount.toLocaleString()} <span className="text-xs text-stone-400 font-normal">USD</span>
                        </div>
                        <p className="text-xs text-stone-400 font-mono">
                          Disbursed upon verified customs Let Export Order (LEO) and ocean Bill of Lading.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: LOGISTICS */}
              {activeHubTab === "logistics" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2d421d] pb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                        <Ship className="w-5 h-5 text-[#b2eb76]" />
                        Logistics, Inspection &amp; Customs Handover
                      </h3>
                      <p className="text-xs text-stone-400 font-mono mt-1">
                        Coordinating verified third-party inspection agencies, ICEGATE customs, and ocean freight lines.
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded bg-[#223514] text-[#b2eb76] font-mono text-xs border border-[#3b5424]">
                      Maersk Container: MSKU948201
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <SpotlightCard className="p-4 rounded-xl bg-[#121c0b] border border-[#2d421d] space-y-1 text-xs font-mono">
                      <span className="text-[#b2eb76] font-bold block">1. QIMA / SGS Inspection</span>
                      <div className="text-white font-bold">AQL 1.5 Testing Passed</div>
                      <p className="text-stone-400 text-[11px]">Factory floor quality seal applied before dispatch.</p>
                    </SpotlightCard>

                    <SpotlightCard className="p-4 rounded-xl bg-[#121c0b] border border-[#2d421d] space-y-1 text-xs font-mono">
                      <span className="text-[#b2eb76] font-bold block">2. ICEGATE Customs</span>
                      <div className="text-white font-bold">Shipping Bill Cleared</div>
                      <p className="text-stone-400 text-[11px]">Indian Customs Let Export Order (LEO) issued at Mundra.</p>
                    </SpotlightCard>

                    <SpotlightCard className="p-4 rounded-xl bg-[#121c0b] border border-[#2d421d] space-y-1 text-xs font-mono">
                      <span className="text-[#b2eb76] font-bold block">3. Maersk Line Ocean</span>
                      <div className="text-white font-bold">Bill of Lading Assigned</div>
                      <p className="text-stone-400 text-[11px]">Vessel transit to Port of Los Angeles (Voyage 2603W).</p>
                    </SpotlightCard>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
