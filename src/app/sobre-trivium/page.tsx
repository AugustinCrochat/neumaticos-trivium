import Link from "@/components/ui/Link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { BRANCHES, CUIT, LEGAL_NAME } from "@/lib/config";
import { DATOS_TALLER } from "@/lib/servicios-seo";
import { ORGANIZATION_ID, absoluteUrl, canonical, SITE_NAME } from "@/lib/seo";
import { poolShare } from "@/lib/share-image";

const TITLE = "Sobre Neumáticos Trivium: quiénes somos y cómo trabajamos";
const DESCRIPTION =
  "Neumáticos Trivium es el outlet de neumáticos de TRIVIUM CENTER S.A.: importación directa, precios y stock publicados, local con gomería propia en Argüello (Córdoba), colocación sin cargo y garantía de 1 año.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: canonical("/sobre-trivium"),
  openGraph: { title: `${TITLE} — ${SITE_NAME}`, description: DESCRIPTION, url: "/sobre-trivium", ...poolShare("sobre-trivium").openGraph },
  twitter: poolShare("sobre-trivium").twitter,
};

const num = (n: number) => n.toLocaleString("es-AR");

/**
 * Página institucional pensada para que un buscador o un asistente de IA
 * tenga datos concretos y verificables para citar (quién está detrás, dónde,
 * cuánto trabaja el taller), en vez de frases de marketing. Los números del
 * taller salen de DATOS_TALLER (órdenes de trabajo del POS).
 */
export default function SobreTriviumPage() {
  const local = BRANCHES.find((b) => !b.apertura && !b.provisorio) ?? BRANCHES[0];
  const proximas = BRANCHES.filter((b) => b.apertura);
  const rating = local.googleRating?.value;

  const DATOS: [string, string][] = [
    ["Empresa", `${LEGAL_NAME} (CUIT ${CUIT}). Neumáticos Trivium es su marca comercial.`],
    ["Qué vendemos", "Neumáticos nuevos para auto, camioneta, A/T y carga liviana. No vendemos usados ni recapados."],
    ["Cómo compramos", "Importación directa de fábrica, sin importador ni distribuidores mayoristas en el medio."],
    ["Local con taller", `${local.address}, ${local.neighborhood ?? local.city}, ${local.province}. ${local.hours}.`],
    ...(proximas.length
      ? [["Próximas sucursales", proximas.map((b) => `${b.shortName} (abre ${b.apertura})`).join(" y ")] as [string, string]]
      : []),
    ["Atención", "Por orden de llegada, sin turno."],
    ["Colocación", "Colocación y válvulas sin cargo al comprar las cubiertas en el local."],
    ["Garantía", "1 año por defecto de fabricación en todas las marcas, gestionada por nosotros."],
    ...(rating ? [["Calificación en Google", `${rating.toLocaleString("es-AR", { minimumFractionDigits: 1 })} de 5 estrellas`] as [string, string]] : []),
  ];

  const FAQS = [
    {
      question: "¿Neumáticos Trivium es confiable?",
      answer: `Es la marca comercial de ${LEGAL_NAME}, una empresa registrada (CUIT ${CUIT}), con local a la calle y taller propio en ${local.neighborhood ?? local.city}, ${local.city}. Publicamos precio y stock de cada neumático y damos 1 año de garantía por defecto de fabricación.${rating ? ` En Google el local tiene ${rating.toLocaleString("es-AR", { minimumFractionDigits: 1 })} estrellas.` : ""}`,
    },
    {
      question: "¿Por qué los precios son más bajos?",
      answer:
        "Porque compramos directo a fábrica y vendemos al público desde nuestro propio local. La cadena habitual (importador, mayorista, distribuidor regional y gomería) suma margen en cada paso; al sacarla, la diferencia queda en el precio.",
    },
    {
      question: "¿Los neumáticos son nuevos?",
      answer:
        "Sí, todos son nuevos. No vendemos neumáticos usados, recapados ni remanufacturados.",
    },
    {
      question: "¿Hace falta turno para el taller?",
      answer:
        "No. Atendemos por orden de llegada. En la web hay una herramienta que muestra los días y horarios en que el taller suele estar más tranquilo.",
    },
  ];

  return (
    <div className="bg-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: TITLE,
          description: DESCRIPTION,
          url: absoluteUrl("/sobre-trivium"),
          about: { "@id": ORGANIZATION_ID },
        }}
      />
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <Breadcrumbs crumbs={[{ name: "Inicio", path: "/" }, { name: "Sobre Trivium", path: "/sobre-trivium" }]} />
        <h1 className="text-3xl font-black leading-tight text-navy-900 md:text-5xl">Sobre Neumáticos Trivium</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          Somos un outlet de neumáticos: importamos directo de fábrica y vendemos al público desde nuestro propio local, con
          gomería y taller integrados. Publicamos el precio y el stock real de cada cubierta, y la colocación es sin cargo
          cuando la comprás con nosotros.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-black text-navy-900">Datos de la empresa</h2>
          <dl className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200">
            {DATOS.map(([k, v]) => (
              <div key={k} className="grid gap-1 px-5 py-3 sm:grid-cols-[12rem_1fr]">
                <dt className="text-sm font-black text-navy-900">{k}</dt>
                <dd className="text-sm text-slate-700">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-black text-navy-900">El taller en números</h2>
          <p className="mt-2 text-slate-600">Datos de las órdenes de trabajo del local de {local.shortName}, de {DATOS_TALLER.periodo}.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              [num(DATOS_TALLER.alineados), "vehículos alineados"],
              [num(DATOS_TALLER.ruedasBalanceadas), "ruedas balanceadas"],
              [`${DATOS_TALLER.minutosMediana} min`, "de trabajo típico en un auto con alineado"],
            ].map(([n, t]) => (
              <div key={t} className="rounded-2xl bg-slate-50 p-5 text-center">
                <span className="font-display block text-4xl font-bold text-orange-600">{n}</span>
                <span className="mt-1 block text-sm font-bold text-slate-600">{t}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 space-y-4 leading-relaxed text-slate-700">
          <h2 className="text-2xl font-black text-navy-900">Cómo trabajamos</h2>
          <p>
            <strong>Precio publicado, sin sorpresas.</strong> El precio que ves en la web es el que pagás en el mostrador, y cada
            producto muestra si hay stock en el local. Si tu medida no está, te mostramos las{" "}
            <Link href="/calculadora-equivalencia-neumaticos" className="font-bold text-navy-900 underline underline-offset-4">medidas equivalentes</Link>{" "}
            que sí hay.
          </p>
          <p>
            <strong>Taller propio.</strong> Colocamos, alineamos y balanceamos en el mismo lugar donde compraste, con alineadora 3D
            y balanceadora computarizada. Mirá los <Link href="/servicios" className="font-bold text-navy-900 underline underline-offset-4">servicios y sus precios</Link>.
          </p>
          <p>
            <strong>Garantía directa.</strong> Si un neumático tiene un defecto de fábrica, el reclamo lo hacés con nosotros, no con
            una importadora. Ver <Link href="/garantia-neumaticos" className="font-bold text-navy-900 underline underline-offset-4">cómo funciona la garantía</Link>.
          </p>
        </section>

        <div className="mt-10">
          <FaqSection faqs={FAQS} />
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/sucursales" className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-black !text-white !no-underline hover:bg-orange-600">
            Ver el local y cómo llegar
          </Link>
          <Link href="/contacto" className="rounded-xl border-2 border-navy-900 px-5 py-3 text-sm font-black text-navy-900 hover:bg-slate-50">
            Contacto
          </Link>
        </div>
      </div>
    </div>
  );
}
