"use client";

import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export function ShinyText({
  text,
  disabled = false,
  speed = 3.5,
  className = "",
}: ShinyTextProps) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block bg-clip-text ${disabled ? "" : "animate-shine"} ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(120deg, rgba(255, 255, 255, 0.4) 30%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.4) 70%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        animationDuration,
      }}
    >
      {text}
    </span>
  );
}

