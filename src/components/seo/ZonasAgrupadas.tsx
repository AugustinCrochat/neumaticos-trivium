import Link from "next/link";
import { localidadesAgrupadas } from "@/lib/localidades";

/**
 * Zonas que atendemos agrupadas por ciudad: los barrios y localidades menores
 * van en un desplegable (<details>, sin JS) bajo la ciudad que los engloba.
 * El contenido del desplegable está en el HTML, así que los enlaces siguen
 * siendo rastreables aunque estén cerrados.
 */
export function ZonasAgrupadas({
  variant,
  actual,
  prefijo = false,
  branchId,
}: {
  variant: "dark" | "light";
  /** slug de la página actual: se muestra sin enlace. */
  actual?: string;
  /** "Neumáticos en X" en vez del nombre solo (anchor text del footer). */
  prefijo?: boolean;
  /** Sólo las zonas que atiende esta sucursal. */
  branchId?: string;
}) {
  const dark = variant === "dark";
  const linkCls = dark
    ? "text-sm text-zinc-400 transition-colors hover:text-white"
    : "text-sm font-bold text-navy-900 transition-colors hover:text-orange-600";
  const ciudadCls = dark
    ? "text-sm font-semibold text-zinc-200 transition-colors hover:text-white"
    : "text-sm font-black text-navy-900 transition-colors hover:text-orange-600";
  const toggleCls = dark
    ? "cursor-pointer select-none rounded-md border border-zinc-800 px-2 py-0.5 text-xs text-zinc-400 hover:text-white"
    : "cursor-pointer select-none rounded-md border border-slate-200 px-2 py-0.5 text-xs font-bold text-slate-500 hover:text-navy-900";
  const panelCls = dark
    ? "mt-2 flex flex-col gap-1.5 border-l border-zinc-800 pl-3"
    : "mt-2 flex flex-col gap-1.5 border-l border-slate-200 pl-3";

  const item = (slug: string, name: string, cls: string, label: string) =>
    slug === actual ? (
      <span aria-current="page" className={dark ? "text-sm font-bold text-white" : "text-sm font-black text-orange-600"}>
        {label}
      </span>
    ) : (
      <Link href={`/neumaticos-en/${slug}`} className={cls}>
        {label}
      </Link>
    );

  return (
    <ul className="grid grid-cols-1 items-start gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
      {localidadesAgrupadas().filter(({ ciudad }) => !branchId || ciudad.branchId === branchId).map(({ ciudad, barrios }) => (
        <li key={ciudad.slug}>
          <div className="flex items-center gap-2">
            {item(ciudad.slug, ciudad.name, ciudadCls, prefijo ? `Neumáticos en ${ciudad.name}` : ciudad.name)}
          </div>
          {barrios.length > 0 && (
            <details className="mt-1">
              <summary className={`${toggleCls} inline-block list-none [&::-webkit-details-marker]:hidden`}>
                {barrios.length} {barrios.length === 1 ? "barrio" : "barrios y localidades"} ▾
              </summary>
              <div className={panelCls}>
                {barrios.map((b) => (
                  <span key={b.slug}>{item(b.slug, b.name, linkCls, b.name)}</span>
                ))}
              </div>
            </details>
          )}
        </li>
      ))}
    </ul>
  );
}
