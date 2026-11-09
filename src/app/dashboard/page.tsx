"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Users,
  CreditCard,
  FileText,
  BarChart3,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Plus,
  ArrowLeft,
  Ship,
} from "lucide-react";
import { Magnet } from "@/components/reactbits/Magnet";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";

export default function ManufacturerDashboardPage() {
  const [selectedCluster, setSelectedCluster] = useState<"moradabad" | "tirupur" | "rajkot">("moradabad");
  const [activeNav, setActiveNav] = useState<string>("dashboard");

  // MSME profiles
  const profiles = {
    moradabad: {
      name: "Moradabad Precision Foundry & Castings LLP",
      tradeName: "MPF Precision Brassware",
      cluster: "Moradabad, Uttar Pradesh",
      iec: "0508012491",
      gstin: "09AAHFM9201L1Z4",
      auditor: "QIMA Quality Services Pvt Ltd",
      totalRevenue: "$446,750",
      activeRfqs: 18,
      inProduction: 6,
      disbursedPaypal: "$124,800",
      capacityRate: "68%",
      orders: [
        {
          id: "#ORD-9921",
          buyer: "Pacific Architectural Hardware",
          country: "🇺🇸 USA (California)",
          product: "Architectural Solid Brass Mortise Locksets",
          qty: "5,000 sets",
          value: "$142,500",
          paypalStatus: "30% Captured ($42,750)",
          qimaStatus: "Inspection Passed (AQL 1.5)",
          shippingStatus: "Maersk Container Loaded (MSKU948201)",
          rating: 5.0,
        },
        {
          id: "#ORD-9918",
          buyer: "EuroBespoke Fittings Ltd",
          country: "🇬🇧 UK (London)",
          product: "Heritage Polished Brass Window Espagnolettes",
          qty: "3,200 pcs",
          value: "$76,800",
          paypalStatus: "100% Settled ($76,800)",
          qimaStatus: "Certificate Issued #QIMA-8812",
          shippingStatus: "Delivered (Port of Felixstowe)",
          rating: 4.9,
        },
        {
          id: "#ORD-9894",
          buyer: "Vance & Sterling Architectural",
          country: "🇨🇦 Canada (Vancouver)",
          product: "Commercial Pull Handles & Push Plates",
          qty: "2,000 pairs",
          value: "$58,400",
          paypalStatus: "30% Advance Escrow Held",
          qimaStatus: "Scheduled for Nov 18",
          shippingStatus: "Production at 85%",
          rating: 4.8,
        },
      ],
    },
    tirupur: {
      name: "Kongu EcoFabrics & Knits Private Limited",
      tradeName: "Kongu EcoTextiles",
      cluster: "Tirupur, Tamil Nadu",
      iec: "3209004812",
      gstin: "33AAECK4812N1Z9",
      auditor: "SGS India Audits",
      totalRevenue: "$682,400",
      activeRfqs: 24,
      inProduction: 9,
      disbursedPaypal: "$210,500",
      capacityRate: "82%",
      orders: [
        {
          id: "#ORD-9905",
          buyer: "Nordic Organic Apparel AB",
          country: "🇸🇪 Sweden (Gothenburg)",
          product: "GOTS Combed Organic Heavyweight Tees",
          qty: "25,000 pcs",
          value: "$160,000",
          paypalStatus: "30% Captured ($48,000)",
          qimaStatus: "SGS Lab Test Cleared (OEKO-TEX)",
          shippingStatus: "Port of Mumbai CFS Handover",
          rating: 5.0,
        },
      ],
    },
    rajkot: {
      name: "Saurashtra High-Tech Auto Ancillaries LLP",
      tradeName: "Saurashtra Precision Forgings",
      cluster: "Rajkot, Gujarat",
      iec: "2411009184",
      gstin: "24AABCS9184P1Z3",
      auditor: "Bureau Veritas India",
      totalRevenue: "$518,200",
      activeRfqs: 14,
      inProduction: 5,
      disbursedPaypal: "$155,400",
      capacityRate: "74%",
      orders: [
        {
          id: "#ORD-9912",
          buyer: "Bavarian Fluid Dynamics GmbH",
          country: "🇩🇪 Germany (Munich)",
          product: "DIN 2633 Forged High-Pressure Weld Neck Flanges",
          qty: "12,000 pcs",
          value: "$218,400",
          paypalStatus: "30% Captured ($65,520)",
          qimaStatus: "Ultrasonic NDT Inspection Passed",
          shippingStatus: "Mundra Port Gate-In Cleared",
          rating: 4.9,
        },
      ],
    },
  };

  const current = profiles[selectedCluster];

  return (
    <div className="min-h-screen bg-[#f8faf6] text-[#18280e] flex font-sans selection:bg-[#b2eb76] selection:text-[#18280e]">
      {/* ========================================================================= */}
      {/* LEFT NAVIGATION SIDEBAR (Matches Image 1 layout) */}
      {/* ========================================================================= */}
      <aside className="w-64 bg-white border-r border-[#d8e5ca] flex flex-col justify-between p-4 shrink-0 shadow-xs max-lg:hidden">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#d8e5ca]">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="size-3 rounded-full bg-[#3f7308] group-hover:bg-[#b2eb76] transition-colors" />
              <span className="font-bold text-lg tracking-tight text-[#18280e]">TRUV</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#ebf7d9] text-[#3f7308] font-bold">
                OPERATOR
              </span>
            </Link>

            <Link href="/" className="text-xs text-stone-500 hover:text-black flex items-center gap-1 font-mono">
              <ArrowLeft className="w-3 h-3" />
              <span>Back</span>
            </Link>
          </div>

          {/* Cluster Switcher */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold block">
              Active Indian MSME Profile
            </label>
            <select
              value={selectedCluster}
              onChange={(e) => setSelectedCluster(e.target.value as "moradabad" | "tirupur" | "rajkot")}
              className="w-full text-xs font-mono bg-[#f4faed] border border-[#d8e5ca] rounded-md px-2.5 py-2 text-[#18280e] focus:outline-none focus:border-[#3f7308] font-medium"
            >
              <option value="moradabad">Moradabad Precision Castings (UP)</option>
              <option value="tirupur">Kongu EcoTextiles (TN)</option>
              <option value="rajkot">Saurashtra Precision Forgings (GJ)</option>
            </select>
          </div>

          {/* Navigation Links (Matching Image 1 Sidebar) */}
          <nav className="space-y-1 text-xs font-mono font-medium">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: "" },
              { id: "orders", label: "Export Orders", icon: Package, badge: "3 Active" },
              { id: "buyers", label: "International Buyers", icon: Users, badge: "18" },
              { id: "rfqs", label: "Quotation Requests", icon: FileText, badge: "4 New" },
              { id: "paypal", label: "PayPal Escrow & Payouts", icon: CreditCard, badge: "$124K" },
              { id: "logistics", label: "Shipping Bills & ICEGATE", icon: Ship, badge: "LEO" },
              { id: "analytics", label: "Export Analytics", icon: BarChart3, badge: "" },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                      : "text-stone-700 hover:bg-[#ebf7d9] hover:text-[#18280e]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        isActive ? "bg-[#b2eb76] text-[#18280e]" : "bg-stone-200/70 text-stone-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Exporter Statutory Status Card */}
        <div className="p-3.5 rounded-xl bg-[#ebf7d9] border border-[#d8e5ca] space-y-2 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 font-bold text-[#18280e]">
            <ShieldCheck className="w-4 h-4 text-[#3f7308]" />
            <span>DGFT &amp; GSTIN Verified</span>
          </div>
          <div className="text-stone-600 text-[10px] space-y-0.5">
            <div>IEC: <strong className="text-[#18280e]">{current.iec}</strong></div>
            <div>Audited: <strong className="text-[#18280e]">{current.auditor}</strong></div>
          </div>
          <div className="pt-1">
            <span className="inline-block px-2 py-0.5 rounded bg-[#18280e] text-[#b2eb76] text-[9px] font-bold">
              PAYPAL ORDERS V2 ACTIVE
            </span>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN DASHBOARD CONTENT AREA */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-[#d8e5ca] flex items-center justify-between px-5 lg:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <Link href="/" className="lg:hidden text-xs text-stone-600 font-mono flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </Link>
            <h1 className="text-xl font-bold tracking-tight text-[#18280e]">
              Manufacturer &amp; Trade Execution Dashboard
            </h1>
            <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-mono rounded-full bg-[#f4faed] text-[#3f7308] border border-[#d8e5ca] font-semibold">
              Cluster: {current.cluster}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-stone-500 bg-[#f4faed] px-3 py-1.5 rounded-lg border border-[#d8e5ca]">
              <Clock className="w-3.5 h-3.5 text-[#3f7308]" />
              <span>Jan 1, 2026 – Present (Q1 Active)</span>
            </div>

            <Magnet padding={20} magnetStrength={2}>
              <Link
                href="/#trade-execution"
                className="px-4 py-2 rounded-md bg-[#18280e] text-[#b2eb76] font-semibold text-xs inline-flex items-center gap-1.5 hover:bg-[#18280e]/90 transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Submit New Commercial RFQ</span>
              </Link>
            </Magnet>
          </div>
        </header>

        {/* Dashboard Body Grid */}
        <div className="p-5 lg:p-8 space-y-6 max-w-[85rem] mx-auto w-full">
          {/* ========================================================================= */}
          {/* 4 TOP KPI CARDS (Matching Image 1) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Page Views / RFQ Inquiries */}
            <SpotlightCard className="p-5 rounded-xl bg-white border border-[#d8e5ca] shadow-xs">
              <div className="flex justify-between items-center text-xs font-mono text-stone-500 mb-2">
                <span className="font-semibold uppercase">International RFQ Inquiries</span>
                <span className="text-stone-400">👁️</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#18280e] font-mono">16,431</span>
                <span className="text-xs font-mono font-semibold text-[#3f7308] bg-[#ebf7d9] px-1.5 py-0.5 rounded">
                  ▲ +15.5%
                </span>
              </div>
              <span className="text-[11px] font-mono text-stone-400 block mt-2">vs. 14,653 in prior quarter</span>
            </SpotlightCard>

            {/* Card 2: Foreign Buyers Vetted */}
            <SpotlightCard className="p-5 rounded-xl bg-white border border-[#d8e5ca] shadow-xs">
              <div className="flex justify-between items-center text-xs font-mono text-stone-500 mb-2">
                <span className="font-semibold uppercase">Verified Foreign Buyers</span>
                <span className="text-stone-400">🌐</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#18280e] font-mono">6,225</span>
                <span className="text-xs font-mono font-semibold text-[#3f7308] bg-[#ebf7d9] px-1.5 py-0.5 rounded">
                  ▲ +8.4%
                </span>
              </div>
              <span className="text-[11px] font-mono text-stone-400 block mt-2">Corridors: USA, UK, Germany, Nordics</span>
            </SpotlightCard>

            {/* Card 3: Discrepancy Resolution Rate */}
            <SpotlightCard className="p-5 rounded-xl bg-white border border-[#d8e5ca] shadow-xs">
              <div className="flex justify-between items-center text-xs font-mono text-stone-500 mb-2">
                <span className="font-semibold uppercase">AI Contract Matching</span>
                <span className="text-stone-400">⚖️</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#18280e] font-mono">2,832</span>
                <span className="text-xs font-mono font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                  ▼ 10.5% variances
                </span>
              </div>
              <span className="text-[11px] font-mono text-stone-400 block mt-2">UCP 600 export compliance checks</span>
            </SpotlightCard>

            {/* Card 4: Executed Export Orders */}
            <SpotlightCard className="p-5 rounded-xl bg-white border border-[#d8e5ca] shadow-xs">
              <div className="flex justify-between items-center text-xs font-mono text-stone-500 mb-2">
                <span className="font-semibold uppercase">Executed Export Orders</span>
                <span className="text-stone-400">📦</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#18280e] font-mono">1,224</span>
                <span className="text-xs font-mono font-semibold text-[#3f7308] bg-[#ebf7d9] px-1.5 py-0.5 rounded">
                  ▲ +4.4%
                </span>
              </div>
              <span className="text-[11px] font-mono text-stone-400 block mt-2">0.08% zero-dispute milestone record</span>
            </SpotlightCard>
          </div>

          {/* ========================================================================= */}
          {/* MIDDLE SECTION: PROFIT CHART + ACTIVE DAYS + CAPACITY GAUGE */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Total Export Profit & Milestone Cashflow Chart */}
            <SpotlightCard className="p-6 rounded-xl bg-white border border-[#d8e5ca] shadow-xs lg:col-span-2 space-y-5">
              <div className="flex justify-between items-center pb-3 border-b border-[#d8e5ca]/60">
                <div>
                  <span className="text-xs font-mono text-stone-500 uppercase font-semibold">Total Export Settlement Revenue</span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-3xl font-extrabold text-[#18280e] font-mono">{current.totalRevenue}</span>
                    <span className="text-xs font-mono font-bold text-[#3f7308] bg-[#ebf7d9] px-2 py-0.5 rounded">
                      ▲ +24.4% vs last period
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded bg-[#f4faed] text-[#18280e] border border-[#d8e5ca] font-semibold">
                    PayPal Orders v2 Rails
                  </span>
                </div>
              </div>

              {/* Simulated SVG Trend Line (Matching Image 1 Chart) */}
              <div className="relative h-44 w-full flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 140" fill="none">
                  <defs>
                    <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#b2eb76" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#b2eb76" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M0,110 Q40,90 80,105 T160,85 T240,110 T320,65 T400,75 T480,45 T540,55 T600,35"
                    stroke="#3f7308"
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    d="M0,110 Q40,90 80,105 T160,85 T240,110 T320,65 T400,75 T480,45 T540,55 T600,35 L600,140 L0,140 Z"
                    fill="url(#profitGrad)"
                  />
                  {/* Point circles */}
                  <circle cx="320" cy="65" r="4" fill="#18280e" stroke="#b2eb76" strokeWidth="2" />
                  <circle cx="480" cy="45" r="4" fill="#18280e" stroke="#b2eb76" strokeWidth="2" />
                  <circle cx="600" cy="35" r="5" fill="#3f7308" stroke="#ffffff" strokeWidth="2" />
                </svg>

                {/* X-axis labels */}
                <div className="absolute inset-x-0 bottom-0 flex justify-between text-[10px] font-mono text-stone-400 pt-2 border-t border-stone-200">
                  <span>1 Jan (Advance 30%)</span>
                  <span>8 Jan (Tooling)</span>
                  <span>15 Jan (QIMA Audit)</span>
                  <span>22 Jan (Customs LEO)</span>
                  <span>29 Jan (BL 70% Settled)</span>
                </div>
              </div>

              {/* Breakdown by Commercial Channel */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#d8e5ca]/60 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-[#f4faed] border border-[#d8e5ca]">
                  <span className="text-stone-500 block text-[10px]">Overseas Wholesalers</span>
                  <span className="font-bold text-[#18280e] text-sm">2,884 Orders</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#f4faed] border border-[#d8e5ca]">
                  <span className="text-stone-500 block text-[10px]">Direct Foreign Distributors</span>
                  <span className="font-bold text-[#18280e] text-sm">1,432 Orders</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#f4faed] border border-[#d8e5ca]">
                  <span className="text-stone-500 block text-[10px]">Institutional Retailers</span>
                  <span className="font-bold text-[#18280e] text-sm">562 Orders</span>
                </div>
              </div>
            </SpotlightCard>

            {/* Right Col: Factory Utilization & Capacity Gauge (Matching Image 1) */}
            <div className="space-y-6">
              {/* Capacity & Repeat Buyer Rate */}
              <SpotlightCard className="p-6 rounded-xl bg-white border border-[#d8e5ca] shadow-xs text-center space-y-4">
                <div className="flex justify-between items-center text-xs font-mono text-stone-500">
                  <span className="font-semibold uppercase">Factory Capacity Utilization</span>
                  <span className="text-[10px] text-[#3f7308] font-bold">QIMA Audited</span>
                </div>

                {/* Semi-Circle Speedometer / Gauge */}
                <div className="relative flex flex-col items-center justify-center py-4">
                  <div className="relative size-36">
                    <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-stone-200"
                        strokeWidth="3.8"
                        strokeDasharray="75, 100"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#3f7308]"
                        strokeWidth="3.8"
                        strokeDasharray="51, 100"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-extrabold font-mono text-[#18280e]">{current.capacityRate}</span>
                      <span className="text-[9px] font-mono text-stone-500 uppercase">Booked to Capacity</span>
                    </div>
                  </div>
                  <p className="text-xs font-mono text-stone-600 mt-2">On track for 85% export target this quarter</p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#ebf7d9] text-[11px] font-mono text-[#18280e] flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3f7308]" />
                  <span>Next dispatch slot: Mundra Port (Nov 14)</span>
                </div>
              </SpotlightCard>

              {/* AI Trade Execution Assistant Card */}
              <SpotlightCard className="p-5 rounded-xl bg-[#18280e] text-white border border-[#2d421d] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#b2eb76]">
                  <span className="flex items-center gap-1.5 font-bold uppercase">
                    <Sparkles className="w-4 h-4 text-[#b2eb76]" />
                    AI Trade Operator Copilot
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#223514]">ACTIVE</span>
                </div>

                <p className="text-xs font-mono text-stone-300 leading-relaxed">
                  &ldquo;Order #ORD-9921 for Pacific Hardware is ready for customs filing. ICEGATE Shipping Bill
                  generated. Request QIMA pre-shipment seal verification.&rdquo;
                </p>

                <div className="pt-1 flex gap-2">
                  <button className="px-3 py-1.5 rounded bg-[#b2eb76] text-[#18280e] font-mono text-[11px] font-bold hover:bg-[#b2eb76]/90 transition-colors">
                    File ICEGATE LEO
                  </button>
                  <button className="px-3 py-1.5 rounded bg-white/10 text-stone-300 font-mono text-[11px] hover:bg-white/20 transition-colors">
                    View PO Discrepancy
                  </button>
                </div>
              </SpotlightCard>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BOTTOM SECTION: ACTIVE EXPORT ORDERS TABLE (Matching Image 1) */}
          {/* ========================================================================= */}
          <SpotlightCard className="p-6 rounded-xl bg-white border border-[#d8e5ca] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#d8e5ca]/60">
              <div>
                <h3 className="text-base font-bold text-[#18280e]">Active Commercial Export Orders</h3>
                <p className="text-xs font-mono text-stone-500">
                  Real-time synchronization with foreign buyers, PayPal Orders v2 milestones, and ocean logistics.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded bg-[#f4faed] text-stone-600 font-mono text-xs border border-[#d8e5ca]">
                  Showing 3 of 18 Active Orders
                </span>
                <button className="p-2 rounded border border-[#d8e5ca] text-stone-600 hover:text-black hover:bg-stone-50">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#d8e5ca] text-stone-500 uppercase text-[10px]">
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">International Buyer</th>
                    <th className="py-2.5 px-3">Product Description</th>
                    <th className="py-2.5 px-3">Volume</th>
                    <th className="py-2.5 px-3">Value</th>
                    <th className="py-2.5 px-3">PayPal Milestone Escrow</th>
                    <th className="py-2.5 px-3">Audit / Inspection</th>
                    <th className="py-2.5 px-3">Logistics Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d8e5ca]/50">
                  {current.orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#f4faed]/60 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-[#18280e]">{ord.id}</td>
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-stone-900">{ord.buyer}</div>
                        <div className="text-[10px] text-stone-500">{ord.country}</div>
                      </td>
                      <td className="py-3.5 px-3 max-w-[220px] truncate text-stone-800">{ord.product}</td>
                      <td className="py-3.5 px-3 text-stone-600">{ord.qty}</td>
                      <td className="py-3.5 px-3 font-bold text-[#18280e]">{ord.value}</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-[#ebf7d9] text-[#3f7308] font-bold text-[10px] border border-[#d8e5ca]">
                          {ord.paypalStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="text-stone-700 font-medium">{ord.qimaStatus}</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="text-[#3f7308] font-semibold">{ord.shippingStatus}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-3 border-t border-[#d8e5ca]/60 text-xs font-mono text-stone-500">
              <div>
                Connected Rails: <strong>PayPal Orders v2</strong> | <strong>ICEGATE Customs</strong> | <strong>Maersk Ocean</strong>
              </div>

              <Link
                href="/#trade-execution"
                className="text-[#3f7308] hover:underline font-bold flex items-center gap-1"
              >
                <span>Switch to Full Trade Operator Console</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </SpotlightCard>
        </div>
      </main>
    </div>
  );
}
