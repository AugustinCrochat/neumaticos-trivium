import { getProductosDesdePOS, getAccesoriosDesdePOS } from "@/lib/pos-api";
import { SITE_URL } from "@/lib/config";
import type { TireProduct, Accessory } from "@/lib/types";

// Feed de productos para Google Merchant Center (scheduled fetch): configurar
// esta URL una sola vez en Merchant Center y Google la vuelve a leer solo,
// sin subir nada a mano. Solo productos físicos (neumáticos, tuercas
// antirrobo) — los servicios (alineación, balanceo, etc.) quedan afuera:
// el feed estándar de Merchant Center es para bienes, no servicios, y
// listarlos ahí arriesga que Google rechace/​suspenda la cuenta por política.
export const revalidate = 3600;

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cdata(text: string): string {
  return `<![CDATA[${text.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

// No mandamos inventario por sucursal (store_code, quantity, etc.), así que
// excluimos estos dos destinos para que Merchant Center no reclame datos de
// "tienda física" que no estamos completando — el listado normal de Shopping
// (Free Listings) sigue activo igual, esto solo apaga las extensiones locales.
const EXCLUDED_DESTINATIONS = `
      <g:excluded_destination>Free_local_listings</g:excluded_destination>
      <g:excluded_destination>Local_inventory_ads</g:excluded_destination>`;

function tireItem(p: TireProduct): string {
  const link = `${SITE_URL}/productos/${p.slug}`;
  const description = `Neumático ${p.model} — importación directa, outlet de neumáticos. Garantía de 1 año.`;
  return `
    <item>
      <g:id>${escapeXml(p.id)}</g:id>
      <title>${cdata(p.model)}</title>
      <description>${cdata(description)}</description>
      <link>${escapeXml(link)}</link>
      <g:image_link>${escapeXml(p.imageUrl)}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${p.enStock ? "in stock" : "out of stock"}</g:availability>
      <g:price>${p.price.toFixed(2)} ARS</g:price>
      <g:brand>${cdata(p.brand)}</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:product_type>${cdata(`Neumáticos > ${p.brand}`)}</g:product_type>${EXCLUDED_DESTINATIONS}
    </item>`;
}

function accessoryItem(a: Accessory & { imageUrl: string }): string {
  const link = `${SITE_URL}/tuercas-antirrobo/${a.slug}`;
  const description = a.descripcion
    ? `Tuerca antirrobo para ruedas — compatible con ${a.descripcion}. Colocación sin cargo en nuestra sucursal.`
    : "Tuerca antirrobo para ruedas. Colocación sin cargo en nuestra sucursal.";
  return `
    <item>
      <g:id>${escapeXml(a.id)}</g:id>
      <title>${cdata(a.nombre)}</title>
      <description>${cdata(description)}</description>
      <link>${escapeXml(link)}</link>
      <g:image_link>${escapeXml(a.imageUrl)}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${a.enStock ? "in stock" : "out of stock"}</g:availability>
      <g:price>${a.price.toFixed(2)} ARS</g:price>
      <g:brand>${cdata("Z3")}</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:product_type>${cdata("Tuercas Antirrobo")}</g:product_type>${EXCLUDED_DESTINATIONS}
    </item>`;
}

export async function GET() {
  const [productos, accesorios] = await Promise.all([getProductosDesdePOS(), getAccesoriosDesdePOS()]);

  const items = [
    ...productos.map(tireItem),
    ...accesorios
      .filter((a): a is Accessory & { imageUrl: string } => !!a.imageUrl)
      .map(accessoryItem),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>Neumáticos Trivium</title>
<link>${SITE_URL}</link>
<description>Catálogo de neumáticos y tuercas antirrobo — Neumáticos Trivium</description>
${items.join("\n")}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
