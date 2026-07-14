import { SITE_URL } from "@/lib/config";
import { getProductosDesdePOS } from "@/lib/pos-api";

type CheckoutItem = { id?: unknown; quantity?: unknown };

export async function POST(request: Request) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();
  if (!accessToken) {
    return Response.json({ error: "Los pagos online todavía no están configurados." }, { status: 503 });
  }

  let body: { items?: CheckoutItem[]; branchId?: unknown };
  try {
    body = await request.json() as { items?: CheckoutItem[]; branchId?: unknown };
  } catch {
    return Response.json({ error: "El carrito recibido no es válido." }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 20 || typeof body.branchId !== "string") {
    return Response.json({ error: "Revisá los productos de tu carrito." }, { status: 400 });
  }

  const requested = new Map<string, number>();
  for (const item of body.items) {
    const { id, quantity } = item;
    if (typeof id !== "string" || typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1 || quantity > 8) {
      return Response.json({ error: "Hay una cantidad inválida en el carrito." }, { status: 400 });
    }
    requested.set(id, (requested.get(id) ?? 0) + quantity);
  }

  const products = await getProductosDesdePOS();
  const cartProducts = [...requested].map(([id, quantity]) => ({ product: products.find((product) => product.id === id), quantity }));
  if (cartProducts.some(({ product }) => !product || !product.enStock)) {
    return Response.json({ error: "Uno o más productos ya no tienen stock. Actualizá el carrito e intentá nuevamente." }, { status: 409 });
  }

  const externalReference = `${body.branchId}-${crypto.randomUUID()}`;
  const preference = {
    items: cartProducts.map(({ product, quantity }) => ({
      id: product!.id,
      title: `${product!.brand} ${product!.model}`,
      quantity,
      unit_price: product!.price,
      currency_id: "ARS",
    })),
    external_reference: externalReference,
    back_urls: {
      success: `${SITE_URL}/pago/resultado?estado=aprobado`,
      failure: `${SITE_URL}/pago/resultado?estado=fallido`,
      pending: `${SITE_URL}/pago/resultado?estado=pendiente`,
    },
    auto_return: "approved",
    statement_descriptor: "TRIVIUM",
  };

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(preference),
  });

  if (!response.ok) {
    console.error("[checkout] Mercado Pago rechazó la preferencia", response.status);
    return Response.json({ error: "No pudimos iniciar el pago. Intentá nuevamente." }, { status: 502 });
  }

  const data = await response.json() as { init_point?: string };
  if (!data.init_point) return Response.json({ error: "No pudimos iniciar el pago." }, { status: 502 });
  return Response.json({ initPoint: data.init_point });
}
