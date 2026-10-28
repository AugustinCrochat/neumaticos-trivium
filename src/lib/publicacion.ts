/**
 * Publicación programada del blog.
 *
 * Cada nota lleva su fecha de publicación (`date` en data.ts). Hasta esa fecha
 * la nota existe en el repo pero no se ve: no sale en el blog, el sitemap, la
 * búsqueda ni los enlaces cruzados, y su URL da 404. Como el sitio es
 * estático, "hoy" es el día del build; el deploy programado corre de lunes a
 * sábado a las 9 (ART), así que una nota fechada un día aparece en el primer
 * build de ese día (las de domingo, el lunes).
 *
 * Para revisar una nota futura en local: VER_PROGRAMADAS=1 npm run dev.
 */
const verProgramadas = process.env.VER_PROGRAMADAS === "1";

/** Hoy en Córdoba, como YYYY-MM-DD (Argentina no tiene horario de verano). */
export const HOY = new Date().toLocaleDateString("en-CA", { timeZone: "America/Argentina/Cordoba" });

export function estaPublicada(date: string): boolean {
  return verProgramadas || date <= HOY;
}
