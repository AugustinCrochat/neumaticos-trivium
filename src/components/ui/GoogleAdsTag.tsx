"use client";

import Script from "next/script";
import { GA4_MEASUREMENT_ID, GOOGLE_ADS_ID, GOOGLE_ADS_WHATSAPP_CONVERSION_LABEL } from "@/lib/config";

/** Google tag (gtag.js) de Google Ads, más gtag_report_conversion para la
    conversión de "clic en WhatsApp". La usan los links a wa.me del sitio (ver
    src/lib/gtag.ts y WhatsAppLink) antes de abrir el chat.

    El callback usa window.open en vez de window.location (que es lo que
    manda el snippet oficial de Ads): todos los botones de WhatsApp del sitio
    abren en pestaña nueva, y con window.location se navegaría la pestaña
    actual en su lugar. */
export function GoogleAdsTag() {
  return (
    <>
      {/* La biblioteca de gtag (y la de GA4 que arrastra) suman ~600 KB y ~1 s de
          hilo principal justo mientras la página se pinta. `lazyOnload` la baja
          cuando el navegador termina de cargar. Mientras tanto gtag() encola en
          dataLayer, y gtag_report_conversion recién se publica al cargar: un clic
          en WhatsApp antes de eso abre el chat igual (sin contar la conversión). */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="lazyOnload"
        onLoad={() => {
          const w = window as unknown as { __reportConversion?: (url?: string) => boolean; gtag_report_conversion?: (url?: string) => boolean };
          w.gtag_report_conversion = w.__reportConversion;
        }}
      />
      <Script id="google-ads-gtag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}');
          gtag('config', '${GA4_MEASUREMENT_ID}');
        `}
      </Script>
      {/* Eventos de GA4 para links que no pasan por goToWhatsApp: "Cómo llegar"
          (Google Maps), "Llamar" (tel:) y wa.me en <a> comunes. Si el click ya lo manejó
          WhatsAppLink (defaultPrevented) no se cuenta de nuevo. */}
      <Script id="ga4-link-events" strategy="afterInteractive">
        {`
          document.addEventListener('click', function (e) {
            var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
            if (!a || typeof gtag !== 'function') return;
            var href = a.getAttribute('href') || '';
            if (href.indexOf('google.com/maps') !== -1 || href.indexOf('maps.app.goo.gl') !== -1) {
              gtag('event', 'como_llegar', { link_url: href, page_path: location.pathname });
            } else if (href.indexOf('tel:') === 0) {
              gtag('event', 'click_llamar', { link_url: href, page_path: location.pathname });
            } else if (href.indexOf('wa.me') !== -1 && !e.defaultPrevented) {
              gtag('event', 'click_whatsapp', { link_url: href, page_path: location.pathname });
            }
          }, true);
        `}
      </Script>
      <Script id="google-ads-whatsapp-conversion" strategy="afterInteractive">
        {`
          function gtag_report_conversion(url) {
            var callback = function () {
              if (typeof(url) != 'undefined') {
                window.open(url, '_blank', 'noopener,noreferrer');
              }
            };
            gtag('event', 'conversion', {
                'send_to': '${GOOGLE_ADS_WHATSAPP_CONVERSION_LABEL}',
                'event_callback': callback
            });
            return false;
          }
          window.__reportConversion = gtag_report_conversion;
        `}
      </Script>
    </>
  );
}
