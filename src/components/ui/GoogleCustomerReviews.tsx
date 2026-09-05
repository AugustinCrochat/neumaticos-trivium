"use client";

import Script from "next/script";
import { GOOGLE_MERCHANT_ID } from "@/lib/config";

type SurveyOptIn = {
  render: (options: {
    merchant_id: number;
    order_id: string;
    email: string;
    delivery_country: string;
    estimated_delivery_date: string;
  }) => void;
};

declare global {
  interface Window {
    gapi?: {
      load: (name: string, callback: () => void) => void;
      surveyoptin?: SurveyOptIn;
    };
  }
}

type Props = {
  orderId: string;
  email: string;
  estimatedDeliveryDate: string;
};

/** Módulo de aceptación de Reseñas de Clientes en Google: le ofrece al cliente,
    en la página de confirmación, recibir una encuesta cuando le llegue el
    pedido. Sólo se renderiza con una compra aprobada y con el mail real del
    comprador (Google rechaza la integración si los datos son inventados). */
export function GoogleCustomerReviews({ orderId, email, estimatedDeliveryDate }: Props) {
  return (
    <Script
      src="https://apis.google.com/js/platform.js"
      strategy="afterInteractive"
      onReady={() => {
        window.gapi?.load("surveyoptin", () => {
          window.gapi?.surveyoptin?.render({
            merchant_id: GOOGLE_MERCHANT_ID,
            order_id: orderId,
            email,
            delivery_country: "AR",
            estimated_delivery_date: estimatedDeliveryDate,
          });
        });
      }}
    />
  );
}
