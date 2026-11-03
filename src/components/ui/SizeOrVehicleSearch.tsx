"use client";

import { useEffect, useState } from "react";
import { Car, ChevronDown, Ruler } from "lucide-react";
import { TireSizeSearch } from "@/components/ui/TireSizeSearch";
import { VehicleSizeSearch } from "@/components/ui/VehicleSizeSearch";
import { MedidaPasos } from "@/components/ui/MedidaPasos";
import { PlateSearch } from "@/components/ui/PlateSearch";
import { PATENTE_HABILITADA } from "@/components/ui/PlateLookup";
import { EconomicChip } from "@/components/ui/EconomicChip";
import { useVehicle } from "@/contexts/vehicle-context";

export function SizeOrVehicleSearch({
  compact = false,
  initialMedida,
  forceVoiceButton = false,
  hideLearnLink = false,
  initialEconomicos = false,
  autoFocus = false,
  onNavigate,
  onLiveChange,
}: {
  compact?: boolean;
  initialMedida?: string;
  forceVoiceButton?: boolean;
  hideLearnLink?: boolean;
  initialEconomicos?: boolean;
  /** Cursor en "ancho" al abrir (modal del buscador flotante). */
  autoFocus?: boolean;
  /** Se llama justo antes de navegar a los resultados. */
  onNavigate?: () => void;
  onLiveChange?: (v: { w: string; p: string; r: string }) => void;
}) {
  const { loadVehiculos } = useVehicle();
  // Abre en "Por patente" si está habilitada y si no en "Por medida", aunque
  // haya un auto recordado.
  const [mode, setMode] = useState<"patente" | "medida" | "vehiculo">(PATENTE_HABILITADA ? "patente" : "medida");
  // Apagado por defecto: sólo se enciende si el visitante lo pide (o si la
  // búsqueda que está viendo ya venía filtrada, ver ShopPage).
  // Fuera del catálogo (compact) la medida se elige en pasos, con botones; se puede pasar a escribirla.
  const [escribir, setEscribir] = useState(false);
  const [economicos, setEconomicos] = useState(initialEconomicos);
  // El listado completo del POS solo hace falta acá. Se pide al entrar a la
  // pestaña, no en cada carga de página del sitio.
  useEffect(() => {
    if (mode !== "medida" || !compact) loadVehiculos();
  }, [mode, compact, loadVehiculos]);
  // Buscador apilado (fuera del catálogo): patente a la vista y las otras dos
  // opciones como barras que se abren de a una.
  const [abierto, setAbierto] = useState<"medida" | "vehiculo" | null>(initialMedida ? "medida" : null);

  if (!compact) {
    const barra = (id: "medida" | "vehiculo", Icono: typeof Ruler, titulo: string, ejemplo: string) => (
      <button
        type="button"
        onClick={() => setAbierto((a) => (a === id ? null : id))}
        onMouseEnter={id === "vehiculo" ? loadVehiculos : undefined}
        onFocus={id === "vehiculo" ? loadVehiculos : undefined}
        aria-expanded={abierto === id}
        className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition-colors hover:border-orange-400"
      >
        <Icono className="h-6 w-6 shrink-0 text-navy-900" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-black text-navy-900">{titulo}</span>
          <span className="block truncate text-xs font-semibold text-slate-500">{ejemplo}</span>
        </span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-orange-500 transition-transform ${abierto === id ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
    );
    return (
      <div className="w-full rounded-2xl border border-slate-200 bg-slate-100 p-5">
        <div className="mb-3 flex justify-end">
          <EconomicChip checked={economicos} onChange={setEconomicos} />
        </div>
        {PATENTE_HABILITADA && (
          <div className="mb-3 rounded-xl border border-slate-200 bg-white p-4">
            <PlateSearch economicos={economicos} onNavigate={onNavigate} autoFocus={autoFocus} pequena />
          </div>
        )}
        <div className="space-y-2">
          {barra("medida", Ruler, "Por medida", "Ej: 205/55 R16")}
          {abierto === "medida" && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              {escribir || initialMedida ? (
                <TireSizeSearch
                  embedded
                  initialMedida={initialMedida}
                  forceVoiceButton={forceVoiceButton}
                  hideLearnLink={hideLearnLink}
                  economicos={economicos}
                  onNavigate={onNavigate}
                  onLiveChange={onLiveChange}
                />
              ) : (
                <MedidaPasos economicos={economicos} onNavigate={onNavigate} onEscribir={() => setEscribir(true)} />
              )}
            </div>
          )}
          {barra("vehiculo", Car, "Por mi auto", "Marca, modelo y año")}
          {abierto === "vehiculo" && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <VehicleSizeSearch initialMedida={initialMedida} economicos={economicos} onClear={() => setAbierto("vehiculo")} onNavigate={onNavigate} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-100 rounded-2xl border border-slate-200 ${compact ? "p-4" : "p-6"} w-full`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
      <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-1">
        {PATENTE_HABILITADA && (
          <button
            onClick={() => setMode("patente")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mode === "patente" ? "bg-black text-white" : "text-slate-500 hover:text-slate-800"}`}
          >
            Por patente
          </button>
        )}
        <button
          onClick={() => setMode("medida")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mode === "medida" ? "bg-black text-white" : "text-slate-500 hover:text-slate-800"}`}
        >
          Por medida
        </button>
        <button
          onClick={() => setMode("vehiculo")}
          // Adelantar el fetch al primer indicio de intención, así la lista ya
          // está cuando el usuario efectivamente cambia de pestaña.
          onMouseEnter={loadVehiculos}
          onFocus={loadVehiculos}
          onTouchStart={loadVehiculos}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mode === "vehiculo" ? "bg-black text-white" : "text-slate-500 hover:text-slate-800"}`}
        >
          Por mi auto
        </button>
      </div>

      {/* En el catálogo (compact) el filtro ya está en los filtros del escritorio. */}
      <div className={compact ? "lg:hidden" : undefined}>
        <EconomicChip checked={economicos} onChange={setEconomicos} />
      </div>
      </div>

      {mode === "patente" ? (
        <PlateSearch economicos={economicos} onNavigate={onNavigate} autoFocus={autoFocus} />
      ) : mode === "medida" && !compact && !escribir && !initialMedida ? (
        <MedidaPasos economicos={economicos} onNavigate={onNavigate} onEscribir={() => setEscribir(true)} />
      ) : mode === "medida" ? (
        <TireSizeSearch
          embedded
          compact={compact}
          initialMedida={initialMedida}
          forceVoiceButton={forceVoiceButton}
          hideLearnLink={hideLearnLink}
          economicos={economicos}
          autoFocus={autoFocus}
          onNavigate={onNavigate}
          onLiveChange={onLiveChange}
        />
      ) : (
        // Al quitar el auto se queda en esta pestaña (sin esto el modo por defecto
        // vuelve a "Por medida" porque ya no hay vehículo).
        <VehicleSizeSearch initialMedida={initialMedida} economicos={economicos} onClear={() => setMode("vehiculo")} onNavigate={onNavigate} />
      )}
    </div>
  );
}
