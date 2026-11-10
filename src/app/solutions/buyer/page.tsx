"use client";

import React from "react";
import Link from "next/link";
import { TopBanner } from "@/components/sites/spade/TopBanner";
import { Navbar } from "@/components/sites/spade/Navbar";
import { Footer } from "@/components/sites/spade/Footer";
import { Magnet } from "@/components/reactbits/Magnet";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import {
  Globe,
  Search,
  CheckCircle2,
  FileText,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  ClipboardCheck,
  Building,
  Lock,
} from "lucide-react";

export default function BuyerSolutionPage() {
  const ticks = Array.from({ length: 42 });

  return (
    <div className="min-h-screen bg-white text-[#18280E] flex flex-col selection:bg-[#b2eb76] selection:text-[#18280E] font-sans">
      <TopBanner />
      <Navbar />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* HERO SECTION                                                              */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden bg-white text-black pt-0 pb-0 px-5 lg:px-8">
          <div className="absolute top-2 bottom-0 flex w-4.5 flex-col space-y-7 overflow-y-clip left-0 max-lg:hidden" aria-hidden="true">
            {ticks.map((_, i) => (
              <div key={i} className={`h-px shrink-0 bg-black ${i % 5 === 0 ? "w-4.5" : "w-2.5"}`} />
            ))}
          </div>
          <div className="absolute top-2 bottom-0 flex w-4.5 flex-col space-y-7 overflow-y-clip right-0 items-end max-lg:hidden" aria-hidden="true">
            {ticks.map((_, i) => (
              <div key={i} className={`h-px shrink-0 bg-black ${i % 5 === 0 ? "w-4.5" : "w-2.5"}`} />
            ))}
          </div>

          <div className="lg:-mt-[1.375rem]">
            <div
              className="relative bg-[#f0fae6] py-14 max-md:-mx-5 md:py-20 lg:pt-24 lg:pb-24 xl:pb-32"
              style={{ "--corner-size-desktop": "17px", "--corner-size-mobile": "13px" } as React.CSSProperties}
            >
              <div className="pointer-events-none absolute inset-0 z-10">
                <div className="cut-corner absolute bg-white" style={{ top: "-1px", left: "-1px", clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
                <div className="cut-corner absolute bg-white" style={{ top: "-1px", right: "-1px", clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
                <div className="cut-corner absolute bg-white" style={{ bottom: "-1px", left: "-1px", clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />
                <div className="cut-corner absolute bg-white" style={{ bottom: "-1px", right: "-1px", clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }} />
              </div>

              <div className="mx-auto flex w-full max-w-[68rem] flex-col items-center px-5 text-center lg:px-12">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18280E] text-[#b2eb76] text-xs font-mono font-bold uppercase tracking-wider mb-6 shadow-xs">
                  <Globe className="w-3.5 h-3.5" />
                  <span>For Foreign Buyers, Global Importers &amp; Procurement Heads</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-[#18280E] max-w-4xl tracking-tight leading-[1.08] text-center font-sans">
                  Source from India with milestone-backed PayPal escrow.
                </h1>

                <p className="mt-6 max-w-2xl text-base sm:text-lg text-stone-700 leading-relaxed font-sans">
                  Discover pre-vetted Indian manufacturers and IT service providers. Submit sourcing RFQs, compare verified quotations side-by-side, pay eligible suppliers securely via PayPal milestone escrow, and track independent QIMA pre-shipment quality audits.
                </p>

                <div className="mt-9 flex flex-col sm:flex-row items-center gap-4 z-20">
                  <Magnet padding={20} magnetStrength={3}>
                    <Link
                      href="/signin?role=buyer"
                      className="group relative inline-flex appearance-none items-center py-3.5 select-none transition-[color] justify-center text-white min-h-[48px] px-8 cursor-pointer rounded-xl bg-[#18280E] hover:bg-[#253d16] font-mono text-sm font-bold shadow-md"
                    >
                      <span className="flex items-center gap-2">
                        <span>Sign In to Buyer Portal</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </Magnet>

                  <Link
                    href="/signup?role=buyer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-900 font-mono text-sm font-bold transition-colors shadow-2xs"
                  >
                    <span>Register Global Buyer Account</span>
                  </Link>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs font-mono text-stone-500">
                  <Lock className="w-3.5 h-3.5 text-[#3f7308]" />
                  <span>Buyer procurement credentials required to access portal</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* VALUE PILLARS FOR BUYERS                                                  */}
        {/* ========================================================================= */}
        <section className="py-20 px-5 lg:px-8 max-w-[80rem] mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#3f7308] font-bold">
              Eliminating International Sourcing Blindspots
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#18280e] tracking-tight">
              Connect what was promised, what was paid, and what was delivered.
            </h2>
            <p className="text-sm sm:text-base text-stone-600">
              Stop wire-transferring 100% upfront capital to unknown factories without quality verification or delivery guarantees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SpotlightCard className="p-8 rounded-3xl bg-[#fbfdf9] border border-stone-200/90 shadow-xs space-y-4">
              <div className="size-12 rounded-2xl bg-[#ebf7d9] text-[#18280e] flex items-center justify-center font-bold">
                <Search className="w-6 h-6 text-[#3f7308]" />
              </div>
              <h3 className="text-xl font-bold text-[#18280e] font-sans">
                Verified Indian Supplier Discovery
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                Search verified manufacturers across brassware, CNC forgings, precision castings, and apparel. Every supplier is vetted with government DGFT IEC licenses, GSTIN records, factory audits, and production capacity benchmarks.
              </p>
              <div className="p-3 rounded-xl bg-white border border-[#d8e5ca] text-xs font-mono text-[#18280e] space-y-1">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Verification Standard:</span>
                <span>DGFT IEC + Udyam MSME Registry + ISO 9001:2015 Audit On File.</span>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-8 rounded-3xl bg-[#fbfdf9] border border-stone-200/90 shadow-xs space-y-4">
              <div className="size-12 rounded-2xl bg-[#ebf7d9] text-[#18280e] flex items-center justify-center font-bold">
                <CreditCard className="w-6 h-6 text-[#3f7308]" />
              </div>
              <h3 className="text-xl font-bold text-[#18280e] font-sans">
                PayPal Orders v2 Milestone Escrow
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                Execute cross-border payments with PayPal commercial protection. Release a 30% advance deposit to start production. The 70% balance remains securely held in escrow until independent inspectors approve the finished goods.
              </p>
              <div className="p-3 rounded-xl bg-white border border-[#d8e5ca] text-xs font-mono text-[#18280e] space-y-1">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Security:</span>
                <span>Funds held in escrow → Released only when QIMA audits pass.</span>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-8 rounded-3xl bg-[#fbfdf9] border border-stone-200/90 shadow-xs space-y-4">
              <div className="size-12 rounded-2xl bg-[#ebf7d9] text-[#18280e] flex items-center justify-center font-bold">
                <ClipboardCheck className="w-6 h-6 text-[#3f7308]" />
              </div>
              <h3 className="text-xl font-bold text-[#18280e] font-sans">
                Independent Quality Inspections
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                Receive certified pre-shipment inspection reports from QIMA and SGS before goods leave the factory floor. Inspect photos, AQL defect sampling rates, and salt spray test certificates directly inside your buyer dashboard.
              </p>
              <div className="p-3 rounded-xl bg-white border border-[#d8e5ca] text-xs font-mono text-[#18280e] space-y-1">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Quality Guarantee:</span>
                <span>AQL 1.5/4.0 Standard + Physical Sampling + Packaging Drop Tests.</span>
              </div>
            </SpotlightCard>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* HOW THE BUYER WORKSPACE WORKS                                             */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#f4faed] border-y border-[#d8e5ca]/80 px-5 lg:px-8">
          <div className="max-w-[72rem] mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-mono font-bold text-[#3f7308] uppercase">
                End-to-End Procurement Workflow
              </span>
              <h2 className="text-3xl font-extrabold text-[#18280e] tracking-tight font-sans">
                What you do inside the Foreign Buyer Portal
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2">
                <span className="text-2xl font-bold text-[#3f7308]">01</span>
                <strong className="text-sm text-[#18280e] block font-sans">Create RFQ</strong>
                <p className="text-stone-600 text-xs font-sans">
                  Define technical specifications, target quantity, material alloy, and port destination.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2">
                <span className="text-2xl font-bold text-[#3f7308]">02</span>
                <strong className="text-sm text-[#18280e] block font-sans">Compare Quotes</strong>
                <p className="text-stone-600 text-xs font-sans">
                  Review side-by-side quotations from verified Indian factories and select the optimal terms.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2">
                <span className="text-2xl font-bold text-[#3f7308]">03</span>
                <strong className="text-sm text-[#18280e] block font-sans">PayPal Advance</strong>
                <p className="text-stone-600 text-xs font-sans">
                  Deposit 30% advance into PayPal escrow. Order automatically moves into active production.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2">
                <span className="text-2xl font-bold text-[#3f7308]">04</span>
                <strong className="text-sm text-[#18280e] block font-sans">Audit &amp; Release</strong>
                <p className="text-stone-600 text-xs font-sans">
                  Review QIMA quality report and Ocean Bill of Lading before authorizing the 70% balance release.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#18280E] text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
              <div>
                <span className="text-xs font-mono text-[#b2eb76] font-bold uppercase tracking-wider block mb-1">
                  Ready to Source from India?
                </span>
                <h3 className="text-2xl font-bold font-sans">
                  Enter the Foreign Buyer Portal
                </h3>
                <p className="text-xs text-stone-300 mt-1 max-w-xl font-sans">
                  Sign in with your procurement credentials to discover suppliers, manage international RFQs, and track milestone escrow payments.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <Link
                  href="/signin?role=buyer"
                  className="px-6 py-3.5 rounded-xl bg-[#b2eb76] hover:bg-[#c2f38d] text-[#18280E] font-mono font-bold text-sm transition-colors shadow-md flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Log In to Buyer Portal →</span>
                </Link>
                <Link
                  href="/signup?role=buyer"
                  className="px-5 py-3 rounded-xl border border-white/20 hover:bg-white/10 text-white font-mono text-xs font-bold transition-colors"
                >
                  Register Buyer
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

