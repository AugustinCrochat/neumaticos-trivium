import type { Metadata } from "next";
import { DEFAULT_BRANCH_ID } from "@/lib/config";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { canonical, SITE_NAME } from "@/lib/seo";
import { CategoryLanding } from "../CategoryLanding";

export const metadata: Metadata = {
  title: "Neumáticos H/T en Córdoba: precios y medidas",
  description:
    "Neumáticos H/T de calle y ruta para camionetas, SUV y autos, al mejor precio y con stock actualizado. Importación directa, garantía de 1 año, colocación sin cargo en Córdoba y envío a todo el país.",
  alternates: canonical("/neumaticos/ht"),
  openGraph: {
    title: `Neumáticos H/T (Highway Terrain) — ${SITE_NAME}`,
    url: "/neumaticos/ht",
  },
};

const FAQS = [
  {
    question: "¿Qué es un neumático H/T?",
    answer:
      'H/T es de "Highway Terrain": el neumático de calle estándar, pensado para asfalto y uso urbano/ruta. A diferencia de un A/T (All Terrain), no tiene tacos grandes ni espaciados para ripio o barro, así que es más silencioso, dura más en asfalto y gasta menos combustible. Es lo que trae de fábrica la mayoría de los autos y camionetas que no van a hacer offroad.',
  },
  {
    question: "¿En qué se diferencia de uno de carga?",
    answer:
      "El de carga (serie C) tiene una carcasa reforzada para soportar más peso, pensada para utilitarios, furgones y camiones livianos. El H/T es para auto y camioneta de uso particular, sin ese refuerzo extra.",
  },
  {
    question: "¿Los H/T tienen la misma garantía que el resto?",
    answer:
      "Sí, un año por defecto de fabricación, igual que en todo lo que vendemos. La garantía cubre falla de fábrica, no desgaste por uso ni daños por golpes o pinchaduras.",
  },
];

export default async function NeumaticosHTPage() {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const ht = productos.filter((p) => !p.isAT && !p.isCarga);

  return (
    <CategoryLanding
      crumbLabel="Neumáticos H/T"
      path="/neumaticos/ht"
      title="Neumáticos H/T (Highway Terrain)"
      productos={ht}
      faqs={FAQS}
      hero={{
        headline: "Confort y silencio",
        accent: "en cada kilómetro.",
        bajada:
          "Banda de rodamiento pensada para asfalto: manejo estable, bajo ruido y buen rendimiento de combustible.",
        highlights: [
          {
            titulo: "Silenciosos",
            detalle: "Surcos continuos que reducen el ruido de rodadura.",
          },
          {
            titulo: "Buen consumo",
            detalle: "Menor resistencia al avance que un neumático de tacos.",
          },
          {
            titulo: "Más duración",
            detalle: "Desgaste parejo en uso de ciudad y ruta.",
          },
        ],
        idealPara: [
          "Autos y camionetas de uso diario",
          "Ciudad y rutas asfaltadas",
          "Quien prioriza confort y consumo",
        ],
        noIdealPara: [
          "Caminos de tierra o barro frecuentes (te conviene un A/T)",
        ],
      }}
    />
  );
}
