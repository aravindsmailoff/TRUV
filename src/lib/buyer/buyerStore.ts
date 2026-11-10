/**
 * TradeOracle Buyer Data Store
 * In-memory & localStorage-backed state for Foreign Buyer Portal:
 * - Suppliers directory (Indian manufacturers & tech service agencies)
 * - RFQs (Goods & Services)
 * - Quotations received & comparison
 * - Order workspaces (with physical goods vs digital service milestone pipelines)
 * - PayPal transaction records & status
 * - Uploaded documents & dispute evidence
 */

export interface SupplierItem {
  id: string;
  name: string;
  type: "goods" | "service";
  category: string;
  city: string;
  state: string;
  country: "India";
  iecCode?: string;
  gstin?: string;
  udyamNumber?: string;
  verificationSource: "DGFT + ICEGATE + PayPal Merchant KYC" | "STPI + GSTN + PayPal Verified" | "QIMA Factory Audited";
  verificationMeaning: "Legal IEC active, past customs clearances verified, direct PayPal account bound";
  productsOrServices: string[];
  capabilities: string[];
  moq: string;
  leadTime: string;
  rating: number;
  ordersFulfilled: number;
  contactEmail: string;
  paypalMerchantId: string;
  approxPricingRange: string;
  shortlisted?: boolean;
}

export interface RFQItem {
  id: string;
  rfqNumber: string;
  type: "goods" | "service";
  title: string;
  category: string;
  targetQuantity?: number;
  targetUnit?: string;
  budgetUSD: number;
  specifications: string;
  qualityRequirements?: string;
  destinationPort?: string;
  expectedDeliveryDate: string;
  // For services
  scopeOfWork?: string;
  requiredSkills?: string[];
  milestonesProposed?: string[];
  status: "open" | "evaluating" | "quoted" | "contracted";
  createdAt: string;
  quotesCount: number;
}

export interface QuotationItem {
  id: string;
  rfqId: string;
  supplierId: string;
  supplierName: string;
  supplierCity: string;
  unitPriceUSD: number;
  totalPriceUSD: number;
  leadTimeDays: number;
  incoterms: "FOB Mundra" | "FOB Nhava Sheva" | "CIF Long Beach" | "CIF Hamburg" | "Digital STPI";
  validUntil: string;
  notes: string;
  specificationsConfirmed: string[];
  status: "pending" | "accepted" | "rejected";
  submittedAt: string;
}

export interface OrderWorkspaceItem {
  id: string;
  orderNumber: string;
  rfqId: string;
  quotationId: string;
  supplierId: string;
  supplierName: string;
  supplierEmail: string;
  buyerCompany: string;
  type: "goods" | "service";
  productOrServiceName: string;
  totalAmountUSD: number;
  advanceDepositUSD: number; // 30%
  balanceUSD: number; // 70%
  currency: "USD";
  currentStageIndex: number;
  milestones: {
    id: string;
    title: string;
    description: string;
    status: "completed" | "in_progress" | "pending";
    completedAt?: string;
    evidenceDocId?: string;
    evidenceName?: string;
  }[];
  paypalTransaction: {
    orderId?: string;
    captureId?: string;
    status: "NOT_INITIATED" | "ADVANCE_HELD_ESCROW" | "BALANCE_CAPTURED" | "SETTLED";
    paidAdvanceUSD: number;
    paidBalanceUSD: number;
    approvalUrl?: string;
    lastUpdated: string;
  };
  disputeEvidence: {
    commercialPOUrl: string;
    inspectionReportUrl?: string;
    billOfLadingUrl?: string;
    paypalCaptureReceiptUrl?: string;
    notes: string;
  };
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category:
    | "Commercial Invoice"
    | "Quotation"
    | "Purchase Order"
    | "Product Specification"
    | "Inspection Report"
    | "Shipping Document (BL/LEO)"
    | "Payment Evidence"
    | "Delivery Evidence";
  orderId?: string;
  orderNumber?: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  verifiedBy: string;
  downloadUrl: string;
}

// -------------------------------------------------------------
// INITIAL SEED DATA
// -------------------------------------------------------------

