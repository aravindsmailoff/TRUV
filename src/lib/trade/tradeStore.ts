import {
  BuyerRFQ,
  IndianManufacturer,
  ManufacturerQuotation,
  CommercialTradeOrder,
  TradeMilestone,
} from "@/types/trade";

export interface VerifiedCertificateRecord {
  id: string;
  markName: string;
  country: string;
  fileName: string;
  certNumber: string;
  verdict: "verified" | "needs_review" | "mismatch";
  confidenceScore: number;
  detectedIssuer: string;
  detectedCompany: string;
  detectedExpiry: string;
  findings: string[];
  verifiedAt: string;
}

function getServerFs(): { fs: typeof import("fs"); path: typeof import("path"); tradeFile: string; dataDir: string } | null {
  if (typeof window !== "undefined") return null;
  try {
    const req = Function("return require")() as NodeRequire;
    const fsMod = req("fs") as typeof import("fs");
    const pathMod = req("path") as typeof import("path");
    const dataDir = pathMod.join(process.cwd(), ".data");
    return {
      fs: fsMod,
      path: pathMod,
      dataDir,
      tradeFile: pathMod.join(dataDir, "trade-engine.json"),
    };
  } catch {
    return null;
  }
}

export const SEED_MANUFACTURERS: IndianManufacturer[] = [
  {
    id: "mfg_brass_moradabad",
    legalEntityName: "Moradabad Precision Foundry & Castings LLP",
    tradeName: "MPF Precision Brassware",
    hubLocation: "Moradabad, UP",
    msmeCategory: "Small",
    udyamRegistrationNumber: "UDYAM-UP-48-0019281",
    iecCode: "0508012491",
    gstin: "09AAHFM9201L1Z4",
    primaryCategories: ["Precision Castings & Brass", "Machined Engineering Components"],
    monthlyCapacityUnits: 45000,
    factoryAudited: true,
    auditedBy: "QIMA Quality Services Pvt Ltd",
    certifications: ["ISO 9001:2015", "RoHS Compliance Certified"],
    exportExperienceYears: 9,
    leadTimeDays: 35,
    paypalMerchantId: "PP_MCH_MORADABAD_991",
    paypalEmail: "accounts@mpfbrassware.com",
    verifiedProductionLines: [
      "Induction Melting Furnaces (500kg x 2)",
      "High-Pressure Die Casting Machines (160T & 280T)",
      "CNC 4-Axis Turning & Milling Machining Centers",
      "Automated Ultrasonic Degreasing & Lacquering Line",
    ],
    readinessScore: 92,
  },
  {
    id: "mfg_textiles_tirupur",
    legalEntityName: "Kongu EcoFabrics & Knits Private Limited",
    tradeName: "Kongu EcoTextiles",
    hubLocation: "Ludhiana / Tirupur, TN",
    msmeCategory: "Medium",
    udyamRegistrationNumber: "UDYAM-TN-28-0094102",
    iecCode: "3209004812",
    gstin: "33AAECK4812N1Z9",
    primaryCategories: ["Textiles & Organic Apparel"],
    monthlyCapacityUnits: 120000,
    factoryAudited: true,
    auditedBy: "SGS India Audits",
    certifications: ["GOTS Certified Organic", "OEKO-TEX Standard 100", "Sedex SMETA 4-Pillar"],
    exportExperienceYears: 14,
    leadTimeDays: 40,
    paypalMerchantId: "PP_MCH_KONGU_410",
    paypalEmail: "exports@konguecotextiles.com",
    verifiedProductionLines: [
      "Fukuhara Circular Knitting Machines (28 Gauge)",
      "Thies Soft-Flow Dyeing with Zero Liquid Discharge (ZLD)",
      "Santex Tensionless Shrink Dryer",
      "Brother Automatic Computerized Stitching Stations",
    ],
    readinessScore: 96,
  },
  {
    id: "mfg_castings_rajkot",
    legalEntityName: "Saurashtra High-Tech Auto Ancillaries LLP",
    tradeName: "Saurashtra Precision Forgings",
    hubLocation: "Rajkot / Pune, MH",
    msmeCategory: "Small",
    udyamRegistrationNumber: "UDYAM-GJ-20-0041289",
    iecCode: "2411009184",
    gstin: "24AABCS9184P1Z3",
    primaryCategories: ["Auto Ancillaries", "Machined Engineering Components"],
    monthlyCapacityUnits: 30000,
    factoryAudited: true,
    auditedBy: "Bureau Veritas India",
    certifications: ["IATF 16949:2016", "ISO 14001"],
    exportExperienceYears: 7,
    leadTimeDays: 30,
    paypalMerchantId: "PP_MCH_SAURASHTRA_101",
    paypalEmail: "commercial@saurashtratech.in",
    verifiedProductionLines: [
      "1,600-Ton Closed Die Forging Press",
      "Doosan CNC Vertical Turning Lathes (VTL)",
      "Carl Zeiss 3D Coordinate Measuring Machine (CMM)",
      "Continuous Induction Hardening Line",
    ],
    readinessScore: 89,
  },
];

