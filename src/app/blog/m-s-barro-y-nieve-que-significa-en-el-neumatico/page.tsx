import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { FlancoFoto } from "@/components/blog/FlancoFoto";
import { FlancoLinks } from "@/components/blog/FlancoLinks";
import { FotoNeumaticoBloque } from "@/components/tools/FotoNeumaticoBloque";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "m-s-barro-y-nieve-que-significa-en-el-neumatico";
const TITLE = "M+S en el neumático: qué significa «barro y nieve»";
const SUBTITLE =
  "Las letras M+S en el flanco no garantizan tracción en la nieve. Qué indican, en qué neumáticos aparecen y en qué se diferencian del símbolo del copo de nieve.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Qué significa M+S en el flanco de un neumático: «Mud and Snow», barro y nieve. Qué garantiza, en qué se diferencia del símbolo 3PMSF del copo de nieve y para qué uso conviene.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  { question: "¿Qué significa M+S en un neumático?", answer: "Mud and Snow, es decir, barro y nieve: indica que el dibujo de la banda está diseñado para más tracción en esas condiciones que un neumático común." },
  { question: "¿M+S es lo mismo que neumático de invierno?", answer: "No. Un neumático de invierno certificado lleva el símbolo del copo de nieve con tres picos (3PMSF). M+S describe el dibujo y lo declara el fabricante." },
  { question: "¿Sirve para camino de tierra?", answer: "Sí, el dibujo más abierto ayuda a evacuar barro y tierra. Para uso off road exigente, mirá los neumáticos A/T." },
  { question: "¿Necesito M+S en Córdoba?", answer: "No es obligatorio para el uso diario. Es útil si salís seguido a caminos de tierra, a la sierra o viajás a zonas con nieve." },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={SLUG}
      title={TITLE}
      subtitle={SUBTITLE}
      category="Guías"
      date="2026-11-23"
      readingMinutes={4}
      faqs={FAQS}
      extras={
        <>
          <FotoNeumaticoBloque titulo="¿No sabés qué lleva tu neumático? Mandanos una foto" />
          <FlancoLinks current={SLUG} />
        </>
      }
    >
      <p>En el flanco del 195/65 R15 de la foto aparece, aparte de la medida, la marca <strong>M+S</strong> (número 8). Es la sigla de <em>Mud and Snow</em>: <strong>barro y nieve</strong>.</p>
      <FlancoFoto numero={8} caption="Número 8: M+S, barro y nieve." />

      <h2>Qué indica</h2>
      <p>M+S señala que el diseño de la banda de rodamiento está pensado para <strong>mayor tracción sobre barro y nieve</strong> que un neumático común: tacos más abiertos, ranuras más anchas, mayor evacuación. La pone el propio fabricante, y no depende de una prueba de nieve obligatoria y uniforme para todos.</p>

      <h2>No es lo mismo que el copo de nieve</h2>
      <ul>
        <li><strong>M+S:</strong> describe el dibujo de la banda y la declara el fabricante.</li>
        <li><strong>Copo con montaña de tres picos (3PMSF):</strong> indica que el neumático pasó una prueba de tracción sobre nieve. Es la certificación para uso invernal real.</li>
      </ul>
      <p>Un neumático puede tener M+S sin llevar el copo de nieve: no confundas una cosa con la otra.</p>

      <h2>En qué neumáticos se ve</h2>
      <p>Es habitual en los <Link href="/neumaticos/at">A/T (all terrain)</Link>, los <Link href="/neumaticos/ht">H/T</Link> y en muchos neumáticos «all season» de camionetas y SUV. También en autos, como el de la foto. En un neumático de uso urbano sin esa sigla, el dibujo está más orientado al asfalto.</p>

      <h2>Cuándo conviene</h2>
      <p>Sirve para <strong>caminos de tierra, ripio, barro y lluvia fuerte</strong>, muy comunes al salir de la ciudad. En Córdoba no hace falta un neumático de invierno para el uso diario, pero si viajás a zonas con nieve, la combinación recomendada es un neumático con el copo certificado o cadenas, según lo que exija cada ruta.</p>
      <p>M+S es solo un dato más del código. Para leer el resto: <Link href="/blog/como-leer-medida-neumatico">cómo leer la medida de un neumático</Link>.</p>
    </ArticleLayout>
  );
}
