import Link from "next/link";
import type { TireLabel } from "@/lib/tire-labels";

function EuStars({ className }: { className?: string }) {
  const stars = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return { x: 12 + 7.5 * Math.sin(a), y: 12 - 7.5 * Math.cos(a) };
  });
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="3" fill="#1d3f9b" />
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r="1.1" fill="#ffd200" />
      ))}
    </svg>
  );
}

/** Chip chico para la tarjeta del listado. */
export function EuLabelBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[10px] font-black uppercase tracking-tight text-navy-900 shadow-md ring-1 ring-slate-200">
      <EuStars className="h-3.5 w-3.5" />
      Etiqueta europea
    </span>
  );
}

/** Bloque de la ficha: arriba del precio, con las tres letras de la etiqueta. */
export function EuLabelBlock({ label }: { label: TireLabel }) {
  return (
    <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
      <EuStars className="h-8 w-8 shrink-0" />
      <p className="text-xs leading-snug text-slate-600">
        <strong className="block text-sm text-slate-900">Neumático con etiqueta europea</strong>
        Combustible {label.energyClass} · Mojado {label.wetGripClass} · {label.noiseDb} dB.{" "}
        <a
          href={`https://eprel.ec.europa.eu/screen/product/tyres/${label.eprelId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-navy-700 underline decoration-navy-300 hover:decoration-navy-900"
        >
          Verificalo en EPREL
        </a>
        {" · "}
        <Link href="/blog/etiqueta-europea-neumaticos" className="font-bold text-navy-700 underline decoration-navy-300 hover:decoration-navy-900">
          Qué significa
        </Link>
      </p>
    </div>
  );
}
