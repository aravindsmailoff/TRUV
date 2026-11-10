import React from "react";

export function LogoCloud() {
  return (
    <section className="py-14 border-y border-[#d8e5ca]/60 bg-[#f4faed]/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-center text-xs sm:text-sm font-mono font-medium tracking-widest text-stone-500 uppercase max-w-3xl mx-auto mb-10 leading-relaxed">
          500 BANKS EVERY MONTH
        </h2>

        {/* Row 1: Astropods, Elastic, Kernel, Postman, Render, Zapier */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-14 opacity-90 text-[#18280e]">
          {/* 1. Astropods */}
          <div className="flex items-center gap-2 hover:opacity-100 opacity-80 transition-opacity">
            <svg className="h-6 w-auto" viewBox="0 0 32 32" fill="currentColor">
              <path d="M4 16 L28 4 L20 18 L28 28 L14 20 Z" />
            </svg>
            <span className="text-lg font-bold tracking-tight font-sans">Astropods</span>
          </div>

          {/* 2. Elastic */}
          <div className="flex items-center gap-2 hover:opacity-100 opacity-80 transition-opacity">
            <svg className="h-7 w-auto" viewBox="0 0 40 40" fill="currentColor">
              <circle cx="14" cy="14" r="7" />
              <circle cx="27" cy="15" r="5" />
              <circle cx="15" cy="27" r="6" />
              <circle cx="28" cy="26" r="4.5" />
            </svg>
            <span className="text-lg font-bold lowercase tracking-tight font-sans">elastic</span>
          </div>

          {/* 3. Kernel */}
          <div className="flex items-center gap-1 hover:opacity-100 opacity-80 transition-opacity">
            <span className="text-xl font-black uppercase tracking-wider font-mono">KERNEL</span>
            <span className="w-1.5 h-1.5 rounded-full bg-current mb-3" />
          </div>

          {/* 4. Postman */}
          <div className="flex items-center gap-2 hover:opacity-100 opacity-80 transition-opacity">
            <svg className="h-7 w-auto" viewBox="0 0 36 36" fill="currentColor">
              <circle cx="18" cy="18" r="16" />
              <path
                d="M12 24 L22 14 M22 14 L24 20 M22 14 L16 12 M20 22 L24 24"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span className="text-base font-black uppercase tracking-widest font-mono">POSTMAN</span>
          </div>

          {/* 5. Render */}
          <div className="flex items-center gap-2 hover:opacity-100 opacity-80 transition-opacity">
            <svg className="h-6 w-auto" viewBox="0 0 32 32" fill="currentColor">
              <circle cx="9" cy="23" r="5" />
              <rect x="15" y="6" width="10" height="10" rx="3" />
              <path d="M9 18 V12 H15" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
            <span className="text-lg font-bold tracking-tight font-sans">Render</span>
          </div>

          {/* 6. Zapier */}
          <div className="flex items-center gap-1.5 hover:opacity-100 opacity-80 transition-opacity">
            <span className="text-xl font-bold font-mono">_</span>
            <span className="text-xl font-extrabold tracking-tight font-sans">zapier</span>
          </div>
        </div>

        {/* Row 2: PayPal (Centered below) */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 hover:opacity-100 opacity-85 transition-opacity">
            <svg className="h-8 w-auto text-[#18280e]" viewBox="0 0 36 36" fill="currentColor">
              <path d="M11 6h11c3.5 0 6 2 5.5 5.5-.6 4-3.5 6.5-7.5 6.5h-3.5L14 30h-5l5-24z" />
              <path
                d="M16 12h9c3 0 5 1.5 4.5 4.5-.6 3.5-3 5.5-6.5 5.5h-3.5L17.5 32H13l4-20z"
                opacity="0.8"
              />
            </svg>
            <span className="text-2xl font-black italic tracking-tight font-sans text-[#18280e]">
              PayPal
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
