"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Magnet } from "@/components/reactbits/Magnet";

interface RewardItem {
  id: string;
  name: string;
  logoBg: string;
  logoContent: React.ReactNode;
  date: string;
  amount: string;
  points: number;
  criteriaDescription: string;
}

const REWARDS: RewardItem[] = [
  {
    id: "cava",
    name: "CAVA",
    logoBg: "bg-[#e5a01d]",
    logoContent: <span className="font-extrabold text-white text-[11px] tracking-tight">CAVA</span>,
    date: "2025-09-27 09:23:16",
    amount: "-$14.53",
    points: 140,
    criteriaDescription: "Reward customers who spend on Mediterranean bowls",
  },
  {
    id: "sweetgreen",
    name: "Sweetgreen",
    logoBg: "bg-[#093d25]",
    logoContent: <span className="font-bold text-white text-[13px] tracking-tighter lowercase">sg</span>,
    date: "2025-09-27 09:23:16",
    amount: "-$18.45",
    points: 180,
    criteriaDescription: "Reward customers who spend on healthy food",
  },
  {
    id: "urban-plates",
    name: "Urban Plates",
    logoBg: "bg-[#256c38]",
    logoContent: (
      <span className="font-bold text-white text-[8px] uppercase tracking-tighter text-center leading-none">
        Urban<br />Plates
      </span>
    ),
    date: "2025-09-27 11:49:11",
    amount: "-$13.38",
    points: 130,
    criteriaDescription: "Reward customers who spend on scratch-cooked plates",
  },
];

