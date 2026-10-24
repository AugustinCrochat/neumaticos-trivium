import Link from "next/link";
import type { TireLabel } from "@/lib/tire-labels";

function EuStars({ className }: { className?: string }) {
  // Cinco puntas: radio exterior r, interior 0.382 r (estrella regular).
  const star = (cx: number, cy: number, r: number) =>
    Array.from({ length: 10 }, (_, i) => {
      const rad = i % 2 === 0 ? r : r * 0.382;
      const a = (i / 10) * Math.PI * 2;
      return `${(cx + rad * Math.sin(a)).toFixed(2)},${(cy - rad * Math.cos(a)).toFixed(2)}`;
    }).join(" ");
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="3" fill="#1d3f9b" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <polygon key={i} points={star(12 + 7.5 * Math.sin(a), 12 - 7.5 * Math.cos(a), 1.7)} fill="#ffd200" />;
      })}
    </svg>
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
          Homologadas en Europa
        </h3>
        <p className="mt-2">
          Estas cubiertas están homologadas en Europa y registradas en EPREL, la base de datos oficial de la Unión
          Europea. Eficiencia de combustible <strong className="text-slate-700">{label.energyClass}</strong>, frenado
          en mojado <strong className="text-slate-700">{label.wetGripClass}</strong> y{" "}
          <strong className="text-slate-700">{label.noiseDb} dB</strong> de ruido externo.
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
