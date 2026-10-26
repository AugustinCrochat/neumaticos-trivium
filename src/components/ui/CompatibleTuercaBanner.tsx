"use client";

import Image from "next/image";
import Link from "@/components/ui/Link";
import { useVehicle } from "@/contexts/vehicle-context";
import { getCompatibleAccessory } from "@/lib/tuercas-vehiculos";
import type { Accessory } from "@/lib/types";

export function CompatibleTuercaBanner({ accesorios }: { accesorios: Accessory[] }) {
  const { selectedVehicle, openModal } = useVehicle();
  if (!selectedVehicle) return null;

  const compatible = getCompatibleAccessory(selectedVehicle.marca, selectedVehicle.modelo, accesorios);
  if (!compatible) return null;

  return (
    <div className="flex items-center gap-4 bg-white border border-orange-200 hover:border-orange-300 rounded-2xl p-4 mb-6 transition-colors">
      <Link href={`/tuercas-antirrobo/${compatible.slug}`} className="flex min-w-0 flex-1 items-center gap-4">
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
      </Link>
      <button
        type="button"
        onClick={openModal}
        className="shrink-0 text-xs font-bold text-slate-500 underline underline-offset-4 hover:text-slate-800"
      >
        Cambiar vehículo
      </button>
    </div>
  );
}
