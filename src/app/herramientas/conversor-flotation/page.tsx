import { ToolPage, toolMetadata } from "@/components/tools/ToolPage";
import { ConversorFlotation } from "@/components/tools/ConversorFlotation";

export const metadata = toolMetadata("conversor-flotation");

const FAQS = [
  { question: "¿Qué significa 31x10.5 R15?", answer: "Es una medida flotation, en pulgadas: 31 es el diámetro total del neumático, 10,5 su ancho de sección y R15 el rodado de la llanta. Se usa en neumáticos de camioneta y 4x4 (LT, A/T y M/T)." },
  { question: "¿Cuál es la equivalencia métrica de 31x10.5 R15?", answer: "Aproximadamente 265/75 R15. La conversión usa 1 pulgada = 25,4 mm y se redondea a los pasos de fábrica (ancho de 5 mm, perfil de 5 %)." },
  { question: "¿Y la de 33x12.5 R15?", answer: "Unos 315/70 R15. Es una conversión aproximada: confirmá siempre con el catálogo, porque las medidas reales varían algunos milímetros." },
  { question: "¿Se puede usar una medida métrica en lugar de una flotation?", answer: "Sí, si el diámetro es parecido (±3 %) y entra en el guardabarros. Es muy común pasar de flotation a una métrica equivalente porque hay más oferta." },
  { question: "¿Por qué la conversión no es exacta?", answer: "Los fabricantes redondean medidas distintas: un 31x10.50 puede ser 265/75 o 255/80 según la marca, y el ancho real de sección varía con la llanta. Por eso la herramienta da el valor más cercano." },
];

export default function Page() {
  return (
    <ToolPage
      slug="conversor-flotation"
      intro="Pasá una medida en pulgadas (31x10.5 R15, 33x12.5 R15) a medida métrica, o al revés, y buscala con stock en el catálogo."
      faqs={FAQS}
      guides={[
        { href: "/blog/medidas-flotation-camionetas", label: "Medidas flotation en camionetas" },
        { href: "/neumaticos/at", label: "Neumáticos A/T" },
        { href: "/calculadora-equivalencia-neumaticos", label: "Calculadora de equivalencias" },
      ]}
      article={
        <>
          <h2>Qué es una medida flotation</h2>
          <p>
            En camionetas y 4x4 es común ver medidas en pulgadas, como <strong>31x10.5 R15</strong>: diámetro total, ancho y rodado. Los neumáticos de auto, en cambio, usan el sistema métrico (205/55 R16). La herramienta convierte entre uno y otro para que encuentres lo que necesitás.
          </p>
        </>
      }
    >
      <ConversorFlotation />
    </ToolPage>
  );
}
