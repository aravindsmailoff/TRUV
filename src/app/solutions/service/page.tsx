"use client";

import React from "react";
import Link from "next/link";
import { TopBanner } from "@/components/sites/spade/TopBanner";
import { Navbar } from "@/components/sites/spade/Navbar";
import { Footer } from "@/components/sites/spade/Footer";
import { Magnet } from "@/components/reactbits/Magnet";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import {
  Code2,
  GitPullRequest,
  ShieldCheck,
  CreditCard,
  FileCode2,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Download,
  Lock,
} from "lucide-react";

export default function ServiceSolutionPage() {
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
                  <Code2 className="w-3.5 h-3.5" />
                  <span>For Indian Tech Freelancers, Software Labs &amp; IT Agencies</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-[#18280E] max-w-4xl tracking-tight leading-[1.08] text-center font-sans">
                  Export IT services with milestone escrow and GitHub PR proof.
                </h1>

                <p className="mt-6 max-w-2xl text-base sm:text-lg text-stone-700 leading-relaxed font-sans">
                  Protect your software agency from scope creep and chargebacks. Lock client SOWs with PayPal milestone escrow, submit Git PR commit hashes and Vercel preview links as immutable delivery proof, and receive instant RBI e-FIRC certificates for zero-rated GST export compliance.
                </p>

                <div className="mt-9 flex flex-col sm:flex-row items-center gap-4 z-20">
                  <Magnet padding={20} magnetStrength={3}>
                    <Link
                      href="/signin?role=service"
                      className="group relative inline-flex appearance-none items-center py-3.5 select-none transition-[color] justify-center text-white min-h-[48px] px-8 cursor-pointer rounded-xl bg-[#18280E] hover:bg-[#253d16] font-mono text-sm font-bold shadow-md"
                    >
                      <span className="flex items-center gap-2">
                        <span>Sign In to Service Portal</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </Magnet>

                  <Link
                    href="/signup?role=service"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-900 font-mono text-sm font-bold transition-colors shadow-2xs"
                  >
                    <span>Register Agency / Freelancer</span>
                  </Link>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs font-mono text-stone-500">
                  <Lock className="w-3.5 h-3.5 text-[#3f7308]" />
                  <span>Service agency credentials required to enter dashboard</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* VALUE PILLARS FOR SERVICE EXPORTERS                                       */}
        {/* ========================================================================= */}
        <section className="py-20 px-5 lg:px-8 max-w-[80rem] mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#3f7308] font-bold">
              Solving Service Export Insecurity
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#18280e] tracking-tight">
              What was promised, what was delivered, and what was paid.
            </h2>
            <p className="text-sm sm:text-base text-stone-600">
              Foreign clients often dispute service deliveries after receiving code repositories. TradeOracle creates an indisputable delivery record.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SpotlightCard className="p-8 rounded-3xl bg-[#fbfdf9] border border-stone-200/90 shadow-xs space-y-4">
              <div className="size-12 rounded-2xl bg-[#ebf7d9] text-[#18280e] flex items-center justify-center font-bold">
                <FileCode2 className="w-6 h-6 text-[#3f7308]" />
              </div>
              <h3 className="text-xl font-bold text-[#18280e] font-sans">
                Commercial SOW Enforcement
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                Turn informal Slack chats into structured, enforceable Scope of Work (SOW) agreements. Lock project milestones (e.g., M1 Figma architecture, M2 Core API RAG pipeline, M3 Production deployment) with exact dollar amounts.
              </p>
              <div className="p-3 rounded-xl bg-white border border-[#d8e5ca] text-xs font-mono text-[#18280e] space-y-1">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Example Contract:</span>
                <span>Next.js AI Enterprise SaaS Platform ($5,000 USD) • 3 Milestone Stages.</span>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-8 rounded-3xl bg-[#fbfdf9] border border-stone-200/90 shadow-xs space-y-4">
              <div className="size-12 rounded-2xl bg-[#ebf7d9] text-[#18280e] flex items-center justify-center font-bold">
                <GitPullRequest className="w-6 h-6 text-[#3f7308]" />
              </div>
              <h3 className="text-xl font-bold text-[#18280e] font-sans">
                Immutable Git &amp; Preview Proofs
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                Submit private GitHub PR URLs, Git SHA-1 commit hashes, live Vercel staging preview links, and Loom video demos directly into the milestone record. TradeOracle timestamps and cryptographically seals the submission.
              </p>
              <div className="p-3 rounded-xl bg-white border border-[#d8e5ca] text-xs font-mono text-[#18280e] space-y-1">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Proof Evidence:</span>
                <span>PR #14 + Commit 9e12cd458 + Staging URL + Automated 5-day client review timer.</span>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-8 rounded-3xl bg-[#fbfdf9] border border-stone-200/90 shadow-xs space-y-4">
              <div className="size-12 rounded-2xl bg-[#ebf7d9] text-[#18280e] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6 text-[#3f7308]" />
              </div>
              <h3 className="text-xl font-bold text-[#18280e] font-sans">
                100% Dispute &amp; Chargeback Defense
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                If a foreign client attempts a bad-faith chargeback or PayPal claim, click one button to generate a certified Dispute Defense Pack (.zip) containing the signed SOW, Git commit history, and client review logs for immediate win in the PayPal Resolution Center.
              </p>
              <div className="p-3 rounded-xl bg-white border border-[#d8e5ca] text-xs font-mono text-[#18280e] space-y-1">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Bank FIRC:</span>
                <span>Automatic RBI e-FIRC generated with AD code for GST zero-rated export with LUT.</span>
              </div>
            </SpotlightCard>
          </div>

          {/* WhatsApp Milestone Alert Center */}
          <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#25D366]/10 via-emerald-50 to-[#ebf7d9] border border-[#25D366]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-2 max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25D366] text-white text-[11px] font-mono font-bold">
                <span>💬 WhatsApp Freelancer Escrow Alerts</span>
              </div>
              <h3 className="text-2xl font-bold text-[#18280E] font-sans">
                Never miss a client milestone deposit or approved payout.
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                Receive instant WhatsApp notifications when overseas clients fund milestone escrows on PayPal, when GitHub PR proofs are recorded, and when funds are deposited directly to your Indian bank account with automated service export e-FIRC compliance.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-md font-mono text-xs space-y-1.5 shrink-0 max-w-xs">
              <span className="text-[10px] text-[#075E54] font-bold uppercase block">Service WhatsApp Alert:</span>
              <p className="text-[11px] text-stone-800 leading-relaxed">
                🎉 <strong>Milestone Escrow Funded!</strong><br />
                Client deposited $2,500 USD into PayPal. Escrow is locked. You can start engineering safely.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* HOW THE SERVICE WORKSPACE WORKS                                           */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#f4faed] border-y border-[#d8e5ca]/80 px-5 lg:px-8">
          <div className="max-w-[72rem] mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-mono font-bold text-[#3f7308] uppercase">
                Service Export Workflow
              </span>
              <h2 className="text-3xl font-extrabold text-[#18280e] tracking-tight font-sans">
                What you do inside the Freelancer Service Portal
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2">
                <span className="text-2xl font-bold text-[#3f7308]">01</span>
                <strong className="text-sm text-[#18280e] block font-sans">Define SOW</strong>
                <p className="text-stone-600 text-xs font-sans">
                  Agree on tech stack, milestone deliverables, and payment breakdown with foreign client.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2">
                <span className="text-2xl font-bold text-[#3f7308]">02</span>
                <strong className="text-sm text-[#18280e] block font-sans">Client Funds Escrow</strong>
                <p className="text-stone-600 text-xs font-sans">
                  Client deposits 30% upfront milestone into PayPal escrow before development begins.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2">
                <span className="text-2xl font-bold text-[#3f7308]">03</span>
                <strong className="text-sm text-[#18280e] block font-sans">Submit Git Proof</strong>
                <p className="text-stone-600 text-xs font-sans">
                  Submit GitHub PR, commit hash, and staging preview URL to trigger milestone review.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2">
                <span className="text-2xl font-bold text-[#3f7308]">04</span>
                <strong className="text-sm text-[#18280e] block font-sans">Payout &amp; e-FIRC</strong>
                <p className="text-stone-600 text-xs font-sans">
                  Client approves or auto-timer releases payout directly to Indian bank with certified e-FIRC.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#18280E] text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
              <div>
                <span className="text-xs font-mono text-[#b2eb76] font-bold uppercase tracking-wider block mb-1">
                  Ready to Manage Service Exports?
                </span>
                <h3 className="text-2xl font-bold font-sans">
                  Enter the Freelancer Service Portal
                </h3>
                <p className="text-xs text-stone-300 mt-1 max-w-xl font-sans">
                  Sign in with your tech agency or developer credentials to track contracts, submit delivery proofs, and withdraw milestone escrow payouts.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <Link
                  href="/signin?role=service"
                  className="px-6 py-3.5 rounded-xl bg-[#b2eb76] hover:bg-[#c2f38d] text-[#18280E] font-mono font-bold text-sm transition-colors shadow-md flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Log In to Service Portal →</span>
                </Link>
                <Link
                  href="/signup?role=service"
                  className="px-5 py-3 rounded-xl border border-white/20 hover:bg-white/10 text-white font-mono text-xs font-bold transition-colors"
                >
                  Register Agency
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

