import { ImageResponse } from "next/og";
import { getBrandWordmarkDataUri, getBrandIconDataUri } from "@/lib/og-assets";

function parseSize(value: string | null) {
  if (!value) return null;
  const m = value.match(/^(\d+)-(\d+)-(\d+)$/);
  if (!m) return null;
  return { width: Number(m[1]), profile: Number(m[2]), rim: Number(m[3]) };
}

function tireDiameter(size: { width: number; profile: number; rim: number }) {
  return size.rim * 25.4 + 2 * (size.width * (size.profile / 100));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const original = parseSize(searchParams.get("original"));
  const equivalente = parseSize(searchParams.get("equivalente"));

  const diff =
    original && equivalente
      ? ((tireDiameter(equivalente) - tireDiameter(original)) / tireDiameter(original)) * 100
      : null;

  const [wordmark, icon] = await Promise.all([
    getBrandWordmarkDataUri(request.url),
    getBrandIconDataUri(request.url),
  ]);

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
          padding: 40,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "#ff1e00" }} />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={icon} width={420} height={420} alt="" style={{ position: "absolute", right: -110, bottom: -130, opacity: 0.14 }} />

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
            position: "relative",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={wordmark} width={200} height={50} alt="" style={{ marginBottom: 20 }} />

          <div
            style={{
              display: "flex",
              fontSize: 14,
              fontWeight: 800,
              color: "#ff1e00",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            Calculadora de Equivalencias
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            {/* Original */}
            {original && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#cbd5e1", letterSpacing: 1.5, marginBottom: 4 }}>MEDIDA ORIGINAL</span>
                <span style={{ fontSize: 56, fontWeight: 900, color: "white", lineHeight: 1 }}>
                  {original.width}/{original.profile} R{original.rim}
                </span>
              </div>
            )}

            {/* Connection / Arrow / Diff Pill */}
            {original && equivalente && diff !== null && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "20px 0" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 14px",
                    borderRadius: 9999,
                    background: Math.abs(diff) <= 3 ? "rgba(52, 211, 153, 0.1)" : "rgba(239, 68, 68, 0.1)",
                    border: Math.abs(diff) <= 3 ? "1px solid rgba(52, 211, 153, 0.2)" : "1px solid rgba(239, 68, 68, 0.2)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 900,
                      color: Math.abs(diff) <= 3 ? "#34d399" : "#ef4444",
                      letterSpacing: 1.5,
                    }}
                  >
                    {Math.abs(diff) <= 3 ? "COMPATIBLE" : "NO RECOMENDADO"} · {diff >= 0 ? "+" : ""}{diff.toFixed(1)}%
                  </span>
                </div>
              </div>
            )}

            {/* Equivalente */}
            {equivalente && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#cbd5e1", letterSpacing: 1.5, marginBottom: 4 }}>MEDIDA EQUIVALENTE</span>
                <span style={{ fontSize: 56, fontWeight: 900, color: "white", lineHeight: 1 }}>
                  {equivalente.width}/{equivalente.profile} R{equivalente.rim}
                </span>
              </div>
            )}

            {/* Fallback if no sizes are defined */}
            {!original && !equivalente && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "30px 0" }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: "white", textAlign: "center" }}>
                  Compará la medida de tus neumáticos
                </span>
                <span style={{ fontSize: 18, fontWeight: 600, color: "#cbd5e1", marginTop: 12, textAlign: "center" }}>
                  Calculá tolerancias y diámetros en segundos
                </span>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 24, fontSize: 18, fontWeight: 700, color: "#94a3b8", letterSpacing: 1.5 }}>
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
