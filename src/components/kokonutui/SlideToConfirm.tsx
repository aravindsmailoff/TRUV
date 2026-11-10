"use client";

import React, { useState, useRef, useEffect } from "react";
import { Check, ArrowRight, ShieldCheck } from "lucide-react";

interface SlideToConfirmProps {
  onConfirm: () => void;
  text?: string;
  confirmedText?: string;
  className?: string;
}

export function SlideToConfirm({
  onConfirm,
  text = "Slide to Lock Deal & Escrow",
  confirmedText = "Deal Locked • PayPal Protected",
  className = "",
}: SlideToConfirmProps) {
  const [dragProgress, setDragProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    if (confirmed) return;
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMove = (clientX: number) => {
      if (!isDragging || !containerRef.current || confirmed) return;
      const rect = containerRef.current.getBoundingClientRect();
      const maxDrag = rect.width - 44; // thumb width ~40px + padding
      const currentX = clientX - rect.left - 20;
      const progress = Math.max(0, Math.min(1, currentX / maxDrag));
      setDragProgress(progress);

      if (progress >= 0.92) {
        setConfirmed(true);
        setIsDragging(false);
        setDragProgress(1);
        onConfirm();
      }
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX);
    };

    const handleEnd = () => {
      if (!isDragging) return;
      setIsDragging(false);
      if (!confirmed) {
        setDragProgress(0);
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, confirmed, onConfirm]);

  return (
    <div
      ref={containerRef}
      className={`relative h-11 w-full rounded-xl overflow-hidden select-none border transition-all ${
        confirmed
          ? "bg-[#18280e] border-[#18280e] text-[#b2eb76]"
          : "bg-[#f4faed] border-[#d8e5ca] text-stone-700"
      } ${className}`}
    >
      {/* Sliding Fill Track */}
      <div
        className="absolute inset-y-0 left-0 bg-[#b2eb76]/30 transition-all duration-75"
        style={{ width: `${dragProgress * 100}%` }}
      />

      {/* Center Label Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs font-mono font-semibold tracking-wide">
        {confirmed ? (
          <span className="flex items-center gap-1.5 text-[#b2eb76] font-bold animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>{confirmedText}</span>
          </span>
        ) : (
          <span className="text-stone-600 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3f7308]" />
            <span>{text}</span>
          </span>
        )}
      </div>

      {/* Draggable Thumb Knob */}
      {!confirmed && (
        <div
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          className="absolute top-1 bottom-1 w-9 rounded-lg bg-[#18280e] text-[#b2eb76] flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing hover:bg-[#253d16] transition-transform active:scale-95"
          style={{
            left: `calc(4px + ${dragProgress} * (100% - 44px))`,
          }}
        >
          <ArrowRight className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}

