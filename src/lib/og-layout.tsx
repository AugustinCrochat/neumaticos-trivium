import type { ReactNode } from "react";

type GenericOgLayoutProps = {
  wordmark: string;
  icon: string;
  photo: string | null;
  kicker: string;
  children: ReactNode;
};

/**
 * Layout compartido por las og-image "genéricas" (home, medida) — negro
 * sólido como el resto del sitio (header/footer, ver Header.tsx) en vez del
 * gradiente navy que quedó de un branding anterior, con la foto de fachada
 * de Argüello como fondo del lado derecho (desvanecida hacia negro para que
 * el texto de la izquierda siga siendo legible) y el isotipo de marca como
 * marca de agua sutil.
 */
export function GenericOgLayout({ wordmark, icon, photo, kicker, children }: GenericOgLayoutProps) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#050505" }}>
      <div style={{ display: "flex", position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "#ff1e00" }} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: photo ? 660 : "100%",
          padding: "0 64px",
          position: "relative",
        }}
      >
        {/* El icono es fill negro + trazo blanco + el cartelito de precio en
            rojo (ver src/app/icon.svg) — sobre fondo negro y a baja opacidad
            queda como un contorno sutil, no una silueta sólida. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={icon} width={440} height={440} alt="" style={{ position: "absolute", right: -110, bottom: -130, opacity: 0.14 }} />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={wordmark} width={220} height={55} alt="" style={{ marginBottom: 32 }} />

        <div style={{ display: "flex", fontSize: 20, fontWeight: 900, color: "#ff1e00", letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>
          {kicker}
        </div>

        {children}
      </div>

      {photo && (
        <div style={{ display: "flex", position: "relative", width: 540, height: "100%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} width={540} height={630} alt="" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
          <div
            style={{
              display: "flex",
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, #050505 0%, rgba(5,5,5,0.75) 16%, rgba(5,5,5,0) 42%)",
            }}
          />
          <div
            style={{
              display: "flex",
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 78%, rgba(0,0,0,0.3) 100%)",
            }}
          />
        </div>
      )}
    </div>
  );
}
