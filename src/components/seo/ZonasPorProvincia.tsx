import Link from "@/components/ui/Link";
import { localidadesAgrupadas } from "@/lib/localidades";

const GRUPOS = [
  { titulo: "Córdoba", provincias: ["Córdoba"] },
  { titulo: "Buenos Aires", provincias: ["Buenos Aires", "Ciudad Autónoma de Buenos Aires"] },
];

/**
 * Zonas de la home: Córdoba y Buenos Aires como desplegables de primer nivel;
 * adentro, cada ciudad con sus barrios en un segundo desplegable. Todo es
 * <details> nativo, así que los enlaces están en el HTML aunque estén cerrados.
 */
export function ZonasPorProvincia() {
  const ciudades = localidadesAgrupadas();
  const summaryCls =
    "flex cursor-pointer select-none list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden";

  return (
    <div className="mt-2 space-y-3">
      {GRUPOS.map(({ titulo, provincias }) => {
        const delGrupo = ciudades.filter(({ ciudad }) => provincias.includes(ciudad.province));
        return (
          <details key={titulo} className="group rounded-xl border border-white/15 bg-white/5">
            <summary className={`${summaryCls} px-4 py-3 text-base font-bold text-white`}>
              <span>
                {titulo}
                <span className="ml-2 text-sm font-normal text-slate-400">
                  {delGrupo.length} {delGrupo.length === 1 ? "zona" : "zonas"}
                </span>
              </span>
              <span aria-hidden className="text-slate-400 transition-transform group-open:rotate-180">▾</span>
            </summary>
            <ul className="grid gap-x-6 gap-y-3 border-t border-white/10 px-4 py-4 sm:grid-cols-2">
              {delGrupo.map(({ ciudad, barrios }) => (
                <li key={ciudad.slug}>
                  <Link
                    href={`/neumaticos-en/${ciudad.slug}`}
                    className="text-sm font-semibold text-zinc-200 transition-colors hover:text-white"
                  >
                    Neumáticos en {ciudad.name}
                  </Link>
                  {barrios.length > 0 && (
                    <details className="mt-1">
                      <summary className="inline-block cursor-pointer select-none list-none rounded-md border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400 hover:text-white [&::-webkit-details-marker]:hidden">
                        {barrios.length} {barrios.length === 1 ? "barrio" : "barrios y localidades"} ▾
                      </summary>
                      <div className="mt-2 flex flex-col gap-1.5 border-l border-zinc-700 pl-3">
                        {barrios.map((b) => (
                          <Link
                            key={b.slug}
                            href={`/neumaticos-en/${b.slug}`}
                            className="text-sm text-zinc-400 transition-colors hover:text-white"
                          >
                            {b.name}
                          </Link>
                        ))}
                      </div>
                    </details>
                  )}
                </li>
              ))}
            </ul>
          </details>
        );
      })}
    </div>
  );
}
