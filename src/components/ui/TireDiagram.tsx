"use client";

import { PRICE_TAG_BLACK_PATH, PRICE_TAG_RED_PATH, PRICE_TAG_STROKE, PRICE_TAG_VIEWBOX } from "./PriceTagIcon";

type Segment = "width" | "aspect" | "rim";

type TireDiagramProps = {
  width?: string | number;
  aspect?: string | number;
  rim?: string | number;
  placeholderSize?: { w: string; p: string; r: string };
  focused?: Segment | null;
  onSegmentSelect?: (segment: Segment) => void;
  compact?: boolean;
};

// Mismos colores que la guía "Cómo leer la medida": cada dato se ve igual en
// todo el sitio.
const COLOR = { width: "#ff1e00", aspect: "#6ba0d8", rim: "#ff8066" } as const;
const NOMBRE = { width: "Ancho", aspect: "Perfil", rim: "Rodado" } as const;

const AYUDA: Record<Segment, string> = {
  width: "Ancho: de lado a lado de la banda, en milímetros (3 cifras, por ejemplo 205).",
  aspect: "Perfil: la altura del flanco como % del ancho (2 cifras, por ejemplo 55).",
  rim: "Rodado: el diámetro de la llanta, en pulgadas (2 cifras, por ejemplo 16).",
};

const CX = 500;
const CY = 500;
const R0 = 450; // radio exterior dibujado

/**
 * Neumático de frente con la medida escrita sobre el flanco. Las proporciones
 * son las reales de lo que se escribe: un perfil 35 se ve más bajo que un 70 y
 * un rodado 13 más chico que un 17 (flanco = ancho × perfil; llanta = rodado en
 * pulgadas). Mientras la medida no está completa se dibuja una de referencia.
 */
