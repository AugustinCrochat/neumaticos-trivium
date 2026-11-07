import type { Service } from "@/lib/types";
import type { ServicioPrecio } from "@/lib/pos-api";
import { formatPrecio, splitAutoCamioneta } from "@/lib/servicios";

export type ServicioSeo = {
  /** Título de la pestaña/SERP (el layout le suma " — Neumáticos Trivium"). */
  title: string;
  /** Variante con precio ({comboAuto}, etc.): se usa sólo si el POS devolvió
      todos los precios que nombra; si no, queda `title`. Un precio en el
      título de Google sube el CTR de búsquedas como "alineado y balanceado". */
  titleConPrecio?: string;
  metaDescription: string;
  metaDescriptionConPrecio?: string;
  h1: string;
  /** Párrafos introductorios visibles, con las frases que busca la gente. */
  intro: string[];
  secciones: { titulo: string; items?: string[]; texto?: string }[];
  faqs: { question: string; answer: string }[];
  /** Notas del blog relacionadas: [slug, título del enlace]. */
  relacionados: [string, string][];
};

/**
 * Rotación de ruedas vive en el POS dentro de "Balanceo y Rotación" (un solo
 * grupo de precios), pero se busca aparte ("rotación de ruedas córdoba"): tiene
 * su propia página de aterrizaje, fuera del listado de servicios, sin precio
 * propio (se consulta).
 */
export const ROTACION_SERVICE: Service = {
  id: "rotacion-de-ruedas",
  title: "Rotación de ruedas",
  description:
    "Rotación de ruedas en nuestra gomería: cruzamos o pasamos las cubiertas de eje para que el desgaste sea parejo y el juego completo dure más.",
  icon: "rubber",
  features: [
    "Rotación según tracción (delantera, trasera o 4x4)",
    "Revisión de desgaste y presión en el mismo turno",
    "Balanceo si hace falta",
    "Atención por orden de llegada, sin turno",
  ],
};

/** Pinchaduras: servicio de gomería sin precio propio en el POS (se consulta). */
export const PINCHADURAS_SERVICE: Service = {
  id: "reparacion-de-pinchaduras",
  title: "Reparación de pinchaduras",
  description:
    "Reparación de pinchaduras en nuestra gomería: revisamos la cubierta por dentro y te decimos si se repara con parche o si conviene cambiarla.",
  icon: "rubber",
  features: [
    "Cubierta desmontada y revisada por dentro",
    "Parche común y minicombi en pinchaduras reparables",
    "Te decimos cuándo no se puede reparar",
    "Atención por orden de llegada, sin turno",
  ],
};

/** Tuercas y bulones de seguridad, extracción y espárragos: también se consulta. */
export const TUERCAS_SERVICE: Service = {
  id: "tuercas-de-seguridad",
  title: "Tuercas de seguridad y espárragos",
  description:
    "Colocación y extracción de tuercas antirrobo, y reparación de espárragos y roscas dañadas, en nuestra gomería.",
  icon: "wrench",
  features: [
    "Colocación de tuercas y bulones antirrobo",
    "Extracción de tuercas de seguridad sin llave",
    "Cambio de espárrago de maza roto",
    "Reparación de rosca dañada",
  ],
};

/**
 * Combo de alineado + balanceado de las cuatro ruedas con rotación. En el POS
 * es su propio grupo de precios ("combo", auto y camioneta), así que tiene
 * ficha propia con precio, fuera del listado de tres tarjetas.
 */
export const COMBO_ID = "combo-alineado-y-balanceado";
export const COMBO_SERVICE: Service = {
  id: COMBO_ID,
  title: "Combo alineado y balanceado",
  description:
    "Alineado computarizado 3D más balanceado de las cuatro ruedas con rotación incluida, en la misma visita y a menor precio que por separado.",
  icon: "alignment",
  features: [
    "Alineado computarizado 3D",
    "Balanceado dinámico de las cuatro ruedas",
    "Rotación de las ruedas incluida",
    "Control de presión sin cargo",
  ],
};

/** Precios del taller por clave, para completar textos con {clave}. */
export type PreciosTaller = Partial<Record<"comboAuto" | "comboCamioneta" | "alineadoAuto" | "alineadoCamioneta" | "balanceoAuto" | "balanceoCamioneta", number>>;

