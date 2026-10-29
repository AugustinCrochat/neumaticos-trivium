import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { TallerLinks } from "@/components/blog/TallerLinks";
import { EquipoHofmann } from "@/components/blog/EquipoHofmann";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "alineacion-3d-vs-alineacion-tradicional";
const TITLE = "Alineación 3D vs. alineación tradicional: qué cambia y qué no";
const SUBTITLE =
  "Qué es una alineadora 3D, en qué se diferencia de los equipos de sensores y por qué ni el mejor equipo reemplaza a un técnico con criterio.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Alineación 3D vs. tradicional: cómo funciona una alineadora con targets y cámaras, qué ventajas tiene en rapidez y precisión, qué límites tiene y qué conviene preguntar antes de alinear.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué es la alineación 3D?",
    answer:
      "Es un sistema que mide los ángulos de las cuatro ruedas con cámaras que ven unos targets (placas con un dibujo de referencia) colocados en cada rueda. Un software calcula la posición en tres dimensiones y compara los valores con la ficha del fabricante.",
  },
  {
    question: "¿Es mejor la alineación 3D que la tradicional?",
    answer:
      "En general es más rápida y repetible, y compensa mejor la llanta ligeramente torcida. Pero el resultado depende también del técnico, del estado de la suspensión y de que se use la ficha correcta del modelo. Un equipo bueno en manos poco cuidadosas rinde menos que uno sencillo bien usado.",
  },
  {
    question: "¿Cómo era la alineación tradicional?",
    answer:
      "Con sensores o cabezales con cables, o con elementos ópticos de cada rueda que medían contra los de las otras. Hacía falta más preparación y a veces volver a medir, y los cabezales eran más delicados.",
  },
  {
    question: "¿Qué hay que pedir después de alinear?",
    answer:
      "El informe de antes y después, con los valores medidos de cada ángulo y las tolerancias. Es la manera de comprobar que lo que estaba fuera de parámetro quedó corregido.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Servicios" date="2026-11-24" readingMinutes={5} faqs={FAQS}>
      <p>&quot;Alineación 3D&quot; aparece en casi todos los carteles de gomería, pero poca gente sabe qué significa en concreto. La diferencia con los equipos anteriores es real, aunque no tan mágica como suena. Esta nota explica qué cambia y qué sigue dependiendo del oficio.</p>

      <h2>Cómo funciona una alineadora 3D</h2>
      <p>En cada rueda se engancha un <strong>target</strong>: una placa con un patrón de referencia. Frente al auto, unas cámaras ven los cuatro targets a la vez y un software calcula su posición en tres dimensiones. De ahí salen los ángulos de cada rueda: <Link href="/blog/que-mide-una-alineadora-convergencia-caida-avance">convergencia, caída y avance</Link>, comparados con la ficha del fabricante de tu modelo.</p>
      <p>Mientras el técnico ajusta, la pantalla muestra en vivo cómo cambia cada valor. No hace falta &quot;mover y volver a medir&quot;.</p>

      <h2>Diferencias con la alineación tradicional</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Tradicional (sensores o cabezales)</th>
            <th>3D (targets y cámaras)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Dispositivos en la rueda</strong></td>
            <td>Cabezales electrónicos, algunos con cables</td>
            <td>Targets pasivos, sin electrónica</td>
          </tr>
          <tr>
            <td><strong>Medición</strong></td>
            <td>Por pares de ruedas o con referencias entre cabezales</td>
            <td>Las cuatro ruedas a la vez, en 3D</td>
          </tr>
          <tr>
            <td><strong>Llanta ligeramente torcida</strong></td>
            <td>Requiere un paso de compensación</td>
            <td>Se compensa moviendo el auto un poco</td>
          </tr>
          <tr>
            <td><strong>Ajuste</strong></td>
            <td>Medir, ajustar, volver a medir</td>
            <td>Valores en vivo mientras se ajusta</td>
          </tr>
          <tr>
            <td><strong>Informe</strong></td>
            <td>Depende del equipo</td>
            <td>Antes y después, con valores y tolerancias</td>
          </tr>
        </tbody>
      </table>

      <h2>Lo que el equipo NO cambia</h2>
      <ul>
        <li><strong>El estado de la suspensión.</strong> Si hay rótulas, bujes o terminales con juego, la alineación no se sostiene. Una buena alineadora lo muestra, pero hay que reparar la pieza.</li>
        <li><strong>La ficha correcta.</strong> Alinear contra valores de otro modelo da un resultado que parece bueno y no lo es.</li>
        <li><strong>El criterio del técnico.</strong> Decidir qué conviene ajustar, avisar de una pieza gastada y no forzar un valor que el diseño no permite.</li>
      </ul>

      <h2>Qué preguntar antes de alinear</h2>
      <ol>
        <li>¿Van a entregar el informe de antes y después?</li>
        <li>¿Revisan la suspensión y la dirección antes de medir?</li>
        <li>¿Alinean las cuatro ruedas o solo el eje delantero?</li>
      </ol>
      <p>Sobre los síntomas que indican que hace falta, mirá <Link href="/blog/auto-tira-para-un-lado-causas">el auto tira para un lado</Link>; sobre cada cuánto, <Link href="/blog/cada-cuantos-km-alinear-y-balancear">cada cuántos kilómetros</Link>. Y sobre el equipo que usamos en el taller, <Link href="/blog/geoliner-630-geodyna-7800p-alineacion-balanceo">la alineadora Hofmann Geoliner 630 y la balanceadora Geodyna</Link>.</p>
      <EquipoHofmann />
      <TallerLinks current={SLUG} />
    </ArticleLayout>
  );
}
