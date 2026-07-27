import { BRANCHES } from "@/lib/config";

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
        {value.toFixed(1)} · {count} reseña{count !== 1 ? "s" : ""} en Google
      </span>
    </a>
  );
}
