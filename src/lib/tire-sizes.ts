import type { TireSize, TireProduct } from "./types";
import { VEHICLE_DB, sortVehiclesByPopularity } from "./vehicles";

// Tabla de referencia de índices de velocidad habituales en neumáticos de auto/camioneta.
export const SPEED_RATING_KMH: Record<string, number> = {
  Q: 160, R: 170, S: 180, T: 190, U: 200, H: 210, V: 240, W: 270, Y: 300,
};

// Tabla ETRTO de índice de carga -> peso máximo por neumático (kg).
export const LOAD_INDEX_KG: Record<string, number> = {
  "60": 250, "61": 257, "62": 265, "63": 272, "64": 280, "65": 290, "66": 300, "67": 307, "68": 315, "69": 325,
  "70": 335, "71": 345, "72": 355, "73": 365, "74": 375, "75": 387, "76": 400, "77": 412, "78": 425, "79": 437,
  "80": 450, "81": 462, "82": 475, "83": 487, "84": 500, "85": 515, "86": 530, "87": 545, "88": 560, "89": 580,
  "90": 600, "91": 615, "92": 630, "93": 650, "94": 670, "95": 690, "96": 710, "97": 730, "98": 750, "99": 775,
  "100": 800, "101": 825, "102": 850, "103": 875, "104": 900, "105": 925, "106": 950, "107": 975, "108": 1000, "109": 1030,
  "110": 1060, "111": 1090, "112": 1120, "113": 1150, "114": 1180, "115": 1215, "116": 1250, "117": 1285, "118": 1320, "119": 1360,
  "120": 1400, "121": 1450, "122": 1500, "123": 1550, "124": 1600, "125": 1650, "126": 1700, "127": 1750, "128": 1800, "129": 1850,
  "130": 1900,
};

export function vehicleTypeLabel(vehicleType: string[]): string {
  const hasAuto = vehicleType.includes("auto");
  const hasCamioneta = vehicleType.includes("camioneta");
  if (hasAuto && hasCamioneta) return "auto y camioneta";
  if (hasCamioneta) return "camioneta";
  return "auto";
}

/**
 * Medidas de neumático como entidad de URL: parseo, formato y datos derivados
 * para las landings de /neumaticos/[medida].
 *
 * La fórmula de diámetro está duplicada hoy en ShopPage, EquivalenceCalculator
 * y el route de OG. Las páginas nuevas usan esta versión; conviene migrar las
 * otras tres acá para que no se separen.
 */

/** Diámetro externo en milímetros: rodado en pulgadas + dos veces el flanco. */
export function outerDiameterMm(size: TireSize): number {
  return size.rim * 25.4 + 2 * (size.width * (size.profile / 100));
}

/** Diferencia porcentual de diámetro entre dos medidas. El estándar de la
    industria acepta hasta ±3%: más que eso desvía el velocímetro y puede
    interferir con el ABS. */
export function diameterDiffPercent(a: TireSize, b: TireSize): number {
  const da = outerDiameterMm(a);
  const db = outerDiameterMm(b);
  return ((da - db) / db) * 100;
}

/** "205/55 R16" — como se lee en el flanco. */
export function formatSize(size: TireSize): string {
  return `${size.width}/${size.profile} R${size.rim}`;
}

/** "205-55-r16" — el segmento de URL. Minúsculas y guiones, sin barras ni
    espacios, para que la URL sea legible y no necesite encoding. */
export function sizeSlug(size: TireSize): string {
  return `${size.width}-${size.profile}-r${size.rim}`;
}

const SIZE_SLUG_RE = /^(\d{3})-(\d{2})-r(\d{2})$/;

/** Inverso de sizeSlug. Devuelve null si el slug no es una medida válida, para
    que la página pueda hacer notFound() en vez de renderizar una medida rara
    inventada por un crawler o un link roto. */
export function parseSizeSlug(slug: string): TireSize | null {
  const match = SIZE_SLUG_RE.exec(slug.toLowerCase());
  if (!match) return null;
  const size = {
    width: Number(match[1]),
    profile: Number(match[2]),
    rim: Number(match[3]),
  };
  // Rango de cordura: fuera de esto no es una medida de auto/camioneta real y
  // no queremos generar páginas indexables para combinaciones inexistentes.
  if (size.width < 125 || size.width > 355) return null;
  if (size.profile < 25 || size.profile > 85) return null;
  if (size.rim < 12 || size.rim > 24) return null;
  return size;
}

