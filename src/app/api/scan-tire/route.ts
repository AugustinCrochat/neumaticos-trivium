import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 20;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_SCANS = 3;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

const WIDTHS   = [135, 145, 155, 165, 175, 185, 195, 205, 215, 220, 225, 235, 245, 255, 265, 275, 285, 295, 305, 315, 325];
const PROFILES = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
const RIMS     = [13, 14, 15, 16, 17, 18, 19, 20, 21];

function snap(value: number, list: number[]): number {
  return list.reduce((best, v) => Math.abs(v - value) < Math.abs(best - value) ? v : best);
}

function plausible(w: number, p: number, r: number): boolean {
  return w >= 130 && w <= 335 && p >= 25 && p <= 90 && r >= 12 && r <= 24;
}

/**
 * Score how common this combination is in the Argentine passenger car market.
 * Higher = more likely.
 */
function marketScore(w: number, p: number, r: number): number {
  let s = 0;

  // Ancho más común AR: 175–235
  if (w >= 175 && w <= 235) s += 12;
  else if (w >= 155 && w <= 265) s += 5;

  // Perfil más común AR: 55–70 (autos); SUV usa 60-75
  if (p >= 55 && p <= 70) s += 12;
  else if (p >= 45 && p <= 80) s += 5;

  // Rodado más común AR: 14–17
  if (r >= 14 && r <= 17) s += 12;
  else if (r === 13 || r === 18) s += 4;

  // Combinaciones físicamente imposibles o muy raras en AR:
  if (w > 225 && r < 15) s -= 25;     // ancho + rodado chico (ej: 285/30/13)
  if (w < 175 && r > 17) s -= 20;     // angosto + rodado grande
  if (p < 40 && r < 16) s -= 20;      // perfil muy bajo + rodado chico
  if (p > 75 && r > 18) s -= 15;      // perfil muy alto + rodado grande
  if (w > 275 && p < 50) s -= 10;     // muy ancho + perfil bajo (exótico en AR)

  // Combinaciones comunes en AR: premio extra
  const common: Array<[number, number, number]> = [
    [185, 65, 15], [185, 70, 14], [195, 65, 15], [205, 55, 16],
    [205, 65, 15], [205, 65, 16], [215, 65, 16], [215, 60, 16],
    [225, 65, 17], [235, 65, 17], [265, 70, 17], [175, 70, 14],
    [175, 65, 14], [165, 70, 13],
  ];
  if (common.some(([cw, cp, cr]) => snap(w, WIDTHS) === cw && snap(p, PROFILES) === cp && snap(r, RIMS) === cr)) {
    s += 8;
  }

  return s;
}

interface Candidate { width: number; profile: number; rim: number; score: number; raw?: string }
interface OcrResult { candidate: Candidate | null; tireLike: boolean }
interface GeminiError {
  code?: number;
  status?: string;
  message?: string;
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || req.headers.get('x-real-ip') || 'unknown';
}

