import { getAccesoriosDesdePOS } from "@/lib/pos-api";
import { getSelectedBranchSlug } from "@/lib/branch-server";

export async function GET() {
  const accesorios = await getAccesoriosDesdePOS(await getSelectedBranchSlug());
  return Response.json({ accesorios });
}
