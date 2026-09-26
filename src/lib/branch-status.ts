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

/** Busca la próxima apertura a partir de mañana (hasta 7 días). `offset` 1 es
    mañana; si ese día no abre (ej. domingo), sigue buscando, así que un
    sábado cerrado da directo "lunes" en vez de pasar por el domingo. */
function nextOpening(schedule: ScheduleRule[], fromDay: number): { dayLabel: string; time: string } | null {
  for (let offset = 1; offset <= 7; offset++) {
    const day = (fromDay + offset) % 7;
    const rule = ruleForDay(schedule, day);
    if (rule) {
      const dayLabel = offset === 1 ? "mañana" : DAY_LABELS[day].toLowerCase();
      return { dayLabel, time: rule.open };
    }
  }
  return null;
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

  const next = nextOpening(branch.schedule, day);
  return { isOpen: false, label: "Cerrado", detail: next ? `Abre ${next.dayLabel} ${next.time}` : "" };
}

export type PickupTiming = {
  /** true sólo si se puede retirar hoy (local abierto o todavía por abrir hoy). */
  sameDay: boolean;
  label: string;
};

/**
 * Mensaje de "Retiro ..." para la ficha de producto: en vez de asumir que
 * siempre se puede retirar el mismo día, calcula contra el horario real de
 * la sucursal. Si está cerrada, dice cuándo abre próximo (saltea domingos u
 * otros días sin horario, ver nextOpening) en vez de mostrar "retiro el
 * mismo día" con el local cerrado, que generaba gente yendo en vano.
 */
export function getPickupLabel(branch: Branch, now: Date = new Date()): PickupTiming {
  const { day, minutes } = nowInArgentina(now);
  const todayRule = ruleForDay(branch.schedule, day);

  if (todayRule) {
    const open = toMinutes(todayRule.open);
    const close = toMinutes(todayRule.close);
    if (minutes < open) return { sameDay: true, label: `Retiro hoy a partir de las ${todayRule.open}` };
    if (minutes < close) return { sameDay: true, label: "Retiro el mismo día" };
  }

  const next = nextOpening(branch.schedule, day);
  return next
    ? { sameDay: false, label: `Retiro ${next.dayLabel} a partir de las ${next.time}` }
    : { sameDay: false, label: "Consultá el horario de retiro" };
}
