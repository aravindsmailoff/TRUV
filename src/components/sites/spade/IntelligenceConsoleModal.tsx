"use client";

import React, { useState } from "react";
import { INITIAL_BUSINESSES, INITIAL_TRANSACTIONS, INITIAL_CAPABILITIES, INITIAL_PAYPAL_EVENTS, INITIAL_MILESTONES } from "@/lib/intelligence/store";
import { analyzeTransactionRisk } from "@/lib/intelligence/riskEngine";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function IntelligenceConsoleModal({ isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<"verify" | "transactions" | "paypal" | "graph" | "admin">("verify");
  const [selectedTxId, setSelectedTxId] = useState<string>("tx_global_9921");
  const [selectedBizId, setSelectedBizId] = useState<string>("biz_in_textiles_01");

  // Live interactive transaction simulation
  const [poAmount, setPoAmount] = useState<number>(142500);
  const [invoiceAmount, setInvoiceAmount] = useState<number>(142500);
  const [quantity, setQuantity] = useState<number>(5000);

  // Role toggle
  const [currentRole, setCurrentRole] = useState<"buyer" | "seller" | "admin">("buyer");

  if (!isOpen) return null;

  const currentBiz = INITIAL_BUSINESSES.find((b) => b.id === selectedBizId) || INITIAL_BUSINESSES[0];
  const currentCapability = INITIAL_CAPABILITIES[selectedBizId];
  const baseTx = INITIAL_TRANSACTIONS.find((t) => t.id === selectedTxId) || INITIAL_TRANSACTIONS[0];

  // Dynamic transaction with simulator overrides
  const simulatedTx = {
    ...baseTx,
    quantityUnits: quantity,
    totalAmount: invoiceAmount,
    documents: [
      {
        type: "purchase_order" as const,
        name: "PO_Live_Extract.pdf",
        url: "#",
        declaredAmount: poAmount,
        declaredQuantity: quantity,
        uploadedAt: new Date().toISOString(),
      },
      {
        type: "commercial_invoice" as const,
        name: "Invoice_Live_Extract.pdf",
        url: "#",
        declaredAmount: invoiceAmount,
        declaredQuantity: quantity,
        uploadedAt: new Date().toISOString(),
      },
    ],
  };

  const sellerEntity = INITIAL_BUSINESSES.find((b) => b.id === simulatedTx.sellerId);
  const buyerEntity = INITIAL_BUSINESSES.find((b) => b.id === simulatedTx.buyerId);
  const riskAssessment = analyzeTransactionRisk(simulatedTx, buyerEntity, sellerEntity, currentCapability, INITIAL_PAYPAL_EVENTS);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#121c0b] border border-[#2d421d] text-white shadow-2xl rounded-2xl overflow-hidden font-sans"
        style={{ "--corner-size-desktop": "14px", "--corner-size-mobile": "10px" } as React.CSSProperties}
      >
        {/* Chamfered Cut Corners */}
        <div className="pointer-events-none absolute inset-0 z-20">
          <div className="cut-corner absolute bg-black/75" style={{ top: "-1px", left: "-1px", clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
          <div className="cut-corner absolute bg-black/75" style={{ top: "-1px", right: "-1px", clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
          <div className="cut-corner absolute bg-black/75" style={{ bottom: "-1px", left: "-1px", clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />
          <div className="cut-corner absolute bg-black/75" style={{ bottom: "-1px", right: "-1px", clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }} />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d421d] bg-[#18280e]">
          <div className="flex items-center gap-3">
            <span className="size-2.5 rounded-full bg-[#b2eb76] animate-pulse" />
            <h3 className="text-base font-semibold tracking-tight text-[#b2eb76] font-mono uppercase">
              Global Transaction Intelligence Network
            </h3>
            <span className="text-xs px-2 py-0.5 rounded border border-[#3b5424] bg-[#223514] text-stone-300 font-mono">
              Role: {currentRole.toUpperCase()}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white transition-colors size-8 flex items-center justify-center rounded-lg hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Sub-Header Tabs */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-[#2d421d] bg-[#14200c] overflow-x-auto text-xs font-mono">
          <div className="flex items-center gap-2">
            {[
              { id: "verify", label: "A. Business Identity" },
              { id: "transactions", label: "C. Commercial Intelligence" },
              { id: "paypal", label: "D. Financial (PayPal)" },
              { id: "graph", label: "4. Intelligence Graph" },
              { id: "admin", label: "5. Admin & RBAC" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3 py-1.5 rounded transition-all select-none whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#b2eb76] text-[#18280e] font-bold shadow-xs"
                    : "text-stone-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Role Switcher */}
          <div className="flex items-center gap-1 shrink-0 ml-4">
            <span className="text-[11px] text-stone-500 mr-1">Switch:</span>
            {(["buyer", "seller", "admin"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setCurrentRole(r)}
                className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                  currentRole === r
                    ? "bg-[#334c1f] text-[#b2eb76] border border-[#b2eb76]/40"
                    : "text-stone-500 hover:text-stone-300"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed">
          {/* TAB A: Business Identity & Capability */}
          {activeTab === "verify" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#18280e] border border-[#2d421d]">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-[#b2eb76] uppercase">Counterparty Profile</span>
                    <select
                      value={selectedBizId}
                      onChange={(e) => setSelectedBizId(e.target.value)}
                      className="bg-[#121c0b] border border-[#2d421d] rounded px-2.5 py-1 text-xs text-[#b2eb76] font-mono focus:outline-none cursor-pointer"
                    >
                      {INITIAL_BUSINESSES.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.tradeName} ({b.country})
                        </option>
                      ))}
                    </select>
                  </div>
                  <h4 className="text-lg font-bold text-white mt-0.5">{currentBiz.legalName}</h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {currentBiz.tradeName} • {currentBiz.country}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-mono font-medium ${
                      currentBiz.verificationStatus === "verified_evidence"
                        ? "bg-[#256c38] text-white border border-[#3cb35c]"
                        : "bg-amber-950/60 text-amber-300 border border-amber-600/50"
                    }`}
                  >
                    {currentBiz.verificationStatus.replace("_", " ").toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Identity & Registry Check Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#14200c] border border-[#2d421d]">
                  <div className="text-xs font-mono text-stone-400">DGFT IEC Code (India)</div>
                  <div className="text-base font-bold text-[#b2eb76] font-mono mt-1">
                    {currentBiz.iecCode || "N/A"}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">Status: Active & Verified on DGFT</div>
                </div>

                <div className="p-4 rounded-xl bg-[#14200c] border border-[#2d421d]">
                  <div className="text-xs font-mono text-stone-400">GSTIN / Tax ID</div>
                  <div className="text-base font-bold text-[#b2eb76] font-mono mt-1">
                    {currentBiz.gstin || currentBiz.registrationNumber}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">Filing status: 24 Quarters Compliant</div>
                </div>

                <div className="p-4 rounded-xl bg-[#14200c] border border-[#2d421d]">
                  <div className="text-xs font-mono text-stone-400">Export Track Record</div>
                  <div className="text-base font-bold text-white font-mono mt-1">
                    {currentCapability?.exportExperienceYears || 10} Years
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">Audit Score: {currentCapability?.independentAuditScore || 90}/100</div>
                </div>
              </div>

              {/* Manufacturing Capabilities */}
              {currentCapability && (
                <div className="p-4 rounded-xl bg-[#18280e] border border-[#2d421d] space-y-3">
                  <h5 className="font-semibold text-[#b2eb76] font-mono text-xs uppercase">
                    Verified Manufacturing Capabilities
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-stone-400">Categories:</span>
                      <div className="text-stone-200 mt-0.5">{currentCapability.categories.join(", ")}</div>
                    </div>
                    <div>
                      <span className="text-stone-400">Monthly Plant Capacity:</span>
                      <div className="text-stone-200 mt-0.5 font-mono">
                        {currentCapability.productionCapacityMonthlyUnits.toLocaleString()} units / month
                      </div>
                    </div>
                    <div>
                      <span className="text-stone-400">Machinery & Lines:</span>
                      <div className="text-stone-200 mt-0.5">{currentCapability.machineryAndEquipment.join("; ")}</div>
                    </div>
                    <div>
                      <span className="text-stone-400">Standard Production Lead Time:</span>
                      <div className="text-stone-200 mt-0.5 font-mono">{currentCapability.standardLeadTimeDays} days</div>
                    </div>
                  </div>

                  {/* Certifications with Expiry */}
                  <div className="pt-2 border-t border-[#2d421d]">
                    <div className="text-xs font-mono text-stone-400 mb-2">Quality & Social Audit Certifications:</div>
                    <div className="flex flex-wrap gap-2">
                      {currentCapability.certifications.map((c) => (
                        <div
                          key={c.name}
                          className="px-2.5 py-1 rounded bg-[#121c0b] border border-[#3b5424] text-[11px] flex items-center gap-1.5"
                        >
                          <span className="text-[#b2eb76]">✓</span>
                          <span>{c.name}</span>
                          <span className="text-stone-500 font-mono">(Exp: {c.expiryDate})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB C: Commercial Transaction Intelligence & AI Discrepancy Analyzer */}
          {activeTab === "transactions" && (
            <div className="space-y-6">
              {/* Interactive Simulation Bar */}
              <div className="p-4 rounded-xl bg-[#18280e] border border-[#2d421d] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#b2eb76] uppercase">
                      Commercial Transaction:
                    </span>
                    <select
                      value={selectedTxId}
                      onChange={(e) => {
                        setSelectedTxId(e.target.value);
                        const t = INITIAL_TRANSACTIONS.find((tx) => tx.id === e.target.value);
                        if (t) {
                          setPoAmount(t.totalAmount);
                          setInvoiceAmount(t.totalAmount);
                          setQuantity(t.quantityUnits);
                        }
                      }}
                      className="bg-[#121c0b] border border-[#2d421d] rounded px-2.5 py-1 text-xs text-[#b2eb76] font-mono focus:outline-none cursor-pointer"
                    >
                      {INITIAL_TRANSACTIONS.map((tx) => (
                        <option key={tx.id} value={tx.id}>
                          {tx.transactionReference} ({tx.currency} {tx.totalAmount.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="text-[11px] text-stone-400">
                    Adjust PO vs Invoice amounts to test real-time AI risk detection
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div>
                    <label className="text-stone-400 block mb-1">PO Declared Amount ($)</label>
                    <input
                      type="number"
                      value={poAmount}
                      onChange={(e) => setPoAmount(Number(e.target.value))}
                      className="w-full bg-[#121c0b] border border-[#2d421d] rounded px-3 py-1.5 text-white focus:outline-none focus:border-[#b2eb76]"
                    />
                  </div>
                  <div>
                    <label className="text-stone-400 block mb-1">Invoice Declared Amount ($)</label>
                    <input
                      type="number"
                      value={invoiceAmount}
                      onChange={(e) => setInvoiceAmount(Number(e.target.value))}
                      className="w-full bg-[#121c0b] border border-[#2d421d] rounded px-3 py-1.5 text-white focus:outline-none focus:border-[#b2eb76]"
                    />
                  </div>
                  <div>
                    <label className="text-stone-400 block mb-1">Order Quantity (Units)</label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full bg-[#121c0b] border border-[#2d421d] rounded px-3 py-1.5 text-white focus:outline-none focus:border-[#b2eb76]"
                    />
                  </div>
                </div>
              </div>

              {/* Explainable AI Risk Findings */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-semibold text-white font-mono text-xs uppercase flex items-center gap-2">
                    <span>AI Risk Intelligence Engine Assessment</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                        riskAssessment.overallHealth === "clean"
                          ? "bg-green-900/60 text-green-300 border border-green-600"
                          : riskAssessment.overallHealth === "low_risk"
                          ? "bg-blue-900/60 text-blue-300 border border-blue-600"
                          : "bg-amber-900/60 text-amber-300 border border-amber-600"
                      }`}
                    >
                      {riskAssessment.overallHealth.replace("_", " ")}
                    </span>
                  </h5>
                  <span className="text-xs font-mono text-stone-400">
                    {riskAssessment.dataConsistencyChecksPassed} / {riskAssessment.totalChecksConducted} checks passed
                  </span>
                </div>

                {riskAssessment.findings.length === 0 ? (
                  <div className="p-4 rounded-xl bg-[#14200c] border border-green-800/40 text-xs text-green-300 flex items-center gap-2">
                    <span>✓</span>
                    <span>No commercial or identity discrepancies found. All declared values and registry records match.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {riskAssessment.findings.map((f) => (
                      <div
                        key={f.id}
                        className={`p-4 rounded-xl border text-xs space-y-2 ${
                          f.severity === "high" || f.severity === "critical"
                            ? "bg-red-950/30 border-red-800/60 text-red-100"
                            : "bg-amber-950/20 border-amber-700/50 text-amber-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold flex items-center gap-1.5">
                            <span>⚠</span>
                            <span>{f.issue}</span>
                          </span>
                          <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-black/40 border border-white/10">
                            {f.riskCategory.replace("_", " ")} • {f.severity}
                          </span>
                        </div>
                        <div className="text-stone-300">
                          <strong className="text-white">Why it matters:</strong> {f.whyItMatters}
                        </div>
                        <div className="text-stone-300 font-mono text-[11px] bg-black/30 p-2 rounded">
                          <strong className="text-[#b2eb76]">Evidence:</strong> {f.supportingEvidence}
                        </div>
                        <div className="text-stone-200">
                          <strong className="text-[#b2eb76]">Recommended Action:</strong> {f.recommendedAction}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB D: PayPal Financial Transaction Intelligence */}
          {activeTab === "paypal" && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#18280e] border border-[#2d421d] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-[#b2eb76] uppercase">PayPal Financial Layer</div>
                  <h4 className="text-base font-bold text-white mt-0.5">Orders v2 & Webhook Synchronization</h4>
                  <p className="text-xs text-stone-400 mt-1">
                    Environment: <span className="font-mono text-[#b2eb76]">Sandbox Ready / Live Configurable</span>
                  </p>
                </div>
                <div className="text-[11px] text-stone-400 max-w-xs text-right">
                  Associates payment events with commercial transactions. Does not guarantee product quality.
                </div>
              </div>

              {/* Financial Status Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#14200c] border border-[#2d421d]">
                  <div className="text-xs font-mono text-stone-400">Commercial PO Value</div>
                  <div className="text-lg font-bold text-white font-mono mt-1">$142,500.00 USD</div>
                  <div className="text-[11px] text-stone-400 mt-1">Terms: 30% Advance, 70% Upon BL</div>
                </div>

                <div className="p-4 rounded-xl bg-[#14200c] border border-[#2d421d]">
                  <div className="text-xs font-mono text-stone-400">PayPal Advance Captured</div>
                  <div className="text-lg font-bold text-[#b2eb76] font-mono mt-1">$42,750.00 USD</div>
                  <div className="text-[11px] text-stone-400 mt-1">Capture ID: 9C827104KL920194A</div>
                </div>

                <div className="p-4 rounded-xl bg-[#14200c] border border-[#2d421d]">
                  <div className="text-xs font-mono text-stone-400">Payment Reconciliation</div>
                  <div className="text-lg font-bold text-green-400 font-mono mt-1">100% RECONCILED</div>
                  <div className="text-[11px] text-stone-400 mt-1">Disputes: 0 Reported</div>
                </div>
              </div>

              {/* PayPal Milestone Log */}
              <div className="p-4 rounded-xl bg-[#18280e] border border-[#2d421d] space-y-3">
                <h5 className="font-semibold text-[#b2eb76] font-mono text-xs uppercase">
                  Financial & Operational Milestone Audit Trail
                </h5>
                <div className="space-y-2">
                  {INITIAL_MILESTONES.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-start justify-between p-2.5 rounded bg-[#121c0b] border border-[#2d421d] text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">{m.title}</div>
                        <div className="text-[11px] text-stone-400 mt-0.5">{m.notes}</div>
                        <div className="text-[10px] font-mono text-[#b2eb76] mt-0.5">Ref: {m.evidenceReference}</div>
                      </div>
                      <span className="font-mono text-[10px] text-stone-400 shrink-0 ml-4">
                        Source: {m.sourceType.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Transaction Intelligence Graph */}
          {activeTab === "graph" && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#18280e] border border-[#2d421d]">
                <div className="text-xs font-mono text-[#b2eb76] uppercase">Network Graph Intelligence</div>
                <h4 className="text-base font-bold text-white mt-0.5">
                  Counterparty Trust Network & Multi-Tenant Isolation
                </h4>
                <p className="text-xs text-stone-400 mt-1">
                  Private transaction data is strictly sandboxed. Anonymous trust vectors and verified capability badges are surfaced to network participants.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#14200c] border border-[#2d421d] space-y-3">
                  <h5 className="font-semibold text-white font-mono uppercase text-[11px] text-[#b2eb76]">
                    Vardhman Precision Fabrics (Seller) Network Vector
                  </h5>
                  <div className="space-y-1.5 font-mono text-stone-300">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Fulfillment Reliability:</span>
                      <span className="text-[#b2eb76] font-bold">98.4%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Completed Evidence Transactions:</span>
                      <span>42 orders ($3.8M USD)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">On-Time Shipment Rate:</span>
                      <span>96.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Dispute Rate:</span>
                      <span className="text-green-400 font-bold">0.00%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#14200c] border border-[#2d421d] space-y-3">
                  <h5 className="font-semibold text-white font-mono uppercase text-[11px] text-[#b2eb76]">
                    Pacific Retail Group (Buyer) Network Vector
                  </h5>
                  <div className="space-y-1.5 font-mono text-stone-300">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Payment Punctuality:</span>
                      <span className="text-[#b2eb76] font-bold">100.0%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Verified PO History:</span>
                      <span>18 orders</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">PayPal Deposit Release Time:</span>
                      <span>Instant (&lt; 2 hours)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Delaware State Standing:</span>
                      <span className="text-green-400 font-bold">Active / Good</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Admin & Role-Based Access Control */}
          {activeTab === "admin" && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#18280e] border border-[#2d421d] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-[#b2eb76] uppercase">Platform Administration</div>
                  <h4 className="text-base font-bold text-white mt-0.5">Verification Workflows & Audit Logs</h4>
                  <p className="text-xs text-stone-400 mt-1">
                    Manage entity verifications, investigate flagged transactions, and audit evidence trails.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded bg-[#223514] border border-[#3b5424] text-xs font-mono text-[#b2eb76]">
                    Admin Mode Active
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#14200c] border border-[#2d421d] space-y-3 text-xs">
                <h5 className="font-semibold text-white font-mono uppercase text-[#b2eb76]">
                  Active Verification Workflows in Queue
                </h5>
                <div className="space-y-2">
                  <div className="p-3 rounded bg-[#121c0b] border border-[#2d421d] flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">Moradabad Artisans & Precision Castings LLP</div>
                      <div className="text-stone-400 text-[11px] mt-0.5">
                        GST active (09AAHFM9201L1Z4). On-site factory audit pending auditor review.
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 rounded bg-[#256c38] text-white hover:bg-[#2d8243] font-mono text-[11px]">
                        Approve Evidence
                      </button>
                      <button className="px-3 py-1 rounded bg-red-950/60 border border-red-700 text-red-200 font-mono text-[11px]">
                        Request Info
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#2d421d] bg-[#14200c] flex items-center justify-between text-xs text-stone-400 font-mono">
          <div>Global Business Trust &amp; Transaction Intelligence Network</div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-[#b2eb76] text-[#18280e] font-semibold hover:bg-white transition-colors"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
}
