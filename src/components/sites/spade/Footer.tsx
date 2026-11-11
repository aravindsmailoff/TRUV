"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current) return;
      const rect = footerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Compute scroll progress through the footer
      const totalDist = rect.height + windowHeight;
      const currentDist = windowHeight - rect.top;
      const progress = Math.min(Math.max(currentDist / totalDist, 0), 1);
      setScrollProgress(progress);


    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Margin ruler arrow tracking down the footer
  const rulerArrowTop = Math.min(Math.max(scrollProgress * 92, 4), 92);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-[#18280E] text-white pt-24 md:pt-36 pb-16"
    >
      {/* Left Ruler Ticks with Live Tracking Lemongrass Arrow */}
      <div className="absolute top-2 bottom-0 flex w-4.5 flex-col space-y-7 overflow-y-clip left-0 max-lg:hidden pointer-events-none" aria-hidden="true">
        {Array.from({ length: 42 }).map((_, i) => (
          <div
            key={i}
            className={`h-px shrink-0 bg-[#3a4c2a] ${i % 5 === 0 ? "w-4.5" : "w-2.5"}`}
          />
        ))}
      </div>

      {/* Right Ruler Ticks */}
      <div className="absolute top-2 bottom-0 flex w-4.5 flex-col space-y-7 overflow-y-clip right-0 items-end max-lg:hidden pointer-events-none" aria-hidden="true">
        {Array.from({ length: 42 }).map((_, i) => (
          <div
            key={i}
            className={`h-px shrink-0 bg-[#3a4c2a] ${i % 5 === 0 ? "w-4.5" : "w-2.5"}`}
          />
        ))}
      </div>

      {/* Live Tracking Margin Lemongrass Arrows */}
      <div
        className="pointer-events-none absolute inset-x-0 z-10 flex justify-between px-6 max-lg:hidden transition-all duration-75 ease-out"
        style={{ top: `${rulerArrowTop}%` }}
      >
        <div className="text-[#b2eb76] w-5 -ml-8 drop-shadow-md">
          <svg viewBox="0 0 22 16" fill="currentColor" className="w-full h-full">
            <path d="M2.0326 15.6442L5.93597e-07 13.5799L9.02336e-08 2.0643L2.0326 -8.88478e-08L21.48 7.27606L21.48 8.36816L2.0326 15.6442Z" />
          </svg>
        </div>
        <div className="text-[#b2eb76] w-5 rotate-180 -mr-8 drop-shadow-md">
          <svg viewBox="0 0 22 16" fill="currentColor" className="w-full h-full">
            <path d="M2.0326 15.6442L5.93597e-07 13.5799L9.02336e-08 2.0643L2.0326 -8.88478e-08L21.48 7.27606L21.48 8.36816L2.0326 15.6442Z" />
          </svg>
        </div>
      </div>

      <div className="relative z-1 max-w-[80rem] mx-auto px-5 lg:px-12">
        {/* ========================================================= */}
        {/* NAVIGATION DIRECTORY & NEWSLETTER FORM                   */}
        {/* ========================================================= */}
        <div className="border-t border-white/10 pt-16 md:pt-20">
          <div className="flex flex-col items-start gap-14 lg:flex-row lg:justify-between">
            {/* Link Columns */}
            <nav aria-label="Footer navigation" className="w-full flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 lg:gap-14">
                <div><h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-white/50 mb-4">Solutions</h3><ul className="space-y-3 text-sm text-stone-300"><li><Link href="/solutions/buyer">For buyers</Link></li><li><Link href="/solutions/manufacturer">For manufacturers</Link></li><li><Link href="/solutions/service">For service providers</Link></li></ul></div>
                <div><h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-white/50 mb-4">Explore</h3><ul className="space-y-3 text-sm text-stone-300"><li><Link href="/#trade-execution">How it works</Link></li><li><Link href="/#customers">Trade workflows</Link></li><li><Link href="/dashboard">Dashboard</Link></li></ul></div>
                <div><h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-white/50 mb-4">Account</h3><ul className="space-y-3 text-sm text-stone-300"><li><Link href="/signin">Sign in</Link></li><li><Link href="/signup">Request access</Link></li></ul></div>
              </div>
            </nav>

            {/* Newsletter Subscription & Legal */}
            <div className="w-full lg:w-5/12 max-w-md space-y-8">
              <p className="text-sm leading-relaxed text-white/70">TRUVX brings buyers, Indian manufacturers and service providers together around a clearer trade journey.</p>

              {/* Social and Legal Links */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-stone-400 font-mono">
                <div className="flex items-center gap-2">
                  <span>&copy; TRUVX 2026</span>
                  <Link
                    href="/admin"
                    title="Administrative Backdoor Portal"
                    className="opacity-20 hover:opacity-100 hover:text-[#b2eb76] transition-opacity cursor-pointer text-[10px]"
                  >
                    •
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
