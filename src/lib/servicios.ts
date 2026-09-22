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
