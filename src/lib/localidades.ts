import { BRANCHES, type Branch } from "./config";

/**
 * Localidades con página propia en /neumaticos-en/[localidad].
 *
 * Cada una es una landing de SEO local: apunta a "neumáticos en <localidad>",
 * "gomería en <localidad>" y "cubiertas <localidad>", que son términos que la
 * ficha de sucursal no puede cubrir sola porque apunta a la marca + el barrio.
 *
 * Para sumar una localidad alcanza con agregar una entrada acá y sumar el
 * `name` al `areaServed` de la sucursal correspondiente en config.ts. La ruta,
 * el sitemap, el schema y los enlaces internos salen solos.
 *
 * IMPORTANTE: cada entrada necesita `intro` y `porQue` propios. Si dos
 * localidades comparten el texto, Google las trata como doorway pages y puede
 * dejar de indexar las dos. El contenido único es lo que sostiene la página.
 */
export type Localidad = {
  slug: string;
  /** Nombre tal cual se escribe ("Villa Allende"). */
  name: string;
  province: string;
  /** Sucursal que la atiende. */
  branchId: string;
  /** true en la ciudad cabecera — usa un H1 y un copy de mayor alcance. */
  esCabecera?: boolean;
  /** Minutos de auto hasta la sucursal, aproximado y honesto. */
  minutosHastaSucursal: number;
  /** Cómo se llega desde esta localidad. Texto real, no relleno. */
  comoLlegar: string;
  /** Párrafo de apertura, único por localidad. */
  intro: string;
  /** Por qué a alguien de esta localidad le conviene venir. Único. */
  porQue: string;
  /** Barrios / zonas menores que también cubre esta página. */
  incluye?: string[];
};

