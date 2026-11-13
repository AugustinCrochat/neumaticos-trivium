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
  antirroboFord: `${LOCAL}/tuerca-antirrobo-en-llanta-de-ford-con-cubierta-grenlander-kingpro-trivium-cordoba.webp`,
  balanceandoCamioneta: `${LOCAL}/balanceadora-hofmann-geodyna-7800p-balanceando-rueda-de-camioneta-trivium-cordoba.webp`,
  cambioCamioneta: `${LOCAL}/cambio-de-cubiertas-en-camioneta-pickup-con-balanceadora-hofmann-trivium-cordoba.webp`,
  colocandoTarget: `${LOCAL}/tecnico-colocando-target-de-alineacion-3d-en-auto-trivium-cordoba.webp`,
  tallerCuatroAutos: `${LOCAL}/taller-de-gomeria-con-cuatro-autos-neumaticos-trivium-arguello-cordoba.webp`,
  remis: `${LOCAL}/remis-cambio-de-cuatro-neumaticos-con-alineacion-y-balanceo-trivium-cordoba.webp`,
  taxiLocal: `${LOCAL}/taxi-entrando-al-local-neumaticos-trivium-cordoba.webp`,
  remisTaller: `${LOCAL}/remis-en-el-taller-con-balanceadora-y-neumaticos-trivium-cordoba.webp`,
  taxiRueda: `${LOCAL}/taxi-rueda-delantera-en-el-taller-neumaticos-trivium-cordoba.webp`,
  remisClassic: `${LOCAL}/remis-chevrolet-classic-cambio-de-neumaticos-y-balanceo-trivium-cordoba.webp`,
  cargaDos: `${LOCAL}/dos-cubiertas-de-carga-grenlander-175-65-r14c-modelos-distintos-trivium-cordoba.webp`,
  valvula: `${LOCAL}/tecnico-colocando-valvula-en-llanta-de-camioneta-con-neumatico-at-trivium-cordoba.webp`,
  placaPresion: `${LOCAL}/etiqueta-de-presion-recomendada-en-la-puerta-del-auto-trivium-cordoba.webp`,
  descarga: `${LOCAL}/descarga-de-neumaticos-importados-grenlander-del-camion-trivium-cordoba.webp`,
  autoRojoTarget: `${LOCAL}/alineacion-3d-de-auto-rojo-target-en-la-rueda-trivium-cordoba.webp`,
};

/** Datos fijos de cada foto: encuadre para portada y epígrafe genérico si se usa como figura. */
const PHOTO: Record<string, { alt: string; portrait?: boolean; position?: string; caption: string }> = {
  placaPresion: { alt: "Etiqueta de presión de neumáticos en el parante de la puerta de un Audi, con valores en bar y PSI", portrait: true, position: "center 35%", caption: "La presión correcta está en la puerta del auto, no en el flanco de la cubierta." },
  cargaDos: { alt: "Dos cubiertas de carga Grenlander 175/65 R14C 90/88 de modelos distintos sostenidas en el taller", portrait: true, position: "center 40%", caption: "Dos cubiertas de carga de la misma medida y distinto dibujo." },
  descarga: { alt: "Descarga de neumáticos importados Grenlander de un camión en el local de Neumáticos Trivium", caption: "Llegada de neumáticos importados al local de Trivium." },
  valvula: { alt: "Técnico colocando la válvula en una llanta de camioneta con un neumático A/T en la desmontadora", portrait: true, position: "center 45%", caption: "Válvula nueva en cada llanta al armar el neumático." },
  tallerCuatroAutos: { alt: "Interior del taller de Neumáticos Trivium en Argüello con cuatro autos en servicio", caption: "El taller de Argüello con cuatro autos en servicio." },
  fachada: { alt: "Frente del local de Neumáticos Trivium en Córdoba", caption: "El local de Neumáticos Trivium en Argüello, Córdoba." },
  cambioCamioneta: { alt: "Cambio de cubiertas de una camioneta en el taller de Neumáticos Trivium, con la balanceadora Hofmann al lado", caption: "Cambio de cubiertas de una camioneta en el taller." },
  balanceandoCamioneta: { alt: "Técnico balanceando una rueda de camioneta en la balanceadora Hofmann del taller", portrait: true, position: "center 40%", caption: "Balanceo de una rueda de camioneta en la balanceadora del taller." },
  grenlanderPerfilBajo: { alt: "Cubierta Grenlander de perfil bajo ya colocada en el auto", portrait: true, position: "center 55%", caption: "Una cubierta Grenlander ya colocada en el auto." },
  autoRojoTarget: { alt: "Auto sobre el elevador con el target de la alineadora 3D colocado en la rueda", portrait: true, position: "center 50%", caption: "Alineación 3D: el target en la rueda mide los ángulos reales." },
  alineadora3d: { alt: "Alineadora 3D Hofmann Geoliner 630 del taller con el target colocado en la rueda", caption: "La alineadora 3D del taller, con el target en la rueda." },
  taxiLocal: { alt: "Taxi entrando al local de Neumáticos Trivium en Argüello, con el cartel de la fachada", portrait: true, position: "center 45%", caption: "Un taxi entrando al local de Trivium." },
  taxi: { alt: "Taxi en el taller de Neumáticos Trivium en Córdoba", portrait: true, position: "center 50%", caption: "Un taxi en el taller de Trivium." },
  remisTaller: { alt: "Remis en el taller con la balanceadora y neumáticos nuevos", portrait: true, position: "center 45%", caption: "Un remis en el taller, junto a la balanceadora." },
  taxiRueda: { alt: "Rueda delantera de un taxi en el taller de Neumáticos Trivium", portrait: true, position: "center 45%", caption: "Rueda delantera de un taxi durante el servicio." },
  remisClassic: { alt: "Remis Chevrolet Classic sobre el elevador del taller con cubiertas nuevas y la balanceadora al fondo", portrait: true, position: "center 60%", caption: "Un remis con cubiertas nuevas, listo para el balanceo." },
  remis: { alt: "Remis con cambio de cuatro neumáticos, alineación y balanceo en Trivium", portrait: true, position: "center 45%", caption: "Cambio de cuatro neumáticos con alineación y balanceo." },
  camionetas: { alt: "Dos camionetas en el taller de Neumáticos Trivium, una sobre el elevador", caption: "Camionetas en el taller de Trivium." },
  rotacion: { alt: "Auto con una rueda desmontada y la cubierta Pirelli al lado, durante una rotación", portrait: true, position: "center 50%", caption: "Con la rueda afuera es el mejor momento para revisar presión y estado." },
  antirrobo: { alt: "Tuerca antirrobo de seguridad en una llanta de aleación", portrait: true, position: "center 50%", caption: "Una tuerca antirrobo colocada en la llanta." },
  antirroboFord: { alt: "Tuerca antirrobo colocada en la llanta de un Ford, con una cubierta nueva Grenlander Kingpro One 175/65 R14", portrait: true, position: "center 62%", caption: "Tuerca antirrobo en la llanta, junto a una Grenlander Kingpro One 175/65 R14 nueva." },
  montaje: { alt: "Cubierta montada en la desmontadora del taller", position: "center 55%", caption: "El arme de la cubierta en la desmontadora." },
  alineacion: { alt: "Utilitario blanco elevado en el taller de Neumáticos Trivium", position: "center 30%", caption: "Un utilitario en el elevador del taller de Trivium." },
  balanceo: { alt: "Técnico de Trivium junto a la balanceadora con una rueda montada", position: "center 45%", caption: "Rueda montada en la balanceadora del taller." },
  geoliner630: { alt: "Alineadora Geoliner 630 en el taller de Neumáticos Trivium", portrait: true, position: "center 50%", caption: "La alineadora Geoliner 630 del taller." },
  geoliner: { alt: "Alineadora 3D Geoliner 630 de Neumáticos Trivium", portrait: true, position: "center 40%", caption: "La alineadora 3D Geoliner 630 del taller." },
  geodyna: { alt: "Balanceadora Geodyna 7800P de Neumáticos Trivium", caption: "La balanceadora Geodyna 7800P del taller." },
  local: { alt: "Frente del local de Neumáticos Trivium en Argüello", caption: "El local de Argüello, en Córdoba." },
  atClasica: { alt: "Técnico colocando un neumático Grenlander A/T en una pickup clásica", portrait: true, position: "center 70%", caption: "Neumático A/T colocado en una pickup clásica." },
  pickup4x4: { alt: "Pickup 4x4 sobre el elevador del taller de Neumáticos Trivium", portrait: true, position: "center 45%", caption: "Una pickup 4x4 sobre el elevador del taller." },
  kingpro: { alt: "Cubierta Grenlander Kingpro One apoyada junto a una pickup", portrait: true, position: "center 55%", caption: "Grenlander Kingpro One junto a una pickup." },
  tecnicosAlineando: { alt: "Técnicos alineando un auto sobre el elevador de Neumáticos Trivium", portrait: true, position: "center 45%", caption: "Técnicos alineando un auto en el elevador." },
  colocandoTarget: { alt: "Técnico colocando el target de alineación 3D en la rueda de un auto", portrait: true, position: "center 50%", caption: "Colocando el target de la alineación 3D." },
  utilitario: { alt: "Balanceadora y alineadora junto a un utilitario en el taller de Trivium", portrait: true, position: "center 50%", caption: "Un utilitario junto a la balanceadora y la alineadora." },
  balanceando: { alt: "Técnico balanceando una rueda en la balanceadora de Neumáticos Trivium", portrait: true, position: "center 45%", caption: "Balanceo de una rueda en el taller." },
  target: { alt: "Target de la alineadora en la rueda de un auto sobre el elevador", portrait: true, position: "center 45%", caption: "El target de la alineadora en la rueda." },
};

