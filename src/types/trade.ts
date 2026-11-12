/**
 * Global Trade Execution Infrastructure - Domain Types
 * Models the complete International Buyer -> Indian Manufacturer -> Commercial RFQ ->
 * Supplier Qualification -> Quotation Negotiation -> PayPal Payment -> Export Execution workflow.
 */

export type TradeLifecycleStage =
  | "rfq_submitted"
  | "supplier_shortlisted"
  | "quotation_review"
  | "po_confirmed"
  | "advance_payment_pending"
  | "production_in_progress"
  | "inspection_scheduled"
  | "customs_export_cleared"
  | "in_transit"
  | "delivered_and_settled";

export interface BuyerRFQ {
  id: string;
  rfqNumber: string;
  buyerName: string;
  buyerCompany: string;
  buyerCountry: string;
  buyerEmail: string;
  productCategory: "Precision Castings & Brass" | "Textiles & Organic Apparel" | "Machined Engineering Components" | "Leather Goods" | "Auto Ancillaries";
  productName: string;
  technicalSpecifications: string[];
  targetQuantity: number;
  targetPricePerUnit: number;
  currency: string;
  targetDeliveryDate: string;
  destinationPort: string;
  status: "open" | "evaluating" | "quoted" | "contracted" | "fulfilled";
  createdAt: string;
}

export interface IndianManufacturer {
  id: string;
  legalEntityName: string;
  tradeName: string;
  hubLocation: "Moradabad, UP" | "Ludhiana / Tirupur, TN" | "Rajkot / Pune, MH" | "Coimbatore, TN" | "Jalandhar, PB";
  msmeCategory: "Micro" | "Small" | "Medium";
  udyamRegistrationNumber: string;
  iecCode: string; // Importer-Exporter Code
  gstin: string;
  primaryCategories: string[];
  monthlyCapacityUnits: number;
  factoryAudited: boolean;
  auditedBy?: string;
  certifications: string[];
  exportExperienceYears: number;
  leadTimeDays: number;
  paypalMerchantId?: string;
  paypalEmail?: string;
  verifiedProductionLines: string[];
  readinessScore: number; // 0 - 100 based on verified compliance & capability
}

export interface ManufacturerQuotation {
  id: string;
  rfqId: string;
  manufacturerId: string;
  manufacturerName: string;
  pricePerUnit: number;
  currency: string;
  totalQuotationAmount: number;
  incoterms: "FOB Mumbai" | "FOB Mundra" | "CIF Los Angeles" | "EXW Factory" | "CFR Rotterdam";
  leadTimeDays: number;
  validUntil: string;
  specificationsConfirmed: string[];
  sampleAvailabilityDays: number;
  commercialTermsNotes: string;
  status: "draft" | "submitted" | "under_review" | "buyer_accepted" | "counter_offered" | "rejected";
  submittedAt: string;
}

export interface CommercialTradeOrder {
  id: string;
  orderNumber: string;
  rfqId: string;
  buyerCompany: string;
  buyerCountry: string;
  manufacturerId: string;
  manufacturerName: string;
  productName: string;
  quantityUnits: number;
  totalAmountUSD: number;
  advanceDepositRequiredUSD: number; // 30% advance deposit
  balanceDueUSD: number; // 70% upon Bill of Lading
  currentStage: TradeLifecycleStage;
  // Execution Partners Coordinates
  inspectionAgency: {
    name: "QIMA Inspection India" | "SGS India" | "Bureau Veritas";
    status: "pending" | "scheduled" | "passed" | "rectification_required";
    reportNumber?: string;
  };
  freightForwarder: {
    name:
      | "CONCOR (Container Corp of India - Govt. of India)"
      | "Shipping Corporation of India (SCI - Govt. of India)"
      | "India Post International Cargo (Govt. of India)"
      | "JNPT / Mundra Port Authority (Govt. of India)"
      | "Maersk Logistics India"
      | "DHL Global Forwarding"
      | "Kuehne+Nagel India";
    bookingReference?: string;
    vesselVoyage?: string;
    containerNumber?: string;
    portOfLoading: string;
    portOfDischarge: string;
  };
  sellerDispatchUpdate?: {
    packingStatus: "accepted" | "packing" | "packed" | "handed_to_govt_cargo" | "in_transit";
    govtCargoService: string;
    trackingNumber: string;
    buyerReassuranceNote: string;
    sealedAndSafe: boolean;
    updatedAt: string;
  };
  customsBroker: {
    brokerLicense: string;
    shippingBillNumber?: string;
    letExportOrderGranted: boolean;
  };
  // PayPal Direct Settlement Linkage
  financialPayment: {
    paypalOrderId?: string;
    paypalCaptureId?: string;
    advancePaymentStatus: "unpaid" | "initiated" | "cleared" | "disputed";
    balancePaymentStatus: "unpaid" | "initiated" | "cleared";
    reconciled: boolean;
    directPayeeMerchantId: string;
  };
  createdAt: string;
  estimatedDeliveryDate: string;
}

export interface TradeMilestone {
  id: string;
  tradeOrderId: string;
  stage: TradeLifecycleStage;
  title: string;
  description: string;
  serviceProviderName: string; // e.g. "DGFT Gateway", "PayPal Inc.", "QIMA India", "Maersk"
  evidenceDocumentUrl?: string;
  completedAt?: string;
  status: "completed" | "in_progress" | "pending";
}

