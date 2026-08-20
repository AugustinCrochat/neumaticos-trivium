import { NextResponse } from "next/server";
import { getVehiculosDesdePOS } from "@/lib/pos-api";

// Lista completa de vehículos del POS (~47 KB). El layout raíz pasa solo la
// lista estática para no bloquear el render de todo el sitio con un fetch al
// POS — ver memoria cache-incremental-sin-r2.
//
// Antes esto lo llamaba el VehicleProvider en CADA carga de página del sitio:
// una invocación dinámica extra del Worker por pageview, sin cachear, ~1s.
// Ahora lo pide solo quien abre el buscador por auto (ver vehicle-context) y
// además la respuesta se cachea, así que la mayoría ni llega al Worker.
export const revalidate = 3600;

export async function GET() {
  const vehiculos = await getVehiculosDesdePOS();
  return NextResponse.json(
    { vehiculos },
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
