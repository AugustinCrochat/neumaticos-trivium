import Image from "next/image";
import Link from "next/link";
import { AccessoryAddToCart } from "@/components/ui/AccessoryAddToCart";
import type { Accessory } from "@/lib/types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

function discount(price: number, priceOld: number) {
  return Math.round(((priceOld - price) / priceOld) * 100);
}

const LOCK_SVG = (
  <svg
    className="w-full h-full text-slate-300 group-hover:text-slate-400 transition-colors"
    viewBox="0 0 100 100"
    fill="none"
  >
    <rect x="25" y="45" width="50" height="40" rx="6" stroke="currentColor" strokeWidth="8" />
    <path d="M35 45V32a15 15 0 0 1 30 0v13" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    <circle cx="50" cy="63" r="6" fill="currentColor" />
  </svg>
);

export function AccessoryCard({ accessory, priceOld = accessory.priceOld }: { accessory: Accessory; priceOld?: number }) {
  return (
    <article className="group bg-white rounded-2xl border border-slate-100 hover:border-navy-200 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      <Link href={`/tuercas-antirrobo/${accessory.slug}`} className="relative bg-white pt-[95%] overflow-hidden block">
        {priceOld && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-orange-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-lg uppercase tracking-tighter">
              {discount(accessory.price, priceOld)}% OFF
            </span>
          </div>
        )}
        <div className="absolute inset-0 p-4">
          {accessory.imageUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={accessory.imageUrl}
                alt={accessory.nombre}
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full max-h-32">{LOCK_SVG}</div>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-slate-800 text-sm mb-3 line-clamp-2" title={accessory.nombre}>
          <Link href={`/tuercas-antirrobo/${accessory.slug}`} className="hover:text-navy-700 transition-colors">
            {accessory.nombre}
          </Link>
        </h3>

        <div className="mt-auto">
          {priceOld && (
            <span className="text-slate-400 line-through text-xs block break-words">{formatPrice(priceOld)}</span>
          )}
          <span className="text-2xl font-black text-red-600 block mb-1.5 break-words">{formatPrice(accessory.price)}</span>
          <AccessoryAddToCart accessory={accessory} />
        </div>
      </div>
    </article>
  );
}
