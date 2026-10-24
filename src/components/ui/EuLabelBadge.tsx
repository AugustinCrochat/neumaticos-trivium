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

// Escala de colores de la etiqueta oficial (A verde oscuro → E naranja).
const CLASS_COLORS: Record<string, string> = {
  A: "#00a651",
  B: "#50b848",
  C: "#c4d600",
  D: "#ffd500",
  E: "#f7941d",
};

function FuelIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16" />
      <path d="M3 21h12" />
      <path d="M7 8h4" />
      <path d="M14 10h2a2 2 0 0 1 2 2v4a1.5 1.5 0 0 0 3 0V9l-3-3" />
    </svg>
  );
}

function WetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 14a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17 7a3.5 3.5 0 0 1 .5 7" />
      <path d="M8 17l-1 3M12 17l-1 3M16 17l-1 3" />
    </svg>
  );
}

function ClassChip({ icon, letter, label }: { icon: React.ReactNode; letter: string; label: string }) {
  return (
    <span className="flex items-center gap-1" title={label}>
      {icon}
      <span
        className="flex h-5 w-5 items-center justify-center rounded text-xs font-black leading-none text-slate-900"
        style={{ backgroundColor: CLASS_COLORS[letter] ?? "#cbd5e1" }}
      >
        {letter}
      </span>
    </span>
  );
}

/** Overlay de la foto en las tarjetas: clase de combustible y de frenado en mojado de la etiqueta europea (EPREL). */
export function EuLabelBadge({ energy, wet }: { energy: string; wet: string }) {
  return (
    <span
      className="flex items-center gap-2 rounded-lg bg-white/95 px-2 py-1 text-slate-700 shadow-md ring-1 ring-slate-200"
      role="img"
      aria-label={`Etiqueta europea: eficiencia de combustible ${energy}, frenado en mojado ${wet}`}
    >
      <ClassChip icon={<FuelIcon className="h-4 w-4" />} letter={energy} label={`Eficiencia de combustible ${energy}`} />
      <ClassChip icon={<WetIcon className="h-4 w-4" />} letter={wet} label={`Frenado en mojado ${wet}`} />
    </span>
  );
}

/** Bloque de la ficha: la etiqueta oficial (SVG) y el registro que la respalda. */
export function EuLabelBlock({ label, alt }: { label: TireLabel; alt: string }) {
  return (
    <section className="mt-4 flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={label.svgPath}
        alt={alt}
        width={500}
        height={735}
        loading="lazy"
        className="h-auto w-32 shrink-0 rounded-md bg-white shadow-sm ring-1 ring-slate-200 sm:w-40"
      />
      <div className="text-xs leading-relaxed text-slate-500">
        <h3 className="flex items-center gap-2 text-sm font-black text-navy-900">
          <EuStars className="h-6 w-6 shrink-0" />
          Etiqueta europea
        </h3>
        <p className="mt-2">
          Eficiencia de combustible <strong className="text-slate-700">{label.energyClass}</strong>, frenado en
          mojado <strong className="text-slate-700">{label.wetGripClass}</strong> y{" "}
          <strong className="text-slate-700">{label.noiseDb} dB</strong> de ruido externo. Registrada en EPREL, la
          base de datos oficial de la Unión Europea.
        </p>
        <p className="mt-2">
          <a
            href={`https://eprel.ec.europa.eu/screen/product/tyres/${label.eprelId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-navy-700 underline decoration-navy-300 hover:decoration-navy-900"
          >
            Verificalo en EPREL
          </a>
          <br />
          <Link href="/blog/etiqueta-europea-neumaticos" className="font-bold text-navy-700 underline decoration-navy-300 hover:decoration-navy-900">
            Qué significa cada dato
          </Link>
        </p>
      </div>
    </section>
  );
}
