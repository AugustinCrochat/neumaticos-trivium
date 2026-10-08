import { getRecargosTarjeta } from "@/lib/pos-api";

export async function GET() {
  const recargos = await getRecargosTarjeta();
  return Response.json({ recargos }, { headers: { "Cache-Control": "public, max-age=300, s-maxage=300" } });
}
