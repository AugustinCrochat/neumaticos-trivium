import { cookies } from "next/headers";
import { BRANCHES, DEFAULT_BRANCH_ID, BRANCH_COOKIE } from "./config";

/**
 * Sucursal elegida por el visitante, para Server Components / route
 * handlers (donde no hay acceso a localStorage). Se guarda en una cookie
 * desde branch-context.tsx al elegir sucursal — ver ese archivo para el lado
 * cliente. Si la cookie no existe o no es una sucursal real, cae a la
 * sucursal por defecto.
 */
export async function getSelectedBranchSlug(): Promise<string> {
  const store = await cookies();
  const value = store.get(BRANCH_COOKIE)?.value;
  return value && BRANCHES.some((b) => b.id === value) ? value : DEFAULT_BRANCH_ID;
}
