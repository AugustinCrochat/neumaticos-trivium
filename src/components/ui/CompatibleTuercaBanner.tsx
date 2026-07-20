"use client";

import Image from "next/image";
import Link from "next/link";
import { useVehicle } from "@/contexts/vehicle-context";
import { getCompatibleAccessory } from "@/lib/tuercas-vehiculos";
import type { Accessory } from "@/lib/types";

export function CompatibleTuercaBanner({ accesorios }: { accesorios: Accessory[] }) {
  const { selectedVehicle } = useVehicle();
  if (!selectedVehicle) return null;

  const compatible = getCompatibleAccessory(selectedVehicle.marca, selectedVehicle.modelo, accesorios);
  if (!compatible) return null;

  return (
    <Link
      href={`/tuercas-antirrobo/${compatible.slug}`}
      className="flex items-center gap-4 bg-white border border-orange-200 hover:border-orange-300 rounded-2xl p-4 mb-6 transition-colors"
    >
      <div className="relative w-14 h-14 bg-slate-50 rounded-xl shrink-0 overflow-hidden">
        {compatible.imageUrl && (
          <Image src={compatible.imageUrl} alt="" fill sizes="56px" className="object-contain p-1" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-black text-orange-500 uppercase tracking-wide">Recomendado para vos</p>
        <p className="text-sm font-bold text-navy-900 truncate">
          Tuerca antirrobo compatible con tu {selectedVehicle.marca} {selectedVehicle.modelo}
        </p>
      </div>
      <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
