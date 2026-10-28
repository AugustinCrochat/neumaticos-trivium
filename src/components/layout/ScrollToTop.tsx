"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Lleva al tope de la página en cada navegación a otra ruta.
 *
 * Next conserva la posición de scroll mientras "la página sea visible en el
 * viewport": si el primer elemento de la página nueva es un contenedor alto,
 * siempre lo es, y la página nueva abre bastante más abajo del tope. Con el
 * historial (atrás/adelante) no se toca: ahí Next restaura la posición previa.
 * Un #ancla tampoco se pisa. usePathname y no useSearchParams, para no volver
 * dinámica la página (ver branch-server.ts); los cambios de ?query los cubre
 * cada buscador al navegar.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const primera = useRef(true);
  const volvio = useRef(false);

  useEffect(() => {
    const marcar = () => {
      volvio.current = true;
    };
    window.addEventListener("popstate", marcar);
    return () => window.removeEventListener("popstate", marcar);
  }, []);

  useEffect(() => {
    // La carga inicial (o un F5) conserva lo que restaure el navegador.
    if (primera.current) {
      primera.current = false;
      return;
    }
    if (volvio.current) {
      volvio.current = false;
      return;
    }
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