export const SEED_RFQS: BuyerRFQ[] = [
  {
    id: "rfq_intl_88201",
    rfqNumber: "RFQ-USA-2026-88201",
    buyerName: "Marcus Vance",
    buyerCompany: "Pacific Architectural Hardware LLC",
    buyerCountry: "United States (California)",
    buyerEmail: "m.vance@pacificarchhardware.com",
    productCategory: "Precision Castings & Brass",
    productName: "Architectural Solid Brass Mortise Locksets & Lever Handles",
    technicalSpecifications: [
      "Forged architectural brass alloy C36000 (EN 12164)",
      "Salt spray corrosion resistance minimum 240 hours (ASTM B117)",
      "Brushed satin PVD brass finish with anti-tarnish protective coating",
      "ANSI / BHMA Grade 1 cycle fatigue tested to 1,000,000 operations",
      "Custom laser-etched branding and individual barcoded retail boxes",
    ],
    targetQuantity: 3500,
    targetPricePerUnit: 24.5,
    currency: "USD",
    targetDeliveryDate: "2026-04-15",
    destinationPort: "Port of Long Beach (USLGB)",
    status: "quoted",
    createdAt: "2026-02-10T14:30:00Z",
  },
];

export const SEED_QUOTES: ManufacturerQuotation[] = [
  {
    id: "quote_mpf_88201",
    rfqId: "rfq_intl_88201",
    manufacturerId: "mfg_brass_moradabad",
    manufacturerName: "Moradabad Precision Foundry & Castings LLP",
    pricePerUnit: 23.8,
    currency: "USD",
    totalQuotationAmount: 83300, // 3,500 units @ $23.80
    incoterms: "FOB Mundra",
    leadTimeDays: 32,
    validUntil: "2026-03-31",
    specificationsConfirmed: [
      "Forged C36000 Brass verified with in-house Optical Emission Spectrometer",
      "PVD Satin Finish verified to 300 hrs ASTM B117 salt spray",
      "Tooling and tooling dies ready within 12 days",
      "Full export crating with fumigated ISPM-15 heat-treated wooden pallets",
    ],
    sampleAvailabilityDays: 7,
    commercialTermsNotes:
      "30% advance deposit via PayPal direct commercial invoicing; 70% balance payment upon presentation of Bill of Lading and QIMA pre-shipment inspection pass certificate.",
    status: "buyer_accepted",
    submittedAt: "2026-02-14T11:00:00Z",
  },
];

export const SEED_TRADES: CommercialTradeOrder[] = [
  {
    id: "trade_live_7719",
    orderNumber: "TRADE-IND-USA-2026-7719",
    rfqId: "rfq_intl_88201",
    buyerCompany: "Pacific Architectural Hardware LLC (USA)",
    buyerCountry: "United States",
    manufacturerId: "mfg_brass_moradabad",
    manufacturerName: "Moradabad Precision Foundry & Castings LLP",
    productName: "Architectural Solid Brass Mortise Locksets & Handles",
    quantityUnits: 3500,
    totalAmountUSD: 83300,
    advanceDepositRequiredUSD: 24990, // 30% advance ($24,990 USD)
    balanceDueUSD: 58310, // 70% balance ($58,310 USD)
    currentStage: "inspection_scheduled",
    inspectionAgency: {
      name: "QIMA Inspection India",
      status: "scheduled",
      reportNumber: "QIMA-PSI-2026-0914",
    },
    freightForwarder: {
      name: "Maersk Logistics India",
      bookingReference: "MSK-IN-LAX-481920",
      vesselVoyage: "MAERSK MC-KINNEY MOLLER / V.2604W",
      containerNumber: "MSKU-8924012 (1x 20ft GP)",
      portOfLoading: "Port of Mundra, Gujarat (INMUN)",
      portOfDischarge: "Port of Long Beach, USA (USLGB)",
    },
    customsBroker: {
      brokerLicense: "CHA-MUNDRA-R-8841",
      shippingBillNumber: "SB-MUNDRA-2026-381042",
      letExportOrderGranted: true,
    },
    financialPayment: {
      paypalOrderId: "5O190127TN364711E",
      paypalCaptureId: "9C827104KL920194A",
      advancePaymentStatus: "cleared",
      balancePaymentStatus: "unpaid",
      reconciled: true,
      directPayeeMerchantId: "PP_MCH_MORADABAD_991",
    },
    createdAt: "2026-02-15T10:00:00Z",
    estimatedDeliveryDate: "2026-04-18",
  },
];