export const INITIAL_SUPPLIERS: SupplierItem[] = [
  {
    id: "sup_jamnagar_01",
    name: "Jamnagar Precision Brass Castings Ltd",
    type: "goods",
    category: "Brassware & Hardware",
    city: "Jamnagar",
    state: "Gujarat",
    country: "India",
    iecCode: "0429108422",
    gstin: "24AAACJ1482E1Z8",
    udyamNumber: "UDYAM-GJ-14-0029144",
    verificationSource: "DGFT + ICEGATE + PayPal Merchant KYC",
    verificationMeaning: "Legal IEC active, past customs clearances verified, direct PayPal account bound",
    productsOrServices: [
      "Architectural Mortise Locks",
      "Solid Brass Lever Handles",
      "Marine Grade Anti-Tarnish Hardware",
    ],
    capabilities: [
      "Induction Melting Furnaces (CW617N)",
      "PVD Satin Gold Nanocoat (300-hr ASTM B117 salt spray)",
      "Automated CNC Precision Milling",
    ],
    moq: "1,000 pcs",
    leadTime: "22 days",
    rating: 4.9,
    ordersFulfilled: 38,
    contactEmail: "sb-knljl53833937@business.example.com",
    paypalMerchantId: "PP_MCH_JAMNAGAR_92",
    approxPricingRange: "$18.50 - $28.00 / pc",
  },
  {
    id: "sup_ludhiana_02",
    name: "Ludhiana Precision Forgings & Fasteners Pvt Ltd",
    type: "goods",
    category: "Fasteners & Forgings",
    city: "Ludhiana",
    state: "Punjab",
    country: "India",
    iecCode: "0318042911",
    gstin: "03AAACL9184P1Z3",
    udyamNumber: "UDYAM-PB-12-0048192",
    verificationSource: "QIMA Factory Audited",
    verificationMeaning: "Legal IEC active, past customs clearances verified, direct PayPal account bound",
    productsOrServices: [
      "Grade 10.9 Flange Bolts",
      "Heavy Hex Structural Fasteners",
      "Cold-Forged High Tensile Billets",
    ],
    capabilities: [
      "Multi-Station Cold Heading Formers",
      "12-15 Micron Zinc-Nickel Alkaline Plating",
      "Optical Automated Sorting (Zero PPM Defect)",
    ],
    moq: "10,000 pcs",
    leadTime: "25 days",
    rating: 4.8,
    ordersFulfilled: 62,
    contactEmail: "sb-knljl53833937@business.example.com",
    paypalMerchantId: "PP_MCH_LUDHIANA_44",
    approxPricingRange: "$1.40 - $2.20 / pc",
  },
  {
    id: "sup_moradabad_03",
    name: "Moradabad Precision Foundry & Castings LLP",
    type: "goods",
    category: "Heritage Brassware",
    city: "Moradabad",
    state: "Uttar Pradesh",
    country: "India",
    iecCode: "0508012491",
    gstin: "09AAHFM9201L1Z4",
    udyamNumber: "UDYAM-UP-48-0019281",
    verificationSource: "DGFT + ICEGATE + PayPal Merchant KYC",
    verificationMeaning: "Legal IEC active, past customs clearances verified, direct PayPal account bound",
    productsOrServices: [
      "Heritage Window Cremone Bolts",
      "Aged Patina Antique Hinges",
      "Hand-Finished Estate Hardware",
    ],
    capabilities: [
      "Sand Cast Traditional Foundry",
      "Beeswax Hot Patina Aging",
      "Custom Laser Engraving for Export Brands",
    ],
    moq: "500 pcs",
    leadTime: "28 days",
    rating: 4.9,
    ordersFulfilled: 29,
    contactEmail: "sb-knljl53833937@business.example.com",
    paypalMerchantId: "PP_MCH_MORADABAD_991",
    approxPricingRange: "$35.00 - $48.00 / pc",
  },
  {
    id: "sup_tirupur_04",
    name: "Kongu EcoFabrics & Knits Private Limited",
    type: "goods",
    category: "Textiles & Organic Apparel",
    city: "Tirupur",
    state: "Tamil Nadu",
    country: "India",
    iecCode: "3209004812",
    gstin: "33AAECK4812N1Z9",
    udyamNumber: "UDYAM-TN-28-0094102",
    verificationSource: "QIMA Factory Audited",
    verificationMeaning: "Legal IEC active, past customs clearances verified, direct PayPal account bound",
    productsOrServices: [
      "GOTS Certified Organic Heavyweight Hoodies",
      "Pima Combed Cotton T-Shirts",
      "French Terry Knitwear",
    ],
    capabilities: [
      "28 Gauge Circular Knitting",
      "Zero Liquid Discharge Soft-Flow Dyeing",
      "OEKO-TEX Class 1 Compliant",
    ],
    moq: "1,500 pcs",
    leadTime: "30 days",
    rating: 4.95,
    ordersFulfilled: 84,
    contactEmail: "sb-knljl53833937@business.example.com",
    paypalMerchantId: "PP_MCH_KONGU_410",
    approxPricingRange: "$7.50 - $16.00 / pc",
  },
  {
    id: "sup_bangalore_05",
    name: "ApexCloud Software Labs LLP",
    type: "service",
    category: "Software Engineering & Cloud",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    iecCode: "STPI Software Exporter",
    gstin: "29AABCA9918K1Z5",
    udyamNumber: "UDYAM-KR-03-0091824",
    verificationSource: "STPI + GSTN + PayPal Verified",
    verificationMeaning: "Legal IEC active, past customs clearances verified, direct PayPal account bound",
    productsOrServices: [
      "Full-Stack React & Next.js SaaS Engineering",
      "Payment Gateway & PayPal API Microservices",
      "Cloud Infrastructure Automation (AWS/GCP)",
    ],
    capabilities: [
      "SOC-2 Type II Certified Development Studio",
      "90%+ Automated Unit Test Coverage Guarantee",
      "HIPAA Compliant Data Pipelines",
    ],
    moq: "2-Week Sprint",
    leadTime: "Immediate",
    rating: 5.0,
    ordersFulfilled: 41,
    contactEmail: "sb-knljl53833937@business.example.com",
    paypalMerchantId: "PP_MCH_APEXCLOUD_01",
    approxPricingRange: "$4,500 - $8,000 / sprint",
  },
];

