import { SITE_URL } from "@/lib/config";
import { getProductosDesdePOS, getServiciosPrecios, COMBO_ALINEACION_BALANCEO_AUTO } from "@/lib/pos-api";

type CheckoutItem = { kind?: unknown; id?: unknown; quantity?: unknown };

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

  const requestedTires = new Map<string, number>();
  const requestedServices = new Map<string, number>();
  for (const item of body.items) {
    const { kind, id, quantity } = item;
    if ((kind !== "tire" && kind !== "service") || typeof id !== "string" || typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1 || quantity > 8) {
      return Response.json({ error: "Hay un producto inválido en el carrito." }, { status: 400 });
    }
    const target = kind === "tire" ? requestedTires : requestedServices;
    target.set(id, (target.get(id) ?? 0) + quantity);
  }

  // El precio de tires/servicios siempre se toma del POS, nunca del cliente,
  // para que no se pueda manipular el monto a pagar.
  const [products, servicios] = await Promise.all([
    getProductosDesdePOS(),
    requestedServices.size > 0 ? getServiciosPrecios() : Promise.resolve([]),
  ]);

  const cartTires = [...requestedTires].map(([id, quantity]) => ({ product: products.find((p) => p.id === id), quantity }));
  if (cartTires.some(({ product }) => !product || !product.enStock)) {
    return Response.json({ error: "Uno o más productos ya no tienen stock. Actualizá el carrito e intentá nuevamente." }, { status: 409 });
  }

  const serviciosDisponibles = [...servicios, COMBO_ALINEACION_BALANCEO_AUTO];
  const cartServices = [...requestedServices].map(([id, quantity]) => ({ servicio: serviciosDisponibles.find((s) => s.id === id), quantity }));
  if (cartServices.some(({ servicio }) => !servicio)) {
    return Response.json({ error: "Uno o más servicios ya no están disponibles. Actualizá el carrito e intentá nuevamente." }, { status: 409 });
  }

  const externalReference = `${body.branchId}-${crypto.randomUUID()}`;
  const preference = {
    items: [
      ...cartTires.map(({ product, quantity }) => ({
        id: product!.id,
        title: `${product!.brand} ${product!.model}`,
        quantity,
        unit_price: product!.price,
        currency_id: "ARS",
      })),
      ...cartServices.map(({ servicio, quantity }) => ({
        id: servicio!.id,
        title: servicio!.nombre,
        quantity,
        unit_price: servicio!.precio,
        currency_id: "ARS",
      })),
    ],
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
