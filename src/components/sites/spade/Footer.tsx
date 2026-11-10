"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Magnet } from "@/components/reactbits/Magnet";
import { IntelligenceConsoleModal } from "./IntelligenceConsoleModal";

export function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isInView, setIsInView] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(false);

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

      if (rect.top < windowHeight * 0.85) {
        setIsInView(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ctaRef.current) return;
    const rect = ctaRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x: x * 20, y: y * 20 });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };

  // Parallax calculations matching spade.com specs:
  // normalized progress capped at 0.70
  const normalizedProgress = Math.min(scrollProgress / 0.7, 1);
  
  // Left coin: translates y from 50px to 0px, rotates from -22deg to -15deg
  const leftCoinY = 50 * (1 - normalizedProgress) + mouseOffset.y * 0.5;
  const leftCoinRotate = -22 + 7 * normalizedProgress + mouseOffset.x * 0.2;

  // Right coin: translates y from 120px to 0px, rotates from 54deg to 41.5deg
  const rightCoinY = 120 * (1 - normalizedProgress) - mouseOffset.y * 0.5;
  const rightCoinRotate = 54 - 12.5 * normalizedProgress - mouseOffset.x * 0.2;

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
        {/* TOP CTA HERO: "Add intelligence to every layer..."        */}
        {/* ========================================================= */}
        <div
          ref={ctaRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative mx-auto flex w-full max-w-[980px] flex-col items-center gap-y-7 sm:gap-y-10 pt-10 pb-20 md:pb-28"
        >
          {/* Animated Floating Coin Left */}
          <div
            className="absolute -top-12 -left-10 sm:-left-20 lg:-left-28 w-[140px] sm:w-[180px] lg:w-[224px] pointer-events-none drop-shadow-2xl transition-transform duration-200 ease-out z-0"
            style={{
              transform: `translate3d(0, ${leftCoinY}px, 0) rotate(${leftCoinRotate}deg)`,
            }}
          >
            <div className="animate-[bounce_6s_ease-in-out_infinite] w-full h-auto">
              <Image
                src="/sites/spade/coin.png"
                alt="3D Wireframe Coin"
                width={224}
                height={272}
                priority
                className="w-full h-auto select-none"
              />
            </div>
          </div>

          {/* Animated Floating Coin Right */}
          <div
            className="absolute -bottom-10 -right-8 sm:-right-20 lg:-right-32 w-[140px] sm:w-[180px] lg:w-[224px] pointer-events-none drop-shadow-2xl transition-transform duration-200 ease-out z-0"
            style={{
              transform: `translate3d(0, ${rightCoinY}px, 0) rotate(${rightCoinRotate}deg)`,
            }}
          >
            <div className="animate-[bounce_7s_ease-in-out_infinite_1s] w-full h-auto">
              <Image
                src="/sites/spade/coin.png"
                alt="3D Wireframe Coin"
                width={224}
                height={272}
                priority
                className="w-full h-auto select-none"
              />
            </div>
          </div>

          {/* Headline with Animated Lemongrass Underlines */}
          <h2 className="text-4xl sm:text-6xl lg:text-[76px] font-medium text-center tracking-tight leading-[1.08] text-white max-w-4xl relative z-10">
            Add intelligence to{" "}
            <span className="relative inline-block text-[#b2eb76]">
              every
              <span
                className="absolute left-0 bottom-1 h-[3px] lg:h-[4px] bg-[#b2eb76] transition-all duration-700 ease-out"
                style={{ width: isInView ? "100%" : "0%" }}
              />
            </span>{" "}
            <span className="relative inline-block text-[#b2eb76]">
              layer
              <span
                className="absolute left-0 bottom-1 h-[3px] lg:h-[4px] bg-[#b2eb76] transition-all duration-700 delay-150 ease-out"
                style={{ width: isInView ? "100%" : "0%" }}
              />
            </span>{" "}
            of your data
          </h2>

          {/* Contact Sales CTA Button with React Bits Magnet */}
          <div className="flex items-center gap-x-5 z-10 mt-2">
            <Magnet padding={35} magnetStrength={2.5}>
              <button
                type="button"
                onClick={() => setConsoleOpen(true)}
                className="inline-block cursor-pointer"
              >
                <div className="group relative inline-flex appearance-none items-center py-3.5 px-7 select-none transition-all duration-200 justify-center text-[#18280E] font-medium text-sm sm:text-base rounded-md bg-[#b2eb76] hover:bg-[#c2f38d] hover:scale-105 active:scale-95 shadow-lg">
                  <span className="relative z-10 font-semibold tracking-wide">
                    Contact sales
                  </span>
                </div>
              </button>
            </Magnet>
          </div>
        </div>

        {/* Global Transaction Intelligence Console Modal */}
        <IntelligenceConsoleModal isOpen={consoleOpen} onClose={() => setConsoleOpen(false)} />

        {/* ========================================================= */}
        {/* NAVIGATION DIRECTORY & NEWSLETTER FORM                   */}
        {/* ========================================================= */}
        <div className="border-t border-white/10 pt-16 md:pt-20">
          <div className="flex flex-col items-start gap-14 lg:flex-row lg:justify-between">
            {/* Link Columns */}
            <nav aria-label="Footer navigation" className="w-full flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 lg:gap-14">
                {/* Column 1: Use Cases */}
                <div>
                  <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-white/50 mb-4">
                    Use Cases
                  </h3>
                  <ul className="space-y-3 text-sm text-stone-300">
                    <li><Link href="/use-case/risk-authorization" className="hover:text-white transition-colors">Risk &amp; Authorization</Link></li>
                    <li><Link href="/use-case/rewards-and-attribution" className="hover:text-white transition-colors">Rewards &amp; Attribution</Link></li>
                    <li><Link href="/use-case/analytics-and-ai" className="hover:text-white transition-colors">Analytics &amp; AI</Link></li>
                    <li><Link href="/use-case/user-experience" className="hover:text-white transition-colors">User Experience</Link></li>
                    <li><Link href="/use-case/predictions" className="hover:text-white transition-colors">Predictions</Link></li>
                  </ul>
                </div>

                {/* Column 2: Industries */}
                <div>
                  <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-white/50 mb-4">
                    Industries
                  </h3>
                  <ul className="space-y-3 text-sm text-stone-300">
                    <li><Link href="/industry/fintechs" className="hover:text-white transition-colors">Fintechs</Link></li>
                    <li><Link href="/industry/banks" className="hover:text-white transition-colors">Banks</Link></li>
                    <li><Link href="/industry/ai" className="hover:text-white transition-colors">AI</Link></li>
                    <li><Link href="/industry/ecosystem-partners" className="hover:text-white transition-colors">Ecosystem Partners</Link></li>
                  </ul>
                </div>

                {/* Column 3: Company */}
                <div>
                  <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-white/50 mb-4">
                    Company
                  </h3>
                  <ul className="space-y-3 text-sm text-stone-300">
                    <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                    <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                    <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
                    <li><Link href="/resources" className="hover:text-white transition-colors">Resources</Link></li>
                  </ul>
                </div>
              </div>
            </nav>

            {/* Newsletter Subscription & Legal */}
            <div className="w-full lg:w-5/12 max-w-md space-y-8">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-white/70 mb-3">
                  Sign up to our newsletter
                </div>
                <form className="flex w-full gap-x-2" onSubmit={handleSubmit}>
                  <input
                    type="email"
                    required
                    placeholder="Email address"
                    className="flex-1 bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-white placeholder:text-white/40 rounded-md focus:outline-hidden focus:border-[#b2eb76] transition-colors"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="px-4 py-2.5 bg-[#b2eb76] text-[#18280E] font-medium text-xs font-mono uppercase tracking-wider rounded-md hover:bg-[#a0de61] transition-all cursor-pointer shrink-0"
                  >
                    {subscribed ? "Subscribed!" : "Subscribe"}
                  </button>
                </form>
              </div>

              {/* Social and Legal Links */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-stone-400 font-mono">
                <div className="flex flex-wrap gap-4">
                  <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                  <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                  <Link href="/msa" className="hover:text-white transition-colors">MSA</Link>
                  <Link href="/sla" className="hover:text-white transition-colors">SLA</Link>
                </div>
                <div className="flex items-center gap-2">
                  <span>&copy; TRUV 2026</span>
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
