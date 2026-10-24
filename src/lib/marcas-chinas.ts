/**
 * Marcas chinas de neumáticos que se consiguen en Argentina pero que no
 * vendemos. Cada una tiene su página (/marcas-de-neumaticos-chinos/[slug]) para
 * quien las busca por nombre y termina viendo las marcas chinas que sí tenemos.
 *
 * Sólo van datos que se pueden verificar en fuentes públicas (sitio del grupo,
 * registros de marca, EPREL). Nada de opiniones sobre desempeño: no las
 * vendemos ni las probamos. Para sumar una marca, verificar primero quién es el
 * titular y que se comercialice en Argentina.
 */
export type OtraMarca = {
  slug: string;
  name: string;
  /** Empresa titular de la marca, según fuentes públicas. */
  empresa: string;
  /** Dónde está la sede, si se pudo confirmar. */
  sede?: string;
  /** Otras marcas del mismo grupo. */
  hermanas?: string[];
  /** Un dato más para el texto, ya redactado. */
  dato?: string;
  /** brandId de una marca nuestra que es del mismo fabricante. */
  mismoFabricante?: string;
};

export const OTRAS_MARCAS: OtraMarca[] = [
  {
    slug: "kpatos",
    name: "Kpatos",
    empresa: "Qingdao Sunfulcess Tyre Co., Ltd.",
    sede: "Qingdao, provincia de Shandong",
    hermanas: ["Sunfulcess", "Firemax"],
    dato: "Algunos modelos, como el FM601, figuran con el mismo código de dibujo que en Firemax.",
    mismoFabricante: "firemax",
  },
  {
    slug: "linglong",
    name: "Linglong",
    empresa: "Shandong Linglong Tire Co., Ltd.",
    sede: "Zhaoyuan, provincia de Shandong",
    dato: "La empresa tiene sus orígenes en 1975 y, además de sus fábricas en China, tiene una planta en Tailandia.",
  },
  {
    slug: "sailun",
    name: "Sailun",
    empresa: "Sailun Group",
    sede: "Qingdao, provincia de Shandong",
    dato: "El grupo se fundó en 2002 y hoy fabrica neumáticos de auto, camioneta, camión y fuera de ruta.",
  },
  {
    slug: "goodride",
    name: "Goodride",
    empresa: "Zhongce Rubber Group (ZC Rubber)",
    sede: "Hangzhou",
    hermanas: ["Westlake", "Chaoyang"],
  },
  {
    slug: "westlake",
    name: "Westlake",
    empresa: "Zhongce Rubber Group (ZC Rubber)",
    sede: "Hangzhou",
    hermanas: ["Goodride", "Chaoyang"],
  },
  {
    slug: "triangle",
    name: "Triangle",
    empresa: "Triangle Group (Triangle Tyre)",
    sede: "Weihai, provincia de Shandong",
    dato: "La empresa tiene sus orígenes en 1976 y todas sus fábricas están en la región de Weihai.",
  },
  {
    slug: "greentrac",
    name: "Greentrac",
    empresa: "Qingdao New Keter Tyre Co., Limited",
    sede: "Qingdao, provincia de Shandong",
  },
  {
    slug: "windforce",
    name: "Windforce",
    empresa: "No hay un grupo propietario único confirmado en las fuentes públicas",
    sede: "provincia de Shandong",
  },
];

export function getOtraMarca(slug: string): OtraMarca | undefined {
  return OTRAS_MARCAS.find((m) => m.slug === slug);
}
