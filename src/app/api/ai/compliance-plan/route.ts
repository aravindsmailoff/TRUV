import { NextRequest, NextResponse } from "next/server";
import { translateTradeText } from "@/lib/ai/translator";

const AI_ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";
const AI_MODEL = "nvidia/nemotron-3.5-lightning-30b-a3b";

interface CompliancePlanRequest {
  productName?: string;
  material?: string;
  targetCountries?: string[];
  preferredLanguage?: string;
  companyName?: string;
  gstin?: string;
  iecCode?: string;
}

export interface CertificateRequirement {
  markName: string;
  country: string;
  standardCode: string;
  purpose: string;
  labPartner: string;
  estimatedDays: string;
  estimatedFeeUSD: number;
}

function buildFallbackPlan(
  productName: string,
  material: string,
  countries: string[],
  companyName: string
) {
  const certs: CertificateRequirement[] = [
    {
      markName: "ISO 9001:2015",
      country: "Global",
      standardCode: "ISO 9001:2015 QMS",
      purpose: "Factory quality management certification required by international buyers.",
      labPartner: "QIMA / TÜV India",
      estimatedDays: "7-10 days",
      estimatedFeeUSD: 450,
    },
  ];

  const lowerCountries = countries.map((c) => c.toLowerCase());
  if (lowerCountries.some((c) => c.includes("eu") || c.includes("europe") || c.includes("germany"))) {
    certs.push({
      markName: "CE Mark + RoHS",
      country: "European Union",
      standardCode: "EN / RoHS Directive 2011/65/EU",
      purpose: "Mandatory European safety, material, and restricted-substance mark.",
      labPartner: "TÜV Rheinland / SGS",
      estimatedDays: "6-8 days",
      estimatedFeeUSD: 320,
    });
  }
  if (lowerCountries.some((c) => c.includes("usa") || c.includes("united states"))) {
    certs.push({
      markName: "ASTM / ANSI Test Report",
      country: "United States",
      standardCode: "ASTM B117 / ANSI Compliance",
      purpose: "Corrosion, tensile, and material grade verification for US customs & buyers.",
      labPartner: "QIMA / Intertek",
      estimatedDays: "5-7 days",
      estimatedFeeUSD: 280,
    });
  }
  if (lowerCountries.some((c) => c.includes("uk") || c.includes("united kingdom"))) {
    certs.push({
      markName: "UKCA Mark",
      country: "United Kingdom",
      standardCode: "UKCA / BS EN Standard",
      purpose: "Mandatory UK market conformity marking for exported goods.",
      labPartner: "Intertek UK / SGS",
      estimatedDays: "6-8 days",
      estimatedFeeUSD: 290,
    });
  }
  if (lowerCountries.some((c) => c.includes("uae") || c.includes("saudi") || c.includes("middle east"))) {
    certs.push({
      markName: "SASO / SABER",
      country: "Saudi Arabia / UAE",
      standardCode: "SASO CoC / ESMA",
      purpose: "Mandatory Gulf customs product conformity certificate.",
      labPartner: "QIMA / SGS Gulf",
      estimatedDays: "5 days",
      estimatedFeeUSD: 260,
    });
  }
  if (lowerCountries.some((c) => c.includes("india") || c.includes("bis"))) {
    certs.push({
      markName: "BIS / ISI Mark",
      country: "India",
      standardCode: "IS / BIS Scheme-I",
      purpose: "Bureau of Indian Standards mandatory quality mark.",
      labPartner: "NABL / BIS Empanelled Lab",
      estimatedDays: "10-14 days",
      estimatedFeeUSD: 190,
    });
  }
  if (lowerCountries.some((c) => c.includes("japan") || c.includes("pse"))) {
    certs.push({
      markName: "PSE / JIS Conformity",
      country: "Japan",
      standardCode: "JIS / METI Export Standard",
      purpose: "Japanese industrial & electrical/hardware conformity marking.",
      labPartner: "TÜV Rheinland Japan / JET",
      estimatedDays: "8-12 days",
      estimatedFeeUSD: 340,
    });
  }

  return {
    poweredBy: "TradeOracle AI",
    hsCode: "8301.40 / 7318.15",
    nativeSummary: `For ${productName} (${material}), TradeOracle AI has mapped ${certs.length} required quality certificates for ${countries.join(", ")}. All English paperwork is prepared automatically — you only need to ship 1-2 samples to the accredited lab.`,
    requiredCertificates: certs,
    generatedDossier: `DECLARATION OF CONFORMITY & LAB TEST DOSSIER\nManufacturer: ${companyName}\nProduct: ${productName}\nDeclared Material: ${material}\nTarget Markets: ${countries.join(", ")}\nCompliance Scope: Batch traceability, chemical & mechanical grade verification, and export packaging markings.`,
    packagingLabelSpecs: [
      `Origin: MADE IN INDIA`,
      `Product: ${productName}`,
      `Material: ${material}`,
      `Marks: ${certs.map((c) => c.markName).join(" | ")}`,
    ],
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CompliancePlanRequest;
    const productName = (body.productName || "Precision Brass Hardware").trim();
    const material = (body.material || "CW617N Solid Brass").trim();
    const targetCountries =
      Array.isArray(body.targetCountries) && body.targetCountries.length > 0
        ? body.targetCountries
        : ["United States", "European Union (CE)", "India (BIS)"];
    const preferredLanguage = (body.preferredLanguage || "English").trim();
    const companyName = (body.companyName || "Indian Export Manufacturer").trim();

    const apiKey = process.env.NVIDIA_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        buildFallbackPlan(productName, material, targetCountries, companyName)
      );
    }

    const systemPrompt = `You are TradeOracle AI's International Export Quality & Certification Assistant for Indian manufacturers.
Given a product, raw material, and target export countries, return the exact required quality certificates and markings (such as ISO 9001:2015, CE Mark, UKCA, ASTM/UL/FCC, SASO/SABER, BIS/ISI, GOTS/OEKO-TEX depending on the product).
Also generate:
1. "nativeSummary": A clear, friendly 2-3 sentence summary in simple English explaining what certificates are needed and reassuring the seller that TradeOracle handles the English paperwork.
2. "generatedDossier": A clean English Technical File & Declaration of Conformity draft ready for an accredited lab (QIMA, SGS, TÜV, Intertek, or NABL/BIS lab).
3. "packagingLabelSpecs": 4 short strings to print on the export carton label.

Respond ONLY with valid JSON matching this schema:
{
  "hsCode": "string",
  "nativeSummary": "string",
  "requiredCertificates": [
    {
      "markName": "string",
      "country": "string",
      "standardCode": "string",
      "purpose": "string",
      "labPartner": "string",
      "estimatedDays": "string",
      "estimatedFeeUSD": number
    }
  ],
  "generatedDossier": "string",
  "packagingLabelSpecs": ["string"]
}`;

    const userPrompt = `Company: ${companyName} (GSTIN: ${body.gstin || "Active"}, IEC: ${body.iecCode || "Active"})
Product: ${productName}
Material: ${material}
Target Countries: ${targetCountries.join(", ")}
Seller Preferred Language: ${preferredLanguage}`;

    const fallback = buildFallbackPlan(productName, material, targetCountries, companyName);

    let aiRes: Response;
    try {
      aiRes = await fetch(AI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: AI_MODEL,
          temperature: 0.15,
          max_tokens: 2200,
          chat_template_kwargs: { enable_thinking: false },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
        signal: AbortSignal.timeout(20000),
      });
    } catch {
      return NextResponse.json(fallback);
    }

    if (!aiRes.ok) {
      return NextResponse.json(fallback);
    }

    const aiJson = (await aiRes.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = aiJson.choices?.[0]?.message?.content || "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json(fallback);
    }

    let parsed: {
      hsCode?: string;
      nativeSummary?: string;
      requiredCertificates?: CertificateRequirement[];
      generatedDossier?: string;
      packagingLabelSpecs?: string[];
    };
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json(fallback);
    }
    const englishSummary = parsed.nativeSummary || fallback.nativeSummary;
    const translatedSummary =
      preferredLanguage.toLowerCase() === "english"
        ? englishSummary
        : (
            await translateTradeText({
              text: englishSummary,
              sourceLanguage: "English",
              targetLanguage: preferredLanguage,
            })
          ).translatedText;

    return NextResponse.json({
      poweredBy: "TradeOracle AI",
      hsCode: parsed.hsCode || fallback.hsCode,
      nativeSummary: translatedSummary,
      requiredCertificates:
        Array.isArray(parsed.requiredCertificates) && parsed.requiredCertificates.length > 0
          ? parsed.requiredCertificates
          : fallback.requiredCertificates,
      generatedDossier: parsed.generatedDossier || fallback.generatedDossier,
      packagingLabelSpecs:
        Array.isArray(parsed.packagingLabelSpecs) && parsed.packagingLabelSpecs.length > 0
          ? parsed.packagingLabelSpecs
          : fallback.packagingLabelSpecs,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Compliance plan generation failed", details: (err as Error).message },
      { status: 500 }
    );
  }
}

