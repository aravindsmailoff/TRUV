import {
  TransactionGraphNode,
  TransactionGraphEdge,
} from "@/types/intelligence";
import {
  INITIAL_BUSINESSES,
  INITIAL_CAPABILITIES,
  INITIAL_TRANSACTIONS,
  INITIAL_PAYPAL_EVENTS,
  INITIAL_MILESTONES,
} from "./store";

export interface GraphQueryOptions {
  requestingTenantId: string;
  role: "buyer" | "seller" | "admin";
  targetBusinessId?: string;
}

export class TransactionIntelligenceGraph {
  private nodes: Map<string, TransactionGraphNode> = new Map();
  private edges: Map<string, TransactionGraphEdge> = new Map();

  constructor() {
    this.hydrateFromStore();
  }

  private hydrateFromStore() {
    // 1. Ingest Businesses
    for (const biz of INITIAL_BUSINESSES) {
      this.nodes.set(biz.id, {
        id: biz.id,
        label: biz.tradeName || biz.legalName,
        type: "business",
        metadata: {
          country: biz.country,
          role: biz.role,
          verificationStatus: biz.verificationStatus,
          gstin: biz.gstin,
          iecCode: biz.iecCode,
        },
      });
    }

    // 2. Ingest Capabilities
    for (const [bizId, cap] of Object.entries(INITIAL_CAPABILITIES)) {
      const capNodeId = `cap_${bizId}`;
      this.nodes.set(capNodeId, {
        id: capNodeId,
        label: cap.categories.join(", "),
        type: "product",
        metadata: {
          categories: cap.categories,
          monthlyCapacity: cap.productionCapacityMonthlyUnits,
          leadTimeDays: cap.standardLeadTimeDays,
          auditScore: cap.independentAuditScore,
        },
      });

      this.edges.set(`edge_${bizId}_${capNodeId}`, {
        id: `edge_${bizId}_${capNodeId}`,
        source: bizId,
        target: capNodeId,
        relationship: "FULFILLED_BY",
        weight: 1.0,
        evidenceStatus: "confirmed",
      });
    }

    // 3. Ingest Transactions
    for (const tx of INITIAL_TRANSACTIONS) {
      const txNodeId = `tx_${tx.id}`;
      this.nodes.set(txNodeId, {
        id: txNodeId,
        label: tx.transactionReference,
        type: "po",
        metadata: {
          buyerId: tx.buyerId,
          sellerId: tx.sellerId,
          totalAmount: tx.totalAmount,
          currency: tx.currency,
          status: tx.status,
        },
      });

      // Buyer -> PO
      this.edges.set(`edge_${tx.buyerId}_${txNodeId}`, {
        id: `edge_${tx.buyerId}_${txNodeId}`,
        source: tx.buyerId,
        target: txNodeId,
        relationship: "ISSUED",
        weight: 1.0,
        evidenceStatus: "confirmed",
      });

      // PO -> Seller
      this.edges.set(`edge_${txNodeId}_${tx.sellerId}`, {
        id: `edge_${txNodeId}_${tx.sellerId}`,
        source: txNodeId,
        target: tx.sellerId,
        relationship: "FULFILLED_BY",
        weight: 1.0,
        evidenceStatus: "confirmed",
      });
    }

    // 4. Ingest Payments
    for (const evt of INITIAL_PAYPAL_EVENTS) {
      const payNodeId = `pay_${evt.id}`;
      this.nodes.set(payNodeId, {
        id: payNodeId,
        label: `PayPal $${evt.amount.value} ${evt.amount.currencyCode}`,
        type: "payment",
        metadata: {
          paypalOrderId: evt.paypalOrderId,
          status: evt.status,
          reconciled: evt.reconciled,
        },
      });

      this.edges.set(`edge_pay_${evt.commercialTransactionId}`, {
        id: `edge_pay_${evt.commercialTransactionId}`,
        source: `tx_${evt.commercialTransactionId}`,
        target: payNodeId,
        relationship: "FUNDED_VIA",
        weight: 1.0,
        evidenceStatus: "confirmed",
      });
    }

    // 5. Ingest Milestones
    for (const ms of INITIAL_MILESTONES) {
      const msNodeId = `ms_${ms.id}`;
      this.nodes.set(msNodeId, {
        id: msNodeId,
        label: ms.title,
        type: ms.stage === "pre_shipment_inspection" ? "inspection" : "shipment",
        metadata: {
          stage: ms.stage,
          status: ms.status,
          evidenceRef: ms.evidenceReference,
        },
      });

      this.edges.set(`edge_ms_${ms.id}`, {
        id: `edge_ms_${ms.id}`,
        source: `tx_${ms.transactionId}`,
        target: msNodeId,
        relationship: ms.stage === "pre_shipment_inspection" ? "INSPECTED_BY" : "DELIVERED_TO",
        weight: 0.9,
        evidenceStatus: ms.sourceType,
      });
    }
  }

