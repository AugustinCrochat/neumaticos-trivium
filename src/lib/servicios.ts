import type { ServicioPrecio } from "./pos-api";

export function formatPrecio(precio: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(precio);
}

/**
 * El POS todavía no tiene un campo estructurado para distinguir auto de
 * camioneta: cada variante es un ítem de servicio aparte, cargado con el
 * vehículo en el propio nombre ("ALINEACION AUTO" / "ALINEACION CAMIONETA").
 * Se separa buscando "camioneta" en el nombre — lo que no matchea eso queda
 * como auto.
 */
export function splitAutoCamioneta(precios: ServicioPrecio[]) {
  const camioneta = precios.find((p) => /camioneta/i.test(p.nombre));
  const auto = precios.find((p) => p !== camioneta && /\bauto\b/i.test(p.nombre));
  return { auto, camioneta };
}

/**
 * En Córdoba (sucursal Argüello) el taller y la gente dicen "alineado" y
 * "balanceado" en vez de "alineación" y "balanceo". Es solo el nombre que se
 * muestra: los títulos SEO y las descripciones siguen con el término general.
 */
const NOMBRES_ARGUELLO: Record<string, string> = {
  alineacion: "Alineado",
  balanceo: "Balanceado y Rotación",
};
const H1_ARGUELLO: Record<string, string> = {
  alineacion: "Alineado computarizado 3D en Córdoba",
  balanceo: "Balanceado y rotación de ruedas en Córdoba",
};

export function nombreServicio(id: string, fallback: string, branchId: string, h1 = false): string {
  if (branchId !== "arguello") return fallback;
  return (h1 ? H1_ARGUELLO[id] : NOMBRES_ARGUELLO[id]) ?? fallback;
}
