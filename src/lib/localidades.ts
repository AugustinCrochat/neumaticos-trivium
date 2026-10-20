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
  // --- Sucursal San Justo (Buenos Aires). Los tiempos son aproximados, sin
  // tráfico: validarlos con el equipo antes de confiar en ellos como dato duro.
  {
    slug: "san-justo",
    name: "San Justo",
    province: "Buenos Aires",
    branchId: "san-justo",
    esCabecera: true,
    minutosHastaSucursal: 5,
    comoLlegar:
      "El local está en Pres. Juan Domingo Perón 2847, en San Justo, partido de La Matanza. Si venís desde Ramos Mejía, Villa Luzuriaga o el resto de La Matanza, es cuestión de sumar el destino en Google Maps y llegar en auto.",
    intro:
      "Trivium abrió su sucursal de Buenos Aires en San Justo, en el corazón de La Matanza. Es el mismo modelo de outlet que ya funciona en Córdoba: importamos neumáticos directo de fábrica y los vendemos al público sin pasar por distribuidores intermedios.",
    porQue:
      "La Matanza es el partido con más autos de la provincia, y el que más neumáticos gasta. Para quien vive acá, tener el local en San Justo significa comparar precio sin cruzar la General Paz ni ir hasta el microcentro. Mirá las medidas y los precios en la web y comparalos con lo que te cotizan: en un juego de cuatro la diferencia se nota.",
    incluye: ["Ramos Mejía", "Villa Luzuriaga", "Isidro Casanova", "Laferrere", "González Catán", "Lomas del Mirador"],
  },
  {
    slug: "villa-luzuriaga",
    name: "Villa Luzuriaga",
    province: "Buenos Aires",
    branchId: "san-justo",
    minutosHastaSucursal: 8,
    comoLlegar:
      "Villa Luzuriaga está pegada a San Justo, dentro del mismo partido: se llega en auto en menos de diez minutos, sin salir de La Matanza ni tomar autopista. Sumá la dirección del local en Google Maps y te marca el recorrido exacto desde tu casa.",
    intro:
      "Villa Luzuriaga es el barrio de La Matanza que queda justo al lado de San Justo, entre Ramos Mejía y el centro del partido. Para quien vive o trabaja acá, el local de Trivium es la opción de neumáticos más cercana que hay: no hace falta ir hasta el microcentro ni cruzar la General Paz.",
    porQue:
      "Es una zona de mucho tránsito diario, con gente que usa el auto para trabajar y cambia cubiertas seguido. Por eso conviene comparar: el neumático que vendemos es de importación directa y sale bastante menos que en una cadena. Mirá tu medida en la web, comparala con la cotización que ya tenés y, si te sirve, pasás a verlo, porque queda a unas pocas cuadras.",
    incluye: ["Ramos Mejía"],
  },
  {
    slug: "ramos-mejia",
    name: "Ramos Mejía",
    province: "Buenos Aires",
    branchId: "san-justo",
    minutosHastaSucursal: 12,
    comoLlegar:
      "Desde el centro de Ramos Mejía se llega a San Justo en unos doce minutos en auto, siguiendo hacia el sur por La Matanza. Desde la zona de la estación o de Av. de Mayo conviene dejarle a Google Maps la elección del camino según el tránsito.",
    intro:
      "Ramos Mejía es una de las zonas comerciales más fuertes del oeste del Gran Buenos Aires, y desde ahí San Justo queda a un viaje corto. Es un público que compara precios antes de comprar, y Trivium está pensado para eso: stock y precios publicados en la web, sin tener que ir a preguntar.",
    porQue:
      "En Ramos Mejía hay muchas gomerías y casas de neumáticos, cada una con su lista de precios. Antes de cambiar las cuatro cubiertas vale la pena ver cuánto sale el mismo neumático en un outlet de importación directa: en un juego completo la diferencia suele pagar el viaje. Elegí tu medida en la web, comparala y decidí con el número en la mano.",
    incluye: ["Ramos Mejía centro"],
  },
  {
    slug: "lomas-del-mirador",
    name: "Lomas del Mirador",
    province: "Buenos Aires",
    branchId: "san-justo",
    minutosHastaSucursal: 10,
    comoLlegar:
      "Lomas del Mirador está en el mismo partido, al noreste de San Justo: son unos diez minutos en auto, con el tránsito normal de la zona. Google Maps calcula el recorrido exacto desde tu domicilio y te avisa si hay demoras.",
    intro:
      "Lomas del Mirador es un barrio grande y muy poblado de La Matanza, con muchísimos autos de uso diario. Para quien vive acá, San Justo es el centro más cercano para comprar neumáticos sin ir hasta Capital.",
    porQue:
      "Una zona con tanto parque automotor tiene precios muy parejos entre gomerías, y casi nadie se anima a comparar contra una importación directa. Si estás por cambiar las cubiertas, mirá el precio de tu medida en nuestra web y compará con lo que te dieron: al ser neumáticos nuevos con garantía de un año, la comparación es de igual a igual.",
    incluye: ["Lomas del Mirador centro"],
  },
  {
    slug: "ciudad-evita",
    name: "Ciudad Evita",
    province: "Buenos Aires",
    branchId: "san-justo",
    minutosHastaSucursal: 15,
    comoLlegar:
      "Desde Ciudad Evita se llega a San Justo en unos quince minutos aproximadamente, yendo por las avenidas principales de La Matanza. Según la hora puede haber más tránsito: dejale a Google Maps la elección del camino.",
    intro:
      "Ciudad Evita queda sobre el límite sur de La Matanza, cerca del Aeropuerto de Ezeiza por autopista y del Camino de Cintura. Desde ahí San Justo es el punto de compra de neumáticos más cercano con stock real y precios publicados.",
    porQue:
      "Para quien viaja seguido por la Autopista Ezeiza–Cañuelas, el Camino de Cintura o el Acceso Oeste, el desgaste del neumático se nota rápido. Si tenés que reponer, comparar un precio de outlet de importación directa contra el de tu gomería de siempre te puede ahorrar lo suficiente como para justificar el viaje a San Justo.",
    incluye: ["Ciudad Evita centro", "Rafael Castillo"],
  },
  {
    slug: "isidro-casanova",
    name: "Isidro Casanova",
    province: "Buenos Aires",
    branchId: "san-justo",
    minutosHastaSucursal: 15,
    comoLlegar:
      "Desde Isidro Casanova se llega por Ruta 3 hacia el norte: son unos quince minutos aproximadamente hasta San Justo, según el tránsito. Es un recorrido directo, sin cruzar de partido.",
    intro:
      "Isidro Casanova es uno de los núcleos más poblados de La Matanza, con mucho comercio y mucho tránsito sobre la Ruta 3. San Justo queda a un viaje corto y directo, sobre la misma ruta.",
    porQue:
      "Con tanta gente que se mueve en auto por Ruta 3, el neumático es un gasto recurrente. Lo que ofrecemos es precio de importación directa, con neumáticos nuevos y garantía de un año por defecto de fábrica. Mirá tu medida en la web, comparala con tu cotización y, si te conviene, te pasás por San Justo.",
    incluye: ["Isidro Casanova centro"],
  },
  {
    slug: "laferrere",
    name: "Laferrere",
    province: "Buenos Aires",
    branchId: "san-justo",
    minutosHastaSucursal: 20,
    comoLlegar:
      "Desde Laferrere se llega a San Justo por Ruta 3 hacia el norte, en unos veinte minutos aproximadamente, según el tránsito. Para elegir el recorrido más rápido a tu hora, Google Maps es lo más confiable.",
    intro:
      "Laferrere es de las localidades más grandes del oeste de La Matanza, y desde ahí San Justo queda sobre la misma Ruta 3, a un trayecto de unos veinte minutos.",
    porQue:
      "Quien vive en Laferrere suele hacer muchos kilómetros por día y conoce bien lo que cuesta reponer neumáticos. Antes de pagar el precio de siempre, conviene mirar cuánto sale tu medida en un outlet con importación directa: los neumáticos son nuevos, tienen un año de garantía por defecto de fábrica y el precio publicado en la web es el que se cobra en el local.",
    incluye: ["Laferrere centro", "Gregorio de Laferrère"],
  },
  {
    slug: "gonzalez-catan",
    name: "González Catán",
    province: "Buenos Aires",
    branchId: "san-justo",
    minutosHastaSucursal: 25,
    comoLlegar:
      "Desde González Catán se llega a San Justo por Ruta 3 hacia el norte: son unos veinticinco minutos aproximadamente, según el tránsito y la hora. Dejale a Google Maps la elección del camino.",
    intro:
      "González Catán está en el extremo oeste de La Matanza, y desde ahí San Justo es el local de neumáticos con precios publicados más cercano. Es un viaje de unos veinticinco minutos por la Ruta 3.",
    porQue:
      "Si hacés el trayecto largo por Ruta 3 todos los días, la cubierta se gasta más rápido y reponerla es un gasto grande. Vale la pena ver el precio de tu medida en nuestra web: al comprar un juego de cuatro la diferencia contra una gomería habitual puede cubrir sobradamente el viaje hasta San Justo.",
    incluye: ["González Catán centro", "Virrey del Pino"],
  },
  {
    slug: "aldo-bonzi",
    name: "Aldo Bonzi",
    province: "Buenos Aires",
    branchId: "san-justo",
    minutosHastaSucursal: 15,
    comoLlegar:
      "Aldo Bonzi queda al este de San Justo, ya sobre el límite con la Ciudad: se llega en unos quince minutos aproximadamente, según el tránsito. Google Maps te marca el recorrido exacto desde tu casa.",
    intro:
      "Aldo Bonzi es un barrio de La Matanza muy cercano al límite con Capital Federal y a la zona de la Av. General Paz. Para quien vive acá, San Justo es el punto de compra de neumáticos en La Matanza más cercano.",
    porQue:
      "Los vecinos de Aldo Bonzi y Tapiales suelen cambiar neumáticos en gomerías del barrio o cruzan a Capital. Comparar el precio de tu medida contra un outlet de importación directa es sencillo: lo ves en la web antes de moverte y, si te conviene, te llegás a San Justo.",
    incluye: ["Aldo Bonzi centro", "Tapiales", "La Tablada", "Villa Celina"],
  },
  {
    slug: "ciudadela",
    name: "Ciudadela",
    province: "Buenos Aires",
    branchId: "san-justo",
    minutosHastaSucursal: 15,
    comoLlegar:
      "Desde Ciudadela se llega a San Justo en unos quince minutos aproximadamente, cruzando hacia La Matanza. Según la hora puede haber más tránsito: dejale a Google Maps la elección del camino.",
    intro:
      "Ciudadela es del partido de Tres de Febrero, pero queda pegada a La Matanza, y desde ahí San Justo es un viaje corto. Es una zona con muchísimo comercio y mucho auto de uso diario.",
    porQue:
      "En Ciudadela hay muchas gomerías y casas de neumáticos, y los precios son bastante parecidos entre sí. Comparar contra un outlet de importación directa es la forma más simple de saber si estás pagando de más: lo ves en la web, sin moverte, y recién después decidís si te conviene el viaje.",
    incluye: ["Ciudadela centro"],
  },
  {
    slug: "villa-madero",
    name: "Villa Madero",
    province: "Buenos Aires",
    branchId: "san-justo",
    minutosHastaSucursal: 10,
    comoLlegar:
      "Villa Madero queda al noreste de San Justo, dentro de La Matanza: son unos diez minutos en auto, con el tránsito normal de la zona. Google Maps calcula el recorrido exacto desde tu domicilio.",
    intro:
      "Villa Madero es un barrio comercial y residencial de La Matanza, muy cerca de San Justo. Quien vive acá tiene el local de Trivium a pocos minutos.",
    porQue:
      "Al estar a pocos minutos, el trámite es simple: ves el precio publicado en la web, lo comparás y, si te conviene, pasás por el local. Mirá tu medida, comparala con lo que te cotizaron en otro lado y, si te conviene, pasás.",
    incluye: ["Villa Madero centro", "La Tablada"],
  },
  {
    slug: "moron",
    name: "Morón",
    province: "Buenos Aires",
    branchId: "san-justo",
    minutosHastaSucursal: 15,
    comoLlegar:
      "Morón limita con La Matanza, así que el trayecto es corto: desde Morón centro, Haedo o Castelar se llega a San Justo en auto en un cuarto de hora aproximadamente, según el tránsito. Google Maps te marca el recorrido exacto desde tu casa.",
    intro:
      "Morón es uno de los partidos vecinos a La Matanza, y desde Haedo, Castelar o el centro de Morón San Justo queda a un cuarto de hora aproximadamente. Es el cliente que más nos queda a mano: no hace falta salir de la zona oeste para comprar a precio de outlet.",
    porQue:
      "En Morón, Haedo y Castelar hay muchísima oferta de gomerías y negocios de neumáticos, y cada uno cotiza distinto. Vale la pena cruzar al local de San Justo a comparar: el neumático que vendemos es importación directa, sin el margen de un mayorista en el medio. Mirá tu medida en la web, llevá la cotización que te hicieron y compará.",
    incluye: ["Haedo", "Castelar", "El Palomar", "Villa Sarmiento"],
  },
  {
    slug: "tres-de-febrero",
    name: "Tres de Febrero",
    province: "Buenos Aires",
    branchId: "san-justo",
    minutosHastaSucursal: 20,
    comoLlegar:
      "Desde Ciudadela, Caseros o Santos Lugares se llega a San Justo por el límite con La Matanza, en unos veinte minutos aproximadamente. Desde Villa Bosch o Loma Hermosa conviene tomar Ruta 3 o la General Paz según el tránsito del momento.",
    intro:
      "Tres de Febrero es frontera directa con La Matanza: Ciudadela y Villa Luzuriaga están pegadas, separadas por una avenida. Para quien vive en Caseros, Ciudadela, Santos Lugares o Villa Bosch, San Justo es un viaje corto en auto.",
    porQue:
      "En Caseros, Santos Lugares y Ciudadela se junta gente que maneja a diario por la General Paz y el Acceso Oeste, y es la que más neumáticos gasta. Si vas a cambiar las cuatro cubiertas, comparar el precio de un outlet de importación directa contra el de tu gomería habitual puede cubrir de sobra el viaje a San Justo.",
    incluye: ["Caseros", "Ciudadela", "Santos Lugares", "Villa Bosch", "Martín Coronado", "Loma Hermosa", "José Ingeniero", "Villa Raffo"],
  },
  {
    slug: "hurlingham",
    name: "Hurlingham",
    province: "Buenos Aires",
    branchId: "san-justo",
    minutosHastaSucursal: 25,
    comoLlegar:
      "Desde Hurlingham, Villa Tesei o William C. Morris se cruza hacia el sur por Morón hasta La Matanza: son unos veinticinco minutos aproximadamente, según el tránsito. Google Maps arma el recorrido más rápido en el momento.",
    intro:
      "Hurlingham es un partido chico y muy residencial del oeste. La mayoría de los autos de la zona son de uso diario para trabajar o llevar a los chicos a la escuela, y eso se traduce en desgaste parejo y recambio de las cuatro cubiertas más o menos al mismo tiempo.",
    porQue:
      "Ese tipo de uso es justo el que hace que valga comparar precios: cuando cambiás las cuatro, la diferencia entre un neumático de outlet y uno de gomería se multiplica por cuatro. San Justo queda a media hora de Hurlingham. Mirá tu medida en la web y fijate cuánto sale antes de decidir.",
    incluye: ["Villa Tesei", "William C. Morris", "Hurlingham centro"],
  },
  {
    slug: "ituzaingo",
    name: "Ituzaingó",
    province: "Buenos Aires",
    branchId: "san-justo",
    minutosHastaSucursal: 25,
    comoLlegar:
      "Desde Ituzaingó norte o sur se baja hacia Morón y de ahí a La Matanza: son unos veinticinco minutos aproximadamente. Si salís por el Acceso Oeste, el tránsito de la hora pico cambia bastante el tiempo, así que conviene consultar Google Maps antes de salir.",
    intro:
      "Ituzaingó es uno de los partidos del oeste con más gente que viaja todos los días a Capital: el Acceso Oeste y el Camino del Buen Ayre le dan a los autos kilómetros de autopista y mucha frenada. Los neumáticos se gastan distinto a un uso urbano chico.",
    porQue:
      "Con ese uso conviene mirar no solo el precio sino el índice de velocidad y la carga del neumático. En el local te ayudamos a elegir según cómo manejás y cuántos kilómetros hacés por semana, y comparás contra lo que te cotizaron en tu zona.",
    incluye: ["Ituzaingó Norte", "Ituzaingó Sur", "Villa Udaondo", "Parque Leloir"],
  },
  {
    slug: "merlo",
    name: "Merlo",
    province: "Buenos Aires",
    branchId: "san-justo",
    minutosHastaSucursal: 25,
    comoLlegar:
      "Merlo limita con La Matanza por el sur. Desde Merlo centro, Parque San Martín o Libertad se llega a San Justo en unos veinticinco minutos aproximadamente. Según el horario, el tránsito en las avenidas principales puede sumar bastante.",
    intro:
      "Merlo es un partido grande y con mucha población en barrios que dependen del auto: Libertad, San Antonio de Padua, Pontevedra, Mariano Acosta. Para esa zona, tener un outlet de neumáticos a mano en La Matanza ahorra cruzar a Morón o a Capital.",
    porQue:
      "Cuando el auto es herramienta de trabajo, el precio del neumático pesa en el presupuesto del mes. Vale la pena comparar: en San Justo vendemos importación directa y en la web ves el precio de cada medida antes de ir. Si tenés una cotización de tu gomería, traela y compará.",
    incluye: ["Libertad", "San Antonio de Padua", "Pontevedra", "Mariano Acosta", "Parque San Martín"],
  },
  {
    slug: "san-martin",
    name: "San Martín",
    province: "Buenos Aires",
    branchId: "san-justo",
    minutosHastaSucursal: 30,
    comoLlegar:
      "Desde San Martín, Villa Ballester o José León Suárez se llega por la General Paz o por las avenidas que bajan hacia La Matanza; son unos treinta minutos aproximadamente, y en hora pico bastante más. Conviene verificar en Google Maps antes de salir.",
    intro:
      "San Martín es el partido más industrial del norte del conurbano, con mucha gente que maneja a diario para trabajar y no pocos autos de uso comercial. Es una zona con muchas gomerías, pero no tanta oferta de neumáticos importados a precio de outlet.",
    porQue:
      "San Justo no es el local más cercano de San Martín, y es una verdad: te queda a una media hora larga. Lo que lo justifica es el precio, sobre todo si vas a cambiar el juego completo o cubrir más de un vehículo. Mirá tu medida en la web y calculá si la diferencia compensa el viaje.",
    incluye: ["Villa Ballester", "José León Suárez", "Billinghurst", "Villa Lynch", "Santos Lugares", "Loma Hermosa"],
  },
  {
    slug: "esteban-echeverria",
    name: "Esteban Echeverría",
    province: "Buenos Aires",
    branchId: "san-justo",
    minutosHastaSucursal: 25,
    comoLlegar:
      "Esteban Echeverría limita con La Matanza hacia el sureste. Desde Monte Grande, Luis Guillón o El Jagüel se llega a San Justo en unos veinticinco minutos aproximadamente, según el tránsito. Google Maps arma el trayecto más rápido en el momento.",
    intro:
      "Esteban Echeverría reúne Monte Grande, Luis Guillón, El Jagüel y 9 de Abril, con mucha gente que depende del auto para llegar a Capital o al resto del conurbano. Es una zona sur que tiene a La Matanza como vecino directo.",
    porQue:
      "Si venís de Monte Grande o Luis Guillón, cruzar a San Justo es un viaje corto, y para un cambio de cuatro neumáticos puede ser más conveniente que ir a Capital. Sumá la medida en la web, fijate el precio y comparalo con lo que te cotizan donde sueles ir.",
    incluye: ["Monte Grande", "Luis Guillón", "El Jagüel", "9 de Abril", "Canning"],
  },
  {
    slug: "ezeiza",
    name: "Ezeiza",
    province: "Buenos Aires",
    branchId: "san-justo",
    minutosHastaSucursal: 30,
    comoLlegar:
      "Desde Ezeiza o Tristán Suárez se llega a La Matanza en unos treinta minutos aproximadamente. La Autopista Ricchieri y las rutas de la zona sirven de referencia, pero el recorrido más rápido depende del momento: usá Google Maps antes de salir.",
    intro:
      "Ezeiza combina barrios cerrados, zonas rurales y la autopista de acceso al aeropuerto. Quien vive ahí suele hacer bastantes kilómetros por semana, y el neumático es un gasto que se repite más seguido que en uso urbano.",
    porQue:
      "Con ese uso conviene comparar bien el precio por juego completo. Desde Ezeiza y Tristán Suárez, San Justo queda a media hora aproximadamente, y para cambiar las cuatro cubiertas la diferencia de precio puede justificar el viaje. Mirá tu medida en la web antes de salir.",
    incluye: ["Tristán Suárez", "Canning", "La Unión", "Carlos Spegazzini"],
  },
  {
    slug: "capital-federal",
    name: "Capital Federal",
    province: "Ciudad Autónoma de Buenos Aires",
    branchId: "san-justo",
    minutosHastaSucursal: 30,
    comoLlegar:
      "Desde los barrios del oeste y sur de la Ciudad (Liniers, Mataderos, Villa Luro, Parque Avellaneda) se llega a La Matanza por la General Paz o por la Ruta 3 en unos treinta minutos aproximadamente, según el tránsito. Google Maps te marca el recorrido desde tu barrio.",
    intro:
      "Muchos vecinos de la Ciudad cruzan la General Paz para comprar neumáticos: los precios de los comercios de Capital incluyen alquileres caros, y el neumático termina costando más. San Justo queda del otro lado de la avenida.",
    porQue:
      "Si vivís en el oeste o sur de la Ciudad, salir por la General Paz hacia La Matanza es un trayecto corto. Para un cambio de cuatro neumáticos, la diferencia entre el precio de Capital y el de un outlet de importación directa justifica el viaje. Mirá tu medida en la web, compará, y decidí.",
    incluye: ["Liniers", "Mataderos", "Villa Luro", "Parque Avellaneda", "Villa Lugano", "Floresta"],
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
