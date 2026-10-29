/**
 * Qué tan movido está el taller de Argüello por día y hora, según cuándo se
 * abren las órdenes de trabajo en el POS (generado con scripts/afluencia-pos.mjs:
 * solo conteos por día y hora, sin datos de clientes). Es un nivel relativo al
 * propio taller, no una cantidad: 0 tranquilo, 1 normal, 2 movido, calculado
 * con el promedio suavizado de ~29 semanas (2026-04-13 al 2026-10-29).
 * Para refrescarlo, volver a correr el script.
 */
export const AFLUENCIA_DESDE = "2026-04-13";
export const AFLUENCIA_HASTA = "2026-10-29";
export const AFLUENCIA_SEMANAS = 29;
/** Primera hora de la grilla y cantidad de horas (9 a 19 h). */
export const AFLUENCIA_HORA_INICIO = 9;
/** Un string por día (lunes a sábado), un dígito por hora desde AFLUENCIA_HORA_INICIO. */
export const AFLUENCIA: Record<number, string> = {
  1: "1000011222",
  2: "1000012221",
  3: "1000011111",
  4: "0110000011",
  5: "2200001211",
  6: "2222222222",
};

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

/** Tramos horarios seguidos con el nivel más bajo que tenga ese día, ej. "de 10 a 14 h" (cierra a la hora siguiente de la última celda). */
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
  const puntaje = (d: number) => nivelesDelDia(d).reduce<number>((s, v) => s + v, 0);
  return [1, 2, 3, 4, 5, 6].sort((a, b) => puntaje(a) - puntaje(b) || a - b);
}
