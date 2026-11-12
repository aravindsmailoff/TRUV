"use client";

import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  FileText,
  BadgeCheck,
  Bot,
  Lock,
  Globe,
} from "lucide-react";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { KokonutButton } from "@/components/kokonutui/KokonutButton";

interface MatchedMerchant {
  id: string;
  name: string;
  cluster: string;
  location: string;
  paypalEmail: string;
  iecCode: string;
  udyamRating: string;
  matchScore: number;
  productTitle: string;
  laymanMatchSummary: string;
  exactSpecs: {
    material: string;
    treatment: string;
    capacity: string;
    packaging: string;
    leadTime: string;
  };
  commercialTerms: {
    totalUSD: number;
    advanceUSD: number;
    balanceUSD: number;
    approxInrLakhs: number;
    portOfLoading: string;
    destinationPort: string;
    inspectionAgency: string;
  };
}

const SAMPLE_PRESETS = [
  {
    country: "🇺🇸 United States",
    title: "3,500 Brass Door Handles (CW617N, Coastal Anti-Tarnish, Long Beach)",
    query:
      "I need 3,500 solid brass door handles and mortise locksets in satin gold finish for coastal luxury resort hotels in California. Requires anti-tarnish coating tested for 240-hour ASTM B117 salt-spray resistance. Individual retail boxed with barcode stickers.",
  },
  {
    country: "🇩🇪 Germany",
    title: "50,000 Grade 10.9 Flange Fasteners (Bridge Construction, Hamburg)",
    query:
      "Looking for 50,000 high-tensile cold forged Grade 10.9 steel flange bolts and nuts with 12-micron zinc-nickel plating for bridge construction in Hamburg. Must withstand freezing winter vibration.",
  },
  {
    country: "🇬🇧 United Kingdom",
    title: "1,800 Antique Brass Cremone Window Bolts (Heritage Estates, Birmingham)",
    query:
      "Need 1,800 authentic hand-aged antique brass cremone window locking bolts with beeswax finish for heritage Georgian property restoration in London and Birmingham.",
  },
  {
    country: "🇺🇸 United States",
    title: "Dedicated Full-Stack Software Engineering Team ($5,000 / Sprint)",
    query:
      "US healthcare startup requires a verified Indian agency for HIPAA-compliant React/Node.js microservices. $5,000 sprint milestone payable upon GitHub PR approval and SonarQube audit.",
  },
];

