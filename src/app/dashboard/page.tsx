"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Store,
  Receipt,
  Settings,
  HelpCircle,
  Calendar,
  Download,
  Eye,
  MousePointer,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  CreditCard,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Layers,
  Scale,
  Ship,
  ClipboardCheck,
  Building,
  Check,
} from "lucide-react";
import { getCurrentSessionUser, setCurrentSessionUser } from "@/lib/auth/authStore";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { ClickSpark } from "@/components/reactbits/ClickSpark";
import { SlideToConfirm } from "@/components/kokonutui/SlideToConfirm";
import { KokonutButton } from "@/components/kokonutui/KokonutButton";
import { HoldToConfirm } from "@/components/kokonutui/HoldToConfirm";
import { TradeOracleStoryline } from "@/components/kokonutui/TradeOracleStoryline";

// =========================================================================
// DATA MODELS & LAYMAN ORDERS (For Indian Merchants & Foundries)
// =========================================================================

interface LaymanTradeOrder {
  id: string;
  orderNumber: string;
  foreignBuyer: {
    company: string;
    contactPerson: string;
    country: string;
    flag: string;
    city: string;
    verifiedStanding: string;
  };
  productName: string;
  laymanExplanation: string;
  quantityUnits: number;
  unitPriceUSD: number;
  totalDealUSD: number;
  approxInrLakhs: number;
  paymentMilestones: {
    advanceUSD: number;
    advanceInrLakhs: number;
    balanceUSD: number;
    terms: string;
  };
  deliveryPort: string;
  inspectionAgency: string;
  status: "30% Advance Escrow Held" | "Production in Progress" | "Ready for QIMA Inspection" | "Customs Cleared Mundra" | "Delivered & Settled";
  category: string;
}

