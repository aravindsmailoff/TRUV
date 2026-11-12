"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { ClickSpark } from "@/components/reactbits/ClickSpark";
import { RuntimeLoader } from "@rive-app/react-canvas";

// Use the bundled runtime instead of relying on a third-party CDN in previews.
RuntimeLoader.setWasmUrl("/rive.wasm");
RuntimeLoader.setWasmFallbackUrl("/rive_fallback.wasm");

interface SmoothScrollProps {
  children: React.ReactNode;
}

const NATIVE_SCROLL_PREFIXES = [
  "/dashboard",
  "/buyer",
  "/admin",
  "/signin",
  "/signup",
];

export function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname() || "/";
  const useNativeScroll = NATIVE_SCROLL_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // Dashboards, modals, and split-pane portals use native OS scrolling without Lenis wheel hijacking
  if (useNativeScroll) {
    return <>{children}</>;
  }

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
