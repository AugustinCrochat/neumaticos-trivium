import { SITE_URL, BRANCHES, SHIPPING_FLAT_RATE, FREE_SHIPPING_THRESHOLD } from "@/lib/config";
import { getProductosDesdePOS, getServiciosPrecios, getAccesoriosDesdePOS, COMBO_ALINEACION_BALANCEO_AUTO } from "@/lib/pos-api";

type CheckoutItem = { kind?: unknown; id?: unknown; quantity?: unknown };
type ShippingAddressInput = {
  fullName?: unknown; phone?: unknown; address?: unknown; city?: unknown; province?: unknown; postalCode?: unknown;
};

export async function POST(request: Request) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();
  if (!accessToken) {
    return Response.json({ error: "Los pagos online todavía no están configurados." }, { status: 503 });
  }

  let body: { items?: CheckoutItem[]; branchId?: unknown; deliveryMethod?: unknown; shippingAddress?: ShippingAddressInput };
  try {
    body = await request.json() as typeof body;
  } catch {
    return Response.json({ error: "El carrito recibido no es válido." }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 20 || typeof body.branchId !== "string") {
    return Response.json({ error: "Revisá los productos de tu carrito." }, { status: 400 });
  }
  // branchId decide contra qué sucursal se valida stock/precio — tiene que
  // ser una sucursal real, no un string cualquiera que mande el cliente.
  if (!BRANCHES.some((b) => b.id === body.branchId)) {
    return Response.json({ error: "Sucursal inválida." }, { status: 400 });
  }
  const sucursal = body.branchId;

  const deliveryMethod = body.deliveryMethod === "shipping" ? "shipping" : "pickup";
  let shippingAddress: Required<{ [K in keyof ShippingAddressInput]: string }> | null = null;
  if (deliveryMethod === "shipping") {
    const a = body.shippingAddress ?? {};
    const fields = { fullName: a.fullName, phone: a.phone, address: a.address, city: a.city, province: a.province, postalCode: a.postalCode };
    const allStrings = Object.values(fields).every((v) => typeof v === "string" && v.trim().length > 0);
    if (!allStrings) {
      return Response.json({ error: "Completá la dirección de envío." }, { status: 400 });
    }
    shippingAddress = fields as Required<{ [K in keyof ShippingAddressInput]: string }>;
  }

  const requestedTires = new Map<string, number>();
  const requestedServices = new Map<string, number>();
  const requestedAccesorios = new Map<string, number>();
  for (const item of body.items) {
    const { kind, id, quantity } = item;
    if ((kind !== "tire" && kind !== "service" && kind !== "accessory") || typeof id !== "string" || typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1 || quantity > 8) {
      return Response.json({ error: "Hay un producto inválido en el carrito." }, { status: 400 });
    }
    const target = kind === "tire" ? requestedTires : kind === "service" ? requestedServices : requestedAccesorios;
    target.set(id, (target.get(id) ?? 0) + quantity);
  }

  // El precio de tires/servicios/accesorios siempre se toma del POS, nunca del
  // cliente, para que no se pueda manipular el monto a pagar.
  const [products, servicios, accesorios] = await Promise.all([
    getProductosDesdePOS(sucursal),
    requestedServices.size > 0 ? getServiciosPrecios(undefined, sucursal) : Promise.resolve([]),
    requestedAccesorios.size > 0 ? getAccesoriosDesdePOS(sucursal) : Promise.resolve([]),
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

  const cartAccesorios = [...requestedAccesorios].map(([id, quantity]) => ({ accesorio: accesorios.find((a) => a.id === id), quantity }));
  if (cartAccesorios.some(({ accesorio }) => !accesorio || !accesorio.enStock)) {
    return Response.json({ error: "Uno o más accesorios ya no tienen stock. Actualizá el carrito e intentá nuevamente." }, { status: 409 });
  }

  // El envío sale gratis a partir de FREE_SHIPPING_THRESHOLD de subtotal —
  // sin contar el envío mismo, calculado siempre acá con precios del POS,
  // nunca con lo que mande el cliente.
  const subtotal =
    cartTires.reduce((sum, { product, quantity }) => sum + product!.price * quantity, 0) +
    cartServices.reduce((sum, { servicio, quantity }) => sum + servicio!.precio * quantity, 0) +
    cartAccesorios.reduce((sum, { accesorio, quantity }) => sum + accesorio!.price * quantity, 0);
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;

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
      ...cartAccesorios.map(({ accesorio, quantity }) => ({
        id: accesorio!.id,
        title: accesorio!.nombre,
        quantity,
        unit_price: accesorio!.price,
        currency_id: "ARS",
      })),
      ...(deliveryMethod === "shipping" && shippingCost > 0
        ? [{ id: "envio", title: "Envío a domicilio", quantity: 1, unit_price: shippingCost, currency_id: "ARS" }]
        : []),
    ],
    external_reference: externalReference,
    // El pedido se coordina despues por WhatsApp (no hay base de datos de
    // ordenes); metadata queda guardado en el pago de Mercado Pago para que
    // la sucursal pueda ver ahi el metodo de entrega y la direccion.
    metadata: { delivery_method: deliveryMethod, shipping_address: shippingAddress },
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
