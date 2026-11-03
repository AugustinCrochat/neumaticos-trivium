const AR_OFFSET_MS = -3 * 3600_000; // Argentina no tiene horario de verano.

/** Milisegundos que faltan para que termine el día en Argentina. */
export function restoDelDia(ahora = Date.now()): number {
  const local = ahora + AR_OFFSET_MS;
  const finDia = Math.floor(local / 86400_000) * 86400_000 + 86400_000;
  return finDia - local;
}
