import Link from "@/components/ui/Link";
import Image from "next/image";
import type { Branch } from "@/lib/config";
import { SERVICES } from "@/lib/data";
import { getServiciosPrecios } from "@/lib/pos-api";
import { formatPrecio, nombreServicio, splitAutoCamioneta } from "@/lib/servicios";
import { SERVICIOS_FOTOS } from "@/lib/servicios-fotos";
import { EXTRA_SERVICES, SERVICIOS_SEO } from "@/lib/servicios-seo";

// Resumen de una línea de cada servicio; el detalle completo vive en su ficha.
const RESUMEN: Record<string, string> = {
  alineacion: "Alineado computarizado 3D: corregimos camber, caster y convergencia para que el auto ruede derecho y las cubiertas duren más.",
  balanceo: "Balanceado dinámico computarizado y rotación de las ruedas para sacar vibraciones y repartir el desgaste.",
  montaje: "Arme y desarme con desmontadora automática, sin dañar la llanta. Sin cargo si comprás las cubiertas con nosotros.",
};

/**
 * Servicios de la ficha de sucursal: cada uno con su foto, precio por tipo de
 * vehículo (si el POS lo tiene para esta sucursal) y enlace a su ficha. Las
 * sucursales provisorias o por abrir no muestran precios ni afirman equipos.
 */
export async function ServiciosSucursal({ branch }: { branch: Branch }) {
  const abierta = !branch.provisorio && !branch.apertura;
  const precios = abierta ? await getServiciosPrecios(undefined, branch.id) : [];
  const combo = splitAutoCamioneta(precios.filter((p) => p.grupo === "combo"));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-1 text-lg font-black text-navy-900">Servicios en esta sucursal</h2>
      <p className="mb-5 text-sm text-slate-500">
        {abierta
          ? "Taller propio con equipos de última generación, por orden de llegada y sin turno."
          : "Los servicios de gomería que vamos a ofrecer en esta sucursal."}
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {SERVICES.map((service) => {
          const foto = SERVICIOS_FOTOS[service.id]?.principal;
          const { auto, camioneta } = splitAutoCamioneta(precios.filter((p) => p.grupo === service.id));
          const nombre = nombreServicio(service.id, service.title, branch.id);
          return (
            <article key={service.id} className="flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
              {foto && (
                <Link href={`/servicios/${service.id}`} className="relative block aspect-[16/10] w-full" tabIndex={-1}>
                  <Image src={foto.src} alt={foto.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                </Link>
              )}
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-black text-navy-900">
                  <Link href={`/servicios/${service.id}`} className="hover:text-orange-600">
                    {nombre}
                  </Link>
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">{RESUMEN[service.id] ?? service.description}</p>
                {(auto || camioneta) && (
                  <p className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-0.5 text-sm">
                    {auto && (
                      <span className="text-slate-500">
                        Auto <strong className="text-base font-black text-navy-900">{formatPrecio(auto.precio)}</strong>
                      </span>
                    )}
                    {camioneta && (
                      <span className="text-slate-500">
                        Camioneta <strong className="text-base font-black text-navy-900">{formatPrecio(camioneta.precio)}</strong>
                      </span>
                    )}
                    {service.priceNote && <span className="text-xs text-slate-400">{service.priceNote}</span>}
                  </p>
                )}
                <Link
                  href={`/servicios/${service.id}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-orange-700 hover:text-orange-800"
                >
                  Ver detalle{auto || camioneta ? " y precio" : ""} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {(combo.auto || combo.camioneta) && (
        <Link
          href="/servicios/combo-alineado-y-balanceado"
          className="mt-4 flex flex-col gap-2 rounded-xl border border-orange-200 bg-orange-50 p-4 transition-colors hover:border-orange-300 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>
            <span className="block font-black text-navy-900">
              Combo: {nombreServicio("alineacion", "alineación", branch.id).toLowerCase()} + 4 {branch.id === "arguello" ? "balanceados" : "balanceos"} con rotación
            </span>
            <span className="block text-sm text-slate-600">Las cuatro ruedas listas en la misma visita, más barato que por separado.</span>
          </span>
          <span className="flex shrink-0 items-baseline gap-4 text-sm text-slate-500">
            {combo.auto && (
              <span>
                Auto <strong className="text-lg font-black text-navy-900">{formatPrecio(combo.auto.precio)}</strong>
              </span>
            )}
            {combo.camioneta && (
              <span>
                Camioneta <strong className="text-lg font-black text-navy-900">{formatPrecio(combo.camioneta.precio)}</strong>
              </span>
            )}
          </span>
        </Link>
      )}

      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-400">También hacemos</p>
        <ul className="flex flex-wrap gap-2">
          {EXTRA_SERVICES.map((s) => (
            <li key={s.id}>
              <Link
                href={`/servicios/${s.id}`}
                className="inline-block rounded-full border border-slate-200 px-3 py-1.5 text-sm font-bold text-navy-800 transition-colors hover:border-orange-400 hover:text-orange-700"
              >
                {SERVICIOS_SEO[s.id]?.h1.replace(/ en Córdoba$/, "") ?? s.title}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/servicios"
              className="inline-block rounded-full bg-navy-900 px-3 py-1.5 text-sm font-bold text-white transition-colors hover:bg-black"
            >
              Todos los servicios
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