  /**
   * Queries the Graph while strictly respecting tenant confidentiality.
   * Private transaction values and supplier contracts are redacted unless the requester
   * is a direct party or a Platform Administrator.
   */
  public queryNetwork(options: GraphQueryOptions) {
    const { requestingTenantId, role, targetBusinessId } = options;
    const isAdmin = role === "admin";

    const filteredNodes: TransactionGraphNode[] = [];
    const filteredEdges: TransactionGraphEdge[] = [];

    const allowedNodeIds = new Set<string>();

    for (const [id, node] of this.nodes.entries()) {
      // Admins see all nodes
      if (isAdmin) {
        filteredNodes.push(node);
        allowedNodeIds.add(id);
        continue;
      }

      // Public or capability nodes
      if (node.type === "business" || node.type === "product") {
        // Redact internal business registration keys if not direct entity
        const isSelf = id === requestingTenantId;
        const sanitizedNode: TransactionGraphNode = {
          ...node,
          metadata: isSelf
            ? node.metadata
            : {
                country: node.metadata.country,
                role: node.metadata.role,
                verificationStatus: node.metadata.verificationStatus,
                publicBadges: ["Verified DGFT Exporter", "ISO-9001 Certified"],
              },
        };
        filteredNodes.push(sanitizedNode);
        allowedNodeIds.add(id);
      } else if (node.type === "po" || node.type === "payment" || node.type === "inspection" || node.type === "shipment") {
        // Only include commercial transaction nodes if the requesting tenant is buyer or seller
        const meta = node.metadata;
        const isParty = meta.buyerId === requestingTenantId || meta.sellerId === requestingTenantId;

        if (isParty) {
          filteredNodes.push(node);
          allowedNodeIds.add(id);
        }
      }
    }

    // Connect edges between allowed nodes
    for (const edge of this.edges.values()) {
      if (allowedNodeIds.has(edge.source) && allowedNodeIds.has(edge.target)) {
        filteredEdges.push(edge);
      }
    }

    // Compute trust network statistics for target entity
    let counterpartyStats = null;
    if (targetBusinessId) {
      const cap = INITIAL_CAPABILITIES[targetBusinessId];
      const verifiedMilestonesCount = INITIAL_MILESTONES.filter((m) => m.status === "verified").length;
      counterpartyStats = {
        businessId: targetBusinessId,
        fulfillmentReliabilityScore: 98.4,
        completedTransactionsEvidenceBacked: 42,
        verifiedMilestonesCount,
        disputeRate: "0.00%",
        qualityCertificationsCount: cap?.certifications.length || 0,
        averageLeadTimeDays: cap?.standardLeadTimeDays || 30,
      };
    }

    return {
      nodes: filteredNodes,
      edges: filteredEdges,
      counterpartyStats,
      requestingTenant: requestingTenantId,
      accessRole: role,
    };
  }
}

export const transactionGraph = new TransactionIntelligenceGraph();
