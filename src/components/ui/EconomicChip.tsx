import { PriceTagIcon } from "@/components/ui/PriceTagIcon";

/** Filtro "Solo económicos": casilla en forma de botón con la etiqueta de Trivium. */
export function EconomicChip({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label
      className={`flex w-fit cursor-pointer items-center gap-2 rounded-lg border-2 py-1.5 pl-2 pr-1.5 transition-colors ${
        checked ? "border-orange-500 bg-orange-50" : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-navy-400 ${
          checked ? "border-orange-500 bg-orange-500 text-white" : "border-slate-300 bg-white text-transparent"
        }`}
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
      <span className="text-sm font-bold text-navy-900">Solo económicos</span>
      <PriceTagIcon className={`h-7 w-5 shrink-0 transition-opacity ${checked ? "" : "opacity-60 grayscale"}`} />
    </label>
  );
}
