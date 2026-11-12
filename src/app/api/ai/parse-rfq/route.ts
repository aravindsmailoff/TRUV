import { NextRequest, NextResponse } from "next/server";

const AI_ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";
const AI_MODEL = "nvidia/nemotron-3.5-lightning-30b-a3b";

function buildFallbackParsedRfq(prompt: string) {
  const lower = prompt.toLowerCase();
  const qtyMatch = prompt.match(/(\d[\d,]*)\s*(pcs|pieces|units|sets|kg|tons|meters|boxes)?/i);
  const quantity = qtyMatch ? Number(qtyMatch[1].replace(/,/g, "")) : 1500;
  const unit = qtyMatch?.[2] || "pcs";

  const priceMatch = prompt.match(/\$\s*(\d+(?:\.\d+)?)/);
  const unitPrice = priceMatch ? Number(priceMatch[1]) : 14;
  const budgetUSD = Math.round(quantity * unitPrice);

  let category = "Brass Hardware & Architectural Fittings";
  let hsCode = "8301.40";
  if (lower.includes("textile") || lower.includes("cotton") || lower.includes("fabric") || lower.includes("shirt")) {
    category = "Cotton & Technical Textiles";
    hsCode = "6109.10";
  } else if (lower.includes("machin") || lower.includes("cnc") || lower.includes("valve") || lower.includes("steel")) {
    category = "Precision CNC & Industrial Valves";
    hsCode = "8481.80";
  } else if (lower.includes("leather") || lower.includes("shoe") || lower.includes("bag")) {
    category = "Finished Leather Goods";
    hsCode = "4202.21";
  }

  let destinationPort = "Port of Los Angeles, USA (USLAX)";
  const requiredCertificates = ["EIC Certificate of Origin (Govt. of India)"];
  if (lower.includes("germany") || lower.includes("hamburg") || lower.includes("eu") || lower.includes("europe")) {
    destinationPort = "Port of Hamburg, Germany (DEHAM)";
    requiredCertificates.push("CE Mark + RoHS (European Commission)");
  } else if (lower.includes("uk") || lower.includes("london") || lower.includes("felixstowe")) {
    destinationPort = "Port of Felixstowe, UK (GBFXT)";
    requiredCertificates.push("UKCA Mark (GOV.UK / OPSS)");
  } else if (lower.includes("dubai") || lower.includes("uae") || lower.includes("saudi") || lower.includes("jebel")) {
    destinationPort = "Port of Jebel Ali, UAE (AEJEA)";
    requiredCertificates.push("SASO / SABER (Saudi / UAE Govt)");
  } else {
    requiredCertificates.push("U.S. CPSC / NIST Compliance");
  }

  const specs: string[] = [];
  if (lower.includes("brass")) specs.push("CW617N / IS 319 Solid Brass");
  if (lower.includes("gold") || lower.includes("pvd")) specs.push("PVD Satin Gold Finish");
  if (lower.includes("steel") || lower.includes("316")) specs.push("AISI 316 Stainless Grade");
  if (specs.length === 0) specs.push("Export-grade ISPM-15 crated packaging", "Batch quality & dimensional report");

  return {
    poweredBy: "TradeOracle AI",
    title: prompt.trim().slice(0, 65),
    category,
    quantity,
    unit,
    budgetUSD,
    destinationPort,
    deliveryDate: "2026-07-30",
    specifications: specs,
    hsCode,
    requiredCertificates,
    aiNotes: `Parsed ${quantity} ${unit} under HS ${hsCode} for ${destinationPort} with ${requiredCertificates.join(" + ")}.`,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { sentence?: string };
    const sentence = (body.sentence || "").trim();
    if (!sentence) {
      return NextResponse.json({ error: "Please enter a sentence describing what you want to buy." }, { status: 400 });
    }

    const fallback = buildFallbackParsedRfq(sentence);
    const apiKey = process.env.NVIDIA_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(fallback);
    }

    try {
      const aiRes = await fetch(AI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: AI_MODEL,
          temperature: 0.1,
          max_tokens: 600,
          chat_template_kwargs: { enable_thinking: false },
          messages: [
            {
              role: "system",
              content: `You are TradeOracle AI's One-Sentence RFQ Builder for international buyers sourcing from Indian manufacturers.
Convert a single buyer sentence into a structured export RFQ. Only list official government certificates (never private companies).
Respond ONLY with valid JSON:
{
  "title": "short product title",
  "category": "industry category",
  "quantity": number,
  "unit": "pcs | units | sets | kg",
  "budgetUSD": number,
  "destinationPort": "Port Name, Country (UN/LOCODE)",
  "deliveryDate": "YYYY-MM-DD",
  "specifications": ["spec 1", "spec 2", "spec 3"],
  "hsCode": "string",
  "requiredCertificates": ["Official Govt Certificate 1"],
  "aiNotes": "1 sentence summary"
}`,
            },
            { role: "user", content: sentence },
          ],
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (!aiRes.ok) return NextResponse.json(fallback);
      const aiJson = (await aiRes.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const raw = aiJson.choices?.[0]?.message?.content || "";
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return NextResponse.json(fallback);

      const parsed = JSON.parse(jsonMatch[0]) as Partial<typeof fallback>;
      return NextResponse.json({
        poweredBy: "TradeOracle AI",
        title: parsed.title || fallback.title,
        category: parsed.category || fallback.category,
        quantity: typeof parsed.quantity === "number" && parsed.quantity > 0 ? parsed.quantity : fallback.quantity,
        unit: parsed.unit || fallback.unit,
        budgetUSD: typeof parsed.budgetUSD === "number" && parsed.budgetUSD > 0 ? parsed.budgetUSD : fallback.budgetUSD,
        destinationPort: parsed.destinationPort || fallback.destinationPort,
        deliveryDate: parsed.deliveryDate || fallback.deliveryDate,
        specifications:
          Array.isArray(parsed.specifications) && parsed.specifications.length > 0
            ? parsed.specifications
            : fallback.specifications,
        hsCode: parsed.hsCode || fallback.hsCode,
        requiredCertificates:
          Array.isArray(parsed.requiredCertificates) && parsed.requiredCertificates.length > 0
            ? parsed.requiredCertificates
            : fallback.requiredCertificates,
        aiNotes: parsed.aiNotes || fallback.aiNotes,
      });
    } catch {
      return NextResponse.json(fallback);
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to parse RFQ sentence", details: (err as Error).message },
      { status: 500 }
    );
  }
}

