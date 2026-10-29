/**
 * Qué tan movido está el taller de Argüello por día y hora, según cuándo se
 * abren las órdenes de trabajo en el POS (generado con scripts/afluencia-pos.mjs:
 * solo conteos por día y hora, sin datos de clientes). Es un nivel relativo a las
 * demás horas del mismo día, no una cantidad: 0 tranquilo, 1 normal, 2 movido,
 * calculado con el promedio suavizado de ~29 semanas (2026-04-13 al 2026-10-29).
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
  3: "1000012221",
  4: "1220000112",
  5: "2200001211",
  6: "1222100100",
};
/** Órdenes promedio por hora de cada día (lunes a sábado): solo para ordenar los días del más tranquilo al más movido. */
export const AFLUENCIA_PROMEDIO: Record<number, number> = {
  1: 0.77,
  2: 0.79,
  3: 0.76,
  4: 0.64,
  5: 0.78,
  6: 1.26,
};
