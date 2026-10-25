"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useVehicle } from "@/contexts/vehicle-context";
import { VehicleCombobox } from "@/components/ui/VehicleCombobox";
import { getCompatibleAccessories } from "@/lib/tuercas-vehiculos";
import { isLowStock, stockLabel } from "@/lib/stock";
import type { Accessory } from "@/lib/types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

/**
 * Buscador de tuercas antirrobo para usar dentro del presupuesto: se elige el
 * auto (o se usa el ya elegido en el sitio) y se ofrecen las tuercas
 * compatibles para agregarlas ahí mismo, sin salir de la pantalla.
 */
export function TuercaPicker({ agregadas, onAdd }: { agregadas: string[]; onAdd: (accessory: Accessory) => void }) {
  const { vehiculos, loadVehiculos, selectedVehicle, setSelectedVehicle, clearSelectedVehicle } = useVehicle();
  const [accesorios, setAccesorios] = useState<Accessory[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    loadVehiculos();
    let cancelled = false;
    fetch("/api/accesorios")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: { accesorios: Accessory[] }) => {
        if (!cancelled) setAccesorios(data.accesorios);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [loadVehiculos]);

  const compatibles = accesorios && selectedVehicle ? getCompatibleAccessories(selectedVehicle.marca, selectedVehicle.modelo, accesorios) : [];

  return (
    <div className="space-y-3 border-t border-slate-100 bg-slate-50 p-4">
      {!selectedVehicle ? (
        <VehicleCombobox vehiculos={vehiculos} onSelect={(v) => setSelectedVehicle(v)} placeholder="¿Qué auto tenés? Ej: Corsa, Gol, Hilux..." />
      ) : (
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-sm font-bold text-navy-900">
            {selectedVehicle.marca} {selectedVehicle.modelo}
          </p>
          <button type="button" onClick={clearSelectedVehicle} className="shrink-0 text-xs font-bold text-slate-500 hover:text-slate-800">
            Cambiar auto
          </button>
        </div>
      )}

      {failed && <p className="text-sm text-slate-500">No pudimos cargar las tuercas ahora. Probá de nuevo en un momento.</p>}

      {selectedVehicle && accesorios && compatibles.length === 0 && (
        <p className="text-sm text-slate-500">Todavía no tenemos cargada la tuerca de este modelo. Consultanos por WhatsApp.</p>
      )}

      {compatibles.map((a) => {
        const yaAgregada = agregadas.includes(a.id);
        return (
          <div key={a.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
            <div className="relative h-14 w-14 shrink-0 rounded-lg bg-slate-50">
              {a.imageUrl && <Image src={a.imageUrl} alt="" fill sizes="56px" className="object-contain p-1" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-bold leading-snug text-navy-900">{a.nombre}</p>
              <p className="text-sm font-black text-red-600">{formatPrice(a.price)}</p>
              {a.enStock ? (
                <p className={`text-xs font-bold ${isLowStock(a.stock) ? "text-amber-600" : "text-emerald-600"}`}>{stockLabel(a.stock)}</p>
              ) : (
                <p className="text-xs font-bold text-red-600">Sin stock</p>
              )}
            </div>
            <button
              type="button"
              disabled={yaAgregada || !a.enStock}
              onClick={() => onAdd(a)}
              className="shrink-0 rounded-full bg-orange-500 px-4 py-2 text-xs font-black text-white shadow-md shadow-orange-500/30 transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              {yaAgregada ? "Agregada" : "Agregar"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
