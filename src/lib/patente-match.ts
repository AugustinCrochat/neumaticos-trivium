import type { VehiculoOption } from "@/lib/pos-api";

// Sin espacios, guiones ni acentos: "MERCEDES BENZ" encuentra "Mercedes-Benz".
const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[\s-]/g, "");

/**
 * Lleva la marca/modelo que devuelve el registro (ej. "PEUGEOT" / "308 ALLURE
 * HDI NAV") a una opción de la lista del buscador. Prefiere el modelo más
 * largo que sea el inicio del texto (la versión sobrante se descarta); si no
 * hay, lo busca en cualquier parte. Devuelve null si la marca o el modelo no
 * están en la lista.
 */
export function vehiculoDesdePatente(
  marca: string,
  modelo: string | null,
  lista: VehiculoOption[]
): VehiculoOption | null {
  if (!modelo) return null;
  const delaMarca = lista.filter((v) => norm(v.marca) === norm(marca));
  if (delaMarca.length === 0) return null;
  const palabras = modelo.trim().split(/\s+/).filter(Boolean);
  for (let inicio = 0; inicio < palabras.length; inicio++) {
    for (let k = Math.min(4, palabras.length - inicio); k >= 1; k--) {
      const buscado = norm(palabras.slice(inicio, inicio + k).join(" "));
      const hit = delaMarca.find((v) => norm(v.modelo) === buscado);
      if (hit) return hit;
    }
  }
  return null;
}
