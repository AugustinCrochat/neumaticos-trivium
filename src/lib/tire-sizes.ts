import type { TireSize, TireProduct } from "./types";
import { VEHICLE_DB } from "./vehicles";

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

export type VehicleUsingSize = { brand: string; model: string; version?: string };

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
        result.push({ brand: entry.brand, model: entry.model, version: s.version });
      }
    }
  }
  return result.sort((a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`, "es"));
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
