"use client";

import Script from "next/script";
import { GOOGLE_MERCHANT_ID } from "@/lib/config";

declare global {
  interface Window {
    merchantwidget?: {
      start: (options: { merchant_id: number; position?: string; region?: string }) => void;
    };
  }
}

/** Insignia de Reseñas de Clientes en Google: badge flotante con la puntuación
    de vendedor. Va a la izquierda porque la esquina inferior derecha ya la ocupa
    el FloatingSearchWidget. Si todavía no hay puntuaciones, Google muestra
    "No hay puntuaciones disponibles". */
export function GoogleReviewsBadge() {
  return (
    <Script
      id="merchantWidgetScript"
      src="https://www.gstatic.com/shopping/merchant/merchantwidget.js"
      strategy="lazyOnload"
      onReady={() => {
        window.merchantwidget?.start({
          merchant_id: GOOGLE_MERCHANT_ID,
          position: "LEFT",
          region: "AR",
        });
      }}
    />
  );
}
