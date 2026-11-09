"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DashboardMockup } from "@/components/sites/spade/DashboardMockup";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#e8ecf2] p-3 sm:p-6 lg:p-10 font-sans">
      <div className="max-w-[85rem] mx-auto space-y-4">
        {/* Navigation back bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-stone-900 text-xs font-mono font-medium shadow-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to TRUV Platform</span>
          </Link>

          <span className="text-xs font-mono text-stone-500 font-medium">
            Manufacturer &amp; Trade Execution Dashboard View
          </span>
        </div>

        {/* The Exact Dashboard Matching Image 1 */}
        <DashboardMockup />
      </div>
    </div>
  );
}
