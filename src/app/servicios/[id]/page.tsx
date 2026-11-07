import Link from "@/components/ui/Link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SERVICES } from "@/lib/data";
import { ICONS } from "@/components/home/ServicesSection";
import { getServiciosPrecios } from "@/lib/pos-api";
import { getSelectedBranchSlug } from "@/lib/branch-server";
import { splitAutoCamioneta } from "@/lib/servicios";
import { FaqSection } from "@/components/seo/FaqSection";
import { COMBO_ID, COMBO_SERVICE, EXTRA_SERVICES, SERVICIOS_SEO, conPrecios, preciosTaller } from "@/lib/servicios-seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { HorarioBloque } from "@/components/tools/HorarioBloque";
import { ServicioFicha } from "./ServicioFicha";
import { EquipoHofmann } from "@/components/blog/EquipoHofmann";
import { UpsellNeumaticos } from "@/components/servicios/UpsellNeumaticos";
import { SERVICIOS_FOTOS } from "@/lib/servicios-fotos";
import { breadcrumbJsonLd, canonical, serviceJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ id: string }> };

// La rotación de ruedas tiene página propia (se busca aparte) pero no figura en
// el listado de servicios: comparte grupo de precios con "Balanceo y Rotación".
const findService = (id: string) => [...SERVICES, COMBO_SERVICE, ...EXTRA_SERVICES].find((s) => s.id === id);

export async function generateStaticParams() {
  return [...SERVICES, COMBO_SERVICE, ...EXTRA_SERVICES].map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const service = findService(id);
  if (!service) return {};
  const seo = SERVICIOS_SEO[service.id];
  const p = preciosTaller(await getServiciosPrecios(undefined, await getSelectedBranchSlug()));
  return {
    title: (seo?.titleConPrecio && conPrecios(seo.titleConPrecio, p)) || (seo?.title ?? service.title),
    description: (seo?.metaDescriptionConPrecio && conPrecios(seo.metaDescriptionConPrecio, p)) || (seo?.metaDescription ?? service.description),
    alternates: canonical(`/servicios/${service.id}`),
  };
}

