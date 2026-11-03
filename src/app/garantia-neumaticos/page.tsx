import Link from "@/components/ui/Link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { GoogleRatingBadge } from "@/components/ui/GoogleRatingBadge";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { BRANCHES, CUIT, LEGAL_NAME } from "@/lib/config";
import { SITE_URL } from "@/lib/config";
import { ORGANIZATION_ID, absoluteUrl, branchNodeId, canonical, SITE_NAME } from "@/lib/seo";
import { poolShare } from "@/lib/share-image";

const PATH = "/garantia-neumaticos";
const TITLE = "Garantía de neumáticos: 1 año en todas las marcas";
const DESCRIPTION =
  "Todos los neumáticos nuevos de Neumáticos Trivium (Córdoba) tienen 1 año de garantía por defecto de fabricación, gestionada directo en el local. Qué cubre, qué no, qué llevar y cómo se reclama paso a paso.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: canonical(PATH),
  openGraph: { title: `${TITLE} — ${SITE_NAME}`, description: DESCRIPTION, url: PATH, ...poolShare("garantia").openGraph },
  twitter: poolShare("garantia").twitter,
};

const FAQS = [
  {
    question: "¿Cuánto dura la garantía de los neumáticos de Trivium?",
    answer:
      "1 año, contado desde la fecha de compra, por defecto de fabricación. Aplica a todos los neumáticos nuevos que vendemos, de cualquier marca y medida, sin costo adicional.",
  },
  {
    question: "¿Todos los neumáticos tienen garantía?",
    answer:
      "Sí. Todos los neumáticos nuevos que vendemos, de cualquier marca, tienen 1 año de garantía por defecto de fabricación. No hay marcas ni medidas excluidas, y no se cobra aparte.",
  },
  {
    question: "¿Quién gestiona la garantía?",
    answer:
      "Nosotros, directamente en el local. No tenés que ir a una importadora ni a un servicio oficial: llevás el neumático y la factura de compra y lo gestionamos con el fabricante.",
  },
  {
    question: "¿Qué cubre la garantía?",
    answer:
      "Fallas de fabricación del neumático desde la fecha de compra. Si un neumático sale con un defecto de fábrica, coordinamos el cambio o el reintegro según corresponda con el fabricante.",
  },
  {
    question: "¿Qué no cubre?",
    answer:
      "El desgaste normal por uso, las pinchaduras, los cortes y los daños por golpes o baches, el uso indebido, y el desgaste causado por alineación o balanceo deficientes o por presión incorrecta.",
  },
  {
    question: "¿La garantía cubre una pinchadura?",
    answer:
      "No. Una pinchadura la causa un objeto externo (clavo, vidrio, tornillo), no un defecto de fabricación. En la gomería del local la reparamos aparte, y te explicamos si el neumático todavía es reparable.",
  },
  {
    question: "¿Qué necesito para reclamar?",
    answer:
      "La factura de compra y el neumático disponible para inspección. Se gestiona en el local; si querés, antes escribinos por WhatsApp contándonos el problema.",
  },
  {
    question: "¿Tengo que ir a una importadora o a un servicio oficial?",
    answer:
      "No. El reclamo se hace en nuestro local de Argüello, en Córdoba: nosotros inspeccionamos el neumático y lo gestionamos con el fabricante. Sin intermediarios.",
  },
  {
    question: "¿Es lo mismo que el derecho de arrepentimiento?",
    answer:
      "No. La garantía es por defectos de fabricación durante 1 año. El derecho de arrepentimiento y los cambios (30 días, sin uso y con embalaje original) están en la política de devoluciones.",
  },
];

const CUBRE = [
  "Defectos de fabricación del neumático: separación de capas o de la banda de rodamiento.",
  "Burbujas, deformaciones o ruidos por fallas de fábrica detectadas desde la compra.",
  "Cualquier falla de origen que aparezca dentro del año, en todas las marcas y medidas.",
];

const NO_CUBRE = [
  "Desgaste normal por uso y kilómetros recorridos.",
  "Pinchaduras, cortes y daños por golpes o baches.",
  "Uso indebido o sobrecarga del vehículo.",
  "Desgaste por alineación o balanceo deficientes.",
  "Desgaste o daños por presión de inflado incorrecta.",
];

