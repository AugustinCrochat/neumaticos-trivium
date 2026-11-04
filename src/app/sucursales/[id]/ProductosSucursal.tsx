import Link from "@/components/ui/Link";
import type { Branch } from "@/lib/config";
import { formatSize, sizeSlug } from "@/lib/tire-sizes";
import { formatPrecio } from "@/lib/servicios";
import { LocalProductCarousel } from "@/app/neumaticos-en/LocalProductCarousel";
import type { DatosSucursal } from "./datos";

/**
 * Neumáticos de la sucursal: una fila de fichas con stock y precio (que se
 * corrigen en vivo en el navegador) y debajo las medidas más pedidas con su
 * precio, que llevan a la landing de cada medida.
 */
export function ProductosSucursal({ branch, datos }: { branch: Branch; datos: DatosSucursal }) {
  if (!datos.abierta || datos.conStock.length === 0) return null;
  const lugar = branch.neighborhood ?? branch.city;
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <p className="text-xs font-black uppercase tracking-widest text-orange-500">Neumáticos nuevos con stock</p>
      <h2 className="mt-1 text-xl font-black text-navy-900 md:text-2xl">Neumáticos baratos en {lugar}</h2>
      <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600">
        {datos.desde !== null && (
          <>
            Desde <strong className="text-navy-900">{formatPrecio(datos.desde)}</strong> por unidad.{" "}
          </>
        )}
        Importación directa, precio publicado igual al del local, un año de garantía y colocación sin cargo comprando las
        cubiertas en {branch.shortName}.
      </p>

      <div className="mt-4">
        <LocalProductCarousel
          productos={datos.conStock.slice(0, 24)}
          mejores={datos.mejores}
          titulo={`Neumáticos con stock en ${branch.shortName}`}
          sinTitulo
        />
      </div>

      {datos.medidas.length > 0 && (
        <div className="border-t border-slate-100 pt-4">
          <h3 className="mb-2 text-xs font-black uppercase tracking-wide text-slate-400">Medidas más pedidas en {branch.shortName}</h3>
          <ul className="flex flex-wrap gap-2">
            {datos.medidas.map((m) => (
              <li key={sizeSlug(m.size)}>
                <Link
                  href={`/neumaticos/${sizeSlug(m.size)}?sucursal=${branch.id}`}
                  className="inline-flex items-baseline gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-bold text-navy-800 transition-colors hover:border-orange-400 hover:text-orange-700"
                >
                  {formatSize(m.size)}
                  <span className="text-xs font-semibold text-slate-500">desde {formatPrecio(m.desde)}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link href="/catalogo" className="inline-block rounded-full bg-navy-900 px-3 py-1.5 text-sm font-bold text-white transition-colors hover:bg-black">
                Todo el catálogo
              </Link>
            </li>
          </ul>
        </div>
      )}
    </section>
  );
}
