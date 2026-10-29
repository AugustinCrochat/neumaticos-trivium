import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { FlancoFoto } from "@/components/blog/FlancoFoto";
import { FlancoLinks } from "@/components/blog/FlancoLinks";
import { FotoNeumaticoBloque } from "@/components/tools/FotoNeumaticoBloque";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "perfil-del-neumatico-que-significa";
const TITLE = "Perfil del neumático: qué significa el 65 en 195/65 R15";
const SUBTITLE =
  "El segundo número no es una altura en milímetros: es un porcentaje del ancho. Cómo calcularlo y qué cambia entre perfil alto y bajo.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Qué significa el 65 en 195/65 R15: el perfil del neumático, como porcentaje del ancho. Cómo calcular la altura del flanco y qué cambia entre un perfil alto y uno bajo.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  { question: "¿Qué significa el 65 en 195/65 R15?", answer: "Es el perfil: la altura del flanco expresada como porcentaje del ancho. Acá, 65 % de 195 mm da 126,75 mm." },
  { question: "¿Perfil alto o perfil bajo?", answer: "El alto es más cómodo y cuida la llanta en calles con pozos. El bajo responde más directo en curva pero es más duro. Lo recomendable es respetar el perfil original del auto." },
  { question: "¿Puedo cambiar el perfil?", answer: "Solo si el diámetro total queda dentro de ±3 % del original y se respeta carga y velocidad. Usá la calculadora de equivalencias o consultanos." },
  { question: "¿Cómo calculo la altura del flanco?", answer: "Multiplicá el ancho por el perfil y dividí por 100. Para 195/65: 195 × 65 ÷ 100 = 126,75 mm." },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={SLUG}
      title={TITLE}
      subtitle={SUBTITLE}
      category="Guías"
      date="2026-11-11"
      readingMinutes={4}
      faqs={FAQS}
      extras={
        <>
          <FotoNeumaticoBloque titulo="¿No sabés qué lleva tu neumático? Mandanos una foto" />
          <FlancoLinks current={SLUG} />
        </>
      }
    >
      <p>En <strong>195/65 R15</strong>, el número que va después de la barra es el <strong>perfil</strong> (también llamado serie): 65. Está marcado como número 2 en la foto del flanco.</p>
      <FlancoFoto numero={2} caption="Número 2: el perfil, 65 % del ancho." />

      <h2>Un porcentaje, no milímetros</h2>
      <p>El perfil indica la altura del flanco como <strong>porcentaje del ancho</strong>. En este caso: 195 mm × 0,65 = <strong>126,75 mm</strong> de altura. Por eso, al cambiar de ancho, la altura real cambia aunque el perfil sea el mismo.</p>

      <h2>Cómo cambia el diámetro con el perfil</h2>
      <p>Con el mismo ancho (195) y rodado (15), el diámetro total depende del perfil:</p>
      <table>
        <thead><tr><th>Medida</th><th>Altura del flanco</th><th>Diámetro total</th></tr></thead>
        <tbody>
          <tr><td>195/60 R15</td><td>117 mm</td><td>615 mm</td></tr>
          <tr><td><strong>195/65 R15</strong></td><td>126,75 mm</td><td>634,5 mm</td></tr>
          <tr><td>195/70 R15</td><td>136,5 mm</td><td>654 mm</td></tr>
        </tbody>
      </table>
      <p>Esos 20 mm de diferencia entre filas bastan para que el velocímetro marque distinto y para que la rueda no entre igual en el paso de rueda. Por eso no conviene cambiar el perfil por cuenta propia.</p>

      <h2>Perfil alto y perfil bajo</h2>
      <ul>
        <li><strong>Perfil alto (65, 70 o más):</strong> flanco más alto, que absorbe mejor pozos y calles rotas. Es más cómodo y cuida la llanta.</li>
        <li><strong>Perfil bajo (50 o menos):</strong> flanco más corto, con respuesta más directa en curva, pero más duro y con más riesgo de dañar la llanta si pegás un pozo.</li>
      </ul>
      <p>Medidas con stock según el perfil: <Link href="/neumaticos/perfil-55">55</Link>, <Link href="/neumaticos/perfil-60">60</Link>, <Link href="/neumaticos/perfil-65">65</Link> o <Link href="/neumaticos/perfil-70">70</Link> por ciento.</p>
      <p>Si estás pensando en cambiar, mirá <Link href="/blog/perfil-bajo-o-perfil-alto">perfil bajo o perfil alto</Link>. Y para entender cómo se lee la medida completa: <Link href="/blog/como-leer-medida-neumatico">cómo leer la medida de un neumático</Link>.</p>
    </ArticleLayout>
  );
}
