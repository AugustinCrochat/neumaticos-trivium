import { ToolPage, toolMetadata } from "@/components/tools/ToolPage";
import { MejorHorario } from "@/components/tools/MejorHorario";
import { BRANCHES } from "@/lib/config";
import { AFLUENCIA_SEMANAS, DIAS_NOMBRES, diasPorTranquilidad, mejoresTramos } from "@/lib/afluencia";

export const metadata = toolMetadata("mejor-horario-gomeria");

const branch = BRANCHES.find((b) => b.id === "arguello")!;
const orden = diasPorTranquilidad();
const tranquilos = orden.slice(0, 2).map((d) => DIAS_NOMBRES[d]);
const movido = DIAS_NOMBRES[orden[orden.length - 1]];
const tramos = (d: number) => mejoresTramos(d).map((t) => `de ${t.desde} a ${t.hasta} h`).join(" y ");

const FAQS = [
  {
    question: "¿Qué día está más tranquila la gomería?",
    answer: `En nuestro taller de Argüello, ${tranquilos[0]} y ${tranquilos[1]} son los días con menos movimiento, y el ${movido} es el más movido. Es el patrón de las últimas ${AFLUENCIA_SEMANAS} semanas: puede variar en feriados o fechas de mucha demanda.`,
  },
  {
    question: "¿A qué hora conviene ir a alinear y balancear?",
    answer: `Cuando el taller está tranquilo: entre semana, a media mañana (por ejemplo ${tramos(orden[0])} el ${DIAS_NOMBRES[orden[0]]}). El trabajo dura alrededor de 50 minutos en un auto y 1 h 20 en una camioneta, y si hay cola se suma la espera.`,
  },
  {
    question: "¿Necesito turno?",
    answer: "No. Atendemos por orden de llegada, sin turnos. Por eso ir en un horario tranquilo es la mejor forma de esperar menos. Si querés saber cómo está la espera ese día, escribinos por WhatsApp.",
  },
  {
    question: "¿Es el movimiento en vivo?",
    answer: "No: es el movimiento habitual de cada día y hora, calculado con los trabajos que ingresaron al taller. Para ver cómo está ahora mismo, abrí nuestra ficha de Google Maps y mirá «En vivo» dentro de «Horarios populares».",
  },
  {
    question: "¿Hasta qué hora puedo llegar?",
    answer: `Abrimos ${branch.hours.replace("Lun–Sáb", "de lunes a sábado,")}. Para alineado y balanceado conviene llegar con tiempo de sobra antes del cierre; ante la duda, consultá por WhatsApp.`,
  },
];

export default function Page() {
  return (
    <ToolPage
      slug="mejor-horario-gomeria"
      intro="Elegí el día y mirá a qué hora suele haber menos gente en nuestra gomería de Argüello, Córdoba, para alinear y balancear, colocar tuercas antirrobo o cambiar neumáticos sin esperar de más."
      faqs={FAQS}
      guides={[
        { href: "/servicios", label: "Servicios de gomería" },
        { href: "/blog/alineacion-y-balanceo", label: "Alineado y balanceado: qué es y cada cuánto hacerlo" },
        { href: "/tuercas-antirrobo", label: "Tuercas antirrobo" },
        { href: "/sucursales/arguello", label: "Cómo llegar a Argüello" },
      ]}
      article={
        <>
          <h2>Cuándo ir a la gomería en Córdoba para esperar menos</h2>
          <p>
            No damos turnos: se atiende por orden de llegada, así que lo que más cambia la espera es el momento en que llegás. Con los trabajos que ingresaron a nuestro taller de {branch.address}, Argüello, armamos este mapa de días y horas.
          </p>
          <ul>
            <li><strong>Más tranquilo:</strong> {tranquilos.join(" y ")}, con el mejor tramo el {DIAS_NOMBRES[orden[0]]} {tramos(orden[0])}.</li>
            <li><strong>Más movido:</strong> el {movido}, sobre todo a la mañana. Si tu trabajo es largo, como un alineado y balanceado, probá otro día.</li>
            <li><strong>Antes del cierre:</strong> las últimas horas de la tarde suelen juntar gente que sale del trabajo. Para los trabajos de más de una hora, no llegues justo.</li>
          </ul>
          <h2>Cómo usar el movimiento en vivo de Google Maps</h2>
          <p>
            En nuestra ficha de Google Maps, dentro de «Horarios populares», aparece el indicador «En vivo»: compara cuánta gente hay ahora con lo habitual de ese día. Es una referencia aproximada, pero sirve para decidir si salís ya o esperás un rato. Esta página suma lo que Google no muestra: la tendencia propia de nuestro taller y qué conviene según el trabajo que vengas a hacer.
          </p>
        </>
      }
    >
      <MejorHorario />
    </ToolPage>
  );
}
