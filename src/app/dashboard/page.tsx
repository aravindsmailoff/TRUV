"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Check,
  LogOut,
  Globe,
  Code2,
} from "lucide-react";
import { setCurrentSessionUser } from "@/lib/auth/authStore";
import { useSessionUser } from "@/lib/auth/useSessionUser";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { ClickSpark } from "@/components/reactbits/ClickSpark";
import { CountUp } from "@/components/reactbits/CountUp";
import { SlideToConfirm } from "@/components/kokonutui/SlideToConfirm";
import { KokonutButton } from "@/components/kokonutui/KokonutButton";
import { HoldToConfirm } from "@/components/kokonutui/HoldToConfirm";
import { ActiveDayChart } from "@/components/kokonutui/ActiveDayChart";
import { TotalProfitChart } from "@/components/kokonutui/TotalProfitChart";
import { TradeOracleStoryline } from "@/components/kokonutui/TradeOracleStoryline";
import { ForeignBuyerPortal } from "@/components/kokonutui/ForeignBuyerPortal";
import { WhatsAppNotificationCenter } from "@/components/whatsapp/WhatsAppNotificationCenter";
import { triggerAutomatedWhatsAppAlert } from "@/lib/whatsapp/clientTrigger";

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
  status: "30% Advance Pending" | "Production in Progress" | "Ready for QIMA Inspection" | "Customs Cleared Mundra" | "Delivered & Settled";
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
      terms: "Example terms: 30% advance and 70% balance. Payment requires separate buyer approval and capture.",
    },
    deliveryPort: "Port of Long Beach, California (USLGB)",
    inspectionAgency: "QIMA Quality Services (AQL 1.5)",
    status: "30% Advance Pending",
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
      terms: "Example terms: 30% advance and 70% balance, subject to buyer approval.",
    },
    deliveryPort: "Port of Felixstowe, UK (GBFXT)",
    inspectionAgency: "Intertek Testing Services",
    status: "Ready for QIMA Inspection",
    category: "Heritage Brassware",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, isHydrated } = useSessionUser();

  // Active view switcher: Main navigation + Trade Engine Side Menus
  const [activeNav, setActiveNav] = useState<
    | "dashboard"
    | "storyline"
    | "buyer_portal"
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
  >( "dashboard" );

  useEffect(() => {
    if (!isHydrated) return;
    if (!currentUser) {
      router.push("/signin?role=manufacturer");
    } else if (currentUser.role === "buyer") {
      router.push("/buyer");
    }
  }, [currentUser, isHydrated, router]);

  const [financesOpen, setFinancesOpen] = useState(true);

  // TradeOracle AI International Quality & Markings Assistant (Seller Onboarding & Export Compliance)
  const [certProduct, setCertProduct] = useState("Solid Brass Door Handles");
  const [certMaterial, setCertMaterial] = useState("CW617N Solid Brass, PVD Satin Gold");
  const [certLanguage, setCertLanguage] = useState("Gujarati");
  const [certCountries, setCertCountries] = useState<string[]>([
    "United States",
    "European Union (CE)",
    "India (BIS)",
  ]);
  const [certLoading, setCertLoading] = useState(false);
  const [certPlan, setCertPlan] = useState<{
    hsCode: string;
    nativeSummary: string;
    requiredCertificates: Array<{
      markName: string;
      country: string;
      standardCode: string;
      purpose: string;
      labPartner: string;
      estimatedDays: string;
      estimatedFeeUSD: number;
    }>;
    generatedDossier: string;
    packagingLabelSpecs: string[];
  } | null>(null);
  const [autoApplyingMark, setAutoApplyingMark] = useState<string | null>(null);
  const [autoApplyingAll, setAutoApplyingAll] = useState(false);
  const [autoApplyNotice, setAutoApplyNotice] = useState<string>("");

  // Seller Packing, Buyer Reassurance & Government Freight Cargo Engine (Step 6)
  const [cargoOrderNumber, setCargoOrderNumber] = useState("ORD-USA-9921");
  const [cargoStatus, setCargoStatus] = useState<
    "accepted" | "packing" | "packed" | "handed_to_govt_cargo" | "in_transit"
  >("packed");
  const [cargoGovtService, setCargoGovtService] = useState(
    "CONCOR (Container Corp of India - Govt. of India)"
  );
  const [cargoTrackingNo, setCargoTrackingNo] = useState("CONCOR-GOV-2026-8841");
  const [cargoBuyerNote, setCargoBuyerNote] = useState(
    "Your order is safely packed, sealed in export-grade crates, and booked with Government Freight Cargo. You can relax — your goods are insured and on the way."
  );
  const [cargoSubmitting, setCargoSubmitting] = useState(false);
  const [cargoLiveSaved, setCargoLiveSaved] = useState<{
    orderNumber: string;
    packingStatus: string;
    govtCargoService: string;
    trackingNumber: string;
    buyerReassuranceNote: string;
    updatedAt: string;
  } | null>(null);
  const [autoApplications, setAutoApplications] = useState<
    Record<
      string,
      {
        applicationRef: string;
        status: string;
        submittedAt: string;
        authorityName: string;
        portalUrl: string;
        summaryForSeller: string;
        stepsDone: string[];
        nextManufacturerSteps: string[];
      }
    >
  >({});
  const [verifyingCertMark, setVerifyingCertMark] = useState<string | null>(null);
  const [verifiedCerts, setVerifiedCerts] = useState<
    Record<
      string,
      {
        certNumber: string;
        fileName: string;
        attachedAt: string;
        verdict?: string;
        confidenceScore?: number;
        detectedIssuer?: string;
        findings?: string[];
      }
    >
  >({});
  const [certNumberInputs, setCertNumberInputs] = useState<Record<string, string>>({});
  const [dossierCopied, setDossierCopied] = useState(false);

  // Global Seller Portal Language Selector (defaults to "" = no language selected / English)
  const [portalLanguage, setPortalLanguage] = useState<string>("");
  const [portalTranslating, setPortalTranslating] = useState(false);
  const portalRootRef = useRef<HTMLDivElement>(null);
  const portalOriginalTextRef = useRef<WeakMap<Text, string>>(new WeakMap());
  const portalTranslationCacheRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const root = portalRootRef.current;
    if (!root) return;

    let cancelled = false;

    const collectTextNodes = (): Text[] => {
      const nodes: Text[] = [];
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName;
          if (
            tag === "SCRIPT" ||
            tag === "STYLE" ||
            tag === "NOSCRIPT" ||
            tag === "SELECT" ||
            tag === "OPTION" ||
            tag === "INPUT" ||
            tag === "TEXTAREA" ||
            tag === "CODE" ||
            tag === "PRE" ||
            parent.closest("[data-no-translate]")
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          const raw = node.nodeValue ?? "";
          if (!raw.trim()) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });
      let current = walker.nextNode();
      while (current) {
        nodes.push(current as Text);
        current = walker.nextNode();
      }
      return nodes;
    };

    const runTranslation = async () => {
      const textNodes = collectTextNodes();

      // Always restore original English text first so switching languages never double-translates
      for (const node of textNodes) {
        const saved = portalOriginalTextRef.current.get(node);
        if (saved !== undefined && node.nodeValue !== saved) {
          node.nodeValue = saved;
        } else if (saved === undefined && node.nodeValue !== null) {
          portalOriginalTextRef.current.set(node, node.nodeValue);
        }
      }

      if (!portalLanguage) {
        setPortalTranslating(false);
        return;
      }

      const uniqueToTranslate: string[] = [];
      const seen = new Set<string>();
      const nodeOriginals: Array<{ node: Text; orig: string; trimmed: string; leading: string; trailing: string }> = [];

      for (const node of textNodes) {
        const orig = portalOriginalTextRef.current.get(node) ?? node.nodeValue ?? "";
        const match = orig.match(/^(\s*)([\s\S]*?)(\s*)$/);
        const leading = match?.[1] ?? "";
        const trimmed = match?.[2] ?? "";
        const trailing = match?.[3] ?? "";
        if (!trimmed || !/[a-zA-Z]/.test(trimmed)) continue;

        nodeOriginals.push({ node, orig, trimmed, leading, trailing });
        const cacheKey = `${portalLanguage}::${trimmed}`;
        if (!portalTranslationCacheRef.current.has(cacheKey) && !seen.has(trimmed)) {
          seen.add(trimmed);
          uniqueToTranslate.push(trimmed);
        }
      }

      if (uniqueToTranslate.length > 0) {
        setPortalTranslating(true);
        try {
          const res = await fetch("/api/ai/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              texts: uniqueToTranslate,
              targetLanguage: portalLanguage,
              sourceLanguage: "English",
            }),
          });
          if (res.ok) {
            const data = await res.json();
            const translatedList: string[] = Array.isArray(data.translations) ? data.translations : [];
            uniqueToTranslate.forEach((src, idx) => {
              const out = translatedList[idx];
              if (out) {
                portalTranslationCacheRef.current.set(`${portalLanguage}::${src}`, out);
              }
            });
          }
        } catch {
          // Ignore network error and keep original text
        } finally {
          if (!cancelled) setPortalTranslating(false);
        }
      }

      if (cancelled) return;
      for (const item of nodeOriginals) {
        const cached = portalTranslationCacheRef.current.get(`${portalLanguage}::${item.trimmed}`);
        if (cached) {
          item.node.nodeValue = `${item.leading}${cached}${item.trailing}`;
        }
      }
    };

    const timer = window.setTimeout(() => {
      void runTranslation();
    }, 60);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [portalLanguage, activeNav, certPlan, autoApplications, autoApplyNotice, verifiedCerts]);

  // TradeOracle AI 2-Way Seller Translator (Dashboard + Buyer Requests)
  const [sellerAiInput, setSellerAiInput] = useState(
    "Buyer: Please confirm if you can ship 2,000 CW617N solid brass mortise locksets with PVD satin gold finish and ASTM B117 salt spray report."
  );
  const [sellerAiDirection, setSellerAiDirection] = useState<"toNative" | "toEnglish">("toNative");
  const [sellerAiOutput, setSellerAiOutput] = useState("");
  const [sellerAiTranslating, setSellerAiTranslating] = useState(false);
  const [rfqTranslations, setRfqTranslations] = useState<Record<string, string>>({});
  const [translatingRfqId, setTranslatingRfqId] = useState<string | null>(null);

  const handleSellerAiTranslate = async () => {
    if (!sellerAiInput.trim()) return;
    setSellerAiTranslating(true);
    try {
      const targetLang = sellerAiDirection === "toNative" ? certLanguage : "English";
      const sourceLang = sellerAiDirection === "toNative" ? "English" : certLanguage;
      const res = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: sellerAiInput,
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
        }),
      });
      const data = await res.json();
      if (data.translatedText) {
        setSellerAiOutput(data.translatedText);
      }
    } catch {
      // Ignore error
    } finally {
      setSellerAiTranslating(false);
    }
  };

  const handleTranslateRfqCard = async (ordId: string, textToTranslate: string) => {
    setTranslatingRfqId(ordId);
    try {
      const res = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToTranslate,
          sourceLanguage: "English",
          targetLanguage: certLanguage,
        }),
      });
      const data = await res.json();
      if (data.translatedText) {
        setRfqTranslations((prev) => ({ ...prev, [ordId]: data.translatedText }));
      }
    } catch {
      // Ignore error
    } finally {
      setTranslatingRfqId(null);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("truv_seller_onboarding_compliance");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.productName) setCertProduct(parsed.productName);
        if (parsed.material) setCertMaterial(parsed.material);
        if (parsed.preferredLanguage) setCertLanguage(parsed.preferredLanguage);
        if (Array.isArray(parsed.targetCountries)) setCertCountries(parsed.targetCountries);
        if (parsed.plan) setCertPlan(parsed.plan);
      } catch {
        // Ignore invalid localStorage
      }
    }
  }, []);

  const toggleCertCountry = (country: string) => {
    setCertCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  const [certError, setCertError] = useState("");
  const [quoteProduct, setQuoteProduct] = useState("Brass Mortise Locksets");
  const [quoteMaterial, setQuoteMaterial] = useState("CW617N Solid Brass");
  const [quoteQty, setQuoteQty] = useState(1000);
  const [quoteCostInr, setQuoteCostInr] = useState(1450);
  const [quoteCountry, setQuoteCountry] = useState("United States");
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteResult, setQuoteResult] = useState<{
    hsCode: string;
    recommendedUnitPriceUSD: number;
    totalDealUSD: number;
    advance30USD: number;
    balance70USD: number;
    incoterm: string;
    quoteText: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedApps = localStorage.getItem("truv_govt_applications");
    if (savedApps) {
      try {
        setAutoApplications(JSON.parse(savedApps));
      } catch {
        // Ignore invalid localStorage
      }
    }
    const savedVerified = localStorage.getItem("truv_verified_certificates");
    if (savedVerified) {
      try {
        setVerifiedCerts(JSON.parse(savedVerified));
      } catch {
        // Ignore invalid localStorage
      }
    }
  }, []);

  const getOfficialPortalInfo = (markName: string, country: string) => {
    const m = `${markName} ${country}`.toLowerCase();
    if (m.includes("bis") || m.includes("isi") || m.includes("india")) {
      return { label: "Apply on BIS Govt Portal (Manakonline)", url: "https://www.manakonline.in/" };
    }
    if (m.includes("saso") || m.includes("saber") || m.includes("saudi") || m.includes("uae")) {
      return { label: "Apply on SASO SABER Govt Portal", url: "https://saber.sa/" };
    }
    if (m.includes("usa") || m.includes("united states") || m.includes("fcc") || m.includes("cpsc") || m.includes("nist") || m.includes("astm")) {
      return { label: "Apply on U.S. Govt Standards (NIST)", url: "https://www.nist.gov/standardsgov" };
    }
    if (m.includes("ce") || m.includes("rohs") || m.includes("european")) {
      return { label: "Apply on EU Commission CE Portal", url: "https://single-market-economy.ec.europa.eu/single-market/ce-marking_en" };
    }
    if (m.includes("ukca") || m.includes("united kingdom")) {
      return { label: "Apply on UK Govt (GOV.UK UKCA)", url: "https://www.gov.uk/guidance/using-the-ukca-marking" };
    }
    if (m.includes("pse") || m.includes("jis") || m.includes("japan") || m.includes("meti")) {
      return { label: "Apply on Japan Govt (METI PSE)", url: "https://www.meti.go.jp/english/policy/economy/consumer/pse/index.html" };
    }
    return { label: "Apply on Govt of India EIC Portal", url: "https://www.eicindia.gov.in/" };
  };

  const handleAttachOfficialCertificate = async (
    markName: string,
    country: string,
    file: File
  ) => {
    setVerifyingCertMark(markName);
    const certNumberInput = (certNumberInputs[markName] || "").trim();
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("markName", markName);
      formData.append("country", country);
      formData.append("companyName", currentUser?.companyName || "Indian Export Manufacturer");
      formData.append("productName", certProduct);
      formData.append("certNumber", certNumberInput);

      const res = await fetch("/api/ai/verify-certificate", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const cert = data.certificate;
      const entry = {
        certNumber: cert?.certNumber || certNumberInput || `CERT-${Date.now().toString().slice(-6)}`,
        fileName: cert?.fileName || file.name || "Official_Certificate.pdf",
        attachedAt: new Date().toLocaleDateString(),
        verdict: cert?.verdict || "verified",
        confidenceScore: cert?.confidenceScore || 88,
        detectedIssuer: cert?.detectedIssuer || `${country} Statutory Authority`,
        findings: Array.isArray(cert?.findings) ? cert.findings : [],
      };
      setVerifiedCerts((prev) => {
        const next = { ...prev, [markName]: entry };
        if (typeof window !== "undefined") {
          localStorage.setItem("truv_verified_certificates", JSON.stringify(next));
        }
        return next;
      });
    } catch {
      // Fallback if network fails
    } finally {
      setVerifyingCertMark(null);
    }
  };

  const handleGenerateSellerQuote = async () => {
    setQuoteLoading(true);
    try {
      const res = await fetch("/api/ai/seller-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: quoteProduct,
          material: quoteMaterial,
          quantity: quoteQty,
          unitCostINR: quoteCostInr,
          targetCountry: quoteCountry,
        }),
      });
      const data = await res.json();
      if (data.recommendedUnitPriceUSD) {
        setQuoteResult(data);
      }
    } catch {
      // Ignore error
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleGenerateCompliancePlan = async () => {
    setCertLoading(true);
    setCertError("");
    try {
      const res = await fetch("/api/ai/compliance-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: currentUser?.companyName || "Indian Export Manufacturer",
          productName: certProduct,
          material: certMaterial,
          targetCountries:
            certCountries.length > 0 ? certCountries : ["United States", "European Union (CE)"],
          preferredLanguage: "English",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.requiredCertificates) {
        setCertError(data.error || "Could not generate export certificates right now.");
      } else {
        setCertPlan(data);
      }
    } catch {
      setCertError("Network error while generating export certificates.");
    } finally {
      setCertLoading(false);
    }
  };

  const downloadGovtPacket = (
    certs: Array<{ markName: string; country: string; standardCode: string; labPartner: string }>,
    filePrefix: string
  ) => {
    if (typeof window === "undefined" || certs.length === 0) return;
    const company = currentUser?.companyName || "Indian Export Manufacturer";
    const rows = certs
      .map((c) => {
        const portal = getOfficialPortalInfo(c.markName, c.country);
        return `<tr>
          <td style="padding:8px;border:1px solid #d8e5ca;"><strong>${c.markName}</strong><br/><small>${c.country}</small></td>
          <td style="padding:8px;border:1px solid #d8e5ca;">${c.standardCode}</td>
          <td style="padding:8px;border:1px solid #d8e5ca;">${c.labPartner}</td>
          <td style="padding:8px;border:1px solid #d8e5ca;"><a href="${portal.url}">${portal.url}</a></td>
        </tr>`;
      })
      .join("");

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Official Govt Export Certification Packet - ${company}</title></head>
<body style="font-family:Arial,sans-serif;max-width:820px;margin:32px auto;color:#18280e;line-height:1.5;">
  <div style="border-bottom:3px solid #18280e;padding-bottom:12px;margin-bottom:20px;">
    <h1 style="margin:0;font-size:20px;">OFFICIAL EXPORT DECLARATION OF CONFORMITY &amp; GOVT FILING PACKET</h1>
    <p style="margin:4px 0 0;font-size:12px;color:#3f7308;">Prepared by TradeOracle AI · Ready for Official Government Portal Upload</p>
  </div>
  <p><strong>Manufacturer:</strong> ${company}<br/>
  <strong>Product:</strong> ${certProduct}<br/>
  <strong>Material &amp; Finish:</strong> ${certMaterial}<br/>
  <strong>HS Code:</strong> ${certPlan?.hsCode || "8301.40"}<br/>
  <strong>Generated On:</strong> ${new Date().toLocaleString()}</p>
  <h2 style="font-size:15px;margin-top:20px;">Target Government Authorities &amp; Statutory Standards</h2>
  <table style="width:100%;border-collapse:collapse;font-size:13px;">
    <thead>
      <tr style="background:#f4faed;text-align:left;">
        <th style="padding:8px;border:1px solid #d8e5ca;">Certificate / Market</th>
        <th style="padding:8px;border:1px solid #d8e5ca;">Statutory Standard</th>
        <th style="padding:8px;border:1px solid #d8e5ca;">Government Authority</th>
        <th style="padding:8px;border:1px solid #d8e5ca;">Official Govt Portal</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <h2 style="font-size:15px;margin-top:20px;">Technical File &amp; Declaration of Conformity</h2>
  <pre style="white-space:pre-wrap;background:#f4faed;padding:12px;border:1px solid #d8e5ca;font-size:12px;">${certPlan?.generatedDossier || ""}</pre>
  <p style="margin-top:24px;font-size:12px;color:#555;">Authorized Signatory: ___________________________ &nbsp;&nbsp; Company Stamp / Date: ___________________</p>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filePrefix.replace(/[^a-zA-Z0-9_-]+/g, "_")}_Govt_Filing_Packet.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAutoApplyCertificate = async (
    cert: {
      markName: string;
      country: string;
      standardCode: string;
      labPartner: string;
    },
    skipWindowOpen = false
  ) => {
    setAutoApplyingMark(cert.markName);
    const portal = getOfficialPortalInfo(cert.markName, cert.country);

    if (!skipWindowOpen && typeof window !== "undefined") {
      downloadGovtPacket([cert], `${certProduct}_${cert.markName}`);
      const clipboardSummary = `Company: ${currentUser?.companyName || "Indian Export Manufacturer"} | Product: ${certProduct} (${certMaterial}) | HS Code: ${certPlan?.hsCode || "8301.40"} | Standard: ${cert.standardCode}`;
      navigator.clipboard?.writeText(clipboardSummary).catch(() => {});
      const opened = window.open(portal.url, "_blank", "noopener,noreferrer");
      setAutoApplyNotice(
        opened
          ? `Downloaded your filled Govt Filing Packet, copied your product/HS specs to clipboard, and opened ${portal.label} in a new tab.`
          : `Downloaded your filled Govt Filing Packet & copied specs to clipboard. Allow pop-ups or click "${portal.label} ↗" below to open the government portal.`
      );
    }

    try {
      const res = await fetch("/api/ai/apply-certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: currentUser?.companyName || "Indian Export Manufacturer",
          productName: certProduct,
          material: certMaterial,
          hsCode: certPlan?.hsCode || "8301.40",
          markName: cert.markName,
          country: cert.country,
          standardCode: cert.standardCode,
          authorityName: cert.labPartner,
          portalUrl: portal.url,
        }),
      });
      const data = await res.json();
      if (res.ok && data.applicationRef) {
        setAutoApplications((prev) => {
          const next = { ...prev, [cert.markName]: data };
          if (typeof window !== "undefined") {
            localStorage.setItem("truv_govt_applications", JSON.stringify(next));
          }
          return next;
        });
      }
    } catch {
      // Ignore network error
    } finally {
      setAutoApplyingMark(null);
    }
  };

  const handleAutoApplyAllCertificates = async () => {
    if (!certPlan || certPlan.requiredCertificates.length === 0) return;
    setAutoApplyingAll(true);

    // Synchronously download the combined govt filing packet & open portal tabs before any await
    const allCerts = certPlan.requiredCertificates;
    downloadGovtPacket(allCerts, `${certProduct}_All_Govt_Certificates`);
    const clipboardSummary = `Company: ${currentUser?.companyName || "Indian Export Manufacturer"} | Product: ${certProduct} (${certMaterial}) | HS Code: ${certPlan.hsCode}`;
    navigator.clipboard?.writeText(clipboardSummary).catch(() => {});

    let openedCount = 0;
    const uniquePortalUrls = Array.from(
      new Set(allCerts.map((c) => getOfficialPortalInfo(c.markName, c.country).url))
    );
    for (const url of uniquePortalUrls) {
      const w = window.open(url, "_blank", "noopener,noreferrer");
      if (w) openedCount += 1;
    }

    setAutoApplyNotice(
      openedCount > 0
        ? `Downloaded your complete Govt Filing Packet (.html), copied factory/HS details to clipboard, and opened ${openedCount} official government portal tab(s). Sign in with your IEC/DSC on each portal, upload the downloaded packet, and attach your issued PDF below.`
        : `Downloaded your complete Govt Filing Packet (.html) & copied factory/HS details to clipboard. Your browser blocked automatic tabs — click any "Apply on Govt Portal ↗" button below to open it directly.`
    );

    try {
      await Promise.all(
        allCerts.map((cert) => handleAutoApplyCertificate(cert, true))
      );
    } finally {
      setAutoApplyingAll(false);
    }
  };

  const handleSellerDispatchUpdate = async () => {
    setCargoSubmitting(true);
    try {
      const res = await fetch("/api/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "seller_update_packing_cargo",
          orderNumber: cargoOrderNumber,
          packingStatus: cargoStatus,
          govtCargoService: cargoGovtService,
          trackingNumber: cargoTrackingNo,
          buyerReassuranceNote: cargoBuyerNote,
        }),
      });
      const data = await res.json();
      if (res.ok && data.trade?.sellerDispatchUpdate) {
        setCargoLiveSaved({
          orderNumber: cargoOrderNumber,
          ...data.trade.sellerDispatchUpdate,
        });
      }
    } catch {
      // Ignore network error
    } finally {
      setCargoSubmitting(false);
    }
  };

  const handleDownloadDossier = () => {
    if (!certPlan) return;
    const blob = new Blob([certPlan.generatedDossier], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${certProduct.replace(/\s+/g, "_")}_Compliance_Dossier.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handlePrintCartonLabel = () => {
    if (!certPlan || typeof window === "undefined") return;
    const w = window.open("", "_blank", "width=520,height=420");
    if (!w) return;
    w.document.write(
      `<html><head><title>Export Carton Label</title><style>body{font-family:system-ui,sans-serif;padding:24px;} .box{border:2px dashed #18280e;padding:20px;border-radius:12px;} h2{margin:0 0 12px;color:#18280e;font-size:18px;} p{margin:6px 0;font-size:14px;}</style></head><body><div class="box"><h2>EXPORT CARTON LABEL</h2>${certPlan.packagingLabelSpecs
        .map((l) => `<p><strong>${l}</strong></p>`)
        .join("")}<hr/><p>Exporter: ${
        currentUser?.companyName || "Verified Indian Manufacturer"
      } | HS Code: ${certPlan.hsCode}</p></div><script>window.print();</script></body></html>`
    );
    w.document.close();
  };
  const [tradeRailsOpen, setTradeRailsOpen] = useState(true);
  const [selectedLaymanOrder, setSelectedLaymanOrder] = useState<LaymanTradeOrder>(LAYMAN_ORDERS[0]);
  const [lockedOrderIds, setLockedOrderIds] = useState<Record<string, boolean>>({});

  // PayPal Live Sandbox Execution State inside the dashboard
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [paypalError, setPaypalError] = useState("");
  const [paypalResult, setPaypalResult] = useState<{
    id?: string;
    status?: string;
    approveUrl?: string;
    amount?: string;
  } | null>(null);

  const triggerPayPalEscrow = async () => {
    setPaypalLoading(true);
    setPaypalError("");
    setPaypalResult(null);
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
        const approveLink = data.paymentOrder.links?.find((l: { rel: string; href: string }) => l.rel === "approve")?.href;
        setPaypalResult({
          id: data.paymentOrder.id,
          status: data.paymentOrder.status,
          approveUrl: approveLink,
          amount: "Advance payment — awaiting buyer approval",
        });
      } else {
        setPaypalError(data.details || data.error || "Unable to create the PayPal order.");
      }
    } catch {
      setPaypalError("Unable to reach the payment service.");
    } finally {
      setPaypalLoading(false);
    }
  };

  return (
    <div
      ref={portalRootRef}
      className="min-h-screen bg-[#f4faed] text-[#18280e] font-sans selection:bg-[#b2eb76] selection:text-[#18280e] flex relative"
    >
      {/* React Bits ClickSpark Particle Glow Canvas */}
      <ClickSpark sparkColor="#b2eb76" sparkCount={9} sparkRadius={26} duration={400} />

      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR (Original Clean Spade Theme + Polished Menu System)      */}
      {/* ========================================================================= */}
      <aside
        data-lenis-prevent
        className="w-72 bg-white border-r border-stone-200/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 shadow-xs overflow-y-auto overscroll-contain scrollbar-none"
      >
        <div className="flex flex-col">
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
                <span className="text-[10px] font-sans text-stone-500 font-semibold mt-1">
                  Factory Export Desk
                </span>
              </div>
            </Link>
            <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-[#ebf7d9] text-[#284905] font-bold border border-[#d8e5ca]/70">
              PAYPAL
            </span>
          </div>

          {/* Manufacturer Identity Banner */}
          <div className="px-5 py-3 border-b border-stone-100 bg-[#fbfdf9] font-sans">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[#3f7308] animate-pulse" />
              <span className="text-xs font-bold text-[#18280e]">
                My Factory Account
              </span>
            </div>
            <span className="text-[11px] text-stone-500 block mt-0.5 truncate">
              Moradabad Precision Foundry LLP
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="p-3.5 space-y-4 text-xs font-medium font-sans">
            {/* Group 1: Main Platform */}
            <div className="space-y-1">
              <span className="text-[10px] font-sans uppercase tracking-wider text-stone-400 font-bold px-3 py-1 block">
                Main Menu
              </span>

              {/* 1. Dashboard */}
              <button
                type="button"
                onClick={() => setActiveNav("dashboard")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeNav === "dashboard"
                    ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                    : "text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span className="text-xs">Dashboard</span>
                </div>
                {activeNav === "dashboard" && <span className="w-1.5 h-1.5 rounded-full bg-[#b2eb76] shrink-0" />}
              </button>

              {/* AI Quality Certificates & Export Markings (Top-Level) */}
              <button
                type="button"
                onClick={() => setActiveNav("quality_qima")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeNav === "quality_qima"
                    ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                    : "text-stone-700 bg-[#f4faed] hover:bg-[#ebf7d9] hover:text-[#18280e]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-[#3f7308]" />
                  <span className="text-xs font-bold">Export Certificates</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#18280e] text-[#b2eb76] font-bold">
                  AI
                </span>
              </button>

              {/* 2. Simple Order Cards View */}
              <button
                type="button"
                onClick={() => setActiveNav("layman_store")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeNav === "layman_store"
                    ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                    : "text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Store className={`w-4 h-4 shrink-0 ${activeNav === "layman_store" ? "text-[#b2eb76]" : "text-[#3f7308]"}`} />
                  <span className="text-xs">Simple Order Cards</span>
                </div>
                <span
                  className={`text-[10px] font-sans px-2 py-0.5 rounded-full font-bold shrink-0 ${
                    activeNav === "layman_store"
                      ? "bg-[#b2eb76]/20 text-[#b2eb76] border border-[#b2eb76]/30"
                      : "bg-[#ebf7d9] text-[#284905] border border-[#d8e5ca]/80"
                  }`}
                >
                  3 New
                </span>
              </button>

              {/* 3. How Deals Work */}
              <button
                type="button"
                onClick={() => setActiveNav("storyline")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeNav === "storyline"
                    ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                    : "text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Layers className={`w-4 h-4 shrink-0 ${activeNav === "storyline" ? "text-[#b2eb76]" : "text-[#3f7308]"}`} />
                  <span className="text-xs">How Deals Work</span>
                </div>
                <span
                  className={`text-[10px] font-sans px-2 py-0.5 rounded-full font-bold shrink-0 ${
                    activeNav === "storyline"
                      ? "bg-[#b2eb76]/20 text-[#b2eb76] border border-[#b2eb76]/30"
                      : "bg-[#ebf7d9] text-[#284905] border border-[#d8e5ca]/80"
                  }`}
                >
                  Guide
                </span>
              </button>

              {/* 4. All Orders */}
              <button
                type="button"
                onClick={() => setActiveNav("orders")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeNav === "orders"
                    ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                    : "text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span className="text-xs">All Orders</span>
                </div>
                <span
                  className={`text-[10px] font-sans px-2 py-0.5 rounded-full font-bold shrink-0 ${
                    activeNav === "orders"
                      ? "bg-[#b2eb76]/20 text-[#b2eb76] border border-[#b2eb76]/30"
                      : "bg-[#ebf7d9] text-[#284905] border border-[#d8e5ca]/80"
                  }`}
                >
                  46
                </span>
              </button>

              {/* 5. My Products */}
              <button
                type="button"
                onClick={() => setActiveNav("products")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeNav === "products"
                    ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                    : "text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
                }`}
              >
                <Package className="w-4 h-4 shrink-0" />
                <span className="text-xs">My Products</span>
              </button>

              {/* 6. My Foreign Buyers */}
              <button
                type="button"
                onClick={() => setActiveNav("customers")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeNav === "customers"
                    ? "bg-[#18280e] text-[#b2eb76] font-semibold shadow-xs"
                    : "text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span className="text-xs">My Foreign Buyers</span>
              </button>
            </div>

            {/* Group 2: Core Export Workflow (Clean & Essential) */}
            <div className="pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setTradeRailsOpen(!tradeRailsOpen)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-sans uppercase tracking-wider text-stone-400 font-bold hover:text-[#18280e] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3f7308]" />
                  <span>Export Workflow</span>
                </div>
                {tradeRailsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>

              {tradeRailsOpen && (
                <div className="mt-1 space-y-0.5 border-l-2 border-[#d8e5ca]/60 ml-4 pl-2">
                  <button
                    type="button"
                    onClick={() => setActiveNav("rfq_demand")}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer gap-2 ${
                      activeNav === "rfq_demand"
                        ? "bg-[#18280e] text-[#b2eb76] font-semibold"
                        : "text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
                    }`}
                  >
                    <span className="text-xs">Buyer Requests</span>
                    <span
                      className={`text-[10px] font-sans px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                        activeNav === "rfq_demand"
                          ? "bg-[#b2eb76]/20 text-[#b2eb76]"
                          : "bg-[#ebf7d9] text-[#284905]"
                      }`}
                    >
                      3 New
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveNav("quality_qima")}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer gap-2 ${
                      activeNav === "quality_qima"
                        ? "bg-[#18280e] text-[#b2eb76] font-semibold"
                        : "text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
                    }`}
                  >
                    <span className="text-xs">Govt Certificates</span>
                    <span
                      className={`text-[10px] font-sans px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                        activeNav === "quality_qima"
                          ? "bg-[#b2eb76]/20 text-[#b2eb76]"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      AI
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveNav("customs_bl")}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer gap-2 ${
                      activeNav === "customs_bl"
                        ? "bg-[#18280e] text-[#b2eb76] font-semibold"
                        : "text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
                    }`}
                  >
                    <span className="text-xs">Packed &amp; Govt Cargo</span>
                    <span
                      className={`text-[10px] font-sans px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                        activeNav === "customs_bl"
                          ? "bg-[#b2eb76]/20 text-[#b2eb76]"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      Live
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveNav("transactions")}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer gap-2 ${
                      activeNav === "transactions"
                        ? "bg-[#18280e] text-[#b2eb76] font-semibold"
                        : "text-stone-600 hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
                    }`}
                  >
                    <span className="text-xs">Bank Deposits</span>
                  </button>
                </div>
              )}
            </div>

            {/* WhatsApp Integration in Sidebar */}
            <div className="pt-2 border-t border-stone-100">
              <WhatsAppNotificationCenter
                role="manufacturer"
                recipientName="Moradabad Precision Foundry"
                compact={false}
              />
            </div>
          </nav>
        </div>

        {/* Bottom Section: Settings & Active Rails Card */}
        <div className="p-3.5 space-y-3 border-t border-stone-100">
          <div className="space-y-1 text-xs font-medium text-stone-600">
            <button
              type="button"
              onClick={() => setActiveNav("settings")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === "settings"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold"
                  : "hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Settings</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveNav("help")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeNav === "help"
                  ? "bg-[#18280e] text-[#b2eb76] font-semibold"
                  : "hover:bg-[#ebf7d9]/60 hover:text-[#18280e]"
              }`}
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>Help &amp; Support</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentSessionUser(null);
                router.push("/signin");
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer text-rose-700 hover:bg-rose-50 font-semibold"
            >
              <LogOut className="w-4 h-4 shrink-0 text-rose-600" />
              <span>Sign Out</span>
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
              <h4 className="text-xs font-bold font-sans text-white">PayPal Payments</h4>
              <p className="text-[11px] text-stone-300 leading-tight mt-0.5 font-sans">
                Ready to collect advance money
              </p>
            </div>
            <button
              type="button"
              onClick={triggerPayPalEscrow}
              disabled={paypalLoading}
              className="w-full py-1.5 bg-[#b2eb76] hover:bg-[#c2f38d] text-[#18280e] font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              {paypalLoading ? "Opening PayPal..." : "Create PayPal order"}
            </button>
          </SpotlightCard>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA (Original Clean Spade Palette)                      */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-stone-200/80 px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
            <h1 className="text-lg lg:text-xl font-bold text-[#18280e] tracking-tight font-sans whitespace-nowrap shrink-0">
              {activeNav === "dashboard" && "Dashboard"}
              {activeNav === "storyline" && "How Deals Work"}
              {activeNav === "buyer_portal" && "Buyer Sourcing Portal"}
              {activeNav === "layman_store" && "Simple Foreign Orders"}
              {activeNav === "orders" && "All Orders"}
              {activeNav === "products" && "My Products"}
              {activeNav === "customers" && "My Foreign Buyers"}
              {activeNav === "invoices" && "Bills & Invoices"}
              {activeNav === "transactions" && "Bank Deposits"}
              {activeNav === "reports" && "Tax Receipts"}
              {activeNav === "rfq_demand" && "1. Buyer Requests"}
              {activeNav === "msme_vetting" && "2. Factory Verified"}
              {activeNav === "commercial_ai" && "3. Price Agreed"}
              {activeNav === "paypal_escrow" && "4. Advance Money"}
              {activeNav === "quality_qima" && "5. Quality Check"}
              {activeNav === "customs_bl" && "6. Shipped & Paid"}
              {activeNav === "settings" && "Settings"}
              {activeNav === "help" && "Help & Support"}
            </h1>
            <span className="text-xs font-sans text-stone-400 hidden 2xl:inline whitespace-nowrap">
              • Factory Export Workspace
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Global Seller Portal Language Selector (defaults to no language selected) */}
            <div
              data-no-translate
              className="flex items-center gap-1.5 h-9 bg-[#f4faed] border border-[#d8e5ca] px-2.5 rounded-lg text-xs font-sans text-[#18280e] shrink-0"
              title="Translate entire Seller Portal into your preferred language"
            >
              <Globe className="w-3.5 h-3.5 text-[#3f7308] shrink-0" />
              <select
                aria-label="Seller Portal Language"
                value={portalLanguage}
                onChange={(e) => setPortalLanguage(e.target.value)}
                className="bg-transparent text-xs font-sans font-medium text-[#18280e] focus:outline-none cursor-pointer pr-1"
              >
                <option value="">Language (English)</option>
                <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                <option value="Hindi">Hindi (हिन्दी)</option>
                <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
                <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                <option value="Marathi">Marathi (मराठी)</option>
                <option value="Bengali">Bengali (বাংলা)</option>
                <option value="Telugu">Telugu (తెలుగు)</option>
                <option value="Malayalam">Malayalam (മലയാളം)</option>
              </select>
              {portalTranslating && (
                <span className="text-[10px] font-medium text-[#3f7308] animate-pulse">
                  Translating...
                </span>
              )}
            </div>

            {/* Date Range Selector */}
            <div className="hidden 2xl:flex items-center gap-2 h-9 bg-[#f4faed] border border-[#d8e5ca] px-3.5 rounded-lg text-xs font-sans font-medium text-[#18280e] whitespace-nowrap shrink-0">
              <Calendar className="w-3.5 h-3.5 text-[#3f7308] shrink-0" />
              <span>Jan 1 – Feb 1, 2026</span>
              <span className="text-[#d8e5ca]">|</span>
              <span className="font-semibold">30d ∨</span>
            </div>

            {/* Add Widget Button */}
            <button
              type="button"
              className="hidden 2xl:flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-stone-200 bg-white hover:bg-[#f4faed] text-xs font-sans font-medium text-[#18280e] transition-colors shadow-2xs cursor-pointer whitespace-nowrap shrink-0"
              onClick={() => alert("Customize Dashboard Widgets: Added payment monitor")}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span>Add widget</span>
            </button>

            {/* WhatsApp Automation Center */}
            <WhatsAppNotificationCenter role="manufacturer" compact={true} />

            {/* Export Button */}
            <button
              type="button"
              className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#18280e] hover:bg-[#284905] text-[#b2eb76] text-xs font-sans font-semibold transition-colors shadow-2xs cursor-pointer whitespace-nowrap shrink-0"
              onClick={() => alert("Exporting verified commercial trade ledger CSV...")}
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span>Export</span>
            </button>

            {/* Sign Out */}
            <div className="flex items-center gap-2 pl-2.5 border-l border-stone-200 shrink-0">
              {currentUser && (
                <span className="text-xs font-sans text-stone-500 hidden 2xl:inline px-1 whitespace-nowrap">
                  {currentUser.email}
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  setCurrentSessionUser(null);
                  router.push("/signin");
                }}
                className="h-9 text-xs font-sans font-medium text-stone-700 hover:text-rose-700 bg-white hover:bg-rose-50 border border-stone-200 hover:border-rose-200 px-3 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs whitespace-nowrap shrink-0"
                title="Sign out of TradeOracle session"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Main Grid Body */}
        <main className="p-6 md:p-8 space-y-6 max-w-[88rem] w-full mx-auto">
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">Demo workspace: sample orders and payment statuses are illustrative, not verified transactions. PayPal order creation is not payment confirmation or escrow.</div>
          {paypalError && <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-900">{paypalError}</div>}
          {/* ========================================================================= */}
          {/* VIEW 0: TRANSACTION STORYLINE (The Heart of the Project)                 */}
          {/* ========================================================================= */}
          {activeNav === "storyline" && <TradeOracleStoryline />}

          {/* ========================================================================= */}
          {/* VIEW: FOREIGN BUYER DISCOVERY & AI MATCHING PORTAL                       */}
          {/* ========================================================================= */}
          {activeNav === "buyer_portal" && (
            <ForeignBuyerPortal
              onTriggerPayPalOrder={triggerPayPalEscrow}
              paypalLoading={paypalLoading}
              paypalResult={paypalResult}
            />
          )}

          {/* ========================================================================= */}
          {/* VIEW A: MAIN ANALYTICS DASHBOARD (Exact Match to Previous Template)       */}
          {/* ========================================================================= */}
          {activeNav === "dashboard" && (
            <>
              {/* TOP 4 SELLER EXPORT KPI CARDS (Geist font-sans, Manufacturer-specific) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
                <SpotlightCard className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2 hover:-translate-y-0.5 transition-transform">
                  <div className="flex justify-between items-center text-xs font-medium text-stone-500">
                    <span>Active Foreign Orders</span>
                    <div className="p-1.5 rounded-lg bg-[#ebf7d9] text-[#18280e]">
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-bold tracking-tight text-[#18280e]">
                      {LAYMAN_ORDERS.length} Orders
                    </span>
                    <span className="text-xs font-bold text-[#3f7308]">
                      $85,750 USD
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 block">
                    USA, Germany &amp; UAE buyers
                  </span>
                </SpotlightCard>

                <SpotlightCard className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2 hover:-translate-y-0.5 transition-transform">
                  <div className="flex justify-between items-center text-xs font-medium text-stone-500">
                    <span>30% Advance in PayPal</span>
                    <div className="p-1.5 rounded-lg bg-[#ebf7d9] text-[#18280e]">
                      <CreditCard className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-bold tracking-tight text-[#18280e]">
                      $25,725
                    </span>
                    <span className="text-xs font-bold text-emerald-700">
                      ≈ ₹21.48L
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 block">
                    Held safely before shipping
                  </span>
                </SpotlightCard>

                <SpotlightCard className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2 hover:-translate-y-0.5 transition-transform">
                  <div className="flex justify-between items-center text-xs font-medium text-stone-500">
                    <span>Official Certificates</span>
                    <div className="p-1.5 rounded-lg bg-[#ebf7d9] text-[#18280e]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-bold tracking-tight text-[#18280e]">
                      {Object.keys(verifiedCerts).length} Attached
                    </span>
                    <span className="text-xs font-bold text-[#3f7308]">
                      {Object.keys(autoApplications).length} Auto-Filed
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 block">
                    BIS, CE, UL, UKCA &amp; ISO 9001
                  </span>
                </SpotlightCard>

                <SpotlightCard className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2 hover:-translate-y-0.5 transition-transform">
                  <div className="flex justify-between items-center text-xs font-medium text-stone-500">
                    <span>Factory KYB Status</span>
                    <div className="p-1.5 rounded-lg bg-[#ebf7d9] text-[#18280e]">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-bold tracking-tight text-[#18280e]">
                      Verified ✓
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 block">
                    DGFT IEC &amp; GSTIN Active
                  </span>
                </SpotlightCard>
              </div>

              {/* ROW 2: TOTAL PROFIT CHART + MOST DAY ACTIVE + REPEAT RATE */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Total Profit Area Chart */}
                <SpotlightCard className="lg:col-span-2 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
                  <TotalProfitChart />
                </SpotlightCard>

                {/* Right Column: Most Day Active + Repeat Rate */}
                <div className="space-y-6">
                  {/* Most Day Active Bar Chart */}
                  <SpotlightCard className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
                    <ActiveDayChart />
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
                          <CountUp to={68} decimals={0} suffix="%" />
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
                        <span className="font-bold text-[#18280e]">PayPal Advance Helper</span>
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
                          PayPal Payments Ready
                        </span>
                        <span className="text-[11px] text-stone-500 font-sans">
                          Collect 30% advance before production
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-stone-100">
                      <KokonutButton
                        variant="primary"
                        size="md"
                        onClick={triggerPayPalEscrow}
                        disabled={paypalLoading}
                        className="w-full"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>
                          {paypalLoading ? "Opening PayPal..." : "Create PayPal order"}
                        </span>
                      </KokonutButton>

                      {paypalResult && (
                        <div className="p-2.5 rounded-lg bg-[#ebf7d9] text-[#18280e] text-[11px] font-sans space-y-1">
                          <div className="flex justify-between">
                            <span>Payment Ref:</span>
                            <strong className="text-[#3f7308]">{paypalResult.id}</strong>
                          </div>
                          {paypalResult.approveUrl && (
                            <a
                              href={paypalResult.approveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#3f7308] underline block text-center font-bold"
                            >
                              Open PayPal Payment Window →
                            </a>
                          )}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => setActiveNav("storyline")}
                        className="w-full py-2 text-stone-600 hover:text-[#18280e] text-xs font-sans font-medium text-center block cursor-pointer"
                      >
                        See How One Deal Works →
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
                    We translate complicated foreign engineering specifications and trade terms into plain, simple language so you know exactly what the foreigner wants, how much they will pay in Rupees, and the proposed payment terms.
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
                          <span>Example payment terms</span>
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
                            <span>Deal marked as reviewed</span>
                          </div>
                        ) : (
                          <SlideToConfirm
                            text="Slide to mark deal as reviewed"
                            confirmedText="Deal marked as reviewed"
                            onConfirm={() => {
                              setLockedOrderIds((prev) => ({ ...prev, [order.id]: true }));
                              setSelectedLaymanOrder(order);
                              void triggerAutomatedWhatsAppAlert({
                                role: "manufacturer",
                                eventType: "new_order",
                                orderNumber: order.orderNumber,
                                buyerName: `${order.foreignBuyer.company} (${order.foreignBuyer.city})`,
                                manufacturerName: "Moradabad Precision Foundry LLP",
                                productName: order.productName,
                                quantity: order.quantityUnits,
                                amountUSD: order.totalDealUSD,
                              });
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
                    <WhatsAppNotificationCenter
                      role="manufacturer"
                      orderNumber={selectedLaymanOrder.orderNumber}
                      recipientName={selectedLaymanOrder.foreignBuyer.company}
                      compact={true}
                    />
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
                    <span className="text-stone-600 block text-[10px] uppercase font-bold">30% Advance Payment</span>
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
                    onConfirm={() => {
                      void triggerAutomatedWhatsAppAlert({
                        role: "manufacturer",
                        eventType: "quality_inspection_passed",
                        orderNumber: selectedLaymanOrder.orderNumber,
                        buyerName: selectedLaymanOrder.foreignBuyer.company,
                        manufacturerName: "Moradabad Precision Foundry LLP",
                        productName: selectedLaymanOrder.productName,
                        quantity: selectedLaymanOrder.quantityUnits,
                        amountUSD: selectedLaymanOrder.totalDealUSD,
                      });
                    }}
                    label="Hold to Verify Statutory Evidence Pack"
                    confirmedLabel="✓ Evidence Pack Audited & WhatsApp Sent"
                  />
                </div>
              </SpotlightCard>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PLAIN-ENGLISH STEP & MENU VIEWS (For Non-Technical Factory Users)        */}
          {/* ========================================================================= */}

          {/* 1. Buyer Requests */}
          {activeNav === "rfq_demand" && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-5 font-sans animate-in fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-stone-100">
                <div>
                  <h2 className="text-lg font-bold text-[#18280e]">1. New Foreign Buyer Requests (3 Ready)</h2>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Verified overseas companies asking to buy from your factory — explained simply with Indian Rupee values.
                  </p>
                </div>
                <KokonutButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveNav("layman_store")}
                >
                  Open Simple Order Cards →
                </KokonutButton>
              </div>

              <div className="space-y-3">
                {LAYMAN_ORDERS.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl bg-[#fbfdf9] border border-stone-200 space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{ord.foreignBuyer.flag}</span>
                          <strong className="text-[#18280e] text-sm">{ord.productName}</strong>
                          <span className="text-xs text-stone-400">({ord.orderNumber})</span>
                        </div>
                        <p className="text-stone-600 text-xs mt-1">
                          Buyer: <strong>{ord.foreignBuyer.company}</strong> ({ord.foreignBuyer.city}) • Quantity:{" "}
                          <strong>{ord.quantityUnits.toLocaleString()} pieces</strong>
                        </p>
                      </div>
                      <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end gap-2">
                        <div>
                          <span className="font-bold text-sm text-[#18280e] block">${ord.totalDealUSD.toLocaleString()} USD</span>
                          <span className="text-xs text-[#3f7308] font-bold">≈ ₹{ord.approxInrLakhs} Lakhs</span>
                        </div>
                        <button
                          type="button"
                          disabled={translatingRfqId === ord.id}
                          onClick={() =>
                            void handleTranslateRfqCard(
                              ord.id,
                              `Order ${ord.orderNumber}: ${ord.productName}, Quantity ${ord.quantityUnits} pieces for ${ord.foreignBuyer.company} (${ord.foreignBuyer.city}). Total $${ord.totalDealUSD} USD.`
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-[#ebf7d9] hover:bg-[#d8e5ca] text-[#284905] text-[11px] font-bold cursor-pointer transition-colors"
                        >
                          {translatingRfqId === ord.id
                            ? "Translating..."
                            : `Translate to ${certLanguage}`}
                        </button>
                      </div>
                    </div>
                    {rfqTranslations[ord.id] && (
                      <div className="p-3 rounded-xl bg-[#f4faed] border border-[#d8e5ca] text-xs text-[#18280e]">
                        <span className="text-[10px] font-mono text-[#3f7308] font-bold block mb-0.5">
                          TradeOracle AI ({certLanguage}):
                        </span>
                        {rfqTranslations[ord.id]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Factory Verified */}
          {activeNav === "msme_vetting" && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-5 font-sans animate-in fade-in">
              <div className="pb-4 border-b border-stone-100">
                <h2 className="text-lg font-bold text-[#18280e]">
                  2. Your Factory Is Checked &amp; Trusted
                </h2>
                <p className="text-xs text-stone-600 mt-0.5">
                  Foreign buyers want to know your factory is real before sending advance money. Your checks are already complete.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#f4faed] border border-[#d8e5ca] space-y-2">
                  <span className="text-xs text-[#3f7308] font-bold">Government Export License</span>
                  <h4 className="font-bold text-base text-[#18280e]">Moradabad Brass Factory</h4>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    Your factory registration, tax details, and bank account match officially.
                  </p>
                  <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block">
                    Verified ✓
                  </span>
                </div>
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <span className="text-xs text-[#3f7308] font-bold">Workshop Capacity</span>
                  <h4 className="font-bold text-base text-[#18280e]">Rajkot Parts Hub</h4>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    Monthly production limit checked at 85,000 pieces so buyers know you can deliver on time.
                  </p>
                  <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block">
                    Active ✓
                  </span>
                </div>
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <span className="text-xs text-[#3f7308] font-bold">PayPal Payout Check</span>
                  <h4 className="font-bold text-base text-[#18280e]">Indian Bank Linked</h4>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    Dollar payments from overseas convert cleanly and go straight to your Indian bank account.
                  </p>
                  <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block">
                    Ready ✓
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3. Price Agreed */}
          {activeNav === "commercial_ai" && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-5 font-sans animate-in fade-in">
              <div className="pb-4 border-b border-stone-100">
                <h2 className="text-lg font-bold text-[#18280e]">
                  3. Order Checklist Agreed Before You Start
                </h2>
                <p className="text-xs text-stone-600 mt-0.5">
                  We put both sides&apos; agreement in simple words so there is never any confusion later about size, finish, or price.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#f8fbf5] border border-[#d8e5ca] space-y-1.5">
                  <span className="text-xs font-bold text-[#3f7308]">1. Exact Count &amp; Finish</span>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    1,500 solid brass door handles with brushed gold polish and rust-proof coating agreed.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#f8fbf5] border border-[#d8e5ca] space-y-1.5">
                  <span className="text-xs font-bold text-[#3f7308]">2. Total Money Locked</span>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    $85,750 total (about ₹71.6 Lakhs). 30% comes upfront; 70% comes after ship loading.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#f8fbf5] border border-[#d8e5ca] space-y-1.5">
                  <span className="text-xs font-bold text-[#3f7308]">3. Delivery Port Fixed</span>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    Goods delivered safely to Gujarat port (Mundra) packed in export wooden boxes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4. Advance Money in PayPal */}
          {activeNav === "paypal_escrow" && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-5 font-sans animate-in fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-stone-100">
                <div>
                  <h2 className="text-lg font-bold text-[#18280e]">4. 30% Advance Money in PayPal</h2>
                  <p className="text-xs text-stone-600 mt-0.5">
                    You never have to start making goods on trust alone — the buyer deposits 30% advance first.
                  </p>
                </div>
                <KokonutButton
                  variant="primary"
                  size="sm"
                  onClick={triggerPayPalEscrow}
                  disabled={paypalLoading}
                >
                  {paypalLoading ? "Opening PayPal..." : "Create PayPal order"}
                </KokonutButton>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#f4faed] border border-[#d8e5ca] space-y-1.5">
                  <span className="text-xs font-bold text-[#3f7308]">30% Advance Before Work Starts</span>
                  <div className="text-2xl font-extrabold text-[#18280e]">$25,725 USD (≈ ₹21.48 Lakhs)</div>
                  <p className="text-xs text-stone-600">
                    Use this advance money confidently to buy brass raw material and pay factory workers.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                  <span className="text-xs font-bold text-stone-500">70% Remaining Balance</span>
                  <div className="text-2xl font-extrabold text-[#18280e]">$60,025 USD (≈ ₹50.12 Lakhs)</div>
                  <p className="text-xs text-stone-600">
                    Automatically released to your linked bank account once goods pass quality check and board the ship.
                  </p>
                </div>
              </div>

              {paypalResult && (
                <div className="p-4 rounded-2xl bg-[#ebf7d9] border border-[#d8e5ca] space-y-2">
                  <span className="font-bold text-[#18280e] block text-sm">PayPal order created — awaiting approval</span>
                  <div className="flex justify-between text-xs">
                    <span>Reference Number: <strong>{paypalResult.id}</strong></span>
                    <span>Status: <strong>{paypalResult.status}</strong></span>
                  </div>
                  {paypalResult.approveUrl && (
                    <a
                      href={paypalResult.approveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-[#18280e] text-[#b2eb76] rounded-xl font-bold text-xs mt-2"
                    >
                      Open PayPal Payment Window →
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 5. Factory Quality Check & International Export Markings */}
          {activeNav === "quality_qima" && (
            <div className="space-y-6 font-sans animate-in fade-in">
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-5">
                <div className="pb-4 border-b border-stone-100">
                  <h2 className="text-lg font-bold text-[#18280e]">
                    5. Factory Quality Check &amp; International Certificates
                  </h2>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Get required country markings (BIS, CE, UKCA, ASTM, SASO, ISO 9001) with auto-generated English paperwork and one-click lab booking.
                  </p>
                </div>

                {/* TradeOracle AI Certification & Country Markings Builder */}
                <div className="p-5 rounded-2xl bg-[#f4faed] border border-[#d8e5ca] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#18280e] text-[#b2eb76] font-bold">
                        TradeOracle AI
                      </span>
                      <h3 className="font-bold text-base text-[#18280e] mt-1">
                        Get International Quality Certificates for Your Products
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-stone-700 font-bold block mb-1">Product Name</label>
                      <input
                        type="text"
                        value={certProduct}
                        onChange={(e) => setCertProduct(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#d8e5ca] text-[#18280e] outline-none focus:border-[#18280e]"
                      />
                    </div>
                    <div>
                      <label className="text-stone-700 font-bold block mb-1">Material &amp; Finish</label>
                      <input
                        type="text"
                        value={certMaterial}
                        onChange={(e) => setCertMaterial(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#d8e5ca] text-[#18280e] outline-none focus:border-[#18280e]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-stone-700 font-bold block mb-1.5">
                      Select Countries You Want to Export To
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "United States",
                        "European Union (CE)",
                        "United Kingdom (UKCA)",
                        "UAE / Saudi (SASO)",
                        "Japan (PSE)",
                        "India (BIS)",
                      ].map((c) => {
                        const active = certCountries.includes(c);
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => toggleCertCountry(c)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                              active
                                ? "bg-[#18280e] text-[#b2eb76] border-[#18280e]"
                                : "bg-white text-stone-700 border-[#d8e5ca]"
                            }`}
                          >
                            {active ? "✓ " : ""}{c}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={certLoading}
                    onClick={() => void handleGenerateCompliancePlan()}
                    className="px-5 py-2.5 rounded-xl bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] font-bold text-xs cursor-pointer transition-colors disabled:opacity-50"
                  >
                    {certLoading
                      ? "Generating Required Marks & Paperwork..."
                      : "Generate Certification Plan & English Paperwork →"}
                  </button>

                  {certError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
                      {certError}
                    </div>
                  )}

                  {certPlan && (
                    <div className="pt-4 border-t border-[#d8e5ca] space-y-4">
                      {/* Summary + 1-Click Auto-Apply All */}
                      <div className="p-4 rounded-xl bg-white border border-[#d8e5ca] space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#3f7308] font-bold">
                          <span>Export Compliance Overview</span>
                          <span className="font-mono">HS Code: {certPlan.hsCode}</span>
                        </div>
                        <p className="text-xs text-[#18280e] leading-relaxed">{certPlan.nativeSummary}</p>
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100">
                          <span className="text-[11px] text-stone-600">
                            One-click automation prepares your factory GSTIN/IEC dossier, files with each government authority, and walks you through what happens next.
                          </span>
                          <button
                            type="button"
                            disabled={autoApplyingAll}
                            onClick={() => void handleAutoApplyAllCertificates()}
                            className="px-4 py-2 rounded-xl bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] font-bold text-xs cursor-pointer transition-colors disabled:opacity-50 shrink-0"
                          >
                            {autoApplyingAll
                              ? "Auto-Applying to Govt Portals..."
                              : "1-Click Auto-Apply All Govt Certificates →"}
                          </button>
                        </div>
                        {autoApplyNotice && (
                          <div className="p-3 rounded-xl bg-[#ebf7d9] border border-[#3f7308]/30 text-xs text-[#18280e] font-medium">
                            ✓ {autoApplyNotice}
                          </div>
                        )}
                      </div>

                      {/* Required Country Certificates, Automated Govt Filing & Issued Certificate Attachment */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {certPlan.requiredCertificates.map((cert, idx) => {
                          const appInfo = autoApplications[cert.markName];
                          const verifiedInfo = verifiedCerts[cert.markName];
                          const portal = getOfficialPortalInfo(cert.markName, cert.country);
                          const isApplyingThis = autoApplyingMark === cert.markName;
                          return (
                            <div
                              key={idx}
                              className="p-4 rounded-xl bg-white border border-stone-200 space-y-3 flex flex-col justify-between"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-bold text-sm text-[#18280e]">{cert.markName}</span>
                                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#ebf7d9] text-[#284905] font-bold">
                                    {cert.country}
                                  </span>
                                </div>
                                <div className="text-xs text-[#3f7308] font-semibold">
                                  {cert.standardCode} · {cert.labPartner}
                                </div>
                                <p className="text-xs text-stone-600">{cert.purpose}</p>
                                <div className="text-xs text-stone-500">
                                  Est. {cert.estimatedDays} · Govt Filing Est.: ${cert.estimatedFeeUSD} USD
                                </div>
                              </div>

                              <div className="space-y-2.5 pt-2 border-t border-stone-100">
                                <div className="flex flex-wrap gap-2">
                                  {!appInfo && (
                                    <button
                                      type="button"
                                      disabled={isApplyingThis || autoApplyingAll}
                                      onClick={() => void handleAutoApplyCertificate(cert)}
                                      className="flex-1 py-2 px-3 rounded-lg bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] font-bold text-xs cursor-pointer transition-colors disabled:opacity-50"
                                    >
                                      {isApplyingThis ? "Auto-Applying..." : "1-Click Auto-Apply →"}
                                    </button>
                                  )}
                                  <a
                                    href={portal.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 text-center py-2 px-3 rounded-lg bg-[#ebf7d9] hover:bg-[#d8e5ca] text-[#18280e] font-bold text-xs transition-colors"
                                  >
                                    {portal.label} ↗
                                  </a>
                                </div>

                                {appInfo && (
                                  <div className="p-3 rounded-xl bg-[#f4faed] border border-[#d8e5ca] space-y-2 text-xs">
                                    <div className="flex flex-wrap items-center justify-between gap-1">
                                      <span className="font-bold text-[#18280e]">
                                        ✓ Automated Govt Filing Prepared
                                      </span>
                                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#18280e] text-[#b2eb76] font-bold">
                                        {appInfo.applicationRef}
                                      </span>
                                    </div>
                                    <p className="text-stone-700 leading-relaxed">{appInfo.summaryForSeller}</p>
                                    <div>
                                      <span className="text-[11px] font-bold text-[#3f7308] block mb-1">
                                        What TradeOracle AI Automated:
                                      </span>
                                      <ul className="space-y-0.5 text-[11px] text-stone-700 list-disc pl-4">
                                        {appInfo.stepsDone.map((s, i) => (
                                          <li key={i}>{s}</li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div>
                                      <span className="text-[11px] font-bold text-[#18280e] block mb-1">
                                        What Happens Next (Your Step-by-Step Process):
                                      </span>
                                      <ol className="space-y-0.5 text-[11px] text-stone-700 list-decimal pl-4">
                                        {appInfo.nextManufacturerSteps.map((s, i) => (
                                          <li key={i}>{s}</li>
                                        ))}
                                      </ol>
                                    </div>
                                  </div>
                                )}

                                {verifiedInfo ? (
                                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                                    <div className="flex items-center justify-between gap-2 font-bold">
                                      <span>✓ AI Verified Certificate ({verifiedInfo.certNumber})</span>
                                      {verifiedInfo.confidenceScore && (
                                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-800 text-white">
                                          {verifiedInfo.confidenceScore}% Match
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-emerald-800">
                                      File: {verifiedInfo.fileName} · {verifiedInfo.detectedIssuer || "Govt Authority"} · {verifiedInfo.attachedAt}
                                    </div>
                                    {verifiedInfo.findings && verifiedInfo.findings.length > 0 && (
                                      <ul className="text-[11px] text-emerald-800 list-disc pl-4 space-y-0.5 pt-0.5">
                                        {verifiedInfo.findings.map((f, i) => (
                                          <li key={i}>{f}</li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                ) : (
                                  <div className="p-2.5 rounded-lg bg-[#fbfdf9] border border-stone-200 space-y-1.5">
                                    <span className="text-[11px] font-bold text-stone-700 block">
                                      Once issued by {cert.labPartner}, attach PDF for AI Verification:
                                    </span>
                                    <div className="flex flex-col sm:flex-row gap-1.5">
                                      <input
                                        type="text"
                                        placeholder="Official Cert / License No."
                                        value={certNumberInputs[cert.markName] || ""}
                                        onChange={(e) =>
                                          setCertNumberInputs((prev) => ({
                                            ...prev,
                                            [cert.markName]: e.target.value,
                                          }))
                                        }
                                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-xs text-[#18280e] outline-none"
                                      />
                                      <label className="px-3 py-1.5 rounded-lg bg-[#18280e] text-[#b2eb76] text-xs font-bold cursor-pointer text-center hover:bg-[#253d16]">
                                        {verifyingCertMark === cert.markName ? "AI Verifying..." : "Attach & AI Verify PDF"}
                                        <input
                                          type="file"
                                          accept=".pdf,.png,.jpg,.jpeg"
                                          className="hidden"
                                          disabled={verifyingCertMark === cert.markName}
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              void handleAttachOfficialCertificate(cert.markName, cert.country, file);
                                            }
                                          }}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Auto-Generated English Dossier & Export Label Preview */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-bold text-[#18280e]">
                              Auto-Generated English Declaration &amp; Lab Form
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard?.writeText(certPlan.generatedDossier);
                                  setDossierCopied(true);
                                  setTimeout(() => setDossierCopied(false), 2000);
                                }}
                                className="text-xs px-2.5 py-1 rounded-lg bg-[#ebf7d9] text-[#284905] font-bold cursor-pointer"
                              >
                                {dossierCopied ? "Copied ✓" : "Copy"}
                              </button>
                              <button
                                type="button"
                                onClick={handleDownloadDossier}
                                className="text-xs px-2.5 py-1 rounded-lg bg-[#18280e] text-[#b2eb76] font-bold cursor-pointer"
                              >
                                Download .txt
                              </button>
                            </div>
                          </div>
                          <pre className="text-xs font-sans text-stone-700 bg-stone-50 p-3 rounded-lg border border-stone-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                            {certPlan.generatedDossier}
                          </pre>
                        </div>

                        <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-[#18280e]">
                              Export Carton Label Preview
                            </span>
                            <button
                              type="button"
                              onClick={handlePrintCartonLabel}
                              className="text-xs px-2.5 py-1 rounded-lg bg-[#18280e] text-[#b2eb76] font-bold cursor-pointer"
                            >
                              Print Label
                            </button>
                          </div>
                          <div className="p-4 rounded-xl border-2 border-dashed border-[#18280e]/40 bg-[#fbfdf9] text-xs space-y-1.5">
                            {certPlan.packagingLabelSpecs.map((line, i) => (
                              <div key={i} className="text-[#18280e] font-semibold">
                                {line}
                              </div>
                            ))}
                            <div className="pt-2 text-xs text-stone-500 border-t border-stone-200">
                              Exporter: {currentUser?.companyName || "Verified Indian Manufacturer"} · HS {certPlan.hsCode}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 6. Shipped & Paid */}
          {activeNav === "customs_bl" && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-5 font-sans animate-in fade-in">
              <div className="pb-4 border-b border-stone-100">
                <h2 className="text-lg font-bold text-[#18280e]">
                  6. Order Packed, Safe &amp; Sent via Government Freight Cargo
                </h2>
                <p className="text-xs text-stone-600 mt-0.5">
                  Confirm that the accepted order is packed safely and booked with Government Freight Cargo so your buyer can relax and track it live.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#f4faed] border border-[#d8e5ca] space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Accepted Order</label>
                    <select
                      value={cargoOrderNumber}
                      onChange={(e) => setCargoOrderNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#d8e5ca] text-[#18280e] outline-none"
                    >
                      {LAYMAN_ORDERS.map((ord) => (
                        <option key={ord.id} value={ord.orderNumber}>
                          {ord.orderNumber} — {ord.productName} ({ord.foreignBuyer.company})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Order Packing &amp; Dispatch Status</label>
                    <select
                      value={cargoStatus}
                      onChange={(e) =>
                        setCargoStatus(
                          e.target.value as
                            | "accepted"
                            | "packing"
                            | "packed"
                            | "handed_to_govt_cargo"
                            | "in_transit"
                        )
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#d8e5ca] text-[#18280e] outline-none"
                    >
                      <option value="accepted">Order Accepted — Preparing</option>
                      <option value="packing">Packing in Factory</option>
                      <option value="packed">Order Packed &amp; Sealed Safe ✓</option>
                      <option value="handed_to_govt_cargo">Handed Over to Govt Freight Cargo ✓</option>
                      <option value="in_transit">In Transit to Buyer Port ✓</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Government Freight Cargo Service</label>
                    <select
                      value={cargoGovtService}
                      onChange={(e) => setCargoGovtService(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#d8e5ca] text-[#18280e] outline-none"
                    >
                      <option value="CONCOR (Container Corp of India - Govt. of India)">
                        CONCOR — Container Corporation of India (Govt. of India)
                      </option>
                      <option value="Shipping Corporation of India (SCI - Govt. of India)">
                        Shipping Corporation of India (SCI — Govt. of India)
                      </option>
                      <option value="India Post International Cargo (Govt. of India)">
                        India Post International Air Cargo / EMS (Govt. of India)
                      </option>
                      <option value="JNPT / Mundra Port Authority (Govt. of India)">
                        JNPT / Mundra Port Authority Cargo Desk (Govt. of India)
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Govt Cargo Waybill / Tracking No.</label>
                    <input
                      type="text"
                      value={cargoTrackingNo}
                      onChange={(e) => setCargoTrackingNo(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#d8e5ca] text-[#18280e] font-mono outline-none"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="font-bold text-stone-700 block mb-1">
                    Buyer Reassurance Message (Shown Live in Buyer Portal)
                  </label>
                  <textarea
                    rows={2}
                    value={cargoBuyerNote}
                    onChange={(e) => setCargoBuyerNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d8e5ca] text-[#18280e] outline-none"
                  />
                </div>

                <button
                  type="button"
                  disabled={cargoSubmitting}
                  onClick={() => void handleSellerDispatchUpdate()}
                  className="px-5 py-2.5 rounded-xl bg-[#18280e] hover:bg-[#253d16] text-[#b2eb76] font-bold text-xs cursor-pointer transition-colors disabled:opacity-50"
                >
                  {cargoSubmitting
                    ? "Updating Live Order Engine..."
                    : "Confirm Packed & Send Live Update to Buyer →"}
                </button>
              </div>

              {cargoLiveSaved && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-emerald-900">
                      ✓ Live Status Saved &amp; Synced to Buyer Portal ({cargoLiveSaved.orderNumber})
                    </span>
                    <span className="font-mono px-2 py-0.5 rounded bg-[#18280e] text-[#b2eb76] font-bold">
                      {cargoLiveSaved.trackingNumber}
                    </span>
                  </div>
                  <p className="text-emerald-900">
                    Carrier: <strong>{cargoLiveSaved.govtCargoService}</strong> · Status:{" "}
                    <strong className="uppercase">{cargoLiveSaved.packingStatus.replace(/_/g, " ")}</strong>
                  </p>
                  <p className="text-emerald-800">{cargoLiveSaved.buyerReassuranceNote}</p>
                </div>
              )}
            </div>
          )}

          {/* All Orders */}
          {activeNav === "orders" && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4 font-sans animate-in fade-in">
              <div className="flex flex-wrap justify-between items-center gap-3 pb-4 border-b border-stone-100">
                <div>
                  <h2 className="text-lg font-bold text-[#18280e]">All Your Foreign Orders</h2>
                  <p className="text-xs text-stone-500">Click Simple Order Cards to read full details in everyday words.</p>
                </div>
                <KokonutButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveNav("layman_store")}
                >
                  Open Simple Order Cards →
                </KokonutButton>
              </div>
              <div className="divide-y divide-stone-100">
                {LAYMAN_ORDERS.map((ord) => (
                  <div key={ord.id} className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <span className="font-bold text-sm text-[#18280e] block">
                        {ord.foreignBuyer.flag} {ord.orderNumber} • {ord.productName}
                      </span>
                      <span className="text-stone-500 block text-xs mt-0.5">
                        Buyer: {ord.foreignBuyer.company} ({ord.foreignBuyer.city})
                      </span>
                    </div>
                    <div className="sm:text-right">
                      <span className="font-bold text-sm text-[#18280e] block">
                        ${ord.totalDealUSD.toLocaleString()} USD (≈ ₹{ord.approxInrLakhs} Lakhs)
                      </span>
                      <span className="text-xs font-semibold text-[#3f7308] bg-[#ebf7d9] px-2.5 py-0.5 rounded-full inline-block mt-1">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Products */}
          {activeNav === "products" && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4 font-sans animate-in fade-in">
              <div className="pb-4 border-b border-stone-100">
                <h2 className="text-lg font-bold text-[#18280e]">Products Foreign Buyers Order From You</h2>
                <p className="text-xs text-stone-500">Your listed factory items and recent order prices.</p>
              </div>
              <div className="space-y-3">
                {LAYMAN_ORDERS.map((ord) => (
                  <div key={ord.id} className="p-4 rounded-2xl bg-[#fbfdf9] border border-stone-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div>
                      <h4 className="font-bold text-sm text-[#18280e]">{ord.productName}</h4>
                      <p className="text-stone-600 text-xs mt-1 leading-relaxed">{ord.laymanExplanation}</p>
                    </div>
                    <div className="sm:text-right shrink-0">
                      <span className="font-bold text-sm text-[#3f7308] block">${ord.unitPriceUSD} / piece</span>
                      <span className="text-xs text-stone-500">Total order: ₹{ord.approxInrLakhs} Lakhs</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Foreign Buyers */}
          {activeNav === "customers" && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4 font-sans animate-in fade-in">
              <div className="pb-4 border-b border-stone-100">
                <h2 className="text-lg font-bold text-[#18280e]">Verified Foreign Buyers Ordering From You</h2>
                <p className="text-xs text-stone-500">Every buyer below has a checked company record and active PayPal payment method.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {LAYMAN_ORDERS.map((ord) => (
                  <div key={ord.id} className="p-5 rounded-2xl bg-[#fbfdf9] border border-stone-200 space-y-2">
                    <span className="text-2xl block">{ord.foreignBuyer.flag}</span>
                    <h4 className="font-bold text-sm text-[#18280e]">{ord.foreignBuyer.company}</h4>
                    <p className="text-stone-600 text-xs">
                      {ord.foreignBuyer.city}
                      <br />
                      Contact: {ord.foreignBuyer.contactPerson}
                    </p>
                    <span className="text-xs text-emerald-800 font-semibold bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block">
                      {ord.foreignBuyer.verifiedStanding}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Money, Bills & Tax Receipts */}
          {(activeNav === "invoices" || activeNav === "transactions" || activeNav === "reports") && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4 font-sans animate-in fade-in">
              <div className="pb-4 border-b border-stone-100">
                <h2 className="text-lg font-bold text-[#18280e]">
                  {activeNav === "invoices" && "Your Bills & Invoices"}
                  {activeNav === "transactions" && "Money Received in PayPal & Your Bank"}
                  {activeNav === "reports" && "Export Tax & Accountant Receipts"}
                </h2>
                <p className="text-xs text-stone-500">
                  Clear record of advance payments, pending balances, and ready-to-download tax receipts for your accountant.
                </p>
              </div>
              <div className="divide-y divide-stone-100">
                <div className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <span className="font-bold text-sm text-[#18280e] block">
                      30% Advance Payment — Solid Brass Door Handles (#ORD-USA-9921)
                    </span>
                    <span className="text-stone-500 block text-xs mt-0.5">
                      Paid by Pacific Architectural Hardware (USA) via PayPal
                    </span>
                  </div>
                  <div className="sm:text-right">
                    <span className="font-bold text-[#18280e] block text-sm">$25,725 USD (≈ ₹21.48 Lakhs)</span>
                    <span className="text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full text-xs inline-block mt-1">
                      Received in PayPal ✓
                    </span>
                  </div>
                </div>
                <div className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <span className="font-bold text-sm text-[#18280e] block">
                      70% Remaining Balance — Released Upon Ship Loading (#ORD-USA-9921)
                    </span>
                    <span className="text-stone-500 block text-xs mt-0.5">
                      Scheduled automatic transfer to your factory bank account
                    </span>
                  </div>
                  <div className="sm:text-right">
                    <span className="font-bold text-[#18280e] block text-sm">$60,025 USD (≈ ₹50.12 Lakhs)</span>
                    <span className="text-[#3f7308] font-bold bg-[#ebf7d9] px-2.5 py-0.5 rounded-full text-xs inline-block mt-1">
                      On Ship Dispatch
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Simple Settings & Help */}
          {(activeNav === "settings" || activeNav === "help" || activeNav === "analytics" || activeNav === "discounts" || activeNav === "content") && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-5 font-sans animate-in fade-in">
              <div className="pb-4 border-b border-stone-100">
                <h2 className="text-lg font-bold text-[#18280e]">
                  {activeNav === "help" ? "Help & Simple Guide" : "Factory Account Settings"}
                </h2>
                <p className="text-xs text-stone-500">
                  Manage your factory details, WhatsApp order alerts, and common questions.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#f4faed] border border-[#d8e5ca] space-y-1.5">
                  <strong className="text-[#18280e] block text-sm">1. How do I accept an order?</strong>
                  <p className="text-stone-700 leading-relaxed">
                    Open <strong>Simple Order Cards</strong>, read what the foreign buyer wants in plain words, and slide the green button to accept.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#f4faed] border border-[#d8e5ca] space-y-1.5">
                  <strong className="text-[#18280e] block text-sm">2. When do I get paid?</strong>
                  <p className="text-stone-700 leading-relaxed">
                    The buyer pays 30% advance in PayPal before you start making anything, and the other 70% when goods load on the ship.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#f4faed] border border-[#d8e5ca] space-y-1.5">
                  <strong className="text-[#18280e] block text-sm">3. How do WhatsApp alerts work?</strong>
                  <p className="text-stone-700 leading-relaxed">
                    Click <strong>WhatsApp Alerts</strong> at the top right, scan the QR code once with your phone, and every update arrives in WhatsApp automatically.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
