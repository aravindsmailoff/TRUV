"use client";

import React from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

export function RiskAuthRive() {
  const { RiveComponent } = useRive({
    src: "/sites/spade/risk-auth-animation.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
    autoBind: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });

  return (
    <div className="relative w-full h-full">
      <RiveComponent className="w-full h-full" />
    </div>
  );
}
