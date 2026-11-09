"use client";

import React, { useState, useEffect, useRef } from "react";

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

export function Magnet({
  children,
  padding = 30,
  disabled = false,
  magnetStrength = 2.5,
  activeTransition = "transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)",
  inactiveTransition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
  wrapperClassName = "",
  innerClassName = "",
}: MagnetProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const magnetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!magnetRef.current) return;
      const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distX = Math.abs(centerX - e.clientX);
      const distY = Math.abs(centerY - e.clientY);

      if (distX < width / 2 + padding && distY < height / 2 + padding) {
        setPosition({
          x: (e.clientX - centerX) / magnetStrength,
          y: (e.clientY - centerY) / magnetStrength,
        });
      } else {
        setPosition((prev) => (prev.x !== 0 || prev.y !== 0 ? { x: 0, y: 0 } : prev));
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [padding, disabled, magnetStrength]);

  const currentX = disabled ? 0 : position.x;
  const currentY = disabled ? 0 : position.y;
  const isAttracted = currentX !== 0 || currentY !== 0;

  return (
    <div ref={magnetRef} className={`inline-block ${wrapperClassName}`}>
      <div
        className={innerClassName}
        style={{
          transform: `translate3d(${currentX}px, ${currentY}px, 0)`,
          transition: isAttracted ? activeTransition : inactiveTransition,
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
