import { LOAD_INDEX_KG, SPEED_RATING_KMH } from "@/lib/tire-sizes";

/**
 * Códigos que aparecen con más frecuencia en autos, camionetas y utilitarios.
 * Son URLs editoriales, no un generador de todas las combinaciones posibles:
 * cada una responde una consulta real y lleva al lector a la guía completa.
 */
export const LOAD_SPEED_CODES = [
  "75T", "80T", "82T", "84T", "86T", "88H", "88T", "90T", "91H", "91V",
  "94H", "94V", "95H", "95V", "97H", "98W", "100H", "102H", "104S", "104R",
  "107R", "109R",
  // Ampliación (2026-11): códigos que están en el stock o que la gente busca con frecuencia.
  "79T", "81T", "82H", "84V", "85V", "86H", "88V", "88W", "89H", "91T",
  "91W", "92H", "92V", "93H", "94W", "95T", "95W", "96H", "96V", "98H",
  "98V", "99H", "99V", "100V", "103H", "103V", "105H", "105V",
] as const;

export type LoadSpeedCode = (typeof LOAD_SPEED_CODES)[number];

export type LoadSpeedInfo = {
  code: LoadSpeedCode;
  loadIndex: string;
  speedRating: string;
  loadKg: number;
  speedKmh: number;
};

export function getLoadSpeedInfo(value: string): LoadSpeedInfo | null {
  const normalized = value.toUpperCase();
  if (!LOAD_SPEED_CODES.includes(normalized as LoadSpeedCode)) return null;

  const match = /^(\d{2,3})([A-Z])$/.exec(normalized);
  if (!match) return null;
  const [, loadIndex, speedRating] = match;
  const loadKg = LOAD_INDEX_KG[loadIndex];
  const speedKmh = SPEED_RATING_KMH[speedRating];
  if (!loadKg || !speedKmh) return null;

  return { code: normalized as LoadSpeedCode, loadIndex, speedRating, loadKg, speedKmh };
}
