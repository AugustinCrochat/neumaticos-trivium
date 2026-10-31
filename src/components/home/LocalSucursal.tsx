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

  return (
    <section className="bg-navy-950 py-16 text-white">
      <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-navy-300">
              {b.city === b.province ? b.city : `${b.city}, ${b.province}`}
            </p>
            <h2 className="font-display text-4xl font-bold uppercase leading-tight tracking-wide">
              {b.apertura ? `Nuevo local en ${b.neighborhood ?? b.city}` : `Local a la calle en ${b.neighborhood ?? b.city}`}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-300">
              {b.apertura
                ? `Abrimos ${b.apertura} en ${b.address}, ${b.city}, con depósito y taller propio. Ya podés ver los precios en la web y dejarnos tu consulta: te avisamos por WhatsApp el día que abramos.`
                : b.id === "arguello"
                  ? `No somos sólo una web: tenemos un local con depósito y taller propio en ${b.address}, sobre una avenida de acceso directo desde todo el corredor norte de Córdoba. Podés venir a ver el neumático antes de comprarlo, hacer la colocación en el momento y resolver cualquier tema de garantía en persona.`
                  : `No somos sólo una web: tenemos un local con depósito y taller propio en ${b.address}, ${b.city}. Podés venir a ver el neumático antes de comprarlo, hacer la colocación en el momento y resolver cualquier tema de garantía en persona.`}
            </p>
            <dl className="mt-6 space-y-2 text-slate-300">
              <div className="flex gap-2">
                <dt className="font-bold text-white">Dirección:</dt>
                <dd>
                  {b.address}, {b.city}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-bold text-white">{b.apertura ? "Apertura:" : "Horario:"}</dt>
                <dd>{b.apertura ? `${b.apertura[0].toUpperCase()}${b.apertura.slice(1)}` : b.hours}</dd>
              </div>
              {abierta && (
                <div className="flex gap-2">
                  <dt className="font-bold text-white">Atención:</dt>
                  <dd>
                    Por orden de llegada, sin turno.{" "}
                    {tieneAfluencia(b.id) && (
                      <Link href="/herramientas/mejor-horario-gomeria" className="font-bold text-white underline underline-offset-4">
                        Ver cuándo está más tranquilo
                      </Link>
                    )}
                  </dd>
                </div>
              )}
            </dl>
            <div className="mt-7 flex flex-wrap gap-3">
              {b.apertura ? (
                <WhatsAppLink
                  href={waHref(b.whatsapp, mensajeAvisameApertura(b.shortName))}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 text-sm font-black text-white transition-transform active:scale-[0.98] hover:bg-orange-600"
                >
                  Avisame cuando abra
                </WhatsAppLink>
              ) : (
                <Link
                  href={`/sucursales/${b.id}`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 text-sm font-black text-white transition-transform active:scale-[0.98] hover:bg-orange-600"
                >
                  <DirectionsIcon className="h-6 w-6" />
                  Cómo llegar
                </Link>
              )}
              <WhatsAppLink
                href={waHref(b.whatsapp, MENSAJE_GENERICO)}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-black text-white transition-colors hover:bg-white/10"
              >
                Escribir por WhatsApp
              </WhatsAppLink>
            </div>
          </div>

          {/* Las zonas van agrupadas por ciudad, con los barrios en un desplegable
              (<details>): para una persona es un bloque corto y escaneable, y los
              nombres siguen en el HTML —cerrados— para la señal geográfica. */}
          <div>
            {b.facadePhoto && (
              <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-xl">
                <Image
                  src={b.facadePhoto}
                  alt={`Fachada del local de Neumáticos Trivium ${b.shortName}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
              </div>
            )}
            <h3 className="font-display text-2xl font-bold uppercase tracking-wide">Zonas donde vendemos</h3>
            <p className="mt-2 mb-5 leading-relaxed text-slate-300">
              Atendemos Córdoba Capital, el corredor de Sierras Chicas y el oeste del Gran Buenos
              Aires. Si estás en cualquiera de esas zonas, el retiro en el local no tiene costo y la
              colocación va incluida.
            </p>
            {zonas}
          </div>
        </div>
      </div>
    </section>
  );
}
