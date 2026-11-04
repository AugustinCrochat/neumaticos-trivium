import type { VehiculoOption } from "@/lib/pos-api";

// Sin espacios, guiones ni acentos: "MERCEDES BENZ" encuentra "Mercedes-Benz".
const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[\s-]/g, "");

export type PatenteResuelta = {
  vehiculo: VehiculoOption;
  /** Lo que el registro escribe después del modelo: "PRIVILEGE NAV", "XLS 1.5". Vacío si no hay. */
  version: string;
};

/**
 * Lleva la marca/modelo que devuelve el registro (ej. "PEUGEOT" / "308 ALLURE
 * HDI NAV") a una opción de la lista del buscador y separa la versión. Prefiere
 * el modelo más largo que sea el inicio del texto; si no hay, lo busca en
 * cualquier parte. Devuelve null si la marca o el modelo no están en la lista.
 */
export function resolverPatente(
  marca: string,
  modelo: string | null,
  lista: VehiculoOption[]
): PatenteResuelta | null {
  if (!modelo) return null;
  const delaMarca = lista.filter((v) => norm(v.marca) === norm(marca));
  if (delaMarca.length === 0) return null;
  const palabras = modelo.trim().split(/\s+/).filter(Boolean);
  // Mercedes-Benz escribe la clase como letra + número ("A 190", "C 200 K", "A190"):
  // en la lista es "Clase A", "Clase C". Va antes de la búsqueda general porque "190"
  // suelto es otro modelo (el 190 E de los 80).
  if (norm(marca) === "mercedesbenz") {
    const m = palabras[0]?.match(/^([A-Za-z])(\d*)$/);
    if (m && (m[2] || /^\d/.test(palabras[1] ?? ""))) {
      const hit = delaMarca.find((v) => norm(v.modelo) === `clase${m[1].toLowerCase()}`);
      if (hit) return { vehiculo: hit, version: (m[2] ? [m[2], ...palabras.slice(1)] : palabras.slice(1)).join(" ") };
    }
  }
  for (let inicio = 0; inicio < palabras.length; inicio++) {
    for (let k = Math.min(4, palabras.length - inicio); k >= 1; k--) {
      const buscado = norm(palabras.slice(inicio, inicio + k).join(" "));
      const hit = delaMarca.find((v) => norm(v.modelo) === buscado);
      if (hit) return { vehiculo: hit, version: palabras.slice(inicio + k).join(" ") };
      // El registro a veces pega el número de generación al nombre: "CLIO2" es
      // un Clio. Se prueba sin los dígitos finales sólo en una palabra suelta
      // y si queda un nombre de al menos 3 letras (así "208" o "C4" no se tocan).
      if (k === 1) {
        const sinNumero = buscado.replace(/\d+$/, "");
        if (sinNumero !== buscado && sinNumero.length >= 3) {
          const hit2 = delaMarca.find((v) => norm(v.modelo) === sinNumero);
          if (hit2) return { vehiculo: hit2, version: palabras.slice(inicio + 1).join(" ") };
        }
      }
    }
  }
  return null;
}

export function vehiculoDesdePatente(
  marca: string,
  modelo: string | null,
  lista: VehiculoOption[]
): VehiculoOption | null {
  return resolverPatente(marca, modelo, lista)?.vehiculo ?? null;
}
