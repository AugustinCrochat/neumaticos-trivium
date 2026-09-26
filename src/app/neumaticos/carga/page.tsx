import type { Metadata } from "next";
import { DEFAULT_BRANCH_ID } from "@/lib/config";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { canonical, SITE_NAME } from "@/lib/seo";
import { CategoryLanding } from "../CategoryLanding";

export const metadata: Metadata = {
  title: "Neumáticos de carga — precios y medidas",
  description:
    "Neumáticos de carga (serie C) para utilitarios, furgones y camiones livianos, con stock y precio actualizado. Importación directa, garantía de 1 año y envío a todo el país.",
  alternates: canonical("/neumaticos/carga"),
  openGraph: {
    title: `Neumáticos de carga — ${SITE_NAME}`,
    url: "/neumaticos/carga",
  },
};

const FAQS = [
  {
    question: "¿Qué quiere decir la C después de la medida?",
    answer:
      "La C es de \"Commercial\": indica que el neumático es de carga, con una carcasa reforzada para soportar más peso que uno de auto en la misma medida. Se usa en utilitarios, furgones y camiones livianos, y no es intercambiable con un neumático de auto aunque coincida el ancho, perfil y rodado, porque el índice de carga es distinto.",
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
    />
  );
}