export function preciosTaller(todos: ServicioPrecio[]): PreciosTaller {
  const grupo = (g: string) => splitAutoCamioneta(todos.filter((s) => s.grupo === g));
  const combo = grupo("combo"), alineado = grupo("alineacion"), balanceo = grupo("balanceo");
  return {
    comboAuto: combo.auto?.precio,
    comboCamioneta: combo.camioneta?.precio,
    alineadoAuto: alineado.auto?.precio,
    alineadoCamioneta: alineado.camioneta?.precio,
    balanceoAuto: balanceo.auto?.precio,
    balanceoCamioneta: balanceo.camioneta?.precio,
  };
}

/** Reemplaza {clave} por el precio. Devuelve null si falta alguno, para que
    quien llama use el texto sin precio en vez de uno con un hueco. */
export function conPrecios(texto: string, p: PreciosTaller): string | null {
  let falta = false;
  const out = texto.replace(/\{(\w+)\}/g, (_, k: keyof PreciosTaller) => {
    const v = p[k];
    if (!v) { falta = true; return ""; }
    return formatPrecio(v);
  });
  return falta ? null : out;
}

/**
 * Datos reales del taller de Argüello (órdenes de trabajo del POS, agosto a
 * octubre de 2026): cantidad de autos alineados y tiempo de trabajo. Le dan a
 * la página algo que ninguna otra gomería publica, y a un buscador o una IA
 * un dato concreto para citar. Actualizar a mano cada tanto.
 */
export const DATOS_TALLER = {
  periodo: "agosto a octubre de 2026",
  // Vehículos con un alineado (incluye los combos). Recontado el 2026-11-03 con las órdenes de agosto a octubre.
  alineados: 615,
  // Ruedas: los balanceos sueltos (916) más 4 por cada combo "alineación + 4 balanceos" (486 combos).
  // Antes se contaban solo los sueltos y quedaba muy por debajo de lo real.
  ruedasBalanceadas: 2860,
  minutosMediana: 39,
};

/** Páginas de servicio fuera del listado y sin precio propio en el POS. */
export const EXTRA_SERVICES: Service[] = [ROTACION_SERVICE, PINCHADURAS_SERVICE, TUERCAS_SERVICE];