function checkRateLimit(key: string): { limited: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();
  const current = rateLimitBuckets.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { limited: false, remaining: RATE_LIMIT_MAX_SCANS - 1, retryAfter: 0 };
  }

  if (current.count >= RATE_LIMIT_MAX_SCANS) {
    return {
      limited: true,
      remaining: 0,
      retryAfter: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  current.count += 1;
  return {
    limited: false,
    remaining: RATE_LIMIT_MAX_SCANS - current.count,
    retryAfter: Math.ceil((current.resetAt - now) / 1000),
  };
}

function bestCandidate(nums: number[]): Candidate | null {
  const candidates: Candidate[] = [];
  for (let i = 0; i <= nums.length - 3; i++) {
    const [a, b, c] = nums.slice(i, i + 3);
    if (plausible(a, b, c)) {
      const w = snap(a, WIDTHS), p = snap(b, PROFILES), r = snap(c, RIMS);
      candidates.push({ width: w, profile: p, rim: r, score: marketScore(w, p, r) });
    }
  }
  if (!candidates.length) return null;
  return candidates.reduce((best, c) => c.score > best.score ? c : best);
}

function candidateFromValues(
  width: number,
  profile: number,
  rim: number,
  bonus: number,
  raw: string,
): Candidate | null {
  if (!plausible(width, profile, rim)) return null;

  const snappedWidth = snap(width, WIDTHS);
  const snappedProfile = snap(profile, PROFILES);
  const snappedRim = snap(rim, RIMS);
  const snapPenalty =
    Math.abs(width - snappedWidth) / 5 +
    Math.abs(profile - snappedProfile) +
    Math.abs(rim - snappedRim) * 2;

  return {
    width: snappedWidth,
    profile: snappedProfile,
    rim: snappedRim,
    score: marketScore(snappedWidth, snappedProfile, snappedRim) + bonus - snapPenalty,
    raw,
  };
}

function normalizeOcrForSize(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[|]/g, 'I')
    .replace(/(?<=\d)[OQ](?=\d)/g, '0')
    .replace(/(?<=\d)[IL](?=\d)/g, '1')
    .replace(/(?<=\d)S(?=\d)/g, '5')
    .replace(/(?<=\d)B(?=\d)/g, '8')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseTireSizeFromText(raw: string): Candidate | null {
  const text = normalizeOcrForSize(raw);
  const candidates: Candidate[] = [];

  function push(width: string, profile: string, rim: string, bonus: number, source: string) {
    const candidate = candidateFromValues(Number(width), Number(profile), Number(rim), bonus, source);
    if (candidate) candidates.push(candidate);
  }

  const explicitPatterns = [
    /(?:^|[^\d])P?(\d{3})\s*[\/\\\-]\s*(\d{2})\s*(?:Z\s*)?[R8B]\s*[-\s]?(\d{2})(?:[^\d]|$)/g,
    /(?:^|[^\d])P?(\d{3})\s*[\/\\\-]\s*(\d{2})\s*(\d{2})(?:[^\d]|$)/g,
    /(?:^|[^\d])P?(\d{3})\s+(\d{2})\s*(?:Z\s*)?[R8B]?\s*(\d{2})(?:[^\d]|$)/g,
  ];

  for (const pattern of explicitPatterns) {
    for (const match of text.matchAll(pattern)) {
      push(match[1], match[2], match[3], 35, match[0]);
    }
  }

  const compact = text.replace(/[^A-Z0-9]/g, '');
  const compactPatterns = [
    /P?(\d{3})(\d{2})(1[3-9]|2[0-4])/g,
    /P?(\d{3})(\d{2})(?:ZR|R|8|B)(1[3-9]|2[0-4])/g,
  ];

  for (const pattern of compactPatterns) {
    for (const match of compact.matchAll(pattern)) {
      push(match[1], match[2], match[3], 22, match[0]);
    }
  }

  const nums = (text.match(/\d+/g) ?? []).map(Number);
  const looseCandidate = bestCandidate(nums);
  if (looseCandidate) candidates.push({ ...looseCandidate, score: looseCandidate.score + 4, raw: text });

  if (!candidates.length) return null;

  const unique = new Map<string, Candidate>();
  for (const candidate of candidates) {
    const key = `${candidate.width}-${candidate.profile}-${candidate.rim}`;
    const current = unique.get(key);
    if (!current || candidate.score > current.score) unique.set(key, candidate);
  }

  const best = [...unique.values()].reduce((currentBest, candidate) =>
    candidate.score > currentBest.score ? candidate : currentBest,
  );

  return best.score >= 8 ? best : null;
}

async function scanWithGemini(
  imageData: string,
  apiKey: string,
  configuredModel?: string,
): Promise<Candidate | null> {
  const modelCandidates = [
    'gemini-2.0-flash-lite',
    configuredModel,
    'gemini-2.0-flash',
    'gemini-1.5-flash',
  ].filter((model, index, all): model is string => !!model && all.indexOf(model) === index);

  let lastError: Candidate | null = null;

  try {
    for (const modelName of modelCandidates) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: "First verify this is a tire sidewall photo. If it is not a tire sidewall, reply NOT_TIRE. If it is a tire sidewall, identify the tire size marking (e.g., 205/55R16). Reply ONLY with the detected size. If no size is visible, reply NO_ENCONTRADO." },
                { inline_data: { mime_type: 'image/jpeg', data: imageData } }
              ],
            }],
            generationConfig: {
              temperature: 0,
            },
          }),
        },
      );

      if (!res.ok) {
        const errText = await res.text();
        console.error(`Gemini error (${modelName}):`, res.status, errText);
        let parsedError: GeminiError | null = null;
        try {
          parsedError = JSON.parse(errText)?.error ?? null;
        } catch {
          parsedError = null;
        }

        lastError = { width: -res.status, profile: 0, rim: 0, score: 0, raw: errText };

        const isModelUnavailable = res.status === 404
          || parsedError?.status === 'NOT_FOUND'
          || parsedError?.code === 404;
        if (isModelUnavailable) continue;

        return lastError;
      }

      const data = await res.json();
      const text: string = (data.candidates?.[0]?.content?.parts?.[0]?.text ?? '').trim();
      console.log(`Gemini (${modelName}) →`, text);

      if (text.includes('NOT_TIRE')) return { width: -102, profile: 0, rim: 0, score: 0, raw: text };
      if (!text || text.includes('NO_ENCONTRADO')) return { width: -100, profile: 0, rim: 0, score: 0, raw: text };

      // Extract numbers (e.g. 245, 40, 18) and find best candidate
      const nums = (text.match(/\d+/g) ?? []).map(Number);
      if (nums.length >= 3) {
        return bestCandidate(nums) ?? { width: -101, profile: 0, rim: 0, score: 0, raw: text };
      }

      return { width: -101, profile: 0, rim: 0, score: 0, raw: text };
    }

    return lastError ?? null;
  } catch (err) {
    console.error('Gemini exception:', err);
    return null;
  }
}

