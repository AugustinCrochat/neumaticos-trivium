/**
 * Categorías del blog con página propia (/blog/categoria/<slug>).
 *
 * Agrupan las notas por tema para quien llega al blog (antes era una sola
 * grilla de más de cien tarjetas) y le dan a Google una página índice por
 * tema. Los títulos son informativos a propósito: la página de taller no usa
 * "alineación y balanceo" como título para no competirle a la ficha del combo
 * (/servicios/combo-alineado-y-balanceado), que es la que tiene que posicionar
 * para esa búsqueda.
 */
export type BlogCategoria = {
  slug: string;
  /** Valor de `category` en data.ts. */
  categoria: string;
  /** Texto del chip. */
  chip: string;
  h1: string;
  title: string;
  description: string;
  bajada: string;
};

export const BLOG_CATEGORIAS: BlogCategoria[] = [
  {
    slug: "guias",
    categoria: "Guías",
    chip: "Guías de compra y uso",
    h1: "Guías de neumáticos",
    title: "Guías de neumáticos: cómo elegir, comparar y usar tus cubiertas",
    description: "Guías para elegir neumáticos, entender lo que dice el flanco, comparar opciones y resolver dudas de uso diario. Escritas por quienes los venden y colocan todos los días.",
    bajada: "Cómo elegir, qué significa cada cosa del flanco y qué hacer ante las dudas de todos los días.",
  },
  {
    slug: "mantenimiento",
    categoria: "Mantenimiento",
    chip: "Mantenimiento",
    h1: "Mantenimiento de neumáticos",
    title: "Mantenimiento de neumáticos: presión, rotación y cuidado para que duren más",
    description: "Cómo mantener los neumáticos del auto: presión, rotación, revisión mensual, guardado y señales de desgaste. Guías prácticas para que duren más y el auto frene mejor.",
    bajada: "Presión, rotación y revisiones: lo que hace que un juego de cubiertas dure lo que tiene que durar.",
  },
  {
    slug: "taller",
    categoria: "Servicios",
    chip: "Del taller",
    h1: "Notas del taller",
    title: "Notas del taller de gomería: síntomas, intervalos y cómo se hace cada trabajo",
    description: "Qué le pasa al auto cuando tira, vibra o gasta mal las cubiertas, cada cuánto conviene pasar por la gomería y cómo se hace cada trabajo en el taller.",
    bajada: "Qué le pasa al auto cuando tira o vibra, cada cuánto pasar por la gomería y cómo se hace cada trabajo.",
  },
  {
    slug: "medidas",
    categoria: "Medidas",
    chip: "Medidas y autos",
    h1: "Medidas de neumáticos",
    title: "Medidas de neumáticos: qué autos usa cada una y sus equivalencias",
    description: "Cada medida de neumático explicada: qué autos y camionetas la usan de fábrica, diámetro total, equivalencias y cómo elegir entre las opciones disponibles.",
    bajada: "Qué autos usan cada medida de fábrica, cuánto mide y qué equivalencias sirven.",
  },
  {
    slug: "marcas",
    categoria: "Marcas",
    chip: "Marcas",
    h1: "Marcas de neumáticos",
    title: "Marcas de neumáticos: historia, origen y cómo comparar",
    description: "Quién fabrica cada marca de neumáticos, de dónde viene y cómo comparar marcas tradicionales con importadas antes de comprar.",
    bajada: "Quién fabrica cada marca, de dónde viene y cómo compararlas.",
  },
];

export const categoriaPorNombre = (categoria: string) => BLOG_CATEGORIAS.find((c) => c.categoria === categoria);

/**
 * Color y texto del enlace de cada categoría, para distinguirlas de un vistazo
 * en el listado, la portada y el encabezado de la nota. Las clases van
 * completas (Tailwind no arma nombres por pedazos).
 */
const ESTILOS: Record<string, { fondo: string; texto: string; cta: string }> = {
  "Guías": { fondo: "bg-[#ff1e00]", texto: "text-[#d11800]", cta: "Leer la guía" },
  Mantenimiento: { fondo: "bg-[#15803d]", texto: "text-[#15803d]", cta: "Ver cómo cuidarlos" },
  Servicios: { fondo: "bg-[#111111]", texto: "text-[#111111]", cta: "Leer la nota del taller" },
  Medidas: { fondo: "bg-[#1e6fd9]", texto: "text-[#1e6fd9]", cta: "Ver la medida" },
  Marcas: { fondo: "bg-[#7c3aed]", texto: "text-[#7c3aed]", cta: "Conocer la marca" },
  "Opiniones y Comparativas": { fondo: "bg-[#c2410c]", texto: "text-[#c2410c]", cta: "Ver la comparativa" },
};

export const estiloCategoria = (categoria: string) =>
  ESTILOS[categoria] ?? { fondo: "bg-black", texto: "text-black", cta: "Leer la nota" };
