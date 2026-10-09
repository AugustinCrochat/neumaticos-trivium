import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopPage } from "@/components/ui/ShopPage";
import { getProductosDesdePOS, getAccesoriosDesdePOS } from "@/lib/pos-api";
import { getSelectedBranchSlug } from "@/lib/branch-server";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Catálogo de neumáticos a precio de outlet",
  description:
    "Todo el catálogo de neumáticos importados a precio outlet: filtrá por marca, medida, tipo de vehículo y precio. Cubiertas para auto y camioneta con stock real y envío a todo el país.",
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
