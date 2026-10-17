/**
 * Imágenes y atajos de compra de cada nota del blog.
 *
 * Todas las fotos son archivos propios del repo (local, taller y bandas de
 * rodamiento de los productos que vendemos); no hay stock fotográfico ni
 * imágenes que dependan de que un producto esté cargado en el POS.
 *
 * Los links apuntan sólo a rutas que existen y no dependen del stock de hoy
 * (categorías, rodados y marcas), así que una nota vieja no manda a un 404.
 */

export type BlogImage = {
  src: string;
  alt: string;
  /** "contain" para cubiertas recortadas sobre fondo claro; por defecto "cover". */
  fit?: "cover" | "contain";
  /** object-position CSS para encuadrar la foto en formato apaisado. */
  position?: string;
};

export type BlogFigure = BlogImage & { caption: string };

export type ShopLink = { label: string; href: string };

export type BlogMeta = {
  cover: BlogImage;
  /** Foto que se intercala dentro del texto. */
  figure: BlogFigure;
  /** Frase corta sobre el bloque de links, con el tema de la nota. */
  shopIntro: string;
  shopLinks: ShopLink[];
};

const TALLER = {
  alineacion: "/images/servicios/alineacion.webp",
  balanceo: "/images/servicios/balanceo.webp",
  montaje: "/images/servicios/arme-desarme.webp",
  local: "/images/branches/arguello-fachada.webp",
  geoliner: "/images/blog/geoliner-630-alineadora-trivium.webp",
  geodyna: "/images/blog/geodyna-7800p-balanceadora-trivium.webp",
};

const BANDA = {
  calle: "/images/products-tread/1010060-205-45-r17-extraload-88-v-michelin-primacy-4-x1.webp",
  calleEco: "/images/products-tread/1010913-205-65-r16c-agilis3-x1.webp",
  offroad: "/images/products-tread/1011137-265-65r17-112t-terra-xplorer-c2-a-t-terra-xplorer-c2-a-t-x1.webp",
};

const CUBIERTA = {
  calle: "/images/products/arivo-premio-arzero-205-55-r16.webp",
  at: "/images/products-extra/grenlander-maga-a-t-two-1.webp",
};

const L = {
  todos: { label: "Ver todos los neumáticos", href: "/neumaticos" },
  ofertas: { label: "Ofertas", href: "/ofertas" },
  at: { label: "Neumáticos A/T", href: "/neumaticos/at" },
  ht: { label: "Neumáticos H/T", href: "/neumaticos/ht" },
  carga: { label: "Neumáticos de carga", href: "/neumaticos/carga" },
  r13: { label: "Rodado 13", href: "/neumaticos/rodado-13" },
  r14: { label: "Rodado 14", href: "/neumaticos/rodado-14" },
  r15: { label: "Rodado 15", href: "/neumaticos/rodado-15" },
  r16: { label: "Rodado 16", href: "/neumaticos/rodado-16" },
  r17: { label: "Rodado 17", href: "/neumaticos/rodado-17" },
  marcas: { label: "Todas las marcas", href: "/marcas" },
  grenlander: { label: "Grenlander", href: "/marcas/grenlander" },
  pirelli: { label: "Pirelli", href: "/marcas/pirelli" },
  michelin: { label: "Michelin", href: "/marcas/michelin" },
  servicios: { label: "Alineación y balanceo", href: "/servicios" },
  equivalencias: { label: "Calculadora de equivalencias", href: "/calculadora-equivalencia-neumaticos" },
  indice: { label: "Tabla de índice de carga y velocidad", href: "/indice-carga-velocidad" },
  m205: { label: "205/55 R16", href: "/neumaticos/205-55-r16" },
  m185: { label: "185/65 R15", href: "/neumaticos/185-65-r15" },
  m175: { label: "175/65 R14", href: "/neumaticos/175-65-r14" },
  m265: { label: "265/65 R17", href: "/neumaticos/265-65-r17" },
  tuercas: { label: "Tuercas antirrobo", href: "/tuercas-antirrobo" },
} satisfies Record<string, ShopLink>;

