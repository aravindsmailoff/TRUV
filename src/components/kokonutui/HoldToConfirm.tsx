"use client";

import React, { useState, useRef, useEffect } from "react";
import { ShieldCheck, Check } from "lucide-react";

interface HoldToConfirmProps {
  onConfirm: () => void;
  holdDurationMs?: number;
  label?: string;
  confirmedLabel?: string;
  className?: string;
}

export function HoldToConfirm({
  onConfirm,
  holdDurationMs = 1200,
  label = "Hold to Verify Evidence",
  confirmedLabel = "Evidence Verified",
  className = "",
}: HoldToConfirmProps) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startHold = () => {
    if (confirmed) return;
    setIsHolding(true);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const p = Math.min(1, elapsed / holdDurationMs);
      setProgress(p);

      if (p >= 1) {
        if (timerRef.current) clearInterval(timerRef.current);
        setConfirmed(true);
        setIsHolding(false);
        onConfirm();
      }
    }, 25);
  };

  const endHold = () => {
    if (confirmed) return;
    setIsHolding(false);
    setProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <button
      type="button"
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      className={`relative h-10 px-4 rounded-xl overflow-hidden font-mono text-xs font-bold border transition-all cursor-pointer select-none ${
        confirmed
          ? "bg-[#18280e] border-[#18280e] text-[#b2eb76]"
          : "bg-white border-stone-200 text-[#18280e] hover:border-[#18280e]/40"
      } ${className}`}
    >
      {/* Background Fill Progress Bar */}
      <div
        className="absolute inset-y-0 left-0 bg-[#ebf7d9] transition-all duration-75"
        style={{ width: `${progress * 100}%` }}
      />

      <span className="relative z-10 flex items-center justify-center gap-1.5">
        {confirmed ? (
          <>
            <Check className="w-3.5 h-3.5 text-[#b2eb76]" />
            <span>{confirmedLabel}</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-3.5 h-3.5 text-[#3f7308]" />
            <span>{isHolding ? `Holding... ${Math.round(progress * 100)}%` : label}</span>
          </>
        )}
      </span>
    </button>
  );
}

