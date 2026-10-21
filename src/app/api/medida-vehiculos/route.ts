import { NextResponse } from "next/server";
import { vehiclesUsingSize } from "@/lib/tire-sizes";

// Autos que vienen de fábrica con una medida, para que el buscador confirme
// "es la medida de: Corolla, Cruze…" al completarla. Va por API y no importado
// en el cliente porque VEHICLE_DB es enorme y no debe entrar al bundle del
// buscador (ver size-href.ts).
export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const width = Number(sp.get("w"));
  const profile = Number(sp.get("p"));
  const rim = Number(sp.get("r"));
  if (!Number.isInteger(width) || !Number.isInteger(profile) || !Number.isInteger(rim) || width < 125 || width > 400 || profile < 20 || profile > 90 || rim < 10 || rim > 24) {
    return NextResponse.json({ vehiculos: [] }, { status: 400 });
  }
  const vistos = new Set<string>();
  const vehiculos: { brand: string; model: string }[] = [];
  for (const v of vehiclesUsingSize({ width, profile, rim })) {
    const key = `${v.brand} ${v.model}`;
    if (vistos.has(key)) continue;
    vistos.add(key);
    vehiculos.push({ brand: v.brand, model: v.model });
    if (vehiculos.length >= 4) break;
  }
  return NextResponse.json(
    { vehiculos },
    { headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" } }
  );
}
