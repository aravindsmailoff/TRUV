"use client";

import React from "react";
import Link from "next/link";
import { MastheadRive } from "./MastheadRive";
import { Magnet } from "@/components/reactbits/Magnet";
import { BlurText } from "@/components/reactbits/BlurText";

export function Hero() {
  // Generate 42 ruler ticks for left and right margins
  const ticks = Array.from({ length: 42 });

  return (
    <section className="relative overflow-hidden bg-white text-black pt-0 pb-0 px-5 lg:px-8">
      {/* Left Ruler Ticks */}
      <div className="absolute top-2 bottom-0 flex w-4.5 flex-col space-y-7 overflow-y-clip left-0 max-lg:hidden" aria-hidden="true">
        {ticks.map((_, i) => (
          <div
            key={i}
            className={`h-px shrink-0 bg-black ${i % 5 === 0 ? "w-4.5" : "w-2.5"}`}
          />
        ))}
      </div>

      {/* Right Ruler Ticks */}
      <div className="absolute top-2 bottom-0 flex w-4.5 flex-col space-y-7 overflow-y-clip right-0 items-end max-lg:hidden" aria-hidden="true">
        {ticks.map((_, i) => (
          <div
            key={i}
            className={`h-px shrink-0 bg-black ${i % 5 === 0 ? "w-4.5" : "w-2.5"}`}
          />
        ))}
      </div>

      {/* Sticky Margin Indicator Arrows */}
      <div className="pointer-events-none sticky inset-x-0 top-[calc(50%-0.6875rem)] z-10 flex justify-between max-lg:hidden">
        <div className="w-5.5 text-black -ml-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="16" viewBox="0 0 22 16" fill="none">
            <path d="M2.0326 15.6442L0 13.5799L0 2.0643L2.0326 0L21.48 7.27606L21.48 8.36816L2.0326 15.6442Z" fill="currentColor" />
          </svg>
        </div>
        <div className="w-5.5 rotate-180 text-black -mr-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="16" viewBox="0 0 22 16" fill="none">
            <path d="M2.0326 15.6442L0 13.5799L0 2.0643L2.0326 0L21.48 7.27606L21.48 8.36816L2.0326 15.6442Z" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Main Hero Card Container with Chamfered Corners */}
      <div className="lg:-mt-[1.375rem]">
        <div
          className="relative bg-[#f0fae6] py-14 max-md:-mx-5 md:py-20 lg:pt-24 lg:pb-24 xl:pb-32"
          style={{ "--corner-size-desktop": "17px", "--corner-size-mobile": "13px" } as React.CSSProperties}
        >
          {/* Cut Corners */}
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

          <div className="mx-auto flex w-full max-w-[66.75rem] flex-col items-center px-5 text-center lg:px-12">
            {/* Title with React Bits BlurText */}
            <div className="text-84px-heading text-[#18280E] max-w-4xl tracking-tight leading-[1.05] justify-center text-center">
              <BlurText
                text="The data & AI platform for modern finance"
                delay={40}
                direction="bottom"
                className="justify-center text-center"
              />
            </div>

            {/* Central Animated Illustration (Aspect Ratio 900/435) */}
            <div
              className="relative flex pointer-events-none w-full max-w-[56.25rem] sm:-mt-2 lg:-mt-4"
              style={{ aspectRatio: "900/435", width: "100%", height: "auto" }}
            >
              <MastheadRive />
            </div>

            {/* Subheading / Prose */}
            <div className="prose w-full max-w-[27.75rem] opacity-80 text-[#18280E] text-center mx-auto text-sm sm:text-base leading-relaxed mt-4">
              <p>
                Spade takes messy transaction data and turns it into structured, verified records — with AI agents that help you use it everywhere it matters.
              </p>
            </div>

            {/* CTA Button with React Bits Magnet */}
            <div className="flex items-center justify-center gap-x-5 mt-6 sm:mt-7">
              <Magnet padding={35} magnetStrength={2.5}>
                <Link href="https://spade.com/contact/" target="_blank">
                  <div className="group relative inline-flex appearance-none items-center py-2.5 select-none transition-[color] justify-center text-[#b2eb76] bg-[#18280e] min-h-10.75 px-5 rounded-md hover:bg-[#18280e]/90 cursor-pointer shadow-sm">
                    <span className="text-15px-btn relative z-10 font-semibold">Contact sales</span>
                  </div>
                </Link>
              </Magnet>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
