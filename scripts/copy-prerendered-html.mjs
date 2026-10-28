// Publica el HTML de las páginas prearmadas como archivos estáticos.
//
// Los archivos de `.open-next/assets` los sirve Cloudflare desde el borde, en
// ~60 ms y desde la primera visita, SIN ejecutar el Worker (sin arranque en
// frío ni CPU). Las páginas, en cambio, pasaban siempre por el Worker de
// OpenNext: 0,5 s con el Worker ya arrancado, 1–2,5 s en frío.
//
// `next build` deja cada página prearmada como `.next/server/app/<ruta>.html`
// (la home como `index.html`); `/neumaticos` se sirve desde `neumaticos.html`
// y `/neumaticos/205-55-r16` desde `neumaticos/205-55-r16.html`. Se copian tal
// cual al directorio de assets. Lo que no tiene HTML prearmado (rutas
// dinámicas, /api, imágenes OG, sitemap, robots) sigue yendo al Worker.
//
// Va DESPUÉS de `opennextjs-cloudflare build` y ANTES de `deploy` (ver
// .github/workflows/deploy.yml). Con `--check` solo lista lo que copiaría.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const ORIGEN = ".next/server/app";
const DESTINO = ".open-next/assets";
const soloListar = process.argv.includes("--check");

if (!existsSync(ORIGEN) || !existsSync(DESTINO)) {
  console.error(`Faltan ${ORIGEN} o ${DESTINO}: correr antes 'npx opennextjs-cloudflare build'.`);
  process.exit(1);
}

function* archivos(dir) {
  for (const nombre of readdirSync(dir)) {
    const ruta = join(dir, nombre);
    if (statSync(ruta).isDirectory()) {
      // `.segments` guarda los fragmentos RSC de cada página, no HTML.
      if (!nombre.endsWith(".segments")) yield* archivos(ruta);
    } else {
      yield ruta;
    }
  }
}

function estado(rutaHtml) {
  const meta = rutaHtml.replace(/\.html$/, ".meta");
  if (!existsSync(meta)) return 200;
  try {
    return JSON.parse(readFileSync(meta, "utf8")).status ?? 200;
  } catch {
    return 0; // ilegible: no se publica
  }
}

let copiados = 0;
for (const ruta of archivos(ORIGEN)) {
  if (!ruta.endsWith(".html")) continue;
  const rel = relative(ORIGEN, ruta);
  // _not-found, _global-error y similares: se sirven con su propio status desde el Worker.
  if (rel.split("/").some((parte) => parte.startsWith("_"))) continue;
  if (estado(ruta) !== 200) continue;
  const destino = join(DESTINO, rel);
  // Un archivo estático de /public con el mismo nombre ganaría sobre la página: no se pisa.
  if (existsSync(destino)) {
    console.warn(`Ya existe ${destino}, se omite.`);
    continue;
  }
  if (!soloListar) {
    mkdirSync(dirname(destino), { recursive: true });
    cpSync(ruta, destino);
  }
  copiados++;
}
console.log(`${soloListar ? "Se copiarían" : "Copiadas"} ${copiados} páginas prearmadas a ${DESTINO}.`);
