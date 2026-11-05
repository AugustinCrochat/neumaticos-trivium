import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "alineado-y-balanceado-juntos-o-por-separado";
const TITLE = "Alineado y balanceado: ¿juntos o por separado? Cuándo conviene cada uno";
const SUBTITLE = "Son dos servicios distintos que casi siempre se hacen en la misma visita, pero también se pueden pedir sueltos. Cuándo hace falta cada uno.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description: resumen("El alineado y el balanceado resuelven problemas distintos. Cuándo hacer solo uno, cuándo conviene el combo de alineación más balanceo de las 4 ruedas y cuánto se ahorra con los precios publicados."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿El alineado y el balanceado son lo mismo?",
    answer: "No. El alineado corrige los ángulos de las ruedas respecto del auto; el balanceado compensa el peso de cada rueda para que no vibre.",
  },
  {
    question: "¿Puedo hacer solo el balanceado?",
    answer: "Sí. Si el síntoma es una vibración en el volante a cierta velocidad y el auto no tira hacia un costado, suele alcanzar con balancear. Se cobra por rueda.",
  },
  {
    question: "¿Puedo hacer solo el alineado?",
    answer: "Sí. Si el auto tira hacia un lado, el volante queda torcido o las cubiertas se gastan de un solo borde, el problema es el alineado.",
  },
  {
    question: "¿Conviene el combo?",
    answer: "Si cambiaste cubiertas, después de un golpe fuerte o si tenés ambos síntomas, sí: se hace en una visita y con los precios publicados sale menos que por separado.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Servicios" date="2026-11-08" readingMinutes={5} faqs={FAQS}>
      <p>
        En Córdoba se dice «alineado y balanceado» y en Buenos Aires «alineación y balanceo», pero la pregunta es la misma: ¿hace falta
        hacer las dos cosas? A veces sí, a veces alcanza con una.
      </p>

      <Callout title="Respuesta rápida" tone="info">
        <p>
          <strong>Vibra el volante:</strong> balanceado. <strong>El auto tira a un lado o el volante queda torcido:</strong> alineado.{" "}
          <strong>Cambiaste las cubiertas o tuviste un golpe fuerte:</strong> las dos, en el combo.
        </p>
      </Callout>

      <h2>Qué hace cada uno</h2>
      <ul>
        <li><strong>Alineado:</strong> ajusta convergencia, caída y avance para que las ruedas queden en el ángulo correcto. Lo medimos con alineadora computarizada 3D.</li>
        <li><strong>Balanceado:</strong> agrega contrapesos para que cada rueda gire sin saltos. Se hace por rueda.</li>
      </ul>
      <p>
        Los síntomas de cada caso están en <Link href="/blog/sintomas-alineacion-balanceo-o-rotacion">cómo saber si necesitás alineado, balanceado o rotación</Link>.
      </p>

      <h2>Cuándo hacer solo uno</h2>
      <ul>
        <li><strong>Solo balanceado:</strong> vibración en el volante entre 80 y 120 km/h sin otros síntomas, o después de reparar una pinchadura.</li>
        <li><strong>Solo alineado:</strong> tras cambiar piezas de suspensión o dirección, o si notás el auto desviarse sin vibración.</li>
      </ul>

      <h2>Cuándo conviene el combo</h2>
      <p>
        Al cambiar cubiertas, las ruedas se desmontan y vuelven a montar, así que es el momento natural para balancear las cuatro y
        verificar la alineación. El combo de <strong>alineación + balanceo de las 4 ruedas</strong> incluye además la rotación.
      </p>

      <h2>Cuánto se ahorra</h2>
      <p>
        Con los precios publicados al 5 de noviembre de 2026: en un auto, alinear ($30.000) y balancear cuatro ruedas ($10.000 cada una)
        suma $70.000 por separado, contra $60.000 el combo. En una camioneta, $40.000 más cuatro balanceos de $15.000 suman $100.000,
        contra $80.000 el combo. Los valores cambian: el vigente está en <Link href="/servicios">servicios</Link>.
      </p>

      <h2>Dónde hacerlo</h2>
      <p>
        Nuestro taller de Argüello, en Córdoba, atiende por orden de llegada y sin turno; el tiempo típico está en{" "}
        <Link href="/blog/cuanto-tarda-alineado-y-balanceado">cuánto tarda el alineado y balanceado</Link>. Más sobre cada servicio en{" "}
        <Link href="/blog/alineacion-y-balanceo">la guía de alineación y balanceo</Link> y en la <Link href="/sucursales">página de sucursales</Link>.
      </p>
    </ArticleLayout>
  );
}