export const SEED_MILESTONES: TradeMilestone[] = [
  {
    id: "ms_tr_01",
    tradeOrderId: "trade_live_7719",
    stage: "rfq_submitted",
    title: "Buyer Sourcing Requirement Registered",
    description: "Marcus Vance submitted RFQ-USA-2026-88201 with technical drawings and C36000 brass specifications.",
    serviceProviderName: "Global Trade Sourcing Engine",
    completedAt: "2026-02-10T14:30:00Z",
    status: "completed",
  },
  {
    id: "ms_tr_02",
    tradeOrderId: "trade_live_7719",
    stage: "supplier_shortlisted",
    title: "Indian MSME Manufacturer Qualified & Shortlisted",
    description: "Moradabad Precision Foundry matched on casting capability, ISO 9001 certification, and available plant capacity.",
    serviceProviderName: "DGFT & MSME Registry Verification",
    completedAt: "2026-02-12T16:00:00Z",
    status: "completed",
  },
  {
    id: "ms_tr_03",
    tradeOrderId: "trade_live_7719",
    stage: "po_confirmed",
    title: "Formal Commercial Purchase Order Signed",
    description: "Purchase Order PO-PAH-2026-092 confirmed at $23.80/unit FOB Mundra ($83,300 USD total order value).",
    serviceProviderName: "Trade Operations Desk",
    completedAt: "2026-02-15T10:00:00Z",
    status: "completed",
  },
  {
    id: "ms_tr_04",
    tradeOrderId: "trade_live_7719",
    stage: "advance_payment_pending",
    title: "PayPal 30% Commercial Advance Settled",
    description: "Buyer deposited $24,990 USD directly to Moradabad Foundry's verified merchant account (Capture: 9C827104KL920194A).",
    serviceProviderName: "PayPal International Commercial Invoicing",
    completedAt: "2026-02-16T18:22:00Z",
    status: "completed",
  },
  {
    id: "ms_tr_05",
    tradeOrderId: "trade_live_7719",
    stage: "production_in_progress",
    title: "Batch Tooling & Production Run Completed",
    description: "3,500 units cast, CNC milled, PVD coated, and laser engraved. Tensile strength reports verified.",
    serviceProviderName: "Moradabad Foundry QA Dept",
    completedAt: "2026-03-01T14:00:00Z",
    status: "completed",
  },
  {
    id: "ms_tr_06",
    tradeOrderId: "trade_live_7719",
    stage: "inspection_scheduled",
    title: "Independent Pre-Shipment Inspection (QIMA)",
    description: "AQL 1.5 critical inspection booked. Inspector dispatched to Moradabad factory for random sampling.",
    serviceProviderName: "QIMA Quality Services India",
    completedAt: undefined,
    status: "in_progress",
  },
  {
    id: "ms_tr_07",
    tradeOrderId: "trade_live_7719",
    stage: "customs_export_cleared",
    title: "Indian Export Customs Filing & Shipping Bill",
    description: "Shipping Bill SB-MUNDRA-2026-381042 filed via ICEGATE. Let Export Order (LEO) clearance initiated.",
    serviceProviderName: "Indian Customs Broker (CHA-MUNDRA)",
    completedAt: undefined,
    status: "pending",
  },
  {
    id: "ms_tr_08",
    tradeOrderId: "trade_live_7719",
    stage: "in_transit",
    title: "Ocean Freight Booking & Bill of Lading",
    description: "Container MSKU-8924012 loading scheduled on Maersk McKinney Moller departing Mundra for Long Beach.",
    serviceProviderName: "Maersk Logistics India",
    completedAt: undefined,
    status: "pending",
  },
  {
    id: "ms_tr_09",
    tradeOrderId: "trade_live_7719",
    stage: "delivered_and_settled",
    title: "Final Delivery & 70% Balance Release",
    description: "Final commercial release of $58,310 USD upon verified ocean bill of lading and customs receipt.",
    serviceProviderName: "Trade Operations & PayPal Settlement",
    completedAt: undefined,
    status: "pending",
  },
];

