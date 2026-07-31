import { ImageResponse } from "next/og";

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
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          background: "linear-gradient(135deg, #0b1533 0%, #16255c 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            fontWeight: 700,
            color: "#fb923c",
            textTransform: "uppercase",
            letterSpacing: 4,
            marginBottom: 24,
          }}
        >
          Importación directa · Precios outlet
        </div>
        <div style={{ display: "flex", fontSize: 92, fontWeight: 900, color: "white", lineHeight: 1.05 }}>
          El outlet del
        </div>
        <div style={{ display: "flex", fontSize: 92, fontWeight: 900, color: "#f97316", lineHeight: 1.05 }}>
          neumático
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#c7d2fe", marginTop: 34 }}>
          Cubiertas para auto y camioneta · Envío a todo el país
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#8fa3d8", marginTop: 12 }}>
          neumaticos.trivium.ar · Av. Donato Álvarez 7971, Córdoba
        </div>
      </div>
    ),
    size
  );
}
