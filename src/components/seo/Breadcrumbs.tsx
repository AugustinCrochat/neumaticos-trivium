import Link from "next/link";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

/**
 * Migas de pan visibles + su JSON-LD.
 *
 * Van juntas a propósito: Google pide que el structured data describa contenido
 * que el usuario realmente ve en la página, así que emitir el BreadcrumbList
 * sin la navegación visible es motivo de acción manual por spam.
 *
 * El último elemento es la página actual y va sin link.
 */
export function Breadcrumbs({ crumbs, dark = false }: { crumbs: Crumb[]; dark?: boolean }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <nav aria-label="Migas de pan" className="mb-4 text-sm">
        <ol className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${dark ? "text-slate-400" : "text-slate-500"}`}>
          {crumbs.map((crumb, i) => {
            const esUltimo = i === crumbs.length - 1;
            return (
              <li key={crumb.path} className="flex items-center gap-2">
                {esUltimo ? (
                  <span className={`font-semibold ${dark ? "text-white" : "text-tire-950"}`} aria-current="page">
                    {crumb.name}
                  </span>
                ) : (
                  <>
                    <Link href={crumb.path} className={`transition-colors ${dark ? "hover:text-white" : "hover:text-orange-600"}`}>
                      {crumb.name}
                    </Link>
                    <span aria-hidden className={dark ? "text-slate-600" : "text-slate-300"}>
                      /
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
