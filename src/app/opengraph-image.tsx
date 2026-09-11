import { ImageResponse } from "next/og";
import { getBrandWordmarkDataUri } from "@/lib/og-assets";

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
          textAlign: "center",
          // Navy de marca (mismo que --color-navy-950/900 en globals.css), no un
          // navy inventado aparte — así la miniatura combina con el resto del
          // sitio en vez de quedar como un color suelto.
          background: "linear-gradient(135deg, #06111f 0%, #0a1a30 60%, #0f2444 100%)",
        }}
      >
        {/* Franja roja arriba: mismo recurso que usa el header para anclar la
            marca antes de que WhatsApp/Facebook terminen de renderizar la miniatura. */}
        <div style={{ display: "flex", position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "#ff1e00" }} />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={wordmark} width={280} height={70} alt="" style={{ marginBottom: 44 }} />

        {/* Todo el contenido va centrado y con un ancho máximo angosto: WhatsApp,
            Twitter y Facebook a veces recortan esta imagen de 1200x630 a un
            formato más cuadrado centrado en vez de mostrarla completa. Con el
            texto pegado al borde izquierdo (como estaba antes) ese recorte se
            comía la primera letra de cada línea larga. Centrado + ancho acotado
            garantiza que el recorte más agresivo siga mostrando todo el texto. */}
        <div
          style={{
            display: "flex",
            fontSize: 24,
            fontWeight: 700,
            color: "#ff8066",
            textTransform: "uppercase",
            letterSpacing: 3,
            marginBottom: 26,
          }}
        >
          Importación directa · Precios outlet
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 900, color: "white", lineHeight: 1.1 }}>
          El outlet del
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 900, color: "#ff4d33", lineHeight: 1.1, marginBottom: 30 }}>
          neumático
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 28, fontWeight: 600, color: "#dceaf8" }}>
          <div style={{ display: "flex" }}>Cubiertas para auto y camioneta</div>
          <div style={{ display: "flex", marginTop: 6 }}>Envío a todo el país</div>
        </div>
        <div style={{ display: "flex", fontSize: 24, fontWeight: 700, color: "#a8c8ec", marginTop: 28 }}>
          neumaticos.trivium.ar
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
