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
    if (g.length < 2) continue;
    const top = g.filter((p) => p.enStock).sort((a, b) => a.price - b.price)[0];
    if (top) best.set(top.id, sizeLabel(top));
  }
  return best;
}
