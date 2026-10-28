"use client";

import Link from "@/components/ui/Link";
import Image from "next/image";
import { BRANCHES, type Branch } from "@/lib/config";
import { useBranch } from "@/contexts/branch-context";
import { BranchStatusBadge } from "@/app/sucursales/[id]/BranchStatusBadge";
import { LazyBranchMiniMap } from "@/app/sucursales/[id]/LazyBranchMiniMap";
import { DirectionsButton } from "@/app/sucursales/[id]/DirectionsButton";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { DirectionsIcon } from "@/components/ui/DirectionsIcon";

function BranchCard({ branch }: { branch: Branch }) {
  const waMessage = encodeURIComponent(
    `¡Hola! Te escribo desde la web de Neumáticos Trivium. Quería hacer una consulta.`
  );
  return (
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-0 md:grid-cols-2">
          {/* Info + acciones */}
          <div className="p-6 md:p-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-black text-navy-900">
                Neumáticos Trivium {branch.shortName}
              </h2>
              <BranchStatusBadge branch={branch} />
            </div>

            <p className="flex items-start gap-2 text-sm leading-relaxed text-slate-600">
              <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>
                {branch.address}
                <br />
                {branch.city}
              </span>
            </p>
            <p className="mt-2 text-sm text-slate-500">{branch.hours}</p>

            <WhatsAppLink
              href={`https://wa.me/${branch.whatsapp}?text=${waMessage}`}
              className="mt-6 flex min-h-14 items-center justify-center gap-2.5 rounded-2xl bg-[#25d366] px-4 text-base font-black text-white shadow-sm shadow-[#25d366]/20 transition-transform active:scale-[0.98]"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Escribir por WhatsApp
            </WhatsAppLink>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <a
                href={`tel:${branch.phone.replace(/\s/g, "")}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-navy-900 shadow-sm transition-colors hover:border-slate-300"
              >
                <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Llamar
              </a>
              <DirectionsButton
                lat={branch.coordinates.lat}
                lng={branch.coordinates.lng}
                label={`Neumáticos Trivium ${branch.shortName}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-navy-900 shadow-sm transition-colors hover:border-orange-400 hover:text-orange-600"
              >
                <DirectionsIcon className="h-6 w-6 text-orange-500" />
                Cómo llegar
              </DirectionsButton>
            </div>

            <Link
              href={`/sucursales/${branch.id}`}
              className="mt-4 inline-block text-sm font-bold text-navy-700 underline decoration-navy-300 hover:decoration-navy-900"
            >
              Ver horarios, servicios y más de esta sucursal
            </Link>

            {branch.facadePhoto && (
              <Link href={`/sucursales/${branch.id}`} className="mt-4 block w-44 overflow-hidden rounded-xl ring-1 ring-slate-200">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={branch.facadePhoto}
                    alt={`Fachada del local de Neumáticos Trivium ${branch.shortName}`}
                    fill
                    className="object-cover"
                    sizes="176px"
                  />
                </div>
              </Link>
            )}
          </div>

          {/* Mapa */}
          <div className="p-6 pt-0 md:p-8 md:pl-0">
            <LazyBranchMiniMap branch={branch} />
          </div>
        </div>
      </section>
  );
}

/**
 * Sucursales de la página de contacto, con la elegida arriba. Si todavía no
 * eligió ninguna (y la ubicación por IP no la resolvió), se propone elegir:
 * el selector de sucursal también puede detectar la más cercana. El HTML
 * estático trae todas las sucursales con la sugerida primero, así que el
 * contacto de cada una sigue estando para buscadores.
 */
export function ContactoSucursales() {
  const { selectedBranch, hasConfirmedBranch, openModal } = useBranch();
  const ordenadas = [selectedBranch, ...BRANCHES.filter((b) => b.id !== selectedBranch.id)];

  return (
    <div className="space-y-8">
      {hasConfirmedBranch ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-bold text-slate-600">
            Tu sucursal: <span className="text-navy-900">{selectedBranch.shortName}</span>
          </p>
          {BRANCHES.length > 1 && (
            <button type="button" onClick={openModal} className="text-sm font-bold text-navy-700 underline underline-offset-4 hover:text-navy-900">
              Cambiar sucursal
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-black text-navy-900">¿Con qué sucursal querés hablar?</p>
            <p className="mt-0.5 text-sm text-slate-600">Elegila de la lista o dejá que detectemos la más cercana a tu ubicación.</p>
          </div>
          <button
            type="button"
            onClick={openModal}
            className="shrink-0 rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-orange-600"
          >
            Elegir mi sucursal
          </button>
        </div>
      )}
      {ordenadas.map((branch) => (
        <BranchCard key={branch.id} branch={branch} />
      ))}
    </div>
  );
}
