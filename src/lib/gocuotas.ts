/**
 * GoCuotas (API Redirect V1): igual que Mercado Pago, se crea un "checkout" y
 * se redirige al comprador a la URL que devuelven — ellos manejan toda la
 * lógica de tarjeta/cuotas de su lado. Doc: https://gocuotas-api.stoplight.io/
 *
 * La API Key sirve directo como Bearer token (recomendado por GoCuotas en vez
 * de pasar por /authentication con email+contraseña, que expira y se rompe si
 * alguien cambia la contraseña de la sucursal).
 */

const GOCUOTAS_BASE_URL = {
  production: "https://www.gocuotas.com",
  sandbox: "https://sandbox.gocuotas.com",
} as const;

function getApiKey(): { apiKey: string; baseUrl: string } | null {
  // GOCUOTAS_ENV en wrangler.jsonc decide qué key/entorno usar — "sandbox"
  // para probar, ausente o cualquier otro valor cae en producción.
  const env = process.env.GOCUOTAS_ENV === "sandbox" ? "sandbox" : "production";
  const apiKey =
    env === "sandbox"
      ? process.env.GOCUOTAS_API_KEY_SANDBOX?.trim()
      : process.env.GOCUOTAS_API_KEY_PRODUCTION?.trim();
  if (!apiKey) return null;
  return { apiKey, baseUrl: GOCUOTAS_BASE_URL[env] };
}

export type GoCuotasCheckoutInput = {
  amountInCents: number;
  email: string;
  phoneNumber: string;
  orderReferenceId: string;
  urlSuccess: string;
  urlFailure: string;
};

/** Devuelve la URL a la que hay que redirigir al comprador, o un mensaje de
    error legible para mostrar en el checkout. */
export async function createGoCuotasCheckout(
  input: GoCuotasCheckoutInput
): Promise<{ initPoint: string } | { error: string }> {
  const config = getApiKey();
  if (!config) return { error: "El pago con GoCuotas todavía no está configurado." };

  // phone_number es integer en la API — sacamos todo lo que no sea dígito
  // (espacios, guiones, "+54") antes de mandarlo.
  const phoneDigits = input.phoneNumber.replace(/\D/g, "");
  if (!phoneDigits) return { error: "El teléfono ingresado no es válido." };

  try {
    const response = await fetch(`${config.baseUrl}/api_redirect/v1/checkouts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        amount_in_cents: input.amountInCents,
        email: input.email,
        phone_number: Number(phoneDigits),
        order_reference_id: input.orderReferenceId,
        url_success: input.urlSuccess,
        url_failure: input.urlFailure,
      }),
    });

    if (!response.ok) {
      console.error("[gocuotas] rechazó el checkout", response.status, await response.text().catch(() => ""));
      return { error: "No pudimos iniciar el pago con GoCuotas. Intentá nuevamente." };
    }

    const data = (await response.json()) as { url_init?: string };
    if (!data.url_init) return { error: "No pudimos iniciar el pago con GoCuotas." };
    return { initPoint: data.url_init };
  } catch (error) {
    console.error("[gocuotas] error de red creando el checkout", error);
    return { error: "No pudimos conectar con GoCuotas. Intentá nuevamente." };
  }
}
