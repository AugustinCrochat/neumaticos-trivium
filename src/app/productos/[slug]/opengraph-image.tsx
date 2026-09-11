import { ImageResponse } from "next/og";
import sharp from "sharp";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { DEFAULT_BRANCH_ID, SITE_URL } from "@/lib/config";
import { getBrandWordmarkDataUri } from "@/lib/og-assets";

export const alt = "Neumáticos Trivium";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
// ("u2 is not iterable"). Por eso se reconvierte a PNG con sharp antes de
// pasarlo como data URI.
async function getImageDataUri(url: string): Promise<string | null> {
  try {
    const absolute = url.startsWith("http") ? url : `${SITE_URL}${url}`;
    const res = await fetch(absolute);
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    const png = await sharp(buffer).png().toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const product = productos.find((p) => p.slug === slug);

  const [wordmark, photo] = await Promise.all([
    getBrandWordmarkDataUri(),
    product ? getImageDataUri(product.imageUrl) : Promise.resolve(null),
  ]);

  const sizeLabel = product ? `${product.size.width}/${product.size.profile} R${product.size.rim}${product.isCarga ? "C" : ""}` : null;
  // product.model ya arranca con la medida (ver toTireProduct en pos-api.ts)
  // y acá la medida va aparte y grande — sacarla evita repetirla dos veces.
  const modelWithoutSize = product
    ? product.model.replace(new RegExp(`^${product.size.width}\\s*/\\s*${product.size.profile}\\s*R\\s*${product.size.rim}[A-Z]*\\s*`, "i"), "")
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #06111f 0%, #0a1a30 60%, #0f2444 100%)",
          padding: "0 64px",
        }}
      >
        <div style={{ display: "flex", position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "#ff1e00" }} />

        <div style={{ display: "flex", flexDirection: "column", width: 600 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={wordmark} width={220} height={55} alt="" style={{ marginBottom: 40 }} />

          {product ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ display: "flex", fontSize: 14, fontWeight: 800, color: "#ff8066", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
                {product.brand}
              </span>
              <span style={{ display: "flex", fontSize: 62, fontWeight: 900, color: "white", lineHeight: 1.05 }}>
                {sizeLabel}
              </span>
              <span
                style={{
                  display: "flex",
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#dceaf8",
                  marginTop: 14,
                  lineHeight: 1.3,
                  maxWidth: 560,
                }}
              >
                {modelWithoutSize}
              </span>
              <span style={{ display: "flex", fontSize: 48, fontWeight: 900, color: "#ff4d33", marginTop: 28 }}>
                {formatPrice(product.price)}
              </span>
            </div>
          ) : (
            <span style={{ display: "flex", fontSize: 48, fontWeight: 900, color: "white", lineHeight: 1.2 }}>
              Neumáticos Trivium
            </span>
          )}

          <span style={{ display: "flex", fontSize: 18, fontWeight: 700, color: "#a8c8ec", marginTop: 32, letterSpacing: 1 }}>
            neumaticos.trivium.ar
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
            background: "rgba(255, 255, 255, 0.06)",
            border: "2px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" width={400} height={400} style={{ objectFit: "contain" }} />
          )}
        </div>
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
