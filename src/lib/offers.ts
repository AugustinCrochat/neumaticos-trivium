/**
 * Selección curada a mano de productos "en oferta" (no viene de un campo del
 * POS): se muestra el mismo badge/precio tachado en /ofertas, el catálogo
 * general y la ficha individual del producto, así que vive acá para que los
 * tres lean la misma lista en vez de cada uno la suya.
 */
/**
 * Neumáticos en oferta y su descuento (%). El precio real (el del POS) no se toca:
 * el precio tachado se arma hacia arriba a partir de este porcentaje, así que
 * varía de un producto a otro en vez de ser siempre el mismo.
 */
export const OFFER_TIRE_PCT: Record<string, number> = {
  // Auto, rodados chicos: los más vendidos del local.
  "grenlander-colo-h02-175-70-r13-82t": 12,
  "grenlander-kingpro-one-165-70-r13-79t": 8,
  "grenlander-kingpro-one-175-65-r14-82t": 10,
  "grenlander-colo-h02-175-70-r14-88t": 15,
  "grenlander-colo-h02-185-65-r14-86h": 7,
  "grenlander-colo-h02-185-70-r14-88t": 10,
  "grenlander-colo-h02-185-60-r14-82h": 14,
  "grenlander-kingpro-one-195-70-r14-91t": 9,
  "arivo-premio-arzero-185-60-r15-88h": 12,
  "arivo-premio-eco-6-195-60-r15-88v": 8,
  "grenlander-colo-h02-195-65-r15-95t": 18,
  "grenlander-colo-h02-205-60-r15-91v": 11,
  "pirelli-cinturato-p1-175-65-r14-82t": 6,
  // Rodados medianos y perfil bajo.
  "grenlander-kingpro-one-195-60-r16-89h": 13,
  "grenlander-colo-h02-195-55-r16-91v": 16,
  "arivo-premio-eco-6-205-55-r16-91v": 10,
  "grenlander-estrella-88-205-45-r17-88w": 15,
  "grenlander-estrella-88-225-45-r17-94w": 12,
  // Camioneta y 4x4.
  "grenlander-maga-a-t-two-235-75-r15-104s": 9,
  "grenlander-maga-a-t-two-265-70-r16-112t": 8,
  // Carga y utilitarios.
  "grenlander-stratour-e1-205-70-r15c-106r": 10,
  "grenlander-l-max9-195-70-r15c-104r": 12,
};
export const OFFER_TIRE_SLUGS = Object.keys(OFFER_TIRE_PCT);

/** Unidades mínimas en stock para que un neumático figure en descuento (con menos, vuelve a precio normal). */
export const OFFER_MIN_STOCK = 4;

// Todas las tuercas de seguridad ya llevan el 15 % de descuento (ver accessoryPriceOld):
// /ofertas las lista por nombre en vez de por slug, así una tuerca nueva entra sola.
export const esTuercaDeSeguridad = (nombre: string): boolean => /antirrobo/i.test(nombre);
export const OFFER_ACCESSORY_SLUGS: string[] = [];

// El precio tachado no es un dato que exista en el POS: se calcula acá a partir del
// descuento de cada producto (OFFER_TIRE_PCT) sobre el precio real vigente.
export function withOfferPrice(price: number, slug: string): number {
  const pct = OFFER_TIRE_PCT[slug] ?? 10;
  return Math.round(price / (1 - pct / 100) / 100) * 100;
}

// Todas las tuercas antirrobo se muestran con 15% de descuento: el precio del POS
// es el que ya tiene el descuento y el tachado se deriva de él (49.000 → 57.650).
export function accessoryPriceOld(price: number): number {
  return Math.round(price / 0.85 / 50) * 50;
}
