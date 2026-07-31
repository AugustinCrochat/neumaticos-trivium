import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

/**
 * Rutas sin valor de búsqueda que además consumen presupuesto de rastreo.
 *
 * Ojo con lo que NO está acá: /buscar, /busqueda y /carrito no se bloquean por
 * robots sino con <meta robots="noindex"> desde la metadata de cada página. Si
 * se bloquearan acá, el crawler nunca podría leer ese noindex y las URLs
 * podrían quedar igual en el índice, sin descripción ("Indexada aunque
 * bloqueada por robots.txt" en Search Console).
 */
const RUTAS_PRIVADAS = ["/api/", "/admin/"];

/**
 * Bots de asistentes de IA que resuelven consultas en vivo citando la fuente
 * (búsqueda con IA), a diferencia de los que sólo juntan corpus de
 * entrenamiento. Nos interesa aparecer ahí: "¿dónde compro neumáticos en
 * Córdoba?" es exactamente el tipo de consulta que hoy se hace en un chat.
 *
 * ATENCIÓN — hoy esto no alcanza: Cloudflare inyecta su propio bloque de
 * robots.txt gestionado ANTES que este, con "Disallow: /" para ClaudeBot,
 * GPTBot y otros. Como un grupo por user-agent específico gana sobre "*", el
 * bloqueo de Cloudflare manda. Para que estas reglas tengan efecto hay que
 * desactivar el robots.txt gestionado en el panel de Cloudflare
 * (AI Crawl Control / Manage robots.txt) del dominio.
 */
const BOTS_BUSQUEDA_IA = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
];

/** Scrapers que sólo alimentan datasets de entrenamiento: no devuelven visitas
    ni citan la fuente, así que no hay nada que ganar dejándolos pasar. */
const BOTS_ENTRENAMIENTO = ["CCBot", "Bytespider", "Amazonbot", "meta-externalagent"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: RUTAS_PRIVADAS },
      { userAgent: BOTS_BUSQUEDA_IA, allow: "/", disallow: RUTAS_PRIVADAS },
      { userAgent: BOTS_ENTRENAMIENTO, disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
