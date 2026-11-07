import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/ui/Link";
import { SERVICES } from "@/lib/data";
import { COMBO_ID, COMBO_SERVICE, EXTRA_SERVICES } from "@/lib/servicios-seo";
import { LOCALIDADES, getBranchForLocalidad } from "@/lib/localidades";
import { getServiciosPrecios } from "@/lib/pos-api";
import { formatPrecio, nombreServicio, splitAutoCamioneta } from "@/lib/servicios";
import { branchNodeId, canonical, resumen, type Faq } from "@/lib/seo";
import { SITE_URL } from "@/lib/config";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { mensajeAvisameApertura, waHref } from "@/lib/whatsapp";

/**
 * Landing de SEO local por servicio y ciudad: "alineado en Córdoba",
 * "alineación en San Justo". Las fichas /servicios/[id] no llevan ciudad en el
 * título (habrá locales en todo el país); la intención local la cubren estas.
 *
 * Solo las ciudades cabecera (una por sucursal), no cada barrio: servicio x
 * barrio sería una fábrica de doorway pages. El texto propio de cada ciudad
 * sale de localidades.ts. Mientras la sucursal no abrió la página se genera
 * pero con noindex y fuera del sitemap; al sacar `apertura` de config.ts se
 * indexa sola.
 */
export const dynamic = "force-static";

type Props = { params: Promise<{ id: string; ciudad: string }> };

const todos = () => [...SERVICES, COMBO_SERVICE, ...EXTRA_SERVICES];
const cabeceras = () => LOCALIDADES.filter((l) => l.esCabecera);

export function generateStaticParams() {
  return todos().flatMap((s) => cabeceras().map((l) => ({ id: s.id, ciudad: l.slug })));
}

function resolver(id: string, ciudad: string) {
  const service = todos().find((s) => s.id === id);
  const localidad = cabeceras().find((l) => l.slug === ciudad);
  if (!service || !localidad) return null;
  const branch = getBranchForLocalidad(localidad);
  const base = id === COMBO_ID && branch.id !== "arguello" ? "Combo alineación y balanceo" : service.title;
  const nombre = nombreServicio(id, base, branch.id);
  const ciudadCorta = localidad.name.replace(/ Capital$/, "");
  return { service, localidad, branch, nombre, ciudadCorta };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, ciudad } = await params;
  const r = resolver(id, ciudad);
  if (!r) return {};
  const { branch, nombre, ciudadCorta, service } = r;
  const abierta = !branch.apertura;
  return {
    title: `${nombre} en ${ciudadCorta}${abierta ? ": precio y sin turno" : `: abre ${branch.apertura}`}`,
    description: resumen(
      abierta
        ? `${nombre} en ${ciudadCorta}, en Neumáticos Trivium ${branch.shortName} (${branch.address}). ${service.description}`
        : `${nombre} en ${ciudadCorta}: Neumáticos Trivium ${branch.shortName} (${branch.address}) abre ${branch.apertura}. ${service.description}`
    ),
    alternates: canonical(`/servicios/${id}/${ciudad}`),
    robots: abierta ? undefined : { index: false, follow: true },
  };
}

function faqs({ localidad, branch, nombre, ciudadCorta }: NonNullable<ReturnType<typeof resolver>>, precio?: number): Faq[] {
  const n = nombre.toLowerCase();
  if (branch.apertura) {
    return [
      {
        question: `¿Cuándo abre Trivium en ${ciudadCorta}?`,
        answer: `Nuestro local de ${branch.address}, ${branch.city}, abre ${branch.apertura}. Escribinos por WhatsApp y te avisamos el día que empiece a atender el taller.`,
      },
      {
        question: `¿Dónde puedo hacer ${n} mientras tanto?`,
        answer: `El taller que ya funciona está en Av. Donato Álvarez 7971, Argüello, Córdoba. Para ${ciudadCorta} el servicio empieza cuando abra el local.`,
      },
    ];
  }
  return [
    {
      question: `¿Dónde hago ${n} en ${ciudadCorta}?`,
      answer: `En Neumáticos Trivium ${branch.shortName}, ${branch.address}, ${branch.city}. ${localidad.comoLlegar}`,
    },
    {
      question: `¿Hay que sacar turno para ${n}?`,
      answer: `No. Atendemos por orden de llegada, ${branch.hours.toLowerCase()}. Si querés saber cuánta espera hay, escribinos por WhatsApp antes de salir.`,
    },
    ...(precio
      ? [{ question: `¿Cuánto sale ${n} en ${ciudadCorta}?`, answer: `Desde ${formatPrecio(precio)} para auto. El precio de camioneta y qué incluye está en la ficha del servicio.` }]
      : []),
  ];
}

