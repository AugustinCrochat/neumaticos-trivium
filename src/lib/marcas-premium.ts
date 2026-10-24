/**
 * Marcas de neumáticos tradicionales o premium que no vendemos. Cada una tiene
 * su página (/alternativas/[slug]) para quien las busca por nombre: se explica
 * qué se sabe de la marca y se muestran las opciones que sí tenemos.
 *
 * Sólo datos verificados en fuentes públicas, y nada sobre desempeño: no las
 * vendemos ni las probamos. Pirelli no está porque sí la vendemos (tiene
 * /marcas/pirelli). Para sumar una marca, verificar antes el titular.
 */
export type MarcaPremium = {
  slug: string;
  name: string;
  origen: string;
  /** Marcas del mismo grupo. */
  hermanas?: string[];
  /** Datos ya redactados, uno por viñeta. */
  datos?: string[];
};

export const MARCAS_PREMIUM: MarcaPremium[] = [
  {
    slug: "michelin",
    name: "Michelin",
    origen: "Francia",
    hermanas: ["BFGoodrich"],
    datos: ["Michelin también es dueña de BFGoodrich."],
  },
  {
    slug: "bridgestone",
    name: "Bridgestone",
    origen: "Japón",
    hermanas: ["Firestone"],
    datos: [
      "Bridgestone es dueña de Firestone: en Argentina las dos marcas comparten la planta de Llavallol, la primera fábrica de neumáticos del país, inaugurada por Firestone.",
    ],
  },
  {
    slug: "firestone",
    name: "Firestone",
    origen: "Estados Unidos",
    hermanas: ["Bridgestone"],
    datos: [
      "Firestone se fusionó con la japonesa Bridgestone en 1988 y hoy es una de sus marcas.",
      "En Argentina la planta de Llavallol la inauguró Firestone y hoy la opera Bridgestone.",
    ],
  },
  {
    slug: "goodyear",
    name: "Goodyear",
    origen: "Estados Unidos",
    datos: ["En 2021 Goodyear anunció la compra de Cooper Tire."],
  },
  {
    slug: "continental",
    name: "Continental",
    origen: "Alemania",
  },
  {
    slug: "fate",
    name: "Fate",
    origen: "Argentina",
    datos: [
      "Fate cerró su única fábrica, la de San Fernando: en febrero de 2026 la empresa anunció el cierre definitivo y el despido de sus 920 trabajadores, según informaron varios medios.",
      "Hoy los neumáticos Fate no se fabrican en Argentina ni se importan, así que no se consiguen cubiertas nuevas de la marca; igual, mucha gente que todavía las lleva puestas sigue buscándola.",
    ],
  },
  {
    slug: "hankook",
    name: "Hankook",
    origen: "Corea del Sur",
  },
  {
    slug: "yokohama",
    name: "Yokohama",
    origen: "Japón",
    datos: ["Yokohama Rubber es una empresa japonesa fundada en 1917."],
  },
  {
    slug: "toyo",
    name: "Toyo",
    origen: "Japón",
  },
  {
    slug: "nexen",
    name: "Nexen",
    origen: "Corea del Sur",
  },
  {
    slug: "dunlop",
    name: "Dunlop",
    origen: "Reino Unido (origen histórico)",
    datos: [
      "Los derechos de la marca Dunlop se repartieron durante años entre Sumitomo Rubber (Japón) y Goodyear (Estados Unidos) según la región; en enero de 2025 Sumitomo acordó comprar los derechos de Goodyear para neumáticos de auto en Europa, Norteamérica y Oceanía.",
      "Por eso un neumático Dunlop puede venir de fabricantes y orígenes distintos según el modelo y el mercado.",
    ],
  },
  {
    slug: "kumho",
    name: "Kumho",
    origen: "Corea del Sur",
    datos: ["En 2018 la china Doublestar compró el 45% de Kumho Tire y quedó como accionista controlante."],
  },
];

export function getMarcaPremium(slug: string): MarcaPremium | undefined {
  return MARCAS_PREMIUM.find((m) => m.slug === slug);
}
