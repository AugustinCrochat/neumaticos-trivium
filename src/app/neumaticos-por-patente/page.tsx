import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/ui/Link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { PlateSearch } from "@/components/ui/PlateSearch";
import { SizeOrVehicleSearch } from "@/components/ui/SizeOrVehicleSearch";
import { canonical, absoluteUrl, SITE_NAME, ORGANIZATION_ID, type Faq } from "@/lib/seo";
import { poolShare } from "@/lib/share-image";
import { MEDIDAS_PRIORITARIAS, formatSize, sizeSlug } from "@/lib/tire-sizes";

export const dynamic = "force-static";

const PATH = "/neumaticos-por-patente";
const TITLE = "Medida de neumático por patente: buscá la tuya en segundos";
const DESCRIPTION =
  "Ingresá la patente de tu auto o camioneta y te mostramos la medida de neumático que le corresponde, con los modelos disponibles, precio y stock. Gratis, sin registro y en un solo paso.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: canonical(PATH),
  openGraph: { title: `Medida de neumático por patente — ${SITE_NAME}`, description: DESCRIPTION, url: PATH, ...poolShare("buscador").openGraph },
  twitter: poolShare("buscador").twitter,
};

const PASOS = [
  {
    titulo: "Escribí la patente",
    detalle: "Con formato Mercosur (AB 123 CD) o anterior (ABC 123). Se completa sola, sin apretar nada.",
  },
  {
    titulo: "Confirmá tu auto",
    detalle: "Te mostramos marca, modelo y año. Si el auto tiene más de una versión, elegís la tuya.",
  },
  {
    titulo: "Mirá las medidas y comprá",
    detalle: "Ves la medida original y los neumáticos que hay hoy en el local, con precio y stock.",
  },
];

