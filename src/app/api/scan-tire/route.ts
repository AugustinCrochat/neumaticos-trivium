import { NextRequest, NextResponse } from 'next/server';

const WIDTHS   = [135, 145, 155, 165, 175, 185, 195, 205, 215, 220, 225, 235, 245, 255, 265, 275, 285, 295, 305, 315, 325];
const PROFILES = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
const RIMS     = [13, 14, 15, 16, 17, 18, 19, 20, 21];

function snap(value: number, list: number[]): number {
  return list.reduce((best, v) => Math.abs(v - value) < Math.abs(best - value) ? v : best);
}

function plausible(w: number, p: number, r: number) {
  return w >= 130 && w <= 335 && p >= 25 && p <= 90 && r >= 12 && r <= 24;
}

function extractFromNums(nums: number[]): { width: number; profile: number; rim: number } | null {
  for (let i = 0; i <= nums.length - 3; i++) {
    const [a, b, c] = nums.slice(i, i + 3);
    if (plausible(a, b, c)) {
      return { width: snap(a, WIDTHS), profile: snap(b, PROFILES), rim: snap(c, RIMS) };
    }
  }
  return null;
}

async function scanWithGemini(
  imageData: string,
  apiKey: string,
): Promise<{ width: number; profile: number; rim: number } | null> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: `Eres un lector de medidas de neumáticos. Buscá en la imagen el marcado de medida del neumático.
Las medidas tienen este formato: 205/55 R16 o 195/65R15 o 225 40 18.
Devolvé SOLO tres números enteros separados por espacios: ANCHO PERFIL ARO
- ANCHO: 3 dígitos, rango 130-335 (ej: 205)
- PERFIL: 2 dígitos, rango 25-90 (ej: 55)
- ARO: 2 dígitos, rango 12-24 (ej: 16)
Si no encontrás ninguna medida de neumático, devolvé exactamente: NO_ENCONTRADO`,
              },
              { inline_data: { mime_type: 'image/jpeg', data: imageData } },
            ],
          }],
          generationConfig: { temperature: 0, maxOutputTokens: 20 },
        }),
      },
    );

    if (!res.ok) {
      console.error('Gemini error:', res.status, (await res.text()).slice(0, 300));
      return null;
    }

    const data = await res.json();
    const text: string = (data.candidates?.[0]?.content?.parts?.[0]?.text ?? '').trim();
    console.log('Gemini →', text);

    if (!text || text.includes('NO_ENCONTRADO')) return null;
    return extractFromNums((text.match(/\d+/g) ?? []).map(Number));
  } catch (err) {
    console.error('Gemini exception:', err);
    return null;
  }
}

async function scanWithOcrSpace(
  base64Image: string,
): Promise<{ width: number; profile: number; rim: number } | null> {
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

    const patterns = [
      /P?(\d{3})[\/\-](\d{2})R(\d{2})/i,
      /(\d{3})[^\d]+(\d{2})[^\d]*R(\d{2})/i,
      /(\d{3})[^\d]+(\d{2})[^\d]+(\d{2})/,
    ];

    for (const pat of patterns) {
      const m = t.match(pat);
      if (m) {
        const [a, b, c] = [+m[1], +m[2], +m[3]];
        if (plausible(a, b, c)) {
          return { width: snap(a, WIDTHS), profile: snap(b, PROFILES), rim: snap(c, RIMS) };
        }
      }
    }
    return null;
  } catch (err) {
    console.error('OCR.space exception:', err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const { base64Image } = await req.json();
  const imageData = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');

  const apiKey = process.env.GOOGLE_AI_KEY;
  if (apiKey) {
    const result = await scanWithGemini(imageData, apiKey);
    if (result) return NextResponse.json({ found: true, ...result });
  }

  // Fallback: OCR.space (worked before, acts as safety net)
  const result = await scanWithOcrSpace(base64Image);
  if (result) return NextResponse.json({ found: true, ...result });

  return NextResponse.json({ found: false });
}
