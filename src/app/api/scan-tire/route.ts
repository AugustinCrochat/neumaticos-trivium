import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

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

interface Candidate { width: number; profile: number; rim: number; score: number }

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

async function scanWithGemini(
  imageData: string,
  apiKey: string,
): Promise<Candidate | null> {
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
                text: `Eres un lector de medidas de neumáticos. La imagen puede mostrar texto en relieve sobre goma negra (puede ser difícil de ver). Buscá el marcado de medida del neumático.
Formato típico: 205/55 R16 o 195/65R15 o 225 40 18 o P205/55R16.
Devolvé SOLO tres números enteros separados por espacios: ANCHO PERFIL ARO
- ANCHO: 3 dígitos, rango 130-335 (ej: 205)
- PERFIL: 2 dígitos, rango 25-90 (ej: 55)
- ARO: 2 dígitos, rango 12-24 (ej: 16)
Si hay múltiples medidas, devolvé la más visible/central.
Si no encontrás ninguna, devolvé: NO_ENCONTRADO`,
              },
              { inline_data: { mime_type: 'image/jpeg', data: imageData } },
            ],
          }],
          generationConfig: { temperature: 0, maxOutputTokens: 20 },
        }),
      },
    );

    if (!res.ok) {
      console.error('Gemini error:', res.status, (await res.text()).slice(0, 200));
      return null;
    }

    const data = await res.json();
    const text: string = (data.candidates?.[0]?.content?.parts?.[0]?.text ?? '').trim();
    console.log('Gemini →', text);

    if (!text || text.includes('NO_ENCONTRADO')) return null;
    return bestCandidate((text.match(/\d+/g) ?? []).map(Number));
  } catch (err) {
    console.error('Gemini exception:', err);
    return null;
  }
}

async function scanWithOcrSpace(
  base64Image: string,
): Promise<Candidate | null> {
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

    // Multiple patterns — most specific first
    const patterns = [
      /P?(\d{3})[\/\-](\d{2})R(\d{2})/i,
      /(\d{3})[^\d]+(\d{2})[^\d]*R(\d{2})/i,
      /(\d{3})[^\d]+(\d{2})[^\d]+(\d{2})/,
    ];

    for (const pat of patterns) {
      const m = t.match(pat);
      if (m) {
        const nums = [+m[1], +m[2], +m[3]];
        const c = bestCandidate(nums);
        if (c) return c;
      }
    }
    return null;
  } catch (err) {
    console.error('OCR.space exception:', err);
    return null;
  }
}

async function saveDatasetImage(imageData: string, result: Candidate | null) {
  try {
    const buffer = Buffer.from(imageData, 'base64');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const label = result ? `${result.width}-${result.profile}-${result.rim}` : 'failed';
    const filename = `${timestamp}_${label}.jpg`;
    
    // In local development, save to the public dataset folder
    if (process.env.NODE_ENV === 'development') {
       const filepath = join(process.cwd(), 'public', 'dataset', filename);
       await writeFile(filepath, buffer);
       console.log(`Saved dataset image: ${filename}`);
    }
  } catch (err) {
    console.error('Failed to save dataset image:', err);
  }
}

export async function POST(req: NextRequest) {
  const { base64Image } = await req.json();
  const imageData = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');

  let result: Candidate | null = null;
  const apiKey = process.env.GOOGLE_AI_KEY;
  
  if (apiKey) {
    result = await scanWithGemini(imageData, apiKey);
  }

  if (!result) {
    result = await scanWithOcrSpace(base64Image);
  }
  
  // Guardamos la imagen asincrónicamente
  saveDatasetImage(imageData, result).catch(console.error);

  if (result) {
      return NextResponse.json({ found: true, width: result.width, profile: result.profile, rim: result.rim });
  }

  return NextResponse.json({ found: false });
}