const PASOS = [
  {
    titulo: "Juntá la factura",
    detalle: "Es lo que acredita la fecha de compra y que el neumático es nuestro. Con eso alcanza para empezar.",
  },
  {
    titulo: "Escribinos o pasá por el local",
    detalle: "Contanos por WhatsApp qué le pasa al neumático, o traelo directamente. Lo inspeccionamos en el momento.",
  },
  {
    titulo: "Lo gestionamos con el fabricante",
    detalle: "Si se confirma un defecto de fabricación, coordinamos el cambio o el reintegro según corresponda. Vos no hacés trámites con terceros.",
  },
];

const COMPARACION: { aspecto: string; garantia: string; arrepentimiento: string }[] = [
  { aspecto: "Qué protege", garantia: "Defectos de fabricación", arrepentimiento: "Cambiar de opinión o pedir otro producto" },
  { aspecto: "Plazo", garantia: "1 año desde la compra", arrepentimiento: "30 días desde que recibís el producto" },
  { aspecto: "Estado del neumático", garantia: "Con el uso normal; se inspecciona", arrepentimiento: "Sin uso y con embalaje original" },
  { aspecto: "Qué necesitás", garantia: "Factura y el neumático", arrepentimiento: "Factura y el producto en su embalaje" },
  { aspecto: "Dónde se gestiona", garantia: "En el local, con nosotros", arrepentimiento: "En el local o por correo" },
];

const link = "font-bold text-navy-700 underline underline-offset-2 hover:text-orange-600";

