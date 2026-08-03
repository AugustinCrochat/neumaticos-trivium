import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAccesoriosDesdePOS, getProductosDesdePOS } from "@/lib/pos-api";
import { BRANCHES } from "@/lib/config";
import { ORGANIZATION_ID, NOINDEX, SITE_NAME, branchNodeId } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

/**
 * Página de "disponibilidad en tienda" que Merchant Center pide para el
 * complemento de fichas locales/inventario local: a diferencia de
 * /productos/[slug] (fijo por producto, sin sucursal), esta resuelve por
 * `id` + `store_code` — los dos parámetros que Google arma solo con
 * `{id}`/`{store_code}` al rastrear. Con una sola sucursal hoy alcanzaría con
 * la ficha normal, pero apenas haya una segunda, Google necesita saber en
 * CUÁL de las dos hay stock, y eso solo lo resuelve esta URL.
 *
 * Configurar en Merchant Center (Crecimiento → complemento de inventario
 * local → Páginas de producto → "URL de disponibilidad en tienda"):
 *   https://neumaticos.trivium.ar/disponibilidad-en-tienda?id={id}&store_code={store_code}
 */
export const revalidate = 300;

type Props = { searchParams: Promise<{ id?: string; store_code?: string }> };

async function findItem(id: string, sucursalSlug: string) {
  const [productos, accesorios] = await Promise.all([
    getProductosDesdePOS(sucursalSlug),
    getAccesoriosDesdePOS(sucursalSlug),
  ]);
  const producto = productos.find((p) => p.id === id);
  if (producto) return { kind: "tire" as const, item: producto };
  const accesorio = accesorios.find((a) => a.id === id);
  if (accesorio) return { kind: "accessory" as const, item: accesorio };
  return null;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { id, store_code } = await searchParams;
  const branch = BRANCHES.find((b) => b.googleStoreCode === store_code);
  if (!id || !branch) return NOINDEX;
  return { title: `Disponibilidad en ${branch.name}`, ...NOINDEX };
}

export default async function DisponibilidadEnTiendaPage({ searchParams }: Props) {
  const { id, store_code } = await searchParams;
  const branch = BRANCHES.find((b) => b.googleStoreCode === store_code);
  if (!id || !branch) notFound();

  const found = await findItem(id, branch.id);
  if (!found) notFound();
  const { kind, item } = found;

  const name = kind === "tire" ? `${item.brand} ${item.model}` : item.nombre;
  const productPath = kind === "tire" ? `/productos/${item.slug}` : `/tuercas-antirrobo/${item.slug}`;
  const enStock = item.enStock;
  const stock = item.stock;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name,
          sku: item.id,
          offers: {
            "@type": "Offer",
            priceCurrency: "ARS",
            price: item.price,
            availability: enStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
            seller: { "@id": ORGANIZATION_ID },
            availableAtOrFrom: { "@id": branchNodeId(branch) },
            ...(typeof stock === "number" ? { inventoryLevel: { "@type": "QuantitativeValue", value: stock } } : {}),
          },
        }}
      />

      <p className="text-xs font-black uppercase tracking-widest text-navy-400 mb-2">{SITE_NAME} · {branch.name}</p>
      <h1 className="text-2xl font-black text-navy-950 mb-6">{name}</h1>

      <div className="rounded-2xl border border-slate-200 p-6 flex items-center gap-4">
        <span className={`w-3 h-3 rounded-full shrink-0 ${enStock ? "bg-emerald-500" : "bg-slate-300"}`} />
        <div>
          <p className="font-bold text-navy-900">
            {enStock ? `Disponible en ${branch.name}` : `Sin stock en ${branch.name}`}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {branch.address}, {branch.city} · {branch.hours}
          </p>
          {enStock && typeof stock === "number" && (
            <p className="text-sm text-slate-500 mt-1">Unidades disponibles: {stock}</p>
          )}
        </div>
      </div>

      <Link href={productPath} className="inline-block mt-8 font-bold text-navy-700 hover:text-navy-900 transition-colors">
        Ver ficha completa del producto →
      </Link>
    </div>
  );
}
