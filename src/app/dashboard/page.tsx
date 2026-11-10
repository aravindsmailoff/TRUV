"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  FileText,
  Store,
  Receipt,
  BarChart3,
  Percent,
  Settings,
  HelpCircle,
  Calendar,
  Download,
  Plus,
  Eye,
  MousePointer,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  CreditCard,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Radio,
  Zap,
} from "lucide-react";
import { getCurrentSessionUser, setCurrentSessionUser } from "@/lib/auth/authStore";

export default function DashboardPage() {
  const router = useRouter();
  const currentUser = getCurrentSessionUser();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [financesOpen, setFinancesOpen] = useState(true);
  const [showLiveRailsModal, setShowLiveRailsModal] = useState(false);

  // PayPal live sandbox execution state inside the dashboard
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [paypalResult, setPaypalResult] = useState<{
    id?: string;
    status?: string;
    approveUrl?: string;
    amount?: string;
  } | null>(null);

  const triggerPayPalEscrow = async () => {
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
        setPaypalResult({
          id: data.paymentOrder.id,
          status: data.paymentOrder.status,
          approveUrl: approveLink,
          amount: "$25,725.00 USD (30% Advance Escrow)",
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
      {/* 1. LEFT SIDEBAR (Matching Template)                                      */}
      {/* ========================================================================= */}
      <aside className="w-64 bg-white border-r border-stone-200/80 flex flex-col justify-between shrink-0 min-h-screen sticky top-0 z-30 shadow-xs">
        <div>
          {/* Brand Logo at Top */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-stone-100">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-[#18280e] font-sans">
                TRUV<span className="text-[#3f7308]">.</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ebf7d9] text-[#3f7308] font-bold">
                OPERATOR
              </span>
            </Link>
          </div>

          {/* Navigation Links List */}
          <nav className="p-4 space-y-1 text-xs font-medium">
            {/* 1. Dashboard (Active Pill matching reference) */}
            <button
              onClick={() => setActiveNav("dashboard")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === "dashboard"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : "text-stone-600 hover:bg-[#f4faed] hover:text-[#18280e]"
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span className="text-sm">Dashboard</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-[#b2eb76]" />
            </button>

            {/* 2. Orders (with badge count 46) */}
            <button
              onClick={() => setActiveNav("orders")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === "orders"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold"
                  : "text-stone-600 hover:bg-[#f4faed] hover:text-[#18280e]"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span className="text-sm">Orders</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#ebf7d9] text-[#3f7308] font-bold font-mono text-[11px]">
                46
              </span>
            </button>

            {/* 3. Products / RFQs */}
            <button
              onClick={() => setActiveNav("products")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === "products"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold"
                  : "text-stone-600 hover:bg-[#f4faed] hover:text-[#18280e]"
              }`}
            >
              <Package className="w-4 h-4 shrink-0" />
              <span className="text-sm">Products / RFQs</span>
            </button>

            {/* 4. Customers */}
            <button
              onClick={() => setActiveNav("customers")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === "customers"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold"
                  : "text-stone-600 hover:bg-[#f4faed] hover:text-[#18280e]"
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span className="text-sm">Customers</span>
            </button>

            {/* 5. Content / Trade Documents */}
            <button
              onClick={() => setActiveNav("content")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === "content"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold"
                  : "text-stone-600 hover:bg-[#f4faed] hover:text-[#18280e]"
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span className="text-sm">Content</span>
            </button>

            {/* 6. Online Store / Factory Catalog */}
            <button
              onClick={() => setActiveNav("store")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === "store"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold"
                  : "text-stone-600 hover:bg-[#f4faed] hover:text-[#18280e]"
              }`}
            >
              <Store className="w-4 h-4 shrink-0" />
              <span className="text-sm">Online Store</span>
            </button>

            {/* Section Divider: Finances */}
            <div className="pt-4 pb-1">
              <button
                type="button"
                onClick={() => setFinancesOpen(!financesOpen)}
                className="w-full flex items-center justify-between px-3.5 py-1 text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold hover:text-[#18280e]"
              >
                <div className="flex items-center gap-2">
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Finances</span>
                </div>
                {financesOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>

              {financesOpen && (
                <div className="pl-6 pt-1 space-y-1 text-xs font-medium text-stone-600">
                  <button
                    onClick={() => setActiveNav("invoices")}
                    className="w-full text-left py-1.5 px-3 rounded-lg hover:bg-[#f4faed] hover:text-[#18280e] transition-colors"
                  >
                    Invoices
                  </button>
                  <button
                    onClick={() => setActiveNav("transactions")}
                    className="w-full text-left py-1.5 px-3 rounded-lg hover:bg-[#f4faed] hover:text-[#18280e] transition-colors"
                  >
                    Transactions
                  </button>
                  <button
                    onClick={() => setActiveNav("reports")}
                    className="w-full text-left py-1.5 px-3 rounded-lg hover:bg-[#f4faed] hover:text-[#18280e] transition-colors"
                  >
                    Reports
                  </button>
                  <button
                    onClick={() => setShowLiveRailsModal(true)}
                    className="w-full text-left py-1.5 px-3 rounded-lg bg-[#ebf7d9] text-[#18280e] font-semibold flex items-center justify-between transition-colors"
                  >
                    <span>PayPal Escrow</span>
                    <span className="size-1.5 rounded-full bg-[#3f7308] animate-pulse" />
                  </button>
                </div>
              )}
            </div>

            {/* Analytics */}
            <button
              onClick={() => setActiveNav("analytics")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === "analytics"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold"
                  : "text-stone-600 hover:bg-[#f4faed] hover:text-[#18280e]"
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span className="text-sm">Analytics</span>
            </button>

            {/* Discounts */}
            <button
              onClick={() => setActiveNav("discounts")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === "discounts"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold"
                  : "text-stone-600 hover:bg-[#f4faed] hover:text-[#18280e]"
              }`}
            >
              <Percent className="w-4 h-4 shrink-0" />
              <span className="text-sm">Discounts</span>
            </button>
          </nav>
        </div>

        {/* Bottom Section: Settings & Upgrade Card */}
        <div className="p-4 space-y-4">
          <div className="space-y-1 text-xs font-medium text-stone-600">
            <button
              onClick={() => setActiveNav("settings")}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg hover:bg-[#f4faed] hover:text-[#18280e] transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button
              onClick={() => setActiveNav("help")}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg hover:bg-[#f4faed] hover:text-[#18280e] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help &amp; Support</span>
            </button>
          </div>

          {/* Sleek Bottom Upgrade Card (Matching Reference) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#18280e] to-[#253d16] text-white space-y-3 shadow-md relative overflow-hidden">
            <div className="size-8 rounded-xl bg-white/10 flex items-center justify-center text-[#b2eb76]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold font-sans">Verified Trade Account</h4>
              <p className="text-[11px] text-white/70 leading-relaxed mt-0.5">
                DGFT IEC &amp; ICEGATE customs verification linked.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowLiveRailsModal(true)}
              className="w-full py-2 bg-[#b2eb76] hover:bg-[#c2f38d] text-[#18280e] font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              View Sponsor Rails
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA (Matching Template Layout)                           */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-stone-200/80 px-8 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[#18280e] tracking-tight">Dashboard</h1>
            <span className="text-xs font-mono text-stone-400 hidden sm:inline">
              {"// Trade Execution Hub"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <div className="hidden md:flex items-center gap-2 bg-[#f4faed] border border-[#d8e5ca] px-3 py-1.5 rounded-xl text-xs font-mono text-stone-700">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              <span>Jan 1, 2026 - Nov 10, 2026</span>
              <span className="text-stone-300">|</span>
              <span className="font-semibold text-[#18280e]">Last 30 days ∨</span>
            </div>

            {/* Add Widget Button */}
            <button
              type="button"
              onClick={() => setShowLiveRailsModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add widget</span>
            </button>

            {/* Export Button (Primary Blue/Green in template) */}
            <button
              type="button"
              onClick={() => alert("Exporting verified trade ledger CSV...")}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            {/* Back to Home & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <Link
                href="/"
                className="text-xs font-mono text-stone-500 hover:text-black px-2 py-1 transition-colors"
              >
                TRUV Home
              </Link>
              {currentUser && (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentSessionUser(null);
                    router.push("/signin");
                  }}
                  className="text-xs font-mono text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Main Grid Body */}
        <main className="p-6 md:p-8 space-y-6 max-w-[88rem] w-full mx-auto">
          {/* ========================================================================= */}
          {/* ROW 1: TOP 4 METRIC CARDS (Exact match to reference)                      */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Page Views */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
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
            </div>

            {/* Metric 2: Visitors */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
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
            </div>

            {/* Metric 3: Click */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
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
            </div>

            {/* Metric 4: Orders */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
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
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ROW 2: TOTAL PROFIT CHART + MOST DAY ACTIVE + REPEAT RATE                 */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Total Profit Revenue Area Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">
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

                <div className="text-xs font-mono text-stone-400 flex items-center gap-1">
                  <span>PayPal Orders v2 Verified</span>
                </div>
              </div>

              {/* High-Fidelity SVG Curve Line Chart */}
              <div className="relative w-full h-48 select-none">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="profitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#b2eb76" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#b2eb76" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="0" y1="20" x2="600" y2="20" stroke="#f1f5e9" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="70" x2="600" y2="70" stroke="#f1f5e9" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="120" x2="600" y2="120" stroke="#f1f5e9" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="170" x2="600" y2="170" stroke="#e6ebd9" strokeWidth="1" />

                  {/* Shaded Area Under Curve */}
                  <path
                    d="M 0 140 Q 60 145 120 120 T 240 70 T 360 85 T 480 30 T 600 45 L 600 170 L 0 170 Z"
                    fill="url(#profitGrad)"
                  />

                  {/* Smooth Primary Spline Curve */}
                  <path
                    d="M 0 140 Q 60 145 120 120 T 240 70 T 360 85 T 480 30 T 600 45"
                    fill="none"
                    stroke="#18280e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Interactive Nodes on Key Milestones */}
                  <circle cx="120" cy="120" r="4" fill="#ffffff" stroke="#18280e" strokeWidth="2.5" />
                  <circle cx="240" cy="70" r="4" fill="#ffffff" stroke="#18280e" strokeWidth="2.5" />
                  <circle cx="480" cy="30" r="5" fill="#b2eb76" stroke="#18280e" strokeWidth="2.5" />
                </svg>
              </div>

              {/* X-Axis Timeline Labels */}
              <div className="flex justify-between text-xs font-mono text-stone-400 pt-1 border-t border-stone-100">
                <span>1 Jan</span>
                <span>8 Jan</span>
                <span>15 Jan</span>
                <span>22 Jan</span>
                <span>29 Jan</span>
              </div>

              {/* Breakdown Category Pills (Matching reference) */}
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
            </div>

            {/* Right 1 Col: Most Day Active Bar Chart + Repeat Rate Gauge */}
            <div className="space-y-6">
              {/* Most Day Active Card */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-700">Most Day Active</span>
                  <span className="text-stone-400">•••</span>
                </div>

                {/* Day Columns (Tue highlighted with 8.162) */}
                <div className="flex items-end justify-between h-36 pt-4 pb-1">
                  <div className="flex flex-col items-center gap-1.5 flex-1">
                    <div className="w-5 bg-stone-100 rounded-t-md h-16" />
                    <span className="text-[10px] font-mono text-stone-400">Sun</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 flex-1">
                    <div className="w-5 bg-stone-100 rounded-t-md h-24" />
                    <span className="text-[10px] font-mono text-stone-400">Mon</span>
                  </div>
                  {/* Highlighted Tuesday */}
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
              </div>

              {/* Repeat Customer Rate (Gauge Meter matching template) */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-700">Repeat Customer Rate</span>
                  <span className="text-stone-400">•••</span>
                </div>

                <div className="flex flex-col items-center justify-center pt-2">
                  {/* Semi-Circle Gauge Visual */}
                  <div className="relative w-40 h-20 flex items-end justify-center overflow-hidden">
                    <svg className="w-40 h-40 absolute top-0" viewBox="0 0 100 100">
                      {/* Background arc */}
                      <path
                        d="M 15 50 A 35 35 0 0 1 85 50"
                        fill="none"
                        stroke="#e6ebd9"
                        strokeWidth="8"
                        strokeDasharray="3 3"
                      />
                      {/* Filled arc 68% */}
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
                    onClick={() => setShowLiveRailsModal(true)}
                    className="mt-2 text-xs font-mono font-semibold text-[#3f7308] hover:underline"
                  >
                    Show details
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ROW 3: BEST SELLING PRODUCTS TABLE + AI ASSISTANT / SPONSOR PANEL         */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Best Selling Products / Contracts Table */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
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
                    {/* Item 1 */}
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

                    {/* Item 2 */}
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

                    {/* Item 3 */}
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
            </div>

            {/* Right 1 Col: AI Assistant & Live PayPal Execution Rail */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#3f7308] animate-pulse" />
                  <span className="font-bold text-[#18280e]">AI Trade Assistant</span>
                </div>
                <button
                  onClick={() => setShowLiveRailsModal(true)}
                  className="text-stone-400 hover:text-black transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Central Sphere / Bot Avatar Visual */}
              <div className="flex flex-col items-center justify-center py-2 space-y-3">
                <div className="size-20 rounded-full bg-gradient-to-tr from-[#18280e] via-[#3f7308] to-[#b2eb76] p-0.5 shadow-md flex items-center justify-center">
                  <div className="size-full bg-white rounded-full flex items-center justify-center text-[#18280e]">
                    <Sparkles className="w-8 h-8 text-[#18280e] animate-pulse" />
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-[#18280e] block">
                    PayPal Sandbox Orders v2 Connected
                  </span>
                  <span className="text-[11px] text-stone-400 font-mono">
                    Merchant: sb-knljl53833937@business.example.com
                  </span>
                </div>
              </div>

              {/* Interactive PayPal Trigger inside widget */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={triggerPayPalEscrow}
                  disabled={paypalLoading}
                  className="w-full py-2.5 bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>
                    {paypalLoading ? "Connecting to PayPal..." : "Test PayPal Escrow ($25,725)"}
                  </span>
                </button>

                {paypalResult && (
                  <div className="p-2.5 rounded-lg bg-[#ebf7d9] text-[#18280e] text-[11px] font-mono space-y-1">
                    <div className="flex justify-between">
                      <span>Order:</span>
                      <strong className="text-[#3f7308]">{paypalResult.id}</strong>
                    </div>
                    {paypalResult.approveUrl && (
                      <a
                        href={paypalResult.approveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#3f7308] underline block text-center font-bold"
                      >
                        Open PayPal Sandbox Checkout →
                      </a>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowLiveRailsModal(true)}
                  className="w-full py-2 text-stone-600 hover:text-[#18280e] text-xs font-mono font-medium text-center block"
                >
                  View Full Sponsor Rails (Elastic, Zapier, Astropods) →
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 3. FULL SPONSOR RAILS MODAL (PayPal, Elastic, Zapier, Astropods)          */}
      {/* ========================================================================= */}
      {showLiveRailsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-center pb-4 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ebf7d9] flex items-center justify-center text-[#18280e] font-black">
                  PP
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#18280e]">
                    TRUV Active Sponsor Tools &amp; Rails
                  </h2>
                  <span className="text-xs text-stone-500 font-mono">
                    Live PayPal Orders v2, Elastic Search, Zapier Automations &amp; Astropods Telemetry
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowLiveRailsModal(false)}
                className="text-stone-400 hover:text-black text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Overview of the 4 Rails */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#fbfdf9] border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#18280e]">
                  <CreditCard className="w-4 h-4 text-[#3f7308]" />
                  <span>PayPal Orders v2 (Sandbox)</span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Client ID: <code>AU-2yZPCo9C6_04QNEU...</code><br />
                  Merchant: <code>sb-knljl53833937@business.example.com</code><br />
                  Milestone Escrow: 30% advance on PO, 70% against Bill of Lading.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#fbfdf9] border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#18280e]">
                  <Search className="w-4 h-4 text-[#3f7308]" />
                  <span>Elasticsearch BM25 + Vector</span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Indexes Indian MSME Clusters (Moradabad, Rajkot, Ludhiana, Peenya, Morbi).
                  Evaluates ASTM B117 salt spray, C36000 alloys, and DGFT IEC status.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#fbfdf9] border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#18280e]">
                  <Zap className="w-4 h-4 text-[#3f7308]" />
                  <span>Zapier Trade Automations</span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Multi-step cross-border webhooks: auto-dispatches shipping bills to ICEGATE customs brokers and books QIMA audits.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#fbfdf9] border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#18280e]">
                  <Radio className="w-4 h-4 text-[#3f7308]" />
                  <span>Astropods AIS Satellite Telemetry</span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Live satellite container tracking (MSKU-7491024) traversing the Arabian Sea from Mundra Port to Port of Long Beach.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowLiveRailsModal(false)}
                className="px-5 py-2.5 bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close Rails Console
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
