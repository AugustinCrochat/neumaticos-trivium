import type { Metadata } from "next";
import { DEFAULT_BRANCH_ID } from "@/lib/config";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { canonical, SITE_NAME } from "@/lib/seo";
import { cargaSlug, formatCargaSize } from "@/lib/carga";
import { CategoryLanding } from "../CategoryLanding";
import { CargaExtra } from "./CargaExtra";
import { poolShare } from "@/lib/share-image";

export async function generateMetadata(): Promise<Metadata> {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const enStock = productos.filter((p) => p.isCarga && p.enStock);
  const desde = enStock.length ? Math.min(...enStock.map((p) => p.price)) : null;
  // El precio "desde" va en el título porque es lo que decide el clic en la
  // SERP: el posicionamiento de esta página es precio bajo en carga.
  const title = desde
    ? `Neumáticos de carga desde $${desde.toLocaleString("es-AR")}`
    : "Neumáticos de carga para furgones y utilitarios";
  return {
    title,
    description:
      "Neumáticos de carga (serie C) para furgones, utilitarios y camiones livianos: precios bajos por importación directa, stock real por medida, garantía de 1 año y colocación sin cargo en nuestros locales.",
    alternates: canonical("/neumaticos/carga"),
    openGraph: { title: `Neumáticos de carga — ${SITE_NAME}`, url: "/neumaticos/carga", ...poolShare("carga").openGraph },
    twitter: poolShare("carga").twitter,
  };
}

const FAQS = [
  {
    question: "¿Qué quiere decir la C después de la medida?",
    answer:
      'La C es de "Commercial": indica que el neumático es de carga, con una carcasa reforzada para soportar más peso que uno de auto en la misma medida. Se usa en utilitarios, furgones y camiones livianos, y no es intercambiable con un neumático de auto aunque coincida el ancho, perfil y rodado, porque el índice de carga es distinto.',
  },
  {
    question: "¿Cómo sé qué índice de carga necesito?",
    answer:
      "Tiene que ser igual o mayor al que trae de fábrica el vehículo, dato que figura en la calcomanía de la puerta del conductor o en el manual. Bajar de índice de carga es riesgoso: el neumático puede deformarse o fallar con el vehículo cargado.",
  },
  {
    question: "¿Los neumáticos de carga tienen la misma garantía que el resto?",
    answer:
      "Sí, un año por defecto de fabricación, igual que en todo lo que vendemos. La garantía cubre falla de fábrica, no desgaste por uso ni daños por sobrecarga, golpes o pinchaduras.",
  },
  {
    question: "¿Por qué los neumáticos de carga de Trivium son más baratos?",
    answer:
      "Porque se importan de forma directa, sin importador ni distribuidor mayorista en el medio, y esa diferencia de margen se traslada al precio. No son neumáticos usados ni remanufacturados: son nuevos, con un año de garantía por defecto de fábrica, y el precio publicado en la web es el que se cobra en el local.",
  },
  {
    question: "¿Puedo poner un neumático de auto en mi utilitario?",
    answer:
      "Si el vehículo trae neumáticos C de fábrica, no. Un neumático de auto en la misma medida tiene menor capacidad de carga y menor presión máxima, y con el vehículo cargado puede deformarse o romperse. La regla es respetar el tipo (C) y el índice de carga que figura en la calcomanía de la puerta del conductor.",
  },
  {
    question: "¿Qué diferencia hay entre carga simple y dual?",
    answer:
      "Los neumáticos C traen dos índices de carga, por ejemplo 104/102. El primero es la carga máxima por rueda en montaje simple (una rueda por lado) y el segundo en rodado dual (dos ruedas por lado), que es más bajo. La gran mayoría de los utilitarios livianos usa montaje simple.",
  },
  {
    question: "¿Hacen la colocación de neumáticos de carga?",
    answer:
      "Sí. En nuestro local de Argüello, Córdoba, el arme, el desarme y el cambio de válvulas van sin cargo si comprás las cubiertas ahí. El balanceo y la alineación se cobran aparte y conviene hacerlos al cambiar el juego completo.",
  },
];

export default async function NeumaticosCargaPage() {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const carga = productos.filter((p) => p.isCarga);

  return (
    <CategoryLanding
      crumbLabel="Neumáticos de carga"
      path="/neumaticos/carga"
      title="Neumáticos de carga"
      productos={carga}
      faqs={FAQS}
      sizeHref={(size) => `/neumaticos/carga/${cargaSlug(size)}`}
      sizeLabel={formatCargaSize}
      extra={<CargaExtra productos={carga} />}
      hero={{
        image: {
          src: "/images/local/dos-cubiertas-de-carga-grenlander-175-65-r14c-modelos-distintos-trivium-cordoba.webp",
          alt: "Dos cubiertas de carga Grenlander 175/65 R14C sostenidas en el taller",
          position: "center 40%",
        },
        headline: "Reforzados",
        accent: "para trabajar.",
        bajada:
          "Neumáticos de carga para utilitarios, vans y pick-ups que andan con peso todos los días.",
        highlights: [
          {
            titulo: "Más capacidad",
            detalle:
              "Carcasa reforzada con mayor índice de carga por neumático.",
          },
          {
            titulo: "Aguantan el trabajo",
            detalle: "Pensados para uso intensivo y viajes con carga.",
          },
          {
            titulo: "Medida con C",
            detalle:
              "Llevan una C después del rodado, por ejemplo 195/70 R15C.",
          },
        ],
        idealPara: [
          "Utilitarios, furgones y vans",
          "Reparto y trabajo diario con carga",
          "Pick-ups que cargan peso",
        ],
        noIdealPara: [
          "Autos de pasajeros: se sienten más duros y no los necesitan",
        ],
      }}
    />
  );
}
