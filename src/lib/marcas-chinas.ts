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
  /** Cómo se produce, solo cuando una fuente pública lo documenta: la marca encarga a terceros. */
  produccion?: string;
  /** Slug de una nota del blog dedicada a la marca. */
  nota?: string;
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
  {
    slug: "xbri",
    name: "Xbri",
    empresa: "Sunset Tires Corporation (grupo con matriz registrada en Hong Kong)",
    sede: "Qingdao, según la prensa del sector",
    dato: "Es una marca de origen brasileño que hasta ahora no tiene fábrica propia: anunció una planta en Ponta Grossa (Paraná) con producción prevista para 2027.",
    produccion:
      "Según la prensa del sector, sus neumáticos se fabrican en plantas de terceros en China, Vietnam, Tailandia y Camboya. Cuando una marca encarga a distintas fábricas, el mismo modelo puede salir de una planta u otra según el lote, y la calidad depende de a quién le tocó producir.",
  },
  {
    slug: "doubleking",
    name: "Double King",
    empresa: "Shandong Doubleking Tyre Co., Ltd.",
    sede: "Dongying, provincia de Shandong",
    hermanas: ["Luistone", "Alfamotors", "STMotors"],
    dato: "Según su perfil corporativo, el grupo incluye a Shandong Shuangwang Rubber y produce neumáticos de auto, SUV, todo terreno y camión. La marca figura registrada a nombre de Shandong Double King Rubber Co., Ltd.",
    nota: "neumaticos-double-king-quien-los-fabrica",
  },
  {
    slug: "mileking",
    name: "Mileking",
    empresa: "ACMEX Group",
    sede: "provincia de Shandong",
    dato: "Según distribuidores, es del mismo grupo que Haida. Otra fuente pública registra la marca a nombre de Sichuan Tyre & Rubber, así que la titularidad no es unívoca.",
  },
  {
    slug: "sumaxx",
    name: "Sumaxx",
    empresa: "Qingdao Sunforce Tyre Co., Ltd.",
    sede: "Qingdao, provincia de Shandong",
    dato: "Según un distribuidor europeo, se especializa en neumáticos de alto desempeño y fuera de ruta.",
  },
  {
    slug: "aoteli",
    name: "Aoteli",
    empresa: "Shengtai Group",
    sede: "Dongying, provincia de Shandong",
    dato: "El grupo se fundó en 2002 y fabrica neumáticos de auto, SUV y camión.",
  },
  {
    slug: "hifly",
    name: "Hifly",
    empresa: "Shandong Hengfeng Rubber and Plastic",
    sede: "provincia de Shandong",
    dato: "Según distribuidores, la marca Hifly se creó en 2007 para vender los neumáticos de la empresa en el exterior; en el registro europeo EPREL un modelo figura con otro proveedor de Dongying.",
  },
];

export function getOtraMarca(slug: string): OtraMarca | undefined {
  return OTRAS_MARCAS.find((m) => m.slug === slug);
}
