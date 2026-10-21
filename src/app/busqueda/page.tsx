import type { Metadata } from "next";
import { Suspense } from "react";
import { NOINDEX } from "@/lib/seo";
import { BusquedaClient } from "./BusquedaClient";

// Las páginas de resultados de búsqueda interna no se indexan nunca: son
// infinitas, se solapan con el catálogo y Google las trata como contenido
// de baja calidad ("soft 404" cuando no hay resultados).
export const metadata: Metadata = { title: "Buscar", ...NOINDEX };

// Página estática: la consulta se lee en el cliente y los resultados salen de
// /api/search?full=1, que está cacheada. Renderizarla por pedido en el Worker
// (todas las tarjetas del catálogo) empujaba el límite de recursos (1102).
export default function BusquedaPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">Buscando…</div>}>
      <BusquedaClient />
    </Suspense>
  );
}
