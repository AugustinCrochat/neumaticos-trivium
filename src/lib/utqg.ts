/**
 * UTQG (Uniform Tire Quality Grading): norma de EE.UU. — no tiene relación
 * regulatoria con la etiqueta europea (ver getTireLabel() en tire-labels.ts)
 * y por eso vive en un archivo aparte. Trae tres datos: desgaste relativo
 * (treadwear, número — más alto sugiere mayor vida útil estimada), tracción
 * (letra, AA/A/B/C) y resistencia a la temperatura a alta velocidad (letra,
 * A/B/C). Ver el blog /blog/etiqueta-europea-neumaticos para la explicación
 * completa al usuario.
 *
 * Es por modelo, no por medida — igual que product-extra-photos.ts — porque
 * la mayoría de los fabricantes declaran un solo valor por línea (algunos
 * varían por medida puntual; cuando eso pasa, solo cargamos acá el valor que
 * pudimos confirmar para la medida exacta que vendemos, no un promedio).
 *
 * La norma es de EE.UU.: la mayoría de nuestras marcas (Arivo, Grenlander,
 * Firemax, Zmax — fabricantes chinos que no venden oficialmente en EE.UU.)
 * no tienen UTQG publicado en ninguna fuente verificable, así que no
 * figuran acá — no se completó a mano ni se estimó. Cargado a mano el
 * 2026-09-25 investigando fichas oficiales de cada fabricante (Arivo) o
 * fichas de retailers de EE.UU. que replican el dato del fabricante/NHTSA
 * (Pirelli, Grenlander L-Zeal56); la fuente de cada línea está comentada
 * abajo. Para agregar una marca/línea nueva, no inventar el valor: buscar
 * la ficha oficial o, en su defecto, una ficha de retailer serio de EE.UU.
 * (SimpleTire, TireRack, vehicletire.com que cita NHTSA) y dejarla afuera si
 * no se encuentra nada verificable.
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
  // arivotyre.net/arivo-pcr/arz1 — confirmado para 165/70R13, la medida exacta que vendemos.
  "arivo-premio-arz1rt": { treadwear: 420, traction: "A", temperature: "A" },
  // arivotyre.net/arivo-pcr/arzero — uniforme en toda la tabla de medidas.
  "arivo-premio-arzero": { treadwear: 400, traction: "A", temperature: "A" },
  // arivotyre.net/arivo-pcr/terramax-arv-ht — confirmado para 245/65R17, la medida exacta que vendemos.
  "arivo-terramax-arv-a-t": { treadwear: 460, traction: "A", temperature: "A" },
  // arivotyre.net/arivo-pcr/terramax-arv-pro-at — confirmado para 265/65R17 112T, la medida exacta que vendemos (varía en otras medidas).
  "arivo-terramax-arv-pro-a": { treadwear: 460, traction: "A", temperature: "A" },
  // simpletire.com/brands/grenlander-tires/l-zeal-56
  "grenlander-l-zeal56": { treadwear: 300, traction: "A", temperature: "A" },
  // simpletire.com/brands/pirelli-tires/cinturato-p1 + vehicletire.com/Rating/Pirelli (NHTSA) — cross-verificado.
  "pirelli-p1-cinturato": { treadwear: 420, traction: "A", temperature: "A" },
  // simpletire.com/brands/pirelli-tires/scorpion + vehicletire.com/Rating/Pirelli (NHTSA) — cross-verificado, es el "Scorpion Verde".
  "pirelli-scorpion": { treadwear: 400, traction: "AA", temperature: "A" },
  // vehicletire.com/Rating/Pirelli (NHTSA), como "P6000 Powergy".
  "pirelli-powergy": { treadwear: 180, traction: "A", temperature: "A" },
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

export function getUtqg(brandId: string, modeloBase: string): Utqg | null {
  return UTQG_MAP[normalizeModelKey(brandId, modeloBase)] ?? null;
}
