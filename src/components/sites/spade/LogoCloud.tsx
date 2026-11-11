"use client";

import React from "react";

export function LogoCloud() {
  const sponsors = ["Buyer requests", "Manufacturer discovery", "Quotations", "Orders", "Payments", "Inspection", "Shipping"].map((name) => ({
    name,
    render: () => <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#18280e]">{name}</span>,
  }));

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
          Buyer requests • Manufacturer discovery • Quotations • Payment milestones • Inspection • Shipping
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
