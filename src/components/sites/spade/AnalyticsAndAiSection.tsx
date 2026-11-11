"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { UserExperienceRive } from "./UserExperienceRive";
import { AnalyticsAiRive } from "./AnalyticsAiRive";
import { Magnet } from "@/components/reactbits/Magnet";
import { DecryptedText } from "@/components/reactbits/DecryptedText";

export function AnalyticsAndAiSection() {
  return (
    <section className="relative overflow-hidden bg-white text-black pt-16 md:pt-24 lg:pt-32 pb-16">
      <div className="max-w-[80rem] mx-auto px-5 lg:px-8 space-y-24 md:space-y-32 lg:space-y-40">
        {/* ========================================================= */}
        {/* PART 1: ANALYTICS & AI (Large Dark Chamfered Container)   */}
        {/* ========================================================= */}
        <div
          className="relative w-full rounded-2xl overflow-hidden bg-[#18280E] text-white p-6 sm:p-10 md:p-12 lg:p-16 border border-black/10 shadow-xl"
          style={{ "--corner-size-desktop": "17px", "--corner-size-mobile": "13px" } as React.CSSProperties}
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

          {/* Background Topographic Contour Lines */}
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <Image
              src="/sites/spade/analytics-and-AI-feature-BG.svg"
              alt="Contour background"
              fill
              className="object-cover"
            />
          </div>

          <div className="relative z-1 flex flex-col lg:flex-row justify-between gap-10 lg:gap-14 items-center">
            {/* Left Content Column */}
            <div className="w-full lg:w-5/12 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-x-3 mb-4">
                <div className="size-6.5 sm:size-7.5 shrink-0">
                  <Image
                    src="/sites/spade/analytics-icon.svg"
                    alt="Analytics Icon"
                    width={30}
                    height={30}
                    className="size-full"
                  />
                </div>
                <span className="opacity-90 text-xs font-mono font-semibold uppercase tracking-wider text-[#b2eb76]">
                  Trade Intelligence
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-medium leading-[1.15] tracking-tight text-white">
                Make informed sourcing decisions
              </h2>

              <p className="mt-4 opacity-80 text-white/90 text-sm sm:text-base leading-relaxed max-w-md">
                Bring buyer requirements, supplier details and quotations together to help teams evaluate opportunities and move trade forward.
              </p>

              <div className="mt-7 sm:mt-8">
                <Magnet padding={25} magnetStrength={3}>
                  <Link href="/solutions/buyer" className="inline-block">
                    <div className="group relative inline-flex appearance-none items-center py-2.5 px-5 select-none transition-all justify-center text-white hover:text-black rounded-md border border-white/20 bg-transparent hover:bg-white hover:border-white cursor-pointer shadow-xs active:scale-95">
                      <span className="text-sm font-medium relative z-10">Learn more</span>
                    </div>
                  </Link>
                </Magnet>
              </div>
            </div>

            {/* Right Visual: Official Spade Analytics & AI Rive Animation */}
            <div className="flex items-center justify-center md:flex-1 md:self-center md:px-4 lg:px-6 w-full">
              <div className="relative flex w-full max-w-[39rem]" style={{ aspectRatio: "612/492" }}>
                <div className="absolute inset-0 size-full">
                  <AnalyticsAiRive />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PART 2: USER EXPERIENCE (Keep every trade moving)   */}
        {/* ========================================================= */}
        <div className="flex flex-col-reverse justify-between gap-10 md:gap-8 lg:gap-14 items-center md:flex-row-reverse">
          {/* Right Text Column */}
          <div className="w-full shrink-0 md:w-1/2 md:max-w-md">
            <div className="flex w-full flex-col items-start text-left">
              <div className="inline-flex items-center gap-x-3 sm:gap-x-4 mb-3.5">
                <div className="size-6.5 sm:size-7.5 shrink-0">
                  <Image
                    src="/sites/spade/user-icon.svg"
                    alt="User Icon"
                    width={30}
                    height={30}
                    className="size-full"
                  />
                </div>
                <span className="opacity-80 text-xs font-mono font-semibold uppercase tracking-wider text-[#18280E]">
                  Trade Workspace
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[44px] text-[#18280E] font-medium leading-[1.15] tracking-tight">
                Keep every trade moving
              </h2>

              <div className="mt-3.5 opacity-80 text-stone-700 text-sm sm:text-base leading-relaxed">
                <p>
                  Give buyers and manufacturers a clearer view of orders, payment milestones, inspections and shipping progress.
                </p>
              </div>

              <div className="flex items-center gap-x-5 mt-6 sm:mt-8">
                <Magnet padding={25} magnetStrength={3}>
                  <Link href="/solutions/manufacturer" className="inline-block">
                    <div className="group relative inline-flex appearance-none items-center py-2.5 px-5 select-none transition-all justify-center text-black rounded-md border border-black/15 bg-white hover:bg-[#b2eb76] hover:border-[#b2eb76] cursor-pointer shadow-xs active:scale-95">
                      <span className="text-sm font-medium relative z-10">Learn more</span>
                    </div>
                  </Link>
                </Magnet>
              </div>

              {/* Chamfered Stat Badge (95%) */}
              <div
                className="relative bg-[#ebf7d9] inline-flex items-center gap-x-4 p-3.5 pl-4 max-lg:w-full mt-10 sm:mt-14 md:max-w-[24rem] border border-stone-200/60 shadow-xs cursor-default group"
                style={{ "--corner-size-desktop": "13px", "--corner-size-mobile": "9px" } as React.CSSProperties}
              >
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
                  <DecryptedText text="01" animateOn="hover" speed={40} />
                </div>
                <p className="text-xs text-stone-600 font-mono uppercase tracking-wider leading-tight">
                  <DecryptedText text="WORKSPACE FOR EVERY STEP OF THE TRADE JOURNEY" animateOn="hover" speed={30} />
                </p>
              </div>
            </div>
          </div>

          {/* Left Visual: Official Spade Trade Workspace Rive Animation */}
          <div
            className="relative w-full flex-1 md:max-w-[47.5rem] overflow-hidden rounded-2xl border border-stone-200/80 shadow-md bg-[#18280E]"
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

            <div className="relative flex w-full" style={{ aspectRatio: "790/509" }}>
              <div className="absolute inset-0 size-full">
                <UserExperienceRive />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
