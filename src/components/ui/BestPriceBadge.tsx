import { PriceTagIcon } from "@/components/ui/PriceTagIcon";

/**
 * Distintivo "Mejor precio": el más barato con stock de su medida y tipo (ver
 * bestPriceByGroup). Un solo componente para la tarjeta del listado y para la
 * ficha de producto, así se ve igual en los dos lados.
 */
export function BestPriceBadge({ label, className = "" }: { label?: string; className?: string }) {
  return (
    <span className={`flex max-w-[8.5rem] items-center gap-1 rounded-md bg-gradient-to-r from-emerald-600 to-emerald-500 py-0.5 pl-1 pr-1.5 text-white shadow-md shadow-emerald-600/30 ring-1 ring-white md:max-w-[10rem] md:gap-1.5 md:rounded-lg md:py-1 md:pl-1.5 md:pr-2 md:ring-2 ${className}`}>
      <PriceTagIcon className="h-5 w-3.5 shrink-0 md:h-6 md:w-4" />
      <span className="flex flex-col leading-none">
        <span className="text-[9px] font-black uppercase tracking-wide md:text-[10px] md:tracking-wider">Mejor precio</span>
        {label && <span className="mt-px truncate text-[8px] font-bold text-emerald-50 md:text-[9px]">{label}</span>}
      </span>
    </span>
  );
}
