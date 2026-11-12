import { NextRequest, NextResponse } from "next/server";

const AI_ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";
const AI_MODEL = "nvidia/nemotron-3.5-lightning-30b-a3b";

interface TranslateRequest {
  text?: string;
  targetLanguage?: string;
  sourceLanguage?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TranslateRequest;
    const text = (body.text || "").trim();
    const targetLanguage = (body.targetLanguage || "English").trim();
    const sourceLanguage = (body.sourceLanguage || "auto-detect").trim();

    if (!text) {
      return NextResponse.json({ error: "Text is required for translation." }, { status: 400 });
    }

    // If source and target are explicitly the same, return directly
    if (
      sourceLanguage !== "auto-detect" &&
      sourceLanguage.toLowerCase() === targetLanguage.toLowerCase()
    ) {
      return NextResponse.json({
        poweredBy: "TradeOracle AI",
        translatedText: text,
        detectedSourceLanguage: sourceLanguage,
        targetLanguage,
      });
    }

    const apiKey = process.env.NVIDIA_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({
        poweredBy: "Translation Fallback",
        translatedText: text,
        detectedSourceLanguage: sourceLanguage === "auto-detect" ? "English" : sourceLanguage,
        targetLanguage,
      });
    }

    const systemPrompt = `You are TradeOracle AI's B2B trade translation engine between international buyers and Indian factory owners.
Translate the user's message into ${targetLanguage} naturally and accurately for business/factory communication.
CRITICAL RULES:
1. Keep all technical material grades, alloy codes, standards, numbers, quantities, dimensions, currencies, and PO numbers intact (e.g. CW617N, AISI 316, ASTM B117, PVD, $145, 500 pcs).
2. Use natural, respectful business phrasing in ${targetLanguage} (in its native script when ${targetLanguage} is Hindi, Gujarati, Punjabi, Tamil, Kannada, Marathi, etc.).
3. Respond ONLY with valid JSON in this exact schema:
{
  "detectedSourceLanguage": "string",
  "translatedText": "string"
}`;

    const aiResponse = await fetch(AI_ENDPOINT, {
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
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Source language hint: ${sourceLanguage}\nTarget language: ${targetLanguage}\nMessage:\n${text}`,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      return NextResponse.json({
        poweredBy: "Translation Fallback",
        translatedText: text,
        detectedSourceLanguage: sourceLanguage === "auto-detect" ? "English" : sourceLanguage,
        targetLanguage,
      });
    }

    const aiJson = (await aiResponse.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const rawContent = aiJson.choices?.[0]?.message?.content || "";
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json({
        poweredBy: "TradeOracle AI",
        translatedText: rawContent.trim() || text,
        detectedSourceLanguage: sourceLanguage === "auto-detect" ? "English" : sourceLanguage,
        targetLanguage,
      });
    }

    const parsed = JSON.parse(jsonMatch[0]) as {
      detectedSourceLanguage?: string;
      translatedText?: string;
    };

    return NextResponse.json({
      poweredBy: "TradeOracle AI",
      translatedText: parsed.translatedText?.trim() || text,
      detectedSourceLanguage:
        parsed.detectedSourceLanguage?.trim() ||
        (sourceLanguage === "auto-detect" ? "English" : sourceLanguage),
      targetLanguage,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Translation failed", details: (err as Error).message },
      { status: 500 }
    );
  }
}

