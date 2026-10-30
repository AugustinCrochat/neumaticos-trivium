import { NextResponse } from "next/server";
import { diameterDiffPercent, equivalentSizes, vehiclesUsingSize } from "@/lib/tire-sizes";
import { vehicleSlug, POPULAR_VEHICLES } from "@/lib/vehicles";

// Datos de una medida para el bloque informativo de /buscar: autos que la traen
// de fábrica y equivalencias. Va por API y no importado en el cliente porque
// VEHICLE_DB es enorme (ver medida-vehiculos). El contenido indexable de cada
// medida vive en /neumaticos/[medida]; esto es para quien ya está buscando.
export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const width = Number(sp.get("w"));
  const profile = Number(sp.get("p"));
  const rim = Number(sp.get("r"));
  if (!Number.isInteger(width) || !Number.isInteger(profile) || !Number.isInteger(rim) || width < 125 || width > 400 || profile < 20 || profile > 90 || rim < 10 || rim > 24) {
    return NextResponse.json({ vehiculos: [], equivalentes: [] }, { status: 400 });
  }
  const size = { width, profile, rim };
  const vistos = new Set<string>();
  const vehiculos: { brand: string; model: string; slug: string; ficha: boolean }[] = [];
  for (const v of vehiclesUsingSize(size)) {
    const key = `${v.brand} ${v.model}`;
    if (vistos.has(key)) continue;
    vistos.add(key);
    vehiculos.push({
      brand: v.brand,
      model: v.model,
      slug: vehicleSlug(v.brand, v.model),
      ficha: POPULAR_VEHICLES.some((p) => p.brand === v.brand && p.model === v.model),
    });
    if (vehiculos.length >= 16) break;
  }
  // Solo las realistas: a más de 30 mm de ancho ya es otro tipo de neumático.
  const equivalentes = equivalentSizes(size)
    .filter((e) => Math.abs(e.width - width) <= 30)
    .slice(0, 8)
    .map((s) => ({ w: s.width, p: s.profile, r: s.rim, diff: Math.round(diameterDiffPercent(s, size) * 10) / 10 }));
  return NextResponse.json(
    { vehiculos, equivalentes },
    { headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" } }
  );
}
