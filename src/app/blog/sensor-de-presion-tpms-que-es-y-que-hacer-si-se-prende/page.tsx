import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "sensor-de-presion-tpms-que-es-y-que-hacer-si-se-prende";
const TITLE = "Sensor de presión de neumáticos (TPMS): qué es y qué hacer cuando se prende la luz";
const SUBTITLE =
  "Los dos tipos de sistema, por qué la luz no reemplaza medir la presión y qué avisar cuando cambiás las cubiertas.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Qué es el TPMS o sensor de presión de neumáticos, diferencia entre el directo y el indirecto, qué hacer cuando se prende el testigo y qué cuidar al cambiar cubiertas."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué significa la luz amarilla con forma de herradura y un signo de exclamación?",
    answer:
      "Es el testigo del sistema de control de presión (TPMS). Indica que al menos una rueda tiene menos presión de la que el sistema espera. Lo primero es medir las cuatro en frío e inflarlas al valor de la etiqueta del auto.",
  },
  {
    question: "Inflé las ruedas y la luz sigue prendida, ¿por qué?",
    answer:
      "En muchos autos hay que reiniciar el sistema desde el tablero o un botón después de inflar, y en otros se apaga sola tras unos minutos de marcha. Si no se apaga, puede haber un sensor sin batería o una pérdida lenta.",
  },
  {
    question: "¿Puedo cambiar los neumáticos si el auto tiene sensores?",
    answer:
      "Sí. Solo hay que avisar antes de desarmar, porque en los sistemas directos el sensor va unido a la válvula por dentro de la llanta y es una pieza delicada.",
  },
  {
    question: "¿Con TPMS ya no hace falta medir la presión?",
    answer:
      "Hace falta igual. El sistema avisa cuando la presión ya bajó bastante; una rueda algo baja, que gasta de más y consume más combustible, puede no prender la luz.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-12-02" readingMinutes={5} faqs={FAQS}>
      <p>TPMS es la sigla en inglés de «sistema de monitoreo de presión de neumáticos». Es el que prende en el tablero un testigo amarillo con forma de herradura cuando una rueda perdió presión. Cada vez más autos lo traen, y funciona de dos maneras muy distintas.</p>

      <h2>Directo e indirecto</h2>
      <table>
        <thead><tr><th></th><th>Directo</th><th>Indirecto</th></tr></thead>
        <tbody>
          <tr><td>Cómo mide</td><td>Un sensor dentro de cada rueda, unido a la válvula</td><td>Compara el giro de las ruedas con los sensores del ABS</td></tr>
          <tr><td>Qué muestra</td><td>La presión de cada rueda, en algunos autos</td><td>Solo el aviso</td></tr>
          <tr><td>Mantenimiento</td><td>La batería del sensor se agota con los años</td><td>No tiene piezas en la rueda</td></tr>
          <tr><td>Después de inflar o rotar</td><td>A veces hay que reprogramar la posición</td><td>Hay que reiniciarlo desde el tablero</td></tr>
        </tbody>
      </table>
      <p>El indirecto no mide presión: deduce que una rueda está baja porque gira un poco más rápido que las otras. Por eso necesita que le digas cuál es el punto de partida cada vez que inflás.</p>

      <h2>Se prendió la luz: qué hacer</h2>
      <ol>
        <li><strong>Mirá las cuatro ruedas.</strong> Si una está visiblemente baja, no sigas a velocidad de ruta.</li>
        <li><strong>Medí en frío</strong> e inflá al valor de la <Link href="/blog/etiqueta-de-presion-puerta-del-auto">etiqueta de la puerta</Link>. Los valores y cómo medir están en <Link href="/blog/presion-de-neumaticos">presión de neumáticos</Link>.</li>
        <li><strong>Reiniciá el sistema</strong> si tu auto lo pide (el manual indica cómo).</li>
        <li><strong>Si vuelve a prenderse</strong> en la misma rueda, hay una pérdida: <Link href="/blog/neumatico-que-pierde-aire-solo-causas">por qué un neumático pierde aire solo</Link>.</li>
      </ol>
      <p>Una luz que <strong>parpadea</strong> al arrancar y después queda fija suele indicar una falla del propio sistema (un sensor sin batería, por ejemplo) y no una rueda baja.</p>

      <h2>Por qué no reemplaza al medidor</h2>
      <p>El sistema está pensado para avisar de una pérdida importante, no para mantener la presión justa. Recién se activa cuando la rueda ya bajó del orden de un 20 %. Con bastante menos que eso el neumático ya se gasta más en los bordes y el auto consume más. La <Link href="/blog/revision-mensual-de-neumaticos-en-5-minutos">revisión mensual</Link> sigue valiendo.</p>

      <h2>Al cambiar las cubiertas</h2>
      <p>En los sistemas directos, la válvula de cada rueda es parte del sensor. Avisá antes del desarme para que se trabaje con cuidado de ese lado de la llanta, y tené en cuenta que el <Link href="/blog/cambio-de-valvulas-de-neumaticos">cambio de válvulas</Link> común no aplica a esas ruedas: llevan un repuesto específico. Después de rotar o cambiar las cubiertas, reiniciá el sistema para que tome la presión nueva como referencia.</p>
    </ArticleLayout>
  );
}
