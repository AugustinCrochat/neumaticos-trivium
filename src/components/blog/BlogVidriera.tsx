import Image from "next/image";
import Link from "@/components/ui/Link";
import { PrecioTag } from "@/components/ui/PrecioTag";
import { SortedProductGrid } from "@/components/ui/SortedProductGrid";
import { TallerChips } from "@/components/blog/TallerChips";
import { getProductosDesdePOS, getServiciosPrecios } from "@/lib/pos-api";
import { peersByGroup } from "@/lib/best-price";
import { BLOG_POSTS } from "@/lib/data";
import { money, notaDeCamioneta } from "@/lib/precios-hoy";
import { COMBO_ID, preciosTaller } from "@/lib/servicios-seo";
import { MEDIDAS_PRIORITARIAS, formatSize, sizeSlug, sizesEqual } from "@/lib/tire-sizes";
import type { TireProduct, TireSize } from "@/lib/types";

const CATEGORIAS_TALLER = ["Servicios", "Mantenimiento"];

const Flechas = () => (
  <svg aria-hidden="true" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="square" d="M5 5l7 7-7 7M13 5l7 7-7 7" />
  </svg>
);

// Primero los que tienen colchón de stock: el catálogo se congela en cada build
// y uno con 1 unidad puede agotarse antes del próximo.
const porStockYPrecio = (a: TireProduct, b: TireProduct) =>
  Number((b.stock ?? 0) >= 3) - Number((a.stock ?? 0) >= 3) || a.price - b.price;

/**
 * Vidriera en medio de la nota: el paso de "estoy leyendo" a "estoy mirando un
 * producto". En vez de un enlace genérico al catálogo muestra algo concreto
 * con precio de hoy y un clic directo a la ficha:
 *  - notas de taller (Servicios, Mantenimiento): el combo de alineado y
 *    balanceado con su precio del POS;
 *  - notas de una medida o una marca (se lee del slug): productos de esa
 *    medida o marca;
 *  - el resto: el más barato con stock de las medidas más pedidas.
 * Si no hay nada con stock para mostrar, no se dibuja.
 */
export async function BlogVidriera({ slug, sinProductos = false }: { slug: string; sinProductos?: boolean }) {
  const categoria = BLOG_POSTS.find((p) => p.slug === slug)?.category ?? "";

  if (CATEGORIAS_TALLER.includes(categoria)) {
    const taller = preciosTaller(await getServiciosPrecios());
    if (!taller.comboAuto) return null;
    return (
      <section aria-label="Alineado y balanceado en nuestro taller" className="my-10 grid overflow-hidden rounded-lg border-2 border-black bg-black text-white sm:grid-cols-[2fr_3fr]">
        <div className="relative min-h-44">
          <Image src="/images/local/alineadora-3d-hofmann-geoliner-630-con-target-en-la-rueda-trivium-cordoba.webp" alt="Alineadora 3D con el target colocado en la rueda, en el taller de Trivium" fill sizes="(min-width: 640px) 300px, 100vw" className="object-cover" />
        </div>
        <div className="p-5">
          <p className="text-xs font-black uppercase tracking-widest text-orange-400">En nuestro taller</p>
          <p className="font-display mt-1 text-3xl font-extrabold uppercase italic leading-none">Alineado 3D + 4 balanceados</p>
          {(() => {
            // Notas de camionetas: el precio de camioneta va primero y solo; si no, auto y camioneta, cada uno con su rótulo.
            const camioneta = notaDeCamioneta(slug) && taller.comboCamioneta;
            const col = (rotulo: string, precio: number, principal = true) => (
              <div>
                <span className="mb-1 block text-[11px] font-black uppercase tracking-widest text-slate-400">{rotulo}</span>
                <PrecioTag size={principal ? "lg" : "md"}>{money(precio)}</PrecioTag>
              </div>
            );
            return (
              <div className="mt-3 flex flex-wrap items-end gap-x-8 gap-y-3">
                {camioneta ? col("Camioneta", taller.comboCamioneta!) : col("Auto", taller.comboAuto!)}
                {camioneta
                  ? col("Auto", taller.comboAuto!, false)
                  : taller.comboCamioneta
                    ? col("Camioneta", taller.comboCamioneta, false)
                    : null}
              </div>
            );
          })()}
          <div className="mt-4">
            <TallerChips />
          </div>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link href={`/servicios/${COMBO_ID}`} className="inline-flex min-h-12 items-center gap-2 rounded-md bg-orange-500 px-5 text-sm font-black !text-white !no-underline transition-colors hover:bg-orange-600">
              Ver qué incluye <Flechas />
            </Link>
            <Link href="/herramientas/mejor-horario-gomeria" className="inline-flex min-h-12 items-center rounded-md border border-white/30 px-5 text-sm font-black !text-white !no-underline transition-colors hover:bg-white/10">
              ¿A qué hora hay menos gente?
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (sinProductos) return null;
  const catalogo = await getProductosDesdePOS();
  const conStock = catalogo.filter((p) => p.enStock && !p.isCarga);

  let titulo = "Precios de hoy";
  let detalle = "El más barato con stock de las medidas más pedidas.";
  let verTodo = { href: "/neumaticos", texto: "Buscar mi medida" };
  let elegidos: TireProduct[] = [];

  const m = slug.match(/(\d{3})-(\d{2})-r(\d{2})/);
  const marca = [...new Set(conStock.map((p) => p.brandId))].find((id) => id.length > 3 && slug.includes(id));
  if (m) {
    const size: TireSize = { width: Number(m[1]), profile: Number(m[2]), rim: Number(m[3]) };
    elegidos = conStock.filter((p) => sizesEqual(p.size, size)).sort(porStockYPrecio).slice(0, 4);
    titulo = `${formatSize(size)} con stock hoy`;
    detalle = "Precio por unidad, con colocación y válvulas sin cargo en el local.";
    verTodo = { href: `/neumaticos/${sizeSlug(size)}`, texto: `Ver todos los ${formatSize(size)}` };
  } else if (marca) {
    elegidos = conStock.filter((p) => p.brandId === marca).sort(porStockYPrecio).slice(0, 4);
    const nombre = elegidos[0]?.brand ?? marca;
    titulo = `${nombre} con stock hoy`;
    detalle = "Los modelos más económicos de la marca, con precio por unidad.";
    verTodo = { href: `/marcas/${marca}`, texto: `Ver todo ${nombre}` };
  }
  if (elegidos.length === 0) {
    // Sin medida ni marca en la nota (o sin stock de ellas): las medidas más pedidas.
    elegidos = MEDIDAS_PRIORITARIAS.flatMap((size) => conStock.filter((p) => sizesEqual(p.size, size)).sort(porStockYPrecio).slice(0, 1)).slice(0, 4);
  }
  if (elegidos.length === 0) return null;
  const peers = peersByGroup(catalogo);

  return (
    <section aria-label={titulo} className="my-10 rounded-lg border-2 border-black bg-white p-4 sm:p-5 [&_a]:!no-underline">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div>
          <h2 className="font-display text-3xl font-extrabold uppercase italic leading-none text-black">{titulo}</h2>
          <p className="mt-1 text-sm text-slate-600">{detalle}</p>
        </div>
        <Link href={verTodo.href} className="inline-flex items-center gap-1.5 text-sm font-black text-orange-600 hover:text-orange-700">
          {verTodo.texto} <Flechas />
        </Link>
      </div>
      <SortedProductGrid
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        items={elegidos.map((p) => ({ product: p, peers: peers.get(p.id) }))}
      />
    </section>
  );
}
