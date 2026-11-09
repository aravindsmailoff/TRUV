"use client";

import React, { useRef, useEffect } from "react";

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  extraScale?: number;
}

export function ClickSpark({
  sparkColor = "#b2eb76",
  sparkSize = 3,
  sparkRadius = 24,
  sparkCount = 8,
  duration = 450,
  extraScale = 1.2,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let sparks: Array<{
      x: number;
      y: number;
      angle: number;
      startTime: number;
    }> = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleClick = (e: MouseEvent) => {
      const now = performance.now();
      for (let i = 0; i < sparkCount; i++) {
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          angle: (2 * Math.PI * i) / sparkCount,
          startTime: now,
        });
      }
    };

    window.addEventListener("click", handleClick);

    let animationId: number;
    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparks = sparks.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = elapsed / duration;
        const eased = 1 - Math.pow(1 - progress, 3);
        const distance = eased * sparkRadius * extraScale;
        const currentSize = sparkSize * (1 - progress);

        const x = spark.x + Math.cos(spark.angle) * distance;
        const y = spark.y + Math.sin(spark.angle) * distance;

        ctx.beginPath();
        ctx.arc(x, y, currentSize, 0, 2 * Math.PI);
        ctx.fillStyle = sparkColor;
        ctx.globalAlpha = 1 - progress;
        ctx.fill();
        ctx.globalAlpha = 1;
        return true;
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationId);
    };
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, extraScale]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-100 size-full"
    />
  );
}

