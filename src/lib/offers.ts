/**
 * Selección curada a mano de productos "en oferta" (no viene de un campo del
 * POS): se muestra el mismo badge/precio tachado en /ofertas, el catálogo
 * general y la ficha individual del producto, así que vive acá para que los
 * tres lean la misma lista en vez de cada uno la suya.
 */
export const OFFER_TIRE_SLUGS = [
  "grenlander-kingpro-one-175-65-r14-82t",
  "grenlander-maga-a-t-two-235-75-r15-101s",
  "grenlander-colo-h02-185-65-r14-86h",
  "grenlander-colo-h02-175-70-r13-82t",
];

export const OFFER_ACCESSORY_SLUGS = ["antirrobo-fiesta-ka-premium-z3-66160"];

// El precio tachado no es un dato que exista en el POS: se calcula acá mismo,
// un 10% arriba del precio real vigente, y se recalcula en cada render.
export function withOfferPrice(price: number): number {
  return Math.round((price * 1.1) / 100) * 100;
}
