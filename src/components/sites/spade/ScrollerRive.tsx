"use client";

import React, { useEffect } from "react";
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from "@rive-app/react-canvas";

interface ScrollerRiveProps {
  progress: number;
}

export function ScrollerRive({ progress }: ScrollerRiveProps) {
  const { rive, RiveComponent } = useRive({
    src: "/sites/spade/homepage-scroller-animation-2.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });

  const scrollInput = useStateMachineInput(rive, "State Machine 1", "Number 1");

  useEffect(() => {
    if (scrollInput && rive) {
      // Input "Number 1" drives the Rive animation from 0 to 300 as user scrolls
      const targetValue = Math.min(Math.max(progress * 300, 0), 300);
      // eslint-disable-next-line react-hooks/immutability
      scrollInput.value = targetValue;
      // Wake up the state machine to force immediate frame render & countdown
      if (!rive.isPlaying) {
        rive.play();
      }
    }
  }, [progress, scrollInput, rive]);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none w-full h-full flex items-center justify-center">
      <RiveComponent className="w-full h-full object-cover" />
    </div>
  );
}