export default async function ServicioCiudadPage({ params }: Props) {
  const { id, ciudad } = await params;
  const r = resolver(id, ciudad);
  if (!r) notFound();
  const { service, localidad, branch, nombre, ciudadCorta } = r;
  const abierta = !branch.apertura;

  const precios = abierta && !EXTRA_SERVICES.some((e) => e.id === id) ? await getServiciosPrecios(id === COMBO_ID ? "combo" : id, branch.id) : [];
  const { auto, camioneta } = splitAutoCamioneta(precios);
  const preguntas = faqs(r, auto?.precio);
  const path = `/servicios/${id}/${ciudad}`;
  const wa = abierta
    ? waHref(branch.whatsapp, `Hola, quiero consultar por ${nombre.toLowerCase()} en ${branch.shortName}\n${SITE_URL}${path}`)
    : waHref(branch.whatsapp, mensajeAvisameApertura(branch.shortName));

  return (
    <div className="min-h-screen bg-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${SITE_URL}${path}#servicio`,
          name: `${nombre} en ${ciudadCorta}`,
          serviceType: service.title,
          description: service.description,
          url: `${SITE_URL}${path}`,
          provider: { "@id": branchNodeId(branch) },
          areaServed: { "@type": "City", name: ciudadCorta },
        }}
      />
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <Breadcrumbs
          crumbs={[
            { name: "Inicio", path: "/" },
            { name: "Servicios", path: "/servicios" },
            { name: service.title, path: `/servicios/${id}` },
            { name: ciudadCorta, path },
          ]}
        />
        <p className="text-xs font-black uppercase tracking-widest text-orange-500">Servicio de gomería · {branch.shortName}, {branch.province}</p>
        <h1 className="mt-1 text-3xl font-black leading-tight text-navy-900 md:text-4xl">
          {nombre} en {ciudadCorta}
        </h1>
        <p className="mt-3 leading-relaxed text-slate-600">{service.description}</p>

        {auto && (
          <p className="mt-6 text-slate-700">
            <span className="text-3xl font-black text-navy-900">{formatPrecio(auto.precio)}</span>{" "}
            <span className="text-sm font-bold text-slate-500">
              auto{camioneta ? ` · ${formatPrecio(camioneta.precio)} camioneta` : ""}
              {service.priceNote ? ` · ${service.priceNote}` : ""}
            </span>
          </p>
        )}

        <section className="mt-8 space-y-3 text-slate-700 leading-relaxed">
          <h2 className="text-xl font-black text-navy-900">
            {abierta ? `Dónde lo hacemos en ${ciudadCorta}` : `Trivium llega a ${ciudadCorta}`}
          </h2>
          <p>
            Neumáticos Trivium {branch.shortName}: {branch.address}, {branch.city}, {branch.province}.{" "}
            {abierta ? branch.hours + ". Sin turno, por orden de llegada." : `Abre ${branch.apertura}.`}
          </p>
          <p>{localidad.intro}</p>
          {abierta && <p>{localidad.comoLlegar}</p>}
        </section>

        <ul className="mt-6 space-y-2">
          {service.features.map((f) => (
            <li key={f} className="flex gap-2 text-sm text-slate-700">
              <span className="text-orange-500">✓</span>
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <WhatsAppLink href={wa} className="rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-white hover:bg-[#1ebe57]">
            {abierta ? "Consultar por WhatsApp" : "Avisame cuando abra"}
          </WhatsAppLink>
          <Link href={`/servicios/${id}`} className="rounded-xl border-2 border-navy-900 px-6 py-3 font-semibold text-navy-900 hover:bg-slate-50">
            Ver qué incluye
          </Link>
        </div>

        <div className="mt-10">
          <FaqSection faqs={preguntas} />
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-black text-navy-900 mb-3">Otros servicios en {ciudadCorta}</h2>
          <ul className="space-y-2">
            {todos()
              .filter((s) => s.id !== id)
              .map((s) => (
                <li key={s.id}>
                  <Link href={`/servicios/${s.id}/${ciudad}`} className="font-bold text-orange-700 underline underline-offset-4">
                    {nombreServicio(s.id, s.title, branch.id)} en {ciudadCorta}
                  </Link>
                </li>
              ))}
            <li>
              <Link href={`/neumaticos-en/${ciudad}`} className="font-bold text-orange-700 underline underline-offset-4">
                Neumáticos en {ciudadCorta}
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
