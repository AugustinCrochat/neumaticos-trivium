import Image from "next/image";
import Link from "@/components/ui/Link";
import { BRANCHES } from "@/lib/config";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { ZonasPorProvincia } from "@/components/seo/ZonasPorProvincia";
import { DirectionsIcon } from "@/components/ui/DirectionsIcon";

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
    <section className="bg-navy-950 py-16 text-white">
      <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-navy-300">
              {branch.city === branch.province ? branch.city : `${branch.city}, ${branch.province}`}
            </p>
            <h2 className="font-display text-4xl font-bold uppercase leading-tight tracking-wide">
              Local a la calle en {branch.neighborhood ?? branch.city}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-300">
              No somos sólo una web: tenemos un local con depósito y taller propio en{" "}
              {branch.address}, sobre una avenida de acceso directo desde todo el corredor norte de
              Córdoba. Podés venir a ver el neumático antes de comprarlo, hacer la colocación en el
              momento y resolver cualquier tema de garantía en persona.
            </p>
            <dl className="mt-6 space-y-2 text-slate-300">
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
                <dd>
                  Por orden de llegada, sin turno.{" "}
                  <Link href="/herramientas/mejor-horario-gomeria" className="font-bold text-white underline underline-offset-4">
                    Ver cuándo está más tranquilo
                  </Link>
                </dd>
              </div>
            </dl>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`/sucursales/${branch.id}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 text-sm font-black text-white transition-transform active:scale-[0.98] hover:bg-orange-600"
              >
                <DirectionsIcon className="h-6 w-6" />
                Cómo llegar
              </Link>
              <WhatsAppLink
                href={`https://wa.me/${branch.whatsapp}`}
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
            {branch.facadePhoto && (
              <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-xl">
                <Image
                  src={branch.facadePhoto}
                  alt={`Fachada del local de Neumáticos Trivium ${branch.shortName}`}
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
            <ZonasPorProvincia />
          </div>
        </div>
      </div>
    </section>
  );
}
