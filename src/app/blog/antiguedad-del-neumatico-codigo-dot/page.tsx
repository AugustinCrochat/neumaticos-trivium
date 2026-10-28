import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { AhorroLinks } from "@/components/blog/AhorroLinks";
import { Callout } from "@/components/blog/Callout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "antiguedad-del-neumatico-codigo-dot";
const TITLE = "Cuántos años tiene tu neumático: cómo leer el código DOT";
const SUBTITLE =
  "Un neumático envejece aunque no se use. Cómo saber la semana y el año de fabricación en el flanco, y desde cuándo conviene revisarlo o reemplazarlo.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Cómo leer el código DOT de un neumático para saber su fecha de fabricación (semana y año), por qué el caucho envejece aunque haya dibujo y cuándo conviene cambiarlo.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Dónde está la fecha de fabricación del neumático?",
    answer:
      "En el flanco, dentro de un código que empieza con las letras DOT. Los últimos cuatro dígitos son la fecha: los dos primeros indican la semana y los dos últimos el año. Por ejemplo, 2523 significa semana 25 del año 2023. A veces el código completo está solo en uno de los dos flancos.",
  },
  {
    question: "¿Un neumático nuevo puede tener varios meses de fabricado?",
    answer:
      "Sí, es normal. Entre la fabricación, el transporte y el stock suelen pasar algunos meses. Lo importante es que no sea una cubierta de varios años guardada. Pedí que te muestren el código antes de comprar.",
  },
  {
    question: "¿Tiene fecha de vencimiento?",
    answer:
      "No hay una fecha única válida para todos los casos. Los fabricantes coinciden en que el caucho envejece con el calor, el sol y el tiempo, y en que conviene hacerlo revisar a partir de los cinco o seis años. A los diez años se reemplaza aunque tenga dibujo.",
  },
  {
    question: "¿Se puede usar un neumático guardado sin usar?",
    answer:
      "Depende de cuánto tiempo y cómo se guardó. Si lleva varios años, aunque esté nuevo, el caucho pudo endurecerse. Antes de montarlo conviene revisarlo y mirar la fecha del código DOT.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Mantenimiento" date="2026-10-24" readingMinutes={4} faqs={FAQS}>
      <p>
        Mucha gente cambia los neumáticos cuando se acaba el dibujo, y está bien. Pero hay un segundo reloj
        que corre en paralelo: la edad. El caucho se endurece y se agrieta con los años aunque el auto casi
        no ande, y un neumático viejo con buen dibujo agarra peor y puede fallar antes.
      </p>

      <h2>Cómo leer el código DOT</h2>
      <p>
        En el flanco del neumático vas a encontrar una serie de letras y números que empieza con{" "}
        <strong>DOT</strong>. Lo que importa son los <strong>últimos cuatro dígitos</strong>:
      </p>
      <ul>
        <li>
          Los <strong>dos primeros</strong> son la <strong>semana</strong> de fabricación (01 a 52).
        </li>
        <li>
          Los <strong>dos últimos</strong> son el <strong>año</strong>.
        </li>
      </ul>
      <p>
        Ejemplo: <strong>DOT … 2523</strong> quiere decir fabricado en la semana 25 de 2023, es decir, a
        mediados de junio de ese año. Si ves solo tres dígitos, es un neumático anterior al año 2000.
      </p>
      <p>
        Si el código que ves en un flanco termina antes (sin la fecha), mirá el otro lado de la cubierta:
        a veces la fecha solo está estampada en uno.
      </p>
      <p>
        Para practicar, la herramienta <Link href="/herramientas/codigo-dot">Código DOT</Link> lo calcula por
        vos.
      </p>

      <h2>Cuánta vida tiene</h2>
      <table>
        <thead>
          <tr>
            <th>Antigüedad</th>
            <th>Qué conviene hacer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Hasta 5 años</td>
            <td>Uso normal, con revisión periódica de presión y estado</td>
          </tr>
          <tr>
            <td>De 5 a 6 años</td>
            <td>Hacerlo revisar en el taller aunque tenga dibujo</td>
          </tr>
          <tr>
            <td>Más de 10 años</td>
            <td>Reemplazarlo, sin importar cómo se vea</td>
          </tr>
        </tbody>
      </table>

      <Callout title="Qué mirar además de la fecha" tone="warn">
        <p>
          Grietas finas en el flanco o entre los tacos, deformaciones o abultamientos son motivo de
          reemplazo inmediato, sin importar la edad. El sol, el calor y los años sin uso aceleran el
          deterioro.
        </p>
      </Callout>

      <h2>Cómo cuidar la edad al comprar</h2>
      <ol>
        <li>
          <strong>Pedí ver el código DOT</strong> del neumático antes de pagar. Es un derecho tuyo y lo
          mostramos sin problema.
        </li>
        <li>
          <strong>Que los cuatro tengan fechas cercanas.</strong> Un juego con diferencias de años entre
          neumáticos se desgasta distinto.
        </li>
        <li>
          <strong>Revisá también el auxilio</strong>, que suele ser el más viejo del auto:{" "}
          <Link href="/blog/rueda-de-auxilio-como-revisarla">cómo hacerlo</Link>.
        </li>
      </ol>
      <p>
        Si querés saber cuánto durarán tus neumáticos por uso, leé{" "}
        <Link href="/blog/cada-cuantos-km-cambiar-neumaticos">cada cuántos kilómetros cambiarlos</Link>. Y si
        vas a comparar neumáticos antes de comprar, esta guía de{" "}
        <Link href="/blog/como-comparar-neumaticos-antes-de-comprar">7 puntos</Link> te ordena la
        revisión.
      </p>
      <AhorroLinks current={SLUG} />
    </ArticleLayout>
  );
}
