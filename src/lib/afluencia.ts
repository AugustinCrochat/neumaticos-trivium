import { AFLUENCIA, AFLUENCIA_HORA_INICIO, AFLUENCIA_PROMEDIO } from "./afluencia-datos";

export { AFLUENCIA_DESDE, AFLUENCIA_HASTA, AFLUENCIA_HORA_INICIO, AFLUENCIA_SEMANAS } from "./afluencia-datos";

export type Nivel = 0 | 1 | 2;
export const NIVELES = ["Tranquilo", "Normal", "Movido"] as const;
export const DIAS_ABREVIADOS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
export const DIAS_NOMBRES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

/** Nivel de movimiento de un día (1 lunes a 6 sábado) para cada hora de la grilla; vacío si ese día no abre. */
export function nivelesDelDia(dia: number): Nivel[] {
  return [...(AFLUENCIA[dia] ?? "")].map((c) => Number(c) as Nivel);
}

/** Hora (9 = de 9:00 a 9:59) -> nivel, o null fuera de la grilla. */
export function nivelEnHora(dia: number, hora: number): Nivel | null {
  return nivelesDelDia(dia)[hora - AFLUENCIA_HORA_INICIO] ?? null;
}

/** Tramos horarios seguidos con el nivel más bajo de ese día (comparado con sus otras horas), ej. "de 10 a 14 h" (cierra a la hora siguiente de la última celda). */
export function mejoresTramos(dia: number): { desde: number; hasta: number; nivel: Nivel }[] {
  const n = nivelesDelDia(dia);
  if (!n.length) return [];
  const min = Math.min(...n) as Nivel;
  const tramos: { desde: number; hasta: number; nivel: Nivel }[] = [];
  n.forEach((v, i) => {
    if (v !== min) return;
    const h = AFLUENCIA_HORA_INICIO + i;
    const ultimo = tramos[tramos.length - 1];
    if (ultimo && ultimo.hasta === h) ultimo.hasta = h + 1;
    else tramos.push({ desde: h, hasta: h + 1, nivel: min });
  });
  return tramos;
}

/** Días de lunes a sábado de más tranquilo a más movido. */
export function diasPorTranquilidad(): number[] {
  return [1, 2, 3, 4, 5, 6].sort((a, b) => AFLUENCIA_PROMEDIO[a] - AFLUENCIA_PROMEDIO[b] || a - b);
}

/** Sucursales con datos de movimiento (órdenes del POS). El resto muestra un aviso en vez de la grilla. */
const SUCURSALES_CON_AFLUENCIA = ["arguello"];
export const tieneAfluencia = (branchId: string) => SUCURSALES_CON_AFLUENCIA.includes(branchId);
