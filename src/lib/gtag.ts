declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    /** Definida por el script de Google Ads en GoogleAdsTag (ver layout raíz).
        Puede no estar todavía si el script tardó en cargar. */
    gtag_report_conversion?: (url?: string) => boolean;
  }
}

/**
 * Reporta la conversión de Google Ads de "clic en WhatsApp" y recién después
 * abre el chat. Si el script de Ads todavía no cargó (o falló), abre el chat
 * igual para no romper el botón — la conversión es una métrica, no un gate
 * de la funcionalidad.
 *
 * Usa window.open (pestaña nueva) en vez de window.location porque todos los
 * links a wa.me del sitio abren así; el snippet que entregó Google Ads asume
 * navegación en la misma pestaña (window.location), pero acá cambiaría el
 * comportamiento que ya tenían estos botones.
 */
export function goToWhatsApp(url: string) {
  if (typeof window === "undefined") return;
  trackEvent("click_whatsapp", { link_url: url });
  if (window.gtag_report_conversion) {
    window.gtag_report_conversion(url);
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

/** Evento de GA4. No hace nada si gtag todavía no cargó. */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, { page_path: window.location.pathname, ...params });
}
