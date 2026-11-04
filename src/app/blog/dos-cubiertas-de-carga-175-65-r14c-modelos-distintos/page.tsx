import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "dos-cubiertas-de-carga-175-65-r14c-modelos-distintos";
const TITLE = "Dos cubiertas de carga Grenlander 175/65 R14C: misma medida, modelos distintos";
const SUBTITLE =
  "Misma medida, mismo índice de carga y dos modelos con dibujos muy distintos. Qué cambia entre dos cubiertas C para utilitarios livianos y qué mirar para elegir.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    resumen("Dos cubiertas de carga Grenlander 175/65 R14C 90/88 de modelos distintos: qué tienen en común, qué cambia en el dibujo y el índice de velocidad, y cómo elegir para tu utilitario."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Qué significa 175/65 R14C 90/88?",
    answer:
      "175 es el ancho en milímetros, 65 la relación de altura sobre ancho y R14 el rodado de la llanta. La C indica que es una cubierta de carga (comercial). El 90/88 es el índice de carga: 90 para montaje simple (600 kg por cubierta) y 88 para montaje dual (560 kg por cubierta).",
  },
  {
    question: "¿Qué diferencia hay entre 90/88R y 90/88T?",
    answer:
      "La letra final es el índice de velocidad: R soporta hasta 170 km/h y T hasta 190 km/h. Con la misma carga, la T es de una categoría de velocidad más alta.",
  },
  {
    question: "¿Dos cubiertas de la misma medida rinden igual?",
    answer:
      "No necesariamente. La medida y el índice de carga pueden ser iguales, pero cada modelo tiene su propio dibujo, compuesto y construcción, y eso cambia el agarre, el ruido, el desgaste y el consumo.",
  },
  {
    question: "¿Puedo poner una de cada tipo en el mismo auto?",
    answer:
      "No conviene. Dos dibujos distintos en el mismo eje cambian el agarre y la respuesta del auto. Lo recomendable es el mismo modelo en las cuatro ruedas, o al menos en el mismo eje.",
  },
  {
    question: "¿Una cubierta C sirve para un auto de pasajeros?",
    answer:
      "Si la medida y el índice de carga coinciden con lo que pide el fabricante, sí. La cubierta C tiene la estructura reforzada, con más presión de trabajo, y se siente más firme que una de pasajeros.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-25" readingMinutes={5} faqs={FAQS}>
      <p>
        Cuando un cliente trae un utilitario liviano o un auto con llanta R14 y pide &quot;cubiertas C&quot;, la
        medida suele ser la misma: <strong>175/65 R14C 90/88</strong>. Lo que cambia, y mucho, es el dibujo. En la
        foto, dos Grenlander de esa medida, una al lado de la otra en nuestro taller de Argüello: se parecen en el
        número y no en la banda de rodamiento.
      </p>

      <h2>Qué tienen en común</h2>
      <ul>
        <li>
          <strong>Medida y estructura:</strong> 175/65 R14C, cubierta de carga con flancos reforzados.
        </li>
        <li>
          <strong>Índice de carga 90/88:</strong> 600 kg por cubierta en montaje simple y 560 kg en dual. Si
          querés repasar la tabla completa, está en la nota de{" "}
          <Link href="/blog/indice-de-carga-y-velocidad">índice de carga y velocidad</Link>.
        </li>
        <li>
          <strong>Etiqueta europea:</strong> las dos traen la etiqueta con eficiencia, agarre en mojado y ruido, que
          explicamos en <Link href="/blog/etiqueta-europea-neumaticos">etiqueta europea de neumáticos</Link>.
        </li>
      </ul>

      <h2>Qué cambia: el modelo, el dibujo y la letra del flanco</h2>
      <p>
        La de la izquierda es la <strong>L-MAX9</strong>, con un dibujo clásico de utilitario: grandes bloques en
        zigzag y canales anchos, pensado para andar cargado y resistir el desgaste. Termina en{" "}
        <strong>90/88R</strong>, es decir, índice de velocidad R (hasta 170 km/h).
      </p>
      <p>
        La de la derecha es la <strong>Greentour A/S</strong>, con un dibujo más cerrado y muchas laminillas finas.
        Termina en <strong>90/88T</strong>: índice de velocidad T, hasta 190 km/h. La sigla A/S es &quot;all season&quot;:
        está pensada para andar todo el año en uso mixto, y el dibujo de la L-MAX9 es el clásico de trabajo.
      </p>

      <h2>Cuál conviene</h2>
      <ul>
        <li>
          <strong>Reparto urbano y mucha carga:</strong> el dibujo clásico es el que más se usa por durabilidad y
          precio.
        </li>
        <li>
          <strong>Ruta y viajes más largos:</strong> el dibujo más cerrado y el índice T dan más margen en
          velocidad y un andar más silencioso.
        </li>
        <li>
          <strong>Auto de pasajeros con llanta 14:</strong> verificá que el índice de carga no sea menor al original
          y que la presión coincida con la etiqueta de la puerta (
          <Link href="/blog/etiqueta-de-presion-puerta-del-auto">cómo leerla</Link>).
        </li>
      </ul>
      <p>
        La regla que no cambia: el mismo modelo en las cuatro ruedas. Mezclar dos dibujos en un mismo eje cambia
        cómo responde el auto.
      </p>

      <h2>Cómo elegir bien</h2>
      <p>
        Si no estás seguro de qué índice de carga lleva tu utilitario, mirá las cubiertas que trae hoy y la
        etiqueta de la puerta. En el catálogo tenés las{" "}
        <Link href="/neumaticos/carga">cubiertas de carga</Link> disponibles con su stock, y para entender la
        diferencia entre montaje simple y dual, la nota de{" "}
        <Link href="/blog/carga-simple-y-dual-neumaticos-c">carga simple y dual</Link>. También podés escribirnos
        por WhatsApp con la medida y te decimos qué hay.
      </p>
    </ArticleLayout>
  );
}
