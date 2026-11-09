"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  FileText,
  Store,
  Receipt,
  BarChart2,
  Percent,
  Settings,
  HelpCircle,
  Eye,
  MousePointer,
  MoreHorizontal,
  Maximize2,
  Calendar,
  ChevronDown,
  Plus,
  Download,
  Headphones,
  Watch,
  Star,
  Shield,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export function DashboardMockup() {
  const [activeSidebar, setActiveSidebar] = useState("dashboard");
  const [financesOpen, setFinancesOpen] = useState(true);

  return (
    <div className="w-full bg-[#f1f3f7] p-3 sm:p-5 lg:p-6 rounded-3xl font-sans text-stone-900 border border-stone-200/80 shadow-xl overflow-hidden select-none">
      {/* Outer Dashboard Window Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200/70 mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="size-3 rounded-full bg-[#ff5f56] inline-block" />
            <span className="size-3 rounded-full bg-[#ffbd2e] inline-block" />
            <span className="size-3 rounded-full bg-[#27c93f] inline-block" />
          </div>
          <span className="text-xs font-mono text-stone-500 ml-2 font-medium">TRUV Dashboard — Customer &amp; Manufacturer Portal</span>
        </div>

        <Link
          href="/dashboard"
          className="text-xs font-medium text-[#2563eb] hover:underline flex items-center gap-1 font-mono"
        >
          <span>Open Fullscreen View</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex gap-5 items-start">
        {/* ========================================================================= */}
        {/* LEFT SIDEBAR (Matching Image 1) */}
        {/* ========================================================================= */}
        <aside className="w-56 shrink-0 bg-white rounded-2xl p-3.5 shadow-sm border border-stone-200/60 hidden md:flex flex-col justify-between gap-6">
          <div className="space-y-4">
            {/* Nav list */}
            <nav className="space-y-1 text-xs font-medium">
              {/* Dashboard Item (Active) */}
              <button
                onClick={() => setActiveSidebar("dashboard")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all ${
                  activeSidebar === "dashboard"
                    ? "bg-[#eef2ff] text-[#2563eb] font-semibold"
                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                }`}
              >
                <span className="size-2 rounded-full bg-[#2563eb]" />
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              {/* Orders */}
              <button
                onClick={() => setActiveSidebar("orders")}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Orders</span>
                </div>
                <span className="text-[11px] font-semibold px-1.5 py-0.2 rounded-full bg-[#ecfdf5] text-[#059669]">
                  46
                </span>
              </button>

              {/* Products */}
              <button
                onClick={() => setActiveSidebar("products")}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-all"
              >
                <Package className="w-4 h-4" />
                <span>Products</span>
              </button>

              {/* Customers */}
              <button
                onClick={() => setActiveSidebar("customers")}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-all"
              >
                <Users className="w-4 h-4" />
                <span>Customers</span>
              </button>

              {/* Content */}
              <button
                onClick={() => setActiveSidebar("content")}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>Content</span>
              </button>

              {/* Online Store */}
              <button
                onClick={() => setActiveSidebar("store")}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-all"
              >
                <Store className="w-4 h-4" />
                <span>Online Store</span>
              </button>

              {/* Finances Dropdown */}
              <div className="pt-2">
                <button
                  onClick={() => setFinancesOpen(!financesOpen)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-stone-600 hover:text-stone-900 text-xs font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <Receipt className="w-4 h-4" />
                    <span>Finances</span>
                  </div>
                  <ChevronDown className={`w-3 h-3 transition-transform ${financesOpen ? "rotate-180" : ""}`} />
                </button>

                {financesOpen && (
                  <div className="pl-9 pr-2 py-1 space-y-1 text-stone-500 text-[11px]">
                    <div className="py-1 hover:text-[#2563eb] cursor-pointer">Invoices</div>
                    <div className="py-1 hover:text-[#2563eb] cursor-pointer">Transactions</div>
                    <div className="py-1 hover:text-[#2563eb] cursor-pointer">Reports</div>
                  </div>
                )}
              </div>

              {/* Analytics */}
              <button
                onClick={() => setActiveSidebar("analytics")}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-all"
              >
                <BarChart2 className="w-4 h-4" />
                <span>Analytics</span>
              </button>

              {/* Discounts */}
              <button
                onClick={() => setActiveSidebar("discounts")}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-all"
              >
                <Percent className="w-4 h-4" />
                <span>Discounts</span>
              </button>

              {/* Settings & Support */}
              <div className="pt-2 space-y-1">
                <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-stone-600 hover:text-stone-900 text-xs">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-stone-600 hover:text-stone-900 text-xs">
                  <HelpCircle className="w-4 h-4" />
                  <span>Help &amp; Support</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Bottom Card: Upgrade to Premium! */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white text-center shadow-md space-y-2">
            <div className="size-8 mx-auto rounded-full bg-white/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-xs">Upgrade to Premium!</div>
              <p className="text-[10px] text-white/80 mt-0.5 leading-snug">
                Upgrade your account and unlock all of the benefits.
              </p>
            </div>
            <button className="w-full py-1.5 px-2 rounded-xl bg-white text-[#2563eb] text-[11px] font-bold shadow-xs hover:bg-white/90 transition-colors">
              Upgrade premium
            </button>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* MAIN DASHBOARD CONTENT AREA (Matching Image 1) */}
        {/* ========================================================================= */}
        <div className="flex-1 space-y-4 min-w-0">
          {/* Top Bar: Title, Date Filter, Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-stone-900 tracking-tight">Dashboard</h3>

            <div className="flex flex-wrap items-center gap-2">
              {/* Date Filter Pill */}
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-stone-200/70 text-xs text-stone-600 shadow-xs">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>Jan 1, 2025 - Feb, 1 2025</span>
                <span className="text-stone-300">|</span>
                <span className="flex items-center gap-1 font-medium text-stone-700">
                  Last 30 days <ChevronDown className="w-3 h-3 text-stone-400" />
                </span>
              </div>

              {/* Add Widget Button */}
              <button className="flex items-center gap-1 bg-white hover:bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200/70 text-xs font-medium text-stone-700 shadow-xs transition-colors">
                <Plus className="w-3.5 h-3.5 text-stone-500" />
                <span>Add widget</span>
              </button>

              {/* Export Button (Blue) */}
              <button className="flex items-center gap-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-xs transition-colors">
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4 TOP METRIC CARDS (Matching Image 1) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Card 1: Page Views */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200/60">
              <div className="flex justify-between items-center text-xs text-stone-500 font-medium mb-1">
                <span>Page Views</span>
                <div className="size-6 rounded-full bg-[#eff6ff] flex items-center justify-center text-[#2563eb]">
                  <Eye className="w-3 h-3" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-stone-900 tracking-tight">16.431</span>
                <span className="text-[11px] font-semibold text-[#059669] bg-[#ecfdf5] px-1.5 py-0.2 rounded-md">
                  ▲ 15.5%
                </span>
              </div>
              <span className="text-[10px] text-stone-400 block mt-1">vs. 14,653 last period</span>
            </div>

            {/* Card 2: Visitors */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200/60">
              <div className="flex justify-between items-center text-xs text-stone-500 font-medium mb-1">
                <span>Visitors</span>
                <div className="size-6 rounded-full bg-[#eff6ff] flex items-center justify-center text-[#2563eb]">
                  <Users className="w-3 h-3" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-stone-900 tracking-tight">6.225</span>
                <span className="text-[11px] font-semibold text-[#059669] bg-[#ecfdf5] px-1.5 py-0.2 rounded-md">
                  ▲ 8.4%
                </span>
              </div>
              <span className="text-[10px] text-stone-400 block mt-1">vs. 5,732 last period</span>
            </div>

            {/* Card 3: Click */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200/60">
              <div className="flex justify-between items-center text-xs text-stone-500 font-medium mb-1">
                <span>Click</span>
                <div className="size-6 rounded-full bg-[#eff6ff] flex items-center justify-center text-[#2563eb]">
                  <MousePointer className="w-3 h-3" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-stone-900 tracking-tight">2.832</span>
                <span className="text-[11px] font-semibold text-[#e11d48] bg-[#fff1f2] px-1.5 py-0.2 rounded-md">
                  ▼ 10.5%
                </span>
              </div>
              <span className="text-[10px] text-stone-400 block mt-1">vs. 3,294 last period</span>
            </div>

            {/* Card 4: Orders */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200/60">
              <div className="flex justify-between items-center text-xs text-stone-500 font-medium mb-1">
                <span>Orders</span>
                <div className="size-6 rounded-full bg-[#eff6ff] flex items-center justify-center text-[#2563eb]">
                  <ShoppingBag className="w-3 h-3" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-stone-900 tracking-tight">1.224</span>
                <span className="text-[11px] font-semibold text-[#059669] bg-[#ecfdf5] px-1.5 py-0.2 rounded-md">
                  ▲ 4.4%
                </span>
              </div>
              <span className="text-[10px] text-stone-400 block mt-1">vs. 1,186 last period</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* MIDDLE ROW: TOTAL PROFIT (LEFT) + ACTIVE DAY & GAUGE (RIGHT) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Total Profit Chart Card (Matching Image 1) */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200/60 lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-stone-700">Total Profit</span>
                <span className="text-xs text-stone-400 font-medium">15K / 10K / 5K</span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-stone-900 tracking-tight">$446.7K</span>
                <span className="text-xs font-semibold text-[#059669] bg-[#ecfdf5] px-2 py-0.5 rounded-md">
                  ▲ 24.4%
                </span>
                <span className="text-xs text-stone-400">vs. last period</span>
              </div>

              {/* Smooth Blue Curve Chart (Matching Image 1) */}
              <div className="relative h-32 w-full flex items-end pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 110" fill="none">
                  <defs>
                    <linearGradient id="profitBlueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M 0,85 C 40,85 60,92 100,75 C 140,55 180,68 220,55 C 260,40 300,50 340,30 C 380,45 420,25 460,35 L 500,28"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    fill="none"
                  />
                  <path
                    d="M 0,85 C 40,85 60,92 100,75 C 140,55 180,68 220,55 C 260,40 300,50 340,30 C 380,45 420,25 460,35 L 500,28 L 500,110 L 0,110 Z"
                    fill="url(#profitBlueGrad)"
                  />
                </svg>

                {/* X-axis dates */}
                <div className="absolute inset-x-0 bottom-0 flex justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-100">
                  <span>1 Jan</span>
                  <span>8 Jan</span>
                  <span>15 Jan</span>
                  <span>22 Jan</span>
                  <span>29 Jan</span>
                </div>
              </div>

              {/* Customers breakdown bars (Matching Image 1) */}
              <div className="pt-2 border-t border-stone-100 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-stone-700">Customers</span>
                  <MoreHorizontal className="w-3.5 h-3.5 text-stone-400" />
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  {/* Retailers */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-stone-900">
                      <span className="size-2 rounded-xs bg-[#2563eb]" />
                      <span>2.884</span>
                    </div>
                    <span className="text-[10px] text-stone-400 block">Retailers</span>
                    <div className="h-1 bg-[#2563eb] rounded-full w-full" />
                  </div>

                  {/* Distributors */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-stone-900">
                      <span className="size-2 rounded-xs bg-[#10b981]" />
                      <span>1.432</span>
                    </div>
                    <span className="text-[10px] text-stone-400 block">Distributors</span>
                    <div className="h-1 bg-[#10b981] rounded-full w-full" />
                  </div>

                  {/* Wholesalers */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-stone-900">
                      <span className="size-2 rounded-xs bg-[#f97316]" />
                      <span>562</span>
                    </div>
                    <span className="text-[10px] text-stone-400 block">Wholesalers</span>
                    <div className="h-1 bg-[#f97316] rounded-full w-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Most Day Active + Repeat Customer Rate (Matching Image 1) */}
            <div className="space-y-4">
              {/* Most Day Active Bar Chart */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200/60 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-stone-700">Most Day Active</span>
                  <MoreHorizontal className="w-3.5 h-3.5 text-stone-400" />
                </div>

                {/* Vertical Bar Chart */}
                <div className="h-28 flex items-end justify-between px-2 pt-3">
                  {[
                    { day: "Sun", height: "40%", active: false },
                    { day: "Mon", height: "55%", active: false },
                    { day: "Tue", height: "85%", active: true, value: "8.162" },
                    { day: "Wed", height: "50%", active: false },
                    { day: "Thu", height: "45%", active: false },
                    { day: "Fr", height: "65%", active: false },
                    { day: "Sat", height: "35%", active: false },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      {item.active && (
                        <span className="text-[9px] font-bold text-[#2563eb]">{item.value}</span>
                      )}
                      <div
                        className={`w-5 rounded-md transition-all ${
                          item.active ? "bg-[#2563eb]" : "bg-stone-100"
                        }`}
                        style={{ height: item.height }}
                      />
                      <span className="text-[10px] text-stone-400">{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Repeat Customer Rate Semi-Circle Speedometer Gauge */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200/60 text-center space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-stone-700">Repeat Customer Rate</span>
                  <MoreHorizontal className="w-3.5 h-3.5 text-stone-400" />
                </div>

                {/* SVG Gauge */}
                <div className="relative flex flex-col items-center justify-center py-1">
                  <div className="relative size-28">
                    <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-stone-100"
                        strokeWidth="3.8"
                        strokeDasharray="75, 100"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#10b981]"
                        strokeWidth="3.8"
                        strokeDasharray="51, 100"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-stone-900 font-mono">68%</span>
                      <span className="text-[8px] text-stone-400 uppercase">Rate</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400 block">On track for 80% target</span>
                </div>

                <button className="px-3 py-1 rounded-lg border border-stone-200 text-stone-600 text-[11px] font-medium hover:bg-stone-50 transition-colors">
                  Show details
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BOTTOM ROW: BEST SELLING PRODUCTS (LEFT) + AI ASSISTANT (RIGHT) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Best Selling Products Table (Matching Image 1) */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200/60 lg:col-span-2 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                <span className="text-xs font-bold text-stone-700">Best Selling Products</span>
                <MoreHorizontal className="w-3.5 h-3.5 text-stone-400" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[10px] text-stone-400 uppercase font-semibold border-b border-stone-100">
                      <th className="py-2 px-2">ID</th>
                      <th className="py-2 px-2">NAME</th>
                      <th className="py-2 px-2">SOLD</th>
                      <th className="py-2 px-2">REVENUE</th>
                      <th className="py-2 px-2">RATING</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50 text-stone-700">
                    <tr className="hover:bg-stone-50/50">
                      <td className="py-2.5 px-2 font-mono text-stone-500 text-[11px]">#83009</td>
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-2">
                          <div className="size-6 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                            <Headphones className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-medium text-stone-900 truncate max-w-[180px]">
                            Hybrid Active Noise Cance...
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-stone-500 text-[11px]">2,310 sold</td>
                      <td className="py-2.5 px-2 font-semibold text-stone-900">$124.839</td>
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-1 text-amber-500 text-[11px] font-semibold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>(5.0)</span>
                        </div>
                      </td>
                    </tr>

                    <tr className="hover:bg-stone-50/50">
                      <td className="py-2.5 px-2 font-mono text-stone-500 text-[11px]">#83001</td>
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-2">
                          <div className="size-6 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                            <Watch className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-medium text-stone-900 truncate max-w-[180px]">
                            Casio G-Shock Shock Resi...
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-stone-500 text-[11px]">1,230 sold</td>
                      <td className="py-2.5 px-2 font-semibold text-stone-900">$92.662</td>
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-1 text-amber-500 text-[11px] font-semibold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>(4.8)</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Assistant Card (Matching Image 1) */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200/60 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-stone-700">AI Assistant</span>
                <Maximize2 className="w-3.5 h-3.5 text-stone-400" />
              </div>

              {/* 3D Orb / Sphere Graphic */}
              <div className="flex flex-col items-center justify-center py-4">
                <div className="size-20 rounded-full bg-gradient-to-tr from-[#2563eb] via-[#60a5fa] to-[#93c5fd] shadow-lg shadow-blue-500/30 flex items-center justify-center animate-pulse">
                  <div className="size-14 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
                </div>
                <span className="text-xs font-semibold text-stone-800 mt-3">Smart Commercial Copilot</span>
                <p className="text-[10px] text-stone-400 text-center max-w-[170px] mt-0.5">
                  Analyzing purchase orders &amp; export delivery timelines in real-time.
                </p>
              </div>

              <div className="p-2 rounded-xl bg-stone-50 text-[10px] text-stone-600 flex items-center justify-between">
                <span>Ask anything about your trade metrics</span>
                <ChevronRight className="w-3 h-3 text-stone-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
