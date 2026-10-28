import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { AhorroLinks } from "@/components/blog/AhorroLinks";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumaticos-usados-conviene-comprarlos";
const TITLE = "Neumáticos usados: ¿conviene comprarlos o es ahorrar en lo que no se debe?";
const SUBTITLE =
  "La cuenta de cuánto se ahorra y cuánto se arriesga: edad, reparaciones ocultas, desgaste y por qué un par distinto afecta al auto entero.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Comprar neumáticos usados: riesgos (edad, daños internos, reparaciones ocultas, desgaste parejo), cuánto se ahorra de verdad y qué alternativas nuevas y económicas conviene mirar.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Es peligroso comprar neumáticos usados?",
    answer:
      "Puede serlo. No se sabe cómo fueron usados, si tuvieron golpes, pinchaduras mal reparadas o años de almacenamiento. Lo que no se ve por fuera puede ser lo que falla.",
  },
  {
    question: "¿Cómo sé qué edad tiene un neumático usado?",
    answer:
      "Con el código DOT del flanco, que marca semana y año de fabricación. Un neumático de más de 6 años merece revisión; más de 10 se recomienda no usarlo.",
  },
  {
    question: "¿Un usado me sirve para salir del apuro?",
    answer:
      "Como solución temporal puede servir, pero con riesgo. Hay neumáticos nuevos económicos que cuestan lo que un usado de marca y rinden muchos más kilómetros.",
  },
  {
    question: "¿Se pueden mezclar usados con nuevos?",
    answer:
      "No es recomendable: la diferencia de desgaste y diámetro afecta el comportamiento del auto, sobre todo en un mismo eje.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-28" readingMinutes={6} faqs={FAQS}>
      <p>La tentación es lógica: un juego usado cuesta menos que uno nuevo. Pero ahorrar en neumáticos es de las pocas cosas donde el precio de entrada puede salir muy caro. Esta es la cuenta completa.</p>

      <h2>Lo que no se ve</h2>
      <ul>
      <li><strong>Edad:</strong> la goma envejece aunque no se use. Se lee en el <Link href="/blog/antiguedad-del-neumatico-codigo-dot">código DOT</Link>.</li>
      <li><strong>Golpes:</strong> un impacto puede dejar daño interno que aparece como <Link href="/blog/burbuja-en-el-flanco-del-neumatico">burbuja</Link> semanas después.</li>
      <li><strong>Reparaciones:</strong> una pinchadura mal reparada no siempre se ve. Mirá <Link href="/blog/reparacion-de-pinchaduras-parche-mecha">cómo se repara bien</Link>.</li>
      <li><strong>Uso anterior:</strong> sobrecarga, presión baja crónica o desalineado dejan huellas que no están en la superficie.</li>
      </ul>

      <h2>La cuenta del ahorro</h2>
      <p>Un neumático usado ya gastó parte de su vida: si le quedan la mitad de los kilómetros, el costo por kilómetro puede no ser mejor que el de uno nuevo económico. Hay una forma de verlo en la <Link href="/herramientas/costo-por-kilometro">calculadora de costo por kilómetro</Link> y en <Link href="/blog/precio-calidad-neumaticos-costo-por-km">precio y calidad</Link>.</p>

      <table>
      <thead><tr><th></th><th>Usado</th><th>Nuevo económico</th></tr></thead>
      <tbody>
      <tr><td>Precio inicial</td><td>Más bajo</td><td>Algo más alto</td></tr>
      <tr><td>Vida útil restante</td><td>Incierta</td><td>Completa</td></tr>
      <tr><td>Garantía</td><td>Casi siempre ninguna</td><td>Según el vendedor</td></tr>
      <tr><td>Riesgo de daño oculto</td><td>Alto</td><td>Bajo</td></tr>
      </tbody>
      </table>

      <h2>El problema del par</h2>
      <p>Dos neumáticos usados de distinto desgaste en un mismo eje hacen que el auto tire y trabajen distinto el frenado y el diferencial. Por eso se cambia de a pares: <Link href="/blog/cambiar-un-solo-neumatico-o-de-a-pares">un solo neumático o de a pares</Link>.</p>

      <h2>Alternativas para gastar menos</h2>
      <ul>
      <li><strong>Neumáticos nuevos económicos:</strong> en uso urbano rinden bien, como vimos en <Link href="/blog/cuanto-duran-los-neumaticos-economicos">cuánto duran los económicos</Link>. Mirá los <Link href="/neumaticos-baratos">precios por rodado</Link>.</li>
      <li><strong>Cambiar de a dos:</strong> si el otro par está bien, los nuevos van atrás: <Link href="/blog/neumaticos-nuevos-adelante-o-atras">por qué</Link>.</li>
      <li><strong>Comparar presupuestos</strong> con los mismos ítems: <Link href="/blog/que-incluye-el-presupuesto-de-neumaticos">qué incluye</Link>.</li>
      </ul>

      <h2>Cuándo podría tener sentido</h2>
      <p>Solo en una situación puntual: sabés exactamente el origen, la edad es baja, la inspección es en persona y es un par igual. Aun así, no lo recomendamos como regla. Lo que más ahorra a largo plazo está en la <Link href="/blog/como-ahorrar-en-neumaticos-guia-completa">guía completa</Link>.</p>
      <AhorroLinks current={SLUG} />
    </ArticleLayout>
  );
}
