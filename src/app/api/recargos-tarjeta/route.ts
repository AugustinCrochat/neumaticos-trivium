import { getRecargosTarjeta } from "@/lib/pos-api";

export async function GET() {
  const recargos = await getRecargosTarjeta();
  return Response.json({ recargos });
}
