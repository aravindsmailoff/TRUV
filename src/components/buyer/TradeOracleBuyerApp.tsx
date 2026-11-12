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
  MessageSquare,
  Settings,
  Bell,
  HelpCircle,
  Plus,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Filter,
  Check,
  Ship,
  Sparkles,
  LogOut,
  Send,
  Package,
} from "lucide-react";
import {
  INITIAL_SUPPLIERS,
  INITIAL_RFQS,
  INITIAL_QUOTES,
  INITIAL_ORDERS,
  SupplierItem,
  RFQItem,
  QuotationItem,
  OrderWorkspaceItem,
} from "@/lib/buyer/buyerStore";
import { setCurrentSessionUser } from "@/lib/auth/authStore";
import { useSessionUser } from "@/lib/auth/useSessionUser";
import { WhatsAppNotificationCenter } from "@/components/whatsapp/WhatsAppNotificationCenter";
import { triggerAutomatedWhatsAppAlert } from "@/lib/whatsapp/clientTrigger";

interface AiMatchItem {
  supplierId: string;
  matchScore: number;
  exactMaterialMatch: string;
  matchingProducts: string[];
  whyThisSeller: string;
  samplePromptSuggestion: string;
}

interface AiMatchResponse {
  poweredBy: "TradeOracle AI" | "Catalog Fallback";
  model: string;
  extractedRequirements: {
    product: string;
    material: string;
    finishOrStandard: string;
    quantityHint: string;
  };
  summary: string;
  matches: AiMatchItem[];
  noExactMatchReason?: string;
}

interface BuyerConversationMessage {
  id: string;
  sender: "buyer" | "seller";
  text: string;
  translatedText?: string;
  sourceLang?: string;
  targetLang?: string;
  sentAt: string;
}

interface BuyerConversationThread {
  supplierId: string;
  supplierName: string;
  supplierCity: string;
  preferredLanguage: string;
  samplePriceUSD: number;
  samplePaypalOrderId?: string;
  samplePaypalUrl?: string;
  matchedProduct: string;
  matchedMaterial: string;
  samplePolicy: string;
  messages: BuyerConversationMessage[];
}

interface OrderAiVerification {
  orderId: string;
  status: "VERIFIED" | "WARNING";
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  specAlignmentSummary: string;
  warnings: string[];
  checks: string[];
}

