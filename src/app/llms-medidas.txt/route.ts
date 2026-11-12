import { SITE_URL, DEFAULT_BRANCH_ID } from "@/lib/config";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { formatSize, sizeSlug } from "@/lib/tire-sizes";
import { cargaSlug } from "@/lib/carga";

// Se genera en el build (hay un deploy programado cada 2 horas hábiles), igual que el sitemap.
export const dynamic = "force-static";

/** Medidas con stock hoy, con precio "desde" y enlace. Complemento de /llms.txt para asistentes de IA. */
export async function GET() {
  const productos = (await getProductosDesdePOS(DEFAULT_BRANCH_ID)).filter((p) => p.enStock);
  const medidas = new Map<string, { label: string; path: string; desde: number; hasta: number; modelos: Set<string> }>();
  for (const p of productos) {
    const carga = !!p.isCarga;
    const slug = carga ? cargaSlug(p.size) : sizeSlug(p.size);
    const path = carga ? `/neumaticos/carga/${slug}` : `/neumaticos/${slug}`;
    const m = medidas.get(path) ?? { label: formatSize(p.size, carga), path, desde: Infinity, hasta: 0, modelos: new Set<string>() };
    m.desde = Math.min(m.desde, p.price);
    m.hasta = Math.max(m.hasta, p.price);
    m.modelos.add(p.model.toLowerCase().includes(p.brand.toLowerCase()) ? p.model : `${p.brand} ${p.model}`);
    medidas.set(path, m);
  }
  const ars = (n: number) => `$${n.toLocaleString("es-AR")}`;
  const lista = [...medidas.values()].sort((a, b) => a.label.localeCompare(b.label, "es", { numeric: true }));
  const lineas = lista.map(
    (m) =>
      `- ${m.label}: desde ${ars(m.desde)}${m.hasta > m.desde ? ` hasta ${ars(m.hasta)}` : ""} por unidad con IVA, ${m.modelos.size} ${m.modelos.size === 1 ? "modelo" : "modelos"} (${[...m.modelos].slice(0, 4).join(", ")}) — ${SITE_URL}${m.path}`,
  );
  const cuerpo = `# Neumáticos Trivium: medidas con stock

> Medidas de neumáticos con stock en el local de Argüello (Av. Donato Alvarez 7971, Córdoba) al momento de publicar el sitio. Precio por unidad con IVA incluido, colocación y válvulas sin cargo al comprar en el local. Atención lunes a sábado de 9 a 19 h, sin turnos. Para confirmar el stock del día: WhatsApp desde ${SITE_URL}/contacto.

${lista.length} medidas con stock:

${lineas.join("\n")}

Más contexto del negocio: ${SITE_URL}/llms.txt
`;
  return new Response(cuerpo, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
