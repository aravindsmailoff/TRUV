import { NextRequest, NextResponse } from "next/server";
import { INITIAL_SUPPLIERS, SupplierItem } from "@/lib/buyer/buyerStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface MatchResultItem {
  supplierId: string;
  matchScore: number;
  exactMaterialMatch: string;
  matchingProducts: string[];
  whyThisSeller: string;
  samplePromptSuggestion: string;
}

interface MatchResponsePayload {
  poweredBy: "TRUVX AI" | "Catalog Fallback";
  model: string;
  extractedRequirements: {
    product: string;
    material: string;
    finishOrStandard: string;
    quantityHint: string;
  };
  summary: string;
  matches: MatchResultItem[];
  noExactMatchReason?: string;
}

const NVIDIA_ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";
const NVIDIA_MODEL = "nvidia/nemotron-3.5-lightning-30b-a3b";

function buildDeterministicFallback(query: string): MatchResponsePayload {
  const tokens = query
    .toLowerCase()
    .split(/[^a-z0-9.+/-]+/)
    .filter((t) => t.length >= 2);

  const scored = INITIAL_SUPPLIERS.map((sup) => {
    const haystack = [
      sup.name,
      sup.category,
      sup.city,
      ...sup.productsOrServices,
      ...sup.capabilities,
      ...(sup.materials || []),
      ...(sup.finishes || []),
      ...(sup.certifications || []),
    ]
      .join(" ")
      .toLowerCase();

    const hits = tokens.filter((t) => haystack.includes(t));
    const uniqueHits = [...new Set(hits)];
    const materialHit = (sup.materials || []).find((m) =>
      tokens.some((t) => m.toLowerCase().includes(t))
    );
    const matchingProducts = sup.productsOrServices.filter((p) =>
      tokens.some((t) => p.toLowerCase().includes(t))
    );

    const score = Math.min(
      98,
      uniqueHits.length * 18 + (materialHit ? 22 : 0) + (matchingProducts.length ? 15 : 0)
    );

    return { sup, score, uniqueHits, materialHit, matchingProducts };
  })
    .filter((entry) => entry.score >= 25)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return {
    poweredBy: "Catalog Fallback",
    model: "deterministic-matcher",
    extractedRequirements: {
      product: query.trim(),
      material: scored[0]?.materialHit || "Based on buyer description",
      finishOrStandard: scored[0]?.sup.finishes?.[0] || "Standard export specification",
      quantityHint: "Sample + bulk order inquiry",
    },
    summary:
      scored.length > 0
        ? `Found ${scored.length} verified seller(s) matching "${query}".`
        : `No exact verified seller in our current catalog matched "${query}". Try adjusting the material or category.`,
    matches: scored.map(({ sup, score, uniqueHits, materialHit, matchingProducts }) => ({
      supplierId: sup.id,
      matchScore: score,
      exactMaterialMatch: materialHit || sup.materials?.[0] || sup.category,
      matchingProducts:
        matchingProducts.length > 0 ? matchingProducts : sup.productsOrServices.slice(0, 2),
      whyThisSeller: `Matches keywords (${uniqueHits.slice(0, 5).join(", ")}) in ${sup.category} from ${sup.city}, ${sup.state}.`,
      samplePromptSuggestion: `Hello ${sup.name}, I am looking for ${query}. Could you share a sample unit matching ${materialHit || sup.materials?.[0] || "this specification"} along with sample cost and shipping lead time?`,
    })),
    noExactMatchReason:
      scored.length === 0
        ? "No supplier in the verified directory lists a matching material or product capability for this description."
        : undefined,
  };
}

