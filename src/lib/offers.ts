/**
 * Selección curada a mano de productos "en oferta" (no viene de un campo del
 * POS): se muestra el mismo badge/precio tachado en /ofertas, el catálogo
 * general y la ficha individual del producto, así que vive acá para que los
 * tres lean la misma lista en vez de cada uno la suya.
 */
export const OFFER_TIRE_SLUGS = [
  // Auto, rodados chicos: los más vendidos del local.
  "grenlander-colo-h02-175-70-r13-82t",
  "grenlander-kingpro-one-165-70-r13-79t",
  "grenlander-kingpro-one-175-65-r14-82t",
  "grenlander-colo-h02-175-70-r14-88t",
  "grenlander-colo-h02-185-65-r14-86h",
  "grenlander-colo-h02-185-70-r14-88t",
  "grenlander-colo-h02-185-60-r14-82h",
  "grenlander-kingpro-one-195-70-r14-91t",
  "arivo-premio-arzero-185-60-r15-88h",
  "arivo-premio-eco-6-195-60-r15-88v",
  "grenlander-colo-h02-195-65-r15-95t",
  "grenlander-colo-h02-205-60-r15-91v",
  "pirelli-cinturato-p1-175-65-r14-82t",
  // Rodados medianos y perfil bajo.
  "grenlander-kingpro-one-195-60-r16-89h",
  "grenlander-colo-h02-195-55-r16-91v",
  "arivo-premio-eco-6-205-55-r16-91v",
  "grenlander-estrella-88-205-45-r17-88w",
  "grenlander-estrella-88-225-45-r17-94w",
  // Camioneta y 4x4.
  "grenlander-maga-a-t-two-235-75-r15-104s",
  "grenlander-maga-a-t-two-265-70-r16-112t",
  // Carga y utilitarios.
  "grenlander-stratour-e1-205-70-r15c-106r",
  "grenlander-l-max9-195-70-r15c-104r",
];

// Todas las tuercas de seguridad ya llevan el 15 % de descuento (ver accessoryPriceOld):
// /ofertas las lista por nombre en vez de por slug, así una tuerca nueva entra sola.
export const esTuercaDeSeguridad = (nombre: string): boolean => /antirrobo/i.test(nombre);
export const OFFER_ACCESSORY_SLUGS: string[] = [];

// El precio tachado no es un dato que exista en el POS: se calcula acá mismo,
// un 10% arriba del precio real vigente, y se recalcula en cada render.
export function withOfferPrice(price: number): number {
  return Math.round((price * 1.1) / 100) * 100;
}

// Todas las tuercas antirrobo se muestran con 15% de descuento: el precio del POS
// es el que ya tiene el descuento y el tachado se deriva de él (49.000 → 57.650).
export function accessoryPriceOld(price: number): number {
  return Math.round(price / 0.85 / 50) * 50;
}
