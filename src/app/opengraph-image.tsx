import { ImageResponse } from "next/og";
import { getBrandWordmarkDataUri, getBrandIconDataUri, getBranchPhotoDataUri } from "@/lib/og-assets";
import { GenericOgLayout } from "@/lib/og-layout";

/**
 * Imagen por defecto al compartir el sitio (WhatsApp, Facebook, Twitter) y
 * `image` de la entidad Organization en el JSON-LD.
 *
 * Se genera en vez de servir un archivo estático porque no hay una foto de
 * marca en /public y una tarjeta sin imagen se comparte muchísimo menos: en
 * WhatsApp, que es el canal principal acá, el link queda como texto plano.
 * Al ser un archivo `opengraph-image` en la raíz, todas las páginas que no
 * definan una imagen propia la heredan.
 */
export const alt = "Neumáticos Trivium — El outlet del neumático";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [wordmark, icon, photo] = await Promise.all([
    getBrandWordmarkDataUri(),
    getBrandIconDataUri(),
    getBranchPhotoDataUri("arguello-fachada"),
  ]);

  return new ImageResponse(
    (
      <GenericOgLayout wordmark={wordmark} icon={icon} photo={photo} kicker="Importación directa · Precios outlet">
        <div style={{ display: "flex", fontSize: 72, fontWeight: 900, color: "white", lineHeight: 1.1 }}>
          El outlet del
        </div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 900, color: "#ff1e00", lineHeight: 1.1, marginBottom: 26 }}>
          neumático
        </div>
        <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: "#cbd5e1" }}>
          Cubiertas para auto y camioneta
        </div>
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
