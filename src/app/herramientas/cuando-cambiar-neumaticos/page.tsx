import { ToolPage, toolMetadata } from "@/components/tools/ToolPage";
import { DesgasteFoto } from "@/components/tools/DesgasteFoto";
import { CuandoCambiar } from "@/components/tools/CuandoCambiar";

export const metadata = toolMetadata("cuando-cambiar-neumaticos");

const FAQS = [
  { question: "¿Cómo mido la profundidad del dibujo?", answer: "Con un medidor de profundidad (se consigue barato en cualquier casa de repuestos) en el surco más gastado. Sin herramienta, mirá los indicadores de desgaste TWI: pequeños tacos en el fondo de los canales. Si el dibujo está al ras con ellos, llegaste al límite de 1,6 mm." },
  { question: "¿Con cuántos milímetros hay que cambiar los neumáticos?", answer: "El límite mínimo es 1,6 mm, pero conviene no esperar a llegar: por debajo de los 3 mm la distancia de frenado en piso mojado aumenta de forma notoria, y el riesgo de aquaplaning es mayor." },
  { question: "¿Cada cuántos kilómetros se cambian?", answer: "Depende del uso, la marca y el estilo de manejo; como orden de magnitud, entre 30.000 y 60.000 km. Alinear, balancear y rotar las ruedas en tiempo es lo que más ayuda a llegar al extremo alto." },
  { question: "¿Importa la edad aunque tengan dibujo?", answer: "Sí. El caucho se reseca con el tiempo aunque el auto no ande. A partir de los 5 años conviene revisarlos y a los 10 reemplazarlos. La fecha está en el código DOT del flanco." },
  { question: "¿Hay que cambiar los cuatro a la vez?", answer: "Lo ideal es el juego completo. Si cambiás sólo dos, los nuevos van atrás (en cualquier tracción) para mantener la estabilidad en mojado, y siempre del mismo modelo en un mismo eje." },
];

export default function Page() {
  return (
    <ToolPage
      slug="cuando-cambiar-neumaticos"
      intro="Medí el dibujo, sumá el código DOT y los kilómetros si los tenés, y te decimos si tus neumáticos están bien, para vigilar o para cambiar ya."
      faqs={FAQS}
      guides={[
        { href: "/blog/cada-cuantos-km-cambiar-neumaticos", label: "Cada cuántos km cambiar los neumáticos" },
        { href: "/herramientas/codigo-dot", label: "Lector de código DOT" },
        { href: "/blog/rotacion-de-neumaticos", label: "Rotación de neumáticos" },
        { href: "/servicios/alineacion", label: "Alineación" },
      ]}
      article={
        <>
          <h2>Las tres señales para cambiar un neumático</h2>
          <ul>
            <li><strong>Dibujo:</strong> 1,6 mm es el límite; a los 3 mm el agarre en mojado ya cae.</li>
            <li><strong>Edad:</strong> a partir de los 5 años conviene revisarlo; a los 10, cambiarlo aunque se vea bien.</li>
            <li><strong>Daños:</strong> bultos, cortes, grietas o desgaste desparejo se resuelven con un cambio, no con tiempo.</li>
          </ul>
          <p>
            El resultado de esta herramienta es una guía orientativa. Si tenés dudas, pasá por el taller para que lo revisen en persona.
          </p>
        </>
      }
    >
      <CuandoCambiar />
      <DesgasteFoto className="mt-8 border-t border-slate-200 pt-6" />
    </ToolPage>
  );
}
