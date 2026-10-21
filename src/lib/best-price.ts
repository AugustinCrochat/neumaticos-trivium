import type { TireProduct } from "@/lib/types";

export function sizeLabel(p: TireProduct) {
  return `${p.size.width}/${p.size.profile} R${p.size.rim}`;
}

/**
 * Mejor precio por medida y tipo (carga / A-T / común): el más barato con
 * stock de cada grupo. Un grupo de un solo producto no se marca — no hay con
 * qué comparar. Devuelve id -> medida, para que las vistas con medidas
 * mezcladas puedan aclarar en el tag de qué medida es el mejor precio.
 */
/** Datos mínimos de un producto para comparar precio dentro de su grupo. */
export type PricePeer = { id: string; price: number; enStock?: boolean };

const groupKey = (p: TireProduct) => `${sizeLabel(p)}|${p.isCarga ? "C" : ""}|${p.isAT ? "AT" : ""}`;

/** Texto del tag: medida y tipo del grupo. */
export function groupLabel(p: TireProduct) {
  return `${sizeLabel(p)}${p.isCarga ? " Carga" : ""}${p.isAT ? " A/T" : ""}`;
}

/** id -> productos de su mismo grupo (incluido él), para recalcular el mejor
    precio en el cliente con el stock y el precio vivos. */
export function peersByGroup(products: TireProduct[]): Map<string, PricePeer[]> {
  const groups = new Map<string, PricePeer[]>();
  for (const p of products) {
    const key = groupKey(p);
    const g = groups.get(key) ?? [];
    g.push({ id: p.id, price: p.price, enStock: p.enStock });
    groups.set(key, g);
  }
  const out = new Map<string, PricePeer[]>();
  for (const p of products) out.set(p.id, groups.get(groupKey(p))!);
  return out;
}

/**
 * ¿Es el mejor precio del grupo con los datos vivos? Mismo criterio que
 * bestPriceByGroup (el más barato con stock; los empatados cuentan), pero
 * pisando precio y stock con lo que dice el catálogo vivo. El build puede
 * tener hasta 2 h de atraso: sin esto el tag queda en un producto que ya se
 * agotó mientras el precio y el stock de la tarjeta sí se corrigen.
 */
export function isBestPriceLive(
  id: string,
  peers: PricePeer[],
  live: Record<string, { enStock: boolean; price: number } | undefined>
): boolean {
  const eff = peers.map((q) => ({ id: q.id, price: live[q.id]?.price ?? q.price, enStock: live[q.id]?.enStock ?? q.enStock }));
  const conStock = eff.filter((q) => q.enStock);
  const me = conStock.find((q) => q.id === id);
  if (!me) return false;
  return me.price === Math.min(...conStock.map((q) => q.price));
}

export function bestPriceByGroup(products: TireProduct[]): Map<string, string> {
  const groups = new Map<string, TireProduct[]>();
  for (const p of products) {
    const key = `${sizeLabel(p)}|${p.isCarga ? "C" : ""}|${p.isAT ? "AT" : ""}`;
    const g = groups.get(key);
    if (g) g.push(p);
    else groups.set(key, [p]);
  }
  const best = new Map<string, string>();
  for (const g of groups.values()) {
    // Todos los empatados en el mínimo llevan el tag.
    const conStock = g.filter((p) => p.enStock);
    if (conStock.length === 0) continue;
    const min = Math.min(...conStock.map((p) => p.price));
    for (const p of conStock) {
      if (p.price === min) best.set(p.id, `${sizeLabel(p)}${p.isCarga ? " Carga" : ""}${p.isAT ? " A/T" : ""}`);
    }
  }
  return best;
}
