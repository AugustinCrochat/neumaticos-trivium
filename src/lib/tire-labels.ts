/**
 * Etiqueta oficial de eficiencia energética (Reglamento UE 2020/740) de cada
 * neumático, bajada del registro público EPREL (https://eprel.ec.europa.eu)
 * — la misma base de datos que arma el fabricante/importador y que tiene el
 * QR pegado en el flanco de la cubierta física.
 *
 * eu-tire-labels-map.json y las imágenes en /public/images/eu-labels/ los
 * genera scripts/fetch-eu-tire-labels.mjs — correr ese script para agregar
 * medidas nuevas al catálogo, no editar el JSON a mano. La key es el mismo
 * slug que arma toTireProduct() en pos-api.ts (product.slug).
 */
import labelsMap from "./eu-tire-labels-map.json";

export type TireLabel = {
  eprelId: string;
  energyClass: "A" | "B" | "C" | "D" | "E";
  wetGripClass: "A" | "B" | "C" | "D" | "E";
  noiseDb: number;
  noiseClass: "A" | "B" | "C";
  tyreDesignation: string;
  /** Imagen oficial completa (PNG de EPREL), para la galería del producto. */
  imagePath: string;
  /** Miniatura oficial (más liviana), para el selector de la galería. */
  thumbPath: string;
};

const TIRE_LABELS = labelsMap as Record<string, Omit<TireLabel, "imagePath" | "thumbPath">>;

export function getTireLabel(slug: string): TireLabel | null {
  const data = TIRE_LABELS[slug];
  if (!data) return null;
  return {
    ...data,
    imagePath: `/images/eu-labels/${slug}.png`,
    thumbPath: `/images/eu-labels/${slug}-thumb.png`,
  };
}
