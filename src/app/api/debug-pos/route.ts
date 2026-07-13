// Ruta temporal de diagnóstico para el deploy en Cloudflare Workers — borrar
// después de confirmar por qué getProductosDesdePOS() devuelve un array vacío ahí.
export async function GET() {
  const url = process.env.POS_API_URL;
  const info: Record<string, unknown> = {
    hasUrl: !!url,
    urlLength: url?.length ?? 0,
    urlPreview: url ? `${url.slice(0, 15)}...${url.slice(-15)}` : null,
  };

  if (!url) {
    return Response.json(info);
  }

  try {
    const res = await fetch(`${url}/productos`);
    const text = await res.text();
    return Response.json({
      ...info,
      status: res.status,
      ok: res.ok,
      bodyPreview: text.slice(0, 300),
    });
  } catch (err) {
    return Response.json({
      ...info,
      error: err instanceof Error ? err.message : String(err),
      errorName: err instanceof Error ? err.name : undefined,
      stack: err instanceof Error ? err.stack?.slice(0, 500) : undefined,
    });
  }
}
