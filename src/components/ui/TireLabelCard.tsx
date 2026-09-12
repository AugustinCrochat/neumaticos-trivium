import type { FuelOrGripGrade, TireLabel } from "@/lib/tire-labels";
import type { TireProduct } from "@/lib/types";
import { formatSize } from "@/lib/tire-sizes";

const GRADES: FuelOrGripGrade[] = ["A", "B", "C", "D", "E"];

// Colores estándar de la etiqueta europea de neumáticos (Reglamento UE
// 2020/740): escala semáforo de verde a rojo, igual en cualquier producto —
// no son los colores de marca de Trivium a propósito, esto reproduce un
// documento de homologación real.
const GRADE_COLOR: Record<FuelOrGripGrade, string> = {
  A: "#0f9d58",
  B: "#7cb342",
  C: "#fdd835",
  D: "#fb8c00",
  E: "#e53935",
};

// Ancho decreciente A→E: imita la "escalera" de flechas de la etiqueta física,
// donde la flecha más eficiente (A) es la más larga.
const GRADE_WIDTH: Record<FuelOrGripGrade, string> = {
  A: "100%",
  B: "88%",
  C: "76%",
  D: "64%",
  E: "52%",
};

function GradeScale({ title, value }: { title: string; value: FuelOrGripGrade }) {
  return (
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{title}</p>
      <div className="flex flex-col gap-1">
        {GRADES.map((grade) => {
          const active = grade === value;
          return (
            <div key={grade} className="flex items-center gap-1.5">
              <span className="w-3 shrink-0 text-[10px] font-black text-slate-500">{grade}</span>
              <div
                className="h-4 shrink-0"
                style={{
                  width: GRADE_WIDTH[grade],
                  backgroundColor: GRADE_COLOR[grade],
                  clipPath: "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)",
                  opacity: active ? 1 : 0.3,
                }}
              />
              {active && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded bg-navy-950 px-1 text-[11px] font-black text-white">
                  {grade}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NoiseBars({ activeClass }: { activeClass: TireLabel["noiseClass"] }) {
  const classes: TireLabel["noiseClass"][] = ["A", "B", "C"];
  return (
    <div className="flex items-end gap-0.5" aria-hidden>
      {classes.map((c, i) => (
        <span
          key={c}
          className={`inline-block w-1 rounded-sm ${c === activeClass ? "bg-navy-900" : "bg-slate-200"}`}
          style={{ height: 6 + i * 4 }}
        />
      ))}
    </div>
  );
}

export function TireLabelCard({ product, label }: { product: TireProduct; label: TireLabel }) {
  return (
    <div className="flex h-full w-full flex-col rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 border-b border-slate-100 pb-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{product.brand}</p>
        <p className="text-sm font-bold text-navy-900">{product.modeloBase}</p>
        <p className="text-xs text-slate-500">
          {formatSize(product.size)}
          {product.isCarga ? "C" : ""}
          {product.loadIndex && product.speedRating ? ` ${product.loadIndex}${product.speedRating}` : ""}
        </p>
      </div>

      <div className="flex gap-5">
        <GradeScale title="Efic. combustible" value={label.fuelEfficiency} />
        <GradeScale title="Frenado en mojado" value={label.wetGrip} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ruido externo</p>
          <div className="mt-1 flex items-center gap-2">
            <NoiseBars activeClass={label.noiseClass} />
            <span className="text-sm font-black text-navy-900">{label.noiseDb} dB</span>
          </div>
        </div>

        {label.utqg && (
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">UTQG</p>
            <p className="mt-1 text-sm font-black text-navy-900">
              {label.utqg.treadwear} {label.utqg.traction} {label.utqg.temperature}
            </p>
          </div>
        )}
      </div>

      <p className="mt-4 text-[10px] leading-snug text-slate-400">
        Etiqueta de eficiencia según Reglamento (UE) 2020/740, tal como figura en el neumático.
      </p>
    </div>
  );
}
