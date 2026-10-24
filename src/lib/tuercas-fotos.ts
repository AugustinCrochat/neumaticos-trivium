import { TUERCAS_VEHICULOS } from "./tuercas-vehiculos";

/**
 * Tarjeta "Compatible con" de cada tuerca (logo, vehículos, "incluye 2
 * llaves"), generada por scripts/build-tuercas-cards.mjs. Hay una por cada
 * tuerca que tenga compatibilidad curada en tuercas-vehiculos.ts: si se carga
 * una tuerca nueva, hay que sumar su compatibilidad y volver a correr el script.
 */
export function tuercaCardPath(codigoTango: string | null, slug: string): string | null {
  return codigoTango && TUERCAS_VEHICULOS[codigoTango] ? `/images/tuercas-antirrobo/${slug}-compatibles.webp` : null;
}

/** Foto real, tomada en el taller, de una tuerca antirrobo entre las tuercas comunes de una llanta. */
export const TUERCA_FOTO_TALLER = {
  src: "/images/local/tuerca-antirrobo-de-seguridad-en-llanta-de-aleacion-trivium-cordoba.webp",
  alt: "Tuerca antirrobo colocada entre las tuercas comunes de una llanta de aleación, en el taller de Neumáticos Trivium",
};

/** Las dos llaves que trae cada juego, con el cartel "x2" (scripts/build-tuercas-dos-llaves.mjs). */
export const TUERCA_FOTO_LLAVES = {
  src: "/images/tuercas-antirrobo/dos-llaves-incluidas-tuercas-antirrobo-trivium-cordoba.webp",
  alt: "Las dos llaves que trae el juego de tuercas antirrobo: una para usar y otra de repuesto",
};
