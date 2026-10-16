import { getProductosDesdePOS, getAccesoriosDesdePOS, esRodadoCamion } from "@/lib/pos-api";
import { SITE_URL, SHIPPING_FLAT_RATE, FREE_SHIPPING_THRESHOLD } from "@/lib/config";
import { buildTireDescription } from "@/lib/tire-sizes";
import { getExtraPhotos } from "@/lib/product-extra-photos";
import { getTireLabel } from "@/lib/tire-labels";
import type { TireProduct, Accessory } from "@/lib/types";

// Tarifa unica a todo el pais (alternativa al retiro gratis en sucursal, que
// para Merchant Center simplemente no se declara como shipping — es gratis
// por definicion al no cobrar envio).
// Envío gratis desde FREE_SHIPPING_THRESHOLD, igual que en el carrito del
// sitio: el feed no tiene un atributo de umbral, así que se declara por ítem
// (los que llegan solos al monto salen con envío 0). El umbral para pedidos
// de varios ítems se configura aparte en Merchant Center → Envío.
function shippingBlock(price: number): string {
  const envio = price >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
  return `
      <g:shipping>
        <g:country>AR</g:country>
        <g:service>Standard</g:service>
        <g:price>${envio.toFixed(2)} ARS</g:price>
      </g:shipping>`;
}

// Feed de productos para Google Merchant Center (scheduled fetch): configurar
// esta URL una sola vez en Merchant Center y Google la vuelve a leer solo,
// sin subir nada a mano. Solo productos físicos (neumáticos, tuercas
// antirrobo) — los servicios (alineación, balanceo, etc.) quedan afuera:
// el feed estándar de Merchant Center es para bienes, no servicios, y
// listarlos ahí arriesga que Google rechace/​suspenda la cuenta por política.
export const dynamic = "force-dynamic";

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

// Google acepta hasta 10 <g:additional_image_link> por item. Sumamos las
// fotos de otros ángulos (banda/flanco/llanta, ver product-extra-photos.ts)
// y la etiqueta UE oficial cuando existe — antes esta función no las mandaba
// y por eso nunca aparecían como fotos secundarias en Merchant Center, más
// allá de que ya estuvieran en la galería del sitio.
function additionalImageLinks(urls: string[]): string {
  return urls
    .slice(0, 10)
    .map((url) => `\n      <g:additional_image_link>${escapeXml(url.startsWith("/") ? `${SITE_URL}${url}` : url)}</g:additional_image_link>`)
    .join("");
}

// IDs de la taxonomía oficial de Google (taxonomy-with-ids, verificados):
// 6093 = Vehículos y recambios > … > Neumáticos para vehículos motorizados >
// Neumáticos para automóviles. NO usar 7252: es para TT/UTV/cuatriciclos y no
// corresponde a un A/T de camioneta. 2556 = Piezas para ruedas de vehículos
// motorizados (donde caen las tuercas de rueda).
const CATEGORIA_NEUMATICOS = 6093;
// 911 = Neumáticos para vehículos motorizados (la categoría general, sin
// subcategoría de camión en la taxonomía): para rodados de camión (17.5+).
const CATEGORIA_NEUMATICOS_CAMION = 911;
const CATEGORIA_TUERCAS = 2556;

function tipoNeumatico(p: TireProduct): string {
  if (p.isCarga) return "Carga y comerciales";
  if (p.isAT) return "Todo terreno (A/T)";
  return "Auto y camioneta";
}

// Atributos técnicos estructurados (product_detail): son los "datos
// importantes" que Merchant Center busca además de la descripción.
function tireDetails(p: TireProduct): string {
  const { width, profile, rim } = p.size;
  const rows: [string, string][] = [
    ["Ancho", `${width} mm`],
    ["Perfil", `${profile} %`],
    ["Rodado", `${rim} pulgadas`],
  ];
  if (p.loadIndex) rows.push(["Índice de carga", p.loadIndexDual ? `${p.loadIndex}/${p.loadIndexDual}` : p.loadIndex]);
  if (p.speedRating) rows.push(["Índice de velocidad", p.speedRating]);
  return rows
    .map(
      ([name, value]) => `
      <g:product_detail>
        <g:section_name>${cdata("Especificaciones")}</g:section_name>
        <g:attribute_name>${cdata(name)}</g:attribute_name>
        <g:attribute_value>${cdata(value)}</g:attribute_value>
      </g:product_detail>`
    )
    .join("");
}

function tireItem(p: TireProduct): string {
  const link = `${SITE_URL}/productos/${p.slug}`;
  const description = buildTireDescription(p);
  const imageUrl = p.imageUrl.startsWith("/") ? `${SITE_URL}${p.imageUrl}` : p.imageUrl;
  const label = getTireLabel(p.slug);
  const extraImages = [...getExtraPhotos(p.brandId, p.modeloBase), ...(label ? [label.imagePath] : [])];
  return `
    <item>
      <g:id>${escapeXml(p.id)}</g:id>
      <title>${cdata(p.model)}</title>
      <description>${cdata(description)}</description>
      <link>${escapeXml(link)}</link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>${additionalImageLinks(extraImages)}
      <g:condition>new</g:condition>
      <g:availability>${availability(p.enStock)}</g:availability>
      <g:price>${p.price.toFixed(2)} ARS</g:price>
      <g:brand>${cdata(p.brand)}</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:google_product_category>${esRodadoCamion(p.size.rim) ? CATEGORIA_NEUMATICOS_CAMION : CATEGORIA_NEUMATICOS}</g:google_product_category>
      <g:product_type>${cdata(`Neumáticos > ${tipoNeumatico(p)} > Rodado ${p.size.rim} > ${p.brand}`)}</g:product_type>${tireDetails(p)}${shippingBlock(p.price)}
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
      <g:google_product_category>${CATEGORIA_TUERCAS}</g:google_product_category>
      <g:product_type>${cdata("Accesorios para ruedas > Tuercas antirrobo")}</g:product_type>${shippingBlock(a.price)}
    </item>`;
}

export async function GET() {
  const [productos, accesorios] = await Promise.all([getProductosDesdePOS(), getAccesoriosDesdePOS()]);

  const items = [
    // Sin foto real la URL del placeholder da 404 y Merchant rechaza el ítem
    // (y baja el porcentaje de imágenes válidas): mejor no listarlo.
    ...productos.filter((p) => p.imageUrl && !p.imageUrl.includes("tire-placeholder")).map(tireItem),
    ...accesorios
      .filter((a): a is Accessory & { imageUrl: string } => !!a.imageUrl)
      .map(accessoryItem),
  ];

  if (items.length === 0) {
    return new Response("No se encontraron productos en el POS. Evitando generar un feed vacío.", { status: 500 });
  }

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
