// Registra las medidas que alguien buscó y no pudimos ofrecer (no están en el
// catálogo, o están pero sin stock). Sin base de datos: el worker tiene
// `observability.logs` activado (wrangler.jsonc), así que cada console.log queda
// en Workers Logs y se filtra por `evento = "busqueda_sin_resultado"`. Para
// contar las más pedidas: Cloudflare → Workers → neumaticos-trivium → Logs →
// agrupar por `medida`. No se guarda nada de la persona.
const TIPOS = new Set(["sin_catalogo", "sin_stock"]);

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }
  const b = body as { medida?: unknown; tipo?: unknown; estandar?: unknown; origen?: unknown; flotation?: unknown };
  const medida = typeof b.medida === "string" ? b.medida : "";
  if (!/^\d{3}-\d{2}-r\d{2}$/.test(medida) || typeof b.tipo !== "string" || !TIPOS.has(b.tipo)) {
    return new Response(null, { status: 400 });
  }
  console.log(
    JSON.stringify({
      evento: "busqueda_sin_resultado",
      medida,
      tipo: b.tipo,
      // false = números que no parecen una medida real (error de tipeo), para filtrarlos.
      estandar: b.estandar === true,
      flotation: b.flotation === true,
      origen: typeof b.origen === "string" ? b.origen.slice(0, 80) : "",
    })
  );
  return new Response(null, { status: 204 });
}
