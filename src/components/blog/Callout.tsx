import type { ReactNode } from "react";

const TONES = {
  info: "border-black bg-slate-50",
  ok: "border-emerald-600 bg-emerald-50",
  warn: "border-orange-500 bg-orange-50",
} as const;

/** Recuadro de la nota: veredicto, advertencia o dato clave. */
export function Callout({ title, tone = "info", children }: { title: string; tone?: keyof typeof TONES; children: ReactNode }) {
  return (
    <div className={`my-8 rounded-r-lg border-l-[6px] p-5 ${TONES[tone]}`}>
      <p className="!mb-2 font-black !text-navy-900">{title}</p>
      <div className="[&>p:last-child]:!mb-0 [&>ul:last-child]:!mb-0 [&_p]:!text-base">{children}</div>
    </div>
  );
}
