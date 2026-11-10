"use client";

import React from "react";
import Link from "next/link";
import { TopBanner } from "@/components/sites/spade/TopBanner";
import { Navbar } from "@/components/sites/spade/Navbar";
import { Footer } from "@/components/sites/spade/Footer";
import { Magnet } from "@/components/reactbits/Magnet";
import { BlurText } from "@/components/reactbits/BlurText";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import {
  ShieldCheck,
  CreditCard,
  Languages,
  CheckCircle2,
  FileCheck2,
  ArrowRight,
  TrendingUp,
  Factory,
  Ship,
  Sparkles,
  Lock,
} from "lucide-react";

export default function ManufacturerSolutionPage() {
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
          {/* Ruler Ticks */}
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
              {/* Chamfered Cut Corners */}
              <div className="pointer-events-none absolute inset-0 z-10">
                <div className="cut-corner absolute bg-white" style={{ top: "-1px", left: "-1px", clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
                <div className="cut-corner absolute bg-white" style={{ top: "-1px", right: "-1px", clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
                <div className="cut-corner absolute bg-white" style={{ bottom: "-1px", left: "-1px", clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />
                <div className="cut-corner absolute bg-white" style={{ bottom: "-1px", right: "-1px", clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }} />
              </div>

              <div className="mx-auto flex w-full max-w-[68rem] flex-col items-center px-5 text-center lg:px-12">
                {/* Role Pill Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18280E] text-[#b2eb76] text-xs font-mono font-bold uppercase tracking-wider mb-6 shadow-xs">
                  <Factory className="w-3.5 h-3.5" />
                  <span>For Indian MSMEs, Foundries &amp; Industrial Exporters</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-[#18280E] max-w-4xl tracking-tight leading-[1.08] text-center font-sans">
                  Export with 30% upfront PayPal escrow and zero payment disputes.
                </h1>

                {/* Subheadline */}
                <p className="mt-6 max-w-2xl text-base sm:text-lg text-stone-700 leading-relaxed font-sans">
                  We translate complicated foreign engineering requirements into plain, simple language so you know exactly what the foreign buyer wants. Receive guaranteed 30% PayPal advance deposits before buying raw materials, get independent quality inspections, and generate automatic e-FIRC certificates for your bank.
                </p>

                {/* Primary CTA Buttons */}
                <div className="mt-9 flex flex-col sm:flex-row items-center gap-4 z-20">
                  <Magnet padding={20} magnetStrength={3}>
                    <Link
                      href="/signin?role=manufacturer"
                      className="group relative inline-flex appearance-none items-center py-3.5 select-none transition-[color] justify-center text-white min-h-[48px] px-8 cursor-pointer rounded-xl bg-[#18280E] hover:bg-[#253d16] font-mono text-sm font-bold shadow-md"
                    >
                      <span className="flex items-center gap-2">
                        <span>Sign In to Manufacturer Portal</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </Magnet>

                  <Link
                    href="/signup?role=manufacturer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-900 font-mono text-sm font-bold transition-colors shadow-2xs"
                  >
                    <span>Apply for MSME Factory Whitelist</span>
                  </Link>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs font-mono text-stone-500">
                  <Lock className="w-3.5 h-3.5 text-[#3f7308]" />
                  <span>Secure operator credentials required to enter dashboard</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* VALUE PILLARS FOR MANUFACTURERS                                           */}
        {/* ========================================================================= */}
        <section className="py-20 px-5 lg:px-8 max-w-[80rem] mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#3f7308] font-bold">
              Solving the Core Indian Exporter Problems
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#18280e] tracking-tight">
              One connected transaction record from initial inquiry to final bank remittance.
            </h2>
            <p className="text-sm sm:text-base text-stone-600">
              International trade should not depend on disconnected WhatsApp messages, delayed bank wire swift copies, or unexpected chargebacks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <SpotlightCard className="p-8 rounded-3xl bg-[#fbfdf9] border border-stone-200/90 shadow-xs space-y-4">
              <div className="size-12 rounded-2xl bg-[#ebf7d9] text-[#18280e] flex items-center justify-center font-bold">
                <Languages className="w-6 h-6 text-[#3f7308]" />
              </div>
              <h3 className="text-xl font-bold text-[#18280e] font-sans">
                Plain-English Layman Translations
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                Foreign buyers write complex engineering specifications and confusing Incoterms. TradeOracle translates them into plain words: exactly what product is needed, quantity in units, total deal value in Lakhs, and clear packaging standards.
              </p>
              <div className="p-3 rounded-xl bg-white border border-[#d8e5ca] text-xs font-mono text-[#18280e] space-y-1">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Example:</span>
                <span>3,500 Brass mortise handles for California beach hotels (anti-tarnish salt spray coating). Total: ₹71.5 Lakhs.</span>
              </div>
            </SpotlightCard>

            {/* Pillar 2 */}
            <SpotlightCard className="p-8 rounded-3xl bg-[#fbfdf9] border border-stone-200/90 shadow-xs space-y-4">
              <div className="size-12 rounded-2xl bg-[#ebf7d9] text-[#18280e] flex items-center justify-center font-bold">
                <CreditCard className="w-6 h-6 text-[#3f7308]" />
              </div>
              <h3 className="text-xl font-bold text-[#18280e] font-sans">
                Guaranteed 30% PayPal Upfront Escrow
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                Never pour metal or cut steel without secured funding. The foreign buyer deposits a 30% advance deposit into verified PayPal escrow before manufacturing starts. The remaining 70% balance is released against independent inspection and Bill of Lading.
              </p>
              <div className="p-3 rounded-xl bg-white border border-[#d8e5ca] text-xs font-mono text-[#18280e] space-y-1">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Milestones:</span>
                <span>30% Advance Escrow Held → QIMA Pre-Shipment Audit → 70% Released at Mundra Port.</span>
              </div>
            </SpotlightCard>

            {/* Pillar 3 */}
            <SpotlightCard className="p-8 rounded-3xl bg-[#fbfdf9] border border-stone-200/90 shadow-xs space-y-4">
              <div className="size-12 rounded-2xl bg-[#ebf7d9] text-[#18280e] flex items-center justify-center font-bold">
                <FileCheck2 className="w-6 h-6 text-[#3f7308]" />
              </div>
              <h3 className="text-xl font-bold text-[#18280e] font-sans">
                Automated e-FIRC &amp; Zero Dispute Risk
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                Because QIMA pre-shipment inspections and ICEGATE shipping bills are cryptographically tied to the PayPal transaction ID, buyers cannot claim non-delivery or chargebacks. Automatic RBI e-FIRC records make CA audits and GST LUT reporting seamless.
              </p>
              <div className="p-3 rounded-xl bg-white border border-[#d8e5ca] text-xs font-mono text-[#18280e] space-y-1">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Compliance:</span>
                <span>DGFT IEC + ICEGATE Shipping Bill + PayPal Capture ID = Instant Bank Realization.</span>
              </div>
            </SpotlightCard>
          </div>

          {/* New WhatsApp Integration Spotlight for Indian Factory Owners */}
          <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#25D366]/10 via-[#128C7E]/10 to-[#ebf7d9] border border-[#25D366]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-2 max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25D366] text-white text-[11px] font-mono font-bold">
                <span>💬 WhatsApp Live Order &amp; Payment Updates</span>
              </div>
              <h3 className="text-2xl font-bold text-[#18280E] font-sans">
                Get every order update in simple, plain language on WhatsApp.
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                No struggling with trade jargon or complex customs portals. Whenever a foreign buyer places an order, pays the 30% PayPal advance, passes inspection, or releases bank funds, TradeOracle sends a simple, plain-English summary directly to your mobile phone.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-md font-mono text-xs space-y-1.5 shrink-0 max-w-xs">
              <span className="text-[10px] text-[#075E54] font-bold uppercase block">Sample WhatsApp Alert:</span>
              <p className="text-[11px] text-stone-800 leading-relaxed">
                🟢 <strong>₹21.45 Lakhs Advance Paid!</strong><br />
                Buyer deposited 30% into PayPal for 1,500 Brass Handles. Money is safe in escrow. You can start production.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* HOW THE MANUFACTURER WORKSPACE WORKS                                      */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#f4faed] border-y border-[#d8e5ca]/80 px-5 lg:px-8">
          <div className="max-w-[72rem] mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-mono font-bold text-[#3f7308] uppercase">
                Step-by-Step Execution Journey
              </span>
              <h2 className="text-3xl font-extrabold text-[#18280e] tracking-tight font-sans">
                What you do inside the Manufacturer Dashboard
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2">
                <span className="text-2xl font-bold text-[#3f7308]">01</span>
                <strong className="text-sm text-[#18280e] block font-sans">Review Layman RFQ</strong>
                <p className="text-stone-600 text-xs font-sans">
                  Open incoming international buyer orders explained in plain words with exact unit counts and deal totals in INR.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2">
                <span className="text-2xl font-bold text-[#3f7308]">02</span>
                <strong className="text-sm text-[#18280e] block font-sans">Lock Deal &amp; Escrow</strong>
                <p className="text-stone-600 text-xs font-sans">
                  Slide to lock the commercial deal. The buyer deposits 30% advance directly into PayPal escrow to fund raw materials.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2">
                <span className="text-2xl font-bold text-[#3f7308]">03</span>
                <strong className="text-sm text-[#18280e] block font-sans">QIMA Inspection</strong>
                <p className="text-stone-600 text-xs font-sans">
                  Independent inspectors audit finished batches at your factory. Passing the audit confirms the goods are ready for port dispatch.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2">
                <span className="text-2xl font-bold text-[#3f7308]">04</span>
                <strong className="text-sm text-[#18280e] block font-sans">Bill of Lading &amp; 70% Payout</strong>
                <p className="text-stone-600 text-xs font-sans">
                  Upload the ICEGATE Let Export Order &amp; Ocean Bill of Lading. PayPal instantly releases the 70% balance into your bank account.
                </p>
              </div>
            </div>

            {/* Bottom Login Gate Banner */}
            <div className="p-8 rounded-3xl bg-[#18280E] text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
              <div>
                <span className="text-xs font-mono text-[#b2eb76] font-bold uppercase tracking-wider block mb-1">
                  Ready to Access Your Factory Dashboard?
                </span>
                <h3 className="text-2xl font-bold font-sans">
                  Enter the Indian Manufacturer Workspace
                </h3>
                <p className="text-xs text-stone-300 mt-1 max-w-xl font-sans">
                  Sign in with your verified exporter credentials to manage purchase orders, track PayPal advances, and file export documentation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <Link
                  href="/signin?role=manufacturer"
                  className="px-6 py-3.5 rounded-xl bg-[#b2eb76] hover:bg-[#c2f38d] text-[#18280E] font-mono font-bold text-sm transition-colors shadow-md flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Log In to Manufacturer Dashboard →</span>
                </Link>
                <Link
                  href="/signup?role=manufacturer"
                  className="px-5 py-3 rounded-xl border border-white/20 hover:bg-white/10 text-white font-mono text-xs font-bold transition-colors"
                >
                  Sign Up Factory
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

