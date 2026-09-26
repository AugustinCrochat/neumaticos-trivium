import { matchScore, CATEGORY_TAGS } from "./fuzzy-search";
import type { TireProduct, Accessory } from "./types";

export type ScoredMatch =
  | { type: "tire"; item: TireProduct; score: number }
  | { type: "accessory"; item: Accessory; score: number };

/** Todos los matches, ordenados por puntaje (sin recortar) — el llamador decide cuánto mostrar. */
export function searchCatalog(query: string, productos: TireProduct[], accesorios: Accessory[]): ScoredMatch[] {
  const scored: ScoredMatch[] = [];

  for (const p of productos) {
    const { width, profile, rim } = p.size;
    // Alguien que busca la medida completa a veces la escribe pegada y en
    // cualquier orden ("1756514", "6514175" en vez de "175 65 14") — como la
    // búsqueda pega por palabra completa, sin esto ese token no matcheaba
    // con nada. Las 6 combinaciones cubren cualquier orden real de w/p/r.
    const digitCombos = [
      `${width}${profile}${rim}`,
      `${width}${rim}${profile}`,
      `${profile}${width}${rim}`,
      `${profile}${rim}${width}`,
      `${rim}${width}${profile}`,
      `${rim}${profile}${width}`,
    ];
    const searchable = [
      p.brand,
      p.model,
      `${width}/${profile}`,
      `${width} ${profile}`,
      `r${rim}`,
      String(rim),
      ...digitCombos,
      p.loadIndex,
      p.speedRating,
      p.isCarga ? "carga" : null,
      p.isAT ? "a/t at todo terreno" : null,
      ...p.tags,
      CATEGORY_TAGS.tire,
    ].filter(Boolean).join(" ");
    const score = matchScore(query, searchable);
    if (score > 0) scored.push({ type: "tire", item: p, score });
  }

  for (const a of accesorios) {
    const searchable = [a.nombre, a.descripcion, a.codigoTango, CATEGORY_TAGS.accessory].filter(Boolean).join(" ");
    const score = matchScore(query, searchable);
    if (score > 0) scored.push({ type: "accessory", item: a, score });
  }

  // Con búsquedas de categoría ("neumatico", "tuerca") empatan un montón de
  // items en el mismo puntaje — ahí desempata stock (como en /buscar) y
  // después precio, en vez de quedar en el orden en que vino del POS.
  scored.sort((a, b) => {
    const enStockA = a.type === "tire" ? !!a.item.enStock : a.item.enStock;
    const enStockB = b.type === "tire" ? !!b.item.enStock : b.item.enStock;
    return b.score - a.score || Number(enStockB) - Number(enStockA) || a.item.price - b.item.price;
  });

  return scored;
}
