import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SERVICES } from "@/lib/data";
import { ICONS } from "@/components/home/ServicesSection";
import { getServiciosPrecios } from "@/lib/pos-api";
import { getSelectedBranchSlug } from "@/lib/branch-server";
import { formatPrecio, splitAutoCamioneta } from "@/lib/servicios";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, canonical, serviceJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const service = SERVICES.find((s) => s.id === id);
  if (!service) return {};
  return {
    title: `${service.title} — Neumáticos Trivium`,
    description: service.description,
    alternates: canonical(`/servicios/${service.id}`),
  };
}

export default async function ServicioPage({ params }: Props) {
  const { id } = await params;
  const service = SERVICES.find((s) => s.id === id);
  if (!service) notFound();

  const precios = await getServiciosPrecios(id, await getSelectedBranchSlug());
  const { auto, camioneta } = splitAutoCamioneta(precios);

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
      <div className="bg-black py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-8 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a servicios
          </Link>
          <div className="text-orange-500 mb-4">{ICONS[service.icon]}</div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4">{service.title}</h1>
          <p className="text-slate-300 text-lg max-w-xl leading-relaxed">{service.description}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Features */}
          <div>
            <h2 className="text-lg font-black text-navy-900 mb-4 uppercase tracking-wide">Qué incluye</h2>
            <ul className="space-y-3">
              {service.features.map((feat) => (
                <li key={feat} className="flex items-center gap-2 text-slate-700">
                  <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          {/* Price list — separado por auto/camioneta en vez de la lista cruda
              del POS, que trae los dos ítems con nombres tipo "ALINEACION AUTO". */}
          <div>
            <h2 className="text-lg font-black text-navy-900 mb-4 uppercase tracking-wide">Precios</h2>
            {!auto && !camioneta ? (
              <p className="text-slate-500 bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm">
                Consultanos el precio actualizado por WhatsApp.
              </p>
            ) : (
              <>
                <ul className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                  {auto && (
                    <li className="flex items-center justify-between px-4 py-3 bg-white">
                      <span className="text-sm font-semibold text-slate-700">Auto</span>
                      <span className="text-sm font-black text-navy-900 whitespace-nowrap ml-4">
                        {formatPrecio(auto.precio)}
                      </span>
                    </li>
                  )}
                  {camioneta && (
                    <li className="flex items-center justify-between px-4 py-3 bg-white">
                      <span className="text-sm font-semibold text-slate-700">Camioneta</span>
                      <span className="text-sm font-black text-navy-900 whitespace-nowrap ml-4">
                        {formatPrecio(camioneta.precio)}
                      </span>
                    </li>
                  )}
                </ul>
                {service.priceNote && (
                  <p className="text-xs text-slate-400 mt-2">{service.priceNote}</p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="mt-12 bg-orange-50 border border-orange-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
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