export const BLOG_META: Record<string, BlogMeta> = {
  "neumaticos-para-utilitarios-furgones-reparto": {
    cover: { src: TALLER.montaje, alt: "Montaje de una cubierta de carga Zmax en un taller", position: "center 40%" },
    figure: { src: BANDA.calleEco, alt: "Banda de rodamiento de un neumático de carga", caption: "La banda de un neumático de carga: pensada para kilómetros y peso, no para estética." },
    shopIntro: "Cubiertas para furgones, utilitarios y reparto:",
    shopLinks: [L.carga, L.ofertas, L.todos],
  },
  "neumatico-c-o-de-auto-utilitario": {
    cover: { src: TALLER.montaje, alt: "Neumático de carga con etiqueta Zmax montado en la desmontadora", position: "center 55%" },
    figure: { src: BANDA.calleEco, alt: "Detalle de la banda de un neumático C", caption: "Un neumático C lleva carcasa reforzada: por eso soporta más peso y más presión." },
    shopIntro: "Mirá las cubiertas C disponibles:",
    shopLinks: [L.carga, L.todos, L.indice],
  },
  "presion-neumaticos-utilitarios-con-carga": {
    cover: { src: TALLER.alineacion, alt: "Utilitario blanco elevado en el taller de Neumáticos Trivium", position: "center 30%" },
    figure: { src: BANDA.calleEco, alt: "Banda de rodamiento con desgaste parejo", caption: "Con la presión correcta el desgaste de la banda es parejo de lado a lado." },
    shopIntro: "Si ya toca cambiarlas, estas son las cubiertas para trabajo:",
    shopLinks: [L.carga, L.servicios, L.todos],
  },
  "comprar-neumaticos-en-cordoba": {
    cover: { src: TALLER.local, alt: "Frente del local de Neumáticos Trivium en Córdoba", position: "center 45%" },
    figure: { src: TALLER.balanceo, alt: "Técnico de Trivium balanceando una rueda con la balanceadora", caption: "El taller del local alinea y balancea." },
    shopIntro: "Elegí por medida o por categoría:",
    shopLinks: [L.todos, L.ofertas, L.marcas, L.servicios],
  },
  "gomeria-en-cordoba": {
    cover: { src: TALLER.local, alt: "Gomería Trivium: frente del taller con autos en elevadores", position: "center 55%" },
    figure: { src: TALLER.montaje, alt: "Montaje de una cubierta nueva en la desmontadora", caption: "Montaje con desmontadora en el taller de Trivium." },
    shopIntro: "Comprá las cubiertas y colocalas en el local:",
    shopLinks: [L.todos, L.servicios, L.ofertas],
  },
  "neumaticos-sierras-de-cordoba": {
    cover: { src: CUBIERTA.at, alt: "Neumático A/T Grenlander Maga A/T Two", fit: "contain" },
    figure: { src: BANDA.offroad, alt: "Tacos de un neumático A/T de uso mixto", caption: "Los tacos abiertos de un A/T evacuan barro y piedra suelta en caminos de sierra." },
    shopIntro: "Para ripio, sierra y ruta:",
    shopLinks: [L.at, L.ht, L.m265],
  },
  "opiniones-linglong-mileking-sumaxx": {
    cover: { src: CUBIERTA.calle, alt: "Neumático de calle de una marca de importación directa", fit: "contain" },
    figure: { src: BANDA.calle, alt: "Banda de rodamiento de un neumático de calle", caption: "Lo que importa se ve en la banda: dibujo, canales y goma." },
    shopIntro: "Mirá los modelos y precios de estas marcas:",
    shopLinks: [L.marcas, L.ofertas, L.todos],
  },
  "ruido-neumaticos": {
    cover: { src: CUBIERTA.calle, alt: "Neumático de calle con dibujo asimétrico", fit: "contain" },
    figure: { src: BANDA.calle, alt: "Canales y laminillas de un neumático silencioso", caption: "Canales y laminillas: de ahí sale buena parte del ruido de rodadura." },
    shopIntro: "Cubiertas de calle, por rodado:",
    shopLinks: [L.r14, L.r15, L.r16, L.todos],
  },
  "verano-vs-allseason": {
    cover: { src: CUBIERTA.at, alt: "Neumático all-season Grenlander", fit: "contain" },
    figure: { src: BANDA.calle, alt: "Banda de rodamiento de un neumático de verano", caption: "Verano o all-season: cambia la goma y el dibujo, no la medida." },
    shopIntro: "Elegí por rodado o mirá todo el catálogo:",
    shopLinks: [L.r15, L.r16, L.r17, L.todos],
  },
  "precio-calidad-neumaticos-costo-por-km": {
    cover: { src: BANDA.calle, alt: "Primer plano de la banda de rodamiento de un neumático" },
    figure: { src: CUBIERTA.calle, alt: "Neumático nuevo de importación directa", fit: "contain", caption: "El precio de lista no es el costo real: cuenta cuántos kilómetros rinde." },
    shopIntro: "Compará precios en tu medida:",
    shopLinks: [L.ofertas, L.todos, L.marcas],
  },
  "utqg-desgaste-traccion-temperatura": {
    cover: { src: BANDA.calle, alt: "Banda de rodamiento de un neumático, donde se mide el UTQG" },
    figure: { src: BANDA.offroad, alt: "Tacos de un neumático de uso mixto", caption: "El UTQG califica desgaste, tracción y temperatura sobre la banda." },
    shopIntro: "Buscá cubiertas por tipo de uso:",
    shopLinks: [L.todos, L.ht, L.at],
  },
  "geoliner-630-geodyna-7800p-alineacion-balanceo": {
    cover: { src: TALLER.geoliner, alt: "Alineadora Geoliner 630 en el taller de Trivium" },
    figure: { src: TALLER.geodyna, alt: "Balanceadora Geodyna 7800P en el taller de Trivium", caption: "La Geodyna 7800P balancea la rueda con la cubierta ya montada." },
    shopIntro: "Con cubiertas nuevas, alineá y balanceá en el mismo turno:",
    shopLinks: [L.servicios, L.todos, L.ofertas],
  },
  "carga-simple-y-dual-neumaticos-c": {
    cover: { src: BANDA.calleEco, alt: "Banda de rodamiento de un neumático de carga C" },
    figure: { src: TALLER.montaje, alt: "Cubierta de carga montada con etiqueta de índice de carga", caption: "El 90/88 está en el flanco, junto a la medida." },
    shopIntro: "Cubiertas C por medida:",
    shopLinks: [L.carga, L.indice, L.todos],
  },
  "medidas-flotation-camionetas": {
    cover: { src: CUBIERTA.at, alt: "Neumático de camioneta A/T en medida alta", fit: "contain" },
    figure: { src: BANDA.offroad, alt: "Tacos grandes de un neumático para camioneta", caption: "En camioneta, la medida flotation se traduce a métrico para encontrar la equivalente." },
    shopIntro: "Cubiertas para camioneta:",
    shopLinks: [L.at, L.m265, L.equivalencias],
  },
  "cada-cuantos-km-cambiar-neumaticos": {
    cover: { src: BANDA.calle, alt: "Banda de rodamiento con los canales visibles" },
    figure: { src: TALLER.alineacion, alt: "Revisión del tren delantero en el taller", caption: "Un tren delantero desalineado gasta la banda antes de tiempo." },
    shopIntro: "¿Ya te toca? Buscá tu medida:",
    shopLinks: [L.todos, L.ofertas, L.servicios],
  },
  "precio-neumaticos-argentina": {
    cover: { src: CUBIERTA.calle, alt: "Neumático nuevo de importación directa", fit: "contain" },
    figure: { src: TALLER.local, alt: "Local de Neumáticos Trivium", caption: "El local de Neumáticos Trivium, en Córdoba." },
    shopIntro: "Precios por rodado:",
    shopLinks: [L.r13, L.r14, L.r15, L.r16, L.ofertas],
  },
  "presion-de-neumaticos": {
    cover: { src: TALLER.balanceo, alt: "Rueda en la balanceadora del taller de Trivium", position: "center 45%" },
    figure: { src: BANDA.calle, alt: "Banda con desgaste parejo gracias a la presión correcta", caption: "La presión correcta mantiene toda la banda apoyada en el piso." },
    shopIntro: "Si el desgaste ya está al límite:",
    shopLinks: [L.todos, L.ofertas, L.servicios],
  },
  "alineacion-y-balanceo": {
    cover: { src: TALLER.alineacion, alt: "Técnico de Trivium alineando un utilitario sobre el elevador", position: "center 35%" },
    figure: { src: TALLER.balanceo, alt: "Rueda en la balanceadora", caption: "Balanceo: se compensa el peso de la rueda para que no vibre." },
    shopIntro: "Estrená cubiertas y alineá en el mismo turno:",
    shopLinks: [L.servicios, L.todos, L.ofertas],
  },
  "indice-de-carga-y-velocidad": {
    cover: { src: CUBIERTA.calle, alt: "Flanco de un neumático donde se lee el índice de carga y velocidad", fit: "contain" },
    figure: { src: TALLER.montaje, alt: "Neumático con etiqueta que muestra índice de carga", caption: "El índice de carga y la letra de velocidad van después de la medida." },
    shopIntro: "Buscá por medida e índice:",
    shopLinks: [L.todos, L.indice, L.carga],
  },
  "como-leer-medida-neumatico": {
    cover: { src: CUBIERTA.calle, alt: "Neumático de calle con el flanco visible", fit: "contain" },
    figure: { src: TALLER.montaje, alt: "Flanco de un neumático con la medida impresa", caption: "La medida está impresa en el flanco: ancho, perfil y rodado." },
    shopIntro: "Con tu medida a mano:",
    shopLinks: [L.m175, L.m185, L.m205, L.todos],
  },
  equivalencias: {
    cover: { src: CUBIERTA.calle, alt: "Neumático de calle", fit: "contain" },
    figure: { src: TALLER.montaje, alt: "Cubierta montada en llanta", caption: "Una equivalente cambia hasta ±3% de diámetro, no la forma de la rueda." },
    shopIntro: "Probá tu medida en la calculadora o mirá el catálogo:",
    shopLinks: [L.equivalencias, L.todos, L.ofertas],
  },
  grenlander: {
    cover: { src: CUBIERTA.at, alt: "Neumático Grenlander Maga A/T Two", fit: "contain" },
    figure: { src: BANDA.offroad, alt: "Banda de un neumático de camioneta", caption: "Grenlander: del segmento urbano al A/T de camioneta." },
    shopIntro: "Mirá toda la línea Grenlander en stock:",
    shopLinks: [L.grenlander, L.at, L.todos],
  },
  "marcas-chinas-neumaticos-comparativa": {
    cover: { src: CUBIERTA.calle, alt: "Neumático de marca de importación", fit: "contain" },
    figure: { src: BANDA.calle, alt: "Banda de rodamiento de un neumático de calle", caption: "La diferencia entre marcas se ve en la banda y se mide en kilómetros." },
    shopIntro: "Mirá las marcas que vendemos:",
    shopLinks: [L.marcas, L.grenlander, L.ofertas],
  },
  "etiqueta-europea-neumaticos": {
    cover: { src: TALLER.montaje, alt: "Neumático nuevo con la etiqueta europea en la banda", position: "center 70%" },
    figure: { src: BANDA.calle, alt: "Banda de rodamiento de un neumático de calle", caption: "La etiqueta clasifica consumo, agarre en mojado y ruido." },
    shopIntro: "Elegí cubiertas según su etiqueta:",
    shopLinks: [L.todos, L.ofertas, L.marcas],
  },
};

/** Respaldo para una nota nueva que todavía no está cargada arriba. */
export const DEFAULT_BLOG_META: BlogMeta = {
  cover: { src: TALLER.local, alt: "Frente del local de Neumáticos Trivium", position: "center 45%" },
  figure: { src: TALLER.montaje, alt: "Montaje de un neumático en el taller", caption: "Colocación en el taller del local." },
  shopIntro: "Buscá tu medida o mirá el catálogo:",
  shopLinks: [L.todos, L.ofertas, L.servicios],
};

export function blogMeta(slug: string): BlogMeta {
  return BLOG_META[slug] ?? DEFAULT_BLOG_META;
}
