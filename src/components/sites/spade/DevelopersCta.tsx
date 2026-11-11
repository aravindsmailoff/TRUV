"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Magnet } from "@/components/reactbits/Magnet";
import { DecryptedText } from "@/components/reactbits/DecryptedText";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";

export function DevelopersCta() {
  return (
    <section className="relative overflow-hidden bg-white text-black pt-16 md:pt-24 lg:pt-32 pb-20 md:pb-28">
      <div className="max-w-[80rem] mx-auto px-5 lg:px-8">
        <div className="flex flex-col-reverse justify-between gap-10 md:gap-8 lg:gap-14 items-center md:flex-row">
          {/* Left Text Column */}
          <div className="w-full shrink-0 md:w-1/2 md:max-w-md">
            <div className="flex w-full flex-col items-start text-left">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-x-2.5 mb-3.5">
                <span className="opacity-80 text-xs font-mono font-semibold uppercase tracking-wider text-[#18280E] cursor-default">
                  <DecryptedText text="[Trade workspace]" animateOn="hover" speed={35} />
                </span>
              </div>

              {/* Heading / Description */}
              <p className="text-xl sm:text-2xl lg:text-[28px] font-normal leading-[1.3] tracking-tight text-[#18280E]">
                From the first request to the final shipment, bring your trade journey into one connected workspace.
              </p>

              {/* Explore docs button with Magnet */}
              <div className="flex items-center gap-x-5 mt-6 sm:mt-8">
                <Magnet padding={25} magnetStrength={3}>
                  <Link
                    href="/signup"
                    className="inline-block"
                  >
                    <div className="group relative inline-flex appearance-none items-center py-2.5 px-5 select-none transition-all justify-center text-black rounded-md border border-black/15 bg-white hover:bg-[#b2eb76] hover:border-[#b2eb76] cursor-pointer shadow-xs active:scale-95">
                      <span className="text-sm font-medium relative z-10 flex items-center gap-2">
                        <span>Explore TRUVX</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 22 16" fill="none" className="rotate-0 group-hover:translate-x-0.5 transition-transform">
                          <path d="M2.0326 15.6442L5.93597e-07 13.5799L9.02336e-08 2.0643L2.0326 -8.88478e-08L21.48 7.27606L21.48 8.36816L2.0326 15.6442Z" fill="currentColor" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </Magnet>
              </div>
            </div>
          </div>

          {/* Right Visual: Two-layer docs graphic with SpotlightCard */}
          <SpotlightCard
            spotlightColor="rgba(178, 235, 118, 0.12)"
            className="w-full flex-1 md:max-w-[47.5rem] rounded-xl border border-stone-200/80 shadow-sm bg-[#121c0b]"
            style={{ "--corner-size-desktop": "13px", "--corner-size-mobile": "9px" } as React.CSSProperties}
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

            <div className="relative w-full shrink-0" style={{ aspectRatio: "785/484" }}>
              {/* Layer 1 (SVG) */}
              <div className="relative size-full">
                <Image
                  src="/sites/spade/docs-layer-1.svg"
                  alt="Trade workspace illustration"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Layer 2 (PNG overlay) */}
              <div className="absolute inset-0 size-full pointer-events-none">
                <Image
                  src="/sites/spade/docs-layer-2.png"
                  alt="Trade workspace detail"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
