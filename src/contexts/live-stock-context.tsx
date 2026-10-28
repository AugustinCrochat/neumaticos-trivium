"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useBranch } from "@/contexts/branch-context";

type LiveEntry = { enStock: boolean; stock: number; price: number; vendidos?: number };

const LiveStockContext = createContext<Record<string, LiveEntry>>({});

// Mismo TTL que el memoryCache de pos-api.ts: no tiene sentido pedirle al POS
// algo más fresco de lo que el propio cache del servidor va a devolver.
const REFRESH_MS = 5 * 60 * 1000;

/**
 * Corrige en el cliente el stock/precio de TODO el catálogo, horneado en el
 * HTML del último build (hasta 2h de atraso — ver memoria "sitio-estatico-
 * sin-isr"). Antes esto solo pasaba en la ficha de producto puntual
 * (ProductPageClient, un fetch por producto); acá se trae el catálogo entero
 * en una sola llamada para que ProductCard se corrija solo en catálogo,
 * "otras marcas", categorías, etc.
 */
export function LiveStockProvider({ children }: { children: ReactNode }) {
  const { selectedBranch } = useBranch();
  const [data, setData] = useState<Record<string, LiveEntry>>({});

  useEffect(() => {
    let cancelado = false;
    async function load() {
      try {
        const res = await fetch(`/api/catalogo-vivo?sucursal=${selectedBranch.id}`, { cache: "default" });
        if (!res.ok || cancelado) return;
        const json = (await res.json()) as Record<string, LiveEntry>;
        if (!cancelado) setData(json);
      } catch {
        // Sin conexión o falla del POS: se queda con los valores horneados.
      }
    }
    load();
    const interval = setInterval(load, REFRESH_MS);
    return () => {
      cancelado = true;
      clearInterval(interval);
    };
  }, [selectedBranch.id]);

  return <LiveStockContext.Provider value={data}>{children}</LiveStockContext.Provider>;
}

export function useLiveStock(id: string): LiveEntry | undefined {
  return useContext(LiveStockContext)[id];
}

/** Mapa completo id → stock vivo, para listados que ordenan por disponibilidad. */
export function useLiveStockMap(): Record<string, LiveEntry> {
  return useContext(LiveStockContext);
}
