import type { Branch } from "@/lib/config";
import { getProductosDesdePOS, getServiciosPrecios } from "@/lib/pos-api";
import { bestPriceByGroup } from "@/lib/best-price";
import { splitAutoCamioneta } from "@/lib/servicios";
import type { TireProduct } from "@/lib/types";

/**
 * Datos reales de una sucursal para su ficha: neumáticos con stock (los más
 * vendidos primero, a igual venta el más barato) y precios de taller del POS.
 * Una sucursal que todavía no abrió no tiene stock ni precios propios: no se
 * muestra nada que sugiera lo contrario.
 */
export async function datosSucursal(branch: Branch) {
  const abierta = !branch.provisorio && !branch.apertura;
  const [productos, precios] = abierta
    ? await Promise.all([getProductosDesdePOS(branch.id), getServiciosPrecios(undefined, branch.id)])
    : [[] as TireProduct[], []];

  const conStock = productos
    .filter((p) => p.enStock && !p.isCarga)
    .sort((a, b) => (b.vendidos ?? 0) - (a.vendidos ?? 0) || a.price - b.price);
  const desde = conStock.length ? Math.min(...conStock.map((p) => p.price)) : null;
  const masBarato = desde === null ? null : conStock.find((p) => p.price === desde) ?? null;
  const mejores = [...bestPriceByGroup(conStock)];

  // Medida -> el precio más bajo con stock, para "las medidas más pedidas".
  const porMedida = new Map<string, { size: TireProduct["size"]; desde: number; ventas: number }>();
  for (const p of conStock) {
    const k = `${p.size.width}-${p.size.profile}-${p.size.rim}`;
    const e = porMedida.get(k);
    if (e) {
      e.desde = Math.min(e.desde, p.price);
      e.ventas += p.vendidos ?? 0;
    } else porMedida.set(k, { size: p.size, desde: p.price, ventas: p.vendidos ?? 0 });
  }
  const medidas = [...porMedida.values()].sort((a, b) => b.ventas - a.ventas || a.desde - b.desde).slice(0, 10);

  return {
    abierta,
    conStock,
    desde,
    masBarato,
    mejores,
    medidas,
    alineacion: splitAutoCamioneta(precios.filter((p) => p.grupo === "alineacion")),
    balanceo: splitAutoCamioneta(precios.filter((p) => p.grupo === "balanceo")),
    combo: splitAutoCamioneta(precios.filter((p) => p.grupo === "combo")),
  };
}

export type DatosSucursal = Awaited<ReturnType<typeof datosSucursal>>;
