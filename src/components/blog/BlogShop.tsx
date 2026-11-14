import Link from "@/components/ui/Link";
import { SizeOrVehicleSearch } from "@/components/ui/SizeOrVehicleSearch";
import { blogMeta } from "@/lib/blog-meta";
import { BlogCover } from "@/components/blog/BlogCover";
import { BlogVidriera } from "@/components/blog/BlogVidriera";
import { PrecioTag } from "@/components/ui/PrecioTag";
import { getProductosDesdePOS, getServiciosPrecios } from "@/lib/pos-api";
import { money, precioDesde } from "@/lib/precios-hoy";
import { preciosTaller } from "@/lib/servicios-seo";

/**
 * Atajos de compra para quien llegó por una duda puntual: la sección más
 * visible de la nota. Cada atajo lleva, cuando se puede calcular, el precio
 * "desde" de la página a la que apunta (catálogo y taller del build): un
 * número concreto invita a hacer clic mucho más que el nombre de una sección.
 * El primero va en rojo y es el camino principal.
 */
function Flechas() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path d="M5 5l7 7-7 7M13 5l7 7-7 7" />
    </svg>
  );
}

export async function BlogShopLinks({ slug }: { slug: string }) {
  const { shopIntro, shopLinks } = blogMeta(slug);
  const [productos, servicios] = await Promise.all([getProductosDesdePOS(), getServiciosPrecios()]);
  const taller = preciosTaller(servicios);
  return (
    <nav aria-label="Productos relacionados con esta nota" className="rounded-lg bg-black p-4 sm:p-5">
      <p className="font-display mb-3 text-2xl font-extrabold uppercase italic leading-none text-white">{shopIntro}</p>
      <ul className="grid gap-2.5 sm:grid-cols-3">
        {shopLinks.map((l, i) => {
          const desde = precioDesde(l.href, productos, taller);
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`flex h-full min-h-14 items-center justify-between gap-2 rounded-md px-4 py-2.5 text-left !no-underline transition-all active:scale-[0.98] ${
                  i === 0 ? "bg-orange-500 !text-white hover:bg-orange-600" : "border border-white/25 bg-white/10 !text-white hover:border-white hover:bg-white/20"
                }`}
              >
                <span className="flex flex-col gap-1">
                  <span className="text-sm font-black leading-tight">{l.label}</span>
                  {desde && (
                    <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-white/80">
                      desde <PrecioTag size="sm">{money(desde)}</PrecioTag>
                    </span>
                  )}
                </span>
                <Flechas />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Vidriera con precio de hoy y, debajo, el buscador por medida o por auto. */
export function BlogSearchCard({ slug, title = "¿Cuál es tu medida?", sinProductos = false }: { slug: string; title?: string; sinProductos?: boolean }) {
  return (
    <>
      <BlogVidriera slug={slug} sinProductos={sinProductos} />
      <section aria-label={title} className="my-10">
        <SizeOrVehicleSearch compact hideLearnLink />
      </section>
    </>
  );
}

/**
 * Portada y atajos para las notas con maquetado propio (las que no usan
 * ArticleLayout). Lleva su propio ancho y márgenes.
 */
export function BlogCoverStrip({ slug }: { slug: string }) {
  const { cover } = blogMeta(slug);
  return (
    <div className="mx-auto max-w-3xl px-4 pt-8">
      <BlogCover image={cover} priority sizes="(min-width: 768px) 768px, 100vw" className="aspect-[16/9] rounded-lg sm:aspect-[2/1]" />
      <div className="mt-5">
        <BlogShopLinks slug={slug} />
      </div>
    </div>
  );
}

/** Buscador a ancho de columna para las notas con maquetado propio. */
export function BlogSearchStrip({ slug }: { slug: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <BlogSearchCard slug={slug} />
    </div>
  );
}
