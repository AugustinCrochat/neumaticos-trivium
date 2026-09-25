/**
 * UTQG (Uniform Tire Quality Grading): norma de EE.UU. — no tiene relación
 * regulatoria con la etiqueta europea (ver getTireLabel() en tire-labels.ts)
 * y por eso vive en un archivo aparte. Trae tres datos: desgaste relativo
 * (treadwear, número — más alto sugiere mayor vida útil estimada), tracción
 * (letra, AA/A/B/C) y resistencia a la temperatura a alta velocidad (letra,
 * A/B/C). Ver el blog /blog/etiqueta-europea-neumaticos para la explicación
 * completa al usuario.
 *
 * Es por modelo, no por medida — igual que product-extra-photos.ts — salvo
 * en los dos casos (Grenlander Maga A/T Two, Zmax Terra Xplorer) donde el
 * fabricante publica un valor distinto por medida: esos van en
 * SIZE_OVERRIDES, keyeados por el slug completo del producto.
 *
 * La norma es de EE.UU.: la mayoría de nuestras marcas (Arivo, Grenlander,
 * Firemax, Zmax — fabricantes chinos que no venden oficialmente en EE.UU.)
 * no tienen UTQG publicado en ninguna fuente verificable, así que no
 * figuran acá — no se completó a mano ni se estimó. Tampoco lo tienen los
 * neumáticos LT-metric/de carga (ej. Maga A/T Two 245/70R16 113/110S,
 * Grenlander L-Max9, Stratour E1): la norma directamente no aplica a esa
 * categoría, no es un dato que falte.
 *
 * Investigado el 2026-09-25 en fichas oficiales de cada fabricante (Arivo:
 * arivotyre.net; Grenlander y Zmax: bonwaytyre.com, el OEM real detrás de
 * ambas marcas — Shandong Longyue Rubber / Zodo Group) o en pirelli.com
 * (catálogo oficial EE.UU., por medida exacta). Primera pasada corregida
 * tras una segunda investigación más profunda: se sacaron dos datos que
 * resultaron incorrectos (Pirelli Powergy — era la ficha de un modelo
 * discontinuado de 1999 con nombre parecido, "P6000 Powergy"; Pirelli
 * Scorpion liso — el valor de retailer era un placeholder genérico, no
 * confirmado por el catálogo oficial para la medida que vendemos) y se
 * descartó Cinturato P7 por ambigüedad de sub-variante (nuestra medida es
 * 195/50R16 84V; la única ficha con UTQG que existe es la variante 84H,
 * velocidad distinta, no es el mismo neumático). También se descartaron
 * los "400 A A" de Zmax Landgema/Terra Xplorer que venían de retailers
 * australianos: no corroborados por el fabricante real (bonwaytyre.com no
 * tiene esa página para Landgema, y si tenía ficha completa para Terra
 * Xplorer resultó con OTRO valor, ver SIZE_OVERRIDES). La fuente de cada
 * línea está comentada abajo. Para agregar una marca/línea nueva, no
 * inventar el valor: buscar la ficha oficial del fabricante (u OEM real,
 * no siempre coincide con el nombre comercial) y dejarla afuera si no se
 * encuentra nada verificable para la medida exacta.
 */

export type Utqg = {
  treadwear: number;
  traction: "AA" | "A" | "B" | "C";
  temperature: "A" | "B" | "C";
};

const MODEL_ALIASES: Record<string, string> = {
  pwrgy: "powergy",
  "cinturato-p1": "p1-cinturato",
  "cinturato-p7": "p7-cinturato",
};

