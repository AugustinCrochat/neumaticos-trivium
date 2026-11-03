/** Chapa patente esquemática (franja azul, cuerpo blanco y caracteres), para el mosaico "Por patente". */
export function PlateIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 32" className={className} aria-hidden="true">
      <rect width="64" height="32" rx="5" fill="#0035a1" />
      <path d="M2.5 9h59v17.5a3 3 0 0 1-3 3h-53a3 3 0 0 1-3-3Z" fill="#fff" />
      <g fill="#161616">
        <rect x="9" y="14" width="5" height="11" rx="1.2" />
        <rect x="16" y="14" width="5" height="11" rx="1.2" />
        <rect x="25" y="14" width="4.5" height="11" rx="1.2" />
        <rect x="31.5" y="14" width="4.5" height="11" rx="1.2" />
        <rect x="38" y="14" width="4.5" height="11" rx="1.2" />
        <rect x="46" y="14" width="5" height="11" rx="1.2" />
        <rect x="53" y="14" width="3.5" height="11" rx="1.2" />
      </g>
    </svg>
  );
}
