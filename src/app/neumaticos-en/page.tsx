import type { Metadata } from "next";
import Link from "@/components/ui/Link";
import { BRANCHES, type Branch } from "@/lib/config";
import { ZonasAgrupadas } from "@/components/seo/ZonasAgrupadas";
import { LOCALIDADES, localidadesAgrupadas } from "@/lib/localidades";
import { SITE_URL } from "@/lib/config";
import { absoluteUrl, canonical, ORGANIZATION_ID, SITE_NAME, type Faq } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { DirectionsIcon } from "@/components/ui/DirectionsIcon";
import { poolShare } from "@/lib/share-image";

const PATH = "/neumaticos-en";
const TITLE = "Neumáticos baratos en Córdoba y Buenos Aires: zonas donde atendemos";
const DESCRIPTION =
  "Neumáticos nuevos a precio de outlet con local y gomería propia en Córdoba (Argüello, Villa Allende, Saldán, La Calera y Sierras Chicas) y sucursales por abrir en Buenos Aires (San Justo, Lomas del Mirador y zona oeste). Elegí tu zona.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: canonical(PATH),
  openGraph: { title: `Zonas donde atendemos — ${SITE_NAME}`, description: DESCRIPTION, url: PATH, ...poolShare("zonas").openGraph },
  twitter: poolShare("zonas").twitter,
};

const FAQS: Faq[] = [
  {
    question: "¿En qué zonas venden neumáticos?",
    answer:
      "En Córdoba tenemos local a la calle con gomería propia en Argüello (Av. Donato Álvarez 7971), y atendemos Córdoba Capital, Villa Allende, Saldán, La Calera, Mendiolaza, Unquillo, Río Ceballos y Sierras Chicas. En Buenos Aires estamos abriendo sucursales en San Justo y Lomas del Mirador para La Matanza, la zona oeste y el límite con Capital Federal.",
  },
  {
    question: "¿Las sucursales de Buenos Aires ya abrieron?",
    answer:
      "Todavía no: Lomas del Mirador abre en diciembre y San Justo en enero. Mientras tanto podés ver precios y medidas en la web, y consultarnos por WhatsApp. El local que hoy atiende al público es el de Argüello, en Córdoba.",
  },
  {
    question: "¿Cuánto cuesta la colocación?",
    answer:
      "Si comprás los neumáticos en el local, el armado y el cambio de válvulas no se cobran. La alineación y el balanceo se cotizan aparte y se hacen en el mismo lugar.",
  },
  {
    question: "¿Hace falta turno?",
    answer:
      "No. En Argüello atendemos por orden de llegada, de lunes a sábados. Si querés evitar espera, escribinos por WhatsApp antes de salir y te decimos cómo está el taller y si tu medida está en stock.",
  },
  {
    question: "¿Hacen envíos a otras ciudades?",
    answer:
      "Sí, enviamos a todo el país. El envío es gratis desde cierto monto de compra y tiene un costo fijo por debajo; si podés acercarte al local conviene más, porque el retiro es sin cargo y la colocación va incluida.",
  },
  {
    question: "¿Los neumáticos tienen garantía?",
    answer:
      "Sí. Todos los neumáticos nuevos tienen 1 año de garantía por defecto de fabricación, que se gestiona directo en el local. Más detalle en la página de garantía.",
  },
];

const link = "font-bold text-navy-700 underline underline-offset-2 hover:text-orange-600";

function estado(b: Branch) {
  return b.apertura ? `Abrimos ${b.apertura}` : `Abierto: ${b.hours}`;
}

