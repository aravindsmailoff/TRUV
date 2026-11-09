/**
 * Global Transaction Intelligence Network - Core Domain Types
 */

export type VerificationStatus =
  | "unverified"
  | "in_progress"
  | "verified_evidence"
  | "verification_failed"
  | "evidence_expired";

export type UserRole = "buyer" | "seller" | "admin";

export type EvidenceSourceType =
  | "confirmed"
  | "third_party"
  | "user_submitted"
  | "ai_generated"
  | "unverified";

export type RiskSeverity = "low" | "medium" | "high" | "critical";

export type RiskCategory =
  | "identity_inconsistency"
  | "capability_mismatch"
  | "document_discrepancy"
  | "payment_anomaly"
  | "performance_history"
  | "missing_evidence";

export interface BusinessDocument {
  id: string;
  name: string;
  type: "gst_certificate" | "iec_certificate" | "iso_certification" | "factory_audit" | "bank_statement" | "export_license";
  documentUrl: string;
  uploadedAt: string;
  expiresAt?: string;
  verificationStatus: VerificationStatus;
  extractedData?: Record<string, unknown>;
  verifiedAgainst?: string;
}

export interface BusinessEntity {
  id: string;
  legalName: string;
  tradeName: string;
  country: string;
  registrationNumber: string;
  gstin?: string;
  iecCode?: string; // Importer-Exporter Code
  role: UserRole;
  verificationStatus: VerificationStatus;
  verificationEvidence: {
    verifiedAt?: string;
    verifiedBy?: string;
    checkedRegistries: string[];
    notes: string;
  };
  documents: BusinessDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface ManufacturingCapability {
  businessId: string;
  categories: string[];
  primaryProducts: string[];
  productionCapacityMonthlyUnits: number;
  machineryAndEquipment: string[];
  certifications: {
    name: string;
    issuer: string;
    issuedDate: string;
    expiryDate: string;
    isVerified: boolean;
  }[];
  exportExperienceYears: number;
  standardLeadTimeDays: number;
  qualityInspectionReportsCount: number;
  independentAuditScore?: number; // 0 - 100
}

export interface CommercialTransaction {
  id: string;
  transactionReference: string;
  buyerId: string;
  sellerId: string;
  productDescription: string;
  agreedSpecifications: string[];
  quantityUnits: number;
  unitPrice: number;
  totalAmount: number;
  currency: string;
  deliveryTerms: "FOB" | "CIF" | "EXW" | "DDP" | "CFR";
  paymentTerms: "100% Advance" | "30% Advance, 70% Upon BL" | "Letter of Credit" | "Net 30 via PayPal";
  purchaseOrderNumber?: string;
  commercialInvoiceNumber?: string;
  documents: {
    type: "purchase_order" | "commercial_invoice" | "bill_of_lading" | "inspection_certificate" | "packing_list";
    name: string;
    url: string;
    declaredAmount?: number;
    declaredQuantity?: number;
    uploadedAt: string;
  }[];
  status: "draft" | "submitted" | "assessing" | "approved" | "in_fulfillment" | "completed" | "disputed";
  createdAt: string;
  updatedAt: string;
}

export interface PayPalFinancialEvent {
  id: string;
  commercialTransactionId: string;
  paypalOrderId: string;
  paypalCaptureId?: string;
  status: "CREATED" | "SAVED" | "APPROVED" | "VOIDED" | "COMPLETED" | "REFUNDED" | "DISPUTED";
  amount: {
    currencyCode: string;
    value: string;
  };
  payerEmail?: string;
  payeeMerchantId?: string;
  rawWebhookPayload?: Record<string, unknown>;
  reconciled: boolean;
  disputeDetails?: {
    disputeId: string;
    reason: string;
    status: string;
    amountDisputed: string;
  };
  refundDetails?: {
    refundId: string;
    amountRefunded: string;
    reason: string;
  };
  createdAt: string;
}

export interface TransactionMilestone {
  id: string;
  transactionId: string;
  title: string;
  stage: "order_created" | "production" | "pre_shipment_inspection" | "dispatch" | "customs_export" | "delivery" | "payment_cleared";
  status: "pending" | "in_progress" | "verified" | "flagged";
  sourceType: EvidenceSourceType;
  evidenceReference?: string;
  notes: string;
  timestamp: string;
}

export interface ExplainableRiskFinding {
  id: string;
  issue: string;
  whyItMatters: string;
  supportingEvidence: string;
  riskCategory: RiskCategory;
  severity: RiskSeverity;
  recommendedAction: string;
  limitations: string;
}

export interface TransactionRiskAssessment {
  transactionId: string;
  overallHealth: "clean" | "low_risk" | "action_required" | "high_risk";
  findings: ExplainableRiskFinding[];
  assessedAt: string;
  analyzedDocumentsCount: number;
  dataConsistencyChecksPassed: number;
  totalChecksConducted: number;
}

export interface TransactionGraphNode {
  id: string;
  label: string;
  type: "business" | "product" | "po" | "payment" | "inspection" | "shipment";
  metadata: Record<string, unknown>;
}

export interface TransactionGraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: "ISSUED" | "FULFILLED_BY" | "FUNDED_VIA" | "INSPECTED_BY" | "DELIVERED_TO" | "DISPUTED_WITH";
  weight: number;
  evidenceStatus: EvidenceSourceType;
}

