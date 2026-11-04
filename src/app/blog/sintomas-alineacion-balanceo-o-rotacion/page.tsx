import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { TallerLinks } from "@/components/blog/TallerLinks";
import { AhorroLinks } from "@/components/blog/AhorroLinks";
import { EquipoHofmann } from "@/components/blog/EquipoHofmann";
import { Callout } from "@/components/blog/Callout";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "sintomas-alineacion-balanceo-o-rotacion";
const TITLE = "Tu auto vibra o tira para un lado: ¿alineación, balanceo o rotación?";
const SUBTITLE =
  "Cada síntoma apunta a un servicio distinto. Una guía para reconocer qué le pasa a tu auto antes de ir al taller.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Síntomas de que el auto necesita alineación, balanceo o rotación de neumáticos: vibración en el volante o el asiento, tira para un lado, volante torcido y desgaste irregular."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Por qué vibra el volante a cierta velocidad?",
    answer:
      "Lo más habitual es una rueda delantera desbalanceada. La vibración suele aparecer en un rango de velocidad (por ejemplo entre 80 y 110 km/h) y puede desaparecer por encima o por debajo. Se corrige balanceando.",
  },
  {
    question: "¿Por qué el auto tira hacia un lado?",
    answer:
      "Suele indicar un problema de alineación. También puede deberse a presiones distintas entre las ruedas de un mismo eje o a un desgaste muy desparejo. Si al corregir la presión sigue tirando, hay que alinear.",
  },
  {
    question: "¿Qué pasa si el volante está torcido pero el auto va derecho?",
    answer:
      "Es un síntoma típico de alineación: la dirección está desfasada respecto de las ruedas. No es peligroso en lo inmediato, pero suele ir acompañado de desgaste irregular.",
  },
  {
    question: "¿Cada cuánto conviene hacer cada servicio?",
    answer:
      "La rotación se suele hacer cada 8.000 a 10.000 km. La alineación y el balanceo, ante un síntoma, después de un golpe fuerte o cuando se cambian los neumáticos. Más detalle en la guía de alineación y balanceo.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Servicios" date="2026-10-24" readingMinutes={4} faqs={FAQS}>
      <p>
        «El auto me vibra», «tira a la derecha», «el volante está de costado». Son frases que escuchamos
        todos los días en el taller, y cada una apunta a un servicio distinto. Acertar el diagnóstico te evita
        pagar por algo que no resuelve el problema.
      </p>

      <h2>Qué sentís y qué suele ser</h2>
      <table>
        <thead>
          <tr>
            <th>Síntoma</th>
            <th>Servicio probable</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>El volante vibra en un rango de velocidad</td>
            <td>Balanceo de las ruedas delanteras</td>
          </tr>
          <tr>
            <td>Vibra el asiento o el piso, no el volante</td>
            <td>Balanceo de las ruedas traseras</td>
          </tr>
          <tr>
            <td>El auto tira hacia un lado en una calle recta</td>
            <td>Alineación (y verificar presiones)</td>
          </tr>
          <tr>
            <td>El volante está torcido con el auto derecho</td>
            <td>Alineación</td>
          </tr>
          <tr>
            <td>Un neumático se gasta de un solo borde</td>
            <td>Alineación</td>
          </tr>
          <tr>
            <td>Desgaste parejo pero más rápido en un eje</td>
            <td>Rotación</td>
          </tr>
          <tr>
            <td>Ruido o zumbido creciente con la velocidad</td>
            <td>Revisión: puede ser desgaste del neumático o un rodamiento</td>
          </tr>
        </tbody>
      </table>

      <Callout title="Antes de ir al taller" tone="info">
        <p>
          Revisá la presión de las cuatro ruedas. Una presión desigual produce síntomas parecidos a una
          mala alineación y se corrige en un minuto.{" "}
          <Link href="/blog/presion-de-neumaticos">Cómo medirla bien</Link>.
        </p>
      </Callout>

      <h2>Alineación: hacia dónde apuntan las ruedas</h2>
      <p>
        Corrige los ángulos de las ruedas (convergencia, caída y avance) para que apunten hacia donde
        corresponde. Se nota cuando el auto tira, cuando el volante queda torcido o cuando el neumático se
        gasta de un solo lado. Se hace con equipo de medición: en el taller usamos una alineadora 3D.
      </p>

      <h2>Balanceo: cómo giran las ruedas</h2>
      <p>
        Compensa con pesas la diferencia de peso de cada conjunto llanta-neumático para que gire sin
        golpear. Se nota como vibración, y conviene hacerlo cada vez que se coloca un neumático nuevo.
      </p>

      <h2>Rotación: repartir el desgaste</h2>
      <p>
        Es cambiar la posición de las ruedas entre ejes para que se gasten parejas. No corrige ningún
        síntoma, pero evita que aparezcan. Leé <Link href="/blog/rotacion-de-neumaticos">cómo y cada cuánto</Link>.
      </p>

      <h2>Si el síntoma sigue</h2>
      <p>
        Si después de alinear y balancear el síntoma persiste, la causa puede estar en la suspensión o la
        dirección: amortiguadores, bujes, rótulas o rodamientos con juego. En ese caso hay que revisar esas
        piezas antes de seguir gastando en neumáticos. Para más detalle leé{" "}
        <Link href="/blog/alineacion-y-balanceo">alineación y balanceo: qué es cada cosa</Link> y{" "}
        <Link href="/blog/desgaste-irregular-de-neumaticos">qué te dice cada patrón de desgaste</Link>.
      </p>
      <p>
        Mirá los servicios que hacemos en el local en <Link href="/servicios">alineación, balanceo y más</Link>.
      </p>
      <EquipoHofmann />
      <TallerLinks current={SLUG} />
      <AhorroLinks current={SLUG} />
    </ArticleLayout>
  );
}
