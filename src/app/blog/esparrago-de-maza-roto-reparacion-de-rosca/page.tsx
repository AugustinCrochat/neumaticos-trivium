import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "esparrago-de-maza-roto-reparacion-de-rosca";
const TITLE = "Espárrago de maza roto o rosca dañada: cómo se repara";
const SUBTITLE =
  "Qué es el espárrago o bulón de maza, por qué se rompe o se pasa la rosca, cómo se reemplaza y por qué no conviene andar con una rueda con menos tuercas.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Espárrago o bulón de maza roto, rosca pasada o dañada: causas, cómo se repara (cambio de espárrago, repaso de rosca) y qué cuidar para que no vuelva a pasar. Gomería en Córdoba."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué es el espárrago o bulón de maza?",
    answer:
      "Es el perno roscado fijado a la maza (el buje de la rueda) sobre el que se apoya la llanta y se enroscan las tuercas. En algunos autos no hay espárragos y la rueda se fija con bulones que se enroscan directo en la maza.",
  },
  {
    question: "¿Por qué se rompe un espárrago?",
    answer:
      "Lo más común es apretar de más con pistola de impacto, usar tuercas de asiento equivocado, roscas sucias u oxidadas, o haber rodado con una tuerca floja. El esfuerzo repetido hace que el perno se fatigue y se corte.",
  },
  {
    question: "¿Se puede andar con un espárrago menos?",
    answer:
      "No conviene. Los demás espárragos y la maza quedan sobrecargados, y el riesgo de que se rompan otros o de que la rueda se afloje aumenta. Se cambia lo antes posible.",
  },
  {
    question: "¿Qué es repasar la rosca?",
    answer:
      "Es recorrer la rosca dañada con una terraja o un peine de roscas de la medida correcta para limpiar y corregir los filetes. Sirve cuando la rosca está sucia o levemente deformada; si está pasada, se cambia el espárrago.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-23" readingMinutes={5} faqs={FAQS}>
      <p>
        Sacar una rueda y descubrir que un espárrago está cortado, o que una tuerca gira en falso
        porque la rosca se pasó, es una de las sorpresas más molestas de una gomería. No es un
        trabajo para el cual haya que cambiar toda la maza: se reemplaza el espárrago y se repara la
        rosca. Pero conviene hacerlo bien.
      </p>

      <h2>Por qué se rompe o se pasa la rosca</h2>
      <ul>
        <li><strong>Apriete excesivo</strong> con pistola de impacto, sin llave dinamométrica.</li>
        <li><strong>Tuercas de asiento equivocado</strong> (cónico, esférico, plano) que no apoyan bien.</li>
        <li><strong>Roscas sucias, oxidadas o con restos de pintura</strong> que hacen forzar.</li>
        <li><strong>Rodar con una tuerca floja:</strong> la rueda se mueve y los demás espárragos trabajan de más.</li>
        <li><strong>Tuercas antirrobo forzadas</strong> o mal colocadas que dañan el perno.</li>
      </ul>

      <h2>Cómo se repara</h2>
      <h3>Repaso de rosca</h3>
      <p>
        Si la rosca solo está sucia o apenas deformada, se pasa un peine de roscas (o terraja) de la
        medida exacta del espárrago para recuperar los filetes. Hay que conocer el paso y el diámetro:
        medidas comunes son M12×1,5, M12×1,25 y M14×1,5, pero varía según el auto.
      </p>

      <h3>Cambio de espárrago</h3>
      <p>
        Si el espárrago está roto o la rosca perdida, se cambia. Según el vehículo, se desmonta el
        disco o el tambor para acceder a la parte de atrás de la maza, se saca el espárrago viejo con
        una prensa o con herramienta de extracción, y se coloca uno nuevo de la misma medida y largo,
        asentándolo a fondo. Después se revisan los demás, porque los vecinos del roto suelen estar
        fatigados.
      </p>

      <h3>Cuándo hay que ver al mecánico</h3>
      <p>
        Si la maza o el cubo están dañados, si faltan varios espárragos o si el auto tiene bulones
        directos a la maza en lugar de espárragos, la reparación puede requerir desarmar más piezas.
        En esos casos conviene un taller mecánico completo.
      </p>

      <h2>Cómo evitar que se repita</h2>
      <ul>
        <li>Apretá a mano en cruz y terminá con llave dinamométrica al torque del manual.</li>
        <li>No lubriques las tuercas con aceite si el fabricante indica roscas secas.</li>
        <li>Limpiá la rosca antes de colocar la rueda.</li>
        <li>Usá tuercas del mismo asiento que la llanta. Si usás tuercas de seguridad, mirá <Link href="/blog/tuercas-y-bulones-de-seguridad">cómo colocarlas bien</Link>.</li>
      </ul>
      <p>
        En nuestra gomería de Argüello revisamos las roscas al desmontar y te avisamos si algo está
        dañado antes de armar. Si necesitás otra solución con la llave, mirá{" "}
        <Link href="/blog/extraccion-de-tuercas-de-seguridad">extracción de tuercas de seguridad</Link>.
      </p>
    </ArticleLayout>
  );
}
