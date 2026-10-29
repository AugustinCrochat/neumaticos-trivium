"use client";

import { useSyncExternalStore } from "react";

/** Reloj en hora de Córdoba, actualizado una vez por minuto. Es null en el servidor y hasta que hidrata. */
function subscribe(cb: () => void) {
  const t = setInterval(cb, 60_000);
  return () => clearInterval(t);
}

function snapshot() {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: "America/Argentina/Cordoba", weekday: "short", hour: "2-digit", hour12: false })
      .formatToParts(new Date())
      .map((x) => [x.type, x.value]),
  );
  const dia = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[p.weekday as string] ?? 0;
  return `${dia}-${Number(p.hour) % 24}`;
}

export function useRelojCordoba(): { dia: number; hora: number } | null {
  const reloj = useSyncExternalStore(subscribe, snapshot, () => "");
  if (!reloj) return null;
  const [dia, hora] = reloj.split("-").map(Number);
  return { dia, hora };
}
