"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useBranch } from "@/contexts/branch-context";
import { getSizesForVehicle } from "@/lib/vehicles";
import type { VehiculoOption } from "@/lib/pos-api";

export function VehicleSizeSearch({ vehiculos }: { vehiculos: VehiculoOption[] }) {
  const router = useRouter();
  const { selectedBranch } = useBranch();
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [versionIndex, setVersionIndex] = useState(0);

  const marcas = useMemo(() => [...new Set(vehiculos.map((v) => v.marca))].sort((a, b) => a.localeCompare(b)), [vehiculos]);
  const modelos = useMemo(
    () => vehiculos.filter((v) => v.marca === marca).sort((a, b) => a.modelo.localeCompare(b.modelo)),
    [vehiculos, marca]
  );
  const sizes = marca && modelo ? getSizesForVehicle(marca, modelo) : null;
  const selectedSize = sizes?.[versionIndex];

  function selectMarca(next: string) {
    setMarca(next);
    setModelo("");
    setVersionIndex(0);
  }

  function selectModelo(next: string) {
    setModelo(next);
    setVersionIndex(0);
  }

  function verNeumaticos() {
    if (!selectedSize) return;
    const medida = `${selectedSize.w}-${selectedSize.p}-r${selectedSize.r}`;
    router.push(`/buscar?medida=${medida}&marca=${encodeURIComponent(marca)}&modelo=${encodeURIComponent(modelo)}`);
  }

  const waText = encodeURIComponent(`Hola, quiero saber la medida de neumático de mi ${marca} ${modelo}`);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3">
        <select
          value={marca}
          onChange={(e) => selectMarca(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-navy-500/10 outline-none"
        >
          <option value="">Marca</option>
          {marcas.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select
          value={modelo}
          onChange={(e) => selectModelo(e.target.value)}
          disabled={!marca}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 disabled:bg-slate-50 disabled:text-slate-400 focus:ring-2 focus:ring-navy-500/10 outline-none"
        >
          <option value="">Modelo</option>
          {modelos.map((v) => (
            <option key={v.modelo} value={v.modelo}>{v.modelo}</option>
          ))}
        </select>
      </div>

      {marca && modelo && (
        <div className="mt-3">
          {sizes && sizes.length > 0 ? (
            <>
              {sizes.length > 1 && (
                <select
                  value={versionIndex}
                  onChange={(e) => setVersionIndex(Number(e.target.value))}
                  className="w-full mb-3 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-navy-500/10 outline-none"
                >
                  {sizes.map((s, i) => (
                    <option key={i} value={i}>{s.version || `${s.w}/${s.p} R${s.r}`}</option>
                  ))}
                </select>
              )}
              <button
                onClick={verNeumaticos}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3.5 rounded-xl text-base transition-colors"
              >
                Ver neumáticos {selectedSize!.w}/{selectedSize!.p} R{selectedSize!.r}
              </button>
            </>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
              <p className="text-sm font-semibold text-slate-600 mb-2">
                Todavía no tenemos cargada la medida de este modelo.
              </p>
              <a
                href={`https://wa.me/${selectedBranch.whatsapp}?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-orange-600 font-bold text-sm hover:underline"
              >
                Consultanos por WhatsApp
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
