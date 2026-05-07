import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { put } from '@vercel/blob';

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
  originalImage: string,
  apiKey: string,
): Promise<Candidate | null> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: `Actúa como un experto inspector de neumáticos. Analiza la imagen minuciosamente y busca la nomenclatura técnica estándar de medidas (Ancho/Perfil R Diámetro).
Ignora por completo las marcas comerciales (ej: Pirelli, Fate, Michelin), nombres de modelo (ej: P400 EVO, Agilis) o códigos de fabricación (ej: DOT).
Ten en cuenta los siguientes desafíos visuales:
1. Curvatura: El texto sigue la forma circular de la rueda y puede estar curvo, al revés o en diagonal dependiendo de dónde frenó el auto.
2. Contraste: Al ser caucho negro con letras en relieve negras, busca sutiles sombras que definen los números.
Por favor, escanea toda la circunferencia del flanco (sidewall) hasta encontrar el patrón (ej: 205/55 R16, P195/65R15, 225 40 18).
Devuelve únicamente un objeto JSON estricto con las claves "ancho", "perfil" y "aro" (todas como números enteros). 
Ejemplo: {"ancho": 205, "perfil": 55, "aro": 16}.
Si no encuentras la medida, devuelve: {"error": "no encontrado"}`
              },
              { inline_data: { mime_type: 'image/jpeg', data: originalImage } }
            ],
          }],
          generationConfig: { temperature: 0, response_mime_type: "application/json" },
        }),
      },
    );

    if (!res.ok) {
      console.error('Gemini error:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const text: string = (data.candidates?.[0]?.content?.parts?.[0]?.text ?? '').trim();
    console.log('Gemini →', text);

    if (!text || text.includes('error') || text.includes('no encontrado')) return null;
    
    try {
      const parsed = JSON.parse(text);
      if (parsed.ancho && parsed.perfil && parsed.aro) {
        return bestCandidate([parsed.ancho, parsed.perfil, parsed.aro]);
      }
    } catch (e) {
      // Si falla el parseo JSON, intentamos usar nuestra regex por si acaso
      return bestCandidate((text.match(/\d+/g) ?? []).map(Number));
    }
    
    return null;
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
    
    if (process.env.BLOB_READ_WRITE_TOKEN) {
       // Save to Vercel Blob if token is available (Production or Local with Env Var)
       const blob = await put(`dataset/${filename}`, buffer, {
         access: 'public',
         contentType: 'image/jpeg'
       });
       console.log(`Saved dataset image to Vercel Blob: ${blob.url}`);
    } else if (process.env.NODE_ENV === 'development') {
       // Fallback to local file system only in development mode
       const filepath = join(process.cwd(), 'public', 'dataset', filename);
       await writeFile(filepath, buffer);
       console.log(`Saved dataset image locally: ${filename}`);
    } else {
       console.warn('Skipping image save: No Vercel Blob token configured.');
    }
  } catch (err) {
    console.error('Failed to save dataset image:', err);
  }
}

export async function POST(req: NextRequest) {
  const { base64Image, base64Processed, confirmLabel } = await req.json();
  const imageData = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');

  // Confirmation-only mode: user verified the result — save with human-validated label
  if (confirmLabel) {
    const [w, p, r] = String(confirmLabel).split('-').map(Number);
    const confirmed = (!isNaN(w) && !isNaN(p) && !isNaN(r))
      ? { width: w, profile: p, rim: r, score: 0 }
      : null;
    saveDatasetImage(imageData, confirmed).catch(console.error);
    return NextResponse.json({ ok: true });
  }

  const processedData = (base64Processed ?? base64Image).replace(/^data:image\/[a-z]+;base64,/, '');

  let result: Candidate | null = null;
  const apiKey = process.env.GOOGLE_AI_KEY;

  if (apiKey) {
    result = await scanWithGemini(imageData, apiKey);
  }

  if (!result) {
    result = await scanWithOcrSpace(base64Image);
  }

  // Only save failed scans immediately — successful ones are saved when user confirms
  if (!result) {
    saveDatasetImage(imageData, null).catch(console.error);
  }

  if (result) {
    return NextResponse.json({ found: true, width: result.width, profile: result.profile, rim: result.rim });
  }

  return NextResponse.json({ found: false });
}
