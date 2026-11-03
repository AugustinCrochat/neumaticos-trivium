export const PATENTE_RE = /^([A-Z]{3}\d{3}|[A-Z]{2}\d{3}[A-Z]{2})$/;

/** Mayúsculas, sin espacios ni símbolos, máximo 7 caracteres. */
export function normalizarPatente(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
}

export type EstiloPatente = "mercosur" | "anterior";

/**
 * Estilo de chapa que se dibuja mientras la persona escribe.
 * - Mercosur (2016+): AA 123 BB. Todas arrancan con A por ahora (AA…AH), así
 *   que cualquier otra primera letra es del formato anterior.
 * - Anterior: ABC 123. Las que arrancan con A también existen (AAA…): se
 *   distingue por la tercera posición (letra = anterior, número = Mercosur).
 * Hasta que haya dos caracteres se muestra Mercosur, que es lo más probable
 * para un auto reciente.
 */
export function estiloPatente(normalizada: string): EstiloPatente {
  const [a, , c] = normalizada;
  if (a && /[B-Z]/.test(a)) return "anterior";
  if (c && /[A-Z]/.test(c)) return "anterior";
  return "mercosur";
}

/** "AB123CD" -> "AB 123 CD" · "ABC123" -> "ABC 123". */
export function formatearPatente(normalizada: string, estilo: EstiloPatente): string {
  if (estilo === "anterior") return [normalizada.slice(0, 3), normalizada.slice(3)].filter(Boolean).join(" ");
  return [normalizada.slice(0, 2), normalizada.slice(2, 5), normalizada.slice(5)].filter(Boolean).join(" ");
}

/** ¿El año cae en un rango "2011-2018" o "2023-presente"? */
export function anioEnRango(years: string, anio: number): boolean {
  const m = years.match(/^(\d{4})-(\d{4}|presente)$/);
  if (!m) return false;
  const desde = Number(m[1]);
  const hasta = m[2] === "presente" ? new Date().getFullYear() + 1 : Number(m[2]);
  return anio >= desde && anio <= hasta;
}

type ConAnios = { years?: string };

/**
 * Deja las medidas de la generación que corresponde al año del auto (más las
 * que no tienen rango). Si ninguna cubre ese año, devuelve todas sin filtrar:
 * mejor mostrar de más que quedarse sin ninguna.
 */
export function medidasParaAnio<T extends ConAnios>(sizes: T[], anio: number | null | undefined): { sizes: T[]; filtrado: boolean } {
  if (!anio) return { sizes, filtrado: false };
  const delAnio = sizes.filter((s) => s.years && anioEnRango(s.years, anio));
  if (delAnio.length === 0) return { sizes, filtrado: false };
  return { sizes: [...delAnio, ...sizes.filter((s) => !s.years)], filtrado: true };
}

const sinAcentos = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Palabras útiles de una versión: sin cilindrada ni números sueltos ("1.5", "16v"). */
function palabrasDeVersion(s: string): string[] {
  return sinAcentos(s)
    .split(/[^a-z0-9+]+/)
    .filter((t) => t.length >= 2 && /[a-z]/.test(t) && !/^\d+(v|cv|hp)$/.test(t));
}

/**
 * Elige la medida cuya versión coincide con la que escribe el registro
 * ("PRIVILEGE NAV", "XLS 1.5"). Sólo devuelve una si hay UNA mejor que las
 * demás: ante un empate o ninguna coincidencia devuelve null y la persona
 * elige. Nunca adivina.
 */
export function medidaPorVersion<T extends { version?: string }>(
  sizes: T[],
  versionRegistro: string | null | undefined
): T | null {
  if (!versionRegistro) return null;
  const buscadas = new Set(palabrasDeVersion(versionRegistro));
  if (buscadas.size === 0) return null;
  let mejor = 0;
  let ganadoras: T[] = [];
  for (const s of sizes) {
    if (!s.version) continue;
    const propias = new Set(palabrasDeVersion(s.version));
    let puntos = 0;
    for (const t of propias) if (buscadas.has(t)) puntos++;
    if (puntos > mejor) {
      mejor = puntos;
      ganadoras = [s];
    } else if (puntos === mejor && puntos > 0) {
      ganadoras.push(s);
    }
  }
  return ganadoras.length === 1 ? ganadoras[0] : null;
}
