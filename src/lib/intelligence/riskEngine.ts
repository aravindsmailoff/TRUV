import {
  CommercialTransaction,
  BusinessEntity,
  ManufacturingCapability,
  PayPalFinancialEvent,
  TransactionRiskAssessment,
  ExplainableRiskFinding,
} from "@/types/intelligence";

/**
 * Evaluates a commercial transaction and its counterparty entities against explainable rules.
 * Never generates arbitrary risk numbers; every observation is linked directly to evidence.
 */
export function analyzeTransactionRisk(
  transaction: CommercialTransaction,
  buyer?: BusinessEntity,
  seller?: BusinessEntity,
  capability?: ManufacturingCapability,
  financialEvents: PayPalFinancialEvent[] = []
): TransactionRiskAssessment {
  const findings: ExplainableRiskFinding[] = [];
  let checksConducted = 0;
  let checksPassed = 0;

  // 1. Business Identity Verification Checks
  checksConducted++;
  if (!seller) {
    findings.push({
      id: "risk_seller_missing",
      issue: "Unregistered Seller Entity",
      whyItMatters: "Counterparty has no registered entity record on file, making legal recourse impossible in dispute scenarios.",
      supportingEvidence: `Seller ID ${transaction.sellerId} not found in verified merchant registry.`,
      riskCategory: "identity_inconsistency",
      severity: "critical",
      recommendedAction: "Require seller to complete corporate registry verification before funds transfer.",
      limitations: "Checked against current network entity registry.",
    });
  } else if (seller.verificationStatus !== "verified_evidence") {
    findings.push({
      id: "risk_seller_unverified",
      issue: `Seller Verification Status: ${seller.verificationStatus.replace("_", " ").toUpperCase()}`,
      whyItMatters: "The seller entity has uploaded documents or initiated onboarding, but independent third-party evidence has not yet ratified government filings.",
      supportingEvidence: seller.verificationEvidence.notes || "Registry cross-check still in progress.",
      riskCategory: "identity_inconsistency",
      severity: "medium",
      recommendedAction: "Request verified DGFT IEC or GST certificate with matching corporate bank statement.",
      limitations: "Self-declared business data without independent registry confirmation.",
    });
  } else {
    checksPassed++;
  }

  // 2. Commercial Document Consistency (PO vs Invoice)
  checksConducted++;
  const poDoc = transaction.documents.find((d) => d.type === "purchase_order");
  const invDoc = transaction.documents.find((d) => d.type === "commercial_invoice");

  if (poDoc && invDoc) {
    if (poDoc.declaredAmount && invDoc.declaredAmount && poDoc.declaredAmount !== invDoc.declaredAmount) {
      findings.push({
        id: "risk_doc_amount_mismatch",
        issue: "Discrepancy in Declared Transaction Amount Between PO and Invoice",
        whyItMatters: "Discrepancies in invoice amounts lead to customs clearance delays, export duty re-assessments, and cross-border payment holdbacks.",
        supportingEvidence: `PO declares ${transaction.currency} ${poDoc.declaredAmount.toLocaleString()} while Invoice declares ${transaction.currency} ${invDoc.declaredAmount.toLocaleString()}.`,
        riskCategory: "document_discrepancy",
        severity: "high",
        recommendedAction: "Issue an amended invoice or credit note aligning the values prior to customs submission.",
        limitations: "Calculated directly from uploaded OCR extracted document payloads.",
      });
    } else {
      checksPassed++;
    }
  } else if (!poDoc || !invDoc) {
    findings.push({
      id: "risk_doc_missing",
      issue: "Incomplete Bilateral Commercial Documentation",
      whyItMatters: "Both a formally countersigned Purchase Order and a Commercial Proforma Invoice are required under UCP 600 export norms to protect either party.",
      supportingEvidence: `Present: ${transaction.documents.map((d) => d.type).join(", ") || "None"}. Missing: ${!poDoc ? "Purchase Order" : ""} ${!invDoc ? "Commercial Invoice" : ""}.`,
      riskCategory: "missing_evidence",
      severity: "medium",
      recommendedAction: "Upload the matching countersigned commercial instrument.",
      limitations: "Document presence based on uploaded files in the transaction dossier.",
    });
  }

  // 3. Manufacturing Capability & Capacity Cross-Check
  checksConducted++;
  if (capability) {
    if (capability.productionCapacityMonthlyUnits < transaction.quantityUnits) {
      findings.push({
        id: "risk_capacity_overload",
        issue: "Order Volume Exceeds Verified Monthly Production Capacity",
        whyItMatters: "Accepting purchase orders beyond verified plant capacity results in unannounced subcontracting or production delays.",
        supportingEvidence: `Order quantity is ${transaction.quantityUnits.toLocaleString()} units, but seller verified plant capacity is ${capability.productionCapacityMonthlyUnits.toLocaleString()} units/month.`,
        riskCategory: "capability_mismatch",
        severity: "high",
        recommendedAction: "Structure delivery into phased partial shipments or request verification of authorized tier-2 manufacturing partners.",
        limitations: "Based on last verified factory audit capacity data.",
      });
    } else {
      checksPassed++;
    }
  }

  // 4. Financial Transaction (PayPal) & Advance Deposit Reconciliation
  checksConducted++;
  const completedPayPalEvents = financialEvents.filter((e) => e.status === "COMPLETED");
  const totalPaid = completedPayPalEvents.reduce((acc, curr) => acc + parseFloat(curr.amount.value || "0"), 0);

  if (transaction.paymentTerms.includes("30% Advance") || transaction.paymentTerms.includes("Advance")) {
    const requiredAdvance = transaction.totalAmount * 0.3;
    if (totalPaid < requiredAdvance) {
      findings.push({
        id: "risk_advance_deposit_unmet",
        issue: "Agreed Advance Payment Not Yet Confirmed",
        whyItMatters: "Manufacturing initiation prior to deposit confirmation increases seller exposure to order cancellation.",
        supportingEvidence: `Required 30% advance is ${transaction.currency} ${requiredAdvance.toFixed(2)}, but verified PayPal payment total is ${transaction.currency} ${totalPaid.toFixed(2)}.`,
        riskCategory: "payment_anomaly",
        severity: "medium",
        recommendedAction: "Ensure buyer initiates the advance deposit via verified PayPal checkout link.",
        limitations: "PayPal webhook real-time event status.",
      });
    } else {
      checksPassed++;
    }
  } else {
    checksPassed++;
  }

  // Overall Health Classification
  const hasCritical = findings.some((f) => f.severity === "critical");
  const hasHigh = findings.some((f) => f.severity === "high");
  const hasMedium = findings.some((f) => f.severity === "medium");

  let overallHealth: TransactionRiskAssessment["overallHealth"] = "clean";
  if (hasCritical || hasHigh) {
    overallHealth = "action_required";
  } else if (hasMedium) {
    overallHealth = "low_risk";
  }

  return {
    transactionId: transaction.id,
    overallHealth,
    findings,
    assessedAt: new Date().toISOString(),
    analyzedDocumentsCount: transaction.documents.length,
    dataConsistencyChecksPassed: checksPassed,
    totalChecksConducted: checksConducted,
  };
}

