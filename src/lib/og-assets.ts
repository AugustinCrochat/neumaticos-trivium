import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Los logos se leen como SVG y se embeben como data URI: las imágenes
// generadas con ImageResponse (satori) no pueden hacer fetch a rutas
// relativas de /public, así que hay que pasarles el binario directo.
// Se cachean en memoria del proceso porque no cambian entre requests.
let wordmarkDataUri: string | null = null;
let iconDataUri: string | null = null;

async function toDataUri(relativePath: string) {
  const svg = await readFile(join(process.cwd(), relativePath), "utf-8");
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/** Isologo completo (ícono + "NEUMÁTICOS TRIVIUM"), texto en blanco. */
export async function getBrandWordmarkDataUri() {
  if (!wordmarkDataUri) {
    wordmarkDataUri = await toDataUri("public/logo-neumaticos-trivium.svg");
  }
  return wordmarkDataUri;
}

/** Sólo el isotipo (la cubierta), sin texto — para espacios chicos. */
export async function getBrandIconDataUri() {
  if (!iconDataUri) {
    iconDataUri = await toDataUri("src/app/icon.svg");
  }
  return iconDataUri;
}