const RIM_SLUG_RE = /^rodado-(\d{2})$/;

/** "rodado-16" -> 16. Los hubs de rodado viven en el mismo segmento que las
    medidas porque son el nivel inmediatamente superior de la misma jerarquía. */
export function parseRimSlug(slug: string): number | null {
  const match = RIM_SLUG_RE.exec(slug.toLowerCase());
  if (!match) return null;
  const rim = Number(match[1]);
  return rim >= 12 && rim <= 24 ? rim : null;
}

export function rimSlug(rim: number): string {
  return `rodado-${rim}`;
}

export function sizesEqual(a: TireSize, b: TireSize): boolean {
  return a.width === b.width && a.profile === b.profile && a.rim === b.rim;
}

/** Medidas distintas presentes en un catálogo, ordenadas por cantidad de
    productos (las que más stock tienen primero). */
export function sizesFromCatalog(products: TireProduct[]): { size: TireSize; count: number }[] {
  const map = new Map<string, { size: TireSize; count: number }>();
  for (const product of products) {
    const key = sizeSlug(product.size);
    const entry = map.get(key);
    if (entry) entry.count += 1;
    else map.set(key, { size: product.size, count: 1 });
  }
  return [...map.values()].sort(
    (a, b) => b.count - a.count || a.size.rim - b.size.rim || a.size.width - b.size.width
  );
}

/** Medidas equivalentes: mismo rodado y diámetro dentro de ±3%. Se calculan
    contra las medidas comerciales reales, no contra todas las combinaciones
    aritméticas posibles, para no ofrecer medidas que no existen en el mercado. */
const COMMERCIAL_WIDTHS = [
  155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285,
];
const COMMERCIAL_PROFILES = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];

export function equivalentSizes(size: TireSize, tolerance = 3): TireSize[] {
  const result: TireSize[] = [];
  for (const width of COMMERCIAL_WIDTHS) {
    for (const profile of COMMERCIAL_PROFILES) {
      const candidate = { width, profile, rim: size.rim };
      if (sizesEqual(candidate, size)) continue;
      if (Math.abs(diameterDiffPercent(candidate, size)) <= tolerance) {
        result.push(candidate);
      }
    }
  }
  // Más cercanas en diámetro primero: son las que mejor sustituyen.
  return result.sort(
    (a, b) => Math.abs(diameterDiffPercent(a, size)) - Math.abs(diameterDiffPercent(b, size))
  );
}

export type VehicleUsingSize = { brand: string; model: string; version?: string; generation?: string; years?: string };

/**
 * Autos que vienen de fábrica con esta medida, sacados de VEHICLE_DB.
 *
 * Es el contenido que hace única a cada página de medida: quien busca
 * "205/55 R16" muchas veces está confirmando que es la medida de su auto, y
 * ver el modelo listado resuelve esa duda en la propia SERP.
 */
export function vehiclesUsingSize(size: TireSize): VehicleUsingSize[] {
  const result: VehicleUsingSize[] = [];
  for (const entry of VEHICLE_DB) {
    for (const s of entry.sizes) {
      if (
        Number(s.w) === size.width &&
        Number(s.p) === size.profile &&
        Number(s.r) === size.rim
      ) {
        result.push({ brand: entry.brand, model: entry.model, version: s.version, generation: s.generation, years: s.years });
      }
    }
  }
  return sortVehiclesByPopularity(result);
}

/**
 * Descripción larga de un neumático para el feed de Merchant Center y el
 * JSON-LD de producto — un único generador para que las dos no diverjan (y
 * Diagnostics no marque inconsistencia entre lo que dice la página y lo que
 * dice el feed).
 *
 * Google marcó las descripciones anteriores ("Neumático X — importación
 * directa, outlet de neumáticos. Garantía de 1 año.") como demasiado
 * genéricas: no decían nada que no estuviera ya en el título. Ésta agrega
 * sólo datos reales del producto — nada inventado ni copy de venta —, que es
 * justo lo que alguien busca al elegir un neumático: para qué tipo de
 * vehículo es, cuánto peso y velocidad soporta, y si es la medida de fábrica
 * de algún auto conocido.
 */
