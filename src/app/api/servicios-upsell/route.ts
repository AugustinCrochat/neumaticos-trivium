import { getServiciosPrecios, COMBO_ALINEACION_BALANCEO_AUTO } from "@/lib/pos-api";

export async function GET() {
  const servicios = await getServiciosPrecios();
  const combo = servicios.find((s) => s.codigoTango === COMBO_ALINEACION_BALANCEO_AUTO.codigoTango) ?? COMBO_ALINEACION_BALANCEO_AUTO;

  return Response.json({ combo });
}
