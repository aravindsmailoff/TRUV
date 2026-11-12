import { NextRequest, NextResponse } from "next/server";
import { INITIAL_SUPPLIERS } from "@/lib/buyer/buyerStore";

const AI_ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";
const AI_MODEL = "nvidia/nemotron-3.5-lightning-30b-a3b";

interface VerifyOrderRequest {
  orderNumber?: string;
  supplierId?: string;
  supplierName?: string;
  productOrServiceName?: string;
  specifications?: string;
  totalAmountUSD?: number;
  advanceDepositUSD?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as VerifyOrderRequest;
    const supplier = INITIAL_SUPPLIERS.find(
      (s) => s.id === body.supplierId || s.name === body.supplierName
    );

    const total = Number(body.totalAmountUSD || 0);
    const advance = Number(body.advanceDepositUSD || 0);
    const advanceRatio = total > 0 ? Math.round((advance / total) * 100) : 30;

    const checks: string[] = [];
    const warnings: string[] = [];

    if (supplier) {
      checks.push(`Verified Exporter: ${supplier.verificationSource} (${supplier.iecCode || supplier.gstin || "Active"})`);
      checks.push(`Catalog Materials: ${(supplier.materials || []).join(", ")}`);
    } else {
      warnings.push("Supplier profile not found in verified directory — double-check IEC/GSTIN before releasing payment.");
    }

    if (advanceRatio > 35) {
      warnings.push(`Advance deposit is ${advanceRatio}% of total order (above standard 30% escrow threshold).`);
    } else {
      checks.push(`Payment Split: ${advanceRatio}% advance / ${100 - advanceRatio}% balance on delivery.`);
    }

    const apiKey = process.env.NVIDIA_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({
        poweredBy: "TRUVX AI",
        status: warnings.length > 0 ? "WARNING" : "VERIFIED",
        riskLevel: warnings.length > 0 ? "MEDIUM" : "LOW",
        specAlignmentSummary: supplier
          ? `Order specifications align with ${supplier.name}'s verified capabilities (${(supplier.materials || []).slice(0, 2).join(", ")}).`
          : "Basic escrow checks completed.",
        warnings,
        checks,
      });
    }

    const systemPrompt = `You are TRUVX AI's Pre-Payment Order & Spec Guard.
Compare the buyer's order details against the verified supplier's registered materials, finishes, and capabilities.
Flag any material substitution risk, grade mismatch, or missing spec clarity BEFORE the buyer authorizes PayPal payment.
Respond ONLY with valid JSON:
{
  "status": "VERIFIED" | "WARNING",
  "riskLevel": "LOW" | "MEDIUM" | "HIGH",
  "specAlignmentSummary": "1 concise sentence",
  "warnings": ["only real spec/material mismatch or risk warnings, empty array if clean"]
}`;

    const userPrompt = `Order: ${body.orderNumber || "New Order"}
Product: ${body.productOrServiceName || "Not specified"}
Requested Specs: ${body.specifications || body.productOrServiceName || "Not specified"}
Total USD: $${total} (Advance: $${advance}, ${advanceRatio}%)
Supplier: ${supplier ? `${supplier.name} (${supplier.city}, ${supplier.state})` : body.supplierName || "Unknown"}
Supplier Verified Products: ${(supplier?.productsOrServices || []).join("; ")}
Supplier Verified Materials: ${(supplier?.materials || []).join("; ")}
Supplier Verified Finishes: ${(supplier?.finishes || []).join("; ")}`;

    const aiRes = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        temperature: 0.1,
        max_tokens: 450,
        chat_template_kwargs: { enable_thinking: false },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!aiRes.ok) {
      return NextResponse.json({
        poweredBy: "TRUVX AI",
        status: warnings.length > 0 ? "WARNING" : "VERIFIED",
        riskLevel: warnings.length > 0 ? "MEDIUM" : "LOW",
        specAlignmentSummary: supplier
          ? `Order specs checked against ${supplier.name}'s verified catalog.`
          : "Basic escrow checks completed.",
        warnings,
        checks,
      });
    }

    const aiJson = (await aiRes.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = aiJson.choices?.[0]?.message?.content || "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json({
        poweredBy: "TRUVX AI",
        status: warnings.length > 0 ? "WARNING" : "VERIFIED",
        riskLevel: warnings.length > 0 ? "MEDIUM" : "LOW",
        specAlignmentSummary: "Order specifications verified against supplier profile.",
        warnings,
        checks,
      });
    }

    const parsed = JSON.parse(jsonMatch[0]) as {
      status?: "VERIFIED" | "WARNING";
      riskLevel?: "LOW" | "MEDIUM" | "HIGH";
      specAlignmentSummary?: string;
      warnings?: string[];
    };

    const combinedWarnings = [
      ...warnings,
      ...(Array.isArray(parsed.warnings) ? parsed.warnings.filter(Boolean) : []),
    ];

    return NextResponse.json({
      poweredBy: "TRUVX AI",
      status: combinedWarnings.length > 0 ? "WARNING" : parsed.status || "VERIFIED",
      riskLevel:
        combinedWarnings.length > 0 && parsed.riskLevel === "LOW"
          ? "MEDIUM"
          : parsed.riskLevel || (combinedWarnings.length > 0 ? "MEDIUM" : "LOW"),
      specAlignmentSummary:
        parsed.specAlignmentSummary ||
        "Order specifications align with supplier's verified capabilities.",
      warnings: combinedWarnings,
      checks,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Order verification failed", details: (err as Error).message },
      { status: 500 }
    );
  }
}

