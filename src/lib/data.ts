import type { TireBrand, Service, BlogPost } from "./types";

export const BRANDS: TireBrand[] = [
  {
    id: "zmax",
    name: "Zmax",
    origin: "China",
    description: "Gama urbana del grupo Zodo, la relación precio-kilómetro más accesible del catálogo.",
    fullDescription:
      "Zmax pertenece al mismo grupo fabricante que Grenlander (Zodo Tyre) y ocupa el escalón de entrada de su oferta. Está pensada para uso urbano y periurbano, donde el kilometraje anual es moderado y lo que se busca es una cubierta homologada, con carcasa radial de acero y comportamiento previsible, al precio más bajo posible. Es la opción que recomendamos para un segundo auto, un vehículo que hace pocos kilómetros al año o cuando hay que resolver el cambio de las cuatro cubiertas con un presupuesto ajustado.",
  },
  {
    // El POS carga esta marca como "ARIVO PREMIO", así que el brandId derivado
    // es "arivo-premio". La entrada tiene que usar ese id o la ficha de marca
    // queda en 404 y los productos enlazan a una página inexistente.
    id: "arivo-premio",
    name: "Arivo Premio",
    origin: "China",
    description: "Línea de neumáticos urbanos con buen comportamiento en mojado para su segmento.",
    fullDescription:
      "Arivo es una marca de origen chino cuya línea Premio apunta al uso urbano y de ruta liviana. Sus modelos combinan un dibujo asimétrico con canales de evacuación amplios, que es lo que más se nota en piso mojado dentro de esta franja de precio. Trabaja bien en autos chicos y medianos con uso mixto de ciudad y ruta, y es una alternativa intermedia entre la gama de entrada y las marcas premium tradicionales.",
  },
  {
    id: "michelin",
    name: "Michelin",
    origin: "Francia",
    logoUrl: "/brands/michelin.svg",
    description: "Sustentabilidad y performance excepcional en cada kilómetro.",
    fullDescription: "Michelin es el referente mundial en movilidad y seguridad. Sus neumáticos son reconocidos por su durabilidad extrema, ahorro de combustible y agarre superior. Con una inversión constante en investigación, Michelin ofrece productos que mantienen sus prestaciones desde el primer hasta el último kilómetro.",
  },
  {
    id: "bfgoodrich",
    name: "BFGoodrich",
    origin: "EE.UU.",
  },
  {
    id: "bridgestone",
    name: "Bridgestone",
    origin: "Japón",
  },
  {
    id: "continental",
    name: "Continental",
    origin: "Alemania",
  },
  {
    id: "fate",
    name: "Fate",
    origin: "Argentina",
  },
  {
    id: "firemax",
    name: "Firemax",
    origin: "China",
    description: "Cubiertas de uso general con presencia fuerte en medidas de camioneta y carga.",
    fullDescription:
      "Firemax es una marca china de volumen, con un catálogo amplio que cubre desde medidas de auto chico hasta neumáticos de carga con marcado C para utilitarios. Su fuerte está en las medidas de trabajo, donde la carcasa reforzada y el índice de carga alto son lo que realmente importa. Para uso comercial —reparto, flota liviana, camioneta cargada a diario— suele ser la opción con mejor costo por kilómetro del catálogo.",
  },
  {
    id: "goodyear",
    name: "Goodyear",
    origin: "EE.UU.",
  },
  {
    id: "hankook",
    name: "Hankook",
    origin: "Corea del Sur",
  },
  {
    id: "kumho",
    name: "Kumho",
    origin: "Corea del Sur",
  },
  {
    id: "ling-long",
    name: "Ling Long",
    origin: "China",
  },
  {
    id: "nexen",
    name: "Nexen",
    origin: "Corea del Sur",
  },
  {
    id: "pirelli",
    name: "Pirelli",
    origin: "Italia",
    logoUrl: "/brands/pirelli.svg",
    description: "Líder mundial en neumáticos de alta performance y tecnología de vanguardia.",
    fullDescription: "Pirelli es una marca icónica reconocida mundialmente por su innovación tecnológica, excelencia en la producción y pasión por la competición. Con más de 140 años de historia, Pirelli se destaca por sus neumáticos de alta gama que combinan seguridad, durabilidad y un rendimiento excepcional en todo tipo de superficies.",
  },
  {
    id: "yokohama",
    name: "Yokohama",
    origin: "Japón",
  },
  {
    id: "grenlander",
    name: "Grenlander",
    origin: "China",
    logoUrl: "/brands/grenlander.svg",
    description: "Neumáticos de alto rendimiento a precio accesible, respaldados por Zodo Tyre.",
    fullDescription: "Grenlander es una marca fabricada por Zodo Tyre, un grupo con largas décadas de trayectoria en la industria del neumático. Combina tecnología de construcción radial de acero, compuestos de silicio en sus modelos de mayor segmento y certificaciones de homologación europea, ofreciendo una relación costo-kilómetro muy competitiva para uso urbano, ruta, SUVs y vehículos de carga.",
  },
];

