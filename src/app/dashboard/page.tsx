"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Store,
  Receipt,
  Settings,
  Calendar,
  Download,
  Eye,
  MousePointer,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  CreditCard,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Clock,
  FileCheck2,
  Layers,
  Scale,
} from "lucide-react";
import { getCurrentSessionUser, setCurrentSessionUser } from "@/lib/auth/authStore";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";

// =========================================================================
// TRADEORACLE: ONE CONNECTED RECORD FOR GOODS & SERVICES EXPORTS
// Journey: Find → Agree → Pay → Deliver → Prove → Resolve
// =========================================================================

export interface ConnectedTradeRecord {
  id: string;
  txReference: string;
  type: "service" | "goods";
  title: string;
  sectorBadge: string;
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
    entityType: "Indian IT Agency" | "Indian Manufacturer";
    taxId: string; // GSTIN / IEC
  };
  // 1. AGREEMENT (What was promised)
  agreement: {
    contractDate: string;
    scopeOfWork: string;
    specifications: string[];
    contractValueUSD: number;
    currency: "USD";
    milestones: { title: string; sharePercent: number; amountUSD: number; status: "completed" | "in_progress" | "pending" }[];
  };
  // 2. PAYPAL PAYMENT (What was paid)
  paypalPayment: {
    status: "CAPTURED" | "HELD_ESCROW" | "AUTHORIZED";
    orderId: string;
    captureId?: string;
    paidAmountUSD: number;
    payerEmail: string;
    payeeEmail: string;
    settledDate?: string;
    webhookSynced: boolean;
  };
  // 3. DELIVERY & FULFILMENT EVIDENCE (What was delivered & proved)
  evidence: {
    deliveredDate: string;
    items: {
      type: "git_commit_pr" | "staging_url" | "qima_aql" | "bill_of_lading" | "shipping_bill_icegate";
      label: string;
      identifier: string;
      verified: boolean;
      fileUrl?: string;
    }[];
  };
  // 4. DISPUTE READINESS (Resolve)
  disputeSupport: {
    status: "clean_record" | "dispute_in_review" | "resolved_seller_favor";
    paypalEvidencePackReady: boolean;
    auditLogCount: number;
    caComplianceVerified: boolean;
  };
  laymanSummary: string;
}

