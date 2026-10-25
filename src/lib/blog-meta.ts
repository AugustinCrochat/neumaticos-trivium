import { siteShare } from "./share-image";

/**
 * Imágenes y atajos de compra de cada nota del blog.
 *
 * Todas las fotos son del local y el taller de Trivium (archivos propios del
 * repo); no hay stock fotográfico ni imágenes que dependan de que un producto
 * esté cargado en el POS.
 *
 * Los links apuntan sólo a rutas que existen y no dependen del stock de hoy
 * (categorías, rodados y marcas), así que una nota vieja no manda a un 404.
 */

export type BlogImage = {
  src: string;
  alt: string;
  /** Foto vertical: en la nota se muestra angosta y centrada en vez de recortada. */
  portrait?: boolean;
  fit?: "cover" | "contain";
  /** Portada en cuadro 4:3 en vez de apaisado, para fotos verticales donde importa ver más alto. */
  tall?: boolean;
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

const LOCAL = "/images/local";
const IMG = {
  // Fotos del taller y el local (ver public/images/local y public/images/servicios).
  alineacion: "/images/servicios/alineacion.webp",
  balanceo: "/images/servicios/balanceo.webp",
  montaje: "/images/servicios/arme-desarme.webp",
  local: "/images/branches/arguello-fachada.webp",
  geoliner: "/images/blog/geoliner-630-alineadora-trivium.webp",
  geodyna: "/images/blog/geodyna-7800p-balanceadora-trivium.webp",
  fachada: `${LOCAL}/fachada-local-neumaticos-trivium-cordoba.webp`,
  camionetas: `${LOCAL}/camionetas-en-elevador-taller-neumaticos-trivium-cordoba.webp`,
  taxi: `${LOCAL}/taxi-en-el-taller-neumaticos-trivium-cordoba.webp`,
  geoliner630: `${LOCAL}/alineadora-geoliner-630-taller-neumaticos-trivium-cordoba.webp`,
  grenlanderPerfilBajo: `${LOCAL}/cubierta-perfil-bajo-grenlander-colocada-neumaticos-trivium.webp`,
  pickup4x4: `${LOCAL}/pickup-4x4-en-elevador-alineacion-neumaticos-trivium-cordoba.webp`,
  tecnicosAlineando: `${LOCAL}/tecnicos-alineando-auto-elevador-gomeria-trivium-cordoba.webp`,
  rotacion: `${LOCAL}/rotacion-de-neumaticos-pirelli-rueda-desmontada-trivium.webp`,
  utilitario: `${LOCAL}/balanceadora-y-alineadora-utilitario-taller-trivium-cordoba.webp`,
  atClasica: `${LOCAL}/neumatico-at-grenlander-maga-at-two-camioneta-clasica-trivium.webp`,
  balanceando: `${LOCAL}/tecnico-balanceando-rueda-balanceadora-trivium-cordoba.webp`,
  target: `${LOCAL}/target-alineadora-rueda-auto-elevador-trivium-cordoba.webp`,
  kingpro: `${LOCAL}/neumatico-grenlander-kingpro-one-pickup-trivium.webp`,
  alineadora3d: `${LOCAL}/alineadora-3d-hofmann-geoliner-630-con-target-en-la-rueda-trivium-cordoba.webp`,
  antirrobo: `${LOCAL}/tuerca-antirrobo-de-seguridad-en-llanta-de-aleacion-trivium-cordoba.webp`,
  balanceandoCamioneta: `${LOCAL}/balanceadora-hofmann-geodyna-7800p-balanceando-rueda-de-camioneta-trivium-cordoba.webp`,
  cambioCamioneta: `${LOCAL}/cambio-de-cubiertas-en-camioneta-pickup-con-balanceadora-hofmann-trivium-cordoba.webp`,
  colocandoTarget: `${LOCAL}/tecnico-colocando-target-de-alineacion-3d-en-auto-trivium-cordoba.webp`,
  tallerCuatroAutos: `${LOCAL}/taller-de-gomeria-con-cuatro-autos-neumaticos-trivium-arguello-cordoba.webp`,
  remis: `${LOCAL}/remis-cambio-de-cuatro-neumaticos-con-alineacion-y-balanceo-trivium-cordoba.webp`,
  autoRojoTarget: `${LOCAL}/alineacion-3d-de-auto-rojo-target-en-la-rueda-trivium-cordoba.webp`,
};

const L = {
  todos: { label: "Catálogo", href: "/catalogo" },
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
  remises: { label: "Neumáticos para remises, taxis y Uber", href: "/neumaticos-para-remises-taxis-y-uber" },
  equivalencias: { label: "Calculadora de equivalencias", href: "/calculadora-equivalencia-neumaticos" },
  indice: { label: "Tabla de índice de carga y velocidad", href: "/herramientas/indice-carga-velocidad" },
  m205: { label: "205/55 R16", href: "/neumaticos/205-55-r16" },
  m185: { label: "185/65 R15", href: "/neumaticos/185-65-r15" },
  m175: { label: "175/65 R14", href: "/neumaticos/175-65-r14" },
  m265: { label: "265/65 R17", href: "/neumaticos/265-65-r17" },
  tuercas: { label: "Tuercas antirrobo", href: "/tuercas-antirrobo" },
} satisfies Record<string, ShopLink>;

export const BLOG_META: Record<string, BlogMeta> = {
  "reparacion-de-pinchaduras-parche-mecha": {
    cover: { src: IMG.taxi, alt: "Taxi en el taller de Neumáticos Trivium durante el cambio de cubiertas" },
    figure: { src: IMG.rotacion, alt: "Rueda Pirelli desmontada de un auto en el taller", caption: "Con la rueda afuera se revisa la cubierta por dentro antes de reparar." },
    shopIntro: "Si la cubierta no se puede reparar, mirá las medidas:",
    shopLinks: [L.todos, L.ofertas, L.servicios],
  },
  "arme-y-desarme-de-neumaticos": {
    cover: { src: IMG.montaje, alt: "Cubierta montada en la desmontadora del taller", position: "center 55%" },
    figure: { src: IMG.cambioCamioneta, alt: "Cambio de cubiertas de una camioneta en el taller de Neumáticos Trivium, con la balanceadora Hofmann al lado", caption: "Cambio de cubiertas de una camioneta: se desarma, se arma y se balancea en el mismo taller." },
    shopIntro: "Comprá las cubiertas y colocalas en el local:",
    shopLinks: [L.todos, L.servicios, L.ofertas],
  },
  "tuercas-y-bulones-de-seguridad": {
    cover: { src: IMG.antirrobo, alt: "Llanta de aleación con una tuerca de seguridad entre las cuatro tuercas comunes", tall: true, position: "center 45%" },
    figure: { src: IMG.rotacion, alt: "Rueda desmontada durante una rotación", caption: "La rueda se desmonta con la llave de la tuerca de seguridad." },
    shopIntro: "Mirá el juego que corresponde a tu auto:",
    shopLinks: [L.tuercas, L.todos, L.servicios],
  },
  "extraccion-de-tuercas-de-seguridad": {
    cover: { src: IMG.grenlanderPerfilBajo, alt: "Llanta de aleación con cubierta colocada" },
    figure: { src: IMG.antirrobo, alt: "Tuerca antirrobo colocada en una llanta de aleación", portrait: true, caption: "La tuerca de seguridad se distingue de las comunes por su forma y necesita su llave." },
    shopIntro: "Si necesitás un juego nuevo:",
    shopLinks: [L.tuercas, L.servicios, L.todos],
  },
  "esparrago-de-maza-roto-reparacion-de-rosca": {
    cover: { src: IMG.rotacion, alt: "Rueda desmontada en el taller de Neumáticos Trivium" },
    figure: { src: IMG.camionetas, alt: "Camionetas sobre los elevadores del taller", caption: "Con la rueda afuera se revisan los espárragos y las roscas." },
    shopIntro: "Servicios y neumáticos:",
    shopLinks: [L.servicios, L.tuercas, L.todos],
  },
  "neumaticos-japoneses-europeos-americanos-y-chinos-origen-de-las-marcas": {
    cover: { src: IMG.fachada, alt: "Frente del local de Neumáticos Trivium en Córdoba", position: "center 45%" },
    figure: { src: IMG.tallerCuatroAutos, alt: "Interior del taller de Neumáticos Trivium en Argüello con cuatro autos en servicio", caption: "Un neumático se elige por sus datos, no solo por el país de la marca." },
    shopIntro: "Mirá las marcas que tenemos:",
    shopLinks: [L.marcas, L.todos, L.ofertas],
  },
  "que-incluye-el-presupuesto-de-neumaticos": {
    cover: { src: IMG.fachada, alt: "Frente del local de Neumáticos Trivium en Córdoba", position: "center 45%" },
    figure: { src: IMG.cambioCamioneta, alt: "Cambio de cubiertas de una camioneta en el taller de Neumáticos Trivium, con la balanceadora Hofmann al lado", caption: "Colocación, válvulas y balanceo: lo que tiene que figurar en un presupuesto." },
    shopIntro: "Mirá los precios publicados:",
    shopLinks: [L.todos, L.ofertas, L.servicios],
  },
  "nitrogeno-en-neumaticos-vale-la-pena": {
    cover: { src: IMG.cambioCamioneta, alt: "Cambio de cubiertas de una camioneta en el taller de Neumáticos Trivium, con la balanceadora Hofmann al lado" },
    figure: { src: IMG.grenlanderPerfilBajo, alt: "Cubierta de perfil bajo recién colocada en una llanta", caption: "Con aire o con nitrógeno, la presión se controla todos los meses." },
    shopIntro: "Cuidá tus cubiertas:",
    shopLinks: [L.servicios, L.todos, L.ofertas],
  },
  "como-comparar-neumaticos-antes-de-comprar": {
    cover: { src: IMG.tallerCuatroAutos, alt: "Interior del taller de Neumáticos Trivium en Argüello con cuatro autos en servicio", tall: true },
    figure: { src: IMG.montaje, alt: "Cubierta montada en la desmontadora del taller", caption: "Con la misma medida y los mismos índices, la comparación es justa." },
    shopIntro: "Mirá las medidas y comparalas:",
    shopLinks: [L.todos, L.equivalencias, L.ofertas],
  },
  "cambio-de-valvulas-de-neumaticos": {
    cover: { src: IMG.montaje, alt: "Cubierta montada en la desmontadora del taller", position: "center 55%" },
    figure: { src: IMG.balanceandoCamioneta, alt: "Técnico balanceando una rueda de camioneta en la balanceadora Hofmann del taller", portrait: true, caption: "Con la cubierta nueva y la válvula nueva, la rueda se balancea antes de volver al auto." },
    shopIntro: "Comprá las cubiertas y colocalas en el local:",
    shopLinks: [L.todos, L.servicios, L.ofertas],
  },
  "neumaticos-para-uber-didi-cabify": {
    cover: { src: IMG.remis, alt: "Remis sobre el elevador del taller de Neumáticos Trivium durante el cambio de las cuatro cubiertas", tall: true, position: "center 55%" },
    figure: { src: IMG.tallerCuatroAutos, alt: "Interior del taller de Neumáticos Trivium en Argüello con cuatro autos en servicio", caption: "Colocación, balanceo y alineación en el mismo taller de Argüello." },
    shopIntro: "Para quien trabaja con el auto:",
    shopLinks: [L.remises, L.r14, L.r15],
  },
  "como-hacer-durar-los-neumaticos-de-taxis-y-remises": {
    cover: { src: IMG.autoRojoTarget, alt: "Auto sobre el elevador con el target de la alineadora 3D colocado en la rueda", tall: true, position: "center 50%" },
    figure: { src: IMG.alineadora3d, alt: "Alineadora 3D Hofmann Geoliner 630 del taller, con el monitor y el travesaño con las cámaras", caption: "La alineación 3D es lo que más kilómetros le devuelve a un juego en un auto de trabajo." },
    shopIntro: "Cuando llega el momento de cambiarlas:",
    shopLinks: [L.remises, L.servicios, L.todos],
  },
  "maquinas-hofmann-y-elevadores-rotary-lift-gomeria": {
    cover: { src: IMG.alineadora3d, alt: "Alineadora 3D Hofmann Geoliner 630 del taller de Neumáticos Trivium, con el monitor, el travesaño con las cámaras y el target en la rueda" },
    figure: { src: IMG.balanceandoCamioneta, alt: "Técnico balanceando una rueda de camioneta en la balanceadora Hofmann Geodyna 7800P del taller", portrait: true, caption: "La Geodyna 7800P del taller balanceando una rueda de camioneta antes de volver a montarla." },
    shopIntro: "Nuestros servicios de gomería:",
    shopLinks: [L.servicios, L.todos, L.ofertas],
  },
  "gomeria-en-san-justo-buenos-aires": {
    cover: { src: IMG.fachada, alt: "Fachada del local de Neumáticos Trivium" },
    figure: { src: IMG.tallerCuatroAutos, alt: "Interior del taller de Neumáticos Trivium en Argüello con cuatro autos en servicio", caption: "Así trabaja la gomería de Argüello; San Justo abre en diciembre." },
    shopIntro: "Mirá el stock mientras abrimos:",
    shopLinks: [L.todos, L.ofertas, L.servicios],
  },
  "neumaticos-para-utilitarios-furgones-reparto": {
    cover: { src: IMG.camionetas, alt: "Dos camionetas en el taller de Neumáticos Trivium, una sobre el elevador" },
    figure: { src: IMG.utilitario, alt: "Utilitario sobre el elevador de alineación, con la balanceadora en primer plano", portrait: true, caption: "Un utilitario en el elevador: la alineación y el balanceo cuidan las cubiertas de trabajo." },
    shopIntro: "Cubiertas para furgones, utilitarios y reparto:",
    shopLinks: [L.carga, L.ofertas, L.todos],
  },
  "neumatico-c-o-de-auto-utilitario": {
    cover: { src: IMG.montaje, alt: "Cubierta de carga Zmax montada en la desmontadora", position: "center 55%" },
    figure: { src: IMG.alineacion, alt: "Utilitario blanco elevado en el taller de Neumáticos Trivium", caption: "Un utilitario en el taller de Trivium: la medida es la misma, la cubierta no." },
    shopIntro: "Mirá las cubiertas C disponibles:",
    shopLinks: [L.carga, L.todos, L.indice],
  },
  "presion-neumaticos-utilitarios-con-carga": {
    cover: { src: IMG.alineacion, alt: "Utilitario blanco elevado en el taller de Neumáticos Trivium", position: "center 30%" },
    figure: { src: IMG.camionetas, alt: "Dos camionetas en el taller de Neumáticos Trivium, una sobre el elevador", caption: "Con carga o sin ella, la presión se revisa antes de salir." },
    shopIntro: "Si ya toca cambiarlas, estas son las cubiertas para trabajo:",
    shopLinks: [L.carga, L.servicios, L.todos],
  },
  "comprar-neumaticos-en-cordoba": {
    cover: { src: IMG.fachada, alt: "Frente del local de Neumáticos Trivium en Córdoba", position: "center 45%" },
    figure: { src: IMG.taxi, alt: "Taxi dentro del taller de Neumáticos Trivium", caption: "Un taxi en el taller: la cubierta se compra y se coloca en el mismo lugar." },
    shopIntro: "Elegí por medida o por categoría:",
    shopLinks: [L.todos, L.ofertas, L.marcas, L.servicios],
  },
  "gomeria-en-cordoba": {
    cover: { src: IMG.tallerCuatroAutos, alt: "Interior del taller de gomería de Neumáticos Trivium en Argüello, Córdoba, con cuatro autos en servicio", position: "center 60%" },
    figure: { src: IMG.balanceando, alt: "Técnico de Trivium balanceando una rueda", portrait: true, caption: "Balanceo de una rueda con la balanceadora del taller." },
    shopIntro: "Comprá las cubiertas y colocalas en el local:",
    shopLinks: [L.todos, L.servicios, L.ofertas],
  },
  "neumaticos-sierras-de-cordoba": {
    cover: { src: IMG.atClasica, alt: "Técnico colocando un Grenlander Maga A/T Two en una pickup Ford clásica", portrait: true, position: "center 70%" },
    figure: { src: IMG.pickup4x4, alt: "Pickup 4x4 sobre el elevador de alineación con el sensor colocado", portrait: true, caption: "Una pickup 4x4 en el elevador: antes de la sierra conviene alinear." },
    shopIntro: "Para ripio, sierra y ruta:",
    shopLinks: [L.at, L.ht, L.m265],
  },
  "opiniones-linglong-mileking-sumaxx": {
    cover: { src: IMG.montaje, alt: "Cubierta de carga Zmax montada en la desmontadora", position: "center 55%" },
    figure: { src: IMG.grenlanderPerfilBajo, alt: "Cubierta Grenlander de perfil bajo recién colocada en un auto rojo", portrait: true, caption: "Una cubierta de importación recién colocada en el taller." },
    shopIntro: "Las que sí tenemos en stock, con precio publicado:",
    shopLinks: [L.grenlander, L.todos, L.ofertas],
  },
  "ruido-neumaticos": {
    cover: { src: IMG.rotacion, alt: "Auto con una rueda desmontada y la cubierta Pirelli al lado, durante una rotación", portrait: true, position: "center 55%" },
    figure: { src: IMG.grenlanderPerfilBajo, alt: "Cubierta Grenlander de perfil bajo recién colocada en un auto rojo", portrait: true, caption: "Perfil bajo: más agarre, y también más ruido de rodadura." },
    shopIntro: "Cubiertas de calle, por rodado:",
    shopLinks: [L.r14, L.r15, L.r16, L.todos],
  },
  "verano-vs-allseason": {
    cover: { src: IMG.grenlanderPerfilBajo, alt: "Cubierta Grenlander de perfil bajo recién colocada en un auto rojo", portrait: true, position: "center 60%" },
    figure: { src: IMG.atClasica, alt: "Técnico colocando un Grenlander Maga A/T Two en una pickup Ford clásica", portrait: true, caption: "Un all-terrain montado en una pickup clásica." },
    shopIntro: "Elegí por rodado o mirá todo el catálogo:",
    shopLinks: [L.r15, L.r16, L.r17, L.todos],
  },
  "precio-calidad-neumaticos-costo-por-km": {
    cover: { src: IMG.kingpro, alt: "Cubierta Grenlander Kingpro One apoyada junto a una pickup sin la rueda", portrait: true, position: "center 60%" },
    figure: { src: IMG.remis, alt: "Remis en el taller de Neumáticos Trivium durante el cambio de cubiertas", portrait: true, caption: "Un remis hace muchísimos kilómetros por año: ahí se ve el costo por km." },
    shopIntro: "Compará precios en tu medida:",
    shopLinks: [L.ofertas, L.todos, L.marcas],
  },
  "neumaticos-double-king-quien-los-fabrica": {
    cover: { src: IMG.grenlanderPerfilBajo, alt: "Cubierta Grenlander de perfil bajo recién colocada en un auto rojo", portrait: true, position: "center 60%" },
    figure: { src: IMG.kingpro, alt: "Cubierta Grenlander Kingpro One apoyada junto a una pickup sin la rueda", portrait: true, caption: "Grenlander Kingpro One, una de las alternativas que tenemos en stock." },
    shopIntro: "Las que sí tenemos en stock, con precio publicado:",
    shopLinks: [L.grenlander, L.todos, L.ofertas],
  },
  "utqg-desgaste-traccion-temperatura": {
    cover: { src: IMG.rotacion, alt: "Auto con una rueda desmontada y la cubierta Pirelli al lado, durante una rotación", portrait: true, position: "center 55%" },
    figure: { src: IMG.kingpro, alt: "Cubierta Grenlander Kingpro One apoyada junto a una pickup sin la rueda", portrait: true, caption: "El UTQG califica el desgaste, la tracción y la temperatura de la banda." },
    shopIntro: "Buscá cubiertas por tipo de uso:",
    shopLinks: [L.todos, L.ht, L.at],
  },
  "geoliner-630-geodyna-7800p-alineacion-balanceo": {
    cover: { src: IMG.geoliner, alt: "Alineadora Geoliner 630 en el taller de Trivium" },
    figure: { src: IMG.geodyna, alt: "Balanceadora Geodyna 7800P en el taller de Trivium", caption: "La Geodyna 7800P balancea la rueda en el taller de Trivium." },
    shopIntro: "Con cubiertas nuevas, alineá y balanceá en el mismo turno:",
    shopLinks: [L.servicios, L.todos, L.ofertas],
  },
  "carga-simple-y-dual-neumaticos-c": {
    cover: { src: IMG.montaje, alt: "Cubierta de carga Zmax montada en la desmontadora", position: "center 55%" },
    figure: { src: IMG.camionetas, alt: "Dos camionetas en el taller de Neumáticos Trivium, una sobre el elevador", caption: "El índice de carga se lee en el flanco, junto a la medida." },
    shopIntro: "Cubiertas C por medida:",
    shopLinks: [L.carga, L.indice, L.todos],
  },
  "medidas-flotation-camionetas": {
    cover: { src: IMG.pickup4x4, alt: "Pickup 4x4 sobre el elevador de alineación con el sensor colocado", portrait: true, position: "center 55%" },
    figure: { src: IMG.atClasica, alt: "Técnico colocando un Grenlander Maga A/T Two en una pickup Ford clásica", portrait: true, caption: "En camionetas, la medida flotation se pasa a métrico para encontrar la equivalente." },
    shopIntro: "Cubiertas para camioneta:",
    shopLinks: [L.at, L.m265, L.equivalencias],
  },
  "cada-cuantos-km-cambiar-neumaticos": {
    cover: { src: IMG.taxi, alt: "Taxi dentro del taller de Neumáticos Trivium", position: "center 40%" },
    figure: { src: IMG.rotacion, alt: "Auto con una rueda desmontada y la cubierta Pirelli al lado, durante una rotación", portrait: true, caption: "La rotación reparte el desgaste entre las cuatro ruedas." },
    shopIntro: "¿Ya te toca? Buscá tu medida:",
    shopLinks: [L.todos, L.ofertas, L.servicios],
  },
  "precio-neumaticos-argentina": {
    cover: { src: IMG.fachada, alt: "Frente del local de Neumáticos Trivium en Córdoba", position: "center 45%" },
    figure: { src: IMG.kingpro, alt: "Cubierta Grenlander Kingpro One apoyada junto a una pickup sin la rueda", portrait: true, caption: "Cubierta Grenlander Kingpro One, una de las opciones de entrada." },
    shopIntro: "Precios por rodado:",
    shopLinks: [L.r13, L.r14, L.r15, L.r16, L.ofertas],
  },
  "presion-de-neumaticos": {
    cover: { src: IMG.balanceo, alt: "Técnico de Trivium junto a la balanceadora con una rueda montada", position: "center 45%" },
    figure: { src: IMG.rotacion, alt: "Auto con una rueda desmontada y la cubierta Pirelli al lado, durante una rotación", portrait: true, caption: "Con la rueda afuera es el mejor momento para revisar presión y estado." },
    shopIntro: "Si el desgaste ya está al límite:",
    shopLinks: [L.todos, L.ofertas, L.servicios],
  },
  "alineacion-y-balanceo": {
    cover: { src: IMG.tecnicosAlineando, alt: "Dos técnicos de Trivium trabajando bajo un auto en el elevador", portrait: true, position: "center 40%" },
    figure: { src: IMG.colocandoTarget, alt: "Técnico colocando el target de la alineadora 3D en la rueda de un auto", portrait: true, caption: "El técnico coloca el target en la rueda: las cámaras de la alineadora lo leen y miden los ángulos del tren delantero." },
    shopIntro: "Estrená cubiertas y alineá en el mismo turno:",
    shopLinks: [L.servicios, L.todos, L.ofertas],
  },
  "indice-de-carga-y-velocidad": {
    cover: { src: IMG.kingpro, alt: "Cubierta Grenlander Kingpro One apoyada junto a una pickup sin la rueda", portrait: true, position: "center 55%" },
    figure: { src: IMG.montaje, alt: "Cubierta de carga Zmax montada en la desmontadora", caption: "El índice de carga y la letra de velocidad van después de la medida." },
    shopIntro: "Buscá por medida e índice:",
    shopLinks: [L.todos, L.indice, L.carga],
  },
  "como-leer-medida-neumatico": {
    cover: { src: IMG.grenlanderPerfilBajo, alt: "Cubierta Grenlander de perfil bajo recién colocada en un auto rojo", portrait: true, position: "center 60%" },
    figure: { src: IMG.kingpro, alt: "Cubierta Grenlander Kingpro One apoyada junto a una pickup sin la rueda", portrait: true, caption: "La medida está impresa en el flanco: ancho, perfil y rodado." },
    shopIntro: "Con tu medida a mano:",
    shopLinks: [L.m175, L.m185, L.m205, L.todos],
  },
  equivalencias: {
    cover: { src: IMG.rotacion, alt: "Auto con una rueda desmontada y la cubierta Pirelli al lado, durante una rotación", portrait: true, position: "center 55%" },
    figure: { src: IMG.grenlanderPerfilBajo, alt: "Cubierta Grenlander de perfil bajo recién colocada en un auto rojo", portrait: true, caption: "Una equivalente cambia hasta ±3% de diámetro, no la forma de la rueda." },
    shopIntro: "Probá tu medida en la calculadora o mirá el catálogo:",
    shopLinks: [L.equivalencias, L.todos, L.ofertas],
  },
  grenlander: {
    cover: { src: IMG.atClasica, alt: "Técnico colocando un Grenlander Maga A/T Two en una pickup Ford clásica", portrait: true, position: "center 70%" },
    figure: { src: IMG.kingpro, alt: "Cubierta Grenlander Kingpro One apoyada junto a una pickup sin la rueda", portrait: true, caption: "Grenlander Kingpro One, de la línea de calle." },
    shopIntro: "Mirá toda la línea Grenlander en stock:",
    shopLinks: [L.grenlander, L.at, L.todos],
  },
  "marcas-chinas-neumaticos-comparativa": {
    cover: { src: IMG.grenlanderPerfilBajo, alt: "Cubierta Grenlander de perfil bajo recién colocada en un auto rojo", portrait: true, position: "center 60%" },
    figure: { src: IMG.atClasica, alt: "Técnico colocando un Grenlander Maga A/T Two en una pickup Ford clásica", portrait: true, caption: "La diferencia entre marcas se ve en el uso y se mide en kilómetros." },
    shopIntro: "Probá Grenlander, nuestra marca de mayor confianza:",
    shopLinks: [L.grenlander, L.todos, L.ofertas],
  },
  "etiqueta-europea-neumaticos": {
    cover: { src: IMG.montaje, alt: "Cubierta de carga Zmax montada en la desmontadora", position: "center 70%" },
    figure: { src: IMG.rotacion, alt: "Auto con una rueda desmontada y la cubierta Pirelli al lado, durante una rotación", portrait: true, caption: "La etiqueta clasifica consumo, agarre en mojado y ruido." },
    shopIntro: "Elegí cubiertas según su etiqueta:",
    shopLinks: [L.todos, L.ofertas, L.marcas],
  },
  "rotacion-de-neumaticos": {
    cover: { src: IMG.rotacion, alt: "Auto con una rueda desmontada y la cubierta Pirelli al lado, durante una rotación", portrait: true, position: "center 55%" },
    figure: { src: IMG.balanceando, alt: "Técnico de Trivium balanceando una rueda", portrait: true, caption: "Después de rotar conviene balancear: la balanceadora del taller." },
    shopIntro: "Si al rotar viste desgaste de más:",
    shopLinks: [L.todos, L.servicios, L.ofertas],
  },
  "neumaticos-de-marca-vs-importados-cual-conviene": {
    cover: { src: IMG.rotacion, alt: "Auto con una rueda desmontada y la cubierta Pirelli al lado", portrait: true },
    figure: { src: IMG.kingpro, alt: "Cubierta Grenlander Kingpro One apoyada junto a una pickup", portrait: true, caption: "Una cubierta importada lista para colocar en el taller." },
    shopIntro: "Mirá marcas y alternativas en tu medida:",
    shopLinks: [L.todos, L.marcas, L.ofertas],
  },
  "son-malos-los-neumaticos-chinos": {
    cover: { src: IMG.fachada, alt: "Frente del local de Neumáticos Trivium" },
    figure: { src: IMG.grenlanderPerfilBajo, alt: "Cubierta Grenlander de perfil bajo ya colocada", caption: "Una Grenlander colocada: la homologación ECE R30 va grabada en el flanco." },
    shopIntro: "Cubiertas importadas con homologación:",
    shopLinks: [L.grenlander, L.todos, L.ofertas],
  },
  "cuanto-duran-los-neumaticos-economicos": {
    cover: { src: IMG.remis, alt: "Remis sobre el elevador del taller durante el cambio de las cuatro cubiertas", tall: true, position: "center 55%" },
    figure: { src: IMG.tecnicosAlineando, alt: "Técnicos alineando un auto sobre el elevador", caption: "La alineación y la presión cuidan la vida útil más que la marca." },
    shopIntro: "Compará precios en tu medida:",
    shopLinks: [L.ofertas, L.servicios, L.todos],
  },
  "neumaticos-economicos-para-uso-urbano": {
    cover: { src: IMG.remis, alt: "Remis sobre el elevador del taller durante el cambio de las cuatro cubiertas", tall: true, position: "center 55%" },
    figure: { src: IMG.montaje, alt: "Montaje de un neumático en el taller", caption: "Colocación y balanceo en el taller del local." },
    shopIntro: "Medidas más pedidas para ciudad:",
    shopLinks: [L.m175, L.m185, L.m205],
  },
  "diferencia-neumatico-caro-y-barato": {
    cover: { src: IMG.rotacion, alt: "Auto con una rueda desmontada y la cubierta Pirelli al lado", portrait: true },
    figure: { src: IMG.balanceando, alt: "Técnico de Trivium balanceando una rueda", portrait: true, caption: "El balanceo importa tanto como la marca." },
    shopIntro: "Compará marcas en tu medida:",
    shopLinks: [L.marcas, L.todos, L.ofertas],
  },
  "cuatro-economicos-o-dos-de-marca": {
    cover: { src: IMG.pickup4x4, alt: "Pickup 4x4 sobre el elevador del taller" },
    figure: { src: IMG.autoRojoTarget, alt: "Auto rojo sobre el elevador con el target de la alineadora 3D colocado en la rueda", portrait: true, caption: "Cuatro cubiertas iguales y alineadas: la base de un buen resultado." },
    shopIntro: "Armá el juego completo:",
    shopLinks: [L.todos, L.ofertas, L.servicios],
  },
  "como-elegir-neumatico-importado-seguro": {
    cover: { src: IMG.kingpro, alt: "Cubierta Grenlander Kingpro One junto a una pickup", portrait: true },
    figure: { src: IMG.rotacion, alt: "Rueda desmontada con la cubierta al lado", portrait: true, caption: "Antes de comprar, mirá el flanco: homologación y fecha DOT." },
    shopIntro: "Cubiertas con homologación verificable:",
    shopLinks: [L.grenlander, L.indice, L.todos],
  },
  "marca-o-importado-camioneta-at-carga": {
    cover: { src: IMG.pickup4x4, alt: "Pickup 4x4 sobre el elevador del taller" },
    figure: { src: IMG.atClasica, alt: "Camioneta clásica con neumáticos A/T Grenlander", caption: "Neumáticos A/T para uso mixto de ruta y tierra." },
    shopIntro: "Para camioneta, A/T y carga:",
    shopLinks: [L.at, L.carga, L.ht],
  },
  "alternativas-a-michelin-y-pirelli": {
    cover: { src: IMG.rotacion, alt: "Auto con una rueda desmontada y la cubierta Pirelli al lado", portrait: true },
    figure: { src: IMG.kingpro, alt: "Cubierta Grenlander Kingpro One junto a una pickup", portrait: true, caption: "Una alternativa importada junto a una pickup." },
    shopIntro: "Mirá las marcas disponibles:",
    shopLinks: [L.pirelli, L.michelin, L.marcas],
  },
  "at-o-ht-cual-conviene-para-tu-camioneta": {
    cover: { src: IMG.atClasica, alt: "Camioneta clásica con neumáticos A/T Grenlander Maga A/T Two" },
    figure: { src: IMG.pickup4x4, alt: "Pickup 4x4 sobre el elevador del taller de Neumáticos Trivium", caption: "Con la camioneta sobre el elevador se elige y se verifica la medida." },
    shopIntro: "Mirá las dos opciones:",
    shopLinks: [L.at, L.ht, L.carga],
  },
  "perfil-bajo-o-perfil-alto": {
    cover: { src: IMG.grenlanderPerfilBajo, alt: "Cubierta de perfil bajo recién colocada en una llanta" },
    figure: { src: IMG.balanceando, alt: "Técnico balanceando una rueda en la balanceadora del taller", caption: "Al cambiar de rodado la rueda nueva se balancea antes de volver al auto." },
    shopIntro: "Verificá la equivalencia y mirá las medidas:",
    shopLinks: [L.equivalencias, L.todos, L.indice],
  },
  "desgaste-irregular-de-neumaticos": {
    cover: { src: IMG.alineadora3d, alt: "Alineadora 3D Hofmann Geoliner 630 con target en la rueda" },
    figure: { src: IMG.rotacion, alt: "Rueda desmontada durante una rotación en el taller", caption: "Con la rueda afuera se ve mejor el patrón de desgaste." },
    shopIntro: "Corregí la causa y renová las cubiertas:",
    shopLinks: [L.servicios, L.todos, L.ofertas],
  },
  "antiguedad-del-neumatico-codigo-dot": {
    cover: { src: IMG.rotacion, alt: "Auto con una rueda desmontada y la cubierta Pirelli al lado" },
    figure: { src: IMG.montaje, alt: "Cubierta montada en la desmontadora del taller", caption: "Antes de montar una cubierta se controla su estado y su fecha de fabricación." },
    shopIntro: "Mirá las medidas disponibles:",
    shopLinks: [L.todos, L.ofertas, L.servicios],
  },
  "rueda-de-auxilio-como-revisarla": {
    cover: { src: IMG.cambioCamioneta, alt: "Cambio de cubiertas de una camioneta en el taller de Neumáticos Trivium" },
    figure: { src: IMG.camionetas, alt: "Camionetas sobre los elevadores del taller", caption: "Con la rueda afuera se controla también el auxilio." },
    shopIntro: "Si necesitás una llave o un juego nuevo:",
    shopLinks: [L.tuercas, L.servicios, L.todos],
  },
  "sintomas-alineacion-balanceo-o-rotacion": {
    cover: { src: IMG.colocandoTarget, alt: "Técnico colocando el target de alineación 3D en la rueda de un auto" },
    figure: { src: IMG.autoRojoTarget, alt: "Auto con el target de la alineadora 3D colocado en la rueda", caption: "La alineadora 3D mide los ángulos de cada rueda." },
    shopIntro: "Mirá los servicios del taller:",
    shopLinks: [L.servicios, L.todos, L.ofertas],
  },
  "como-preparar-el-cambio-de-neumaticos": {
    cover: { src: IMG.montaje, alt: "Cubierta montada en la desmontadora del taller" },
    figure: { src: IMG.utilitario, alt: "Balanceadora y alineadora junto a un utilitario en el taller", caption: "Colocación, válvulas y balanceo en el mismo taller." },
    shopIntro: "Elegí las cubiertas y colocalas en el local:",
    shopLinks: [L.todos, L.servicios, L.ofertas],
  },
};

/** Respaldo para una nota nueva que todavía no está cargada arriba. */
export const DEFAULT_BLOG_META: BlogMeta = {
  cover: { src: IMG.local, alt: "Frente del local de Neumáticos Trivium", position: "center 45%" },
  figure: { src: IMG.montaje, alt: "Montaje de un neumático en el taller", caption: "Colocación en el taller del local." },
  shopIntro: "Buscá tu medida o mirá el catálogo:",
  shopLinks: [L.todos, L.ofertas, L.servicios],
};

export function blogMeta(slug: string): BlogMeta {
  return BLOG_META[slug] ?? DEFAULT_BLOG_META;
}

/** Miniatura al compartir la nota: la foto de portada, o la del sitio si no tiene propia. */
export function blogShare(slug: string) {
  return siteShare(blogMeta(slug).cover.src) ?? {};
}
