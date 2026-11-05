import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "pirelli-historia-de-la-marca-y-que-neumaticos-tenemos";
const TITLE = "Pirelli: historia de la marca desde 1872 y qué neumáticos Pirelli tenemos";
const SUBTITLE = "La historia de Pirelli según fuentes públicas, qué pasó con su producción local en 2026 y cómo buscar tu medida.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description: resumen("Pirelli nació en Milán en 1872. Qué se sabe de la marca y de su producción en Argentina en 2026, y cómo ver las medidas Pirelli con stock y precio publicados."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    "question": "¿Cuándo nació Pirelli?",
    "answer": "El 28 de enero de 1872 en Milán, según la Fundación Pirelli, cuando Giovanni Battista Pirelli fundó G.B. Pirelli & C."
  },
  {
    "question": "¿De dónde es Pirelli?",
    "answer": "De Italia. Su primera empresa fabricaba artículos de caucho; los neumáticos vinieron después."
  },
  {
    "question": "¿Pirelli fabrica en Argentina?",
    "answer": "Tiene una planta en Merlo. En mayo de 2026 la prensa informó suspensiones parciales de producción por la caída de ventas; el estado actual puede cambiar."
  },
  {
    "question": "¿Tienen Pirelli en stock?",
    "answer": "Sí, en varias medidas. El stock real está publicado por medida en el catálogo y en la página de la marca."
  }
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Marcas" date="2026-11-15" readingMinutes={5} faqs={FAQS}>
      <p>
        Pirelli se busca unas 5.400 veces por mes en Argentina, la marca más buscada del rubro. Reunimos lo que se sabe de su historia y
        de su situación local, con fuentes consultadas el <strong>5 de noviembre de 2026</strong>.
      </p>

      <Callout title="Respuesta rápida" tone="info">
        <p>
          Pirelli nació en Milán el <strong>28 de enero de 1872</strong>. Vendemos Pirelli y el stock está publicado por medida.
          No comparamos precios con otros comercios.
        </p>
      </Callout>

      <h2>Qué se sabe de Pirelli</h2>
      <ul>
        <li><strong>Fundación:</strong> el 28 de enero de 1872, en Milán, por el ingeniero Giovanni Battista Pirelli, de 23 años, según la Fundación Pirelli.</li>
        <li><strong>Primer negocio:</strong> artículos de caucho elástico; la empresa se llamó G.B. Pirelli &amp; C.</li>
        <li><strong>150 años:</strong> la marca celebró su aniversario 150 en 2022.</li>
      </ul>

      <h2>Pirelli en Argentina, 2026</h2>
      <p>
        Pirelli tiene una planta en Merlo. Según La Capital (21 de mayo de 2026), la compañía suspendió parte de su producción por la
        caída de las ventas y de la actividad automotriz, y medios posteriores informaron nuevas paradas en junio y julio. Las cifras y
        fechas varían según la fuente, así que conviene mirar notas actuales. Es contexto de la industria; no cambia cómo elegir tus cubiertas.
      </p>

      <h2>Cómo elegir una Pirelli</h2>
      <ol>
        <li><strong>Empezá por la medida:</strong> <Link href="/blog/como-leer-medida-neumatico">cómo leerla</Link> y buscarla en el <Link href="/catalogo">catálogo</Link>.</li>
        <li><strong>Respetá índices de carga y velocidad</strong> del manual del auto.</li>
        <li><strong>Mirá la fecha de fabricación</strong> (<Link href="/blog/antiguedad-del-neumatico-codigo-dot">DOT</Link>).</li>
        <li><strong>Pedí el precio final</strong> por unidad con IVA y si la colocación está incluida.</li>
      </ol>

      <h2>Qué tenemos nosotros</h2>
      <p>
        Mirá todas las medidas en la página de <Link href="/marcas/pirelli">Pirelli</Link>. Con compra de cubiertas, la colocación es sin
        cargo, y en el <Link href="/servicios">taller</Link> hacemos el alineado y balanceado. Estamos en las <Link href="/sucursales">sucursales</Link> de Córdoba y Buenos Aires.
      </p>

      <h2>Fuentes consultadas</h2>
      <ul>
        <li><a href="https://corporate.pirelli.com/corporate/en-ww/aboutus/history" rel="nofollow noopener" target="_blank">Pirelli, historia corporativa</a></li>
        <li><a href="https://www.fondazionepirelli.org/en/?p=74888" rel="nofollow noopener" target="_blank">Fundación Pirelli, orígenes de la empresa</a></li>
        <li><a href="https://www.lacapital.com.ar/informacion-general/tras-el-cierre-fate-pirelli-suspendera-la-produccion-neumaticos-la-baja-demanda-n10260564.html" rel="nofollow noopener" target="_blank">La Capital, «Pirelli suspenderá la producción»</a></li>
      </ul>
    </ArticleLayout>
  );
}
