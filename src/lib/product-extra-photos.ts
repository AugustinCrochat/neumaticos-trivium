/**
 * Fotos adicionales (otros ángulos: banda de rodamiento, flanco, llanta) de
 * modelos puntuales, bajadas del sitio oficial del fabricante — ver
 * scripts/fetch-grenlander-extra-photos.mjs. Es por modelo, no por medida
 * exacta: la foto de banda/flanco es la misma para todas las medidas de un
 * mismo modelo (a diferencia de la etiqueta UE, que sí cambia por medida).
 */
import extraPhotos from "./product-extra-photos.json";

const MAP = extraPhotos as Record<string, string[]>;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getExtraPhotos(brandId: string, modeloBase: string): string[] {
  return MAP[`${brandId}-${slugify(modeloBase)}`] ?? [];
}
