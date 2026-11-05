import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopPage } from "@/components/ui/ShopPage";
import { CatalogoCrawlable } from "@/components/ui/CatalogoCrawlable";
import { PreselectBranch } from "@/components/ui/PreselectBranch";
import { getProductosDesdePOS, getAccesoriosDesdePOS } from "@/lib/pos-api";
import { getRegion, sucursalesDeRegion } from "@/lib/regiones";
import { canonical } from "@/lib/seo";

export const dynamic = "force-static";

const region = getRegion("buenos-aires")!;
const sucursal = sucursalesDeRegion(region)[0];

export const metadata: Metadata = {
  title: `Catálogo de neumáticos en ${region.nombre}`,
  description: `Catálogo de neumáticos con el precio y el stock de nuestro local de ${sucursal.shortName}, ${region.nombre}. Filtrá por marca, medida, tipo de vehículo y precio.`,
  alternates: canonical("/buenos-aires/catalogo"),
};

export default async function Page() {
  const [productos, accesorios] = await Promise.all([getProductosDesdePOS(sucursal.id), getAccesoriosDesdePOS(sucursal.id)]);
  return (
    <Suspense fallback={<CatalogoCrawlable productos={productos} />}>
      <PreselectBranch branchId={sucursal.id} forzar />
      <ShopPage showCatalogTitle products={productos} accesorios={accesorios} />
    </Suspense>
  );
}
