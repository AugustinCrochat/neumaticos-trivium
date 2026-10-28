import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { notFound } from "next/navigation";
import { POPULAR_VEHICLES, vehicleSlug } from "@/lib/vehicles";
import { marcaSlug } from "@/lib/marcas-autos";
import { MarcaLogo } from "@/components/ui/MarcaLogo";
import { JsonLd } from "@/components/seo/JsonLd";
import { canonical, breadcrumbJsonLd, faqJsonLd, itemListJsonLd, type Faq } from "@/lib/seo";
import { formatSize, sizeSlug } from "@/lib/tire-sizes";
import { poolShare } from "@/lib/share-image";

/**
 * Neumáticos para una marca de auto (/vehiculos/marca/chevrolet): lista los
 * modelos con ficha y las medidas que usan. Captura "neumáticos para
 * <marca>". Todo sale de los datos de vehículos, sin leer la cookie de
 * sucursal, así se prerenderiza.
 */
type Props = { params: Promise<{ marca: string }> };

const marcas = () => [...new Set(POPULAR_VEHICLES.map((v) => v.brand))];
const findBrand = (slug: string) => marcas().find((b) => marcaSlug(b) === slug);

export async function generateStaticParams() {
  return marcas().map((b) => ({ marca: marcaSlug(b) }));
}

function datos(brand: string) {
  const vehiculos = POPULAR_VEHICLES.filter((v) => v.brand === brand);
  const medidas = new Map<string, { size: { width: number; profile: number; rim: number }; modelos: Set<string> }>();
  for (const v of vehiculos) {
    for (const s of v.sizes) {
      const size = { width: Number(s.w), profile: Number(s.p), rim: Number(s.r) };
      const key = sizeSlug(size);
      const e = medidas.get(key) ?? { size, modelos: new Set<string>() };
      e.modelos.add(v.model);
      medidas.set(key, e);
    }
  }
  const lista = [...medidas.values()].sort((a, b) => b.modelos.size - a.modelos.size || a.size.rim - b.size.rim);
  return { vehiculos, medidas: lista };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { marca } = await params;
  const brand = findBrand(marca);
  if (!brand) return {};
  const { vehiculos } = datos(brand);
  const title = `Neumáticos para ${brand}: medida de cada modelo`;
  const description = `Medidas de neumáticos de los ${brand} más comunes (${vehiculos
    .slice(0, 4)
    .map((v) => v.model)
    .join(", ")}${vehiculos.length > 4 ? " y más" : ""}), con stock y precio reales. Garantía de 1 año y colocación sin cargo en Córdoba.`;
  return {
    title,
    description,
    alternates: canonical(`/vehiculos/marca/${marca}`),
    openGraph: { title, description, url: `/vehiculos/marca/${marca}`, ...poolShare(marca).openGraph },
    twitter: poolShare(marca).twitter,
  };
}

export default async function MarcaPage({ params }: Props) {
  const { marca } = await params;
  const brand = findBrand(marca);
  if (!brand) notFound();
  const { vehiculos, medidas } = datos(brand);
  const path = `/vehiculos/marca/${marca}`;

  const faqs: Faq[] = [
    {
      question: `¿Qué medida de neumáticos llevan los ${brand}?`,
      answer: `Depende del modelo y la versión: ${vehiculos
        .slice(0, 5)
        .map((v) => `${v.model} (${[...new Set(v.sizes.map((s) => `${s.w}/${s.p} R${s.r}`))].slice(0, 3).join(", ")})`)
        .join("; ")}. Entrá a la ficha de tu modelo para ver todas las versiones, y confirmá la tuya en el flanco del neumático.`,
    },
    {
      question: `¿Tienen neumáticos para ${brand} en Córdoba?`,
      answer: `Sí. Elegí tu modelo, mirá la medida y te mostramos lo que hay en stock con precio. Tienen garantía de 1 año y la colocación es sin cargo en nuestra sucursal de Argüello.`,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Neumáticos por vehículo", path: "/vehiculos" },
          { name: brand, path },
        ])}
      />
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={itemListJsonLd(vehiculos.map((v) => ({ name: `Neumáticos para ${v.brand} ${v.model}`, path: `/vehiculos/${vehicleSlug(v.brand, v.model)}` })))}
      />

      <div className="bg-black px-4 py-14">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mx-auto mb-5 flex h-24 w-24 items-center justify-center">
            <MarcaLogo brand={brand} className="h-24 w-24 drop-shadow-[0_0_2px_rgba(255,255,255,0.9)] drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]" />
          </span>
          <h1 className="mb-4 text-4xl font-black text-white md:text-5xl">Neumáticos para {brand}</h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            Elegí tu modelo para ver la medida original de cada versión y los neumáticos que tenemos en stock.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pt-10">
        <section>
          <h2 className="mb-4 text-2xl font-black text-navy-900">Modelos {brand}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {vehiculos.map((v) => {
              const unicas = [...new Set(v.sizes.map((s) => `${s.w}/${s.p} R${s.r}`))];
              return (
                <li key={v.model}>
                  <Link
                    href={`/vehiculos/${vehicleSlug(v.brand, v.model)}`}
                    className="flex h-full items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-navy-300"
                  >
                    <MarcaLogo brand={brand} className="mt-0.5 h-6 w-6" />
                    <span>
                      <span className="block font-black text-navy-900">
                        {v.brand} {v.model}
                      </span>
                      <span className="mt-0.5 block text-sm text-slate-500">{unicas.join(" · ")}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="mb-2 text-2xl font-black text-navy-900">Medidas más usadas en {brand}</h2>
          <p className="mb-4 text-slate-600">Tocá una medida para ver los neumáticos disponibles y sus precios.</p>
          <ul className="flex flex-wrap gap-2">
            {medidas.map((m) => (
              <li key={sizeSlug(m.size)}>
                <Link
                  href={`/neumaticos/${sizeSlug(m.size)}`}
                  title={[...m.modelos].join(", ")}
                  className="inline-block rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-navy-900 hover:border-navy-300"
                >
                  {formatSize(m.size)}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="mb-5 text-2xl font-black text-navy-900">Preguntas frecuentes</h2>
          <dl className="space-y-5">
            {faqs.map((f) => (
              <div key={f.question}>
                <dt className="font-bold text-navy-900">{f.question}</dt>
                <dd className="mt-1 leading-relaxed text-slate-600">{f.answer}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-slate-600">
            ¿No está tu modelo?{" "}
            <Link href="/vehiculos" className="font-bold text-navy-700 underline underline-offset-4">
              Buscá entre todas las marcas
            </Link>{" "}
            o usá la{" "}
            <Link href="/calculadora-equivalencia-neumaticos" className="font-bold text-navy-700 underline underline-offset-4">
              calculadora de equivalencias
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