export const LOCALIDADES: Localidad[] = [
  {
    slug: "cordoba",
    name: "Córdoba",
    province: "Córdoba",
    branchId: "arguello",
    esCabecera: true,
    minutosHastaSucursal: 20,
    comoLlegar:
      "Desde el centro de Córdoba se llega por Av. Colón y Av. Donato Álvarez derecho hasta la altura 7971, o por Av. Rafael Núñez y Av. Ricardo Rojas si venís desde Cerro de las Rosas. Hay estacionamiento sobre la avenida.",
    intro:
      "Trivium es un outlet de neumáticos con local a la calle en Córdoba Capital. Importamos directo de fábrica y vendemos al público sin intermediarios, así que el mismo neumático que en una cadena te sale bastante menos. Tenés el stock y el precio publicados en la web antes de venir: si figura disponible, está físicamente en el local de Av. Donato Álvarez.",
    porQue:
      "En Córdoba la mayoría de las gomerías trabaja por encargo: te cotizan, piden el neumático al distribuidor y volvés dos días después. Nosotros tenemos el stock en el local y el taller propio al lado, así que se compra, se coloca y se balancea en la misma visita. La colocación y el cambio de válvulas no se cobran si comprás el neumático acá.",
    incluye: [
      "Cerro de las Rosas",
      "Villa Belgrano",
      "Nueva Córdoba",
      "General Paz",
      "Alta Córdoba",
      "Alto Verde",
    ],
  },
  {
    slug: "arguello",
    name: "Argüello",
    province: "Córdoba",
    branchId: "arguello",
    minutosHastaSucursal: 2,
    comoLlegar:
      "Estamos sobre la misma Av. Donato Álvarez al 7971, en pleno Argüello. Si vivís en el barrio, llegás caminando o con cinco minutos de auto desde cualquier punto.",
    intro:
      "El local de Trivium está en Argüello, sobre Av. Donato Álvarez al 7971. Es nuestra casa: acá está el depósito, el taller de alineación y balanceo, y la atención al público. Para alguien del barrio significa que no hay que bajar al centro ni pedir el neumático a un distribuidor — está en el mostrador.",
    porQue:
      "Ser la gomería del barrio nos obliga a otra cosa: los clientes de Argüello vuelven, nos cruzan en el supermercado y nos recomiendan entre vecinos. Por eso trabajamos por orden de llegada sin turno, avisamos por WhatsApp cuánta espera hay, y si algo sale mal lo resolvemos en el mismo local. La garantía de un año se hace efectiva acá, no por formulario.",
    incluye: ["Villa Warcalde", "Argüello Norte", "Los Carolinos", "Quintas de Argüello"],
  },
  {
    slug: "villa-allende",
    name: "Villa Allende",
    province: "Córdoba",
    branchId: "arguello",
    minutosHastaSucursal: 10,
    comoLlegar:
      "Bajás por Av. Goycoechea hasta empalmar con Av. Donato Álvarez y seguís derecho hacia Córdoba unos 10 minutos. Estamos sobre la avenida, a mano, antes de llegar al centro de Argüello.",
    intro:
      "Villa Allende está a diez minutos del local, y buena parte de nuestros clientes viene de ahí. Es lógico: en Villa Allende hay gomerías de servicio, pero casi ninguna tiene depósito propio de neumáticos importados, así que el precio termina cargando el margen del distribuidor intermedio.",
    porQue:
      "El camino de Villa Allende a Argüello es corto y directo, y la diferencia de precio sobre un juego de cuatro neumáticos justifica de sobra el viaje. Podés consultar disponibilidad por WhatsApp antes de salir de tu casa: te confirmamos si la medida está en stock y cuánto vas a esperar, así venís una sola vez.",
    incluye: ["Lomas de Villa Allende", "Villa Allende Golf", "El Talar"],
  },
  {
    slug: "saldan",
    name: "Saldán",
    province: "Córdoba",
    branchId: "arguello",
    minutosHastaSucursal: 12,
    comoLlegar:
      "Salís de Saldán por Av. San Martín hacia el este y empalmás con Av. Donato Álvarez a la altura de Argüello. Son unos 12 minutos sin tráfico.",
    intro:
      "Saldán tiene gomerías para arreglar una pinchadura, pero ninguna con depósito propio de neumáticos importados: el que necesita cambiar las cuatro cubiertas termina yendo a Córdoba o a Villa Allende igual. Estamos a mitad de camino, sobre la avenida por la que ya pasás.",
    porQue:
      "Los caminos de Saldán y la subida hacia las sierras castigan bastante los neumáticos: el desgaste irregular y las vibraciones aparecen antes que en uso puramente urbano. Por eso conviene hacer alineación y balanceo junto con el cambio, y no sólo poner las gomas nuevas. Lo hacemos en el mismo local, en la misma visita.",
  },
  {
    slug: "la-calera",
    name: "La Calera",
    province: "Córdoba",
    branchId: "arguello",
    minutosHastaSucursal: 15,
    comoLlegar:
      "Tomás la ruta E-55 hacia Córdoba y empalmás con Av. Donato Álvarez. Son unos 15 minutos hasta el 7971.",
    intro:
      "Desde La Calera hasta el local hay un cuarto de hora por la E-55. Es la misma distancia que hasta el centro de Córdoba, pero sin meterse en el tránsito céntrico ni pagar estacionamiento.",
    porQue:
      "Las gomerías de La Calera resuelven bien una pinchadura, pero para un neumático de camioneta nuevo suelen terminar pidiéndolo a un distribuidor de Córdoba igual. El tramo de ripio y los accesos son duros con los flancos: si vivís ahí, te conviene mirar índices de carga y no sólo el precio — te asesoramos con eso antes de venderte nada. Tenemos medidas de camioneta y neumáticos de carga (R15C, R16C) en stock, que es justamente lo que más se pincha en esa zona.",
  },
  {
    slug: "mendiolaza",
    name: "Mendiolaza",
    province: "Córdoba",
    branchId: "arguello",
    minutosHastaSucursal: 15,
    comoLlegar:
      "Bajás por la ruta E-53 hacia Córdoba, cruzás Villa Allende y seguís por Av. Donato Álvarez. Unos 15 minutos en total.",
    intro:
      "Mendiolaza está sobre el corredor de la E-53, el mismo por el que bajan a Córdoba miles de personas todos los días. Estamos justo sobre ese recorrido, así que el cambio de neumáticos no te obliga a un viaje aparte.",
    porQue:
      "La gomería más cercana en Mendiolaza resuelve bien el día a día (pinchaduras, balanceo), pero no maneja el volumen de stock importado que tenemos nosotros, así que para un juego completo conviene bajar directo. Si hacés la E-53 a diario, tus neumáticos acumulan muchos más kilómetros de ruta que de ciudad, y el desgaste es distinto: se van los hombros antes que el centro. Vale la pena elegir una banda de rodamiento pensada para ruta y revisar la alineación cada 10.000 km. Podemos asesorarte según cuántos kilómetros hacés por semana.",
  },
  {
    slug: "unquillo",
    name: "Unquillo",
    province: "Córdoba",
    branchId: "arguello",
    minutosHastaSucursal: 20,
    comoLlegar:
      "Por la ruta E-53 hacia Córdoba, pasando Mendiolaza y Villa Allende, hasta empalmar con Av. Donato Álvarez. Son unos 20 minutos.",
    intro:
      "Unquillo queda a veinte minutos por la E-53. Los que bajan a Córdoba a trabajar pasan por la puerta todos los días, y suelen dejar el auto a la mañana y pasarlo a buscar a la vuelta.",
    porQue:
      "En Unquillo hay gomerías de barrio para el service rápido, pero ninguna con el stock de neumáticos importados que manejamos nosotros. Trabajar por orden de llegada, sin turno, y con el taller en el mismo local hace que puedas resolverlo en una parada del recorrido que ya hacés. Escribinos por WhatsApp cuando salgas y te decimos si hay cola, así no perdés el viaje.",
  },
  {
    slug: "rio-ceballos",
    name: "Río Ceballos",
    province: "Córdoba",
    branchId: "arguello",
    minutosHastaSucursal: 25,
    comoLlegar:
      "Todo por la ruta E-53 hacia Córdoba: Unquillo, Mendiolaza, Villa Allende y empalme con Av. Donato Álvarez. Unos 25 minutos.",
    intro:
      "Río Ceballos es el punto más lejano del corredor de las Sierras Chicas que atendemos. Son 25 minutos de bajada por la E-53, y aun así compensa: la diferencia de precio en un juego de cuatro suele ser mayor que el costo del viaje.",
    porQue:
      "Las gomerías de Río Ceballos resuelven el service del día a día, pero para neumáticos importados en la medida exacta que necesitás, conviene bajar hasta el outlet. Manejar en Sierras Chicas implica pendientes, frenadas largas y curvas cerradas, todo lo que más exige a un neumático. Ahí la profundidad de dibujo y el índice de velocidad correcto no son un detalle. Te mostramos las opciones que hay en tu medida y te explicamos la diferencia real entre una y otra, sin empujarte a la más cara.",
  },
];

export function getLocalidad(slug: string): Localidad | undefined {
  return LOCALIDADES.find((l) => l.slug === slug);
}

export function getBranchForLocalidad(localidad: Localidad): Branch {
  // Cae a la primera sucursal si el branchId quedó desactualizado, para que una
  // localidad huérfana no rompa el build entero.
  return BRANCHES.find((b) => b.id === localidad.branchId) ?? BRANCHES[0];
}

/** Localidades atendidas por una sucursal, para enlazar desde su ficha. */
export function localidadesDeSucursal(branchId: string): Localidad[] {
  return LOCALIDADES.filter((l) => l.branchId === branchId);
}
