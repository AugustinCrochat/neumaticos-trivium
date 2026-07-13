// Config de @opennextjs/cloudflare. Se deja el caché incremental por default
// (sin R2) para el primer despliegue de prueba — no hace falta crear un bucket
// todavía. Ver https://opennext.js.org/cloudflare/caching si más adelante se
// quiere ISR persistente entre despliegues.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig();
