import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "goodyear-historia-y-por-que-se-llama-asi";
const TITLE = "Goodyear: historia de la marca y por qué se llama así";
const SUBTITLE = "La historia de Goodyear según fuentes públicas y cómo elegir cubiertas de cualquier marca.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description: resumen("Goodyear se fundó en 1898 en Akron, Ohio. De dónde viene el nombre, qué se sabe de la compañía y cómo elegir cubiertas por medida, índices y fecha de fabricación."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    "question": "¿Cuándo se fundó Goodyear?",
    "answer": "El 29 de agosto de 1898 en Akron, Ohio (Estados Unidos), por Frank Seiberling y su hermano."
  },
  {
    "question": "¿Por qué se llama Goodyear?",
    "answer": "Por Charles Goodyear (1800-1860), inventor de la vulcanización del caucho. Según las fuentes, él no tuvo relación con la empresa."
  },
  {
    "question": "¿Goodyear compró Cooper Tire?",
    "answer": "Sí, en 2021 Goodyear anunció la compra de Cooper Tire."
  },
  {
    "question": "¿Cómo elijo una cubierta?",
    "answer": "Por la medida y los índices de carga y velocidad del auto, la fecha de fabricación y el precio final con colocación."
  }
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Marcas" date="2026-11-22" readingMinutes={5} faqs={FAQS}>
      <p>
        Goodyear se busca unas 1.900 veces por mes en Argentina. Reunimos lo que se sabe de su historia, con fuentes consultadas el{" "}
        <strong>5 de noviembre de 2026</strong>. No comparamos precios ni desempeño.
      </p>

      <Callout title="Respuesta rápida" tone="info">
        <p>
          Goodyear se fundó el <strong>29 de agosto de 1898</strong> en Akron, Ohio. Su nombre homenajea a Charles Goodyear, quien no
          tuvo relación con la empresa.
        </p>
      </Callout>

      <h2>Qué se sabe</h2>
      <ul>
        <li><strong>Fundación:</strong> Frank Seiberling y su hermano la fundaron en Akron, con un capital inicial de 100.000 dólares.</li>
        <li><strong>El nombre:</strong> es un homenaje a Charles Goodyear, inventor de la vulcanización del caucho.</li>
        <li><strong>Frank Seiberling</strong> dejó la compañía en 1921 y fundó otra, Seiberling Rubber Company.</li>
        <li><strong>Cooper Tire:</strong> en 2021 Goodyear anunció su compra.</li>
      </ul>

      <h2>Cómo elegir cubiertas de cualquier marca</h2>
      <ol>
        <li><strong>La misma medida e índices</strong> (<Link href="/blog/como-leer-medida-neumatico">cómo leer la medida</Link>).</li>
        <li><strong>Precio final por unidad</strong> con IVA y si la colocación está incluida.</li>
        <li><strong>Fecha de fabricación</strong> (<Link href="/blog/antiguedad-del-neumatico-codigo-dot">DOT</Link>).</li>
        <li><strong>Stock real</strong> en tu medida.</li>
      </ol>

      <h2>Qué tenemos nosotros</h2>
      <p>
        Outlet de importación directa con stock y precio publicados. Mirá las <Link href="/alternativas/goodyear">alternativas a Goodyear</Link>,
        el <Link href="/catalogo">catálogo</Link> o la <Link href="/marcas">lista de marcas</Link>. Con compra de cubiertas, la colocación es sin cargo, y
        en el <Link href="/servicios">taller</Link> hacemos el alineado y balanceado.
      </p>

      <h2>Fuentes consultadas</h2>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/Goodyear_Tire_and_Rubber_Company" rel="nofollow noopener" target="_blank">Wikipedia, Goodyear Tire and Rubber Company</a></li>
        <li><a href="https://news.goodyear.eu/people-who-shaped-goodyear/" rel="nofollow noopener" target="_blank">Goodyear, «People who shaped Goodyear»</a></li>
      </ul>
    </ArticleLayout>
  );
}
