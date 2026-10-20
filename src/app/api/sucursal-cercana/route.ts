import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getNearestBranch } from "@/lib/branch-geo";

// Sucursal más cercana según la ubicación aproximada por IP que Cloudflare
// ya resuelve en cada request (request.cf): sin cartel de permiso del
// navegador, así que puede usarse para preseleccionar la sucursal apenas
// entra alguien. Es una aproximación (a nivel ciudad/región): la elección
// manual y el botón "Detectar" del modal siguen mandando.
export const dynamic = "force-dynamic";

const HEADERS = { "Content-Type": "application/json", "Cache-Control": "private, no-store" };

export async function GET() {
  try {
    const cf = getCloudflareContext().cf as { latitude?: string; longitude?: string } | undefined;
    const lat = Number(cf?.latitude);
    const lng = Number(cf?.longitude);
    if (cf?.latitude && cf?.longitude && Number.isFinite(lat) && Number.isFinite(lng)) {
      return new Response(JSON.stringify({ branchId: getNearestBranch(lat, lng).id }), { headers: HEADERS });
    }
  } catch {
    // Fuera de Cloudflare (next dev) no hay contexto: sin sugerencia.
  }
  return new Response(JSON.stringify({ branchId: null }), { headers: HEADERS });
}
