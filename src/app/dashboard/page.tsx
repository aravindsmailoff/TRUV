"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DashboardPage() {
  const [selectedCluster, setSelectedCluster] = useState<"moradabad" | "tirupur" | "rajkot">("moradabad");

  const clusterData = {
    moradabad: {
      title: "Moradabad Precision Castings & Brassware LLP",
      location: "Moradabad, Uttar Pradesh",
      iec: "0508012491",
      gstin: "09AAHFM9201L1Z4",
      capacity: "45,000 units/mo",
      auditor: "QIMA Quality Services",
    },
    tirupur: {
      title: "Kongu EcoFabrics & Knits Private Limited",
      location: "Tirupur, Tamil Nadu",
      iec: "3209004812",
      gstin: "33AAECK4812N1Z9",
      capacity: "120,000 units/mo",
      auditor: "SGS India Audits",
    },
    rajkot: {
      title: "Saurashtra High-Tech Auto Ancillaries LLP",
      location: "Rajkot, Gujarat",
      iec: "2411009184",
      gstin: "24AABCS9184P1Z3",
      capacity: "30,000 units/mo",
      auditor: "Bureau Veritas India",
    },
  };

  const current = clusterData[selectedCluster];

  return (
    <div className="min-h-screen bg-white text-[#18280e] font-sans selection:bg-[#b2eb76] selection:text-[#18280e]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-black/10 px-5 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-stone-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to TRUV</span>
          </Link>
          <span className="text-stone-300">|</span>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#3f7308] animate-pulse" />
            <span className="font-bold text-sm tracking-tight">TRUV Trade Operator Console</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCluster}
            onChange={(e) => setSelectedCluster(e.target.value as "moradabad" | "tirupur" | "rajkot")}
            className="text-xs font-mono bg-[#f4faed] border border-[#d8e5ca] rounded-md px-3 py-1.5 text-[#18280e] font-medium focus:outline-none"
          >
            <option value="moradabad">Moradabad Castings (UP)</option>
            <option value="tirupur">Kongu EcoTextiles (TN)</option>
            <option value="rajkot">Saurashtra Forgings (GJ)</option>
          </select>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[80rem] mx-auto px-5 lg:px-8 py-10 space-y-10">
        {/* Profile Card with Chamfered Corners */}
        <div
          className="relative bg-[#18280e] text-white p-6 sm:p-8 rounded-2xl border border-[#2d421d] shadow-xl font-mono"
          style={{ "--corner-size-desktop": "17px", "--corner-size-mobile": "13px" } as React.CSSProperties}
        >
          {/* Cut Corners */}
          <div className="pointer-events-none absolute inset-0 z-10">
            <div className="cut-corner absolute bg-white" style={{ top: "-1px", left: "-1px", clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
            <div className="cut-corner absolute bg-white" style={{ top: "-1px", right: "-1px", clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
            <div className="cut-corner absolute bg-white" style={{ bottom: "-1px", left: "-1px", clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />
            <div className="cut-corner absolute bg-white" style={{ bottom: "-1px", right: "-1px", clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }} />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#2d421d]">
            <div>
              <span className="text-xs text-[#b2eb76] uppercase tracking-wider block">Verified Indian Manufacturing Enterprise</span>
              <h2 className="text-2xl font-bold text-white mt-1">{current.title}</h2>
              <p className="text-xs text-stone-400 mt-1">Cluster: <strong className="text-stone-200">{current.location}</strong></p>
            </div>

            <div className="flex gap-2">
              <span className="px-2.5 py-1 rounded bg-[#223514] text-[#b2eb76] text-xs border border-[#3b5424]">
                DGFT IEC: {current.iec}
              </span>
              <span className="px-2.5 py-1 rounded bg-[#223514] text-white text-xs border border-[#3b5424]">
                GSTIN: {current.gstin}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs">
            <div>
              <span className="text-stone-400 block">Monthly Capacity:</span>
              <span className="text-lg font-bold text-[#b2eb76]">{current.capacity}</span>
            </div>
            <div>
              <span className="text-stone-400 block">Factory Inspection:</span>
              <span className="text-white font-bold">{current.auditor}</span>
            </div>
            <div>
              <span className="text-stone-400 block">PayPal Milestone Rails:</span>
              <span className="text-[#b2eb76] font-bold">Orders v2 Active</span>
            </div>
            <div>
              <span className="text-stone-400 block">Zero-Dispute Ratio:</span>
              <span className="text-white font-bold">0.08% Track Record</span>
            </div>
          </div>
        </div>

        {/* Active Trade Orders Table */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-[#18280e]">Active Commercial Export Orders</h3>
              <p className="text-xs font-mono text-stone-600">
                Coordinated through TRUV: Buyer RFQs, PayPal Milestone Escrows, QIMA Audits, and Maersk Logistics.
              </p>
            </div>
          </div>

          <div className="border border-black/10 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs font-mono divide-y divide-black/10">
              <thead className="bg-[#f4faed] text-stone-600 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Foreign Buyer</th>
                  <th className="py-3 px-4">Product Category</th>
                  <th className="py-3 px-4">Contract Value</th>
                  <th className="py-3 px-4">PayPal Milestone Status</th>
                  <th className="py-3 px-4">Audit &amp; Shipping Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 bg-white text-stone-800">
                <tr className="hover:bg-[#f4faed]/50">
                  <td className="py-3.5 px-4 font-bold text-[#18280e]">#ORD-9921</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-stone-900">Pacific Architectural Hardware</div>
                    <div className="text-[10px] text-stone-500">🇺🇸 United States (California)</div>
                  </td>
                  <td className="py-3.5 px-4">Architectural Solid Brass Locksets (5,000 sets)</td>
                  <td className="py-3.5 px-4 font-bold text-[#18280e]">$142,500 USD</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-[#ebf7d9] text-[#3f7308] font-bold text-[10px] border border-[#d8e5ca]">
                      30% Captured ($42,750)
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[#3f7308] font-semibold">QIMA AQL 1.5 Passed • Container MSKU948201</span>
                  </td>
                </tr>

                <tr className="hover:bg-[#f4faed]/50">
                  <td className="py-3.5 px-4 font-bold text-[#18280e]">#ORD-9918</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-stone-900">EuroBespoke Fittings Ltd</div>
                    <div className="text-[10px] text-stone-500">🇬🇧 United Kingdom (London)</div>
                  </td>
                  <td className="py-3.5 px-4">Heritage Polished Brass Espagnolettes (3,200 pcs)</td>
                  <td className="py-3.5 px-4 font-bold text-[#18280e]">$76,800 USD</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-[#ebf7d9] text-[#3f7308] font-bold text-[10px] border border-[#d8e5ca]">
                      100% Settled ($76,800)
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-stone-700">Delivered • Port of Felixstowe Handover</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
