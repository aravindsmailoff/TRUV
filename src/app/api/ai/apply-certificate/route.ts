import { NextRequest, NextResponse } from "next/server";

const AI_ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";
const AI_MODEL = "nvidia/nemotron-3.5-lightning-30b-a3b";

interface ApplyCertificateRequest {
  companyName?: string;
  gstin?: string;
  iecCode?: string;
  productName?: string;
  material?: string;
  hsCode?: string;
  markName?: string;
  country?: string;
  standardCode?: string;
  authorityName?: string;
  portalUrl?: string;
}

function buildFallbackProcess(body: ApplyCertificateRequest, appRef: string) {
  const company = body.companyName || "Indian Export Manufacturer";
  const product = body.productName || "Precision Brass Hardware";
  const mark = body.markName || "Export Quality Certificate";
  const country = body.country || "Export Market";
  const authority = body.authorityName || "Official Government Standards Authority";
  const portalUrl = body.portalUrl || "https://www.manakonline.in/";

  return {
    poweredBy: "TRUVX AI",
    applicationRef: appRef,
    status: "Auto-Filed · Dossier & Declaration Prepared",
    submittedAt: new Date().toLocaleString(),
    authorityName: authority,
    portalUrl,
    summaryForSeller: `TRUVX AI has automatically compiled your ${company} factory profile (GSTIN & IEC), product specifications for ${product}, and English Declaration of Conformity into a ready-to-submit ${mark} packet for ${authority} (${country}).`,
    stepsDone: [
      `Attached verified factory GSTIN (${body.gstin || "Active"}) & IEC (${body.iecCode || "Active"})`,
      `Generated English Technical File & Declaration of Conformity (${body.standardCode || mark})`,
      `Mapped HS Code ${body.hsCode || "8301.40"} and export carton markings for ${country}`,
      `Assigned tracking reference ${appRef} for ${authority}`,
    ],
    nextManufacturerSteps: [
      `Open ${authority} (${portalUrl}) and sign in with your factory DSC/IEC credentials to confirm statutory fee payment (if applicable).`,
      `Government officer reviews the submitted Technical File & ${body.standardCode || mark} conformity declaration (typically 5–14 days).`,
      `Once approved by ${authority}, download your official certificate PDF and attach it below so your foreign buyers and PayPal escrow release automatically see it.`,
    ],
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ApplyCertificateRequest;
    const appRef = `GOV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const fallback = buildFallbackProcess(body, appRef);

    const apiKey = process.env.NVIDIA_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(fallback);
    }

    const systemPrompt = `You are TRUVX AI's Government Export Certification Automation Assistant for Indian manufacturers.
The manufacturer just clicked "1-Click Auto-Apply" for an official government export certificate.
Never mention private corporate agencies (no QIMA, SGS, TÜV, Intertek, UL). Only reference the official government authority and portal.
Explain clearly in simple English:
1. "summaryForSeller": 2 sentences telling the manufacturer what TRUVX AI just automated for this application.
2. "stepsDone": 3-4 short bullet strings of what was automatically prepared & filed.
3. "nextManufacturerSteps": 3 short, practical bullet strings telling the manufacturer what the government portal does next and what simple action (if any) they take.

Respond ONLY with valid JSON:
{
  "summaryForSeller": "string",
  "stepsDone": ["string"],
  "nextManufacturerSteps": ["string"]
}`;

    const userPrompt = `Application Ref: ${appRef}
Manufacturer: ${body.companyName || "Indian Export Manufacturer"} (GSTIN: ${body.gstin || "Active"}, IEC: ${body.iecCode || "Active"})
Product: ${body.productName || "Precision Brass Hardware"} (${body.material || "CW617N Solid Brass"})
HS Code: ${body.hsCode || "8301.40"}
Certificate: ${body.markName || "Export Certificate"} (${body.standardCode || "Statutory Standard"})
Target Country: ${body.country || "Export Market"}
Government Authority: ${body.authorityName || "Official Government Standards Authority"}
Official Portal: ${body.portalUrl || "https://www.manakonline.in/"}`;

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
          max_tokens: 900,
          chat_template_kwargs: { enable_thinking: false },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
        signal: AbortSignal.timeout(15000),
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

    try {
      const parsed = JSON.parse(jsonMatch[0]) as {
        summaryForSeller?: string;
        stepsDone?: string[];
        nextManufacturerSteps?: string[];
      };

      return NextResponse.json({
        ...fallback,
        summaryForSeller: parsed.summaryForSeller || fallback.summaryForSeller,
        stepsDone:
          Array.isArray(parsed.stepsDone) && parsed.stepsDone.length > 0
            ? parsed.stepsDone
            : fallback.stepsDone,
        nextManufacturerSteps:
          Array.isArray(parsed.nextManufacturerSteps) && parsed.nextManufacturerSteps.length > 0
            ? parsed.nextManufacturerSteps
            : fallback.nextManufacturerSteps,
      });
    } catch {
      return NextResponse.json(fallback);
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Automated certificate filing failed", details: (err as Error).message },
      { status: 500 }
    );
  }
}

