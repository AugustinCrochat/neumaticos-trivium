import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopPage } from "@/components/ui/ShopPage";
import { getProductosDesdePOS, getAccesoriosDesdePOS } from "@/lib/pos-api";
import { getSelectedBranchSlug } from "@/lib/branch-server";
import { NOINDEX, canonical } from "@/lib/seo";

export const revalidate = 300;

type Props = { searchParams: Promise<{ medida?: string }> };

function parseMedida(medida: string) {
  const parts = medida.toLowerCase().split("-");
  const width = parts[0] ? Number(parts[0]) : null;
  const profile = parts[1] ? Number(parts[1]) : null;
  const rim = parts[2] && parts[2].startsWith("r") ? Number(parts[2].substring(1)) : null;
  if (!width && !profile && !rim) return null;
  return { width, profile, rim };
}

function formatSizeLabel(size: { width: number | null; profile: number | null; rim: number | null }) {
  const parts: (string | number)[] = [];
  if (size.width) parts.push(size.width);
  if (size.profile) parts.push(size.profile);
  const label = parts.join("/");
  if (size.rim) return label ? `${label} R${size.rim}` : `R${size.rim}`;
  return label || null;
}

/**
 * /buscar es el buscador interactivo, no una página de aterrizaje.
 *
 * Filtra en el cliente con useSearchParams, así que el HTML que recibe un
 * crawler no tiene ni H1 ni productos: es una cáscara. Por eso el contenido
 * indexable de cada medida vive en /neumaticos/[medida], renderizado en el
 * servidor.
 *
 * - Medida completa en la URL -> canonical apuntando a esa landing, para que
 *   cualquier enlace o posición histórica de /buscar?medida=... se consolide
 *   ahí en vez de competir contra ella.
 * - Medida parcial o ausente -> noindex, follow. No hay nada que indexar, pero
 *   el crawler sigue los enlaces internos hacia el catálogo.
 */
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { medida } = await searchParams;
  const parsed = medida ? parseMedida(medida) : null;

  if (!parsed) {
    return {
      title: "Buscar neumáticos por medida",
      description: "Buscá neumáticos por ancho, perfil y rodado y mirá stock y precio al instante.",
      ...NOINDEX,
    };
  }

  const label = formatSizeLabel(parsed);
  const esCompleta = parsed.width !== null && parsed.profile !== null && parsed.rim !== null;

  if (esCompleta) {
    const slug = `${parsed.width}-${parsed.profile}-r${parsed.rim}`;
    return {
      title: `Neumáticos ${label}`,
      description: `Encontrá neumáticos en medida ${label} al mejor precio. Outlet de neumáticos importados.`,
      alternates: canonical(`/neumaticos/${slug}`),
    };
  }

  return {
    title: `Neumáticos ${label}`,
    description: `Neumáticos que coinciden con ${label}. Outlet de neumáticos importados.`,
    ...NOINDEX,
  };
}

export default async function BuscarPage() {
  const sucursal = await getSelectedBranchSlug();
  const [productos, accesorios] = await Promise.all([getProductosDesdePOS(sucursal), getAccesoriosDesdePOS(sucursal)]);
  return (
    <Suspense>
      <ShopPage products={productos} accesorios={accesorios} />
    </Suspense>
  );
}
