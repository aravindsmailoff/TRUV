import { NextRequest, NextResponse } from "next/server";
import { translateTradeText } from "@/lib/ai/translator";

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
    const sourceLanguage = (body.sourceLanguage || "auto").trim();

    if (!text) {
      return NextResponse.json({ error: "Text is required for translation." }, { status: 400 });
    }

    const result = await translateTradeText({
      text,
      targetLanguage,
      sourceLanguage,
    });

    return NextResponse.json({
      poweredBy: "TradeOracle AI",
      translatedText: result.translatedText,
      detectedSourceLanguage: result.detectedSourceLanguage,
      targetLanguage: result.targetLanguage,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Translation failed", details: (err as Error).message },
      { status: 500 }
    );
  }
}
