/** Chapa patente esquemática (franja azul, cuerpo blanco y letras de ejemplo), para el mosaico "Por patente". */
export function PlateIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 32" className={className} aria-hidden="true">
      <rect width="64" height="32" rx="5" fill="#0035a1" />
      <path d="M2.5 9h59v17.5a3 3 0 0 1-3 3h-53a3 3 0 0 1-3-3Z" fill="#fff" />
      <text x="32" y="23.5" textAnchor="middle" textLength="50" lengthAdjust="spacingAndGlyphs" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="11.5" fill="#161616">
        AB 123 CD
      </text>
    </svg>
  );
}
