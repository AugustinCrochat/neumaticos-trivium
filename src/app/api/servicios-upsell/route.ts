import { getServiciosPrecios } from "@/lib/pos-api";

export async function GET() {
  const [alineacion, balanceo] = await Promise.all([
    getServiciosPrecios("alineacion"),
    getServiciosPrecios("balanceo"),
  ]);

  return Response.json({
    alineacion: alineacion[0] ?? null,
    balanceo: balanceo[0] ?? null,
  });
}