export const SERVICES: Service[] = [
  {
    id: "alineacion",
    title: "Alineación",
    description:
      "Alineación computarizada 3D con equipos de última generación. Dejamos las ruedas en su ángulo correcto para que el auto ruede derecho, se maneje seguro y los neumáticos duren más.",
    icon: "alignment",
    features: [
      "Alineación computarizada 3D",
      "Corrección de ángulos (camber, caster, convergencia)",
      "Diagnóstico de desgaste irregular",
      "Control de presión sin cargo",
    ],
  },
  {
    id: "balanceo",
    title: "Balanceo y Rotación",
    description:
      "Balanceo dinámico computarizado y rotación periódica de las ruedas para eliminar vibraciones en el volante y garantizar un desgaste uniforme de la banda de rodadura.",
    icon: "rubber",
    features: [
      "Balanceo dinámico computarizado",
      "Rotación sistemática (delanteros / traseros)",
      "Contrapesos de precisión de plomo/adhesivos",
      "Eliminación de vibraciones y control de presión",
    ],
    priceNote: "por rueda",
  },
  {
    id: "montaje",
    title: "Arme y Desarme",
    description:
      "Arme y desarme de neumáticos con desmontadora automática, sin riesgo de daño a llantas ni cubiertas. Si compraste las cubiertas en Neumáticos Trivium, la colocación y el cambio de válvulas son sin cargo; si las trajiste de otro lado, el arme y desarme se cobra por rueda.",
    icon: "wrench",
    features: [
      "Desmontadora automática",
      "Lubricación con pastallantas",
      "Sin cargo si compraste las cubiertas en Neumáticos Trivium",
      "Con cargo por rueda si las cubiertas son de otro lugar",
    ],
    priceNote: "por rueda si la cubierta no es nuestra",
  },
];

