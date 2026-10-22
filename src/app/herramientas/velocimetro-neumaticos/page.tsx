import { ToolPage, toolMetadata } from "@/components/tools/ToolPage";
import { Velocimetro } from "@/components/tools/Velocimetro";

export const metadata = toolMetadata("velocimetro-neumaticos");

const FAQS = [
  { question: "¿Cómo afecta el velocímetro un neumático de otra medida?", answer: "El velocímetro cuenta vueltas de rueda. Si el neumático nuevo tiene más diámetro, da menos vueltas por kilómetro y el tablero marca menos de lo que realmente andás; si tiene menos diámetro, marca de más. Con ±3 % de diferencia el desvío es chico." },
  { question: "¿Cómo se calcula el diámetro de un neumático?", answer: "Rodado × 25,4 + 2 × (ancho × perfil ÷ 100), en milímetros. Con 205/55 R16: 16 × 25,4 + 2 × (205 × 0,55) = 631,9 mm." },
  { question: "Si el velocímetro marca 100, ¿cuánto voy en realidad con un neumático más grande?", answer: "Más: la velocidad real es el valor marcado multiplicado por la relación entre el diámetro nuevo y el original. Si el nuevo es 2 % más grande, a 100 km/h marcados vas a 102 km/h reales." },
  { question: "¿Se desajusta también el cuentakilómetros?", answer: "Sí, con el mismo porcentaje. Un neumático más grande marca menos kilómetros de los que recorrés, algo que importa para los services y la garantía." },
  { question: "¿Qué tolerancia es segura?", answer: "Hasta ±3 % de diámetro se considera equivalente. Fuera de ese rango se desajustan el ABS, el control de estabilidad y la calibración del tablero." },
];

export default function Page() {
  return (
    <ToolPage
      slug="velocimetro-neumaticos"
      intro="Poné la medida original y la nueva: te mostramos cuánto va a marcar de más o de menos el velocímetro, la velocidad real a cada ritmo y el desvío del cuentakilómetros."
      faqs={FAQS}
      guides={[
        { href: "/calculadora-equivalencia-neumaticos", label: "Calculadora de equivalencias" },
        { href: "/blog/equivalencias", label: "Equivalencias de neumáticos" },
        { href: "/blog/como-leer-medida-neumatico", label: "Cómo leer la medida" },
      ]}
      article={
        <>
          <h2>Por qué cambia el velocímetro</h2>
          <p>
            El auto calcula la velocidad contando las vueltas de las ruedas, suponiendo el diámetro original del neumático. Si ponés otra medida, la cuenta se corre en proporción. Al subir el diámetro, el tablero marca menos de lo real; al bajarlo, marca de más.
          </p>
          <p>
            Por eso las medidas equivalentes buscan conservar el diámetro total dentro de ±3 %. Si querés ver qué medidas cumplen eso con stock, usá la calculadora de equivalencias.
          </p>
        </>
      }
    >
      <Velocimetro />
    </ToolPage>
  );
}