const UTQG_MAP: Record<string, Utqg> = {
  // arivotyre.net/arivo-pcr/arz1 — fila exacta para 165/70R13, la medida que vendemos. Uniforme en toda la línea.
  "arivo-premio-arz1rt": { treadwear: 420, traction: "A", temperature: "A" },
  // arivotyre.net/arivo-pcr/arzero — uniforme en las 50+ medidas de la tabla, sin excepción.
  "arivo-premio-arzero": { treadwear: 400, traction: "A", temperature: "A" },
  // arivotyre.net/arivo-pcr/terramax-arv-ht — fila exacta para 245/65R17. Uniforme en todas las medidas P-metric.
  "arivo-terramax-arv-a-t": { treadwear: 460, traction: "A", temperature: "A" },
  // arivotyre.net/arivo-pcr/terramax-arv-pro-at — fila exacta para 265/65R17 112T (otras medidas de esta línea dan 400/A/A).
  "arivo-terramax-arv-pro-a": { treadwear: 460, traction: "A", temperature: "A" },
  // bonwaytyre.com/grenlander-colo-h02-hp-tire — uniforme en toda la línea, medida exacta confirmada.
  "grenlander-colo-h02": { treadwear: 400, traction: "A", temperature: "A" },
  // bonwaytyre.com/grenlander-estrella-88-uhp-tire — ambas medidas exactas (225/45R17 y 205/45R17) confirmadas.
  "grenlander-estrella-88": { treadwear: 360, traction: "A", temperature: "A" },
  // bonwaytyre.com/grenlander-kingpro-one-hp-tire — uniforme en toda la línea.
  "grenlander-kingpro-one": { treadwear: 420, traction: "A", temperature: "A" },
  // bonwaytyre.com/grenlander-l-zeal-56-uhp-tire — cross-verificado con simpletire.com/brands/grenlander-tires/l-zeal-56.
  "grenlander-l-zeal56": { treadwear: 300, traction: "A", temperature: "A" },
  // bonwaytyre.com/zmax-zealion-uhp-tire — ambas medidas (205/55R16 94W y 205/45R17 88W) confirmadas, notación Z-speed.
  "zmax-zealion": { treadwear: 420, traction: "A", temperature: "A" },
  // pirelli.com/en-us — cross-verificado SimpleTire + VehicleTire/NHTSA, pero la línea ya no está en el catálogo
  // vivo de pirelli.com/en-us (posible descontinuación en EE.UU.); confianza media, no alta.
  "pirelli-p1-cinturato": { treadwear: 420, traction: "A", temperature: "A" },
  // pirelli.com/en-us/car/catalog/product/scorpion-atr/225_65-r17/102h — ficha oficial, medida exacta.
  "pirelli-scorpion-a-t": { treadwear: 520, traction: "B", temperature: "A" },
  // pirelli.com/en-us/car/catalog/product/scorpion-atr/225_65-r17/106h-xl — ficha oficial, medida exacta.
  "pirelli-scorpion-atr-xl": { treadwear: 520, traction: "B", temperature: "A" },
};

// Modelos donde el UTQG varía por medida (no por línea completa) — key: slug
// completo del producto. `null` = esa medida puntual es LT-metric/exenta de
// UTQG por norma, aunque otras medidas de la misma línea sí tengan dato.
const SIZE_OVERRIDES: Record<string, Utqg | null> = {
  // bonwaytyre.com/grenlander-maga-at-two-tire
  "grenlander-maga-a-t-two-245-70-r16-113s": null, // LT245/70R16 113/110S, exenta por norma
  "grenlander-maga-a-t-two-265-70-r16-112t": { treadwear: 460, traction: "A", temperature: "B" },
  "grenlander-maga-a-t-two-235-75-r15-104s": { treadwear: 400, traction: "A", temperature: "A" },
  "grenlander-maga-a-t-two-265-60-r18-110t": { treadwear: 400, traction: "A", temperature: "A" },
  // bonwaytyre.com/zmax-terra-xplorer-c2-at-tire
  "zmax-terra-xplorer-265-60-r18-110t": { treadwear: 400, traction: "A", temperature: "A" },
  "zmax-terra-xplorer-265-65-r17-112t": { treadwear: 460, traction: "A", temperature: "B" },
  "zmax-terra-xplorer-245-70-r16-113s": null, // LT-metric, exenta
  "zmax-terra-xplorer-235-75-r15-104s": null, // LT-metric, exenta
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Misma normalización que normalizeModelKey() en product-extra-photos.ts —
// pliega variantes de homologación del mismo modelo físico a una sola key.
function normalizeModelKey(brandId: string, modeloBase: string): string {
  const cleaned = modeloBase
    .replace(/^XL\s+/i, "")
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s+(RT|R|K\d)$/i, "")
    .replace(/\s+/g, " ")
    .trim();
  const slug = slugify(cleaned);
  return `${brandId}-${MODEL_ALIASES[slug] || slug}`;
}

export function getUtqg(brandId: string, modeloBase: string, slug: string): Utqg | null {
  if (slug in SIZE_OVERRIDES) return SIZE_OVERRIDES[slug];
  return UTQG_MAP[normalizeModelKey(brandId, modeloBase)] ?? null;
}