export function buildTireDescription(product: {
  model: string;
  size: TireSize;
  vehicleType: string[];
  loadIndex?: string;
  loadIndexDual?: string;
  speedRating?: string;
}): string {
  const tipo = vehicleTypeLabel(product.vehicleType);
  const loadKg = product.loadIndex ? LOAD_INDEX_KG[product.loadIndex] : undefined;
  const loadDualKg = product.loadIndexDual ? LOAD_INDEX_KG[product.loadIndexDual] : undefined;
  const speedKmh = product.speedRating ? SPEED_RATING_KMH[product.speedRating] : undefined;

  const partes = [`Neumático ${product.model} para ${tipo}, de importación directa.`];

  // Merchant Center pide el tamaño explícito en la descripción: el ancho, el
  // perfil y el rodado en palabras, y el diámetro exterior aproximado.
  const { width, profile, rim } = product.size;
  if (width && profile && rim) {
    const diametroMm = Math.round(rim * 25.4 + 2 * ((width * profile) / 100));
    partes.push(
      `Tamaño: ancho ${width} mm, perfil ${profile} % y rodado ${rim} pulgadas (diámetro exterior aproximado ${diametroMm} mm).`
    );
  }

  if (loadKg && loadDualKg && speedKmh) {
    partes.push(
      `Índice de carga ${product.loadIndex}/${product.loadIndexDual} (hasta ${loadKg} kg en montaje simple, ${loadDualKg} kg en rodado dual) y velocidad ${product.speedRating} (hasta ${speedKmh} km/h).`
    );
  } else if (loadKg && speedKmh) {
    partes.push(
      `Índice de carga ${product.loadIndex} (hasta ${loadKg} kg por rueda) y velocidad ${product.speedRating} (hasta ${speedKmh} km/h).`
    );
  }

  const vehiculos = sortVehiclesByPopularity(vehiclesUsingSize(product.size));
  if (vehiculos.length > 0) {
    const nombres = Array.from(new Set(vehiculos.map((v) => `${v.brand} ${v.model}`))).slice(0, 3);
    partes.push(`Medida original de ${nombres.join(", ")}${vehiculos.length > nombres.length ? " y otros" : ""}.`);
  }

  partes.push("Outlet de neumáticos con garantía de 1 año y colocación sin cargo en el local.");

  return partes.join(" ");
}

/**
 * Medidas que queremos posicionar aunque hoy no haya stock.
 *
 * Son las de mayor parque automotor en Argentina — las que llevan los autos más
 * vendidos del país. Tener la página viva aunque el stock esté en cero es
 * deliberado: la autoridad de una URL se construye con el tiempo, y si la
 * página nace recién cuando entra la mercadería llega tarde a la venta. La
 * página avisa que no hay stock y ofrece equivalencias y WhatsApp, así que no
 * es contenido vacío.
 */
export const MEDIDAS_PRIORITARIAS: TireSize[] = [
  { width: 175, profile: 65, rim: 14 },
  { width: 185, profile: 60, rim: 14 },
  { width: 175, profile: 70, rim: 13 },
  { width: 165, profile: 70, rim: 13 },
  { width: 185, profile: 65, rim: 14 },
  { width: 175, profile: 70, rim: 14 },
  { width: 185, profile: 65, rim: 15 },
  { width: 195, profile: 65, rim: 15 },
  { width: 185, profile: 60, rim: 15 },
  { width: 195, profile: 55, rim: 16 },
  { width: 205, profile: 55, rim: 16 },
  { width: 195, profile: 60, rim: 15 },
  { width: 205, profile: 60, rim: 16 },
  { width: 215, profile: 65, rim: 16 },
  { width: 205, profile: 65, rim: 15 },
  { width: 225, profile: 45, rim: 17 },
  { width: 225, profile: 65, rim: 17 },
  { width: 215, profile: 55, rim: 17 },
  { width: 235, profile: 75, rim: 15 },
  { width: 245, profile: 70, rim: 16 },
  { width: 265, profile: 65, rim: 17 },
  { width: 265, profile: 60, rim: 18 },
];
