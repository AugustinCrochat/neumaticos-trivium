import { BRANCHES } from "@/lib/config";

/**
 * A partir de cuántas reseñas mostramos el total junto al puntaje.
 *
 * Con pocas reseñas el número juega en contra: "5,0 · 2 reseñas" transmite
 * menos confianza que "5,0 en Google" a secas, porque invita a dudar de la
 * muestra. Pasado este umbral la cantidad pasa a ser un argumento y se muestra
 * sola, sin que haya que acordarse de tocar nada.
 */
const MIN_RESENAS_PARA_MOSTRAR_TOTAL = 15;

const STAR = (
  <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
  </svg>
);

export function GoogleRatingBadge({ className = "" }: { className?: string }) {
  const branch = BRANCHES.find((b) => b.googleRating);
  if (!branch?.googleRating) return null;
  const { value, count } = branch.googleRating;

  return (
    <a
      href={branch.mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 hover:opacity-80 transition-opacity ${className}`}
    >
      <span className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i}>{STAR}</span>
        ))}
      </span>
      <span className="text-sm font-bold">
        {/* Coma decimal: el resto del sitio ya formatea los precios en es-AR. */}
        {value.toLocaleString("es-AR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
        {count >= MIN_RESENAS_PARA_MOSTRAR_TOTAL
          ? ` · ${count} reseñas en Google`
          : " en Google"}
      </span>
    </a>
  );
}
