"use client";

import { useMemo } from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import { useLiveStockMap } from "@/contexts/live-stock-context";
import type { PricePeer } from "@/lib/best-price";
import type { TireProduct } from "@/lib/types";

export type GridItem = {
  product: TireProduct;
  peers?: PricePeer[];
  isCheapest?: boolean;
  cheapestLabel?: string;
};

/** Productos de un listado: los agotados van al final, con el stock vivo. */
export function sortInStockFirst<T>(items: T[], idOf: (t: T) => string, staticStock: (t: T) => boolean | undefined, live: Record<string, { enStock: boolean } | undefined>): T[] {
  const out = (t: T) => ((live[idOf(t)]?.enStock ?? staticStock(t)) ? 0 : 1);
  // Orden estable: dentro de cada grupo se respeta el orden original.
  return items.map((t, i) => ({ t, i })).sort((a, b) => out(a.t) - out(b.t) || a.i - b.i).map((x) => x.t);
}

/**
 * Grilla de tarjetas que manda los agotados al final. El HTML del build trae
 * el orden con el stock de ese momento (hasta 2 h de atraso); apenas llega el
 * catálogo vivo se reordena con lo que hay hoy, igual que el precio y el stock
 * de cada tarjeta.
 */
export function SortedProductGrid({ items, className }: { items: GridItem[]; className: string }) {
  const live = useLiveStockMap();
  const sorted = useMemo(() => sortInStockFirst(items, (i) => i.product.id, (i) => i.product.enStock, live), [items, live]);
  return (
    <div className={className}>
      {sorted.map((it, i) => (
        <ProductCard key={it.product.id} priority={i < 2} product={it.product} peers={it.peers} isCheapest={it.isCheapest} cheapestLabel={it.cheapestLabel} />
      ))}
    </div>
  );
}
