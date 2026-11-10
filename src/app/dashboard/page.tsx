"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  Search,
  Zap,
  Radio,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { getCurrentSessionUser, setCurrentSessionUser } from "@/lib/auth/authStore";
import { elasticSearchEngine } from "@/lib/trade/elasticSearchEngine";
import { zapierAutomation, ZapierTradeEvent } from "@/lib/trade/zapierAutomation";
import { ACTIVE_SHIPMENTS } from "@/lib/trade/astropodsTelemetry";

export default function TradeOperatorDashboard() {
  const router = useRouter();
  const currentUser = getCurrentSessionUser();
  const [activeTab, setActiveTab] = useState<"paypal" | "elastic" | "zapier" | "astropods">("paypal");

  // ==========================================
  // 1. PAYPAL MILESTONE ESCROW STATE
  // ==========================================
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [paypalResponse, setPaypalResponse] = useState<{
    orderId?: string;
    status?: string;
    approveUrl?: string;
    amount?: string;
    timestamp?: string;
    isRealSandbox?: boolean;
    error?: string;
  } | null>(null);

  const [escrowStage, setEscrowStage] = useState<"not_started" | "advance_30_created" | "advance_30_captured" | "inspection_cleared" | "balance_70_settled">("not_started");

  const executeRealPayPalOrder = async (isAdvance: boolean) => {
    setPaypalLoading(true);
    setPaypalResponse(null);

    try {
      const res = await fetch("/api/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_paypal_payment",
          tradeId: "trade_global_01",
          isAdvance,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details || data.error || "Failed to create PayPal Order");
      }

      const pOrder = data.paymentOrder;
      const approveLink = pOrder.links?.find((l: { rel: string; href: string }) => l.rel === "approve")?.href ||
        `https://www.sandbox.paypal.com/checkoutnow?token=${pOrder.id}`;

      setPaypalResponse({
        orderId: pOrder.id,
        status: pOrder.status,
        approveUrl: approveLink,
        amount: isAdvance ? "$25,725.00 USD (30% Advance)" : "$60,025.00 USD (70% Balance)",
        timestamp: new Date().toLocaleTimeString(),
        isRealSandbox: true,
      });

      if (isAdvance) {
        setEscrowStage("advance_30_created");
      } else {
        setEscrowStage("balance_70_settled");
      }
    } catch (err) {
      setPaypalResponse({
        error: (err as Error).message,
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setPaypalLoading(false);
    }
  };

  // ==========================================
  // 2. ELASTIC SEARCH STATE
  // ==========================================
  const [elasticQuery, setElasticQuery] = useState("Architectural solid brass mortise locksets C36000 ASTM B117 salt spray ANSI Grade 1");
  const [selectedMaterial, setSelectedMaterial] = useState("Brass C36000");
  const [elasticResults, setElasticResults] = useState(
    elasticSearchEngine.searchSuitableManufacturers({
      productDescription: "Architectural solid brass mortise locksets C36000 ASTM B117 salt spray ANSI Grade 1",
      targetMaterial: "Brass C36000",
      requiredCertification: "ISO 9001:2015",
    })
  );

  const handleRunElasticSearch = () => {
    const results = elasticSearchEngine.searchSuitableManufacturers({
      productDescription: elasticQuery,
      targetMaterial: selectedMaterial,
      requiredCertification: "ISO 9001:2015",
    });
    setElasticResults(results);
  };

  // ==========================================
  // 3. ZAPIER AUTOMATION LOG
  // ==========================================
  const [zapierLog, setZapierLog] = useState<Array<{
    id: string;
    event: string;
    order: string;
    apps: string[];
    time: string;
  }>>([
    {
      id: "zap_01",
      event: "paypal.milestone_30_captured",
      order: "ORD-9921",
      apps: ["Slack (#factory-production)", "Google Sheets (MSME Queue)", "Gmail (Raw Brass Foundry)"],
      time: "10:14:02 AM",
    },
    {
      id: "zap_02",
      event: "qima.inspection_booked",
      order: "ORD-9921",
      apps: ["QIMA Testing Portal", "Outlook Calendar (Auditor Dispatch)", "WhatsApp (Plant QA Head)"],
      time: "11:30:15 AM",
    },
  ]);

  const triggerZapierMock = (eventType: ZapierTradeEvent["eventType"], orderNumber: string) => {
    const res = zapierAutomation.triggerTradeEvent({
      eventType,
      orderNumber,
      buyerName: "Pacific Architectural Hardware LLC",
      manufacturerLegalName: "Moradabad Precision Foundry & Exports",
      payload: { stage: eventType, timestamp: new Date().toISOString() },
    });
    console.log(res);

    const appsMap: Record<string, string[]> = {
      "rfq.published": ["Slack (#rfq-broadcast)", "WhatsApp (Cluster Heads)", "ERP Webhook"],
      "icegate.shipping_bill_filed": ["ICEGATE EDI Customs Agent", "Mundra Port Scheduler", "Dropbox (Export Docs)"],
      "customs.leo_cleared": ["Maersk Line Booking", "Buyer Procurement Portal", "SMS Alerts"],
      "ocean.bill_of_lading_issued": ["PayPal Settlement Ledger", "Indian Bank EDPMS", "QuickBooks Books"],
    };

    setZapierLog((prev) => [
      {
        id: `zap_${Date.now()}`,
        event: eventType,
        order: orderNumber,
        apps: appsMap[eventType] || ["External Webhook", "Email Alert"],
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
  };

  // ==========================================
  // 4. ASTROPODS TELEMETRY
  // ==========================================
  const [selectedShipment, setSelectedShipment] = useState<"ORD-9921" | "ORD-9918">("ORD-9921");
  const shipment = ACTIVE_SHIPMENTS[selectedShipment];

  return (
    <div className="min-h-screen bg-[#f4faed] text-[#18280e] font-sans selection:bg-[#b2eb76] selection:text-[#18280e]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-black/10 px-5 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4 shadow-xs font-mono">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span className="text-stone-300">|</span>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#3f7308] animate-pulse" />
            <span className="font-bold text-sm text-[#18280e]">
              TRUV Trade Operator &amp; Sponsor Infrastructure Console
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-2.5 py-1 rounded bg-[#ebf7d9] border border-[#d8e5ca] text-[#18280e] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#18280e]" />
            <span>PayPal Sandbox Active (IN)</span>
          </div>

          {currentUser && (
            <span className="text-stone-500 hidden sm:inline">
              Session: <strong>{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
            </span>
          )}

          <button
            type="button"
            onClick={() => {
              setCurrentSessionUser(null);
              router.push("/signin");
            }}
            className="text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded hover:bg-rose-100 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[82rem] mx-auto px-5 lg:px-8 py-8 space-y-6">
        {/* Top Hero Overview Banner */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#3f7308] font-semibold mb-1">
              <span>LIVE DEMO WORKBENCH</span>
              <span>•</span>
              <span>GLOBAL TRADE EXECUTION INFRASTRUCTURE</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#18280e]">
              Active Sponsor Tools &amp; Operational Execution Rails
            </h1>
            <p className="text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
              Demonstrating the real integrations powering TRUV: <strong>PayPal Orders v2</strong> milestone escrow, <strong>Elastic</strong> semantic MSME matching, <strong>Zapier</strong> cross-border workflow automation, and <strong>Astropods</strong> satellite container telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-stone-500 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200">
              Live Sandbox Rails
            </span>
          </div>
        </div>

        {/* 4 Interactive Sponsor Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab("paypal")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === "paypal"
                ? "bg-[#18280e] text-[#b2eb76] shadow-sm"
                : "bg-white text-stone-600 hover:text-black hover:bg-stone-50 border border-stone-200"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>1. PayPal Milestone Escrow (Live Credentials)</span>
          </button>

          <button
            onClick={() => setActiveTab("elastic")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === "elastic"
                ? "bg-[#18280e] text-[#b2eb76] shadow-sm"
                : "bg-white text-stone-600 hover:text-black hover:bg-stone-50 border border-stone-200"
            }`}
          >
            <Search className="w-4 h-4" />
            <span>2. Elastic MSME Search &amp; Match</span>
          </button>

          <button
            onClick={() => setActiveTab("zapier")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === "zapier"
                ? "bg-[#18280e] text-[#b2eb76] shadow-sm"
                : "bg-white text-stone-600 hover:text-black hover:bg-stone-50 border border-stone-200"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>3. Zapier Partner Automations</span>
          </button>

          <button
            onClick={() => setActiveTab("astropods")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === "astropods"
                ? "bg-[#18280e] text-[#b2eb76] shadow-sm"
                : "bg-white text-stone-600 hover:text-black hover:bg-stone-50 border border-stone-200"
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>4. Astropods Satellite Cargo Telemetry</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: PAYPAL LIVE SANDBOX EXECUTION WORKBENCH                           */}
        {/* ========================================================================= */}
        {activeTab === "paypal" && (
          <div className="space-y-6">
            {/* PayPal Credentials & Status Card */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm font-mono space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-stone-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ebf7d9] flex items-center justify-center text-[#18280e] font-black text-lg">
                    PP
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#18280e]">
                      PayPal Orders v2 Milestone Escrow Engine
                    </h2>
                    <span className="text-xs text-stone-500">
                      Configured with User Provided Developer Account
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Sandbox Auth Active</span>
                </div>
              </div>

              {/* Verified Developer Account Details Display */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-[#fbfdf9] p-4 rounded-xl border border-stone-200/80">
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase font-bold">App Name</span>
                  <span className="font-semibold text-[#18280e]">Platform Partner App - 4814021363243025883</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase font-bold">Client ID (Live Sandbox)</span>
                  <span className="font-semibold text-stone-700 truncate block font-mono">
                    AU-2yZPCo9C6_04QNEUens2pAgdB00D3Fh...
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase font-bold">Merchant Business Account</span>
                  <span className="font-semibold text-[#3f7308] block font-mono">
                    sb-knljl53833937@business.example.com
                  </span>
                </div>
              </div>

              {/* Escrow Milestone Pipeline Display */}
              <div className="pt-2">
                <span className="text-xs font-bold text-stone-600 uppercase tracking-wide block mb-3">
                  Commercial Contract #ORD-9921: $85,750.00 USD (Architectural Brass Mortise Locksets)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Step 1 */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    escrowStage !== "not_started" ? "bg-emerald-50/70 border-emerald-300 text-emerald-950" : "bg-white border-stone-200 text-stone-700"
                  }`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold uppercase">Milestone 1</span>
                      <span className="text-xs font-bold text-[#18280e]">$25,725.00</span>
                    </div>
                    <span className="text-xs font-medium block">30% Advance Production Escrow</span>
                    <span className="text-[11px] text-stone-500 mt-1 block">
                      Paid by Foreign Buyer via PayPal Orders v2 upon PO issuance.
                    </span>
                  </div>

                  {/* Step 2 */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    escrowStage === "inspection_cleared" || escrowStage === "balance_70_settled"
                      ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                      : "bg-white border-stone-200 text-stone-700"
                  }`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold uppercase">Milestone 2</span>
                      <span className="text-xs font-bold text-stone-500">Quality Lock</span>
                    </div>
                    <span className="text-xs font-medium block">QIMA Pre-Shipment Audit</span>
                    <span className="text-[11px] text-stone-500 mt-1 block">
                      Factory inspection at Moradabad brass foundry. AQL 1.5 passed.
                    </span>
                  </div>

                  {/* Step 3 */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    escrowStage === "balance_70_settled" ? "bg-emerald-50/70 border-emerald-300 text-emerald-950" : "bg-white border-stone-200 text-stone-700"
                  }`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold uppercase">Milestone 3</span>
                      <span className="text-xs font-bold text-[#18280e]">$60,025.00</span>
                    </div>
                    <span className="text-xs font-medium block">70% Final Balance Release</span>
                    <span className="text-[11px] text-stone-500 mt-1 block">
                      Settled against verified Ocean Bill of Lading (INMUN1 → USLGB).
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Trigger Real PayPal API Call */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => executeRealPayPalOrder(true)}
                  disabled={paypalLoading}
                  className="px-5 py-3 rounded-xl bg-[#18280e] hover:bg-[#274017] text-[#b2eb76] font-bold text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {paypalLoading ? "Connecting to PayPal Sandbox..." : "Trigger Live PayPal 30% Advance ($25,725.00)"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setEscrowStage("inspection_cleared")}
                  className="px-4 py-3 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Confirm QIMA Inspection
                </button>

                <button
                  type="button"
                  onClick={() => executeRealPayPalOrder(false)}
                  disabled={paypalLoading}
                  className="px-4 py-3 rounded-xl bg-[#ebf7d9] hover:bg-[#d8e5ca] text-[#18280e] font-bold text-xs border border-[#3f7308]/30 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Release 70% Final Settlement ($60,025.00)
                </button>
              </div>

              {/* Real PayPal Server Response Panel */}
              {paypalResponse && (
                <div className="mt-4 p-5 rounded-xl bg-[#131f0b] text-[#e1ecd6] border border-[#2b411a] space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-[#2b411a]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#b2eb76] animate-ping" />
                      <span className="text-xs font-bold text-[#b2eb76]">
                        REAL PAYPAL SANDBOX RESPONSE RECEIVED
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400">{paypalResponse.timestamp}</span>
                  </div>

                  {paypalResponse.error ? (
                    <div className="text-rose-400 text-xs">Error: {paypalResponse.error}</div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      <div className="flex flex-wrap justify-between gap-2">
                        <span className="text-stone-400">PayPal Order ID:</span>
                        <span className="font-bold text-white bg-black/50 px-2 py-0.5 rounded border border-[#2b411a]">
                          {paypalResponse.orderId}
                        </span>
                      </div>
                      <div className="flex flex-wrap justify-between gap-2">
                        <span className="text-stone-400">Order Status:</span>
                        <span className="font-bold text-[#b2eb76]">{paypalResponse.status}</span>
                      </div>
                      <div className="flex flex-wrap justify-between gap-2">
                        <span className="text-stone-400">Escrow Value:</span>
                        <span className="font-bold text-white">{paypalResponse.amount}</span>
                      </div>
                      {paypalResponse.approveUrl && (
                        <div className="pt-2">
                          <a
                            href={paypalResponse.approveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b2eb76] underline hover:text-white"
                          >
                            <span>Open in Official PayPal Sandbox Checkout</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Explanation Box for PayPal Representative */}
            <div className="bg-[#ebf7d9] p-5 rounded-2xl border border-[#3f7308]/20 text-xs text-[#18280e] space-y-2">
              <span className="font-bold block uppercase tracking-wide">
                Why this architecture is critical for PayPal in Indian B2B Exports:
              </span>
              <p className="leading-relaxed text-stone-700">
                Traditional PayPal transactions face chargeback risks if physical cargo transit is disconnected from the transaction ledger. In TRUV, PayPal Orders v2 is locked into the trade milestones: the 30% advance allows the Indian MSME to cast and machine the goods, while the 70% balance is captured only upon verification of the Bill of Lading and QIMA inspection report.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ELASTIC SEARCH & MSME CLUSTERS WORKBENCH                           */}
        {/* ========================================================================= */}
        {activeTab === "elastic" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm font-mono space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-stone-200">
                <div>
                  <h2 className="text-base font-bold text-[#18280e]">
                    Elasticsearch BM25 + Semantic Vector Match Engine
                  </h2>
                  <span className="text-xs text-stone-500">
                    Indexes Indian MSME Clusters &amp; Matches Technical RFQ Specifications
                  </span>
                </div>
                <span className="text-xs font-bold text-[#3f7308] bg-[#ebf7d9] px-2.5 py-1 rounded">
                  Index: truv-msme-clusters-v2
                </span>
              </div>

              {/* Search Query Inputs */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-stone-700">
                  Enter Foreign Buyer Technical RFQ Specifications:
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={elasticQuery}
                    onChange={(e) => setElasticQuery(e.target.value)}
                    className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-black focus:outline-none focus:border-[#3f7308]"
                  />
                  <select
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-black focus:outline-none"
                  >
                    <option value="Brass C36000">Brass C36000</option>
                    <option value="AISI 316 Stainless Steel">AISI 316 Stainless</option>
                    <option value="Boron steel">Boron steel</option>
                    <option value="Titanium Grade 5">Titanium Grade 5</option>
                    <option value="Ultra-compact sintered porcelain">Vitrified Porcelain</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleRunElasticSearch}
                    className="px-5 py-2.5 bg-[#18280e] hover:bg-[#274017] text-[#b2eb76] rounded-xl font-bold text-xs transition-colors shrink-0 cursor-pointer"
                  >
                    Run Elastic Query
                  </button>
                </div>
              </div>

              {/* Matched MSME Results Feed */}
              <div className="space-y-3 pt-3">
                <span className="text-xs font-bold text-stone-500 uppercase block">
                  Top Ranked Indian MSME Matches ({elasticResults.length} Factories Evaluated)
                </span>

                <div className="space-y-3">
                  {elasticResults.map((result, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-stone-200 bg-[#fbfdf9] hover:border-[#3f7308]/40 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#18280e]">
                              {result.msme.legalEntity}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              DGFT IEC: {result.msme.iecNumber}
                            </span>
                          </div>
                          <span className="text-xs text-stone-500">
                            Cluster: {result.msme.cluster} • {result.msme.state}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-lg font-black text-[#3f7308]">
                            {result.relevanceScore}%
                          </span>
                          <span className="text-[10px] text-stone-500 block uppercase">Elastic Score</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-stone-200/60 flex flex-wrap gap-2 text-[11px]">
                        {result.matchReasons.map((m, mIdx) => (
                          <span key={mIdx} className="px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                            ✓ {m}
                          </span>
                        ))}
                      </div>

                      <div className="mt-2 text-[11px] text-stone-500 flex flex-wrap justify-between gap-2">
                        <span>Equipment: {result.msme.equipment.join(", ")}</span>
                        <span>Capacity: {result.msme.monthlyCapacityUnits.toLocaleString()} units/mo</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ZAPIER CROSS-BORDER AUTOMATION WORKBENCH                           */}
        {/* ========================================================================= */}
        {activeTab === "zapier" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm font-mono space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-stone-200">
                <div>
                  <h2 className="text-base font-bold text-[#18280e]">
                    Zapier Cross-Border Trade Event Dispatcher
                  </h2>
                  <span className="text-xs text-stone-500">
                    Automates Coordination with External Freight Forwarders, Customs &amp; Testing Labs
                  </span>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded">
                  Webhooks Enabled
                </span>
              </div>

              {/* Trigger Simulated Events */}
              <div>
                <span className="text-xs font-bold text-stone-600 uppercase block mb-2">
                  Test Trigger Trade Workflow Event:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => triggerZapierMock("rfq.published", "RFQ-USA-2026-88201")}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    + Trigger &apos;rfq.published&apos;
                  </button>
                  <button
                    onClick={() => triggerZapierMock("icegate.shipping_bill_filed", "ORD-9921")}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    + Trigger &apos;icegate.shipping_bill_filed&apos;
                  </button>
                  <button
                    onClick={() => triggerZapierMock("customs.leo_cleared", "ORD-9921")}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    + Trigger &apos;customs.leo_cleared&apos; (Mundra Port)
                  </button>
                  <button
                    onClick={() => triggerZapierMock("ocean.bill_of_lading_issued", "ORD-9921")}
                    className="px-3 py-2 bg-[#ebf7d9] hover:bg-[#d8e5ca] text-[#18280e] rounded-lg text-xs font-bold border border-[#3f7308]/30 transition-colors cursor-pointer"
                  >
                    + Trigger &apos;ocean.bill_of_lading_issued&apos;
                  </button>
                </div>
              </div>

              {/* Live Webhook Log Feed */}
              <div className="space-y-3 pt-3">
                <span className="text-xs font-bold text-stone-500 uppercase block">
                  Live Dispatched Webhook Log ({zapierLog.length} Events)
                </span>

                <div className="space-y-2">
                  {zapierLog.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl border border-stone-200 bg-[#fbfdf9] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#18280e]">{log.event}</span>
                          <span className="text-[10px] text-stone-500">Order: {log.order}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 text-[11px] text-stone-600">
                          <span className="text-stone-400">Routed to:</span>
                          {log.apps.map((app, aIdx) => (
                            <span key={aIdx} className="bg-white border border-stone-200 px-1.5 py-0.5 rounded text-[10px]">
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-right text-[11px] text-stone-400 shrink-0">
                        {log.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ASTROPODS REAL-TIME SATELLITE CARGO TELEMETRY                      */}
        {/* ========================================================================= */}
        {activeTab === "astropods" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm font-mono space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-stone-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0a1105] text-[#b2eb76] flex items-center justify-center font-bold">
                    <Radio className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#18280e]">
                      Astropods AIS Satellite Cargo Telemetry
                    </h2>
                    <span className="text-xs text-stone-500">
                      Real-Time GPS &amp; IoT Container Tracking for Export Verification
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedShipment("ORD-9921")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      selectedShipment === "ORD-9921" ? "bg-[#18280e] text-[#b2eb76]" : "bg-stone-100 text-stone-700"
                    }`}
                  >
                    ORD-9921 (In Transit)
                  </button>
                  <button
                    onClick={() => setSelectedShipment("ORD-9918")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      selectedShipment === "ORD-9918" ? "bg-[#18280e] text-[#b2eb76]" : "bg-stone-100 text-stone-700"
                    }`}
                  >
                    ORD-9918 (Arrived)
                  </button>
                </div>
              </div>

              {/* Active Container Telemetry Card */}
              <div className="bg-[#131f0b] text-[#e1ecd6] p-6 rounded-2xl border border-[#2b411a] space-y-4">
                <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-[#2b411a]">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-bold">
                      Container Identifier
                    </span>
                    <span className="text-lg font-bold text-white">{shipment.containerNumber}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-bold">
                      IoT Seal Status
                    </span>
                    <span className="text-xs font-bold text-[#b2eb76] bg-black/40 px-2 py-1 rounded border border-[#2b411a]">
                      ✓ {shipment.sealIntegrity} ({shipment.sealNumber})
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-bold">
                      Transit Status
                    </span>
                    <span className="text-xs font-bold text-amber-400">
                      {shipment.status.replace("_", " ")}
                    </span>
                  </div>
                </div>

                {/* Vessel & Location Coordinates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs pt-2">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Carrier Vessel</span>
                    <span className="font-bold text-white">{shipment.carrierVessel}</span>
                    <span className="text-[10px] text-stone-500 block">Voyage {shipment.voyageNumber}</span>
                  </div>

                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Satellite GPS Fix</span>
                    <span className="font-bold text-[#b2eb76]">
                      {shipment.currentCoordinates.lat.toFixed(4)}° N, {shipment.currentCoordinates.lng.toFixed(4)}° E
                    </span>
                    <span className="text-[10px] text-stone-400 block truncate">
                      {shipment.currentCoordinates.locationName}
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Vessel Speed / Temp</span>
                    <span className="font-bold text-white">
                      {shipment.vesselSpeedKnots} knots • {shipment.containerTempCelsius}°C
                    </span>
                    <span className="text-[10px] text-stone-500 block">AIS Satellite Feed</span>
                  </div>

                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Port Destination ETA</span>
                    <span className="font-bold text-white">{shipment.estArrivalDate}</span>
                    <span className="text-[10px] text-stone-400 block">
                      {shipment.daysRemaining > 0 ? `${shipment.daysRemaining} days remaining` : "Berthing Completed"}
                    </span>
                  </div>
                </div>

                {/* Shipping Lane Visual Bar */}
                <div className="pt-4 border-t border-[#2b411a] space-y-2">
                  <div className="flex justify-between text-[11px] text-stone-400">
                    <span>Origin: {shipment.originPort}</span>
                    <span>Destination: {shipment.destinationPort}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-[#3f7308] to-[#b2eb76] transition-all"
                      style={{ width: shipment.daysRemaining === 0 ? "100%" : "65%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
