import { ImageResponse } from "next/og";
import { formatSize, parseRimSlug, parseSizeSlug } from "@/lib/tire-sizes";
import { getBrandWordmarkDataUri } from "@/lib/og-assets";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ medida: string }> }) {
  const { medida } = await params;

  const rim = parseRimSlug(medida);
  let title = "Neumáticos Trivium";
  let subtitle = "";
  let typeLabel = "NEUMÁTICOS";
  const footerExtra = "Importación directa · Precios outlet";

  if (rim !== null) {
    typeLabel = `RODADO R${rim}`;
    title = `Rodado ${rim}`;
    subtitle = `Medidas y precios en stock`;
  } else {
    const tireSize = parseSizeSlug(medida);
    if (tireSize) {
      typeLabel = "MEDIDA";
      title = formatSize(tireSize);
      subtitle = "Precios y equivalencias";
    }
  }

  const wordmark = await getBrandWordmarkDataUri();

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
          // Navy de marca (mismo que --color-navy-950/900 en globals.css)
          background: "linear-gradient(135deg, #06111f 0%, #0a1a30 60%, #0f2444 100%)",
          padding: 40,
        }}
      >
        <div style={{ display: "flex", position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "#ff1e00" }} />

        <div
          style={{
            width: 620,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.04)",
            border: "2px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 32,
            padding: "36px 40px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={wordmark} width={200} height={50} alt="" style={{ marginBottom: 28 }} />

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#dceaf8", letterSpacing: 1.5, marginBottom: 4, textTransform: "uppercase" }}>
              {typeLabel}
            </span>

            <span style={{ fontSize: 64, fontWeight: 900, color: "white", lineHeight: 1, textAlign: "center" }}>
              {title}
            </span>

            {subtitle && (
              <span style={{ fontSize: 19, color: "#dceaf8", marginTop: 16, fontWeight: 700, textAlign: "center" }}>
                {subtitle}
              </span>
            )}

            <span style={{ fontSize: 14, fontWeight: 700, color: "#ff8066", marginTop: 24, letterSpacing: 1, textAlign: "center", textTransform: "uppercase" }}>
              {footerExtra}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 24, fontSize: 18, fontWeight: 700, color: "#a8c8ec", letterSpacing: 1.5 }}>
          neumaticos.trivium.ar
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=60, immutable",
      },
    }
  );
}