function extractJsonBlock(raw: string): Record<string, unknown> | null {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  try {
    return JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>;
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      query?: string;
      quantity?: string;
      budget?: string;
    };
    const query = (body.query || "").trim();

    if (!query || query.length < 3) {
      return NextResponse.json(
        { error: "Please describe the product, material, or specifications you are looking for." },
        { status: 400 }
      );
    }

    const apiKey = process.env.NVIDIA_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(buildDeterministicFallback(query));
    }

    const catalogForAi = INITIAL_SUPPLIERS.map((s: SupplierItem) => ({
      id: s.id,
      name: s.name,
      type: s.type,
      category: s.category,
      location: `${s.city}, ${s.state}, India`,
      productsOrServices: s.productsOrServices,
      materials: s.materials || [],
      finishes: s.finishes || [],
      capabilities: s.capabilities,
      certifications: s.certifications || [],
      moq: s.moq,
      leadTime: s.leadTime,
      approxPricingRange: s.approxPricingRange,
      samplePolicy: s.samplePolicy || "",
    }));

    const systemPrompt = [
      "You are the TRUVX Sourcing AI.",
      "Your job is to match a buyer's product & material description ONLY to the exact verified Indian seller(s) from the provided catalog who actually manufacture that exact material, finish, grade, or capability.",
      "Do NOT force a match if no seller makes that material/product (for example, do not match a clothing seller for stainless steel valves).",
      "Return ONLY valid JSON matching this exact shape (no markdown, no extra prose):",
      JSON.stringify({
        extractedRequirements: {
          product: "string",
          material: "string",
          finishOrStandard: "string",
          quantityHint: "string",
        },
        summary: "1 clear plain-English sentence summarizing the match result",
        matches: [
          {
            supplierId: "exact id from catalog",
            matchScore: 95,
            exactMaterialMatch: "exact material/alloy/fabric from this seller that matches the buyer",
            matchingProducts: ["matching product line(s)"],
            whyThisSeller: "1-2 short plain-English sentences explaining why this exact seller matches the product and material requested",
            samplePromptSuggestion: "A short polite 2-sentence buyer message asking this exact seller for a sample matching the product & material",
          },
        ],
        noExactMatchReason: "optional string if matches array is empty",
      }),
    ].join("\n");

    const userPrompt = JSON.stringify({
      buyerRequest: {
        description: query,
        quantity: body.quantity || undefined,
        budget: body.budget || undefined,
      },
      verifiedSellersCatalog: catalogForAi,
    });

    const aiResponse = await fetch(NVIDIA_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.1,
        max_tokens: 900,
        chat_template_kwargs: { enable_thinking: false },
      }),
    });

    if (!aiResponse.ok) {
      return NextResponse.json(buildDeterministicFallback(query));
    }

    const aiJson = (await aiResponse.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };
    const rawContent = aiJson.choices?.[0]?.message?.content;
    if (!rawContent) {
      return NextResponse.json(buildDeterministicFallback(query));
    }

    const parsed = extractJsonBlock(rawContent);
    if (!parsed) {
      return NextResponse.json(buildDeterministicFallback(query));
    }

    const validIds = new Set(INITIAL_SUPPLIERS.map((s) => s.id));
    const rawMatches = Array.isArray(parsed.matches) ? parsed.matches : [];
    const validatedMatches: MatchResultItem[] = rawMatches
      .filter(
        (m): m is MatchResultItem =>
          typeof m === "object" &&
          m !== null &&
          typeof (m as MatchResultItem).supplierId === "string" &&
          validIds.has((m as MatchResultItem).supplierId)
      )
      .slice(0, 3)
      .map((m) => ({
        supplierId: m.supplierId,
        matchScore: Math.max(0, Math.min(100, Number(m.matchScore) || 85)),
        exactMaterialMatch: String(m.exactMaterialMatch || "Specified catalog material"),
        matchingProducts: Array.isArray(m.matchingProducts)
          ? m.matchingProducts.map(String)
          : [],
        whyThisSeller: String(m.whyThisSeller || "Matches requested material and product specs."),
        samplePromptSuggestion: String(
          m.samplePromptSuggestion ||
            `Hello, could you send a sample matching "${query}" along with sample pricing and dispatch timeline?`
        ),
      }));

    const ext = (parsed.extractedRequirements || {}) as Record<string, unknown>;
    const payload: MatchResponsePayload = {
      poweredBy: "TRUVX AI",
      model: "truvx-matcher-v1",
      extractedRequirements: {
        product: String(ext.product || query),
        material: String(ext.material || "Not specified"),
        finishOrStandard: String(ext.finishOrStandard || "Standard export specification"),
        quantityHint: String(ext.quantityHint || body.quantity || "Sample / pilot batch"),
      },
      summary: String(
        parsed.summary ||
          (validatedMatches.length > 0
            ? `Matched ${validatedMatches.length} verified seller(s) for your exact product and material description.`
            : "No verified seller in the directory matches those exact specifications yet.")
      ),
      matches: validatedMatches,
      noExactMatchReason:
        validatedMatches.length === 0
          ? String(
              parsed.noExactMatchReason ||
                "No verified seller in the directory currently supplies that exact material or product."
            )
          : undefined,
    };

    return NextResponse.json(payload);
  } catch (err) {
    console.error("AI seller match error:", err);
    return NextResponse.json(
      { error: "Unable to complete AI seller matching right now." },
      { status: 500 }
    );
  }
}

