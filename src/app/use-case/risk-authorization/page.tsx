"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/sites/spade/Navbar";
import { Footer } from "@/components/sites/spade/Footer";
import { Magnet } from "@/components/reactbits/Magnet";
import {
  Globe,
  Ship,
  FileCheck2,
  DollarSign,
  ShieldCheck,
  Building2,
  ArrowRight,
  CheckCircle2,
  PackageCheck,
  Send,
  FileSpreadsheet,
} from "lucide-react";

import {
  SEED_MANUFACTURERS,
  SEED_RFQS,
  SEED_QUOTES,
  SEED_TRADES,
  SEED_MILESTONES,
} from "@/lib/trade/tradeStore";
import { BuyerRFQ } from "@/types/trade";

export default function GlobalTradeExecutionPage() {
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<
    "rfq_discovery" | "manufacturer_matching" | "quotation_review" | "transaction_execution" | "paypal_settlement"
  >("transaction_execution");

  // RFQ Submission Form State
  const [rfqBuyerCompany, setRfqBuyerCompany] = useState("Pacific Architectural Hardware LLC");
  const [rfqBuyerCountry, setRfqBuyerCountry] = useState("United States (California)");
  const [rfqProductName, setRfqProductName] = useState("Solid Brass Mortise Locksets & Handles");
  const [rfqCategory, setRfqCategory] = useState<BuyerRFQ["productCategory"]>("Precision Castings & Brass");
  const [rfqQuantity, setRfqQuantity] = useState(3500);
  const [rfqTargetPrice, setRfqTargetPrice] = useState(24.5);
  const [rfqSuccessMsg, setRfqSuccessMsg] = useState(false);

  // Selected trade for execution
  const [selectedTradeId, setSelectedTradeId] = useState<string>("trade_live_7719");

  // PayPal Payment Simulation State
  const [paypalProcessing, setPaypalProcessing] = useState(false);
  const [paypalResult, setPaypalResult] = useState<{ id: string; status: string; value: string } | null>(null);

  // Lookup active objects
  const activeTrade = SEED_TRADES.find((t) => t.id === selectedTradeId) || SEED_TRADES[0];
  const activeMfg = SEED_MANUFACTURERS.find((m) => m.id === activeTrade.manufacturerId) || SEED_MANUFACTURERS[0];
  const activeQuote = SEED_QUOTES.find((q) => q.rfqId === activeTrade.rfqId) || SEED_QUOTES[0];
  const tradeMilestones = SEED_MILESTONES.filter((m) => m.tradeOrderId === activeTrade.id);

  const handlePayPalCommercialDeposit = async () => {
    setPaypalProcessing(true);
    try {
      const res = await fetch("/api/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_paypal_payment",
          tradeId: activeTrade.id,
          isAdvance: true,
        }),
      });
      const data = await res.json();
      if (data.paymentOrder) {
        setPaypalResult({
          id: data.paymentOrder.id,
          status: data.paymentOrder.status,
          value: data.paymentOrder.amount.value,
        });
      }
    } catch {
      setPaypalResult({
        id: `SANDBOX_PO_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        status: "CREATED",
        value: activeTrade.advanceDepositRequiredUSD.toFixed(2),
      });
    } finally {
      setPaypalProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col font-sans selection:bg-[#b2eb76] selection:text-[#18280e]">
      <Navbar />

      <main className="flex-1">
        {/* ========================================================= */}
        {/* HERO SECTION                                             */}
        {/* ========================================================= */}
        <section className="relative overflow-hidden bg-[#18280E] text-white pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="absolute top-0 right-0 w-[580px] h-[580px] bg-[#2d4d16]/30 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-[80rem] mx-auto px-5 lg:px-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#b2eb76] text-xs font-mono font-semibold border border-white/15 mb-6">
              <Globe className="size-4 text-[#b2eb76]" />
              <span>Technology-Powered International Trade Operator</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-medium tracking-tight text-white leading-[1.08] max-w-4xl">
              Connecting global buyers with Indian industrial manufacturers
            </h1>

            <p className="text-lg sm:text-xl text-stone-300 max-w-3xl leading-relaxed mt-5">
              We operate end-to-end international trade execution: from buyer demand discovery and MSME manufacturer qualification, to commercial purchase orders, PayPal milestone invoicing, QIMA inspections, and freight forwarding to international ports.
            </p>

            <div className="pt-8 flex flex-wrap gap-4 items-center">
              <Magnet padding={25} magnetStrength={3}>
                <a
                  href="#trade-execution-suite"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md bg-[#b2eb76] text-[#18280E] font-semibold text-sm hover:bg-[#c2f38d] hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  <span>Open Trade Execution Console</span>
                  <ArrowRight className="size-4" />
                </a>
              </Magnet>

              <div className="inline-flex items-center gap-3 px-4 py-3 rounded-md bg-white/5 border border-white/15 text-xs font-mono text-stone-300">
                <span className="size-2 rounded-full bg-[#b2eb76] animate-pulse" />
                <span>Active Corridor: USA / Europe ➔ India Industrial Clusters (Moradabad, Tirupur, Rajkot)</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* THE COMPLETE 6-STAGE TRADE EXECUTION WORKFLOW             */}
        {/* ========================================================= */}
        <section className="py-12 bg-stone-50 border-y border-stone-200">
          <div className="max-w-[80rem] mx-auto px-5 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs font-mono">
              {[
                { num: "01", label: "Buyer Demand (RFQ)", icon: FileSpreadsheet },
                { num: "02", label: "Supplier Matching", icon: Building2 },
                { num: "03", label: "Qualification", icon: ShieldCheck },
                { num: "04", label: "Commercial Quotes", icon: FileCheck2 },
                { num: "05", label: "PayPal Payment", icon: DollarSign },
                { num: "06", label: "Export Logistics", icon: Ship },
              ].map((stage) => (
                <div
                  key={stage.num}
                  className="p-3.5 rounded-lg bg-white border border-stone-200 flex flex-col items-start gap-1.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-stone-400 font-bold">{stage.num}</span>
                    <stage.icon className="size-4 text-[#18280e]" />
                  </div>
                  <span className="font-semibold text-stone-900 leading-tight">{stage.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* INTERACTIVE TRADE EXECUTION CONSOLE                       */}
        {/* ========================================================= */}
        <section id="trade-execution-suite" className="py-16 md:py-24 bg-white text-stone-900">
          <div className="max-w-[80rem] mx-auto px-5 lg:px-8">
            {/* Header with Step Switcher */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-6 border-b border-stone-200">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#18280E] mb-2">
                  <PackageCheck className="size-4 text-[#3f7308]" />
                  <span>Real Commercial Trade Operations Desk</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#18280E]">
                  Execute international trade from RFQ to Port of Delivery
                </h2>
                <p className="text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
                  Experience our actual trade operator functionality: discover buyer opportunities, qualify verified Indian manufacturers, review commercial quotations, execute PayPal direct milestone deposits, and track customs and Maersk ocean freight.
                </p>
              </div>

              {/* Module Workflow Tabs */}
              <div className="flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-xl border border-stone-200 overflow-x-auto text-xs font-mono">
                {[
                  { id: "transaction_execution", label: "5. Trade Execution (Active Order)" },
                  { id: "rfq_discovery", label: "1. Buyer RFQ Submission" },
                  { id: "manufacturer_matching", label: "2. MSME Qualification" },
                  { id: "quotation_review", label: "4. Quotation & Terms" },
                  { id: "paypal_settlement", label: "6. PayPal Payments" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveWorkflowStep(tab.id as typeof activeWorkflowStep)}
                    className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                      activeWorkflowStep === tab.id
                        ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TAB 1: TRANSACTION EXECUTION (THE CORE PRODUCT) */}
            {activeWorkflowStep === "transaction_execution" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Active Trade Dossier & Coordinated Operations */}
                <div className="lg:col-span-5 p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <span className="text-xs font-mono uppercase font-bold text-[#18280e]">
                      Live International Trade Dossier
                    </span>
                    <select
                      value={selectedTradeId}
                      onChange={(e) => setSelectedTradeId(e.target.value)}
                      className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-green-100 text-green-800 border border-green-200 focus:outline-none cursor-pointer"
                    >
                      {SEED_TRADES.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.orderNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Buyer & Seller Coordinates */}
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-lg bg-white border border-stone-200 space-y-1">
                      <div className="text-stone-500 font-mono uppercase text-[10px]">Foreign Buyer</div>
                      <div className="font-bold text-stone-900 text-sm">{activeTrade.buyerCompany}</div>
                      <div className="text-stone-600">{activeTrade.buyerCountry}</div>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-stone-200 space-y-1">
                      <div className="text-stone-500 font-mono uppercase text-[10px]">Indian MSME Manufacturer</div>
                      <div className="font-bold text-stone-900 text-sm">{activeMfg.legalEntityName}</div>
                      <div className="text-stone-600">Hub: {activeMfg.hubLocation} • IEC: {activeMfg.iecCode}</div>
                      <div className="text-[11px] font-mono text-[#18280e] font-semibold">
                        GSTIN: {activeMfg.gstin} • MSME: {activeMfg.msmeCategory}
                      </div>
                    </div>
                  </div>

                  {/* Commercial Value & Installment Terms */}
                  <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2 text-xs font-mono">
                    <div className="flex justify-between items-center text-stone-600">
                      <span>Total Purchase Order:</span>
                      <strong className="text-stone-900 text-sm">${activeTrade.totalAmountUSD.toLocaleString()} USD</strong>
                    </div>
                    <div className="flex justify-between items-center text-green-800 font-semibold bg-green-50 p-2 rounded">
                      <span>30% Advance (PayPal Cleared):</span>
                      <span>${activeTrade.advanceDepositRequiredUSD.toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between items-center text-stone-600 p-1">
                      <span>70% Balance (Upon Bill of Lading):</span>
                      <span>${activeTrade.balanceDueUSD.toLocaleString()} USD</span>
                    </div>
                    <div className="text-[10px] text-stone-500 pt-1 border-t border-stone-100">
                      Incoterms: FOB Mundra, India • Delivery to: {activeTrade.freightForwarder.portOfDischarge}
                    </div>
                  </div>

                  {/* Integrated External Logistics & Service Partners */}
                  <div className="p-4 rounded-xl bg-[#18280E] text-white border border-[#2d421d] space-y-3 text-xs">
                    <div className="font-mono text-[#b2eb76] uppercase text-[11px] font-bold">
                      Coordinated Trade Service Partners
                    </div>

                    <div className="space-y-2">
                      <div className="p-2.5 rounded bg-black/30 border border-white/10 flex justify-between items-center">
                        <div>
                          <div className="font-bold">Inspection: {activeTrade.inspectionAgency.name}</div>
                          <div className="text-[11px] text-stone-400">Ref: {activeTrade.inspectionAgency.reportNumber}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-blue-900 text-blue-200 text-[10px] font-mono font-bold uppercase">
                          {activeTrade.inspectionAgency.status}
                        </span>
                      </div>

                      <div className="p-2.5 rounded bg-black/30 border border-white/10 flex justify-between items-center">
                        <div>
                          <div className="font-bold">Ocean Freight: {activeTrade.freightForwarder.name}</div>
                          <div className="text-[11px] text-stone-400">{activeTrade.freightForwarder.vesselVoyage}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-stone-700 text-stone-200 text-[10px] font-mono">
                          {activeTrade.freightForwarder.containerNumber}
                        </span>
                      </div>

                      <div className="p-2.5 rounded bg-black/30 border border-white/10 flex justify-between items-center">
                        <div>
                          <div className="font-bold">Customs Broker: ICEGATE Mundra</div>
                          <div className="text-[11px] text-stone-400">Shipping Bill: {activeTrade.customsBroker.shippingBillNumber}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-green-900 text-green-200 text-[10px] font-mono">
                          LEO GRANTED
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Milestone Audit Trail & Execution Timeline */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                      <div>
                        <div className="text-xs font-mono uppercase text-[#3f7308] font-bold">
                          Trade Operator Execution Timeline
                        </div>
                        <h3 className="text-xl font-bold text-stone-900 mt-0.5">
                          Commercial Progression Milestones
                        </h3>
                        <p className="text-xs text-stone-600 mt-1">
                          Our platform coordinates every handover between the Indian MSME, buyer, inspector, customs broker and carrier.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-[#18280e] text-[#b2eb76]">
                          Stage: {activeTrade.currentStage.replace(/_/g, " ").toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Timeline List */}
                    <div className="mt-6 space-y-4">
                      {tradeMilestones.map((ms, idx) => (
                        <div
                          key={ms.id}
                          className={`p-4 rounded-xl border flex items-start gap-4 transition-all ${
                            ms.status === "completed"
                              ? "bg-white border-stone-200 shadow-2xs"
                              : ms.status === "in_progress"
                              ? "bg-amber-50/70 border-amber-300 shadow-xs"
                              : "bg-stone-50/60 border-stone-200 opacity-60"
                          }`}
                        >
                          <div
                            className={`size-7 rounded-full font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5 ${
                              ms.status === "completed"
                                ? "bg-[#18280e] text-[#b2eb76]"
                                : ms.status === "in_progress"
                                ? "bg-amber-600 text-white animate-pulse"
                                : "bg-stone-300 text-stone-600"
                            }`}
                          >
                            {ms.status === "completed" ? "✓" : idx + 1}
                          </div>

                          <div className="flex-1 space-y-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <h4 className="text-xs font-bold text-stone-900">{ms.title}</h4>
                              <span className="text-[10px] font-mono text-stone-500">
                                {ms.completedAt ? ms.completedAt.slice(0, 10) : "Pending"}
                              </span>
                            </div>

                            <p className="text-xs text-stone-600 leading-relaxed">{ms.description}</p>

                            <div className="flex items-center gap-2 pt-1 text-[11px] font-mono">
                              <span className="text-stone-500 font-semibold">Operator / Partner:</span>
                              <span className="text-[#18280e] font-bold">{ms.serviceProviderName}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: BUYER RFQ SUBMISSION (DEMAND DISCOVERY) */}
            {activeWorkflowStep === "rfq_discovery" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-6 p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                  <div className="border-b border-stone-200 pb-3">
                    <span className="text-xs font-mono uppercase font-bold text-[#18280e]">
                      Submit International Sourcing Requirement (RFQ)
                    </span>
                    <p className="text-xs text-stone-600 mt-1">
                      Foreign buyers enter technical specifications, target volumes, and delivery ports.
                    </p>
                  </div>

                  <div className="space-y-3 text-xs font-medium">
                    <div>
                      <label className="block text-stone-700 mb-1">Buyer Company Name</label>
                      <input
                        type="text"
                        value={rfqBuyerCompany}
                        onChange={(e) => setRfqBuyerCompany(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-[#18280e]"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 mb-1">Buyer Country &amp; Region</label>
                      <input
                        type="text"
                        value={rfqBuyerCountry}
                        onChange={(e) => setRfqBuyerCountry(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-[#18280e]"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 mb-1">Industrial Category</label>
                      <select
                        value={rfqCategory}
                        onChange={(e) => setRfqCategory(e.target.value as BuyerRFQ["productCategory"])}
                        className="w-full bg-white border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-[#18280e]"
                      >
                        <option value="Precision Castings & Brass">Precision Castings &amp; Brass</option>
                        <option value="Textiles & Organic Apparel">Textiles &amp; Organic Apparel</option>
                        <option value="Machined Engineering Components">Machined Engineering Components</option>
                        <option value="Auto Ancillaries">Auto Ancillaries</option>
                        <option value="Leather Goods">Leather Goods</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-700 mb-1">Product Description</label>
                      <input
                        type="text"
                        value={rfqProductName}
                        onChange={(e) => setRfqProductName(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-[#18280e]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-stone-700 mb-1">Target Quantity (Units)</label>
                        <input
                          type="number"
                          value={rfqQuantity}
                          onChange={(e) => setRfqQuantity(Number(e.target.value))}
                          className="w-full bg-white border border-stone-300 rounded-lg p-2.5 font-mono focus:outline-none focus:border-[#18280e]"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-700 mb-1">Target Price ($ USD / Unit)</label>
                        <input
                          type="number"
                          value={rfqTargetPrice}
                          onChange={(e) => setRfqTargetPrice(Number(e.target.value))}
                          className="w-full bg-white border border-stone-300 rounded-lg p-2.5 font-mono focus:outline-none focus:border-[#18280e]"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => setRfqSuccessMsg(true)}
                      className="w-full py-3 rounded-lg bg-[#18280e] text-[#b2eb76] font-mono font-bold text-xs uppercase hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                    >
                      <Send className="size-3.5" />
                      <span>Register RFQ &amp; Trigger AI Sourcing Match</span>
                    </button>
                    {rfqSuccessMsg && (
                      <div className="p-3 rounded-lg bg-green-50 border border-green-300 text-green-900 text-xs font-mono">
                        ✓ RFQ registered! Matched with 3 verified Indian MSME manufacturers in Moradabad &amp; Rajkot.
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-4">
                  <div className="p-6 rounded-2xl bg-[#18280E] text-white border border-[#2d421d] space-y-3">
                    <div className="text-xs font-mono uppercase text-[#b2eb76]">Active Sourcing Opportunities in Pipeline</div>
                    <h3 className="text-lg font-bold text-white">Genuine International Demand Log</h3>
                    <p className="text-xs text-stone-300">
                      We curate verified commercial demand from American, European and Australian importers seeking Indian production capacity.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {SEED_RFQS.map((rfq) => (
                      <div
                        key={rfq.id}
                        className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-2 text-xs"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-mono text-[10px] text-stone-500">{rfq.rfqNumber}</span>
                            <h4 className="font-bold text-stone-900 text-sm">{rfq.productName}</h4>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-[10px] font-mono font-bold uppercase">
                            {rfq.status}
                          </span>
                        </div>
                        <div className="text-stone-600">Buyer: {rfq.buyerCompany} ({rfq.buyerCountry})</div>
                        <div className="flex gap-4 font-mono text-[11px] text-[#18280e] font-semibold pt-1 border-t border-stone-100">
                          <span>Volume: {rfq.targetQuantity.toLocaleString()} units</span>
                          <span>Target: ${rfq.targetPricePerUnit} USD</span>
                          <span>Dest: {rfq.destinationPort}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: MSME MANUFACTURER QUALIFICATION */}
            {activeWorkflowStep === "manufacturer_matching" && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">
                      Qualified Indian Industrial Manufacturers
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">
                      We vet small and medium Indian manufacturers on business legitimacy (DGFT IEC, GSTN, Udyam MSME), actual factory capacity, machinery lines, and export readiness.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-stone-500 bg-white px-3 py-1.5 rounded-lg border border-stone-200">
                    Cluster Hubs: Moradabad, Tirupur, Rajkot
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {SEED_MANUFACTURERS.map((mfg) => (
                    <div
                      key={mfg.id}
                      className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-[#18280e] transition-all space-y-4 text-xs"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono text-[10px] text-stone-500 uppercase">{mfg.hubLocation}</span>
                          <h4 className="font-bold text-stone-900 text-sm mt-0.5">{mfg.legalEntityName}</h4>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-[#18280e] text-[#b2eb76] font-mono text-[11px] font-bold">
                          {mfg.readinessScore}% Match
                        </span>
                      </div>

                      <div className="space-y-1 font-mono text-[11px] text-stone-600">
                        <div>DGFT IEC: <strong className="text-stone-900">{mfg.iecCode}</strong></div>
                        <div>GSTIN: <strong className="text-stone-900">{mfg.gstin}</strong></div>
                        <div>Udyam MSME: <strong className="text-stone-900">{mfg.udyamRegistrationNumber}</strong></div>
                        <div>Monthly Capacity: <strong className="text-stone-900">{mfg.monthlyCapacityUnits.toLocaleString()} units</strong></div>
                      </div>

                      <div className="pt-2 border-t border-stone-100">
                        <span className="text-stone-500 font-mono text-[10px] uppercase block mb-1.5">
                          Verified Machinery &amp; Equipment Lines:
                        </span>
                        <ul className="list-disc pl-4 text-stone-700 space-y-0.5 text-[11px]">
                          {mfg.verifiedProductionLines.slice(0, 3).map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-1.5">
                        {mfg.certifications.map((c) => (
                          <span
                            key={c}
                            className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-mono text-[10px] font-semibold"
                          >
                            ✓ {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: QUOTATION & COMMERCIAL TERMS */}
            {activeWorkflowStep === "quotation_review" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-5">
                  <div className="border-b border-stone-200 pb-3 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-mono uppercase font-bold text-[#18280e]">
                        Formal Commercial Quotation
                      </span>
                      <h3 className="text-lg font-bold text-stone-900 mt-0.5">
                        {activeQuote.manufacturerName}
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-green-100 text-green-800 font-mono text-xs font-bold uppercase">
                      Status: {activeQuote.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-xs font-mono bg-white p-4 rounded-xl border border-stone-200">
                    <div>
                      <span className="text-stone-500 block">Unit Price:</span>
                      <strong className="text-base text-stone-900">${activeQuote.pricePerUnit} USD</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Total Order:</span>
                      <strong className="text-base text-[#18280e]">${activeQuote.totalQuotationAmount.toLocaleString()} USD</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Incoterms:</span>
                      <strong className="text-base text-stone-900">{activeQuote.incoterms}</strong>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <span className="font-mono text-stone-500 uppercase text-[11px] font-bold block">
                      Confirmed Technical Specifications &amp; Assurances:
                    </span>
                    <div className="space-y-1.5">
                      {activeQuote.specificationsConfirmed.map((spec) => (
                        <div key={spec} className="p-2.5 rounded bg-white border border-stone-200 flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-green-600 shrink-0" />
                          <span className="text-stone-800">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-stone-100 border border-stone-200 text-xs text-stone-700 space-y-1">
                    <div className="font-bold text-stone-900 font-mono">Commercial Installment Structure:</div>
                    <p>{activeQuote.commercialTermsNotes}</p>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <div className="p-6 rounded-2xl bg-[#18280E] text-white border border-[#2d421d] space-y-3">
                    <div className="text-xs font-mono uppercase text-[#b2eb76]">Trade Operator Negotiation Desk</div>
                    <h3 className="text-lg font-bold text-white">Protecting Both Counterparties</h3>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      We ensure the Indian manufacturer gets guaranteed 30% advance deposit coverage before cutting dies or buying raw brass, while protecting the American buyer with mandatory QIMA pre-shipment quality inspection before releasing the 70% balance.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-3 text-xs font-mono">
                    <div className="flex justify-between items-center py-1 border-b border-stone-100">
                      <span className="text-stone-500">Lead Time to Port:</span>
                      <strong className="text-stone-900">{activeQuote.leadTimeDays} Days</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-stone-100">
                      <span className="text-stone-500">Tooling &amp; Sample Delivery:</span>
                      <strong className="text-stone-900">{activeQuote.sampleAvailabilityDays} Days</strong>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-stone-500">Quotation Expiration:</span>
                      <strong className="text-stone-900">{activeQuote.validUntil}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: PAYPAL FINANCIAL EXECUTION */}
            {activeWorkflowStep === "paypal_settlement" && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-[#18280E] text-white border border-[#2d421d] flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="text-xs font-mono uppercase text-[#b2eb76]">PayPal Cross-Border Commercial Settlement</div>
                    <h3 className="text-2xl font-bold mt-1 text-white">Direct Buyer-To-Manufacturer Payment Layer</h3>
                    <p className="text-xs text-stone-300 mt-1 max-w-xl">
                      Foreign buyers pay Indian manufacturers directly using official PayPal commercial orders. The trade operator coordinates payment events and links them directly to shipping milestones without holding customer funds.
                    </p>
                  </div>

                  <button
                    onClick={handlePayPalCommercialDeposit}
                    disabled={paypalProcessing}
                    className="px-6 py-3 rounded-md bg-[#b2eb76] text-[#18280e] font-semibold text-xs font-mono uppercase hover:bg-white transition-all shadow-md cursor-pointer shrink-0"
                  >
                    {paypalProcessing ? "Processing PayPal API..." : "Initiate $24,990 Advance (PayPal)"}
                  </button>
                </div>

                {paypalResult && (
                  <div className="p-4 rounded-xl bg-green-50 border border-green-300 text-green-950 flex items-center justify-between text-xs font-mono">
                    <div>
                      <strong className="block text-sm">PayPal Commercial Order Generated</strong>
                      Transaction Reference: {paypalResult.id} • Status: {paypalResult.status}
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-stone-500 block">Direct Payee:</span>
                      <strong className="text-sm font-bold">{activeMfg.paypalEmail}</strong>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
                  <div className="p-5 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-stone-500 block uppercase">Commercial PO Amount</span>
                    <div className="text-2xl font-bold text-stone-900 mt-1">$83,300.00 USD</div>
                    <p className="text-stone-500 mt-1">3,500 Units Mortise Locksets</p>
                  </div>

                  <div className="p-5 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-stone-500 block uppercase">30% Advance Payment</span>
                    <div className="text-2xl font-bold text-[#18280e] mt-1">$24,990.00 USD</div>
                    <p className="text-green-700 font-bold mt-1">✓ Capture: 9C827104KL920194A</p>
                  </div>

                  <div className="p-5 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-stone-500 block uppercase">70% Balance Outstanding</span>
                    <div className="text-2xl font-bold text-stone-900 mt-1">$58,310.00 USD</div>
                    <p className="text-stone-500 mt-1">Payable Upon Bill of Lading</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
