/**
 * Logo del header en dos piezas (scripts/build-logo-pieces.mjs): el ícono
 * (neumático con su etiqueta, siempre juntos y proporcionales) y el texto.
 * El ícono es más grande que el texto y cuelga de la barra: arranca 2px bajo
 * el borde de arriba y termina unos px por debajo de la línea roja, así la
 * etiqueta (y el pie del neumático) sobresalen. Vale para escritorio, móvil y
 * el header compacto del scroll.
 * Medidas por tamaño: --u = px por unidad de texto, --B = alto de la barra,
 * --I = alto del ícono (= --B + 1px + lo que sobresale).
 */
const ICON_RATIO = 17.45 / 17.633; // ancho / alto del ícono
const TEXT_W = 31.633;
const TEXT_H = 14.583;

const px = (n: number) => `calc(var(--u) * ${n})`;

export function HeaderLogo({ compact }: { compact: boolean }) {
  const medidas = compact
    ? "[--u:1.78px] [--B:44px] [--I:49px] md:[--B:48px] md:[--I:53px] lg:[--u:2px] lg:[--I:54px]"
    : "[--u:2px] [--B:48px] [--I:53px] md:[--u:2.23px] md:[--B:64px] md:[--I:69px] lg:[--u:3.1px] lg:[--I:71px]";
  return (
    <span
      className={`relative block shrink-0 transition-[width,height] duration-200 ${medidas}`}
      style={{
        height: "var(--B)",
        width: `calc(var(--I) * ${ICON_RATIO.toFixed(4)} + ${px(2 + TEXT_W)})`,
      }}
    >
      {/* eslint-disable @next/next/no-img-element */}
      <img
        src="/logo-trivium-icono.svg"
        alt=""
        aria-hidden="true"
        className="absolute left-0 max-w-none select-none transition-[width,height] duration-200"
        style={{ top: "2px", height: "var(--I)", width: `calc(var(--I) * ${ICON_RATIO.toFixed(4)})` }}
        fetchPriority="high"
      />
      <img
        src="/logo-trivium-texto.svg"
        alt="Neumáticos Trivium"
        className="absolute max-w-none select-none transition-[width,height] duration-200"
        style={{
          left: `calc(var(--I) * ${ICON_RATIO.toFixed(4)} + ${px(2)})`,
          top: `calc((var(--B) - ${px(TEXT_H)}) / 2)`,
          width: px(TEXT_W),
          height: px(TEXT_H),
        }}
        fetchPriority="high"
      />
      {/* eslint-enable @next/next/no-img-element */}
    </span>
  );
}
