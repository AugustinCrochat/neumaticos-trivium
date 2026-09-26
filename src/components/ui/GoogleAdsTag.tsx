"use client";

import Script from "next/script";
import { GOOGLE_ADS_ID, GOOGLE_ADS_WHATSAPP_CONVERSION_LABEL } from "@/lib/config";

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
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-gtag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}');
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
          window.gtag_report_conversion = gtag_report_conversion;
        `}
      </Script>
    </>
  );
}
