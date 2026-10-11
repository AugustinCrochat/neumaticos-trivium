import Image from "next/image";
import Link from "next/link";
import { BRANCHES } from "@/lib/config";
import { LOCALIDADES } from "@/lib/localidades";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

/** "Córdoba, Argüello, Villa Allende y Saldán" — lista en prosa, con "y" final. */
const ZONAS_EN_PROSA = LOCALIDADES.map((l) => l.name).reduce((acc, name, i, arr) => {
  if (i === 0) return name;
  return i === arr.length - 1 ? `${acc} y ${name}` : `${acc}, ${name}`;
}, "");

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
              <WhatsAppLink
                href={`https://wa.me/${branch.whatsapp}`}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-black text-white transition-colors hover:bg-white/10"
              >
                Escribir por WhatsApp
              </WhatsAppLink>
            </div>
          </div>

          {/* Las localidades se nombran en prosa, no como grilla de accesos
              directos: la señal geográfica para el pack local la da el texto,
              y una botonera de ocho zonas en la home competía con el CTA real
              sin que nadie la usara para navegar. Las landings de
              /neumaticos-en siguen enlazadas desde el footer y el sitemap. */}
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
            <p className="mt-2 leading-relaxed text-slate-300">
              Atendemos Córdoba Capital y todo el corredor de Sierras Chicas:{" "}
              {ZONAS_EN_PROSA}. Si estás en cualquiera de esas zonas, el retiro en el local no tiene
              costo y la colocación va incluida.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
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
