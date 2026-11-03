import type { Metadata } from "next";
import { DEFAULT_BRANCH_ID } from "@/lib/config";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { canonical, SITE_NAME } from "@/lib/seo";
import { CategoryLanding } from "../neumaticos/CategoryLanding";
import { BaratosExtra } from "./BaratosExtra";
import { poolShare } from "@/lib/share-image";

// Landing para "neumáticos baratos", "cubiertas baratas" y "mejor precio en
// neumáticos". Como el resto de las landings de SEO, usa DEFAULT_BRANCH_ID y no
// lee la cookie de sucursal (ver memoria seo-architecture): tiene que seguir
// siendo estática.
export async function generateMetadata(): Promise<Metadata> {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const enStock = productos.filter((p) => !p.isCarga && p.enStock);
  const desde = enStock.length ? Math.min(...enStock.map((p) => p.price)) : null;
  return {
    title: desde
      ? `Neumáticos baratos desde $${desde.toLocaleString("es-AR")}`
      : "Neumáticos baratos: cubiertas al mejor precio",
    description:
      "Cubiertas nuevas al mejor precio: importación directa, precio publicado igual al del local, un año de garantía y colocación sin cargo en nuestros locales. Mirá el neumático más barato de cada rodado y comprá con envío a todo el país.",
    alternates: canonical("/neumaticos-baratos"),
    openGraph: { title: `Neumáticos baratos — ${SITE_NAME}`, url: "/neumaticos-baratos", ...poolShare("baratos").openGraph },
    twitter: poolShare("baratos").twitter,
  };
}

const FAQS = [
  {
    question: "¿Dónde comprar neumáticos baratos en Córdoba?",
    answer:
      "En Neumáticos Trivium, en Argüello, Córdoba: importamos de forma directa y vendemos al público desde nuestro local, sin importador ni distribuidor en el medio. Los precios están publicados en la web y son los mismos que en el mostrador, y la colocación va sin cargo si comprás las cubiertas ahí.",
  },
  {
    question: "¿Un neumático barato es de mala calidad?",
    answer:
      "No necesariamente. El precio bajo viene de importar directo y de no tener intermediarios, no de usar un producto inferior. Son neumáticos nuevos, con un año de garantía por defecto de fabricación. Lo que sí conviene es elegir según el uso: para ciudad y ruta cualquier marca económica de buen nivel cumple; para uso exigente (barro, carga, velocidad) hay que mirar el tipo de neumático.",
  },
  {
    question: "¿Cuál es el neumático más barato que tienen?",
    answer:
      "Depende del rodado y de la medida. En esta página ves, para cada rodado, el modelo más económico con stock y su precio actualizado con el catálogo del local.",
  },
  {
    question: "¿Los precios incluyen IVA y la colocación?",
    answer:
      "Los precios publicados incluyen IVA y son por unidad. La colocación y el cambio de válvulas no tienen cargo si comprás las cubiertas en el local; el balanceo y la alineación se cotizan aparte.",
  },
  {
    question: "¿Cómo sé qué medida de cubierta necesito?",
    answer:
      "Está en el flanco del neumático que tenés puesto, con el formato 205/55 R16 (ancho, perfil y rodado), y también en la calcomanía de la puerta del conductor. Si no la encontrás, buscá por marca y modelo de tu auto en la sección Por mi auto.",
  },
];

export default async function NeumaticosBaratosPage() {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  // Auto y camioneta: la carga tiene su propia landing (/neumaticos/carga).
  const lista = productos.filter((p) => !p.isCarga);

  return (
    <CategoryLanding
      crumbLabel="Neumáticos baratos"
      path="/neumaticos-baratos"
      title="Neumáticos baratos"
      productos={lista}
      faqs={FAQS}
      extra={<BaratosExtra productos={lista} />}
      hero={{
        image: {
          src: "/images/local/descarga-de-neumaticos-importados-grenlander-del-camion-trivium-cordoba.webp",
          alt: "Descarga de neumáticos importados Grenlander de un camión en el local de Trivium",
          position: "center",
        },
        headline: "Cubiertas nuevas",
        accent: "al mejor precio.",
        bajada:
          "Importamos directo y vendemos desde nuestros locales: precio publicado, stock real y colocación sin cargo.",
        highlights: [
          {
            titulo: "Importación directa",
            detalle: "Sin importador ni distribuidor en el medio: la diferencia llega al precio.",
          },
          {
            titulo: "Precio publicado",
            detalle: "El de la web es el del mostrador, con IVA incluido y por unidad.",
          },
          {
            titulo: "Garantía y colocación",
            detalle: "Un año por defecto de fabricación y colocación sin cargo si comprás acá.",
          },
        ],
        idealPara: [
          "Autos y camionetas de uso diario en ciudad y ruta",
          "Quien quiere cambiar el juego completo sin pasarse del presupuesto",
          "Flotas, taxis y remises que cambian cubiertas seguido",
        ],
        noIdealPara: [
          "Furgones y utilitarios cargados: mirá los neumáticos de carga",
          "Uso fuera de ruta frecuente: mirá los neumáticos A/T",
        ],
      }}
    />
  );
}
