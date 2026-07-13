// Ruta temporal de diagnóstico #2 — /catalogo cuelga (timeout total) tanto en
// workers.dev como en el dominio con Route, justo después de mucho tráfico de
// prueba. Hipótesis: Vercel (origen del POS) puede estar bloqueando/desafiando
// las requests salientes del Worker por volumen. Esta ruta mide el tiempo real
// del fetch con un timeout corto propio, para no colgar indefinidamente.
export async function GET() {
  const url = process.env.POS_API_URL;
  if (!url) return Response.json({ hasUrl: false });

  const start = Date.now();
  try {
    const res = await fetch(`${url}/productos`, {
      signal: AbortSignal.timeout(8000),
    });
    const text = await res.text();
    return Response.json({
      ms: Date.now() - start,
      status: res.status,
      ok: res.ok,
      bodyLength: text.length,
      bodyPreview: text.slice(0, 200),
    });
  } catch (err) {
    return Response.json({
      ms: Date.now() - start,
      error: err instanceof Error ? err.message : String(err),
      errorName: err instanceof Error ? err.name : undefined,
    });
  }
}
