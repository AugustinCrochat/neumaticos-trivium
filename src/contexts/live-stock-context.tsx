"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useBranch } from "@/contexts/branch-context";

type LiveEntry = { enStock: boolean; stock: number; price: number; vendidos?: number };

const LiveStockContext = createContext<Record<string, LiveEntry>>({});

// Mismo TTL que el memoryCache de pos-api.ts: no tiene sentido pedirle al POS
// algo más fresco de lo que el propio cache del servidor va a devolver.
const REFRESH_MS = 5 * 60 * 1000;

// Con navegación de carga completa el provider se monta en CADA página, y cada
// montaje era un pedido al Worker (límite diario de 100k en el plan gratuito).
// La respuesta se guarda en sessionStorage por sucursal y se reutiliza hasta
// REFRESH_MS, así una sesión hace un pedido cada 5 min en vez de uno por página.
const cacheKey = (sucursal: string) => `catalogo-vivo:${sucursal}`;

function leerCache(sucursal: string): Record<string, LiveEntry> | null {
  try {
    const raw = sessionStorage.getItem(cacheKey(sucursal));
    if (!raw) return null;
    const { t, data } = JSON.parse(raw) as { t: number; data: Record<string, LiveEntry> };
    return Date.now() - t < REFRESH_MS ? data : null;
  } catch {
    return null;
  }
}

function guardarCache(sucursal: string, data: Record<string, LiveEntry>) {
  try {
    sessionStorage.setItem(cacheKey(sucursal), JSON.stringify({ t: Date.now(), data }));
  } catch {
    // sessionStorage bloqueado o lleno: se pide de nuevo en la próxima página.
  }
}

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
      const cacheado = leerCache(selectedBranch.id);
      if (cacheado) {
        setData(cacheado);
        return;
      }
      try {
        const res = await fetch(`/api/catalogo-vivo?sucursal=${selectedBranch.id}`, { cache: "default" });
        if (!res.ok || cancelado) return;
        const json = (await res.json()) as Record<string, LiveEntry>;
        if (!cancelado) setData(json);
        guardarCache(selectedBranch.id, json);
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
