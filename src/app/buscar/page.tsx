import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopPage } from "@/components/ui/ShopPage";
import { getProductosDesdePOS, getAccesoriosDesdePOS } from "@/lib/pos-api";
import { getSelectedBranchSlug } from "@/lib/branch-server";
import { NOINDEX } from "@/lib/seo";

/**
 * /buscar es el buscador interactivo, no una página de aterrizaje.
 *
 * Filtra en el cliente con useSearchParams, así que el HTML que recibe un
 * crawler no tiene ni H1 ni productos: es una cáscara. Por eso el contenido
 * indexable de cada medida vive en /neumaticos/[medida], renderizado en el
 * servidor.
 *
 * Siempre noindex, follow, y sin leer searchParams a propósito: generateMetadata
 * con searchParams volvía dinámica la ruta y renderizaba el catálogo entero en
 * el Worker en cada visita (1102). Así sale estática.
 */
export const metadata: Metadata = {
  title: "Buscar neumáticos por medida",
  description: "Buscá neumáticos por ancho, perfil y rodado y mirá stock y precio al instante.",
  ...NOINDEX,
};

export default async function BuscarPage() {
  const sucursal = await getSelectedBranchSlug();
  const [productos, accesorios] = await Promise.all([getProductosDesdePOS(sucursal), getAccesoriosDesdePOS(sucursal)]);
  return (
    <Suspense>
      <ShopPage products={productos} accesorios={accesorios} />
    </Suspense>
  );
}
