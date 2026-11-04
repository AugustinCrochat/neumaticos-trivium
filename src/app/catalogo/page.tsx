import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopPage } from "@/components/ui/ShopPage";
import { getProductosDesdePOS, getAccesoriosDesdePOS } from "@/lib/pos-api";
import { getSelectedBranchSlug } from "@/lib/branch-server";
import { canonical, resumen } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Catálogo de neumáticos y cubiertas",
  description:
    resumen("Todo el catálogo de neumáticos importados a precio outlet: filtrá por marca, medida, tipo de vehículo y precio. Cubiertas para auto, camioneta, A/T y carga con stock real, retiro en nuestros locales de Córdoba y Buenos Aires."),
  alternates: canonical("/catalogo"),
};

export default async function CatalogoPage() {
  const sucursal = await getSelectedBranchSlug();
  const [productos, accesorios] = await Promise.all([getProductosDesdePOS(sucursal), getAccesoriosDesdePOS(sucursal)]);
  return (
    <Suspense>
      <ShopPage showCatalogTitle products={productos} accesorios={accesorios} />
    </Suspense>
  );
}
