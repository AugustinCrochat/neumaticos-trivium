import { getServiciosPrecios, COMBO_ALINEACION_BALANCEO_AUTO } from "@/lib/pos-api";
import { splitAutoCamioneta } from "@/lib/servicios";

export async function GET() {
  const servicios = await getServiciosPrecios();
  const combo = servicios.find((s) => s.codigoTango === COMBO_ALINEACION_BALANCEO_AUTO.codigoTango) ?? COMBO_ALINEACION_BALANCEO_AUTO;
  // Combo de camioneta: ítem aparte del POS (grupo "combo", con "camioneta" en el nombre).
  const comboCamioneta = splitAutoCamioneta(servicios.filter((s) => s.grupo === "combo")).camioneta ?? null;

  return Response.json({ combo, comboCamioneta }, { headers: { "Cache-Control": "public, max-age=300, s-maxage=300" } });
}
