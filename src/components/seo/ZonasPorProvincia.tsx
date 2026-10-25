import Link from "next/link";
import { localidadesAgrupadas } from "@/lib/localidades";

const GRUPOS = [
  { titulo: "Córdoba", provincias: ["Córdoba"] },
  { titulo: "Buenos Aires", provincias: ["Buenos Aires", "Ciudad Autónoma de Buenos Aires"] },
];

// Contornos simplificados (dibujados a mano, no cartografía oficial) para usar
// como ícono: viewBox ajustado a cada provincia, con la proporción corregida por la latitud.
const CONTORNOS: Record<string, { d: string; w: number; h: number }> = {
  "Córdoba": { d: "M0.0,20.2 L3.9,8.3 L11.7,0.9 L22.5,0.0 L35.0,0.9 L45.9,7.3 L52.1,16.5 L58.3,31.2 L57.5,45.9 L56.0,61.5 L56.8,75.2 L50.5,85.3 L38.9,92.7 L26.4,100.0 L13.2,100.0 L9.3,89.0 L4.7,73.4 L6.2,56.9 L1.6,42.2 L3.9,31.2Z", w: 58.3, h: 100.0 },
  "Buenos Aires": { d: "M32.1,0.0 L43.0,7.4 L51.3,13.9 L59.1,21.6 L65.3,28.1 L68.9,39.1 L62.7,47.5 L60.6,58.5 L53.9,67.6 L43.5,70.9 L32.6,72.2 L22.8,73.4 L13.5,72.2 L11.4,78.0 L13.0,90.9 L5.2,100.0 L0.0,90.9 L0.0,71.5 L0.0,52.1 L0.0,32.6 L0.0,17.1 L8.8,11.3 L13.0,4.1 L22.8,0.3Z", w: 68.9, h: 100.0 },
};

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
              <span className="flex items-center gap-3">
                {CONTORNOS[titulo] && (
                  <svg
                    aria-hidden
                    viewBox={`0 0 ${CONTORNOS[titulo].w} ${CONTORNOS[titulo].h}`}
                    className="h-9 w-auto shrink-0 fill-orange-500"
                    style={{ aspectRatio: `${CONTORNOS[titulo].w} / ${CONTORNOS[titulo].h}` }}
                  >
                    <path d={CONTORNOS[titulo].d} strokeLinejoin="round" />
                  </svg>
                )}
                <span>
                {titulo}
                <span className="ml-2 text-sm font-normal text-slate-400">
                  {delGrupo.length} {delGrupo.length === 1 ? "zona" : "zonas"}
                </span>
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
