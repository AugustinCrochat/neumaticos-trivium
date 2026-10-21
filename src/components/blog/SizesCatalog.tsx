import Link from "next/link";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { ProductCard } from "@/components/ui/ProductCard";
import { sizeSearchHref } from "@/lib/size-href";
import type { TireSize } from "@/lib/types";

const money = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

/**
 * Vidriera de varias medidas a la vez: de cada una muestra la cubierta más
 * barata con stock firme, y debajo un atajo por medida con la cantidad de opciones.
 * Las medidas sin stock se omiten solas, así la sección nunca queda con huecos
 * ni promete algo que no hay; se actualiza con cada deploy (ver sitemap.ts).
 */
export async function SizesCatalog({ sizes, limit = 8, branch = "arguello" }: { sizes: TireSize[]; limit?: number; branch?: string }) {
  const productos = (await getProductosDesdePOS(branch)).filter((p) => p.enStock && !p.isCarga);

  const rows = sizes
    .map((size) => {
      const items = productos
        .filter((p) => p.size.width === size.width && p.size.profile === size.profile && p.size.rim === size.rim)
        // Primero los que tienen colchón de stock (3 o más): el catálogo se
        // congela en cada build y uno con 1 unidad puede agotarse antes del
        // próximo, dejando una tarjeta "Sin stock" en una vidriera de stock.
        .sort((a, b) => Number((b.stock ?? 0) >= 3) - Number((a.stock ?? 0) >= 3) || a.price - b.price);
      return { size, items };
    })
    .filter((r) => r.items.length > 0);

  if (rows.length === 0) return null;

  return (
    <div className="not-prose [&_a]:!no-underline">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {rows.slice(0, limit).map(({ size, items }) => (
          <ProductCard key={items[0].id} product={items[0]} />
        ))}
      </div>
      <ul className="mt-6 flex flex-wrap gap-2">
        {rows.map(({ size, items }) => (
          <li key={`${size.width}${size.profile}${size.rim}`}>
            <Link
              href={sizeSearchHref(String(size.width), String(size.profile), String(size.rim))}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-black !text-white transition-colors hover:border-orange-400 hover:bg-orange-500"
            >
              {size.width}/{size.profile} R{size.rim}
              <span className="text-xs font-bold text-slate-300">
                {items.length} {items.length === 1 ? "opción" : "opciones"} · desde {money(Math.min(...items.map((i) => i.price)))}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
