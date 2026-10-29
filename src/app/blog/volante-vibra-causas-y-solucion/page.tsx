import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { TallerLinks } from "@/components/blog/TallerLinks";
import { EquipoHofmann } from "@/components/blog/EquipoHofmann";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "volante-vibra-causas-y-solucion";
const TITLE = "El volante vibra: causas según cuándo aparece y cómo se soluciona";
const SUBTITLE =
  "Si vibra a ciertas velocidades casi seguro es balanceo; si vibra al frenar o a toda velocidad, es otra cosa. Cómo leer el síntoma antes de ir al taller.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Por qué vibra el volante: desbalanceo (90 a 120 km/h), vibración al frenar, neumático deforme, llanta golpeada o rulemán. Cómo distinguirlas según la velocidad y el momento.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Por qué vibra el volante a 100 km/h?",
    answer:
      "La causa más frecuente es el desbalanceo de una rueda delantera: a esa velocidad la rueda gira unas 800 veces por minuto y unos pocos gramos de diferencia sacuden toda la dirección. Se corrige balanceando las ruedas. Es típico que aparezca en un rango de velocidad y desaparezca por encima o por debajo.",
  },
  {
    question: "¿Vibra en el volante o en el asiento? ¿Cambia algo?",
    answer:
      "Sí. La vibración en el volante apunta a las ruedas delanteras. Si se siente en el asiento o el piso, suele ser una rueda trasera. Es un dato útil para el taller.",
  },
  {
    question: "¿El volante vibra al frenar? ¿También es balanceo?",
    answer:
      "No. Si el temblor aparece solo al frenar, lo más probable es que los discos de freno estén deformados o con espesor desparejo. Balancear no lo arregla.",
  },
  {
    question: "Balanceé las ruedas y sigue vibrando, ¿qué otra cosa puede ser?",
    answer:
      "Una llanta torcida por un golpe, un neumático con una burbuja o una deformación interna, una rueda mal asentada, tuercas flojas o un rulemán con juego. En el taller se revisa la llanta y el neumático girando para ver si no están fuera de redondez.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Servicios" date="2026-11-03" readingMinutes={5} faqs={FAQS}>
      <p>La vibración es un síntoma, no un diagnóstico. Lo que ayuda a identificar la causa es cuándo aparece: a qué velocidad, si cambia al frenar, si la sentís en el volante o en el asiento. Con esos tres datos se descartan casi todas las causas antes de abrir el capó.</p>

      <h2>Cuándo aparece y qué suele ser</h2>
      <table>
        <thead>
          <tr>
            <th>Cuándo vibra</th>
            <th>Causa más probable</th>
            <th>Qué hacer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>En un rango de velocidad, típicamente entre 90 y 120 km/h</td>
            <td>Rueda desbalanceada</td>
            <td><Link href="/servicios/balanceo">Balanceo</Link></td>
          </tr>
          <tr>
            <td>Solo al frenar</td>
            <td>Discos deformados o con espesor desparejo</td>
            <td>Revisión de frenos</td>
          </tr>
          <tr>
            <td>A cualquier velocidad, y empeora al acelerar</td>
            <td>Neumático deformado o con burbuja; llanta golpeada</td>
            <td>Revisar el neumático y la llanta</td>
          </tr>
          <tr>
            <td>A baja velocidad, con un golpeteo rítmico</td>
            <td>Neumático con separación interna o llanta torcida</td>
            <td>Revisión inmediata</td>
          </tr>
          <tr>
            <td>Con un zumbido que cambia en las curvas</td>
            <td>Rulemán de rueda gastado</td>
            <td>Revisión de la suspensión</td>
          </tr>
          <tr>
            <td>Después de cambiar una rueda</td>
            <td>Tuercas flojas o rueda mal asentada</td>
            <td>Reajustar con el par correcto</td>
          </tr>
        </tbody>
      </table>

      <h2>Volante o asiento: una pista del eje</h2>
      <ul>
        <li><strong>Vibra el volante:</strong> el problema está en las ruedas delanteras.</li>
        <li><strong>Vibra el asiento o el piso:</strong> suele ser una rueda trasera.</li>
        <li><strong>Vibra todo el auto:</strong> puede ser más de una rueda, o una causa más profunda como un neumático deformado.</li>
      </ul>

      <h2>El balanceo, que es la causa más común</h2>
      <p>Cada conjunto de llanta y neumático tiene zonas más pesadas que otras: la soldadura de la llanta, el empalme del neumático, la válvula. A baja velocidad no se nota, pero a 100 km/h la fuerza centrífuga de un desbalance de pocos gramos hace temblar la dirección. El balanceo mide el desbalance en una máquina que hace girar la rueda y lo compensa con un contrapeso en el punto exacto.</p>
      <p>Cuándo corresponde balancear, y por qué hay que hacerlo cada vez que se cambia un neumático, está en <Link href="/blog/alineacion-y-balanceo">alineado y balanceado: qué es cada cosa</Link>. Y si se cae una pesa, el síntoma vuelve: <Link href="/blog/pesas-de-balanceo-por-que-se-caen">por qué se caen las pesas de balanceo</Link>.</p>

      <h2>Qué NO conviene hacer</h2>
      <ul>
        <li><strong>Seguir manejando con un golpeteo a baja velocidad.</strong> Puede ser un neumático con la estructura rota.</li>
        <li><strong>Alinear para curar una vibración.</strong> La alineación corrige hacia dónde va el auto, no cómo gira la rueda. Si el auto además tira, son dos problemas: <Link href="/blog/auto-tira-para-un-lado-causas">el auto tira para un lado</Link>.</li>
        <li><strong>Esperar.</strong> Un neumático que vibra se desgasta de forma despareja y los componentes de la suspensión trabajan sacudidos.</li>
      </ul>
      <p>Si no estás seguro de si lo tuyo es alineado, balanceo o rotación, la nota <Link href="/blog/sintomas-alineacion-balanceo-o-rotacion">cómo distinguir los síntomas</Link> lo ordena en una tabla.</p>
      <EquipoHofmann />
      <TallerLinks current={SLUG} />
    </ArticleLayout>
  );
}
