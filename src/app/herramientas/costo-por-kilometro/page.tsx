import { ToolPage, toolMetadata } from "@/components/tools/ToolPage";
import { CostoKm } from "@/components/tools/CostoKm";

export const metadata = toolMetadata("costo-por-kilometro");

const FAQS = [
  { question: "¿Qué es el costo por kilómetro de un neumático?", answer: "Es el precio dividido por los kilómetros que dura: así se compara un neumático caro que rinde más con uno barato que rinde menos. Se suele expresar como costo cada 1.000 km." },
  { question: "¿Cuántos kilómetros dura un neumático?", answer: "Depende de la marca, el uso, la presión y la alineación. A modo de referencia, entre 30.000 y 60.000 km. Los neumáticos económicos suelen estar en la parte baja y los de marca en la alta, pero no siempre." },
  { question: "¿Conviene siempre el más barato por kilómetro?", answer: "No necesariamente. El costo por kilómetro no mide el frenado en mojado ni el confort, que importan igual. Conviene como criterio de desempate entre neumáticos de calidad parecida." },
  { question: "¿Qué kilometraje uso para comparar?", answer: "El que te pase alguien de confianza para tu vehículo y tu forma de manejar. Si no lo sabés, usá el mismo valor en ambos y mirá sólo la diferencia de precio, o sumá algo de margen al económico." },
];

export default function Page() {
  return (
    <ToolPage
      slug="costo-por-kilometro"
      intro="Compará dos neumáticos por lo que te cuesta cada 1.000 km y por año, no por el precio de góndola. Cargá precio, vida útil estimada y tus kilómetros anuales."
      faqs={FAQS}
      guides={[
        { href: "/blog/precio-calidad-neumaticos-costo-por-km", label: "Precio, calidad y costo por km" },
        { href: "/blog/cuatro-economicos-o-dos-de-marca", label: "Cuatro económicos o dos de marca" },
        { href: "/neumaticos-baratos", label: "Neumáticos baratos" },
      ]}
      article={
        <>
          <h2>Cómo comparar neumáticos por lo que realmente cuestan</h2>
          <p>
            Un neumático de $180.000 que dura 60.000 km cuesta $3.000 cada 1.000 km; uno de $110.000 que dura 35.000 km, unos $3.143. Parecen muy distintos de precio y no lo son tanto por kilómetro. Los valores de ejemplo de la herramienta son ilustrativos: usá los de tu caso.
          </p>
          <p>
            Para el cálculo anual, la herramienta supone un juego de cuatro y se queda con la diferencia entre ambos. Es una guía: la decisión también depende del agarre, el ruido y la seguridad.
          </p>
        </>
      }
    >
      <CostoKm />
    </ToolPage>
  );
}