const TRADE_ORACLE_RECORDS: ConnectedTradeRecord[] = [
  // SITUATION A: SERVICE EXPORT (US SaaS Company hiring Indian Software Agency)
  {
    id: "tx_srv_001",
    txReference: "TO-SRV-2026-4401",
    type: "service",
    title: "AI Fintech Workflow Engine & React Native Mobile App",
    sectorBadge: "Service Export (Software / IT)",
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
      entityType: "Indian IT Agency",
      taxId: "GSTIN: 29AAHCC8812M1ZM",
    },
    agreement: {
      contractDate: "2026-10-18",
      scopeOfWork: "Fullstack development of transactional risk-scoring engine with 6 REST APIs and cross-platform React Native client app.",
      specifications: [
        "TypeScript Next.js 16 + Node backend",
        "PayPal Webhook v2 reconciliation worker",
        "99.9% uptime test suite with 45 unit tests passed",
        "Sign-off against Figma wireframe v3.2",
      ],
      contractValueUSD: 5000,
      currency: "USD",
      milestones: [
        { title: "M1: Architecture & API Specs", sharePercent: 30, amountUSD: 1500, status: "completed" },
        { title: "M2: Core Engine & GitHub PR Merge", sharePercent: 40, amountUSD: 2000, status: "completed" },
        { title: "M3: QA Sign-off & Production Release", sharePercent: 30, amountUSD: 1500, status: "in_progress" },
      ],
    },
    paypalPayment: {
      status: "CAPTURED",
      orderId: "54X810928B339812M",
      captureId: "CAP-994102941-PP",
      paidAmountUSD: 3500, // M1 + M2 captured
      payerEmail: "billing@stratospherecloud.com",
      payeeEmail: "sb-knljl53833937@business.example.com", // user's real paypal sandbox
      settledDate: "2026-11-04 14:22:10 UTC",
      webhookSynced: true,
    },
    evidence: {
      deliveredDate: "2026-11-08",
      items: [
        { type: "git_commit_pr", label: "GitHub Enterprise PR #142 Merged", identifier: "commit-sha-7e810a9f", verified: true },
        { type: "staging_url", label: "Live Staging Verification Sandbox", identifier: "https://staging-engine.internal/test-pass", verified: true },
      ],
    },
    disputeSupport: {
      status: "clean_record",
      paypalEvidencePackReady: true,
      auditLogCount: 18,
      caComplianceVerified: true,
    },
    laymanSummary:
      "A US client hired an Indian software studio for a $5,000 application. TradeOracle locks what was promised in the digital contract, syncs the $3,500 received via PayPal, and timestamps the GitHub PR code merges so if the client ever claims 'nothing was built', the evidence bundle immediately protects the Indian team in PayPal Resolution Center.",
  },

  // SITUATION B: GOODS EXPORT (US Importer ordering Industrial Components from Indian Manufacturer)
  {
    id: "tx_gds_002",
    txReference: "TO-GDS-2026-8819",
    type: "goods",
    title: "Precision Machined Pump Casting & CNC Valves",
    sectorBadge: "Goods Export (Industrial Manufacturing)",
    buyer: {
      name: "Marcus Vance",
      company: "Pacific Industrial Flow Systems LLC",
      country: "United States",
      flag: "🇺🇸",
      city: "Long Beach, California",
    },
    seller: {
      name: "Rajesh Panchal",
      company: "Saurashtra Precision Pump Foundry LLP",
      location: "Rajkot GIDC, Gujarat",
      entityType: "Indian Manufacturer",
      taxId: "DGFT IEC: 0812049182 | GSTIN: 24AABCS9184P1Z3",
    },
    agreement: {
      contractDate: "2026-10-25",
      scopeOfWork: "5,000 units of investment-cast ductile iron pump impellers and CNC turned hydraulic valves (Alloy CF8M / 316 SS).",
      specifications: [
        "ASTM A351 CF8M Stainless Casting",
        "CNC Turning tolerance ±0.015mm",
        "QIMA AQL 1.5 hydro-static pressure test at 25 bar",
        "FOB Mundra Port ocean container packing in shrink-wrapped pallets",
      ],
      contractValueUSD: 85750,
      currency: "USD",
      milestones: [
        { title: "M1: 30% Raw Material Advance", sharePercent: 30, amountUSD: 25725, status: "completed" },
        { title: "M2: QIMA Pre-Shipment Inspection", sharePercent: 0, amountUSD: 0, status: "completed" },
        { title: "M3: 70% Balance against Bill of Lading", sharePercent: 70, amountUSD: 60025, status: "in_progress" },
      ],
    },
    paypalPayment: {
      status: "HELD_ESCROW",
      orderId: "2JM21803AA658230N", // user verified real order id!
      captureId: "CAP-2JM21803AA",
      paidAmountUSD: 25725,
      payerEmail: "purchasing@pacificflow.com",
      payeeEmail: "sb-knljl53833937@business.example.com", // user's real paypal sandbox
      settledDate: "2026-11-10 09:23:16 UTC",
      webhookSynced: true,
    },
    evidence: {
      deliveredDate: "2026-11-09",
      items: [
        { type: "qima_aql", label: "QIMA AQL 1.5 Hydro-Static Audit (PASSED)", identifier: "QIMA-AUDIT-IN-98124", verified: true },
        { type: "shipping_bill_icegate", label: "ICEGATE Shipping Bill (Let Export Order)", identifier: "SB-INMUN1-2026-981024", verified: true },
        { type: "bill_of_lading", label: "Maersk Bill of Lading (MSKU-7491024)", identifier: "BL-MSK-2026-44018A", verified: true },
      ],
    },
    disputeSupport: {
      status: "clean_record",
      paypalEvidencePackReady: true,
      auditLogCount: 26,
      caComplianceVerified: true,
    },
    laymanSummary:
      "A California company bought $85,750 worth of cast steel pump valves from a Rajkot foundry. TradeOracle connects the exact metallurgical drawing, the $25,725 deposit received via PayPal, the official QIMA test certificate, and the shipping container bill into one connected record. If the buyer tries to charge back, TradeOracle submits verified physical shipping evidence to PayPal.",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const currentUser = getCurrentSessionUser();

  // Active view state
  const [activeNav, setActiveNav] = useState<
    "dashboard" | "tradeoracle" | "orders" | "layman_store" | "products" | "customers" | "invoices" | "transactions" | "settings" | "help"
  >("dashboard");

  const [financesOpen, setFinancesOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<ConnectedTradeRecord>(TRADE_ORACLE_RECORDS[1]);
  const [activeStepTab, setActiveStepTab] = useState<"agree" | "pay" | "deliver" | "prove" | "resolve">("agree");

  // PayPal live sandbox execution state inside the dashboard
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [paypalLiveLog, setPaypalLiveLog] = useState<{
    id?: string;
    status?: string;
    approveUrl?: string;
    amount?: string;
    timestamp?: string;
  } | null>(null);

  const triggerLivePayPalOrder = async () => {
    setPaypalLoading(true);
    try {
      const res = await fetch("/api/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_paypal_payment",
          tradeId: "trade_global_01",
          isAdvance: true,
        }),
      });
      const data = await res.json();
      if (data.success && data.paymentOrder) {
        const approveLink =
          data.paymentOrder.links?.find((l: { rel: string; href: string }) => l.rel === "approve")?.href ||
          `https://www.sandbox.paypal.com/checkoutnow?token=${data.paymentOrder.id}`;
        setPaypalLiveLog({
          id: data.paymentOrder.id,
          status: data.paymentOrder.status,
          approveUrl: approveLink,
          amount: "$25,725.00 USD (30% Advance Escrow)",
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    } catch {
      // fallback
    } finally {
      setPaypalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4faed] text-[#18280e] font-sans selection:bg-[#b2eb76] selection:text-[#18280e] flex">
      {/* ========================================================================= */}
      {/* 1. MINIMALISTIC SIDEBAR (Sleek, Clean, Theme Matched)                     */}
      {/* ========================================================================= */}
      <aside className="w-60 bg-white border-r border-stone-200/70 flex flex-col justify-between shrink-0 min-h-screen sticky top-0 z-30 shadow-2xs">
        <div>
          {/* Brand Header */}
          <div className="h-14 px-5 flex items-center justify-between border-b border-stone-100">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-extrabold text-lg tracking-tight text-[#18280e] font-sans group-hover:text-[#3f7308] transition-colors">
                TradeOracle<span className="text-[#3f7308]">.</span>
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#ebf7d9] text-[#3f7308] font-bold">
                PAYPAL RAILS
              </span>
            </Link>
          </div>

          {/* Minimalist Navigation Items */}
          <nav className="p-3 space-y-1 text-xs font-medium">
            {/* 1. Dashboard (Template Analytics) */}
            <button
              onClick={() => setActiveNav("dashboard")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeNav === "dashboard"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : "text-stone-600 hover:bg-[#f4faed] hover:text-[#18280e]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Dashboard</span>
              </div>
              {activeNav === "dashboard" && <span className="w-1.5 h-1.5 rounded-full bg-[#b2eb76]" />}
            </button>

            {/* 2. TradeOracle Connected Records (The Heart of the Product) */}
            <button
              onClick={() => setActiveNav("tradeoracle")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeNav === "tradeoracle"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : "text-[#18280e] bg-[#ebf7d9] hover:bg-[#d8e5ca] font-bold"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 shrink-0 text-[#3f7308]" />
                <span>Connected Records</span>
              </div>
              <span className="px-1.5 py-0.2 rounded bg-[#18280e] text-[#b2eb76] font-mono text-[9px] font-bold">
                1-RECORD
              </span>
            </button>

            {/* 3. Foreigner Orders (Layman E-Commerce View) */}
            <button
              onClick={() => setActiveNav("layman_store")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeNav === "layman_store"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : "text-stone-600 hover:bg-[#f4faed] hover:text-[#18280e]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4 shrink-0" />
                <span>Layman Orders</span>
              </div>
            </button>

            {/* 4. Orders */}
            <button
              onClick={() => setActiveNav("orders")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeNav === "orders"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold"
                  : "text-stone-600 hover:bg-[#f4faed] hover:text-[#18280e]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>Orders</span>
              </div>
              <span className="px-1.5 py-0.2 rounded-full bg-[#ebf7d9] text-[#3f7308] font-bold font-mono text-[10px]">
                46
              </span>
            </button>

            {/* 5. Products / RFQs */}
            <button
              onClick={() => setActiveNav("products")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeNav === "products"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold"
                  : "text-stone-600 hover:bg-[#f4faed] hover:text-[#18280e]"
              }`}
            >
              <Package className="w-4 h-4 shrink-0" />
              <span>Products / RFQs</span>
            </button>

            {/* 6. Customers */}
            <button
              onClick={() => setActiveNav("customers")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeNav === "customers"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold"
                  : "text-stone-600 hover:bg-[#f4faed] hover:text-[#18280e]"
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Customers</span>
            </button>

            {/* Finances Dropdown */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setFinancesOpen(!financesOpen)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-stone-400 font-semibold hover:text-[#18280e] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Finances &amp; PayPal</span>
                </div>
                {financesOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>

              {financesOpen && (
                <div className="pl-4 pt-1 space-y-0.5 text-xs text-stone-600">
                  <button
                    onClick={() => setActiveNav("invoices")}
                    className={`w-full text-left py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                      activeNav === "invoices" ? "bg-[#18280e] text-[#b2eb76] font-semibold" : "hover:bg-[#f4faed]"
                    }`}
                  >
                    Invoices
                  </button>
                  <button
                    onClick={() => setActiveNav("transactions")}
                    className={`w-full text-left py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                      activeNav === "transactions" ? "bg-[#18280e] text-[#b2eb76] font-semibold" : "hover:bg-[#f4faed]"
                    }`}
                  >
                    Transactions &amp; Escrow
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Minimal Bottom Controls */}
        <div className="p-3 border-t border-stone-100 space-y-2">
          {/* Quick Account Badge */}
          <div className="p-2.5 rounded-xl bg-[#f4faed] border border-[#d8e5ca] text-[11px] font-mono space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-stone-500 font-semibold">PayPal Auth</span>
              <span className="size-1.5 rounded-full bg-[#3f7308] animate-pulse" />
            </div>
            <span className="text-[#18280e] font-bold block truncate">
              sb-knljl53833937@business
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500 px-1 font-mono">
            <button
              onClick={() => setActiveNav("settings")}
              className="hover:text-black transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Settings className="w-3 h-3" />
              <span>Settings</span>
            </button>
            <Link href="/" className="hover:text-black transition-colors">
              Exit
            </Link>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MINIMALISTIC TOP HEADER                                                */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-stone-200/70 px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-[#18280e] tracking-tight">
              {activeNav === "dashboard" && "Dashboard"}
              {activeNav === "tradeoracle" && "TradeOracle // Connected Transaction Ledger"}
              {activeNav === "layman_store" && "Foreigner Orders // Merchant View"}
              {activeNav === "orders" && "Active Orders"}
              {activeNav === "products" && "Products & RFQs"}
              {activeNav === "customers" && "Customers & Counterparties"}
              {activeNav === "invoices" && "Invoices & Settlement"}
              {activeNav === "transactions" && "Transactions"}
              {activeNav === "settings" && "Platform Settings"}
            </h1>
            <span className="text-xs font-mono text-stone-400 hidden sm:inline">
              {"•"} Find → Agree → Pay → Deliver → Prove → Resolve
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick Switcher Button between Dashboard and TradeOracle */}
            <button
              type="button"
              onClick={() => setActiveNav(activeNav === "tradeoracle" ? "dashboard" : "tradeoracle")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#ebf7d9] text-[#18280e] hover:bg-[#d8e5ca] border border-[#d8e5ca] transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#3f7308]" />
              <span>{activeNav === "tradeoracle" ? "Template View" : "TradeOracle View"}</span>
            </button>

            {/* Date Range Selector */}
            <div className="hidden md:flex items-center gap-1.5 bg-[#f4faed] px-2.5 py-1 rounded-lg text-xs font-mono text-stone-600">
              <Calendar className="w-3 h-3 text-stone-400" />
              <span>Last 30 days</span>
            </div>

            {/* Export */}
            <button
              type="button"
              onClick={() => alert("Exporting TradeOracle CA-accessible transaction pack...")}
              className="flex items-center gap-1 px-3 py-1 bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>Export</span>
            </button>

            {currentUser && (
              <button
                type="button"
                onClick={() => {
                  setCurrentSessionUser(null);
                  router.push("/signin");
                }}
                className="text-xs font-mono text-rose-700 bg-rose-50 border border-rose-200 px-2 py-1 rounded hover:bg-rose-100 transition-colors cursor-pointer"
              >
                Logout
              </button>
            )}
          </div>
        </header>

        {/* Main Content Body */}
        <main className="p-5 md:p-7 space-y-6 max-w-[86rem] w-full mx-auto">
          {/* ========================================================================= */}
          {/* VIEW 1: TRADEORACLE CONNECTED TRANSACTION RECORD (The Core Implementation)*/}
          {/* Journey: Find → Agree → Pay → Deliver → Prove → Resolve                   */}
          {/* ========================================================================= */}
          {activeNav === "tradeoracle" && (
            <div className="space-y-6 animate-in fade-in">
              {/* Top Banner: Core Value Proposition */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#3f7308] uppercase mb-1">
                    <span>TradeOracle Transaction Engine</span>
                    <span>•</span>
                    <span>PayPal Integrated Rails</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#18280e] tracking-tight">
                    One Transaction. One Connected Record.
                  </h2>
                  <p className="text-xs text-stone-600 mt-1 max-w-3xl leading-relaxed">
                    Connecting what was <strong>promised</strong> (commercial contract), what was <strong>paid</strong> (PayPal Orders v2), and what was <strong>delivered &amp; proved</strong> (QIMA inspection &amp; Bill of Lading) into one single audit record for foreign buyers, Indian businesses, and Chartered Accountants.
                  </p>
                </div>

                {/* Situation A vs Situation B Switcher */}
                <div className="flex items-center gap-2 bg-[#f4faed] p-1.5 rounded-xl border border-[#d8e5ca] shrink-0 font-mono text-xs">
                  <button
                    onClick={() => setSelectedTx(TRADE_ORACLE_RECORDS[0])}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      selectedTx.id === "tx_srv_001"
                        ? "bg-[#18280e] text-[#b2eb76] shadow-xs"
                        : "text-stone-600 hover:text-black"
                    }`}
                  >
                    Situation A: Service Export ($5k)
                  </button>
                  <button
                    onClick={() => setSelectedTx(TRADE_ORACLE_RECORDS[1])}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      selectedTx.id === "tx_gds_002"
                        ? "bg-[#18280e] text-[#b2eb76] shadow-xs"
                        : "text-stone-600 hover:text-black"
                    }`}
                  >
                    Situation B: Goods Export ($85.7k)
                  </button>
                </div>
              </div>

              {/* 6-Stage Transaction Journey Bar (Find → Agree → Pay → Deliver → Prove → Resolve) */}
              <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs font-mono">
                  {/* Stage 1: Find */}
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase font-bold">1. Find</span>
                      <span className="font-bold text-[#18280e]">Discovery</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>

                  {/* Stage 2: Agree */}
                  <button
                    onClick={() => setActiveStepTab("agree")}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      activeStepTab === "agree"
                        ? "bg-[#18280e] text-[#b2eb76] border-[#18280e]"
                        : "bg-stone-50 hover:bg-[#f4faed] border-stone-100 text-[#18280e]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] opacity-70 block uppercase font-bold">2. Agree</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="font-bold text-xs block truncate">Agreement</span>
                  </button>

                  {/* Stage 3: Pay */}
                  <button
                    onClick={() => setActiveStepTab("pay")}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      activeStepTab === "pay"
                        ? "bg-[#18280e] text-[#b2eb76] border-[#18280e]"
                        : "bg-stone-50 hover:bg-[#f4faed] border-stone-100 text-[#18280e]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] opacity-70 block uppercase font-bold">3. Pay</span>
                      <CreditCard className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="font-bold text-xs block truncate">PayPal Rails</span>
                  </button>

                  {/* Stage 4: Deliver */}
                  <button
                    onClick={() => setActiveStepTab("deliver")}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      activeStepTab === "deliver"
                        ? "bg-[#18280e] text-[#b2eb76] border-[#18280e]"
                        : "bg-stone-50 hover:bg-[#f4faed] border-stone-100 text-[#18280e]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] opacity-70 block uppercase font-bold">4. Deliver</span>
                      <Clock className="w-4 h-4 text-amber-500" />
                    </div>
                    <span className="font-bold text-xs block truncate">Fulfilment</span>
                  </button>

                  {/* Stage 5: Prove */}
                  <button
                    onClick={() => setActiveStepTab("prove")}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      activeStepTab === "prove"
                        ? "bg-[#18280e] text-[#b2eb76] border-[#18280e]"
                        : "bg-stone-50 hover:bg-[#f4faed] border-stone-100 text-[#18280e]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] opacity-70 block uppercase font-bold">5. Prove</span>
                      <FileCheck2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="font-bold text-xs block truncate">Evidence</span>
                  </button>

                  {/* Stage 6: Resolve */}
                  <button
                    onClick={() => setActiveStepTab("resolve")}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      activeStepTab === "resolve"
                        ? "bg-[#18280e] text-[#b2eb76] border-[#18280e]"
                        : "bg-stone-50 hover:bg-[#f4faed] border-stone-100 text-[#18280e]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] opacity-70 block uppercase font-bold">6. Resolve</span>
                      <Scale className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="font-bold text-xs block truncate">Dispute Ready</span>
                  </button>
                </div>
              </div>

              {/* Active Transaction Master Record Card */}
              <SpotlightCard className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
                {/* Header: Parties Involved */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-stone-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-[#18280e]">{selectedTx.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ebf7d9] text-[#3f7308] font-bold">
                        {selectedTx.sectorBadge}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-stone-500 mt-0.5 block">
                      Ref: <strong>{selectedTx.txReference}</strong> • Dated: {selectedTx.agreement.contractDate}
                    </span>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-lg font-bold text-[#18280e]">
                      ${selectedTx.agreement.contractValueUSD.toLocaleString()} USD
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded block font-semibold mt-0.5">
                      PayPal Protected
                    </span>
                  </div>
                </div>

                {/* Layman Overview Box */}
                <div className="p-4 rounded-xl bg-[#f8fbf5] border border-[#d8e5ca] text-xs text-stone-800 leading-relaxed space-y-1">
                  <div className="flex items-center gap-2 font-mono font-bold text-[#3f7308] text-[11px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>The Underlying Trade Story:</span>
                  </div>
                  <p>{selectedTx.laymanSummary}</p>
                </div>

                {/* 2-Column Entity Breakdown: Buyer vs Indian Seller */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  {/* Foreign Buyer Box */}
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] text-stone-400 font-bold uppercase">
                      <span>Foreign Buyer</span>
                      <span>{selectedTx.buyer.flag} {selectedTx.buyer.country}</span>
                    </div>
                    <span className="font-bold text-sm text-[#18280e] block">
                      {selectedTx.buyer.company}
                    </span>
                    <span className="text-stone-600 block">
                      Contact: {selectedTx.buyer.name} • {selectedTx.buyer.city}
                    </span>
                  </div>

                  {/* Indian Service Provider / Manufacturer Box */}
                  <div className="p-4 rounded-xl bg-[#ebf7d9]/60 border border-[#d8e5ca] space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] text-[#3f7308] font-bold uppercase">
                      <span>Indian Provider</span>
                      <span>🇮🇳 {selectedTx.seller.entityType}</span>
                    </div>
                    <span className="font-bold text-sm text-[#18280e] block">
                      {selectedTx.seller.company}
                    </span>
                    <span className="text-stone-700 block">
                      Lead: {selectedTx.seller.name} • {selectedTx.seller.location}
                    </span>
                    <span className="text-[10px] font-bold text-[#18280e] block">
                      {selectedTx.seller.taxId}
                    </span>
                  </div>
                </div>

                {/* Deep-Dive Step Panel (Agree, Pay, Deliver, Prove, Resolve) */}
                <div className="pt-2 border-t border-stone-100">
                  {/* TAB 2: AGREE (What was promised) */}
                  {activeStepTab === "agree" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-[#18280e] uppercase tracking-wide font-mono">
                          Commercial Agreement &amp; Technical Scope
                        </span>
                        <span className="text-xs font-mono text-stone-500">Contract Signed Digitally</span>
                      </div>
                      <p className="text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200">
                        {selectedTx.agreement.scopeOfWork}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                        {selectedTx.agreement.specifications.map((spec, sIdx) => (
                          <div key={sIdx} className="p-2.5 rounded-lg bg-stone-50 border border-stone-100 flex items-center gap-2">
                            <span className="text-[#3f7308] font-bold">✓</span>
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2 pt-2">
                        <span className="text-[11px] font-mono text-stone-500 uppercase font-bold block">
                          Milestone Payment Schedule
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                          {selectedTx.agreement.milestones.map((m, mIdx) => (
                            <div key={mIdx} className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex justify-between items-center">
                              <div>
                                <span className="font-bold text-[#18280e] block">{m.title}</span>
                                <span className="text-[10px] text-stone-500">${m.amountUSD.toLocaleString()} USD</span>
                              </div>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                m.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                              }`}>
                                {m.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: PAY (PayPal Rails) */}
                  {activeStepTab === "pay" && (
                    <div className="space-y-4 font-mono text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#18280e] uppercase">
                          PayPal Orders v2 Financial Execution
                        </span>
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                          Status: {selectedTx.paypalPayment.status}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-[#131f0b] text-[#e1ecd6] border border-[#2b411a] space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-[#2b411a]">
                          <span>PayPal Order Reference:</span>
                          <strong className="text-white">{selectedTx.paypalPayment.orderId}</strong>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Amount Processed via PayPal:</span>
                          <strong className="text-[#b2eb76]">${selectedTx.paypalPayment.paidAmountUSD.toLocaleString()} USD</strong>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Merchant Payee Account:</span>
                          <span className="text-stone-300">{selectedTx.paypalPayment.payeeEmail}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Settled Timestamp:</span>
                          <span className="text-stone-300">{selectedTx.paypalPayment.settledDate}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={triggerLivePayPalOrder}
                          disabled={paypalLoading}
                          className="px-4 py-2.5 bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] rounded-xl font-bold transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {paypalLoading ? "Connecting to PayPal Sandbox..." : "Trigger Live PayPal Order via API"}
                        </button>

                        {paypalLiveLog && (
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                            ✓ PayPal Created: {paypalLiveLog.id}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: DELIVER & FULFILMENT */}
                  {activeStepTab === "deliver" && (
                    <div className="space-y-4 font-mono text-xs">
                      <span className="font-bold text-[#18280e] uppercase block">
                        Fulfilment Tracking &amp; Milestone Milestones
                      </span>
                      <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                        <span className="text-stone-500 block">
                          Delivery Date: <strong>{selectedTx.evidence.deliveredDate}</strong>
                        </span>
                        <p className="text-stone-700">
                          {selectedTx.type === "service"
                            ? "All project commits merged into client GitHub repository with test coverage report attached."
                            : "Goods dispatched from Rajkot foundry to Mundra Port container terminal. QIMA pre-shipment audit passed."}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: PROVE (Fulfilment Evidence) */}
                  {activeStepTab === "prove" && (
                    <div className="space-y-4 font-mono text-xs">
                      <span className="font-bold text-[#18280e] uppercase block">
                        Connected Fulfilment Evidence Documents
                      </span>
                      <div className="space-y-2">
                        {selectedTx.evidence.items.map((item, iIdx) => (
                          <div key={iIdx} className="p-3.5 rounded-xl bg-[#fbfdf9] border border-stone-200 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <div>
                                <span className="font-bold text-[#18280e] block">{item.label}</span>
                                <span className="text-[11px] text-stone-500 font-mono">Evidence ID: {item.identifier}</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                              VERIFIED EVIDENCE
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 6: RESOLVE (Dispute Readiness & CA Audit) */}
                  {activeStepTab === "resolve" && (
                    <div className="space-y-4 font-mono text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#18280e] uppercase">
                          PayPal Dispute Protection &amp; CA Review Pack
                        </span>
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                          Clean Record (No Dispute Raised)
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-[#ebf7d9] border border-[#d8e5ca] text-stone-800 space-y-2">
                        <span className="font-bold text-[#18280e] block">
                          Dispute Assistance Architecture:
                        </span>
                        <p className="leading-relaxed">
                          If a buyer opens a PayPal dispute, TradeOracle packages the signed specification agreement, the PayPal capture reference, and the verified delivery evidence (GitHub merge or Ocean Bill of Lading) into one authoritative rebuttal dossier formatted specifically for the PayPal Resolution Center.
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-2 text-[11px] text-stone-500">
                        <span>Chartered Accountant Export Compliance Pack: <strong>READY</strong></span>
                        <button
                          onClick={() => alert("Downloading CA-approved EDPMS and invoice audit file...")}
                          className="text-[#3f7308] font-bold underline"
                        >
                          Download CA Pack (.ZIP)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </SpotlightCard>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: TEMPLATE DASHBOARD (The Exact Reference Layout)                   */}
          {/* ========================================================================= */}
          {activeNav === "dashboard" && (
            <>
              {/* TOP 4 METRIC CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SpotlightCard className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2 hover:-translate-y-0.5 transition-transform">
                  <div className="flex justify-between items-center text-xs font-medium text-stone-500">
                    <span>Page Views</span>
                    <div className="p-1.5 rounded-lg bg-[#ebf7d9] text-[#18280e]">
                      <Eye className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-[#18280e]">
                      16.431
                    </span>
                    <span className="inline-flex items-center text-xs font-bold text-emerald-700 font-mono">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      15.5%
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 block font-mono">
                    vs. 14,653 last period
                  </span>
                </SpotlightCard>

                <SpotlightCard className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2 hover:-translate-y-0.5 transition-transform">
                  <div className="flex justify-between items-center text-xs font-medium text-stone-500">
                    <span>Visitors</span>
                    <div className="p-1.5 rounded-lg bg-[#ebf7d9] text-[#18280e]">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-[#18280e]">
                      6.225
                    </span>
                    <span className="inline-flex items-center text-xs font-bold text-emerald-700 font-mono">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      8.4%
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 block font-mono">
                    vs. 5,732 last period
                  </span>
                </SpotlightCard>

                <SpotlightCard className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2 hover:-translate-y-0.5 transition-transform">
                  <div className="flex justify-between items-center text-xs font-medium text-stone-500">
                    <span>Click</span>
                    <div className="p-1.5 rounded-lg bg-[#ebf7d9] text-[#18280e]">
                      <MousePointer className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-[#18280e]">
                      2.832
                    </span>
                    <span className="inline-flex items-center text-xs font-bold text-rose-600 font-mono">
                      <ArrowDownRight className="w-3.5 h-3.5" />
                      10.5%
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 block font-mono">
                    vs. 3,294 last period
                  </span>
                </SpotlightCard>

                <SpotlightCard className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2 hover:-translate-y-0.5 transition-transform">
                  <div className="flex justify-between items-center text-xs font-medium text-stone-500">
                    <span>Orders</span>
                    <div className="p-1.5 rounded-lg bg-[#ebf7d9] text-[#18280e]">
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-[#18280e]">
                      1.224
                    </span>
                    <span className="inline-flex items-center text-xs font-bold text-emerald-700 font-mono">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      4.4%
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 block font-mono">
                    vs. 1,186 last period
                  </span>
                </SpotlightCard>
              </div>

              {/* TOTAL PROFIT AREA CHART + MOST DAY ACTIVE */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SpotlightCard className="lg:col-span-2 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-semibold text-stone-500">Total Profit</h3>
                      <div className="flex items-baseline gap-3 mt-1">
                        <span className="text-3xl font-extrabold font-mono text-[#18280e]">
                          $446.7K
                        </span>
                        <span className="text-xs font-bold text-emerald-700 font-mono">
                          ▲ 24.4% vs. last period
                        </span>
                      </div>
                    </div>

                    <div className="text-xs font-mono text-stone-400">
                      PayPal Orders v2 Connected
                    </div>
                  </div>

                  {/* SVG Spline Area Chart */}
                  <div className="relative w-full h-48 select-none">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 600 180" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="profitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#b2eb76" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#b2eb76" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      <line x1="0" y1="20" x2="600" y2="20" stroke="#f1f5e9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="70" x2="600" y2="70" stroke="#f1f5e9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="120" x2="600" y2="120" stroke="#f1f5e9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="170" x2="600" y2="170" stroke="#e6ebd9" strokeWidth="1" />

                      <path
                        d="M 0 140 Q 60 145 120 120 T 240 70 T 360 85 T 480 30 T 600 45 L 600 170 L 0 170 Z"
                        fill="url(#profitGrad)"
                      />
                      <path
                        d="M 0 140 Q 60 145 120 120 T 240 70 T 360 85 T 480 30 T 600 45"
                        fill="none"
                        stroke="#18280e"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      <circle cx="120" cy="120" r="4" fill="#ffffff" stroke="#18280e" strokeWidth="2.5" />
                      <circle cx="240" cy="70" r="4" fill="#ffffff" stroke="#18280e" strokeWidth="2.5" />
                      <circle cx="480" cy="30" r="5" fill="#b2eb76" stroke="#18280e" strokeWidth="2.5" />
                    </svg>
                  </div>

                  <div className="flex justify-between text-xs font-mono text-stone-400 pt-1 border-t border-stone-100">
                    <span>1 Jan</span>
                    <span>8 Jan</span>
                    <span>15 Jan</span>
                    <span>22 Jan</span>
                    <span>29 Jan</span>
                  </div>

                  <div className="pt-2 border-t border-stone-100">
                    <span className="text-xs font-semibold text-stone-500 block mb-2">Customers</span>
                    <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                      <div className="p-3 rounded-xl bg-[#f4faed] border-l-4 border-l-[#18280e]">
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">Retailers</span>
                        <span className="text-base font-bold text-[#18280e]">2.884</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#f4faed] border-l-4 border-l-[#3f7308]">
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">Distributors</span>
                        <span className="text-base font-bold text-[#18280e]">1.432</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#f4faed] border-l-4 border-l-amber-600">
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">Wholesalers</span>
                        <span className="text-base font-bold text-[#18280e]">562</span>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>

                {/* Right Col: Most Day Active + Repeat Rate */}
                <div className="space-y-6">
                  <SpotlightCard className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-stone-700">Most Day Active</span>
                      <span className="text-stone-400">•••</span>
                    </div>

                    <div className="flex items-end justify-between h-36 pt-4 pb-1">
                      <div className="flex flex-col items-center gap-1.5 flex-1">
                        <div className="w-5 bg-stone-100 rounded-t-md h-16" />
                        <span className="text-[10px] font-mono text-stone-400">Sun</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 flex-1">
                        <div className="w-5 bg-stone-100 rounded-t-md h-24" />
                        <span className="text-[10px] font-mono text-stone-400">Mon</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 flex-1 relative">
                        <span className="absolute -top-6 text-[10px] font-mono font-bold text-[#18280e] bg-[#ebf7d9] px-1.5 py-0.5 rounded shadow-2xs">
                          8.162
                        </span>
                        <div className="w-5 bg-[#18280e] rounded-t-md h-32" />
                        <span className="text-[10px] font-mono font-bold text-[#18280e]">Tue</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 flex-1">
                        <div className="w-5 bg-stone-100 rounded-t-md h-20" />
                        <span className="text-[10px] font-mono text-stone-400">Wed</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 flex-1">
                        <div className="w-5 bg-stone-100 rounded-t-md h-22" />
                        <span className="text-[10px] font-mono text-stone-400">Thu</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 flex-1">
                        <div className="w-5 bg-stone-100 rounded-t-md h-26" />
                        <span className="text-[10px] font-mono text-stone-400">Fr</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 flex-1">
                        <div className="w-5 bg-stone-100 rounded-t-md h-12" />
                        <span className="text-[10px] font-mono text-stone-400">Sat</span>
                      </div>
                    </div>
                  </SpotlightCard>

                  <SpotlightCard className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-stone-700">Repeat Customer Rate</span>
                      <span className="text-stone-400">•••</span>
                    </div>

                    <div className="flex flex-col items-center justify-center pt-2">
                      <div className="relative w-40 h-20 flex items-end justify-center overflow-hidden">
                        <svg className="w-40 h-40 absolute top-0" viewBox="0 0 100 100">
                          <path
                            d="M 15 50 A 35 35 0 0 1 85 50"
                            fill="none"
                            stroke="#e6ebd9"
                            strokeWidth="8"
                            strokeDasharray="3 3"
                          />
                          <path
                            d="M 15 50 A 35 35 0 0 1 85 50"
                            fill="none"
                            stroke="#3f7308"
                            strokeWidth="9"
                            strokeDasharray="80 120"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="text-3xl font-extrabold font-mono text-[#18280e] relative z-10">
                          68%
                        </span>
                      </div>

                      <span className="text-xs text-stone-500 font-medium mt-3">
                        On track for 80% target
                      </span>
                      <button
                        onClick={() => setActiveNav("tradeoracle")}
                        className="mt-2 text-xs font-mono font-semibold text-[#3f7308] hover:underline cursor-pointer"
                      >
                        Show connected records
                      </button>
                    </div>
                  </SpotlightCard>
                </div>
              </div>

              {/* BEST SELLING PRODUCTS + AI ASSISTANT */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SpotlightCard className="lg:col-span-2 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-stone-700">Best Selling Products</h3>
                    <span className="text-stone-400 text-xs">•••</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-stone-100 text-[10px] text-stone-400 uppercase tracking-wider">
                          <th className="pb-3 font-semibold">ID</th>
                          <th className="pb-3 font-semibold">NAME</th>
                          <th className="pb-3 font-semibold">SOLD</th>
                          <th className="pb-3 font-semibold">REVENUE</th>
                          <th className="pb-3 font-semibold">RATING</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        <tr className="hover:bg-[#f4faed] transition-colors">
                          <td className="py-3 text-stone-400">#83009</td>
                          <td className="py-3 font-bold text-[#18280e] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#3f7308]" />
                            <span>Solid Brass Mortise Locksets (C36000)</span>
                          </td>
                          <td className="py-3 text-stone-600">2,310 sold</td>
                          <td className="py-3 font-bold text-[#18280e]">$124,839</td>
                          <td className="py-3 text-amber-600 font-bold">★ (5.0) QIMA Passed</td>
                        </tr>
                        <tr className="hover:bg-[#f4faed] transition-colors">
                          <td className="py-3 text-stone-400">#83001</td>
                          <td className="py-3 font-bold text-[#18280e] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-600" />
                            <span>High-Tensile Cold Forged Fasteners</span>
                          </td>
                          <td className="py-3 text-stone-600">1,230 sold</td>
                          <td className="py-3 font-bold text-[#18280e]">$92,662</td>
                          <td className="py-3 text-amber-600 font-bold">★ (4.8) In Transit</td>
                        </tr>
                        <tr className="hover:bg-[#f4faed] transition-colors">
                          <td className="py-3 text-stone-400">#83042</td>
                          <td className="py-3 font-bold text-[#18280e] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#18280e]" />
                            <span>Precision CNC Hydraulic Valves &amp; Bushings</span>
                          </td>
                          <td className="py-3 text-stone-600">850 sold</td>
                          <td className="py-3 font-bold text-[#18280e]">$68,450</td>
                          <td className="py-3 text-amber-600 font-bold">★ (4.9) Verified</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </SpotlightCard>

                {/* AI Assistant & PayPal Trigger Widget */}
                <SpotlightCard className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#3f7308] animate-pulse" />
                      <span className="font-bold text-[#18280e]">TradeOracle AI Assistant</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center py-2 space-y-3">
                    <div className="size-16 rounded-full bg-gradient-to-tr from-[#18280e] via-[#3f7308] to-[#b2eb76] p-0.5 shadow-md flex items-center justify-center">
                      <div className="size-full bg-white rounded-full flex items-center justify-center text-[#18280e]">
                        <Sparkles className="w-6 h-6 text-[#18280e] animate-pulse" />
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-bold text-[#18280e] block">
                        PayPal Orders v2 Connected
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        Merchant: sb-knljl53833937@business
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={triggerLivePayPalOrder}
                      disabled={paypalLoading}
                      className="w-full py-2.5 bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>
                        {paypalLoading ? "Connecting to PayPal..." : "Test PayPal Escrow ($25,725)"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveNav("tradeoracle")}
                      className="w-full py-2 text-stone-600 hover:text-[#18280e] text-xs font-mono font-medium text-center block cursor-pointer"
                    >
                      Inspect TradeOracle Journey →
                    </button>
                  </div>
                </SpotlightCard>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* VIEW 3: LAYMAN ORDERS (For Indian Merchants / Foundries)                   */}
          {/* ========================================================================= */}
          {activeNav === "layman_store" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl bg-white border border-stone-200">
                <span className="text-xs font-bold font-mono text-[#3f7308] uppercase block">
                  Merchant Plain-Language Order Cards
                </span>
                <p className="text-xs text-stone-600 mt-1">
                  Foreign buyer requests translated into plain language, showing the rupee value and PayPal advance terms.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TRADE_ORACLE_RECORDS.map((rec) => (
                  <SpotlightCard key={rec.id} className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-stone-100 text-xs">
                      <span className="font-bold">{rec.buyer.flag} {rec.buyer.company}</span>
                      <span className="font-mono text-stone-400">{rec.txReference}</span>
                    </div>

                    <h4 className="font-bold text-sm text-[#18280e]">{rec.title}</h4>
                    <p className="text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200">
                      {rec.laymanSummary}
                    </p>

                    <div className="flex justify-between items-center text-xs font-mono pt-2 border-t border-stone-100">
                      <span>Total Value: <strong>${rec.agreement.contractValueUSD.toLocaleString()} USD</strong></span>
                      <button
                        onClick={() => {
                          setSelectedTx(rec);
                          setActiveNav("tradeoracle");
                        }}
                        className="text-[#3f7308] font-bold hover:underline"
                      >
                        View Connected Record →
                      </button>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          )}

          {/* Fallback for other sidebar items */}
          {(activeNav === "orders" || activeNav === "products" || activeNav === "customers" || activeNav === "invoices" || activeNav === "transactions" || activeNav === "settings") && (
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 font-mono text-xs animate-in fade-in">
              <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                <h3 className="font-bold text-base text-[#18280e] capitalize">{activeNav}</h3>
                <button
                  onClick={() => setActiveNav("tradeoracle")}
                  className="text-[#3f7308] font-bold underline"
                >
                  Return to TradeOracle Connected Records →
                </button>
              </div>
              <p className="text-stone-600">
                Connected record management active for {activeNav}. Select any trade record to inspect the PayPal settlement and delivery proof.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
