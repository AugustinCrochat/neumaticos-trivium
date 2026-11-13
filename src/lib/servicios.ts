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
 * ¿La medida del texto (ej. "ZMAX Terra Xplorer 265/60 R18 110T") es de
 * camioneta/SUV para el taller? Sin un campo en el POS, se estima por forma:
 * ancho 235+ con perfil 60+ y rodado 15+ (265/60 R18, 265/65 R17, 245/70 R16,
 * 235/75 R15). Los autos deportivos (265/35 R19) quedan afuera por el perfil.
 * Augustin 2026-11-13: Ranger, Hilux y similares se alinean como camioneta.
 */
export function esMedidaCamioneta(texto: string): boolean {
  const m = texto.match(/(\d{3})\s*\/\s*(\d{2})\s*R\s*(\d{2})/i);
  if (!m) return false;
  const [ancho, perfil, rodado] = [Number(m[1]), Number(m[2]), Number(m[3])];
  return ancho >= 235 && perfil >= 60 && rodado >= 15;
}

const MODELOS_CAMIONETA = new Set([
  "Toyota Hilux", "Toyota Hilux SW4", "Toyota SW4", "Toyota Land Cruiser", "Ford Ranger", "Chevrolet S10",
  "Chevrolet Trailblazer", "Volkswagen Amarok", "Nissan Frontier", "Fiat Titano", "Mitsubishi L200", "Mitsubishi Montero",
  "Foton Tunland", "Jeep Grand Cherokee", "Dodge Durango", "RAM Dakota", "Maxus T60", "Maxus T90", "JAC T8",
  "Great Wall Poer", "Kia Tasman", "BYD Shark",
]);

/** ¿El taller lo cobra como camioneta? Lista de modelos, o alguna de sus medidas es de camioneta. */
export function esVehiculoCamioneta(v: { brand: string; model: string; sizes: { w: string; p: string; r: string }[] }): boolean {
  return MODELOS_CAMIONETA.has(`${v.brand} ${v.model}`) || v.sizes.some((s) => esMedidaCamioneta(`${s.w}/${s.p} R${s.r}`));
}

/**
 * En Córdoba (sucursal Argüello) el taller y la gente dicen "alineado" y
 * "balanceado" en vez de "alineación" y "balanceo", y así se busca en Google
 * desde Córdoba. Esto cambia el nombre que se muestra según la sucursal; los
 * títulos SEO de las fichas (servicios-seo.ts) también usan "alineado y
 * balanceado" porque esas páginas son de Córdoba. Para Buenos Aires va
 * "alineación y balanceo".
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
