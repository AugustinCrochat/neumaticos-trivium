"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

// El buscador (medidas, autos, voz) pesa bastante y solo se usa al abrir el
// panel: no tiene por qué viajar con cada página.
const SizeOrVehicleSearch = dynamic(
  () => import("@/components/ui/SizeOrVehicleSearch").then((m) => m.SizeOrVehicleSearch),
  { ssr: false }
);

const MINIATURAS = 4;

export function FloatingSearchWidget() {
  const [isOpen, setIsOpen] = useState(false);
  // Arranca con el texto a la vista y a los pocos segundos queda sólo la lupa.
  const [expandido, setExpandido] = useState(true);
  const [hover, setHover] = useState(false);
  const verTexto = expandido || hover;
  // Colapsado, la lupa alterna con miniaturas de neumáticos (recortes sin fondo).
  // Capa 0 = lupa; 1..N = neumáticos.
  const [capa, setCapa] = useState(0);
  useEffect(() => {
    if (verTexto || isOpen) return;
    const t = setInterval(() => setCapa((c) => (c + 1) % (MINIATURAS + 1)), 1800);
    return () => clearInterval(t);
  }, [verTexto, isOpen]);
  const pathname = usePathname();

  useEffect(() => {
    const t = setTimeout(() => setExpandido(false), 5000);
    return () => clearTimeout(t);
  }, []);

  // Cualquier navegación interna (buscar por medida, por auto, o un link como
  // "¿Qué es esto?" dentro del modal) debe cerrarlo — si no, la navegación
  // client-side de Next deja el modal montado tapando la página nueva, y se
  // ve como si hubiera quedado colgado cargando. usePathname (no
  // useSearchParams) a propósito: cambia igual para toda navegación real de
  // búsqueda (/neumaticos/[medida], /buscar) sin forzar un boundary Suspense.
  useEffect(() => {
    setIsOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* Botón flotante para acceso directo */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        aria-label="Abrir buscador de neumáticos"
        className="fixed bottom-20 right-4 z-40 sm:bottom-6 sm:right-6 group flex h-14 items-center justify-center border-2 border-white bg-orange-500 hover:bg-orange-600 text-white font-black px-3 rounded-full shadow-xl shadow-navy-900/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
      >
        <div className="relative flex h-7 w-7 items-center justify-center">
          <svg
            className={`absolute h-5 w-5 text-white transition-[opacity,scale,rotate] duration-700 ease-in-out will-change-[opacity,scale] group-hover:rotate-12 ${!verTexto && capa !== 0 ? "scale-50 opacity-0" : "opacity-100"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
          {Array.from({ length: MINIATURAS }, (_, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={`/images/buscador/neumatico-${i + 1}.webp`}
              alt=""
              aria-hidden
              className={`pointer-events-none absolute h-10 w-10 max-w-none object-contain transition-[opacity,scale,rotate] duration-700 ease-in-out will-change-[opacity,scale] ${!verTexto && capa === i + 1 ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
            />
          ))}
          <span className="absolute -top-1 -right-1 h-2 w-2 animate-ping rounded-full bg-black" />
        </div>
        <span
          className={`overflow-hidden whitespace-nowrap text-xs sm:text-sm uppercase tracking-wider font-extrabold transition-all duration-500 ease-in-out ${
            verTexto ? "ml-2.5 mr-2 max-w-[12rem] opacity-100" : "ml-0 max-w-0 opacity-0"
          }`}
        >
          Buscar neumáticos
        </span>
      </button>

      {/* Modal flotante del buscador */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Buscador de neumáticos por medida o modelo de auto"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-black px-6 py-5 flex items-start justify-between shrink-0">
              <div>
                <h2 className="text-white text-lg sm:text-xl font-bold flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                  </svg>
                  Buscador de Neumáticos
                </h2>
                <p className="text-slate-300 text-sm mt-1 leading-snug">
                  Buscá por las medidas de tu cubierta o por el modelo de tu auto
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 mt-0.5 rounded-lg transition-colors shrink-0"
                aria-label="Cerrar buscador"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto">
              <SizeOrVehicleSearch compact enModal autoFocus onNavigate={() => setIsOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
