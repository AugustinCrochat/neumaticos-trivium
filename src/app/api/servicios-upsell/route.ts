import { getServiciosPrecios } from "@/lib/pos-api";

// SKU (código Tango) del combo "Alineación + 4 balanceos" para auto.
const COMBO_ALINEACION_BALANCEO_AUTO = "2010106";

export async function GET() {
  const servicios = await getServiciosPrecios();
  const combo = servicios.find((s) => s.codigoTango === COMBO_ALINEACION_BALANCEO_AUTO) ?? null;

  return Response.json({ combo });
}
