import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "neumatico-c-o-de-auto-utilitario";
const TITLE = "¿Neumático C o de auto en un utilitario? Las diferencias y cuándo no se puede cambiar";
const SUBTITLE =
  "Mismo ancho, mismo perfil, mismo rodado: ¿da igual poner un neumático de auto en un utilitario? No. Qué cambia en la construcción, cuánto pesa en la seguridad y en qué casos hay margen.";

export const metadata: Metadata = {
  ...blogShare("neumatico-c-o-de-auto-utilitario"),
  title: TITLE,
  description:
    resumen("Diferencias entre un neumático C (de carga) y uno de auto en la misma medida: carcasa, índice de carga, presión y riesgos de reemplazar uno por otro en un utilitario o furgón."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Puedo poner neumáticos de auto en un utilitario con medida C?",
    answer:
      "No es recomendable y, si el vehículo trae neumáticos C de fábrica, no corresponde. El neumático de auto en la misma medida tiene menor índice de carga y menor presión máxima: con el vehículo cargado puede sobrecalentarse, deformarse o romperse. Además puede dejar el vehículo fuera de la homologación original.",
  },
  {
    question: "¿Y poner un neumático C en un auto?",
    answer:
      "No suele hacer falta y empeora el confort: la carcasa reforzada es más rígida, rueda más duro y puede hacer más ruido. Solo tiene sentido si el vehículo lo especifica de fábrica.",
  },
  {
    question: "¿Cómo sé si mi vehículo lleva neumáticos C?",
    answer:
      "Mirá la calcomanía de la puerta del conductor o el flanco del neumático actual: si la medida termina en C (por ejemplo 195/70 R15C) y el índice de carga tiene dos números separados por una barra (104/102), es un neumático comercial.",
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={SLUG}
      title={TITLE}
      subtitle={SUBTITLE}
      category="Guías"
      date="2026-10-10"
      readingMinutes={5}
      faqs={FAQS}
    >
      <p>
        Es una consulta común en una gomería: el cliente tiene un utilitario con cubiertas 195/70 R15C,
        encuentra en la góndola un 195/70 R15 más barato y pregunta si da lo mismo. La respuesta corta es
        que <strong>no</strong>: la medida nominal coincide, pero el neumático es otro.
      </p>

      <h2>Qué cambia entre un C y uno de auto</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Neumático C</th>
            <th>Neumático de auto</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Carcasa</td>
            <td>Reforzada, con más capas</td>
            <td>Estándar</td>
          </tr>
          <tr>
            <td>Índice de carga</td>
            <td>Alto; dos números (simple/dual)</td>
            <td>Un solo número</td>
          </tr>
          <tr>
            <td>Presión máxima</td>
            <td>Más alta</td>
            <td>Más baja</td>
          </tr>
          <tr>
            <td>Confort</td>
            <td>Más firme</td>
            <td>Más cómodo</td>
          </tr>
          <tr>
            <td>Pensado para</td>
            <td>Furgones y utilitarios con carga</td>
            <td>Autos de pasajeros</td>
          </tr>
        </tbody>
      </table>

      <h2>Por qué importa en un utilitario</h2>
      <p>
        Un utilitario cargado lleva sobre cada rueda mucho más peso que un auto de pasajeros. Un neumático
        de auto no está calculado para ese esfuerzo sostenido: se flexiona de más, se calienta y, en el peor
        caso, falla en ruta. Este es un ahorro que se paga en seguridad.
      </p>

      <h2>El caso inverso: C en un auto</h2>
      <p>
        Un neumático C en un auto de pasajeros no es peligroso, pero tampoco aporta: rueda más duro, hace más
        ruido y no suma capacidad que el auto necesite. Salvo que el fabricante lo indique, no conviene.
      </p>

      <h2>Cómo saber qué te corresponde</h2>
      <ol>
        <li>Buscá la calcomanía en el marco de la puerta del conductor.</li>
        <li>Fijate si la medida termina en C y qué índice de carga tiene.</li>
        <li>Pedí el mismo tipo y un índice igual o mayor.</li>
      </ol>
      <p>
        Si tenés dudas, escribinos con marca, modelo y año. Mirá las medidas que tenemos en{" "}
        <Link href="/neumaticos/carga">neumáticos de carga</Link> y la nota sobre{" "}
        <Link href="/blog/indice-de-carga-y-velocidad">índice de carga y velocidad</Link>.
      </p>
    </ArticleLayout>
  );
}