export function RewardsSection() {
  const [activeIdx, setActiveIdx] = useState<number>(1); // Default to Sweetgreen (active in screenshot)
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Auto-cycle through rewards every 3.5 seconds when not manually hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % REWARDS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isHovered]);

  const activeReward = REWARDS[activeIdx];

  return (
    <section id="rewards" className="relative overflow-hidden bg-white text-black pt-20 md:pt-28 lg:pt-36 pb-20">
      <div className="max-w-[80rem] mx-auto px-5 lg:px-8">
        {/* Centered Eyebrow & Header */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-x-2.5 sm:gap-x-3 mb-3.5">
            <div className="size-6.5 sm:size-7.5 shrink-0">
              <Image
                src="/sites/spade/heart-icon.svg"
                alt="Heart Icon"
                width={30}
                height={30}
                className="size-full"
              />
            </div>
            <span className="opacity-80 text-xs font-mono font-semibold uppercase tracking-wider text-[#18280E]">
              Rewards &amp; Attribution
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-medium tracking-tight text-[#18280E] max-w-3xl leading-[1.15]">
            Connect every purchase to the right reward
          </h2>

          <div className="prose max-w-2xl opacity-80 text-stone-700 text-sm sm:text-base leading-relaxed mt-3.5 sm:mt-4">
            <p>
              Give marketing teams true merchant and location-level clarity, enabling targeted, meaningful programs without messy data or guesswork.
            </p>
          </div>

          <div className="flex items-center gap-x-5 mt-6 sm:mt-7">
            <Magnet padding={25} magnetStrength={3}>
              <Link href="/use-case/rewards-and-attribution" className="inline-block">
                <div className="group relative inline-flex appearance-none items-center py-2.5 px-5 select-none transition-all justify-center text-black rounded-md border border-black/15 bg-white hover:bg-[#b2eb76] hover:border-[#b2eb76] cursor-pointer shadow-xs active:scale-95">
                  <span className="text-sm font-medium relative z-10">Learn more</span>
                </div>
              </Link>
            </Magnet>
          </div>
        </div>

        {/* Dynamic Interactive Flow Diagram matching user screenshot */}
        <div
          className="mx-auto w-full max-w-[64rem] mt-12 sm:mt-16"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative w-full rounded-2xl border border-stone-200/60 bg-stone-50/40 p-6 sm:p-10 md:p-14 overflow-hidden">
            {/* Background Dashed Grid */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.08) 1px, transparent 1px),
                                  linear-gradient(to bottom, rgba(0, 0, 0, 0.08) 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />

            {/* Top Root: Reward Criteria Card */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className="relative bg-[#2e1d0c] text-white px-6 py-4 rounded-lg shadow-md border border-black/20 w-full max-w-xs transition-all duration-300"
                style={{ "--corner-size-desktop": "10px", "--corner-size-mobile": "8px" } as React.CSSProperties}
              >
                {/* Chamfered Cut Corners */}
                <div className="pointer-events-none absolute inset-0 z-10">
                  <div
                    className="cut-corner absolute bg-stone-50/40"
                    style={{ top: "-1px", left: "-1px", clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
                  />
                  <div
                    className="cut-corner absolute bg-stone-50/40"
                    style={{ top: "-1px", right: "-1px", clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
                  />
                  <div
                    className="cut-corner absolute bg-stone-50/40"
                    style={{ bottom: "-1px", left: "-1px", clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
                  />
                  <div
                    className="cut-corner absolute bg-stone-50/40"
                    style={{ bottom: "-1px", right: "-1px", clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold tracking-tight text-white">Reward Criteria</h4>
                    <p className="text-[11px] text-[#cca072] mt-0.5 leading-tight font-sans transition-all duration-300">
                      {activeReward.criteriaDescription}
                    </p>
                  </div>
                  <div className="size-5 shrink-0 text-[#cf8038] animate-pulse">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-full">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Connecting Tree Lines with Active Glow */}
              <div className="w-full max-w-3xl h-12 relative my-1 pointer-events-none">
                {/* Vertical trunk from Reward Criteria */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 h-6 w-0.5 bg-stone-300" />
                {/* Horizontal branch bar */}
                <div className="absolute top-6 left-[16.66%] right-[16.66%] h-0.5 bg-stone-300" />
                {/* 3 Vertical drops to cards */}
                <div
                  className={`absolute top-6 left-[16.66%] -translate-x-1/2 h-6 w-0.5 transition-colors duration-300 ${
                    activeIdx === 0 ? "bg-[#d49925] shadow-[0_0_8px_#d49925]" : "bg-stone-300"
                  }`}
                />
                <div
                  className={`absolute top-6 left-1/2 -translate-x-1/2 h-6 w-0.5 transition-colors duration-300 ${
                    activeIdx === 1 ? "bg-[#cda652] shadow-[0_0_8px_#cda652]" : "bg-stone-300"
                  }`}
                />
                <div
                  className={`absolute top-6 right-[16.66%] translate-x-1/2 h-6 w-0.5 transition-colors duration-300 ${
                    activeIdx === 2 ? "bg-[#256c38] shadow-[0_0_8px_#256c38]" : "bg-stone-300"
                  }`}
                />
              </div>

              {/* 3 Interactive Transaction Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 w-full">
                {REWARDS.map((item, idx) => {
                  const isActive = activeIdx === idx;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveIdx(idx)}
                      onMouseEnter={() => setActiveIdx(idx)}
                      className={`group cursor-pointer relative bg-white rounded-xl border transition-all duration-300 overflow-hidden shadow-xs hover:shadow-md ${
                        isActive
                          ? "border-[#cda652] ring-2 ring-[#cda652]/30 scale-[1.02]"
                          : "border-stone-200/90 hover:border-stone-400 opacity-90 hover:opacity-100"
                      }`}
                      style={{ "--corner-size-desktop": "12px", "--corner-size-mobile": "9px" } as React.CSSProperties}
                    >
                      {/* Top section: Merchant & Amount */}
                      <div className="p-4 sm:p-5 flex flex-col justify-between min-h-[96px]">
                        <div className="flex items-start justify-between">
                          <div className={`size-8 rounded-md flex items-center justify-center p-1 ${item.logoBg} shadow-xs`}>
                            {item.logoContent}
                          </div>
                          <div className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 font-mono">
                            {item.amount}
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="text-sm font-semibold text-stone-900">{item.name}</div>
                          <div className="text-[11px] font-mono text-stone-500">{item.date}</div>
                        </div>
                      </div>

                      {/* Bottom split: Rewards points strip */}
                      <div
                        className={`px-4 sm:px-5 py-2.5 border-t flex items-center justify-between text-xs transition-colors duration-300 ${
                          isActive
                            ? "bg-[#eedba2] border-[#deb96c] text-[#593d14] font-semibold"
                            : "bg-white border-stone-100 text-stone-600 group-hover:bg-stone-50"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5 text-[#b26922]">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                          <span className="font-medium">Rewards</span>
                        </div>
                        <span className="font-bold font-mono">+{item.points} pts</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
