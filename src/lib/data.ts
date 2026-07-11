import type { TireBrand, Service, BlogPost } from "./types";

export const BRANDS: TireBrand[] = [
  {
    id: "zmax",
    name: "Zmax",
    origin: "China",
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
    title: "Balanceo",
    description:
      "Balanceo dinámico computarizado de cada rueda para eliminar las vibraciones en el volante y evitar el desgaste prematuro de los neumáticos.",
    icon: "rubber",
    features: [
      "Balanceo dinámico computarizado",
      "Contrapesos de precisión",
      "Eliminación de vibraciones",
      "Control de presión post-balanceo",
    ],
  },
  {
    id: "montaje",
    title: "Arme y Desarme",
    description:
      "Arme y desarme de neumáticos con desmontadora automática, sin riesgo de daño a llantas ni cubiertas. Comprando el neumático en nuestro local, la colocación y el cambio de válvulas son sin cargo.",
    icon: "wrench",
    features: [
      "Desmontadora automática",
      "Lubricación con pastallantas",
      "Colocación sin cargo comprando en el local",
      "Cambio de válvulas sin cargo",
    ],
  },
];

export const BLOG_POSTS: BlogPost[] = [
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
];
