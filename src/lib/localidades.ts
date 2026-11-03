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
  /** slug de la ciudad que la engloba, si es un barrio/localidad menor: en los
      listados de zonas se muestra dentro del desplegable de esa ciudad. */
  parent?: string;
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
    name: "Córdoba Capital",
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
    parent: "cordoba",
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
    slug: "cerro-de-las-rosas",
    name: "Cerro de las Rosas",
    province: "Córdoba",
    branchId: "arguello",
    parent: "cordoba",
    minutosHastaSucursal: 10,
    comoLlegar:
      "Desde Cerro de las Rosas se llega al local de Argüello en unos diez minutos en auto, bajando hacia el noroeste de la ciudad. Google Maps te marca el recorrido exacto desde tu cuadra y el tránsito del momento.",
    intro:
      "Cerro de las Rosas es una de las zonas comerciales más activas de Córdoba, con mucho auto de uso diario y poca oferta de neumáticos con precio publicado. Trivium queda a diez minutos, en Argüello, con stock a la vista y precios en la web antes de salir.",
    porQue:
      "Entre las concesionarias y las gomerías de paso, cambiar cubiertas en Cerro suele salir caro y sin comparar. Mirá tu medida en nuestra web, llevá la cotización que ya tenés y compará: son neumáticos nuevos de importación directa, con un año de garantía por defecto de fábrica.",
    incluye: ["Cerro de las Rosas centro", "Quebrada de las Rosas"],
  },
  {
    slug: "villa-belgrano",
    name: "Villa Belgrano",
    province: "Córdoba",
    branchId: "arguello",
    parent: "cordoba",
    minutosHastaSucursal: 12,
    comoLlegar:
      "Villa Belgrano queda hacia el norte de la ciudad: son unos doce minutos en auto hasta el local de Argüello, según el tránsito. Dejale a Google Maps la elección del recorrido desde tu casa.",
    intro:
      "Villa Belgrano es un barrio residencial de Córdoba con mucho parque automotor de gama media y alta, y para quien vive ahí Argüello es el local de neumáticos con precio publicado más cercano.",
    porQue:
      "En una zona de camionetas y autos familiares, reponer las cuatro cubiertas es un gasto importante. Antes de pagarlo, vale la pena ver cuánto sale la misma medida en un outlet de importación directa, con el stock y el precio a la vista en la web.",
    incluye: ["Villa Belgrano", "Villa Belgrano Norte"],
  },
  {
    slug: "urca",
    name: "Urca",
    province: "Córdoba",
    branchId: "arguello",
    parent: "cordoba",
    minutosHastaSucursal: 15,
    comoLlegar:
      "Desde Urca se llega al local de Argüello en unos quince minutos aproximadamente, cruzando el noroeste de la ciudad. Según la hora puede haber más tránsito: Google Maps calcula el recorrido exacto.",
    intro:
      "Urca es un barrio de Córdoba muy transitado, cerca de la zona universitaria y de los accesos al norte, con mucho auto de uso cotidiano. Para quien vive o trabaja ahí, Argüello queda a un viaje corto.",
    porQue:
      "Con tanto auto de uso diario, el neumático es un gasto que se repite. Mirá el precio de tu medida en la web antes de moverte, compará con tu gomería habitual y decidí con el número en la mano.",
    incluye: ["Urca", "Villa Centenario"],
  },
  {
    slug: "villa-rivera-indarte",
    name: "Villa Rivera Indarte",
    province: "Córdoba",
    branchId: "arguello",
    parent: "cordoba",
    minutosHastaSucursal: 12,
    comoLlegar:
      "Villa Rivera Indarte está al norte de Córdoba y queda a unos doce minutos en auto del local de Argüello, según el tránsito. Google Maps te marca el recorrido más rápido desde tu casa.",
    intro:
      "Villa Rivera Indarte es un barrio extenso del norte de la ciudad, de los que más viajan hacia el centro todos los días. Desde ahí, Argüello es el local de neumáticos más cercano con stock y precios publicados.",
    porQue:
      "Quien hace el trayecto diario al centro desgasta rápido las cubiertas, y reponerlas con precio de gomería de barrio suele ser caro. Mirá tu medida en la web y comparala: la diferencia de un juego de cuatro puede cubrir el viaje.",
    incluye: ["Villa Rivera Indarte", "Ampliación Rivera Indarte"],
  },
  {
    slug: "villa-cabrera",
    name: "Villa Cabrera",
    province: "Córdoba",
    branchId: "arguello",
    parent: "cordoba",
    minutosHastaSucursal: 15,
    comoLlegar:
      "Desde Villa Cabrera se llega a Argüello en unos quince minutos aproximadamente. Si vas desde la zona del Parque Sarmiento o de Nueva Córdoba, Google Maps te marca el camino más rápido a esa hora.",
    intro:
      "Villa Cabrera es un barrio residencial de Córdoba con muchos autos de uso familiar. Trivium queda a un viaje corto, y las medidas y los precios están publicados para ver todo antes de ir.",
    porQue:
      "En una zona donde casi todo el mundo usa el auto, vale la pena no cambiar cubiertas sin comparar. Elegí tu medida en la web, mirá el precio y la garantía de un año, y decidí si te conviene acercarte.",
    incluye: ["Villa Cabrera", "Observatorio"],
  },
  {
    slug: "general-paz",
    name: "General Paz",
    province: "Córdoba",
    branchId: "arguello",
    parent: "cordoba",
    minutosHastaSucursal: 20,
    comoLlegar:
      "General Paz queda hacia el este del centro: son unos veinte minutos en auto hasta Argüello, según el tránsito y la hora. Dejale a Google Maps la elección del camino.",
    intro:
      "General Paz es uno de los barrios más tradicionales y comerciales de Córdoba. Desde ahí, el local de Argüello es una opción de outlet de neumáticos que no obliga a pedir por encargo ni a esperar días.",
    porQue:
      "En una zona con tantas gomerías de barrio, los precios suelen ser parecidos entre sí. Comparar contra una importación directa es sencillo: lo ves en la web, sin moverte, y recién después decidís si te conviene el viaje.",
    incluye: ["General Paz", "Pueyrredón"],
  },
  {
    slug: "alta-cordoba",
    name: "Alta Córdoba",
    province: "Córdoba",
    branchId: "arguello",
    parent: "cordoba",
    minutosHastaSucursal: 20,
    comoLlegar:
      "Desde Alta Córdoba se llega a Argüello en unos veinte minutos aproximadamente. Según la hora hay más tránsito: Google Maps calcula el recorrido exacto desde tu domicilio.",
    intro:
      "Alta Córdoba es un barrio céntrico y muy poblado, con mucho comercio y tránsito, y desde ahí Argüello queda a un trayecto razonable para comprar neumáticos con precio publicado.",
    porQue:
      "Para un cambio de cuatro cubiertas, comparar el precio de una gomería céntrica con el de un outlet de importación directa puede marcar una diferencia importante. Mirá tu medida en la web y llevá tu cotización para comparar.",
    incluye: ["Alta Córdoba", "Barrio Colón"],
  },
  {
    slug: "nueva-cordoba",
    name: "Nueva Córdoba",
    province: "Córdoba",
    branchId: "arguello",
    parent: "cordoba",
    minutosHastaSucursal: 20,
    comoLlegar:
      "Desde Nueva Córdoba se llega a Argüello en unos veinte minutos en auto aproximadamente, por el norte de la ciudad. Dejale a Google Maps la elección del camino según el tránsito.",
    intro:
      "Nueva Córdoba es el barrio universitario de la ciudad, con muchos autos pero poca oferta de neumáticos a precio de mayorista. Argüello es la salida más directa hacia un local con stock a la vista.",
    porQue:
      "Si tenés auto en Córdoba y estás por cambiar las cubiertas, mirá el precio publicado de tu medida en nuestra web antes de decidir. Los neumáticos son nuevos, de importación directa, con un año de garantía por defecto de fábrica.",
    incluye: ["Nueva Córdoba", "Güemes", "Centro"],
  },
  {
    slug: "guemes",
    name: "Güemes",
    province: "Córdoba",
    branchId: "arguello",
    parent: "cordoba",
    minutosHastaSucursal: 22,
    comoLlegar:
      "Desde Güemes se llega al local de Argüello en unos veintidós minutos aproximadamente, según el tránsito. Google Maps te marca el recorrido más rápido a esa hora.",
    intro:
      "Güemes es un barrio céntrico y muy transitado de Córdoba, con mucha vida comercial y nocturna. Para quien vive o trabaja ahí, Argüello es un local de neumáticos con precio publicado a un viaje corto.",
    porQue:
      "En el centro de la ciudad el espacio comercial es caro, y eso se nota en el precio de las cubiertas. Ver tu medida en la web y compararla con tu cotización habitual es el primer paso para saber si te conviene el viaje.",
    incluye: ["Güemes", "San Vicente"],
  },
  {
    slug: "los-boulevares",
    name: "Los Boulevares",
    province: "Córdoba",
    branchId: "arguello",
    parent: "cordoba",
    minutosHastaSucursal: 12,
    comoLlegar:
      "Los Boulevares está al norte de la ciudad: son unos doce minutos en auto hasta el local de Argüello, según el tránsito. Dejale a Google Maps la elección del camino desde tu casa.",
    intro:
      "Los Boulevares es una zona residencial de Córdoba, de barrios cerrados y casas, con mucho auto de uso diario y camionetas. Argüello queda a un viaje corto.",
    porQue:
      "En una zona de camionetas y autos familiares, el neumático es un gasto importante. Mirá tu medida en la web, comparala con la cotización que tengas y, si te conviene, pasás por el local de Argüello.",
    incluye: ["Los Boulevares", "Jardín del Pilar"],
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
    slug: "la-matanza",
    name: "La Matanza",
    province: "Buenos Aires",
    branchId: "san-justo",
    minutosHastaSucursal: 8,
    comoLlegar:
      "La Matanza es el partido donde está el local: Pres. Juan Domingo Perón 2847, en San Justo. Desde cualquier punto del partido se llega en auto; sumá la dirección en Google Maps y te marca el recorrido exacto desde tu casa.",
    intro:
      "La Matanza es el partido más poblado del Gran Buenos Aires y el que más autos tiene. Trivium abre su sucursal en San Justo, en el centro del partido, para que quien vive acá compre neumáticos de importación directa sin ir hasta Capital.",
    porQue:
      "Con tantos autos y tanto kilometraje, el neumático es un gasto constante en La Matanza. Mirá en la web el precio de tu medida, comparalo con lo que te cotizan en tu zona y decidí con el número en la mano.",
    incluye: ["San Justo", "Ramos Mejía", "Villa Luzuriaga", "Isidro Casanova", "Laferrere", "González Catán", "Lomas del Mirador", "Ciudad Evita"],
  },
  {
    slug: "san-justo",
    name: "San Justo",
    province: "Buenos Aires",
    branchId: "san-justo",
    parent: "la-matanza",
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
    parent: "la-matanza",
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
    parent: "la-matanza",
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
    branchId: "lomas-del-mirador",
    esCabecera: true,
    minutosHastaSucursal: 5,
    comoLlegar:
      "El local está en Av. General Enrique Mosconi 248, en Lomas del Mirador, pegado a la General Paz. Sumá la dirección en Google Maps y te marca el recorrido exacto desde tu domicilio.",
    intro:
      "Lomas del Mirador es un barrio grande y muy poblado de La Matanza, con muchísimos autos de uso diario y pegado a la Ciudad. Trivium abre acá una sucursal sobre Av. Mosconi, para quien vive en el barrio y en el oeste de Capital.",
    porQue:
      "Una zona con tanto parque automotor tiene precios muy parejos entre gomerías, y casi nadie se anima a comparar contra una importación directa. Si estás por cambiar las cubiertas, mirá el precio de tu medida en nuestra web y compará con lo que te dieron: al ser neumáticos nuevos con garantía de un año, la comparación es de igual a igual.",
    incluye: ["Lomas del Mirador centro"],
  },
  {
    slug: "ciudad-evita",
    name: "Ciudad Evita",
    province: "Buenos Aires",
    branchId: "san-justo",
    parent: "la-matanza",
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
    parent: "la-matanza",
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
    parent: "la-matanza",
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
    parent: "la-matanza",
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
    parent: "la-matanza",
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
    parent: "tres-de-febrero",
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
    parent: "la-matanza",
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
    branchId: "lomas-del-mirador",
    minutosHastaSucursal: 20,
    comoLlegar:
      "Desde los barrios del oeste y sur de la Ciudad (Liniers, Villa Luro, Versalles, Mataderos, Parque Avellaneda, Villa Lugano) el local de Av. General Enrique Mosconi 248 queda del otro lado de la General Paz: se llega en unos quince a veinte minutos aproximadamente, según el tránsito. Google Maps te marca el recorrido desde tu barrio.",
    intro:
      "Muchos vecinos de la Ciudad cruzan la General Paz para comprar neumáticos: los precios de los comercios de Capital incluyen alquileres caros, y el neumático termina costando más. Nuestro local de Lomas del Mirador está sobre Av. Mosconi, pegado a la avenida.",
    porQue:
      "Si vivís en el oeste o sur de la Ciudad, cruzar la General Paz hacia Lomas del Mirador es un trayecto corto. Para un cambio de cuatro neumáticos, la diferencia entre el precio de Capital y el de un outlet de importación directa justifica el viaje. Mirá tu medida en la web, compará, y decidí.",
    incluye: ["Liniers", "Mataderos", "Villa Luro", "Parque Avellaneda", "Villa Lugano", "Floresta"],
  },
  {
    slug: "liniers",
    name: "Liniers",
    province: "Ciudad Autónoma de Buenos Aires",
    branchId: "lomas-del-mirador",
    parent: "capital-federal",
    minutosHastaSucursal: 10,
    comoLlegar:
      "Liniers queda pegado a la General Paz: el local de Av. Mosconi, en Lomas del Mirador, está a unos diez minutos en auto, cruzando la avenida. Google Maps te marca el recorrido más rápido a esa hora.",
    intro:
      "Liniers es la puerta de entrada de la Ciudad al oeste, con mucho tránsito y mucho comercio. Para quien vive o trabaja ahí, nuestro local de Lomas del Mirador queda del otro lado de la General Paz.",
    porQue:
      "En Liniers hay muchísima oferta de gomerías y casas de neumáticos, y cada una cotiza distinto. Antes de cambiar las cuatro cubiertas, mirá cuánto sale tu medida en un outlet de importación directa: el precio está en la web antes de ir.",
  },
  {
    slug: "mataderos",
    name: "Mataderos",
    province: "Ciudad Autónoma de Buenos Aires",
    branchId: "lomas-del-mirador",
    parent: "capital-federal",
    minutosHastaSucursal: 15,
    comoLlegar:
      "Desde Mataderos se cruza la General Paz y se llega a Lomas del Mirador en unos quince minutos aproximados, según el tránsito. Google Maps calcula el recorrido exacto.",
    intro:
      "Mataderos es un barrio de la Ciudad muy ligado al mundo del transporte y del trabajo con vehículos, a pocos minutos del límite con La Matanza. Para quien vive ahí, Lomas del Mirador es el outlet de neumáticos más cercano fuera de la Ciudad.",
    porQue:
      "Quien trabaja con el auto o con un utilitario cambia cubiertas seguido, y ahí cada diferencia de precio pesa. Mirá tu medida en la web, compará con tu cotización y decidí si te conviene cruzar la avenida.",
  },
  {
    slug: "parque-avellaneda",
    name: "Parque Avellaneda",
    province: "Ciudad Autónoma de Buenos Aires",
    branchId: "lomas-del-mirador",
    parent: "capital-federal",
    minutosHastaSucursal: 15,
    comoLlegar:
      "Desde Parque Avellaneda se llega a Lomas del Mirador por la General Paz en unos quince minutos aproximadamente, según el tránsito. Dejale a Google Maps la elección del camino desde tu casa.",
    intro:
      "Parque Avellaneda es un barrio residencial del sudoeste de la Ciudad, con mucho auto familiar y salida directa a la General Paz. Desde ahí, nuestro local de Lomas del Mirador queda a un viaje corto.",
    porQue:
      "Con los costos de una zona comercial de Capital, las cubiertas suelen salir más caras. Ver el precio de tu medida en la web antes de moverte es lo que te dice si el viaje vale la pena.",
  },
  {
    slug: "villa-lugano",
    name: "Villa Lugano",
    province: "Ciudad Autónoma de Buenos Aires",
    branchId: "lomas-del-mirador",
    parent: "capital-federal",
    minutosHastaSucursal: 20,
    comoLlegar:
      "Desde Villa Lugano se llega a Lomas del Mirador en unos veinte minutos aproximados, por la General Paz. Según la hora puede haber más tránsito: Google Maps calcula el camino.",
    intro:
      "Villa Lugano está en el extremo sur de la Ciudad, cerca del límite con La Matanza, y desde ahí nuestro local de Lomas del Mirador es una opción de neumáticos a precio de outlet a un viaje razonable.",
    porQue:
      "Para quien vive en el sur de la Ciudad y usa el auto a diario, reponer cubiertas es un gasto fuerte. Mirá tu medida en la web, comparala con la cotización que tengas y decidí con el número en la mano.",
  },
  {
    slug: "versalles",
    name: "Versalles",
    province: "Ciudad Autónoma de Buenos Aires",
    branchId: "lomas-del-mirador",
    parent: "capital-federal",
    minutosHastaSucursal: 10,
    comoLlegar:
      "Versalles queda al oeste de la Ciudad, pegado a la General Paz: son unos diez minutos en auto hasta Lomas del Mirador, según el tránsito. Google Maps te marca el recorrido exacto desde tu casa.",
    intro:
      "Versalles es un barrio residencial tranquilo del oeste de la Ciudad, con casas bajas y mucho auto familiar. Desde ahí, el local de Lomas del Mirador queda a un cruce de la General Paz.",
    porQue:
      "En una zona de uso familiar, el neumático se cambia por desgaste o por seguridad, y siempre conviene comparar. Mirá el precio de tu medida en la web y llevá tu cotización para ver si te conviene.",
  },
  {
    slug: "villa-luro",
    name: "Villa Luro",
    province: "Ciudad Autónoma de Buenos Aires",
    branchId: "lomas-del-mirador",
    parent: "capital-federal",
    minutosHastaSucursal: 10,
    comoLlegar:
      "Desde Villa Luro se llega a Lomas del Mirador en unos diez minutos aproximadamente, cruzando la General Paz. Dejale a Google Maps la elección del camino según el tránsito.",
    intro:
      "Villa Luro es un barrio del oeste de la Ciudad con mucho comercio y tránsito, cerca del límite con La Matanza. Lomas del Mirador queda del otro lado de la avenida.",
    porQue:
      "Con tanta oferta de gomerías en la zona, comparar precios no es difícil: lo ves en la web, sin moverte, y recién después decidís si te conviene el viaje a Lomas del Mirador.",
  },
  {
    slug: "villa-devoto",
    name: "Villa Devoto",
    province: "Ciudad Autónoma de Buenos Aires",
    branchId: "lomas-del-mirador",
    parent: "capital-federal",
    minutosHastaSucursal: 20,
    comoLlegar:
      "Desde Villa Devoto se llega a Lomas del Mirador en unos veinte minutos aproximadamente, por la General Paz hacia el sur. Según la hora hay más tránsito: Google Maps calcula el recorrido exacto.",
    intro:
      "Villa Devoto es un barrio residencial del noroeste de la Ciudad, muy ligado al auto. Para un cambio completo de cubiertas, vale la pena evaluar cruzar la General Paz hasta Lomas del Mirador.",
    porQue:
      "En un barrio donde el auto es parte de la vida diaria, reponer cubiertas es un gasto que se repite. Mirá tu medida en la web, comparala con tu cotización y decidí si el viaje se justifica.",
  },
  {
    slug: "floresta",
    name: "Floresta",
    province: "Ciudad Autónoma de Buenos Aires",
    branchId: "lomas-del-mirador",
    parent: "capital-federal",
    minutosHastaSucursal: 15,
    comoLlegar:
      "Desde Floresta se llega a Lomas del Mirador en unos quince minutos aproximados, por la General Paz. Google Maps te marca el camino más rápido a esa hora.",
    intro:
      "Floresta es un barrio del oeste de la Ciudad, con mucho auto de uso diario y a pocos minutos del límite con La Matanza. Lomas del Mirador queda del otro lado de la avenida.",
    porQue:
      "Con alquileres de Capital, las cubiertas en la zona suelen salir más caras. Mirá tu medida en la web antes de moverte: es la manera más simple de saber si te conviene cruzar.",
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

/** Localidades agrupadas por ciudad: cada ciudad con sus barrios/localidades menores. */
export function localidadesAgrupadas(): { ciudad: Localidad; barrios: Localidad[] }[] {
  return LOCALIDADES.filter((l) => !l.parent).map((ciudad) => ({
    ciudad,
    barrios: LOCALIDADES.filter((l) => l.parent === ciudad.slug),
  }));
}
