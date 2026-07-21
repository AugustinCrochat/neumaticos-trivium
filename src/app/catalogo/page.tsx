import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopPage } from "@/components/ui/ShopPage";
import { getProductosDesdePOS, getAccesoriosDesdePOS } from "@/lib/pos-api";
import { getSelectedBranchSlug } from "@/lib/branch-server";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Catálogo de Neumáticos — Trivium",
  description: "Explorá todo el catálogo de neumáticos importados a precios outlet. Filtrá por marca, medida, tipo de vehículo y precio.",
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
