"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileCode2,
  GitPullRequest,
  CreditCard,
  ShieldCheck,
  Briefcase,
  Settings,
  CheckCircle2,
  Send,
  Download,
  LogOut,
  Calendar,
  Sparkles,
  Code2,
  Globe,
  DollarSign,
  Info,
} from "lucide-react";
import {
  ServiceProject,
  ServiceMilestone,
  INITIAL_SERVICE_PROJECTS,
} from "@/lib/service/freelancerStore";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { ClickSpark } from "@/components/reactbits/ClickSpark";
import { CountUp } from "@/components/reactbits/CountUp";
import { KokonutButton } from "@/components/kokonutui/KokonutButton";
import { setCurrentSessionUser } from "@/lib/auth/authStore";

export function FreelancerServicePortal() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "contracts" | "milestones" | "payouts" | "disputes" | "rfqs" | "sandbox_guide" | "settings"
  >("dashboard");

  const [projects, setProjects] = useState<ServiceProject[]>(INITIAL_SERVICE_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<ServiceProject>(INITIAL_SERVICE_PROJECTS[0]);
  const [selectedMilestone, setSelectedMilestone] = useState<ServiceMilestone>(
    INITIAL_SERVICE_PROJECTS[0].milestones[1]
  );

  // Form state for milestone delivery proof submission
  const [prUrl, setPrUrl] = useState("https://github.com/apexcloud/enterprise-saas/pull/14");
  const [commitHash, setCommitHash] = useState("9e12cd458a01bc7f");
  const [stagingUrl, setStagingUrl] = useState("https://staging.apexcloud.dev");
  const [loomUrl, setLoomUrl] = useState("https://loom.com/share/core-api-demo-v2");
  const [proofSubmitted, setProofSubmitted] = useState(false);

  // PayPal Sandbox test state
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [paypalResult, setPaypalResult] = useState<{
    id?: string;
    status?: string;
    approveUrl?: string;
    amount?: string;
  } | null>(null);

  const handleTriggerPayPalMilestone = async () => {
    setPaypalLoading(true);
    try {
      const res = await fetch("/api/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_paypal_payment",
          tradeId: "trade_live_7719",
          isAdvance: true,
        }),
      });
      const data = await res.json();
      if (data.success && data.paymentOrder) {
        const approveLink =
          data.paymentOrder.links?.find((l: { rel: string; href: string }) => l.rel === "approve")?.href ||
          `https://www.sandbox.paypal.com/checkoutnow?token=${data.paymentOrder.id}`;
        setPaypalResult({
          id: data.paymentOrder.id,
          status: data.paymentOrder.status,
          approveUrl: approveLink,
          amount: "$1,500.00 USD (Software Milestone 1 Escrow)",
        });
      }
    } catch {
      // fallback
    } finally {
      setPaypalLoading(false);
    }
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    setProofSubmitted(true);
    // update milestone
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === selectedProject.id) {
          return {
            ...proj,
            status: "Under Client Review",
            milestones: proj.milestones.map((m) =>
              m.id === selectedMilestone.id
                ? {
                    ...m,
                    status: "in_review",
                    evidence: {
                      prUrl,
                      commitHash,
                      stagingUrl,
                      loomUrl,
                      deliveredAt: new Date().toISOString(),
                      clientSignOff: false,
                    },
                  }
                : m
            ),
          };
        }
        return proj;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#f4faed] text-[#18280e] font-sans selection:bg-[#b2eb76] selection:text-[#18280e] flex relative">
      <ClickSpark sparkColor="#b2eb76" sparkCount={9} sparkRadius={26} duration={400} />

      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR                                                           */}
      {/* ========================================================================= */}
      <aside className="w-72 bg-white border-r border-stone-200/80 flex flex-col justify-between shrink-0 min-h-screen sticky top-0 z-30 shadow-xs">
        <div className="overflow-y-auto max-h-screen scrollbar-none flex flex-col">
          {/* Brand Logo Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-stone-100/90">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-[#18280e] flex items-center justify-center text-[#b2eb76] font-black text-sm shadow-xs transition-transform group-hover:scale-105">
                TO
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-[#18280e] font-sans group-hover:text-[#3f7308] transition-colors leading-none">
                  TradeOracle<span className="text-[#3f7308]">.</span>
                </span>
                <span className="text-[10px] font-mono text-stone-400 font-semibold tracking-wider uppercase mt-1">
                  Service Exporters
                </span>
              </div>
            </Link>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200/70">
              FREELANCER
            </span>
          </div>

          {/* Quick Portals Switcher */}
          <div className="p-3 border-b border-stone-100 bg-[#fbfdf9]">
            <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 font-bold px-2 block mb-1">
              Switch Workspace Portal
            </span>
            <div className="space-y-1">
              <Link
                href="/dashboard"
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e] text-xs font-medium transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-stone-500" />
                  <span>Indian Manufacturer</span>
                </div>
                <span className="text-[9px] font-mono text-stone-400">PHYSICAL</span>
              </Link>
              <Link
                href="/buyer"
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e] text-xs font-medium transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-[#3f7308]" />
                  <span>Foreign Buyer Portal</span>
                </div>
                <span className="text-[9px] font-mono text-stone-400">GLOBAL</span>
              </Link>
              <div className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-[#18280e] text-[#b2eb76] font-semibold text-xs shadow-xs">
                <div className="flex items-center gap-2">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Freelancer Service Portal</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-[#b2eb76]" />
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3.5 space-y-1 text-xs font-medium">
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold px-3 py-1 block">
              Service Management
            </span>

            {/* Dashboard */}
            <button
              type="button"
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : "text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Dashboard</span>
              </div>
              {activeTab === "dashboard" && <span className="w-1.5 h-1.5 rounded-full bg-[#b2eb76]" />}
            </button>

            {/* Contracts & SOW */}
            <button
              type="button"
              onClick={() => setActiveTab("contracts")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "contracts"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : "text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
              }`}
            >
              <div className="flex items-center gap-3">
                <FileCode2 className="w-4 h-4 shrink-0" />
                <span>Contracts &amp; SOW</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ebf7d9] text-[#284905] font-bold">
                2 Active
              </span>
            </button>

            {/* Milestone Submitter */}
            <button
              type="button"
              onClick={() => setActiveTab("milestones")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "milestones"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : "text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
              }`}
            >
              <div className="flex items-center gap-3">
                <GitPullRequest className="w-4 h-4 shrink-0" />
                <span>Delivery &amp; Git Proof</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                Due Soon
              </span>
            </button>

            {/* PayPal Payouts & FIRC */}
            <button
              type="button"
              onClick={() => setActiveTab("payouts")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "payouts"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : "text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 shrink-0" />
                <span>PayPal Escrow &amp; FIRC</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ebf7d9] text-[#284905] font-bold">
                $3.5k Held
              </span>
            </button>

            {/* Dispute Shield */}
            <button
              type="button"
              onClick={() => setActiveTab("disputes")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "disputes"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : "text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#3f7308]" />
                <span>Dispute Protection</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                100% Win
              </span>
            </button>

            {/* International RFQs */}
            <button
              type="button"
              onClick={() => setActiveTab("rfqs")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "rfqs"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : "text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 shrink-0 text-blue-600" />
                <span>Client RFQs</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold">
                4 Matches
              </span>
            </button>

            {/* PayPal Sandbox Guide */}
            <button
              type="button"
              onClick={() => setActiveTab("sandbox_guide")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "sandbox_guide"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : "text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Info className="w-4 h-4 shrink-0 text-amber-600" />
                <span>PayPal Sandbox Guide</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold">
                DOCS
              </span>
            </button>
          </nav>
        </div>

        {/* Bottom Section: Freelancer Profile & Logout */}
        <div className="p-3.5 space-y-3 border-t border-stone-100">
          <div className="p-3 rounded-2xl bg-[#f4faed] border border-[#d8e5ca] space-y-1 text-xs font-mono">
            <span className="text-[10px] text-stone-400 block font-bold uppercase">Verified Freelancer</span>
            <strong className="text-[#18280e] block">HyperScale Software Labs</strong>
            <span className="text-[11px] text-[#3f7308] block">GST: 27AABCH1092K1Z8</span>
            <span className="text-[10px] text-stone-500 block truncate">accounts@hyperscalelabs.io</span>
          </div>

          <div className="space-y-1 text-xs font-medium text-stone-600">
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors hover:bg-[#ebf7d9]/60 hover:text-[#18280e] cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span>Settings &amp; Payout Bank</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentSessionUser(null);
                router.push("/signin");
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer text-rose-700 hover:bg-rose-50 font-semibold"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT                                                           */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar matching reference */}
        <header className="h-16 bg-white border-b border-stone-200/80 px-8 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[#18280e] tracking-tight capitalize font-sans">
              {activeTab === "dashboard" && "Freelancer & Agency Service Portal"}
              {activeTab === "contracts" && "International Client Contracts & Scope of Work"}
              {activeTab === "milestones" && "Milestone Delivery Proof & Git Commits"}
              {activeTab === "payouts" && "PayPal Commercial Escrow & e-FIRC Ledger"}
              {activeTab === "disputes" && "Chargeback & Dispute Defense Shield"}
              {activeTab === "rfqs" && "Incoming Global Sourcing RFQs (Software & Creative)"}
              {activeTab === "sandbox_guide" && "PayPal Orders v2 Sandbox Overview & Testing Guide"}
              {activeTab === "settings" && "Freelancer Profile & Bank Reconciliation"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <div className="hidden md:flex items-center gap-2 bg-[#f4faed] border border-[#d8e5ca] px-3.5 py-1.5 rounded-xl text-xs font-mono text-stone-700">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              <span>Jan 1, 2026 - Feb 1, 2026</span>
              <span className="text-stone-300">|</span>
              <span className="font-semibold text-[#18280e]">Last 30 days ∨</span>
            </div>

            {/* Add Widget */}
            <button
              type="button"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-mono font-semibold text-stone-700 transition-colors shadow-2xs cursor-pointer"
              onClick={() => alert("Added: GitHub Webhook Activity Widget")}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-stone-500" />
              <span>Add widget</span>
            </button>

            {/* Export Button */}
            <button
              type="button"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#18280e] hover:bg-[#284905] text-[#b2eb76] text-xs font-mono font-bold transition-colors shadow-xs cursor-pointer"
              onClick={() => alert("Exporting Service Export Inward Remittances CSV...")}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            {/* Sign Out */}
            <div className="flex items-center gap-2 pl-3 border-l border-stone-200">
              <button
                type="button"
                onClick={() => {
                  setCurrentSessionUser(null);
                  router.push("/signin");
                }}
                className="text-xs font-mono font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Sign out of TradeOracle session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="p-6 md:p-8 space-y-6 max-w-[88rem] w-full mx-auto">
          {/* ========================================================================= */}
          {/* TAB 1: DASHBOARD OVERVIEW                                                 */}
          {/* ========================================================================= */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-in fade-in">
              {/* Top 4 KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SpotlightCard className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2 hover:-translate-y-0.5 transition-transform">
                  <div className="flex justify-between items-center text-xs font-medium text-stone-500">
                    <span>Active Contracts Value</span>
                    <div className="p-1.5 rounded-lg bg-[#ebf7d9] text-[#18280e]">
                      <DollarSign className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-[#18280e]">
                      $<CountUp to={8800} decimals={0} />
                    </span>
                    <span className="text-xs font-bold text-emerald-700 font-mono">≈ ₹7.35 Lakhs</span>
                  </div>
                  <span className="text-[11px] text-stone-400 block font-mono">2 international clients</span>
                </SpotlightCard>

                <SpotlightCard className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2 hover:-translate-y-0.5 transition-transform">
                  <div className="flex justify-between items-center text-xs font-medium text-stone-500">
                    <span>PayPal Escrow Held</span>
                    <div className="p-1.5 rounded-lg bg-[#ebf7d9] text-[#18280e]">
                      <CreditCard className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-[#18280e]">
                      $<CountUp to={4600} decimals={0} />
                    </span>
                    <span className="text-xs font-bold text-blue-700 font-mono">Protected</span>
                  </div>
                  <span className="text-[11px] text-stone-400 block font-mono">Released upon PR code sign-off</span>
                </SpotlightCard>

                <SpotlightCard className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2 hover:-translate-y-0.5 transition-transform">
                  <div className="flex justify-between items-center text-xs font-medium text-stone-500">
                    <span>Milestones Completed</span>
                    <div className="p-1.5 rounded-lg bg-[#ebf7d9] text-[#18280e]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-[#18280e]">
                      <CountUp to={2} decimals={0} /> / 5
                    </span>
                    <span className="text-xs font-bold text-emerald-700 font-mono">$2,700 Payouts</span>
                  </div>
                  <span className="text-[11px] text-stone-400 block font-mono">100% on-time delivery</span>
                </SpotlightCard>

                <SpotlightCard className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2 hover:-translate-y-0.5 transition-transform">
                  <div className="flex justify-between items-center text-xs font-medium text-stone-500">
                    <span>Dispute Win Rate</span>
                    <div className="p-1.5 rounded-lg bg-[#ebf7d9] text-[#18280e]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#3f7308]" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-[#18280e]">
                      <CountUp to={100} decimals={0} suffix="%" />
                    </span>
                    <span className="text-xs font-bold text-emerald-700 font-mono">0 Disputes</span>
                  </div>
                  <span className="text-[11px] text-stone-400 block font-mono">Immutable Git commit proof</span>
                </SpotlightCard>
              </div>

              {/* Active Contracts & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Projects List */}
                <SpotlightCard className="lg:col-span-2 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                    <div>
                      <h3 className="text-base font-bold text-[#18280e] font-sans">Active Cross-Border Contracts</h3>
                      <span className="text-xs text-stone-500 font-mono">
                        Commercial agreements connected with PayPal milestone escrow
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("contracts")}
                      className="text-xs font-mono font-bold text-[#3f7308] hover:underline"
                    >
                      View All Contracts →
                    </button>
                  </div>

                  <div className="space-y-4">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-5 rounded-2xl bg-[#fbfdf9] border border-stone-200/80 space-y-3 hover:border-[#3f7308] transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedProject(proj);
                          setActiveTab("contracts");
                        }}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{proj.client.flag}</span>
                            <div>
                              <strong className="text-sm text-[#18280e] block font-sans">{proj.projectTitle}</strong>
                              <span className="text-xs text-stone-500 font-mono">
                                Client: {proj.client.company} ({proj.client.city}) • {proj.contractNumber}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-base font-extrabold font-mono text-[#18280e] block">
                              ${proj.totalContractUSD.toLocaleString()} USD
                            </span>
                            <span className="text-xs font-mono font-bold text-[#3f7308] block">
                              ≈ ₹{proj.inrLakhs} Lakhs
                            </span>
                          </div>
                        </div>

                        {/* Milestones Mini Bar */}
                        <div className="space-y-1.5 pt-2 border-t border-stone-100">
                          <div className="flex justify-between text-[11px] font-mono text-stone-500">
                            <span>Milestone Progress</span>
                            <span>{proj.escrowStatus}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {proj.milestones.map((m) => (
                              <div
                                key={m.id}
                                className={`p-2 rounded-xl text-center text-[10px] font-mono font-bold cursor-pointer transition-transform hover:scale-105 ${
                                  m.status === "completed"
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                    : m.status === "in_escrow" || m.status === "in_review"
                                    ? "bg-amber-100 text-amber-800 border border-amber-200 animate-pulse"
                                    : "bg-stone-100 text-stone-500"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedMilestone(m);
                                  setActiveTab("milestones");
                                }}
                              >
                                M{m.milestoneNumber}: ${m.amountUSD} ({m.status.toUpperCase()})
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </SpotlightCard>

                {/* Right Side: Quick Milestone Submitter & PayPal Sandbox Trigger */}
                <div className="space-y-6">
                  {/* Test PayPal Orders v2 Sandbox Card */}
                  <SpotlightCard className="bg-[#18280e] text-white p-6 rounded-3xl space-y-4 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="size-8 rounded-xl bg-white/10 flex items-center justify-center text-[#b2eb76]">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-[#b2eb76] font-bold">
                        SANDBOX READY
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-white font-sans">
                        Test PayPal Milestone Escrow ($1,500)
                      </h4>
                      <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                        Execute a live simulated PayPal Orders v2 API call for Milestone 1 advance.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleTriggerPayPalMilestone}
                      disabled={paypalLoading}
                      className="w-full py-2 bg-[#b2eb76] hover:bg-[#c2f38d] text-[#18280e] font-mono font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {paypalLoading ? "Connecting to PayPal..." : "Trigger Test Payment ($1,500)"}
                    </button>

                    {paypalResult && (
                      <div className="p-3 rounded-xl bg-white/10 text-[11px] font-mono space-y-1.5 border border-white/20">
                        <div className="flex justify-between">
                          <span className="text-stone-300">Order ID:</span>
                          <strong className="text-[#b2eb76]">{paypalResult.id}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-300">Status:</span>
                          <strong className="text-emerald-400">{paypalResult.status}</strong>
                        </div>
                        {paypalResult.approveUrl && (
                          <a
                            href={paypalResult.approveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-center py-1.5 px-3 rounded-lg bg-[#b2eb76] text-[#18280e] font-bold text-xs mt-2"
                          >
                            Open PayPal Sandbox Checkout →
                          </a>
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setActiveTab("sandbox_guide")}
                      className="text-[11px] font-mono text-[#b2eb76] hover:underline block text-center w-full"
                    >
                      View PayPal Sandbox Instructions &amp; Docs →
                    </button>
                  </SpotlightCard>

                  {/* Dispute Shield Quick Banner */}
                  <SpotlightCard className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#3f7308]" />
                      <h4 className="font-bold text-sm text-[#18280e] font-sans">
                        Immutable Evidence Engine
                      </h4>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Every code PR, commit hash, and staging demo is cryptographically stamped into the transaction record. If a buyer initiates a PayPal dispute, you have 100% indisputable proof of delivery.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("disputes")}
                      className="text-xs font-mono font-bold text-[#3f7308] hover:underline"
                    >
                      Open Dispute Defense Packager →
                    </button>
                  </SpotlightCard>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: CONTRACTS & SOW                                                    */}
          {/* ========================================================================= */}
          {activeTab === "contracts" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#18280e] font-sans">
                    Client Contracts &amp; Scope of Work (SOW)
                  </h2>
                  <p className="text-xs text-stone-600 mt-1">
                    What was promised: verified contract specifications, deliverables, and payment triggers.
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-3 py-1 rounded-full bg-[#ebf7d9] text-[#18280e] font-bold border border-[#d8e5ca]">
                    2 Active Export Contracts
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Contracts List */}
                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => setSelectedProject(proj)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        selectedProject.id === proj.id
                          ? "bg-white border-[#3f7308] ring-2 ring-[#b2eb76]/40 shadow-sm"
                          : "bg-white border-stone-200/80 hover:border-stone-300 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{proj.client.flag}</span>
                        <div>
                          <strong className="text-xs text-[#18280e] block font-sans">{proj.client.company}</strong>
                          <span className="text-[11px] font-mono text-stone-500">{proj.contractNumber}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between items-center text-xs font-mono">
                        <span className="font-bold text-[#18280e]">${proj.totalContractUSD.toLocaleString()}</span>
                        <span className="text-[#3f7308] font-bold">≈ ₹{proj.inrLakhs} Lakhs</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Contract Details */}
                <SpotlightCard className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-stone-100">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold block">
                        Commercial Service Agreement
                      </span>
                      <h3 className="text-xl font-bold text-[#18280e] font-sans mt-0.5">
                        {selectedProject.projectTitle}
                      </h3>
                      <span className="text-xs font-mono text-stone-500">
                        Client: {selectedProject.client.company} • Contact: {selectedProject.client.contactName} ({selectedProject.client.email})
                      </span>
                    </div>

                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      ✓ {selectedProject.status}
                    </span>
                  </div>

                  {/* Scope of Work */}
                  <div className="p-4 rounded-2xl bg-[#f8fbf5] border border-[#d8e5ca] space-y-2">
                    <span className="text-xs font-mono uppercase font-bold text-[#3f7308] block">
                      📌 Agreed Scope of Work (SOW):
                    </span>
                    <p className="text-xs text-stone-800 leading-relaxed font-sans">
                      {selectedProject.scopeOfWork}
                    </p>
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <span className="text-[11px] font-mono text-stone-500 uppercase font-bold block mb-2">
                      Required Technology Stack:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 font-mono text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Milestones Table */}
                  <div className="space-y-3">
                    <span className="text-[11px] font-mono text-stone-500 uppercase font-bold block">
                      Payment Milestones &amp; Escrow Disbursement:
                    </span>
                    <div className="space-y-2">
                      {selectedProject.milestones.map((m) => (
                        <div
                          key={m.id}
                          className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs font-mono"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#18280e]">
                                Milestone {m.milestoneNumber}: {m.title}
                              </span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                  m.status === "completed"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : m.status === "in_escrow" || m.status === "in_review"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-stone-200 text-stone-600"
                                }`}
                              >
                                {m.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-stone-500 text-[11px] font-sans">{m.description}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-bold text-sm text-[#18280e] block">${m.amountUSD} USD</span>
                            <span className="text-[11px] text-stone-500 block">Due: {m.dueDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                    <KokonutButton
                      variant="primary"
                      size="sm"
                      onClick={() => setActiveTab("milestones")}
                    >
                      <GitPullRequest className="w-3.5 h-3.5" />
                      <span>Submit Code / PR for Review →</span>
                    </KokonutButton>
                  </div>
                </SpotlightCard>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: MILESTONE DELIVERY PROOF                                          */}
          {/* ========================================================================= */}
          {activeTab === "milestones" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#18280e] font-sans">
                    Submit Milestone Delivery Proof
                  </h2>
                  <p className="text-xs text-stone-600 mt-1">
                    Connect your GitHub PR, Commit Hash, and Staging URL to unlock PayPal escrow funds.
                  </p>
                </div>
                <span className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200">
                  Milestone 2 Pending Review
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form */}
                <SpotlightCard className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-5">
                  <h3 className="text-base font-bold text-[#18280e] font-sans pb-3 border-b border-stone-100">
                    Deliverable Details for Milestone 2 ($2,000 USD)
                  </h3>

                  <form onSubmit={handleSubmitProof} className="space-y-4 font-mono text-xs">
                    <div>
                      <label className="block text-stone-600 font-bold mb-1">
                        GitHub Pull Request URL *
                      </label>
                      <input
                        type="url"
                        value={prUrl}
                        onChange={(e) => setPrUrl(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#fbfdf9] text-[#18280e] focus:outline-hidden focus:border-[#3f7308]"
                        placeholder="https://github.com/org/repo/pull/14"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-stone-600 font-bold mb-1">
                          Git Commit Hash (SHA-1) *
                        </label>
                        <input
                          type="text"
                          value={commitHash}
                          onChange={(e) => setCommitHash(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#fbfdf9] text-[#18280e] focus:outline-hidden focus:border-[#3f7308]"
                          placeholder="9e12cd458a01bc7f"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-600 font-bold mb-1">
                          Live Staging / Preview Domain
                        </label>
                        <input
                          type="url"
                          value={stagingUrl}
                          onChange={(e) => setStagingUrl(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#fbfdf9] text-[#18280e] focus:outline-hidden focus:border-[#3f7308]"
                          placeholder="https://staging.apexcloud.dev"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-600 font-bold mb-1">
                        Loom Video Walkthrough URL
                      </label>
                      <input
                        type="url"
                        value={loomUrl}
                        onChange={(e) => setLoomUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#fbfdf9] text-[#18280e] focus:outline-hidden focus:border-[#3f7308]"
                        placeholder="https://loom.com/share/..."
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-[#ebf7d9] text-[#18280e] text-[11px] space-y-1">
                      <strong className="block">🔒 Automated Dispute Protection Guarantee:</strong>
                      <p className="text-stone-700 leading-snug">
                        By submitting this proof, TradeOracle generates an immutable hash stamped with your IP and timestamp. If the buyer does not review within 5 business days, the PayPal escrow auto-releases.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#18280e] hover:bg-[#284905] text-[#b2eb76] font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Code &amp; Notify Client for Payout</span>
                    </button>
                  </form>

                  {proofSubmitted && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono space-y-1">
                      <div className="flex items-center gap-2 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Delivery Proof Recorded Successfully!</span>
                      </div>
                      <p className="text-emerald-700 text-[11px]">
                        Notification sent to David Sterling (david@apexcloud.io). PayPal Escrow hold is queued for release upon sign-off.
                      </p>
                    </div>
                  )}
                </SpotlightCard>

                {/* Previous Deliveries History */}
                <SpotlightCard className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
                  <h4 className="font-bold text-sm text-[#18280e] font-sans pb-2 border-b border-stone-100">
                    Verified Deliveries
                  </h4>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3.5 rounded-2xl bg-[#fbfdf9] border border-stone-200/80 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <strong className="text-[#18280e]">Milestone 1 (Figma &amp; DB)</strong>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                          ✓ PAID
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 font-sans">
                        Figma System &amp; PostgreSQL Prisma Schema
                      </p>
                      <div className="text-[10px] text-stone-400 space-y-0.5">
                        <div>PR: #1 • Hash: 7b4f8a9e</div>
                        <div>Paid: $1,500 USD (₹1,25,400)</div>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: PAYPAL PAYOUTS & FIRC LEDGER                                       */}
          {/* ========================================================================= */}
          {activeTab === "payouts" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#18280e] font-sans">
                    PayPal Escrow &amp; e-FIRC Ledger
                  </h2>
                  <p className="text-xs text-stone-600 mt-1">
                    Statutory export compliance: Foreign Inward Remittance Certificates for RBI &amp; Chartered Accountants.
                  </p>
                </div>
                <KokonutButton
                  variant="primary"
                  size="sm"
                  onClick={() => alert("Downloading all certified e-FIRC PDFs for CA audit...")}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CA Audit Pack (PDF)</span>
                </KokonutButton>
              </div>

              <SpotlightCard className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-stone-100 text-[10px] text-stone-400 uppercase tracking-wider">
                        <th className="pb-3 font-semibold">DATE</th>
                        <th className="pb-3 font-semibold">CONTRACT</th>
                        <th className="pb-3 font-semibold">MILESTONE</th>
                        <th className="pb-3 font-semibold">AMOUNT (USD)</th>
                        <th className="pb-3 font-semibold">INR VALUE</th>
                        <th className="pb-3 font-semibold">FIRC CERTIFICATE</th>
                        <th className="pb-3 font-semibold">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      <tr className="hover:bg-[#f4faed] transition-colors">
                        <td className="py-3 text-stone-500">2026-02-10</td>
                        <td className="py-3 font-bold text-[#18280e]">SOW-USA-2026-4409</td>
                        <td className="py-3 text-stone-700">M1: Architecture Blueprint</td>
                        <td className="py-3 font-bold text-[#18280e]">$1,500.00</td>
                        <td className="py-3 text-[#3f7308] font-bold">₹1,25,400</td>
                        <td className="py-3 text-blue-600 underline cursor-pointer">
                          FIRC-HDFC-INW-2026-9921
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Settled in HDFC
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#f4faed] transition-colors">
                        <td className="py-3 text-stone-500">2026-02-20</td>
                        <td className="py-3 font-bold text-[#18280e]">SOW-GBR-2026-2180</td>
                        <td className="py-3 text-stone-700">M1: Storefront Prototype</td>
                        <td className="py-3 font-bold text-[#18280e]">$1,200.00</td>
                        <td className="py-3 text-[#3f7308] font-bold">₹1,00,320</td>
                        <td className="py-3 text-blue-600 underline cursor-pointer">
                          FIRC-HDFC-INW-2026-8804
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Settled in HDFC
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#f4faed] transition-colors">
                        <td className="py-3 text-stone-500">Pending</td>
                        <td className="py-3 font-bold text-[#18280e]">SOW-USA-2026-4409</td>
                        <td className="py-3 text-stone-700">M2: Core API Engine</td>
                        <td className="py-3 font-bold text-[#18280e]">$2,000.00</td>
                        <td className="py-3 text-amber-700 font-bold">≈ ₹1,67,200</td>
                        <td className="py-3 text-stone-400">Escrow Locked</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                            Held in PayPal Escrow
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </SpotlightCard>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: DISPUTE DEFENSE SHIELD                                            */}
          {/* ========================================================================= */}
          {activeTab === "disputes" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#18280e] font-sans">
                    Chargeback &amp; Dispute Defense Shield
                  </h2>
                  <p className="text-xs text-stone-600 mt-1">
                    When international clients file bad-faith disputes, TradeOracle auto-assembles your evidence dossier.
                  </p>
                </div>
                <span className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  ✓ 100% Protection Rating
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SpotlightCard className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-[#18280e] font-sans">
                    What PayPal Requires to Win a Dispute
                  </h3>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#3f7308] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#18280e] block">Written Scope Agreement:</strong>
                        <span className="text-stone-600 font-sans text-xs">
                          Signed SOW-USA-2026-4409 with client acceptance signature.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#3f7308] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#18280e] block">Proof of Delivery:</strong>
                        <span className="text-stone-600 font-sans text-xs">
                          Git commit log `#9e12cd458a01bc7f` merged into client&apos;s private GitHub organization.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#3f7308] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#18280e] block">Communication Audit Trail:</strong>
                        <span className="text-stone-600 font-sans text-xs">
                          Full timestamped Slack/Loom reviews showing ongoing client direction.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => alert("Generated: TradeOracle_Dispute_Dossier_SOW_4409.zip")}
                      className="w-full py-2.5 bg-[#18280e] hover:bg-[#284905] text-[#b2eb76] font-mono font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PayPal Dispute Evidence Pack (.zip)</span>
                    </button>
                  </div>
                </SpotlightCard>

                <SpotlightCard className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-[#18280e] font-sans">
                    Dispute Status Tracker
                  </h3>
                  <div className="p-5 rounded-2xl bg-[#f8fbf5] border border-[#d8e5ca] text-center space-y-2">
                    <div className="size-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-sm text-[#18280e] font-sans">Zero Active Disputes</h4>
                    <p className="text-xs text-stone-600 max-w-sm mx-auto">
                      All 5 past international transactions completed with positive client sign-offs and zero chargebacks.
                    </p>
                  </div>
                </SpotlightCard>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: CLIENT RFQs                                                       */}
          {/* ========================================================================= */}
          {activeTab === "rfqs" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#18280e] font-sans">
                    Incoming Global Client RFQs
                  </h2>
                  <p className="text-xs text-stone-600 mt-1">
                    Verified foreign companies seeking Indian software agencies and technical freelancers.
                  </p>
                </div>
                <span className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                  4 Matching RFQs
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SpotlightCard className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🇺🇸</span>
                        <strong className="text-sm text-[#18280e]">SaaS Fintech Dashboard</strong>
                      </div>
                      <span className="text-xs text-stone-500 font-mono">Bespoke Capital LLC • New York, USA</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-[#3f7308]">$6,500 USD</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed font-sans">
                    Looking for a senior React/Next.js engineer to build real-time trading dashboards with WebSockets, high-chart visualizations, and Stripe/PayPal rails.
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-stone-100">
                    <span className="text-[11px] font-mono text-stone-400">Duration: 4 Weeks</span>
                    <button
                      type="button"
                      onClick={() => alert("Submitting commercial proposal with PayPal milestone terms...")}
                      className="px-3.5 py-1.5 bg-[#18280e] hover:bg-[#284905] text-[#b2eb76] text-xs font-mono font-bold rounded-xl"
                    >
                      Submit Proposal →
                    </button>
                  </div>
                </SpotlightCard>

                <SpotlightCard className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🇩🇪</span>
                        <strong className="text-sm text-[#18280e]">Industrial IoT Sensor Hub</strong>
                      </div>
                      <span className="text-xs text-stone-500 font-mono">Vektor Automatisierung GmbH • Munich</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-[#3f7308]">$8,200 USD</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed font-sans">
                    Require full-stack team to integrate MQTT edge telemetry from German CNC machinery into an Azure IoT hub with React visualization portal.
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-stone-100">
                    <span className="text-[11px] font-mono text-stone-400">Duration: 6 Weeks</span>
                    <button
                      type="button"
                      onClick={() => alert("Submitting commercial proposal with PayPal milestone terms...")}
                      className="px-3.5 py-1.5 bg-[#18280e] hover:bg-[#284905] text-[#b2eb76] text-xs font-mono font-bold rounded-xl"
                    >
                      Submit Proposal →
                    </button>
                  </div>
                </SpotlightCard>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: PAYPAL SANDBOX OVERVIEW & TESTING GUIDE                            */}
          {/* ========================================================================= */}
          {activeTab === "sandbox_guide" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#18280e] font-sans">
                    PayPal Orders v2 Sandbox Overview &amp; Guide
                  </h2>
                  <p className="text-xs text-stone-600 mt-1">
                    How TradeOracle executes real-time milestone payments via PayPal Sandbox.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs font-bold">
                    API Status: 200 OK
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SpotlightCard className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-[#18280e] font-sans">
                      1. How PayPal Sandbox Works in TradeOracle
                    </h3>
                    <p className="text-xs text-stone-700 leading-relaxed">
                      PayPal Sandbox is a simulated financial environment provided by PayPal Developer. It uses the exact same OAuth2 authentication and Orders v2 REST endpoints as production, allowing you to test milestone advances, escrow holds, and captures without moving real currency.
                    </p>

                    <div className="space-y-3 font-mono text-xs">
                      <div className="p-3.5 rounded-xl bg-[#f8fbf5] border border-[#d8e5ca] space-y-1">
                        <strong className="text-[#18280e] block">A. Connected Sandbox Merchant Account</strong>
                        <div className="text-stone-600 space-y-0.5 text-[11px]">
                          <div>Email: <code>sb-knljl53833937@business.example.com</code></div>
                          <div>Role: Indian Exporter / Service Provider Receiving Account</div>
                          <div>Currency: USD (Automatically converted to INR for local banking)</div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#f8fbf5] border border-[#d8e5ca] space-y-1">
                        <strong className="text-[#18280e] block">B. Testing as a Foreign Buyer</strong>
                        <p className="text-stone-600 text-[11px] font-sans">
                          When you click <strong>“Open PayPal Sandbox Checkout”</strong>, PayPal launches the official checkout dialog at <code>sandbox.paypal.com</code>. You can log in using any standard PayPal sandbox personal buyer account to test approving the $1,500 milestone payment.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#f8fbf5] border border-[#d8e5ca] space-y-1">
                        <strong className="text-[#18280e] block">C. Milestone Escrow &amp; Release Flow</strong>
                        <p className="text-stone-600 text-[11px] font-sans">
                          1. Foreign buyer deposits 30% advance via PayPal Orders v2.<br />
                          2. Indian provider delivers GitHub PR / QIMA inspection report.<br />
                          3. Buyer or smart-timer triggers the capture.<br />
                          4. TradeOracle marks the milestone complete and issues the automated e-FIRC record.
                        </p>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>

                {/* Interactive Sandbox Test Runner */}
                <SpotlightCard className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
                  <h4 className="font-bold text-sm text-[#18280e] font-sans">
                    Live API Execution Test
                  </h4>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-mono space-y-2">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">
                      Endpoint Tested
                    </span>
                    <code className="text-[#18280e] text-[11px] block">
                      POST /api/trade (action: create_paypal_payment)
                    </code>
                    <span className="text-[10px] text-stone-500 block">
                      Payload: tradeId=&quot;trade_live_7719&quot;
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleTriggerPayPalMilestone}
                    disabled={paypalLoading}
                    className="w-full py-2.5 bg-[#18280e] hover:bg-[#284905] text-[#b2eb76] font-mono font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{paypalLoading ? "Connecting..." : "Run Test Sandbox Order"}</span>
                  </button>

                  {paypalResult && (
                    <div className="p-4 rounded-2xl bg-[#ebf7d9] border border-[#d8e5ca] text-xs font-mono space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[#18280e] font-bold">✓ Order Created</span>
                        <span className="px-2 py-0.5 rounded bg-[#18280e] text-[#b2eb76] text-[10px]">
                          {paypalResult.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-600">
                        ID: <strong>{paypalResult.id}</strong>
                      </div>
                      {paypalResult.approveUrl && (
                        <a
                          href={paypalResult.approveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block w-full py-2 bg-[#3f7308] hover:bg-[#284905] text-white text-center font-bold text-xs rounded-xl mt-1"
                        >
                          Launch Sandbox Checkout Window →
                        </a>
                      )}
                    </div>
                  )}
                </SpotlightCard>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 8: SETTINGS & BANK RECONCILIATION                                     */}
          {/* ========================================================================= */}
          {activeTab === "settings" && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-6 font-mono text-xs animate-in fade-in">
              <h2 className="text-xl font-bold text-[#18280e] font-sans pb-3 border-b border-stone-100">
                Freelancer Profile &amp; Bank Remittance Settings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-stone-500 font-bold block mb-1">Legal Registered Entity</label>
                  <input
                    type="text"
                    defaultValue="HyperScale Software Labs LLP"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#fbfdf9]"
                  />
                </div>
                <div>
                  <label className="text-stone-500 font-bold block mb-1">GSTIN (Zero-Rated Export LUT)</label>
                  <input
                    type="text"
                    defaultValue="27AABCH1092K1Z8"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#fbfdf9]"
                  />
                </div>
                <div>
                  <label className="text-stone-500 font-bold block mb-1">Connected PayPal Payout Email</label>
                  <input
                    type="email"
                    defaultValue="accounts@hyperscalelabs.io"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#fbfdf9]"
                  />
                </div>
                <div>
                  <label className="text-stone-500 font-bold block mb-1">Settlement Bank (Authorized Dealer Code)</label>
                  <input
                    type="text"
                    defaultValue="HDFC Bank - Fort Branch, Mumbai (AD Code: 0510024)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#fbfdf9]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => alert("Freelancer banking and PayPal settings saved successfully.")}
                  className="px-6 py-2.5 bg-[#18280e] text-[#b2eb76] font-bold rounded-xl"
                >
                  Save Banking Details
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
