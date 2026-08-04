"use client";

import { useEffect, useState } from "react";
import { SizeOrVehicleSearch } from "@/components/ui/SizeOrVehicleSearch";

export function FloatingSearchWidget() {
  const [isOpen, setIsOpen] = useState(false);

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
        aria-label="Abrir buscador de neumáticos"
        className="fixed bottom-5 right-5 z-40 sm:bottom-6 sm:right-6 group flex items-center gap-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-2xl shadow-orange-500/40 border-2 border-white/90 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
      >
        <div className="relative flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white transition-transform group-hover:rotate-12"
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
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-navy-900 animate-ping" />
        </div>
        <span className="text-xs sm:text-sm uppercase tracking-wider font-extrabold">
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
            className="absolute inset-0 bg-navy-950/80 backdrop-blur-md transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-navy-900 px-6 py-4 flex items-center justify-between border-b border-navy-800 shrink-0">
              <div>
                <h2 className="text-white text-lg sm:text-xl font-bold flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                  </svg>
                  Buscador de Neumáticos
                </h2>
                <p className="text-navy-300 text-xs mt-0.5">
                  Buscá por las medidas de tu cubierta o por el modelo de tu auto
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-navy-300 hover:text-white p-1 rounded-lg transition-colors shrink-0"
                aria-label="Cerrar buscador"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto">
              <SizeOrVehicleSearch compact />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
