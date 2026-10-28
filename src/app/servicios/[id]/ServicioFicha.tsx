"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { useBranch } from "@/contexts/branch-context";
import { SITE_URL } from "@/lib/config";
import { formatPrecio } from "@/lib/servicios";
import { BranchStatusBadge } from "@/app/sucursales/[id]/BranchStatusBadge";
import { PaymentMethodsSection } from "@/components/ui/PaymentMethodsSection";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

type Foto = { src: string; alt: string };
type Variante = { label: string; precio: number };

/**
 * Ficha de un servicio con el mismo esquema que la ficha de producto: fotos a
 * la izquierda; a la derecha nombre, precio por tipo de vehículo, qué incluye
 * y los botones de contacto de la sucursal elegida. No hay stock ni compra: se
 * atiende en el local, por orden de llegada.
 */
export function ServicioFicha({
  id,
  title,
  description,
  icon,
  fotos,
  variantes,
  priceNote,
  features,
  volver,
}: {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  fotos: Foto[];
  variantes: Variante[];
  priceNote?: string;
  features: string[];
  volver: ReactNode;
}) {
  const { selectedBranch } = useBranch();
  const [fotoActiva, setFotoActiva] = useState(0);
  const [varianteActiva, setVarianteActiva] = useState(0);
  const variante = variantes[varianteActiva];
  const foto = fotos[fotoActiva];
  const waText = encodeURIComponent(
    `Hola, quiero consultar por el servicio de ${title.toLowerCase()}${variante ? ` (${variante.label.toLowerCase()})` : ""}\n${SITE_URL}/servicios/${id}`
  );

  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-10">
        {volver}
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          {/* Fotos */}
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
              {foto ? (
                <Image src={foto.src} alt={foto.alt} fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 560px" />
              ) : (
                <div className="flex h-full items-center justify-center text-orange-500 [&_svg]:h-24 [&_svg]:w-24">{icon}</div>
              )}
            </div>
            {fotos.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {fotos.map((f, i) => (
                  <button
                    key={f.src}
                    type="button"
                    onClick={() => setFotoActiva(i)}
                    aria-label={`Ver foto ${i + 1}`}
                    aria-pressed={i === fotoActiva}
                    className={`relative aspect-[4/3] overflow-hidden rounded-lg border-2 transition-colors ${i === fotoActiva ? "border-orange-500" : "border-transparent hover:border-slate-300"}`}
                  >
                    <Image src={f.src} alt="" fill className="object-cover" sizes="140px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Datos */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-orange-500">Servicio de gomería</p>
              <h1 className="mt-1 text-3xl font-black leading-tight text-navy-900 md:text-4xl">{title}</h1>
              <p className="mt-3 leading-relaxed text-slate-600">{description}</p>
            </div>

            {variante ? (
              <div>
                {variantes.length > 1 && (
                  <div className="mb-3 flex gap-2" role="group" aria-label="Tipo de vehículo">
                    {variantes.map((v, i) => (
                      <button
                        key={v.label}
                        type="button"
                        onClick={() => setVarianteActiva(i)}
                        aria-pressed={i === varianteActiva}
                        className={`flex-1 rounded-xl border-2 px-4 py-2 text-sm font-black transition-colors ${i === varianteActiva ? "border-orange-500 bg-orange-50 text-orange-600" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                )}
                <p className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-4xl font-black text-navy-900">{formatPrecio(variante.precio)}</span>
                  {priceNote && <span className="text-sm font-bold text-slate-500">{priceNote}</span>}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Sin turno · atención por orden de llegada
                </p>
              </div>
            ) : (
              <p className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                Consultanos el precio actualizado por WhatsApp.
              </p>
            )}

            <ul className="space-y-2">
              {features.map((feat) => (
                <li key={feat} className="flex items-start gap-2 text-sm text-slate-700">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {feat}
                </li>
              ))}
            </ul>

            <div className="flex gap-2">
              <WhatsAppLink
                href={`https://wa.me/${selectedBranch.whatsapp}?text=${waText}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-base font-semibold text-white transition-colors hover:bg-[#1ebe57]"
              >
                <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </WhatsAppLink>
              <a
                href={selectedBranch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-navy-900 bg-white py-3 text-base font-semibold text-navy-900 transition-colors hover:bg-slate-50"
              >
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
                Cómo llegar
              </a>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <p className="font-black text-navy-900">Te atendemos en {selectedBranch.shortName}</p>
              <p className="mt-1 text-xs leading-snug text-slate-600">
                {selectedBranch.address}, {selectedBranch.city} · <span className="font-bold">{selectedBranch.hours}</span>
              </p>
              <div className="mt-2">
                <BranchStatusBadge branch={selectedBranch} />
              </div>
            </div>

            {variante && <PaymentMethodsSection basePrice={variante.precio} />}
          </div>
        </div>
      </div>
    </section>
  );
}
