/**
 * Datos de la etiqueta europea de neumáticos (Reglamento UE 2020/740) +
 * UTQG, leídos a mano de la etiqueta física de cada modelo — no vienen del
 * POS ni de ninguna API, así que hay que cargarlos acá cuando se consigue
 * la etiqueta de un modelo nuevo.
 *
 * Por ahora la clave es marca + modelo (product.brandId + slugify(modeloBase)):
 * asumimos que la etiqueta es la misma para todas las medidas de un modelo.
 * Si en algún momento aparece un modelo cuya etiqueta cambia según la
 * medida, agregar una key con el sufijo de medida (ver getTireLabel) en vez
 * de reestructurar todo.
 */

export type FuelOrGripGrade = "A" | "B" | "C" | "D" | "E";
export type NoiseClass = "A" | "B" | "C";

export type TireLabel = {
  fuelEfficiency: FuelOrGripGrade;
  wetGrip: FuelOrGripGrade;
  /** Ruido de rodadura en decibeles. */
  noiseDb: number;
  noiseClass: NoiseClass;
  /** UTQG (norma de EE.UU., no forma parte de la etiqueta UE, pero suele venir en el mismo sticker). */
  utqg?: {
    treadwear: number;
    traction: string;
    temperature: string;
  };
};

// Key: "<brandId>::<slugify(modeloBase)>", opcionalmente "<brandId>::<slugify(modeloBase)>::<width>-<profile>-r<rim>"
// para el caso (hoy no usado) de que la etiqueta cambie según la medida.
const TIRE_LABELS: Record<string, TireLabel> = {
  "grenlander::colo-h02": {
    fuelEfficiency: "C",
    wetGrip: "C",
    noiseDb: 67,
    noiseClass: "B",
    utqg: { treadwear: 400, traction: "A", temperature: "A" },
  },
  "grenlander::maga-a-t-two": {
    fuelEfficiency: "D",
    wetGrip: "C",
    noiseDb: 72,
    noiseClass: "B",
    utqg: { treadwear: 400, traction: "A", temperature: "B" },
  },
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getTireLabel(brandId: string, modeloBase: string, size?: { width: number; profile: number; rim: number }): TireLabel | null {
  const base = `${brandId}::${slugify(modeloBase)}`;
  if (size) {
    const bySize = TIRE_LABELS[`${base}::${size.width}-${size.profile}-r${size.rim}`];
    if (bySize) return bySize;
  }
  return TIRE_LABELS[base] ?? null;
}
