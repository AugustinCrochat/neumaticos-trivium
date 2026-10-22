/** Herramientas gratuitas del sitio: /herramientas/<slug>. Un solo lugar para el índice, el mapa y el sitemap. */
export type Tool = {
  slug: string;
  /** H1 y nombre de la aplicación. */
  name: string;
  /** Una línea para tarjetas e índices. */
  short: string;
  /** <title> */
  metaTitle: string;
  metaDescription: string;
  /** Foto de la tarjeta y del encabezado. */
  image: { src: string; alt: string };
};

export const TOOLS: Tool[] = [
  {
    slug: "cuando-cambiar-neumaticos",
    name: "¿Cuándo cambiar mis neumáticos?",
    short: "Profundidad del dibujo, antigüedad y kilómetros: te decimos si ya toca.",
    metaTitle: "¿Cuándo cambiar los neumáticos? Calculadora de desgaste y antigüedad",
    metaDescription:
      "Medí la profundidad del dibujo, ingresá el código DOT y los kilómetros: la herramienta te dice si tus neumáticos están bien, para vigilar o para cambiar ya.",
    image: { src: "/images/herramientas/neumatico-desgastado-testigo.webp", alt: "Neumático gastado hasta los testigos de desgaste" },
  },
  {
    slug: "codigo-dot",
    name: "Lector de código DOT",
    short: "Escribí los 4 números del flanco y mirá la semana, el año y la antigüedad.",
    metaTitle: "Código DOT del neumático: cómo saber la fecha de fabricación",
    metaDescription:
      "Ingresá los 4 dígitos del código DOT de tu neumático y conocé la semana y el año de fabricación, cuántos años tiene y si conviene cambiarlo.",
    image: { src: "/images/herramientas/codigo-dot-flanco-neumatico.webp", alt: "Flanco de un neumático con el código DOT de fabricación grabado" },
  },
  {
    slug: "presion-neumaticos",
    name: "Presión de neumáticos",
    short: "Presión en frío según el tipo de vehículo y la carga, en PSI y en bar.",
    metaTitle: "Presión de neumáticos: cuántas libras poner según tu vehículo",
    metaDescription:
      "Rangos de presión en frío en PSI y bar según el tipo de vehículo y si viajás cargado. Conversor PSI a bar y cómo leer la calcomanía del auto.",
    image: { src: "/images/local/camionetas-en-elevador-taller-neumaticos-trivium-cordoba.webp", alt: "Camionetas sobre los elevadores del taller de Neumáticos Trivium" },
  },
  {
    slug: "velocimetro-neumaticos",
    name: "Velocímetro con otro neumático",
    short: "Cuánto marca de más o de menos el velocímetro al cambiar de medida.",
    metaTitle: "Velocímetro con otra medida de neumático: error y velocidad real",
    metaDescription:
      "Calculá cuánto cambia el velocímetro y el cuentakilómetros al usar una medida de neumático distinta: tabla de velocidad marcada contra velocidad real.",
    image: { src: "/images/local/cubierta-perfil-bajo-grenlander-colocada-neumaticos-trivium.webp", alt: "Cubierta de perfil bajo recién colocada en una llanta" },
  },
  {
    slug: "costo-por-kilometro",
    name: "Costo por kilómetro",
    short: "Compará dos neumáticos por lo que cuesta cada 1.000 km, no por el precio de góndola.",
    metaTitle: "Costo por kilómetro de un neumático: calculadora para comparar",
    metaDescription:
      "Compará un neumático de marca contra uno económico por costo cada 1.000 km y por año, según el precio, la vida útil estimada y tus kilómetros anuales.",
    image: { src: "/images/local/neumatico-grenlander-kingpro-one-pickup-trivium.webp", alt: "Neumático Grenlander Kingpro One colocado en una pick-up" },
  },
  {
    slug: "conversor-flotation",
    name: "Conversor de medidas flotation",
    short: "Pasá 31x10.5 R15 a medida métrica (y al revés) para buscarla en stock.",
    metaTitle: "Conversor de medidas flotation a métricas: 31x10.5 R15 y más",
    metaDescription:
      "Convertí medidas en pulgadas (31x10.5 R15, 33x12.5 R15) a medida métrica y viceversa. Mirá el equivalente y buscalo con stock en el catálogo.",
    image: { src: "/images/local/neumatico-at-grenlander-maga-at-two-camioneta-clasica-trivium.webp", alt: "Neumático A/T de medida flotation en una camioneta" },
  },
  {
    slug: "arma-tu-juego",
    name: "Armá tu juego completo",
    short: "Elegí tu auto, un modelo y mirá el total de los 4 neumáticos con alineación y balanceo.",
    metaTitle: "Armá tu juego de 4 neumáticos con alineación y balanceo — presupuesto al instante",
    metaDescription:
      "Elegí tu auto o tu medida, un neumático en stock y mirá el total del juego de 4 con colocación, alineación y balanceo. Enviá el presupuesto por WhatsApp.",
    image: { src: "/images/local/tecnicos-alineando-auto-elevador-gomeria-trivium-cordoba.webp", alt: "Técnicos alineando un auto en el elevador del taller de Trivium" },
  },
];

export const toolPath = (slug: string) => `/herramientas/${slug}`;
