import { DEFAULT_BRANCH_ID } from "./config";
import { getProductosDesdePOS } from "./pos-api";
import { getTireLabel, type TireLabel } from "./tire-labels";
import { sizeSlug, sizesEqual } from "./tire-sizes";
import type { TireProduct, TireSize } from "./types";

export type FilaComparativa = { product: TireProduct; label: TireLabel };

/** Mínimo de modelos con etiqueta UE para que una medida tenga comparativa propia. */
export const MIN_MODELOS = 3;

/**
 * Neumáticos de una medida que tienen etiqueta europea registrada en EPREL
 * (la fuente de los datos de la comparativa), de menor a mayor precio.
 * Usa la sucursal por defecto: la página se prerenderiza.
 */
export async function filasComparativa(size: TireSize): Promise<FilaComparativa[]> {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  return productos
    .filter((p) => !p.isCarga && sizesEqual(p.size, size))
    .flatMap((product) => {
      const label = getTireLabel(product.slug);
      return label ? [{ product, label }] : [];
    })
    .sort((a, b) => a.product.price - b.product.price);
}

/** Medidas con comparativa, las de más modelos primero. */
export async function medidasConComparativa(): Promise<{ size: TireSize; slug: string; modelos: number }[]> {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const por = new Map<string, { size: TireSize; slug: string; slugs: Set<string> }>();
  for (const p of productos) {
    if (p.isCarga || !getTireLabel(p.slug)) continue;
    const slug = sizeSlug(p.size);
    const e = por.get(slug) ?? { size: p.size, slug, slugs: new Set<string>() };
    e.slugs.add(p.slug);
    por.set(slug, e);
  }
  return [...por.values()]
    .filter((e) => e.slugs.size >= MIN_MODELOS)
    .map((e) => ({ size: e.size, slug: e.slug, modelos: e.slugs.size }))
    .sort((a, b) => b.modelos - a.modelos || a.size.rim - b.size.rim);
}
