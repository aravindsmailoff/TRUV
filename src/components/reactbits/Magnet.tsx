"use client";

import React from "react";

interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
}

/**
 * Magnet Component
 * Kept stable and solid without cursor-tracking distortion or "dough ball" warping,
 * maintaining normal button ergonomics and click reliability.
 */
export function Magnet({
  children,
  wrapperClassName = "",
  innerClassName = "",
}: MagnetProps) {
  return (
    <div className={`inline-block ${wrapperClassName}`}>
      <div className={innerClassName}>{children}</div>
    </div>
  );
}
