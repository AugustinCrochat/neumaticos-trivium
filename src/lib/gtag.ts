import { BRANCHES, BRANCH_COOKIE, BRANCH_AUTO_COOKIE } from "@/lib/config";

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
export const EVENTO_ELEGIR_SUCURSAL = "trivium:elegir-sucursal";

/** ¿Hay una sucursal elegida (a mano o por link)? La sugerida por IP no cuenta: en celulares la IP suele
    ubicar a la persona en otra ciudad y el chat salía al local equivocado. */
function haySucursalElegida(): boolean {
  const c = document.cookie.split("; ");
  return c.some((x) => x.startsWith(`${BRANCH_COOKIE}=`)) && !c.some((x) => x.startsWith(`${BRANCH_AUTO_COOKIE}=1`));
}

/**
 * Sin sucursal elegida los botones de WhatsApp apuntan a la sucursal que la
 * página trae de fábrica (Argüello): alguien de Buenos Aires terminaba
 * escribiéndole a Córdoba. Si el link va a un número de sucursal y todavía no
 * se eligió ninguna, se pide elegir (BranchProvider escucha este evento) y
 * recién después se abre el chat con el número de la sucursal elegida.
 */
function pedirSucursalAntes(url: string): boolean {
  const m = url.match(/^https:\/\/wa\.me\/(\d+)/);
  const origen = m && BRANCHES.find((b) => b.whatsapp === m[1]);
  if (!origen || haySucursalElegida()) return false;
  window.dispatchEvent(new CustomEvent(EVENTO_ELEGIR_SUCURSAL, { detail: { url, origenId: origen.id } }));
  return true;
}

/** Quien escribe a un local queda con ese local elegido (un año): la próxima visita no lo manda a otro. */
function recordarSucursalContactada(url: string) {
  const m = url.match(/^https:\/\/wa\.me\/(\d+)/);
  const ramas = m ? BRANCHES.filter((b) => b.whatsapp === m[1]) : [];
  // Lomas del Mirador y San Justo comparten número: sólo se recuerda si es inequívoco.
  if (ramas.length !== 1) return;
  document.cookie = `${BRANCH_COOKIE}=${ramas[0].id}; path=/; max-age=31536000; SameSite=Lax`;
  document.cookie = `${BRANCH_AUTO_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function goToWhatsApp(url: string) {
  if (typeof window === "undefined") return;
  if (pedirSucursalAntes(url)) return;
  recordarSucursalContactada(url);
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
