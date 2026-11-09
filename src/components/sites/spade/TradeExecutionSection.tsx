"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Globe, ShieldCheck } from "lucide-react";
import { Magnet } from "@/components/reactbits/Magnet";
import { DecryptedText } from "@/components/reactbits/DecryptedText";

export function TradeExecutionSection() {
  return (
    <section id="trade-execution" className="relative overflow-hidden bg-white text-black pt-16 md:pt-24 lg:pt-32 pb-20">
      <div className="max-w-[80rem] mx-auto px-5 lg:px-8">
        {/* ========================================================================= */}
        {/* THE SIGNATURE 2-COLUMN SHOWCASE (Matching Image 2 Reference)              */}
        {/* ========================================================================= */}
        <div className="flex flex-col-reverse justify-between gap-10 md:gap-8 lg:gap-12 items-end md:flex-row">
          {/* Left Text Column */}
          <div className="w-full shrink-0 md:w-1/2 md:max-w-md">
            <div className="flex w-full flex-col items-start text-left">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-x-3 sm:gap-x-4 mb-3.5">
                <div className="size-7 shrink-0 text-[#18280e]">
                  <Globe className="w-6 h-6 text-[#18280e]" />
                </div>
                <span className="opacity-80 text-xs font-mono font-semibold uppercase tracking-wider text-[#18280E]">
                  International Trade Infrastructure
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] text-[#18280E] font-medium leading-[1.15] tracking-tight">
                Connecting global buyers with Indian industrial manufacturers
              </h2>

              {/* Description */}
              <div className="mt-3.5 opacity-80 text-stone-700 text-sm sm:text-base leading-relaxed">
                <p>
                  We operate end-to-end international trade execution: from buyer demand discovery and MSME manufacturer
                  qualification, to commercial purchase orders, PayPal milestone invoicing, QIMA inspections, and freight
                  forwarding to international ports.
                </p>
              </div>

              {/* Action Buttons: Sign Up for Whitelist & Sign In */}
              <div className="flex flex-wrap items-center gap-4 mt-6 sm:mt-8">
                <Magnet padding={25} magnetStrength={3}>
                  <Link href="/signup" className="inline-block">
                    <div className="group relative inline-flex appearance-none items-center py-2.5 px-5 select-none transition-all justify-center text-white bg-[#18280e] rounded-md hover:bg-[#18280e]/90 cursor-pointer shadow-xs active:scale-95">
                      <span className="text-sm font-semibold text-[#b2eb76] relative z-10">Request Whitelisted Access</span>
                    </div>
                  </Link>
                </Magnet>

                <Magnet padding={20} magnetStrength={2}>
                  <Link href="/signin" className="inline-block">
                    <div className="group relative inline-flex appearance-none items-center py-2.5 px-5 select-none transition-all justify-center text-black rounded-md border border-black/15 bg-white hover:bg-[#b2eb76] hover:border-[#b2eb76] cursor-pointer shadow-xs active:scale-95">
                      <span className="text-sm font-medium relative z-10">Sign In</span>
                    </div>
                  </Link>
                </Magnet>

                <Magnet padding={20} magnetStrength={2}>
                  <Link href="/admin" className="inline-block">
                    <div className="group relative inline-flex appearance-none items-center py-2.5 px-4 select-none transition-all justify-center text-stone-600 rounded-md border border-stone-200 bg-[#f4faed] hover:bg-[#ebf7d9] cursor-pointer shadow-xs active:scale-95 text-xs font-mono">
                      <span>Admin Whitelist Desk</span>
                    </div>
                  </Link>
                </Magnet>
              </div>

              {/* Chamfered Stat Badge (<40ms / 100%) */}
              <div
                className="relative bg-[#ebf7d9] inline-flex items-center gap-x-4 p-3.5 pl-4 max-lg:w-full mt-10 sm:mt-14 md:max-w-[22.625rem] border border-stone-200/60 shadow-xs cursor-default group"
                style={{ "--corner-size-desktop": "13px", "--corner-size-mobile": "9px" } as React.CSSProperties}
              >
                {/* Chamfered Cut Corners */}
                <div className="pointer-events-none absolute inset-0 z-10">
                  <div className="cut-corner absolute bg-white" style={{ top: "-1px", left: "-1px", clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
                  <div className="cut-corner absolute bg-white" style={{ top: "-1px", right: "-1px", clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
                  <div className="cut-corner absolute bg-white" style={{ bottom: "-1px", left: "-1px", clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />
                  <div className="cut-corner absolute bg-white" style={{ bottom: "-1px", right: "-1px", clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }} />
                </div>

                <div className="text-2xl font-mono font-bold text-[#18280e] shrink-0 tracking-tight">
                  <DecryptedText text="100%" animateOn="hover" speed={40} />
                </div>
                <p className="text-xs text-stone-600 font-mono uppercase tracking-wider leading-tight">
                  <DecryptedText text="DGFT IEC & GSTIN VERIFIED EVIDENCE" animateOn="hover" speed={30} />
                </p>
              </div>
            </div>
          </div>

          {/* Right Visual Column (Matching Image 2: Lifestyle with Reticles & Alert Card) */}
          <div
            className="relative w-full flex-1 md:max-w-[47.5rem] rounded-xl overflow-hidden border border-stone-200 shadow-sm"
            style={{ "--corner-size-desktop": "17px", "--corner-size-mobile": "13px" } as React.CSSProperties}
          >
            {/* Cut Corners */}
            <div className="pointer-events-none absolute inset-0 z-20">
              <div className="cut-corner absolute bg-white" style={{ top: "-1px", left: "-1px", clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
              <div className="cut-corner absolute bg-white" style={{ top: "-1px", right: "-1px", clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
              <div className="cut-corner absolute bg-white" style={{ bottom: "-1px", left: "-1px", clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />
              <div className="cut-corner absolute bg-white" style={{ bottom: "-1px", right: "-1px", clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }} />
            </div>

            <div className="relative w-full" style={{ aspectRatio: "760/509" }}>
              {/* Background Lifestyle Image */}
              <Image
                src="/sites/spade/Relay-Placeholder-Thumbnail.jpg"
                alt="Global Trade Operations"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/35" />

              {/* RETICLE 1: SOURCING HUBS (Top Left Reticle matching Image 2) */}
              <div className="absolute top-[18%] sm:top-[20%] left-[8%] sm:left-[10%] z-10 text-white font-mono text-[10px] sm:text-[11px] leading-tight select-none">
                <div className="relative p-2.5 sm:p-3 border border-white/20 bg-black/45 backdrop-blur-xs rounded-xs">
                  <span className="absolute -top-1 -left-1 text-white font-bold text-xs">┌</span>
                  <span className="absolute -top-1 -right-1 text-white font-bold text-xs">┐</span>
                  <span className="absolute -bottom-1 -left-1 text-white font-bold text-xs">└</span>
                  <span className="absolute -bottom-1 -right-1 text-white font-bold text-xs">┘</span>

                  <div className="flex items-center gap-1.5 text-white/90 font-medium">
                    <span className="text-[#b2eb76] text-xs">►</span>
                    <span className="tracking-wider uppercase">Sourcing Hubs</span>
                  </div>
                  <div className="mt-1 text-stone-300 text-[9px] sm:text-[10px] uppercase font-mono tracking-wide">
                    MORADABAD (BRASS) • TIRUPUR (KNITS)<br />
                    RAJKOT (PRECISION FORGINGS)
                  </div>
                </div>
              </div>

              {/* RETICLE 2: STATUTORY EVIDENCE (Bottom Left Reticle matching Image 2) */}
              <div className="absolute bottom-[14%] sm:bottom-[16%] left-[8%] sm:left-[10%] z-10 text-white font-mono text-[10px] sm:text-[11px] leading-tight select-none">
                <div className="relative p-2.5 sm:p-3 border border-white/20 bg-black/45 backdrop-blur-xs rounded-xs">
                  <span className="absolute -top-1 -left-1 text-white font-bold text-xs">┌</span>
                  <span className="absolute -top-1 -right-1 text-white font-bold text-xs">┐</span>
                  <span className="absolute -bottom-1 -left-1 text-white font-bold text-xs">└</span>
                  <span className="absolute -bottom-1 -right-1 text-white font-bold text-xs">┘</span>

                  <div className="flex items-center gap-1.5 text-white/90 font-medium">
                    <span className="text-[#b2eb76] text-xs">►</span>
                    <span className="tracking-wider uppercase">Verified Standing</span>
                  </div>
                  <div className="mt-1 text-stone-300 text-[9px] sm:text-[10px] font-mono tracking-wide">
                    DGFT IEC: 0508012491 | GSTIN: 09AAHFM<br />
                    INSPECTION: QIMA AQL 1.5 AUDITED
                  </div>
                </div>
              </div>

              {/* FLOATING CHAMFERED TRANSACTION ALERT CARD (Matching Yellow Card in Image 2) */}
              <div className="absolute top-[22%] sm:top-[26%] right-[6%] sm:right-[10%] z-10 w-[18rem] sm:w-[21rem]">
                <div
                  className="relative bg-[#ebf7d9] text-[#18280e] p-4 sm:p-5 shadow-2xl border border-[#3f7308]/30 font-mono transition-transform hover:scale-[1.02]"
                  style={{ "--corner-size-desktop": "14px", "--corner-size-mobile": "10px" } as React.CSSProperties}
                >
                  <div className="pointer-events-none absolute inset-0 z-10">
                    <div className="cut-corner absolute bg-black/40" style={{ top: "-1px", left: "-1px", clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
                    <div className="cut-corner absolute bg-black/40" style={{ top: "-1px", right: "-1px", clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
                    <div className="cut-corner absolute bg-black/40" style={{ bottom: "-1px", left: "-1px", clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />
                    <div className="cut-corner absolute bg-black/40" style={{ bottom: "-1px", right: "-1px", clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }} />
                  </div>

                  <div className="flex flex-col items-center text-center pb-3 border-b border-[#3f7308]/20">
                    <ShieldCheck className="w-6 h-6 text-[#3f7308] mb-1.5" />
                    <span className="text-xs font-bold tracking-tight uppercase">
                      PayPal Milestone Escrow Active
                    </span>
                    <span className="text-[10px] text-stone-600 mt-0.5">
                      30% Advance Released to Manufacturer
                    </span>
                  </div>

                  <div className="pt-3 flex justify-between items-baseline">
                    <div className="text-left">
                      <span className="text-xs font-bold text-stone-900 block truncate max-w-[140px]">
                        Pacific Arch Hardware
                      </span>
                      <span className="text-[10px] text-stone-500">
                        2026-11-10 09:23:16
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-[#18280e]">
                        -$42,750.00
                      </span>
                      <span className="text-[9px] text-[#3f7308] font-bold block">
                        PayPal Orders v2
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#3f7308]/20 text-[10px] text-stone-700 flex justify-between items-center">
                    <span>FOB Mundra Port</span>
                    <span className="text-[#3f7308] font-semibold">QIMA AQL 1.5 Passed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