const FAQS: Faq[] = [
  {
    question: "¿Cómo averiguo la medida de mi neumático con la patente?",
    answer:
      "Escribí la patente en el buscador de esta página. Identificamos la marca, el modelo y el año del vehículo y te mostramos la medida de neumático de esa generación. Si tu versión tiene más de una medida, te ofrecemos elegir la que lleva tu auto.",
  },
  {
    question: "¿Es confiable la medida que muestra?",
    answer:
      "Es la medida de fábrica del modelo y del año de tu auto, y sirve como punto de partida. Siempre conviene confirmarla con el código que figura en el flanco del neumático que tenés puesto (por ejemplo 205/55 R16) o con la etiqueta del marco de la puerta del conductor, sobre todo si el auto tiene llantas o neumáticos cambiados.",
  },
  {
    question: "¿Qué patentes funcionan?",
    answer:
      "Autos y camionetas con patente Mercosur (dos letras, tres números y dos letras) o del formato anterior (tres letras y tres números). Las motos todavía no están incluidas.",
  },
  {
    question: "¿Qué pasa si no encuentra mi patente?",
    answer:
      "La búsqueda pasa a elegir la marca, el modelo y el año a mano, y de ahí obtenés la misma medida. No perdés nada: seguís en el mismo lugar.",
  },
  {
    question: "¿Guardan mis datos?",
    answer:
      "Para dar la respuesta usamos solo la marca, el modelo y el año del vehículo. No te pedimos nombre, teléfono ni ningún dato personal, y no hace falta registrarse. Las consultas tienen un límite por persona para evitar abusos.",
  },
  {
    question: "¿Cuánto cuesta consultar?",
    answer: "Nada. Es gratis y no te obliga a comprar. Si querés comprar, el precio publicado es el mismo que en el local.",
  },
  {
    question: "¿Puedo buscar por medida si ya la sé?",
    answer:
      "Sí. Usá el buscador por medida (ancho, perfil y rodado en tres pasos) o escribí la medida directamente. Si todavía no sabés dónde verla, mirá la guía para leer la medida en el flanco.",
  },
  {
    question: "¿Colocan los neumáticos que compro?",
    answer:
      "Sí, con taller propio. La colocación y el cambio de válvulas no se cobran si comprás las cubiertas en el local; el balanceo y la alineación se cotizan aparte, con un combo más barato que por separado.",
  },
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${absoluteUrl(PATH)}#herramienta`,
        name: "Buscador de neumáticos por patente",
        url: absoluteUrl(PATH),
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        inLanguage: "es-AR",
        offers: { "@type": "Offer", price: "0", priceCurrency: "ARS" },
        provider: { "@id": ORGANIZATION_ID },
        description: DESCRIPTION,
      },
      {
        "@type": "HowTo",
        "@id": `${absoluteUrl(PATH)}#como`,
        name: "Cómo saber la medida del neumático con la patente",
        step: PASOS.map((p, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: p.titulo,
          text: p.detalle,
        })),
      },
    ],
  };

  return (
    <div className="bg-slate-50">
      <JsonLd data={jsonLd} />

      <header className="relative overflow-hidden bg-black">
        <Image
          src="/images/local/taxi-entrando-al-local-neumaticos-trivium-cordoba.webp"
          alt=""
          fill
          priority
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-[#ff1e00]" />
        <div className="relative mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-10 md:py-14">
          <Breadcrumbs
            dark
            crumbs={[
              { name: "Inicio", path: "/" },
              { name: "Neumáticos por patente", path: PATH },
            ]}
          />
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <h1 className="font-display text-4xl font-bold uppercase leading-[0.98] tracking-wide text-white md:text-6xl">
                La medida de tu neumático, <span className="text-[#ff1e00]">con la patente</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-200 md:text-lg">
                Escribí la patente de tu auto o camioneta y te mostramos la medida que le corresponde, con los
                neumáticos disponibles, precio y stock. Gratis y sin registro.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-white">
                {["Gratis", "Sin registro", "Auto y camioneta", "Stock real"].map((t) => (
                  <li key={t} className="rounded-full bg-white/15 px-3 py-1.5 backdrop-blur">{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-2xl md:p-6">
              <PlateSearch autoFocus />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-10 md:py-14">
        <section className="mb-14">
          <h2 className="text-2xl font-black text-navy-900 md:text-3xl">Cómo funciona</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {PASOS.map((p, i) => (
              <li key={p.titulo} className="rounded-2xl border border-slate-200 bg-white p-6">
                <span className="font-display flex h-10 w-10 items-center justify-center rounded-full bg-[#ff1e00] text-xl font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-lg font-black text-navy-900">{p.titulo}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{p.detalle}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-14 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-black text-navy-900">¿Por qué conviene confirmar la medida?</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              La patente nos dice qué auto es, y de ahí sale la medida de fábrica de ese modelo y año. Si tu auto tiene
              llantas distintas o ya le cambiaron la medida, lo que manda es lo que figura en el flanco del neumático
              puesto. En segundos podés compararlo.
            </p>
            <Link href="/blog/como-leer-medida-neumatico" className="mt-3 inline-block text-sm font-black text-orange-600 underline underline-offset-2">
              Cómo leer la medida en el flanco →
            </Link>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-black text-navy-900">¿Ya sabés tu medida?</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Buscala directo por ancho, perfil y rodado, o por marca y modelo de tu auto.
            </p>
            <div className="mt-4">
              <SizeOrVehicleSearch compact hideLearnLink />
            </div>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl font-black text-navy-900 md:text-3xl">Medidas más pedidas</h2>
          <p className="mt-2 text-slate-600">Si ya sabés cuál es, entrá directo y compará marcas con precio y stock.</p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {MEDIDAS_PRIORITARIAS.slice(0, 12).map((size) => (
              <Link
                key={sizeSlug(size)}
                href={`/neumaticos/${sizeSlug(size)}`}
                className="rounded-xl border border-slate-200 bg-white p-4 text-center transition-colors hover:border-orange-400"
              >
                <span className="block font-black text-navy-900">{formatSize(size)}</span>
                <span className="mt-1 block text-xs font-bold text-slate-500">Ver precios</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-14 grid gap-4 md:grid-cols-3">
          {[
            ["/vehiculos", "Medida por marca y modelo", "Más de 150 modelos con la medida original de cada versión."],
            ["/catalogo", "Todo el catálogo", "Todas las marcas y medidas con precio y stock."],
            ["/servicios", "Colocación y alineado", "Taller propio: colocación sin cargo y combo de alineado y balanceo."],
          ].map(([href, t, d]) => (
            <Link key={href} href={href} className="rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-orange-400">
              <span className="block font-black text-navy-900">{t}</span>
              <span className="mt-1 block text-sm text-slate-500">{d}</span>
            </Link>
          ))}
        </section>

        <FaqSection faqs={FAQS} title="Preguntas frecuentes sobre la búsqueda por patente" />
      </div>
    </div>
  );
}
