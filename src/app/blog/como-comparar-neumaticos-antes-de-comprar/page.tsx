import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "como-comparar-neumaticos-antes-de-comprar";
const TITLE = "Cómo comparar neumáticos antes de comprar: 7 puntos para no equivocarte";
const SUBTITLE =
  "Medida e índices, etiqueta europea, fecha de fabricación, garantía y qué incluye el precio: una lista para comparar dos cubiertas con los mismos criterios.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Qué mirar al comparar neumáticos: medida, índices de carga y velocidad, etiqueta europea, fecha DOT, garantía, colocación y costo por kilómetro. Guía de nuestra gomería de Córdoba.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cómo sé si dos neumáticos son comparables?",
    answer:
      "Tienen que ser de la misma medida, con índice de carga y de velocidad iguales o superiores a los del auto, y de un uso parecido (auto, A/T, H/T o carga). Comparar un neumático de auto con uno A/T o comercial por precio no es una comparación válida.",
  },
  {
    question: "¿Cómo se lee la fecha de fabricación?",
    answer:
      "En el flanco, después de las letras DOT, hay cuatro dígitos: los dos primeros son la semana y los dos últimos el año. Por ejemplo, 2524 es la semana 25 de 2024. Preguntá siempre por la fecha antes de comprar.",
  },
  {
    question: "¿La etiqueta europea alcanza para elegir?",
    answer:
      "No. Compara eficiencia de combustible, frenado en mojado y ruido externo, pero no mide durabilidad ni agarre en seco. Sirve para comparar esos tres puntos entre modelos.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Opiniones y Comparativas" date="2026-10-24" readingMinutes={6} faqs={FAQS}>
      <p>
        Dos presupuestos de neumáticos pueden parecer iguales y no serlo. Para compararlos bien
        conviene fijar los mismos criterios en los dos. Esta es la lista que usamos en el taller.
      </p>

      <h2>1. Misma medida, mismos índices</h2>
      <p>
        La medida (por ejemplo 185/65 R15) tiene que ser la misma o una equivalente. Además, el
        índice de carga y el de velocidad no pueden ser menores a los que pide tu auto. Si dudás,
        usá la <Link href="/calculadora-equivalencia-neumaticos">calculadora de equivalencias</Link> y
        la <Link href="/herramientas/indice-carga-velocidad">tabla de índices</Link>.
      </p>

      <h2>2. Mismo tipo de neumático</h2>
      <p>
        Un neumático de auto, uno A/T y uno de carga (C) no se comparan por precio: están hechos
        para usos distintos. Compará siempre dentro del mismo tipo.
      </p>

      <h2>3. La etiqueta europea</h2>
      <p>
        Es la forma más objetiva de comparar eficiencia, frenado en mojado y ruido, porque cada dato
        está registrado en una base oficial. Para las medidas con varios modelos armamos{" "}
        <Link href="/opiniones-y-comparativas">comparativas lado a lado</Link>. Cómo se lee cada letra
        está en <Link href="/blog/etiqueta-europea-neumaticos">esta guía</Link>.
      </p>

      <h2>4. La fecha de fabricación</h2>
      <p>
        Mirá el código DOT del flanco: los últimos cuatro dígitos son semana y año. Un neumático
        guardado varios años no es lo mismo que uno reciente, y debería estar reflejado en el precio.
      </p>

      <h2>5. La garantía</h2>
      <p>
        Preguntá qué cubre, por cuánto tiempo y quién responde. Todos nuestros neumáticos tienen
        garantía de 1 año.
      </p>

      <h2>6. Qué incluye el precio</h2>
      <p>
        Colocación, válvulas nuevas, balanceo, descarte de las cubiertas viejas: no todos los
        presupuestos incluyen lo mismo. Mirá{" "}
        <Link href="/blog/que-incluye-el-presupuesto-de-neumaticos">qué debería incluir un presupuesto</Link>{" "}
        para comparar el total y no sólo el precio por unidad.
      </p>

      <h2>7. El costo por kilómetro</h2>
      <p>
        El más barato por unidad no siempre sale menos por kilómetro. Si hacés muchos kilómetros por
        año, hacé la cuenta con{" "}
        <Link href="/blog/precio-calidad-neumaticos-costo-por-km">el costo por kilómetro</Link>. Y si
        estás entre una marca conocida y una alternativa, mirá{" "}
        <Link href="/alternativas">las alternativas a las marcas premium</Link>.
      </p>
    </ArticleLayout>
  );
}
