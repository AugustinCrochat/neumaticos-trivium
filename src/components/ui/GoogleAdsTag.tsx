"use client";

import Script from "next/script";
import { GOOGLE_ADS_ID } from "@/lib/config";

/** Google tag (gtag.js) de Google Ads: sólo el "puente" entre el sitio y la
    cuenta de Ads. El seguimiento de conversión puntual (ej. clic en
    WhatsApp) es un snippet aparte que Ads entrega después de configurar esa
    conversión, y no está acá todavía. */
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
    </>
  );
}
