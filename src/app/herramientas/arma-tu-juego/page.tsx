import { ToolPage, toolMetadata } from "@/components/tools/ToolPage";
import { ArmaTuJuego, type JuegoProducto } from "@/components/tools/ArmaTuJuego";
import { DEFAULT_BRANCH_ID } from "@/lib/config";
import { getProductosDesdePOS } from "@/lib/pos-api";

export const metadata = toolMetadata("arma-tu-juego");

const FAQS = [
  { question: "¿Cómo armo el presupuesto de un juego de neumáticos?", answer: "Elegí tu auto o escribí la medida, elegí uno de los neumáticos con stock y listo: el total suma los 4 neumáticos y, si querés, alineación y balanceo. Después lo mandás por WhatsApp para coordinar." },
  { question: "¿Qué incluye el servicio de alineación y balanceo?", answer: "El combo del taller incluye la alineación y el balanceo de las cuatro ruedas. Es lo que conviene hacer al estrenar neumáticos para que desgasten parejo." },
  { question: "¿Los precios son de contado?", answer: "Sí. Los precios son de contado con IVA incluido. Para cuotas, consultanos por WhatsApp o usá el cotizador." },
  { question: "¿Qué pasa si no está la medida de mi auto?", answer: "Escribí la medida a mano o buscá una equivalente en la calculadora. Si no tenemos stock, te avisamos por WhatsApp cuándo ingresa." },
];

export default async function Page() {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const compactos: JuegoProducto[] = productos
    .filter((p) => p.enStock && !p.isCarga)
    .map((p) => ({
      id: p.id,
      label: `${p.brand} ${p.modeloBase} ${p.size.width}/${p.size.profile} R${p.size.rim}${p.loadIndex ? ` ${p.loadIndex}${p.speedRating ?? ""}` : ""}`,
      brand: p.brand,
      price: p.price,
      w: p.size.width,
      p: p.size.profile,
      r: p.size.rim,
      img: p.imageUrl && !p.imageUrl.includes("placeholder") ? p.imageUrl : null,
    }));

  return (
    <ToolPage
      slug="arma-tu-juego"
      intro="Elegí tu auto o tu medida, un neumático con stock y mirá al instante el total del juego de 4 con alineación y balanceo. Mandalo por WhatsApp y coordinamos."
      faqs={FAQS}
      guides={[
        { href: "/cotizador", label: "Cotizador de neumáticos" },
        { href: "/servicios/alineacion", label: "Alineación" },
        { href: "/servicios/balanceo", label: "Balanceo" },
        { href: "/neumaticos-baratos", label: "Neumáticos baratos" },
      ]}
    >
      <ArmaTuJuego productos={compactos} />
    </ToolPage>
  );
}
