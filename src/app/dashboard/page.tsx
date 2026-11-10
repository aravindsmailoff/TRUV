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
  Sun,
  Moon,
  Search,
  X,
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
      "A US client hired an Indian software studio for a $5,000 application (₹4.22 Lakhs). TradeOracle locks what was promised in the digital contract, syncs the $3,500 received via PayPal, and timestamps the GitHub PR code merges so if the client ever claims 'nothing was built', the evidence bundle immediately protects the Indian team in PayPal Resolution Center.",
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
      "A California company bought $85,750 (₹72.45 Lakhs) worth of cast steel pump valves from a Rajkot foundry. TradeOracle connects the exact metallurgical drawing, the $25,725 deposit received via PayPal, the official QIMA test certificate, and the shipping container bill into one connected record. If the buyer tries to charge back, TradeOracle submits verified physical shipping evidence to PayPal.",
  },
];

// Sample Interactive Orders Queue (Matching Image 2 Reference)
const SAMPLE_ORDERS = [
  {
    id: "#ORD-9921",
    buyer: "Pacific Arch Hardware (USA)",
    flag: "🇺🇸",
    product: "Solid Brass Mortise Locksets (5,000 sets)",
    category: "Hardware",
    valueUSD: 142500,
    valueINR: "₹1.20 Cr",
    paypalStatus: "30% Captured ($42,750)",
    inspection: "QIMA AQL 1.5 Passed",
    statusBadge: "in_production",
    portGateIn: "Mundra Port (Nov 14)",
  },
  {
    id: "#ORD-9918",
    buyer: "EuroBespoke Fittings (UK)",
    flag: "🇬🇧",
    product: "Brass Window Espagnolettes (3,200 pcs)",
    category: "Fittings",
    valueUSD: 76800,
    valueINR: "₹64.9 Lakhs",
    paypalStatus: "100% Settled ($76,800)",
    inspection: "Delivered (Port of Felixstowe)",
    statusBadge: "settled",
    portGateIn: "Completed",
  },
  {
    id: "#ORD-9844",
    buyer: "Stratosphere Cloud Corp (USA)",
    flag: "🇺🇸",
    product: "AI Fintech Workflow Engine & React App",
    category: "Software",
    valueUSD: 5000,
    valueINR: "₹4.22 Lakhs",
    paypalStatus: "70% Captured ($3,500)",
    inspection: "GitHub PR #142 Merged",
    statusBadge: "in_production",
    portGateIn: "Staging Verified",
  },
  {
    id: "#ORD-9831",
    buyer: "Hansa Industrial Valves (Germany)",
    flag: "🇩🇪",
    product: "High-Pressure Hydraulic Gate Valves (800 pcs)",
    category: "Industrial",
    valueUSD: 98400,
    valueINR: "₹83.1 Lakhs",
    paypalStatus: "30% Captured ($29,520)",
    inspection: "Hydro-static 25 Bar Validated",
    statusBadge: "advance_captured",
    portGateIn: "Nhava Sheva (Nov 21)",
  },
  {
    id: "#ORD-9802",
    buyer: "Nordic Design Group (Sweden)",
    flag: "🇸🇪",
    product: "Architectural Bronze Pull Handles (1,500 pcs)",
    category: "Hardware",
    valueUSD: 54000,
    valueINR: "₹45.6 Lakhs",
    paypalStatus: "100% Settled ($54,000)",
    inspection: "SGS Dimensional Audit Passed",
    statusBadge: "settled",
    portGateIn: "Completed (Gothenburg)",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const currentUser = getCurrentSessionUser();

  // Active view state
  const [activeNav, setActiveNav] = useState<
    "dashboard" | "tradeoracle" | "orders" | "layman_store" | "products" | "customers" | "invoices" | "transactions" | "settings"
  >("dashboard");

  // Dashboard Theme: "dark" (Forest Green - Image 2) vs "light" (Spade Sage - Image 1)
  const [dashboardTheme, setDashboardTheme] = useState<"dark" | "light">("dark");

  const [financesOpen, setFinancesOpen] = useState(true);
  const [selectedTx, setSelectedTx] = useState<ConnectedTradeRecord>(TRADE_ORACLE_RECORDS[1]);
  const [activeStepTab, setActiveStepTab] = useState<"agree" | "pay" | "deliver" | "prove" | "resolve">("agree");

  // Orders Filter & Modal
  const [orderFilter, setOrderFilter] = useState<"all" | "in_production" | "advance_captured" | "settled">("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [selectedOrderModal, setSelectedOrderModal] = useState<(typeof SAMPLE_ORDERS)[0] | null>(null);

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

  const isDark = dashboardTheme === "dark";

  const filteredOrders = SAMPLE_ORDERS.filter((ord) => {
    if (orderFilter !== "all" && ord.statusBadge !== orderFilter) return false;
    if (orderSearch.trim()) {
      const query = orderSearch.toLowerCase();
      return (
        ord.id.toLowerCase().includes(query) ||
        ord.buyer.toLowerCase().includes(query) ||
        ord.product.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div
      className={`min-h-screen font-sans selection:bg-[#b2eb76] selection:text-[#18280e] flex transition-colors duration-200 ${
        isDark ? "bg-[#0c1507] text-[#e3edd9]" : "bg-[#f4faed] text-[#18280e]"
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. MINIMALISTIC SIDEBAR (Sleek, Clean, Theme Matched)                     */}
      {/* ========================================================================= */}
      <aside
        className={`w-60 border-r flex flex-col justify-between shrink-0 min-h-screen sticky top-0 z-30 transition-colors ${
          isDark
            ? "bg-[#101b0a] border-[#223715]"
            : "bg-white border-stone-200/70 shadow-2xs"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div
            className={`h-14 px-5 flex items-center justify-between border-b ${
              isDark ? "border-[#223715]" : "border-stone-100"
            }`}
          >
            <Link href="/" className="flex items-center gap-2 group">
              <span
                className={`font-extrabold text-lg tracking-tight font-sans transition-colors ${
                  isDark ? "text-white group-hover:text-[#b2eb76]" : "text-[#18280e] group-hover:text-[#3f7308]"
                }`}
              >
                TradeOracle<span className="text-[#b2eb76]">.</span>
              </span>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                  isDark ? "bg-[#253d16] text-[#b2eb76]" : "bg-[#ebf7d9] text-[#3f7308]"
                }`}
              >
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
                  ? isDark
                    ? "bg-[#203514] text-[#b2eb76] font-semibold border border-[#375a22]"
                    : "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : isDark
                  ? "text-stone-400 hover:bg-[#15250e] hover:text-white"
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
                  ? isDark
                    ? "bg-[#203514] text-[#b2eb76] font-semibold border border-[#375a22]"
                    : "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : isDark
                  ? "text-[#b2eb76] bg-[#17270f] hover:bg-[#1d3213] font-bold"
                  : "text-[#18280e] bg-[#ebf7d9] hover:bg-[#d8e5ca] font-bold"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 shrink-0 text-[#b2eb76]" />
                <span>Connected Records</span>
              </div>
              <span
                className={`px-1.5 py-0.2 rounded font-mono text-[9px] font-bold ${
                  isDark ? "bg-[#b2eb76] text-[#18280e]" : "bg-[#18280e] text-[#b2eb76]"
                }`}
              >
                1-RECORD
              </span>
            </button>

            {/* 3. Foreigner Orders (Layman E-Commerce View) */}
            <button
              onClick={() => setActiveNav("layman_store")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeNav === "layman_store"
                  ? isDark
                    ? "bg-[#203514] text-[#b2eb76] font-semibold border border-[#375a22]"
                    : "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : isDark
                  ? "text-stone-400 hover:bg-[#15250e] hover:text-white"
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
                  ? isDark
                    ? "bg-[#203514] text-[#b2eb76] font-semibold border border-[#375a22]"
                    : "bg-[#18280e] text-[#b2eb76] font-semibold"
                  : isDark
                  ? "text-stone-400 hover:bg-[#15250e] hover:text-white"
                  : "text-stone-600 hover:bg-[#f4faed] hover:text-[#18280e]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>Orders</span>
              </div>
              <span
                className={`px-1.5 py-0.2 rounded-full font-bold font-mono text-[10px] ${
                  isDark ? "bg-[#253d16] text-[#b2eb76]" : "bg-[#ebf7d9] text-[#3f7308]"
                }`}
              >
                46
              </span>
            </button>

            {/* 5. Products / RFQs */}
            <button
              onClick={() => setActiveNav("products")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeNav === "products"
                  ? isDark
                    ? "bg-[#203514] text-[#b2eb76] font-semibold border border-[#375a22]"
                    : "bg-[#18280e] text-[#b2eb76] font-semibold"
                  : isDark
                  ? "text-stone-400 hover:bg-[#15250e] hover:text-white"
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
                  ? isDark
                    ? "bg-[#203514] text-[#b2eb76] font-semibold border border-[#375a22]"
                    : "bg-[#18280e] text-[#b2eb76] font-semibold"
                  : isDark
                  ? "text-stone-400 hover:bg-[#15250e] hover:text-white"
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
                className={`w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider font-semibold cursor-pointer ${
                  isDark ? "text-stone-500 hover:text-stone-200" : "text-stone-400 hover:text-[#18280e]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Finances &amp; PayPal</span>
                </div>
                {financesOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>

              {financesOpen && (
                <div className="pl-4 pt-1 space-y-0.5 text-xs">
                  <button
                    onClick={() => setActiveNav("invoices")}
                    className={`w-full text-left py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                      activeNav === "invoices"
                        ? isDark
                          ? "bg-[#203514] text-[#b2eb76] font-semibold"
                          : "bg-[#18280e] text-[#b2eb76] font-semibold"
                        : isDark
                        ? "text-stone-400 hover:bg-[#15250e] hover:text-white"
                        : "text-stone-600 hover:bg-[#f4faed]"
                    }`}
                  >
                    Invoices
                  </button>
                  <button
                    onClick={() => setActiveNav("transactions")}
                    className={`w-full text-left py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                      activeNav === "transactions"
                        ? isDark
                          ? "bg-[#203514] text-[#b2eb76] font-semibold"
                          : "bg-[#18280e] text-[#b2eb76] font-semibold"
                        : isDark
                        ? "text-stone-400 hover:bg-[#15250e] hover:text-white"
                        : "text-stone-600 hover:bg-[#f4faed]"
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
        <div
          className={`p-3 border-t space-y-2 ${
            isDark ? "border-[#223715]" : "border-stone-100"
          }`}
        >
          {/* Theme Switcher Toggle (Forest Dark vs Spade Light) */}
          <div
            className={`p-1.5 rounded-xl flex items-center justify-between text-xs font-mono ${
              isDark ? "bg-[#15250e] border border-[#223715]" : "bg-[#f4faed] border border-[#d8e5ca]"
            }`}
          >
            <span className="text-[10px] text-stone-400 px-1 font-bold uppercase">Theme:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setDashboardTheme("dark")}
                className={`p-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  isDark
                    ? "bg-[#253d16] text-[#b2eb76] shadow-xs"
                    : "text-stone-500 hover:text-black"
                }`}
                title="Forest Dark Theme (Image 2)"
              >
                <Moon className="w-3 h-3" />
                <span>Forest</span>
              </button>
              <button
                type="button"
                onClick={() => setDashboardTheme("light")}
                className={`p-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  !isDark
                    ? "bg-[#18280e] text-[#b2eb76] shadow-xs"
                    : "text-stone-400 hover:text-white"
                }`}
                title="Spade Light Theme (Image 1)"
              >
                <Sun className="w-3 h-3" />
                <span>Light</span>
              </button>
            </div>
          </div>

          {/* Quick Account Badge */}
          <div
            className={`p-2.5 rounded-xl border text-[11px] font-mono space-y-1 ${
              isDark
                ? "bg-[#13220d] border-[#253d16] text-stone-300"
                : "bg-[#f4faed] border-[#d8e5ca] text-stone-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-stone-400 font-semibold">PayPal Auth</span>
              <span className="size-1.5 rounded-full bg-[#b2eb76] animate-pulse" />
            </div>
            <span className={`font-bold block truncate ${isDark ? "text-white" : "text-[#18280e]"}`}>
              sb-knljl53833937@business
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500 px-1 font-mono">
            <button
              onClick={() => setActiveNav("settings")}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Settings className="w-3 h-3" />
              <span>Settings</span>
            </button>
            <Link href="/" className="hover:text-[#b2eb76] transition-colors">
              Exit
            </Link>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN WORKSPACE CONTAINER                                               */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ========================================================================= */}
        {/* TOP TRADE ENGINE RUNNER (Matching Image 3 & Image 5 Reference)            */}
        {/* ========================================================================= */}
        <div className="bg-[#121e0d] text-[#e3edd9] border-b border-[#253d16] px-5 py-2 font-mono text-xs select-none">
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#b2eb76] animate-pulse" />
              <span className="font-bold text-[#b2eb76]">TRUV TRADE ENGINE V2.4</span>
              <span className="text-stone-500">|</span>
              <span className="text-stone-300">PayPal Orders v2 Rails Active</span>
            </div>
            <div className="flex items-center gap-4 text-stone-400">
              <span>
                Verification: <strong className="text-stone-200">DGFT &amp; ICEGATE</strong>
              </span>
              <span>
                Auditors: <strong className="text-stone-200">QIMA / SGS</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-[#253d16] text-[#b2eb76] font-bold text-[10px]">
                LIVE CONSOLE
              </span>
            </div>
          </div>

          {/* Horizontal Scrolling Pill Stages */}
          <div className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveNav("dashboard")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                activeNav === "dashboard"
                  ? "bg-[#b2eb76] text-[#18280e]"
                  : "bg-[#1d2f14] hover:bg-[#253d16] text-stone-300"
              }`}
            >
              <span>⊞ 🏢</span>
              <span>Manufacturer Dashboard</span>
              <span className="text-[10px] opacity-80 font-normal">Customer View</span>
            </button>

            <button
              onClick={() => {
                setSelectedTx(TRADE_ORACLE_RECORDS[1]);
                setActiveStepTab("agree");
                setActiveNav("tradeoracle");
              }}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                activeNav === "tradeoracle" && activeStepTab === "agree"
                  ? "bg-[#b2eb76] text-[#18280e] font-bold"
                  : "bg-[#1d2f14] hover:bg-[#253d16] text-stone-300"
              }`}
            >
              <span>🌐</span>
              <span>1. Buyer RFQ Demand</span>
              <span className="px-1.5 py-0.2 rounded bg-black/40 text-[#b2eb76] text-[10px]">3 Active</span>
            </button>

            <button
              onClick={() => {
                setSelectedTx(TRADE_ORACLE_RECORDS[1]);
                setActiveStepTab("agree");
                setActiveNav("tradeoracle");
              }}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                activeNav === "tradeoracle" && activeStepTab === "agree"
                  ? "bg-[#b2eb76] text-[#18280e] font-bold"
                  : "bg-[#1d2f14] hover:bg-[#253d16] text-stone-300"
              }`}
            >
              <span>📄</span>
              <span>2. MSME Vetting &amp; Clusters</span>
              <span className="px-1.5 py-0.2 rounded bg-black/40 text-[#b2eb76] text-[10px]">3 Hubs</span>
            </button>

            <button
              onClick={() => {
                setSelectedTx(TRADE_ORACLE_RECORDS[1]);
                setActiveStepTab("agree");
                setActiveNav("tradeoracle");
              }}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                activeNav === "tradeoracle" && activeStepTab === "agree"
                  ? "bg-[#b2eb76] text-[#18280e] font-bold"
                  : "bg-[#1d2f14] hover:bg-[#253d16] text-stone-300"
              }`}
            >
              <span>⚖</span>
              <span>3. Commercial Negotiation (AI)</span>
              <span className="px-1.5 py-0.2 rounded bg-black/40 text-[#b2eb76] text-[10px]">UCP 600</span>
            </button>

            <button
              onClick={() => {
                setSelectedTx(TRADE_ORACLE_RECORDS[1]);
                setActiveStepTab("pay");
                setActiveNav("tradeoracle");
              }}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                activeNav === "tradeoracle" && activeStepTab === "pay"
                  ? "bg-[#b2eb76] text-[#18280e] font-bold"
                  : "bg-[#1d2f14] hover:bg-[#253d16] text-stone-300"
              }`}
            >
              <span>💳</span>
              <span>4. PayPal Milestone Escrow</span>
              <span className="px-1.5 py-0.2 rounded bg-black/40 text-[#b2eb76] text-[10px]">30% Adv</span>
            </button>

            <button
              onClick={() => {
                setSelectedTx(TRADE_ORACLE_RECORDS[1]);
                setActiveStepTab("prove");
                setActiveNav("tradeoracle");
              }}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                activeNav === "tradeoracle" && activeStepTab === "prove"
                  ? "bg-[#b2eb76] text-[#18280e] font-bold"
                  : "bg-[#1d2f14] hover:bg-[#253d16] text-stone-300"
              }`}
            >
              <span>🔍</span>
              <span>5. Quality &amp; QIMA Inspection</span>
              <span className="px-1.5 py-0.2 rounded bg-black/40 text-[#b2eb76] text-[10px]">AQL 1.5</span>
            </button>

            <button
              onClick={() => {
                setSelectedTx(TRADE_ORACLE_RECORDS[1]);
                setActiveStepTab("resolve");
                setActiveNav("tradeoracle");
              }}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                activeNav === "tradeoracle" && activeStepTab === "resolve"
                  ? "bg-[#b2eb76] text-[#18280e] font-bold"
                  : "bg-[#1d2f14] hover:bg-[#253d16] text-stone-300"
              }`}
            >
              <span>🚢</span>
              <span>6. Customs LEO &amp; Bill of Lading</span>
              <span className="px-1.5 py-0.2 rounded bg-black/40 text-[#b2eb76] text-[10px]">ICEGATE</span>
            </button>
          </div>
        </div>

        {/* Top Header Bar */}
        <header
          className={`h-14 px-6 flex items-center justify-between sticky top-0 z-20 border-b transition-colors ${
            isDark
              ? "bg-[#101b0a]/95 backdrop-blur-md border-[#223715]"
              : "bg-white border-stone-200/70 shadow-2xs"
          }`}
        >
          <div className="flex items-center gap-3">
            <h1 className={`text-base font-bold tracking-tight ${isDark ? "text-white" : "text-[#18280e]"}`}>
              {activeNav === "dashboard" && "Dashboard"}
              {activeNav === "tradeoracle" && "TradeOracle // Connected Transaction Ledger"}
              {activeNav === "layman_store" && "Foreigner Orders // Merchant Plain View"}
              {activeNav === "orders" && "Active Orders & Factory Queue"}
              {activeNav === "products" && "Products & International RFQs"}
              {activeNav === "customers" && "Verified Foreign Buyers & Counterparties"}
              {activeNav === "invoices" && "Export Invoices & Settlement Records"}
              {activeNav === "transactions" && "PayPal Settlement & Escrow Ledger"}
              {activeNav === "settings" && "Platform & Sandbox Settings"}
            </h1>
            <span className="text-xs font-mono text-stone-400 hidden sm:inline">
              {"•"} Find → Agree → Pay → Deliver → Prove → Resolve
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* View Switcher Button */}
            <button
              type="button"
              onClick={() => setActiveNav(activeNav === "tradeoracle" ? "dashboard" : "tradeoracle")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                isDark
                  ? "bg-[#1c3012] text-[#b2eb76] border-[#315120] hover:bg-[#253d16]"
                  : "bg-[#ebf7d9] text-[#18280e] border-[#d8e5ca] hover:bg-[#d8e5ca]"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#b2eb76]" />
              <span>{activeNav === "tradeoracle" ? "Dashboard View" : "TradeOracle View"}</span>
            </button>

            {/* Date Range Selector */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono ${
                isDark ? "bg-[#17270f] text-stone-300 border border-[#223715]" : "bg-[#f4faed] text-stone-600"
              }`}
            >
              <Calendar className="w-3 h-3 text-stone-400" />
              <span>Jan 1, 2026 - Feb 1, 2026</span>
            </div>

            {/* Export */}
            <button
              type="button"
              onClick={() => alert("Exporting TradeOracle CA-accessible transaction pack (.ZIP)...")}
              className="flex items-center gap-1 px-3 py-1 bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] rounded-lg text-xs font-bold transition-colors cursor-pointer border border-[#315120]"
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
          {/* ========================================================================= */}
          {activeNav === "tradeoracle" && (
            <div className="space-y-6 animate-in fade-in">
              {/* Top Banner: Core Value Proposition */}
              <div
                className={`p-5 rounded-2xl border shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                  isDark ? "bg-[#12200d] border-[#253d16]" : "bg-white border-stone-200"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#b2eb76] uppercase mb-1">
                    <span>TradeOracle Transaction Engine</span>
                    <span>•</span>
                    <span>PayPal Integrated Rails</span>
                  </div>
                  <h2 className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-[#18280e]"}`}>
                    One Transaction. One Connected Record.
                  </h2>
                  <p className={`text-xs mt-1 max-w-3xl leading-relaxed ${isDark ? "text-stone-300" : "text-stone-600"}`}>
                    Connecting what was <strong>promised</strong> (commercial contract), what was <strong>paid</strong> (PayPal Orders v2), and what was <strong>delivered &amp; proved</strong> (QIMA inspection &amp; Bill of Lading) into one single audit record for foreign buyers, Indian businesses, and Chartered Accountants.
                  </p>
                </div>

                {/* Situation A vs Situation B Switcher */}
                <div
                  className={`flex items-center gap-2 p-1.5 rounded-xl border shrink-0 font-mono text-xs ${
                    isDark ? "bg-[#0b1408] border-[#223715]" : "bg-[#f4faed] border-[#d8e5ca]"
                  }`}
                >
                  <button
                    onClick={() => setSelectedTx(TRADE_ORACLE_RECORDS[0])}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      selectedTx.id === "tx_srv_001"
                        ? "bg-[#253d16] text-[#b2eb76] shadow-xs"
                        : "text-stone-400 hover:text-white"
                    }`}
                  >
                    Situation A: Service ($5k)
                  </button>
                  <button
                    onClick={() => setSelectedTx(TRADE_ORACLE_RECORDS[1])}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      selectedTx.id === "tx_gds_002"
                        ? "bg-[#253d16] text-[#b2eb76] shadow-xs"
                        : "text-stone-400 hover:text-white"
                    }`}
                  >
                    Situation B: Goods ($85.7k)
                  </button>
                </div>
              </div>

              {/* 6-Stage Transaction Journey Bar (Find → Agree → Pay → Deliver → Prove → Resolve) */}
              <div
                className={`p-3 rounded-2xl border shadow-xs ${
                  isDark ? "bg-[#12200d] border-[#253d16]" : "bg-white border-stone-200"
                }`}
              >
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs font-mono">
                  {/* Stage 1: Find */}
                  <div
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      isDark ? "bg-[#182b11] border-[#274017]" : "bg-stone-50 border-stone-100"
                    }`}
                  >
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase font-bold">1. Find</span>
                      <span className={`font-bold ${isDark ? "text-white" : "text-[#18280e]"}`}>Discovery</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-[#b2eb76] shrink-0" />
                  </div>

                  {/* Stage 2: Agree */}
                  <button
                    onClick={() => setActiveStepTab("agree")}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      activeStepTab === "agree"
                        ? "bg-[#b2eb76] text-[#18280e] border-[#b2eb76] font-bold"
                        : isDark
                        ? "bg-[#182b11] hover:bg-[#203816] border-[#274017] text-white"
                        : "bg-stone-50 hover:bg-[#f4faed] border-stone-100 text-[#18280e]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] opacity-80 block uppercase font-bold">2. Agree</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="font-bold text-xs block truncate">Agreement</span>
                  </button>

                  {/* Stage 3: Pay */}
                  <button
                    onClick={() => setActiveStepTab("pay")}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      activeStepTab === "pay"
                        ? "bg-[#b2eb76] text-[#18280e] border-[#b2eb76] font-bold"
                        : isDark
                        ? "bg-[#182b11] hover:bg-[#203816] border-[#274017] text-white"
                        : "bg-stone-50 hover:bg-[#f4faed] border-stone-100 text-[#18280e]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] opacity-80 block uppercase font-bold">3. Pay</span>
                      <CreditCard className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="font-bold text-xs block truncate">PayPal Rails</span>
                  </button>

                  {/* Stage 4: Deliver */}
                  <button
                    onClick={() => setActiveStepTab("deliver")}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      activeStepTab === "deliver"
                        ? "bg-[#b2eb76] text-[#18280e] border-[#b2eb76] font-bold"
                        : isDark
                        ? "bg-[#182b11] hover:bg-[#203816] border-[#274017] text-white"
                        : "bg-stone-50 hover:bg-[#f4faed] border-stone-100 text-[#18280e]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] opacity-80 block uppercase font-bold">4. Deliver</span>
                      <Clock className="w-4 h-4 text-amber-500" />
                    </div>
                    <span className="font-bold text-xs block truncate">Fulfilment</span>
                  </button>

                  {/* Stage 5: Prove */}
                  <button
                    onClick={() => setActiveStepTab("prove")}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      activeStepTab === "prove"
                        ? "bg-[#b2eb76] text-[#18280e] border-[#b2eb76] font-bold"
                        : isDark
                        ? "bg-[#182b11] hover:bg-[#203816] border-[#274017] text-white"
                        : "bg-stone-50 hover:bg-[#f4faed] border-stone-100 text-[#18280e]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] opacity-80 block uppercase font-bold">5. Prove</span>
                      <FileCheck2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="font-bold text-xs block truncate">Evidence</span>
                  </button>

                  {/* Stage 6: Resolve */}
                  <button
                    onClick={() => setActiveStepTab("resolve")}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      activeStepTab === "resolve"
                        ? "bg-[#b2eb76] text-[#18280e] border-[#b2eb76] font-bold"
                        : isDark
                        ? "bg-[#182b11] hover:bg-[#203816] border-[#274017] text-white"
                        : "bg-stone-50 hover:bg-[#f4faed] border-stone-100 text-[#18280e]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] opacity-80 block uppercase font-bold">6. Resolve</span>
                      <Scale className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="font-bold text-xs block truncate">Dispute Ready</span>
                  </button>
                </div>
              </div>

              {/* Active Transaction Master Record Card */}
              <SpotlightCard
                className={`p-6 rounded-2xl border shadow-xs space-y-6 ${
                  isDark ? "bg-[#13220d] border-[#253d16]" : "bg-white border-stone-200"
                }`}
              >
                {/* Header: Parties Involved */}
                <div
                  className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b ${
                    isDark ? "border-[#253d16]" : "border-stone-100"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-base font-bold ${isDark ? "text-white" : "text-[#18280e]"}`}>
                        {selectedTx.title}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          isDark ? "bg-[#253d16] text-[#b2eb76]" : "bg-[#ebf7d9] text-[#3f7308]"
                        }`}
                      >
                        {selectedTx.sectorBadge}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-stone-400 mt-0.5 block">
                      Ref: <strong className={isDark ? "text-stone-200" : "text-stone-700"}>{selectedTx.txReference}</strong> • Dated: {selectedTx.agreement.contractDate}
                    </span>
                  </div>

                  <div className="text-right font-mono">
                    <span className={`text-lg font-bold ${isDark ? "text-[#b2eb76]" : "text-[#18280e]"}`}>
                      ${selectedTx.agreement.contractValueUSD.toLocaleString()} USD
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded block font-semibold mt-0.5">
                      PayPal Protected
                    </span>
                  </div>
                </div>

                {/* Layman Overview Box */}
                <div
                  className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1 ${
                    isDark
                      ? "bg-[#1a2d12] border-[#2e4c1b] text-stone-200"
                      : "bg-[#f8fbf5] border-[#d8e5ca] text-stone-800"
                  }`}
                >
                  <div className="flex items-center gap-2 font-mono font-bold text-[#b2eb76] text-[11px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>The Underlying Trade Story (Merchant Plain English):</span>
                  </div>
                  <p>{selectedTx.laymanSummary}</p>
                </div>

                {/* 2-Column Entity Breakdown: Buyer vs Indian Seller */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  {/* Foreign Buyer Box */}
                  <div
                    className={`p-4 rounded-xl border space-y-1.5 ${
                      isDark ? "bg-[#182a10] border-[#274017]" : "bg-stone-50 border-stone-200"
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] text-stone-400 font-bold uppercase">
                      <span>Foreign Buyer</span>
                      <span>{selectedTx.buyer.flag} {selectedTx.buyer.country}</span>
                    </div>
                    <span className={`font-bold text-sm block ${isDark ? "text-white" : "text-[#18280e]"}`}>
                      {selectedTx.buyer.company}
                    </span>
                    <span className="text-stone-400 block">
                      Contact: {selectedTx.buyer.name} • {selectedTx.buyer.city}
                    </span>
                  </div>

                  {/* Indian Service Provider / Manufacturer Box */}
                  <div
                    className={`p-4 rounded-xl border space-y-1.5 ${
                      isDark ? "bg-[#1e3414] border-[#31531f]" : "bg-[#ebf7d9]/60 border-[#d8e5ca]"
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] text-[#b2eb76] font-bold uppercase">
                      <span>Indian Provider</span>
                      <span>🇮🇳 {selectedTx.seller.entityType}</span>
                    </div>
                    <span className={`font-bold text-sm block ${isDark ? "text-white" : "text-[#18280e]"}`}>
                      {selectedTx.seller.company}
                    </span>
                    <span className="text-stone-300 block">
                      Lead: {selectedTx.seller.name} • {selectedTx.seller.location}
                    </span>
                    <span className={`text-[10px] font-bold block ${isDark ? "text-[#b2eb76]" : "text-[#18280e]"}`}>
                      {selectedTx.seller.taxId}
                    </span>
                  </div>
                </div>

                {/* Deep-Dive Step Panel */}
                <div className={`pt-2 border-t ${isDark ? "border-[#253d16]" : "border-stone-100"}`}>
                  {/* TAB 2: AGREE (What was promised) */}
                  {activeStepTab === "agree" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-bold uppercase tracking-wide font-mono ${isDark ? "text-[#b2eb76]" : "text-[#18280e]"}`}>
                          Commercial Agreement &amp; Technical Scope
                        </span>
                        <span className="text-xs font-mono text-stone-400">Contract Signed Digitally</span>
                      </div>
                      <p className={`text-xs p-3 rounded-xl border ${isDark ? "bg-[#182a10] border-[#274017] text-stone-200" : "bg-stone-50 border-stone-200 text-stone-700"}`}>
                        {selectedTx.agreement.scopeOfWork}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                        {selectedTx.agreement.specifications.map((spec, sIdx) => (
                          <div
                            key={sIdx}
                            className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                              isDark ? "bg-[#182a10] border-[#274017]" : "bg-stone-50 border-stone-100"
                            }`}
                          >
                            <span className="text-[#b2eb76] font-bold">✓</span>
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2 pt-2">
                        <span className="text-[11px] font-mono text-stone-400 uppercase font-bold block">
                          Milestone Payment Schedule
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                          {selectedTx.agreement.milestones.map((m, mIdx) => (
                            <div
                              key={mIdx}
                              className={`p-3 rounded-xl border flex justify-between items-center ${
                                isDark ? "bg-[#182a10] border-[#274017]" : "bg-stone-50 border-stone-200"
                              }`}
                            >
                              <div>
                                <span className={`font-bold block ${isDark ? "text-white" : "text-[#18280e]"}`}>{m.title}</span>
                                <span className="text-[10px] text-stone-400">${m.amountUSD.toLocaleString()} USD</span>
                              </div>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                  m.status === "completed"
                                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                    : "bg-amber-950 text-amber-400 border border-amber-800"
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

                  {/* TAB 3: PAY (PayPal Rails) */}
                  {activeStepTab === "pay" && (
                    <div className="space-y-4 font-mono text-xs">
                      <div className="flex justify-between items-center">
                        <span className={`font-bold uppercase ${isDark ? "text-[#b2eb76]" : "text-[#18280e]"}`}>
                          PayPal Orders v2 Financial Execution
                        </span>
                        <span className="text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                          Status: {selectedTx.paypalPayment.status}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-[#0b1408] text-[#e1ecd6] border border-[#253d16] space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-[#253d16]">
                          <span className="text-stone-400">PayPal Order Reference:</span>
                          <strong className="text-white">{selectedTx.paypalPayment.orderId}</strong>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-stone-400">Amount Processed via PayPal:</span>
                          <strong className="text-[#b2eb76]">${selectedTx.paypalPayment.paidAmountUSD.toLocaleString()} USD</strong>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-stone-400">Merchant Payee Account:</span>
                          <span className="text-stone-300">{selectedTx.paypalPayment.payeeEmail}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-stone-400">Settled Timestamp:</span>
                          <span className="text-stone-300">{selectedTx.paypalPayment.settledDate}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={triggerLivePayPalOrder}
                          disabled={paypalLoading}
                          className="px-4 py-2.5 bg-[#b2eb76] hover:bg-[#9fe05b] text-[#18280e] rounded-xl font-bold transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {paypalLoading ? "Connecting to PayPal Sandbox..." : "Trigger Live PayPal Order via API"}
                        </button>

                        {paypalLiveLog && (
                          <span className="text-emerald-400 font-bold bg-emerald-950/80 px-3 py-1.5 rounded-lg border border-emerald-800">
                            ✓ PayPal Created: {paypalLiveLog.id}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: DELIVER & FULFILMENT */}
                  {activeStepTab === "deliver" && (
                    <div className="space-y-4 font-mono text-xs">
                      <span className={`font-bold uppercase block ${isDark ? "text-[#b2eb76]" : "text-[#18280e]"}`}>
                        Fulfilment Tracking &amp; Milestone Milestones
                      </span>
                      <div
                        className={`p-4 rounded-xl border space-y-2 ${
                          isDark ? "bg-[#182a10] border-[#274017] text-stone-200" : "bg-stone-50 border-stone-200 text-stone-700"
                        }`}
                      >
                        <span className="text-stone-400 block">
                          Delivery Date: <strong className={isDark ? "text-white" : "text-[#18280e]"}>{selectedTx.evidence.deliveredDate}</strong>
                        </span>
                        <p>
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
                      <span className={`font-bold uppercase block ${isDark ? "text-[#b2eb76]" : "text-[#18280e]"}`}>
                        Connected Fulfilment Evidence Documents
                      </span>
                      <div className="space-y-2">
                        {selectedTx.evidence.items.map((item, iIdx) => (
                          <div
                            key={iIdx}
                            className={`p-3.5 rounded-xl border flex justify-between items-center ${
                              isDark ? "bg-[#182a10] border-[#274017]" : "bg-[#fbfdf9] border-stone-200"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <CheckCircle2 className="w-4 h-4 text-[#b2eb76] shrink-0" />
                              <div>
                                <span className={`font-bold block ${isDark ? "text-white" : "text-[#18280e]"}`}>{item.label}</span>
                                <span className="text-[11px] text-stone-400 font-mono">Evidence ID: {item.identifier}</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
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
                        <span className={`font-bold uppercase ${isDark ? "text-[#b2eb76]" : "text-[#18280e]"}`}>
                          PayPal Dispute Protection &amp; CA Review Pack
                        </span>
                        <span className="text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                          Clean Record (No Dispute Raised)
                        </span>
                      </div>

                      <div
                        className={`p-4 rounded-xl border space-y-2 ${
                          isDark ? "bg-[#1b3012] border-[#2c4e1d] text-stone-200" : "bg-[#ebf7d9] border-[#d8e5ca] text-stone-800"
                        }`}
                      >
                        <span className={`font-bold block ${isDark ? "text-[#b2eb76]" : "text-[#18280e]"}`}>
                          Dispute Assistance Architecture:
                        </span>
                        <p className="leading-relaxed">
                          If a buyer opens a PayPal dispute, TradeOracle packages the signed specification agreement, the PayPal capture reference, and the verified delivery evidence (GitHub merge or Ocean Bill of Lading) into one authoritative rebuttal dossier formatted specifically for the PayPal Resolution Center.
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-2 text-[11px] text-stone-400">
                        <span>Chartered Accountant Export Compliance Pack: <strong className="text-emerald-400">READY</strong></span>
                        <button
                          onClick={() => alert("Downloading CA-approved EDPMS and invoice audit file (.ZIP)...")}
                          className="text-[#b2eb76] font-bold underline cursor-pointer"
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
          {/* VIEW 2: TEMPLATE DASHBOARD (The Exact Reference Layout - Image 1 & 2)    */}
          {/* ========================================================================= */}
          {activeNav === "dashboard" && (
            <>
              {/* TOP 4 METRIC CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SpotlightCard
                  className={`p-5 rounded-2xl border shadow-xs space-y-2 hover:-translate-y-0.5 transition-transform ${
                    isDark ? "bg-[#13220d] border-[#253d16]" : "bg-white border-stone-200/80"
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-medium text-stone-400">
                    <span>Page Views / Inquiries</span>
                    <div className={`p-1.5 rounded-lg ${isDark ? "bg-[#253d16] text-[#b2eb76]" : "bg-[#ebf7d9] text-[#18280e]"}`}>
                      <Eye className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span className={`text-2xl font-bold font-mono tracking-tight ${isDark ? "text-white" : "text-[#18280e]"}`}>
                      16.431
                    </span>
                    <span className="inline-flex items-center text-xs font-bold text-emerald-500 font-mono">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      15.5%
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 block font-mono">
                    vs. 14,653 last period
                  </span>
                </SpotlightCard>

                <SpotlightCard
                  className={`p-5 rounded-2xl border shadow-xs space-y-2 hover:-translate-y-0.5 transition-transform ${
                    isDark ? "bg-[#13220d] border-[#253d16]" : "bg-white border-stone-200/80"
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-medium text-stone-400">
                    <span>Foreign Visitors</span>
                    <div className={`p-1.5 rounded-lg ${isDark ? "bg-[#253d16] text-[#b2eb76]" : "bg-[#ebf7d9] text-[#18280e]"}`}>
                      <Users className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span className={`text-2xl font-bold font-mono tracking-tight ${isDark ? "text-white" : "text-[#18280e]"}`}>
                      6.225
                    </span>
                    <span className="inline-flex items-center text-xs font-bold text-emerald-500 font-mono">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      8.4%
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 block font-mono">
                    USA, UK &amp; Germany buyers
                  </span>
                </SpotlightCard>

                <SpotlightCard
                  className={`p-5 rounded-2xl border shadow-xs space-y-2 hover:-translate-y-0.5 transition-transform ${
                    isDark ? "bg-[#13220d] border-[#253d16]" : "bg-white border-stone-200/80"
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-medium text-stone-400">
                    <span>RFQ Click Rate</span>
                    <div className={`p-1.5 rounded-lg ${isDark ? "bg-[#253d16] text-[#b2eb76]" : "bg-[#ebf7d9] text-[#18280e]"}`}>
                      <MousePointer className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span className={`text-2xl font-bold font-mono tracking-tight ${isDark ? "text-white" : "text-[#18280e]"}`}>
                      2.832
                    </span>
                    <span className="inline-flex items-center text-xs font-bold text-rose-500 font-mono">
                      <ArrowDownRight className="w-3.5 h-3.5" />
                      10.5%
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 block font-mono">
                    UCP 600 compliance validated
                  </span>
                </SpotlightCard>

                <SpotlightCard
                  className={`p-5 rounded-2xl border shadow-xs space-y-2 hover:-translate-y-0.5 transition-transform ${
                    isDark ? "bg-[#13220d] border-[#253d16]" : "bg-white border-stone-200/80"
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-medium text-stone-400">
                    <span>Commercial Orders</span>
                    <div className={`p-1.5 rounded-lg ${isDark ? "bg-[#253d16] text-[#b2eb76]" : "bg-[#ebf7d9] text-[#18280e]"}`}>
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span className={`text-2xl font-bold font-mono tracking-tight ${isDark ? "text-white" : "text-[#18280e]"}`}>
                      1.224
                    </span>
                    <span className="inline-flex items-center text-xs font-bold text-emerald-500 font-mono">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      4.4%
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 block font-mono">
                    0.08% dispute ratio
                  </span>
                </SpotlightCard>
              </div>

              {/* TOTAL PROFIT AREA CHART + MOST DAY ACTIVE */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SpotlightCard
                  className={`lg:col-span-2 p-6 rounded-2xl border shadow-xs space-y-6 ${
                    isDark ? "bg-[#13220d] border-[#253d16]" : "bg-white border-stone-200/80"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400">
                        TOTAL EXPORT SETTLEMENT REVENUE
                      </h3>
                      <div className="flex items-baseline gap-3 mt-1">
                        <span className={`text-3xl font-extrabold font-mono ${isDark ? "text-[#b2eb76]" : "text-[#18280e]"}`}>
                          $446.7K
                        </span>
                        <span className="text-xs font-bold text-emerald-500 font-mono">
                          ▲ 24.4% vs last period
                        </span>
                      </div>
                    </div>

                    <div className="px-2.5 py-1 rounded-full bg-[#203514] border border-[#355821] text-[#b2eb76] text-xs font-mono font-bold">
                      PayPal Orders v2 Rails
                    </div>
                  </div>

                  {/* SVG Spline Area Chart (Matching Image 2 Reference) */}
                  <div className="relative w-full h-48 select-none">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 600 180" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="profitGradDark" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#b2eb76" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#b2eb76" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      <line x1="0" y1="20" x2="600" y2="20" stroke={isDark ? "#213614" : "#f1f5e9"} strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="70" x2="600" y2="70" stroke={isDark ? "#213614" : "#f1f5e9"} strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="120" x2="600" y2="120" stroke={isDark ? "#213614" : "#f1f5e9"} strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="170" x2="600" y2="170" stroke={isDark ? "#284218" : "#e6ebd9"} strokeWidth="1" />

                      <path
                        d="M 0 140 Q 60 145 120 120 T 240 70 T 360 85 T 480 30 T 600 45 L 600 170 L 0 170 Z"
                        fill="url(#profitGradDark)"
                      />
                      <path
                        d="M 0 140 Q 60 145 120 120 T 240 70 T 360 85 T 480 30 T 600 45"
                        fill="none"
                        stroke="#b2eb76"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      <circle cx="120" cy="120" r="4.5" fill="#18280e" stroke="#b2eb76" strokeWidth="2.5" />
                      <circle cx="240" cy="70" r="4.5" fill="#18280e" stroke="#b2eb76" strokeWidth="2.5" />
                      <circle cx="480" cy="30" r="5.5" fill="#b2eb76" stroke="#18280e" strokeWidth="3" />
                    </svg>
                  </div>

                  <div className="flex justify-between text-xs font-mono text-stone-400 pt-1 border-t border-[#253d16]">
                    <span>1 Jan (30% Advance)</span>
                    <span>8 Jan (Production)</span>
                    <span>15 Jan (QIMA Inspection)</span>
                    <span>22 Jan (Customs LEO)</span>
                    <span>29 Jan (BL Balance Release)</span>
                  </div>

                  <div className="pt-2 border-t border-[#253d16]">
                    <span className="text-xs font-semibold text-stone-400 block mb-2 font-mono uppercase">Customers Distribution</span>
                    <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                      <div className={`p-3 rounded-xl border-l-4 border-l-[#b2eb76] ${isDark ? "bg-[#17270f]" : "bg-[#f4faed]"}`}>
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">Retailers</span>
                        <span className={`text-base font-bold ${isDark ? "text-white" : "text-[#18280e]"}`}>2,884 Orders</span>
                      </div>
                      <div className={`p-3 rounded-xl border-l-4 border-l-[#3f7308] ${isDark ? "bg-[#17270f]" : "bg-[#f4faed]"}`}>
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">Distributors</span>
                        <span className={`text-base font-bold ${isDark ? "text-white" : "text-[#18280e]"}`}>1,432 Orders</span>
                      </div>
                      <div className={`p-3 rounded-xl border-l-4 border-l-amber-500 ${isDark ? "bg-[#17270f]" : "bg-[#f4faed]"}`}>
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">Wholesalers</span>
                        <span className={`text-base font-bold ${isDark ? "text-white" : "text-[#18280e]"}`}>562 Orders</span>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>

                {/* Right Col: Most Day Active + Repeat Rate */}
                <div className="space-y-6">
                  <SpotlightCard
                    className={`p-6 rounded-2xl border shadow-xs space-y-4 ${
                      isDark ? "bg-[#13220d] border-[#253d16]" : "bg-white border-stone-200/80"
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className={`font-semibold ${isDark ? "text-white" : "text-stone-700"}`}>Most Day Active</span>
                      <span className="text-stone-400">•••</span>
                    </div>

                    <div className="flex items-end justify-between h-36 pt-4 pb-1">
                      <div className="flex flex-col items-center gap-1.5 flex-1">
                        <div className={`w-5 rounded-t-md h-16 ${isDark ? "bg-[#1d3113]" : "bg-stone-100"}`} />
                        <span className="text-[10px] font-mono text-stone-400">Sun</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 flex-1">
                        <div className={`w-5 rounded-t-md h-24 ${isDark ? "bg-[#1d3113]" : "bg-stone-100"}`} />
                        <span className="text-[10px] font-mono text-stone-400">Mon</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 flex-1 relative">
                        <span className="absolute -top-6 text-[10px] font-mono font-bold text-[#18280e] bg-[#b2eb76] px-1.5 py-0.5 rounded shadow-2xs">
                          8.162
                        </span>
                        <div className="w-5 bg-[#b2eb76] rounded-t-md h-32" />
                        <span className={`text-[10px] font-mono font-bold ${isDark ? "text-[#b2eb76]" : "text-[#18280e]"}`}>Tue</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 flex-1">
                        <div className={`w-5 rounded-t-md h-20 ${isDark ? "bg-[#1d3113]" : "bg-stone-100"}`} />
                        <span className="text-[10px] font-mono text-stone-400">Wed</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 flex-1">
                        <div className={`w-5 rounded-t-md h-22 ${isDark ? "bg-[#1d3113]" : "bg-stone-100"}`} />
                        <span className="text-[10px] font-mono text-stone-400">Thu</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 flex-1">
                        <div className={`w-5 rounded-t-md h-26 ${isDark ? "bg-[#1d3113]" : "bg-stone-100"}`} />
                        <span className="text-[10px] font-mono text-stone-400">Fr</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 flex-1">
                        <div className={`w-5 rounded-t-md h-12 ${isDark ? "bg-[#1d3113]" : "bg-stone-100"}`} />
                        <span className="text-[10px] font-mono text-stone-400">Sat</span>
                      </div>
                    </div>
                  </SpotlightCard>

                  <SpotlightCard
                    className={`p-6 rounded-2xl border shadow-xs space-y-4 ${
                      isDark ? "bg-[#13220d] border-[#253d16]" : "bg-white border-stone-200/80"
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className={`font-semibold uppercase ${isDark ? "text-stone-300" : "text-stone-700"}`}>
                        FACTORY CAPACITY
                      </span>
                      <span className="text-[10px] text-[#b2eb76] font-bold">QIMA Audited</span>
                    </div>

                    <div className="flex flex-col items-center justify-center pt-2">
                      <div className="relative w-40 h-20 flex items-end justify-center overflow-hidden">
                        <svg className="w-40 h-40 absolute top-0" viewBox="0 0 100 100">
                          <path
                            d="M 15 50 A 35 35 0 0 1 85 50"
                            fill="none"
                            stroke={isDark ? "#1d3113" : "#e6ebd9"}
                            strokeWidth="8"
                            strokeDasharray="3 3"
                          />
                          <path
                            d="M 15 50 A 35 35 0 0 1 85 50"
                            fill="none"
                            stroke="#b2eb76"
                            strokeWidth="9"
                            strokeDasharray="80 120"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className={`text-3xl font-extrabold font-mono relative z-10 ${isDark ? "text-white" : "text-[#18280e]"}`}>
                          68%
                        </span>
                      </div>

                      <span className="text-xs text-stone-400 font-medium mt-3 font-mono">
                        Targeting 80% monthly export run
                      </span>

                      <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e3414] border border-[#2d4d1e] text-[#b2eb76] font-mono text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#b2eb76]" />
                        <span>Next Port Gate-In: Mundra (Nov 14)</span>
                      </div>
                    </div>
                  </SpotlightCard>
                </div>
              </div>

              {/* ACTIVE EXPORT ORDERS (MSME FACTORY QUEUE) - Matching Image 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SpotlightCard
                  className={`lg:col-span-2 p-6 rounded-2xl border shadow-xs space-y-4 ${
                    isDark ? "bg-[#13220d] border-[#253d16]" : "bg-white border-stone-200/80"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#b2eb76]" />
                      <h3 className={`text-sm font-bold font-mono ${isDark ? "text-white" : "text-stone-700"}`}>
                        Active Export Orders (MSME Factory Queue)
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveNav("orders")}
                      className="text-[#b2eb76] text-xs font-mono font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>View All in Full Dashboard</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-[#253d16] text-[10px] text-stone-400 uppercase tracking-wider">
                          <th className="pb-3 font-semibold">ORDER ID</th>
                          <th className="pb-3 font-semibold">FOREIGN BUYER</th>
                          <th className="pb-3 font-semibold">PRODUCT DESCRIPTION</th>
                          <th className="pb-3 font-semibold">VALUE</th>
                          <th className="pb-3 font-semibold">PAYPAL ESCROW</th>
                          <th className="pb-3 font-semibold">INSPECTION STATUS</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isDark ? "divide-[#1f3513]" : "divide-stone-100"}`}>
                        {SAMPLE_ORDERS.slice(0, 4).map((ord) => (
                          <tr
                            key={ord.id}
                            onClick={() => setSelectedOrderModal(ord)}
                            className={`cursor-pointer transition-colors ${
                              isDark ? "hover:bg-[#1a2e12]" : "hover:bg-[#f4faed]"
                            }`}
                          >
                            <td className="py-3 text-stone-400 font-bold">{ord.id}</td>
                            <td className="py-3 font-bold flex items-center gap-1.5">
                              <span>{ord.flag}</span>
                              <span className={isDark ? "text-white" : "text-[#18280e]"}>{ord.buyer}</span>
                            </td>
                            <td className="py-3 text-stone-300">{ord.product}</td>
                            <td className={`py-3 font-bold ${isDark ? "text-[#b2eb76]" : "text-[#18280e]"}`}>
                              ${ord.valueUSD.toLocaleString()}
                            </td>
                            <td className="py-3">
                              <span className="text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                                {ord.paypalStatus}
                              </span>
                            </td>
                            <td className="py-3 text-stone-300">{ord.inspection}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </SpotlightCard>

                {/* AI Assistant & PayPal Trigger Widget */}
                <SpotlightCard
                  className={`p-6 rounded-2xl border shadow-xs flex flex-col justify-between space-y-4 ${
                    isDark ? "bg-[#13220d] border-[#253d16]" : "bg-white border-stone-200/80"
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#b2eb76] animate-pulse" />
                      <span className={`font-bold ${isDark ? "text-white" : "text-[#18280e]"}`}>TradeOracle AI Assistant</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center py-2 space-y-3">
                    <div className="size-16 rounded-full bg-gradient-to-tr from-[#18280e] via-[#3f7308] to-[#b2eb76] p-0.5 shadow-md flex items-center justify-center">
                      <div className="size-full bg-[#18280e] rounded-full flex items-center justify-center text-[#b2eb76]">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                      </div>
                    </div>
                    <div className="text-center">
                      <span className={`text-xs font-bold block ${isDark ? "text-white" : "text-[#18280e]"}`}>
                        PayPal Orders v2 Connected
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        Merchant: sb-knljl53833937@business
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#253d16]">
                    <button
                      type="button"
                      onClick={triggerLivePayPalOrder}
                      disabled={paypalLoading}
                      className="w-full py-2.5 bg-[#b2eb76] hover:bg-[#9fe05b] text-[#18280e] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>
                        {paypalLoading ? "Connecting to PayPal..." : "Test PayPal Escrow ($25,725)"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveNav("tradeoracle")}
                      className="w-full py-2 text-stone-400 hover:text-[#b2eb76] text-xs font-mono font-medium text-center block cursor-pointer transition-colors"
                    >
                      Inspect TradeOracle Journey →
                    </button>
                  </div>
                </SpotlightCard>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* VIEW 3: FULL ORDERS MANAGEMENT VIEW                                       */}
          {/* ========================================================================= */}
          {activeNav === "orders" && (
            <div className="space-y-4 animate-in fade-in">
              <div
                className={`p-5 rounded-2xl border shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                  isDark ? "bg-[#13220d] border-[#253d16]" : "bg-white border-stone-200"
                }`}
              >
                <div>
                  <h2 className={`text-lg font-bold font-mono ${isDark ? "text-white" : "text-[#18280e]"}`}>
                    Active Export Orders Queue
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Live cross-border commercial transactions linked to PayPal milestone payouts and ICEGATE manifests.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <button
                    onClick={() => setOrderFilter("all")}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      orderFilter === "all"
                        ? "bg-[#b2eb76] text-[#18280e]"
                        : isDark
                        ? "bg-[#182a10] text-stone-300"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    All ({SAMPLE_ORDERS.length})
                  </button>
                  <button
                    onClick={() => setOrderFilter("in_production")}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      orderFilter === "in_production"
                        ? "bg-[#b2eb76] text-[#18280e]"
                        : isDark
                        ? "bg-[#182a10] text-stone-300"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    In Production
                  </button>
                  <button
                    onClick={() => setOrderFilter("advance_captured")}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      orderFilter === "advance_captured"
                        ? "bg-[#b2eb76] text-[#18280e]"
                        : isDark
                        ? "bg-[#182a10] text-stone-300"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    Advance Captured
                  </button>
                  <button
                    onClick={() => setOrderFilter("settled")}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      orderFilter === "settled"
                        ? "bg-[#b2eb76] text-[#18280e]"
                        : isDark
                        ? "bg-[#182a10] text-stone-300"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    Settled
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div
                className={`p-3 rounded-xl border flex items-center gap-2 ${
                  isDark ? "bg-[#101b0a] border-[#223715]" : "bg-white border-stone-200"
                }`}
              >
                <Search className="w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search orders by order ID, buyer company, or product description..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className={`w-full bg-transparent text-xs font-mono outline-none ${
                    isDark ? "text-white placeholder:text-stone-500" : "text-[#18280e] placeholder:text-stone-400"
                  }`}
                />
              </div>

              {/* Orders Table */}
              <div
                className={`rounded-2xl border shadow-xs overflow-hidden ${
                  isDark ? "bg-[#13220d] border-[#253d16]" : "bg-white border-stone-200"
                }`}
              >
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#253d16] text-[10px] text-stone-400 uppercase tracking-wider bg-black/20">
                      <th className="p-4 font-semibold">ORDER ID</th>
                      <th className="p-4 font-semibold">FOREIGN BUYER</th>
                      <th className="p-4 font-semibold">PRODUCT &amp; SCOPE</th>
                      <th className="p-4 font-semibold">VALUE (USD / INR)</th>
                      <th className="p-4 font-semibold">PAYPAL ESCROW</th>
                      <th className="p-4 font-semibold">FULFILMENT MILESTONE</th>
                      <th className="p-4 font-semibold text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? "divide-[#1f3513]" : "divide-stone-100"}`}>
                    {filteredOrders.map((ord) => (
                      <tr
                        key={ord.id}
                        className={`transition-colors ${
                          isDark ? "hover:bg-[#1a2e12]" : "hover:bg-[#f4faed]"
                        }`}
                      >
                        <td className="p-4 font-bold text-stone-400">{ord.id}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 font-bold">
                            <span>{ord.flag}</span>
                            <span className={isDark ? "text-white" : "text-[#18280e]"}>{ord.buyer}</span>
                          </div>
                        </td>
                        <td className="p-4 text-stone-300">
                          <span>{ord.product}</span>
                          <span className="block text-[10px] text-stone-500">Category: {ord.category}</span>
                        </td>
                        <td className="p-4">
                          <span className={`font-bold block ${isDark ? "text-[#b2eb76]" : "text-[#18280e]"}`}>
                            ${ord.valueUSD.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-stone-400">{ord.valueINR}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                            {ord.paypalStatus}
                          </span>
                        </td>
                        <td className="p-4 text-stone-300">
                          <span>{ord.inspection}</span>
                          <span className="block text-[10px] text-stone-500">{ord.portGateIn}</span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedOrderModal(ord)}
                            className="px-3 py-1 bg-[#253d16] hover:bg-[#315120] text-[#b2eb76] rounded-lg font-bold text-xs transition-colors cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 4: LAYMAN ORDERS (For Indian Merchants / Foundries)                   */}
          {/* ========================================================================= */}
          {activeNav === "layman_store" && (
            <div className="space-y-4 animate-in fade-in">
              <div
                className={`p-4 rounded-xl border ${
                  isDark ? "bg-[#13220d] border-[#253d16]" : "bg-white border-stone-200"
                }`}
              >
                <span className="text-xs font-bold font-mono text-[#b2eb76] uppercase block">
                  Foreigner Orders // Merchant Plain-Language View
                </span>
                <p className="text-xs text-stone-400 mt-1">
                  Foreign buyer requests translated into simple, layman terms so any Indian foundry manager or freelancer can instantly understand what is asked, the Rupee (₹) amount, and the PayPal advance guarantee.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TRADE_ORACLE_RECORDS.map((rec) => (
                  <SpotlightCard
                    key={rec.id}
                    className={`p-5 rounded-2xl border space-y-3 ${
                      isDark ? "bg-[#13220d] border-[#253d16]" : "bg-white border-stone-200"
                    }`}
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-[#253d16] text-xs">
                      <span className="font-bold flex items-center gap-1.5">
                        <span>{rec.buyer.flag}</span>
                        <span className={isDark ? "text-white" : "text-[#18280e]"}>{rec.buyer.company}</span>
                      </span>
                      <span className="font-mono text-stone-400">{rec.txReference}</span>
                    </div>

                    <h4 className={`font-bold text-sm ${isDark ? "text-white" : "text-[#18280e]"}`}>{rec.title}</h4>
                    <p
                      className={`text-xs p-3 rounded-xl border leading-relaxed ${
                        isDark ? "bg-[#192c11] border-[#284518] text-stone-200" : "bg-stone-50 border-stone-200 text-stone-700"
                      }`}
                    >
                      {rec.laymanSummary}
                    </p>

                    <div className="flex justify-between items-center text-xs font-mono pt-2 border-t border-[#253d16]">
                      <div>
                        <span className="text-stone-400 block text-[10px]">TOTAL VALUE:</span>
                        <strong className={`text-sm ${isDark ? "text-[#b2eb76]" : "text-[#18280e]"}`}>
                          ${rec.agreement.contractValueUSD.toLocaleString()} USD
                        </strong>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedTx(rec);
                          setActiveNav("tradeoracle");
                        }}
                        className="text-[#b2eb76] font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>View Connected Record</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 5: PRODUCTS & RFQS VIEW                                              */}
          {/* ========================================================================= */}
          {activeNav === "products" && (
            <div className="space-y-4 animate-in fade-in">
              <div
                className={`p-5 rounded-2xl border shadow-xs ${
                  isDark ? "bg-[#13220d] border-[#253d16]" : "bg-white border-stone-200"
                }`}
              >
                <h2 className={`text-lg font-bold font-mono ${isDark ? "text-white" : "text-[#18280e]"}`}>
                  Export Products &amp; International RFQs Catalog
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Active parts and scopes verified against ASTM, ISO, and UCP 600 international specifications.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: "Solid Brass Mortise Locksets (C36000)",
                    hsCode: "HS 8301.40",
                    specs: "ASTM B16 C36000 Brass, salt spray 240 hrs passed",
                    ordersCount: "5,000 sets",
                    unitPrice: "$28.50 / set",
                    activeCorridor: "Moradabad → California, USA",
                  },
                  {
                    title: "Investment Cast CF8M Hydraulic Impellers",
                    hsCode: "HS 8413.91",
                    specs: "ASTM A351 CF8M Stainless, Hydro-static 25 bar",
                    ordersCount: "5,000 units",
                    unitPrice: "$17.15 / unit",
                    activeCorridor: "Rajkot GIDC → Long Beach, USA",
                  },
                  {
                    title: "Fullstack AI Transaction Risk Engine",
                    hsCode: "HS 9983.14",
                    specs: "Next.js 16 + PayPal Webhook Worker + Jest Suite",
                    ordersCount: "Custom Milestone Contract",
                    unitPrice: "$5,000 Scope",
                    activeCorridor: "Bengaluru → Austin, Texas",
                  },
                ].map((p, idx) => (
                  <SpotlightCard
                    key={idx}
                    className={`p-5 rounded-2xl border space-y-3 ${
                      isDark ? "bg-[#13220d] border-[#253d16]" : "bg-white border-stone-200"
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-mono text-stone-400">
                      <span>{p.hsCode}</span>
                      <span className="text-[#b2eb76] font-bold">VERIFIED</span>
                    </div>
                    <h3 className={`font-bold text-sm ${isDark ? "text-white" : "text-[#18280e]"}`}>{p.title}</h3>
                    <p className="text-xs text-stone-400 leading-relaxed">{p.specs}</p>
                    <div className="pt-2 border-t border-[#253d16] flex justify-between items-center text-xs font-mono">
                      <div>
                        <span className="text-stone-500 text-[10px] block">Unit Value</span>
                        <strong className={isDark ? "text-[#b2eb76]" : "text-[#18280e]"}>{p.unitPrice}</strong>
                      </div>
                      <span className="text-[10px] text-stone-400">{p.activeCorridor}</span>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 6: CUSTOMERS & COUNTERPARTIES VIEW                                   */}
          {/* ========================================================================= */}
          {activeNav === "customers" && (
            <div className="space-y-4 animate-in fade-in">
              <div
                className={`p-5 rounded-2xl border shadow-xs ${
                  isDark ? "bg-[#13220d] border-[#253d16]" : "bg-white border-stone-200"
                }`}
              >
                <h2 className={`text-lg font-bold font-mono ${isDark ? "text-white" : "text-[#18280e]"}`}>
                  Verified Foreign Buyers &amp; Importers
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  International trading counterparties with verified PayPal billing profiles and 0.0% dispute track records.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: "Pacific Arch Hardware LLC",
                    flag: "🇺🇸",
                    country: "Long Beach, California, USA",
                    orders: "4 active orders",
                    volume: "$240,500 total",
                    paypalStatus: "Verified Business Account (9 yrs)",
                    disputeRate: "0.00% (Clean)",
                  },
                  {
                    name: "Stratosphere Cloud Corp",
                    flag: "🇺🇸",
                    country: "Austin, Texas, USA",
                    orders: "2 projects",
                    volume: "$18,500 total",
                    paypalStatus: "Verified SaaS Account (4 yrs)",
                    disputeRate: "0.00% (Clean)",
                  },
                  {
                    name: "EuroBespoke Fittings Ltd",
                    flag: "🇬🇧",
                    country: "Birmingham, United Kingdom",
                    orders: "3 active orders",
                    volume: "$124,000 total",
                    paypalStatus: "Verified UK Merchant",
                    disputeRate: "0.00% (Clean)",
                  },
                  {
                    name: "Hansa Flow Systems GmbH",
                    flag: "🇩🇪",
                    country: "Düsseldorf, Germany",
                    orders: "1 active order",
                    volume: "$98,400 total",
                    paypalStatus: "Verified SEPA & PayPal Rail",
                    disputeRate: "0.00% (Clean)",
                  },
                ].map((c, cIdx) => (
                  <SpotlightCard
                    key={cIdx}
                    className={`p-5 rounded-2xl border space-y-3 ${
                      isDark ? "bg-[#13220d] border-[#253d16]" : "bg-white border-stone-200"
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold flex items-center gap-1.5 text-sm">
                        <span>{c.flag}</span>
                        <span className={isDark ? "text-white" : "text-[#18280e]"}>{c.name}</span>
                      </span>
                      <span className="text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                        {c.disputeRate}
                      </span>
                    </div>
                    <span className="text-xs text-stone-400 block font-mono">{c.country}</span>
                    <div className="pt-2 border-t border-[#253d16] flex justify-between items-center text-xs font-mono">
                      <div>
                        <span className="text-stone-500 text-[10px] block">Trade Volume</span>
                        <strong className={isDark ? "text-[#b2eb76]" : "text-[#18280e]"}>{c.volume}</strong>
                      </div>
                      <span className="text-[11px] text-stone-400">{c.paypalStatus}</span>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 7: FINANCES & INVOICES VIEW                                          */}
          {/* ========================================================================= */}
          {(activeNav === "invoices" || activeNav === "transactions") && (
            <div className="space-y-4 animate-in fade-in">
              <div
                className={`p-5 rounded-2xl border shadow-xs ${
                  isDark ? "bg-[#13220d] border-[#253d16]" : "bg-white border-stone-200"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className={`text-lg font-bold font-mono ${isDark ? "text-white" : "text-[#18280e]"}`}>
                      {activeNav === "invoices" ? "Export Commercial Invoices" : "PayPal Transactions & Escrow Settlement Ledger"}
                    </h2>
                    <p className="text-xs text-stone-400 mt-1">
                      Audited transaction records for RBI EDPMS reconciliation, GST export refunds, and foreign inward remittances (FIRC).
                    </p>
                  </div>
                  <button
                    onClick={() => alert("Downloading full CA export reconciliation pack...")}
                    className="px-3 py-1.5 rounded-lg bg-[#b2eb76] text-[#18280e] font-bold font-mono text-xs cursor-pointer hover:bg-[#9fe05b]"
                  >
                    Download CA Ledger (.CSV)
                  </button>
                </div>
              </div>

              <div
                className={`rounded-2xl border shadow-xs overflow-hidden ${
                  isDark ? "bg-[#13220d] border-[#253d16]" : "bg-white border-stone-200"
                }`}
              >
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#253d16] text-[10px] text-stone-400 uppercase tracking-wider bg-black/20">
                      <th className="p-4 font-semibold">REF #</th>
                      <th className="p-4 font-semibold">BUYER</th>
                      <th className="p-4 font-semibold">PAYPAL CAPTURE ID</th>
                      <th className="p-4 font-semibold">AMOUNT (USD)</th>
                      <th className="p-4 font-semibold">INR VALUE (@ ₹84.50)</th>
                      <th className="p-4 font-semibold">SETTLEMENT STATUS</th>
                      <th className="p-4 font-semibold text-right">FIRC STATUS</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? "divide-[#1f3513]" : "divide-stone-100"}`}>
                    {[
                      {
                        ref: "INV-2026-081",
                        buyer: "Pacific Arch Hardware",
                        captureId: "CAP-2JM21803AA",
                        amountUSD: "$25,725.00",
                        amountINR: "₹21,73,762.50",
                        status: "CAPTURED (30% Adv)",
                        firc: "ISSUED",
                      },
                      {
                        ref: "INV-2026-079",
                        buyer: "EuroBespoke Fittings",
                        captureId: "CAP-994102941-PP",
                        amountUSD: "$76,800.00",
                        amountINR: "₹64,89,600.00",
                        status: "SETTLED (100%)",
                        firc: "ISSUED",
                      },
                      {
                        ref: "INV-2026-075",
                        buyer: "Stratosphere Cloud Corp",
                        captureId: "CAP-771029410-ST",
                        amountUSD: "$3,500.00",
                        amountINR: "₹2,95,750.00",
                        status: "SETTLED (M1+M2)",
                        firc: "ISSUED",
                      },
                    ].map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className={`transition-colors ${
                          isDark ? "hover:bg-[#1a2e12]" : "hover:bg-[#f4faed]"
                        }`}
                      >
                        <td className="p-4 font-bold text-stone-400">{row.ref}</td>
                        <td className={`p-4 font-bold ${isDark ? "text-white" : "text-[#18280e]"}`}>{row.buyer}</td>
                        <td className="p-4 text-stone-400">{row.captureId}</td>
                        <td className={`p-4 font-bold ${isDark ? "text-[#b2eb76]" : "text-[#18280e]"}`}>{row.amountUSD}</td>
                        <td className="p-4 text-stone-300">{row.amountINR}</td>
                        <td className="p-4">
                          <span className="text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                            {row.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-[#b2eb76] font-bold">✓ {row.firc}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 8: SETTINGS VIEW                                                     */}
          {/* ========================================================================= */}
          {activeNav === "settings" && (
            <div className="space-y-4 animate-in fade-in">
              <SpotlightCard
                className={`p-6 rounded-2xl border shadow-xs space-y-4 ${
                  isDark ? "bg-[#13220d] border-[#253d16]" : "bg-white border-stone-200"
                }`}
              >
                <h3 className={`text-base font-bold font-mono ${isDark ? "text-white" : "text-[#18280e]"}`}>
                  PayPal Partner Sandbox Credentials
                </h3>
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-black/30 border border-[#253d16] space-y-1">
                    <span className="text-stone-400 block text-[10px]">Client ID</span>
                    <span className="text-[#b2eb76] font-bold block break-all">
                      AU-2yZPCo9C6_04QNEUens2pAgdB00D3FhVJYfLqV8q6lulIe23tghXNuvsEkYNHeHtPtnJJMHOfDF_s
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/30 border border-[#253d16] space-y-1">
                    <span className="text-stone-400 block text-[10px]">Merchant Sandbox Email</span>
                    <span className="text-white font-bold block">
                      sb-knljl53833937@business.example.com
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/30 border border-[#253d16] space-y-1">
                    <span className="text-stone-400 block text-[10px]">Live Verified Order ID</span>
                    <span className="text-emerald-400 font-bold block">
                      2JM21803AA658230N (Validated in sandbox)
                    </span>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* ORDER INSPECTION MODAL                                                    */}
      {/* ========================================================================= */}
      {selectedOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div
            className={`w-full max-w-lg rounded-2xl border p-6 space-y-4 shadow-2xl font-mono text-xs ${
              isDark ? "bg-[#12200d] border-[#2e4c1b] text-stone-200" : "bg-white border-stone-200 text-stone-800"
            }`}
          >
            <div className="flex justify-between items-center pb-3 border-b border-[#253d16]">
              <div>
                <span className="text-[#b2eb76] font-bold text-sm">{selectedOrderModal.id}</span>
                <span className="text-stone-400 block text-[11px] mt-0.5">{selectedOrderModal.buyer}</span>
              </div>
              <button
                onClick={() => setSelectedOrderModal(null)}
                className="p-1 rounded-lg hover:bg-black/30 text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Product Description</span>
                <span className="font-bold text-white block">{selectedOrderModal.product}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-black/30 border border-[#253d16]">
                  <span className="text-stone-400 text-[10px] block">Order Value (USD)</span>
                  <span className="text-base font-bold text-[#b2eb76]">
                    ${selectedOrderModal.valueUSD.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-black/30 border border-[#253d16]">
                  <span className="text-stone-400 text-[10px] block">Rupee Value (INR)</span>
                  <span className="text-base font-bold text-white">
                    {selectedOrderModal.valueINR}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/30 border border-[#253d16] space-y-1">
                <span className="text-stone-400 text-[10px] block">PayPal Escrow Status</span>
                <span className="text-emerald-400 font-bold block">{selectedOrderModal.paypalStatus}</span>
              </div>

              <div className="p-3 rounded-xl bg-black/30 border border-[#253d16] space-y-1">
                <span className="text-stone-400 text-[10px] block">Fulfilment Milestone</span>
                <span className="text-stone-200 block">{selectedOrderModal.inspection}</span>
                <span className="text-stone-400 text-[10px] block">{selectedOrderModal.portGateIn}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#253d16] flex justify-end gap-2">
              <button
                onClick={() => setSelectedOrderModal(null)}
                className="px-4 py-2 rounded-xl bg-[#253d16] hover:bg-[#315120] text-[#b2eb76] font-bold cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