export default function GarantiaPage() {
  const branch = BRANCHES.find((b) => !b.apertura && !b.provisorio) ?? BRANCHES[0];
  const waHref = `https://wa.me/${branch.whatsapp}?text=${encodeURIComponent("Hola, quiero consultar por la garantía de un neumático")}`;
  const crumbs = [{ name: "Inicio", path: "/" }, { name: "Garantía de neumáticos", path: PATH }];

  return (
    <div className="bg-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": `${SITE_URL}${PATH}#webpage`,
              name: TITLE,
              description: DESCRIPTION,
              url: absoluteUrl(PATH),
              inLanguage: "es-AR",
              dateModified: "2026-11-03",
              isPartOf: { "@id": `${SITE_URL}/#website` },
              about: { "@id": `${SITE_URL}${PATH}#garantia` },
              mainEntity: { "@id": `${SITE_URL}${PATH}#garantia` },
              speakable: { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable]"] },
            },
            {
              "@type": "Service",
              "@id": `${SITE_URL}${PATH}#garantia`,
              name: "Garantía de 1 año en neumáticos nuevos",
              serviceType: "Garantía por defecto de fabricación",
              description:
                "Todos los neumáticos nuevos vendidos por Neumáticos Trivium tienen 1 año de garantía por defecto de fabricación, gestionada en el local con el fabricante.",
              provider: [{ "@id": ORGANIZATION_ID }, { "@id": branchNodeId(branch) }],
              areaServed: { "@type": "City", name: branch.city },
              termsOfService: absoluteUrl("/politica-de-devoluciones"),
            },
            {
              "@type": "WarrantyPromise",
              "@id": `${SITE_URL}${PATH}#promesa`,
              durationOfWarranty: { "@type": "QuantitativeValue", value: 1, unitCode: "ANN" },
              warrantyScope: "https://schema.org/LimitedWarranty",
            },
            {
              "@type": "HowTo",
              "@id": `${SITE_URL}${PATH}#como-reclamar`,
              name: "Cómo reclamar la garantía de un neumático en Trivium",
              step: PASOS.map((p, i) => ({
                "@type": "HowToStep",
                position: i + 1,
                name: p.titulo,
                text: p.detalle,
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
          alt="Fachada del local de Neumáticos Trivium en Argüello, Córdoba, donde se gestiona la garantía"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40 max-md:from-black/90 max-md:via-black/80 max-md:to-black/70" />
        <div className="relative mx-auto max-w-5xl px-4 py-10 md:py-20">
          <Breadcrumbs crumbs={crumbs} dark />
          <span className="inline-block rounded-md bg-[#ff1e00] px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
            Garantía de neumáticos
          </span>
          <h1 className="font-display mt-4 max-w-3xl text-4xl font-bold uppercase leading-[0.95] tracking-wide text-white md:text-7xl">
            1 año de garantía
            <br />
            <span className="text-[#ff1e00]">en todos los neumáticos.</span>
          </h1>
          <p data-speakable className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200 md:text-xl">
            Todos los neumáticos nuevos de Neumáticos Trivium, en Córdoba, tienen <strong className="text-white">1 año de garantía por
            defecto de fabricación</strong>, sin importar la marca. La gestionamos nosotros en el local: sin importadora, sin servicio
            oficial, sin vueltas.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <WhatsAppLink
              href={waHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-4 text-base font-black text-white shadow-lg transition-colors hover:bg-[#1ebe57]"
            >
              Consultar por WhatsApp
            </WhatsAppLink>
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-4 text-base font-black text-navy-900 transition-colors hover:bg-slate-100"
            >
              Ver neumáticos con garantía
            </Link>
          </div>
          <GoogleRatingBadge className="mt-6 text-white" />
        </div>
      </header>

      {/* DATOS CLAVE */}
      <section className="border-b border-slate-200 bg-slate-50">
        <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-px bg-slate-200 md:grid-cols-4">
          {[
            ["1 año", "desde la fecha de compra"],
            ["Todas", "las marcas y medidas"],
            ["En el local", "sin intermediarios"],
            ["$0", "costo adicional por la garantía"],
          ].map(([n, t]) => (
            <div key={n} className="bg-slate-50 px-4 py-6 text-center">
              <dt className="font-display text-3xl font-bold text-orange-600 md:text-4xl">{n}</dt>
              <dd className="mt-1 text-sm font-bold text-slate-600">{t}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        {/* QUÉ CUBRE */}
        <section>
          <h2 className="text-2xl font-black text-navy-900 md:text-4xl">Qué cubre la garantía y qué no</h2>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-slate-600">
            La garantía cubre los <strong>defectos de fabricación</strong>. Lo que se rompe o se desgasta por cómo se usa el
            neumático queda afuera, y es casi siempre evitable con mantenimiento.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <h3 className="text-sm font-black uppercase tracking-wide text-emerald-700">&#10003; Sí cubre</h3>
              <ul className="mt-3 space-y-3">
                {CUBRE.map((t) => (
                  <li key={t} className="flex gap-3 leading-relaxed text-slate-700">
                    <span aria-hidden className="mt-0.5 font-black text-emerald-600">&#10003;</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <h3 className="text-sm font-black uppercase tracking-wide text-red-700">&#10005; No cubre</h3>
              <ul className="mt-3 space-y-3">
                {NO_CUBRE.map((t) => (
                  <li key={t} className="flex gap-3 leading-relaxed text-slate-700">
                    <span aria-hidden className="mt-0.5 font-black text-red-600">&#10005;</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CÓMO RECLAMAR */}
        <section className="mt-14">
          <h2 className="text-2xl font-black text-navy-900 md:text-4xl">Cómo reclamar la garantía en 3 pasos</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {PASOS.map((p, i) => (
              <li key={p.titulo} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="font-display flex h-10 w-10 items-center justify-center rounded-full bg-[#ff1e00] text-xl font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-black text-navy-900">{p.titulo}</h3>
                <p className="mt-2 leading-relaxed text-slate-600">{p.detalle}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-navy-900 p-6 text-white md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-black">¿Tu neumático tiene un problema?</p>
              <p className="mt-1 text-slate-300">
                Escribinos y te decimos si entra en garantía. Local: {branch.address}, {branch.neighborhood ?? branch.city}, {branch.city}. {branch.hours}.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row md:flex-shrink-0">
              <WhatsAppLink
                href={waHref}
                className="inline-flex items-center justify-center rounded-xl bg-[#25D366] px-5 py-3 text-sm font-black text-white hover:bg-[#1ebe57]"
              >
                Escribir por WhatsApp
              </WhatsAppLink>
              <a
                href={branch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-black text-navy-900 hover:bg-slate-100"
              >
                Cómo llegar
              </a>
            </div>
          </div>
        </section>

        {/* POR QUÉ ES CONFIABLE */}
        <section className="mt-14">
          <h2 className="text-2xl font-black text-navy-900 md:text-4xl">Una garantía con respaldo real</h2>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-slate-600">
            Quien te vende el neumático es quien responde por la garantía: {LEGAL_NAME} (CUIT {CUIT}), con local a la calle y
            taller propio en {branch.neighborhood ?? branch.city}. Vas al mismo lugar donde compraste.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["Una sola puerta", "No hay que ir a una importadora ni a un servicio oficial: el reclamo se hace donde compraste."],
              ["Inspección en el momento", "Revisamos el neumático con vos, en el local, y te decimos si es un defecto de fábrica."],
              ["Gomería en el mismo lugar", "Alineación, balanceo y reparación de pinchaduras en el mismo local, para cuidar el neumático después de comprarlo."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-2xl bg-slate-50 p-6">
                <h3 className="text-lg font-black text-navy-900">{t}</h3>
                <p className="mt-2 leading-relaxed text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* COMPARACIÓN */}
        <section className="mt-14">
          <h2 className="text-2xl font-black text-navy-900 md:text-4xl">Garantía vs. derecho de arrepentimiento</h2>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-slate-600">
            Son dos protecciones distintas y se pueden usar por separado. Todo el detalle está en la{" "}
            <Link className={link} href="/politica-de-devoluciones">política de devoluciones</Link>.
          </p>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <caption className="sr-only">Comparación entre la garantía de fabricación y el derecho de arrepentimiento</caption>
              <thead className="bg-navy-900 text-white">
                <tr>
                  <th scope="col" className="px-4 py-3 font-black"> </th>
                  <th scope="col" className="px-4 py-3 font-black">Garantía (1 año)</th>
                  <th scope="col" className="px-4 py-3 font-black">Arrepentimiento (30 días)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {COMPARACION.map((r) => (
                  <tr key={r.aspecto} className="odd:bg-white even:bg-slate-50">
                    <th scope="row" className="px-4 py-3 font-black text-navy-900">{r.aspecto}</th>
                    <td className="px-4 py-3 text-slate-700">{r.garantia}</td>
                    <td className="px-4 py-3 text-slate-700">{r.arrepentimiento}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CUIDADO */}
        <section className="mt-14">
          <h2 className="text-2xl font-black text-navy-900 md:text-4xl">Cómo cuidar tus neumáticos para no perder la garantía</h2>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-slate-600">
            Lo que la garantía deja afuera es, casi siempre, lo que se evita con mantenimiento. Estas notas explican cómo:
          </p>
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              ["/blog/presion-de-neumaticos", "Presión de neumáticos", "Cuánto inflar y cada cuánto revisarla"],
              ["/blog/etiqueta-de-presion-puerta-del-auto", "Etiqueta de presión", "Cómo leer la de la puerta de tu auto"],
              ["/blog/alineacion-y-balanceo", "Alineación y balanceo", "Qué es cada cosa y cada cuánto se hacen"],
              ["/blog/desgaste-irregular-de-neumaticos", "Desgaste irregular", "Por qué ocurre y cómo evitarlo"],
              ["/blog/antiguedad-del-neumatico-codigo-dot", "Antigüedad y código DOT", "Cómo saber de qué fecha es un neumático"],
            ].map(([href, t, d]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block rounded-2xl border border-slate-200 p-5 transition-colors hover:border-navy-300 hover:bg-navy-50"
                >
                  <span className="block font-black text-navy-900">{t}</span>
                  <span className="mt-1 block text-sm text-slate-600">{d}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/servicios"
                className="block rounded-2xl border border-slate-200 p-5 transition-colors hover:border-navy-300 hover:bg-navy-50"
              >
                <span className="block font-black text-navy-900">Alineación y balanceo en el local</span>
                <span className="mt-1 block text-sm text-slate-600">Colocación y válvulas sin cargo al comprar en el local</span>
              </Link>
            </li>
          </ul>
        </section>

        <FaqSection faqs={FAQS} title="Preguntas frecuentes sobre la garantía" />

        {/* CTA FINAL */}
        <section className="mt-14 overflow-hidden rounded-3xl bg-navy-900 px-6 py-10 text-center md:px-12 md:py-14">
          <h2 className="font-display text-3xl font-bold uppercase leading-tight tracking-wide text-white md:text-5xl">
            Comprá neumáticos nuevos <span className="text-[#ff1e00]">con garantía.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300 md:text-lg">
            Todo el catálogo tiene la misma garantía de 1 año. Mirá precio y stock real de cada medida, o buscá por tu auto.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/catalogo" className="rounded-xl bg-[#ff1e00] px-6 py-4 text-base font-black text-white hover:bg-orange-600">
              Ver neumáticos con stock
            </Link>
            <Link href="/ofertas" className="rounded-xl bg-white px-6 py-4 text-base font-black text-navy-900 hover:bg-slate-100">
              Ver ofertas
            </Link>
            <Link href="/buscar" className="rounded-xl border border-white/40 px-6 py-4 text-base font-black text-white hover:bg-white/10">
              Buscar por medida
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
