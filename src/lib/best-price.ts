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
