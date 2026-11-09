"use client";

import React from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

export function MastheadRive() {
  const { RiveComponent } = useRive({
    src: "/sites/spade/homepage-masthead-animation-2.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
    autoBind: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });

  return (
    <div className="relative w-full h-full pointer-events-none">
      <RiveComponent className="w-full h-full" />
    </div>
  );
}