export const INITIAL_RFQS: RFQItem[] = [
  {
    id: "rfq_01",
    rfqNumber: "RFQ-2026-9921",
    type: "goods",
    title: "Architectural Solid Brass Mortise Locksets & Handles",
    category: "Brassware & Hardware",
    targetQuantity: 3500,
    targetUnit: "sets",
    budgetUSD: 85750,
    specifications: "CW617N brass, 240-hr ASTM B117 salt spray anti-tarnish coating. Barcoded individual retail boxes.",
    qualityRequirements: "QIMA AQL 1.5 Pre-Shipment Inspection Certificate required prior to Mundra dispatch.",
    destinationPort: "Port of Long Beach, California (USLGB)",
    expectedDeliveryDate: "2026-04-15",
    status: "contracted",
    createdAt: "2026-01-10",
    quotesCount: 3,
  },
  {
    id: "rfq_02",
    rfqNumber: "RFQ-2026-9918",
    type: "goods",
    title: "Grade 10.9 Cold-Forged Flange Bolts & Nuts",
    category: "Fasteners & Forgings",
    targetQuantity: 50000,
    targetUnit: "pcs",
    budgetUSD: 92500,
    specifications: "Alloy Steel AISI 4140, 12-micron zinc-nickel plating, 25kg fumigated export crates.",
    qualityRequirements: "TÜV Rheinland India Metallurgical proof load test certificate.",
    destinationPort: "Port of Hamburg, Germany (DEHAM)",
    expectedDeliveryDate: "2026-04-20",
    status: "quoted",
    createdAt: "2026-01-14",
    quotesCount: 2,
  },
  {
    id: "rfq_03",
    rfqNumber: "RFQ-2026-9884",
    type: "service",
    title: "Cross-Border Fintech API & Webhook Service Integration",
    category: "Software Engineering & Cloud",
    budgetUSD: 5000,
    specifications: "React 19, TypeScript, Next.js App Router, PayPal Orders v2 integration with server-side webhook validation.",
    scopeOfWork: "Implement PayPal Orders v2 capture flow, dispute evidence attachment workflow, and Jest integration tests.",
    requiredSkills: ["TypeScript", "Next.js", "PayPal REST APIs", "Tailwind CSS"],
    milestonesProposed: ["Milestone 1: API Setup ($1,500)", "Milestone 2: Final Acceptance ($3,500)"],
    expectedDeliveryDate: "2026-02-28",
    status: "contracted",
    createdAt: "2026-01-20",
    quotesCount: 2,
  },
];

