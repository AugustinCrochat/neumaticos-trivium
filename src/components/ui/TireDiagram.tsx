"use client";

type TireDiagramProps = {
  width?: string;
  profile?: string;
  rim?: string;
};

export function TireDiagram({ width = "", profile = "", rim = "" }: TireDiagramProps) {
  const hasData = !!(width || profile || rim);

  // Radio fijo para simplificar
  const tireRadius = 140;
  const rimRadius = 70;

  const cx = 200;
  const cy = 200;

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <svg
        viewBox="0 0 400 280"
        className="w-full max-w-sm h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradiente para el flanco del neumático */}
          <linearGradient id="tireFlankGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#1e293b", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "#0f172a", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#1e293b", stopOpacity: 1 }} />
          </linearGradient>

          {/* Gradiente para la banda de rodadura */}
          <linearGradient id="tireThreadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#0f172a", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "#000000", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#0f172a", stopOpacity: 1 }} />
          </linearGradient>

          {/* Gradiente para la llanta */}
          <radialGradient id="rimGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: "#cbd5e1", stopOpacity: 1 }} />
            <stop offset="70%" style={{ stopColor: "#64748b", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#475569", stopOpacity: 1 }} />
          </radialGradient>

          {/* Filtro para sombra */}
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Solo la mitad/tercio superior del neumático */}
        {/* Banda de rodadura (parte negra de arriba) */}
        <path
          d={`M ${cx - tireRadius} ${cy} A ${tireRadius} ${tireRadius} 0 0 1 ${cx + tireRadius} ${cy} L ${cx + tireRadius} ${cy - 20} A ${tireRadius} ${tireRadius} 0 0 0 ${cx - tireRadius} ${cy - 20} Z`}
          fill={hasData ? "url(#tireThreadGradient)" : "#1e293b"}
          opacity={hasData ? 1 : 0.6}
          filter="url(#shadow)"
        />

        {/* Flanco del neumático (gris oscuro) - semicírculo hasta la llanta */}
        <path
          d={`M ${cx - tireRadius} ${cy} A ${tireRadius} ${tireRadius} 0 0 1 ${cx + tireRadius} ${cy} L ${cx + rimRadius} ${cy} A ${rimRadius} ${rimRadius} 0 0 0 ${cx - rimRadius} ${cy} Z`}
          fill={hasData ? "url(#tireFlankGradient)" : "#334155"}
          opacity={hasData ? 0.9 : 0.5}
          filter="url(#shadow)"
        />

        {/* Borde del neumático (línea más oscura) */}
        <path
          d={`M ${cx - tireRadius} ${cy} A ${tireRadius} ${tireRadius} 0 0 1 ${cx + tireRadius} ${cy}`}
          fill="none"
          stroke="#000000"
          strokeWidth="1"
          opacity="0.5"
        />

        {/* Llanta/Rim - visible en el centro inferior */}
        <circle
          cx={cx}
          cy={cy}
          r={rimRadius}
          fill={hasData ? "url(#rimGradient)" : "#94a3b8"}
          opacity={hasData ? 0.9 : 0.5}
        />

        {/* Centro de llanta */}
        <circle cx={cx} cy={cy} r={rimRadius * 0.35} fill="#0f172a" opacity="0.8" />

        {/* Tornillos de la rueda */}
        {[45, 135, 225, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x = cx + Math.cos(rad) * (rimRadius * 0.6);
          const y = cy + Math.sin(rad) * (rimRadius * 0.6);
          return (
            <circle
              key={angle}
              cx={x}
              cy={y}
              r="3.5"
              fill={hasData ? "#f97316" : "#64748b"}
              opacity={hasData ? 0.8 : 0.3}
            />
          );
        })}

        {/* TEXTO DE MEDIDA SUPERPUESTO EN EL FLANCO */}
        <g>
          {/* Sombra para mejor legibilidad */}
          <text
            x={cx}
            y={cy - 35}
            textAnchor="middle"
            fontSize="48"
            fontWeight="900"
            fill="#000000"
            opacity="0.4"
            className="font-mono"
          >
            {width || "—"}
          </text>
          <text
            x={cx - 75}
            y={cy - 35}
            textAnchor="middle"
            fontSize="48"
            fontWeight="900"
            fill="#000000"
            opacity="0.4"
            className="font-mono"
          >
            /
          </text>
          <text
            x={cx + 75}
            y={cy - 35}
            textAnchor="middle"
            fontSize="48"
            fontWeight="900"
            fill="#000000"
            opacity="0.4"
            className="font-mono"
          >
            {profile || "—"}
          </text>
          <text
            x={cx}
            y={cy + 25}
            textAnchor="middle"
            fontSize="42"
            fontWeight="900"
            fill="#000000"
            opacity="0.4"
            className="font-mono"
          >
            R{rim || "—"}
          </text>

          {/* Texto principal - ANCHO */}
          <text
            x={cx - 75}
            y={cy - 40}
            textAnchor="middle"
            fontSize="48"
            fontWeight="900"
            fill={hasData && width ? "#f97316" : "#cbd5e1"}
            opacity={hasData && width ? 1 : 0.5}
            className="font-mono transition-all"
          >
            {width || "—"}
          </text>

          {/* DIAGONAL */}
          <text
            x={cx}
            y={cy - 40}
            textAnchor="middle"
            fontSize="48"
            fontWeight="900"
            fill={hasData ? "#f97316" : "#cbd5e1"}
            opacity={hasData ? 1 : 0.5}
            className="font-mono"
          >
            /
          </text>

          {/* PERFIL */}
          <text
            x={cx + 75}
            y={cy - 40}
            textAnchor="middle"
            fontSize="48"
            fontWeight="900"
            fill={hasData && profile ? "#f97316" : "#cbd5e1"}
            opacity={hasData && profile ? 1 : 0.5}
            className="font-mono"
          >
            {profile || "—"}
          </text>

          {/* RODADO */}
          <text
            x={cx}
            y={cy + 20}
            textAnchor="middle"
            fontSize="42"
            fontWeight="900"
            fill={hasData && rim ? "#f97316" : "#cbd5e1"}
            opacity={hasData && rim ? 1 : 0.5}
            className="font-mono"
          >
            R{rim || "—"}
          </text>
        </g>
      </svg>

      {/* Leyenda */}
      {hasData && (
        <div className="text-center text-xs text-slate-500 animate-in fade-in duration-300">
          <p>
            Medida: <span className="text-orange-400 font-black">{width || "—"}/{profile || "—"} R{rim || "—"}</span>
          </p>
        </div>
      )}
    </div>
  );
}
