import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { DEFAULT_BRANCH_ID } from "@/lib/config";
import { BRANDS } from "@/lib/data";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { canonical, SITE_NAME, resumen } from "@/lib/seo";
import { OTRAS_MARCAS } from "@/lib/marcas-chinas";
import { poolShare } from "@/lib/share-image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";

// Como el resto de las landings de SEO usa DEFAULT_BRANCH_ID y no lee la cookie
// de sucursal (ver memoria seo-architecture): tiene que seguir siendo estática.
const share = poolShare("marcas-chinas");

export const metadata: Metadata = {
  title: "Marcas de neumáticos chinos en Argentina: cuáles son y cómo elegir",
  description:
    resumen("Las marcas de neumáticos chinos más buscadas en Argentina (Kpatos, Sailun, Goodride, Westlake, Triangle y más): quién las fabrica, cómo comparar una con otra y precios y stock de hoy, con colocación sin cargo."),
  alternates: canonical("/marcas-de-neumaticos-chinos"),
  openGraph: { title: `Marcas de neumáticos chinos en Argentina — ${SITE_NAME}`, url: "/marcas-de-neumaticos-chinos", ...share.openGraph },
  twitter: share.twitter,
};

const FAQS = [
  {
    question: "¿Qué marcas de neumáticos chinos se venden en Argentina?",
    answer:
      "Hay decenas. Entre las más buscadas están Linglong, Triangle, Sailun, Goodride, Westlake, Kpatos, Firemax, Greentrac y Windforce. En Neumáticos Trivium tenemos en stock Grenlander, Zmax, Firemax y Arivo Premio.",
  },
  {
    question: "¿Un neumático chino es de mala calidad?",
    answer:
      "No es una sola categoría: hay marcas de entrada sin trazabilidad y fabricantes grandes con décadas de experiencia y registro en la base europea EPREL. Lo que sirve es comparar neumático contra neumático, con la etiqueta europea, la fecha DOT, los índices y la garantía.",
  },
  {
    question: "¿Cómo sé quién fabrica una marca china?",
    answer:
      "Muchas marcas pertenecen a un mismo grupo y se venden con distintos nombres. Una forma de saberlo es buscar el modelo en el registro europeo EPREL, que muestra el proveedor y los datos de la etiqueta de cada neumático.",
  },
  {
    question: "¿Qué garantía tienen los neumáticos chinos?",
    answer:
      "Depende de quién los importa. En Neumáticos Trivium todos los neumáticos tienen un año de garantía por defecto de fabricación, y la colocación y el cambio de válvulas no tienen cargo si comprás en el local.",
  },
];

export default async function MarcasChinasPage() {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const nuestras = BRANDS.filter((b) => b.origin === "China" && productos.some((p) => p.brandId === b.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs
        crumbs={[
          { name: "Inicio", path: "/" },
          { name: "Marcas", path: "/marcas" },
          { name: "Marcas de neumáticos chinos", path: "/marcas-de-neumaticos-chinos" },
        ]}
      />

      <header className="mb-10 max-w-3xl">
        <h1 className="font-display text-4xl font-bold uppercase leading-tight tracking-wide text-slate-900 md:text-5xl">
          Marcas de neumáticos chinos en Argentina
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          Desde que se abrió la importación llegaron cientos de marcas. Acá juntamos las más buscadas, qué se sabe de
          cada una y las que tenemos en stock, para que compares con datos y no con el nombre.
        </p>
      </header>

      <section className="mb-14">
        <h2 className="font-display mb-3 text-3xl font-bold uppercase tracking-wide text-slate-900">
          Las que tenemos en stock
        </h2>
        <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {nuestras.map((b) => (
            <li key={b.id}>
              <Link href={`/marcas/${b.id}`} className="block h-full rounded-2xl border border-slate-200 bg-white p-4 hover:border-[#ff1e00]">
                <span className="block font-black text-slate-900">{b.name}</span>
                <span className="mt-1 block text-sm text-slate-600">{b.description}</span>
                <span className="mt-2 block text-xs font-bold text-slate-500">
                  {productos.filter((p) => p.brandId === b.id).length} modelos y medidas
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-14">
        <h2 className="font-display mb-3 text-3xl font-bold uppercase tracking-wide text-slate-900">
          Otras marcas que se buscan
        </h2>
        <p className="mb-5 max-w-3xl text-slate-600">
          No las vendemos, pero cada una tiene su página con lo que se sabe de la marca y atajos a las que sí
          tenemos.
        </p>
        <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {OTRAS_MARCAS.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/marcas-de-neumaticos-chinos/${m.slug}`}
                className="block h-full rounded-2xl border border-slate-200 bg-white p-4 hover:border-[#ff1e00]"
              >
                <span className="block font-black text-slate-900">{m.name}</span>
                <span className="mt-1 block text-sm text-slate-600">{m.empresa}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-14 max-w-3xl space-y-3 leading-relaxed text-slate-700">
        <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-slate-900">
          Cómo elegir entre marcas chinas
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Compará la <Link href="/blog/etiqueta-europea-neumaticos" className="font-bold text-[#cc1800] underline underline-offset-4">etiqueta europea</Link> de
            cada neumático: se puede verificar en el registro público EPREL.
          </li>
          <li>Que coincidan la medida y los <Link href="/blog/indice-de-carga-y-velocidad" className="font-bold text-[#cc1800] underline underline-offset-4">índices de carga y velocidad</Link>.</li>
          <li>Mirá la <Link href="/herramientas/codigo-dot" className="font-bold text-[#cc1800] underline underline-offset-4">fecha de fabricación (DOT)</Link> en el flanco.</li>
          <li>Preguntá por la garantía y quién la gestiona.</li>
        </ul>
        <p>
          Más en{" "}
          <Link href="/blog/marcas-chinas-neumaticos-comparativa" className="font-bold text-[#cc1800] underline underline-offset-4">
            marcas chinas: ¿cuál es la mejor?
          </Link>
          ,{" "}
          <Link href="/blog/son-malos-los-neumaticos-chinos" className="font-bold text-[#cc1800] underline underline-offset-4">
            ¿son malos los neumáticos chinos?
          </Link>{" "}
          y{" "}
          <Link href="/neumaticos-baratos" className="font-bold text-[#cc1800] underline underline-offset-4">
            neumáticos baratos
          </Link>
          .
        </p>
      </section>

      <FaqSection faqs={FAQS} />
    </div>
  );
}
