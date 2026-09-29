import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { DEFAULT_BRANCH_ID } from "@/lib/config";
import { getBrandWordmarkDataUri, getBrandIconDataUri, getTireBrandLogoDataUri } from "@/lib/og-assets";

export const alt = "Neumáticos Trivium";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Esta imagen usa sharp (ver getImageDataUri más abajo) para reconvertir las
// fotos .webp del POS a PNG, porque next/og no sabe decodificar webp. sharp
// es un binario nativo de Node: no corre en el Worker de Cloudflare donde
// vive el sitio en producción. generateStaticParams + dynamicParams=false
// obligan a que esta ruta se resuelva ENTERA en build time (Node.js normal,
// mismo runner que ya usa sharp en scripts/), así que nunca termina en el
// bundle del Worker. Un producto nuevo que todavía no pasó por un build no
// tiene OG image hasta el próximo deploy (varias veces por día) — el
// <title>/<meta description> de la página sigue funcionando igual.
export async function generateStaticParams() {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  return productos.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

// Las fotos de producto vienen del POS con relaciones de aspecto que varían
// (cuadradas, verticales, apaisadas — ver imagen_url manual en el POS), así
// que compartir el link directo como og:image quedaba recortado según cómo
// cada red social crop-eaba ese 1.91:1. Acá se compone la foto siempre
// completa (object-fit: contain) sobre el fondo de marca, sin recortes.
//
// Casi todas las fotos son .webp, y el motor que usa ImageResponse (satori +
// resvg) no sabe decodificar webp embebido — el <img> se rompía en seco
// ("u2 is not iterable"). Por eso se lee la versión PNG que
// scripts/generate-og-product-photos.mjs genera antes del build (ver ese
// script para el motivo de por qué la conversión no puede vivir acá: sharp
// rompe el bundle del Worker de Cloudflare). Sólo cubre fotos locales
// (/images/products/*.webp, que hoy son el 100% del catálogo) — una URL
// externa se ignora y la tarjeta queda sin foto en vez de romper el render.
async function getImageDataUri(imageUrl: string): Promise<string | null> {
  const match = imageUrl.match(/\/images\/products\/([^/?#]+)\.webp$/i);
  if (!match) return null;
  try {
    const png = await readFile(join(process.cwd(), "public", "og-cache", "products", `${match[1]}.png`));
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const product = productos.find((p) => p.slug === slug);

  const [wordmark, icon, photo, brandLogo] = await Promise.all([
    getBrandWordmarkDataUri(),
    getBrandIconDataUri(),
    product ? getImageDataUri(product.imageUrl) : Promise.resolve(null),
    product ? getTireBrandLogoDataUri(product.brandId) : Promise.resolve(null),
  ]);

  const sizeLabel = product ? `${product.size.width}/${product.size.profile} R${product.size.rim}${product.isCarga ? "C" : ""}` : null;
  // product.model ya arranca con la medida (ver toTireProduct en pos-api.ts)
  // y acá la medida va aparte y grande — sacarla evita repetirla dos veces.
  const modelWithoutSize = product
    ? product.model.replace(new RegExp(`^${product.size.width}\\s*/\\s*${product.size.profile}\\s*R\\s*${product.size.rim}[A-Z]*\\s*`, "i"), "")
    : null;

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#050505",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "#ff1e00" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={wordmark} width={260} height={65} alt="" />
          <span style={{ display: "flex", fontSize: 40, fontWeight: 900, color: "white", marginTop: 24 }}>
            Neumáticos Trivium
          </span>
        </div>
      ),
      size
    );
  }

  // Diseño en 3 columnas: el centro (foto + precio + colocación gratis) es lo
  // único que tiene que sobrevivir sí o sí un recorte cuadrado (WhatsApp Web
  // arma así la miniatura del link y corta los costados) — ahí va la foto y
  // el precio. Los costados (identidad de marca a la izquierda, isotipo a la
  // derecha) son lo prescindible si el recorte los corta.
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#050505",
          padding: "0 56px",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "#ff1e00" }} />

        {/* Columna izquierda: identidad del producto */}
        <div style={{ display: "flex", flexDirection: "column", width: 300 }}>
          {/* El wordmark ya trae "El outlet del neumático" incorporado — no
              hace falta repetir la idea en un renglón aparte. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={wordmark} width={260} height={65} alt="" style={{ marginBottom: 44 }} />

          {brandLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brandLogo} width={190} height={42} alt="" style={{ objectFit: "contain", objectPosition: "left center", marginBottom: 14 }} />
          ) : (
            <span style={{ display: "flex", fontSize: 20, fontWeight: 900, color: "white", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>
              {product.brand}
            </span>
          )}
          <span style={{ display: "flex", fontSize: 46, fontWeight: 900, color: "white", lineHeight: 1.05 }}>
            {sizeLabel}
          </span>
          <span
            style={{
              display: "flex",
              fontSize: 22,
              fontWeight: 700,
              color: "#cbd5e1",
              marginTop: 10,
              lineHeight: 1.3,
              maxWidth: 320,
            }}
          >
            {modelWithoutSize}
          </span>
        </div>

        {/* Columna central: la foto tiene que sobrevivir cualquier recorte */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: -26,
              padding: "18px 44px",
              borderRadius: 9999,
              background: "#ff1e00",
              boxShadow: "0 8px 20px rgba(255, 30, 0, 0.35)",
              zIndex: 2,
            }}
          >
            <span style={{ display: "flex", fontSize: 54, fontWeight: 900, color: "white", letterSpacing: -0.5 }}>
              {formatPrice(product.price)}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 460,
              height: 460,
              borderRadius: 32,
              background: "white",
            }}
          >
            {photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="" width={400} height={400} style={{ objectFit: "contain" }} />
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginTop: -24,
              padding: "12px 28px",
              borderRadius: 9999,
              background: "#ff1e00",
              boxShadow: "0 8px 20px rgba(255, 30, 0, 0.35)",
            }}
          >
            {/* El glifo "✓" no está en la fuente default de satori/resvg (se
                renderiza como tofu) — un check dibujado en SVG no depende de
                qué caracteres soporte la fuente. */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span style={{ display: "flex", fontSize: 22, fontWeight: 900, color: "white", letterSpacing: 0.5 }}>
              Colocación gratis
            </span>
          </div>
        </div>

        {/* Espaciador: mantiene el centrado del recorte cuadrado (misma
            width que la columna izquierda) — el isotipo va aparte, con
            position absolute, para poder sobresalir del borde. */}
        <div style={{ display: "flex", width: 300 }} />

        {/* Isotipo como marca de agua, sobresaliendo del borde derecho. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={icon}
          width={480}
          height={480}
          alt=""
          style={{ position: "absolute", top: 75, right: -90, opacity: 0.4 }}
        />
      </div>
    ),
    {
      ...size,
      headers: {
        "Cache-Control": "public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=60, immutable",
      },
    }
  );
}
