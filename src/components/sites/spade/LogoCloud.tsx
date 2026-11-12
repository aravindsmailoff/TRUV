"use client";

import React from "react";

export function LogoCloud() {
  const sponsors = [
    {
      id: "astropods",
      name: "Astropods",
      type: "Satellite Telemetry",
      render: () => (
        <div className="flex items-center gap-3">
          <svg className="h-9 w-auto text-[#18280e]" viewBox="0 0 32 32" fill="currentColor">
            <path d="M4 16 L28 4 L20 18 L28 28 L14 20 Z" />
          </svg>
          <span className="text-2xl font-bold tracking-tight font-sans text-[#18280e]">
            Astropods
          </span>
        </div>
      ),
    },
    {
      id: "elastic",
      name: "Elastic",
      type: "Semantic Search",
      render: () => (
        <div className="flex items-center gap-3">
          <svg className="h-10 w-auto text-[#18280e]" viewBox="0 0 40 40" fill="currentColor">
            <circle cx="14" cy="14" r="7" />
            <circle cx="27" cy="15" r="5" />
            <circle cx="15" cy="27" r="6" />
            <circle cx="28" cy="26" r="4.5" />
          </svg>
          <span className="text-2xl font-bold lowercase tracking-tight font-sans text-[#18280e]">
            elastic
          </span>
        </div>
      ),
    },
    {
      id: "kernel",
      name: "Kernel",
      type: "Runtime Security",
      render: () => (
        <div className="flex items-center gap-1.5">
          <span className="text-3xl font-black uppercase tracking-wider font-mono text-[#18280e]">
            KERNEL
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#18280e] mb-3.5" />
        </div>
      ),
    },
    {
      id: "postman",
      name: "Postman",
      type: "API Integration",
      render: () => (
        <div className="flex items-center gap-3">
          <svg className="h-10 w-auto text-[#18280e]" viewBox="0 0 36 36" fill="currentColor">
            <circle cx="18" cy="18" r="17" />
            <path
              d="M11 25 L23 13 M23 13 L25 20 M23 13 L16 11 M21 23 L25 25"
              stroke="#ffffff"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <span className="text-xl font-black uppercase tracking-widest font-mono text-[#18280e]">
            POSTMAN
          </span>
        </div>
      ),
    },
    {
      id: "render",
      name: "Render",
      type: "Cloud Infrastructure",
      render: () => (
        <div className="flex items-center gap-3">
          <svg className="h-9 w-auto text-[#18280e]" viewBox="0 0 32 32" fill="currentColor">
            <circle cx="9" cy="23" r="5" />
            <rect x="15" y="6" width="11" height="11" rx="3" />
            <path d="M9 18 V12 H15" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </svg>
          <span className="text-2xl font-bold tracking-tight font-sans text-[#18280e]">
            Render
          </span>
        </div>
      ),
    },
    {
      id: "zapier",
      name: "Zapier",
      type: "Trade Automations",
      render: () => (
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold font-mono text-[#18280e]">_</span>
          <span className="text-3xl font-extrabold tracking-tight font-sans text-[#18280e]">
            zapier
          </span>
        </div>
      ),
    },
    {
      id: "paypal",
      name: "PayPal",
      type: "Milestone Escrow Rails",
      render: () => (
        <div className="flex items-center gap-2.5">
          <svg className="h-10 w-auto text-[#18280e]" viewBox="0 0 36 36" fill="currentColor">
            <path d="M11 6h11c3.5 0 6 2 5.5 5.5-.6 4-3.5 6.5-7.5 6.5h-3.5L14 30h-5l5-24z" />
            <path
              d="M16 12h9c3 0 5 1.5 4.5 4.5-.6 3.5-3 5.5-6.5 5.5h-3.5L17.5 32H13l4-20z"
              opacity="0.85"
            />
          </svg>
          <span className="text-3xl font-black italic tracking-tight font-sans text-[#18280e]">
            PayPal
          </span>
        </div>
      ),
    },
  ];

  return (
    <section className="py-16 md:py-20 border-y border-[#d8e5ca]/70 bg-gradient-to-b from-[#f4faed]/60 via-[#f9fcf6] to-[#f4faed]/60 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-stone-500 uppercase">
            A CONNECTED WORKFLOW FOR CROSS-BORDER TRADE
          </span>
          <span className="text-[11px] font-mono text-[#3f7308] bg-[#ebf7d9] px-2.5 py-1 rounded-full border border-[#d8e5ca]">
            From sourcing to shipment
          </span>
        </div>
      </div>

      {/* Infinite Running Marquee Track (Left to Right Animation) */}
      <div className="relative w-full overflow-hidden">
        {/* Soft Left & Right Fade Masks */}
        <div className="pointer-events-none absolute left-0 inset-y-0 w-24 sm:w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 inset-y-0 w-24 sm:w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

        {/* Continuous Running Animation Container */}
        <div className="flex w-max items-center animate-marquee-ltr hover:[animation-play-state:paused] py-2">
          {/* First loop of sponsors */}
          {sponsors.map((sponsor, idx) => (
            <div
              key={`sp1-${idx}`}
              className="flex items-center mx-6 sm:mx-10 px-6 sm:px-8 py-4 bg-white/90 hover:bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all duration-200 shrink-0 select-none group cursor-pointer"
            >
              <div className="opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all">
                {sponsor.render()}
              </div>
            </div>
          ))}

          {/* Second duplicate loop for seamless continuous looping */}
          {sponsors.map((sponsor, idx) => (
            <div
              key={`sp2-${idx}`}
              className="flex items-center mx-6 sm:mx-10 px-6 sm:px-8 py-4 bg-white/90 hover:bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all duration-200 shrink-0 select-none group cursor-pointer"
            >
              <div className="opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all">
                {sponsor.render()}
              </div>
            </div>
          ))}

          {/* Third duplicate loop for extra wide displays */}
          {sponsors.map((sponsor, idx) => (
            <div
              key={`sp3-${idx}`}
              className="flex items-center mx-6 sm:mx-10 px-6 sm:px-8 py-4 bg-white/90 hover:bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all duration-200 shrink-0 select-none group cursor-pointer"
            >
              <div className="opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all">
                {sponsor.render()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Subtitle Indicator */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-6 text-center">
        <span className="text-[11px] font-mono text-stone-400">
          Astropods (Satellite AIS) • Elastic (Vector Search) • Kernel (Sandbox) • Postman (APIs) • Render (Edge Host) • Zapier (Webhooks) • PayPal (Orders v2)
        </span>
      </div>

      {/* Marquee Keyframes CSS */}
      <style jsx>{`
        @keyframes marqueeLtr {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .animate-marquee-ltr {
          animation: marqueeLtr 28s linear infinite;
        }
      `}</style>
    </section>
  );
}
