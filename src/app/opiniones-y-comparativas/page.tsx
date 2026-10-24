import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, canonical, itemListJsonLd } from "@/lib/seo";
import { BLOG_POSTS } from "@/lib/data";
import { medidasConComparativa } from "@/lib/comparativas";
import { formatSize } from "@/lib/tire-sizes";

export const metadata: Metadata = {
  title: "Opiniones y comparativas de neumáticos: marcas, medidas y precios",
  description:
    "Comparativas de neumáticos por medida con la etiqueta europea oficial, opiniones sobre marcas chinas y alternativas a las marcas premium, y guías para comparar antes de comprar.",
  alternates: canonical("/opiniones-y-comparativas"),
};

// Notas del blog que forman parte del cluster, en el orden en que se muestran.
const NOTAS = [
  "como-comparar-neumaticos-antes-de-comprar",
  "opiniones-linglong-mileking-sumaxx",
  "son-malos-los-neumaticos-chinos",
  "marcas-chinas-neumaticos-comparativa",
  "neumaticos-de-marca-vs-importados-cual-conviene",
  "diferencia-neumatico-caro-y-barato",
  "at-o-ht-cual-conviene-para-tu-camioneta",
  "perfil-bajo-o-perfil-alto",
  "precio-calidad-neumaticos-costo-por-km",
  "alternativas-a-michelin-y-pirelli",
  "neumaticos-japoneses-europeos-americanos-y-chinos-origen-de-las-marcas",
  "etiqueta-europea-neumaticos",
  "grenlander",
];

export default async function OpinionesYComparativasPage() {
  const medidas = await medidasConComparativa();
  const notas = NOTAS.flatMap((s) => BLOG_POSTS.filter((p) => p.slug === s));

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <JsonLd data={breadcrumbJsonLd([{ name: "Inicio", path: "/" }, { name: "Opiniones y comparativas", path: "/opiniones-y-comparativas" }])} />
      <JsonLd
        data={itemListJsonLd([
          ...medidas.map((m) => ({ name: `Comparativa de neumáticos ${formatSize(m.size)}`, path: `/comparativas/${m.slug}` })),
          ...notas.map((n) => ({ name: n.title, path: `/blog/${n.slug}` })),
        ])}
      />
      <div className="bg-navy-950 px-4 py-14">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-3xl font-black text-white md:text-5xl">Opiniones y comparativas de neumáticos</h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            Para elegir con datos: comparativas por medida con la etiqueta europea oficial, qué se sabe de cada marca y cómo comparar precios sin sorpresas.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pt-10">
        {medidas.length > 0 && (
          <section>
            <h2 className="mb-2 text-2xl font-black text-navy-900">Comparativas por medida</h2>
            <p className="mb-4 text-slate-600">
              Los modelos de cada medida lado a lado: precio, eficiencia, frenado en mojado y ruido, con datos del registro oficial EPREL.
            </p>
            <ul className="flex flex-wrap gap-2">
              {medidas.map((m) => (
                <li key={m.slug}>
                  <Link href={`/comparativas/${m.slug}`} className="inline-block rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-navy-900 hover:border-navy-300">
                    {formatSize(m.size)} <span className="font-normal text-slate-500">· {m.modelos} modelos</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-black text-navy-900">Marcas</h2>
          <ul className="grid gap-3 sm:grid-cols-3">
            {[
              { href: "/marcas-de-neumaticos-chinos", t: "Marcas chinas", d: "Kpatos, Sailun, Goodride y más: cuáles se venden acá y cuáles tenemos." },
              { href: "/alternativas", t: "Alternativas a marcas premium", d: "Qué comprar en lugar de Michelin, Bridgestone, Goodyear, Fate y otras." },
              { href: "/marcas", t: "Marcas que vendemos", d: "Todas las marcas de nuestro catálogo, con sus modelos." },
            ].map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="block h-full rounded-xl border border-slate-200 bg-white p-4 hover:border-navy-300">
                  <span className="block font-black text-navy-900">{c.t}</span>
                  <span className="mt-1 block text-sm text-slate-600">{c.d}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-black text-navy-900">Guías y opiniones</h2>
          <ul className="space-y-3">
            {notas.map((n) => (
              <li key={n.slug}>
                <Link href={`/blog/${n.slug}`} className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-navy-300">
                  <span className="block font-black text-navy-900">{n.title}</span>
                  <span className="mt-1 block text-sm text-slate-600">{n.excerpt}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
