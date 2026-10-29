// Resume cuántas órdenes de trabajo entran por día y hora en una sucursal del POS
// y escribe src/lib/afluencia.ts (solo conteos: sin clientes, patentes ni montos).
// Uso: node scripts/afluencia-pos.mjs <ruta al .env.local del POS> [id-sucursal-pos] [desde]
// Necesita NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en ese archivo.
import { readFileSync, writeFileSync } from "node:fs";

const [envPath, sucursalId = "3154adb2-81f7-4a06-a61a-cfbb4cb32219", desde = "2026-04-13"] = process.argv.slice(2);
if (!envPath) throw new Error("Falta la ruta al .env.local del POS");
const env = Object.fromEntries(
  readFileSync(envPath, "utf8").split("\n").map((l) => l.match(/^([A-Z0-9_]+)=(.*)$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, "")]),
);
const base = env.NEXT_PUBLIC_SUPABASE_URL;
const headers = { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` };

const filas = [];
for (let from = 0; ; from += 1000) {
  const url = `${base}/rest/v1/ordenes_trabajo?select=fecha_creacion&sucursal_id=eq.${sucursalId}&estado_trabajo=neq.cancelada&fecha_creacion=gte.${desde}&order=fecha_creacion`;
  const res = await fetch(url, { headers: { ...headers, Range: `${from}-${from + 999}` } });
  if (!res.ok) throw new Error(await res.text());
  const page = await res.json();
  filas.push(...page);
  if (page.length < 1000) break;
}

const HORAS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const fmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/Argentina/Cordoba", weekday: "short", hour: "2-digit", hour12: false });
const DIA = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const conteo = Array.from({ length: 7 }, () => Array(24).fill(0));
for (const f of filas) {
  const p = Object.fromEntries(fmt.formatToParts(new Date(f.fecha_creacion)).map((x) => [x.type, x.value]));
  conteo[DIA[p.weekday]][Number(p.hour) % 24] += 1;
}

// Cuántas veces ocurrió cada día de la semana en el período, para promediar.
const ocurrencias = Array(7).fill(0);
for (let d = new Date(`${desde}T12:00:00Z`); d <= new Date(); d.setUTCDate(d.getUTCDate() + 1)) ocurrencias[d.getUTCDay()] += 1;

// Promedio de órdenes por hora, suavizado con las horas vecinas (1-2-1) para que
// un solo día raro no cambie el nivel de la celda.
const promedio = (d, h) => (conteo[d][h] || 0) / ocurrencias[d];
const suave = (d, h) => {
  const w = [[h - 1, 1], [h, 2], [h + 1, 1]].filter(([x]) => HORAS.includes(x));
  return w.reduce((s, [x, k]) => s + promedio(d, x) * k, 0) / w.reduce((s, [, k]) => s + k, 0);
};
const valores = [];
for (const d of [1, 2, 3, 4, 5, 6]) for (const h of HORAS) valores.push(suave(d, h));
const orden = [...valores].sort((a, b) => a - b);
const t1 = orden[Math.floor(orden.length / 3)];
const t2 = orden[Math.floor((orden.length * 2) / 3)];
const nivel = (v) => (v <= t1 ? 0 : v <= t2 ? 1 : 2);

const dias = [1, 2, 3, 4, 5, 6].map((d) => HORAS.map((h) => nivel(suave(d, h))).join(""));
const hasta = new Date().toISOString().slice(0, 10);
const semanas = Math.round(ocurrencias[1]);

writeFileSync(
  new URL("../src/lib/afluencia.ts", import.meta.url),
  `/**
 * Qué tan movido está el taller de Argüello por día y hora, según cuándo se
 * abren las órdenes de trabajo en el POS (generado con scripts/afluencia-pos.mjs:
 * solo conteos por día y hora, sin datos de clientes). Es un nivel relativo al
 * propio taller, no una cantidad: 0 tranquilo, 1 normal, 2 movido, calculado
 * con el promedio suavizado de ~${semanas} semanas (${desde} al ${hasta}).
 * Para refrescarlo, volver a correr el script.
 */
export const AFLUENCIA_DESDE = "${desde}";
export const AFLUENCIA_HASTA = "${hasta}";
export const AFLUENCIA_SEMANAS = ${semanas};
/** Primera hora de la grilla y cantidad de horas (9 a 19 h). */
export const AFLUENCIA_HORA_INICIO = ${HORAS[0]};
/** Un string por día (lunes a sábado), un dígito por hora desde AFLUENCIA_HORA_INICIO. */
export const AFLUENCIA: Record<number, string> = {
${dias.map((s, i) => `  ${i + 1}: "${s}",`).join("\n")}
};
`,
);
console.log(`${filas.length} órdenes, ${semanas} semanas`);
dias.forEach((s, i) => console.log(["L", "M", "X", "J", "V", "S"][i], s));
