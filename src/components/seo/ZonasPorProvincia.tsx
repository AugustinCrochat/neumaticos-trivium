import Link from "next/link";
import { localidadesAgrupadas } from "@/lib/localidades";

const GRUPOS = [
  { titulo: "Córdoba", provincias: ["Córdoba"] },
  { titulo: "Buenos Aires", provincias: ["Buenos Aires", "Ciudad Autónoma de Buenos Aires"] },
];

// Contornos de las provincias (geoBoundaries gbOpen, CC BY 4.0, simplificados
// para usarlos de ícono): viewBox ajustado a cada una, con la proporción
// corregida por la latitud.
const CONTORNOS: Record<string, { d: string; w: number; h: number }> = {
  "Córdoba": { d: "M43.2,88.9L48.3,79.8L55.0,69.0L59.4,63.7L59.5,60.8L58.9,59.4L57.7,58.0L57.7,55.0L55.8,53.1L53.4,49.2L53.6,46.2L53.0,41.7L53.6,40.6L54.9,39.5L58.8,23.8L58.6,23.1L55.3,18.7L56.2,12.4L55.4,11.7L53.7,6.6L53.2,6.3L38.2,6.7L37.1,6.4L34.8,4.5L33.6,4.0L29.3,3.5L27.4,2.5L26.2,1.0L24.2,0.1L22.6,0.0L16.1,1.7L12.5,2.5L13.1,7.4L10.0,11.0L8.7,11.8L5.7,12.3L0.0,29.8L0.0,43.8L1.7,44.0L6.7,46.8L7.8,48.4L8.6,51.6L9.0,51.9L12.6,51.8L13.1,54.7L13.1,56.8L10.7,63.4L10.8,65.8L9.3,67.5L9.2,68.3L9.9,76.2L10.5,99.9L35.6,100.0L35.0,88.9Z", w: 59.5, h: 100.0 },
  "Buenos Aires": { d: "M36.7,39.1L36.4,38.7L36.4,38.1L37.6,36.8L38.2,36.5L37.1,34.7L36.9,33.9L36.8,30.9L37.3,27.8L37.4,27.3L39.3,26.9L39.5,26.6L39.2,24.2L39.3,22.9L39.0,21.5L39.8,19.6L39.1,18.5L39.4,17.8L39.0,16.7L39.0,15.9L40.0,15.3L40.6,13.7L40.6,13.1L40.1,12.3L40.0,11.9L41.1,10.3L41.4,9.5L42.0,6.3L41.4,4.9L41.2,4.0L40.4,2.6L39.8,1.9L39.0,0.8L36.0,0.0L34.9,0.5L33.6,0.5L33.0,0.7L31.8,1.6L31.4,1.7L30.0,1.2L28.7,1.6L28.5,1.9L28.8,3.6L28.6,5.1L25.0,10.4L24.6,11.3L23.6,12.9L22.5,14.3L21.3,14.5L20.5,15.9L20.3,19.4L20.0,20.4L19.7,22.5L20.4,24.8L21.6,27.1L23.4,28.9L22.4,29.9L22.3,30.7L21.7,31.7L21.3,31.9L20.9,31.9L20.0,31.2L18.2,31.4L13.8,36.9L12.5,38.8L0.1,38.9L0.5,48.0L0.6,57.3L0.2,84.7L0.0,92.1L0.2,97.0L2.4,97.3L3.4,97.7L4.2,98.5L4.8,100.0L8.7,98.1L9.1,97.7L9.7,96.3L9.7,95.9L9.4,95.6L7.9,94.4L7.3,93.9L7.1,93.4L8.1,92.2L8.2,91.7L8.2,90.3L8.5,89.8L9.7,88.6L10.3,85.7L10.0,84.7L9.7,84.3L8.7,83.8L8.3,83.3L8.3,81.4L7.6,80.1L7.8,79.6L8.1,79.3L9.0,79.3L10.2,79.9L10.6,80.6L10.6,81.1L10.2,82.1L10.3,82.5L11.2,83.0L11.5,82.9L11.7,82.6L11.9,81.7L13.0,81.2L20.9,80.7L30.0,78.9L34.6,77.7L38.4,76.5L40.4,75.6L42.7,74.4L44.2,73.3L44.5,72.9L44.6,71.3L46.1,69.1L47.9,67.2L49.5,64.2L50.7,62.7L50.9,62.0L50.3,56.9L50.1,56.7L49.7,56.7L49.0,57.0L47.7,56.5L46.2,55.2L45.6,54.0L45.3,52.7L45.4,51.6L46.4,50.2L47.0,49.0L47.0,48.5L45.8,46.6L44.4,45.5L43.7,44.7L41.5,43.3L38.1,41.9L37.6,42.5L36.7,42.7L36.1,42.6L35.4,42.1L35.1,41.3L35.1,40.5L35.7,39.6Z", w: 50.9, h: 100.0 },
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
