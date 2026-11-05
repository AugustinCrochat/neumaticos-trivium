import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "bridgestone-y-firestone-historia-y-como-elegir";
const TITLE = "Bridgestone y Firestone: historia, qué relación tienen y cómo elegir";
const SUBTITLE = "La historia de Bridgestone y Firestone según fuentes públicas, y cómo comparar con otras marcas.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description: resumen("Bridgestone se fundó en 1931 y compró Firestone en 1988. Qué se sabe de las dos marcas, de dónde viene el nombre y cómo elegir cubiertas por medida."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    "question": "¿Cuándo se fundó Bridgestone?",
    "answer": "El 1 de marzo de 1931 en Japón, por Shojiro Ishibashi."
  },
  {
    "question": "¿De dónde viene el nombre?",
    "answer": "Del apellido del fundador: Ishibashi se puede traducir como «puente de piedra», en inglés bridge y stone."
  },
  {
    "question": "¿Firestone es de Bridgestone?",
    "answer": "Sí. Bridgestone compró Firestone en 1988 y hoy es una de sus marcas."
  },
  {
    "question": "¿Se fabrican en Argentina?",
    "answer": "Las dos marcas comparten la planta de Llavallol, que inauguró Firestone y hoy opera Bridgestone."
  }
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Marcas" date="2026-11-21" readingMinutes={5} faqs={FAQS}>
      <p>
        Bridgestone y Firestone suenan como marcas distintas, pero tienen el mismo dueño. Reunimos lo que se sabe, con fuentes
        consultadas el <strong>5 de noviembre de 2026</strong>.
      </p>

      <Callout title="Respuesta rápida" tone="info">
        <p>
          Bridgestone es japonesa, se fundó en 1931 y <strong>compró Firestone en 1988</strong>. En esta nota no comparamos precios ni
          desempeño: te damos qué mirar para elegir bien.
        </p>
      </Callout>

      <h2>Qué se sabe</h2>
      <ul>
        <li><strong>Fundación:</strong> el 1 de marzo de 1931, en Japón, por Shojiro Ishibashi, a partir del negocio familiar de calzado.</li>
        <li><strong>Nombre:</strong> sale del apellido del fundador, «puente de piedra».</li>
        <li><strong>Firestone:</strong> Bridgestone adquirió la compañía estadounidense en 1988, según el comunicado de Bridgestone Americas por el 30.º aniversario de la fusión.</li>
        <li><strong>Argentina:</strong> la planta de Llavallol la inauguró Firestone y hoy la opera Bridgestone.</li>
      </ul>

      <h2>Qué comparar antes de decidir</h2>
      <ol>
        <li><strong>La misma medida e índices</strong> (<Link href="/blog/como-leer-medida-neumatico">cómo leer la medida</Link>).</li>
        <li><strong>Precio final por unidad</strong> con IVA y si la colocación está incluida.</li>
        <li><strong>Fecha de fabricación</strong> (<Link href="/blog/antiguedad-del-neumatico-codigo-dot">DOT</Link>).</li>
        <li><strong>Stock real</strong> en tu medida.</li>
      </ol>

      <h2>Qué tenemos nosotros</h2>
      <p>
        Outlet de importación directa con stock y precio publicados. Mirá las <Link href="/alternativas/bridgestone">alternativas a Bridgestone</Link>,
        el <Link href="/catalogo">catálogo</Link> o las marcas de <Link href="/marcas">todo el stock</Link>. En el <Link href="/servicios">taller</Link>
        hacemos alineado y balanceado, y estamos en las <Link href="/sucursales">sucursales</Link>.
      </p>

      <h2>Fuentes consultadas</h2>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/Bridgestone" rel="nofollow noopener" target="_blank">Wikipedia, Bridgestone</a> (fundación)</li>
        <li><a href="https://www.bridgestoneamericas.com/en/newsroom/company-news/2018/bridgestone-celebrates-30th-anniversary-of-historic-merger-with-" rel="nofollow noopener" target="_blank">Bridgestone Americas, 30.º aniversario de la fusión con Firestone</a></li>
        <li><a href="https://www.jalopnik.com/2212752/bridgestone-tires-name-japanese-founder-ishibashi-flip/" rel="nofollow noopener" target="_blank">Jalopnik, origen del nombre</a></li>
      </ul>
    </ArticleLayout>
  );
}