export const INITIAL_QUOTES: QuotationItem[] = [
  {
    id: "quot_01",
    rfqId: "rfq_01",
    supplierId: "sup_jamnagar_01",
    supplierName: "Jamnagar Precision Brass Castings Ltd",
    supplierCity: "Jamnagar, Gujarat",
    unitPriceUSD: 24.5,
    totalPriceUSD: 85750,
    leadTimeDays: 22,
    incoterms: "FOB Mundra",
    validUntil: "2026-03-31",
    notes: "Includes custom UPC barcode labelling and QIMA AQL 1.5 testing.",
    specificationsConfirmed: [
      "100% CW617N Solid Brass",
      "PVD Satin Gold 300-hr salt spray pass",
      "Export grade 5-ply cartons",
    ],
    status: "accepted",
    submittedAt: "2026-01-12",
  },
  {
    id: "quot_02",
    rfqId: "rfq_01",
    supplierId: "sup_moradabad_03",
    supplierName: "Moradabad Precision Foundry & Castings LLP",
    supplierCity: "Moradabad, UP",
    unitPriceUSD: 26.2,
    totalPriceUSD: 91700,
    leadTimeDays: 28,
    incoterms: "FOB Nhava Sheva",
    validUntil: "2026-03-31",
    notes: "Traditional sand-cast finish with hot wax anti-tarnish treatment.",
    specificationsConfirmed: ["Lead < 1.8%", "Salt-spray pass 240 hrs"],
    status: "rejected",
    submittedAt: "2026-01-13",
  },
  {
    id: "quot_03",
    rfqId: "rfq_02",
    supplierId: "sup_ludhiana_02",
    supplierName: "Ludhiana Precision Forgings & Fasteners Pvt Ltd",
    supplierCity: "Ludhiana, Punjab",
    unitPriceUSD: 1.85,
    totalPriceUSD: 92500,
    leadTimeDays: 25,
    incoterms: "FOB Nhava Sheva",
    validUntil: "2026-04-10",
    notes: "Grade 10.9 high tensile specification with complete TÜV batch test report.",
    specificationsConfirmed: ["AISI 4140 Quenched & Tempered", "12 µm Zinc-Nickel coat"],
    status: "pending",
    submittedAt: "2026-01-16",
  },
  {
    id: "quot_04",
    rfqId: "rfq_03",
    supplierId: "sup_bangalore_05",
    supplierName: "ApexCloud Software Labs LLP",
    supplierCity: "Bengaluru, Karnataka",
    unitPriceUSD: 5000,
    totalPriceUSD: 5000,
    leadTimeDays: 14,
    incoterms: "Digital STPI",
    validUntil: "2026-03-15",
    notes: "Includes 2 senior engineers dedicated for sprint. Full GitHub PR handover.",
    specificationsConfirmed: ["Next.js App Router", "PayPal Orders v2", "90% Test Coverage"],
    status: "accepted",
    submittedAt: "2026-01-21",
  },
];

