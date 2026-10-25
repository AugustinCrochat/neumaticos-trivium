#!/usr/bin/env node
/**
 * Reporte de GA4 por línea de comandos (Google Analytics Data API v1beta).
 *
 * Uso:
 *   GA4_PROPERTY_ID=123456789 GA4_KEY_FILE=/ruta/clave.json \
 *     node scripts/ga4-report.mjs [paginas|eventos|fuentes|contactos|diario] [--dias=28] [--limite=30]
 *
 * Autenticación: GA4_KEY_FILE (cuenta de servicio) o GA4_OAUTH_FILE (token de
 * usuario generado con scripts/ga4-auth.mjs, para cuando la organización bloquea
 * las claves de servicio).
 *
 * GA4_PROPERTY_ID es el ID numérico de la propiedad (Admin > Configuración de
 * la propiedad), no el G-XXXX de la etiqueta. La clave es la de una cuenta de
 * servicio con rol Lector en esa propiedad; vive fuera del repo.
 */
import { readFileSync } from "node:fs";
import { createSign } from "node:crypto";

const PROPERTY = process.env.GA4_PROPERTY_ID;
const KEY_FILE = process.env.GA4_KEY_FILE;
const OAUTH_FILE = process.env.GA4_OAUTH_FILE;
if (!PROPERTY || (!KEY_FILE && !OAUTH_FILE)) {
  console.error("Faltan GA4_PROPERTY_ID y GA4_KEY_FILE (cuenta de servicio) o GA4_OAUTH_FILE (ver scripts/ga4-auth.mjs).");
  process.exit(1);
}

const args = process.argv.slice(2);
const reporte = args.find((a) => !a.startsWith("--")) ?? "paginas";
const opt = (name, def) => Number(args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1] ?? def);
const dias = opt("dias", 28);
const limite = opt("limite", 30);

const b64 = (x) => Buffer.from(x).toString("base64url");

async function token() {
  if (OAUTH_FILE) {
    const saved = JSON.parse(readFileSync(OAUTH_FILE, "utf-8"));
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: saved.client_id, client_secret: saved.client_secret, refresh_token: saved.refresh_token, grant_type: "refresh_token" }),
    });
    const data = await res.json();
    if (!data.access_token) throw new Error(`No se pudo renovar el token: ${JSON.stringify(data)}`);
    return data.access_token;
  }
  const key = JSON.parse(readFileSync(KEY_FILE, "utf-8"));
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${b64(
    JSON.stringify({
      iss: key.client_email,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  )}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(key.private_key, "base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`No se pudo autenticar: ${JSON.stringify(data)}`);
  return data.access_token;
}

const REPORTES = {
  paginas: {
    dimensions: ["pagePath"],
    metrics: ["screenPageViews", "activeUsers", "averageSessionDuration", "keyEvents"],
    orderBy: "screenPageViews",
  },
  eventos: { dimensions: ["eventName"], metrics: ["eventCount", "activeUsers"], orderBy: "eventCount" },
  fuentes: {
    dimensions: ["sessionSourceMedium"],
    metrics: ["sessions", "activeUsers", "keyEvents", "engagementRate"],
    orderBy: "sessions",
  },
  // Clics de contacto por página: dónde se genera el WhatsApp / "cómo llegar".
  contactos: {
    dimensions: ["pagePath", "eventName"],
    metrics: ["eventCount", "activeUsers"],
    orderBy: "eventCount",
    eventos: ["click_whatsapp", "como_llegar", "ads_conversion_Contactar_1"],
  },
  diario: { dimensions: ["date"], metrics: ["sessions", "activeUsers", "screenPageViews", "keyEvents"], orderBy: null },
};

const def = REPORTES[reporte];
if (!def) {
  console.error(`Reporte desconocido: ${reporte}. Opciones: ${Object.keys(REPORTES).join(", ")}`);
  process.exit(1);
}

const body = {
  dateRanges: [{ startDate: `${dias}daysAgo`, endDate: "today" }],
  dimensions: def.dimensions.map((name) => ({ name })),
  metrics: def.metrics.map((name) => ({ name })),
  limit: limite,
  ...(def.eventos
    ? { dimensionFilter: { filter: { fieldName: "eventName", inListFilter: { values: def.eventos } } } }
    : {}),
  ...(def.orderBy
    ? { orderBys: [{ metric: { metricName: def.orderBy }, desc: true }] }
    : { orderBys: [{ dimension: { dimensionName: "date" } }] }),
};

const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY}:runReport`, {
  method: "POST",
  headers: { Authorization: `Bearer ${await token()}`, "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
const data = await res.json();
if (!res.ok) {
  console.error(JSON.stringify(data, null, 2));
  process.exit(1);
}

console.log(`GA4 · ${reporte} · últimos ${dias} días\n`);
console.log([...def.dimensions, ...def.metrics].join("\t"));
for (const row of data.rows ?? []) {
  console.log([...row.dimensionValues, ...row.metricValues].map((v) => v.value).join("\t"));
}
