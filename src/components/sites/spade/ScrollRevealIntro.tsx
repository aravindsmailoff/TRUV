"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const ScrollerRive = dynamic(
  () => import("./ScrollerRive").then((mod) => mod.ScrollerRive),
  { ssr: false }
);

export function ScrollRevealIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalHeight = containerRef.current.offsetHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const progress = Math.min(Math.max(-rect.top / totalHeight, 0), 1);
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

  // Slide 1 (Item 0) opacity & transform:
  // Active from 0 to 0.40, transitions out between 0.40 and 0.55
  const slide1Opacity =
    scrollProgress < 0.4
      ? 1
      : scrollProgress >= 0.55
      ? 0
      : 1 - (scrollProgress - 0.4) / 0.15;
  const slide1TranslateY =
    scrollProgress < 0.4 ? 0 : -((scrollProgress - 0.4) / 0.15) * 40;

  // Slide 2 (Item 1) opacity & transform:
  // Fades in between 0.40 and 0.55, active until 0.90, then slides with exit
  const slide2Opacity =
    scrollProgress < 0.4
      ? 0
      : scrollProgress <= 0.55
      ? (scrollProgress - 0.4) / 0.15
      : 1;
  const slide2TranslateY =
    scrollProgress < 0.4
      ? 40
      : scrollProgress <= 0.55
      ? (1 - (scrollProgress - 0.4) / 0.15) * 40
      : scrollProgress > 0.9
      ? -((scrollProgress - 0.9) / 0.1) * 60
      : 0;

  // Background opacity for forest dark green card
  const forestBgOpacity = slide1Opacity;

  // Dynamic countdown amounts driven by scroll position
  const progressInSlide1 = Math.min(Math.max((scrollProgress - 0.03) / 0.30, 0), 1);
  const amountB = (progressInSlide1 * 98.5).toFixed(2);
  const amountC = (progressInSlide1 * 44.64).toFixed(2);

  const progressInSlide2 = Math.min(Math.max((scrollProgress - 0.45) / 0.25, 0), 1);
  const amountApple = (progressInSlide2 * 23.9).toFixed(2);

  return (
    <section className="relative overflow-visible bg-white text-black pt-0 pb-0 px-5 lg:px-8">
      {/* 380vh scroll track matching spade.com */}
      <div ref={containerRef} className="h-[380vh] max-md:-mx-5 max-md:mt-4 relative">
        <div className="sticky top-0 flex min-h-screen flex-col items-center justify-center overflow-hidden">
          {/* Slide 1 Dark Green Card with Cut Corners */}
          <div
            className="absolute inset-x-0 inset-y-0 md:inset-y-16 transition-opacity duration-300 pointer-events-none"
            style={{
              opacity: forestBgOpacity,
              "--corner-size-desktop": "17px",
              "--corner-size-mobile": "13px",
            } as React.CSSProperties}
          >
            <div className="relative size-full bg-[#18280E]">
              <div className="pointer-events-none absolute inset-0 z-10 m-0">
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
            </div>
          </div>

          {/* Slide 2 Light Mint Background with Subtle Grid Pattern */}
          <div
            className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
            style={{
              opacity: slide2Opacity,
              backgroundColor: "#f4faed",
              backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Slide 1 Center Text Content */}
          <div
            className="relative z-10 w-full max-w-[52rem] mx-auto text-center px-4 transition-transform duration-100 ease-out pointer-events-none"
            style={{
              opacity: slide1Opacity,
              transform: `translate3d(0, ${slide1TranslateY}px, 0)`,
              display: slide1Opacity <= 0 ? "none" : "block",
            }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-medium leading-[1.2] text-white tracking-tight">
              Global trade brings buyers and manufacturers together,{" "}
              <span className="text-[#b2eb76]">but every deal has many moving parts.</span>
            </h2>
          </div>

          {/* Slide 2 Center Text Content */}
          <div
            className="relative z-10 w-full max-w-[52rem] mx-auto text-center px-4 transition-transform duration-100 ease-out pointer-events-none"
            style={{
              opacity: slide2Opacity,
              transform: `translate3d(0, ${slide2TranslateY}px, 0)`,
              display: slide2Opacity <= 0 ? "none" : "block",
            }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-medium leading-[1.2] text-[#18280E] tracking-tight">
              TRUVX brings sourcing, quotations and trade milestones together, so every step is easier to follow.
            </h2>
          </div>

          {/* Live Rive Scroller Interactive Animation driven by Scroll Input */}
          <div className="absolute inset-0 z-20 pointer-events-none w-full h-full">
            <ScrollerRive progress={scrollProgress} />
          </div>

          {/* Slide 1 Dynamic Scroll-driven Countdown Overlay */}
          {slide1Opacity > 0.05 && (
            <div
              className="absolute inset-0 z-25 pointer-events-none transition-opacity duration-150 max-lg:hidden"
              style={{ opacity: slide1Opacity }}
            >
              {/* Chip A (Top Right: 905RE HY248249242) */}
              <div
                className="absolute font-mono font-bold text-[13px] text-white text-right"
                style={{
                  right: "calc(100% - 75.1%)",
                  top: "27.9%",
                  transform: "translateY(-50%)",
                }}
              >
                <span className="bg-[#18280E] px-1 py-0.5 rounded tracking-tight">
                  -$0.00
                </span>
              </div>

              {/* Chip B (Bottom Left: GAS STATION MG283235382) */}
              <div
                className="absolute font-mono font-bold text-[13px] text-white text-right"
                style={{
                  right: "calc(100% - 36%)",
                  top: "68.9%",
                  transform: "translateY(-50%)",
                }}
              >
                <span className="bg-[#18280E] px-1 py-0.5 rounded tracking-tight">
                  -${amountB}
                </span>
              </div>

              {/* Chip C (Bottom Right: STORE JU24829429) */}
              <div
                className="absolute font-mono font-bold text-[13px] text-white text-right"
                style={{
                  right: "calc(100% - 87.5%)",
                  top: "87.5%",
                  transform: "translateY(-50%)",
                }}
              >
                <span className="bg-[#18280E] px-1 py-0.5 rounded tracking-tight">
                  -${amountC}
                </span>
              </div>
            </div>
          )}

          {/* Slide 2 Dynamic Amount for Apple Store Tribeca */}
          {slide2Opacity > 0.1 && (
            <div
              className="absolute inset-0 z-25 pointer-events-none transition-opacity duration-150 max-lg:hidden"
              style={{ opacity: slide2Opacity }}
            >
              <div
                className="absolute font-mono font-bold text-[14px] text-white text-right"
                style={{
                  left: "54.2%",
                  top: "50.8%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span className="bg-[#18280E] px-1.5 py-0.5 rounded tracking-tight">
                  -${amountApple}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