const cover = (k: keyof typeof IMG): BlogImage => ({
  src: IMG[k],
  alt: PHOTO[k].alt,
  ...(PHOTO[k].portrait ? { tall: true } : {}),
  ...(PHOTO[k].position ? { position: PHOTO[k].position } : {}),
});
const figure = (k: keyof typeof IMG, caption?: string): BlogFigure => ({
  src: IMG[k],
  alt: PHOTO[k].alt,
  ...(PHOTO[k].portrait ? { portrait: true } : {}),
  caption: caption ?? PHOTO[k].caption,
});

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
  "como-ahorrar-en-neumaticos-guia-completa": {
    cover: cover("tallerCuatroAutos"),
    figure: figure("cambioCamioneta", "Un juego bien colocado, alineado y balanceado es la base para que rinda todos sus kilómetros."),
    shopIntro: "Cuando llegue el momento de cambiar:",
    shopLinks: [L.todos, L.ofertas, L.servicios],
  },
  "auto-tira-para-un-lado-causas": {
    cover: cover("tecnicosAlineando"),
    figure: figure("target"),
    shopIntro: "Si tu auto se va para un lado:",
    shopLinks: [L.servicios, L.todos, L.ofertas],
  },
  "volante-vibra-causas-y-solucion": {
    cover: cover("balanceando"),
    figure: figure("balanceandoCamioneta"),
    shopIntro: "Si el volante vibra:",
    shopLinks: [L.servicios, L.todos, L.ofertas],
  },
  "cada-cuantos-km-alinear-y-balancear": {
    cover: cover("remis"),
    figure: figure("tallerCuatroAutos"),
    shopIntro: "Para cuidar tus neumáticos:",
    shopLinks: [L.servicios, L.todos, L.ofertas],
  },
  "que-mide-una-alineadora-convergencia-caida-avance": {
    cover: cover("colocandoTarget"),
    figure: figure("autoRojoTarget"),
    shopIntro: "Para alinear tu auto:",
    shopLinks: [L.servicios, L.todos, L.ofertas],
  },
  "alineado-y-balanceado-en-camionetas-y-4x4": {
    cover: cover("camionetas"),
    figure: figure("pickup4x4"),
    shopIntro: "Para tu camioneta:",
    shopLinks: [L.at, L.ht, L.servicios],
  },
  "pesas-de-balanceo-por-que-se-caen": {
    cover: cover("balanceo"),
    figure: figure("balanceando"),
    shopIntro: "Si necesitás balancear:",
    shopLinks: [L.servicios, L.todos, L.ofertas],
  },
  "revision-antes-de-viajar-neumaticos": {
    cover: cover("placaPresion"),
    figure: figure("cambioCamioneta"),
    shopIntro: "Si la revisión encontró algo:",
    shopLinks: [L.todos, L.servicios, L.ofertas],
  },
  "alineacion-3d-vs-alineacion-tradicional": {
    cover: cover("geoliner630"),
    figure: figure("alineadora3d"),
    shopIntro: "Para alinear tu auto:",
    shopLinks: [L.servicios, L.todos, L.ofertas],
  },
  "cuanto-cuesta-cambiar-los-cuatro-neumaticos": {
    cover: cover("tallerCuatroAutos"),
    figure: figure("tecnicosAlineando"),
    shopIntro: "Para armar tu presupuesto:",
    shopLinks: [L.todos, L.servicios, L.ofertas],
  },
  "cuanto-tarda-alineado-y-balanceado": {
    cover: cover("tallerCuatroAutos"),
    figure: figure("tecnicosAlineando"),
    shopIntro: "Para alinear y balancear tu auto:",
    shopLinks: [L.servicios, L.todos, L.ofertas],
  },
  "revision-mensual-de-neumaticos-en-5-minutos": {
    cover: cover("placaPresion"),
    figure: figure("balanceando", "Una rueda que vibra a ciertas velocidades suele necesitar balanceado."),
    shopIntro: "Si la revisión encontró algo:",
    shopLinks: [L.todos, L.servicios, L.ofertas],
  },
  "habitos-de-manejo-que-gastan-los-neumaticos": {
    cover: cover("taxiRueda"),
    figure: figure("remisClassic", "En autos de trabajo, el manejo cambia mucho cuántos kilómetros rinde un juego."),
    shopIntro: "Cuando toque cambiarlos:",
    shopLinks: [L.todos, L.remises, L.ofertas],
  },
  "pozo-o-golpe-que-revisar-en-el-neumatico": {
    cover: cover("autoRojoTarget"),
    figure: figure("tecnicosAlineando", "Después de un golpe fuerte, el alineado mide si los ángulos siguen dentro de lo normal."),
    shopIntro: "Si la cubierta quedó dañada:",
    shopLinks: [L.todos, L.servicios, L.ofertas],
  },
  "burbuja-en-el-flanco-del-neumatico": {
    cover: cover("grenlanderPerfilBajo"),
    figure: figure("montaje", "La cubierta con burbuja se desmonta y se cambia: no hay reparación posible."),
    shopIntro: "Para reemplazarla:",
    shopLinks: [L.todos, L.ofertas, L.servicios],
  },
  "neumatico-que-pierde-aire-solo-causas": {
    cover: cover("valvula"),
    figure: figure("balanceo", "Con la rueda en el taller se sumerge o se rocía para ubicar la pérdida."),
    shopIntro: "Si hay que reemplazarla:",
    shopLinks: [L.todos, L.servicios, L.ofertas],
  },
  "aquaplaning-que-es-y-como-evitarlo": {
    cover: cover("kingpro"),
    figure: figure("atClasica", "Un dibujo profundo evacúa más agua y reduce el riesgo de aquaplaning."),
    shopIntro: "Para tener dibujo nuevo:",
    shopLinks: [L.todos, L.ofertas, L.at],
  },
  "neumaticos-usados-conviene-comprarlos": {
    cover: cover("descarga"),
    figure: figure("tallerCuatroAutos", "Un juego nuevo se coloca, se alinea y se balancea en la misma visita."),
    shopIntro: "Alternativas nuevas y económicas:",
    shopLinks: [{ label: "Neumáticos baratos", href: "/neumaticos-baratos" }, L.todos, L.ofertas],
  },
  "neumaticos-205-55-r16-autos-que-la-usan": {
    cover: { src: "/images/blog/medida-205-55-r16-portada.webp", alt: "Neumáticos 205/55 R16 con los autos que la usan: Renault Sandero Stepway, Toyota Corolla" },
    figure: { src: "/images/blog/medida-205-55-r16-autos.webp", alt: "Autos que usan la medida 205/55 R16", caption: "Algunos de los autos que llevan la medida 205/55 R16 de fábrica." },
    shopIntro: "Mirá la medida 205/55 R16 en stock:",
    shopLinks: [{ label: "Medida 205/55 R16", href: "/neumaticos/205-55-r16" }, L.todos, L.ofertas],
  },
  "neumaticos-185-65-r15-autos-que-la-usan": {
    cover: { src: "/images/blog/medida-185-65-r15-portada.webp", alt: "Neumáticos 185/65 R15 con los autos que la usan: Peugeot 208, Chevrolet Onix" },
    figure: { src: "/images/blog/medida-185-65-r15-autos.webp", alt: "Autos que usan la medida 185/65 R15", caption: "Algunos de los autos que llevan la medida 185/65 R15 de fábrica." },
    shopIntro: "Mirá la medida 185/65 R15 en stock:",
    shopLinks: [{ label: "Medida 185/65 R15", href: "/neumaticos/185-65-r15" }, L.todos, L.ofertas],
  },
  "neumaticos-175-70-r14-autos-que-la-usan": {
    cover: { src: "/images/blog/medida-175-70-r14-portada.webp", alt: "Neumáticos 175/70 R14 con los autos que la usan: Renault Sandero, Volkswagen Gol Trend" },
    figure: { src: "/images/blog/medida-175-70-r14-autos.webp", alt: "Autos que usan la medida 175/70 R14", caption: "Algunos de los autos que llevan la medida 175/70 R14 de fábrica." },
    shopIntro: "Mirá la medida 175/70 R14 en stock:",
    shopLinks: [{ label: "Medida 175/70 R14", href: "/neumaticos/175-70-r14" }, L.todos, L.ofertas],
  },
  "neumaticos-195-55-r16-autos-que-la-usan": {
    cover: { src: "/images/blog/medida-195-55-r16-portada.webp", alt: "Neumáticos 195/55 R16 con los autos que la usan: Fiat Cronos, Peugeot 208" },
    figure: { src: "/images/blog/medida-195-55-r16-autos.webp", alt: "Autos que usan la medida 195/55 R16", caption: "Algunos de los autos que llevan la medida 195/55 R16 de fábrica." },
    shopIntro: "Mirá la medida 195/55 R16 en stock:",
    shopLinks: [{ label: "Medida 195/55 R16", href: "/neumaticos/195-55-r16" }, L.todos, L.ofertas],
  },
  "neumaticos-205-60-r16-autos-que-la-usan": {
    cover: { src: "/images/blog/medida-205-60-r16-portada.webp", alt: "Neumáticos 205/60 R16 con los autos que la usan: Volkswagen T-Cross, Chevrolet Tracker" },
    figure: { src: "/images/blog/medida-205-60-r16-autos.webp", alt: "Autos que usan la medida 205/60 R16", caption: "Algunos de los autos que llevan la medida 205/60 R16 de fábrica." },
    shopIntro: "Mirá la medida 205/60 R16 en stock:",
    shopLinks: [{ label: "Medida 205/60 R16", href: "/neumaticos/205-60-r16" }, L.todos, L.ofertas],
  },
  "neumaticos-175-65-r14-autos-que-la-usan": {
    cover: { src: "/images/blog/medida-175-65-r14-portada.webp", alt: "Neumáticos 175/65 R14 con los autos que la usan: Citroen C3, Fiat Mobi" },
    figure: { src: "/images/blog/medida-175-65-r14-autos.webp", alt: "Autos que usan la medida 175/65 R14", caption: "Algunos de los autos que llevan la medida 175/65 R14 de fábrica." },
    shopIntro: "Mirá la medida 175/65 R14 en stock:",
    shopLinks: [{ label: "Medida 175/65 R14", href: "/neumaticos/175-65-r14" }, L.todos, L.ofertas],
  },
  "neumaticos-195-65-r15-autos-que-la-usan": {
    cover: { src: "/images/blog/medida-195-65-r15-portada.webp", alt: "Neumáticos 195/65 R15 con los autos que la usan: Ford EcoSport, Peugeot 307" },
    figure: { src: "/images/blog/medida-195-65-r15-autos.webp", alt: "Autos que usan la medida 195/65 R15", caption: "Algunos de los autos que llevan la medida 195/65 R15 de fábrica." },
    shopIntro: "Mirá la medida 195/65 R15 en stock:",
    shopLinks: [{ label: "Medida 195/65 R15", href: "/neumaticos/195-65-r15" }, L.todos, L.ofertas],
  },
  "neumaticos-185-60-r15-autos-que-la-usan": {
    cover: { src: "/images/blog/medida-185-60-r15-portada.webp", alt: "Neumáticos 185/60 R15 con los autos que la usan: Fiat Cronos, Citroen C3" },
    figure: { src: "/images/blog/medida-185-60-r15-autos.webp", alt: "Autos que usan la medida 185/60 R15", caption: "Algunos de los autos que llevan la medida 185/60 R15 de fábrica." },
    shopIntro: "Mirá la medida 185/60 R15 en stock:",
    shopLinks: [{ label: "Medida 185/60 R15", href: "/neumaticos/185-60-r15" }, L.todos, L.ofertas],
  },
  "neumaticos-265-65-r17-autos-que-la-usan": {
    cover: { src: "/images/blog/medida-265-65-r17-portada.webp", alt: "Neumáticos 265/65 R17 con las pickups que la usan: Toyota Hilux, Ford Ranger" },
    figure: { src: "/images/blog/medida-265-65-r17-autos.webp", alt: "Pickups y SUV que usan la medida 265/65 R17", caption: "Algunas de las camionetas que llevan la medida 265/65 R17 de fábrica." },
    shopIntro: "Mirá la medida 265/65 R17 en stock:",
    shopLinks: [{ label: "Medida 265/65 R17", href: "/neumaticos/265-65-r17" }, L.at, L.ht],
  },
  "neumaticos-265-60-r18-autos-que-la-usan": {
    cover: { src: "/images/blog/medida-265-60-r18-portada.webp", alt: "Neumáticos 265/60 R18 con las camionetas que la usan: Toyota Hilux, Ford Ranger" },
    figure: { src: "/images/blog/medida-265-60-r18-autos.webp", alt: "Camionetas y SUV que usan la medida 265/60 R18", caption: "Algunas de las camionetas que llevan la medida 265/60 R18 de fábrica." },
    shopIntro: "Mirá la medida 265/60 R18 en stock:",
    shopLinks: [{ label: "Medida 265/60 R18", href: "/neumaticos/265-60-r18" }, L.at, L.ht],
  },
  "265-60-r18-o-265-65-r17-cual-conviene-camioneta": {
    cover: { src: "/images/blog/medida-265-60-r18-portada.webp", alt: "265/60 R18 o 265/65 R17: las dos medidas de las pickups medianas, Toyota Hilux y Ford Ranger" },
    figure: { src: "/images/blog/medida-265-60-r18-autos.webp", alt: "Camionetas que usan 265/60 R18 o 265/65 R17", caption: "Hilux, Ranger y S10 llevan una u otra según la versión." },
    shopIntro: "Mirá las dos medidas en stock:",
    shopLinks: [{ label: "Medida 265/60 R18", href: "/neumaticos/265-60-r18" }, { label: "Medida 265/65 R17", href: "/neumaticos/265-65-r17" }, L.at],
  },
  "como-elegir-neumaticos-guia-completa": {
    cover: cover("alineacion"),
    figure: figure("tallerCuatroAutos", "Con la medida, los índices y el uso claros, elegir es mucho más simple."),
    shopIntro: "Cuando tengas tu medida:",
    shopLinks: [L.todos, L.ofertas, { label: "Neumáticos baratos", href: "/neumaticos-baratos" }],
  },
  "como-guardar-neumaticos": {
    cover: cover("fachada"),
    figure: figure("descarga", "Las cubiertas nuevas se guardan lejos del sol y de fuentes de calor."),
    shopIntro: "Para renovar el juego:",
    shopLinks: [L.todos, L.ofertas, L.servicios],
  },
  "limpiar-neumaticos-brillo-y-productos": {
    cover: cover("grenlanderPerfilBajo"),
    figure: figure("rotacion", "Con la rueda afuera es el mejor momento para limpiar y revisar la cubierta."),
    shopIntro: "Para renovar las cubiertas:",
    shopLinks: [L.todos, L.ofertas, L.servicios],
  },
  "como-cambiar-una-rueda-paso-a-paso": {
    cover: cover("rotacion"),
    figure: figure("antirrobo", "Si tu auto tiene tuercas antirrobo, la llave tiene que estar a mano."),
    shopIntro: "Si tenés que reponer la cubierta:",
    shopLinks: [L.todos, L.tuercas, L.ofertas],
  },
  "neumaticos-nuevos-adelante-o-atras": {
    cover: cover("remisClassic"),
    figure: figure("cambioCamioneta", "Con las cubiertas nuevas colocadas, el eje trasero lleva el par con más dibujo."),
    shopIntro: "Buscá tu medida y colocala en el local:",
    shopLinks: [L.todos, L.servicios, L.ofertas],
  },
  "cambiar-un-solo-neumatico-o-de-a-pares": {
    cover: cover("montaje"),
    figure: figure("tallerCuatroAutos", "Con el auto en el taller se compara el dibujo de las otras tres antes de decidir."),
    shopIntro: "Mirá las medidas disponibles:",
    shopLinks: [L.todos, L.ofertas, L.servicios],
  },
  "cambiar-los-cuatro-neumaticos-en-4x4-o-awd": {
    cover: cover("pickup4x4"),
    figure: figure("kingpro"),
    shopIntro: "Neumáticos para camionetas y SUV:",
    shopLinks: [L.at, L.ht, L.todos],
  },
  "neumaticos-direccionales-y-asimetricos-como-se-montan": {
    cover: cover("grenlanderPerfilBajo"),
    figure: figure("montaje", "En la desmontadora se respeta el sentido de giro o el lado exterior de cada cubierta."),
    shopIntro: "Buscá tu medida:",
    shopLinks: [L.todos, L.ofertas, L.servicios],
  },
  "reparacion-de-pinchaduras-parche-mecha": {
    cover: cover("taxi"),
    figure: { src: IMG.rotacion, alt: "Rueda Pirelli desmontada de un auto en el taller", caption: "Con la rueda afuera se revisa la cubierta por dentro antes de reparar." },
    shopIntro: "Si la cubierta no se puede reparar, mirá las medidas:",
    shopLinks: [L.todos, L.ofertas, L.servicios],
  },
  "arme-y-desarme-de-neumaticos": {
    cover: cover("montaje"),
    figure: { src: IMG.valvula, alt: "Técnico colocando la válvula de una llanta de camioneta durante el arme de la cubierta", portrait: true, caption: "En el arme se coloca válvula nueva en cada llanta, antes de balancear." },
    shopIntro: "Comprá las cubiertas y colocalas en el local:",
    shopLinks: [L.todos, L.servicios, L.ofertas],
  },
  "tuercas-y-bulones-de-seguridad": {
    cover: cover("balanceandoCamioneta"),
    figure: figure("antirroboFord", "La rueda solo sale con la llave de la tuerca de seguridad."),
    shopIntro: "Mirá el juego que corresponde a tu auto:",
    shopLinks: [L.tuercas, L.todos, L.servicios],
  },
  "extraccion-de-tuercas-de-seguridad": {
    cover: cover("antirrobo"),
    figure: figure("antirroboFord", "Si se perdió la llave, la tuerca se extrae en el taller sin dañar la llanta."),
    shopIntro: "Si necesitás un juego nuevo:",
    shopLinks: [L.tuercas, L.servicios, L.todos],
  },
  "esparrago-de-maza-roto-reparacion-de-rosca": {
    cover: cover("camionetas"),
    figure: figure("cambioCamioneta", "Con la rueda afuera se revisan los espárragos y la rosca."),
    shopIntro: "Servicios y neumáticos:",
    shopLinks: [L.servicios, L.tuercas, L.todos],
  },
  "neumaticos-japoneses-europeos-americanos-y-chinos-origen-de-las-marcas": {
    cover: cover("descarga"),
    figure: { src: IMG.tallerCuatroAutos, alt: "Interior del taller de Neumáticos Trivium en Argüello con cuatro autos en servicio", caption: "Un neumático se elige por sus datos, no solo por el país de la marca." },
    shopIntro: "Mirá las marcas que tenemos:",
    shopLinks: [L.marcas, L.todos, L.ofertas],
  },
  "que-incluye-el-presupuesto-de-neumaticos": {
    cover: cover("tecnicosAlineando"),
    figure: { src: IMG.cambioCamioneta, alt: "Cambio de cubiertas de una camioneta en el taller de Neumáticos Trivium, con la balanceadora Hofmann al lado", caption: "Colocación, válvulas y balanceo: lo que tiene que figurar en un presupuesto." },
    shopIntro: "Mirá los precios publicados:",
    shopLinks: [L.todos, L.ofertas, L.servicios],
  },
  "nitrogeno-en-neumaticos-vale-la-pena": {
    cover: cover("cambioCamioneta"),
    figure: { src: IMG.grenlanderPerfilBajo, alt: "Cubierta de perfil bajo recién colocada en una llanta", caption: "Con aire o con nitrógeno, la presión se controla todos los meses." },
    shopIntro: "Cuidá tus cubiertas:",
    shopLinks: [L.servicios, L.todos, L.ofertas],
  },
  "como-comparar-neumaticos-antes-de-comprar": {
    cover: cover("tallerCuatroAutos"),
    figure: { src: IMG.montaje, alt: "Cubierta montada en la desmontadora del taller", caption: "Con la misma medida y los mismos índices, la comparación es justa." },
    shopIntro: "Mirá las medidas y comparalas:",
    shopLinks: [L.todos, L.equivalencias, L.ofertas],
  },
  "cambio-de-valvulas-de-neumaticos": {
    cover: cover("valvula"),
    figure: { src: IMG.balanceandoCamioneta, alt: "Técnico balanceando una rueda de camioneta en la balanceadora Hofmann del taller", portrait: true, caption: "Con la cubierta nueva y la válvula nueva, la rueda se balancea antes de volver al auto." },
    shopIntro: "Comprá las cubiertas y colocalas en el local:",
    shopLinks: [L.todos, L.servicios, L.ofertas],
  },
  "etiqueta-de-presion-puerta-del-auto": {
    cover: cover("placaPresion"),
    figure: { src: IMG.balanceo, alt: "Técnico de Trivium junto a la balanceadora con una rueda montada", caption: "Con la rueda montada y balanceada, la presión es lo último que se ajusta." },
    shopIntro: "Si la presión mal usada ya gastó las cubiertas:",
    shopLinks: [L.todos, L.servicios, L.ofertas],
  },
  "dos-cubiertas-de-carga-175-65-r14c-modelos-distintos": {
    cover: cover("cargaDos"),
    figure: { src: IMG.descarga, alt: "Descarga de neumáticos Grenlander del camión en el local de Trivium", caption: "Las cubiertas de carga llegan al local en cantidad: se consulta stock por medida." },
    shopIntro: "Mirá las cubiertas C disponibles:",
    shopLinks: [L.carga, L.r14, L.grenlander],
  },
  "neumaticos-para-uber-didi-cabify": {
    cover: cover("taxiLocal"),
    figure: { src: IMG.tallerCuatroAutos, alt: "Interior del taller de Neumáticos Trivium en Argüello con cuatro autos en servicio", caption: "Colocación, balanceo y alineación en el mismo taller de Argüello." },
    shopIntro: "Para quien trabaja con el auto:",
    shopLinks: [L.remises, L.r14, L.r15],
  },
  "como-hacer-durar-los-neumaticos-de-taxis-y-remises": {
    cover: cover("taxiRueda"),
    figure: figure("remisClassic", "Un remis con el juego nuevo en el elevador: colocación, balanceo y alineación en el mismo taller de Argüello."),
    shopIntro: "Cuando llega el momento de cambiarlas:",
    shopLinks: [L.remises, L.servicios, L.todos],
  },
  "maquinas-hofmann-y-elevadores-rotary-lift-gomeria": {
    cover: cover("alineadora3d"),
    figure: { src: IMG.balanceandoCamioneta, alt: "Técnico balanceando una rueda de camioneta en la balanceadora Hofmann Geodyna 7800P del taller", portrait: true, caption: "La Geodyna 7800P del taller balanceando una rueda de camioneta antes de volver a montarla." },
    shopIntro: "Nuestros servicios de gomería:",
    shopLinks: [L.servicios, L.todos, L.ofertas],
  },
  "gomeria-en-san-justo-buenos-aires": {
    cover: cover("fachada"),
    figure: { src: IMG.tallerCuatroAutos, alt: "Interior del taller de Neumáticos Trivium en Argüello con cuatro autos en servicio", caption: "Así trabaja la gomería de Argüello; San Justo abre en enero." },
    shopIntro: "Mirá el stock mientras abrimos:",
    shopLinks: [L.todos, L.ofertas, L.servicios],
  },
  "gomeria-en-lomas-del-mirador-y-oeste-de-capital": {
    cover: cover("fachada"),
    figure: { src: IMG.tallerCuatroAutos, alt: "Interior del taller de Neumáticos Trivium en Argüello con cuatro autos en servicio", caption: "Así trabaja la gomería de Argüello; Lomas del Mirador abre en diciembre." },
    shopIntro: "Mirá el stock mientras abrimos:",
    shopLinks: [L.todos, L.ofertas, L.servicios],
  },
  "neumaticos-para-utilitarios-furgones-reparto": {
    cover: cover("utilitario"),
    figure: figure("camionetas"),
    shopIntro: "Cubiertas para furgones, utilitarios y reparto:",
    shopLinks: [L.carga, L.ofertas, L.todos],
  },
  "neumatico-c-o-de-auto-utilitario": {
    cover: cover("cargaDos"),
    figure: { src: IMG.alineacion, alt: "Utilitario blanco elevado en el taller de Neumáticos Trivium", caption: "Un utilitario en el taller de Trivium: la medida es la misma, la cubierta no." },
    shopIntro: "Mirá las cubiertas C disponibles:",
    shopLinks: [L.carga, L.todos, L.indice],
  },
  "presion-neumaticos-utilitarios-con-carga": {
    cover: cover("placaPresion"),
    figure: figure("camionetas", "Con carga o sin ella, la presión se revisa antes de salir."),
    shopIntro: "Si ya toca cambiarlas, estas son las cubiertas para trabajo:",
    shopLinks: [L.carga, L.servicios, L.todos],
  },
  "comprar-neumaticos-en-buenos-aires-zona-oeste": {
    cover: cover("fachada"),
    figure: { src: IMG.tallerCuatroAutos, alt: "Interior del taller de Neumáticos Trivium en Argüello con cuatro autos en servicio", caption: "Así trabaja el taller de Argüello; los locales de Buenos Aires abren en diciembre y enero." },
    shopIntro: "Mirá precios y stock mientras abrimos:",
    shopLinks: [L.todos, L.ofertas, L.servicios],
  },
  "neumaticos-baratos-en-cordoba": {
    cover: cover("fachada"),
    figure: { src: IMG.taxi, alt: "Taxi dentro del taller de Neumáticos Trivium", caption: "Un taxi en el taller: cubierta económica, colocada en el mismo lugar." },
    shopIntro: "Elegí por medida o por categoría:",
    shopLinks: [L.todos, L.ofertas, L.marcas],
  },
  "comprar-neumaticos-en-cordoba": {
    cover: cover("fachada"),
    figure: { src: IMG.taxi, alt: "Taxi dentro del taller de Neumáticos Trivium", caption: "Un taxi en el taller: la cubierta se compra y se coloca en el mismo lugar." },
    shopIntro: "Elegí por medida o por categoría:",
    shopLinks: [L.todos, L.ofertas, L.marcas, L.servicios],
  },
  "gomeria-en-cordoba": {
    cover: cover("tallerCuatroAutos"),
    figure: { src: IMG.balanceando, alt: "Técnico de Trivium balanceando una rueda", portrait: true, caption: "Balanceo de una rueda con la balanceadora del taller." },
    shopIntro: "Comprá las cubiertas y colocalas en el local:",
    shopLinks: [L.todos, L.servicios, L.ofertas],
  },
  "neumaticos-sierras-de-cordoba": {
    cover: cover("atClasica"),
    figure: { src: IMG.pickup4x4, alt: "Pickup 4x4 sobre el elevador de alineación con el sensor colocado", portrait: true, caption: "Una pickup 4x4 en el elevador: antes de la sierra conviene alinear." },
    shopIntro: "Para ripio, sierra y ruta:",
    shopLinks: [L.at, L.ht, L.m265],
  },
  "opiniones-linglong-mileking-sumaxx": {
    cover: cover("montaje"),
    figure: { src: IMG.grenlanderPerfilBajo, alt: "Cubierta Grenlander de perfil bajo recién colocada en un auto rojo", portrait: true, caption: "Una cubierta de importación recién colocada en el taller." },
    shopIntro: "Las que sí tenemos en stock, con precio publicado:",
    shopLinks: [L.grenlander, L.todos, L.ofertas],
  },
  "ruido-neumaticos": {
    cover: cover("balanceo"),
    figure: { src: IMG.grenlanderPerfilBajo, alt: "Cubierta Grenlander de perfil bajo recién colocada en un auto rojo", portrait: true, caption: "Perfil bajo: más agarre, y también más ruido de rodadura." },
    shopIntro: "Cubiertas de calle, por rodado:",
    shopLinks: [L.r14, L.r15, L.r16, L.todos],
  },
  "verano-vs-allseason": {
    cover: cover("grenlanderPerfilBajo"),
    figure: { src: IMG.atClasica, alt: "Técnico colocando un Grenlander Maga A/T Two en una pickup Ford clásica", portrait: true, caption: "Un all-terrain montado en una pickup clásica." },
    shopIntro: "Elegí por rodado o mirá todo el catálogo:",
    shopLinks: [L.r15, L.r16, L.r17, L.todos],
  },
  "precio-calidad-neumaticos-costo-por-km": {
    cover: cover("kingpro"),
    figure: { src: IMG.remis, alt: "Remis en el taller de Neumáticos Trivium durante el cambio de cubiertas", portrait: true, caption: "Un remis hace muchísimos kilómetros por año: ahí se ve el costo por km." },
    shopIntro: "Compará precios en tu medida:",
    shopLinks: [L.ofertas, L.todos, L.marcas],
  },
  "neumaticos-double-king-quien-los-fabrica": {
    cover: cover("target"),
    figure: { src: IMG.kingpro, alt: "Cubierta Grenlander Kingpro One apoyada junto a una pickup sin la rueda", portrait: true, caption: "Grenlander Kingpro One, una de las alternativas que tenemos en stock." },
    shopIntro: "Las que sí tenemos en stock, con precio publicado:",
    shopLinks: [L.grenlander, L.todos, L.ofertas],
  },
  "utqg-desgaste-traccion-temperatura": {
    cover: cover("geoliner630"),
    figure: { src: IMG.kingpro, alt: "Cubierta Grenlander Kingpro One apoyada junto a una pickup sin la rueda", portrait: true, caption: "El UTQG califica el desgaste, la tracción y la temperatura de la banda." },
    shopIntro: "Buscá cubiertas por tipo de uso:",
    shopLinks: [L.todos, L.ht, L.at],
  },
  "geoliner-630-geodyna-7800p-alineacion-balanceo": {
    cover: cover("geoliner"),
    figure: { src: IMG.geodyna, alt: "Balanceadora Geodyna 7800P en el taller de Trivium", caption: "La Geodyna 7800P balancea la rueda en el taller de Trivium." },
    shopIntro: "Con cubiertas nuevas, alineá y balanceá en el mismo turno:",
    shopLinks: [L.servicios, L.todos, L.ofertas],
  },
  "carga-simple-y-dual-neumaticos-c": {
    cover: cover("alineacion"),
    figure: { src: IMG.camionetas, alt: "Dos camionetas en el taller de Neumáticos Trivium, una sobre el elevador", caption: "El índice de carga se lee en el flanco, junto a la medida." },
    shopIntro: "Cubiertas C por medida:",
    shopLinks: [L.carga, L.indice, L.todos],
  },
  "medidas-flotation-camionetas": {
    cover: cover("pickup4x4"),
    figure: { src: IMG.atClasica, alt: "Técnico colocando un Grenlander Maga A/T Two en una pickup Ford clásica", portrait: true, caption: "En camionetas, la medida flotation se pasa a métrico para encontrar la equivalente." },
    shopIntro: "Cubiertas para camioneta:",
    shopLinks: [L.at, L.m265, L.equivalencias],
  },
  "cada-cuantos-km-cambiar-neumaticos": {
    cover: cover("remis"),
    figure: { src: IMG.rotacion, alt: "Auto con una rueda desmontada y la cubierta Pirelli al lado, durante una rotación", portrait: true, caption: "La rotación reparte el desgaste entre las cuatro ruedas." },
    shopIntro: "¿Ya te toca? Buscá tu medida:",
    shopLinks: [L.todos, L.ofertas, L.servicios],
  },
  "precio-neumaticos-argentina": {
    cover: cover("local"),
    figure: { src: IMG.kingpro, alt: "Cubierta Grenlander Kingpro One apoyada junto a una pickup sin la rueda", portrait: true, caption: "Cubierta Grenlander Kingpro One, una de las opciones de entrada." },
    shopIntro: "Precios por rodado:",
    shopLinks: [L.r13, L.r14, L.r15, L.r16, L.ofertas],
  },
  "presion-de-neumaticos": {
    cover: cover("balanceandoCamioneta"),
    figure: { src: IMG.placaPresion, alt: "Etiqueta de presión de neumáticos en el parante de la puerta de un Audi, con valores en bar y PSI", portrait: true, caption: "La presión correcta está en la puerta del auto, no en el flanco de la cubierta." },
    shopIntro: "Si el desgaste ya está al límite:",
    shopLinks: [L.todos, L.ofertas, L.servicios],
  },
  "alineacion-y-balanceo": {
    cover: cover("target"),
    figure: { src: IMG.colocandoTarget, alt: "Técnico colocando el target de la alineadora 3D en la rueda de un auto", portrait: true, caption: "El técnico coloca el target en la rueda: las cámaras de la alineadora lo leen y miden los ángulos del tren delantero." },
    shopIntro: "Estrená cubiertas y alineá en el mismo turno:",
    shopLinks: [L.servicios, L.todos, L.ofertas],
  },
  "indice-de-carga-y-velocidad": {
    cover: cover("kingpro"),
    figure: { src: IMG.montaje, alt: "Cubierta de carga Zmax montada en la desmontadora", caption: "El índice de carga y la letra de velocidad van después de la medida." },
    shopIntro: "Buscá por medida e índice:",
    shopLinks: [L.todos, L.indice, L.carga],
  },
  "como-leer-medida-neumatico": {
    cover: cover("taxiLocal"),
    figure: { src: IMG.kingpro, alt: "Cubierta Grenlander Kingpro One apoyada junto a una pickup sin la rueda", portrait: true, caption: "La medida está impresa en el flanco: ancho, perfil y rodado." },
    shopIntro: "Con tu medida a mano:",
    shopLinks: [L.m175, L.m185, L.m205, L.todos],
  },
  equivalencias: {
    cover: cover("geodyna"),
    figure: { src: IMG.grenlanderPerfilBajo, alt: "Cubierta Grenlander de perfil bajo recién colocada en un auto rojo", portrait: true, caption: "Una equivalente cambia hasta ±3% de diámetro, no la forma de la rueda." },
    shopIntro: "Probá tu medida en la calculadora o mirá el catálogo:",
    shopLinks: [L.equivalencias, L.todos, L.ofertas],
  },
  grenlander: {
    cover: cover("atClasica"),
    figure: { src: IMG.kingpro, alt: "Cubierta Grenlander Kingpro One apoyada junto a una pickup sin la rueda", portrait: true, caption: "Grenlander Kingpro One, de la línea de calle." },
    shopIntro: "Mirá toda la línea Grenlander en stock:",
    shopLinks: [L.grenlander, L.at, L.todos],
  },
  "marcas-chinas-neumaticos-comparativa": {
    cover: cover("geoliner630"),
    figure: { src: IMG.atClasica, alt: "Técnico colocando un Grenlander Maga A/T Two en una pickup Ford clásica", portrait: true, caption: "La diferencia entre marcas se ve en el uso y se mide en kilómetros." },
    shopIntro: "Probá Grenlander, nuestra marca de mayor confianza:",
    shopLinks: [L.grenlander, L.todos, L.ofertas],
  },
  "etiqueta-europea-neumaticos": {
    cover: cover("taxiRueda"),
    figure: { src: IMG.rotacion, alt: "Auto con una rueda desmontada y la cubierta Pirelli al lado, durante una rotación", portrait: true, caption: "La etiqueta clasifica consumo, agarre en mojado y ruido." },
    shopIntro: "Elegí cubiertas según su etiqueta:",
    shopLinks: [L.todos, L.ofertas, L.marcas],
  },
  "rotacion-de-neumaticos": {
    cover: cover("rotacion"),
    figure: { src: IMG.balanceando, alt: "Técnico de Trivium balanceando una rueda", portrait: true, caption: "Después de rotar conviene balancear: la balanceadora del taller." },
    shopIntro: "Si al rotar viste desgaste de más:",
    shopLinks: [L.todos, L.servicios, L.ofertas],
  },
  "neumaticos-de-marca-vs-importados-cual-conviene": {
    cover: cover("utilitario"),
    figure: { src: IMG.kingpro, alt: "Cubierta Grenlander Kingpro One apoyada junto a una pickup", portrait: true, caption: "Una cubierta importada lista para colocar en el taller." },
    shopIntro: "Mirá marcas y alternativas en tu medida:",
    shopLinks: [L.todos, L.marcas, L.ofertas],
  },
  "son-malos-los-neumaticos-chinos": {
    cover: cover("taxi"),
    figure: { src: IMG.grenlanderPerfilBajo, alt: "Cubierta Grenlander de perfil bajo ya colocada", caption: "Una Grenlander colocada: la homologación ECE R30 va grabada en el flanco." },
    shopIntro: "Cubiertas importadas con homologación:",
    shopLinks: [L.grenlander, L.todos, L.ofertas],
  },
  "cuanto-duran-los-neumaticos-economicos": {
    cover: cover("remisTaller"),
    figure: { src: IMG.tecnicosAlineando, alt: "Técnicos alineando un auto sobre el elevador", caption: "La alineación y la presión cuidan la vida útil más que la marca." },
    shopIntro: "Compará precios en tu medida:",
    shopLinks: [L.ofertas, L.servicios, L.todos],
  },
  "neumaticos-economicos-para-uso-urbano": {
    cover: cover("remis"),
    figure: { src: IMG.montaje, alt: "Montaje de un neumático en el taller", caption: "Colocación y balanceo en el taller del local." },
    shopIntro: "Medidas más pedidas para ciudad:",
    shopLinks: [L.m175, L.m185, L.m205],
  },
  "diferencia-neumatico-caro-y-barato": {
    cover: cover("balanceando"),
    figure: figure("kingpro", "Una cubierta importada junto a una pickup."),
    shopIntro: "Compará marcas en tu medida:",
    shopLinks: [L.marcas, L.todos, L.ofertas],
  },
  "cuatro-economicos-o-dos-de-marca": {
    cover: cover("autoRojoTarget"),
    figure: figure("tallerCuatroAutos"),
    shopIntro: "Armá el juego completo:",
    shopLinks: [L.todos, L.ofertas, L.servicios],
  },
  "como-elegir-neumatico-importado-seguro": {
    cover: cover("descarga"),
    figure: { src: IMG.rotacion, alt: "Rueda desmontada con la cubierta al lado", portrait: true, caption: "Antes de comprar, mirá el flanco: homologación y fecha DOT." },
    shopIntro: "Cubiertas con homologación verificable:",
    shopLinks: [L.grenlander, L.indice, L.todos],
  },
  "marca-o-importado-camioneta-at-carga": {
    cover: cover("pickup4x4"),
    figure: { src: IMG.atClasica, alt: "Camioneta clásica con neumáticos A/T Grenlander", caption: "Neumáticos A/T para uso mixto de ruta y tierra." },
    shopIntro: "Para camioneta, A/T y carga:",
    shopLinks: [L.at, L.carga, L.ht],
  },
  "neumen-historia-sucursales-y-como-comparar": {
    cover: cover("fachada"),
    figure: figure("fachada", "El local de Neumáticos Trivium en Argüello, Córdoba."),
    shopIntro: "Mirá lo que tenemos:",
    shopLinks: [L.pirelli, L.marcas],
  },
  "norauto-argentina-historia-y-como-comparar": {
    cover: cover("tallerCuatroAutos"),
    figure: figure("tallerCuatroAutos", "El taller de Argüello, con alineado y balanceo en el mismo lugar."),
    shopIntro: "Mirá lo que tenemos:",
    shopLinks: [L.pirelli, L.marcas],
  },
  "compraste-neumaticos-en-mercado-libre-donde-colocarlos-en-cordoba": {
    cover: cover("tallerCuatroAutos"),
    figure: figure("montaje"),
    shopIntro: "Si todavía no compraste:",
    shopLinks: [L.todos, L.servicios, L.ofertas],
  },
  "cubiertas-o-neumaticos-como-se-dice-y-como-buscar-tu-medida": {
    cover: cover("fachada"),
    figure: figure("fachada"),
    shopIntro: "Buscá tu medida:",
    shopLinks: [L.todos, L.r14, L.equivalencias],
  },
  "alineado-y-balanceado-juntos-o-por-separado": {
    cover: cover("tallerCuatroAutos"),
    figure: figure("tallerCuatroAutos"),
    shopIntro: "Mirá los precios:",
    shopLinks: [L.servicios, L.todos],
  },
  "fate-que-paso-con-la-marca-y-que-hacer-con-tus-cubiertas": {
    cover: cover("tallerCuatroAutos"),
    figure: figure("tallerCuatroAutos"),
    shopIntro: "Mirá lo que tenemos:",
    shopLinks: [L.todos, {label:"Alternativas a Fate", href:"/alternativas/fate"}, L.servicios],
  },
  "pirelli-historia-de-la-marca-y-que-neumaticos-tenemos": {
    cover: cover("tallerCuatroAutos"),
    figure: figure("tallerCuatroAutos"),
    shopIntro: "Mirá lo que tenemos:",
    shopLinks: [L.pirelli, L.todos, L.marcas],
  },
  "bridgestone-y-firestone-historia-y-como-elegir": {
    cover: cover("tallerCuatroAutos"),
    figure: figure("tallerCuatroAutos"),
    shopIntro: "Mirá lo que tenemos:",
    shopLinks: [L.todos, {label:"Alternativas a Bridgestone", href:"/alternativas/bridgestone"}, L.marcas],
  },
  "goodyear-historia-y-por-que-se-llama-asi": {
    cover: cover("tallerCuatroAutos"),
    figure: figure("tallerCuatroAutos"),
    shopIntro: "Mirá lo que tenemos:",
    shopLinks: [L.todos, {label:"Alternativas a Goodyear", href:"/alternativas/goodyear"}, L.marcas],
  },
  "alternativas-a-michelin-y-pirelli": {
    cover: cover("rotacion"),
    figure: { src: IMG.kingpro, alt: "Cubierta Grenlander Kingpro One junto a una pickup", portrait: true, caption: "Una alternativa importada junto a una pickup." },
    shopIntro: "Mirá las marcas disponibles:",
    shopLinks: [L.pirelli, L.michelin, L.marcas],
  },
  "at-o-ht-cual-conviene-para-tu-camioneta": {
    cover: cover("valvula"),
    figure: figure("pickup4x4", "Con la camioneta sobre el elevador se elige y se verifica la medida."),
    shopIntro: "Mirá las dos opciones:",
    shopLinks: [L.at, L.ht, L.carga],
  },
  "ancho-del-neumatico-que-significa": {
    cover: cover("taxiRueda"),
    figure: figure("montaje"),
    shopIntro: "Buscá por ancho y medida:",
    shopLinks: [L.m185, L.m175, L.equivalencias, L.todos],
  },
  "perfil-del-neumatico-que-significa": {
    cover: cover("grenlanderPerfilBajo"),
    figure: figure("balanceando"),
    shopIntro: "Verificá la equivalencia y mirá las medidas:",
    shopLinks: [L.equivalencias, L.todos, L.indice],
  },
  "neumatico-radial-que-significa-la-r": {
    cover: cover("kingpro"),
    figure: figure("rotacion"),
    shopIntro: "Con tu medida a mano:",
    shopLinks: [L.todos, L.ofertas, L.indice],
  },
  "rodado-del-neumatico-que-significa": {
    cover: cover("montaje"),
    figure: figure("cambioCamioneta"),
    shopIntro: "Mirá las medidas por rodado:",
    shopLinks: [L.r14, L.r15, L.r16, L.equivalencias],
  },
  "m-s-barro-y-nieve-que-significa-en-el-neumatico": {
    cover: cover("atClasica"),
    figure: figure("pickup4x4"),
    shopIntro: "Neumáticos para camino de tierra y uso mixto:",
    shopLinks: [L.at, L.ht, L.todos],
  },
  "xl-extra-load-que-significa-en-el-neumatico": {
    cover: cover("camionetas"),
    figure: figure("cargaDos"),
    shopIntro: "Buscá por medida e índice de carga:",
    shopLinks: [L.indice, L.carga, L.todos],
  },
  "perfil-bajo-o-perfil-alto": {
    cover: cover("grenlanderPerfilBajo"),
    figure: { src: IMG.balanceando, alt: "Técnico balanceando una rueda en la balanceadora del taller", caption: "Al cambiar de rodado la rueda nueva se balancea antes de volver al auto." },
    shopIntro: "Verificá la equivalencia y mirá las medidas:",
    shopLinks: [L.equivalencias, L.todos, L.indice],
  },
  "desgaste-irregular-de-neumaticos": {
    cover: cover("alineadora3d"),
    figure: { src: IMG.rotacion, alt: "Rueda desmontada durante una rotación en el taller", caption: "Con la rueda afuera se ve mejor el patrón de desgaste." },
    shopIntro: "Corregí la causa y renová las cubiertas:",
    shopLinks: [L.servicios, L.todos, L.ofertas],
  },
  "antiguedad-del-neumatico-codigo-dot": {
    cover: cover("remisTaller"),
    figure: { src: IMG.montaje, alt: "Cubierta montada en la desmontadora del taller", caption: "Antes de montar una cubierta se controla su estado y su fecha de fabricación." },
    shopIntro: "Mirá las medidas disponibles:",
    shopLinks: [L.todos, L.ofertas, L.servicios],
  },
  "rueda-de-auxilio-como-revisarla": {
    cover: cover("cambioCamioneta"),
    figure: { src: IMG.camionetas, alt: "Camionetas sobre los elevadores del taller", caption: "Con la rueda afuera se controla también el auxilio." },
    shopIntro: "Si necesitás una llave o un juego nuevo:",
    shopLinks: [L.tuercas, L.servicios, L.todos],
  },
  "sintomas-alineacion-balanceo-o-rotacion": {
    cover: cover("colocandoTarget"),
    figure: { src: IMG.autoRojoTarget, alt: "Auto con el target de la alineadora 3D colocado en la rueda", caption: "La alineadora 3D mide los ángulos de cada rueda." },
    shopIntro: "Mirá los servicios del taller:",
    shopLinks: [L.servicios, L.todos, L.ofertas],
  },
  "como-preparar-el-cambio-de-neumaticos": {
    cover: cover("alineacion"),
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
