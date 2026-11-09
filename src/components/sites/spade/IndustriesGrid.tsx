"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface IndustryItem {
  tag: string;
  title: string;
  description: string;
  href: string;
  position: "left" | "right";
  videoTime: number; // Video timestamp in seconds
}

const INDUSTRIES: IndustryItem[] = [
  {
    tag: "[FINTECHS]",
    title: "Infrastructure for innovation",
    description: "Power new products, rewards, and AI capabilities with a data foundation that scales.",
    href: "/industry/fintechs/",
    position: "left",
    videoTime: 0.5,
  },
  {
    tag: "[BANKS]",
    title: "Clarity at enterprise scale",
    description: "Unify authorization, analytics, and AI on one trusted platform.",
    href: "/industry/banks/",
    position: "right",
    videoTime: 2.5,
  },
  {
    tag: "[AI]",
    title: "AI that learns from the truth",
    description: "Feed your models clean, enriched data that makes intelligence actionable.",
    href: "/industry/ai/",
    position: "left",
    videoTime: 4.5,
  },
];

export function IndustriesGrid() {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync video time when activeIdx changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = INDUSTRIES[activeIdx].videoTime;
      videoRef.current.play().catch(() => {});
    }
  }, [activeIdx]);

  // Scroll spy to switch industries automatically during 300vh scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalHeight = containerRef.current.offsetHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const progress = Math.min(Math.max(-rect.top / totalHeight, 0), 1);
      
      const newIdx = Math.min(Math.floor(progress * INDUSTRIES.length), INDUSTRIES.length - 1);
      setActiveIdx(newIdx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const active = INDUSTRIES[activeIdx];

  return (
    <section className="relative overflow-visible bg-white text-black pt-16 md:pt-24 pb-0">
      <div ref={containerRef} className="h-[260vh] relative">
        <div className="sticky top-0 min-h-screen flex flex-col items-center justify-center overflow-hidden px-5 lg:px-8">
          {/* Main Section Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-medium tracking-tight text-[#18280E] text-center max-w-2xl leading-[1.15] mb-6">
            Built for every layer of modern finance
          </h2>

          {/* Tab Selector Buttons for immediate interactivity */}
          <div className="flex items-center gap-3 z-30 mb-4 bg-stone-100/80 p-1.5 rounded-full border border-stone-200/80 shadow-xs">
            {INDUSTRIES.map((ind, idx) => (
              <button
                key={ind.tag}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeIdx === idx
                    ? "bg-[#18280E] text-white shadow-xs"
                    : "text-stone-600 hover:text-black hover:bg-white/60"
                }`}
              >
                {ind.tag}
              </button>
            ))}
          </div>

          {/* Central 3D Interactive Stage */}
          <div className="relative w-full max-w-[68rem] min-h-[380px] sm:min-h-[460px] flex items-center justify-center">
            {/* Center 3D Isometric Wireframe Terminal Video */}
            <div className="relative z-10 w-full max-w-[22rem] aspect-[340/360] flex items-center justify-center">
              <video
                ref={videoRef}
                src="/sites/spade/home-scroller.mp4"
                muted
                playsInline
                loop
                autoPlay
                className="w-full h-full object-contain pointer-events-none drop-shadow-lg"
              />
            </div>

            {/* Desktop Left Callout Card with SVG Dotted Connector Line */}
            {active.position === "left" && (
              <div className="absolute left-4 lg:left-12 bottom-8 sm:bottom-12 w-full max-w-[19rem] z-20 transition-all duration-300 animate-fadeIn">
                {/* SVG Dotted Elbow Connector Line */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="425"
                  height="32"
                  viewBox="0 0 425 32"
                  fill="none"
                  className="mb-3 max-xl:hidden w-full max-w-[24rem]"
                >
                  <path
                    d="M424.27 0.500163L0.5 0.5L0.499999 31.3387"
                    stroke="#18280E"
                    strokeDasharray="2.52 2.52"
                  />
                </svg>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#18280E] opacity-90">
                      {active.tag}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 22 16" fill="currentColor" className="text-[#18280E]">
                      <path d="M2.0326 15.6442L5.93597e-07 13.5799L9.02336e-08 2.0643L2.0326 -8.88478e-08L21.48 7.27606L21.48 8.36816L2.0326 15.6442Z" />
                    </svg>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-medium text-[#18280E] leading-tight">
                    {active.title}
                  </h3>

                  <p className="text-sm text-stone-600 leading-relaxed">
                    {active.description}
                  </p>

                  <div className="mt-2">
                    <Link
                      href={active.href}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-[#18280E] hover:opacity-75 transition-opacity"
                    >
                      <span>▶ Learn more</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Right Callout Card with SVG Dotted Connector Line */}
            {active.position === "right" && (
              <div className="absolute right-4 lg:right-12 bottom-8 sm:bottom-12 w-full max-w-[19rem] z-20 transition-all duration-300 animate-fadeIn">
                {/* SVG Dotted Straight Connector Line */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="141"
                  height="1"
                  viewBox="0 0 141 1"
                  fill="none"
                  className="mb-3 max-xl:hidden"
                >
                  <line y1="0.5" x2="141" y2="0.5" stroke="#18280E" strokeDasharray="2.52 2.52" />
                </svg>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#18280E] opacity-90">
                      {active.tag}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 22 16" fill="currentColor" className="text-[#18280E]">
                      <path d="M2.0326 15.6442L5.93597e-07 13.5799L9.02336e-08 2.0643L2.0326 -8.88478e-08L21.48 7.27606L21.48 8.36816L2.0326 15.6442Z" />
                    </svg>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-medium text-[#18280E] leading-tight">
                    {active.title}
                  </h3>

                  <p className="text-sm text-stone-600 leading-relaxed">
                    {active.description}
                  </p>

                  <div className="mt-2">
                    <Link
                      href={active.href}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-[#18280E] hover:opacity-75 transition-opacity"
                    >
                      <span>▶ Learn more</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
