import { ImageResponse } from "next/og";

function parseSize(value: string | null) {
  if (!value) return null;
  const m = value.match(/^(\d+)-(\d+)-(\d+)$/);
  if (!m) return null;
  return { width: Number(m[1]), profile: Number(m[2]), rim: Number(m[3]) };
}

function tireDiameter(size: { width: number; profile: number; rim: number }) {
  return size.rim * 25.4 + 2 * (size.width * (size.profile / 100));
}

function SizeCard({ width, profile, rim, label }: { width: number; profile: number; rim: number; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "white",
        borderRadius: 28,
        padding: "36px 48px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ display: "flex", fontSize: 22, fontWeight: 700, color: "#f97316", textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>
        {label}
      </div>
      <div style={{ display: "flex", fontSize: 56, fontWeight: 900, color: "#0f1b3d" }}>
        {width}/{profile} R{rim}
      </div>
    </div>
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const original = parseSize(searchParams.get("original"));
  const equivalente = parseSize(searchParams.get("equivalente"));

  const diff =
    original && equivalente
      ? ((tireDiameter(equivalente) - tireDiameter(original)) / tireDiameter(original)) * 100
      : null;

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
          background: "linear-gradient(135deg, #0f1b3d 0%, #16255c 100%)",
          padding: 60,
        }}
      >
        <div style={{ display: "flex", fontSize: 26, fontWeight: 800, color: "#fb923c", textTransform: "uppercase", letterSpacing: 3, marginBottom: 36 }}>
          Calculadora de equivalencias · Trivium
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          {original ? (
            <SizeCard width={original.width} profile={original.profile} rim={original.rim} label="Original" />
          ) : (
            <div style={{ display: "flex", fontSize: 48, color: "white" }}>Neumáticos Trivium</div>
          )}

          {original && equivalente && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  background: "#34d399",
                  color: "#0f1b3d",
                  fontSize: 36,
                  fontWeight: 900,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {">"}
              </div>
              {diff !== null && (
                <div style={{ display: "flex", marginTop: 14, fontSize: 22, fontWeight: 800, color: "#34d399" }}>
                  {diff >= 0 ? "+" : ""}
                  {diff.toFixed(1)}%
                </div>
              )}
            </div>
          )}

          {equivalente && (
            <SizeCard width={equivalente.width} profile={equivalente.profile} rim={equivalente.rim} label="Equivalente" />
          )}
        </div>

        <div style={{ display: "flex", marginTop: 48, fontSize: 22, color: "#94a3b8" }}>
          neumaticos.trivium.ar
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
