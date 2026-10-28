import type { Metadata } from "next";
import { DEFAULT_BRANCH_ID } from "@/lib/config";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { canonical, SITE_NAME } from "@/lib/seo";
import { CategoryLanding } from "../CategoryLanding";
import { poolShare } from "@/lib/share-image";

export const metadata: Metadata = {
  title: "Neumáticos A/T en Córdoba: precios y medidas",
  description:
    "Neumáticos A/T (All Terrain) para camionetas, pick-ups y 4x4 al mejor precio, con stock y precio actualizado. Importación directa, garantía de 1 año, colocación sin cargo en Córdoba.",
  alternates: canonical("/neumaticos/at"),
  openGraph: {
    title: `Neumáticos A/T (All Terrain) — ${SITE_NAME}`,
    url: "/neumaticos/at",
    ...poolShare("at").openGraph,
  },
    twitter: poolShare("at").twitter,
};

const FAQS = [
  {
    question: "¿Qué diferencia hay entre un neumático A/T y uno normal?",
    answer:
      "El A/T (All Terrain) tiene tacos más grandes y espaciados en la banda de rodamiento, pensados para andar en ripio, barro y arena sin perder tracción. A cambio, en asfalto es un poco más ruidoso y gasta algo más de combustible que un neumático de calle. Es la opción intermedia entre un neumático de ciudad y uno M/T (Mud Terrain), que ya es para off-road más exigente.",
  },
  {
    question: "¿Puedo poner A/T si uso la camioneta solo en ciudad?",
    answer:
      "Sí, funciona bien en asfalto, sólo que vas a notar un poco más de ruido de rodadura que con un neumático de calle. Si nunca salís de asfalto y el uso es 100% urbano, probablemente te convenga más un neumático normal; el A/T se justifica cuando hay ripio, campo o barro en el uso habitual.",
  },
  {
    question: "¿Los A/T tienen la misma garantía que el resto?",
    answer:
      "Sí, un año por defecto de fabricación, igual que en todo lo que vendemos. La garantía cubre falla de fábrica, no desgaste por uso ni daños por golpes o pinchaduras.",
  },
];

export default async function NeumaticosATPage() {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const at = productos.filter((p) => p.isAT);

  return (
    <CategoryLanding
      crumbLabel="Neumáticos A/T"
      path="/neumaticos/at"
      title="Neumáticos A/T (All Terrain)"
      productos={at}
      faqs={FAQS}
      hero={{
        image: {
          src: "/images/local/neumatico-at-grenlander-maga-at-two-camioneta-clasica-trivium.webp",
          alt: "Técnico colocando un neumático Grenlander A/T en una pickup clásica",
          position: "center 70%",
        },
        headline: "Ripio, barro y asfalto.",
        accent: "Un solo neumático.",
        bajada:
          "Tacos grandes y bien espaciados para camionetas y 4x4 que no se quedan en la ruta.",
        highlights: [
          {
            titulo: "Tracción en tierra",
            detalle: "Tacos grandes que agarran en ripio, barro y arena.",
          },
          {
            titulo: "Flancos resistentes",
            detalle: "Más protección ante piedras y caminos rotos.",
          },
          {
            titulo: "Sirve en asfalto",
            detalle:
              "Andan bien en ruta, con algo más de ruido que uno de calle.",
          },
        ],
        idealPara: [
          "Camionetas y 4x4 con uso mixto",
          "Campo, ripio y caminos de tierra",
          "Viajes y escapadas off-road suaves",
        ],
        noIdealPara: [
          "Uso 100% urbano (te conviene un H/T)",
          "Off-road extremo con barro profundo (M/T)",
        ],
      }}
    />
  );
}
