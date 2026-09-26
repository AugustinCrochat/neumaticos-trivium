import Link from "next/link";
import type { TireProduct } from "@/lib/types";
import { BRANCHES } from "@/lib/config";
import { ProductCard } from "@/components/ui/ProductCard";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import type { Faq } from "@/lib/seo";
import { formatSize, sizeSlug, sizesFromCatalog } from "@/lib/tire-sizes";

/**
 * Landing por categoría de neumático (A/T, carga), hermana de RimLanding pero
 * con el orden invertido: acá el producto es la búsqueda (alguien que ya sabe
 * que quiere un A/T o un de carga), no la medida, así que el listado va
 * primero y las medidas quedan como referencia al final en vez de ocupar el
 * lugar que en /neumaticos/[medida] tiene el resumen con precio desde.
 */
export function CategoryLanding({
  crumbLabel,
  path,
  title,
  productos,
  faqs,
}: {
  crumbLabel: string;
  path: string;
  title: string;
  productos: TireProduct[];
  faqs: Faq[];
}) {
  const branch = BRANCHES[0];
  const ordenados = [...productos].sort(
    (a, b) => Number(b.enStock) - Number(a.enStock) || a.price - b.price
  );
  const medidas = sizesFromCatalog(productos);
  const medidasConStock = new Set(
    productos.filter((p) => p.enStock).map((p) => sizeSlug(p.size))
  ).size;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs
        crumbs={[
          { name: "Inicio", path: "/" },
          { name: "Neumáticos", path: "/neumaticos" },
          { name: crumbLabel, path },
        ]}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-black leading-tight text-navy-900 md:text-5xl">{title}</h1>
      </header>

      {ordenados.length > 0 ? (
        <section className="mb-14">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {ordenados.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : (
        <section className="mb-14 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-slate-600">
          Ahora mismo no tenemos stock, pero consultanos por WhatsApp: te decimos cuándo entra.
        </section>
      )}

      {medidas.length > 0 && (
        <section className="mb-14">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-black text-navy-900">Medidas disponibles</h2>
            {medidasConStock > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {medidasConStock} {medidasConStock === 1 ? "medida" : "medidas"} con stock hoy
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {medidas.map(({ size, count }) => (
              <Link
                key={sizeSlug(size)}
                href={`/neumaticos/${sizeSlug(size)}`}
                className="rounded-xl border border-slate-200 bg-white p-4 text-center transition-colors hover:border-orange-400"
              >
                <span className="block font-black text-navy-900">{formatSize(size)}</span>
                <span className="mt-1 block text-xs font-bold text-slate-500">
                  {count} {count === 1 ? "modelo" : "modelos"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <FaqSection faqs={faqs} />

      <section className="mt-14 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-xl font-black text-navy-900">¿No encontrás lo que buscás?</h2>
        <p className="mt-2 max-w-2xl leading-relaxed text-slate-600">
          Escribinos con la medida o el uso que necesitás y te decimos si la tenemos, cuándo ingresa
          o qué alternativa te sirve. Atendemos de {branch.hours.toLowerCase()} en {branch.address},{" "}
          {branch.city}.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/neumaticos"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-black px-6 text-sm font-black text-white transition-transform active:scale-[0.98]"
          >
            Ver todas las medidas
          </Link>
          <Link
            href="/calculadora-equivalencia-neumaticos"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-black text-navy-900 transition-colors hover:border-navy-400"
          >
            Calculadora de equivalencias
          </Link>
        </div>
      </section>
    </div>
  );
}
