import type { TireProduct, TireSize } from "./types";
import { sizesEqual } from "./tire-sizes";

/**
 * Neumáticos de carga (serie C): helpers de medida, slug y contenido propio por
 * medida para las landings /neumaticos/carga/[medida].
 *
 * El slug de carga lleva una "c" final ("195-70-r15c") para distinguirlo del de
 * auto ("195-70-r15"): son productos distintos (otro índice de carga, otra
 * presión) y comparten medida nominal, así que no pueden compartir URL.
 */

export function formatCargaSize(size: TireSize): string {
  return `${size.width}/${size.profile} R${size.rim}C`;
}

export function cargaSlug(size: TireSize): string {
  return `${size.width}-${size.profile}-r${size.rim}c`;
}

const CARGA_SLUG_RE = /^(\d{3})-(\d{2})-r(\d{2})c$/;

export function parseCargaSlug(slug: string): TireSize | null {
  const match = CARGA_SLUG_RE.exec(slug);
  if (!match) return null;
  const size = { width: Number(match[1]), profile: Number(match[2]), rim: Number(match[3]) };
  if (size.width < 125 || size.width > 285) return null;
  if (size.profile < 45 || size.profile > 85) return null;
  if (size.rim < 12 || size.rim > 17) return null;
  return size;
}

export function cargaProductsOfSize(productos: TireProduct[], size: TireSize): TireProduct[] {
  return productos.filter((p) => p.isCarga && sizesEqual(p.size, size));
}

/** Carga máxima por neumático (kg) para cada índice, según la tabla ETRTO. */
const LOAD_INDEX_KG: Record<string, number> = {
  "88": 560,
  "89": 580,
  "90": 600,
  "91": 615,
  "92": 630,
  "93": 650,
  "94": 670,
  "95": 690,
  "96": 710,
  "97": 730,
  "98": 750,
  "99": 775,
  "100": 800,
  "101": 825,
  "102": 850,
  "103": 875,
  "104": 900,
  "105": 925,
  "106": 950,
  "107": 975,
  "108": 1000,
  "109": 1030,
  "110": 1060,
  "111": 1090,
  "112": 1120,
  "113": 1150,
  "114": 1180,
  "115": 1215,
  "116": 1250,
};

export function loadIndexKg(index: string | undefined): number | null {
  return index ? (LOAD_INDEX_KG[index] ?? null) : null;
}

/** "90/88" → "600 kg simple · 560 kg dual", o null si el POS no trae el dato. */
export function cargaCapacityLabel(p: TireProduct): string | null {
  const simple = loadIndexKg(p.loadIndex);
  if (!simple) return null;
  const dual = loadIndexKg(p.loadIndexDual);
  return dual
    ? `${p.loadIndex}/${p.loadIndexDual}: ${simple} kg por rueda en simple, ${dual} kg en dual`
    : `${p.loadIndex}: ${simple} kg por rueda`;
}

export type CargaSizeContent = {
  /** Párrafo de apertura, único por medida. */
  intro: string;
  /** A qué tipo de vehículo suele corresponder, con la aclaración de verificar la calcomanía. */
  vehiculos: string;
  /** Qué hay que mirar al elegir en esta medida puntual. */
  aTener: string[];
};

/**
 * Texto propio por medida. Cada una necesita contenido distinto: dos landings
 * con el mismo texto y la medida cambiada son doorway pages (ver
 * seo-architecture). Las medidas que no están acá usan GENERIC_CONTENT.
 */
