import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, canonical, faqJsonLd, type Faq } from "@/lib/seo";
import { filasComparativa, medidasConComparativa, MIN_MODELOS } from "@/lib/comparativas";
import { formatSize, parseSizeSlug, sizeSlug } from "@/lib/tire-sizes";
import { poolShare } from "@/lib/share-image";

/**
 * Comparativa por medida (/comparativas/175-65-r14): los neumáticos de esa
 * medida que tenemos con etiqueta europea registrada, lado a lado. Los datos
 * (eficiencia, frenado en mojado, ruido) son los del registro oficial EPREL;
 * el precio y el stock, los del catálogo. No opina sobre cuál es "mejor".
 * No lee la cookie de sucursal (se prerenderiza).
 */
type Props = { params: Promise<{ medida: string }> };

export async function generateStaticParams() {
  return (await medidasConComparativa()).map((m) => ({ medida: m.slug }));
}

const price = (n: number) => `$${n.toLocaleString("es-AR")}`;
const ESCALA = "ABCDE";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { medida } = await params;
  const size = parseSizeSlug(medida);
  if (!size) return {};
  const filas = await filasComparativa(size);
  if (filas.length < MIN_MODELOS) return {};
  const marcas = [...new Set(filas.map((f) => f.product.brand))];
  const title = `Comparativa de neumáticos ${formatSize(size)}: precio y etiqueta europea`;
  const description = `${filas.length} neumáticos ${formatSize(size)} (${marcas.join(", ")}) lado a lado: precio, eficiencia, frenado en mojado y ruido según el registro oficial EPREL.`;
  return {
    title,
    description,
    alternates: canonical(`/comparativas/${medida}`),
    openGraph: { title, description, url: `/comparativas/${medida}`, ...poolShare(medida).openGraph },
    twitter: poolShare(medida).twitter,
  };
}

export default async function ComparativaPage({ params }: Props) {
  const { medida } = await params;
  const size = parseSizeSlug(medida);
  if (!size) notFound();
  const filas = await filasComparativa(size);
  if (filas.length < MIN_MODELOS) notFound();

  const nombre = formatSize(size);
  const path = `/comparativas/${medida}`;
  const barato = filas[0];
  const mejorMojado = Math.min(...filas.map((f) => ESCALA.indexOf(f.label.wetGripClass)));
  const conMejorMojado = filas.filter((f) => ESCALA.indexOf(f.label.wetGripClass) === mejorMojado);
  const silencioso = [...filas].sort((a, b) => a.label.noiseDb - b.label.noiseDb)[0];
  const modeloDe = (f: (typeof filas)[number]) => `${f.product.brand} ${f.product.modeloBase}`;

  const faqs: Faq[] = [
    {
      question: `¿Qué neumático ${nombre} es el más barato?`,
      answer: `Hoy el más económico de esta comparativa es el ${modeloDe(barato)}, a ${price(barato.product.price)}. El precio cambia: mirá el valor actualizado en su ficha.`,
    },
    {
      question: "¿La etiqueta europea dice cuál dura más?",
      answer:
        "No. Mide tres cosas: eficiencia de combustible, frenado en mojado y ruido externo. No mide durabilidad, agarre en seco ni comportamiento en curva, así que sirve para comparar esos tres puntos, no para elegir por sí sola.",
    },
    {
      question: "¿De dónde salen los datos de la tabla?",
      answer:
        "De EPREL, el registro oficial de la Unión Europea donde el fabricante o importador carga la etiqueta de cada neumático. En cada ficha está el enlace al registro para que lo verifiques.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Opiniones y comparativas", path: "/opiniones-y-comparativas" },
          { name: nombre, path },
        ])}
      />
      <JsonLd data={faqJsonLd(faqs)} />

      <div className="bg-navy-950 px-4 py-14">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-orange-400">Comparativa por medida</span>
          <h1 className="mb-4 text-3xl font-black text-white md:text-5xl">Neumáticos {nombre}: comparativa</h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            {filas.length} modelos {nombre} con etiqueta europea registrada, lado a lado: precio, eficiencia, frenado en mojado y ruido.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-10">
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-4 py-3 font-bold">Modelo</th>
                <th className="px-3 py-3 font-bold">Precio</th>
                <th className="px-3 py-3 font-bold">Eficiencia</th>
                <th className="px-3 py-3 font-bold">Mojado</th>
                <th className="px-3 py-3 font-bold">Ruido</th>
                <th className="px-3 py-3 font-bold">Stock</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((f) => (
                <tr key={f.product.slug} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/productos/${f.product.slug}`} className="font-black text-navy-900 underline underline-offset-4 hover:text-orange-600">
                      {modeloDe(f)}
                    </Link>
                    <span className="block text-xs text-slate-500">
                      {f.label.tyreDesignation}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-black text-navy-900">{price(f.product.price)}</td>
                  <td className="px-3 py-3 font-bold">{f.label.energyClass}</td>
                  <td className="px-3 py-3 font-bold">{f.label.wetGripClass}</td>
                  <td className="px-3 py-3">
                    {f.label.noiseDb} dB <span className="text-slate-500">({f.label.noiseClass})</span>
                  </td>
                  <td className="px-3 py-3 text-slate-600">{f.product.enStock ? "En stock" : "Consultar"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Clases de la A (mejor) a la E. Datos del registro oficial EPREL; precios y stock de nuestra sucursal de Argüello, que pueden cambiar.
        </p>

        <section className="mt-10 rounded-2xl bg-white p-6 md:p-8">
          <h2 className="mb-3 text-xl font-black text-navy-900">Lo que muestran los datos</h2>
          <ul className="list-disc space-y-2 pl-5 text-slate-700">
            <li>
              Más económico: <strong>{modeloDe(barato)}</strong> ({price(barato.product.price)}).
            </li>
            <li>
              Mejor clase de frenado en mojado ({ESCALA[mejorMojado]}):{" "}
              <strong>{conMejorMojado.map(modeloDe).join(", ")}</strong>.
            </li>
            <li>
              Menor ruido externo declarado: <strong>{modeloDe(silencioso)}</strong> ({silencioso.label.noiseDb} dB).
            </li>
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            La etiqueta no mide durabilidad ni agarre en seco, así que no alcanza para decidir sola. Para eso mirá{" "}
            <Link href="/blog/precio-calidad-neumaticos-costo-por-km" className="font-bold text-navy-700 underline">
              el costo por kilómetro
            </Link>{" "}
            y cómo{" "}
            <Link href="/blog/etiqueta-europea-neumaticos" className="font-bold text-navy-700 underline">
              leer la etiqueta europea
            </Link>
            .
          </p>
        </section>

        <section className="mt-10">
          <h2 className="mb-5 text-xl font-black text-navy-900">Preguntas frecuentes</h2>
          <dl className="space-y-5">
            {faqs.map((f) => (
              <div key={f.question}>
                <dt className="font-bold text-navy-900">{f.question}</dt>
                <dd className="mt-1 leading-relaxed text-slate-600">{f.answer}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-slate-600">
            <Link href={`/neumaticos/${sizeSlug(size)}`} className="font-bold text-navy-700 underline underline-offset-4">
              Todos los neumáticos {nombre}
            </Link>
            <Link href="/opiniones-y-comparativas" className="font-bold text-navy-700 underline underline-offset-4">
              Más opiniones y comparativas
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
