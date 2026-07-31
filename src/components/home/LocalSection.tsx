import Link from "next/link";
import { BRANCHES } from "@/lib/config";
import { LOCALIDADES } from "@/lib/localidades";

/**
 * Bloque local de la home.
 *
 * La home es la página con más autoridad del dominio y, sin un bloque así, no
 * emite ninguna señal geográfica en el HTML visible: la dirección sólo aparecía
 * en el footer. Para el pack local de "neumáticos Córdoba" eso importa, y de
 * paso enlaza las landings de localidad desde arriba del árbol.
 */
export function LocalSection() {
  const branch = BRANCHES[0];

  return (
    <section className="border-b border-slate-100 bg-navy-950 py-16 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-widest text-orange-400">
              {branch.city}, {branch.province}
            </p>
            <h2 className="text-3xl font-black leading-tight">
              Local a la calle en {branch.neighborhood ?? branch.city}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-navy-200">
              No somos sólo una web: tenemos un local con depósito y taller propio en{" "}
              {branch.address}, sobre una avenida de acceso directo desde todo el corredor norte de
              Córdoba. Podés venir a ver el neumático antes de comprarlo, hacer la colocación en el
              momento y resolver cualquier tema de garantía en persona.
            </p>
            <dl className="mt-6 space-y-2 text-navy-200">
              <div className="flex gap-2">
                <dt className="font-bold text-white">Dirección:</dt>
                <dd>
                  {branch.address}, {branch.city}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-bold text-white">Horario:</dt>
                <dd>{branch.hours}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-bold text-white">Atención:</dt>
                <dd>Por orden de llegada, sin turno</dd>
              </div>
            </dl>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`/sucursales/${branch.id}`}
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-orange-500 px-6 text-sm font-black text-white transition-transform active:scale-[0.98] hover:bg-orange-600"
              >
                Cómo llegar
              </Link>
              <a
                href={`https://wa.me/${branch.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-black text-white transition-colors hover:bg-white/10"
              >
                Escribir por WhatsApp
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black">Zonas donde vendemos</h3>
            <p className="mt-2 leading-relaxed text-navy-200">
              Atendemos Córdoba Capital y todo el corredor de Sierras Chicas. En cada página vas a
              encontrar cómo llegar desde tu localidad y cuánto tardás.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {LOCALIDADES.map((localidad) => (
                <Link
                  key={localidad.slug}
                  href={`/neumaticos-en/${localidad.slug}`}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold transition-colors hover:bg-white/10"
                >
                  {localidad.name}
                  <span className="ml-1.5 text-xs font-medium text-navy-300">
                    {localidad.minutosHastaSucursal} min
                  </span>
                </Link>
              ))}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-navy-300">
              ¿Estás en otra provincia? Enviamos a todo el país con costo fijo.{" "}
              <Link href="/neumaticos" className="font-bold text-white underline underline-offset-2">
                Buscá tu medida
              </Link>{" "}
              y comprá online.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
