"use client";

import { useEffect, useState } from "react";
import { useBranch } from "@/contexts/branch-context";
import { useLiveStockMap } from "@/contexts/live-stock-context";

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
type Item = { id: string; price: number; enStock: boolean };

/**
 * Cuántos modelos hay y desde cuánto, para la sucursal elegida: parte de lo
 * horneado en el build (Argüello) y lo corrige con el stock vivo de esa
 * sucursal. Una sucursal por abrir no tiene stock propio: sólo el precio.
 */
function useResumen(items: Item[]) {
  const { selectedBranch: b } = useBranch();
  const live = useLiveStockMap();
  const vistos = items.map((i) => {
    const l = live[i.id];
    return { price: l?.price ?? i.price, enStock: l?.enStock ?? i.enStock };
  });
  const enStock = vistos.filter((i) => i.enStock);
  const desdeSiempre = vistos.length ? Math.min(...vistos.map((i) => i.price)) : null;
  return {
    b,
    cantidad: enStock.length,
    desde: enStock.length ? Math.min(...enStock.map((i) => i.price)) : null,
    desdeSiempre,
    lugar: b.province === "Córdoba" ? b.city : b.shortName,
  };
}

/** Texto largo de la landing (de dónde vienen las cubiertas y cómo se paga), debajo del listado. */
export function SizeNota({ items, label }: { items: Item[]; label: string }) {
  const { b, cantidad, lugar } = useResumen(items);
  if (b.apertura) {
    return (
      <p className="mt-6 max-w-3xl leading-relaxed text-slate-600">
        Son cubiertas de importación directa y el precio publicado es el que se cobra en el mostrador. El local de {b.shortName}{" "}
        abre {b.apertura}: escribinos por WhatsApp y te avisamos cuando haya stock de {label}.
      </p>
    );
  }
  if (cantidad === 0) return null;
  return (
    <p className="mt-6 max-w-3xl leading-relaxed text-slate-600">
      Son cubiertas de importación directa, con stock físico en el local de {lugar}. El precio que ves es el que pagás: sin
      sorpresas al llegar al mostrador.
    </p>
  );
}

export function SizeHeader({
  size,
  label,
  items,
}: {
  size: { width: number; profile: number; rim: number };
  label: string;
  items: Item[];
}) {
  const { b, cantidad: enStockCount, desde, desdeSiempre } = useResumen(items);
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
      <p className="mt-3 max-w-3xl text-lg leading-snug text-slate-600">
        {b.apertura ? (
          <>
            {b.shortName} abre {b.apertura}.
            {desdeSiempre && (
              <>
                {" "}Precio desde <strong className="text-navy-900">{formatPrice(desdeSiempre)}</strong> por unidad.
              </>
            )}
          </>
        ) : enStockCount > 0 ? (
          <>
            <strong className="text-navy-900">{enStockCount}</strong>{" "}
            {enStockCount === 1 ? "modelo disponible" : "modelos disponibles"}
            {desde && (
              <>
                {" "}desde <strong className="text-navy-900">{formatPrice(desde)}</strong> por unidad
              </>
            )}
            .
          </>
        ) : (
          <>
            Ahora mismo no hay stock en medida {displayLabel}. Abajo están las medidas equivalentes que sí hay, y podés
            escribirnos por WhatsApp para que te avisemos apenas ingrese.
          </>
        )}
      </p>
    </header>
  );
}