// El orden importa: el listado del blog los muestra en este orden y las notas
// relacionadas al pie de cada artículo toman las tres primeras que no sean la
// actual. Las más útiles para alguien que está por comprar van arriba.
export const BLOG_POSTS: BlogPost[] = [
  {
    id: "19",
    title: "Opiniones sobre neumáticos Linglong, Mileking y Sumaxx: ¿Valen la pena?",
    excerpt: "Analizamos las marcas de cubiertas importadas más buscadas: Linglong, Mileking y Sumaxx. Conocé sus ventajas, desventajas y si son la opción ideal para tu auto.",
    imageUrl: "/images/blog-1.webp",
    date: "2026-10-03",
    slug: "opiniones-linglong-mileking-sumaxx",
    category: "Opiniones y Comparativas",
  },
  {
    id: "18",
    title: "¿Sabías que tus neumáticos hablan? Hablemos de los Decibeles y el Ruido al Rodar",
    excerpt: "Descubrí cómo se mide el ruido de las cubiertas y por qué elegir una cubierta silenciosa puede cambiar tu viaje.",
    imageUrl: "/images/blog-1.webp",
    date: "2026-09-29",
    slug: "ruido-neumaticos",
    category: "Guías",
  },
  {
    id: "17",
    title: "Neumáticos de Verano vs. All-Season: ¿Qué te conviene en Argentina?",
    excerpt: "Te explicamos las diferencias para que elijas la mejor opción según por dónde manejes.",
    imageUrl: "/images/blog-2.webp",
    date: "2026-09-29",
    slug: "verano-vs-allseason",
    category: "Guías",
  },
  {
    id: "16",
    title: "Precio y calidad: cuánto sale realmente cada kilómetro",
    excerpt:
      "El precio de lista no dice nada solo. Comparamos Grenlander contra otras marcas por costo real por kilómetro, estándares de fabricación y homologación en Europa, EE. UU. y Argentina.",
    imageUrl: "/images/blog-3.webp",
    date: "2026-09-26",
    slug: "precio-calidad-neumaticos-costo-por-km",
    category: "Marcas",
  },
  {
    id: "15",
    title: "UTQG: qué significan el desgaste, la tracción y la temperatura",
    excerpt:
      "El código de EE. UU. que a veces aparece junto a la etiqueta europea, con un número y dos letras. Qué mide cada dato y por qué no todos los neumáticos lo tienen.",
    imageUrl: "/images/blog-2.webp",
    date: "2026-09-25",
    slug: "utqg-desgaste-traccion-temperatura",
    category: "Guías",
  },
  {
    id: "14",
    title: "Alineación con Geoliner 630 y balanceo con Geodyna 7800P: el equipo hace la diferencia",
    excerpt:
      "Cómo funcionan la alineadora 3D y la balanceadora Hofmann que usamos en el taller, y qué diferencia hacen en la duración de los neumáticos y las vibraciones.",
    imageUrl: "/images/blog/geoliner-630-alineadora-trivium.webp",
    date: "2026-09-21",
    slug: "geoliner-630-geodyna-7800p-alineacion-balanceo",
    category: "Servicios",
  },
  {
    id: "13",
    title: "Carga simple y dual en neumáticos C: qué significa el 90/88 del flanco",
    excerpt:
      "Los neumáticos C traen dos índices de carga, no uno: uno para montaje simple y otro para rodado dual. Cuál te corresponde y tabla de conversión a kilos.",
    imageUrl: "/images/blog-1.webp",
    date: "2026-09-21",
    slug: "carga-simple-y-dual-neumaticos-c",
    category: "Guías",
  },
  {
    id: "11",
    title: "Medidas flotation: qué significa 31x10.5R15 y cómo pasarlo a métrico",
    excerpt:
      "Los neumáticos LT, A/T y M/T de camioneta a veces vienen marcados en pulgadas en vez de en milímetros. Formato, fórmula de conversión y tabla de equivalencias.",
    imageUrl: "/images/blog-3.webp",
    date: "2026-08-04",
    slug: "medidas-flotation-camionetas",
    category: "Guías",
  },
  {
    id: "1",
    title: "¿Cada cuántos kilómetros cambiar los neumáticos?",
    excerpt:
      "La vida útil de un neumático depende del uso, el tipo de vehículo y las condiciones de manejo. Te explicamos cómo saberlo.",
    imageUrl: "/images/blog-1.webp",
    date: "2025-04-20",
    slug: "cada-cuantos-km-cambiar-neumaticos",
    category: "Mantenimiento",
  },
  {
    id: "7",
    title: "Neumáticos baratos en Argentina: cuánto sale cada rodado",
    excerpt:
      "Qué compone el precio de una cubierta, por qué varía tanto entre negocios y cuánto cuesta hoy cada rodado, con precios reales de nuestro stock.",
    imageUrl: "/images/blog-2.webp",
    date: "2026-07-31",
    slug: "precio-neumaticos-argentina",
    category: "Guías",
  },
  {
    id: "8",
    title: "Presión de neumáticos: cuánto inflar y cada cuánto revisarla",
    excerpt:
      "La presión correcta no está escrita en el neumático sino en la puerta de tu auto. Dónde mirarla, cómo medirla bien y qué pasa cuando está mal.",
    imageUrl: "/images/blog-1.webp",
    date: "2026-07-31",
    slug: "presion-de-neumaticos",
    category: "Mantenimiento",
  },
  {
    id: "9",
    title: "Alineación y balanceo: qué es cada cosa y cada cuánto se hacen",
    excerpt:
      "Se nombran juntos pero resuelven problemas distintos: uno corrige hacia dónde apuntan las ruedas y el otro cómo giran. La diferencia en criollo.",
    imageUrl: "/images/blog-3.webp",
    date: "2026-07-31",
    slug: "alineacion-y-balanceo",
    category: "Servicios",
  },
  {
    id: "10",
    title: "Índice de carga y velocidad: qué significan el 91 y la V",
    excerpt:
      "Los dos códigos que van después de la medida definen cuánto peso aguanta y a qué velocidad puede rodar tu neumático. Con las tablas completas.",
    imageUrl: "/images/blog-2.webp",
    date: "2026-07-31",
    slug: "indice-de-carga-y-velocidad",
    category: "Guías",
  },
  {
    id: "3",
    title: "Cómo leer la medida de un neumático",
    excerpt:
      "185/65 R15: ¿qué significa cada número? Una guía simple para entender las medidas antes de comprar.",
    imageUrl: "/images/blog-3.webp",
    date: "2025-03-28",
    slug: "como-leer-medida-neumatico",
    category: "Guías",
  },
  {
    id: "4",
    title: "Equivalencias de neumáticos: ¿Qué son y cómo funcionan?",
    excerpt:
      "Entendé cómo funcionan las medidas equivalentes, qué significa el límite del ±3% y cuándo se pueden usar.",
    imageUrl: "/images/blog-2.webp",
    date: "2025-05-15",
    slug: "equivalencias",
    category: "Guías",
  },
  {
    id: "5",
    title: "Grenlander: ¿son buenos los neumáticos?",
    excerpt:
      "Analizamos la marca Grenlander en profundidad: calidad, tecnología, comparación con Zmax, Pirelli y BFGoodrich, y cuándo conviene elegirlos.",
    imageUrl: "/images/blog-2.webp",
    date: "2026-05-29",
    slug: "grenlander",
    category: "Marcas",
  },
  {
    id: "6",
    title: "Marcas chinas de neumáticos: ¿cuál es la mejor?",
    excerpt:
      "No todos los neumáticos chinos son iguales: hay una franja baja, una intermedia y una de calidad real. Te contamos cómo diferenciarlas y por qué Grenlander lidera el ranking.",
    imageUrl: "/images/blog-2.webp",
    date: "2026-07-11",
    slug: "marcas-chinas-neumaticos-comparativa",
    category: "Marcas",
  },
  {
    id: "12",
    title: "Etiqueta europea de neumáticos: qué significan las letras y colores",
    excerpt:
      "Eficiencia de combustible, frenado en mojado y ruido: la etiqueta que trae cada neumático homologado en Europa, explicada letra por letra.",
    imageUrl: "/images/blog-1.webp",
    date: "2026-09-14",
    slug: "etiqueta-europea-neumaticos",
    category: "Guías",
  },
];
