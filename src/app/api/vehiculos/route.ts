import { NextResponse } from "next/server";
import { getVehiculosDesdePOS } from "@/lib/pos-api";

// Se llama desde el cliente (VehicleProvider) para no bloquear el render del
// layout raíz con un fetch al POS — ver memoria cache-incremental-sin-r2.
export async function GET() {
  const vehiculos = await getVehiculosDesdePOS();
  return NextResponse.json({ vehiculos });
}
