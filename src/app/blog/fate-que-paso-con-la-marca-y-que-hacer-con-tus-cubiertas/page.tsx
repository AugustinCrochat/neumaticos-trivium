import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { Callout } from "@/components/blog/Callout";
import { canonical, resumen } from "@/lib/seo";
import { blogShare } from "@/lib/blog-meta";

const SLUG = "fate-que-paso-con-la-marca-y-que-hacer-con-tus-cubiertas";
const TITLE = "Fate: qué pasó con la marca y qué hacer si todavía tenés cubiertas Fate";
const SUBTITLE = "Qué se sabe de Fate según fuentes públicas, qué hacer con las cubiertas ya compradas y qué alternativas hay hoy.";

export const metadata: Metadata = {
  ...blogShare(SLUG),
  title: TITLE,
  description: resumen("Fate nació en 1940 y anunció su cierre en febrero de 2026. Qué se sabe, qué hacer con las cubiertas Fate que ya tenés (garantía, reemplazo) y qué alternativas hay con stock."),
  alternates: canonical(`/blog/${SLUG}`),
};

const FAQS = [
  {
    "question": "¿Cuándo se fundó Fate?",
    "answer": "En 1940, por Leiser Madanes. La sigla significa Fábrica Argentina de Telas Engomadas, según los medios que repasaron su historia."
  },
  {
    "question": "¿Fate cerró?",
    "answer": "El 18 de febrero de 2026 la empresa anunció el cese de actividad en su planta de San Fernando y el despido de unos 920 trabajadores. Después el Gobierno dictó una conciliación obligatoria. La situación puede haber cambiado: verificá en fuentes actuales."
  },
  {
    "question": "¿Qué hago con mis cubiertas Fate?",
    "answer": "Si están en buen estado, pueden seguir usándose. Revisá el desgaste, la fecha de fabricación y la presión como en cualquier cubierta. Para reemplazarlas, buscá la misma medida e índices en otra marca."
  },
  {
    "question": "¿Sigue la garantía?",
    "answer": "No encontramos un comunicado público sobre la garantía de las cubiertas ya vendidas. Guardá la factura y consultá en el comercio donde compraste o en Defensa del Consumidor de tu provincia."
  }
];

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} title={TITLE} subtitle={SUBTITLE} category="Marcas" date="2026-11-14" readingMinutes={5} faqs={FAQS}>
      <p>
        «Fate» se busca unas 880 veces por mes en Argentina, y muchas de esas personas ya tienen cubiertas Fate puestas. Reunimos lo que se
        sabe y qué conviene hacer, con fuentes públicas consultadas el <strong>5 de noviembre de 2026</strong>.
      </p>

      <Callout title="Respuesta rápida" tone="info">
        <p>
          Las cubiertas Fate que ya están en tu auto pueden seguir usándose si están en buen estado. Para reemplazarlas, lo que cuenta es
          la <strong>medida y los índices</strong>, no la marca. No tenemos relación con Fate.
        </p>
      </Callout>

      <h2>Qué se sabe de Fate</h2>
      <ul>
        <li><strong>Origen:</strong> la creó en 1940 Leiser Madanes, y su nombre es la sigla de Fábrica Argentina de Telas Engomadas.</li>
        <li><strong>Planta:</strong> a partir de los años 60 se construyó la planta de San Fernando, durante años de las más grandes del país en el rubro.</li>
        <li><strong>Cierre:</strong> el 18 de febrero de 2026 la empresa comunicó el cese de actividad en San Fernando y el despido de unos 920 empleados. Los medios lo atribuyeron a la apertura de importaciones y a la competencia asiática.</li>
        <li><strong>Después:</strong> el Gobierno dictó una conciliación obligatoria y la empresa dijo que la acataría. Los datos posteriores varían según la fuente.</li>
      </ul>

      <h2>Qué hacer si tenés cubiertas Fate</h2>
      <ol>
        <li><strong>Revisalas:</strong> profundidad del dibujo, grietas y <Link href="/blog/antiguedad-del-neumatico-codigo-dot">fecha de fabricación</Link>.</li>
        <li><strong>Guardá la factura</strong> por si hubiera que reclamar una garantía.</li>
        <li><strong>Al cambiarlas:</strong> mantené la misma medida e índices de carga y velocidad (<Link href="/blog/como-leer-medida-neumatico">cómo leer la medida</Link>). Si dudás, la <Link href="/calculadora-equivalencia-neumaticos">calculadora de equivalencias</Link> te muestra opciones.</li>
        <li><strong>Cambialas de a pares</strong> por eje, o las cuatro juntas si el desgaste es parejo.</li>
      </ol>

      <h2>Qué tenemos nosotros</h2>
      <p>
        Outlet de neumáticos de importación directa, con stock y precio publicados, colocación sin cargo si comprás las cubiertas con
        nosotros y <Link href="/servicios">taller propio</Link>. Buscá tu medida en el <Link href="/catalogo">catálogo</Link>, mirá las{" "}
        <Link href="/alternativas/fate">alternativas a Fate</Link> o pasá por las <Link href="/sucursales">sucursales</Link>.
      </p>

      <h2>Fuentes consultadas</h2>
      <ul>
        <li><a href="https://www.bloomberglinea.com/latinoamerica/argentina/que-paso-con-fate-y-por-que-dejara-de-existir/" rel="nofollow noopener" target="_blank">Bloomberg Línea, «Qué pasó con Fate»</a></li>
        <li><a href="https://www.lacapital.com.ar/c10245306" rel="nofollow noopener" target="_blank">La Capital, «Fate anunció su cierre definitivo»</a></li>
        <li><a href="https://www.cronica.com.ar/sociedad/fate-anuncio-su-cierre-definitivo-y-despedira-a-920-empleados-415/" rel="nofollow noopener" target="_blank">Crónica, anuncio del cierre</a></li>
        <li><a href="https://www.cronista.com/negocios/despues-del-anuncio-de-cierre-fate-acata-la-conciliacion-obligatoria-y-reabrira-la-planta-cuando-la-desalojen" rel="nofollow noopener" target="_blank">El Cronista, conciliación obligatoria</a></li>
      </ul>
    </ArticleLayout>
  );
}
