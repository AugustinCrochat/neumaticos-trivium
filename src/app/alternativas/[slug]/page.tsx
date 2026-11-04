import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_BRANCH_ID } from "@/lib/config";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { canonical, SITE_NAME, resumen } from "@/lib/seo";
import { MARCAS_PREMIUM, getMarcaPremium } from "@/lib/marcas-premium";
import { poolShare } from "@/lib/share-image";
import { CategoryLanding } from "../../neumaticos/CategoryLanding";
import { AlternativaExtra } from "./AlternativaExtra";

// Como el resto de las landings de SEO usa DEFAULT_BRANCH_ID y no lee la cookie
// de sucursal (ver memoria seo-architecture): tiene que seguir siendo estática.
type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return MARCAS_PREMIUM.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const marca = getMarcaPremium(slug);
  if (!marca) return {};
  const path = `/alternativas/${marca.slug}`;
  const share = poolShare(`alternativa-${marca.slug}`);
  return {
    title: `Alternativas a ${marca.name}: neumáticos más económicos`,
    description: resumen(`Qué se sabe de ${marca.name} (${marca.origen}), cuándo conviene una marca premium y cuándo una alternativa, y los neumáticos nuevos que tenemos con precio publicado, garantía y colocación sin cargo.`),
    alternates: canonical(path),
    openGraph: { title: `Alternativas a ${marca.name} — ${SITE_NAME}`, url: path, ...share.openGraph },
    twitter: share.twitter,
  };
}

export default async function AlternativaPage({ params }: Props) {
  const { slug } = await params;
  const marca = getMarcaPremium(slug);
  if (!marca) notFound();

  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  // Auto y camioneta, todas las marcas: la carga tiene su propia landing.
  const lista = productos.filter((p) => !p.isCarga);

  const faqs = [
    {
      question: `¿Venden neumáticos ${marca.name}?`,
      answer: `No, ${marca.name} no está en nuestro catálogo. Tenemos Pirelli como marca de primera línea y marcas importadas nuevas como Grenlander, Zmax, Firemax y Arivo Premio, con precio publicado, un año de garantía y colocación sin cargo.`,
    },
    {
      question: `¿Qué alternativas hay a ${marca.name}?`,
      answer: `Depende de tu medida y de tu uso. Más arriba ves todo lo que tenemos, ordenado con el stock primero y filtrable por rodado y marca. Para una opción de primera línea, mirá Pirelli; para bajar el costo por kilómetro en uso urbano, las marcas importadas.`,
    },
    {
      question: `¿Un neumático más barato que ${marca.name} es peor?`,
      answer:
        "No hay una respuesta única: depende del uso. Las diferencias suelen verse en la vida útil, el frenado en mojado y el comportamiento a alta velocidad. Para comparar de verdad, mirá la etiqueta europea de cada neumático, los índices y la garantía, y hacé la cuenta del costo por kilómetro.",
    },
    {
      question: `¿Dónde se fabrica ${marca.name}?`,
      answer: `Una marca puede fabricar en varios países, y el origen de la marca no siempre es el de cada neumático. Fijate en el flanco la leyenda de origen y los dos primeros caracteres del código DOT, que identifican la planta.`,
    },
    {
      question: "¿Cómo sé qué medida necesito?",
      answer:
        "Está en el flanco del neumático que tenés puesto, con el formato 185/65 R15 (ancho, perfil y rodado), y también en la calcomanía de la puerta del conductor. Si no la encontrás, buscá tu auto en la sección Por vehículo.",
    },
    ...(marca.slug === "dunlop"
      ? [
          {
            question: "¿De quién es Dunlop?",
            answer:
              "Depende de la región y del momento. Durante años los derechos de la marca estuvieron repartidos entre Sumitomo Rubber, de Japón, y Goodyear, de Estados Unidos. En enero de 2025 Sumitomo acordó comprar los derechos de Goodyear para neumáticos de auto en Europa, Norteamérica y Oceanía. Por eso conviene mirar en el flanco dónde se fabricó cada neumático.",
          },
        ]
      : []),
    ...(marca.slug === "fate"
      ? [
          {
            question: "¿Qué pasó con Fate?",
            answer:
              "Fate cerró su única fábrica, la de San Fernando: en febrero de 2026 anunció el cierre definitivo y el despido de sus 920 trabajadores, según informaron varios medios, y atribuyó la decisión a la caída del consumo, la apertura de importaciones y los conflictos gremiales. Hoy los neumáticos Fate no se fabrican en Argentina ni se importan, así que no hay cubiertas nuevas de la marca. Si tenés Fate puestas, mirá la medida en el flanco y acá ves lo que tenemos en esa misma medida.",
          },
          {
            question: "¿Se consiguen neumáticos Fate nuevos?",
            answer:
              "No: la marca ya no se fabrica en Argentina ni se importa. Para reemplazar tus Fate buscá una cubierta de la misma medida e índices de carga y velocidad; en esta página podés filtrar por medida y ver precio y stock.",
          },
        ]
      : []),
  ];

  return (
    <CategoryLanding
      crumbLabel={`Alternativas a ${marca.name}`}
      path={`/alternativas/${marca.slug}`}
      title={`Alternativas a ${marca.name}`}
      productos={lista}
      faqs={faqs}
      extra={<AlternativaExtra marca={marca} />}
      hero={{
        headline: `¿Buscás ${marca.name}?`,
        accent: "Mirá estas opciones.",
        bajada:
          marca.slug === "fate"
            ? "Fate ya no se fabrica ni se importa. Si tenés cubiertas Fate y necesitás reemplazarlas, buscá tu medida y mirá qué tenemos con precio publicado."
            : `${marca.name} no está en nuestro catálogo, pero tenemos neumáticos nuevos de primera línea y de importación, por medida y con precio publicado.`,
        highlights: [
          { titulo: "Precio publicado", detalle: "El de la web es el del mostrador, con IVA incluido y por unidad." },
          { titulo: "Garantía", detalle: "Un año por defecto de fabricación." },
          { titulo: "Colocación sin cargo", detalle: "Colocación y válvulas sin cargo si comprás en nuestros locales." },
        ],
        idealPara: [
          "Quien busca una marca conocida y quiere ver qué otras opciones hay en su medida",
          "Cambiar el juego completo con un presupuesto ajustado",
          "Autos y camionetas de uso urbano y de ruta",
        ],
        noIdealPara: [
          "Furgones y utilitarios cargados: mirá los neumáticos de carga",
          "Uso fuera de ruta frecuente: mirá los neumáticos A/T",
        ],
      }}
    />
  );
}
