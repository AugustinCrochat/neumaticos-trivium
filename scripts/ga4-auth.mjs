#!/usr/bin/env node
/**
 * Autoriza el acceso de solo lectura a GA4 con tu usuario de Google (OAuth de
 * escritorio, flujo con redirección a localhost) y guarda el refresh token.
 * Sirve cuando la organización bloquea las claves de cuentas de servicio.
 *
 * Uso: node scripts/ga4-auth.mjs /ruta/oauth-client.json [/ruta/salida-token.json]
 *
 * El client.json es el que se descarga al crear un "ID de cliente de OAuth"
 * de tipo Aplicación de escritorio. Ambos archivos viven fuera del repo.
 * El token queda por defecto en ~/.config/trivium/ga4-token.json (modo 600).
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createServer } from "node:http";
import { homedir } from "node:os";
import path from "node:path";

const clientFile = process.argv[2];
if (!clientFile) {
  console.error("Uso: node scripts/ga4-auth.mjs /ruta/oauth-client.json [salida-token.json]");
  process.exit(1);
}
const out = process.argv[3] ?? path.join(homedir(), ".config/trivium/ga4-token.json");
const raw = JSON.parse(readFileSync(clientFile, "utf-8"));
const client = raw.installed ?? raw.web;
if (!client) throw new Error("El JSON no parece un cliente OAuth de escritorio.");

const server = createServer();
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const redirect = `http://127.0.0.1:${server.address().port}`;

const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
url.search = new URLSearchParams({
  client_id: client.client_id,
  redirect_uri: redirect,
  response_type: "code",
  scope: "https://www.googleapis.com/auth/analytics.readonly",
  access_type: "offline",
  prompt: "consent",
}).toString();

console.log("\nAbrí este link en el navegador y aceptá el acceso:\n\n" + url + "\n");

const code = await new Promise((resolve, reject) => {
  server.on("request", (req, res) => {
    const q = new URL(req.url, redirect).searchParams;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    if (q.get("code")) {
      res.end("Listo, ya podés cerrar esta pestaña y volver a la terminal.");
      resolve(q.get("code"));
    } else {
      res.end("Falta el código de autorización.");
      reject(new Error(q.get("error") ?? "sin código"));
    }
  });
});
server.close();

const res = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    code,
    client_id: client.client_id,
    client_secret: client.client_secret,
    redirect_uri: redirect,
    grant_type: "authorization_code",
  }),
});
const data = await res.json();
if (!data.refresh_token) throw new Error(`No llegó refresh token: ${JSON.stringify(data)}`);

mkdirSync(path.dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify({ client_id: client.client_id, client_secret: client.client_secret, refresh_token: data.refresh_token }), { mode: 0o600 });
console.log(`Token guardado en ${out}`);
