// Avisa a Bing y demás buscadores IndexNow de las URLs que cambiaron.
// Corre después del deploy: toma del sitemap publicado las URLs con lastmod de
// los últimos 3 días (las notas del blog, que son las únicas con fecha real) y
// la home. Repetir un aviso es inocuo. No falla el deploy si IndexNow no responde.
const HOST = "neumaticos.trivium.ar";
const KEY = "7bec9f4275b10a804f60b044db038b6f";
const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const limite = Date.now() - 3 * 24 * 3600 * 1000;
const urls = new Set([`https://${HOST}`]);
// `node scripts/indexnow.mjs --all` avisa todas las URLs del sitemap (útil una
// vez al darse de alta en Bing, o tras un cambio masivo).
const todas = process.argv.includes("--all");
for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
  const loc = m[1].match(/<loc>([^<]+)<\/loc>/)?.[1];
  const mod = m[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
  if (loc && (todas || (mod && Date.parse(mod) >= limite))) urls.add(loc);
}
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: [...urls].slice(0, 10000) }),
});
console.log(`IndexNow: ${urls.size} URLs, HTTP ${res.status}`);
