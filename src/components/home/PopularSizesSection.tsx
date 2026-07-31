import Link from "next/link";
import { DEFAULT_BRANCH_ID, TIRE_RIMS } from "@/lib/config";
import { getProductosDesdePOS } from "@/lib/pos-api";
import {
  MEDIDAS_PRIORITARIAS,
  formatSize,
  rimSlug,
  sizeSlug,
  sizesFromCatalog,
} from "@/lib/tire-sizes";

/**
 * Grilla de medidas en la home.
 *
 * Cumple dos funciones a la vez: le da al visitante un atajo a su medida sin
 * tener que tipear, y le da al crawler enlaces directos desde la página de más
 * autoridad del sitio hacia las landings de medida, que son las que tienen que
 * rankear. Sin esta grilla, esas páginas cuelgan sólo del hub y del footer.
 */
export async function PopularSizesSection() {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const enStock = productos.filter((p) => p.enStock);

  // Las que tienen stock primero, completadas con prioritarias hasta 18. Así la
  // grilla nunca se ve vacía aunque el catálogo esté bajo.
  const conStock = sizesFromCatalog(enStock);
  const yaListadas = new Set(conStock.map((s) => sizeSlug(s.size)));
  const medidas = [
    ...conStock.map((s) => ({ size: s.size, count: s.count })),
    ...MEDIDAS_PRIORITARIAS.filter((s) => !yaListadas.has(sizeSlug(s))).map((size) => ({
      size,
      count: 0,
    })),
  ].slice(0, 18);

  return (
    <section className="border-b border-slate-100 bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl font-black text-navy-900">Elegí tu medida</h2>
          <p className="mt-3 text-lg leading-relaxed text-slate-600">
            Estas son las medidas que más nos piden. Entrá a la tuya y vas a ver los modelos
            disponibles con precio y stock, los autos que la usan de fábrica y qué medidas
            equivalentes te sirven si la tuya está agotada.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {medidas.map(({ size, count }) => (
            <Link
              key={sizeSlug(size)}
              href={`/neumaticos/${sizeSlug(size)}`}
              className={`rounded-xl border p-4 text-center transition-colors ${
                count > 0
                  ? "border-slate-200 bg-white hover:border-orange-400"
                  : "border-dashed border-slate-200 bg-white/60 hover:border-navy-300"
              }`}
            >
              <span className="block font-black text-navy-900">{formatSize(size)}</span>
              <span className="mt-1 block text-xs font-bold text-slate-500">
                {count > 0 ? `${count} ${count === 1 ? "modelo" : "modelos"}` : "a pedido"}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="text-sm font-black uppercase tracking-widest text-slate-400">
            Por rodado
          </span>
          {TIRE_RIMS.filter((rim) => rim >= 13 && rim <= 18).map((rim) => (
            <Link
              key={rim}
              href={`/neumaticos/${rimSlug(rim)}`}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-navy-900 transition-colors hover:border-navy-400"
            >
              R{rim}
            </Link>
          ))}
          <Link
            href="/neumaticos"
            className="text-sm font-bold text-navy-700 underline underline-offset-2 hover:text-navy-900"
          >
            Ver todas las medidas
          </Link>
        </div>
      </div>
    </section>
  );
}
