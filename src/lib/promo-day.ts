const AR_TIME_ZONE = "America/Argentina/Buenos_Aires";

/**
 * Interruptor general de la promo: en false, no se muestra en ningún lado
 * (badge de la foto, texto del hover de pagos ni override de "3 cuotas sin
 * interés" en el cotizador) y el plan de 3 cuotas del banco se ve con su
 * recargo real. Para reactivarla alcanza con ponerlo en true.
 */
export const VISA_MASTER_PROMO_ACTIVA = true;

/**
 * Miércoles y sábado: promo de 3 cuotas sin interés con Visa/Mastercard
 * bancarizada. Se calcula en el cliente, nunca en el server: el sitio es
 * estático (sin ISR, redeploy cada 2h por cron — ver memoria del proyecto),
 * así que un cálculo hecho en build quedaría congelado con el día en que se
 * generó la página hasta el próximo deploy, en vez de reflejar el día real
 * en que alguien la visita.
 */
export function isVisaMasterPromoDay(now: Date = new Date()): boolean {
  if (!VISA_MASTER_PROMO_ACTIVA) return false;
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: AR_TIME_ZONE,
    weekday: "short",
  }).format(now);
  return weekday === "Wed" || weekday === "Sat";
}