const CONTENT: Record<string, CargaSizeContent> = {
  "175-65-r14c": {
    intro:
      "El 175/65 R14C es la medida C más chica del catálogo y la típica de los utilitarios livianos derivados de auto: los que se usan para reparto urbano, plomería, electricidad o la entrega diaria de pedidos. Es un neumático barato de mantener porque rueda mucho y rinde en ciudad, pero se desgasta rápido si va siempre cargado al límite.",
    vehiculos:
      "Suele corresponder a utilitarios compactos del tipo Berlingo o Partner en versión furgón. Otros modelos de la misma categoría pueden usar una medida distinta: la que vale es la de la calcomanía de la puerta del conductor.",
    aTener: [
      "Si tu vehículo trae R14C, no lo cambies por uno sin C aunque coincida el ancho: la carcasa de auto no está pensada para el peso que lleva un furgón.",
      "En esta medida el índice 90/88 admite 600 kg por rueda en montaje simple. Sumá el peso del vehículo vacío más la carga y verificá que no pase de lo que soportan las cuatro ruedas.",
      "Es la medida más usada en reparto urbano: conviene rotar cada 8.000 a 10.000 km, porque las ruedas del eje delantero se gastan más.",
    ],
  },
  "195-70-r15c": {
    intro:
      "El 195/70 R15C es una de las medidas más pedidas en furgones medianos. Combina un perfil de 70 con un rodado de 15 pulgadas, lo que le da un flanco alto que absorbe bien el pavimento roto y los baches, con un índice 104/102 que banca cargas de reparto pesado sin llegar al camión.",
    vehiculos:
      "Es la medida habitual de furgones como la Renault Trafic, la Peugeot Expert o la Citroën Jumpy, según el año y la versión. Antes de comprar, confirmá en la calcomanía que tu vehículo use esta medida y no una de 16 pulgadas.",
    aTener: [
      "El 104/102 equivale a 900 kg por rueda en simple y 850 kg en dual: si tu eje trasero es de rueda simple, el valor que cuenta es el primero.",
      "Un neumático de auto 195/70 R15 sin C no es sustituto: tiene menos capacidad de carga y menor presión máxima.",
      "Si el furgón anda cargado todos los días, revisá la presión en frío cada 15 días; una presión baja con carga es la principal causa de roturas de flanco.",
    ],
  },
  "205-70-r15c": {
    intro:
      "El 205/70 R15C cubre furgones y utilitarios de porte medio que necesitan algo más de banda de rodamiento que el 195, sin pasar a las medidas de 16 pulgadas. Con el índice 106/104 soporta 950 kg por rueda en montaje simple, un margen cómodo para quien trabaja con carga todos los días.",
    vehiculos:
      "Se usa en utilitarios medianos y algunos furgones de rodado 15. Como la medida original varía según marca, año y versión, la referencia es siempre la calcomanía del marco de la puerta o el manual.",
    aTener: [
      "Si ya venís usando 195/70 R15C y querés pasar a 205/70 R15C, el diámetro cambia alrededor de un 2%: entra en el margen habitual, pero verificá que no roce en las curvas con la rueda cargada.",
      "El 106/104 equivale a 950 kg en simple y 900 kg en dual por rueda.",
      "Es el neumático con más margen de carga de los rodados de 15 pulgadas del catálogo: tiene sentido si el vehículo va seguido al máximo de su capacidad.",
    ],
  },
  "225-75-r16c": {
    intro:
      "El 225/75 R16C es la medida de los furgones grandes: los de carga y los de transporte de pasajeros de porte alto. Con un índice 116/114 soporta 1.250 kg por rueda en montaje simple, el valor más alto de los neumáticos C del catálogo, pensado para vehículos que andan siempre con peso.",
    vehiculos:
      "Corresponde a furgones grandes como Mercedes-Benz Sprinter o Fiat Ducato en varias versiones. Hay variantes del mismo modelo con otra medida, así que la calcomanía de la puerta manda.",
    aTener: [
      "El 116/114 equivale a 1.250 kg por rueda en simple y 1.180 kg en dual. En eje dual, usá el segundo valor para calcular.",
      "En vehículos pesados la presión de inflado se ajusta según la carga que lleva el eje; la tabla suele estar en la misma calcomanía.",
      "Por tamaño y peso, el balanceo y la alineación se notan: un desbalance leve ya se siente en el volante y en el desgaste.",
    ],
  },
};

const GENERIC_CONTENT: CargaSizeContent = {
  intro:
    "Neumático de carga (serie C): carcasa reforzada, mayor índice de carga y mayor presión máxima que uno de auto en la misma medida, pensado para furgones y utilitarios que trabajan todos los días.",
  vehiculos:
    "La medida original de tu vehículo figura en la calcomanía del marco de la puerta del conductor o en el manual. Respetá la medida y el índice de carga que indica.",
  aTener: [
    "No reemplaces un neumático C por uno de auto aunque coincidan ancho, perfil y rodado.",
    "El índice de carga del reemplazo tiene que ser igual o mayor al original.",
  ],
};

export function cargaContent(size: TireSize): CargaSizeContent {
  return CONTENT[cargaSlug(size)] ?? GENERIC_CONTENT;
}
