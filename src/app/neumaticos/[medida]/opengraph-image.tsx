import { ImageResponse } from "next/og";
import { formatSize, parseRimSlug, parseSizeSlug } from "@/lib/tire-sizes";
import { getBrandWordmarkDataUri, getBrandIconDataUri, getBranchPhotoDataUri } from "@/lib/og-assets";
import { GenericOgLayout } from "@/lib/og-layout";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ medida: string }> }) {
  const { medida } = await params;

  const rim = parseRimSlug(medida);
  let title = "Neumáticos Trivium";
  let subtitle = "";
  let typeLabel = "NEUMÁTICOS";

  if (rim !== null) {
    typeLabel = `RODADO R${rim}`;
    title = `Rodado ${rim}`;
    subtitle = "Medidas y precios en stock";
  } else {
    const tireSize = parseSizeSlug(medida);
    if (tireSize) {
      typeLabel = "MEDIDA";
      title = formatSize(tireSize);
      subtitle = "Precios y equivalencias";
    }
  }

  const [wordmark, icon, photo] = await Promise.all([
    getBrandWordmarkDataUri(),
    getBrandIconDataUri(),
    getBranchPhotoDataUri("arguello-fachada"),
  ]);

  return new ImageResponse(
    (
      <GenericOgLayout wordmark={wordmark} icon={icon} photo={photo} kicker={typeLabel}>
        <span style={{ fontSize: 64, fontWeight: 900, color: "white", lineHeight: 1, display: "flex" }}>{title}</span>
        {subtitle && (
          <span style={{ fontSize: 22, color: "#cbd5e1", marginTop: 16, fontWeight: 700, display: "flex" }}>{subtitle}</span>
        )}
      </GenericOgLayout>
    ),
    {
      ...size,
      headers: {
        "Cache-Control": "public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=60, immutable",
      },
    }
  );
}
