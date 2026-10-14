import { NextResponse } from "next/server";
import { DEFAULT_BRANCH_ID } from "@/lib/config";
import { getProductosDesdePOS } from "@/lib/pos-api";

// Medidas del catálogo para las sugerencias del buscador (TireSizeSearch):
// ancho, perfil, rodado, cuántos modelos hay, cuántos con stock y el precio más
// bajo con stock. Lo pide el buscador recién cuando alguien enfoca un campo, así
// no pesa en la carga de ninguna página.
//
// force-static como /api/vehiculos: se congela en el build y se refresca con el
// redeploy (ahora también cuando el POS avisa un cambio de producto). No usar
// `revalidate` — ver pos-api.ts.
export const dynamic = "force-static";

export type MedidaCatalogo = {
  w: number;
  p: number;
  r: number;
  /** Neumático de carga (serie C): misma medida nominal, otra landing. */
  c: boolean;
  /** Modelos en catálogo. */
  n: number;
  /** Modelos con stock. */
  s: number;
  /** Precio más bajo entre los que tienen stock, o null. */
  d: number | null;
};

export async function GET() {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const mapa = new Map<string, MedidaCatalogo>();
  for (const prod of productos) {
    const c = Boolean(prod.isCarga);
    const key = `${prod.size.width}-${prod.size.profile}-${prod.size.rim}${c ? "c" : ""}`;
    const e =
      mapa.get(key) ??
      { w: prod.size.width, p: prod.size.profile, r: prod.size.rim, c, n: 0, s: 0, d: null };
    e.n += 1;
    if (prod.enStock) {
      e.s += 1;
      e.d = e.d === null ? prod.price : Math.min(e.d, prod.price);
    }
    mapa.set(key, e);
  }
  return NextResponse.json(
    { medidas: [...mapa.values()] },
    { headers: { "Cache-Control": "public, max-age=300, s-maxage=300" } }
  );
}
