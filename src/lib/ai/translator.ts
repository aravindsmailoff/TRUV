const LANGUAGE_CODE_MAP: Record<string, string> = {
  english: "en",
  en: "en",
  gujarati: "gu",
  gu: "gu",
  hindi: "hi",
  hi: "hi",
  punjabi: "pa",
  pa: "pa",
  tamil: "ta",
  ta: "ta",
  kannada: "kn",
  kn: "kn",
  marathi: "mr",
  mr: "mr",
  bengali: "bn",
  bn: "bn",
  telugu: "te",
  te: "te",
  malayalam: "ml",
  ml: "ml",
  german: "de",
  de: "de",
  french: "fr",
  fr: "fr",
  spanish: "es",
  es: "es",
  arabic: "ar",
  ar: "ar",
};

export function resolveLanguageCode(language?: string): string {
  if (!language) return "en";
  const cleaned = language.trim().toLowerCase();
  if (LANGUAGE_CODE_MAP[cleaned]) return LANGUAGE_CODE_MAP[cleaned];
  for (const [key, code] of Object.entries(LANGUAGE_CODE_MAP)) {
    if (cleaned.includes(key)) return code;
  }
  return "en";
}

/**
 * Protects technical trade codes, alloys, standards, and currency amounts
 * from being mangled during translation.
 */
function protectTechnicalTokens(text: string): {
  masked: string;
  tokens: string[];
} {
  const tokens: string[] = [];
  const pattern =
    /\b(?:CW617N|CZ121|C36000|AISI\s?\d+|SS\d+|Ti-6Al-4V|Inconel\s?\d+|ASTM\s?[A-Z]?\d+|DIN\s?[A-Z0-9-]+|EN\s?\d+|ISO\s?\d+(?::\d+)?|UL\s?\d+|FCC|UKCA|SASO|SABER|BIS|ISI|ROHS|REACH|GOTS|OEKO-TEX|PVD|QIMA|IEC|GSTIN|STPI|TradeOracle|PayPal|DHL|ORD-[A-Z0-9-]+|PO-\d+|HS\s?\d[\d.]+)\b|\$\d[\d,]*(?:\.\d{1,2})?/gi;

  const masked = text.replace(pattern, (match) => {
    const idx = tokens.length;
    tokens.push(match);
    return `[[T${idx}]]`;
  });

  return { masked, tokens };
}

function restoreTechnicalTokens(text: string, tokens: string[]): string {
  return text.replace(/\[\[\s*T\s*(\d+)\s*\]\]/gi, (_, idxStr) => {
    const idx = Number(idxStr);
    return tokens[idx] !== undefined ? tokens[idx] : _;
  });
}

export interface TranslationResult {
  translatedText: string;
  detectedSourceLanguage: string;
  targetLanguage: string;
  engine: "TradeOracle Neural Translator" | "TradeOracle Backup Translator" | "Passthrough";
}

export async function translateTradeText(params: {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}): Promise<TranslationResult> {
  const text = params.text.trim();
  const targetLanguage = params.targetLanguage.trim() || "English";
  const sourceLanguage = (params.sourceLanguage || "auto").trim();

  const tl = resolveLanguageCode(targetLanguage);
  const sl =
    sourceLanguage.toLowerCase() === "auto" || sourceLanguage.toLowerCase() === "auto-detect"
      ? "auto"
      : resolveLanguageCode(sourceLanguage);

  if (!text || (sl !== "auto" && sl === tl)) {
    return {
      translatedText: text,
      detectedSourceLanguage: sourceLanguage === "auto" ? "English" : sourceLanguage,
      targetLanguage,
      engine: "Passthrough",
    };
  }

  const { masked, tokens } = protectTechnicalTokens(text);

  // 1. Primary: Google Neural Machine Translation (accurate native Indian & global scripts)
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
      sl
    )}&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(masked)}`;

    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });

    if (res.ok) {
      const data = (await res.json()) as [Array<[string, string]>, unknown, string?];
      const joined = Array.isArray(data?.[0])
        ? data[0].map((seg) => (Array.isArray(seg) ? seg[0] : "")).join("")
        : "";
      if (joined.trim()) {
        const restored = restoreTechnicalTokens(joined.trim(), tokens);
        return {
          translatedText: restored,
          detectedSourceLanguage: data?.[2] || (sl === "auto" ? "auto" : sourceLanguage),
          targetLanguage,
          engine: "TradeOracle Neural Translator",
        };
      }
    }
  } catch {
    // Fall through to backup translator
  }

  // 2. Backup: MyMemory Translation API
  try {
    const langPair = `${sl === "auto" ? "en" : sl}|${tl}`;
    const mmUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      masked
    )}&langpair=${encodeURIComponent(langPair)}`;
    const mmRes = await fetch(mmUrl, { cache: "no-store" });
    if (mmRes.ok) {
      const mmJson = (await mmRes.json()) as {
        responseData?: { translatedText?: string };
      };
      const rawTranslated = mmJson.responseData?.translatedText?.trim();
      if (rawTranslated) {
        return {
          translatedText: restoreTechnicalTokens(rawTranslated, tokens),
          detectedSourceLanguage: sl === "auto" ? "English" : sourceLanguage,
          targetLanguage,
          engine: "TradeOracle Backup Translator",
        };
      }
    }
  } catch {
    // Return original text if all translators unreachable
  }

  return {
    translatedText: text,
    detectedSourceLanguage: sourceLanguage === "auto" ? "English" : sourceLanguage,
    targetLanguage,
    engine: "Passthrough",
  };
}

