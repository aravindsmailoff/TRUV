import { NextRequest, NextResponse } from "next/server";
import {
  INITIAL_TRANSACTIONS,
  INITIAL_BUSINESSES,
  INITIAL_CAPABILITIES,
  INITIAL_PAYPAL_EVENTS,
} from "@/lib/intelligence/store";
import { analyzeTransactionRisk } from "@/lib/intelligence/riskEngine";
import { CommercialTransaction } from "@/types/intelligence";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const tx = INITIAL_TRANSACTIONS.find((t) => t.id === id);
    if (!tx) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    const buyer = INITIAL_BUSINESSES.find((b) => b.id === tx.buyerId);
    const seller = INITIAL_BUSINESSES.find((b) => b.id === tx.sellerId);
    const capability = INITIAL_CAPABILITIES[tx.sellerId];
    const events = INITIAL_PAYPAL_EVENTS.filter((e) => e.commercialTransactionId === tx.id);
    const assessment = analyzeTransactionRisk(tx, buyer, seller, capability, events);

    return NextResponse.json({ transaction: tx, assessment, events });
  }

  return NextResponse.json({
    totalTransactions: INITIAL_TRANSACTIONS.length,
    transactions: INITIAL_TRANSACTIONS,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      buyerId,
      sellerId,
      productDescription,
      agreedSpecifications = [],
      quantityUnits,
      unitPrice,
      totalAmount,
      currency = "USD",
      deliveryTerms = "FOB",
      paymentTerms = "30% Advance, 70% Upon BL",
      documents = [],
    } = body;

    const newTransaction: CommercialTransaction = {
      id: `tx_${Date.now()}`,
      transactionReference: `TX-${Date.now().toString().slice(-6)}`,
      buyerId,
      sellerId,
      productDescription,
      agreedSpecifications,
      quantityUnits: Number(quantityUnits),
      unitPrice: Number(unitPrice),
      totalAmount: Number(totalAmount || quantityUnits * unitPrice),
      currency,
      deliveryTerms,
      paymentTerms,
      documents,
      status: "submitted",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const buyer = INITIAL_BUSINESSES.find((b) => b.id === buyerId);
    const seller = INITIAL_BUSINESSES.find((b) => b.id === sellerId);
    const capability = INITIAL_CAPABILITIES[sellerId];

    // Evaluate risk immediately using Explainable AI Risk Engine
    const riskAssessment = analyzeTransactionRisk(newTransaction, buyer, seller, capability, []);

    return NextResponse.json({
      success: true,
      transaction: newTransaction,
      riskAssessment,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to evaluate transaction", details: (error as Error).message },
      { status: 400 }
    );
  }
}