class TradeStore {
  private manufacturers: IndianManufacturer[] = [...SEED_MANUFACTURERS];
  private rfqs: BuyerRFQ[] = [...SEED_RFQS];
  private quotes: ManufacturerQuotation[] = [...SEED_QUOTES];
  private trades: CommercialTradeOrder[] = [...SEED_TRADES];
  private milestones: TradeMilestone[] = [...SEED_MILESTONES];
  private verifiedCertificates: VerifiedCertificateRecord[] = [];

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      const srv = getServerFs();
      if (!srv || !srv.fs.existsSync(srv.tradeFile)) return;
      const raw = srv.fs.readFileSync(srv.tradeFile, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.rfqs)) this.rfqs = parsed.rfqs;
      if (Array.isArray(parsed.trades)) this.trades = parsed.trades;
      if (Array.isArray(parsed.milestones)) this.milestones = parsed.milestones;
      if (Array.isArray(parsed.verifiedCertificates)) {
        this.verifiedCertificates = parsed.verifiedCertificates;
      }
    } catch {
      // Ignore disk read error
    }
  }

  private saveToDisk() {
    try {
      const srv = getServerFs();
      if (!srv) return;
      if (!srv.fs.existsSync(srv.dataDir)) {
        srv.fs.mkdirSync(srv.dataDir, { recursive: true });
      }
      srv.fs.writeFileSync(
        srv.tradeFile,
        JSON.stringify(
          {
            rfqs: this.rfqs,
            trades: this.trades,
            milestones: this.milestones,
            verifiedCertificates: this.verifiedCertificates,
          },
          null,
          2
        ),
        "utf8"
      );
    } catch {
      // Ignore disk write error
    }
  }

  public getVerifiedCertificates(): VerifiedCertificateRecord[] {
    return this.verifiedCertificates;
  }

  public addVerifiedCertificate(record: VerifiedCertificateRecord): VerifiedCertificateRecord {
    this.verifiedCertificates = [
      record,
      ...this.verifiedCertificates.filter((c) => c.markName !== record.markName),
    ];
    this.saveToDisk();
    return record;
  }

  public getManufacturers(): IndianManufacturer[] {
    return this.manufacturers;
  }

  public getManufacturer(id: string): IndianManufacturer | undefined {
    return this.manufacturers.find((m) => m.id === id);
  }

  public getRFQs(): BuyerRFQ[] {
    return this.rfqs;
  }

  public getQuotes(rfqId?: string): ManufacturerQuotation[] {
    if (rfqId) {
      return this.quotes.filter((q) => q.rfqId === rfqId);
    }
    return this.quotes;
  }

  public getTrades(): CommercialTradeOrder[] {
    return this.trades;
  }

  public getTrade(id: string): CommercialTradeOrder | undefined {
    return this.trades.find((t) => t.id === id);
  }

  public getMilestones(tradeId: string): TradeMilestone[] {
    return this.milestones.filter((m) => m.tradeOrderId === tradeId);
  }

  public createRFQ(data: Omit<BuyerRFQ, "id" | "rfqNumber" | "status" | "createdAt">): BuyerRFQ {
    const newRFQ: BuyerRFQ = {
      ...data,
      id: `rfq_${Date.now()}`,
      rfqNumber: `RFQ-${Date.now().toString().slice(-6)}`,
      status: "open",
      createdAt: new Date().toISOString(),
    };
    this.rfqs.unshift(newRFQ);
    this.saveToDisk();
    return newRFQ;
  }

  public matchManufacturersForRFQ(rfqId: string): IndianManufacturer[] {
    const rfq = this.rfqs.find((r) => r.id === rfqId);
    if (!rfq) return [];
    return this.manufacturers.filter(
      (m) =>
        m.primaryCategories.includes(rfq.productCategory) &&
        m.monthlyCapacityUnits >= rfq.targetQuantity * 0.5
    );
  }

  public initiateTradeOrder(params: {
    rfqId: string;
    manufacturerId: string;
    quoteId: string;
  }): CommercialTradeOrder {
    const rfq = this.rfqs.find((r) => r.id === params.rfqId);
    const mfg = this.manufacturers.find((m) => m.id === params.manufacturerId);
    const quote = this.quotes.find((q) => q.id === params.quoteId);

    if (!rfq || !mfg || !quote) {
      throw new Error("Invalid parameters to initiate trade order");
    }

    const totalUSD = quote.totalQuotationAmount;
    const advanceUSD = totalUSD * 0.3;
    const balanceUSD = totalUSD * 0.7;

    const newTrade: CommercialTradeOrder = {
      id: `trade_${Date.now()}`,
      orderNumber: `TRADE-${Date.now().toString().slice(-6)}`,
      rfqId: rfq.id,
      buyerCompany: rfq.buyerCompany,
      buyerCountry: rfq.buyerCountry,
      manufacturerId: mfg.id,
      manufacturerName: mfg.legalEntityName,
      productName: rfq.productName,
      quantityUnits: rfq.targetQuantity,
      totalAmountUSD: totalUSD,
      advanceDepositRequiredUSD: advanceUSD,
      balanceDueUSD: balanceUSD,
      currentStage: "advance_payment_pending",
      inspectionAgency: {
        name: "QIMA Inspection India",
        status: "pending",
      },
      freightForwarder: {
        name: "Maersk Logistics India",
        portOfLoading: "Port of Mundra (INMUN)",
        portOfDischarge: rfq.destinationPort,
      },
      customsBroker: {
        brokerLicense: "CHA-MUNDRA-R-8841",
        letExportOrderGranted: false,
      },
      financialPayment: {
        advancePaymentStatus: "unpaid",
        balancePaymentStatus: "unpaid",
        reconciled: false,
        directPayeeMerchantId: mfg.paypalMerchantId || "PP_MERCHANT_DEFAULT",
      },
      createdAt: new Date().toISOString(),
      estimatedDeliveryDate: rfq.targetDeliveryDate,
    };

    this.trades.unshift(newTrade);
    this.saveToDisk();
    return newTrade;
  }

  public advanceMilestone(tradeId: string, milestoneId: string): TradeMilestone | undefined {
    const ms = this.milestones.find((m) => m.tradeOrderId === tradeId && m.id === milestoneId);
    if (ms) {
      ms.status = "completed";
      ms.completedAt = new Date().toISOString();
      this.saveToDisk();
    }
    return ms;
  }

  public updateSellerPackingAndCargo(params: {
    tradeId?: string;
    orderNumber?: string;
    packingStatus: "accepted" | "packing" | "packed" | "handed_to_govt_cargo" | "in_transit";
    govtCargoService: CommercialTradeOrder["freightForwarder"]["name"];
    trackingNumber?: string;
    buyerReassuranceNote?: string;
  }): { trade: CommercialTradeOrder; milestone: TradeMilestone } {
    const trade =
      (params.tradeId ? this.trades.find((t) => t.id === params.tradeId) : undefined) ||
      (params.orderNumber ? this.trades.find((t) => t.orderNumber === params.orderNumber) : undefined) ||
      this.trades[0];

    if (!trade) {
      throw new Error("No active trade order found");
    }

    const trackingNo =
      (params.trackingNumber || "").trim() ||
      `GOV-CARGO-${Date.now().toString().slice(-6)}`;
    const reassurance =
      (params.buyerReassuranceNote || "").trim() ||
      "Your order is safely packed, sealed in export-grade packaging, and handed over to Government Freight Cargo. You can relax — your goods are insured and on the way.";

    trade.freightForwarder = {
      ...trade.freightForwarder,
      name: params.govtCargoService,
      bookingReference: trackingNo,
    };

    if (params.packingStatus === "handed_to_govt_cargo" || params.packingStatus === "in_transit") {
      trade.currentStage = "customs_export_cleared";
    }

    trade.sellerDispatchUpdate = {
      packingStatus: params.packingStatus,
      govtCargoService: params.govtCargoService,
      trackingNumber: trackingNo,
      buyerReassuranceNote: reassurance,
      sealedAndSafe: true,
      updatedAt: new Date().toISOString(),
    };

    const milestone: TradeMilestone = {
      id: `ms_cargo_${Date.now()}`,
      tradeOrderId: trade.id,
      stage: "customs_export_cleared",
      title: `Order Packed & Safe · ${params.govtCargoService}`,
      description: `${reassurance} (Govt Cargo Ref: ${trackingNo})`,
      serviceProviderName: params.govtCargoService,
      completedAt: new Date().toISOString(),
      status: "completed",
    };

    const existingIdx = this.milestones.findIndex(
      (m) => m.tradeOrderId === trade.id && m.id.startsWith("ms_cargo_")
    );
    if (existingIdx >= 0) {
      this.milestones[existingIdx] = milestone;
    } else {
      this.milestones.push(milestone);
    }

    this.saveToDisk();
    return { trade, milestone };
  }
}

export const tradeStore = new TradeStore();

