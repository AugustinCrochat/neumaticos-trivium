import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { CatalogWidget } from "@/components/blog/CatalogWidget";
import { LOAD_SPEED_CODES, getLoadSpeedInfo } from "@/lib/load-speed";
import { absoluteUrl, canonical, resumen } from "@/lib/seo";

type Props = { params: Promise<{ codigo: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return LOAD_SPEED_CODES.map((codigo) => ({ codigo: codigo.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { codigo } = await params;
  const info = getLoadSpeedInfo(codigo);
  if (!info) return {};
  const label = info.code;
  return {
    title: `Qué significa ${label} en la cubierta: ${info.loadKg} kg y ${info.speedKmh} km/h`,
    description: resumen(`${label} = hasta ${info.loadKg} kg por rueda (índice ${info.loadIndex}) y ${info.speedKmh} km/h (letra ${info.speedRating}). Está en el flanco del neumático, no en el rin. Cuándo podés usar otro índice y qué hay en stock con ese código.`),
    alternates: canonical(`/indice-carga-velocidad/${label.toLowerCase()}`),
  };
}

export default async function LoadSpeedCodePage({ params }: Props) {
  const { codigo } = await params;
  const info = getLoadSpeedInfo(codigo);
  if (!info) notFound();

  const path = `/indice-carga-velocidad/${info.code.toLowerCase()}`;
  const todos = LOAD_SPEED_CODES.map((c) => getLoadSpeedInfo(c)).filter((c): c is NonNullable<typeof c> => !!c);
  // Mismo índice de carga con otra letra, y misma letra con otra carga.
  const mismaCarga = todos.filter((c) => c.loadIndex === info.loadIndex && c.code !== info.code);
  const mismaVelocidad = todos
    .filter((c) => c.speedRating === info.speedRating && c.code !== info.code)
    .sort((a, b) => Math.abs(a.loadKg - info.loadKg) - Math.abs(b.loadKg - info.loadKg))
    .slice(0, 4);
  const menosVelocidad = mismaCarga.filter((c) => c.speedKmh < info.speedKmh);
  const masVelocidad = mismaCarga.filter((c) => c.speedKmh > info.speedKmh);
  const faqs = [
    {
      question: `¿Qué significa ${info.code} en un neumático?`,
      answer: `El ${info.loadIndex} indica una carga máxima de ${info.loadKg} kg por neumático. La letra ${info.speedRating} indica que fue homologado para una velocidad máxima sostenida de ${info.speedKmh} km/h con su carga nominal.`,
    },
    {
      question: `¿Puedo reemplazar un neumático ${info.code} por otro con un índice menor?`,
      answer: "No. La medida puede coincidir, pero el índice de carga y el de velocidad deben ser iguales o superiores a la especificación de fábrica del vehículo. Confirmala en la etiqueta de la puerta del conductor o en el manual.",
    },
    {
      question: `¿Cuánto pueden cargar cuatro neumáticos ${info.code}?`,
      answer: `Cada uno soporta hasta ${info.loadKg} kg, así que el juego de cuatro admite ${(info.loadKg * 4).toLocaleString("es-AR")} kg en total. Ese número es del neumático, no del auto: la carga máxima del vehículo la define el fabricante.`,
    },
    {
      question: `¿Qué pasa si pongo un neumático con menos velocidad que ${info.speedRating}?`,
      answer: `Si tu auto pide ${info.code}, la letra ${info.speedRating} (${info.speedKmh} km/h) es el mínimo recomendado. Una letra inferior tiene menor resistencia al calor a alta velocidad y puede no estar homologada para ese vehículo; una letra superior es compatible y suele ser más firme y algo más cara.`,
    },
  ];

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": absoluteUrl(path),
    name: `¿Qué significa ${info.code} en un neumático?`,
    description: `Índice de carga ${info.loadIndex}: ${info.loadKg} kg por rueda. Índice de velocidad ${info.speedRating}: ${info.speedKmh} km/h.`,
    inLanguage: "es-AR",
  };

  return (
    <main className="min-h-screen bg-white">
      <JsonLd data={pageJsonLd} />
      <header className="border-b border-slate-100 bg-slate-50 py-10 md:py-14">
        <div className="mx-auto max-w-3xl px-4">
          <Breadcrumbs
            crumbs={[
              { name: "Inicio", path: "/" },
              { name: "Índices de neumáticos", path: "/blog/indice-de-carga-y-velocidad" },
              { name: info.code, path },
            ]}
          />
          <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-black uppercase tracking-widest text-orange-700">
            Guía rápida
          </span>
          <h1 className="mt-3 text-3xl font-black leading-tight text-navy-900 md:text-4xl">
            ¿Qué significa {info.code} en una cubierta?
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Es la combinación de índice de carga {info.loadIndex} e índice de velocidad {info.speedRating} que aparece después de la medida en el flanco.
          </p>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-12 [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-navy-900 [&_p]:mb-5 [&_p]:text-lg [&_p]:leading-relaxed [&_p]:text-slate-600 [&_strong]:text-navy-900">
        <div className="grid gap-4 sm:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 p-6">
            <p className="!mb-1 text-sm font-black uppercase tracking-widest text-slate-500">Índice {info.loadIndex}</p>
            <p className="!mb-0 text-3xl font-black text-navy-900">{info.loadKg} kg</p>
            <p className="!mb-0 mt-1 text-sm text-slate-600">carga máxima por neumático</p>
          </section>
          <section className="rounded-2xl border border-slate-200 p-6">
            <p className="!mb-1 text-sm font-black uppercase tracking-widest text-slate-500">Código {info.speedRating}</p>
            <p className="!mb-0 text-3xl font-black text-navy-900">{info.speedKmh} km/h</p>
            <p className="!mb-0 mt-1 text-sm text-slate-600">velocidad máxima homologada</p>
          </section>
        </div>

        <p className="mt-6 rounded-2xl bg-orange-50 p-5 !text-navy-900">
          <strong>Respuesta rápida:</strong> {info.code} significa que cada neumático soporta hasta <strong>{info.loadKg} kg</strong> ({(info.loadKg * 4).toLocaleString("es-AR")} kg el juego de cuatro) y está homologado hasta <strong>{info.speedKmh} km/h</strong>.
        </p>

        <h2>Cómo se lee {info.code}</h2>
        <p>
          En una inscripción como <strong>195/65 R15 {info.code}</strong>, los primeros números describen la medida. El <strong>{info.loadIndex}</strong> significa que cada cubierta admite hasta <strong>{info.loadKg} kg</strong>; la <strong>{info.speedRating}</strong> señala una velocidad máxima de <strong>{info.speedKmh} km/h</strong> en condiciones de homologación.
        </p>
        <p>
          No multipliques ese valor para elegir una cubierta sin mirar la ficha del auto: el fabricante ya define la combinación correcta considerando peso, distribución de carga y comportamiento. Como regla, nunca bajes ninguno de los dos índices respecto del original; uno superior puede ser válido si la medida y el resto de las especificaciones corresponden.
        </p>

        <h2>¿Lo buscaste como «{info.code} en la llanta»?</h2>
        <p>
          Mucha gente pregunta por el {info.code} «de la llanta», pero ese código no está en el rin (la llanta de aleación o de chapa). Está estampado en el costado de la cubierta, justo después de la medida, y es el mismo número que figura en la ficha de cualquier neumático.
        </p>

        <h2>Dónde comprobar el valor correcto</h2>
        <p>
          Revisá la etiqueta del marco de la puerta del conductor o el manual. Ahí figura la medida completa y los índices requeridos. El código de los neumáticos que tiene hoy el vehículo no siempre es una referencia confiable porque pudieron haberlos cambiado antes.
        </p>

        <h2>Otros códigos parecidos a {info.code}</h2>
        <p>
          {menosVelocidad.length > 0 && (
            <>Con la misma carga ({info.loadIndex}) pero menos velocidad hay {menosVelocidad.map((c) => c.code).join(", ")}: no son un reemplazo directo de {info.code}. </>
          )}
          {masVelocidad.length > 0 && (
            <>Con la misma carga y más velocidad: {masVelocidad.map((c) => c.code).join(", ")}, que sí cumplen lo que pide {info.code}. </>
          )}
          Con la misma letra {info.speedRating} y otra carga están {mismaVelocidad.map((c) => c.code).join(", ")}.
        </p>
        <ul className="!mb-6 flex flex-wrap gap-2 !pl-0">
          {[...mismaCarga, ...mismaVelocidad].map((c) => (
            <li key={c.code} className="list-none">
              <Link href={`/indice-carga-velocidad/${c.code.toLowerCase()}`} className="inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm font-black text-navy-900 no-underline hover:border-orange-400">
                {c.code} · {c.loadKg} kg · {c.speedKmh} km/h
              </Link>
            </li>
          ))}
        </ul>

        <CatalogWidget
          loadIndex={info.loadIndex}
          speedRating={info.speedRating}
          title={`Neumáticos ${info.code} con stock`}
        />

        <FaqSection faqs={faqs} />

        <aside className="mt-12 rounded-2xl bg-navy-950 p-7 text-white">
          <h2 className="!mt-0 !text-white">¿Necesitás elegir la medida correcta?</h2>
          <p className="!text-slate-300">Compará cubiertas por medida y verificá el índice de carga y velocidad en cada ficha.</p>
          <Link href="/neumaticos" className="inline-flex rounded-xl bg-orange-500 px-5 py-3 font-black text-white no-underline hover:bg-orange-600">
            Buscar neumáticos
          </Link>
        </aside>

        <p className="mt-10 text-base">
          Para ver todas las equivalencias de carga y velocidad, consultá la <Link href="/blog/indice-de-carga-y-velocidad">tabla completa de índices de neumáticos</Link>.
        </p>
      </article>
    </main>
  );
}
