/**
 * Fichas de vehículo que ya tienen foto sin fondo en
 * public/images/vehiculos/<slug>.webp. Se lista a mano (no se lee el disco)
 * porque la ficha se prerenderiza y en el Worker no hay filesystem; al sumar
 * una foto nueva, agregar su slug acá.
 */
export const VEHICLE_PHOTOS = new Set([
  "chevrolet-onix",
  "fiat-cronos",
  "peugeot-208",
  "renault-sandero-stepway",
  "toyota-hilux",
]);

export const vehiclePhoto = (slug: string): string | null =>
  VEHICLE_PHOTOS.has(slug) ? `/images/vehiculos/${slug}.webp` : null;
