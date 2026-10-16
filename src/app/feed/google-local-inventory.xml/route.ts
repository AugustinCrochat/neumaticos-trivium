import { getProductosDesdePOS, getAccesoriosDesdePOS } from "@/lib/pos-api";
import { BRANCHES, SITE_URL, type Branch } from "@/lib/config";
import type { TireProduct, Accessory } from "@/lib/types";

// Feed de inventario local para Google Merchant Center ("Añadir inventario
// local desde un archivo"): un <item> por producto y por sucursal, con
// stock real de esa sucursal — habilita fichas locales sin coste y
// anuncios de inventario local (ver excluded_destination en
// google-merchant.xml, que se saca una vez que este feed está anda bien).
// g:id tiene que ser idéntico al id que usa ESE producto en el feed
// principal — mismo p.id/a.id en los dos, así que no hace falta duplicar
// nada a mano.
// Sin pickup_method/pickup_sla a propósito: la recogida el mismo día exige que
// el sitio permita comprar online y elegir retiro en tienda, y el carrito está
// oculto (Google la rechazó en Merchant Center, 2026-10). Sin esos atributos
// el producto igual aparece como "disponible en tienda" con su stock y precio.
export const dynamic = "force-dynamic";

function cdata(text: string): string {
  return `<![CDATA[${text.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

function tireItem(p: TireProduct, storeCode: string): string {
  return `
    <item>
      <g:id>${p.id}</g:id>
      <g:store_code>${cdata(storeCode)}</g:store_code>
      <g:availability>${p.enStock ? "in_stock" : "out_of_stock"}</g:availability>
      <g:price>${p.price.toFixed(2)} ARS</g:price>
      <g:quantity>${p.stock ?? 0}</g:quantity>
    </item>`;
}

function accessoryItem(a: Accessory, storeCode: string): string {
  return `
    <item>
      <g:id>${a.id}</g:id>
      <g:store_code>${cdata(storeCode)}</g:store_code>
      <g:availability>${a.enStock ? "in_stock" : "out_of_stock"}</g:availability>
      <g:price>${a.price.toFixed(2)} ARS</g:price>
      <g:quantity>${a.stock}</g:quantity>
    </item>`;
}

export async function GET() {
  const sucursalesConTienda = BRANCHES.filter((b): b is Branch & { googleStoreCode: string } => !!b.googleStoreCode);

  const itemsPorSucursal = await Promise.all(
    sucursalesConTienda.map(async (branch) => {
      const [productos, accesorios] = await Promise.all([
        getProductosDesdePOS(branch.id),
        getAccesoriosDesdePOS(branch.id),
      ]);
      return [
        ...productos.map((p) => tireItem(p, branch.googleStoreCode)),
        ...accesorios.map((a) => accessoryItem(a, branch.googleStoreCode)),
      ];
    })
  );

  const flatItems = itemsPorSucursal.flat();
  if (flatItems.length === 0) {
    return new Response("No se encontraron productos en el POS. Evitando generar un feed vacío.", { status: 500 });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>Neumáticos Trivium — Inventario local</title>
<link>${SITE_URL}</link>
<description>Stock por sucursal para fichas locales sin coste y anuncios de inventario local.</description>
${flatItems.join("\n")}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
