import { PriceTagIcon } from "@/components/ui/PriceTagIcon";

/**
 * Distintivo "Mejor precio": el más barato con stock de su medida y tipo (ver
 * bestPriceByGroup). Un solo componente para la tarjeta del listado y para la
 * ficha de producto, así se ve igual en los dos lados.
 */
export function BestPriceBadge({ label, className = "" }: { label?: string; className?: string }) {
  return (
    <span className={`flex max-w-[11rem] items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 py-1 pl-1.5 pr-2.5 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-white ${className}`}>
      <PriceTagIcon className="h-7 w-5 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="text-[11px] font-black uppercase tracking-wider">Mejor precio</span>
        {label && <span className="mt-0.5 text-[10px] font-bold text-emerald-50">{label}</span>}
      </span>
    </span>
  );
}