const MATCHED_MERCHANTS: Record<string, MatchedMerchant> = {
  brass: {
    id: "m_brass_01",
    name: "Jamnagar Precision Brass Castings Ltd",
    cluster: "Jamnagar Brass & Hardware Hub",
    location: "GIDC Industrial Estate Phase-II, Jamnagar, Gujarat, India",
    paypalEmail: "sb-knljl53833937@business.example.com",
    iecCode: "IEC #0429108422 (DGFT Verified)",
    udyamRating: "Udyam MSME Platinum (UDYAM-GJ-14-0029144)",
    matchScore: 99.4,
    productTitle: "Architectural Solid Brass Mortise Locksets & Lever Handles",
    laymanMatchSummary:
      "This manufacturer has 24 high-pressure induction casting furnaces and specialized PVD anti-tarnish coating lines in Jamnagar. They already manufacture commercial grade door hardware for US hospitality brands.",
    exactSpecs: {
      material: "Forged CW617N Solid Brass (CuZn40Pb2 European Standard, Lead < 1.6%)",
      treatment: "PVD Satin Gold + Nanotech Protective Clear Coat (Passed 300-hr ASTM B117 salt spray test)",
      capacity: "45,000 units/month (Your 3,500 order fits within 10 days production batch)",
      packaging: "Custom 350gsm individual retail box with UPC barcode + 5-ply export master carton",
      leadTime: "22 calendar days to FOB Mundra Port dispatch",
    },
    commercialTerms: {
      totalUSD: 85750,
      advanceUSD: 25725,
      balanceUSD: 60025,
      approxInrLakhs: 71.5,
      portOfLoading: "Mundra Port, Gujarat (INMUN1)",
      destinationPort: "Port of Long Beach, California (USLGB)",
      inspectionAgency: "QIMA Quality Services (AQL 1.5 Level II Pre-Shipment Inspection)",
    },
  },
  fastener: {
    id: "m_fast_02",
    name: "Ludhiana Precision Forgings & Fasteners Pvt Ltd",
    cluster: "Ludhiana Heavy Engineering & Fasteners Hub",
    location: "Focal Point Phase-V, Ludhiana, Punjab, India",
    paypalEmail: "sb-knljl53833937@business.example.com",
    iecCode: "IEC #0318042911 (DGFT Verified)",
    udyamRating: "Udyam MSME Gold (UDYAM-PB-12-0048192)",
    matchScore: 98.8,
    productTitle: "High-Tensile Cold Forged Flange Fasteners (Grade 10.9)",
    laymanMatchSummary:
      "Operates 6 multi-station cold heading formers with continuous heat treatment furnaces. Equipped with in-house zinc-nickel alkaline plating plant certified to DIN EN ISO 4042.",
    exactSpecs: {
      material: "Alloy Steel AISI 4140 Quenched & Tempered (Proof Load 830 MPa)",
      treatment: "Alkaline Zinc-Nickel 12–15 µm + Cr(VI)-free trivalent passivate + high-lubricant sealer",
      capacity: "250,000 pieces/month",
      packaging: "25kg heavy-duty fumigated pine wood crates on Euro-pallets",
      leadTime: "25 days to Nhava Sheva (JNPT) container loading",
    },
    commercialTerms: {
      totalUSD: 92500,
      advanceUSD: 27750,
      balanceUSD: 64750,
      approxInrLakhs: 77.2,
      portOfLoading: "Nhava Sheva Port, Mumbai (INNSA1)",
      destinationPort: "Port of Hamburg, Germany (DEHAM)",
      inspectionAgency: "TÜV Rheinland India Audit (Dimensional & Metallurgical Proof Load)",
    },
  },
  software: {
    id: "m_soft_03",
    name: "ApexCloud Software Labs LLP",
    cluster: "Bangalore Outer Ring Road IT Tech Park",
    location: "Bellandur Tech Zone, Bengaluru, Karnataka, India",
    paypalEmail: "sb-knljl53833937@business.example.com",
    iecCode: "STPI & DGFT Registered IT Exporter",
    udyamRating: "Udyam IT Services A+",
    matchScore: 97.6,
    productTitle: "Cross-Border Full-Stack Engineering Sprint",
    laymanMatchSummary:
      "SOC-2 Type II certified software development studio with senior engineers proficient in React, Next.js, Go, and PayPal/Stripe API integrations.",
    exactSpecs: {
      material: "Full-Stack TypeScript, React 19, Node.js, PostgreSQL, Docker, AWS",
      treatment: "Automated CI/CD, SonarQube zero-vulnerability gate, 90%+ Jest test coverage",
      capacity: "4 Senior Engineers allocated exclusively for 2-week sprint",
      packaging: "GitHub PR delivery with verified deployment to AWS staging",
      leadTime: "14 calendar days with daily async Slack / Loom check-ins",
    },
    commercialTerms: {
      totalUSD: 5000,
      advanceUSD: 1500,
      balanceUSD: 3500,
      approxInrLakhs: 4.18,
      portOfLoading: "Digital Export (STPI Softex Form Registered)",
      destinationPort: "San Francisco, California (AWS Cloud)",
      inspectionAgency: "GitHub Code Review & Automated SonarCloud Audit",
    },
  },
};

