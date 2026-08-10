import { getProductosDesdePOS, getAccesoriosDesdePOS } from "@/lib/pos-api";
import { SITE_URL, SHIPPING_FLAT_RATE } from "@/lib/config";
import type { TireProduct, Accessory } from "@/lib/types";

// Tarifa unica a todo el pais (alternativa al retiro gratis en sucursal, que
// para Merchant Center simplemente no se declara como shipping — es gratis
// por definicion al no cobrar envio).
const SHIPPING_BLOCK = `
      <g:shipping>
        <g:country>AR</g:country>
        <g:service>Standard</g:service>
        <g:price>${SHIPPING_FLAT_RATE.toFixed(2)} ARS</g:price>
      </g:shipping>`;

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

/**
 * Valor de `availability` en el formato que documenta Google hoy: con guión
 * bajo. Antes acá se escribía "in stock" / "out of stock" con espacios, que es
 * la forma legacy, mientras que el feed de inventario local
 * (google-local-inventory.xml) ya usaba guión bajo. Que los dos feeds
 * describieran el mismo producto con sintaxis distinta es justo el tipo de
 * inconsistencia que complica el diagnóstico cuando Merchant Center reclama
 * datos de inventario local.
 */
function availability(enStock: boolean | undefined): "in_stock" | "out_of_stock" {
  return enStock ? "in_stock" : "out_of_stock";
}

function tireItem(p: TireProduct): string {
  const link = `${SITE_URL}/productos/${p.slug}`;
  const description = `Neumático ${p.model} — importación directa, outlet de neumáticos. Garantía de 1 año.`;
  const imageUrl = p.imageUrl.startsWith("/") ? `${SITE_URL}${p.imageUrl}` : p.imageUrl;
  return `
    <item>
      <g:id>${escapeXml(p.id)}</g:id>
      <title>${cdata(p.model)}</title>
      <description>${cdata(description)}</description>
      <link>${escapeXml(link)}</link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${availability(p.enStock)}</g:availability>
      <g:price>${p.price.toFixed(2)} ARS</g:price>
      <g:brand>${cdata(p.brand)}</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:product_type>${cdata(`Neumáticos > ${p.brand}`)}</g:product_type>${SHIPPING_BLOCK}
      <g:excluded_destination>free_local_listings</g:excluded_destination>
      <g:excluded_destination>local_inventory_ads</g:excluded_destination>
    </item>`;
}

function accessoryItem(a: Accessory & { imageUrl: string }): string {
  const link = `${SITE_URL}/tuercas-antirrobo/${a.slug}`;
  const description = a.descripcion
    ? `Tuerca antirrobo para ruedas — compatible con ${a.descripcion}. Colocación sin cargo en nuestra sucursal.`
    : "Tuerca antirrobo para ruedas. Colocación sin cargo en nuestra sucursal.";
  const imageUrl = a.imageUrl.startsWith("/") ? `${SITE_URL}${a.imageUrl}` : a.imageUrl;
  return `
    <item>
      <g:id>${escapeXml(a.id)}</g:id>
      <title>${cdata(a.nombre)}</title>
      <description>${cdata(description)}</description>
      <link>${escapeXml(link)}</link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${availability(a.enStock)}</g:availability>
      <g:price>${a.price.toFixed(2)} ARS</g:price>
      <g:brand>${cdata("Z3")}</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:product_type>${cdata("Tuercas Antirrobo")}</g:product_type>${SHIPPING_BLOCK}
      <g:excluded_destination>free_local_listings</g:excluded_destination>
      <g:excluded_destination>local_inventory_ads</g:excluded_destination>
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
