/** Medio neumático (arco con banda de rodadura), sin color propio: toma el del texto. */
export function HalfTireIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M2 18 A14 14 0 0 1 30 18" />
      <path d="M8 18 A8 8 0 0 1 24 18" />
      <path d="M2 18h6M24 18h6" />
      <path d="M5.2 9.6l2.4 1.6M10.2 5.2l1.6 2.4M16 3.2v2.8M21.8 5.2l-1.6 2.4M26.8 9.6l-2.4 1.6" strokeWidth="1.6" />
    </svg>
  );
}