export default function ZonasPage() {
  const provincias = ["Córdoba", "Buenos Aires"].map((province) => {
    const sucursales = BRANCHES.filter((b) => b.province === province);
    const total = LOCALIDADES.filter((l) => l.province === province).length;
    return { province, sucursales, total };
  });
  const principal = BRANCHES.find((b) => !b.apertura && !b.provisorio) ?? BRANCHES[0];
  const crumbs = [{ name: "Inicio", path: "/" }, { name: "Dónde compramos", path: PATH }];
  const waHref = `https://wa.me/${principal.whatsapp}?text=${encodeURIComponent("Hola, quería consultar por neumáticos")}`;
  const ciudades = localidadesAgrupadas();

  return (
    <div className="bg-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${SITE_URL}${PATH}#webpage`,
              name: TITLE,
              description: DESCRIPTION,
              url: absoluteUrl(PATH),
              inLanguage: "es-AR",
              dateModified: "2026-11-03",
              isPartOf: { "@id": `${SITE_URL}/#website` },
              about: { "@id": ORGANIZATION_ID },
              speakable: { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable]"] },
            },
            {
              "@type": "ItemList",
              name: "Zonas donde atiende Neumáticos Trivium",
              numberOfItems: ciudades.length,
              itemListElement: ciudades.map(({ ciudad }, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: `Neumáticos en ${ciudad.name}`,
                url: absoluteUrl(`${PATH}/${ciudad.slug}`),
              })),
            },
          ],
        }}
      />

      {/* HERO */}
      <header className="relative overflow-hidden bg-navy-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/local/fachada-local-neumaticos-trivium-cordoba.webp"
          alt="Fachada del local de Neumáticos Trivium en Argüello, Córdoba"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40 max-md:from-black/90 max-md:via-black/80 max-md:to-black/70" />
        <div className="relative mx-auto max-w-5xl px-4 py-10 md:py-20">
          <Breadcrumbs crumbs={crumbs} dark />
          <span className="inline-block rounded-md bg-[#ff1e00] px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
            Córdoba y Buenos Aires
          </span>
          <h1 className="font-display mt-4 max-w-3xl text-4xl font-bold uppercase leading-[0.95] tracking-wide text-white md:text-7xl">
            Neumáticos baratos
            <br />
            <span className="text-[#ff1e00]">cerca tuyo.</span>
          </h1>
          <p data-speakable className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200 md:text-xl">
            Neumáticos nuevos de importación directa, con precio y stock publicados. Tenemos local con gomería propia en{" "}
            <strong className="text-white">{principal.neighborhood ?? principal.city}, Córdoba</strong>, y estamos abriendo
            sucursales en <strong className="text-white">Buenos Aires</strong> (Lomas del Mirador y San Justo). Elegí tu zona.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <WhatsAppLink
              href={waHref}
              className="inline-flex items-center justify-center rounded-xl bg-[#25D366] px-6 py-4 text-base font-black text-white shadow-lg hover:bg-[#1ebe57]"
            >
              Consultar por WhatsApp
            </WhatsAppLink>
            <Link href="/catalogo" className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-4 text-base font-black text-navy-900 hover:bg-slate-100">
              Ver precios y stock
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-slate-50">
        <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-px bg-slate-200 md:grid-cols-4">
          {[
            [String(BRANCHES.length), "locales: 1 abierto y " + (BRANCHES.length - 1) + " por abrir"],
            [String(LOCALIDADES.length), "zonas con página propia"],
            ["$0", "colocación al comprar en el local"],
            ["1 año", "de garantía en todas las marcas"],
          ].map(([n, t]) => (
            <div key={t} className="bg-slate-50 px-4 py-6 text-center">
              <dt className="font-display text-3xl font-bold text-orange-600 md:text-4xl">{n}</dt>
              <dd className="mt-1 text-sm font-bold text-slate-600">{t}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        {/* POR PROVINCIA */}
        {provincias.map(({ province, sucursales, total }) => (
          <section key={province} className="mb-14" id={province === "Córdoba" ? "cordoba" : "buenos-aires"}>
            <h2 className="text-2xl font-black text-navy-900 md:text-4xl">Neumáticos en {province}</h2>
            <p className="mt-2 text-slate-600">
              {total} zonas con página propia · {sucursales.map((b) => b.shortName).join(" y ")}
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {sucursales.map((b) => (
                <article key={b.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${
                      b.apertura ? "bg-navy-100 text-navy-800" : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {estado(b)}
                  </span>
                  <h3 className="mt-3 text-xl font-black text-navy-900">{b.name}</h3>
                  <p className="mt-1 text-slate-600">
                    {b.address}, {b.neighborhood ?? b.city}
                    {b.postalCode ? ` (${b.postalCode})` : ""}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/sucursales/${b.id}`}
                      className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-black px-4 text-sm font-black text-white"
                    >
                      <DirectionsIcon className="h-5 w-5" />
                      Ver local
                    </Link>
                    <WhatsAppLink
                      href={`https://wa.me/${b.whatsapp}?text=${encodeURIComponent(`Hola, quería consultar por neumáticos en ${b.shortName}`)}`}
                      className="inline-flex min-h-11 items-center rounded-xl bg-[#25D366] px-4 text-sm font-black text-white"
                    >
                      WhatsApp
                    </WhatsAppLink>
                  </div>
                </article>
              ))}
            </div>

            <h3 className="mb-3 mt-8 text-lg font-black text-navy-900">Elegí tu ciudad o barrio</h3>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <ZonasAgrupadas variant="light" provincia={province} />
            </div>
          </section>
        ))}

        {/* RESUMEN DE CABECERAS (texto propio de cada una) */}
        <section className="mb-14">
          <h2 className="text-2xl font-black text-navy-900 md:text-4xl">Las zonas principales</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {LOCALIDADES.filter((l) => l.esCabecera).map((l) => (
              <Link
                key={l.slug}
                href={`${PATH}/${l.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-orange-400"
              >
                <h3 className="text-xl font-black text-navy-900 group-hover:text-orange-600">Neumáticos en {l.name}</h3>
                <p className="mt-1 text-sm font-bold text-slate-400">{l.province}</p>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">{l.intro}</p>
                <span className="mt-3 inline-block text-sm font-black text-orange-600">Ver la zona →</span>
              </Link>
            ))}
          </div>
        </section>

        <FaqSection faqs={FAQS} title="Preguntas frecuentes sobre dónde comprar" />

        <p className="mt-8 text-slate-600">
          ¿Querés saber qué cubre nuestra <Link className={link} href="/garantia-neumaticos">garantía de 1 año</Link>, o cómo es el{" "}
          <Link className={link} href="/servicios">servicio de gomería</Link>?
        </p>

        <section className="mt-12 rounded-3xl bg-navy-900 px-6 py-10 text-center md:px-12 md:py-14">
          <h2 className="font-display text-3xl font-bold uppercase leading-tight tracking-wide text-white md:text-5xl">
            ¿Tu zona no está? <span className="text-[#ff1e00]">Igual te enviamos.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300 md:text-lg">
            Buscá tu medida, mirá precio y stock reales y consultanos por WhatsApp antes de venir. Enviamos a todo el país.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/buscar" className="rounded-xl bg-[#ff1e00] px-6 py-4 text-base font-black text-white hover:bg-orange-600">
              Buscar mi medida
            </Link>
            <WhatsAppLink href={waHref} className="rounded-xl bg-[#25D366] px-6 py-4 text-base font-black text-white hover:bg-[#1ebe57]">
              WhatsApp
            </WhatsAppLink>
          </div>
        </section>
      </div>
    </div>
  );
}
