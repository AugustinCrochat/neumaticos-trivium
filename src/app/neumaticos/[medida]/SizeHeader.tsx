"use client";

import { useEffect, useState } from "react";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

type FlotationOrigin = { label: string; width: number; profile: number; rim: number };

/**
 * Encabezado de la landing de medida. Por default muestra el label métrico
 * (lo único que existe server-side, para que la página siga siendo estática
 * e indexable). Si TireSizeSearch dejó en sessionStorage que la búsqueda que
 * trajo hasta acá fue en formato flotation (ver "trivium:flotation-origin"
 * en ese componente), después de montar swapea a mostrar la medida flotation
 * como protagonista y el métrico como aclaración — no al revés, que es como
 * lo escribe/reconoce el usuario que tipeó "31x10.5R15".
 */
export function SizeHeader({
  size,
  label,
  enStockCount,
  desde,
  branchCity,
}: {
  size: { width: number; profile: number; rim: number };
  label: string;
  enStockCount: number;
  desde: number | null;
  branchCity: string;
}) {
  const [origin, setOrigin] = useState<FlotationOrigin | null>(null);

  useEffect(() => {
    let stored: FlotationOrigin | null = null;
    try {
      const raw = sessionStorage.getItem("trivium:flotation-origin");
      sessionStorage.removeItem("trivium:flotation-origin");
      if (raw) {
        const parsed = JSON.parse(raw) as FlotationOrigin;
        if (parsed.width === size.width && parsed.profile === size.profile && parsed.rim === size.rim) {
          stored = parsed;
        }
      }
    } catch {
      // sessionStorage bloqueado (modo privado) — se queda con el label métrico.
    }
    if (stored) setOrigin(stored);
  }, [size.width, size.profile, size.rim]);

  const displayLabel = origin ? origin.label : label;

  return (
    <header className="mb-8">
      <h1 className="text-3xl font-black leading-tight text-navy-900 md:text-5xl">
        Neumáticos {displayLabel}
      </h1>
      {origin && (
        <p className="mt-2 text-sm font-bold text-slate-500">Equivalente métrico: {label}</p>
      )}
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
        {enStockCount > 0 ? (
          <>
            Tenemos <strong className="text-navy-900">{enStockCount}</strong>{" "}
            {enStockCount === 1 ? "modelo disponible" : "modelos disponibles"} en medida {displayLabel}
            {desde && (
              <>
                {" "}
                desde <strong className="text-navy-900">{formatPrice(desde)}</strong> por unidad
              </>
            )}
            . Son cubiertas de importación directa, con stock físico en el local de {branchCity}. El precio que ves es el que pagás: sin sorpresas al llegar al
            mostrador.
          </>
        ) : (
          <>
            Ahora mismo no tenemos stock en medida {displayLabel}, pero recibimos mercadería todas
            las semanas. Abajo vas a encontrar las medidas equivalentes que sí están disponibles y
            el detalle técnico de {displayLabel} para chequear cuál te sirve. También podés
            escribirnos por WhatsApp y te avisamos apenas ingrese.
          </>
        )}
      </p>
    </header>
  );
}
