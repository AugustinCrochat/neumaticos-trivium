"use client";

import { useEffect, useState } from "react";
import { useBranch } from "@/contexts/branch-context";
import { BRANCHES } from "@/lib/config";
import { getBranchDistances, formatDistance } from "@/lib/branch-geo";
import { WhatsAppLink } from "./WhatsAppLink";

type GeoState = "idle" | "loading" | "done" | "error";

export function BranchModal() {
  const { isModalOpen, closeModal, setSelectedBranch, selectedBranch, hasConfirmedBranch, autoSelectBranch } = useBranch();
  const [nearestId, setNearestId] = useState<string | null>(null);
  const [distances, setDistances] = useState<Record<string, number>>({});
  const [geoState, setGeoState] = useState<GeoState>("idle");
  const [geoMsg, setGeoMsg] = useState("No pudimos acceder a tu ubicación. Elegí manualmente.");

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setGeoState("idle");
      setNearestId(null);
      setDistances({});
    }
    return () => { document.body.style.overflow = ""; };
  }, [isModalOpen]);

  function detectLocation() {
    if (!navigator.geolocation) {
      setGeoMsg("Tu navegador no permite detectar la ubicación. Elegí manualmente.");
      setGeoState("error");
      return;
    }
    setGeoState("loading");
    // El `timeout` de getCurrentPosition no cuenta la espera del cartel de
    // permiso: si el cartel se ignora, o el navegador/SO bloquea la ubicación
    // sin avisar, ninguno de los callbacks se llama y quedaba cargando para
    // siempre. Este timer corta la espera pase lo que pase.
    let settled = false;
    const finish = (state: GeoState) => {
      if (settled) return;
      settled = true;
      clearTimeout(watchdog);
      setGeoState(state);
    };
    const watchdog = setTimeout(() => {
      setGeoMsg("La ubicación tardó demasiado en responder. Elegí manualmente.");
      finish("error");
    }, 15000);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (settled) return;
        try {
          const dist = getBranchDistances(pos.coords.latitude, pos.coords.longitude);
          const [nearest] = Object.entries(dist).sort((a, b) => a[1] - b[1]);
          setDistances(dist);
          setNearestId(nearest[0]);
          const branch = BRANCHES.find((b) => b.id === nearest[0]);
          if (branch) autoSelectBranch(branch);
          finish("done");
        } catch {
          setGeoMsg("No pudimos calcular la sucursal más cercana. Elegí manualmente.");
          finish("error");
        }
      },
      (err) => {
        setGeoMsg(
          err.code === err.PERMISSION_DENIED
            ? "La ubicación está bloqueada para este sitio. Habilitala en los permisos del navegador (el candado junto a la dirección) o elegí manualmente."
            : err.code === err.POSITION_UNAVAILABLE
              ? "Tu dispositivo no pudo calcular la ubicación (¿tenés el GPS o la ubicación del sistema activados?). Elegí manualmente."
              : "La ubicación tardó demasiado en responder. Elegí manualmente."
        );
        finish("error");
      },
      { timeout: 10000, maximumAge: 10 * 60 * 1000 }
    );
  }

  if (!isModalOpen) return null;

  // Primero la activa, después la más cercana detectada, después el resto.
  const rank = (id: string) =>
    hasConfirmedBranch && selectedBranch.id === id ? 0 : id === nearestId ? 1 : 2;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Seleccionar sucursal"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={closeModal}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-black px-6 py-5 flex items-start justify-between">
          <div>
            <h2 className="text-white text-xl font-bold">Elegí tu sucursal</h2>
            <p className="text-slate-300 text-sm mt-1 leading-snug max-w-xs">
              Seleccioná la sucursal más cercana para ver el stock y el
              número de WhatsApp correspondiente.
            </p>
          </div>
          <button
            onClick={closeModal}
            className="text-slate-400 hover:text-white transition-colors p-1 mt-0.5 flex-shrink-0"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Geo button */}
        <div className="px-5 pt-4">
          {geoState === "idle" && (
            <button
              onClick={detectLocation}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-navy-700 bg-navy-50 hover:bg-navy-100 border border-navy-200 py-2.5 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Detectar la sucursal más cercana
            </button>
          )}
          {geoState === "loading" && (
            <div className="flex items-center justify-center gap-2 text-sm text-navy-500 py-2.5">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Detectando ubicación…
            </div>
          )}
          {geoState === "done" && nearestId && (
            <div className="branch-pop flex items-center gap-2.5 text-sm text-green-800 bg-green-50 border border-green-200 px-4 py-2.5 rounded-xl">
              <svg className="w-5 h-5 flex-shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>
                Estás a <strong>{formatDistance(distances[nearestId])}</strong> de{" "}
                <strong>{BRANCHES.find((b) => b.id === nearestId)?.shortName}</strong>
                {" "}— la elegimos por vos. Si preferís otra, tocala.
              </span>
            </div>
          )}
          {geoState === "error" && (
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {geoMsg}
            </div>
          )}
        </div>

        {/* Branches */}
        <div className="p-4 space-y-3 mt-1">
          {[...BRANCHES]
            .sort((a, b) => rank(a.id) - rank(b.id))
            .map((branch) => {
            const isActive = hasConfirmedBranch && selectedBranch.id === branch.id;
            const isNearest = nearestId === branch.id;
            const distance = distances[branch.id];
            return (
              <div key={branch.id}>
              <button
                onClick={() => setSelectedBranch(branch)}
                className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                  isNearest ? "branch-nearest " : ""
                }${
                  isActive
                    ? "border-orange-500 bg-orange-50"
                    : isNearest
                    ? "border-orange-500 bg-orange-50/60 shadow-lg"
                    : "border-slate-200 hover:border-navy-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <span
                        className={`text-base font-semibold ${
                          isActive ? "text-navy-800" : "text-slate-800"
                        }`}
                      >
                        {branch.name}
                      </span>
                      {isActive && (
                        <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          Activa
                        </span>
                      )}
                      {isNearest && (
                        <span className="inline-flex items-center gap-1.5 bg-neutral-900 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                          <span className="relative inline-block w-2 h-2 shrink-0">
                            <span className="branch-ping absolute left-0 top-0 w-2 h-2 rounded-full bg-orange-500" />
                            <span className="absolute left-0 top-0 w-2 h-2 rounded-full bg-orange-500" />
                          </span>
                          La más cercana
                        </span>
                      )}
                    </div>
                    {distance !== undefined && (
                      <p className={`text-sm font-semibold mb-1 ${isNearest ? "text-orange-600" : "text-slate-500"}`}>
                        A {formatDistance(distance)} de tu ubicación
                      </p>
                    )}
                    <p className="text-slate-600 text-sm">{branch.address}</p>
                    <p className="text-slate-500 text-sm">{branch.city}</p>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {branch.hours}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Atención por orden de llegada
                    </p>
                  </div>
                  <div
                    className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      isActive ? "border-orange-500 bg-orange-500" : "border-slate-300"
                    }`}
                  >
                    {isActive && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
              <a
                href={branch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 ml-1 inline-flex items-center gap-1.5 text-xs font-bold text-navy-700 hover:text-orange-600 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Cómo llegar
              </a>
              </div>
            );
          })}
        </div>

        {hasConfirmedBranch && (
          <div className="px-4 pb-4">
            <WhatsAppLink
              href={`https://wa.me/${selectedBranch.whatsapp}`}
              className="flex items-center justify-center gap-2 w-full bg-[#25d366] hover:bg-[#1ebe5d] text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Consultar por WhatsApp — {selectedBranch.shortName}
            </WhatsAppLink>
          </div>
        )}
      </div>
    </div>
  );
}