export default async function ServicioPage({ params }: Props) {
  const { id } = await params;
  const service = findService(id);
  if (!service) notFound();
  const seo = SERVICIOS_SEO[service.id];

  const precios =
    EXTRA_SERVICES.some((e) => e.id === service.id) ? [] : await getServiciosPrecios(id === COMBO_ID ? "combo" : id, await getSelectedBranchSlug());
  const { auto, camioneta } = splitAutoCamioneta(precios);
  const fotos = SERVICIOS_FOTOS[service.id];
  // Alineado y balanceado ofrecen el combo completo y las cubiertas.
  const ofreceCombo = service.id === "alineacion" || service.id === "balanceo";
  const ofreceNeumaticos = ofreceCombo || service.id === COMBO_ID;
  const comboPrecios = splitAutoCamioneta(ofreceCombo ? await getServiciosPrecios("combo", await getSelectedBranchSlug()) : []);
  // Las preguntas con {precio} se completan con el POS del build; si falta un
  // precio, esa pregunta no se muestra en vez de quedar con un hueco.
  const preciosSeo = preciosTaller(await getServiciosPrecios(undefined, await getSelectedBranchSlug()));
  const faqs = (seo?.faqs ?? []).flatMap((f) => {
    const answer = conPrecios(f.answer, preciosSeo);
    return answer ? [{ ...f, answer }] : [];
  });

  return (
    <div className="min-h-screen bg-white">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Servicios", path: "/servicios" },
          { name: service.title, path: `/servicios/${service.id}` },
        ])}
      />
      <JsonLd data={serviceJsonLd(service)} />
      <ServicioFicha
        id={service.id}
        title={service.title}
        h1Local={(seo?.h1 ?? service.title).replace(/ en Córdoba$/, " en Argüello, Córdoba")}
        description={service.description}
        icon={ICONS[service.icon]}
        fotos={fotos ? [fotos.principal, ...fotos.galeria] : []}
        variantes={[
          ...(auto ? [{ label: "Auto", precio: auto.precio }] : []),
          ...(camioneta ? [{ label: "Camioneta", precio: camioneta.precio }] : []),
        ]}
        priceNote={service.priceNote}
        combo={[
          ...(comboPrecios.auto ? [{ label: "Auto", precio: comboPrecios.auto.precio }] : []),
          ...(comboPrecios.camioneta ? [{ label: "Camioneta", precio: comboPrecios.camioneta.precio }] : []),
        ]}
        features={service.features}
        volver={
          <Link
            href="/servicios"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-navy-900"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a servicios
          </Link>
        }
      />

      <div className="max-w-3xl mx-auto px-4 pb-12 md:pb-16">
        {ofreceNeumaticos && <UpsellNeumaticos />}
        {service.id === "tuercas-de-seguridad" && (
          <Link
            href="/tuercas-antirrobo"
            className="mt-10 flex flex-col gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-5 transition-colors hover:border-orange-300 sm:flex-row sm:items-center sm:justify-between"
          >
            <span>
              <span className="block text-lg font-black text-navy-900">¿Buscás un juego de tuercas antirrobo?</span>
              <span className="block text-sm text-slate-600">
                Mirá la categoría con los modelos disponibles, sus fotos y precios, y los que son compatibles con tu auto.
              </span>
            </span>
            <span className="shrink-0 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-black text-white">Ver tuercas antirrobo →</span>
          </Link>
        )}
        {seo && (
          <div className="mt-12 space-y-8">
            <div className="space-y-4 text-slate-700 leading-relaxed">
              {seo.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            {seo.secciones.map((sec) => (
              <section key={sec.titulo}>
                <h2 className="text-xl font-black text-navy-900 mb-3">{sec.titulo}</h2>
                {sec.texto && <p className="text-slate-700 leading-relaxed">{sec.texto}</p>}
                {sec.items && (
                  <ul className="list-disc space-y-2 pl-5 text-slate-700 leading-relaxed">
                    {sec.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            <FaqSection faqs={faqs} />
            {ofreceNeumaticos && <EquipoHofmann />}
            <section>
              <h2 className="text-xl font-black text-navy-900 mb-3">Más información</h2>
              <ul className="space-y-2">
                {seo.relacionados.map(([slug, label]) => (
                  <li key={slug}>
                    <Link href={`/blog/${slug}`} className="font-bold text-orange-700 underline underline-offset-4">
                      {label}
                    </Link>
                  </li>
                ))}
                {[...SERVICES, COMBO_SERVICE, ...EXTRA_SERVICES]
                  .filter((other) => other.id !== service.id)
                  .map((other) => (
                    <li key={other.id}>
                      <Link
                        href={`/servicios/${other.id}`}
                        className="font-bold text-orange-700 underline underline-offset-4"
                      >
                        {SERVICIOS_SEO[other.id]?.h1 ?? other.title}
                      </Link>
                    </li>
                  ))}
                {service.id === "tuercas-de-seguridad" && (
                  <li>
                    <Link href="/tuercas-antirrobo" className="font-bold text-orange-700 underline underline-offset-4">
                      Tuercas antirrobo: categoría y precios
                    </Link>
                  </li>
                )}
                <li>
                  <Link href="/servicios" className="font-bold text-orange-700 underline underline-offset-4">
                    Todos los servicios de la gomería
                  </Link>
                </li>
                <li>
                  <Link href="/neumaticos-en/cordoba" className="font-bold text-orange-700 underline underline-offset-4">
                    Neumáticos en Córdoba
                  </Link>
                </li>
              </ul>
            </section>
          </div>
        )}

        {fotos && (
          <section className="mt-12">
            <h2 className="text-xl font-black text-navy-900 mb-3">En nuestro taller de Argüello</h2>
            <div className="grid grid-cols-3 gap-3">
              {fotos.galeria.map((f) => (
                <div key={f.src} className="relative aspect-[3/4] overflow-hidden rounded-xl bg-slate-100">
                  <Image src={f.src} alt={f.alt} fill className="object-cover" sizes="(max-width: 768px) 33vw, 240px" />
                </div>
              ))}
            </div>
          </section>
        )}

        <HorarioBloque className="mt-12" />

        <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-navy-900 mb-1">Atención por orden de llegada</h3>
            <p className="text-slate-600 text-sm">Vení directamente a la sucursal, sin turnos.</p>
          </div>
          <Link
            href="/contacto"
            className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-xl transition-colors text-sm whitespace-nowrap"
          >
            Consultar por WhatsApp
          </Link>
        </div>
      </div>
    </div>
  );
}
