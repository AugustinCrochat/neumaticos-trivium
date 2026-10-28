import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { DesgasteFoto } from "@/components/tools/DesgasteFoto";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { AhorroLinks } from "@/components/blog/AhorroLinks";
import { EquipoHofmann } from "@/components/blog/EquipoHofmann";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "alineacion-y-balanceo";
const TITLE = "Alineación y balanceo: qué es cada cosa y cada cuánto se hacen";
const SUBTITLE =
  "Se nombran juntos pero resuelven problemas distintos. Uno corrige hacia dónde apuntan las ruedas; el otro, cómo giran. Acá va la diferencia en criollo.";

export const metadata: Metadata = {
  ...blogShare("alineacion-y-balanceo"),
  title: TITLE,
  description:
    "Diferencia entre alineación y balanceo, síntomas de cada problema, cada cuántos kilómetros conviene hacerlos y qué pasa si los postergás.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cuál es la diferencia entre alineación y balanceo?",
    answer:
      "La alineación corrige los ángulos con los que las ruedas apoyan y apuntan respecto del chasis: define si el auto va derecho. El balanceo corrige la distribución de peso de cada conjunto llanta más neumático para que gire sin vibrar. Son equipos distintos, procedimientos distintos y problemas distintos, aunque conviene hacerlos en la misma visita.",
  },
  {
    question: "¿Cada cuánto hay que alinear el auto?",
    answer:
      "Como referencia, cada 10.000 kilómetros o una vez al año, lo que pase primero. Pero es un intervalo orientativo: si pegaste un golpe fuerte contra un bache o un cordón, si cambiaste neumáticos o si tocaste algo de la suspensión, corresponde alinear sin esperar al kilometraje.",
  },
  {
    question: "¿Hay que balancear cada vez que se cambia un neumático?",
    answer:
      "Sí, siempre. Al desmontar y montar, la posición relativa entre la llanta y el neumático cambia, y con ella la distribución de peso del conjunto. Un neumático nuevo sin balancear vibra igual que uno viejo desbalanceado. También corresponde rebalancear si se cayó un contrapeso o después de una reparación de pinchadura.",
  },
  {
    question: "¿Qué pasa si no alineo el auto?",
    answer:
      "El neumático se desgasta de un solo lado y puede quedar inutilizable en pocos miles de kilómetros, aunque el resto de la banda esté sana. Además el auto tira hacia un costado, lo que obliga a corregir de forma permanente con el volante, y aumenta el consumo porque las ruedas trabajan arrastrando en lugar de rodar libres.",
  },
  {
    question: "¿El volante torcido significa que está desalineado?",
    answer:
      "Casi siempre sí. Si el auto va derecho pero el volante está torcido, la convergencia quedó fuera de parámetro. Si además el auto se va para un lado al soltar el volante en una recta plana, la desalineación es más marcada. En ambos casos se corrige con una alineación, no cambiando neumáticos.",
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={SLUG}
      title={TITLE}
      subtitle={SUBTITLE}
      category="Servicios"
      date="2026-07-31"
      readingMinutes={6}
      faqs={FAQS}
    >
      <p>
        &quot;Alineación y balanceo&quot; se dice de corrido, como si fuera un solo servicio. No lo
        es. Son dos trabajos distintos, con equipos distintos, que resuelven dos problemas que ni
        siquiera se parecen. Entender cuál es cuál te sirve para dos cosas: describir bien el
        síntoma cuando llegás al taller, y no pagar por algo que no necesitás.
      </p>
      <DesgasteFoto className="my-8" />

      <h2>Balanceo: que la rueda gire sin vibrar</h2>
      <p>
        Una rueda es un conjunto de llanta más neumático, y ese conjunto nunca tiene el peso
        perfectamente repartido alrededor de su eje. Siempre hay zonas un poco más pesadas: la
        soldadura de la llanta, el empalme del neumático, la válvula. A baja velocidad no se nota.
        A 100 km/h, esa rueda gira unas 800 veces por minuto, y un desbalance de apenas 10 gramos
        genera una fuerza centrífuga que sacude toda la suspensión.
      </p>
      <p>
        El balanceo consiste en montar la rueda en una máquina que la hace girar, detecta dónde
        está el exceso de peso y en qué plano, y calcula qué contrapeso hay que poner en el lado
        opuesto. Eso es todo: se agregan unos gramos de plomo o zinc en el punto exacto y el
        conjunto queda equilibrado.
      </p>
      <h3>Cómo se siente un desbalanceo</h3>
      <ul>
        <li>
          <strong>Vibración en el volante</strong> que aparece en un rango de velocidad
          determinado, típicamente entre 90 y 120 km/h, y que a veces desaparece si vas más rápido.
          Eso apunta a las ruedas delanteras.
        </li>
        <li>
          <strong>Vibración en el asiento o el piso</strong> más que en el volante: suele ser una
          rueda trasera.
        </li>
        <li>
          <strong>Desgaste en manchones</strong>, con zonas más gastadas que otras a lo largo de la
          banda.
        </li>
      </ul>

      <h2>Alineación: que las ruedas apunten donde deben</h2>
      <p>
        La alineación no toca la rueda: ajusta los ángulos con los que la suspensión la sostiene.
        Son tres, y cada uno hace algo distinto.
      </p>
      <table>
        <thead>
          <tr>
            <th>Ángulo</th>
            <th>Qué controla</th>
            <th>Si está mal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Convergencia</strong> (toe)
            </td>
            <td>Si las ruedas apuntan hacia adentro o hacia afuera vistas desde arriba</td>
            <td>Desgaste en forma de pluma y volante torcido</td>
          </tr>
          <tr>
            <td>
              <strong>Camber</strong>
            </td>
            <td>La inclinación de la rueda hacia adentro o afuera vista de frente</td>
            <td>Desgaste concentrado en un solo borde</td>
          </tr>
          <tr>
            <td>
              <strong>Caster</strong>
            </td>
            <td>La inclinación del eje de dirección vista de costado</td>
            <td>Volante que no vuelve solo, dirección pesada o inestable</td>
          </tr>
        </tbody>
      </table>
      <p>
        La convergencia es la que más se desajusta y la que más rápido come neumáticos. Un golpe
        fuerte contra un bache alcanza para moverla, y a partir de ahí el desgaste avanza en
        milímetros por mes.
      </p>
      <h3>Cómo se siente una desalineación</h3>
      <ul>
        <li>
          <strong>El auto tira para un lado</strong> al soltar el volante en una recta plana.
        </li>
        <li>
          <strong>El volante queda torcido</strong> aunque el auto vaya derecho.
        </li>
        <li>
          <strong>Un solo borde del neumático se gasta</strong> mientras el resto está bien.
        </li>
        <li>
          <strong>Chillido en curvas</strong> a velocidad baja, sin que estés forzando.
        </li>
      </ul>

      <h2>Cada cuánto hacer cada cosa</h2>
      <table>
        <thead>
          <tr>
            <th>Situación</th>
            <th>Alineación</th>
            <th>Balanceo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cambio de neumáticos</td>
            <td>Sí</td>
            <td>Sí, obligatorio</td>
          </tr>
          <tr>
            <td>Rotación de ruedas</td>
            <td>No hace falta</td>
            <td>Recomendable</td>
          </tr>
          <tr>
            <td>Golpe fuerte contra bache o cordón</td>
            <td>Sí, cuanto antes</td>
            <td>Conviene revisar</td>
          </tr>
          <tr>
            <td>Trabajo en la suspensión o la dirección</td>
            <td>Sí, siempre</td>
            <td>No hace falta</td>
          </tr>
          <tr>
            <td>Mantenimiento de rutina</td>
            <td>Cada 10.000 km o 1 año</td>
            <td>Cada 10.000 km</td>
          </tr>
          <tr>
            <td>Vibración a determinada velocidad</td>
            <td>No es el síntoma</td>
            <td>Sí</td>
          </tr>
          <tr>
            <td>El auto se va para un lado</td>
            <td>Sí</td>
            <td>No es el síntoma</td>
          </tr>
        </tbody>
      </table>

      <h2>Por qué conviene hacerlos juntos al cambiar cubiertas</h2>
      <p>
        Cuando ponés neumáticos nuevos, el balanceo es obligatorio porque el conjunto cambió. Y la
        alineación, aunque técnicamente sea otra cosa, es el momento ideal: si el tren venía
        desalineado y no lo corregís, el juego nuevo empieza a desgastarse mal desde el primer
        kilómetro. Es la forma más rápida de arruinar una compra que acabás de hacer.
      </p>
      <p>
        Por eso lo tratamos como un combo en el taller. La alineación es{" "}
        <strong>computarizada 3D</strong>, que mide los tres ángulos en las cuatro ruedas contra la
        ficha del fabricante de tu modelo, y el balanceo es dinámico, que corrige el desbalance en
        los dos planos y no sólo en uno.{" "}
        <Link href="/servicios">Podés ver el detalle de los dos servicios acá</Link>. Los equipos que
        usamos son la alineadora 3D Hofmann Geoliner 630 y la balanceadora Hofmann Geodyna 7800P —{" "}
        <Link href="/blog/geoliner-630-geodyna-7800p-alineacion-balanceo">
          acá contamos qué diferencia hacen
        </Link>
        .
      </p>
      <p>
        Si comprás los neumáticos en el local, el arme, el desarme y el cambio de válvulas van sin
        cargo; alineación y balanceo se cobran aparte porque son trabajo de taller.{" "}
        <Link href="/neumaticos">Buscá tu medida</Link> y te pasamos el total con todo incluido
        antes de que vengas.
      </p>
      <EquipoHofmann />
      <AhorroLinks current={SLUG} />
    </ArticleLayout>
  );
}
