import { ToolPage, toolMetadata } from "@/components/tools/ToolPage";
import { IndiceCargaVelocidad } from "@/components/tools/IndiceCargaVelocidad";

export const metadata = toolMetadata("indice-carga-velocidad");

const FAQS = [
  { question: "¿Qué significa 91V en un neumático?", answer: "Son dos datos: 91 es el índice de carga (cada neumático soporta hasta 615 kg) y V el índice de velocidad (hasta 240 km/h). Siempre van al final de la medida, por ejemplo 205/55 R16 91V." },
  { question: "¿Cuánto peso soporta un neumático?", answer: "Depende del índice de carga, según una tabla estándar: 82 equivale a 475 kg, 91 a 615 kg, 95 a 690 kg y 104 a 900 kg por neumático. Multiplicalo por cuatro para la capacidad del juego." },
  { question: "¿Puedo poner un índice de carga menor al original?", answer: "No. El neumático nuevo tiene que tener un índice de carga igual o mayor al que indica el fabricante del vehículo. Uno menor puede sobrecalentarse o reventar con el peso real del auto." },
  { question: "¿Y el índice de velocidad?", answer: "También igual o mayor. Aunque nunca llegues a esa velocidad, un neumático de mejor código de velocidad suele ser más firme y con mejor respuesta en curva. Hay que respetar el mínimo que figura en el manual." },
  { question: "¿Qué quiere decir 104/101R?", answer: "Es un neumático de utilitario: 104 es el índice de carga en rodado simple y 101 en rodado dual (dos ruedas juntas), por eso es menor. La R indica hasta 170 km/h." },
  { question: "¿Dónde veo el índice que pide mi auto?", answer: "En la calcomanía del parante de la puerta del conductor, en el manual o en el flanco del neumático original, al final de la medida." },
];

export default function Page() {
  return (
    <ToolPage
      slug="indice-carga-velocidad"
      intro="Escribí el índice de tu neumático, por ejemplo 91V, y te decimos cuántos kilos soporta cada uno, cuánto el juego de cuatro y a qué velocidad máxima puede ir."
      faqs={FAQS}
      guides={[
        { href: "/blog/indice-de-carga-y-velocidad", label: "Índice de carga y velocidad: guía completa" },
        { href: "/blog/como-leer-medida-neumatico", label: "Cómo leer la medida" },
        { href: "/blog/carga-simple-y-dual-neumaticos-c", label: "Carga simple y dual" },
        { href: "/neumaticos/carga", label: "Neumáticos de carga" },
      ]}
      article={
        <>
          <h2>Cómo leer el índice de carga y velocidad</h2>
          <p>
            Después de la medida (205/55 R16) el neumático lleva un número y una letra, por ejemplo <strong>91V</strong>. El número es el <strong>índice de carga</strong>: la carga máxima que soporta ese neumático, que sale de una tabla estándar. La letra es el <strong>índice de velocidad</strong>: la velocidad máxima a la que puede rodar cargado.
          </p>
          <p>
            Esos valores son un piso: al cambiar de neumático, el nuevo tiene que igualar o superar los del original. Para camionetas, utilitarios y vehículos que van cargados, mirá especialmente la carga.
          </p>
        </>
      }
    >
      <IndiceCargaVelocidad />
    </ToolPage>
  );
}
