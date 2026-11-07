"use client";

import { useEffect, useState } from "react";

/**
 * Chapa en miniatura para el acceso "Por patente": alterna entre el formato
 * Mercosur (400×130 mm) y el anterior (294×129 mm) con las proporciones reales
 * y el mismo arte que las chapas grandes (bandera, logo Mercosur, escudo).
 * El tamaño que se pasa en `className` es la caja: cada chapa ocupa todo el
 * ancho y queda centrada en alto.
 */
export const EJEMPLOS_PATENTE = [
  { placa: "MKP 417", formato: "anterior", auto: "Renault Logan 2013" },
  { placa: "AF 218 KT", formato: "mercosur", auto: "Toyota Hilux 2021" },
  { placa: "JXR 905", formato: "anterior", auto: "Ford Fiesta 2010" },
  { placa: "AD 124 MX", formato: "mercosur", auto: "Fiat Cronos 2020" },
  { placa: "OPT 336", formato: "anterior", auto: "VW Gol 2015" },
  { placa: "AF 305 BN", formato: "mercosur", auto: "Chevrolet Onix 2022" },
] as const;

/** Chapa de ejemplo en `indice` (con vuelta). Son patentes inventadas, no de autos reales. */
export const ejemploPatente = (indice: number) => EJEMPLOS_PATENTE[indice % EJEMPLOS_PATENTE.length];

export function PlateIcon({ className, formato, ejemplo }: { className?: string; formato?: "mercosur" | "anterior"; /** Chapa de ejemplo que se muestra (la elige quien la use, para sincronizar el texto de al lado). */ ejemplo?: { placa: string; formato: "mercosur" | "anterior" } }) {
  const [alterna, setMercosur] = useState(true);
  // Con `formato` o `ejemplo` fijos no alterna sola; sin ellos, cambia sola.
  const mercosur = ejemplo ? ejemplo.formato === "mercosur" : formato ? formato === "mercosur" : alterna;
  useEffect(() => {
    if (formato || ejemplo) return;
    const t = setInterval(() => setMercosur((m) => !m), 3000);
    return () => clearInterval(t);
  }, [formato, ejemplo]);

  return (
    <span aria-hidden="true" className={`inline-flex items-center justify-center ${className ?? ""}`}>
      <span
        className="relative block [container-type:inline-size]"
        style={{
          // Misma altura real (130 y 129 mm): la anterior es más angosta (294 de 400 mm).
          width: mercosur ? "100%" : `${(294 / 400) * 100}%`,
          aspectRatio: mercosur ? "400 / 130" : "294 / 129",
          backgroundImage: `url(/images/patente/${mercosur ? "chapa-mercosur" : "chapa-anterior"}.svg)`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <span
          className={`absolute text-center font-display uppercase leading-none ${
            mercosur
              ? "inset-x-[8%] bottom-[8%] top-[26%] flex items-center justify-center text-[14.5cqw] font-bold tracking-[0.06em] text-zinc-700"
              : "inset-x-[5%] bottom-[15.5%] top-[22.3%] flex items-center justify-center text-[19.5cqw] font-semibold tracking-[0.06em] text-white"
          }`}
        >
          {ejemplo ? ejemplo.placa : mercosur ? "AB 123 CD" : "ABC 123"}
        </span>
      </span>
    </span>
  );
}
