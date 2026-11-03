/** Neumático de frente (cubierta, llanta y rayos), sin color propio: toma el del texto. */
export function HalfTireIcon({ className }: { className?: string }) {
  const rayos = [0, 72, 144, 216, 288].map((a) => {
    const r = (a - 90) * (Math.PI / 180);
    return `M${(16 + 2.6 * Math.cos(r)).toFixed(2)} ${(16 + 2.6 * Math.sin(r)).toFixed(2)}L${(16 + 8 * Math.cos(r)).toFixed(2)} ${(16 + 8 * Math.sin(r)).toFixed(2)}`;
  });
  const tacos = Array.from({ length: 16 }, (_, i) => {
    const r = ((i * 22.5) - 90) * (Math.PI / 180);
    return `M${(16 + 12.4 * Math.cos(r)).toFixed(2)} ${(16 + 12.4 * Math.sin(r)).toFixed(2)}L${(16 + 14.6 * Math.cos(r)).toFixed(2)} ${(16 + 14.6 * Math.sin(r)).toFixed(2)}`;
  });
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="12.2" />
      <circle cx="16" cy="16" r="8.4" />
      <circle cx="16" cy="16" r="2.2" />
      <path d={rayos.join("")} />
      <path d={tacos.join("")} strokeWidth="1.8" />
    </svg>
  );
}
