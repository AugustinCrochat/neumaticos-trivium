import type { ReactNode } from "react";

/** Piezas de formulario compartidas por las herramientas. */
export const inputCls =
  "w-full min-w-0 rounded-xl border-2 border-slate-300 bg-white px-3 py-2.5 text-base font-bold text-navy-900 outline-none focus:border-orange-500";
export const labelCls = "mb-1 block text-xs font-black uppercase tracking-wide text-slate-500";

export function Result({ tone, title, children }: { tone: "ok" | "warn" | "bad" | "info"; title: string; children?: ReactNode }) {
  const cls = {
    ok: "border-emerald-200 bg-emerald-50 text-emerald-950",
    warn: "border-yellow-300 bg-yellow-50 text-yellow-950",
    bad: "border-red-200 bg-red-50 text-red-950",
    info: "border-slate-200 bg-slate-50 text-slate-900",
  }[tone];
  return (
    <div role="status" className={`rounded-2xl border-2 p-4 ${cls}`}>
      <p className="text-lg font-black">{title}</p>
      {children && <div className="mt-1 text-sm leading-relaxed">{children}</div>}
    </div>
  );
}

export type Medida = { w: string; p: string; r: string };

/** Ancho / perfil / rodado en tres campos numéricos. */
export function MedidaFields({ id, value, onChange }: { id: string; value: Medida; onChange: (m: Medida) => void }) {
  const campo = (k: keyof Medida, label: string, max: number, ph: string) => (
    <div className="min-w-0 flex-1">
      <label className={labelCls} htmlFor={`${id}-${k}`}>{label}</label>
      <input
        id={`${id}-${k}`}
        inputMode="numeric"
        placeholder={ph}
        maxLength={max}
        value={value[k]}
        onChange={(e) => onChange({ ...value, [k]: e.target.value.replace(/\D/g, "").slice(0, max) })}
        className={inputCls}
      />
    </div>
  );
  return (
    <div className="flex gap-2">
      {campo("w", "Ancho", 3, "205")}
      {campo("p", "Perfil", 2, "55")}
      {campo("r", "Rodado", 2, "16")}
    </div>
  );
}

export const diametroMm = (m: Medida) => Number(m.r) * 25.4 + 2 * Number(m.w) * (Number(m.p) / 100);
export const medidaCompleta = (m: Medida) => m.w.length === 3 && m.p.length === 2 && m.r.length === 2;
