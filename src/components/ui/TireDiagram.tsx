"use client";

type TireDiagramProps = {
  width?: string | number;
  aspect?: string | number;
  rim?: string | number;
  focused?: 'width' | 'aspect' | 'rim' | null;
  compact?: boolean;
  theme?: {
    bg?: string;
    accent?: string;
    font?: string;
    mono?: string;
    grid?: string;
  };
};

export function TireDiagram({
  width = "",
  aspect = "",
  rim = "",
  focused = null,
  compact = false,
  theme = { accent: "#ff6a3d" }
}: TireDiagramProps) {
  const cx = 681.5;
  const cy = 682.3;
  const measureTextCy = 662;
  const textRadius = 528;
  const secondaryTextRadius = 638;

  const isWidthPlaceholder = !width;
  const isAspectPlaceholder = !aspect;
  const isRimPlaceholder = !rim;

  const widthStr = width ? String(width) : "205";
  const aspectStr = aspect ? String(aspect) : "55";
  const rimStr = rim ? String(rim) : "16";

  const getTspanStyle = (segment: 'width' | 'aspect' | 'rim') => {
    const isFocused = focused === segment;
    const isPlaceholder = segment === 'width' ? isWidthPlaceholder : segment === 'aspect' ? isAspectPlaceholder : isRimPlaceholder;
    return {
      fontSize: isFocused ? `${74 * 1.16}px` : "74px",
      fontWeight: isFocused ? "800" : "700",
      fill: isFocused ? theme.accent : isPlaceholder ? "#2d3748" : "#e8e6df",
      transition: "font-size 0.2s, fill 0.2s",
      letterSpacing: "0.04em",
    };
  };

  return (
    <div className={`flex flex-col items-center ${compact ? 'py-1' : 'py-3'}`}>
      <svg
        viewBox="0 0 1362.9773 682.33777"
        className={`w-full h-auto ${compact ? 'max-w-[200px]' : 'max-w-lg'}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Halo radial sutil detrás de la rueda */}
          <radialGradient id="haloGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: "#ffffff", stopOpacity: 0.1 }} />
            <stop offset="100%" style={{ stopColor: "#ffffff", stopOpacity: 0 }} />
          </radialGradient>

          {/* Path para el texto principal curvado */}
          <path
            id="textPath"
            d={`M ${cx - textRadius} ${measureTextCy} A ${textRadius} ${textRadius} 0 0 1 ${cx + textRadius} ${measureTextCy}`}
            fill="none"
          />

          {/* Path para el texto secundario */}
          <path
            id="secondaryTextPath"
            d={`M ${cx - secondaryTextRadius} ${cy} A ${secondaryTextRadius} ${secondaryTextRadius} 0 0 1 ${cx + secondaryTextRadius} ${cy}`}
            fill="none"
          />
        </defs>

        {/* Halo radial detrás de la rueda */}
        <circle
          cx={cx}
          cy={cy}
          r="650"
          fill="url(#haloGradient)"
          opacity="0.3"
        />

        {/* SVG del neumático */}
        <g transform="matrix(1.3333333 0 0 -1.3333333 2841.76 1842.7029) translate(150.3846 -240.21272) translate(-2419.8917 511.11992)">
          <path
            fill="#a0a6a7"
            d="m 649.304,315.94 c -156.882,0 -284.059,127.178 -284.059,284.06 0,156.882 127.177,284.06 284.059,284.06 156.882,0 284.06,-127.178 284.06,-284.06 0,-156.882 -127.178,-284.06 -284.06,-284.06 z m 0,634.27 c -193.415,0 -350.21,-156.794 -350.21,-350.21 0,-193.416 156.795,-350.21 350.21,-350.21 193.416,0 350.211,156.794 350.211,350.21 0,193.416 -156.795,350.21 -350.211,350.21"
          />
          <path
            fill="#1c1c1c"
            d="m 649.304,281.972 c -175.635,0 -318.028,142.393 -318.028,318.028 0,175.635 142.393,318.029 318.028,318.029 175.635,0 318.029,-142.394 318.029,-318.029 0,-175.635 -142.394,-318.028 -318.029,-318.028 z m 0,829.148 c -282.288,0 -511.117,-228.831 -511.117,-511.12 0,-282.288 228.829,-511.1199 511.117,-511.1199 282.289,0 511.116,228.8319 511.116,511.1199 0,282.289 -228.827,511.12 -511.116,511.12"
          />
          <path
            fill="#1c1c1c"
            stroke="#ff0000"
            strokeWidth="0.09975"
            d="m 649.304,125.39 c -262.125,0 -474.609,212.485 -474.609,474.61 0,262.125 212.484,474.61 474.609,474.61 262.125,0 474.606,-212.485 474.606,-474.61 0,-262.125 -212.481,-474.61 -474.606,-474.61 z m 0,985.73 c -282.288,0 -511.117,-228.831 -511.117,-511.12 0,-282.288 228.829,-511.1199 511.117,-511.1199 282.289,0 511.116,228.8319 511.116,511.1199 0,282.289 -228.827,511.12 -511.116,511.12"
          />
          <path
            fill="#e3e5e4"
            d="m 649.304,281.972 c -175.642,0 -318.028,142.385 -318.028,318.028 0,175.643 142.386,318.029 318.028,318.029 175.643,0 318.029,-142.386 318.029,-318.029 0,-175.643 -142.386,-318.028 -318.029,-318.028 z m 0,673.917 C 452.752,955.889 293.415,796.552 293.415,600 c 0,-196.552 159.337,-355.89 355.889,-355.89 196.552,0 355.886,159.338 355.886,355.89 0,196.552 -159.334,355.889 -355.886,355.889"
          />
          <path
            fill="#e3e5e4"
            d="m 967.333,600 c 0,-14.974 -1.041,-29.721 -3.048,-44.146 L 857.367,553.98 c -58.04,-1.022 -84.921,-47.59 -56.791,-98.362 l 54.406,-98.19 C 829.369,335.677 800.254,317.92 768.603,305.123 l -55.106,91.68 c -29.91,49.748 -83.691,49.748 -113.601,0 l -57.87,-96.28 c -32.2,11.529 -61.977,28.112 -88.423,48.783 l 51.831,93.516 c 28.13,50.771 1.231,97.339 -56.809,98.362 l -112.295,1.968 c -3.313,18.439 -5.054,37.445 -5.054,56.848 0,14.974 1.041,29.721 3.047,44.146 l 106.919,1.874 c 58.04,1.022 84.921,47.59 56.79,98.361 l -54.406,98.192 c 25.613,21.751 54.728,39.507 86.38,52.304 l 55.106,-91.679 c 29.909,-49.749 83.69,-49.749 113.6,0 l 57.87,96.279 c 32.2,-11.528 61.978,-28.111 88.423,-48.784 l -51.831,-93.515 c -28.13,-50.771 -1.23,-97.34 56.81,-98.362 l 112.295,-1.968 c 3.312,-18.438 5.054,-37.445 5.054,-56.848"
          />
          <path
            fill="#a0a6a7"
            d="m 649.304,668.149 c -37.638,0 -68.149,-30.511 -68.149,-68.149 0,-37.639 30.511,-68.149 68.149,-68.149 37.639,0 68.149,30.51 68.149,68.149 0,37.638 -30.51,68.149 -68.149,68.149"
          />
          <path
            fill="#727c82"
            d="m 649.304,747.656 c -15.682,0 -28.395,-12.713 -28.395,-28.395 0,-15.683 12.713,-28.396 28.395,-28.396 15.683,0 28.396,12.713 28.396,28.396 0,15.682 -12.713,28.395 -28.396,28.395"
          />
          <path
            fill="#727c82"
            d="m 511.167,650.045 c -4.846,-14.915 3.316,-30.935 18.231,-35.781 14.916,-4.846 30.935,3.317 35.781,18.231 4.846,14.916 -3.316,30.934 -18.231,35.781 -14.915,4.846 -30.934,-3.317 -35.781,-18.231"
          />
          <path
            fill="#727c82"
            d="m 561.315,488.506 c 12.687,-9.219 30.445,-6.406 39.663,6.281 9.218,12.688 6.405,30.445 -6.282,39.663 -12.688,9.218 -30.445,6.405 -39.663,-6.282 -9.218,-12.688 -6.406,-30.444 6.282,-39.662"
          />
          <path
            fill="#727c82"
            d="m 730.444,486.28 c 12.688,9.218 15.501,26.975 6.283,39.663 -9.219,12.688 -26.976,15.499 -39.663,6.282 -12.688,-9.218 -15.501,-26.976 -6.282,-39.663 9.218,-12.688 26.975,-15.5 39.662,-6.282"
          />
          <path
            fill="#727c82"
            d="m 784.825,646.444 c -4.846,14.915 -20.866,23.077 -35.78,18.231 -14.916,-4.846 -23.077,-20.865 -18.232,-35.78 4.847,-14.916 20.866,-23.078 35.781,-18.231 14.915,4.846 23.077,20.865 18.231,35.78"
          />
        </g>

        {/* TEXTO PRINCIPAL CURVADO SOBRE EL FLANCO */}
        <text
          style={{ fontFamily: theme.mono || 'var(--font-geist-sans, system-ui, sans-serif)' }}
          fontSize="74"
          fontWeight="700"
          letterSpacing="0.04em"
          fill="#e8e6df"
        >
          <textPath href="#textPath" startOffset="50%" textAnchor="middle">
            <tspan style={getTspanStyle('width')}>{widthStr}</tspan>
            <tspan>/</tspan>
            <tspan style={getTspanStyle('aspect')}>{aspectStr}</tspan>
            <tspan> R</tspan>
            <tspan style={getTspanStyle('rim')}>{rimStr}</tspan>
          </textPath>
        </text>

        {/* TEXTO SECUNDARIO EMBOSSED CERCA DEL TREAD */}
        <text
          style={{ fontFamily: theme.mono || 'var(--font-geist-sans, system-ui, sans-serif)' }}
          fontSize="22"
          fontWeight="700"
          letterSpacing="0.42em"
          fill="#35373a"
          opacity="0.4"
        >
          <textPath href="#secondaryTextPath" startOffset="50%" textAnchor="middle">
            RADIAL · TUBELESS
          </textPath>
        </text>
      </svg>
    </div>
  );
}
