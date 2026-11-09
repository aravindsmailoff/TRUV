"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ShinyText } from "@/components/reactbits/ShinyText";

export function TopBanner() {
  return (
    <div className="w-full bg-[#c9753d] text-[#18280e] text-xs font-mono py-2 px-5 lg:px-8 border-b border-black/10 select-none">
      <div className="max-w-[80rem] mx-auto flex items-center justify-between">
        <Link
          href="#trade-execution"
          className="flex items-center gap-1 font-semibold uppercase tracking-wider hover:opacity-80 transition-opacity"
        >
          <span>TRUV Trade Execution</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-[#f4faed] text-[10px] font-bold uppercase tracking-wider text-[#18280e]">
            Live Corridor
          </span>
          <Link
            href="#trade-execution"
            className="hidden sm:inline font-medium uppercase tracking-wider hover:underline"
          >
            <ShinyText text="USA & Europe → India Industrial Hubs (Moradabad, Tirupur, Rajkot)" speed={3.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}
