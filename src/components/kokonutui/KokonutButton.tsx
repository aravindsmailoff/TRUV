"use client";

import React from "react";
import { Magnet } from "@/components/reactbits/Magnet";

interface KokonutButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  withMagnet?: boolean;
  className?: string;
}

export function KokonutButton({
  children,
  variant = "primary",
  size = "md",
  withMagnet = false,
  className = "",
  disabled,
  ...props
}: KokonutButtonProps) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-4 py-2 text-xs rounded-xl gap-2",
    lg: "px-5 py-2.5 text-sm rounded-xl gap-2.5",
  };

  const variantClasses = {
    primary:
      "bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] font-bold border border-[#2d4d1a] shadow-xs active:scale-[0.98] transition-all hover:shadow-md",
    secondary:
      "bg-[#ebf7d9] hover:bg-[#d8e5ca] text-[#18280e] font-bold border border-[#d8e5ca] active:scale-[0.98] transition-all",
    outline:
      "bg-white hover:bg-[#f4faed] text-[#18280e] font-semibold border border-stone-200 active:scale-[0.98] transition-all hover:border-[#18280e]/40",
    ghost:
      "bg-transparent hover:bg-[#ebf7d9]/60 text-stone-700 hover:text-[#18280e] font-medium transition-all",
  };

  const buttonElement = (
    <button
      disabled={disabled}
      className={`relative inline-flex items-center justify-center font-mono select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );

  if (withMagnet && !disabled) {
    return (
      <Magnet padding={15} magnetStrength={2}>
        {buttonElement}
      </Magnet>
    );
  }

  return buttonElement;
}
