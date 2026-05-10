"use client";

import { useMemo } from "react";

type TireDiagramProps = {
  width?: string;
  profile?: string;
  rim?: string;
};

export function TireDiagram({ width = "", profile = "", rim = "" }: TireDiagramProps) {
  const hasData = !!(width || profile || rim);

  // Calcular altura del perfil basado en la entrada
  const profileHeight = profile ? Math.min(parseInt(profile) / 100 * 40, 45) : 20;
  
  // Calcular radio basado en rodado
  const rimRadius = rim ? Math.min(parseInt(rim) * 3 + 20, 120) : 60;
  const tireRadius = rimRadius + profileHeight;

  // Colores dinámicos basados en si hay datos
  const tireColor = hasData ? "url(#tireGradient)" : "#1e293b";
  const rimColor = hasData ? "url(#rimGradient)" : "#334155";
  const textColor = hasData ? "#f97316" : "#64748b";
  const labelColor = hasData ? "#ffffff" : "#94a3b8";

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <svg
        viewBox="0 0 400 320"
        className="w-full max-w-sm h-auto drop-shadow-2xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradientes */}
          <linearGradient id="tireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#1e293b", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#0f172a", stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="rimGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#94a3b8", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#64748b", stopOpacity: 1 }} />
          </linearGradient>

          {/* Filtros de sombra */}
          <filter id="shadow">
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="6"
              floodOpacity={hasData ? 0.3 : 0.15}
            />
          </filter>
        </defs>

        {/* Fondo */}
        <rect width="400" height="320" fill="transparent" />

        {/* Sección izquierda: Neumático de lado */}
        <g>
          {/* Banda de rodadura - Exterior */}
          <ellipse
            cx="120"
            cy="160"
            rx={tireRadius}
            ry={profileHeight + 28}
            fill={tireColor}
            filter="url(#shadow)"
            opacity={hasData ? 0.95 : 0.7}
          />

          {/* Llanta/Rim */}
          <ellipse
            cx="120"
            cy="160"
            rx={rimRadius}
            ry={rimRadius * 0.65}
            fill={rimColor}
            filter="url(#shadow)"
          />

          {/* Centro de llanta */}
          <circle
            cx="120"
            cy="160"
            r={rimRadius * 0.35}
            fill="#1e293b"
            filter="url(#shadow)"
          />

          {/* Detalle de aguja central */}
          <circle cx="120" cy="160" r="8" fill="#f97316" opacity={hasData ? 0.6 : 0.2} />

          {/* Línea de corte para ver el perfil */}
          <line
            x1="120"
            y1={160 - profileHeight - 28}
            x2="120"
            y2={160 + profileHeight + 28}
            stroke="#f97316"
            strokeWidth={hasData ? "2" : "1"}
            strokeDasharray="4,4"
            opacity={hasData ? 0.5 : 0.2}
          />
        </g>

        {/* Sección derecha: Diagrama de medidas */}
        <g>
          {/* Línea horizontal para ancho */}
          <line
            x1="240"
            y1="80"
            x2="380"
            y2="80"
            stroke={textColor}
            strokeWidth={width ? "3" : "1.5"}
            opacity={width ? 1 : 0.3}
          />
          <circle
            cx="240"
            cy="80"
            r="4"
            fill={textColor}
            opacity={width ? 1 : 0.3}
          />
          <circle
            cx="380"
            cy="80"
            r="4"
            fill={textColor}
            opacity={width ? 1 : 0.3}
          />

          {/* Línea de perfil (altura lateral) */}
          <line
            x1="230"
            y1="120"
            x2="230"
            y2="200"
            stroke={textColor}
            strokeWidth={profile ? "3" : "1.5"}
            opacity={profile ? 1 : 0.3}
          />
          <circle
            cx="230"
            cy="120"
            r="4"
            fill={textColor}
            opacity={profile ? 1 : 0.3}
          />
          <circle
            cx="230"
            cy="200"
            r="4"
            fill={textColor}
            opacity={profile ? 1 : 0.3}
          />

          {/* Línea de rodado (tamaño llanta) */}
          <circle
            cx="310"
            cy="240"
            r="30"
            fill="none"
            stroke={textColor}
            strokeWidth={rim ? "3" : "1.5"}
            opacity={rim ? 1 : 0.3}
          />
          <circle
            cx="310"
            cy="240"
            r="6"
            fill={textColor}
            opacity={rim ? 1 : 0.3}
          />

          {/* Etiquetas */}
          <text
            x="310"
            y="65"
            textAnchor="middle"
            fontSize="12"
            fontWeight="bold"
            fill={labelColor}
            opacity={width ? 1 : 0.4}
            className="font-sans"
          >
            ANCHO
          </text>
          <text
            x="310"
            y="78"
            textAnchor="middle"
            fontSize="18"
            fontWeight="900"
            fill={textColor}
            opacity={width ? 1 : 0.3}
            className="font-sans"
          >
            {width || "—"}
          </text>
          <text
            x="310"
            y="95"
            textAnchor="middle"
            fontSize="10"
            fill={labelColor}
            opacity={width ? 1 : 0.3}
            className="font-sans"
          >
            mm
          </text>

          <text
            x="190"
            y="165"
            textAnchor="middle"
            fontSize="12"
            fontWeight="bold"
            fill={labelColor}
            opacity={profile ? 1 : 0.4}
            className="font-sans"
          >
            PERFIL
          </text>
          <text
            x="190"
            y="185"
            textAnchor="middle"
            fontSize="18"
            fontWeight="900"
            fill={textColor}
            opacity={profile ? 1 : 0.3}
            className="font-sans"
          >
            {profile || "—"}
          </text>
          <text
            x="190"
            y="202"
            textAnchor="middle"
            fontSize="10"
            fill={labelColor}
            opacity={profile ? 1 : 0.3}
            className="font-sans"
          >
            %
          </text>

          <text
            x="310"
            y="235"
            textAnchor="middle"
            fontSize="12"
            fontWeight="bold"
            fill={labelColor}
            opacity={rim ? 1 : 0.4}
            className="font-sans"
          >
            RODADO
          </text>
          <text
            x="310"
            y="255"
            textAnchor="middle"
            fontSize="18"
            fontWeight="900"
            fill={textColor}
            opacity={rim ? 1 : 0.3}
            className="font-sans"
          >
            {rim || "—"}
          </text>
          <text
            x="310"
            y="272"
            textAnchor="middle"
            fontSize="10"
            fill={labelColor}
            opacity={rim ? 1 : 0.3}
            className="font-sans"
          >
            pulgadas
          </text>
        </g>
      </svg>

      {/* Leyenda informativa */}
      {hasData && (
        <div className="text-center text-xs text-slate-400 px-4 animate-in fade-in duration-300">
          <p>
            Medida completa: <span className="text-orange-400 font-bold">{width || "—"}/{profile || "—"} R{rim || "—"}</span>
          </p>
        </div>
      )}
    </div>
  );
}
