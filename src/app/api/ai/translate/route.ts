import { NextRequest, NextResponse } from "next/server";
import { translateTradeText } from "@/lib/ai/translator";

interface TranslateRequest {
  text?: string;
  texts?: string[];
  targetLanguage?: string;
  sourceLanguage?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TranslateRequest;
    const targetLanguage = (body.targetLanguage || "English").trim();
    const sourceLanguage = (body.sourceLanguage || "auto").trim();

    if (Array.isArray(body.texts)) {
      const items = body.texts.map((t) => String(t ?? ""));
      if (items.length === 0) {
        return NextResponse.json({ poweredBy: "TradeOracle AI", translations: [] });
      }

      // Translate in chunks of 30 items using a newline-numbered separator
      const chunkSize = 30;
      const translations: string[] = [];
      for (let i = 0; i < items.length; i += chunkSize) {
        const chunk = items.slice(i, i + chunkSize);
        const joined = chunk.join("\n===TRUV_SEP===\n");
        const res = await translateTradeText({
          text: joined,
          targetLanguage,
          sourceLanguage,
        });
        const split = res.translatedText.split(/\s*===\s*TRUV_SEP\s*===\s*/i);
        if (split.length === chunk.length) {
          translations.push(...split.map((s) => s.trim()));
        } else {
          // Fallback: translate individually if delimiter count drifted
          const indiv = await Promise.all(
            chunk.map(async (item) => {
              const r = await translateTradeText({
                text: item,
                targetLanguage,
                sourceLanguage,
              });
              return r.translatedText;
            })
          );
          translations.push(...indiv);
        }
      }

      return NextResponse.json({
        poweredBy: "TradeOracle AI",
        targetLanguage,
        translations,
      });
    }

    const text = (body.text || "").trim();
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
