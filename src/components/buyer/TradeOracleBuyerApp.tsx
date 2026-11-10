"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  FileQuestion,
  ShoppingBag,
  CreditCard,
  FileText,
  MessageSquare,
  Settings,
  Bell,
  HelpCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ExternalLink,
  Download,
  Filter,
  Layers,
  Building,
  Check,
  Ship,
  Sparkles,
  AlertCircle,
  Eye,
  LogOut,
  ChevronRight,
} from "lucide-react";
import {
  INITIAL_SUPPLIERS,
  INITIAL_RFQS,
  INITIAL_QUOTES,
  INITIAL_ORDERS,
  INITIAL_DOCUMENTS,
  SupplierItem,
  RFQItem,
  QuotationItem,
  OrderWorkspaceItem,
  DocumentItem,
} from "@/lib/buyer/buyerStore";
import { getCurrentSessionUser, setCurrentSessionUser } from "@/lib/auth/authStore";

export function TradeOracleBuyerApp() {
  const router = useRouter();
  const currentUser = getCurrentSessionUser();

  useEffect(() => {
    if (!currentUser) {
      router.push("/signin?role=buyer");
    } else if (currentUser.role === "manufacturer") {
      router.push("/dashboard");
    } else if (currentUser.role === "service") {
      router.push("/service");
    }
  }, [currentUser, router]);

  // Navigation Tabs matching prompt:
  // 1. Dashboard, 2. Find Suppliers, 3. My RFQs, 4. My Orders, 5. Payments, 6. Documents, 7. Messages, 8. Settings
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "suppliers" | "rfqs" | "orders" | "payments" | "documents" | "messages" | "settings"
  >("dashboard");

  // State collections
  const [suppliers, setSuppliers] = useState<SupplierItem[]>(INITIAL_SUPPLIERS);
  const [rfqs, setRfqs] = useState<RFQItem[]>(INITIAL_RFQS);
  const [quotes, setQuotes] = useState<QuotationItem[]>(INITIAL_QUOTES);
  const [orders, setOrders] = useState<OrderWorkspaceItem[]>(INITIAL_ORDERS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);

  // Active selections
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierItem | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderWorkspaceItem>(orders[0]);
  const [compareQuotesForRfqId, setCompareQuotesForRfqId] = useState<string | null>(null);

  // Supplier Search & Filters
  const [supplierSearchQuery, setSupplierSearchQuery] = useState("");
  const [supplierTypeFilter, setSupplierTypeFilter] = useState<"all" | "goods" | "service">("all");
  const [supplierCategoryFilter, setSupplierCategoryFilter] = useState("all");

  // Multi-step RFQ Modal State
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);
  const [rfqType, setRfqType] = useState<"goods" | "service">("goods");
  const [rfqForm, setRfqForm] = useState({
    title: "",
    category: "Brassware & Hardware",
    quantity: 2500,
    unit: "pcs",
    budgetUSD: 45000,
    specifications: "",
    qualityRequirements: "QIMA AQL 1.5 Pre-Shipment Inspection Certificate",
    destinationPort: "Port of Long Beach, California (USLGB)",
    deliveryDate: "2026-05-15",
    scopeOfWork: "",
    skills: "React, Next.js, PayPal API",
  });

  // PayPal Sandbox Payment Trigger
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [paypalSuccessMsg, setPaypalSuccessMsg] = useState<{ orderId: string; amount: string } | null>(null);

  // Handle Supplier Shortlist Toggle
  const toggleShortlist = (supplierId: string) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === supplierId ? { ...s, shortlisted: !s.shortlisted } : s))
    );
  };

  // Handle RFQ Submit
  const handleCreateRFQ = (e: React.FormEvent) => {
    e.preventDefault();
    const newRfq: RFQItem = {
      id: "rfq_" + Date.now(),
      rfqNumber: `RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      type: rfqType,
      title: rfqForm.title || (rfqType === "goods" ? "Precision Brass Custom Batch" : "Fintech Integration Sprint"),
      category: rfqForm.category,
      targetQuantity: rfqType === "goods" ? Number(rfqForm.quantity) : undefined,
      targetUnit: rfqType === "goods" ? rfqForm.unit : undefined,
      budgetUSD: Number(rfqForm.budgetUSD),
      specifications: rfqForm.specifications || "Standard international export specifications.",
      qualityRequirements: rfqForm.qualityRequirements,
      destinationPort: rfqForm.destinationPort,
      expectedDeliveryDate: rfqForm.deliveryDate,
      scopeOfWork: rfqType === "service" ? rfqForm.scopeOfWork : undefined,
      status: "open",
      createdAt: new Date().toISOString().split("T")[0],
      quotesCount: 0,
    };
    setRfqs([newRfq, ...rfqs]);
    setIsRfqModalOpen(false);
    setActiveTab("rfqs");
  };

  // Handle Quotation Acceptance -> Creates Order Workspace
  const handleAcceptQuotation = (quote: QuotationItem) => {
    const parentRfq = rfqs.find((r) => r.id === quote.rfqId);
    const newOrder: OrderWorkspaceItem = {
      id: "ord_" + Date.now(),
      orderNumber: `ORD-USA-${Math.floor(1000 + Math.random() * 9000)}`,
      rfqId: quote.rfqId,
      quotationId: quote.id,
      supplierId: quote.supplierId,
      supplierName: quote.supplierName,
      supplierEmail: "sb-knljl53833937@business.example.com",
      buyerCompany: "Pacific Architectural Hardware LLC (USA)",
      type: parentRfq?.type || "goods",
      productOrServiceName: parentRfq?.title || quote.notes,
      totalAmountUSD: quote.totalPriceUSD,
      advanceDepositUSD: Math.round(quote.totalPriceUSD * 0.3),
      balanceUSD: Math.round(quote.totalPriceUSD * 0.7),
      currency: "USD",
      currentStageIndex: 0,
      milestones:
        parentRfq?.type === "service"
          ? [
              { id: "s1", title: "1. Scope & Advance Deposit", description: "30% Advance held via PayPal.", status: "completed" },
              { id: "s2", title: "2. Work In Progress", description: "GitHub milestone PR active.", status: "in_progress" },
              { id: "s3", title: "3. SonarCloud Security Review", description: "Automated audit gate.", status: "pending" },
              { id: "s4", title: "4. Final Delivery & Acceptance", description: "Balance release.", status: "pending" },
            ]
          : [
              { id: "m1", title: "1. Order Confirmed", description: "PO signed & advance pending.", status: "completed" },
              { id: "m2", title: "2. Production Started", description: "Foundry batch melted.", status: "in_progress" },
              { id: "m3", title: "3. Quality Inspection", description: "QIMA on-site audit.", status: "pending" },
              { id: "m4", title: "4. Packed & Labeled", description: "Cartons barcoded.", status: "pending" },
              { id: "m5", title: "5. Customs LEO & Dispatched", description: "Port of departure LEO.", status: "pending" },
              { id: "m6", title: "6. Delivered & Final Balance", description: "Arrived at destination port.", status: "pending" },
            ],
      paypalTransaction: {
        status: "NOT_INITIATED",
        paidAdvanceUSD: 0,
        paidBalanceUSD: 0,
        lastUpdated: new Date().toISOString(),
      },
      disputeEvidence: {
        commercialPOUrl: "PO_" + quote.id,
        notes: "Strict contract terms requiring pre-shipment quality audit and bill of lading release.",
      },
      createdAt: new Date().toISOString().split("T")[0],
    };

    setOrders([newOrder, ...orders]);
    setSelectedOrder(newOrder);
    setQuotes((prev) =>
      prev.map((q) => (q.id === quote.id ? { ...q, status: "accepted" } : q.rfqId === quote.rfqId ? { ...q, status: "rejected" } : q))
    );
    setActiveTab("orders");
  };

  // Trigger Live PayPal Sandbox Escrow Payment for Selected Order
  const handleExecutePayPalPayment = async (orderId: string, isAdvance: boolean) => {
    setPaypalLoading(true);
    setPaypalSuccessMsg(null);
    try {
      const res = await fetch("/api/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_paypal_payment",
          tradeId: "trade_live_7719",
          isAdvance,
        }),
      });
      const data = await res.json();
      if (data.success && data.paymentOrder) {
        const orderApproveUrl =
          data.paymentOrder.links?.find((l: { rel: string; href: string }) => l.rel === "approve")?.href ||
          `https://www.sandbox.paypal.com/checkoutnow?token=${data.paymentOrder.id}`;

        // Update local order state
        setOrders((prev) =>
          prev.map((ord) => {
            if (ord.id === orderId) {
              return {
                ...ord,
                paypalTransaction: {
                  orderId: data.paymentOrder.id,
                  captureId: "CAP_" + Date.now().toString().slice(-6),
                  status: isAdvance ? "ADVANCE_HELD_ESCROW" : "SETTLED",
                  paidAdvanceUSD: isAdvance ? ord.advanceDepositUSD : ord.advanceDepositUSD,
                  paidBalanceUSD: isAdvance ? 0 : ord.balanceUSD,
                  approvalUrl: orderApproveUrl,
                  lastUpdated: new Date().toISOString(),
                },
              };
            }
            return ord;
          })
        );

        setSelectedOrder((prev) =>
          prev.id === orderId
            ? {
                ...prev,
                paypalTransaction: {
                  orderId: data.paymentOrder.id,
                  captureId: "CAP_" + Date.now().toString().slice(-6),
                  status: isAdvance ? "ADVANCE_HELD_ESCROW" : "SETTLED",
                  paidAdvanceUSD: isAdvance ? prev.advanceDepositUSD : prev.advanceDepositUSD,
                  paidBalanceUSD: isAdvance ? 0 : prev.balanceUSD,
                  approvalUrl: orderApproveUrl,
                  lastUpdated: new Date().toISOString(),
                },
              }
            : prev
        );

        setPaypalSuccessMsg({
          orderId: data.paymentOrder.id,
          amount: isAdvance ? `$${selectedOrder.advanceDepositUSD.toLocaleString()} USD (30% Advance)` : `$${selectedOrder.balanceUSD.toLocaleString()} USD (70% Balance)`,
        });
      }
    } catch {
      // Fallback update
    } finally {
      setPaypalLoading(false);
    }
  };

  // Filtered Suppliers
  const filteredSuppliers = suppliers.filter((sup) => {
    const matchesSearch =
      sup.name.toLowerCase().includes(supplierSearchQuery.toLowerCase()) ||
      sup.city.toLowerCase().includes(supplierSearchQuery.toLowerCase()) ||
      sup.category.toLowerCase().includes(supplierSearchQuery.toLowerCase()) ||
      sup.productsOrServices.some((p) => p.toLowerCase().includes(supplierSearchQuery.toLowerCase()));
    const matchesType = supplierTypeFilter === "all" || sup.type === supplierTypeFilter;
    const matchesCategory = supplierCategoryFilter === "all" || sup.category === supplierCategoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-stone-900 font-sans flex flex-col">
      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION BAR                                                     */}
      {/* ========================================================================= */}
      <header className="h-16 bg-white border-b border-stone-200/90 px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        {/* Left: Global Search & Switcher */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="size-8 rounded-lg bg-[#18280e] flex items-center justify-center text-[#b2eb76] font-black text-sm shadow-xs">
              TO
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-[#18280e] leading-tight">
                TradeOracle<span className="text-[#3f7308]">.</span>
              </span>
              <span className="text-[10px] font-mono text-stone-400 uppercase font-semibold">
                Foreign Buyer Portal
              </span>
            </div>
          </Link>

          <div className="relative hidden md:block w-72">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search suppliers, RFQs, POs or BL numbers..."
              value={supplierSearchQuery}
              onChange={(e) => setSupplierSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono placeholder:text-stone-400 focus:outline-none focus:border-[#18280e] transition-colors"
            />
          </div>
        </div>

        {/* Right: Notifications, Help, User Profile & Sign Out */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="size-2 rounded-full bg-emerald-600 absolute top-1.5 right-1.5" />
          </button>

          <button
            type="button"
            className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
            title="Help & Guidelines"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* User Company Info */}
          <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
            <div className="size-7 rounded-lg bg-[#ebf7d9] text-[#18280e] font-bold text-xs flex items-center justify-center font-mono">
              🇺🇸
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-[#18280e] leading-tight">Marcus Vance</span>
              <span className="text-[10px] font-mono text-stone-500">Pacific Arch Hardware LLC</span>
            </div>
          </div>

          {/* Always Visible Sign Out Button */}
          <button
            type="button"
            onClick={() => {
              setCurrentSessionUser(null);
              router.push("/signin");
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-mono font-bold transition-colors cursor-pointer shadow-2xs"
            title="Sign out of TradeOracle session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. BODY LAYOUT: PERSISTENT SIDEBAR + WORKSPACE CONTENT                     */}
      {/* ========================================================================= */}
      <div className="flex-1 flex min-w-0">
        {/* Left Persistent Navigation Sidebar */}
        <aside className="w-64 bg-white border-r border-stone-200/90 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] sticky top-16 z-30">
          <div className="p-4 space-y-1 text-xs font-medium">
            {/* 1. Dashboard */}
            <button
              type="button"
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : "text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Dashboard</span>
              </div>
              {activeTab === "dashboard" && <span className="size-1.5 rounded-full bg-[#b2eb76]" />}
            </button>

            {/* 2. Find Suppliers */}
            <button
              type="button"
              onClick={() => setActiveTab("suppliers")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "suppliers"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : "text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 shrink-0" />
                <span>Find Suppliers</span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  activeTab === "suppliers" ? "bg-[#b2eb76]/20 text-[#b2eb76]" : "bg-stone-100 text-stone-600"
                }`}
              >
                {suppliers.length}
              </span>
            </button>

            {/* 3. My RFQs */}
            <button
              type="button"
              onClick={() => setActiveTab("rfqs")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "rfqs"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : "text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
              }`}
            >
              <div className="flex items-center gap-3">
                <FileQuestion className="w-4 h-4 shrink-0" />
                <span>My RFQs</span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  activeTab === "rfqs" ? "bg-[#b2eb76]/20 text-[#b2eb76]" : "bg-[#ebf7d9] text-[#284905]"
                }`}
              >
                {rfqs.length} Active
              </span>
            </button>

            {/* 4. My Orders */}
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "orders"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : "text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>My Orders</span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  activeTab === "orders" ? "bg-[#b2eb76]/20 text-[#b2eb76]" : "bg-stone-100 text-stone-600"
                }`}
              >
                {orders.length}
              </span>
            </button>

            {/* 5. Payments */}
            <button
              type="button"
              onClick={() => setActiveTab("payments")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "payments"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : "text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 shrink-0" />
                <span>Payments</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">
                PAYPAL
              </span>
            </button>

            {/* 6. Documents */}
            <button
              type="button"
              onClick={() => setActiveTab("documents")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "documents"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : "text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 shrink-0" />
                <span>Documents</span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  activeTab === "documents" ? "bg-[#b2eb76]/20 text-[#b2eb76]" : "bg-stone-100 text-stone-600"
                }`}
              >
                {documents.length}
              </span>
            </button>

            {/* 7. Messages */}
            <button
              type="button"
              onClick={() => setActiveTab("messages")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "messages"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : "text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>Messages</span>
              </div>
              <span className="size-2 rounded-full bg-emerald-600" />
            </button>

            {/* 8. Settings */}
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "settings"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                  : "text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 shrink-0" />
                <span>Settings</span>
              </div>
            </button>
          </div>

          {/* Bottom Card: PayPal Sandbox Connection Status */}
          <div className="p-4 border-t border-stone-200/90 space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#18280e] text-white space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#b2eb76] font-bold">PayPal Orders v2</span>
                <span className="size-2 rounded-full bg-[#b2eb76] animate-pulse" />
              </div>
              <p className="text-[11px] text-stone-300 font-mono leading-tight">
                Sandbox Mode Active (Direct Buyer-to-Seller Escrow)
              </p>
              <span className="text-[9px] font-mono text-stone-400 block truncate">
                Client ID: AU-2yZPCo...
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setCurrentSessionUser(null);
                router.push("/signin");
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-mono font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of Portal</span>
            </button>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* 3. MAIN WORKSPACE VIEW CONTENT                                            */}
        {/* ========================================================================= */}
        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto overflow-y-auto">
          {/* ======================================================================= */}
          {/* TAB 1: BUYER DASHBOARD                                                  */}
          {/* ======================================================================= */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Welcome Banner with Quick Search */}
              <div className="p-6 md:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-[#3f7308] uppercase font-bold tracking-wider">
                      Foreign Buyer Portal • Trade Execution Rails
                    </span>
                    <h2 className="text-2xl font-extrabold text-[#18280e] tracking-tight">
                      Welcome back, Marcus Vance
                    </h2>
                    <p className="text-xs text-stone-600">
                      Pacific Architectural Hardware LLC • Managing international procurement from Indian manufacturers.
                    </p>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setRfqType("goods");
                        setIsRfqModalOpen(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create RFQ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("suppliers")}
                      className="px-3.5 py-2 rounded-xl bg-[#ebf7d9] hover:bg-[#d8e5ca] text-[#18280e] font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors border border-[#d8e5ca]"
                    >
                      <Search className="w-3.5 h-3.5 text-[#3f7308]" />
                      <span>Find Suppliers</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("documents")}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors border border-stone-200"
                    >
                      <FileText className="w-3.5 h-3.5 text-stone-500" />
                      <span>View Documents</span>
                    </button>
                  </div>
                </div>

                {/* Inline Supplier Search Bar */}
                <div className="pt-2">
                  <div className="flex items-center gap-2 p-2 rounded-2xl bg-stone-50 border border-stone-200">
                    <Search className="w-4 h-4 text-stone-400 ml-2" />
                    <input
                      type="text"
                      placeholder="What are you sourcing today? (e.g. CW617N brass door handles, Grade 10.9 flange bolts, organic knitwear, or React/Node engineering)"
                      value={supplierSearchQuery}
                      onChange={(e) => setSupplierSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setActiveTab("suppliers");
                      }}
                      className="w-full bg-transparent text-xs font-mono placeholder:text-stone-400 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setActiveTab("suppliers")}
                      className="px-4 py-2 rounded-xl bg-[#18280e] text-[#b2eb76] font-bold text-xs whitespace-nowrap cursor-pointer hover:bg-[#253d16] transition-colors"
                    >
                      Search Suppliers →
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
                <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs space-y-2">
                  <div className="flex justify-between items-center text-xs text-stone-500 font-medium">
                    <span>Active Orders</span>
                    <ShoppingBag className="w-4 h-4 text-[#3f7308]" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#18280e]">{orders.length}</span>
                    <span className="text-xs text-emerald-700 font-bold">● In Production</span>
                  </div>
                  <span className="text-[11px] text-stone-400 block">$90,750 USD in escrow</span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs space-y-2">
                  <div className="flex justify-between items-center text-xs text-stone-500 font-medium">
                    <span>Pending Quotations</span>
                    <FileQuestion className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#18280e]">
                      {quotes.filter((q) => q.status === "pending").length}
                    </span>
                    <span className="text-xs text-amber-700 font-bold">Awaiting Decision</span>
                  </div>
                  <span className="text-[11px] text-stone-400 block">Across 3 RFQs</span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs space-y-2">
                  <div className="flex justify-between items-center text-xs text-stone-500 font-medium">
                    <span>Awaiting Payments</span>
                    <CreditCard className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#18280e]">$0</span>
                    <span className="text-xs text-emerald-700 font-bold">✓ Up to Date</span>
                  </div>
                  <span className="text-[11px] text-stone-400 block">Next release on QIMA pass</span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs space-y-2">
                  <div className="flex justify-between items-center text-xs text-stone-500 font-medium">
                    <span>Awaiting Delivery</span>
                    <Ship className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#18280e]">2 Shipments</span>
                    <span className="text-xs text-purple-700 font-bold">FOB Mundra & JNPT</span>
                  </div>
                  <span className="text-[11px] text-stone-400 block">Port of Long Beach</span>
                </div>
              </div>

              {/* Recent Orders Table & Trade Activity Timeline */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Orders Table */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold text-[#18280e] font-sans">Recent Trade Orders</h3>
                      <span className="text-stone-400 text-[11px]">Structured cross-border orders on PayPal rails</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("orders")}
                      className="text-[#3f7308] font-bold hover:underline flex items-center gap-1"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="divide-y divide-stone-100 overflow-x-auto">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        onClick={() => {
                          setSelectedOrder(ord);
                          setActiveTab("orders");
                        }}
                        className="py-3.5 flex items-center justify-between gap-4 hover:bg-stone-50/70 p-2 rounded-xl cursor-pointer transition-colors"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#18280e]">{ord.orderNumber}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ebf7d9] text-[#284905] font-bold">
                              {ord.type === "goods" ? "PHYSICAL GOODS" : "SERVICE SPRINT"}
                            </span>
                          </div>
                          <p className="text-stone-600 text-[11px] truncate max-w-sm">{ord.productOrServiceName}</p>
                          <span className="text-stone-400 text-[10px]">Supplier: {ord.supplierName}</span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-extrabold text-[#18280e] text-sm block">
                            ${ord.totalAmountUSD.toLocaleString()} USD
                          </span>
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                            {ord.milestones[ord.currentStageIndex]?.title || "Active"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trade Activity Timeline */}
                <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4 font-mono text-xs">
                  <h3 className="text-sm font-bold text-[#18280e] font-sans">Trade Activity Timeline</h3>
                  <div className="space-y-4 pt-1">
                    <div className="flex items-start gap-3">
                      <div className="size-2 rounded-full bg-[#3f7308] mt-1 shrink-0" />
                      <div>
                        <span className="font-bold text-[#18280e] block">QIMA On-Site Audit Scheduled</span>
                        <p className="text-stone-500 text-[11px]">
                          Auditor appointed for Order #ORD-USA-9921 at Jamnagar facility.
                        </p>
                        <span className="text-stone-400 text-[10px]">Today, 10:45 AM</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="size-2 rounded-full bg-emerald-600 mt-1 shrink-0" />
                      <div>
                        <span className="font-bold text-[#18280e] block">PayPal 30% Advance Escrow Held</span>
                        <p className="text-stone-500 text-[11px]">
                          $25,725 USD captured into escrow on PayPal Orders v2 rails.
                        </p>
                        <span className="text-stone-400 text-[10px]">Yesterday, 3:14 PM</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="size-2 rounded-full bg-blue-600 mt-1 shrink-0" />
                      <div>
                        <span className="font-bold text-[#18280e] block">Commercial PO Signed (UCP 600)</span>
                        <p className="text-stone-500 text-[11px]">
                          Both buyer & seller executed agreement with binding inspection milestone.
                        </p>
                        <span className="text-stone-400 text-[10px]">3 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* TAB 2: FIND SUPPLIERS (Discovery, Filters, Shortlist, Profile)          */}
          {/* ======================================================================= */}
          {activeTab === "suppliers" && (
            <div className="space-y-6 animate-in fade-in duration-200 font-sans">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#18280e] tracking-tight">
                    Discover Verified Indian Manufacturers &amp; Service Providers
                  </h2>
                  <p className="text-xs text-stone-500">
                    Filter by export capabilities, city clusters, minimum order quantities, and PayPal KYC verification.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRfqModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Send Direct RFQ</span>
                </button>
              </div>

              {/* Filters Bar */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-wrap items-center gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-stone-500">
                  <Filter className="w-3.5 h-3.5 text-[#3f7308]" />
                  <span className="font-bold uppercase text-[10px]">Filters:</span>
                </div>

                {/* Type Filter */}
                <div className="flex items-center gap-1 bg-[#f4faed] p-1 rounded-xl border border-[#d8e5ca]">
                  <button
                    type="button"
                    onClick={() => setSupplierTypeFilter("all")}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      supplierTypeFilter === "all" ? "bg-[#18280e] text-[#b2eb76] font-bold" : "text-stone-600"
                    }`}
                  >
                    All Types
                  </button>
                  <button
                    type="button"
                    onClick={() => setSupplierTypeFilter("goods")}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      supplierTypeFilter === "goods" ? "bg-[#18280e] text-[#b2eb76] font-bold" : "text-stone-600"
                    }`}
                  >
                    Physical Goods
                  </button>
                  <button
                    type="button"
                    onClick={() => setSupplierTypeFilter("service")}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      supplierTypeFilter === "service" ? "bg-[#18280e] text-[#b2eb76] font-bold" : "text-stone-600"
                    }`}
                  >
                    Engineering Services
                  </button>
                </div>

                {/* Category Filter */}
                <select
                  value={supplierCategoryFilter}
                  onChange={(e) => setSupplierCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono text-stone-800 outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="Brassware & Hardware">Brassware &amp; Hardware</option>
                  <option value="Fasteners & Forgings">Fasteners &amp; Forgings</option>
                  <option value="Heritage Brassware">Heritage Brassware</option>
                  <option value="Textiles & Organic Apparel">Textiles &amp; Organic Apparel</option>
                  <option value="Software Engineering & Cloud">Software Engineering &amp; Cloud</option>
                </select>

                <span className="text-stone-400 text-xs ml-auto">
                  Showing {filteredSuppliers.length} of {suppliers.length} Indian exporters
                </span>
              </div>

              {/* Suppliers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSuppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs hover:border-[#18280e]/40 transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🇮🇳</span>
                            <h3 className="font-bold text-base text-[#18280e]">{supplier.name}</h3>
                          </div>
                          <span className="text-xs text-stone-500 font-mono">
                            {supplier.city}, {supplier.state}, India • {supplier.category}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleShortlist(supplier.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                            supplier.shortlisted
                              ? "bg-[#18280e] text-[#b2eb76] border-[#18280e]"
                              : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                          }`}
                        >
                          {supplier.shortlisted ? "★ Shortlisted" : "+ Shortlist"}
                        </button>
                      </div>

                      {/* Verification Status Banner with exact source & meaning */}
                      <div className="p-3 rounded-2xl bg-[#f4faed] border border-[#d8e5ca] space-y-1 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5 text-[#284905] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#3f7308]" />
                          <span>Verification Source: {supplier.verificationSource}</span>
                        </div>
                        <p className="text-stone-500 text-[10px] leading-tight">
                          Meaning: {supplier.verificationMeaning}
                        </p>
                      </div>

                      {/* Products / Capabilities */}
                      <div className="space-y-1.5 font-mono text-xs">
                        <span className="text-[10px] text-stone-400 uppercase font-bold block">
                          Export Products / Scope:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {supplier.productsOrServices.map((p, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-lg bg-stone-100 text-stone-700 text-[11px]"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Specs: MOQ, Lead Time, Pricing */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 font-mono text-xs">
                        <div>
                          <span className="text-[10px] text-stone-400 block font-bold">MOQ</span>
                          <span className="text-[#18280e] font-semibold">{supplier.moq}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block font-bold">Lead Time</span>
                          <span className="text-[#18280e] font-semibold">{supplier.leadTime}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block font-bold">Price Est.</span>
                          <span className="text-[#18280e] font-semibold">{supplier.approxPricingRange}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedSupplier(supplier)}
                        className="text-xs font-mono font-bold text-stone-600 hover:text-black hover:underline cursor-pointer"
                      >
                        View Full Dossier →
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setRfqForm((prev) => ({
                            ...prev,
                            title: `Sourcing ${supplier.productsOrServices[0]}`,
                            category: supplier.category,
                          }));
                          setRfqType(supplier.type);
                          setIsRfqModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                      >
                        <span>Send RFQ</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* TAB 3: MY RFQS & QUOTATION COMPARISON                                   */}
          {/* ======================================================================= */}
          {activeTab === "rfqs" && (
            <div className="space-y-6 animate-in fade-in duration-200 font-sans">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#18280e] tracking-tight">
                    Request for Quotation (RFQ) &amp; Commercial Offers
                  </h2>
                  <p className="text-xs text-stone-500">
                    Submit new goods or services scopes, review quotations from verified suppliers, and convert accepted offers into live orders.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRfqModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New RFQ Form</span>
                </button>
              </div>

              {/* RFQ List */}
              <div className="space-y-4">
                {rfqs.map((rfq) => {
                  const relatedQuotes = quotes.filter((q) => q.rfqId === rfq.id);
                  return (
                    <div
                      key={rfq.id}
                      className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4 font-mono text-xs"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#18280e] font-sans">{rfq.title}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold">
                              {rfq.rfqNumber}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ebf7d9] text-[#284905] font-bold">
                              {rfq.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-stone-600 text-xs font-mono">{rfq.specifications}</p>
                          <span className="text-[11px] text-stone-400 block">
                            Target Delivery: {rfq.expectedDeliveryDate} • Destination: {rfq.destinationPort || "Digital Export"}
                          </span>
                        </div>

                        <div className="text-left md:text-right font-mono">
                          <span className="text-[10px] text-stone-400 block uppercase font-bold">Target Budget</span>
                          <span className="text-xl font-bold text-[#18280e]">
                            ${rfq.budgetUSD.toLocaleString()} USD
                          </span>
                          {rfq.targetQuantity && (
                            <span className="text-xs text-stone-500 block">
                              {rfq.targetQuantity.toLocaleString()} {rfq.targetUnit}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Received Quotations Section */}
                      <div className="pt-3 border-t border-stone-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#18280e] font-sans flex items-center gap-1.5">
                            <span>Quotations Received ({relatedQuotes.length})</span>
                          </span>
                          {relatedQuotes.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setCompareQuotesForRfqId(compareQuotesForRfqId === rfq.id ? null : rfq.id)
                              }
                              className="text-xs text-[#3f7308] font-bold hover:underline cursor-pointer"
                            >
                              {compareQuotesForRfqId === rfq.id ? "Hide Comparison" : "Compare Quotations Side-by-Side →"}
                            </button>
                          )}
                        </div>

                        {/* Side by side comparison if toggled */}
                        {compareQuotesForRfqId === rfq.id && relatedQuotes.length > 1 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#f4faed] border border-[#d8e5ca] animate-in fade-in">
                            {relatedQuotes.map((q) => (
                              <div key={q.id} className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-2">
                                <div className="flex justify-between items-start">
                                  <strong className="text-sm text-[#18280e]">{q.supplierName}</strong>
                                  <span className="text-base font-extrabold text-[#18280e]">
                                    ${q.totalPriceUSD.toLocaleString()}
                                  </span>
                                </div>
                                <div className="text-[11px] text-stone-600 space-y-1">
                                  <div>Incoterms: <strong>{q.incoterms}</strong></div>
                                  <div>Lead Time: <strong>{q.leadTimeDays} days</strong></div>
                                  <div>Unit Price: <strong>${q.unitPriceUSD} / unit</strong></div>
                                </div>
                                {q.status === "pending" && (
                                  <button
                                    type="button"
                                    onClick={() => handleAcceptQuotation(q)}
                                    className="w-full py-1.5 rounded-lg bg-[#18280e] text-[#b2eb76] font-bold text-xs cursor-pointer hover:bg-[#253d16] transition-colors"
                                  >
                                    Accept Offer &amp; Create Order
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Quotes list */}
                        <div className="divide-y divide-stone-100">
                          {relatedQuotes.map((q) => (
                            <div key={q.id} className="py-2.5 flex items-center justify-between gap-3">
                              <div>
                                <span className="font-bold text-stone-900">{q.supplierName}</span>
                                <span className="text-stone-400 text-[11px] block">
                                  {q.incoterms} • Lead Time: {q.leadTimeDays} days • {q.notes}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-[#18280e] text-sm">
                                  ${q.totalPriceUSD.toLocaleString()} USD
                                </span>
                                {q.status === "accepted" ? (
                                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                                    ✓ ACCEPTED
                                  </span>
                                ) : q.status === "rejected" ? (
                                  <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-500 font-bold text-[10px]">
                                    REJECTED
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleAcceptQuotation(q)}
                                    className="px-3 py-1 rounded-lg bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] font-bold text-xs cursor-pointer transition-colors shadow-2xs"
                                  >
                                    Accept &amp; Create Order →
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* TAB 4: ORDER WORKSPACE (The Central Product Experience)                  */}
          {/* ======================================================================= */}
          {activeTab === "orders" && selectedOrder && (
            <div className="space-y-6 animate-in fade-in duration-200 font-sans">
              {/* Order Header Summary */}
              <div className="p-6 md:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-stone-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-bold">
                        {selectedOrder.orderNumber}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ebf7d9] text-[#284905] font-bold font-mono">
                        {selectedOrder.type === "goods" ? "PHYSICAL GOODS ORDER" : "SERVICE SPRINT ORDER"}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-[#18280e]">{selectedOrder.productOrServiceName}</h2>
                    <p className="text-xs text-stone-500 font-mono">
                      Supplier: <strong>{selectedOrder.supplierName}</strong> ({selectedOrder.supplierEmail})
                    </p>
                  </div>

                  {/* Financial Overview */}
                  <div className="text-left md:text-right font-mono bg-[#fbfdf9] p-4 rounded-2xl border border-stone-200/80">
                    <span className="text-[10px] text-stone-400 font-bold uppercase block">Total Commercial Deal</span>
                    <span className="text-2xl font-extrabold text-[#18280e]">
                      ${selectedOrder.totalAmountUSD.toLocaleString()} USD
                    </span>
                    <div className="flex items-center gap-2 text-xs text-stone-600 mt-1">
                      <span>30% Adv: <strong>${selectedOrder.advanceDepositUSD.toLocaleString()}</strong></span>
                      <span>|</span>
                      <span>70% Bal: <strong>${selectedOrder.balanceUSD.toLocaleString()}</strong></span>
                    </div>
                  </div>
                </div>

                {/* PayPal Sandbox Escrow Action Box */}
                <div className="p-4 rounded-2xl bg-[#f4faed] border border-[#d8e5ca] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold text-[#18280e]">
                      <CreditCard className="w-4 h-4 text-[#3f7308]" />
                      <span>PayPal Orders v2 Transaction Status:</span>
                      <span className="px-2 py-0.5 rounded bg-white text-[#284905] border border-[#d8e5ca]">
                        {selectedOrder.paypalTransaction.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600">
                      Funds are held in PayPal sandbox escrow and only released upon verified evidence.
                    </p>
                  </div>

                  {selectedOrder.paypalTransaction.status === "NOT_INITIATED" ? (
                    <button
                      type="button"
                      disabled={paypalLoading}
                      onClick={() => handleExecutePayPalPayment(selectedOrder.id, true)}
                      className="px-4 py-2 rounded-xl bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                    >
                      {paypalLoading ? "Connecting to PayPal..." : `Authorize 30% Advance Escrow ($${selectedOrder.advanceDepositUSD.toLocaleString()})`}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        <span>Advance Held (Ref: {selectedOrder.paypalTransaction.orderId})</span>
                      </span>
                      {selectedOrder.paypalTransaction.approvalUrl && (
                        <a
                          href={selectedOrder.paypalTransaction.approvalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-[#18280e] text-[#b2eb76] text-xs font-bold hover:bg-[#253d16] flex items-center gap-1"
                        >
                          <span>Checkout Receipt</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {paypalSuccessMsg && (
                  <div className="p-3 rounded-xl bg-[#ebf7d9] border border-[#d8e5ca] text-xs font-mono text-[#18280e] font-bold animate-in fade-in">
                    ✓ PayPal Sandbox Escrow Captured: {paypalSuccessMsg.orderId} ({paypalSuccessMsg.amount})
                  </div>
                )}
              </div>

              {/* Fulfilment Milestones Timeline (Goods vs Services) */}
              <div className="p-6 md:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-base text-[#18280e]">
                      Fulfilment Milestones &amp; Evidence Timeline
                    </h3>
                    <p className="text-xs text-stone-500 font-mono">
                      Each payment release is linked to verified documentation and inspection certificates.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-stone-400">
                    Stage {selectedOrder.currentStageIndex + 1} of {selectedOrder.milestones.length}
                  </span>
                </div>

                <div className="space-y-4 pt-2">
                  {selectedOrder.milestones.map((milestone, idx) => {
                    const isCompleted = milestone.status === "completed";
                    const isCurrent = milestone.status === "in_progress";
                    return (
                      <div
                        key={milestone.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isCompleted
                            ? "bg-[#fbfdf9] border-stone-200/90"
                            : isCurrent
                            ? "bg-[#f4faed] border-[#d8e5ca] ring-1 ring-[#3f7308]/20"
                            : "bg-stone-50/50 border-stone-200/50 opacity-70"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {isCompleted ? (
                                <span className="size-5 rounded-full bg-[#18280e] text-[#b2eb76] flex items-center justify-center text-xs font-bold font-mono">
                                  ✓
                                </span>
                              ) : isCurrent ? (
                                <span className="size-5 rounded-full bg-[#3f7308] text-white flex items-center justify-center text-xs font-bold font-mono animate-pulse">
                                  ●
                                </span>
                              ) : (
                                <span className="size-5 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center text-xs font-mono">
                                  {idx + 1}
                                </span>
                              )}
                              <strong className="text-sm text-[#18280e]">{milestone.title}</strong>
                            </div>
                            <p className="text-xs text-stone-600 font-mono pl-7">{milestone.description}</p>
                          </div>

                          <div className="pl-7 sm:pl-0 font-mono text-xs">
                            {milestone.evidenceName ? (
                              <button
                                type="button"
                                onClick={() => setActiveTab("documents")}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-stone-200 text-stone-800 hover:bg-stone-50 transition-colors cursor-pointer text-[11px]"
                              >
                                <FileText className="w-3 h-3 text-[#3f7308]" />
                                <span>{milestone.evidenceName}</span>
                              </button>
                            ) : (
                              <span className="text-stone-400 text-[10px]">
                                {isCompleted ? `Verified: ${milestone.completedAt}` : "Pending Verification"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dispute Evidence & Legal Contract Pack */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#3f7308]" />
                    <h3 className="font-bold text-sm text-[#18280e] font-sans">
                      Dispute Assistance &amp; Authorised Evidence Repository
                    </h3>
                  </div>
                  <span className="text-[10px] text-stone-400">PayPal Resolution Center Integration</span>
                </div>
                <p className="text-stone-600 leading-relaxed">
                  {selectedOrder.disputeEvidence.notes}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => alert("Downloading complete signed PO & specification evidence pack (.ZIP)...")}
                    className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Evidence Dossier (.ZIP)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("documents")}
                    className="px-3.5 py-2 rounded-xl bg-[#ebf7d9] text-[#18280e] font-bold text-xs hover:bg-[#d8e5ca] flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <span>View All Associated Documents →</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* TAB 5: PAYMENTS PAGE                                                    */}
          {/* ======================================================================= */}
          {activeTab === "payments" && (
            <div className="space-y-6 animate-in fade-in duration-200 font-sans">
              <div>
                <h2 className="text-xl font-bold text-[#18280e] tracking-tight">
                  PayPal Trade Settlement Ledger
                </h2>
                <p className="text-xs text-stone-500 font-mono">
                  Direct commercial payments executed through PayPal Orders v2 rails. No intermediate funds holding.
                </p>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-white border border-stone-200/80 space-y-1">
                  <span className="text-stone-400 uppercase font-bold text-[10px] block">Total Transactions</span>
                  <span className="text-xl font-bold text-[#18280e]">$27,225 USD</span>
                  <span className="text-stone-400 text-[10px] block">2 Completed Captures</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-stone-200/80 space-y-1">
                  <span className="text-stone-400 uppercase font-bold text-[10px] block">Held in Escrow</span>
                  <span className="text-xl font-bold text-emerald-700">$27,225 USD</span>
                  <span className="text-stone-400 text-[10px] block">30% Advance Escrows</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-stone-200/80 space-y-1">
                  <span className="text-stone-400 uppercase font-bold text-[10px] block">Pending Settlements</span>
                  <span className="text-xl font-bold text-amber-600">$63,525 USD</span>
                  <span className="text-stone-400 text-[10px] block">70% Release on LEO/BL</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-stone-200/80 space-y-1">
                  <span className="text-stone-400 uppercase font-bold text-[10px] block">Disputes / Failed</span>
                  <span className="text-xl font-bold text-stone-700">0</span>
                  <span className="text-emerald-700 text-[10px] font-bold block">100% Clean Record</span>
                </div>
              </div>

              {/* Payment History Table */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4 font-mono text-xs">
                <h3 className="font-bold text-sm text-[#18280e] font-sans">Payment History &amp; Linked Orders</h3>
                <div className="divide-y divide-stone-100 overflow-x-auto">
                  {orders.map((ord) => (
                    <div key={ord.id} className="py-3.5 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900">{ord.orderNumber}</span>
                          <span className="text-stone-400">•</span>
                          <span className="text-[#3f7308] font-bold">Ref: {ord.paypalTransaction.orderId || "MOCK_PP_01"}</span>
                        </div>
                        <span className="text-stone-500 text-[11px] block">{ord.productOrServiceName}</span>
                        <span className="text-stone-400 text-[10px] block">Supplier: {ord.supplierName}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#18280e] text-sm block">
                          ${ord.advanceDepositUSD.toLocaleString()} USD
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                          ✓ 30% ADVANCE HELD
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* TAB 6: DOCUMENTS AND EVIDENCE                                           */}
          {/* ======================================================================= */}
          {activeTab === "documents" && (
            <div className="space-y-6 animate-in fade-in duration-200 font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#18280e] tracking-tight">
                    Document &amp; Commercial Evidence Repository
                  </h2>
                  <p className="text-xs text-stone-500 font-mono">
                    All POs, invoices, QIMA inspection reports, and ICEGATE shipping bills linked to orders.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Simulating upload of new commercial inspection evidence...")}
                  className="px-4 py-2 rounded-xl bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload Document</span>
                </button>
              </div>

              {/* Documents Table */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4 font-mono text-xs">
                <div className="divide-y divide-stone-100 overflow-x-auto">
                  {documents.map((doc) => (
                    <div key={doc.id} className="py-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#f4faed] text-[#3f7308]">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-stone-900 block">{doc.title}</span>
                          <span className="text-stone-400 text-[11px]">
                            {doc.category} • {doc.orderNumber} • {doc.fileSize}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-bold hidden sm:inline">
                          Verified: {doc.verifiedBy}
                        </span>
                        <button
                          type="button"
                          onClick={() => alert(`Downloading verified file: ${doc.fileName}`)}
                          className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
                          title="Download Document"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* TAB 7: MESSAGES                                                         */}
          {/* ======================================================================= */}
          {activeTab === "messages" && (
            <div className="p-6 md:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4 font-mono text-xs">
              <h2 className="text-base font-bold text-[#18280e] font-sans">
                Supplier Communications &amp; Technical Queries
              </h2>
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex justify-between items-center">
                  <strong className="text-stone-900">Jamnagar Precision Brass Castings Ltd</strong>
                  <span className="text-stone-400 text-[10px]">Today, 11:15 AM</span>
                </div>
                <p className="text-stone-600 text-xs">
                  &ldquo;Hello Marcus, the third melt induction heat is complete. QIMA inspector has confirmed their visit for Tuesday 9:00 AM. ASTM B117 salt spray sample plates are prepared in chamber.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Reply to supplier or attach engineering drawings..."
                  className="flex-1 p-3 rounded-xl bg-[#fbfdf9] border border-stone-200 text-xs font-mono outline-none"
                />
                <button
                  type="button"
                  onClick={() => alert("Message dispatched to supplier email and notification channel.")}
                  className="px-4 py-3 rounded-xl bg-[#18280e] text-[#b2eb76] font-bold text-xs"
                >
                  Send Message
                </button>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* TAB 8: SETTINGS                                                         */}
          {/* ======================================================================= */}
          {activeTab === "settings" && (
            <div className="p-6 md:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-6 font-mono text-xs">
              <h2 className="text-base font-bold text-[#18280e] font-sans">Buyer Company Profile &amp; Preferences</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <span className="text-stone-400 uppercase font-bold text-[10px] block">Company Name</span>
                  <span className="font-bold text-stone-900 text-sm">Pacific Architectural Hardware LLC</span>
                  <span className="text-stone-500 block">Irvine, California, United States</span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <span className="text-stone-400 uppercase font-bold text-[10px] block">Primary Sourcing Destination</span>
                  <span className="font-bold text-stone-900 text-sm">Port of Long Beach, California (USLGB)</span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <span className="text-stone-400 uppercase font-bold text-[10px] block">Linked PayPal Business Buyer Account</span>
                  <span className="font-bold text-stone-900 text-sm">m.vance@pacificarchhardware.com</span>
                  <span className="text-emerald-700 text-[11px] font-bold block">✓ Verified Sandbox Payer</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 4. MULTI-STEP RFQ CREATION MODAL (Goods vs Services)                      */}
      {/* ========================================================================= */}
      {isRfqModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex justify-between items-center pb-4 border-b border-stone-100">
              <div>
                <h3 className="font-bold text-lg text-[#18280e]">Create Sourcing Request (RFQ)</h3>
                <p className="text-xs text-stone-500 font-mono">
                  Submit detailed technical specs to receive binding commercial quotations from Indian suppliers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRfqModalOpen(false)}
                className="size-8 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center hover:bg-stone-200 cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Type Switcher */}
            <div className="flex items-center gap-2 p-1.5 bg-[#f4faed] rounded-2xl border border-[#d8e5ca] font-mono text-xs">
              <button
                type="button"
                onClick={() => setRfqType("goods")}
                className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                  rfqType === "goods" ? "bg-[#18280e] text-[#b2eb76] shadow-xs" : "text-stone-600 hover:text-black"
                }`}
              >
                🏭 Physical Goods (Foundry / Fasteners / Textiles)
              </button>
              <button
                type="button"
                onClick={() => setRfqType("service")}
                className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                  rfqType === "service" ? "bg-[#18280e] text-[#b2eb76] shadow-xs" : "text-stone-600 hover:text-black"
                }`}
              >
                💻 Engineering / IT Services (Software / Cloud)
              </button>
            </div>

            <form onSubmit={handleCreateRFQ} className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-stone-700 font-bold block">
                  {rfqType === "goods" ? "Product Name & Category" : "Project / Service Title"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={rfqType === "goods" ? "e.g. Architectural Solid Brass Door Handles" : "e.g. Cross-Border PayPal API Integration"}
                  value={rfqForm.title}
                  onChange={(e) => setRfqForm({ ...rfqForm, title: e.target.value })}
                  className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-none focus:border-[#18280e]"
                />
              </div>

              {rfqType === "goods" ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-stone-700 font-bold block">Target Quantity</label>
                      <input
                        type="number"
                        required
                        value={rfqForm.quantity}
                        onChange={(e) => setRfqForm({ ...rfqForm, quantity: Number(e.target.value) })}
                        className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-stone-700 font-bold block">Target Budget (USD)</label>
                      <input
                        type="number"
                        required
                        value={rfqForm.budgetUSD}
                        onChange={(e) => setRfqForm({ ...rfqForm, budgetUSD: Number(e.target.value) })}
                        className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-stone-700 font-bold block">Technical Specifications &amp; Material</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Forged CW617N brass, 240-hr ASTM B117 salt spray anti-tarnish coating, retail box packaging..."
                      value={rfqForm.specifications}
                      onChange={(e) => setRfqForm({ ...rfqForm, specifications: e.target.value })}
                      className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-stone-700 font-bold block">Destination Port</label>
                      <input
                        type="text"
                        value={rfqForm.destinationPort}
                        onChange={(e) => setRfqForm({ ...rfqForm, destinationPort: e.target.value })}
                        className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-stone-700 font-bold block">Target Delivery Date</label>
                      <input
                        type="date"
                        value={rfqForm.deliveryDate}
                        onChange={(e) => setRfqForm({ ...rfqForm, deliveryDate: e.target.value })}
                        className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-none"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-stone-700 font-bold block">Scope of Work &amp; Milestones</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Implement PayPal Orders v2 capture, verify webhooks, Jest automated unit tests..."
                      value={rfqForm.scopeOfWork}
                      onChange={(e) => setRfqForm({ ...rfqForm, scopeOfWork: e.target.value })}
                      className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-none resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-stone-700 font-bold block">Budget (USD)</label>
                      <input
                        type="number"
                        required
                        value={rfqForm.budgetUSD}
                        onChange={(e) => setRfqForm({ ...rfqForm, budgetUSD: Number(e.target.value) })}
                        className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-stone-700 font-bold block">Target Deadline</label>
                      <input
                        type="date"
                        value={rfqForm.deliveryDate}
                        onChange={(e) => setRfqForm({ ...rfqForm, deliveryDate: e.target.value })}
                        className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsRfqModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] font-bold text-xs cursor-pointer shadow-xs"
                >
                  Publish RFQ to Verified Indian Hubs →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supplier Profile Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-4 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex justify-between items-start pb-3 border-b border-stone-100">
              <div>
                <span className="text-lg">🇮🇳</span>
                <h3 className="font-bold text-lg text-[#18280e]">{selectedSupplier.name}</h3>
                <span className="text-xs text-stone-500 font-mono">
                  {selectedSupplier.city}, {selectedSupplier.state}, India
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSupplier(null)}
                className="size-8 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center hover:bg-stone-200 cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-[#f4faed] border border-[#d8e5ca] space-y-1">
                <span className="font-bold text-[#284905] block">
                  ✓ Verification: {selectedSupplier.verificationSource}
                </span>
                <p className="text-stone-500 text-[11px]">{selectedSupplier.verificationMeaning}</p>
                <div className="text-[10px] text-stone-600 pt-1">
                  IEC: <strong>{selectedSupplier.iecCode}</strong> • GSTIN: <strong>{selectedSupplier.gstin}</strong>
                </div>
              </div>

              <div>
                <strong className="text-stone-900 block mb-1">Production Capabilities:</strong>
                <ul className="list-disc list-inside space-y-0.5 text-stone-600 text-[11px]">
                  {selectedSupplier.capabilities.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong className="text-stone-900 block mb-1">Products / Services Offered:</strong>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSupplier.productsOrServices.map((p, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px]">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedSupplier(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedSupplier(null);
                  setRfqForm((prev) => ({
                    ...prev,
                    title: `Sourcing ${selectedSupplier.productsOrServices[0]}`,
                    category: selectedSupplier.category,
                  }));
                  setRfqType(selectedSupplier.type);
                  setIsRfqModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#18280e] text-[#b2eb76] text-xs font-bold"
              >
                Send RFQ to This Supplier →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

