import { ToolPage, toolMetadata } from "@/components/tools/ToolPage";
import { DotGuia } from "@/components/tools/DotGuia";
import { CodigoDot } from "@/components/tools/CodigoDot";

export const metadata = toolMetadata("codigo-dot");

const FAQS = [
  { question: "¿Dónde está el código DOT del neumático?", answer: "En el flanco, después de las letras DOT. Es una serie de letras y números; los últimos 4 dígitos, dentro de un óvalo, indican la fecha de fabricación. A veces el óvalo está sólo en uno de los dos flancos, así que si no lo ves, mirá el lado interno." },
  { question: "¿Cómo se lee la fecha del DOT?", answer: "Los primeros dos dígitos son la semana de fabricación (01 a 53) y los últimos dos el año. Por ejemplo, 2423 significa la semana 24 del año 2023, es decir, mediados de junio de 2023." },
  { question: "¿Cuántos años dura un neumático aunque no se use?", answer: "El caucho envejece por el calor, la luz y el oxígeno aunque el auto no ande. La mayoría de los fabricantes recomienda revisarlos a partir de los 5 años y reemplazarlos como máximo a los 10, sin importar cuánto dibujo les quede." },
  { question: "¿Es normal que un neumático nuevo tenga uno o dos años de fabricación?", answer: "Sí, es lo habitual: pasa por importación, distribución y stock. Hasta 2 años de fabricación se considera nuevo. Conviene desconfiar de un neumático 'nuevo' con más de 3 o 4 años." },
  { question: "¿Qué pasa con un DOT de 3 dígitos?", answer: "Los neumáticos fabricados antes del año 2000 usaban un código de 3 dígitos (semana y último número del año). Son de más de 25 años y no deberían usarse." },
];

export default function Page() {
  return (
    <ToolPage
      slug="codigo-dot"
      hero={false}
      intro="Escribí los 4 números del código DOT del flanco y te decimos en qué semana y año se fabricó el neumático, cuántos años tiene y si conviene cambiarlo."
      faqs={FAQS}
      guides={[
        { href: "/blog/como-leer-medida-neumatico", label: "Cómo leer la medida de un neumático" },
        { href: "/blog/cada-cuantos-km-cambiar-neumaticos", label: "Cada cuántos km cambiar los neumáticos" },
        { href: "/herramientas/cuando-cambiar-neumaticos", label: "¿Cuándo cambiar mis neumáticos?" },
      ]}
      article={
        <>
          <h2>Cómo saber la fecha de fabricación de un neumático</h2>
          <p>
            Todos los neumáticos llevan grabado el código <strong>DOT</strong> (Department of Transportation), una identificación obligatoria que termina con la fecha de fabricación en 4 dígitos. Es la forma más confiable de saber qué tan viejo es un neumático, nuevo o usado.
          </p>
          <ul>
            <li><strong>Los dos primeros dígitos:</strong> semana del año (de 01 a 53).</li>
            <li><strong>Los dos últimos:</strong> año de fabricación (23 es 2023).</li>
          </ul>
          <p>
            La antigüedad importa porque el compuesto de goma pierde flexibilidad con los años. Un neumático viejo puede tener buen dibujo y aun así agarrar peor en mojado o agrietarse. Si vas a comprar neumáticos, fijate siempre en el DOT: es nuevo y debería tener pocos años de fabricación.
          </p>
        </>
      }
    >
      <h2 className="mb-4 text-xl font-black text-tire-950">Dónde está el código</h2>
      <DotGuia />
      <hr className="my-6 border-slate-200" />
      <h2 className="mb-4 text-xl font-black text-tire-950">Probá con el tuyo</h2>
      <CodigoDot />
    </ToolPage>
  );
}
