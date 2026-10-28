import { SITE_URL } from "./config";

/**
 * Fichas de vehículo con foto sin sombra de fondo en
 * public/images/vehiculos/<slug>.webp (la que se ve en la ficha) y su tarjeta
 * de 1200x630 en public/images/vehiculos/share/<slug>.jpg (miniatura al
 * compartir y en buscadores: foto + logo de Trivium). Se lista a mano (no se
 * lee el disco) porque la ficha se prerenderiza y en el Worker no hay
 * filesystem; al sumar una foto nueva, agregar su slug acá.
 */
export const VEHICLE_PHOTOS = new Set([
  "chevrolet-montana",
  "chevrolet-onix",
  "chevrolet-onix-plus",
  "chevrolet-spin",
  "chevrolet-tracker",
  "citroen-c3",
  "fiat-argo",
  "fiat-cronos",
  "fiat-mobi",
  "fiat-pulse",
  "fiat-toro",
  "ford-ranger",
  "jeep-compass",
  "nissan-frontier",
  "nissan-kicks",
  "peugeot-2008",
  "peugeot-208",
  "renault-duster",
  "renault-kangoo",
  "renault-kwid",
  "renault-logan",
  "renault-sandero",
  "renault-sandero-stepway",
  "toyota-corolla",
  "toyota-corolla-cross",
  "toyota-etios",
  "toyota-hilux",
  "volkswagen-amarok",
  "volkswagen-nivus",
  "volkswagen-polo",
  "volkswagen-t-cross",
  "volkswagen-taos",
  "volkswagen-vento",
] as const);

export const vehiclePhoto = (slug: string): string | null =>
  VEHICLE_PHOTOS.has(slug as never) ? `/images/vehiculos/${slug}.webp` : null;

/** Tarjeta 1200x630 (JPEG) de la ficha, o null si no tiene foto. */
export const vehicleCardUrl = (slug: string): string | null =>
  VEHICLE_PHOTOS.has(slug as never) ? `${SITE_URL}/images/vehiculos/share/${slug}.jpg` : null;