async function scanWithOcrSpace(
  base64Image: string,
): Promise<OcrResult> {
  try {
    const formData = new FormData();
    formData.append('base64Image', base64Image);
    formData.append('apikey', process.env.OCR_SPACE_KEY ?? 'K89503802988957');
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');
    formData.append('OCREngine', '2');
    formData.append('detectOrientation', 'true');

    const res = await fetch('https://api.ocr.space/parse/image', { method: 'POST', body: formData });
    const data = await res.json();
    const raw: string = data.ParsedResults?.[0]?.ParsedText ?? '';
    const t = raw.replace(/\s+/g, '').toUpperCase();
    console.log('OCR.space →', t.slice(0, 80));

    const candidate = parseTireSizeFromText(raw);
    if (candidate) return { candidate, tireLike: true };

    const tireWords = [
      'TUBELESS', 'RADIAL', 'STEEL', 'BELTED', 'SIDEWALL', 'TREAD',
      'DOT', 'LOAD', 'MAX', 'PRESS', 'PSI', 'TRACTION', 'TEMPERATURE',
      'OUTSIDE', 'INSIDE', 'ROTATION', 'M+S', 'XL', 'ZR',
    ];
    const tireLike = tireWords.some((word) => t.includes(word));
    return { candidate: null, tireLike };
  } catch (err) {
    console.error('OCR.space exception:', err);
    return { candidate: null, tireLike: false };
  }
}

function stripBase64Prefix(image: string): string {
  return image.replace(/^data:image\/[a-z]+;base64,/, '');
}

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(getClientIp(req));
  if (rateLimit.limited) {
    return NextResponse.json(
      {
        found: false,
        error: 'rate_limit',
        message: 'Alcanzaste el límite de escaneos. Probá de nuevo en unos minutos.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfter),
          'X-RateLimit-Limit': String(RATE_LIMIT_MAX_SCANS),
          'X-RateLimit-Remaining': '0',
        },
      },
    );
  }

  const { base64Image, base64Processed } = await req.json();
  const imageData = stripBase64Prefix(base64Image);
  const processedData = (base64Processed ?? base64Image).replace(/^data:image\/[a-z]+;base64,/, '');

  const ocrResults = [
    await scanWithOcrSpace(`data:image/jpeg;base64,${processedData}`),
  ];
  if (base64Processed) {
    ocrResults.push(await scanWithOcrSpace(base64Image));
  }

  const ocrCandidate = ocrResults.find((ocr) => ocr.candidate)?.candidate ?? null;
  if (ocrCandidate) {
    return NextResponse.json(
      { found: true, width: ocrCandidate.width, profile: ocrCandidate.profile, rim: ocrCandidate.rim, source: 'ocr' },
      { headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) } },
    );
  }

  const tireLike = ocrResults.some((ocr) => ocr.tireLike);
  if (!tireLike) {
    return NextResponse.json(
      {
        found: false,
        error: 'not_tire',
        message: 'No pudimos confirmar que la imagen sea del flanco de un neumático.',
      },
      { headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) } },
    );
  }

  const apiKey = process.env.GOOGLE_AI_KEY || process.env.GEMINI_API_KEY;
  const configuredModel = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash-lite';
  if (!apiKey) {
    console.error("Missing GOOGLE_AI_KEY");
    return NextResponse.json({ found: false, error: "config" });
  }

  let result: Candidate | null = null;
  result = await scanWithGemini(imageData, apiKey, configuredModel);

  if (result && result.width < 0) {
    const status = Math.abs(result.width);
    if (status === 102) {
      return NextResponse.json({
        found: false,
        error: "not_tire",
        message: "No pudimos confirmar que la imagen sea del flanco de un neumático.",
      });
    }

    if (status === 429) {
      return NextResponse.json({
        found: false,
        error: "quota",
        status: 429,
        message: "Se agotó temporalmente la cuota de IA. Esperá 1 minuto y probá de nuevo.",
      });
    }

    return NextResponse.json({ 
      found: false, 
      error: "debug", 
      status,
      raw: result.raw 
    });
  }

  if (result) {
    return NextResponse.json(
      { found: true, width: result.width, profile: result.profile, rim: result.rim, source: 'gemini' },
      { headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) } },
    );
  }

  return NextResponse.json(
    { found: false },
    { headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) } },
  );
}
