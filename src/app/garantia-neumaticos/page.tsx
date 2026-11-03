import Link from "@/components/ui/Link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { BRANCHES } from "@/lib/config";
import { absoluteUrl, breadcrumbJsonLd, canonical, SITE_NAME } from "@/lib/seo";
import { poolShare } from "@/lib/share-image";

const TITLE = "Neumáticos nuevos con 1 año de garantía";
const DESCRIPTION =
  "Todos los neumáticos de Neumáticos Trivium tienen 1 año de garantía por defecto de fabricación, gestionada directo con nosotros en nuestros locales. Qué cubre, qué no y cómo se reclama.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: canonical("/garantia-neumaticos"),
  openGraph: { title: `${TITLE} — ${SITE_NAME}`, description: DESCRIPTION, url: "/garantia-neumaticos", ...poolShare("garantia").openGraph },
  twitter: poolShare("garantia").twitter,
};

const FAQS = [
  {
    question: "¿Todos los neumáticos tienen garantía?",
    answer:
      "Sí. Todos los neumáticos nuevos que vendemos, de cualquier marca, tienen 1 año de garantía por defecto de fabricación, contado desde la fecha de compra.",
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
    question: "¿Qué necesito para reclamar?",
    answer:
      "La factura de compra y el neumático disponible para inspección. Se gestiona en el local; si querés, antes escribinos por WhatsApp contándonos el problema.",
  },
  {
    question: "¿Es lo mismo que el derecho de arrepentimiento?",
    answer:
      "No. La garantía es por defectos de fabricación durante 1 año. El derecho de arrepentimiento y los cambios (30 días, sin uso y con embalaje original) están en la política de devoluciones.",
  },
];

export default function GarantiaPage() {
  const branch = BRANCHES[0];
  return (
    <div className="bg-white">
      <JsonLd data={breadcrumbJsonLd([{ name: "Inicio", path: "/" }, { name: "Garantía de neumáticos", path: "/garantia-neumaticos" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: TITLE,
          description: DESCRIPTION,
          url: absoluteUrl("/garantia-neumaticos"),
        }}
      />
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <Breadcrumbs crumbs={[{ name: "Inicio", path: "/" }, { name: "Garantía de neumáticos", path: "/garantia-neumaticos" }]} />
        <h1 className="text-3xl font-black leading-tight text-navy-900 md:text-5xl">Neumáticos nuevos con 1 año de garantía</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          Todos los neumáticos que vendemos en Neumáticos Trivium, en Córdoba, tienen <strong>1 año de garantía por defecto de
          fabricación</strong>, sin importar la marca. La gestionamos nosotros, directamente en el local: sin intermediarios y sin
          mandarte a otro lado.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <h2 className="text-sm font-black uppercase tracking-wide text-emerald-700">&#10003; Qué cubre</h2>
            <p className="mt-2 leading-relaxed text-slate-700">
              Fallas de fabricación del neumático, desde la fecha de compra y durante 1 año.
            </p>
          </section>
          <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <h2 className="text-sm font-black uppercase tracking-wide text-red-700">&#10005; Qué no cubre</h2>
            <p className="mt-2 leading-relaxed text-slate-700">
              Desgaste por uso, pinchaduras, cortes, daños por golpes o baches, uso indebido, y desgaste por alineación,
              balanceo o presión incorrectos.
            </p>
          </section>
        </div>

        <h2 className="mt-12 text-2xl font-black text-navy-900">Cómo reclamar la garantía</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-6 leading-relaxed text-slate-700">
          <li>Juntá la <strong>factura de compra</strong>.</li>
          <li>Traé el neumático al local ({branch.address}, {branch.city}) para que lo inspeccionemos. Si querés, antes escribinos por WhatsApp contándonos qué pasa.</li>
          <li>Si se confirma un defecto de fabricación, coordinamos el cambio o el reintegro según corresponda con el fabricante.</li>
        </ol>
        <WhatsAppLink
          href={`https://wa.me/${branch.whatsapp}?text=${encodeURIComponent("Hola, quiero consultar por la garantía de un neumático")}`}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-black text-white transition-colors hover:bg-[#1ebe57]"
        >
          Consultar por WhatsApp
        </WhatsAppLink>

        <h2 className="mt-12 text-2xl font-black text-navy-900">Cómo cuidar tus neumáticos para no perder la garantía</h2>
        <p className="mt-3 leading-relaxed text-slate-700">
          Lo que la garantía deja afuera es, casi siempre, lo que se puede evitar con mantenimiento. Estas notas explican cómo:
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-6 leading-relaxed text-slate-700">
          <li><Link className="font-bold text-navy-700 underline" href="/blog/presion-de-neumaticos">Presión de neumáticos: cuánto inflar y cada cuánto revisarla</Link></li>
          <li><Link className="font-bold text-navy-700 underline" href="/blog/etiqueta-de-presion-puerta-del-auto">Cómo leer la etiqueta de presión de la puerta de tu auto</Link></li>
          <li><Link className="font-bold text-navy-700 underline" href="/blog/alineacion-y-balanceo">Alineación y balanceo: qué es cada cosa y cada cuánto se hacen</Link></li>
          <li><Link className="font-bold text-navy-700 underline" href="/blog/desgaste-irregular-de-neumaticos">Desgaste irregular: por qué ocurre y cómo evitarlo</Link></li>
          <li><Link className="font-bold text-navy-700 underline" href="/blog/antiguedad-del-neumatico-codigo-dot">Antigüedad del neumático y código DOT</Link></li>
        </ul>
        <p className="mt-3 leading-relaxed text-slate-700">
          Además, la colocación y el cambio de válvulas van sin cargo al comprar en el local, y tenés alineación y balanceo en el mismo lugar.
        </p>

        <h2 className="mt-12 text-2xl font-black text-navy-900">Neumáticos nuevos con garantía</h2>
        <p className="mt-3 leading-relaxed text-slate-700">
          Todo el catálogo tiene la misma garantía: mirá los <Link className="font-bold text-navy-700 underline" href="/catalogo">neumáticos con stock</Link>,
          las <Link className="font-bold text-navy-700 underline" href="/ofertas">ofertas</Link> o buscá por medida: <Link className="font-bold text-navy-700 underline" href="/buscar">buscador de medida</Link>.
          Los cambios y devoluciones se explican en la <Link className="font-bold text-navy-700 underline" href="/politica-de-devoluciones">política de devoluciones</Link>.
        </p>

        <FaqSection faqs={FAQS} />
      </div>
    </div>
  );
}
