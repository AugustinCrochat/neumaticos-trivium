"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import Link from "@/components/ui/Link";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { DirectionsIcon } from "@/components/ui/DirectionsIcon";
import { useBranch } from "@/contexts/branch-context";
import { tieneAfluencia } from "@/lib/afluencia";
import { MENSAJE_GENERICO, mensajeAvisameApertura, waHref } from "@/lib/whatsapp";

/**
 * Bloque local de la home con la sucursal elegida. El HTML del build sale con
 * la sucursal por defecto (Argüello): esa es la señal geográfica que lee
 * Google para "neumáticos Córdoba". Quien eligió una sucursal de Buenos Aires
 * ve la suya; si todavía no abrió, la fecha y el "Avisame" en lugar de
 * horario, atención por orden de llegada y "Cómo llegar".
 */
export function LocalSucursal({ zonas }: { zonas: ReactNode }) {
  const { selectedBranch: b } = useBranch();
  const abierta = !b.apertura && !b.provisorio;
  const lugar = b.neighborhood ?? b.city;
  const fila = "flex items-baseline justify-between gap-4 px-4 py-3";
  const etiqueta = "shrink-0 text-xs font-bold uppercase tracking-widest text-navy-300";

  return (
    <section className="bg-navy-950 py-10 text-white md:py-16">
      <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4">
        <div className="grid gap-6 md:grid-cols-2 md:gap-10">
          {/* Foto primero en celular: el local a la vista antes que el texto. */}
          {b.facadePhoto && (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl md:order-2 md:aspect-[4/3]">
              <Image
                src={b.facadePhoto}
                alt={`Fachada del local de Neumáticos Trivium ${b.shortName}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
              <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white backdrop-blur">
                {b.city === b.province ? b.city : `${b.city}, ${b.province}`}
              </span>
            </div>
          )}

          <div className="md:order-1">
            <h2 className="font-display text-3xl font-bold uppercase leading-tight tracking-wide md:text-4xl">
              {b.apertura ? `Nuevo local en ${lugar}` : `Local a la calle en ${lugar}`}
            </h2>
            <p className="mt-2 leading-relaxed text-slate-300">
              {b.apertura
                ? `Abrimos ${b.apertura} en ${b.address}, ${b.city}. Mirá los precios y dejanos tu consulta: te avisamos por WhatsApp el día que abramos.`
                : "Depósito y taller propio. Mirá el neumático antes de comprarlo, colocalo en el momento y resolvé la garantía en persona."}
            </p>

            <dl className="mt-5 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-white/5 text-sm">
              <div className={fila}>
                <dt className={etiqueta}>Dirección</dt>
                <dd className="text-right font-semibold text-white">
                  {b.address}, {b.city}
                </dd>
              </div>
              <div className={fila}>
                <dt className={etiqueta}>{b.apertura ? "Apertura" : "Horario"}</dt>
                <dd className="text-right font-semibold text-white">
                  {b.apertura ? `${b.apertura[0].toUpperCase()}${b.apertura.slice(1)}` : b.hours}
                </dd>
              </div>
              {abierta && (
                <div className={fila}>
                  <dt className={etiqueta}>Atención</dt>
                  <dd className="text-right font-semibold text-white">
                    Por orden de llegada, sin turno
                    {tieneAfluencia(b.id) && (
                      <>
                        {" · "}
                        <Link href="/herramientas/mejor-horario-gomeria" className="font-bold text-white underline underline-offset-4">
                          ver cuándo hay menos gente
                        </Link>
                      </>
                    )}
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:flex">
              {b.apertura ? (
                <WhatsAppLink
                  href={waHref(b.whatsapp, mensajeAvisameApertura(b.shortName))}
                  className="col-span-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 text-sm font-black text-white transition-transform active:scale-[0.98] hover:bg-orange-600"
                >
                  Avisame cuando abra
                </WhatsAppLink>
              ) : (
                <Link
                  href={`/sucursales/${b.id}`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-black text-white transition-transform active:scale-[0.98] hover:bg-orange-600"
                >
                  <DirectionsIcon className="h-5 w-5" />
                  Cómo llegar
                </Link>
              )}
              <WhatsAppLink
                href={waHref(b.whatsapp, MENSAJE_GENERICO)}
                className={`inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-black text-white transition-colors hover:bg-white/10 ${b.apertura ? "col-span-2" : ""}`}
              >
                Escribinos
              </WhatsAppLink>
            </div>
          </div>

          {/* Las zonas van agrupadas por ciudad, con los barrios en un desplegable
              (<details>): para una persona es un bloque corto y escaneable, y los
              nombres siguen en el HTML —cerrados— para la señal geográfica. */}
          <div className="md:order-3 md:col-span-2">
            <h3 className="font-display text-xl font-bold uppercase tracking-wide md:text-2xl">Zonas donde vendemos</h3>
            <p className="mt-1 mb-3 text-sm leading-relaxed text-slate-300 md:text-base">
              Gran Buenos Aires, Córdoba Capital y Sierras Chicas. Si comprás tus neumáticos con nosotros, la colocación y el
              cambio de válvulas son sin cargo.
            </p>
            {zonas}
          </div>
        </div>
      </div>
    </section>
  );
}
