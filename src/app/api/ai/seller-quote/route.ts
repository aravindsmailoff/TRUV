import { NextRequest, NextResponse } from "next/server";

const AI_ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";
const AI_MODEL = "nvidia/nemotron-3.5-lightning-30b-a3b";

interface SellerQuoteRequest {
  productName?: string;
  material?: string;
  quantity?: number;
  targetCountry?: string;
  unitCostINR?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SellerQuoteRequest;
    const productName = (body.productName || "Brass Mortise Locksets").trim();
    const material = (body.material || "CW617N Solid Brass").trim();
    const quantity = Number(body.quantity || 1000);
    const targetCountry = (body.targetCountry || "United States").trim();
    const unitCostINR = Number(body.unitCostINR || 1450);

    const apiKey = process.env.NVIDIA_API_KEY?.trim();

    // Deterministic fallback calculation (1 USD ≈ ₹83.5)
    const fallbackUnitUSD = Number(((unitCostINR * 1.22) / 83.5).toFixed(2));
    const fallbackTotalUSD = Math.round(fallbackUnitUSD * quantity);

    if (!apiKey) {
      return NextResponse.json({
        poweredBy: "TradeOracle AI",
        hsCode: "8301.40.00",
        recommendedUnitPriceUSD: fallbackUnitUSD,
        totalDealUSD: fallbackTotalUSD,
        advance30USD: Math.round(fallbackTotalUSD * 0.3),
        balance70USD: Math.round(fallbackTotalUSD * 0.7),
        incoterm: "FOB Mundra / Nhava Sheva",
        quoteText: `We are pleased to quote ${quantity.toLocaleString()} units of ${productName} (${material}) at $${fallbackUnitUSD} USD/unit FOB India (Total: $${fallbackTotalUSD.toLocaleString()} USD). Payment terms: 30% advance via PayPal escrow, 70% against Bill of Lading.`,
      });
    }

    const systemPrompt = `You are TradeOracle AI's Export Pricing & Quotation Assistant for Indian manufacturers.
Given a product, material, quantity, target country, and factory cost in INR, recommend:
1. Accurate 8-digit Indian HS Code
2. Recommended export unit price in USD (including ~18-25% healthy export margin + packaging/FOB port charges, assuming 1 USD = 83.5 INR)
3. Recommended Incoterm (e.g. FOB Mundra, FOB Nhava Sheva, CIF Hamburg)
4. A concise, professional 2-3 sentence English quotation message the Indian manufacturer can send directly to the foreign buyer.

Respond ONLY with valid JSON:
{
  "hsCode": "string",
  "recommendedUnitPriceUSD": number,
  "incoterm": "string",
  "quoteText": "string"
}`;

    const aiRes = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        temperature: 0.15,
        max_tokens: 450,
        chat_template_kwargs: { enable_thinking: false },
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Product: ${productName}\nMaterial: ${material}\nQuantity: ${quantity}\nTarget Country: ${targetCountry}\nFactory Unit Cost (INR): ₹${unitCostINR}`,
          },
        ],
      }),
    });

    if (!aiRes.ok) {
      return NextResponse.json({
        poweredBy: "TradeOracle AI",
        hsCode: "8301.40.00",
        recommendedUnitPriceUSD: fallbackUnitUSD,
        totalDealUSD: fallbackTotalUSD,
        advance30USD: Math.round(fallbackTotalUSD * 0.3),
        balance70USD: Math.round(fallbackTotalUSD * 0.7),
        incoterm: "FOB Mundra / Nhava Sheva",
        quoteText: `We are pleased to quote ${quantity.toLocaleString()} units of ${productName} (${material}) at $${fallbackUnitUSD} USD/unit FOB India (Total: $${fallbackTotalUSD.toLocaleString()} USD).`,
      });
    }

    const aiJson = (await aiRes.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = aiJson.choices?.[0]?.message?.content || "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json({
        poweredBy: "TradeOracle AI",
        hsCode: "8301.40.00",
        recommendedUnitPriceUSD: fallbackUnitUSD,
        totalDealUSD: fallbackTotalUSD,
        advance30USD: Math.round(fallbackTotalUSD * 0.3),
        balance70USD: Math.round(fallbackTotalUSD * 0.7),
        incoterm: "FOB Mundra / Nhava Sheva",
        quoteText: `We are pleased to quote ${quantity.toLocaleString()} units of ${productName} (${material}) at $${fallbackUnitUSD} USD/unit FOB India (Total: $${fallbackTotalUSD.toLocaleString()} USD).`,
      });
    }

    const parsed = JSON.parse(jsonMatch[0]) as {
      hsCode?: string;
      recommendedUnitPriceUSD?: number;
      incoterm?: string;
      quoteText?: string;
    };

    const unitUSD =
      typeof parsed.recommendedUnitPriceUSD === "number" && parsed.recommendedUnitPriceUSD > 0
        ? Number(parsed.recommendedUnitPriceUSD.toFixed(2))
        : fallbackUnitUSD;
    const totalUSD = Math.round(unitUSD * quantity);

    return NextResponse.json({
      poweredBy: "TradeOracle AI",
      hsCode: parsed.hsCode || "8301.40.00",
      recommendedUnitPriceUSD: unitUSD,
      totalDealUSD: totalUSD,
      advance30USD: Math.round(totalUSD * 0.3),
      balance70USD: Math.round(totalUSD * 0.7),
      incoterm: parsed.incoterm || "FOB Mundra",
      quoteText:
        parsed.quoteText ||
        `We are pleased to quote ${quantity.toLocaleString()} units of ${productName} (${material}) at $${unitUSD} USD/unit ${parsed.incoterm || "FOB Mundra"}.`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Quote generation failed", details: (err as Error).message },
      { status: 500 }
    );
  }
}

