import { getAccesoriosDesdePOS } from "@/lib/pos-api";

export async function GET() {
  const accesorios = await getAccesoriosDesdePOS();
  return Response.json({ accesorios });
}
