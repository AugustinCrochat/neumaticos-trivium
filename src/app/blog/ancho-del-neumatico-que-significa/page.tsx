import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { FlancoFoto } from "@/components/blog/FlancoFoto";
import { FlancoLinks } from "@/components/blog/FlancoLinks";
import { FotoNeumaticoBloque } from "@/components/tools/FotoNeumaticoBloque";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "ancho-del-neumatico-que-significa";
const TITLE = "Ancho del neumático: qué significa el 195 en 195/65 R15";
const SUBTITLE =
  "El primer número de la medida es el ancho en milímetros. Qué cambia si es más ancho o más angosto y cuándo se puede usar otro.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Qué significa el 195 en 195/65 R15: el ancho del neumático en milímetros. Qué pasa con un neumático más ancho o más angosto, cómo afecta al diámetro y qué ancho admite tu llanta.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  { question: "¿Qué significa el primer número de la medida de un neumático?", answer: "Es el ancho del neumático en milímetros. En 195/65 R15, el neumático mide 195 mm de flanco a flanco." },
  { question: "¿Puedo poner un neumático más ancho que el original?", answer: "A veces sí, si ajustás el perfil para mantener el diámetro total, la llanta admite ese ancho y no roza. Consultanos antes: depende del auto y de la llanta." },
  { question: "¿Un neumático más ancho frena mejor?", answer: "En seco suele agarrar más; en mojado no siempre, porque un neumático muy ancho flota más fácil sobre el agua. Lo importante es el estado y la calidad de la cubierta." },
  { question: "¿Dónde veo el ancho de mi neumático?", answer: "En el flanco, es el primer número de la medida. También figura en la etiqueta de la puerta del conductor o en el manual." },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={SLUG}
      title={TITLE}
      subtitle={SUBTITLE}
      category="Guías"
      date="2026-11-09"
      readingMinutes={4}
      faqs={FAQS}
      extras={
        <>
          <FotoNeumaticoBloque titulo="¿No sabés qué lleva tu neumático? Mandanos una foto" />
          <FlancoLinks current={SLUG} />
        </>
      }
    >
      <p>En la medida <strong>195/65 R15</strong>, el primer número es el <strong>ancho del neumático en milímetros</strong>: 195 mm. Es el dato que aparece marcado con el número 1 en la foto del flanco.</p>
      <FlancoFoto numero={1} caption="Número 1: el ancho, 195 milímetros." />

      <h2>Qué se mide exactamente</h2>
      <p>Es la distancia de un flanco al otro, de punta a punta de la cubierta, con el neumático montado en su llanta de medición y sin carga. Por eso dos neumáticos de la misma medida pueden diferir un poco de ancho real según la llanta o el modelo.</p>

      <h2>Más ancho o más angosto: qué cambia</h2>
      <ul>
        <li><strong>Más ancho:</strong> más superficie apoyada, más agarre en seco y más estabilidad al encarar una curva. A cambio, suele sumar algo de consumo, ruido y roce con agua (aquaplaning) en piso mojado.</li>
        <li><strong>Más angosto:</strong> menos resistencia al avance y menos consumo, con menos apoyo en curva. En lluvia fuerte, un ancho moderado suele cortar mejor el agua.</li>
      </ul>

      <h2>El ancho no se cambia solo</h2>
      <p>Si cambiás el ancho, el perfil tiene que acompañarlo para que la rueda mantenga su diámetro total. Por ejemplo, un <strong>195/65 R15</strong> mide 634,5 mm de diámetro total; un <strong>205/60 R15</strong> mide 627 mm: es un 1,2 % menor, dentro del margen habitual del ±3 %. Con la <Link href="/calculadora-equivalencia-neumaticos">calculadora de equivalencias</Link> lo verificás en un paso.</p>

      <h2>Qué ancho admite tu llanta</h2>
      <p>Cada ancho de llanta acepta un rango de anchos de neumático. Salirse de ese rango deja el neumático estirado o abombado, y además hay que revisar que no roce en el paso de rueda ni en la suspensión. Ante la duda, lo más seguro es respetar la medida original y consultarnos si querés cambiarla.</p>
      <p>Para leer el resto del código, mirá <Link href="/blog/como-leer-medida-neumatico">cómo leer la medida completa</Link>; lo que sigue al ancho es el <Link href="/blog/perfil-del-neumatico-que-significa">perfil</Link>.</p>
    </ArticleLayout>
  );
}