export const INITIAL_ORDERS: OrderWorkspaceItem[] = [
  {
    id: "ord_01",
    orderNumber: "ORD-USA-9921",
    rfqId: "rfq_01",
    quotationId: "quot_01",
    supplierId: "sup_jamnagar_01",
    supplierName: "Jamnagar Precision Brass Castings Ltd",
    supplierEmail: "sb-knljl53833937@business.example.com",
    buyerCompany: "Pacific Architectural Hardware LLC (USA)",
    type: "goods",
    productOrServiceName: "3,500 Architectural Solid Brass Mortise Locksets",
    totalAmountUSD: 85750,
    advanceDepositUSD: 25725,
    balanceUSD: 60025,
    currency: "USD",
    currentStageIndex: 2, // Quality inspection stage
    milestones: [
      {
        id: "m_1",
        title: "1. Commercial Agreement & PO",
        description: "UCP 600 compliant PO locked and 30% advance deposit captured on PayPal.",
        status: "completed",
        completedAt: "12 Jan 2026",
        evidenceDocId: "doc_po_01",
        evidenceName: "Commercial_PO_9921_Signed.pdf",
      },
      {
        id: "m_2",
        title: "2. Foundry Production & Machining",
        description: "3,500 billet forgings cast, CNC milled, and PVD satin gold coated.",
        status: "completed",
        completedAt: "28 Jan 2026",
        evidenceDocId: "doc_prod_01",
        evidenceName: "Melt_Heat_Batch_Certificate.pdf",
      },
      {
        id: "m_3",
        title: "3. Pre-Shipment Quality Inspection",
        description: "QIMA Quality Services on-site audit for dimensional tolerances and 240-hr ASTM B117 salt spray test.",
        status: "in_progress",
        evidenceDocId: "doc_qima_01",
        evidenceName: "QIMA_Inspection_Report_Draft.pdf",
      },
      {
        id: "m_4",
        title: "4. Packaging & Barcoding",
        description: "Individual retail boxing with buyer UPC barcode labels, 5-ply export master cartons.",
        status: "pending",
      },
      {
        id: "m_5",
        title: "5. Customs Let Export Order (LEO) & Bill of Lading",
        description: "Mundra Port container gate-in (MSKU-7491024), ICEGATE electronic shipping bill cleared.",
        status: "pending",
      },
      {
        id: "m_6",
        title: "6. Port of Long Beach Delivery & 70% Balance Release",
        description: "Arrival at Port of Long Beach, final customs clearance, balance release to supplier via PayPal.",
        status: "pending",
      },
    ],
    paypalTransaction: {
      orderId: "6XJ491024PL",
      captureId: "CAP_30ADV_9921",
      status: "ADVANCE_HELD_ESCROW",
      paidAdvanceUSD: 25725,
      paidBalanceUSD: 0,
      approvalUrl: "https://www.sandbox.paypal.com/checkoutnow?token=6XJ491024PL",
      lastUpdated: "2026-01-12T14:30:00Z",
    },
    disputeEvidence: {
      commercialPOUrl: "doc_po_01",
      inspectionReportUrl: "doc_qima_01",
      notes: "Commercial agreement explicitly mandates 30% advance on PO confirmation and 70% final settlement against verified QIMA AQL 1.5 certificate and Bill of Lading.",
    },
    createdAt: "2026-01-12",
  },
  {
    id: "ord_02",
    orderNumber: "ORD-USA-9884",
    rfqId: "rfq_03",
    quotationId: "quot_04",
    supplierId: "sup_bangalore_05",
    supplierName: "ApexCloud Software Labs LLP",
    supplierEmail: "sb-knljl53833937@business.example.com",
    buyerCompany: "Pacific Architectural Hardware LLC (USA)",
    type: "service",
    productOrServiceName: "Cross-Border Fintech API & Webhook Service Integration",
    totalAmountUSD: 5000,
    advanceDepositUSD: 1500,
    balanceUSD: 3500,
    currency: "USD",
    currentStageIndex: 1, // Work submitted stage
    milestones: [
      {
        id: "sm_1",
        title: "1. Project Kickoff & Milestone 1 Deposit",
        description: "Scope confirmed, Git repo established, 30% advance ($1,500) held via PayPal.",
        status: "completed",
        completedAt: "22 Jan 2026",
      },
      {
        id: "sm_2",
        title: "2. Work Submitted & Staging Deployment",
        description: "All PayPal Orders v2 endpoints & webhook listeners implemented on AWS staging.",
        status: "in_progress",
      },
      {
        id: "sm_3",
        title: "3. Buyer Review & Code Audit",
        description: "Automated SonarCloud security gate passed (zero high vulnerabilities, 92% Jest coverage).",
        status: "pending",
      },
      {
        id: "sm_4",
        title: "4. Final Delivery & Acceptance",
        description: "Production PR merge, documentation transfer, 70% balance ($3,500) released to Indian agency.",
        status: "pending",
      },
    ],
    paypalTransaction: {
      orderId: "8PL2049182K",
      captureId: "CAP_30ADV_9884",
      status: "ADVANCE_HELD_ESCROW",
      paidAdvanceUSD: 1500,
      paidBalanceUSD: 0,
      approvalUrl: "https://www.sandbox.paypal.com/checkoutnow?token=8PL2049182K",
      lastUpdated: "2026-01-22T10:15:00Z",
    },
    disputeEvidence: {
      commercialPOUrl: "doc_po_02",
      notes: "Milestone schedule bound to GitHub commit hash and SonarQube automated report verification.",
    },
    createdAt: "2026-01-22",
  },
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: "doc_po_01",
    title: "Commercial Purchase Order #PO-9921",
    category: "Purchase Order",
    orderId: "ord_01",
    orderNumber: "ORD-USA-9921",
    fileName: "Commercial_PO_9921_Signed.pdf",
    fileSize: "1.4 MB",
    uploadedAt: "12 Jan 2026",
    verifiedBy: "DGFT Verified IEC #0429108422",
    downloadUrl: "#",
  },
  {
    id: "doc_invoice_01",
    title: "Proforma Commercial Invoice #INV-2026-081",
    category: "Commercial Invoice",
    orderId: "ord_01",
    orderNumber: "ORD-USA-9921",
    fileName: "Proforma_Invoice_Jamnagar_85750USD.pdf",
    fileSize: "840 KB",
    uploadedAt: "12 Jan 2026",
    verifiedBy: "GSTN 24AAACJ1482E1Z8",
    downloadUrl: "#",
  },
  {
    id: "doc_qima_01",
    title: "QIMA Quality Pre-Shipment Audit Report",
    category: "Inspection Report",
    orderId: "ord_01",
    orderNumber: "ORD-USA-9921",
    fileName: "QIMA_Audit_IN_98124_Passed.pdf",
    fileSize: "3.2 MB",
    uploadedAt: "28 Jan 2026",
    verifiedBy: "QIMA Quality Services Pvt Ltd (AQL 1.5)",
    downloadUrl: "#",
  },
  {
    id: "doc_bl_01",
    title: "Bill of Lading & ICEGATE Let Export Order",
    category: "Shipping Document (BL/LEO)",
    orderId: "ord_01",
    orderNumber: "ORD-USA-9921",
    fileName: "Maersk_BL_MSK_2026_44018A.pdf",
    fileSize: "1.8 MB",
    uploadedAt: "29 Jan 2026",
    verifiedBy: "ICEGATE Mundra Customs Port (INMUN1)",
    downloadUrl: "#",
  },
  {
    id: "doc_pay_01",
    title: "PayPal Orders v2 Advance Escrow Receipt",
    category: "Payment Evidence",
    orderId: "ord_01",
    orderNumber: "ORD-USA-9921",
    fileName: "PayPal_Receipt_CAP_30ADV_9921.pdf",
    fileSize: "410 KB",
    uploadedAt: "12 Jan 2026",
    verifiedBy: "PayPal Orders v2 Live Sandbox Gateway",
    downloadUrl: "#",
  },
  {
    id: "doc_po_02",
    title: "SaaS Sprint Statement of Work & PO",
    category: "Purchase Order",
    orderId: "ord_02",
    orderNumber: "ORD-USA-9884",
    fileName: "SOW_ApexCloud_Sprint1_Signed.pdf",
    fileSize: "920 KB",
    uploadedAt: "22 Jan 2026",
    verifiedBy: "STPI Softex Registered Exporter",
    downloadUrl: "#",
  },
];