export function TireDiagram({
  width = "",
  aspect = "",
  rim = "",
  placeholderSize = { w: "205", p: "55", r: "16" },
  focused = null,
  onSegmentSelect,
  compact = false,
}: TireDiagramProps) {
  const widthStr = width ? String(width) : placeholderSize.w;
  const aspectStr = aspect ? String(aspect) : placeholderSize.p;
  const rimStr = rim ? String(rim) : placeholderSize.r;

  // Geometría: sólo con valores completos y razonables; si no, la referencia
  // 205/55 R16 (así el dibujo no salta mientras se escribe cada cifra).
  const wN = Number(width), pN = Number(aspect), rN = Number(rim);
  const completa = String(width).length === 3 && String(aspect).length === 2 && String(rim).length === 2 && wN >= 125 && wN <= 400 && pN >= 20 && pN <= 90 && rN >= 10 && rN <= 24;
  const [w, p, r] = completa ? [wN, pN, rN] : [205, 55, 16];
  const rimMm = r * 25.4;
  const flankMm = (w * p) / 100;
  const totalMm = rimMm + 2 * flankMm;
  const inner = R0 - 26; // borde interno del flanco (la banda de rodamiento queda afuera)
  const rimPx = (rimMm / totalMm) * R0;
  const band = inner - rimPx;
  const font = Math.max(36, Math.min(76, band * 0.5));
  const textR = rimPx + band * 0.24;
  const textPath = `M ${CX - textR} ${CY} A ${textR} ${textR} 0 0 1 ${CX + textR} ${CY}`;
  const rimScale = rimPx / 300;

  const seg = (s: Segment, text: string, placeholder: boolean) => {
    const on = focused === s;
    return (
      <tspan
        key={s}
        fill={COLOR[s]}
        fontSize={on ? font * 1.14 : font}
        fontWeight={on ? 900 : 800}
        opacity={placeholder && !on ? 0.65 : 1}
        stroke={on ? "#ffffff" : "none"}
        strokeWidth={on ? 2.5 : 0}
        paintOrder="stroke"
        style={{ cursor: onSegmentSelect ? "pointer" : "default", transition: "font-size .2s" }}
        onClick={() => onSegmentSelect?.(s)}
      >
        {text}
      </tspan>
    );
  };

  const chip = (s: Segment, valor: string, unidad: string, placeholder: boolean) => {
    const on = focused === s;
    return (
      <button
        key={s}
        type="button"
        tabIndex={-1}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onSegmentSelect?.(s)}
        className="flex min-w-0 flex-1 items-center gap-1.5 rounded-lg border px-2 py-1.5 text-left transition-colors"
        style={{
          borderColor: on ? COLOR[s] : "#e2e8f0",
          background: on ? `${COLOR[s]}1f` : "#ffffff",
        }}
      >
        <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: COLOR[s] }} />
        <span className="min-w-0 leading-tight">
          <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">{NOMBRE[s]}</span>
          <span className={`block truncate text-xs font-black ${placeholder ? "text-slate-400" : "text-navy-900"}`}>
            {valor} {unidad}
          </span>
        </span>
      </button>
    );
  };

  return (
    <div className={`flex flex-col items-center ${compact ? "py-1" : "py-3"}`}>
      <svg viewBox="0 0 1000 560" className={`h-auto w-full ${compact ? "max-w-[260px]" : "max-w-lg"}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label={`Neumático ${widthStr}/${aspectStr} R${rimStr}`}>
        <defs>
          <radialGradient id="td-rim" cx="40%" cy="35%" r="75%">
            <stop offset="0" stopColor="#f1f5f9" />
            <stop offset=".55" stopColor="#94a3b8" />
            <stop offset="1" stopColor="#475569" />
          </radialGradient>
          <radialGradient id="td-tire" cx="50%" cy="50%" r="50%">
            <stop offset=".6" stopColor="#1c1c1c" />
            <stop offset=".92" stopColor="#2a2a2a" />
            <stop offset="1" stopColor="#111111" />
          </radialGradient>
          <path id="td-text-path" d={textPath} />
        </defs>

        {/* Neumático */}
        <circle cx={CX} cy={CY} r={R0} fill="url(#td-tire)" stroke="#3a3a3a" strokeWidth="4" />
        <circle cx={CX} cy={CY} r={R0 - 11} fill="none" stroke="#0b0b0b" strokeWidth="20" strokeDasharray="34 10" opacity=".9" />
        <circle cx={CX} cy={CY} r={inner} fill="none" stroke="#3a3a3a" strokeWidth="2" />

        {/* Resaltado de lo que se está escribiendo */}
        {focused === "width" && <circle cx={CX} cy={CY} r={R0 - 11} fill="none" stroke={COLOR.width} strokeWidth="24" opacity=".85" />}
        {focused === "aspect" && <circle cx={CX} cy={CY} r={(rimPx + inner) / 2} fill="none" stroke={COLOR.aspect} strokeWidth={band} opacity=".28" />}

        {/* Llanta: se dibuja a radio 300 y se escala al real */}
        <g transform={`translate(${CX} ${CY}) scale(${rimScale}) translate(${-CX} ${-CY})`}>
          <circle cx={CX} cy={CY} r={312} fill="#0a0a0a" />
          <circle cx={CX} cy={CY} r={300} fill="url(#td-rim)" />
          <circle cx={CX} cy={CY} r={262} fill="#1c1c1c" />
          {[0, 1, 2, 3, 4].map((k) => (
            <path key={k} transform={`rotate(${k * 72 - 90} ${CX} ${CY})`} d={`M${CX + 60} ${CY - 40} L${CX + 280} ${CY - 66} Q${CX + 298} ${CY} ${CX + 280} ${CY + 66} L${CX + 60} ${CY + 40}z`} fill="url(#td-rim)" />
          ))}
          <circle cx={CX} cy={CY} r={96} fill="url(#td-rim)" stroke="#475569" strokeWidth="5" />
        </g>
        {/* Logo en el centro */}
        <svg x={CX - 24} y={CY - 34} width="48" height="68" viewBox={PRICE_TAG_VIEWBOX} aria-hidden="true">
          <g stroke="#ffffff" strokeWidth={PRICE_TAG_STROKE} paintOrder="stroke fill markers">
            <path fill="#ff1e00" d={PRICE_TAG_RED_PATH} />
            <path fill="#000000" d={PRICE_TAG_BLACK_PATH} />
          </g>
        </svg>
        {focused === "rim" && (
          <g>
            <circle cx={CX} cy={CY} r={rimPx} fill="none" stroke={COLOR.rim} strokeWidth="9" />
            <line x1={CX - rimPx} y1={CY + 40} x2={CX + rimPx} y2={CY + 40} stroke={COLOR.rim} strokeWidth="7" strokeDasharray="3 0" />
          </g>
        )}

        {/* Medida sobre el flanco */}
        <text fontWeight="800" letterSpacing="0.03em" style={{ fontFamily: "var(--font-geist-sans, system-ui, sans-serif)" }}>
          <textPath href="#td-text-path" startOffset="50%" textAnchor="middle">
            {seg("width", widthStr, !width)}
            <tspan fill="#94a3b8" fontSize={font}>/</tspan>
            {seg("aspect", aspectStr, !aspect)}
            <tspan fill="#cbd5e1" fontSize={font}> R</tspan>
            {seg("rim", rimStr, !rim)}
          </textPath>
        </text>
      </svg>

      <div className="mt-1 flex w-full max-w-lg gap-1.5">
        {chip("width", widthStr, "mm", !width)}
        {chip("aspect", aspectStr, "%", !aspect)}
        {chip("rim", rimStr, "″", !rim)}
      </div>
      <p className={`mt-1.5 w-full max-w-lg text-center leading-snug text-slate-600 ${compact ? "text-[11px]" : "text-xs"}`} aria-live="polite">
        {focused
          ? AYUDA[focused]
          : completa
            ? `Flanco de ${flankMm.toFixed(1).replace(".", ",")} mm · rueda de ${Math.round(totalMm)} mm de diámetro.`
            : "Tocá un número o escribilo abajo: el dibujo se adapta a tu medida."}
      </p>
    </div>
  );
}
