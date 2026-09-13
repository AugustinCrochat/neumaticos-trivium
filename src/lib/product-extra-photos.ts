/**
 * Fotos adicionales (otros ángulos: banda de rodamiento, flanco, llanta) de
 * modelos puntuales, bajadas de terceros — ver scripts/fetch-extra-product-photos.mjs
 * para las fuentes y el motivo de cada una. Es por modelo, no por medida
 * exacta: la foto de banda/flanco es la misma para todas las medidas de un
 * mismo modelo (a diferencia de la etiqueta UE, que sí cambia por medida).
 */
import extraPhotos from "./product-extra-photos.json";

const MAP = extraPhotos as Record<string, string[]>;

// Misma normalización que normalizeModelKey() en el script: pliega variantes
// de homologación del mismo modelo físico (ej. "XL P1 Cinturato (KS)R" y
// "P1 Cinturato (KA)") a una sola key, porque son la misma foto.
const MODEL_ALIASES: Record<string, string> = { pwrgy: "powergy" };

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeModelKey(brandId: string, modeloBase: string): string {
  const cleaned = modeloBase
    .replace(/^XL\s+/i, "")
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s+(RT|R|K\d)$/i, "")
    .replace(/\s+/g, " ")
    .trim();
  const slug = slugify(cleaned);
  return `${brandId}-${MODEL_ALIASES[slug] || slug}`;
}

export function getExtraPhotos(brandId: string, modeloBase: string): string[] {
  return MAP[normalizeModelKey(brandId, modeloBase)] ?? [];
}