export function ForeignBuyerPortal({
  onTriggerPayPalOrder,
  paypalLoading,
  paypalResult,
}: {
  onTriggerPayPalOrder: () => void;
  paypalLoading: boolean;
  paypalResult: { id?: string; status?: string; approveUrl?: string; amount?: string } | null;
}) {
  const [buyerQuery, setBuyerQuery] = useState(SAMPLE_PRESETS[0].query);
  const [selectedKey, setSelectedKey] = useState<"brass" | "fastener" | "software">("brass");
  const [isSearching, setIsSearching] = useState(false);
  const [showMatch, setShowMatch] = useState(true);

  const handleRunSearch = (queryText: string, key?: "brass" | "fastener" | "software") => {
    setBuyerQuery(queryText);
    setIsSearching(true);
    setShowMatch(false);

    // Determine archetype based on text
    const lower = queryText.toLowerCase();
    let targetKey: "brass" | "fastener" | "software" = key || "brass";
    if (lower.includes("bolt") || lower.includes("fastener") || lower.includes("steel")) {
      targetKey = "fastener";
    } else if (lower.includes("software") || lower.includes("react") || lower.includes("team") || lower.includes("app")) {
      targetKey = "software";
    } else {
      targetKey = "brass";
    }

    setTimeout(() => {
      setSelectedKey(targetKey);
      setIsSearching(false);
      setShowMatch(true);
    }, 700);
  };

  const merchant = MATCHED_MERCHANTS[selectedKey];

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#18280e] via-[#213814] to-[#18280e] text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-full bg-[#b2eb76] text-[#18280e] font-bold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              FOREIGN BUYER DISCOVERY PORTAL
            </span>
            <span className="text-stone-300">|</span>
            <span className="text-stone-300">PayPal Verified Cross-Border Rails</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Find the Exact Indian Manufacturer for Your Specifications
          </h2>
          <p className="text-sm text-stone-300 leading-relaxed max-w-2xl">
            Submit your engineering requirements or procurement scope. TRUVX AI parses your technical tolerances, checks verified Indian export clusters, and connects you directly to a PayPal-verified merchant under one structured transaction.
          </p>

          {/* Quick Preset Buttons */}
          <div className="pt-2">
            <span className="text-xs font-mono uppercase text-[#b2eb76] font-semibold block mb-2">
              Select or Try an Example Requirement:
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() =>
                    handleRunSearch(
                      preset.query,
                      idx === 0 || idx === 2 ? "brass" : idx === 1 ? "fastener" : "software"
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-medium transition-all text-left flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>{preset.title.slice(0, 32)}...</span>
                  <ArrowRight className="w-3 h-3 text-[#b2eb76]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive AI Requirement Intake Prompt */}
      <SpotlightCard className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
          <div className="w-9 h-9 rounded-xl bg-[#ebf7d9] text-[#18280e] flex items-center justify-center font-bold">
            <Bot className="w-5 h-5 text-[#3f7308]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#18280e]">TRUVX AI Sourcing Assistant</h3>
            <p className="text-xs text-stone-500">
              Tell the AI what product, material grade, quantity, or service scope you are sourcing from India
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={buyerQuery}
              onChange={(e) => setBuyerQuery(e.target.value)}
              placeholder="e.g. I need 3,500 solid brass door handles with salt-spray anti-tarnish coating for luxury hotel projects in Long Beach, CA..."
              className="w-full p-4 rounded-2xl bg-[#fbfdf9] border border-stone-200 focus:border-[#18280e] focus:ring-1 focus:ring-[#18280e] text-xs font-mono text-[#18280e] placeholder-stone-400 outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
              <ShieldCheck className="w-4 h-4 text-[#3f7308]" />
              <span>Checking 250+ Verified Indian MSME Clusters &amp; PayPal Business KYC</span>
            </div>

            <KokonutButton
              variant="primary"
              size="md"
              disabled={isSearching || !buyerQuery.trim()}
              onClick={() => handleRunSearch(buyerQuery)}
              className="cursor-pointer"
            >
              {isSearching ? (
                <>
                  <span className="size-3.5 border-2 border-[#b2eb76] border-t-transparent rounded-full animate-spin" />
                  <span>Matching Exporters...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run AI Sourcing Match →</span>
                </>
              )}
            </KokonutButton>
          </div>
        </div>
      </SpotlightCard>

      {/* AI Matched Merchant Card */}
      {showMatch && merchant && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          {/* Headline Banner */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#ebf7d9] border border-[#d8e5ca] text-xs font-mono">
            <div className="flex items-center gap-2 text-[#18280e] font-bold">
              <BadgeCheck className="w-5 h-5 text-[#3f7308]" />
              <span>
                MATCH FOUND: This PayPal-Verified Indian Manufacturer Fits Your Requirement &amp; Has Your Exact Specs ({merchant.matchScore}% Match)
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#18280e] text-[#b2eb76] font-bold text-[10px]">
              VERIFIED COMPLIANT
            </span>
          </div>

          {/* Main Merchant Presentation Card */}
          <SpotlightCard className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
            {/* Header: Company Name & Credentials */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-stone-100">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-xl bg-[#18280e] text-[#b2eb76] flex items-center justify-center font-bold text-xs">
                    🇮🇳
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#18280e]">{merchant.name}</h3>
                    <p className="text-xs text-stone-500 font-mono">{merchant.location}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ebf7d9] text-[#284905] font-bold border border-[#d8e5ca]">
                    ✓ PayPal Verified Business: {merchant.paypalEmail}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold border border-stone-200">
                    {merchant.iecCode}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold border border-stone-200">
                    {merchant.udyamRating}
                  </span>
                </div>
              </div>

              {/* Deal Size & Port Badge */}
              <div className="text-left md:text-right font-mono bg-[#fbfdf9] p-4 rounded-2xl border border-stone-200/80">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Structured Order Value</span>
                <span className="text-2xl font-extrabold text-[#18280e]">
                  ${merchant.commercialTerms.totalUSD.toLocaleString()} USD
                </span>
                <span className="text-xs text-stone-500 block">
                  ≈ ₹{merchant.commercialTerms.approxInrLakhs} Lakhs INR
                </span>
                <span className="text-[11px] text-[#3f7308] font-bold block mt-1">
                  Port: {merchant.commercialTerms.destinationPort}
                </span>
              </div>
            </div>

            {/* Why They Fit Your Exact Requirement */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-stone-400 uppercase tracking-wider">
                Why This Manufacturer Fits Your Exact Requirement:
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed bg-[#fbfdf9] p-4 rounded-2xl border border-stone-200/80 font-mono">
                {merchant.laymanMatchSummary}
              </p>
            </div>

            {/* Exact Specification Match Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-stone-400 uppercase tracking-wider">
                Exact Specification Match Breakdown:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">Material Standard</span>
                  <span className="text-stone-900 font-bold block">{merchant.exactSpecs.material}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">Surface Treatment &amp; Test</span>
                  <span className="text-stone-900 font-bold block">{merchant.exactSpecs.treatment}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">Factory Monthly Capacity</span>
                  <span className="text-stone-900 font-bold block">{merchant.exactSpecs.capacity}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">Export Packaging &amp; Barcode</span>
                  <span className="text-stone-900 font-bold block">{merchant.exactSpecs.packaging}</span>
                </div>
              </div>
            </div>

            {/* PayPal Milestone Protection Breakdown */}
            <div className="p-5 rounded-2xl bg-[#f4faed] border border-[#d8e5ca] space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-[#18280e]">
                  <CreditCard className="w-4 h-4 text-[#3f7308]" />
                  <span>TRUVX Protected Transaction (PayPal Orders v2 Rails)</span>
                </div>
                <span className="text-[10px] bg-white px-2.5 py-0.5 rounded-full border border-[#d8e5ca] font-bold text-[#284905]">
                  Funds Never Disbursed Without Proof
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-1">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">
                    Milestone 1: 30% Upfront Advance
                  </span>
                  <span className="text-base font-extrabold text-[#18280e]">
                    ${merchant.commercialTerms.advanceUSD.toLocaleString()} USD
                  </span>
                  <p className="text-[11px] text-stone-500 leading-tight">
                    Locked in PayPal Escrow to fund copper/brass raw material allocation.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-1">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">
                    Milestone 2: 70% Final Settlement
                  </span>
                  <span className="text-base font-extrabold text-[#18280e]">
                    ${merchant.commercialTerms.balanceUSD.toLocaleString()} USD
                  </span>
                  <p className="text-[11px] text-stone-500 leading-tight">
                    Released only when {merchant.commercialTerms.inspectionAgency} audit and Bill of Lading are verified on ICEGATE.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons & PayPal Trigger */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
                <Lock className="w-4 h-4 text-[#3f7308]" />
                <span>One connected record linking RFQ, PayPal transaction, and QIMA evidence</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <KokonutButton
                  variant="outline"
                  size="md"
                  onClick={() => alert("Downloading digital commercial agreement PDF (UCP 600 Compliant)...")}
                  className="cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Download Agreement (PDF)</span>
                </KokonutButton>

                <KokonutButton
                  variant="primary"
                  size="md"
                  onClick={() => {
                    onTriggerPayPalOrder();
                  }}
                  disabled={paypalLoading}
                  className="cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>
                    {paypalLoading
                      ? "Connecting to PayPal..."
                      : `Lock Deal & Fund 30% Advance ($${merchant.commercialTerms.advanceUSD.toLocaleString()})`}
                  </span>
                </KokonutButton>
              </div>
            </div>

            {/* Live PayPal Sandbox Feedback */}
            {paypalResult && (
              <div className="p-5 rounded-2xl bg-[#ebf7d9] border border-[#d8e5ca] space-y-3 font-mono text-xs animate-in fade-in">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#18280e] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#3f7308]" />
                    PayPal Sandbox Escrow Order Active
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#284905] border border-[#d8e5ca]">
                    Status: {paypalResult.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700">
                  <span>PayPal Order ID: <strong>{paypalResult.id}</strong></span>
                  <span>Escrow Amount: <strong>{paypalResult.amount}</strong></span>
                </div>
                {paypalResult.approveUrl && (
                  <a
                    href={paypalResult.approveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    <span>Proceed to Foreign Buyer Checkout on PayPal Sandbox →</span>
                  </a>
                )}
              </div>
            )}
          </SpotlightCard>
        </div>
      )}
    </div>
  );
}
