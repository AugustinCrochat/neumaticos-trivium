import { NextResponse } from "next/server";

// Búsqueda de vehículo por patente para el buscador "Por mi auto".
//
// Cada consulta nueva gasta cupo pago de Clasificar (en el ERP, que además
// guarda un caché: una patente repetida es gratis). Por eso acá se exige un
// token de Turnstile y se limita por IP antes de molestar al POS. Si falta la
// configuración, el endpoint queda apagado en vez de abierto.
const POS_BASE = process.env.POS_API_BASE_URL ?? "https://trivium-erp.vercel.app/api/public";
const PATENTE_RE = /^([A-Z]{3}\d{3}|[A-Z]{2}\d{3}[A-Z]{2})$/;

// Límite por IP en memoria del isolate: es un freno de mano barato, no una
// garantía (cada isolate cuenta por separado). La barrera real es Turnstile.
const VENTANA_MS = 10 * 60 * 1000;
const MAX_POR_VENTANA = 8;
const visitas = new Map<string, number[]>();

function pasaLimite(ip: string): boolean {
  const ahora = Date.now();
  const recientes = (visitas.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  if (recientes.length >= MAX_POR_VENTANA) {
    visitas.set(ip, recientes);
    return false;
  }
  recientes.push(ahora);
  visitas.set(ip, recientes);
  if (visitas.size > 5000) {
    for (const [k, v] of visitas) if (v.every((t) => ahora - t >= VENTANA_MS)) visitas.delete(k);
  }
  return true;
}

export async function POST(req: Request) {
  const secretTurnstile = process.env.TURNSTILE_SECRET_KEY;
  const secretPos = process.env.POS_PATENTE_SECRET;
  if (!secretTurnstile || !secretPos) {
    return NextResponse.json({ error: "No disponible" }, { status: 503 });
  }

  const body = (await req.json().catch(() => null)) as { patente?: string; token?: string } | null;
  const patente = (body?.patente ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!PATENTE_RE.test(patente)) return NextResponse.json({ error: "Patente inválida" }, { status: 400 });
  if (!body?.token) return NextResponse.json({ error: "Verificación requerida" }, { status: 400 });

  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  if (!pasaLimite(ip || "desconocida")) {
    return NextResponse.json({ error: "Demasiadas consultas, probá en unos minutos" }, { status: 429 });
  }

  const verif = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret: secretTurnstile, response: body.token, ...(ip ? { remoteip: ip } : {}) }),
  })
    .then((r) => r.json() as Promise<{ success?: boolean }>)
    .catch(() => null);
  if (!verif?.success) return NextResponse.json({ error: "Verificación fallida" }, { status: 403 });

  try {
    const res = await fetch(`${POS_BASE}/patente?patente=${patente}`, {
      headers: { "x-web-secret": secretPos },
      signal: AbortSignal.timeout(20_000),
      cache: "no-store",
    });
    if (res.status === 404) return NextResponse.json({ error: "No encontramos esa patente" }, { status: 404 });
    // Cupo agotado o servicio caído: la UI cae al selector manual.
    if (!res.ok) return NextResponse.json({ error: "No disponible" }, { status: 503 });
    const d = (await res.json()) as { marca: string; modelo: string | null; anio: number | null };
    return NextResponse.json({ marca: d.marca, modelo: d.modelo, anio: d.anio });
  } catch {
    return NextResponse.json({ error: "No disponible" }, { status: 503 });
  }
}
