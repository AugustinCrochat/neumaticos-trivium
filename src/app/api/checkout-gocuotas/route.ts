import { SITE_URL, BRANCHES, SHIPPING_FLAT_RATE } from "@/lib/config";
import { getProductosDesdePOS, getServiciosPrecios, getAccesoriosDesdePOS, COMBO_ALINEACION_BALANCEO_AUTO } from "@/lib/pos-api";

type CheckoutItem = { kind?: unknown; id?: unknown; quantity?: unknown };
type ShippingAddressInput = {
  fullName?: unknown; phone?: unknown; address?: unknown; city?: unknown; province?: unknown; postalCode?: unknown;
};

export async function POST(request: Request) {
  const email = process.env.GOCUOTAS_EMAIL?.trim();
  const password = process.env.GOCUOTAS_PASSWORD?.trim();

  if (!email || !password) {
    return Response.json({ error: "GOcuotas no está configurado (faltan credenciales)." }, { status: 503 });
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

  const totalItems = cartTires.reduce((sum, { product, quantity }) => sum + product!.price * quantity, 0)
    + cartServices.reduce((sum, { servicio, quantity }) => sum + servicio!.precio * quantity, 0)
    + cartAccesorios.reduce((sum, { accesorio, quantity }) => sum + accesorio!.price * quantity, 0);

  const totalAmount = totalItems + (deliveryMethod === "shipping" ? SHIPPING_FLAT_RATE : 0);
  const externalReference = `${body.branchId}-${crypto.randomUUID()}`;

  try {
    // 1. Obtener Token
    const authRes = await fetch("https://www.gocuotas.com/api_redirect/v1/authentication", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!authRes.ok) {
      console.error("[gocuotas] Error autenticando:", await authRes.text());
      return Response.json({ error: "Fallo la autenticación con GOcuotas." }, { status: 502 });
    }

    const authData = await authRes.json();
    const token = authData.token;

    if (!token) {
      return Response.json({ error: "No se pudo obtener el token de GOcuotas." }, { status: 502 });
    }

    // 2. Crear Checkout
    const checkoutRes = await fetch("https://www.gocuotas.com/api_redirect/v1/checkouts", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({
        amount_in_cents: Math.round(totalAmount * 100), // GOcuotas usa centavos
        order_reference_id: externalReference,
        webhook_url: `${SITE_URL}/api/webhooks/gocuotas`, // Opcional si querés guardar el estado
        url_success: `${SITE_URL}/pago/resultado?estado=aprobado`,
        url_failure: `${SITE_URL}/pago/resultado?estado=fallido`,
        url_pending: `${SITE_URL}/pago/resultado?estado=pendiente`,
      }),
    });

    if (!checkoutRes.ok) {
      console.error("[gocuotas] Error creando checkout:", await checkoutRes.text());
      return Response.json({ error: "No pudimos iniciar el pago con GOcuotas." }, { status: 502 });
    }

    const checkoutData = await checkoutRes.json();
    if (!checkoutData.url_init) {
      return Response.json({ error: "GOcuotas no devolvió la URL de pago." }, { status: 502 });
    }

    return Response.json({ initPoint: checkoutData.url_init });
  } catch (error) {
    console.error("[gocuotas] Excepción:", error);
    return Response.json({ error: "Ocurrió un error inesperado al procesar el pago." }, { status: 500 });
  }
}
