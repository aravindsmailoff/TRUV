"use client";

import React, { useState } from "react";

interface MilestonePoint {
  date: string;
  x: number;
  y: number;
  label: string;
  amount: string;
  stage: string;
}

const POINTS: MilestonePoint[] = [
  { date: "1 Jan", x: 40, y: 140, label: "1 Jan (30% Advance)", amount: "$134.0K", stage: "PO Advance Captured" },
  { date: "8 Jan", x: 160, y: 110, label: "8 Jan (Production)", amount: "$210.5K", stage: "Foundry Casting" },
  { date: "15 Jan", x: 280, y: 75, label: "15 Jan (QIMA Inspection)", amount: "$298.2K", stage: "AQL 1.5 Passed" },
  { date: "22 Jan", x: 420, y: 55, label: "22 Jan (Customs LEO)", amount: "$374.0K", stage: "ICEGATE Let Export" },
  { date: "29 Jan", x: 560, y: 32, label: "29 Jan (BL Balance Release)", amount: "$446.7K", stage: "100% Settled" },
];

export function TotalProfitChart() {
  const [hoveredPoint, setHoveredPoint] = useState<MilestonePoint | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-semibold text-stone-500 font-mono uppercase tracking-wider">
            Total Profit
          </h3>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-3xl font-extrabold font-mono text-[#18280e]">
              {hoveredPoint ? hoveredPoint.amount : "$446.7K"}
            </span>
            <span className="text-xs font-bold text-emerald-700 font-mono">
              ▲ 24.4% vs. last period
            </span>
          </div>
        </div>

        <div className="text-xs font-mono text-stone-400 flex items-center gap-1.5 bg-[#f4faed] px-3 py-1 rounded-full border border-[#d8e5ca]">
          <span className="size-2 rounded-full bg-[#3f7308] animate-pulse" />
          <span className="text-[#18280e] font-bold">
            {hoveredPoint ? hoveredPoint.stage : "PayPal Orders v2 Verified"}
          </span>
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

          {/* Grid lines */}
          <line x1="0" y1="20" x2="600" y2="20" stroke="#f1f5e9" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="0" y1="70" x2="600" y2="70" stroke="#f1f5e9" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="0" y1="120" x2="600" y2="120" stroke="#f1f5e9" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="0" y1="170" x2="600" y2="170" stroke="#e6ebd9" strokeWidth="1" />

          {/* Area fill */}
          <path
            d="M 0 150 Q 80 145 160 110 T 280 75 T 420 55 T 560 32 L 600 30 L 600 170 L 0 170 Z"
            fill="url(#profitGrad)"
          />
          {/* Main stroke line */}
          <path
            d="M 0 150 Q 80 145 160 110 T 280 75 T 420 55 T 560 32 L 600 30"
            fill="none"
            stroke="#18280e"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Interactive milestone circles */}
          {POINTS.map((pt, i) => {
            const isHovered = hoveredPoint?.date === pt.date;
            return (
              <g
                key={i}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 7 : 4.5}
                  fill={isHovered ? "#b2eb76" : "#ffffff"}
                  stroke="#18280e"
                  strokeWidth="2.5"
                  className="transition-all duration-200"
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full mb-2 bg-[#18280e] text-[#b2eb76] font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-md border border-[#2d4d1a] whitespace-nowrap animate-in fade-in zoom-in-95"
            style={{
              left: `${(hoveredPoint.x / 600) * 100}%`,
              top: `${(hoveredPoint.y / 180) * 100}%`,
            }}
          >
            {hoveredPoint.label}: {hoveredPoint.amount}
          </div>
        )}
      </div>

      <div className="flex justify-between text-xs font-mono text-stone-400 pt-1 border-t border-stone-100">
        <span>1 Jan</span>
        <span>8 Jan</span>
        <span>15 Jan</span>
        <span>22 Jan</span>
        <span>29 Jan</span>
      </div>

      {/* Customer Segment Breakdown */}
      <div className="pt-2 border-t border-stone-100">
        <span className="text-xs font-semibold text-stone-500 block mb-2 font-mono uppercase">
          Customers Distribution
        </span>
        <div className="grid grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-[#f4faed] border-l-4 border-l-[#18280e] transition-transform hover:-translate-y-0.5">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Retailers</span>
            <span className="text-base font-bold text-[#18280e]">2.884</span>
          </div>
          <div className="p-3 rounded-xl bg-[#f4faed] border-l-4 border-l-[#3f7308] transition-transform hover:-translate-y-0.5">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Distributors</span>
            <span className="text-base font-bold text-[#18280e]">1.432</span>
          </div>
          <div className="p-3 rounded-xl bg-[#f4faed] border-l-4 border-l-amber-600 transition-transform hover:-translate-y-0.5">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Wholesalers</span>
            <span className="text-base font-bold text-[#18280e]">562</span>
          </div>
        </div>
      </div>
    </div>
  );
}
