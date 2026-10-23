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

/** Marca chica pegada al nombre del neumático en las tarjetas del listado. */
export function EuLabelBadge() {
  return (
    <span
      className="ml-1.5 inline-flex items-center gap-1 align-middle text-[10px] font-bold uppercase tracking-tight text-navy-700"
      title="Tiene etiqueta europea registrada en EPREL"
    >
      <EuStars className="h-3.5 w-3.5" />
      Etiqueta UE
    </span>
  );
}

// Colores de la escala oficial de la etiqueta (A verde oscuro → E rojo).
const CLASS_COLORS: Record<string, string> = {
  A: "#00a651",
  B: "#52b948",
  C: "#bfd730",
  D: "#f7b500",
  E: "#ee7203",
};

function LetterTile({ title, letter }: { title: string; letter: string }) {
  return (
    <div className="flex flex-1 flex-col items-center rounded-lg bg-white px-2 py-2 ring-1 ring-slate-200">
      <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{title}</span>
      <span
        className="mt-1 flex h-7 w-9 items-center justify-center rounded text-base font-black text-slate-900"
        style={{ backgroundColor: CLASS_COLORS[letter] ?? "#e2e8f0" }}
      >
        {letter}
      </span>
    </div>
  );
}

/** Bloque de la ficha: las tres clases de la etiqueta y el registro que las respalda. */
export function EuLabelBlock({ label }: { label: TireLabel }) {
  return (
    <section className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <EuStars className="h-9 w-9 shrink-0" />
        <div>
          <h3 className="text-sm font-black text-navy-900">Etiqueta europea de neumáticos</h3>
          <p className="text-xs text-slate-500">Registrada en EPREL, la base de datos oficial de la Unión Europea.</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <LetterTile title="Combustible" letter={label.energyClass} />
        <LetterTile title="Frenado en mojado" letter={label.wetGripClass} />
        <div className="flex flex-1 flex-col items-center rounded-lg bg-white px-2 py-2 ring-1 ring-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Ruido externo</span>
          <span className="mt-1 flex h-7 items-center text-base font-black text-slate-900">{label.noiseDb} dB</span>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">
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
          Qué significa cada dato
        </Link>
      </p>
    </section>
  );
}
