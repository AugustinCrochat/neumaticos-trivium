import type { Metadata } from "next";
import { DEFAULT_BRANCH_ID } from "@/lib/config";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { canonical, SITE_NAME, resumen } from "@/lib/seo";
import { CategoryLanding } from "../neumaticos/CategoryLanding";
import { RemisesExtra } from "./RemisesExtra";
import { siteShare } from "@/lib/share-image";

// Landing para quien trabaja con el auto: taxi, remis, Uber, DiDi, Cabify.
// Como el resto de las landings de SEO usa DEFAULT_BRANCH_ID y no lee la cookie
// de sucursal (ver memoria seo-architecture): tiene que seguir siendo estática.
const FOTO = "/images/local/remis-cambio-de-cuatro-neumaticos-con-alineacion-y-balanceo-trivium-cordoba.webp";
const share = siteShare(FOTO);

export async function generateMetadata(): Promise<Metadata> {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const enStock = productos.filter((p) => !p.isCarga && p.size.rim <= 16 && p.enStock);
  const desde = enStock.length ? Math.min(...enStock.map((p) => p.price)) : null;
  return {
    title: desde
      ? `Neumáticos para taxi, remis y Uber desde $${desde.toLocaleString("es-AR")}`
      : "Neumáticos para taxi, remis y Uber: cubiertas económicas",
    description:
      resumen("Cubiertas nuevas y económicas para taxis, remises y autos de Uber, DiDi y Cabify: medidas de los autos más usados, precio por unidad, un año de garantía, colocación sin cargo, alineación y balanceo en nuestros locales."),
    alternates: canonical("/neumaticos-para-remises-taxis-y-uber"),
    openGraph: { title: `Neumáticos para remises, taxis y Uber — ${SITE_NAME}`, url: "/neumaticos-para-remises-taxis-y-uber", ...(share?.openGraph ?? {}) },
    twitter: share?.twitter,
  };
}

const FAQS = [
  {
    question: "¿Qué neumáticos conviene para Uber, DiDi o Cabify?",
    answer:
      "La medida que figura en tu auto y, entre las marcas, una cubierta económica de buen nivel: para uso urbano intensivo lo que más pesa es el costo por kilómetro, no el prestigio de la marca. Fijate que el índice de carga no sea menor al original, porque trabajás con pasajeros y equipaje, y no te olvides de la alineación y el balanceo al cambiar el juego.",
  },
  {
    question: "¿Cada cuánto hay que cambiar los neumáticos de un taxi o un remis?",
    answer:
      "No hay un número fijo: depende de los kilómetros, de la alineación y de cómo se maneja. La referencia es la profundidad del dibujo: el mínimo legal es 1,6 mm y conviene cambiarlos antes si manejás con lluvia. Con mucho uso, revisá el dibujo cada mes y calculá cuánto te queda en la herramienta Cuándo cambiar los neumáticos.",
  },
  {
    question: "¿Sirven los neumáticos económicos para trabajar todo el día?",
    answer:
      "Sí, siempre que sean de la medida correcta, nuevos y con el índice de carga adecuado. El precio más bajo viene de importar directo, no de usar un producto inferior. Lo que más acorta la vida de una cubierta en un auto de trabajo es la mala alineación y la presión incorrecta, no el precio.",
  },
  {
    question: "¿Me conviene cambiar las cuatro o de a dos?",
    answer:
      "Para un auto que trabaja todo el día, lo mejor es cambiar las cuatro a la vez: se desgastan parejo y se evita que un neumático nuevo trabaje con uno gastado. Si por presupuesto cambiás de a dos, las nuevas van atrás y con la misma medida que las otras.",
  },
  {
    question: "¿Si mi auto tiene GNC, cambia algo en los neumáticos?",
    answer:
      "El tanque agrega peso en el baúl, así que el auto trabaja más cargado. Elegí un neumático con el índice de carga igual o mayor al original y ajustá la presión según la carga, tal como indica la calcomanía del auto.",
  },
  {
    question: "¿Hacen la alineación y el balanceo en el mismo lugar?",
    answer:
      "Sí. En el taller de Argüello, Córdoba, hacemos la colocación, el balanceo y la alineación 3D. Si comprás las cubiertas ahí, la colocación y las válvulas no tienen cargo; el balanceo y la alineación se cotizan aparte.",
  },
  {
    question: "¿Cómo sé qué medida necesita mi auto?",
    answer:
      "Está en el flanco del neumático que tenés puesto, con el formato 185/65 R15 (ancho, perfil y rodado), y también en la calcomanía de la puerta del conductor. Si no la encontrás, buscá tu modelo en la sección Por vehículo.",
  },
];

export default async function NeumaticosParaRemisesPage() {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  // Autos de pasajeros de trabajo: sin carga y hasta rodado 16.
  const lista = productos.filter((p) => !p.isCarga && p.size.rim <= 16);

  return (
    <CategoryLanding
      crumbLabel="Neumáticos para remises, taxis y Uber"
      path="/neumaticos-para-remises-taxis-y-uber"
      title="Neumáticos para taxis, remises y Uber"
      productos={lista}
      faqs={FAQS}
      extra={<RemisesExtra productos={lista} />}
      hero={{
        image: {
          src: "/images/local/remis-chevrolet-classic-cambio-de-neumaticos-y-balanceo-trivium-cordoba.webp",
          alt: "Remis Chevrolet Classic sobre el elevador del taller con cubiertas nuevas",
          position: "center 60%",
        },
        headline: "Neumáticos económicos",
        accent: "para remises, taxis y Uber.",
        bajada:
          "Si trabajás con tu auto, las cubiertas son un gasto que se repite. Importamos directo para que cada juego cueste lo menos posible, y lo colocamos, alineamos y balanceamos en el mismo lugar.",
        highlights: [
          {
            titulo: "Precio por unidad, publicado",
            detalle: "El de la web es el del mostrador, con IVA incluido.",
          },
          {
            titulo: "Colocación sin cargo",
            detalle: "Si comprás las cubiertas en el local, la colocación y las válvulas no se cobran.",
          },
          {
            titulo: "Alineación 3D y balanceo",
            detalle: "En el taller de Argüello, por orden de llegada y en la misma visita.",
          },
        ],
        idealPara: [
          "Taxis, remises y autos de Uber, DiDi y Cabify que hacen muchos kilómetros por día",
          "Quien cambia el juego seguido y necesita bajar el costo por kilómetro",
          "Flotas chicas de autos de pasajeros",
        ],
        noIdealPara: [
          "Utilitarios y furgones de reparto: mirá los neumáticos de carga",
          "Camionetas y 4x4: mirá los neumáticos A/T",
        ],
      }}
    />
  );
}
