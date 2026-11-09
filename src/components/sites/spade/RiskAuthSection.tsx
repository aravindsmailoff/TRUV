"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Magnet } from "@/components/reactbits/Magnet";
import { DecryptedText } from "@/components/reactbits/DecryptedText";

export function RiskAuthSection() {
  const [isCardHovered, setIsCardHovered] = useState(false);

  return (
    <section id="risk-auth" className="relative overflow-hidden bg-white text-black pt-16 md:pt-24 lg:pt-32 pb-12">
      <div className="max-w-[80rem] mx-auto px-5 lg:px-8">
        <div className="flex flex-col-reverse justify-between gap-10 md:gap-8 lg:gap-12 items-end md:flex-row">
          {/* Left Text Column */}
          <div className="w-full shrink-0 md:w-1/2 md:max-w-md">
            <div className="flex w-full flex-col items-start text-left">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-x-3 sm:gap-x-4 mb-3.5">
                <div className="size-7 shrink-0">
                  <Image
                    src="/sites/spade/padlock-icon.svg"
                    alt="Padlock Icon"
                    width={30}
                    height={30}
                    className="size-full"
                  />
                </div>
                <span className="opacity-80 text-xs font-mono font-semibold uppercase tracking-wider text-[#18280E]">
                  Risk &amp; Authorization
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] text-[#18280E] font-medium leading-[1.15] tracking-tight">
                Make every authorization smarter
              </h2>

              {/* Description */}
              <div className="mt-3.5 opacity-80 text-stone-700 text-sm sm:text-base leading-relaxed">
                <p>
                  Return enriched merchant and location data in under 40 milliseconds — helping teams make faster, more accurate authorization decisions.
                </p>
              </div>

              {/* Learn More Button */}
              <div className="flex items-center gap-x-5 mt-6 sm:mt-8">
                <Magnet padding={25} magnetStrength={3}>
                  <Link href="/use-case/risk-authorization" className="inline-block">
                    <div className="group relative inline-flex appearance-none items-center py-2.5 px-5 select-none transition-all justify-center text-black rounded-md border border-black/15 bg-white hover:bg-[#b2eb76] hover:border-[#b2eb76] cursor-pointer shadow-xs active:scale-95">
                      <span className="text-sm font-medium relative z-10">Learn more</span>
                    </div>
                  </Link>
                </Magnet>
              </div>

              {/* Chamfered Stat Badge (<40ms) */}
              <div
                className="relative bg-[#ebf7d9] inline-flex items-center gap-x-4 p-3.5 pl-4 max-lg:w-full mt-10 sm:mt-14 md:max-w-[22.625rem] border border-stone-200/60 shadow-xs cursor-default group"
                style={{ "--corner-size-desktop": "13px", "--corner-size-mobile": "9px" } as React.CSSProperties}
              >
                {/* Chamfered Cut Corners */}
                <div className="pointer-events-none absolute inset-0 z-10">
                  <div
                    className="cut-corner absolute bg-white"
                    style={{ top: "-1px", left: "-1px", clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
                  />
                  <div
                    className="cut-corner absolute bg-white"
                    style={{ top: "-1px", right: "-1px", clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
                  />
                  <div
                    className="cut-corner absolute bg-white"
                    style={{ bottom: "-1px", left: "-1px", clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
                  />
                  <div
                    className="cut-corner absolute bg-white"
                    style={{ bottom: "-1px", right: "-1px", clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
                  />
                </div>

                <div className="text-2xl font-mono font-bold text-[#18280e] shrink-0 tracking-tight">
                  <DecryptedText text="<40ms" animateOn="hover" speed={40} />
                </div>
                <p className="text-xs text-stone-600 font-mono uppercase tracking-wider leading-tight">
                  <DecryptedText text="P99 ENRICHMENT LATENCY" animateOn="hover" speed={30} />
                </p>
              </div>
            </div>
          </div>

          {/* Right Visual Column: Lifestyle photo with animated HUD & blocked alert */}
          <div
            className="relative w-full flex-1 md:max-w-[47.5rem] rounded-xl overflow-hidden border border-stone-200 shadow-sm"
            style={{ "--corner-size-desktop": "17px", "--corner-size-mobile": "13px" } as React.CSSProperties}
          >
            {/* Cut Corners */}
            <div className="pointer-events-none absolute inset-0 z-20">
              <div
                className="cut-corner absolute bg-white"
                style={{ top: "-1px", left: "-1px", clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
              />
              <div
                className="cut-corner absolute bg-white"
                style={{ top: "-1px", right: "-1px", clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
              />
              <div
                className="cut-corner absolute bg-white"
                style={{ bottom: "-1px", left: "-1px", clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
              />
              <div
                className="cut-corner absolute bg-white"
                style={{ bottom: "-1px", right: "-1px", clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
              />
            </div>

            <div className="relative w-full" style={{ aspectRatio: "760/509" }}>
              {/* Base Lifestyle Photo */}
              <Image
                src="/sites/spade/Risk-Auth-Lifestyle.jpg"
                alt="Risk & Authorization"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Animated HUD Elements matching media_1794068020111_3bd04d7a.jpg */}
              {/* Top Reticle: SPEND CONTROLS */}
              <div className="absolute top-[28%] sm:top-[26%] left-[10%] sm:left-[12%] z-10 text-white font-mono text-[10px] sm:text-[11px] leading-tight select-none">
                <div className="relative p-2.5 sm:p-3 border border-white/20 bg-black/35 backdrop-blur-xs rounded-xs">
                  {/* Bracket Reticles */}
                  <span className="absolute -top-1 -left-1 text-white font-bold text-xs">┌</span>
                  <span className="absolute -top-1 -right-1 text-white font-bold text-xs">┐</span>
                  <span className="absolute -bottom-1 -left-1 text-white font-bold text-xs">└</span>
                  <span className="absolute -bottom-1 -right-1 text-white font-bold text-xs">┘</span>

                  <div className="flex items-center gap-1.5 text-white/90 font-medium">
                    <span className="text-[#b2eb76] text-xs">►</span>
                    <span>SPEND CONTROLS</span>
                  </div>
                  <div className="mt-1 space-y-0.5 text-white/80">
                    <div>ALLOWED CATEGORIES:</div>
                    <div>MARKETING, TRAVEL,</div>
                    <div>SOFTWARE</div>
                  </div>
                </div>
              </div>

              {/* Bottom Reticle: ALLOWED MERCHANTS */}
              <div className="absolute bottom-[16%] sm:bottom-[18%] left-[20%] sm:left-[24%] z-10 text-white font-mono text-[10px] sm:text-[11px] leading-tight select-none">
                <div className="relative p-2.5 sm:p-3 border border-white/20 bg-black/35 backdrop-blur-xs rounded-xs">
                  {/* Bracket Reticles */}
                  <span className="absolute -top-1 -left-1 text-white font-bold text-xs">┌</span>
                  <span className="absolute -top-1 -right-1 text-white font-bold text-xs">┐</span>
                  <span className="absolute -bottom-1 -left-1 text-white font-bold text-xs">└</span>
                  <span className="absolute -bottom-1 -right-1 text-white font-bold text-xs">┘</span>

                  <div className="flex items-center gap-1.5 text-white/90 font-medium">
                    <span className="text-[#b2eb76] text-xs">►</span>
                    <span>ALLOWED MERCHANTS</span>
                  </div>
                  <div className="mt-1 text-white/80">
                    <div>RETOOL, AMAZON WEB</div>
                    <div>SERVICES, OPEN AI</div>
                  </div>
                </div>
              </div>

              {/* The Yellow Chamfered Alert Card (Transaction blocked) */}
              <Link
                href="/use-case/risk-authorization"
                onMouseEnter={() => setIsCardHovered(true)}
                onMouseLeave={() => setIsCardHovered(false)}
                className={`absolute top-[20%] sm:top-[22%] right-[6%] sm:right-[8%] z-10 w-[195px] sm:w-[245px] p-4 sm:p-5 rounded-lg bg-[#ede65c] text-[#18280e] border border-[#a8a12c] shadow-2xl transition-all duration-300 cursor-pointer ${
                  isCardHovered ? "scale-105 shadow-[0_20px_35px_rgba(0,0,0,0.35)]" : "animate-[bounce_6s_ease-in-out_infinite]"
                }`}
                style={{ "--corner-size-desktop": "11px", "--corner-size-mobile": "8px" } as React.CSSProperties}
              >
                {/* Chamfered Cut Corners for Yellow Card */}
                <div className="pointer-events-none absolute inset-0 z-20">
                  <div
                    className="cut-corner absolute bg-black/30"
                    style={{ top: "-1px", left: "-1px", clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
                  />
                  <div
                    className="cut-corner absolute bg-black/30"
                    style={{ top: "-1px", right: "-1px", clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
                  />
                  <div
                    className="cut-corner absolute bg-black/30"
                    style={{ bottom: "-1px", left: "-1px", clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
                  />
                  <div
                    className="cut-corner absolute bg-black/30"
                    style={{ bottom: "-1px", right: "-1px", clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
                  />
                </div>

                {/* Card Warning Icon & Title */}
                <div className="flex flex-col items-center text-center">
                  <div className="size-5 mb-1.5 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 text-[#18280e]">
                      <path d="M12 2L1 21h22L12 2zm0 3.5L20.2 19H3.8L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" />
                    </svg>
                  </div>

                  <h4 className="text-xs sm:text-sm font-semibold tracking-tight leading-snug">
                    Transaction blocked
                  </h4>
                  <p className="text-[10px] sm:text-[11px] opacity-80 mt-0.5 leading-tight">
                    Merchant not approved
                  </p>
                </div>

                {/* Card Bottom Strip */}
                <div className="mt-4 pt-2.5 border-t border-black/15 flex items-end justify-between font-mono text-[10px] sm:text-[11px]">
                  <div>
                    <div className="font-sans font-medium text-xs">Chevron</div>
                    <div className="text-[9px] opacity-75 mt-0.5">2025-09-27 11:49:11</div>
                  </div>
                  <div className="font-bold text-xs sm:text-sm tracking-tight">
                    -$13.38
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
