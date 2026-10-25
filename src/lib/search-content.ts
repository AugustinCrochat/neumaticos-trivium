import { matchScore } from "./fuzzy-search";
import { BLOG_POSTS, BRANDS, SERVICES } from "./data";
import { TOOLS, toolPath } from "./tools";

export type ContentResult = {
  title: string;
  description: string;
  href: string;
  /** Rótulo corto del tipo de contenido: Nota, Herramienta, Marca, Servicio, Página. */
  kind: string;
};

// Páginas principales del sitio con palabras clave de cómo las busca la gente.
const PAGES: { title: string; description: string; href: string; keywords: string }[] = [
  { title: "Catálogo de neumáticos", description: "Todos los neumáticos con stock, por marca, precio y medida.", href: "/catalogo", keywords: "catalogo todos productos comprar" },
  { title: "Ofertas", description: "Neumáticos en oferta y promociones vigentes.", href: "/ofertas", keywords: "ofertas promociones descuentos promo baratos" },
  { title: "Neumáticos baratos en Córdoba", description: "Los neumáticos más económicos con stock.", href: "/neumaticos-baratos", keywords: "baratos economicos precio barato cordoba" },
  { title: "Neumáticos para remises, taxis y Uber", description: "Cubiertas para trabajar con el auto: durabilidad y precio por kilómetro.", href: "/neumaticos-para-remises-taxis-y-uber", keywords: "remis remises taxi taxis uber didi cabify aplicaciones trabajo" },
  { title: "Neumáticos de carga", description: "Cubiertas C para utilitarios, furgones y camionetas.", href: "/neumaticos/carga", keywords: "carga utilitario furgon furgones reparto camioneta c" },
  { title: "Neumáticos A/T", description: "Todo terreno para camionetas y pickups.", href: "/neumaticos/at", keywords: "at a/t todo terreno camioneta pickup 4x4" },
  { title: "Neumáticos H/T", description: "Cubiertas de ruta para camionetas y SUV.", href: "/neumaticos/ht", keywords: "ht h/t ruta suv camioneta" },
  { title: "Marcas chinas de neumáticos", description: "Comparativa de las marcas chinas que vendemos.", href: "/marcas-de-neumaticos-chinos", keywords: "chinos chinas marcas china" },
  { title: "Tuercas antirrobo", description: "Tuercas de seguridad para llantas; buscá la que lleva tu auto.", href: "/tuercas-antirrobo", keywords: "tuercas tuerca antirrobo seguridad llantas bulones birlos" },
  { title: "Servicios de gomería", description: "Alineación, balanceo, rotación, arme y desarme.", href: "/servicios", keywords: "servicios gomeria alineacion balanceo rotacion colocacion valvulas taller" },
  { title: "Armá tu presupuesto", description: "Cotizador de neumáticos con cuotas y pago en efectivo.", href: "/cotizador", keywords: "presupuesto cotizador cotizar cuotas efectivo pago financiacion" },
  { title: "Sucursales y cómo llegar", description: "Dirección, horarios y mapa de los locales.", href: "/sucursales", keywords: "sucursales local direccion horarios mapa como llegar ubicacion donde" },
  { title: "Contacto", description: "WhatsApp y teléfono del local.", href: "/contacto", keywords: "contacto whatsapp telefono consulta" },
  { title: "Calculadora de equivalencias", description: "Medidas equivalentes dentro del ±3% de diámetro.", href: "/calculadora-equivalencia-neumaticos", keywords: "equivalencias equivalente medida alternativa calculadora" },
  { title: "UTQG: qué significa", description: "Desgaste, tracción y temperatura del neumático.", href: "/utqg", keywords: "utqg treadwear desgaste traccion temperatura" },
  { title: "Índice de carga y velocidad", description: "Tabla de índices de carga y velocidad.", href: "/indice-carga-velocidad", keywords: "indice carga velocidad tabla" },
  { title: "Garantía de 1 año en neumáticos", description: "Qué cubre la garantía por defecto de fabricación y cómo se reclama.", href: "/garantia-neumaticos", keywords: "garantia garantias un año fabricacion defecto reclamo cubre" },
  { title: "Política de devoluciones", description: "Cambios y devoluciones.", href: "/politica-de-devoluciones", keywords: "devolucion devoluciones cambio garantia arrepentimiento" },
  { title: "Blog", description: "Guías y notas sobre neumáticos.", href: "/blog", keywords: "blog notas guias articulos" },
  { title: "Herramientas gratuitas", description: "Calculadoras y lectores para el neumático.", href: "/herramientas", keywords: "herramientas calculadoras gratis" },
];

const ALL: (ContentResult & { searchable: string })[] = [
  ...PAGES.map((p) => ({ title: p.title, description: p.description, href: p.href, kind: "Página", searchable: `${p.title} ${p.keywords} ${p.description}` })),
  ...SERVICES.map((s) => ({ title: s.title, description: s.description.slice(0, 140), href: "/servicios", kind: "Servicio", searchable: `${s.title} ${s.features.join(" ")} ${s.description}` })),
  ...BRANDS.map((b) => ({ title: `Neumáticos ${b.name}`, description: b.description ?? `Marca ${b.name}`, href: `/marcas/${b.id}`, kind: "Marca", searchable: `${b.name} marca ${b.origin} ${b.description ?? ""}` })),
  ...TOOLS.map((t) => ({ title: t.name, description: t.short, href: toolPath(t.slug), kind: "Herramienta", searchable: `${t.name} ${t.short} ${t.metaTitle}` })),
  ...BLOG_POSTS.map((p) => ({ title: p.title, description: p.excerpt, href: `/blog/${p.slug}`, kind: "Nota", searchable: `${p.title} ${p.excerpt} ${p.category}` })),
];

/** Notas, herramientas, marcas, servicios y páginas que matchean; siempre después de los productos. */
export function searchContent(query: string, limit: number): ContentResult[] {
  return ALL.map((c) => ({ c, score: matchScore(query, c.searchable) + (matchScore(query, c.title) > 0 ? 2 : 0) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ c: { title, description, href, kind } }) => ({ title, description, href, kind }));
}
