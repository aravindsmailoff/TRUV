"use client";

import React from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { ClickSpark } from "@/components/reactbits/ClickSpark";

interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        infinite: false,
        prevent: (node) =>
          Boolean(
            node?.closest?.(
              "[data-lenis-prevent], [data-lenis-prevent-wheel], [role='dialog']"
            )
          ),
      }}
    >
      <ClickSpark sparkColor="#b2eb76" sparkSize={3.5} sparkRadius={26} sparkCount={7} duration={400} />
      {children}
    </ReactLenis>
  );
}
