import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopPage } from "@/components/ui/ShopPage";
import { getProductosDesdePOS, getAccesoriosDesdePOS } from "@/lib/pos-api";
import { getSelectedBranchSlug } from "@/lib/branch-server";
import { canonical } from "@/lib/seo";

export const revalidate = 300;
// El Worker recibe POS_API_BASE_URL en runtime. Si esta ruta se prerenderiza
// durante el build, la variable todavía no está disponible y se termina
// publicando un catálogo vacío hasta la próxima revalidación.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo de neumáticos y cubiertas",
  description:
    "Todo el catálogo de neumáticos importados a precio outlet: filtrá por marca, medida, tipo de vehículo y precio. Stock real y envío a todo el país.",
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
