"use client";

import { useEffect, useState } from "react";

/** Medidas que giran dentro del icono (las mismas que el diagrama del buscador grande). */
const MEDIDAS = [
  { w: "205", p: "55", r: "16" },
  { w: "175", p: "65", r: "14" },
  { w: "195", p: "65", r: "15" },
  { w: "225", p: "45", r: "17" },
  { w: "185", p: "60", r: "15" },
  { w: "265", p: "60", r: "18" },
  { w: "215", p: "65", r: "16" },
  { w: "165", p: "70", r: "13" },
];

/**
 * Icono de neumático para "Por medida": media cubierta en el color del texto.
 * Con `medidas`, en lugar de la flecha roja hay una medida en naranja Trivium,
 * curvada sobre el borde de la cubierta, que cambia sola cada 12 s, cambiando de una a otra sin fundido (igual que el diagrama grande).
 */
export function HalfTireIcon({ className, medidas = false, completo = false }: { className?: string; medidas?: boolean; completo?: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!medidas) return;
    const t = setInterval(() => setI((n) => n + 1), 12000);
    return () => clearInterval(t);
  }, [medidas]);

  const m = MEDIDAS[i % MEDIDAS.length];

  const cuerpo = (
    <>
        <g transform={medidas ? "translate(245.17 245.09) scale(0.86) translate(-245.17 -245.09)" : undefined}>
        <path d="M230.45 245.09c-.11-.72-.18-1.46-.19-2.21-.14-9.74 7.44-17.56 17.11-17.64 9.68-.09 17.43 7.59 17.48 17.31 0 .86-.08 1.71-.2 2.54h19.43c.06-.81.09-1.62.1-2.44.05-20.11-16.29-36.51-36.45-36.58-20.28-.07-36.59 15.97-36.82 36.2-.01.95.03 1.89.09 2.82h19.46Z" />
        <path d="M107.64 245.09c-.19-4.77-.17-9.61.08-14.54 16.09 2.03 30.93 5.81 43.95 14.54h27.03c-3.12-4.83-7.23-9.26-12.32-13.15-14.96-11.44-32.39-16.64-50.6-19.79l-5.78-1.01c3.1-9.39 6.02-18.26 8.86-26.85 10.77 4.75 20.57 9.61 30.77 13.42 12.14 4.53 24.87 6.56 37.78 4.03 22.68-4.44 33.9-20.15 38.98-41.27 4.26-17.73 3.62-35.7 1.56-53.66-.09-.8-.22-1.6-.48-3.42h33.79c-.36 6.59-1.24 12.86-.93 19.06.62 12.09.54 24.46 3.19 36.16 7.33 32.42 31.4 46.97 63.99 40.09 14.81-3.13 28.38-9.31 41.87-17.26 5.66 11.21 9.12 22.77 11 33.79-12.74 4.11-25.23 7.17-36.86 12.21-8.06 3.5-15.86 8.78-22.16 14.93-.91.89-1.77 1.79-2.59 2.7h31.43c9.85-4.84 20.89-7.21 32.32-9.29.08 3.13.06 6.23-.04 9.29h29.25c.02-.82.05-1.64.06-2.46 1.06-91.25-72.11-168.9-166.56-169.13-91.21-.22-166.49 74.22-166.74 164.87 0 2.25.04 4.49.12 6.72h29.04Zm172.7-138.01c33.91 9.55 59.98 28.54 79.8 57.47-16.24 9.45-32.4 17.45-51.33 16.33-11.99-.71-19.95-7.61-24.29-18.62-7.02-17.8-5.34-36.21-4.17-55.18Zm-71.39.2c.48 7.89 1.5 15.16 1.22 22.38-.37 9.27-.85 18.73-2.94 27.71-4.73 20.23-16.73 28.03-37.38 25.67-11.5-1.32-30.69-9.12-40.88-16.82 19.36-29.34 45.49-48.8 79.99-58.95Z" />
        </g>
        <path d="M28.87 245.09c.28-119.75 96.65-215.91 216.64-216 118.92-.09 215.81 96.88 215.82 216h28.99v-.1C490.35 110.42 380.68.15 246.68 0 110.32-.15.12 108.78 0 243.84c0 .42.01.84.01 1.25h28.86Z" />
    </>
  );

  // Cubierta completa (menú): goma maciza y llanta de 5 rayos, uno arriba y dos abajo.
  // Se dibuja aparte porque espejar la media cubierta deja los rayos mal puestos.
  if (completo) {
    const punto = (grados: number, radio: number) => {
      const a = (grados * Math.PI) / 180;
      return { x: 50 + radio * Math.cos(a), y: 50 - radio * Math.sin(a) };
    };
    return (
      <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
        <g fill="currentColor" stroke="currentColor">
          {/* Goma: anillo macizo hasta el borde de la llanta; el hueco queda sólo dentro de la llanta. */}
          <path
            fillRule="evenodd"
            stroke="none"
            d="M0 50a50 50 0 1 0 100 0a50 50 0 1 0-100 0ZM17 50a33 33 0 1 0 66 0a33 33 0 1 0-66 0Z"
          />
          {[90, 18, -54, -126, 162].map((g) => {
            const a = punto(g, 8);
            const b = punto(g, 34);
            return <line key={g} x1={a.x} y1={a.y} x2={b.x} y2={b.y} strokeWidth={9} strokeLinecap="round" />;
          })}
          {/* Cubo con el agujero central. */}
          <path fillRule="evenodd" stroke="none" d="M39 50a11 11 0 1 0 22 0a11 11 0 1 0-22 0ZM46 50a4 4 0 1 0 8 0a4 4 0 1 0-8 0Z" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 490.33 245.09" className={className} aria-hidden="true">
      <g fill="currentColor">
        <g transform={medidas ? "translate(245.17 245.09) scale(0.86) translate(-245.17 -245.09)" : undefined}>
        <path d="M230.45 245.09c-.11-.72-.18-1.46-.19-2.21-.14-9.74 7.44-17.56 17.11-17.64 9.68-.09 17.43 7.59 17.48 17.31 0 .86-.08 1.71-.2 2.54h19.43c.06-.81.09-1.62.1-2.44.05-20.11-16.29-36.51-36.45-36.58-20.28-.07-36.59 15.97-36.82 36.2-.01.95.03 1.89.09 2.82h19.46Z" />
        <path d="M107.64 245.09c-.19-4.77-.17-9.61.08-14.54 16.09 2.03 30.93 5.81 43.95 14.54h27.03c-3.12-4.83-7.23-9.26-12.32-13.15-14.96-11.44-32.39-16.64-50.6-19.79l-5.78-1.01c3.1-9.39 6.02-18.26 8.86-26.85 10.77 4.75 20.57 9.61 30.77 13.42 12.14 4.53 24.87 6.56 37.78 4.03 22.68-4.44 33.9-20.15 38.98-41.27 4.26-17.73 3.62-35.7 1.56-53.66-.09-.8-.22-1.6-.48-3.42h33.79c-.36 6.59-1.24 12.86-.93 19.06.62 12.09.54 24.46 3.19 36.16 7.33 32.42 31.4 46.97 63.99 40.09 14.81-3.13 28.38-9.31 41.87-17.26 5.66 11.21 9.12 22.77 11 33.79-12.74 4.11-25.23 7.17-36.86 12.21-8.06 3.5-15.86 8.78-22.16 14.93-.91.89-1.77 1.79-2.59 2.7h31.43c9.85-4.84 20.89-7.21 32.32-9.29.08 3.13.06 6.23-.04 9.29h29.25c.02-.82.05-1.64.06-2.46 1.06-91.25-72.11-168.9-166.56-169.13-91.21-.22-166.49 74.22-166.74 164.87 0 2.25.04 4.49.12 6.72h29.04Zm172.7-138.01c33.91 9.55 59.98 28.54 79.8 57.47-16.24 9.45-32.4 17.45-51.33 16.33-11.99-.71-19.95-7.61-24.29-18.62-7.02-17.8-5.34-36.21-4.17-55.18Zm-71.39.2c.48 7.89 1.5 15.16 1.22 22.38-.37 9.27-.85 18.73-2.94 27.71-4.73 20.23-16.73 28.03-37.38 25.67-11.5-1.32-30.69-9.12-40.88-16.82 19.36-29.34 45.49-48.8 79.99-58.95Z" />
        </g>
        <path d="M28.87 245.09c.28-119.75 96.65-215.91 216.64-216 118.92-.09 215.81 96.88 215.82 216h28.99v-.1C490.35 110.42 380.68.15 246.68 0 110.32-.15.12 108.78 0 243.84c0 .42.01.84.01 1.25h28.86Z" />
      </g>
      {medidas && (
        <>
          {/* Arco por el medio de la banda blanca entre la cubierta y la llanta: el texto lo sigue. */}
          <defs>
            <path id="arco-medida" d="M 80.17 245.09 A 165 165 0 0 1 410.17 245.09" fill="none" />
          </defs>
          <text className="font-display" fill="#ff1e00" style={{ fontSize: 50, fontWeight: 800, letterSpacing: "0.04em" }}>
            <textPath href="#arco-medida" startOffset="50%" textAnchor="middle">
              {m.w}/{m.p} R{m.r}
            </textPath>
          </text>
        </>
      )}
    </svg>
  );
}