export function TradeOracleBuyerApp() {
  const router = useRouter();
  const { currentUser, isHydrated } = useSessionUser();

  useEffect(() => {
    if (!isHydrated) return;
    if (!currentUser) {
      router.push("/signin?role=buyer");
    } else if (currentUser.role === "manufacturer") {
      router.push("/dashboard");
    }
  }, [currentUser, isHydrated, router]);

  // Navigation Tabs:
  // 1. Dashboard, 2. Find Suppliers, 3. My RFQs, 4. My Orders, 5. Payments, 6. Messages, 7. Settings
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "suppliers" | "rfqs" | "orders" | "payments" | "messages" | "settings"
  >("dashboard");

  // State collections
  const [suppliers, setSuppliers] = useState<SupplierItem[]>(INITIAL_SUPPLIERS);
  const [rfqs, setRfqs] = useState<RFQItem[]>(INITIAL_RFQS);
  const [quotes, setQuotes] = useState<QuotationItem[]>(INITIAL_QUOTES);
  const [orders, setOrders] = useState<OrderWorkspaceItem[]>(INITIAL_ORDERS);

  // Active selections
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierItem | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderWorkspaceItem>(orders[0]);
  const [compareQuotesForRfqId, setCompareQuotesForRfqId] = useState<string | null>(null);

  // TradeOracle AI Exact Seller & Material Matcher
  const [aiQuery, setAiQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiResult, setAiResult] = useState<AiMatchResponse | null>(null);

  // Clean Direct Seller Messaging + Auto-Translation & Sample PayPal
  const [conversations, setConversations] = useState<BuyerConversationThread[]>([]);
  const [activeThreadSupplierId, setActiveThreadSupplierId] = useState<string | null>(null);
  const [messageDraft, setMessageDraft] = useState("");
  const [translatingMsg, setTranslatingMsg] = useState(false);
  const [samplePaypalLoading, setSamplePaypalLoading] = useState(false);

  // TradeOracle AI Pre-Payment Spec & Risk Verification
  const [orderVerifyLoading, setOrderVerifyLoading] = useState(false);
  const [orderVerification, setOrderVerification] = useState<OrderAiVerification | null>(null);

  // Supplier Search & Filters
  const [supplierSearchQuery, setSupplierSearchQuery] = useState("");
  const [supplierTypeFilter, setSupplierTypeFilter] = useState<"all" | "goods" | "service">("all");
  const [supplierCategoryFilter, setSupplierCategoryFilter] = useState("all");

  // Place Order Modal State
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);
  const [rfqForm, setRfqForm] = useState({
    title: "",
    category: "Brassware & Hardware",
    quantity: 2500,
    unit: "pcs",
    budgetUSD: 45000,
    specifications: "",
    destinationPort: "Port of Long Beach, California (USLGB)",
    deliveryDate: "2026-05-15",
    supplierId: "",
    supplierName: "",
  });

  // PayPal Sandbox Payment Trigger
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [paypalSuccessMsg, setPaypalSuccessMsg] = useState<{ orderId: string; amount: string } | null>(null);

  // Live Seller Packing & Government Freight Cargo Updates from /api/trade
  const [liveCargoUpdates, setLiveCargoUpdates] = useState<
    Array<{
      orderNumber: string;
      productName: string;
      manufacturerName: string;
      packingStatus: string;
      govtCargoService: string;
      trackingNumber: string;
      buyerReassuranceNote: string;
      updatedAt: string;
    }>
  >([]);

  const fetchLiveCargoUpdates = async () => {
    try {
      const res = await fetch("/api/trade");
      if (!res.ok) return;
      const data = await res.json();
      const trades = Array.isArray(data.trades) ? data.trades : [];
      const mapped = trades
        .filter((t: { sellerDispatchUpdate?: unknown }) => Boolean(t.sellerDispatchUpdate))
        .map(
          (t: {
            orderNumber: string;
            productName: string;
            manufacturerName: string;
            sellerDispatchUpdate: {
              packingStatus: string;
              govtCargoService: string;
              trackingNumber: string;
              buyerReassuranceNote: string;
              updatedAt: string;
            };
          }) => ({
            orderNumber: t.orderNumber,
            productName: t.productName,
            manufacturerName: t.manufacturerName,
            ...t.sellerDispatchUpdate,
          })
        );
      setLiveCargoUpdates(mapped);
    } catch {
      // Ignore network error
    }
  };

  useEffect(() => {
    if (activeTab === "orders") {
      void fetchLiveCargoUpdates();
    }
  }, [activeTab]);

  // Real-time SSE Buyer Notifications + Persistent Inbox
  const [buyerNotifications, setBuyerNotifications] = useState<
    Array<{
      id: string;
      orderNumber: string;
      title: string;
      message: string;
      govtCargoService?: string;
      trackingNumber?: string;
      emailStatus?: string;
      read: boolean;
      createdAt: string;
    }>
  >([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [liveToast, setLiveToast] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/trade/events?mode=inbox")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.events)) {
          setBuyerNotifications(data.events);
        }
      })
      .catch(() => {});

    const es = new EventSource("/api/trade/events");
    es.onmessage = (ev) => {
      try {
        const parsed = JSON.parse(ev.data);
        if (parsed.type === "notification" && parsed.event) {
          setBuyerNotifications((prev) => [parsed.event, ...prev.filter((p) => p.id !== parsed.event.id)]);
          setLiveToast({ title: parsed.event.title, message: parsed.event.message });
          void fetchLiveCargoUpdates();
          window.setTimeout(() => setLiveToast(null), 7000);
        }
      } catch {
        // Ignore parse error
      }
    };
    return () => es.close();
  }, []);

  // One-Sentence AI RFQ Builder State
  const [aiRfqSentence, setAiRfqSentence] = useState("");
  const [aiRfqParsing, setAiRfqParsing] = useState(false);
  const [aiRfqMeta, setAiRfqMeta] = useState<{
    hsCode: string;
    requiredCertificates: string[];
    aiNotes: string;
  } | null>(null);

  const handleParseRfqSentence = async () => {
    if (!aiRfqSentence.trim()) return;
    setAiRfqParsing(true);
    try {
      const res = await fetch("/api/ai/parse-rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentence: aiRfqSentence }),
      });
      const data = await res.json();
      if (res.ok && data.title) {
        setRfqForm((prev) => ({
          ...prev,
          title: data.title || prev.title,
          category: data.category || prev.category,
          specifications: Array.isArray(data.specifications)
            ? data.specifications.join(", ")
            : prev.specifications,
          quantity: data.quantity || prev.quantity,
          unit: data.unit || prev.unit,
          budgetUSD: data.budgetUSD || prev.budgetUSD,
          destinationPort: data.destinationPort || prev.destinationPort,
          deliveryDate: data.deliveryDate || prev.deliveryDate,
        }));
        setAiRfqMeta({
          hsCode: data.hsCode || "8301.40",
          requiredCertificates: Array.isArray(data.requiredCertificates) ? data.requiredCertificates : [],
          aiNotes: data.aiNotes || "",
        });
      }
    } catch {
      // Ignore error
    } finally {
      setAiRfqParsing(false);
    }
  };

  // Handle Supplier Shortlist Toggle
  const toggleShortlist = (supplierId: string) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === supplierId ? { ...s, shortlisted: !s.shortlisted } : s))
    );
  };

  // Handle Place Order Submit
  const handleCreateRFQ = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenSupplier =
      suppliers.find((s) => s.id === rfqForm.supplierId) || suppliers[0];
    const orderType = chosenSupplier.type;
    const totalAmount = Number(rfqForm.budgetUSD) || 45000;
    const orderNumber = `ORD-USA-${Math.floor(1000 + Math.random() * 9000)}`;
    const rfqId = "rfq_" + Date.now();
    const productTitle = rfqForm.title.trim() || "Custom Order Batch";

    const newRfq: RFQItem = {
      id: rfqId,
      rfqNumber: `RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      type: orderType,
      title: productTitle,
      category: rfqForm.category,
      targetQuantity: Number(rfqForm.quantity) || 1,
      targetUnit: rfqForm.unit,
      budgetUSD: totalAmount,
      specifications: rfqForm.specifications || "Standard export specifications.",
      destinationPort: rfqForm.destinationPort,
      expectedDeliveryDate: rfqForm.deliveryDate,
      status: "contracted",
      createdAt: new Date().toISOString().split("T")[0],
      quotesCount: 1,
    };

    const newOrder: OrderWorkspaceItem = {
      id: "ord_" + Date.now(),
      orderNumber,
      rfqId,
      quotationId: "direct_" + Date.now(),
      supplierId: chosenSupplier.id,
      supplierName: rfqForm.supplierName || chosenSupplier.name,
      supplierEmail: chosenSupplier.contactEmail,
      buyerCompany: "Pacific Architectural Hardware LLC (USA)",
      type: orderType,
      productOrServiceName: productTitle,
      totalAmountUSD: totalAmount,
      advanceDepositUSD: Math.round(totalAmount * 0.3),
      balanceUSD: Math.round(totalAmount * 0.7),
      currency: "USD",
      currentStageIndex: 0,
      milestones: [
        { id: "m1", title: "1. Order Placed", description: "Order details sent to verified seller.", status: "completed" },
        { id: "m2", title: "2. Advance Payment", description: "Authorize 30% advance via PayPal.", status: "in_progress" },
        { id: "m3", title: "3. Production & Quality Check", description: "Seller prepares and verifies order specs.", status: "pending" },
        { id: "m4", title: "4. Shipped & Delivered", description: `Delivery to ${rfqForm.destinationPort}.`, status: "pending" },
      ],
      paypalTransaction: {
        status: "NOT_INITIATED",
        paidAdvanceUSD: 0,
        paidBalanceUSD: 0,
        lastUpdated: new Date().toISOString(),
      },
      disputeEvidence: {
        commercialPOUrl: "",
        notes: "",
      },
      createdAt: new Date().toISOString().split("T")[0],
    };

    setRfqs([newRfq, ...rfqs]);
    setOrders([newOrder, ...orders]);
    setSelectedOrder(newOrder);
    setIsRfqModalOpen(false);
    setActiveTab("orders");

    // Auto-dispatch real WhatsApp alerts to both Manufacturer and Buyer
    void triggerAutomatedWhatsAppAlert({
      role: "manufacturer",
      eventType: "new_order",
      orderNumber,
      buyerName: "Pacific Architectural Hardware LLC (USA)",
      manufacturerName: newOrder.supplierName,
      productName: newOrder.productOrServiceName,
      quantity: Number(rfqForm.quantity) || 1000,
      amountUSD: totalAmount,
    });
    void triggerAutomatedWhatsAppAlert({
      role: "buyer",
      eventType: "new_order",
      orderNumber,
      buyerName: "Pacific Architectural Hardware LLC (USA)",
      manufacturerName: newOrder.supplierName,
      productName: newOrder.productOrServiceName,
      quantity: Number(rfqForm.quantity) || 1000,
      amountUSD: totalAmount,
    });
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

    // Auto-dispatch real "You Have Received a New Order!" WhatsApp alert
    void triggerAutomatedWhatsAppAlert({
      role: "manufacturer",
      eventType: "new_order",
      orderNumber: newOrder.orderNumber,
      buyerName: newOrder.buyerCompany,
      manufacturerName: newOrder.supplierName,
      productName: newOrder.productOrServiceName,
      quantity: parentRfq?.targetQuantity || 1500,
      amountUSD: newOrder.totalAmountUSD,
    });
    void triggerAutomatedWhatsAppAlert({
      role: "buyer",
      eventType: "new_order",
      orderNumber: newOrder.orderNumber,
      buyerName: newOrder.buyerCompany,
      manufacturerName: newOrder.supplierName,
      productName: newOrder.productOrServiceName,
      quantity: parentRfq?.targetQuantity || 1500,
      amountUSD: newOrder.totalAmountUSD,
    });
  };

  // Trigger Live PayPal Sandbox Escrow Payment for Selected Order
  const handleExecutePayPalPayment = async (orderId: string, isAdvance: boolean) => {
    setPaypalLoading(true);
    setPaypalSuccessMsg(null);
    const targetOrder = orders.find((o) => o.id === orderId) || selectedOrder;
    const amountUSD = isAdvance ? targetOrder.advanceDepositUSD : targetOrder.balanceUSD;
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    try {
      const res = await fetch("/api/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_paypal_payment",
          tradeId: targetOrder.id,
          orderNumber: targetOrder.orderNumber,
          amountUSD,
          description: isAdvance
            ? `30% Advance Deposit for ${targetOrder.productOrServiceName} (PO: ${targetOrder.orderNumber})`
            : `70% Balance Payment for ${targetOrder.productOrServiceName} (PO: ${targetOrder.orderNumber})`,
          returnUrl: `${origin}/buyer?paypal=approved`,
          cancelUrl: `${origin}/buyer?paypal=cancelled`,
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
          amount: isAdvance ? `$${targetOrder.advanceDepositUSD.toLocaleString()} USD (30% Advance)` : `$${targetOrder.balanceUSD.toLocaleString()} USD (70% Balance)`,
        });
      }
    } catch {
      // Fallback update
    } finally {
      setPaypalLoading(false);
    }
  };

  // Run NVIDIA AI Exact Seller & Material Match
  const handleRunAiSellerMatch = async (customQuery?: string) => {
    const queryToUse = (customQuery ?? aiQuery).trim();
    if (!queryToUse) {
      setAiError("Please describe the product, exact material, finish, or quantity you need.");
      return;
    }
    if (customQuery !== undefined) {
      setAiQuery(customQuery);
    }
    setAiLoading(true);
    setAiError("");
    try {
      const res = await fetch("/api/ai/match-seller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryToUse }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAiError(data.error || "Unable to find a matching seller right now.");
        return;
      }
      setAiResult(data as AiMatchResponse);
    } catch {
      setAiError("Could not reach the AI seller matcher. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  // Open direct conversation with the exact matched seller to ask for a sample
  const openSampleMessageThread = (
    supplier: SupplierItem,
    matchedProduct?: string,
    matchedMaterial?: string,
    suggestedMessage?: string
  ) => {
    const productLabel = matchedProduct || supplier.productsOrServices[0];
    const materialLabel = matchedMaterial || supplier.materials?.[0] || supplier.category;

    setConversations((prev) => {
      const existing = prev.find((t) => t.supplierId === supplier.id);
      if (existing) {
        return prev;
      }
      return [
        {
          supplierId: supplier.id,
          supplierName: supplier.name,
          supplierCity: `${supplier.city}, ${supplier.state}`,
          preferredLanguage: supplier.preferredLanguage || "Hindi",
          samplePriceUSD: supplier.samplePriceUSD || 150,
          matchedProduct: productLabel,
          matchedMaterial: materialLabel,
          samplePolicy:
            supplier.samplePolicy || "Sample availability and dispatch timing confirmed on request.",
          messages: [],
        },
        ...prev,
      ];
    });

    setActiveThreadSupplierId(supplier.id);
    setMessageDraft(
      suggestedMessage ||
        `Hello ${supplier.name}, I would like to request a sample of ${productLabel} (${materialLabel}). Please confirm sample unit availability, cost, and shipping timeline.`
    );
    setActiveTab("messages");
  };

  const handleSendBuyerMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = messageDraft.trim();
    if (!trimmed || !activeThreadSupplierId) return;

    const currentThread = conversations.find((t) => t.supplierId === activeThreadSupplierId);
    const targetLanguage = currentThread?.preferredLanguage || "Hindi";
    const msgId = "msg_" + Date.now();
    const nowLabel = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setConversations((prev) =>
      prev.map((thread) =>
        thread.supplierId === activeThreadSupplierId
          ? {
              ...thread,
              messages: [
                ...thread.messages,
                {
                  id: msgId,
                  sender: "buyer",
                  text: trimmed,
                  sourceLang: "English",
                  targetLang: targetLanguage,
                  sentAt: `Today, ${nowLabel}`,
                },
              ],
            }
          : thread
      )
    );
    setMessageDraft("");

    if (targetLanguage.toLowerCase() !== "english") {
      setTranslatingMsg(true);
      try {
        const res = await fetch("/api/ai/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: trimmed,
            sourceLanguage: "English",
            targetLanguage,
          }),
        });
        const data = await res.json();
        if (data.translatedText) {
          setConversations((prev) =>
            prev.map((thread) =>
              thread.supplierId === activeThreadSupplierId
                ? {
                    ...thread,
                    messages: thread.messages.map((m) =>
                      m.id === msgId
                        ? { ...m, translatedText: data.translatedText, targetLang: targetLanguage }
                        : m
                    ),
                  }
                : thread
            )
          );
        }
      } catch {
        // Keep English text if translation call fails
      } finally {
        setTranslatingMsg(false);
      }
    }
  };

  const handleSimulateSellerReply = async (thread: BuyerConversationThread) => {
    setTranslatingMsg(true);
    const nowLabel = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const englishReply = `Yes, we manufacture ${thread.matchedProduct} in ${thread.matchedMaterial}. Sample units are ready at $${thread.samplePriceUSD} USD including DHL courier. You can pay the sample fee here via PayPal and we will dispatch within 5 days.`;

    try {
      // First get the seller's native-language message, then show it alongside English translation
      const toNativeRes = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: englishReply,
          sourceLanguage: "English",
          targetLanguage: thread.preferredLanguage,
        }),
      });
      const toNativeData = await toNativeRes.json();
      const nativeText = toNativeData.translatedText || englishReply;

      const toEnglishRes = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: nativeText,
          sourceLanguage: thread.preferredLanguage,
          targetLanguage: "English",
        }),
      });
      const toEnglishData = await toEnglishRes.json();

      setConversations((prev) =>
        prev.map((t) =>
          t.supplierId === thread.supplierId
            ? {
                ...t,
                messages: [
                  ...t.messages,
                  {
                    id: "msg_seller_" + Date.now(),
                    sender: "seller",
                    text: nativeText,
                    translatedText: toEnglishData.translatedText || englishReply,
                    sourceLang: thread.preferredLanguage,
                    targetLang: "English",
                    sentAt: `Today, ${nowLabel}`,
                  },
                ],
              }
            : t
        )
      );
    } catch {
      // Fallback
    } finally {
      setTranslatingMsg(false);
    }
  };

  const handlePaySampleViaPayPal = async (thread: BuyerConversationThread) => {
    setSamplePaypalLoading(true);
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    try {
      const res = await fetch("/api/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_paypal_payment",
          tradeId: `sample_${thread.supplierId}_${Date.now()}`,
          orderNumber: `SMP-${thread.supplierId.slice(-4).toUpperCase()}`,
          amountUSD: thread.samplePriceUSD,
          description: `Sample Order: ${thread.matchedProduct} (${thread.matchedMaterial})`,
          returnUrl: `${origin}/buyer?paypal=sample_approved`,
          cancelUrl: `${origin}/buyer?paypal=sample_cancelled`,
          isAdvance: true,
        }),
      });
      const data = await res.json();
      if (data.success && data.paymentOrder) {
        const approveUrl =
          data.paymentOrder.links?.find((l: { rel: string; href: string }) => l.rel === "approve")
            ?.href || `https://www.sandbox.paypal.com/checkoutnow?token=${data.paymentOrder.id}`;
        setConversations((prev) =>
          prev.map((t) =>
            t.supplierId === thread.supplierId
              ? {
                  ...t,
                  samplePaypalOrderId: data.paymentOrder.id,
                  samplePaypalUrl: approveUrl,
                }
              : t
          )
        );
      }
    } catch {
      // Ignore network error
    } finally {
      setSamplePaypalLoading(false);
    }
  };

  const handleRunOrderVerification = async (order: OrderWorkspaceItem) => {
    setOrderVerifyLoading(true);
    try {
      const res = await fetch("/api/ai/verify-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: order.orderNumber,
          supplierId: order.supplierId,
          supplierName: order.supplierName,
          productOrServiceName: order.productOrServiceName,
          specifications: order.productOrServiceName,
          totalAmountUSD: order.totalAmountUSD,
          advanceDepositUSD: order.advanceDepositUSD,
        }),
      });
      const data = await res.json();
      if (data.status) {
        setOrderVerification({
          orderId: order.id,
          status: data.status,
          riskLevel: data.riskLevel || "LOW",
          specAlignmentSummary: data.specAlignmentSummary,
          warnings: data.warnings || [],
          checks: data.checks || [],
        });
      }
    } catch {
      // Ignore error
    } finally {
      setOrderVerifyLoading(false);
    }
  };

  // Filtered Suppliers
  const q = supplierSearchQuery.toLowerCase();
  const filteredSuppliers = suppliers.filter((sup) => {
    const matchesSearch =
      !q ||
      sup.name.toLowerCase().includes(q) ||
      sup.city.toLowerCase().includes(q) ||
      sup.category.toLowerCase().includes(q) ||
      sup.productsOrServices.some((p) => p.toLowerCase().includes(q)) ||
      (sup.materials || []).some((m) => m.toLowerCase().includes(q)) ||
      (sup.finishes || []).some((f) => f.toLowerCase().includes(q)) ||
      sup.capabilities.some((c) => c.toLowerCase().includes(q));
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
        <div className="flex items-center gap-3 relative">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                const nextOpen = !notifOpen;
                setNotifOpen(nextOpen);
                if (nextOpen && buyerNotifications.some((n) => !n.read)) {
                  fetch("/api/trade/events", { method: "POST" }).catch(() => {});
                  setBuyerNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                }
              }}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors relative cursor-pointer"
              title="Live Order & Cargo Notifications"
            >
              <Bell className="w-4 h-4" />
              {buyerNotifications.some((n) => !n.read) && (
                <span className="min-w-4 h-4 px-1 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center absolute -top-0.5 -right-0.5">
                  {buyerNotifications.filter((n) => !n.read).length}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-stone-200 shadow-xl z-50 p-3 space-y-2 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-xs font-bold text-[#18280e]">
                    Live Buyer Notifications ({buyerNotifications.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setNotifOpen(false)}
                    className="text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                {buyerNotifications.length === 0 ? (
                  <p className="text-xs text-stone-500 py-4 text-center">
                    No notifications yet. Seller packing, certificate, and cargo updates appear here in real time.
                  </p>
                ) : (
                  buyerNotifications.slice(0, 12).map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-[#f4faed] border border-[#d8e5ca] space-y-1 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-[#18280e]">{n.orderNumber}</strong>
                        <span className="text-[10px] font-mono text-[#3f7308]">
                          {n.emailStatus === "sent_via_resend" ? "Email Sent ✓" : "Live Push ✓"}
                        </span>
                      </div>
                      <div className="font-semibold text-[#18280e]">{n.title}</div>
                      <p className="text-stone-700 text-[11px] leading-snug">{n.message}</p>
                      {n.trackingNumber && (
                        <span className="inline-block font-mono text-[10px] px-2 py-0.5 rounded bg-[#18280e] text-[#b2eb76] font-bold">
                          {n.trackingNumber}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {liveToast && (
            <div className="fixed bottom-5 right-5 z-50 max-w-sm p-4 rounded-2xl bg-[#18280e] text-white shadow-2xl border border-[#b2eb76]/40 space-y-1 animate-in fade-in">
              <div className="text-xs font-bold text-[#b2eb76]">🔔 {liveToast.title}</div>
              <p className="text-xs text-stone-200 leading-snug">{liveToast.message}</p>
            </div>
          )}

          <button
            type="button"
            className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
            title="Help & Guidelines"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* WhatsApp Live Alerts */}
          <WhatsAppNotificationCenter
            role="buyer"
            recipientPhone="+1 (949) 555-0192"
            recipientName="Pacific Architectural Hardware LLC"
            orderNumber="ORD-2026-081"
            compact={true}
          />

          {/* User Company Info */}
          <div className="flex items-center gap-2 pl-3 border-l border-stone-200 shrink-0">
            <div className="size-8 rounded-lg bg-[#ebf7d9] text-[#18280e] font-bold text-xs flex items-center justify-center shrink-0">
              US
            </div>
            <div className="hidden lg:flex flex-col text-left whitespace-nowrap">
              <span className="text-xs font-bold text-[#18280e] leading-tight">Marcus Vance</span>
              <span className="text-[11px] text-stone-500">Pacific Arch Hardware LLC</span>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={() => {
              setCurrentSessionUser(null);
              router.push("/signin");
            }}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-white hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-200 hover:border-rose-200 text-xs font-sans font-medium transition-colors cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
            title="Sign out of TradeOracle session"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
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

            {/* 6. Messages (Direct Sample & Seller Inquiries) */}
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
              {conversations.length > 0 && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    activeTab === "messages" ? "bg-[#b2eb76]/20 text-[#b2eb76]" : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {conversations.length}
                </span>
              )}
            </button>

            {/* 7. Settings */}
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

          {/* Bottom Card: WhatsApp Updates & PayPal Connection */}
          <div className="p-4 border-t border-stone-200/90 space-y-3">
            <WhatsAppNotificationCenter
              role="buyer"
              recipientPhone="+1 (949) 555-0192"
              recipientName="Pacific Architectural Hardware LLC"
              orderNumber="ORD-2026-081"
              compact={false}
            />

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
        <main data-lenis-prevent className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto overflow-y-auto">
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
                        setRfqForm((prev) => ({
                          ...prev,
                          supplierId: "",
                          supplierName: "",
                        }));
                        setIsRfqModalOpen(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Place Order</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("suppliers")}
                      className="px-3.5 py-2 rounded-xl bg-[#ebf7d9] hover:bg-[#d8e5ca] text-[#18280e] font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors border border-[#d8e5ca]"
                    >
                      <Search className="w-3.5 h-3.5 text-[#3f7308]" />
                      <span>Browse All Sellers</span>
                    </button>
                  </div>
                </div>

                {/* NVIDIA AI Exact Seller & Material Finder */}
                <div className="pt-2 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#3f7308]" />
                      <span className="text-xs font-bold text-[#18280e]">
                        AI Seller &amp; Material Finder
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ebf7d9] text-[#284905] font-semibold">
                        TradeOracle AI
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-400 hidden sm:inline">
                      Describe the exact product, material &amp; finish to match the right seller
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-2xl bg-stone-50 border border-stone-200 focus-within:border-[#18280e] transition-colors">
                    <input
                      type="text"
                      placeholder="Describe exact product & material (e.g. 3,500 CW617N solid brass mortise locksets with satin gold PVD coating)"
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") void handleRunAiSellerMatch();
                      }}
                      className="w-full px-3 py-1.5 bg-transparent text-xs font-mono placeholder:text-stone-400 outline-none"
                    />
                    <button
                      type="button"
                      disabled={aiLoading}
                      onClick={() => void handleRunAiSellerMatch()}
                      className="px-4 py-2 rounded-xl bg-[#18280e] text-[#b2eb76] font-bold text-xs whitespace-nowrap cursor-pointer hover:bg-[#253d16] transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{aiLoading ? "Matching..." : "Find Exact Seller"}</span>
                    </button>
                  </div>

                  {/* Quick Example Prompts */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="text-stone-400 font-mono">Try:</span>
                    {[
                      "CW617N solid brass door handles with PVD satin gold finish",
                      "Grade 10.9 flange bolts AISI 4140 steel zinc-nickel plated",
                      "AISI 316 stainless steel high-pressure hydraulic valves",
                      "GOTS organic cotton 400 GSM heavyweight hoodies",
                    ].map((sample) => (
                      <button
                        key={sample}
                        type="button"
                        onClick={() => void handleRunAiSellerMatch(sample)}
                        className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-[#ebf7d9] text-stone-700 hover:text-[#18280e] transition-colors cursor-pointer text-left"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>

                  {aiError && (
                    <div role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
                      {aiError}
                    </div>
                  )}

                  {/* AI Match Results */}
                  {aiResult && (
                    <div className="p-4 rounded-2xl bg-[#f4faed] border border-[#d8e5ca] space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#18280e]">
                              {aiResult.summary}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#d8e5ca] text-[#284905]">
                              {aiResult.poweredBy}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 text-[11px] font-mono text-stone-600 pt-1">
                            <span>Product: <strong>{aiResult.extractedRequirements.product}</strong></span>
                            <span>•</span>
                            <span>Material: <strong>{aiResult.extractedRequirements.material}</strong></span>
                            <span>•</span>
                            <span>Spec: <strong>{aiResult.extractedRequirements.finishOrStandard}</strong></span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAiResult(null)}
                          className="text-xs text-stone-500 hover:text-stone-800 cursor-pointer underline"
                        >
                          Clear
                        </button>
                      </div>

                      {aiResult.matches.length === 0 ? (
                        <div className="p-4 rounded-xl bg-white border border-stone-200 text-xs text-stone-600">
                          {aiResult.noExactMatchReason ||
                            "No verified seller in the directory matched that exact material and product specification."}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {aiResult.matches.map((match) => {
                            const seller = suppliers.find((s) => s.id === match.supplierId);
                            if (!seller) return null;
                            return (
                              <div
                                key={match.supplierId}
                                className="p-4 rounded-2xl bg-white border border-[#d8e5ca] shadow-xs space-y-3 flex flex-col justify-between"
                              >
                                <div className="space-y-2">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <h4 className="font-bold text-sm text-[#18280e]">{seller.name}</h4>
                                      <span className="text-[11px] font-mono text-stone-500">
                                        {seller.city}, {seller.state} • {seller.approxPricingRange}
                                      </span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full bg-[#18280e] text-[#b2eb76] text-[10px] font-mono font-bold shrink-0">
                                      {match.matchScore}% Match
                                    </span>
                                  </div>

                                  <div className="text-[11px] font-mono bg-stone-50 rounded-xl p-2.5 space-y-1">
                                    <div className="text-[#284905] font-bold">
                                      Exact Material: {match.exactMaterialMatch}
                                    </div>
                                    {match.matchingProducts.length > 0 && (
                                      <div className="text-stone-600">
                                        Products: {match.matchingProducts.join(", ")}
                                      </div>
                                    )}
                                  </div>

                                  <p className="text-xs text-stone-700 leading-relaxed">
                                    {match.whyThisSeller}
                                  </p>

                                  {seller.samplePolicy && (
                                    <p className="text-[11px] font-mono text-stone-500 flex items-center gap-1.5">
                                      <Package className="w-3.5 h-3.5 text-[#3f7308] shrink-0" />
                                      <span>{seller.samplePolicy}</span>
                                    </p>
                                  )}
                                </div>

                                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      openSampleMessageThread(
                                        seller,
                                        aiResult.extractedRequirements.product,
                                        match.exactMaterialMatch,
                                        match.samplePromptSuggestion
                                      )
                                    }
                                    className="flex-1 py-2 px-3 rounded-xl bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>Ask for Sample</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRfqForm((prev) => ({
                                        ...prev,
                                        title: aiResult.extractedRequirements.product,
                                        category: seller.category,
                                        specifications: `${match.exactMaterialMatch} — ${aiResult.extractedRequirements.finishOrStandard}`,
                                        supplierId: seller.id,
                                        supplierName: seller.name,
                                      }));
                                      setIsRfqModalOpen(true);
                                    }}
                                    className="py-2 px-3 rounded-xl bg-[#ebf7d9] hover:bg-[#d8e5ca] text-[#18280e] font-bold text-xs cursor-pointer transition-colors"
                                  >
                                    Place Order
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
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
                <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4 font-sans text-xs">
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
                <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4 font-sans text-xs">
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
                  onClick={() => {
                    setRfqForm((prev) => ({ ...prev, supplierId: "", supplierName: "" }));
                    setIsRfqModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Place Order</span>
                </button>
              </div>

              {/* AI Match Quick Bar inside Find Suppliers */}
              <div className="p-4 rounded-2xl bg-[#f4faed] border border-[#d8e5ca] flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex items-center gap-2 flex-1 bg-white px-3 py-1.5 rounded-xl border border-[#d8e5ca]">
                  <Sparkles className="w-4 h-4 text-[#3f7308] shrink-0" />
                  <input
                    type="text"
                    placeholder="Ask TradeOracle AI to find the exact seller by material, coating, or product specs..."
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void handleRunAiSellerMatch();
                    }}
                    className="w-full text-xs font-mono bg-transparent outline-none"
                  />
                </div>
                <button
                  type="button"
                  disabled={aiLoading}
                  onClick={() => void handleRunAiSellerMatch()}
                  className="px-4 py-2 rounded-xl bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] font-bold text-xs cursor-pointer transition-colors whitespace-nowrap disabled:opacity-50"
                >
                  {aiLoading ? "Matching..." : "Match Exact Seller with AI"}
                </button>
              </div>

              {aiResult && (
                <div className="p-4 rounded-2xl bg-white border border-[#d8e5ca] shadow-xs space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#18280e]">
                      {aiResult.summary} ({aiResult.poweredBy})
                    </span>
                    <button
                      type="button"
                      onClick={() => setAiResult(null)}
                      className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  {aiResult.matches.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {aiResult.matches.map((match) => {
                        const seller = suppliers.find((s) => s.id === match.supplierId);
                        if (!seller) return null;
                        return (
                          <div key={match.supplierId} className="p-3.5 rounded-xl bg-[#f4faed] border border-[#d8e5ca] space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <strong className="text-xs text-[#18280e]">{seller.name}</strong>
                              <span className="px-2 py-0.5 rounded-full bg-[#18280e] text-[#b2eb76] text-[10px] font-mono font-bold">
                                {match.matchScore}% Match
                              </span>
                            </div>
                            <p className="text-[11px] font-mono text-[#284905]">
                              Material: {match.exactMaterialMatch}
                            </p>
                            <p className="text-xs text-stone-700">{match.whyThisSeller}</p>
                            <button
                              type="button"
                              onClick={() =>
                                openSampleMessageThread(
                                  seller,
                                  aiResult.extractedRequirements.product,
                                  match.exactMaterialMatch,
                                  match.samplePromptSuggestion
                                )
                              }
                              className="px-3 py-1.5 rounded-lg bg-[#18280e] text-[#b2eb76] text-xs font-bold cursor-pointer hover:bg-[#253d16] inline-flex items-center gap-1.5"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>Ask for Sample</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

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
                  <option value="Industrial Valves & CNC Parts">Industrial Valves &amp; CNC Parts</option>
                  <option value="Aerospace & Precision CNC">Aerospace &amp; Precision CNC</option>
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

                      {/* Verification Status Banner */}
                      <div className="p-3 rounded-2xl bg-[#f4faed] border border-[#d8e5ca] space-y-1 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5 text-[#284905] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#3f7308]" />
                          <span>Verified: {supplier.verificationSource}</span>
                        </div>
                        {supplier.materials && supplier.materials.length > 0 && (
                          <p className="text-stone-600 text-[10px] leading-tight">
                            Materials: {supplier.materials.join(" • ")}
                          </p>
                        )}
                      </div>

                      {/* Products / Capabilities */}
                      <div className="space-y-1.5 font-mono text-xs">
                        <span className="text-[10px] text-stone-400 uppercase font-bold block">
                          Products / Scope:
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
                    <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedSupplier(supplier)}
                        className="text-xs font-mono font-bold text-stone-600 hover:text-black hover:underline cursor-pointer"
                      >
                        Details →
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openSampleMessageThread(supplier)}
                          className="px-3 py-1.5 rounded-xl bg-[#ebf7d9] hover:bg-[#d8e5ca] text-[#18280e] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Ask for Sample</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRfqForm((prev) => ({
                              ...prev,
                              title: `Sourcing ${supplier.productsOrServices[0]}`,
                              category: supplier.category,
                              specifications: supplier.materials?.[0] || "",
                              supplierId: supplier.id,
                              supplierName: supplier.name,
                            }));
                            setIsRfqModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                        >
                          <span>Place Order</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
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
                    Review supplier quotations and place orders directly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setRfqForm((prev) => ({ ...prev, supplierId: "", supplierName: "" }));
                    setIsRfqModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Place Order</span>
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

                {/* TradeOracle AI Pre-Payment Spec & Risk Guard */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 font-mono text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold text-[#18280e]">
                      <Sparkles className="w-4 h-4 text-[#3f7308]" />
                      <span>TradeOracle AI Spec &amp; Risk Check</span>
                    </div>
                    <button
                      type="button"
                      disabled={orderVerifyLoading}
                      onClick={() => void handleRunOrderVerification(selectedOrder)}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#f4faed] border border-stone-200 text-[#18280e] font-bold text-[11px] cursor-pointer transition-colors disabled:opacity-50"
                    >
                      {orderVerifyLoading
                        ? "Checking Specs & Risk..."
                        : orderVerification?.orderId === selectedOrder.id
                          ? "Re-check Specs & Risk"
                          : "Verify Specs & Risk Before Paying"}
                    </button>
                  </div>
                  {orderVerification?.orderId === selectedOrder.id && (
                    <div className="pt-2 border-t border-stone-200 space-y-1.5 text-[11px]">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded font-bold ${
                            orderVerification.status === "VERIFIED"
                              ? "bg-[#ebf7d9] text-[#284905]"
                              : "bg-amber-100 text-amber-900"
                          }`}
                        >
                          {orderVerification.status} · Risk: {orderVerification.riskLevel}
                        </span>
                        <span className="text-stone-700">{orderVerification.specAlignmentSummary}</span>
                      </div>
                      {orderVerification.warnings.map((w, i) => (
                        <div key={i} className="text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                          ⚠ {w}
                        </div>
                      ))}
                      {orderVerification.checks.map((c, i) => (
                        <div key={i} className="text-[#284905]">
                          ✓ {c}
                        </div>
                      ))}
                    </div>
                  )}
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
                      {selectedOrder.paypalTransaction.approvalUrl ? (
                        <a
                          href={selectedOrder.paypalTransaction.approvalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-[#18280e] text-[#b2eb76] text-xs font-bold hover:bg-[#253d16] flex items-center gap-1"
                        >
                          <span>Open PayPal Checkout</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <button
                          type="button"
                          disabled={paypalLoading}
                          onClick={() => handleExecutePayPalPayment(selectedOrder.id, true)}
                          className="px-3 py-1.5 rounded-lg bg-[#18280e] text-[#b2eb76] text-xs font-bold hover:bg-[#253d16] flex items-center gap-1 cursor-pointer"
                        >
                          <span>{paypalLoading ? "Connecting..." : "Create Live PayPal Checkout"}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
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

              {/* Live Seller Packing & Government Freight Cargo Reassurance Card */}
              {liveCargoUpdates.length > 0 && (
                <div className="p-6 rounded-3xl bg-[#f4faed] border border-[#d8e5ca] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-emerald-600 animate-pulse" />
                      <h3 className="font-bold text-sm text-[#18280e]">
                        Live Seller &amp; Government Freight Cargo Update
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => void fetchLiveCargoUpdates()}
                      className="text-xs font-bold text-[#3f7308] hover:underline cursor-pointer"
                    >
                      Refresh Status
                    </button>
                  </div>
                  {liveCargoUpdates.map((u, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white border border-[#d8e5ca] space-y-1.5 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <strong className="text-[#18280e]">
                          {u.orderNumber} • {u.productName} ({u.manufacturerName})
                        </strong>
                        <span className="font-mono px-2.5 py-0.5 rounded-full bg-[#18280e] text-[#b2eb76] font-bold">
                          {u.trackingNumber}
                        </span>
                      </div>
                      <p className="text-[#3f7308] font-bold">
                        Status: {u.packingStatus.replace(/_/g, " ").toUpperCase()} · Carrier: {u.govtCargoService}
                      </p>
                      <p className="text-stone-700 leading-relaxed">{u.buyerReassuranceNote}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Order Progress Steps (Simplified) */}
              <div className="p-6 md:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-base text-[#18280e]">
                      Order Progress
                    </h3>
                    <p className="text-xs text-stone-500 font-mono">
                      Simple step-by-step tracking from order confirmation to delivery.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-stone-400">
                    Step {selectedOrder.currentStageIndex + 1} of {selectedOrder.milestones.length}
                  </span>
                </div>

                <div className="space-y-3 pt-2">
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
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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

                          <span className="pl-7 sm:pl-0 text-stone-500 font-mono text-[11px] shrink-0">
                            {isCompleted ? "Done" : isCurrent ? "In Progress" : "Upcoming"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
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
          {/* TAB 6: MESSAGES (Direct Seller Sample Inquiries — No Random Seller)    */}
          {/* ======================================================================= */}
          {activeTab === "messages" && (() => {
            const activeThread =
              conversations.find((t) => t.supplierId === activeThreadSupplierId) ||
              conversations[0] ||
              null;

            return (
              <div className="space-y-6 animate-in fade-in duration-200 font-sans">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-[#18280e] tracking-tight">
                      Seller Sample &amp; Sourcing Messages
                    </h2>
                    <p className="text-xs text-stone-500">
                      Only sellers you explicitly match and choose appear here—no random pre-configured chats.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("dashboard")}
                    className="px-4 py-2 rounded-xl bg-[#ebf7d9] hover:bg-[#d8e5ca] text-[#18280e] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors self-start"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#3f7308]" />
                    <span>Find Exact Seller with AI</span>
                  </button>
                </div>

                {!activeThread ? (
                  <div className="p-8 md:p-12 rounded-3xl bg-white border border-stone-200/80 shadow-xs text-center space-y-4">
                    <div className="size-12 rounded-2xl bg-[#f4faed] border border-[#d8e5ca] text-[#3f7308] flex items-center justify-center mx-auto">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 max-w-md mx-auto">
                      <h3 className="font-bold text-base text-[#18280e]">No Seller Messages Yet</h3>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Describe the exact product and material you need in the AI Seller Finder (or browse Find Suppliers), then click <strong>Ask for Sample</strong> on the matched seller to message them directly.
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab("dashboard")}
                        className="px-4 py-2 rounded-xl bg-[#18280e] text-[#b2eb76] font-bold text-xs cursor-pointer hover:bg-[#253d16]"
                      >
                        Go to AI Seller Finder →
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("suppliers")}
                        className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs cursor-pointer hover:bg-stone-200"
                      >
                        Browse All Sellers
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Matched Seller Thread List */}
                    <div className="p-4 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-2 h-fit">
                      <span className="text-[10px] font-mono text-stone-400 uppercase font-bold px-2 block">
                        Matched Sellers ({conversations.length})
                      </span>
                      {conversations.map((thread) => (
                        <button
                          key={thread.supplierId}
                          type="button"
                          onClick={() => setActiveThreadSupplierId(thread.supplierId)}
                          className={`w-full p-3 rounded-2xl text-left transition-colors cursor-pointer border ${
                            activeThread.supplierId === thread.supplierId
                              ? "bg-[#f4faed] border-[#d8e5ca]"
                              : "bg-white border-stone-100 hover:bg-stone-50"
                          }`}
                        >
                          <div className="font-bold text-xs text-[#18280e]">{thread.supplierName}</div>
                          <div className="text-[11px] font-mono text-[#3f7308] truncate mt-0.5">
                            {thread.matchedMaterial}
                          </div>
                          <div className="text-[10px] font-mono text-stone-400 mt-1">
                            {thread.messages.length} sent message{thread.messages.length === 1 ? "" : "s"}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Active Seller Sample Chat */}
                    <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4">
                      <div className="pb-4 border-b border-stone-100 space-y-2">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-base text-[#18280e]">
                              {activeThread.supplierName}
                            </h3>
                            <span className="text-xs font-mono text-stone-500">
                              {activeThread.supplierCity} · Preferred Language: <strong>{activeThread.preferredLanguage}</strong>
                            </span>
                          </div>
                          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#ebf7d9] text-[#284905] font-bold">
                            Auto-Translate: English ↔ {activeThread.preferredLanguage}
                          </span>
                        </div>
                        <div className="p-3 rounded-2xl bg-[#f4faed] border border-[#d8e5ca] text-xs font-mono space-y-1.5">
                          <div className="text-[#18280e]">
                            Product: <strong>{activeThread.matchedProduct}</strong>
                          </div>
                          <div className="text-[#284905]">
                            Exact Material: <strong>{activeThread.matchedMaterial}</strong>
                          </div>
                          <div className="text-stone-600 text-[11px]">
                            Sample Terms: {activeThread.samplePolicy}
                          </div>
                          <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-[#d8e5ca]">
                            {activeThread.samplePaypalUrl ? (
                              <a
                                href={activeThread.samplePaypalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-[#18280e] text-[#b2eb76] text-[11px] font-bold hover:bg-[#253d16] inline-flex items-center gap-1"
                              >
                                <span>Pay Sample (${activeThread.samplePriceUSD}) via PayPal</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <button
                                type="button"
                                disabled={samplePaypalLoading}
                                onClick={() => void handlePaySampleViaPayPal(activeThread)}
                                className="px-3 py-1.5 rounded-lg bg-[#18280e] text-[#b2eb76] text-[11px] font-bold hover:bg-[#253d16] inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                              >
                                <CreditCard className="w-3 h-3" />
                                <span>
                                  {samplePaypalLoading
                                    ? "Creating PayPal Link..."
                                    : `Create Sample PayPal Link ($${activeThread.samplePriceUSD})`}
                                </span>
                              </button>
                            )}
                            <button
                              type="button"
                              disabled={translatingMsg}
                              onClick={() => void handleSimulateSellerReply(activeThread)}
                              className="px-3 py-1.5 rounded-lg bg-white border border-[#d8e5ca] text-[#18280e] text-[11px] font-bold hover:bg-[#ebf7d9] cursor-pointer disabled:opacity-50"
                            >
                              {translatingMsg
                                ? "Translating..."
                                : `Test Seller Reply (${activeThread.preferredLanguage} → English)`}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Messages History */}
                      <div className="space-y-3 min-h-[140px]">
                        {activeThread.messages.length === 0 ? (
                          <p className="text-xs font-mono text-stone-400 py-6 text-center">
                            No message sent to {activeThread.supplierName} yet. Write in English below — TradeOracle AI translates automatically to {activeThread.preferredLanguage}.
                          </p>
                        ) : (
                          activeThread.messages.map((msg) =>
                            msg.sender === "buyer" ? (
                              <div
                                key={msg.id}
                                className="p-4 rounded-2xl bg-[#18280e] text-white space-y-2 ml-auto max-w-xl"
                              >
                                <div className="flex justify-between items-center text-[10px] font-mono text-[#b2eb76]">
                                  <strong>Marcus Vance (You · English)</strong>
                                  <span>{msg.sentAt}</span>
                                </div>
                                <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                {msg.translatedText && (
                                  <div className="pt-2 border-t border-white/15 space-y-0.5">
                                    <span className="text-[10px] font-mono text-[#b2eb76] block">
                                      Translated to {msg.targetLang} (sent to seller):
                                    </span>
                                    <p className="text-xs text-stone-200 leading-relaxed whitespace-pre-wrap">
                                      {msg.translatedText}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div
                                key={msg.id}
                                className="p-4 rounded-2xl bg-[#f4faed] border border-[#d8e5ca] text-[#18280e] space-y-2 mr-auto max-w-xl"
                              >
                                <div className="flex justify-between items-center text-[10px] font-mono text-[#3f7308]">
                                  <strong>{activeThread.supplierName} ({msg.sourceLang})</strong>
                                  <span>{msg.sentAt}</span>
                                </div>
                                {msg.translatedText && (
                                  <p className="text-xs font-medium leading-relaxed whitespace-pre-wrap">
                                    {msg.translatedText}
                                  </p>
                                )}
                                <div className="pt-2 border-t border-[#d8e5ca] space-y-0.5">
                                  <span className="text-[10px] font-mono text-stone-500 block">
                                    Original in {msg.sourceLang} (translated to English):
                                  </span>
                                  <p className="text-[11px] text-stone-600 leading-relaxed whitespace-pre-wrap">
                                    {msg.text}
                                  </p>
                                </div>
                              </div>
                            )
                          )
                        )}
                      </div>

                      {/* Sample Message Composer */}
                      <form onSubmit={handleSendBuyerMessage} className="space-y-2 pt-2 border-t border-stone-100">
                        <label className="text-[11px] font-mono text-stone-500 block">
                          Message to {activeThread.supplierName} (Sample / Specification Check)
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <textarea
                            rows={3}
                            required
                            value={messageDraft}
                            onChange={(e) => setMessageDraft(e.target.value)}
                            placeholder={`Ask ${activeThread.supplierName} for a product sample matching ${activeThread.matchedMaterial}...`}
                            className="flex-1 p-3 rounded-xl bg-[#fbfdf9] border border-stone-200 text-xs font-mono outline-none focus:border-[#18280e]"
                          />
                          <button
                            type="submit"
                            className="px-5 py-3 rounded-xl bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] font-bold text-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5 self-end sm:self-stretch"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Sample Request</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ======================================================================= */}
          {/* TAB 8: SETTINGS                                                         */}
          {/* ======================================================================= */}
          {activeTab === "settings" && (
            <div className="p-6 md:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-6 font-sans text-xs">
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
      {/* 4. SIMPLE PLACE ORDER MODAL                                               */}
      {/* ========================================================================= */}
      {isRfqModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div data-lenis-prevent className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-5 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex justify-between items-center pb-4 border-b border-stone-100">
              <div>
                <h3 className="font-bold text-lg text-[#18280e]">Place Order</h3>
                <p className="text-xs text-stone-500 font-mono">
                  {rfqForm.supplierName
                    ? `Placing order directly with ${rfqForm.supplierName}`
                    : "Enter your product, exact material, quantity, and delivery details."}
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

            <form onSubmit={handleCreateRFQ} className="space-y-4 font-sans text-xs">
              {/* One-Sentence AI RFQ Builder */}
              <div className="p-3.5 rounded-2xl bg-[#f4faed] border border-[#d8e5ca] space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#18280e]">
                    ✨ One-Sentence AI RFQ Builder
                  </span>
                  <span className="text-[10px] font-semibold text-[#3f7308]">
                    Auto-fills specs, HS code &amp; govt certs
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={aiRfqSentence}
                    onChange={(e) => setAiRfqSentence(e.target.value)}
                    placeholder="e.g. Need 2,000 satin gold brass door handles delivered to Los Angeles for $12 each"
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#d8e5ca] text-[#18280e] outline-none"
                  />
                  <button
                    type="button"
                    disabled={aiRfqParsing}
                    onClick={() => void handleParseRfqSentence()}
                    className="px-4 py-2 rounded-xl bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] font-bold text-xs cursor-pointer transition-colors whitespace-nowrap disabled:opacity-50"
                  >
                    {aiRfqParsing ? "Building RFQ..." : "Auto-Fill RFQ →"}
                  </button>
                </div>
                {aiRfqMeta && (
                  <div className="p-2.5 rounded-xl bg-white border border-[#d8e5ca] space-y-1 text-[11px] text-[#18280e]">
                    <div>
                      <strong>HS Code:</strong> <span className="font-mono">{aiRfqMeta.hsCode}</span> ·{" "}
                      <strong>Required Govt Certs:</strong> {aiRfqMeta.requiredCertificates.join(", ")}
                    </div>
                    <p className="text-stone-600">{aiRfqMeta.aiNotes}</p>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-stone-700 font-bold block">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solid Brass Mortise Door Locksets"
                  value={rfqForm.title}
                  onChange={(e) => setRfqForm({ ...rfqForm, title: e.target.value })}
                  className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-none focus:border-[#18280e]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-700 font-bold block">Exact Material &amp; Specifications</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Forged CW617N solid brass, PVD satin gold finish..."
                  value={rfqForm.specifications}
                  onChange={(e) => setRfqForm({ ...rfqForm, specifications: e.target.value })}
                  className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-none resize-none focus:border-[#18280e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-stone-700 font-bold block">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={rfqForm.quantity}
                    onChange={(e) => setRfqForm({ ...rfqForm, quantity: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-none focus:border-[#18280e]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-700 font-bold block">Order Budget (USD)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={rfqForm.budgetUSD}
                    onChange={(e) => setRfqForm({ ...rfqForm, budgetUSD: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-none focus:border-[#18280e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-stone-700 font-bold block">Delivery Destination</label>
                  <input
                    type="text"
                    value={rfqForm.destinationPort}
                    onChange={(e) => setRfqForm({ ...rfqForm, destinationPort: e.target.value })}
                    className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-none focus:border-[#18280e]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-700 font-bold block">Delivery Date</label>
                  <input
                    type="date"
                    value={rfqForm.deliveryDate}
                    onChange={(e) => setRfqForm({ ...rfqForm, deliveryDate: e.target.value })}
                    className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 outline-none focus:border-[#18280e]"
                  />
                </div>
              </div>

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
                  Place Order →
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

            <div className="space-y-3 font-sans text-xs">
              <div className="p-3.5 rounded-2xl bg-[#f4faed] border border-[#d8e5ca] space-y-1">
                <span className="font-bold text-[#284905] block">
                  ✓ Verification: {selectedSupplier.verificationSource}
                </span>
                <p className="text-stone-500 text-[11px]">{selectedSupplier.verificationMeaning}</p>
                <div className="text-[10px] text-stone-600 pt-1">
                  IEC: <strong>{selectedSupplier.iecCode}</strong> • GSTIN: <strong>{selectedSupplier.gstin}</strong>
                </div>
              </div>

              {selectedSupplier.materials && selectedSupplier.materials.length > 0 && (
                <div>
                  <strong className="text-stone-900 block mb-1">Exact Materials Supported:</strong>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSupplier.materials.map((m, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-[#ebf7d9] text-[#284905] text-[11px] font-bold">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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

              {selectedSupplier.samplePolicy && (
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-700">
                  <strong>Sample Policy:</strong> {selectedSupplier.samplePolicy}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedSupplier(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = selectedSupplier;
                  setSelectedSupplier(null);
                  openSampleMessageThread(target);
                }}
                className="px-4 py-2 rounded-xl bg-[#ebf7d9] hover:bg-[#d8e5ca] text-[#18280e] text-xs font-bold cursor-pointer"
              >
                Ask for Sample
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = selectedSupplier;
                  setSelectedSupplier(null);
                  setRfqForm((prev) => ({
                    ...prev,
                    title: `Sourcing ${target.productsOrServices[0]}`,
                    category: target.category,
                    specifications: target.materials?.[0] || "",
                    supplierId: target.id,
                    supplierName: target.name,
                  }));
                  setIsRfqModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#18280e] text-[#b2eb76] text-xs font-bold cursor-pointer"
              >
                Place Order with This Seller →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

