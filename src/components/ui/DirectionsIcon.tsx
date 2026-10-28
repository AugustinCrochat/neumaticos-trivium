import { useId } from "react";

/**
 * Ícono de "cómo llegar" al estilo de Google Maps: rombo (cuadrado girado
 * 45°) con la flecha que dobla recortada adentro. Toma el color del texto
 * (currentColor); la flecha queda calada, así sirve sobre cualquier fondo.
 */
export function DirectionsIcon({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <mask id={id}>
          <rect width="24" height="24" fill="white" />
          <path
            d="M9.5 16.5v-3.2a1.6 1.6 0 0 1 1.6-1.6H15M13 9.2l2.3 2.5-2.3 2.5"
            fill="none"
            stroke="black"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </mask>
      </defs>
      <rect
        x="4.2"
        y="4.2"
        width="15.6"
        height="15.6"
        rx="2.6"
        transform="rotate(45 12 12)"
        fill="currentColor"
        mask={`url(#${id})`}
      />
    </svg>
  );
}
