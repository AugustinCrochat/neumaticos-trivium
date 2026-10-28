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
  "chevrolet-celta",
  "chevrolet-corsa",
  "chevrolet-montana",
  "chevrolet-onix",
  "chevrolet-onix-plus",
  "chevrolet-prisma",
  "chevrolet-spin",
  "chevrolet-tracker",
  "citroen-c3",
  "fiat-argo",
  "fiat-cronos",
  "fiat-fiorino",
  "fiat-idea",
  "fiat-linea",
  "fiat-mobi",
  "fiat-palio",
  "fiat-palio-weekend",
  "fiat-pulse",
  "fiat-siena",
  "fiat-toro",
  "fiat-uno",
  "ford-ecosport",
  "ford-fiesta",
  "ford-ka",
  "ford-ranger",
  "honda-civic",
  "honda-fit",
  "jeep-compass",
  "jeep-renegade",
  "nissan-frontier",
  "nissan-kicks",
  "peugeot-2008",
  "peugeot-207",
  "peugeot-208",
  "renault-clio",
  "renault-duster",
  "renault-fluence",
  "renault-kangoo",
  "renault-kwid",
  "renault-logan",
  "renault-sandero",
  "renault-sandero-stepway",
  "renault-symbol",
  "toyota-corolla",
  "toyota-corolla-cross",
  "toyota-etios",
  "toyota-hilux",
  "volkswagen-amarok",
  "volkswagen-fox",
  "volkswagen-gol",
  "volkswagen-gol-trend",
  "volkswagen-nivus",
  "volkswagen-polo",
  "volkswagen-suran",
  "volkswagen-t-cross",
  "volkswagen-taos",
  "volkswagen-vento",
  "volkswagen-voyage",
] as const);

export const vehiclePhoto = (slug: string): string | null =>
  VEHICLE_PHOTOS.has(slug as never) ? `/images/vehiculos/${slug}.webp` : null;

/** Tarjeta 1200x630 (JPEG) de la ficha, o null si no tiene foto. */
export const vehicleCardUrl = (slug: string): string | null =>
  VEHICLE_PHOTOS.has(slug as never) ? `${SITE_URL}/images/vehiculos/share/${slug}.jpg` : null;
