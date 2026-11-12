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
      markName: "Certificate of Origin & Quality (EIC)",
      country: "Global",
      standardCode: "EIC / DGFT Export Standard",
      purpose: "Official Government of India export quality & origin certification required by foreign customs.",
      labPartner: "Export Inspection Council (Govt. of India)",
      estimatedDays: "5-7 days",
      estimatedFeeUSD: 50,
    },
  ];

  const lowerCountries = countries.map((c) => c.toLowerCase());
  if (lowerCountries.some((c) => c.includes("eu") || c.includes("europe") || c.includes("germany"))) {
    certs.push({
      markName: "CE Mark + RoHS",
      country: "European Union",
      standardCode: "EN / RoHS Directive 2011/65/EU",
      purpose: "Mandatory European Union statutory safety, material, and restricted-substance mark.",
      labPartner: "European Commission (EU)",
      estimatedDays: "6-8 days",
      estimatedFeeUSD: 120,
    });
  }
  if (lowerCountries.some((c) => c.includes("usa") || c.includes("united states"))) {
    certs.push({
      markName: "US Statutory Standards & Customs Compliance",
      country: "United States",
      standardCode: "NIST / CPSC / CBP Import Compliance",
      purpose: "U.S. federal material safety, labeling, and customs conformity verification.",
      labPartner: "U.S. Govt (NIST / CPSC / CBP)",
      estimatedDays: "5-7 days",
      estimatedFeeUSD: 110,
    });
  }
  if (lowerCountries.some((c) => c.includes("uk") || c.includes("united kingdom"))) {
    certs.push({
      markName: "UKCA Mark",
      country: "United Kingdom",
      standardCode: "UKCA / BS EN Statutory Standard",
      purpose: "Mandatory UK Government market conformity marking for exported goods.",
      labPartner: "UK Govt (GOV.UK / OPSS)",
      estimatedDays: "6-8 days",
      estimatedFeeUSD: 115,
    });
  }
  if (lowerCountries.some((c) => c.includes("uae") || c.includes("saudi") || c.includes("middle east"))) {
    certs.push({
      markName: "SASO / SABER",
      country: "Saudi Arabia / UAE",
      standardCode: "SASO CoC / MoIAT",
      purpose: "Mandatory Gulf government customs product conformity certificate.",
      labPartner: "SASO (Saudi Govt) / MoIAT (UAE Govt)",
      estimatedDays: "5 days",
      estimatedFeeUSD: 130,
    });
  }
  if (lowerCountries.some((c) => c.includes("india") || c.includes("bis"))) {
    certs.push({
      markName: "BIS / ISI Mark",
      country: "India",
      standardCode: "IS / BIS Scheme-I",
      purpose: "Bureau of Indian Standards statutory quality mark.",
      labPartner: "Bureau of Indian Standards (Govt. of India)",
      estimatedDays: "10-14 days",
      estimatedFeeUSD: 90,
    });
  }
  if (lowerCountries.some((c) => c.includes("japan") || c.includes("pse"))) {
    certs.push({
      markName: "PSE / JIS Conformity",
      country: "Japan",
      standardCode: "JIS / METI Export Standard",
      purpose: "Japanese Government industrial & product conformity marking.",
      labPartner: "METI (Govt. of Japan)",
      estimatedDays: "8-12 days",
      estimatedFeeUSD: 140,
    });
  }

  return {
    poweredBy: "TRUVX AI",
    hsCode: "8301.40 / 7318.15",
    nativeSummary: `For ${productName} (${material}), TRUVX AI has mapped ${certs.length} official government certificates for ${countries.join(", ")}. All English Declaration of Conformity paperwork is prepared automatically so you can apply directly on each government portal.`,
    requiredCertificates: certs,
    generatedDossier: `OFFICIAL DECLARATION OF CONFORMITY & GOVT FILING DOSSIER\nManufacturer: ${companyName}\nProduct: ${productName}\nDeclared Material: ${material}\nTarget Markets: ${countries.join(", ")}\nCompliance Scope: Batch traceability, statutory material grade verification, and official export markings.`,
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

    const systemPrompt = `You are TRUVX AI's International Export Quality & Certification Assistant for Indian manufacturers.
Given a product, raw material, and target export countries, return ONLY the official government quality certificates, statutory markings, and government issuing authorities (such as BIS/ISI Govt of India, EIC/DGFT Govt of India, European Commission CE Mark, UK Govt UKCA/OPSS, U.S. Govt NIST/CPSC/FCC/CBP, Saudi Govt SASO/SABER, Japanese Govt METI PSE/JIS).
NEVER recommend or name private corporate inspection/testing companies (do NOT mention QIMA, SGS, TÜV, Intertek, UL, Bureau Veritas, etc.). Every "labPartner" MUST be an official government ministry, statutory standards body, or government regulatory authority.
Also generate:
1. "nativeSummary": A clear, friendly 2-3 sentence summary in simple English explaining what government certificates are needed and reassuring the seller that TRUVX handles the English paperwork for direct government portal filing.
2. "generatedDossier": A clean English Technical File & Declaration of Conformity draft ready for direct submission to the official government standards portal.
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
      "labPartner": "Official Government Authority Name (no private companies)",
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
      poweredBy: "TRUVX AI",
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