const LAYMAN_ORDERS: LaymanTradeOrder[] = [
  {
    id: "ord_us_01",
    orderNumber: "ORD-USA-9921",
    foreignBuyer: {
      company: "Pacific Architectural Hardware LLC",
      contactPerson: "Marcus Vance (Procurement VP)",
      country: "United States",
      flag: "🇺🇸",
      city: "Irvine, California",
      verifiedStanding: "D&B Rating 5A1 • Active Buyer for 12 Yrs",
    },
    productName: "Architectural Solid Brass Mortise Locksets & Lever Handles",
    laymanExplanation:
      "The American buyer needs 3,500 solid brass door handles and mortise locksets in a satin gold finish. They will install them in luxury beach hotels, so they need a protective anti-tarnish coating that will not rust in sea air (passed 10-day salt spray test). Each handle must be packed in an individual retail box with their barcode sticker.",
    quantityUnits: 3500,
    unitPriceUSD: 24.5,
    totalDealUSD: 85750,
    approxInrLakhs: 71.5,
    paymentMilestones: {
      advanceUSD: 25725,
      advanceInrLakhs: 21.45,
      balanceUSD: 60025,
      terms: "30% Advance paid upfront via PayPal escrow to buy raw brass. Remaining 70% released when goods pass QIMA inspection and load on the ship.",
    },
    deliveryPort: "Port of Long Beach, California (USLGB)",
    inspectionAgency: "QIMA Quality Services (AQL 1.5)",
    status: "30% Advance Escrow Held",
    category: "Brass & Hardware",
  },
  {
    id: "ord_de_02",
    orderNumber: "ORD-GER-9918",
    foreignBuyer: {
      company: "BauMetall Industrie GmbH",
      contactPerson: "Dr. Klaus Schneider (Chief Buyer)",
      country: "Germany",
      flag: "🇩🇪",
      city: "Stuttgart, Germany",
      verifiedStanding: "Euler Hermes Insured • DIN EN Certified",
    },
    productName: "High-Tensile Cold Forged Flange Fasteners (Grade 10.9)",
    laymanExplanation:
      "The German client wants 50,000 heavy-duty steel bolts and flange nuts used in steel bridge and warehouse building. They require Grade 10.9 hardness so they never snap under high vibration. Finished with zinc-nickel silver plating so they stay rust-free in cold European winters. Delivered in 25kg wooden export crates.",
    quantityUnits: 50000,
    unitPriceUSD: 1.85,
    totalDealUSD: 92500,
    approxInrLakhs: 77.2,
    paymentMilestones: {
      advanceUSD: 27750,
      advanceInrLakhs: 23.16,
      balanceUSD: 64750,
      terms: "30% PayPal advance deposited to fund steel billets and tooling. 70% balance transferred when Hamburg shipping bill is filed at Nhava Sheva.",
    },
    deliveryPort: "Port of Hamburg, Germany (DEHAM)",
    inspectionAgency: "TÜV Rheinland India Audit",
    status: "Production in Progress",
    category: "Fasteners & Forgings",
  },
  {
    id: "ord_uk_03",
    orderNumber: "ORD-GBR-9904",
    foreignBuyer: {
      company: "Westminster Heritage Fittings Ltd",
      contactPerson: "Eleanor Wright (Design Director)",
      country: "United Kingdom",
      flag: "🇬🇧",
      city: "Birmingham, UK",
      verifiedStanding: "Royal Institute of British Architects Partner",
    },
    productName: "Hand-Aged Antique Brass Window Cremone Bolts",
    laymanExplanation:
      "The British buyer renovates heritage Georgian estates in London. They want 1,800 traditional window locking rods (cremone bolts). They do not want them shiny modern gold—they want a dark antique bronze patina finish with beeswax coating, looking like they were cast 100 years ago. Hand-finished edges are required.",
    quantityUnits: 1800,
    unitPriceUSD: 42.0,
    totalDealUSD: 75600,
    approxInrLakhs: 63.1,
    paymentMilestones: {
      advanceUSD: 22680,
      advanceInrLakhs: 18.93,
      balanceUSD: 52920,
      terms: "30% initial escrow via PayPal. Balance 70% released upon Bill of Lading arrival at Felixstowe Port.",
    },
    deliveryPort: "Port of Felixstowe, UK (GBFXT)",
    inspectionAgency: "Intertek Testing Services",
    status: "Ready for QIMA Inspection",
    category: "Heritage Brassware",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const currentUser = getCurrentSessionUser();

  // Active view switcher: Main navigation + Trade Engine Side Menus
  const [activeNav, setActiveNav] = useState<
    | "dashboard"
    | "storyline"
    | "layman_store"
    | "orders"
    | "products"
    | "customers"
    | "content"
    | "invoices"
    | "transactions"
    | "reports"
    | "analytics"
    | "discounts"
    | "settings"
    | "help"
    | "rfq_demand"
    | "msme_vetting"
    | "commercial_ai"
    | "paypal_escrow"
    | "quality_qima"
    | "customs_bl"
  >("dashboard");

  const [financesOpen, setFinancesOpen] = useState(true);
  const [tradeRailsOpen, setTradeRailsOpen] = useState(true);
  const [selectedLaymanOrder, setSelectedLaymanOrder] = useState<LaymanTradeOrder>(LAYMAN_ORDERS[0]);
  const [lockedOrderIds, setLockedOrderIds] = useState<Record<string, boolean>>({});

  // PayPal Live Sandbox Execution State inside the dashboard
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [paypalResult, setPaypalResult] = useState<{
    id?: string;
    status?: string;
    approveUrl?: string;
    amount?: string;
  } | null>(null);

  const triggerPayPalEscrow = async () => {
    setPaypalLoading(true);
    try {
      const res = await fetch("/api/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_paypal_payment",
          tradeId: "trade_global_01",
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
          amount: "$25,725.00 USD (30% Advance Escrow)",
        });
      }
    } catch {
      // fallback
    } finally {
      setPaypalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4faed] text-[#18280e] font-sans selection:bg-[#b2eb76] selection:text-[#18280e] flex relative">
      {/* React Bits ClickSpark Particle Glow Canvas */}
      <ClickSpark sparkColor="#b2eb76" sparkCount={9} sparkRadius={26} duration={400} />

      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR (Original Clean Spade Theme + Side Menu Stages)          */}
      {/* ========================================================================= */}
      <aside className="w-64 bg-white border-r border-stone-200/80 flex flex-col justify-between shrink-0 min-h-screen sticky top-0 z-30 shadow-xs">
        <div className="overflow-y-auto max-h-screen scrollbar-none">
          {/* Brand Logo Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-stone-100">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-extrabold text-xl tracking-tight text-[#18280e] font-sans group-hover:text-[#3f7308] transition-colors">
                TradeOracle<span className="text-[#3f7308]">.</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ebf7d9] text-[#3f7308] font-bold">
                PAYPAL
              </span>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1 text-xs font-medium">
            {/* 1. Dashboard (Main Template Analytics View) */}
            <button
              onClick={() => setActiveNav("dashboard")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeNav === "dashboard"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : "text-stone-600 hover:bg-[#f4faed] hover:text-[#18280e]"
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span className="text-sm">Dashboard</span>
              </div>
              {activeNav === "dashboard" && <span className="w-1.5 h-1.5 rounded-full bg-[#b2eb76]" />}
            </button>

            {/* 2. Transaction Storyline (Find → Agree → Pay → Deliver → Prove → Resolve) */}
            <button
              onClick={() => setActiveNav("storyline")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeNav === "storyline"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : "text-[#18280e] bg-[#ebf7d9]/70 hover:bg-[#ebf7d9] font-bold"
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 shrink-0 text-[#3f7308]" />
                <span className="text-sm">Transaction Journey</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-md bg-[#18280e] text-[#b2eb76] font-mono text-[9px] font-bold">
                STORY
              </span>
            </button>

            {/* 3. Foreigner Orders (Layman E-Commerce View for Indian Merchants) */}
            <button
              onClick={() => setActiveNav("layman_store")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeNav === "layman_store"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : "text-stone-600 hover:bg-[#f4faed] hover:text-[#18280e]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Store className="w-4 h-4 shrink-0 text-[#3f7308]" />
                <span className="text-sm">Foreigner Orders</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#ebf7d9] text-[#3f7308] font-bold font-mono text-[10px]">
                MERCHANT
              </span>
            </button>

            {/* 4. Orders (with badge count 46) */}
            <button
              onClick={() => setActiveNav("orders")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeNav === "orders"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : "text-stone-600 hover:bg-[#f4faed] hover:text-[#18280e]"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span className="text-sm">Orders</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#ebf7d9] text-[#3f7308] font-bold font-mono text-[11px]">
                46
              </span>
            </button>

            {/* 5. Products / RFQs */}
            <button
              onClick={() => setActiveNav("products")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeNav === "products"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : "text-stone-600 hover:bg-[#f4faed] hover:text-[#18280e]"
              }`}
            >
              <Package className="w-4 h-4 shrink-0" />
              <span className="text-sm">Products / RFQs</span>
            </button>

            {/* 6. Customers */}
            <button
              onClick={() => setActiveNav("customers")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeNav === "customers"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : "text-stone-600 hover:bg-[#f4faed] hover:text-[#18280e]"
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span className="text-sm">Customers</span>
            </button>

            {/* ================================================================= */}
            {/* TRADE ENGINE STAGES (Clean Sidebar Rail Stages)                    */}
            {/* ================================================================= */}
            <div className="pt-3 pb-1 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setTradeRailsOpen(!tradeRailsOpen)}
                className="w-full flex items-center justify-between px-3.5 py-1 text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold hover:text-[#18280e] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3f7308]" />
                  <span>Trade Engine Rails</span>
                </div>
                {tradeRailsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>

              {tradeRailsOpen && (
                <div className="pl-3 pt-1 space-y-0.5 text-xs font-medium">
                  {/* Step 1 */}
                  <button
                    onClick={() => setActiveNav("rfq_demand")}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeNav === "rfq_demand" ? "bg-[#18280e] text-[#b2eb76] font-semibold" : "text-stone-600 hover:bg-[#f4faed]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">🌐</span>
                      <span>1. Buyer RFQ Demand</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#ebf7d9] text-[#3f7308] font-bold">
                      3 Active
                    </span>
                  </button>

                  {/* Step 2 */}
                  <button
                    onClick={() => setActiveNav("msme_vetting")}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeNav === "msme_vetting" ? "bg-[#18280e] text-[#b2eb76] font-semibold" : "text-stone-600 hover:bg-[#f4faed]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-[#3f7308]" />
                      <span>2. MSME Vetting</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 font-bold">
                      3 Hubs
                    </span>
                  </button>

                  {/* Step 3 */}
                  <button
                    onClick={() => setActiveNav("commercial_ai")}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeNav === "commercial_ai" ? "bg-[#18280e] text-[#b2eb76] font-semibold" : "text-stone-600 hover:bg-[#f4faed]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Scale className="w-3.5 h-3.5 text-[#3f7308]" />
                      <span>3. Commercial PO (AI)</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 font-bold">
                      UCP 600
                    </span>
                  </button>

                  {/* Step 4 */}
                  <button
                    onClick={() => setActiveNav("paypal_escrow")}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeNav === "paypal_escrow" ? "bg-[#18280e] text-[#b2eb76] font-semibold" : "text-stone-600 hover:bg-[#f4faed]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-[#3f7308]" />
                      <span>4. PayPal Escrow</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#ebf7d9] text-[#3f7308] font-bold">
                      30% Adv
                    </span>
                  </button>

                  {/* Step 5 */}
                  <button
                    onClick={() => setActiveNav("quality_qima")}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeNav === "quality_qima" ? "bg-[#18280e] text-[#b2eb76] font-semibold" : "text-stone-600 hover:bg-[#f4faed]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ClipboardCheck className="w-3.5 h-3.5 text-[#3f7308]" />
                      <span>5. QIMA Inspection</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 font-bold">
                      AQL 1.5
                    </span>
                  </button>

                  {/* Step 6 */}
                  <button
                    onClick={() => setActiveNav("customs_bl")}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeNav === "customs_bl" ? "bg-[#18280e] text-[#b2eb76] font-semibold" : "text-stone-600 hover:bg-[#f4faed]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Ship className="w-3.5 h-3.5 text-[#3f7308]" />
                      <span>6. Customs &amp; BL</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 font-bold">
                      ICEGATE
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Finances Section */}
            <div className="pt-2 pb-1">
              <button
                type="button"
                onClick={() => setFinancesOpen(!financesOpen)}
                className="w-full flex items-center justify-between px-3.5 py-1 text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold hover:text-[#18280e] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Finances</span>
                </div>
                {financesOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>

              {financesOpen && (
                <div className="pl-6 pt-1 space-y-1 text-xs font-medium text-stone-600">
                  <button
                    onClick={() => setActiveNav("invoices")}
                    className={`w-full text-left py-1.5 px-3 rounded-lg transition-colors cursor-pointer ${
                      activeNav === "invoices" ? "bg-[#18280e] text-[#b2eb76] font-semibold" : "hover:bg-[#f4faed] hover:text-[#18280e]"
                    }`}
                  >
                    Invoices
                  </button>
                  <button
                    onClick={() => setActiveNav("transactions")}
                    className={`w-full text-left py-1.5 px-3 rounded-lg transition-colors cursor-pointer ${
                      activeNav === "transactions" ? "bg-[#18280e] text-[#b2eb76] font-semibold" : "hover:bg-[#f4faed] hover:text-[#18280e]"
                    }`}
                  >
                    Transactions
                  </button>
                  <button
                    onClick={() => setActiveNav("reports")}
                    className={`w-full text-left py-1.5 px-3 rounded-lg transition-colors cursor-pointer ${
                      activeNav === "reports" ? "bg-[#18280e] text-[#b2eb76] font-semibold" : "hover:bg-[#f4faed] hover:text-[#18280e]"
                    }`}
                  >
                    Reports
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Bottom Section: Kokonut UI Card & PayPal Credentials */}
        <div className="p-4 space-y-3 border-t border-stone-100">
          <div className="space-y-1 text-xs font-medium text-stone-600">
            <button
              onClick={() => setActiveNav("settings")}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                activeNav === "settings" ? "bg-[#18280e] text-[#b2eb76] font-semibold" : "hover:bg-[#f4faed] hover:text-[#18280e]"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button
              onClick={() => setActiveNav("help")}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                activeNav === "help" ? "bg-[#18280e] text-[#b2eb76] font-semibold" : "hover:bg-[#f4faed] hover:text-[#18280e]"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help &amp; Support</span>
            </button>
          </div>

          {/* Kokonut UI / React Bits Verified Trade Card */}
          <SpotlightCard className="p-4 rounded-2xl bg-[#18280e] text-white space-y-2.5 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="size-7 rounded-xl bg-white/10 flex items-center justify-center text-[#b2eb76]">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="size-2 rounded-full bg-[#b2eb76] animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold font-sans text-white">PayPal Active Rails</h4>
              <p className="text-[10px] text-stone-300 leading-tight mt-0.5 font-mono">
                sb-knljl53833937@business
              </p>
            </div>
            <button
              type="button"
              onClick={triggerPayPalEscrow}
              disabled={paypalLoading}
              className="w-full py-1.5 bg-[#b2eb76] hover:bg-[#c2f38d] text-[#18280e] font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              {paypalLoading ? "Connecting..." : "Trigger Escrow ($25.7k)"}
            </button>
          </SpotlightCard>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA (Original Clean Spade Palette)                      */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-stone-200/80 px-8 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[#18280e] tracking-tight capitalize font-sans">
              {activeNav === "dashboard" && "Dashboard"}
              {activeNav === "storyline" && "TradeOracle Transaction Storyline"}
              {activeNav === "layman_store" && "Foreigner Orders (Merchant View)"}
              {activeNav === "orders" && "Active Orders Queue"}
              {activeNav === "products" && "Products & International RFQs"}
              {activeNav === "customers" && "Customers & Global Importers"}
              {activeNav === "invoices" && "Commercial Export Invoices"}
              {activeNav === "transactions" && "PayPal Settlement Ledger"}
              {activeNav === "reports" && "Financial Export Reports"}
              {activeNav === "rfq_demand" && "1. Buyer RFQ Demand (Active Orders)"}
              {activeNav === "msme_vetting" && "2. MSME Vetting & Industrial Hubs"}
              {activeNav === "commercial_ai" && "3. Commercial Negotiation (AI) UCP 600"}
              {activeNav === "paypal_escrow" && "4. PayPal Milestone Escrow"}
              {activeNav === "quality_qima" && "5. QIMA Pre-Shipment Inspection"}
              {activeNav === "customs_bl" && "6. Customs LEO & Bill of Lading"}
              {activeNav === "settings" && "Platform Settings"}
              {activeNav === "help" && "Help & Support"}
            </h1>
            <span className="text-xs font-mono text-stone-400 hidden sm:inline">
              {"// Trade Execution Hub"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* View Switcher: Template vs Journey Storyline */}
            <KokonutButton
              variant={activeNav === "storyline" ? "primary" : "secondary"}
              size="sm"
              withMagnet
              onClick={() => setActiveNav(activeNav === "storyline" ? "dashboard" : "storyline")}
            >
              <Layers className="w-3.5 h-3.5 text-[#3f7308]" />
              <span>{activeNav === "storyline" ? "Dashboard View" : "Transaction Story"}</span>
            </KokonutButton>

            {/* Date Range Selector */}
            <div className="hidden md:flex items-center gap-2 bg-[#f4faed] border border-[#d8e5ca] px-3 py-1.5 rounded-xl text-xs font-mono text-stone-700">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              <span>Jan 1, 2026 - Feb 1, 2026</span>
              <span className="text-stone-300">|</span>
              <span className="font-semibold text-[#18280e]">Last 30 days ∨</span>
            </div>

            {/* Export Button with Magnet */}
            <KokonutButton
              variant="primary"
              size="sm"
              withMagnet
              onClick={() => alert("Exporting verified commercial trade ledger CSV...")}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </KokonutButton>

            {/* Back to Home & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <Link
                href="/"
                className="text-xs font-mono text-stone-500 hover:text-black px-2 py-1 transition-colors"
              >
                Home
              </Link>
              {currentUser && (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentSessionUser(null);
                    router.push("/signin");
                  }}
                  className="text-xs font-mono text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Main Grid Body */}
        <main className="p-6 md:p-8 space-y-6 max-w-[88rem] w-full mx-auto">
          {/* ========================================================================= */}
          {/* VIEW 0: TRANSACTION STORYLINE (The Heart of the Project)                 */}
          {/* ========================================================================= */}
          {activeNav === "storyline" && <TradeOracleStoryline />}

          {/* ========================================================================= */}
          {/* VIEW A: MAIN ANALYTICS DASHBOARD (Exact Match to Previous Template)       */}
          {/* ========================================================================= */}
          {activeNav === "dashboard" && (
            <>
              {/* TOP 4 METRIC CARDS (With Kokonut UI / React Bits Spotlight Glow) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metric 1 */}
                <SpotlightCard className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2 hover:-translate-y-0.5 transition-transform">
                  <div className="flex justify-between items-center text-xs font-medium text-stone-500">
                    <span>Page Views</span>
                    <div className="p-1.5 rounded-lg bg-[#ebf7d9] text-[#18280e]">
                      <Eye className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-[#18280e]">
                      16.431
                    </span>
                    <span className="inline-flex items-center text-xs font-bold text-emerald-700 font-mono">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      15.5%
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 block font-mono">
                    vs. 14,653 last period
                  </span>
                </SpotlightCard>

                {/* Metric 2 */}
                <SpotlightCard className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2 hover:-translate-y-0.5 transition-transform">
                  <div className="flex justify-between items-center text-xs font-medium text-stone-500">
                    <span>Visitors</span>
                    <div className="p-1.5 rounded-lg bg-[#ebf7d9] text-[#18280e]">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-[#18280e]">
                      6.225
                    </span>
                    <span className="inline-flex items-center text-xs font-bold text-emerald-700 font-mono">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      8.4%
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 block font-mono">
                    vs. 5,732 last period
                  </span>
                </SpotlightCard>

                {/* Metric 3 */}
                <SpotlightCard className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2 hover:-translate-y-0.5 transition-transform">
                  <div className="flex justify-between items-center text-xs font-medium text-stone-500">
                    <span>Click</span>
                    <div className="p-1.5 rounded-lg bg-[#ebf7d9] text-[#18280e]">
                      <MousePointer className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-[#18280e]">
                      2.832
                    </span>
                    <span className="inline-flex items-center text-xs font-bold text-rose-600 font-mono">
                      <ArrowDownRight className="w-3.5 h-3.5" />
                      10.5%
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 block font-mono">
                    vs. 3,294 last period
                  </span>
                </SpotlightCard>

                {/* Metric 4 */}
                <SpotlightCard className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2 hover:-translate-y-0.5 transition-transform">
                  <div className="flex justify-between items-center text-xs font-medium text-stone-500">
                    <span>Orders</span>
                    <div className="p-1.5 rounded-lg bg-[#ebf7d9] text-[#18280e]">
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-[#18280e]">
                      1.224
                    </span>
                    <span className="inline-flex items-center text-xs font-bold text-emerald-700 font-mono">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      4.4%
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 block font-mono">
                    vs. 1,186 last period
                  </span>
                </SpotlightCard>
              </div>

              {/* ROW 2: TOTAL PROFIT CHART + MOST DAY ACTIVE + REPEAT RATE */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Total Profit Area Chart */}
                <SpotlightCard className="lg:col-span-2 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-semibold text-stone-500 font-mono uppercase tracking-wider">
                        Total Profit
                      </h3>
                      <div className="flex items-baseline gap-3 mt-1">
                        <span className="text-3xl font-extrabold font-mono text-[#18280e]">
                          $446.7K
                        </span>
                        <span className="text-xs font-bold text-emerald-700 font-mono">
                          ▲ 24.4% vs. last period
                        </span>
                      </div>
                    </div>

                    <div className="text-xs font-mono text-stone-400 flex items-center gap-1.5 bg-[#f4faed] px-3 py-1 rounded-full border border-[#d8e5ca]">
                      <span className="size-2 rounded-full bg-[#3f7308] animate-pulse" />
                      <span className="text-[#18280e] font-bold">PayPal Orders v2 Verified</span>
                    </div>
                  </div>

                  {/* SVG Spline Area Chart */}
                  <div className="relative w-full h-48 select-none">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 600 180" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="profitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#b2eb76" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#b2eb76" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      <line x1="0" y1="20" x2="600" y2="20" stroke="#f1f5e9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="70" x2="600" y2="70" stroke="#f1f5e9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="120" x2="600" y2="120" stroke="#f1f5e9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="170" x2="600" y2="170" stroke="#e6ebd9" strokeWidth="1" />

                      <path
                        d="M 0 140 Q 60 145 120 120 T 240 70 T 360 85 T 480 30 T 600 45 L 600 170 L 0 170 Z"
                        fill="url(#profitGrad)"
                      />
                      <path
                        d="M 0 140 Q 60 145 120 120 T 240 70 T 360 85 T 480 30 T 600 45"
                        fill="none"
                        stroke="#18280e"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      <circle cx="120" cy="120" r="4" fill="#ffffff" stroke="#18280e" strokeWidth="2.5" />
                      <circle cx="240" cy="70" r="4" fill="#ffffff" stroke="#18280e" strokeWidth="2.5" />
                      <circle cx="480" cy="30" r="5" fill="#b2eb76" stroke="#18280e" strokeWidth="2.5" />
                    </svg>
                  </div>

                  <div className="flex justify-between text-xs font-mono text-stone-400 pt-1 border-t border-stone-100">
                    <span>1 Jan</span>
                    <span>8 Jan</span>
                    <span>15 Jan</span>
                    <span>22 Jan</span>
                    <span>29 Jan</span>
                  </div>

                  {/* Customer Segment Breakdown */}
                  <div className="pt-2 border-t border-stone-100">
                    <span className="text-xs font-semibold text-stone-500 block mb-2 font-mono uppercase">Customers Distribution</span>
                    <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                      <div className="p-3 rounded-xl bg-[#f4faed] border-l-4 border-l-[#18280e]">
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">Retailers</span>
                        <span className="text-base font-bold text-[#18280e]">2.884</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#f4faed] border-l-4 border-l-[#3f7308]">
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">Distributors</span>
                        <span className="text-base font-bold text-[#18280e]">1.432</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#f4faed] border-l-4 border-l-amber-600">
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">Wholesalers</span>
                        <span className="text-base font-bold text-[#18280e]">562</span>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>

                {/* Right Column: Most Day Active + Repeat Rate */}
                <div className="space-y-6">
                  {/* Most Day Active Bar Chart */}
                  <SpotlightCard className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-stone-700">Most Day Active</span>
                      <span className="text-stone-400">•••</span>
                    </div>

                    <div className="flex items-end justify-between h-36 pt-4 pb-1">
                      <div className="flex flex-col items-center gap-1.5 flex-1">
                        <div className="w-5 bg-stone-100 rounded-t-md h-16" />
                        <span className="text-[10px] font-mono text-stone-400">Sun</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 flex-1">
                        <div className="w-5 bg-stone-100 rounded-t-md h-24" />
                        <span className="text-[10px] font-mono text-stone-400">Mon</span>
                      </div>
                      {/* Highlighted Tuesday */}
                      <div className="flex flex-col items-center gap-1.5 flex-1 relative">
                        <span className="absolute -top-6 text-[10px] font-mono font-bold text-[#18280e] bg-[#ebf7d9] px-1.5 py-0.5 rounded shadow-2xs">
                          8.162
                        </span>
                        <div className="w-5 bg-[#18280e] rounded-t-md h-32" />
                        <span className="text-[10px] font-mono font-bold text-[#18280e]">Tue</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 flex-1">
                        <div className="w-5 bg-stone-100 rounded-t-md h-20" />
                        <span className="text-[10px] font-mono text-stone-400">Wed</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 flex-1">
                        <div className="w-5 bg-stone-100 rounded-t-md h-22" />
                        <span className="text-[10px] font-mono text-stone-400">Thu</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 flex-1">
                        <div className="w-5 bg-stone-100 rounded-t-md h-26" />
                        <span className="text-[10px] font-mono text-stone-400">Fr</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 flex-1">
                        <div className="w-5 bg-stone-100 rounded-t-md h-12" />
                        <span className="text-[10px] font-mono text-stone-400">Sat</span>
                      </div>
                    </div>
                  </SpotlightCard>

                  {/* Repeat Customer Rate Gauge */}
                  <SpotlightCard className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-stone-700">Repeat Customer Rate</span>
                      <span className="text-stone-400">•••</span>
                    </div>

                    <div className="flex flex-col items-center justify-center pt-2">
                      <div className="relative w-40 h-20 flex items-end justify-center overflow-hidden">
                        <svg className="w-40 h-40 absolute top-0" viewBox="0 0 100 100">
                          <path
                            d="M 15 50 A 35 35 0 0 1 85 50"
                            fill="none"
                            stroke="#e6ebd9"
                            strokeWidth="8"
                            strokeDasharray="3 3"
                          />
                          <path
                            d="M 15 50 A 35 35 0 0 1 85 50"
                            fill="none"
                            stroke="#3f7308"
                            strokeWidth="9"
                            strokeDasharray="80 120"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="text-3xl font-extrabold font-mono text-[#18280e] relative z-10">
                          68%
                        </span>
                      </div>

                      <span className="text-xs text-stone-500 font-medium mt-3">
                        On track for 80% target
                      </span>
                      <button
                        onClick={() => setActiveNav("storyline")}
                        className="mt-2 text-xs font-mono font-semibold text-[#3f7308] hover:underline cursor-pointer"
                      >
                        Inspect Storyline &amp; Evidence →
                      </button>
                    </div>
                  </SpotlightCard>
                </div>
              </div>

              {/* ROW 3: BEST SELLING PRODUCTS + AI ASSISTANT WIDGET */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Best Selling Products */}
                <SpotlightCard className="lg:col-span-2 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-stone-700">Best Selling Products</h3>
                    <span className="text-stone-400 text-xs">•••</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-stone-100 text-[10px] text-stone-400 uppercase tracking-wider">
                          <th className="pb-3 font-semibold">ID</th>
                          <th className="pb-3 font-semibold">NAME</th>
                          <th className="pb-3 font-semibold">SOLD</th>
                          <th className="pb-3 font-semibold">REVENUE</th>
                          <th className="pb-3 font-semibold">RATING</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        <tr className="hover:bg-[#f4faed] transition-colors">
                          <td className="py-3 text-stone-400">#83009</td>
                          <td className="py-3 font-bold text-[#18280e] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#3f7308]" />
                            <span>Solid Brass Mortise Locksets (C36000)</span>
                          </td>
                          <td className="py-3 text-stone-600">2,310 sold</td>
                          <td className="py-3 font-bold text-[#18280e]">$124,839</td>
                          <td className="py-3 text-amber-600 font-bold">★ (5.0) QIMA Passed</td>
                        </tr>
                        <tr className="hover:bg-[#f4faed] transition-colors">
                          <td className="py-3 text-stone-400">#83001</td>
                          <td className="py-3 font-bold text-[#18280e] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-600" />
                            <span>High-Tensile Cold Forged Fasteners</span>
                          </td>
                          <td className="py-3 text-stone-600">1,230 sold</td>
                          <td className="py-3 font-bold text-[#18280e]">$92,662</td>
                          <td className="py-3 text-amber-600 font-bold">★ (4.8) In Transit</td>
                        </tr>
                        <tr className="hover:bg-[#f4faed] transition-colors">
                          <td className="py-3 text-stone-400">#83042</td>
                          <td className="py-3 font-bold text-[#18280e] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#18280e]" />
                            <span>Precision CNC Hydraulic Valves &amp; Bushings</span>
                          </td>
                          <td className="py-3 text-stone-600">850 sold</td>
                          <td className="py-3 font-bold text-[#18280e]">$68,450</td>
                          <td className="py-3 text-amber-600 font-bold">★ (4.9) Verified</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </SpotlightCard>

                {/* AI Assistant & PayPal Trigger Widget */}
                <SpotlightCard className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#3f7308] animate-pulse" />
                      <span className="font-bold text-[#18280e]">AI Trade Assistant</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center py-2 space-y-3">
                    <div className="size-20 rounded-full bg-gradient-to-tr from-[#18280e] via-[#3f7308] to-[#b2eb76] p-0.5 shadow-md flex items-center justify-center">
                      <div className="size-full bg-white rounded-full flex items-center justify-center text-[#18280e]">
                        <Sparkles className="w-8 h-8 text-[#18280e] animate-pulse" />
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-bold text-[#18280e] block">
                        PayPal Orders v2 Connected
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono">
                        Merchant: sb-knljl53833937@business.example.com
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <KokonutButton
                      variant="primary"
                      size="md"
                      withMagnet
                      onClick={triggerPayPalEscrow}
                      disabled={paypalLoading}
                      className="w-full"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>
                        {paypalLoading ? "Connecting to PayPal..." : "Test PayPal Escrow ($25,725)"}
                      </span>
                    </KokonutButton>

                    {paypalResult && (
                      <div className="p-2.5 rounded-lg bg-[#ebf7d9] text-[#18280e] text-[11px] font-mono space-y-1">
                        <div className="flex justify-between">
                          <span>Order:</span>
                          <strong className="text-[#3f7308]">{paypalResult.id}</strong>
                        </div>
                        {paypalResult.approveUrl && (
                          <a
                            href={paypalResult.approveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#3f7308] underline block text-center font-bold"
                          >
                            Open PayPal Sandbox Checkout →
                          </a>
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setActiveNav("storyline")}
                      className="w-full py-2 text-stone-600 hover:text-[#18280e] text-xs font-mono font-medium text-center block cursor-pointer"
                    >
                      View Connected Transaction Story →
                    </button>
                  </div>
                </SpotlightCard>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* VIEW B: MERCHANT E-COMMERCE ORDER CARDS (With Kokonut UI SlideToConfirm) */}
          {/* ========================================================================= */}
          {activeNav === "layman_store" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#3f7308] uppercase mb-1">
                    <span>Indian Manufacturer / Merchant View</span>
                    <span>•</span>
                    <span>Plain Layman Language</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18280e] tracking-tight font-sans">
                    Incoming International Buyer Orders &amp; Demands
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
                    We translate complicated foreign engineering specifications and trade terms into plain, simple language so you know exactly what the foreigner wants, how much they will pay in Rupees, and when your PayPal advance is safely in escrow.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-[#ebf7d9] text-[#18280e] font-bold border border-[#d8e5ca]">
                    3 Verified Foreign RFQs
                  </span>
                </div>
              </div>

              {/* 3 E-Commerce Style Product / Buyer Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {LAYMAN_ORDERS.map((order) => {
                  const isSelected = selectedLaymanOrder.id === order.id;
                  const isLocked = lockedOrderIds[order.id];

                  return (
                    <SpotlightCard
                      key={order.id}
                      className={`bg-white rounded-3xl border transition-all duration-300 p-6 flex flex-col justify-between space-y-5 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${
                        isSelected
                          ? "border-[#3f7308] ring-2 ring-[#b2eb76]/40 shadow-md"
                          : "border-stone-200/80 shadow-xs"
                      }`}
                      onClick={() => setSelectedLaymanOrder(order)}
                    >
                      {/* Top Buyer Identity Banner with Real Flags */}
                      <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{order.foreignBuyer.flag}</span>
                            <div>
                              <span className="font-bold text-sm text-[#18280e] leading-snug block">
                                {order.foreignBuyer.company}
                              </span>
                              <span className="text-[11px] text-stone-500 font-mono block">
                                {order.foreignBuyer.city}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-bold shrink-0">
                          {order.orderNumber}
                        </span>
                      </div>

                      {/* Product Name & Visual Badge */}
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-1">
                          Product Requested
                        </span>
                        <h3 className="font-bold text-base text-[#18280e] leading-snug font-sans">
                          {order.productName}
                        </h3>
                        <span className="inline-block mt-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#ebf7d9] text-[#3f7308]">
                          {order.category}
                        </span>
                      </div>

                      {/* Plain Layman Explanation Box */}
                      <div className="p-4 rounded-2xl bg-[#f8fbf5] border border-[#d8e5ca]/80 text-xs text-stone-800 leading-relaxed space-y-1">
                        <span className="text-[10px] font-mono font-bold uppercase text-[#3f7308] block">
                          💡 What the Foreigner is Asking (In Simple Words):
                        </span>
                        <p>{order.laymanExplanation}</p>
                      </div>

                      {/* Commercial Numbers (USD + Plain INR Lakhs) */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 font-mono text-xs">
                        <div className="p-3 rounded-xl bg-stone-50">
                          <span className="text-[10px] text-stone-400 block uppercase">Order Quantity</span>
                          <span className="font-bold text-[#18280e] block">
                            {order.quantityUnits.toLocaleString()} units
                          </span>
                          <span className="text-[10px] text-stone-500">@ ${order.unitPriceUSD}/pc</span>
                        </div>

                        <div className="p-3 rounded-xl bg-[#ebf7d9] text-right">
                          <span className="text-[10px] text-stone-500 block uppercase">Total Deal Value</span>
                          <span className="font-bold text-[#18280e] text-sm block">
                            ${order.totalDealUSD.toLocaleString()}
                          </span>
                          <span className="text-[11px] font-bold text-[#3f7308] block">
                            ≈ ₹{order.approxInrLakhs} Lakhs
                          </span>
                        </div>
                      </div>

                      {/* Payment Terms & PayPal Security */}
                      <div className="text-[11px] text-stone-600 bg-stone-50 p-3.5 rounded-2xl border border-stone-100 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-[#18280e]">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#3f7308]" />
                          <span>PayPal Escrow Protection</span>
                        </div>
                        <p className="leading-snug text-stone-600 font-mono text-[10px]">
                          {order.paymentMilestones.terms}
                        </p>
                      </div>

                      {/* Kokonut UI SlideToConfirm Button (Replacing the Ugly Buttons) */}
                      <div className="pt-2 space-y-2">
                        {isLocked ? (
                          <div className="h-11 rounded-xl bg-[#18280e] text-[#b2eb76] font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-xs">
                            <Check className="w-4 h-4" />
                            <span>Deal Locked • Proforma Invoice Active</span>
                          </div>
                        ) : (
                          <SlideToConfirm
                            text="Slide to Lock Deal &amp; Escrow"
                            confirmedText="Deal Locked • PayPal Protected"
                            onConfirm={() => {
                              setLockedOrderIds((prev) => ({ ...prev, [order.id]: true }));
                              setSelectedLaymanOrder(order);
                            }}
                          />
                        )}

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLaymanOrder(order);
                            }}
                            className="text-[11px] font-mono text-[#3f7308] hover:underline font-bold"
                          >
                            Inspect Full Statutory Details →
                          </button>
                        </div>
                      </div>
                    </SpotlightCard>
                  );
                })}
              </div>

              {/* Selected Order Detailed Drawer with Kokonut UI HoldToConfirm */}
              <SpotlightCard className="p-6 md:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{selectedLaymanOrder.foreignBuyer.flag}</span>
                    <div>
                      <h3 className="text-lg font-bold text-[#18280e] font-sans">
                        Selected Order: {selectedLaymanOrder.productName} ({selectedLaymanOrder.orderNumber})
                      </h3>
                      <span className="text-xs text-stone-500 font-mono">
                        Buyer: {selectedLaymanOrder.foreignBuyer.company} • {selectedLaymanOrder.foreignBuyer.city}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      ✓ {selectedLaymanOrder.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Port Destination</span>
                    <strong className="text-[#18280e] block">{selectedLaymanOrder.deliveryPort}</strong>
                    <span className="text-[11px] text-stone-500 block">FOB Mundra Port, Gujarat</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Inspection Agency</span>
                    <strong className="text-[#18280e] block">{selectedLaymanOrder.inspectionAgency}</strong>
                    <span className="text-[11px] text-stone-500 block">Audited prior to ship loading</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#ebf7d9] border border-[#d8e5ca] space-y-1">
                    <span className="text-stone-600 block text-[10px] uppercase font-bold">30% Advance Escrow</span>
                    <strong className="text-[#18280e] text-sm block">
                      ${selectedLaymanOrder.paymentMilestones.advanceUSD.toLocaleString()} USD
                    </strong>
                    <span className="text-[11px] font-bold text-[#3f7308] block">
                      ≈ ₹{selectedLaymanOrder.paymentMilestones.advanceInrLakhs} Lakhs into PayPal
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">70% Final Balance</span>
                    <strong className="text-[#18280e] text-sm block">
                      ${selectedLaymanOrder.paymentMilestones.balanceUSD.toLocaleString()} USD
                    </strong>
                    <span className="text-[11px] text-stone-500 block">Released against Bill of Lading</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <span className="text-xs font-mono text-stone-500">
                    Statutory Verification: DGFT IEC, GSTIN, and ICEGATE clearance active.
                  </span>
                  <HoldToConfirm
                    onConfirm={() => alert(`Statutory verification certificate generated for order #${selectedLaymanOrder.orderNumber}`)}
                    label="Hold to Verify Statutory Evidence Pack"
                    confirmedLabel="✓ Evidence Pack Audited & Locked"
                  />
                </div>
              </SpotlightCard>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STAGE VIEWS (Moved from top runner into side menus)                       */}
          {/* ========================================================================= */}

          {/* 1. Buyer RFQ Demand */}
          {activeNav === "rfq_demand" && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4 font-mono text-xs animate-in fade-in">
              <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                <div>
                  <h2 className="text-base font-bold text-[#18280e]">1. Buyer RFQ Demand (3 Active Corridors)</h2>
                  <span className="text-stone-500">Foreign buyer requests with verified purchasing budgets</span>
                </div>
                <KokonutButton
                  variant="secondary"
                  size="sm"
                  withMagnet
                  onClick={() => setActiveNav("layman_store")}
                >
                  View Merchant Cards →
                </KokonutButton>
              </div>

              <div className="space-y-3">
                {LAYMAN_ORDERS.map((ord) => (
                  <div key={ord.id} className="p-4 rounded-2xl bg-[#fbfdf9] border border-stone-200 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{ord.foreignBuyer.flag}</span>
                        <strong className="text-[#18280e] text-sm">{ord.productName}</strong>
                        <span className="text-stone-400">({ord.orderNumber})</span>
                      </div>
                      <span className="text-stone-500 block text-[11px] mt-1">
                        Buyer: {ord.foreignBuyer.company} • Destination: {ord.deliveryPort}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sm text-[#18280e] block">${ord.totalDealUSD.toLocaleString()} USD</span>
                      <span className="text-[#3f7308] font-bold">≈ ₹{ord.approxInrLakhs} Lakhs</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. MSME Vetting */}
          {activeNav === "msme_vetting" && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4 font-mono text-xs animate-in fade-in">
              <h2 className="text-base font-bold text-[#18280e] pb-3 border-b border-stone-100">
                2. MSME Vetting &amp; Industrial Clusters
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <span className="text-[10px] text-[#3f7308] uppercase font-bold">Brass &amp; Hardware Hub</span>
                  <h4 className="font-bold text-sm text-[#18280e]">Moradabad Cluster</h4>
                  <p className="text-stone-600 text-xs">DGFT IEC: 0508012491 • 140 Foundries Validated</p>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded inline-block mt-1">
                    ✓ ISO 9001:2015 Audited
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <span className="text-[10px] text-[#3f7308] uppercase font-bold">Forgings &amp; Valves Hub</span>
                  <h4 className="font-bold text-sm text-[#18280e]">Rajkot GIDC Cluster</h4>
                  <p className="text-stone-600 text-xs">DGFT IEC: 0812049182 • 85k Units/mo Capacity</p>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded inline-block mt-1">
                    ✓ IATF 16949 Certified
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <span className="text-[10px] text-[#3f7308] uppercase font-bold">Textiles &amp; Knits Hub</span>
                  <h4 className="font-bold text-sm text-[#18280e]">Tirupur Cluster</h4>
                  <p className="text-stone-600 text-xs">DGFT IEC: 3204918201 • OEKO-TEX Standard 100</p>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded inline-block mt-1">
                    ✓ WRAP Gold Certified
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3. Commercial Negotiation AI */}
          {activeNav === "commercial_ai" && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4 font-mono text-xs animate-in fade-in">
              <h2 className="text-base font-bold text-[#18280e] pb-3 border-b border-stone-100">
                3. Commercial Negotiation (AI) &amp; UCP 600 Harmonization
              </h2>
              <div className="p-5 rounded-2xl bg-[#f8fbf5] border border-[#d8e5ca] space-y-2 text-stone-700">
                <span className="font-bold text-[#18280e] block">Automated Purchase Order vs Invoice Comparison:</span>
                <p className="leading-relaxed">
                  Our trade engine cross-references the foreign buyer&apos;s Purchase Order against the Indian exporter&apos;s Proforma Invoice, verifying Incoterms 2020 (FOB Mundra), ASTM alloy specifications, and milestone disbursement triggers to eliminate payment disputes before production begins.
                </p>
              </div>
            </div>
          )}

          {/* 4. PayPal Milestone Escrow */}
          {activeNav === "paypal_escrow" && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4 font-mono text-xs animate-in fade-in">
              <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                <div>
                  <h2 className="text-base font-bold text-[#18280e]">4. PayPal Milestone Escrow Execution</h2>
                  <span className="text-stone-500">Live Orders v2 API settlement console</span>
                </div>
                <KokonutButton
                  variant="primary"
                  size="sm"
                  withMagnet
                  onClick={triggerPayPalEscrow}
                  disabled={paypalLoading}
                >
                  {paypalLoading ? "Connecting to PayPal..." : "+ Create Test Escrow Order ($25,725)"}
                </KokonutButton>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-stone-400 uppercase font-bold text-[10px] block">Connected PayPal Sandbox Account</span>
                <span className="font-bold text-sm text-[#18280e] block">sb-knljl53833937@business.example.com</span>
                <span className="text-stone-500 block text-[11px]">
                  Client ID: <code>AU-2yZPCo9C6_04QNEUens2pAgdB00D3FhVJYfLqV8q6lulIe23tghXNuvsEkYNHeHtPtnJJMHOfDF_s</code>
                </span>
              </div>

              {paypalResult && (
                <div className="p-4 rounded-2xl bg-[#ebf7d9] border border-[#d8e5ca] space-y-2">
                  <span className="font-bold text-[#18280e] block">✓ PayPal Order Created Successfully</span>
                  <div className="flex justify-between text-xs font-mono">
                    <span>Order ID: <strong>{paypalResult.id}</strong></span>
                    <span>Status: <strong>{paypalResult.status}</strong></span>
                  </div>
                  {paypalResult.approveUrl && (
                    <a
                      href={paypalResult.approveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-[#18280e] text-[#b2eb76] rounded-xl font-bold text-xs mt-2"
                    >
                      Complete Sandbox Payment in PayPal Checkout →
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 5. QIMA Quality Inspection */}
          {activeNav === "quality_qima" && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4 font-mono text-xs animate-in fade-in">
              <h2 className="text-base font-bold text-[#18280e] pb-3 border-b border-stone-100">
                5. Quality &amp; QIMA Pre-Shipment Inspection
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                    PASSED • AQL 1.5 AUDITED
                  </span>
                  <h4 className="font-bold text-sm text-[#18280e]">Audit #QIMA-IN-98124 (Solid Brass Locksets)</h4>
                  <p className="text-stone-600 text-xs">
                    Tested 125 sample locksets for 240-hr ASTM B117 salt spray resistance and cycle durability. Zero critical defects found.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                    PASSED • HYDRO-STATIC 25 BAR
                  </span>
                  <h4 className="font-bold text-sm text-[#18280e]">Audit #TUV-RH-44018 (Grade 10.9 Fasteners)</h4>
                  <p className="text-stone-600 text-xs">
                    Proof load test to 830 MPa conducted at TÜV laboratory. Zinc-nickel coating thickness verified at 12 microns.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 6. Customs LEO & Bill of Lading */}
          {activeNav === "customs_bl" && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4 font-mono text-xs animate-in fade-in">
              <h2 className="text-base font-bold text-[#18280e] pb-3 border-b border-stone-100">
                6. Customs LEO &amp; Bill of Lading (ICEGATE Electronic Gate-In)
              </h2>
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex justify-between items-center">
                  <strong className="text-sm text-[#18280e]">Shipping Bill #SB-INMUN1-2026-981024</strong>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                    Let Export Order (LEO) Issued
                  </span>
                </div>
                <p className="text-stone-600 text-xs">
                  Port of Loading: Mundra Port (INMUN1) • Ocean Carrier: Maersk Line • Container: MSKU-7491024 • Bill of Lading: BL-MSK-2026-44018A
                </p>
              </div>
            </div>
          )}

          {/* Fallback standard tabs */}
          {activeNav === "orders" && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4 font-mono text-xs animate-in fade-in">
              <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                <h2 className="text-base font-bold text-[#18280e]">Commercial Export Orders (46 Active)</h2>
                <KokonutButton
                  variant="secondary"
                  size="sm"
                  withMagnet
                  onClick={() => setActiveNav("layman_store")}
                >
                  Switch to Merchant Plain View →
                </KokonutButton>
              </div>
              <div className="divide-y divide-stone-100">
                {LAYMAN_ORDERS.map((ord) => (
                  <div key={ord.id} className="py-3.5 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-[#18280e]">{ord.orderNumber} • {ord.productName}</span>
                      <span className="text-stone-500 block text-[11px]">Buyer: {ord.foreignBuyer.company} • Port: {ord.deliveryPort}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#18280e] block">${ord.totalDealUSD.toLocaleString()} USD</span>
                      <span className="text-[10px] font-bold text-[#3f7308] bg-[#ebf7d9] px-2 py-0.5 rounded">{ord.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeNav === "products" && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4 font-mono text-xs animate-in fade-in">
              <h2 className="text-base font-bold text-[#18280e] pb-3 border-b border-stone-100">International RFQ Catalog</h2>
              <div className="space-y-3">
                {LAYMAN_ORDERS.map((ord) => (
                  <div key={ord.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-sm text-[#18280e]">{ord.productName}</h4>
                      <p className="text-stone-600 text-xs mt-0.5">{ord.laymanExplanation}</p>
                    </div>
                    <span className="font-bold text-sm text-[#3f7308]">${ord.totalDealUSD.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeNav === "customers" && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4 font-mono text-xs animate-in fade-in">
              <h2 className="text-base font-bold text-[#18280e] pb-3 border-b border-stone-100">Verified Global Importers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LAYMAN_ORDERS.map((ord) => (
                  <div key={ord.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="text-xl">{ord.foreignBuyer.flag}</span>
                    <h4 className="font-bold text-sm text-[#18280e]">{ord.foreignBuyer.company}</h4>
                    <p className="text-stone-600 text-xs">{ord.foreignBuyer.city} • Contact: {ord.foreignBuyer.contactPerson}</p>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded inline-block mt-1">
                      {ord.foreignBuyer.verifiedStanding}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeNav === "invoices" || activeNav === "transactions" || activeNav === "reports") && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4 font-mono text-xs animate-in fade-in">
              <h2 className="text-base font-bold text-[#18280e] pb-3 border-b border-stone-100 capitalize">
                {activeNav} &amp; PayPal Settlement Ledger
              </h2>
              <div className="divide-y divide-stone-100">
                <div className="py-3.5 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#18280e]">INV-2026-9921-ADV (30% Production Advance)</span>
                    <span className="text-stone-500 block text-[11px]">Buyer: Pacific Architectural Hardware • PayPal Capture ID: CAP-2JM21803AA</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#18280e] block text-sm">$25,725.00 USD</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Settled via PayPal</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeNav === "settings" || activeNav === "help" || activeNav === "analytics" || activeNav === "discounts" || activeNav === "content") && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4 font-mono text-xs animate-in fade-in">
              <h2 className="text-base font-bold text-[#18280e] pb-3 border-b border-stone-100 capitalize">{activeNav}</h2>
              <p className="text-stone-600">
                Configure and review {activeNav} settings for your verified international trade and PayPal merchant profile.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
