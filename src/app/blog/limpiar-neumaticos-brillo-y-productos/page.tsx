import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { AhorroLinks } from "@/components/blog/AhorroLinks";
import { canonical } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "limpiar-neumaticos-brillo-y-productos";
const TITLE = "Limpiar los neumáticos: qué productos usar y si el brillo los daña";
const SUBTITLE =
  "Agua y jabón neutro alcanzan. Qué pasa con los brillos y siliconas, qué evitar y por qué nunca en la banda de rodamiento.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description:
    "Cómo limpiar los neumáticos: agua y jabón neutro, qué pasa con los brillos y siliconas, qué productos evitar (solventes, combustibles) y por qué no aplicar nada en la banda de rodamiento.",
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Con qué se limpian los neumáticos?",
    answer:
      "Con agua, jabón neutro y un cepillo de cerdas blandas. No hacen falta productos especiales.",
  },
  {
    question: "¿El brillo de neumáticos los daña?",
    answer:
      "Los de buena calidad no, pero algunos con solventes o derivados del petróleo resecan la goma y dejan manchas. Elegí los a base de agua y evitá los que prometen brillo extremo.",
  },
  {
    question: "¿Se puede aplicar brillo en la banda de rodamiento?",
    answer:
      "No. Dejaría el dibujo resbaloso. El producto va solo en el flanco y se retira el exceso.",
  },
  {
    question: "¿Sirven los productos que 'protegen' del sol?",
    answer:
      "Algunos aportan una capa protectora superficial, pero no reemplazan los antioxidantes que ya lleva la goma. Son cosméticos.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-10-28" readingMinutes={4} faqs={FAQS}>
      <p>Un neumático limpio se revisa mejor y, si lo cuidás, no necesita mucho más que agua y jabón. Con los brillos y productos que prometen proteger hay que tener criterio: algunos dañan la goma y otros dejan el dibujo resbaloso.</p>

      <h2>Lo básico: agua y jabón neutro</h2>
      <ol>
      <li>Mojá la rueda para sacar el polvo grueso.</li>
      <li>Pasá un cepillo de cerdas blandas con agua y jabón neutro.</li>
      <li>Enjuagá y dejá secar.</li>
      </ol>
      <p>Es también el momento de <Link href="/blog/revision-mensual-de-neumaticos-en-5-minutos">revisar cortes, grietas y burbujas</Link> que la mugre tapaba.</p>

      <h2>Brillos y siliconas</h2>
      <ul>
      <li><strong>Cosméticos:</strong> dan un aspecto de goma nueva. No mejoran el rendimiento.</li>
      <li><strong>Los de solventes:</strong> pueden resecar la goma a largo plazo.</li>
      <li><strong>Los a base de agua:</strong> son más suaves y duran menos.</li>
      <li><strong>Exceso de producto:</strong> salpica a la pintura y a los frenos.</li>
      </ul>

      <h2>Lo que nunca</h2>
      <ul>
      <li>Nunca aplicar brillo en la <strong>banda de rodamiento</strong>: pierde agarre. Más sobre el agua en <Link href="/blog/aquaplaning-que-es-y-como-evitarlo">aquaplaning</Link>.</li>
      <li>No usar nafta, gasoil, diluyentes ni productos de motor.</li>
      <li>No lavar con agua a presión muy cerca del flanco o de la válvula.</li>
      </ul>

      <h2>Más importante que el brillo</h2>
      <p>Lo que cuida de verdad la goma es la presión, el alineado y no exponerla a calor extremo: <Link href="/blog/presion-de-neumaticos">presión</Link>, <Link href="/blog/alineacion-y-balanceo">alineado y balanceado</Link>. Y si los guardás, <Link href="/blog/como-guardar-neumaticos">cómo guardarlos</Link>. Todo junto en la <Link href="/blog/como-ahorrar-en-neumaticos-guia-completa">guía completa para ahorrar</Link>.</p>
      <AhorroLinks current={SLUG} />
    </ArticleLayout>
  );
}
