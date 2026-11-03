"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useBranch } from "@/contexts/branch-context";
import { regionDePath, regionDeSucursal } from "@/lib/regiones";
import { BRANCHES } from "@/lib/config";
import { getBranchDistances, formatDistance } from "@/lib/branch-geo";
import { getBranchStatus } from "@/lib/branch-status";
import { DirectionsIcon } from "./DirectionsIcon";
import { WhatsAppLink } from "./WhatsAppLink";

type GeoState = "idle" | "loading" | "done" | "error";

/** Monta el contenido solo con el modal abierto: al cerrarse se desmonta y el
    estado de la detección de ubicación se reinicia sin necesidad de un efecto. */
export function BranchModal() {
  const { isModalOpen } = useBranch();
  return isModalOpen ? <BranchModalContent /> : null;
}

function BranchModalContent() {
  const { closeModal, setSelectedBranch: elegir, selectedBranch, hasConfirmedBranch, autoSelectBranch } = useBranch();
  const pathname = usePathname();
  const router = useRouter();
  // En un portal de región (/cordoba, /buenos-aires) elegir sucursal es navegar
  // al portal de la región elegida: la URL y la sucursal siempre coinciden.
  const setSelectedBranch = (branch: (typeof BRANCHES)[number]) => {
    elegir(branch);
    const actual = regionDePath(pathname);
    const destino = regionDeSucursal(branch.id);
    if (actual && destino && actual.slug !== destino.slug) router.push(`/${destino.slug}`);
  };
  const [nearestId, setNearestId] = useState<string | null>(null);
  const [distances, setDistances] = useState<Record<string, number>>({});
  const [geoState, setGeoState] = useState<GeoState>("idle");
  const [geoMsg, setGeoMsg] = useState("No pudimos acceder a tu ubicación. Elegí manualmente.");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

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

  // Hora real para "abierta ahora": el modal se monta sólo en el cliente, así
  // que no hay riesgo de desajuste de hidratación. Se refresca cada minuto.
  const [ahora, setAhora] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setAhora(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

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
      <div className="relative z-10 flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex flex-shrink-0 items-start justify-between bg-black px-5 py-4">
          <div>
            <h2 className="text-white text-xl font-bold">Elegí tu sucursal</h2>
            <p className="mt-0.5 max-w-xs text-sm leading-snug text-slate-300">
              Cada sucursal tiene su stock y su WhatsApp.
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
        <div className="flex-shrink-0 px-4 pt-3">
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
        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4 pt-3">
          {[...BRANCHES]
            .sort((a, b) => rank(a.id) - rank(b.id))
            .map((branch) => {
            const isActive = hasConfirmedBranch && selectedBranch.id === branch.id;
            const isNearest = nearestId === branch.id;
            const distance = distances[branch.id];
            return (
              <div
                key={branch.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedBranch(branch)}
                onKeyDown={(e) => {
                  if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    setSelectedBranch(branch);
                  }
                }}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border-2 px-3.5 py-3 text-left transition-all ${
                  isNearest ? "branch-nearest " : ""
                }${
                  isActive
                    ? "border-orange-500 bg-orange-50"
                    : isNearest
                    ? "border-orange-500 bg-orange-50/60 shadow-lg"
                    : "border-slate-200 hover:border-navy-300 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    isActive ? "border-orange-500 bg-orange-500" : "border-slate-300"
                  }`}
                >
                  {isActive && (
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-base font-bold leading-tight text-navy-900">{branch.shortName}</span>
                    {branch.apertura ? (
                      <span className="rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-bold text-navy-700">
                        Abre {branch.apertura}
                      </span>
                    ) : (
                      (() => {
                        const estado = getBranchStatus(branch, ahora);
                        return (
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                              estado.isOpen ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${estado.isOpen ? "bg-green-500" : "bg-slate-400"}`} />
                            {estado.label}
                            {estado.detail && <span className="font-medium opacity-80">· {estado.detail}</span>}
                          </span>
                        );
                      })()
                    )}
                    {isNearest && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-2 py-0.5 text-[11px] font-bold text-white">
                        <span className="relative inline-block h-1.5 w-1.5 shrink-0">
                          <span className="branch-ping absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-orange-500" />
                          <span className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-orange-500" />
                        </span>
                        La más cercana
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-slate-600">
                    {branch.address}, {branch.city}
                  </p>
                  <p className="text-xs text-slate-500">
                    {distance !== undefined && (
                      <span className={`font-bold ${isNearest ? "text-orange-600" : "text-slate-600"}`}>
                        A {formatDistance(distance)} de tu ubicación ·{" "}
                      </span>
                    )}
                    {branch.hours}
                    {!branch.apertura && !branch.provisorio && " · por orden de llegada"}
                  </p>
                </div>
                <a
                  href={branch.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Cómo llegar a ${branch.shortName}`}
                  className="inline-flex flex-shrink-0 items-center gap-1 rounded-full border border-navy-200 bg-white py-1 pl-1.5 pr-2.5 text-xs font-bold text-navy-700 transition-colors hover:border-navy-400 hover:bg-navy-50"
                >
                  <DirectionsIcon className="h-5 w-5 shrink-0 text-orange-500" />
                  <span className="hidden min-[420px]:inline">Cómo llegar</span>
                  <span className="min-[420px]:hidden">Mapa</span>
                </a>
              </div>
            );
          })}
        </div>

        {hasConfirmedBranch && (
          <div className="flex-shrink-0 px-4 pb-4">
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
