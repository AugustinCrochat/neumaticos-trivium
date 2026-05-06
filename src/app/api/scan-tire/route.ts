import { NextRequest, NextResponse } from 'next/server';

// Medidas reales del catálogo (sin outliers: 0, 787, 838, 390)
const WIDTHS  = [135, 145, 155, 165, 175, 185, 195, 205, 215, 220, 225, 235, 245, 255, 265, 275, 285, 295, 305, 315, 325];
const PROFILES = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
const RIMS    = [13, 14, 15, 16, 17, 18, 19, 20, 21];

function snap(value: number, list: number[]): number {
  return list.reduce((best, v) => Math.abs(v - value) < Math.abs(best - value) ? v : best);
}

function plausible(w: number, p: number, r: number) {
  return w >= 130 && w <= 335 && p >= 25 && p <= 90 && r >= 12 && r <= 24;
}

export async function POST(req: NextRequest) {
  const { base64Image } = await req.json();

  const apiKey = process.env.GOOGLE_AI_KEY;
  if (!apiKey) {
    return NextResponse.json({ found: false, error: 'GOOGLE_AI_KEY no configurada' }, { status: 500 });
  }

  const imageData = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');

  let geminiResponse: Response;
  try {
    geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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
      }
    );
  } catch {
    return NextResponse.json({ found: false, error: 'Error de conexión con Gemini' });
  }

  if (!geminiResponse.ok) {
    const errText = await geminiResponse.text().catch(() => '');
    console.error('Gemini error:', geminiResponse.status, errText);
    return NextResponse.json({ found: false, error: `Error OCR: ${geminiResponse.status}` });
  }

  const result = await geminiResponse.json();
  const text = (result.candidates?.[0]?.content?.parts?.[0]?.text ?? '').trim();

  if (!text || text === 'NO_ENCONTRADO') {
    return NextResponse.json({ found: false });
  }

  const nums = (text.match(/\d+/g) ?? []).map(Number);

  // Probamos todas las ventanas de 3 números hasta encontrar una plausible
  for (let i = 0; i <= nums.length - 3; i++) {
    const [a, b, c] = nums.slice(i, i + 3);
    if (plausible(a, b, c)) {
      return NextResponse.json({
        found: true,
        width:   snap(a, WIDTHS),
        profile: snap(b, PROFILES),
        rim:     snap(c, RIMS),
      });
    }
  }

  return NextResponse.json({ found: false });
}
