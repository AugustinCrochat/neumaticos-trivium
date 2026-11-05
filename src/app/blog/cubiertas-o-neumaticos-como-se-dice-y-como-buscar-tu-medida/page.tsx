import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "cubiertas-o-neumaticos-como-se-dice-y-como-buscar-tu-medida";
const TITLE = "Cubiertas o neumáticos: son lo mismo, y así encontrás la medida de tu auto";
const SUBTITLE = "En Argentina se dice cubierta, neumático o goma. La llanta es otra cosa: es el rin. Cómo leer la medida y buscarla sin errores.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description: resumen("Cubierta y neumático son lo mismo; la llanta es el rin. Cómo leer la medida (por ejemplo 175/65 R14), cómo buscar cubiertas por rodado y qué mirar antes de comprar."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    question: "¿Cubierta y neumático son lo mismo?",
    answer: "Sí. En Argentina se usan como sinónimos, y también «goma» en el habla cotidiana. Es la pieza de caucho que va montada sobre el rin.",
  },
  {
    question: "¿Y la llanta?",
    answer: "La llanta es el rin: la pieza metálica, de aleación o de chapa, donde se monta la cubierta. Por eso se dice «llantas de aleación», no «llantas de goma».",
  },
  {
    question: "¿Dónde veo la medida de mis cubiertas?",
    answer: "Está en el costado de la cubierta, con un formato como 175/65 R14 82T. También figura en la etiqueta de la puerta del conductor o en el manual del auto.",
  },
  {
    question: "¿Qué es el rodado?",
    answer: "Es el diámetro del rin en pulgadas, el número después de la R. Un auto rodado 14 usa cubiertas R14.",
  },
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Guías" date="2026-11-07" readingMinutes={4} faqs={FAQS}>
      <p>
        Si buscás «cubiertas 175 65 r14» o «neumáticos 175 65 r14», encontrás lo mismo. Son dos formas de nombrar la misma pieza, y la
        diferencia es de costumbre, no de producto.
      </p>

      <Callout title="Respuesta rápida" tone="info">
        <p>
          <strong>Cubierta = neumático = goma.</strong> La <strong>llanta</strong> es el rin donde se monta. Lo que importa para comprar
          es la medida, que está escrita en el costado.
        </p>
      </Callout>

      <h2>Cómo se dice en cada caso</h2>
      <ul>
        <li><strong>Cubierta:</strong> la forma más usada cuando se pide una medida en un local o en un buscador.</li>
        <li><strong>Neumático:</strong> el término técnico, el que usan fabricantes y manuales.</li>
        <li><strong>Goma:</strong> el habla de todos los días en la gomería.</li>
        <li><strong>Llanta:</strong> el rin, no la cubierta. Más sobre esto en <Link href="/blog/rodado-del-neumatico-que-significa">qué significa el rodado</Link>.</li>
      </ul>

      <h2>Cómo leer la medida</h2>
      <p>
        En <strong>175/65 R14 82T</strong>, el 175 es el ancho en milímetros, el 65 es el perfil (la altura del costado como porcentaje del
        ancho), la R indica construcción radial y el 14 es el rodado en pulgadas. El 82T son los índices de carga y de velocidad.
        La guía completa está en <Link href="/blog/como-leer-medida-neumatico">cómo leer la medida de un neumático</Link>.
      </p>

      <h2>Buscar por medida o por rodado</h2>
      <p>
        Si ya sabés la medida exacta, buscala en el <Link href="/catalogo">catálogo</Link>. Si solo sabés el rodado, podés mirar todas
        las medidas disponibles en <Link href="/neumaticos/rodado-13">rodado 13</Link>, <Link href="/neumaticos/rodado-14">rodado 14</Link>,{" "}
        <Link href="/neumaticos/rodado-15">rodado 15</Link> o <Link href="/neumaticos/rodado-16">rodado 16</Link>. Y si dudás de una
        equivalencia, la <Link href="/calculadora-equivalencia-neumaticos">calculadora de equivalencias</Link> te dice qué medidas cercanas sirven.
      </p>

      <h2>Qué mirar antes de comprar</h2>
      <ol>
        <li>La medida exacta y los índices de carga y velocidad, que no deben ser menores a los originales.</li>
        <li>El precio por unidad con IVA y si la colocación está incluida.</li>
        <li>La fecha de fabricación (<Link href="/blog/antiguedad-del-neumatico-codigo-dot">cómo leer el DOT</Link>).</li>
        <li>El stock real en tu medida.</li>
      </ol>
      <p>
        En Neumáticos Trivium el stock y el precio están publicados, y la colocación es sin cargo si comprás las cubiertas con nosotros.
        Pasá por las <Link href="/sucursales">sucursales</Link> o escribinos por WhatsApp.
      </p>
    </ArticleLayout>
  );
}
