import type { Metadata } from "next";
import { PaymentResult } from "./PaymentResult";
import { GoogleCustomerReviews } from "@/components/ui/GoogleCustomerReviews";
import { getPaymentSummary } from "@/lib/mercadopago";
import { NOINDEX } from "@/lib/seo";

// Resultado de un pago concreto: no hay nada que indexar y no queremos que
// una URL de confirmación quede accesible desde una búsqueda.
export const metadata: Metadata = { title: "Resultado del pago", ...NOINDEX };

type Props = { searchParams: Promise<{ estado?: string; payment_id?: string; collection_id?: string }> };

/** Fecha estimada de entrega en formato YYYY-MM-DD (hora de Argentina): el
    retiro en sucursal se coordina al día siguiente y el envío a domicilio
    tarda hasta una semana. */
function estimatedDeliveryDate(deliveryMethod: "pickup" | "shipping") {
  const date = new Date(Date.now() + (deliveryMethod === "shipping" ? 7 : 1) * 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires" }).format(date);
}

export default async function PaymentResultPage({ searchParams }: Props) {
  const { estado, payment_id: paymentId, collection_id: collectionId } = await searchParams;

  // Mercado Pago agrega el id del pago al redirect; con él leemos el mail del
  // comprador, que es lo único que nos falta para el opt-in de reseñas.
  const id = paymentId || collectionId;
  const payment = estado === "aprobado" && id ? await getPaymentSummary(id) : null;

  return (
    <>
      <PaymentResult status={estado} />
      {payment && (
        <GoogleCustomerReviews
          orderId={payment.orderId}
          email={payment.email}
          estimatedDeliveryDate={estimatedDeliveryDate(payment.deliveryMethod)}
        />
      )}
    </>
  );
}
