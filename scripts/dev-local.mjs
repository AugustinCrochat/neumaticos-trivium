// Ambiente local: levanta el sitio (next dev) y un visor de pantallas, y abre el navegador.
//   npm run local            → todo, en primer plano (Ctrl+C lo cierra)
//   npm run local -- --no-open
// El sitio queda en :3100 y el visor (con el sitio reenviado) en :3101/__pantallas, para no chocar con el POS/ERP (que usan :3000).
import { spawn } from "node:child_process";
import { createServer, request } from "node:http";
import { connect } from "node:net";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITIO = 3100;
const VISOR = 3101;
const abrir = !process.argv.includes("--no-open");

const responde = (puerto) =>
  new Promise((ok) => {
    const r = request({ host: "localhost", port: puerto, path: "/", method: "HEAD", timeout: 1500 }, () => ok(true));
    r.on("error", () => ok(false));
    r.on("timeout", () => { r.destroy(); ok(false); });
    r.end();
  });

let next = null;
if (await responde(SITIO)) {
  console.log(`Sitio ya corriendo en http://localhost:${SITIO}`);
} else {
  console.log("Levantando el sitio…");
  next = spawn("npx", ["next", "dev", "-p", String(SITIO)], {
    cwd: RAIZ,
    stdio: "inherit",
    // Tope de memoria del heap de Node para que el dev server no se coma la máquina.
    env: { ...process.env, NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ""} --max-old-space-size=3072`.trim() },
  });
  next.on("exit", (c) => process.exit(c ?? 0));
}

// El visor y el sitio se sirven desde el mismo puerto (:3101): /__pantallas es el visor y el resto se
// reenvía a next dev. Así las ventanas son del mismo origen y el visor puede sincronizarlas.
if (!(await responde(VISOR))) {
  const cabeceras = (h) => ({ ...h, host: `localhost:${SITIO}`, ...(h.origin ? { origin: `http://localhost:${SITIO}` } : {}) });
  const srv = createServer(async (req, res) => {
    if (req.url === "/__pantallas" || req.url.startsWith("/__pantallas?")) {
      // Siempre se relee: se puede editar el visor sin reiniciar.
      const html = await readFile(join(RAIZ, "dev-tools/pantallas.html"), "utf8");
      res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
      return res.end(html);
    }
    const up = request({ host: "localhost", port: SITIO, path: req.url, method: req.method, headers: cabeceras(req.headers) }, (r) => {
      res.writeHead(r.statusCode, r.headers);
      r.pipe(res);
    });
    up.on("error", () => { res.writeHead(502); res.end("El sitio todavía no responde"); });
    req.pipe(up);
  });
  // HMR de next dev usa websocket.
  srv.on("upgrade", (req, socket, head) => {
    const up = connect(SITIO, "localhost", () => {
      const h = cabeceras(req.headers);
      up.write(`${req.method} ${req.url} HTTP/1.1\r\n` + Object.entries(h).map(([k, v]) => `${k}: ${v}`).join("\r\n") + "\r\n\r\n");
      if (head?.length) up.write(head);
      up.pipe(socket);
      socket.pipe(up);
    });
    up.on("error", () => socket.destroy());
    socket.on("error", () => up.destroy());
  });
  srv.listen(VISOR, () => console.log(`Visor de pantallas: http://localhost:${VISOR}/__pantallas`));
}

// Esperar a que el sitio responda para abrir el navegador.
if (abrir) {
  for (let i = 0; i < 120 && !(await responde(SITIO)); i++) await new Promise((r) => setTimeout(r, 1000));
  spawn("xdg-open", [`http://localhost:${VISOR}/__pantallas`], { stdio: "ignore", detached: true }).unref();
}

const cerrar = () => { next?.kill("SIGTERM"); process.exit(0); };
process.on("SIGINT", cerrar);
process.on("SIGTERM", cerrar);
