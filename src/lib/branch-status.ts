import type { Branch, ScheduleRule } from "@/lib/config";

const AR_TIME_ZONE = "America/Argentina/Buenos_Aires";
const DAY_LABELS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export type BranchStatus = {
  isOpen: boolean;
  /** Texto corto para el badge, ej. "Abierto ahora" / "Cerrado" */
  label: string;
  /** Detalle secundario, ej. "Cierra 18:30" o "Abre lunes 08:30" */
  detail: string;
};

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Devuelve el dia de la semana (0-6) y los minutos desde medianoche en hora de Argentina. */
function nowInArgentina(now: Date): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: AR_TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const weekdayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };

  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Sun";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");

  return { day: weekdayMap[weekday] ?? 0, minutes: (hour % 24) * 60 + minute };
}

function ruleForDay(schedule: ScheduleRule[], day: number): ScheduleRule | undefined {
  return schedule.find((rule) => rule.days.includes(day));
}

/** Busca la proxima apertura a partir de manana (hasta 7 dias) para el mensaje "Abre ...". */
function nextOpening(schedule: ScheduleRule[], fromDay: number): string {
  for (let offset = 1; offset <= 7; offset++) {
    const day = (fromDay + offset) % 7;
    const rule = ruleForDay(schedule, day);
    if (rule) {
      const label = offset === 1 ? "mañana" : DAY_LABELS[day].toLowerCase();
      return `Abre ${label} ${rule.open}`;
    }
  }
  return "";
}

export function getBranchStatus(branch: Branch, now: Date = new Date()): BranchStatus {
  const { day, minutes } = nowInArgentina(now);
  const todayRule = ruleForDay(branch.schedule, day);

  if (todayRule) {
    const open = toMinutes(todayRule.open);
    const close = toMinutes(todayRule.close);

    if (minutes < open) {
      return { isOpen: false, label: "Cerrado", detail: `Abre hoy ${todayRule.open}` };
    }
    if (minutes < close) {
      return { isOpen: true, label: "Abierto ahora", detail: `Cierra ${todayRule.close}` };
    }
  }

  return { isOpen: false, label: "Cerrado", detail: nextOpening(branch.schedule, day) };
}

/** Links de navegacion hacia la sucursal (arrancan la app de mapas del telefono). */
export function getDirectionsLinks(branch: Branch): { google: string; waze: string } {
  const { lat, lng } = branch.coordinates;
  return {
    google: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    waze: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`,
  };
}