export const SERVICIOS_SEO: Record<string, ServicioSeo> = {
  [COMBO_ID]: {
    title: "Alineado y balanceado: precio y sin turno",
    titleConPrecio: "Alineado y balanceado: {comboAuto} el auto, sin turno",
    metaDescription:
      "Alineado 3D y balanceado de las cuatro ruedas con rotación incluida: todo en una visita y a menor precio que por separado. Sin turno, por orden de llegada.",
    metaDescriptionConPrecio:
      "Alineado 3D + balanceado de las 4 ruedas con rotación: {comboAuto} el auto y {comboCamioneta} la camioneta. Sin turno, por orden de llegada, en unos 40 minutos.",
    h1: "Alineado y balanceado",
    intro: [
      "El combo junta lo que casi siempre hace falta al mismo tiempo: alinear el auto y balancear las cuatro ruedas, con la rotación incluida. Es lo que más conviene hacer cuando se cambian las cubiertas o después de un golpe fuerte, y sale menos que contratar cada servicio por separado.",
      "Lo hacemos en nuestra gomería, con alineadora 3D y balanceadora computarizada. Atendemos por orden de llegada, sin turno.",
      `Entre ${DATOS_TALLER.periodo} alineamos ${DATOS_TALLER.alineados} vehículos en el taller de Argüello, y la mitad de los trabajos con alineado se terminó en menos de ${DATOS_TALLER.minutosMediana} minutos desde que el auto entró al elevador.`,
    ],
    secciones: [
      {
        titulo: "Qué incluye",
        items: [
          "Alineado computarizado 3D: corrección de camber, caster y convergencia.",
          "Balanceado dinámico de las cuatro ruedas.",
          "Rotación de las ruedas.",
          "Control de presión sin cargo.",
        ],
      },
      {
        titulo: "Cuándo conviene el combo",
        items: [
          "Al cambiar el juego de neumáticos, para que los nuevos arranquen alineados y balanceados.",
          "Si el auto tira hacia un lado y además el volante vibra.",
          "Después de un golpe fuerte contra un pozo o un cordón.",
          "Antes de un viaje largo o cuando hace mucho que no hacés ninguno de los dos.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿Qué incluye el combo de alineado y balanceado?",
        answer:
          "Alineado computarizado 3D, balanceado de las cuatro ruedas y la rotación, en la misma visita. El precio publicado en esta página es el del combo completo, según sea auto o camioneta.",
      },
      {
        question: "¿Cuánto sale el alineado y balanceado?",
        answer:
          "En nuestro taller de Argüello el combo de alineado 3D y balanceado de las cuatro ruedas, con rotación, cuesta {comboAuto} para auto y {comboCamioneta} para camioneta. Es el precio de lista del día, sin turno ni recargos.",
      },
      {
        question: "¿Es más barato que hacerlos por separado?",
        answer:
          "Sí. En un auto, el alineado solo sale {alineadoAuto} y cada rueda balanceada {balanceoAuto}: hechos por separado suman más que el combo de {comboAuto}, que además incluye la rotación.",
      },
      {
        question: "¿Cuánto tarda?",
        answer:
          `El trabajo en sí lleva unos 40 minutos en un auto (la mitad de los alineados de ${DATOS_TALLER.periodo} se terminó en menos de ${DATOS_TALLER.minutosMediana} minutos) y un poco más en una camioneta. A eso se suma la espera según la cola del día: atendemos por orden de llegada y en la web podés ver a qué hora suele estar más tranquilo.`,
      },
      {
        question: "¿Si compro los neumáticos conviene hacer el combo?",
        answer:
          "Sí. La colocación y el cambio de válvulas no tienen cargo si comprás las cubiertas en el local, y el combo deja el juego nuevo alineado y balanceado en la misma visita.",
      },
    ],
    relacionados: [
      ["alineacion-y-balanceo", "Alineado y balanceado: qué es cada cosa y cada cuánto se hacen"],
      ["sintomas-alineacion-balanceo-o-rotacion", "Tu auto vibra o tira: ¿alineado, balanceado o rotación?"],
    ],
  },
  alineacion: {
    title: "Alineado 3D: precio y sin turno",
    titleConPrecio: "Alineado 3D: {alineadoAuto} el auto, sin turno",
    metaDescription:
      "Alineado computarizado 3D: corregimos camber, caster y convergencia para que el auto no tire, el volante quede derecho y las cubiertas duren más. Sin turno, por orden de llegada.",
    metaDescriptionConPrecio:
      "Alineado computarizado 3D: {alineadoAuto} el auto y {alineadoCamioneta} la camioneta. Para que no tire y las cubiertas no se coman un costado. Sin turno, por orden de llegada.",
    h1: "Alineado computarizado 3D",
    intro: [
      "La alineación deja las cuatro ruedas en el ángulo que indica el fabricante. Con los ángulos bien, el auto va derecho sin que corrijas el volante, frena más estable y los neumáticos se gastan parejo en lugar de comerse un costado.",
      "Hacemos alineado computarizado 3D (la alineación, como se la llama en otras provincias) en nuestra gomería. Medimos los ángulos, los corregimos y te dejamos el resultado antes y después. Atendemos por orden de llegada, sin turno.",
      `Entre ${DATOS_TALLER.periodo} alineamos ${DATOS_TALLER.alineados} vehículos en Argüello: es el servicio que más hacemos después de la colocación de cubiertas.`,
    ],
    secciones: [
      {
        titulo: "Cuándo conviene alinear",
        items: [
          "El auto tira hacia un lado en una calle recta o el volante queda torcido.",
          "Las cubiertas muestran desgaste en un solo borde (interior o exterior).",
          "Después de pegarle a un pozo, un cordón o de cambiar amortiguadores y tren delantero.",
          "Al cambiar el juego de neumáticos, para que los nuevos no arranquen gastándose mal.",
        ],
      },
      {
        titulo: "Qué incluye",
        items: [
          "Medición 3D de las cuatro ruedas y corrección de camber, caster y convergencia.",
          "Diagnóstico de desgaste irregular y de piezas con juego.",
          "Control de presión sin cargo.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿Cada cuánto hay que alinear el auto?",
        answer:
          "Una buena referencia es una vez al año o cada 10.000 a 15.000 km, y siempre que cambies neumáticos, toques la suspensión o pegues un golpe fuerte. Si notás que el auto tira o las cubiertas se gastan de un solo lado, no esperes al control anual.",
      },
      {
        question: "¿Alinear y balancear es lo mismo?",
        answer:
          "No. La alineación corrige los ángulos de las ruedas respecto del auto; el balanceo compensa el peso de cada conjunto rueda-neumático para que no vibre. Se hacen juntos al cambiar neumáticos, pero resuelven problemas distintos: la alineación, que el auto tire o se gaste mal la cubierta; el balanceo, la vibración en el volante.",
      },
      {
        question: "¿Cuánto sale alinear el auto?",
        answer:
          "En nuestro taller de Argüello el alineado 3D cuesta {alineadoAuto} para auto y {alineadoCamioneta} para camioneta. Si además balanceás las cuatro ruedas, el combo sale {comboAuto} en auto.",
      },
      {
        question: "¿Necesito turno para alinear?",
        answer:
          "No. Atendemos por orden de llegada en el local de Argüello. Podés escribirnos por WhatsApp antes para confirmar el precio según tu vehículo.",
      },
      {
        question: "¿La alineación está incluida si compro los neumáticos?",
        answer:
          "La colocación y el cambio de válvulas no tienen cargo si comprás las cubiertas en el local. La alineación y el balanceo se cotizan aparte, y conviene hacerlos al cambiar el juego.",
      },
    ],
    relacionados: [
      ["alineacion-y-balanceo", "Alineación y balanceo: cuándo hacer cada una"],
      ["rotacion-de-neumaticos", "Rotación de neumáticos: cada cuánto y en qué orden"],
    ],
  },
  balanceo: {
    title: "Balanceado y rotación de ruedas: precio por rueda",
    titleConPrecio: "Balanceado: {balanceoAuto} por rueda, sin turno",
    metaDescription:
      "Balanceado dinámico computarizado y rotación de ruedas: eliminamos la vibración del volante y repartimos el desgaste de las cubiertas. Por orden de llegada, sin turno.",
    metaDescriptionConPrecio:
      "Balanceado dinámico y rotación de ruedas: {balanceoAuto} por rueda en auto y {balanceoCamioneta} en camioneta. Chau vibración en el volante. Sin turno, por orden de llegada.",
    h1: "Balanceado y rotación de ruedas",
    intro: [
      "Si el volante vibra a cierta velocidad, lo más probable es que alguna rueda esté desbalanceada. El balanceado dinámico compensa con contrapesos la diferencia de peso de cada conjunto llanta-neumático y elimina la vibración.",
      "En nuestra gomería también hacemos la rotación de ruedas: pasamos las cubiertas de lugar según la tracción del auto para que el desgaste sea parejo y el juego completo dure más.",
    ],
    secciones: [
      {
        titulo: "Cuándo balancear",
        items: [
          "El volante o el asiento vibran, sobre todo entre los 80 y los 110 km/h.",
          "Después de cambiar neumáticos, de arreglar un pinchazo o de desmontar una cubierta.",
          "Cuando se cae un contrapeso o notás desgaste en 'parches' en la banda de rodadura.",
        ],
      },
      {
        titulo: "Qué incluye",
        items: [
          "Balanceo dinámico computarizado, con contrapesos adhesivos o de clip.",
          "Rotación de ruedas según el esquema que corresponde a tu auto.",
          "Control de presión sin cargo.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿Por qué vibra el volante a cierta velocidad?",
        answer:
          "La causa más común es una rueda desbalanceada: una pequeña diferencia de peso que se nota a partir de los 80 km/h aproximadamente. También puede ser una cubierta deformada o una llanta golpeada, que el balanceo no corrige; en el taller lo revisamos al balancear.",
      },
      {
        question: "¿Cada cuánto hay que balancear?",
        answer:
          "No tiene un intervalo fijo: se balancea al montar neumáticos nuevos y cada vez que aparece vibración. Muchos conductores lo repiten al rotar las ruedas, cada 8.000 a 10.000 km.",
      },
      {
        question: "¿El balanceado se cobra por rueda?",
        answer:
          "Sí: {balanceoAuto} por rueda en auto y {balanceoCamioneta} en camioneta. Si además alineás, el combo con las cuatro ruedas balanceadas sale {comboAuto} en auto.",
      },
    ],
    relacionados: [
      ["alineacion-y-balanceo", "Alineación y balanceo: cuándo hacer cada una"],
      ["rotacion-de-neumaticos", "Rotación de neumáticos: cada cuánto y en qué orden"],
      ["ruido-neumaticos", "Ruido de los neumáticos: decibeles y ruido al rodar"],
    ],
  },
  montaje: {
    title: "Colocación y montaje de neumáticos",
    metaDescription:
      "Colocación de neumáticos: arme y desarme con desmontadora automática, sin cargo si comprás las cubiertas con nosotros. Gomería por orden de llegada.",
    h1: "Colocación y montaje de neumáticos",
    intro: [
      "Montamos tus cubiertas con desmontadora automática, que cuida las llantas y los flancos del neumático. Si comprás las cubiertas en Neumáticos Trivium, la colocación y el cambio de válvulas no tienen cargo.",
      "Si las trajiste de otro lugar, también te las colocamos: el arme y desarme se cobra por rueda. Atendemos por orden de llegada.",
    ],
    secciones: [
      {
        titulo: "Cómo es el servicio",
        items: [
          "Desmontadora automática y lubricación con pastallantas, sin riesgo de rayar llantas.",
          "Cambio de válvulas incluido si la cubierta es nuestra.",
          "Podés sumar balanceo y alineación en la misma visita.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿La colocación tiene costo si compro los neumáticos acá?",
        answer:
          "No. Si comprás las cubiertas en el local, la colocación y el cambio de válvulas van sin cargo. El balanceo y la alineación se cotizan aparte.",
      },
      {
        question: "¿Colocan neumáticos que compré en otro lado?",
        answer:
          "Sí. En ese caso el arme y desarme se cobra por rueda; el precio se confirma por WhatsApp o en el mostrador.",
      },
      {
        question: "¿Hace falta turno para la gomería?",
        answer: "No, atendemos por orden de llegada. Para evitar espera, escribinos antes por WhatsApp.",
      },
    ],
    relacionados: [
      ["gomeria-en-cordoba", "Gomería en Córdoba: qué servicios hacen y cómo elegir una buena"],
      ["comprar-neumaticos-en-cordoba", "Comprar neumáticos en Córdoba"],
    ],
  },
  "rotacion-de-ruedas": {
    title: "Rotación de ruedas",
    metaDescription:
      "Rotación de ruedas: pasamos las cubiertas de lugar según tu tracción para repartir el desgaste y alargar la vida del juego. Por orden de llegada, sin turno.",
    h1: "Rotación de ruedas",
    intro: [
      "Las ruedas de un mismo auto no se gastan igual: en un tracción delantera, las de adelante traccionan, dirigen y frenan, y se desgastan bastante más rápido que las de atrás. Rotar las ruedas reparte ese desgaste y alarga la vida del juego completo.",
      "En nuestra gomería hacemos la rotación según el esquema que le corresponde a tu vehículo (tracción delantera, trasera o 4x4) y, ya que están desmontadas, revisamos presión y estado de las cubiertas.",
    ],
    secciones: [
      {
        titulo: "Cuándo rotar",
        items: [
          "Cada 8.000 a 10.000 km, o en cada service si el auto no recorre mucho.",
          "Si el manual del fabricante indica otro intervalo, seguí ese.",
          "Antes de que el desgaste desparejo se note a simple vista.",
        ],
      },
      {
        titulo: "Casos en que no se puede rotar igual",
        items: [
          "Autos con medidas distintas adelante y atrás: no son intercambiables entre ejes.",
          "Neumáticos direccionales: sólo se pasan de adelante hacia atrás del mismo lado.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿Cada cuántos kilómetros hay que rotar las ruedas?",
        answer:
          "Una referencia práctica es cada 8.000 a 10.000 km. Lo importante es no esperar a ver el desgaste desparejo: para cuando se nota, ya perdiste vida útil.",
      },
      {
        question: "¿Rotar reemplaza a la alineación?",
        answer:
          "No. La rotación reparte el desgaste entre las cubiertas; la alineación corrige los ángulos para que no se desgasten mal. Se complementan.",
      },
      {
        question: "¿Cuánto sale la rotación de ruedas?",
        answer:
          "Consultanos por WhatsApp y te confirmamos el precio según el vehículo. La rotación suele hacerse junto con el balanceo.",
      },
    ],
    relacionados: [
      ["rotacion-de-neumaticos", "Rotación de neumáticos: cada cuánto y en qué orden"],
      ["alineacion-y-balanceo", "Alineación y balanceo: cuándo hacer cada una"],
    ],
  },
  "reparacion-de-pinchaduras": {
    title: "Reparación de pinchaduras",
    metaDescription:
      "Reparación de pinchaduras: desmontamos la cubierta, la revisamos por dentro y reparamos con parche si se puede. Si no, te decimos por qué conviene cambiarla.",
    h1: "Reparación de pinchaduras",
    intro: [
      "Una pinchadura bien reparada deja la cubierta lista para seguir rodando; una mal reparada pierde aire de nuevo o falla en ruta. La diferencia está en revisar el neumático por dentro, no en tapar el agujero que se ve por fuera.",
      "En nuestra gomería desmontamos la cubierta, la inspeccionamos y reparamos con parche común o minicombi las pinchaduras que son reparables. Cuando no lo son, te lo decimos y te mostramos el motivo.",
    ],
    secciones: [
      {
        titulo: "Qué se puede reparar",
        items: [
          "Pinchaduras chicas en la banda de rodamiento (la parte que toca el piso).",
          "Cubiertas sin daño interno ni desgaste excesivo.",
        ],
      },
      {
        titulo: "Qué no se puede reparar",
        items: [
          "Pinchaduras en el flanco o el hombro de la cubierta.",
          "Orificios grandes, cortes y daño en la estructura interna.",
          "Cubiertas que rodaron mucho tiempo sin aire.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿Cuánto sale reparar una pinchadura?",
        answer:
          "El parche común, que es la reparación que más hacemos, sale $20.000. Antes se desmonta la cubierta y se revisa por dentro; si no se puede reparar, te lo decimos.",
      },
      {
        question: "¿Parche, minicombi o tarugo?",
        answer:
          "El parche común y el minicombi (parche con hongo) se colocan desde adentro, con la cubierta desmontada, y son reparaciones firmes. El tarugo, que se mete desde afuera, es un arreglo de emergencia para llegar a una gomería.",
      },
      {
        question: "¿Hace falta turno?",
        answer: "No, atendemos por orden de llegada.",
      },
    ],
    relacionados: [
      ["reparacion-de-pinchaduras-parche-mecha", "Pinchaduras: parche, tarugo o cambio de neumático"],
      ["gomeria-en-cordoba", "Gomería en Córdoba: qué servicios hacen y cómo elegir una buena"],
    ],
  },
  "tuercas-de-seguridad": {
    title: "Tuercas de seguridad y espárragos",
    metaDescription:
      "Tuercas antirrobo: colocación, extracción sin llave y reparación de espárragos de maza rotos o roscas dañadas, en nuestra gomería.",
    h1: "Tuercas antirrobo, extracción y reparación de espárragos",
    intro: [
      "Las tuercas de seguridad protegen las llantas de aleación, pero si la llave se pierde o se daña, la rueda queda trabada. También pasa que un espárrago se corta o una rosca se pasa por apretar de más.",
      "En nuestra gomería, colocamos tuercas y bulones antirrobo, extraemos las que quedaron sin llave y reparamos espárragos y roscas dañadas, cuidando de no arruinar la llanta ni la maza.",
    ],
    secciones: [
      {
        titulo: "Qué hacemos",
        items: [
          "Colocación de juegos de tuercas y bulones antirrobo.",
          "Extracción de tuercas de seguridad cuando no hay llave.",
          "Cambio de espárragos de maza rotos.",
          "Reparación y repaso de roscas dañadas.",
        ],
      },
      {
        titulo: "Antes de venir",
        items: [
          "Si tenés el código del juego de tuercas, traelo: se puede pedir una llave nueva.",
          "Si ya intentaron sacarla a golpes, avisá, así se revisa el espárrago.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿Pueden sacar una tuerca antirrobo sin la llave?",
        answer:
          "Sí, con herramienta de extracción, sin dañar el espárrago ni la llanta. La tuerca queda inutilizable y se reemplaza.",
      },
      {
        question: "¿Se puede reparar un espárrago roto?",
        answer:
          "Se reemplaza por uno nuevo de la misma medida. Si la rosca está solo sucia o apenas dañada, se repasa.",
      },
      {
        question: "¿Venden tuercas antirrobo?",
        answer: "Sí, tenemos juegos para distintos vehículos en la sección de tuercas antirrobo.",
      },
    ],
    relacionados: [
      ["tuercas-y-bulones-de-seguridad", "Tuercas y bulones de seguridad: cómo funcionan y cómo cuidarlos"],
      ["extraccion-de-tuercas-de-seguridad", "Extracción de tuercas de seguridad sin llave"],
      ["esparrago-de-maza-roto-reparacion-de-rosca", "Espárrago de maza roto o rosca dañada"],
    ],
  },
};
