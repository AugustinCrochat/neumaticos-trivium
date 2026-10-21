import Link from "next/link";
import { SortedProductGrid } from "@/components/ui/SortedProductGrid";
import { FEATURED_TIRE_IDS } from "@/lib/featured";
import { peersByGroup } from "@/lib/best-price";
import type { TireProduct } from "@/lib/types";

/**
 * Grilla de productos con precio real justo debajo del hero — reemplaza el
 * lugar que antes ocupaba ValueSection (tarjetas de marketing sin datos
 * reales tipo "–40% vs. mercado"). La selección es manual (ver
 * FEATURED_TIRE_IDS): no hay campo "destacado" en el POS.
 */
export function FeaturedProductsSection({ productos }: { productos: TireProduct[] }) {
  const destacados = FEATURED_TIRE_IDS.map((id) => productos.find((p) => p.id === id)).filter(
    (p): p is TireProduct => !!p
  );

  if (destacados.length === 0) return null;
  // El tag "Mejor precio" se decide contra todo el catálogo, no sólo los destacados.
  const peers = peersByGroup(productos);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl font-bold uppercase tracking-wide text-navy-900">Precios de hoy</h2>
          </div>
          <Link
            href="/catalogo"
            className="shrink-0 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-navy-900 transition-colors hover:border-navy-400"
          >
            Ver catálogo completo →
          </Link>
        </div>

        <SortedProductGrid
          className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6"
          items={destacados.map((producto) => ({ product: producto, peers: peers.get(producto.id) }))}
        />
      </div>
    </section>
  );
}
