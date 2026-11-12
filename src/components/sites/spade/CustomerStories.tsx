"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { Magnet } from "@/components/reactbits/Magnet";

export function CustomerStories() {
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const stories = [
    { company: "Buyers", bgClass: "bg-[#71552a] text-white", quote: "Start with your product requirements, compare manufacturer capabilities and follow your sourcing journey in one place.", author: "TRUVX", role: "Buyer workflow", stats: [{ value: "01", label: "Share your requirements and specifications" }, { value: "02", label: "Review suppliers and quotations" }], href: "/solutions/buyer" },
    { company: "Manufacturers", bgClass: "bg-[#18280E] text-white", quote: "Showcase your manufacturing capabilities and manage opportunities from international buyers through a single workspace.", author: "TRUVX", role: "Manufacturer workflow", stats: [{ value: "01", label: "Present your products and capabilities" }, { value: "02", label: "Follow orders and trade milestones" }], href: "/solutions/manufacturer" },
  ];

  const current = stories[activeSlide];

  return (
    <section id="customers" className="relative overflow-hidden bg-[#eef4e8] text-black pt-14 md:pt-20 lg:pt-32 pb-14 md:pb-20 lg:pb-32">
      <div className="max-w-[80rem] mx-auto px-5 lg:px-8">
        {/* Header */}
        <div className="w-full max-w-[28rem]">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-medium tracking-tight text-[#18280E] leading-tight">
            One platform, different perspectives
          </h2>
          <div className="mt-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-[#18280E] hover:opacity-75 transition-opacity"
            >
              <span>Get started</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 22 16" fill="none">
                <path d="M2.0326 15.6442L5.93597e-07 13.5799L9.02336e-08 2.0643L2.0326 -8.88478e-08L21.48 7.27606L21.48 8.36816L2.0326 15.6442Z" fill="currentColor" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Story Slide with Tabs */}
        <div className="mt-12 sm:mt-14 md:mt-20 flex items-start gap-x-8">
          {/* Stepper Navigation */}
          <nav aria-label="Trade workflows" className="w-[3rem] shrink-0 max-md:hidden flex flex-col gap-3 pt-2">
            {stories.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className="group relative block cursor-pointer py-1.5 transition-all"
              >
                <span
                  className={`block h-[3px] rounded-full transition-all ${
                    activeSlide === idx
                      ? "w-full bg-[#18280E]"
                      : "w-2/3 bg-black/15 group-hover:bg-black/30"
                  }`}
                />
              </button>
            ))}
          </nav>

          {/* Slide Content */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Main Quote Card with React Bits SpotlightCard */}
              <SpotlightCard
                spotlightColor="rgba(255, 255, 255, 0.12)"
                className={`flex flex-col justify-between p-6 sm:p-8 lg:p-10 rounded-xl flex-1 shadow-md transition-all duration-300 ${current.bgClass}`}
                style={{ "--corner-size-desktop": "13px", "--corner-size-mobile": "9px" } as React.CSSProperties}
              >
                {/* Chamfered Cut Corners */}
                <div className="pointer-events-none absolute inset-0 z-10">
                  <div
                    className="cut-corner absolute bg-[#eef4e8]"
                    style={{ top: "-1px", left: "-1px", clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
                  />
                  <div
                    className="cut-corner absolute bg-[#eef4e8]"
                    style={{ top: "-1px", right: "-1px", clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
                  />
                  <div
                    className="cut-corner absolute bg-[#eef4e8]"
                    style={{ bottom: "-1px", left: "-1px", clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
                  />
                  <div
                    className="cut-corner absolute bg-[#eef4e8]"
                    style={{ bottom: "-1px", right: "-1px", clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
                  />
                </div>

                <blockquote className="w-full max-w-xl relative z-10">
                  <p className="text-xl sm:text-2xl lg:text-[26px] font-normal leading-snug tracking-tight">
                    {current.quote}
                  </p>
                  <cite className="mt-4 block not-italic font-mono text-xs uppercase tracking-wider text-white/80">
                    <span>{current.author}, </span>
                    <span className="text-[#ebe46a]">{current.role}</span>
                  </cite>
                </blockquote>

                {/* Footer Logo & Case Study Link */}
                <div className="mt-8 flex items-center justify-between border-t border-white/15 pt-6 relative z-10">
                  <div className="text-lg font-bold tracking-tight">{current.company}</div>
                  <Magnet padding={15} magnetStrength={3}>
                    <Link
                      href={current.href}
                      className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-white/80 hover:text-white transition-colors"
                    >
                      <span>Learn more</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 22 16" fill="none">
                        <path d="M2.0326 15.6442L5.93597e-07 13.5799L9.02336e-08 2.0643L2.0326 -8.88478e-08L21.48 7.27606L21.48 8.36816L2.0326 15.6442Z" fill="currentColor" />
                      </svg>
                    </Link>
                  </Magnet>
                </div>
              </SpotlightCard>

              {/* Side Metric Cards with React Bits SpotlightCard */}
              <div className="flex flex-col gap-4 lg:w-72 shrink-0">
                {current.stats.map((stat, sIdx) => (
                  <SpotlightCard
                    key={sIdx}
                    spotlightColor="rgba(178, 235, 118, 0.15)"
                    className="bg-[#18280E] text-white p-5 rounded-lg border border-black/10 flex-1 flex flex-col justify-center"
                    style={{ "--corner-size-desktop": "10px", "--corner-size-mobile": "8px" } as React.CSSProperties}
                  >
                    {/* Cut Corners */}
                    <div className="pointer-events-none absolute inset-0 z-10">
                      <div
                        className="cut-corner absolute bg-[#eef4e8]"
                        style={{ top: "-1px", left: "-1px", clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
                      />
                      <div
                        className="cut-corner absolute bg-[#eef4e8]"
                        style={{ top: "-1px", right: "-1px", clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
                      />
                      <div
                        className="cut-corner absolute bg-[#eef4e8]"
                        style={{ bottom: "-1px", left: "-1px", clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
                      />
                      <div
                        className="cut-corner absolute bg-[#eef4e8]"
                        style={{ bottom: "-1px", right: "-1px", clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
                      />
                    </div>

                    <div className="relative z-10">
                      <div className="text-3xl font-mono font-bold text-[#b2eb76] tracking-tight">
                        {stat.value}
                      </div>
                      <p className="mt-2 text-xs text-white/70 leading-relaxed font-mono">
                        {stat.label}
                      </p>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
