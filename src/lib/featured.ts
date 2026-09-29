/**
 * Selección curada a mano de productos para la grilla "Precios de hoy" de la
 * home — por `id` del POS (no por slug): el id es estable ante cualquier
 * normalización de nombre/marca que haga fixBrandAndModel en pos-api.ts, así
 * que no hay riesgo de que un cambio de nombre en el POS rompa la lista en
 * silencio. Se buscó variedad de rodado/precio/marca, con stock alto al
 * momento de armar la lista (2026-09-29) para que no queden "sin stock" en
 * los primeros días.
 */
export const FEATURED_TIRE_IDS = [
  "adb7d4f5-ddff-45b1-b919-e174bd88eb5f", // Grenlander Colo H02 175/65 R14 — entrada, alto stock
  "a7c25d28-1585-4db5-81d5-b5966a119a04", // Grenlander Colo H02 175/70 R13 — el más barato del catálogo
  "a506fa6f-ead5-4d36-8e1d-ebfce173ef12", // Grenlander KingPro One 165/70 R13 — chico y barato
  "85505157-0666-4447-ab88-b791e42e5c65", // Grenlander Colo H02 205/55 R16 — rodado 16 popular
  "4d8555c8-cfbd-45db-bb3d-9570ecffec08", // Grenlander KingPro One 195/60 R16
  "3129ad76-6a6d-4877-8687-df37dfb5d74b", // Grenlander Estrella 88 205/45 R17 — rodado grande, deportivo
  "00283199-9d67-4dd5-956d-94d7205fc3c7", // Grenlander Maga A/T Two 245/70 R16 — camioneta/A-T
  "38e44fb9-1da6-4b3b-95cc-246b1caeaf8a", // Pirelli Cinturato P1 195/60 R16 — marca premium
];
