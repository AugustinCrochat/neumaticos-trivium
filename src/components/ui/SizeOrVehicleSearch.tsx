"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Car, ChevronDown, RectangleHorizontal } from "lucide-react";
import { HalfTireIcon } from "@/components/ui/HalfTireIcon";
import { TireSizeSearch } from "@/components/ui/TireSizeSearch";
import { VehicleSizeSearch } from "@/components/ui/VehicleSizeSearch";
import { MedidaPasos } from "@/components/ui/MedidaPasos";
import { PlateSearch } from "@/components/ui/PlateSearch";
import { PATENTE_HABILITADA } from "@/components/ui/PlateLookup";
import { useVehicle } from "@/contexts/vehicle-context";

// En escritorio la patente y la medida son dos mosaicos a la par que abren su ventana;
// en celular la patente queda a la vista. Server: celular (se ajusta al hidratar).
const MD = "(min-width: 768px)";
function useEscritorio() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(MD);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(MD).matches,
    () => false
  );
}

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
  // El filtro de económicos ya no se ofrece en el buscador: vive en el catálogo y los resultados.
  const economicos = initialEconomicos;
  // El listado completo del POS solo hace falta acá. Se pide al entrar a la
  // pestaña, no en cada carga de página del sitio.
  useEffect(() => {
    if (mode !== "medida" || !compact) loadVehiculos();
  }, [mode, compact, loadVehiculos]);
  // Buscador apilado (fuera del catálogo): patente a la vista y las otras dos
  // opciones como barras que se abren de a una.
  const escritorio = useEscritorio();
  const [abierto, setAbierto] = useState<"patente" | "medida" | "vehiculo" | null>(null);

  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(null);
    document.addEventListener("keydown", alTeclear);
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alTeclear);
      document.body.style.overflow = previo;
    };
  }, [abierto]);

  if (!compact) {
    const cerrar = () => setAbierto(null);
    const titulos = { patente: "Buscar por patente", medida: "Buscar por medida", vehiculo: "Buscar por mi auto" } as const;
    const barra = (id: "patente" | "medida" | "vehiculo", Icono: typeof Car | typeof HalfTireIcon, titulo: string, ejemplo: string) => (
      <button
        type="button"
        onClick={() => setAbierto((a) => (a === id ? null : id))}
        onMouseEnter={id === "vehiculo" ? loadVehiculos : undefined}
        onFocus={id === "vehiculo" ? loadVehiculos : undefined}
        aria-expanded={abierto === id}
        className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition-colors hover:border-orange-400"
      >
        <Icono className={`h-6 shrink-0 text-navy-900 ${Icono === HalfTireIcon ? "w-11" : "w-6"}`} aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-black text-navy-900">{titulo}</span>
          <span className="block truncate text-xs font-semibold text-slate-500">{ejemplo}</span>
        </span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-orange-500 transition-transform ${abierto === id ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
    );
    return (
      <div className="w-full rounded-2xl border border-slate-200 bg-slate-100 p-5">
        <h2 className="mb-3 text-center font-display text-2xl font-extrabold uppercase tracking-tight text-navy-900">
          Encontrá tus neumáticos
        </h2>
        {escritorio ? (
          <div className="grid grid-cols-2 gap-3">
            {PATENTE_HABILITADA && (
              <button
                type="button"
                onClick={() => setAbierto("patente")}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-5 text-center transition-colors hover:border-orange-400"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/patente/chapa-mercosur.svg" alt="" className="h-9 w-auto" />
                <span className="text-base font-black text-navy-900">Por patente</span>
                <span className="text-xs font-semibold text-slate-500">Ej: AB 123 CD</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setAbierto("medida")}
              className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-5 text-center transition-colors hover:border-orange-400"
            >
              <HalfTireIcon className="h-9 w-[4.5rem] text-navy-900" />
              <span className="text-base font-black text-navy-900">Por medida</span>
              <span className="text-xs font-semibold text-slate-500">Ej: 205/55 R16</span>
            </button>
            {!PATENTE_HABILITADA && (
              <button
                type="button"
                onClick={() => setAbierto("vehiculo")}
                onMouseEnter={loadVehiculos}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-5 text-center transition-colors hover:border-orange-400"
              >
                <Car className="h-9 w-9 text-navy-900" aria-hidden="true" />
                <span className="text-base font-black text-navy-900">Por mi auto</span>
                <span className="text-xs font-semibold text-slate-500">Marca, modelo y año</span>
              </button>
            )}
          </div>
        ) : (
          <>
            {PATENTE_HABILITADA && (
              <div className="mb-3 rounded-xl border border-slate-200 bg-white p-4">
                <PlateSearch economicos={economicos} onNavigate={onNavigate} autoFocus={autoFocus} pequena />
              </div>
            )}
            <div className="space-y-2">
              {barra("medida", HalfTireIcon, "Por medida", "Ej: 205/55 R16")}
              {/* Con la patente habilitada, si no se encuentra el auto la misma búsqueda pasa a elegir marca y modelo. */}
              {!PATENTE_HABILITADA && barra("vehiculo", Car, "Por mi auto", "Marca, modelo y año")}
            </div>
          </>
        )}
        {abierto &&
          createPortal(
            <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={titulos[abierto]}>
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={cerrar} />
              <div className="relative z-10 flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
                <div className="flex shrink-0 items-center justify-between bg-black px-5 py-4">
                  <h2 className="text-lg font-bold text-white">{titulos[abierto]}</h2>
                  <button type="button" onClick={cerrar} aria-label="Cerrar" className="rounded-lg p-1 text-slate-400 transition-colors hover:text-white">
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="overflow-y-auto p-4 sm:p-6">
                  {abierto === "patente" ? (
                    <PlateSearch
                      economicos={economicos}
                      autoFocus
                      onNavigate={() => {
                        cerrar();
                        onNavigate?.();
                      }}
                    />
                  ) : abierto === "medida" ? (
                    escribir || initialMedida ? (
                      <TireSizeSearch
                        embedded
                        initialMedida={initialMedida}
                        forceVoiceButton={forceVoiceButton}
                        hideLearnLink={hideLearnLink}
                        economicos={economicos}
                        autoFocus
                        onNavigate={() => {
                          cerrar();
                          onNavigate?.();
                        }}
                        onLiveChange={onLiveChange}
                      />
                    ) : (
                      <MedidaPasos
                        economicos={economicos}
                        onNavigate={() => {
                          cerrar();
                          onNavigate?.();
                        }}
                        onEscribir={() => setEscribir(true)}
                      />
                    )
                  ) : (
                    <VehicleSizeSearch
                      initialMedida={initialMedida}
                      economicos={economicos}
                      onClear={() => setAbierto("vehiculo")}
                      onNavigate={() => {
                        cerrar();
                        onNavigate?.();
                      }}
                    />
                  )}
                </div>
              </div>
            </div>,
            document.body
          )}
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
            <span className="inline-flex items-center gap-1.5">
              <RectangleHorizontal className="h-4 w-4" aria-hidden="true" /> Por patente
            </span>
          </button>
        )}
        <button
          onClick={() => setMode("medida")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mode === "medida" ? "bg-black text-white" : "text-slate-500 hover:text-slate-800"}`}
        >
          <span className="inline-flex items-center gap-1.5">
            <HalfTireIcon className="h-3.5 w-auto" /> Por medida
          </span>
        </button>
        {!PATENTE_HABILITADA && (
        <button
          onClick={() => setMode("vehiculo")}
          // Adelantar el fetch al primer indicio de intención, así la lista ya
          // está cuando el usuario efectivamente cambia de pestaña.
          onMouseEnter={loadVehiculos}
          onFocus={loadVehiculos}
          onTouchStart={loadVehiculos}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mode === "vehiculo" ? "bg-black text-white" : "text-slate-500 hover:text-slate-800"}`}
        >
          <span className="inline-flex items-center gap-1.5">
            <Car className="h-4 w-4" aria-hidden="true" /> Por mi auto
          </span>
        </button>
        )}
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
