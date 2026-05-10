"use client";

type TireDiagramProps = {
  width?: string;
  profile?: string;
  rim?: string;
};

export function TireDiagram({ width = "", profile = "", rim = "" }: TireDiagramProps) {
  const hasData = !!(width || profile || rim);

  // Calcular proporciones del neumático
  const profileNum = profile ? parseInt(profile) : 65;
  const profileRatio = profileNum / 100;
  
  const rimNum = rim ? parseInt(rim) : 15;
  // Convertir pulgadas a mm aproximadamente (1 pulgada = 25.4mm, pero simplificamos)
  const rimDiameterMm = rimNum * 25.4;
  const widthNum = width ? parseInt(width) : 175;

  // Radio del neumático en mm
  const tireOuterRadius = (rimDiameterMm + widthNum * profileRatio * 2) / 2;
  const rimRadius = rimDiameterMm / 2;

  // Escalar a SVG (dividir por 2 para que quepa bien)
  const scale = 150 / tireOuterRadius;
  const svgTireRadius = tireOuterRadius * scale;
  const svgRimRadius = rimRadius * scale;
  const svgProfileWidth = widthNum * scale;
  const svgProfileHeight = (widthNum * profileRatio) * scale;

  const cx = 200;
  const cy = 180;

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <svg
        viewBox="0 0 400 360"
        className="w-full max-w-sm h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="tireOuterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#1e293b", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "#0f172a", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#1e293b", stopOpacity: 1 }} />
          </linearGradient>
          <radialGradient id="rimGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: "#94a3b8", stopOpacity: 1 }} />
            <stop offset="70%" style={{ stopColor: "#64748b", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#475569", stopOpacity: 1 }} />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Banda de rodadura - círculo exterior */}
        <circle
          cx={cx}
          cy={cy}
          r={svgTireRadius}
          fill={hasData ? "url(#tireOuterGradient)" : "#334155"}
          opacity={hasData ? 1 : 0.6}
          filter={hasData ? "url(#glow)" : "none"}
        />

        {/* Llanta/Rim */}
        <circle
          cx={cx}
          cy={cy}
          r={svgRimRadius}
          fill={hasData ? "url(#rimGradient)" : "#94a3b8"}
          opacity={hasData ? 0.95 : 0.5}
        />

        {/* Centro de llanta */}
        <circle
          cx={cx}
          cy={cy}
          r={svgRimRadius * 0.4}
          fill="#0f172a"
        />

        {/* Tornillos de la rueda */}
        {[0, 72, 144, 216, 288].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x = cx + Math.cos(rad) * (svgRimRadius * 0.7);
          const y = cy + Math.sin(rad) * (svgRimRadius * 0.7);
          return (
            <circle
              key={angle}
              cx={x}
              cy={y}
              r="4"
              fill={hasData ? "#f97316" : "#64748b"}
              opacity={hasData ? 0.8 : 0.3}
            />
          );
        })}

        {/* Líneas de medida - Ancho (arriba) */}
        {width && (
          <g>
            <line
              x1={cx - svgProfileWidth / 2}
              y1={cy - svgTireRadius - 25}
              x2={cx + svgProfileWidth / 2}
              y2={cy - svgTireRadius - 25}
              stroke="#f97316"
              strokeWidth="2"
              markerStart="url(#arrowStart)"
              markerEnd="url(#arrowEnd)"
            />
            <circle cx={cx - svgProfileWidth / 2} cy={cy - svgTireRadius - 25} r="3" fill="#f97316" />
            <circle cx={cx + svgProfileWidth / 2} cy={cy - svgTireRadius - 25} r="3" fill="#f97316" />
            <text
              x={cx}
              y={cy - svgTireRadius - 35}
              textAnchor="middle"
              fontSize="16"
              fontWeight="900"
              fill="#f97316"
              className="font-sans"
            >
              {width} mm
            </text>
            <text
              x={cx}
              y={cy - svgTireRadius - 50}
              textAnchor="middle"
              fontSize="11"
              fontWeight="bold"
              fill="#cbd5e1"
              className="font-sans"
            >
              ANCHO
            </text>
          </g>
        )}

        {/* Líneas de medida - Perfil (izquierda) */}
        {profile && (
          <g>
            <line
              x1={cx - svgProfileWidth / 2 - 35}
              y1={cy - svgProfileHeight}
              x2={cx - svgProfileWidth / 2 - 35}
              y2={cy + svgProfileHeight}
              stroke="#f97316"
              strokeWidth="2"
            />
            <circle cx={cx - svgProfileWidth / 2 - 35} cy={cy - svgProfileHeight} r="3" fill="#f97316" />
            <circle cx={cx - svgProfileWidth / 2 - 35} cy={cy + svgProfileHeight} r="3" fill="#f97316" />
            <text
              x={cx - svgProfileWidth / 2 - 50}
              y={cy + 5}
              textAnchor="middle"
              fontSize="16"
              fontWeight="900"
              fill="#f97316"
              className="font-sans"
            >
              {profile}%
            </text>
            <text
              x={cx - svgProfileWidth / 2 - 50}
              y={cy - 20}
              textAnchor="middle"
              fontSize="11"
              fontWeight="bold"
              fill="#cbd5e1"
              className="font-sans"
            >
              PERFIL
            </text>
          </g>
        )}

        {/* Rodado - en el centro */}
        {rim && (
          <g>
            <text
              x={cx}
              y={cy - 5}
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fill="#cbd5e1"
              className="font-sans"
            >
              R
            </text>
            <text
              x={cx}
              y={cy + 15}
              textAnchor="middle"
              fontSize="22"
              fontWeight="900"
              fill="#f97316"
              className="font-sans"
            >
              {rim}"
            </text>
          </g>
        )}

        {/* Etiqueta de rodado - abajo */}
        {rim && (
          <text
            x={cx}
            y={cy + svgTireRadius + 45}
            textAnchor="middle"
            fontSize="11"
            fontWeight="bold"
            fill="#cbd5e1"
            className="font-sans"
          >
            RODADO
          </text>
        )}
      </svg>

      {/* Medida completa */}
      <div className={`text-center transition-opacity duration-300 ${hasData ? "opacity-100" : "opacity-0"}`}>
        <p className="text-sm text-slate-400">
          Medida: <span className="text-orange-400 font-black text-lg">{width || "—"}/{profile || "—"} R{rim || "—"}</span>
        </p>
      </div>
    </div>
  );
}
