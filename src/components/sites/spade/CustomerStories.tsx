"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { Magnet } from "@/components/reactbits/Magnet";

export function CustomerStories() {
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const stories = [
    {
      company: "Bilt Rewards",
      bgClass: "bg-[#71552a] text-white",
      logo: "/sites/spade/bilt-white.png",
      quote:
        "Spade's granular merchant data allows us to deliver new and innovative rewards on the more than $5 billion in neighborhood spend happening on our platform.",
      author: "Brandt Smallwood",
      role: "President",
      stats: [
        {
          value: "$5B+",
          label: "rewarded by Bilt using Spade for accurate, hyper-local attribution",
        },
        {
          value: "20,000+",
          label: "local businesses in Bilt's rewards network matched to transactions",
        },
      ],
      href: "/customers/bilt-enrichment-ai-agent/",
    },
    {
      company: "Coast",
      bgClass: "bg-[#18280E] text-white",
      logo: "/sites/spade/coast.png",
      quote:
        "We needed real-time controls that didn't create false declines. Spade's merchant and location data lets us approve legitimate fuel purchases while blocking misuse, and helps save our customers tens of thousands of dollars.",
      author: "Daniel Simon",
      role: "Co-founder & CEO",
      stats: [
        {
          value: "$100k+",
          label: "in average annual savings reported by Coast fleet customers",
        },
        {
          value: "<40ms",
          label: "speed at which Spade returns precise latitude and longitude",
        },
      ],
      href: "/customers/coast-fuel-card-spend-controls/",
    },
    {
      company: "Mercury",
      bgClass: "bg-[#1f2833] text-white",
      logo: "/sites/spade/mercury.svg",
      quote:
        "When we can correctly identify the type of spend that’s happening at a company, we can set up rules to automatically categorize those transactions. This alone can save hours for our customers each month.",
      author: "Anish Bhayani",
      role: "Engineering Manager",
      stats: [
        {
          value: ">99%",
          label: "enrichment accuracy results in verified categorization for 200,000+ customers",
        },
        {
          value: "1 in 3",
          label: "U.S. startups rely on transaction data enriched by Spade",
        },
      ],
      href: "/customers/mercury-transaction-enrichment/",
    },
  ];

  const current = stories[activeSlide];

  return (
    <section id="customers" className="relative overflow-hidden bg-[#eef4e8] text-black pt-14 md:pt-20 lg:pt-32 pb-14 md:pb-20 lg:pb-32">
      <div className="max-w-[80rem] mx-auto px-5 lg:px-8">
        {/* Header */}
        <div className="w-full max-w-[28rem]">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-medium tracking-tight text-[#18280E] leading-tight">
            Proven across payments and beyond
          </h2>
          <div className="mt-3">
            <Link
              href="/customers"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-[#18280E] hover:opacity-75 transition-opacity"
            >
              <span>See all case studies</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 22 16" fill="none">
                <path d="M2.0326 15.6442L5.93597e-07 13.5799L9.02336e-08 2.0643L2.0326 -8.88478e-08L21.48 7.27606L21.48 8.36816L2.0326 15.6442Z" fill="currentColor" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Story Slide with Tabs */}
        <div className="mt-12 sm:mt-14 md:mt-20 flex items-start gap-x-8">
          {/* Stepper Navigation */}
          <nav aria-label="Customer stories" className="w-[3rem] shrink-0 max-md:hidden flex flex-col gap-3 pt-2">
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
                    &ldquo;{current.quote}&rdquo;
                  </p>
                  <cite className="mt-4 block not-italic font-mono text-xs uppercase tracking-wider text-white/80">
                    <span>{current.author}, </span>
                    <span className="text-[#ebe46a]">{current.role}</span>
                  </cite>
                </blockquote>

                {/* Footer Logo & Case Study Link */}
                <div className="mt-8 flex items-center justify-between border-t border-white/15 pt-6 relative z-10">
                  <div className="h-7 relative w-24">
                    <Image
                      src={current.logo}
                      alt={current.company}
                      fill
                      className="object-contain object-left invert brightness-200"
                    />
                  </div>
                  <Magnet padding={15} magnetStrength={3}>
                    <Link
                      href={current.href}
                      className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-white/80 hover:text-white transition-colors"
                    >
                      <span>Read story</span>
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
