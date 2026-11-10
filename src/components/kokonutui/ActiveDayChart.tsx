"use client";

import React, { useState, useEffect } from "react";

interface DayData {
  day: string;
  short: string;
  value: number;
  formatted: string;
  heightPercent: number; // 0 to 100
}

const DAYS: DayData[] = [
  { day: "Sunday", short: "Sun", value: 3.24, formatted: "3.240", heightPercent: 40 },
  { day: "Monday", short: "Mon", value: 5.61, formatted: "5.610", heightPercent: 65 },
  { day: "Tuesday", short: "Tue", value: 8.162, formatted: "8.162", heightPercent: 92 },
  { day: "Wednesday", short: "Wed", value: 4.89, formatted: "4.890", heightPercent: 54 },
  { day: "Thursday", short: "Thu", value: 6.12, formatted: "6.120", heightPercent: 68 },
  { day: "Friday", short: "Fr", value: 7.45, formatted: "7.450", heightPercent: 80 },
  { day: "Saturday", short: "Sat", value: 3.12, formatted: "3.120", heightPercent: 36 },
];

export function ActiveDayChart({ className = "" }: { className?: string }) {
  const [activeDayIndex, setActiveDayIndex] = useState(2); // Tuesday default (8.162)
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const activeDay = DAYS[activeDayIndex];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header matching exact layout: Most Day Active + pill badge 8.162 + ellipsis */}
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-700">Most Day Active</span>
          <span className="text-[11px] font-mono font-bold text-[#18280e] bg-[#ebf7d9] px-2 py-0.5 rounded-md border border-[#d8e5ca] transition-all duration-200">
            {activeDay.formatted}
          </span>
        </div>
        <span className="text-stone-400 select-none">•••</span>
      </div>

      {/* Animated Bars */}
      <div className="flex items-end justify-between h-36 pt-6 pb-1">
        {DAYS.map((d, index) => {
          const isActive = index === activeDayIndex;
          const barHeight = isLoaded ? `${d.heightPercent}%` : "8%";

          return (
            <div
              key={d.short}
              onMouseEnter={() => setActiveDayIndex(index)}
              className="flex flex-col items-center gap-2 flex-1 cursor-pointer group relative"
            >
              {/* Floating Pill Badge when Active or Hovered */}
              {isActive && (
                <div className="absolute -top-7 z-20 transition-all duration-200 animate-in fade-in zoom-in-95">
                  <span className="text-[10px] font-mono font-bold text-[#18280e] bg-[#ebf7d9] px-2 py-0.5 rounded shadow-2xs border border-[#d8e5ca] whitespace-nowrap">
                    {d.formatted}
                  </span>
                </div>
              )}

              {/* Bar Column with Smooth Kokonut Pill Curvature */}
              <div className="w-5 h-28 flex items-end justify-center">
                <div
                  className={`w-full rounded-t-full transition-all duration-500 ease-out ${
                    isActive
                      ? "bg-[#18280e] shadow-xs"
                      : "bg-[#f2f4ee] group-hover:bg-[#dce7cb]"
                  }`}
                  style={{ height: barHeight }}
                />
              </div>

              {/* Day Label */}
              <span
                className={`text-[10px] font-mono transition-colors ${
                  isActive
                    ? "font-bold text-[#18280e]"
                    : "text-stone-400 group-hover:text-stone-700"
                }`}
              >
                {d.short}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
