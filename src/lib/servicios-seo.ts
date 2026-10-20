import type { Service } from "@/lib/types";

export type ServicioSeo = {
  /** Título de la pestaña/SERP (el layout le suma " — Neumáticos Trivium"). */
  title: string;
  metaDescription: string;
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
    "Rotación de ruedas en nuestra gomería de Córdoba: cruzamos o pasamos las cubiertas de eje para que el desgaste sea parejo y el juego completo dure más.",
  icon: "rubber",
  features: [
    "Rotación según tracción (delantera, trasera o 4x4)",
    "Revisión de desgaste y presión en el mismo turno",
    "Balanceo si hace falta",
    "Atención por orden de llegada, sin turno",
  ],
};

export const SERVICIOS_SEO: Record<string, ServicioSeo> = {
  alineacion: {
    title: "Alineación computarizada 3D en Córdoba",
    metaDescription:
      "Alineación computarizada 3D en Córdoba (Argüello): corregimos camber, caster y convergencia para que el auto no tire, el volante quede derecho y las cubiertas duren más. Sin turno, por orden de llegada.",
    h1: "Alineación computarizada 3D en Córdoba",
    intro: [
      "La alineación deja las cuatro ruedas en el ángulo que indica el fabricante. Con los ángulos bien, el auto va derecho sin que corrijas el volante, frena más estable y los neumáticos se gastan parejo en lugar de comerse un costado.",
      "Hacemos alineación computarizada 3D en nuestra gomería de Argüello, Córdoba. Medimos los ángulos, los corregimos y te dejamos el resultado antes y después. Atendemos por orden de llegada, sin turno.",
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
        question: "¿Necesito turno para alinear en Córdoba?",
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
    title: "Balanceo y rotación de ruedas en Córdoba",
    metaDescription:
      "Balanceo dinámico computarizado y rotación de ruedas en Córdoba (Argüello): eliminamos la vibración del volante y repartimos el desgaste de las cubiertas. Por orden de llegada, sin turno.",
    h1: "Balanceo y rotación de ruedas en Córdoba",
    intro: [
      "Si el volante vibra a cierta velocidad, lo más probable es que alguna rueda esté desbalanceada. El balanceo dinámico compensa con contrapesos la diferencia de peso de cada conjunto llanta-neumático y elimina la vibración.",
      "En nuestra gomería de Argüello, Córdoba, también hacemos la rotación de ruedas: pasamos las cubiertas de lugar según la tracción del auto para que el desgaste sea parejo y el juego completo dure más.",
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
        question: "¿El balanceo se hace por rueda?",
        answer:
          "Sí, se cotiza por rueda. El precio depende del tipo de vehículo; escribinos por WhatsApp y te lo confirmamos.",
      },
    ],
    relacionados: [
      ["alineacion-y-balanceo", "Alineación y balanceo: cuándo hacer cada una"],
      ["rotacion-de-neumaticos", "Rotación de neumáticos: cada cuánto y en qué orden"],
      ["ruido-neumaticos", "Ruido de los neumáticos: decibeles y ruido al rodar"],
    ],
  },
  montaje: {
    title: "Colocación y montaje de neumáticos en Córdoba",
    metaDescription:
      "Colocación de neumáticos en Córdoba (Argüello): arme y desarme con desmontadora automática, sin cargo si comprás las cubiertas con nosotros. Gomería por orden de llegada.",
    h1: "Colocación y montaje de neumáticos en Córdoba",
    intro: [
      "Montamos tus cubiertas con desmontadora automática, que cuida las llantas y los flancos del neumático. Si comprás las cubiertas en Neumáticos Trivium, la colocación y el cambio de válvulas no tienen cargo.",
      "Si las trajiste de otro lugar, también te las colocamos: el arme y desarme se cobra por rueda. Atendemos en Argüello, Córdoba, por orden de llegada.",
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
    title: "Rotación de ruedas en Córdoba",
    metaDescription:
      "Rotación de ruedas en Córdoba (Argüello): pasamos las cubiertas de lugar según tu tracción para repartir el desgaste y alargar la vida del juego. Por orden de llegada, sin turno.",
    h1: "Rotación de ruedas en Córdoba",
    intro: [
      "Las ruedas de un mismo auto no se gastan igual: en un tracción delantera, las de adelante traccionan, dirigen y frenan, y se desgastan bastante más rápido que las de atrás. Rotar las ruedas reparte ese desgaste y alarga la vida del juego completo.",
      "En nuestra gomería de Argüello, Córdoba, hacemos la rotación según el esquema que le corresponde a tu vehículo (tracción delantera, trasera o 4x4) y, ya que están desmontadas, revisamos presión y estado de las cubiertas.",
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
};
