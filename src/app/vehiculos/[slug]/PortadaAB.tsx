"use client";

import { useEffect, useState } from "react";
import Link from "@/components/ui/Link";
import { trackEvent } from "@/lib/gtag";
import { vehicleCardPath, PORTADA_TEST, type PortadaVariante } from "@/lib/vehicle-photos";

const KEY = "portada_ab";

/**
 * Portada de la ficha con test A/B por visitante. La página se prerenderiza, así
 * que el HTML trae siempre la A (lo que indexa Google) y, ya en el navegador, a
 * la mitad de los visitantes se les cambia a la B. La variante queda guardada en
 * localStorage para que vea siempre la misma. Eventos de GA4: `portada_ab_view`
 * (al mostrarse) y `portada_ab_click` (al tocarla, lleva a la medida principal),
 * los dos con `variant` ("a" | "b") y `vehiculo`. Para poder segmentar por
 * `variant` en los informes, registrarlo como dimensión personalizada de evento.
 */
export function PortadaAB({ slug, name, medidaHref, medida }: { slug: string; name: string; medidaHref: string | null; medida: string | null }) {
  const [v, setV] = useState<PortadaVariante>("a");

  useEffect(() => {
    if (!PORTADA_TEST) return;
    let elegida: PortadaVariante | null = null;
    try {
      const g = localStorage.getItem(KEY);
      if (g === "a" || g === "b") elegida = g;
    } catch {}
    if (!elegida) {
      elegida = Math.random() < 0.5 ? "a" : "b";
      try {
        localStorage.setItem(KEY, elegida);
      } catch {}
    }
    // Variante por visitante: sólo se conoce en el navegador (la página se prerenderiza con la A).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setV(elegida);
    trackEvent("portada_ab_view", { variant: elegida, vehiculo: slug });
  }, [slug]);

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={vehicleCardPath(slug, v)}
      alt={`Neumáticos para ${name}: medida original y precios`}
      width={1200}
      height={630}
      loading="lazy"
      decoding="async"
      className="h-auto w-full rounded-2xl border border-slate-200"
    />
  );

  return (
    <figure className="mb-10">
      {medidaHref ? (
        <Link href={medidaHref} onClick={() => trackEvent("portada_ab_click", { variant: v, vehiculo: slug })} aria-label={`Ver neumáticos ${medida}`}>
          {img}
        </Link>
      ) : (
        img
      )}
      <figcaption className="mt-2 text-center text-xs text-slate-500">Medida original del {name} y neumáticos disponibles.</figcaption>
    </figure>
  );
}
