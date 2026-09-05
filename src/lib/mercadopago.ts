/** Datos de un pago ya cobrado, leidos desde Mercado Pago con el access token
    del servidor. La unica fuente del mail del cliente: el checkout es de
    Mercado Pago, asi que el mail nunca pasa por este sitio y el redirect de
    vuelta tampoco lo trae. */
export type PaymentSummary = {
  orderId: string;
  email: string;
  deliveryMethod: "pickup" | "shipping";
};

type MercadoPagoPayment = {
  external_reference?: string | null;
  payer?: { email?: string | null } | null;
  metadata?: { delivery_method?: string | null } | null;
};

export async function getPaymentSummary(paymentId: string): Promise<PaymentSummary | null> {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();
  if (!accessToken || !/^\d+$/.test(paymentId)) return null;

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!response.ok) {
      console.error("[mercadopago] no pudimos leer el pago", response.status);
      return null;
    }
    const payment = await response.json() as MercadoPagoPayment;
    const email = payment.payer?.email?.trim();
    if (!email) return null;
    return {
      orderId: payment.external_reference?.trim() || paymentId,
      email,
      deliveryMethod: payment.metadata?.delivery_method === "shipping" ? "shipping" : "pickup",
    };
  } catch (error) {
    console.error("[mercadopago] error leyendo el pago", error);
    return null;
  }
}
