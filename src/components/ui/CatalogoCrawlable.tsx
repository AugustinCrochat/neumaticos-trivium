import type { TireProduct } from "@/lib/types";

/**
 * Lista del catálogo como HTML simple, para el Suspense del catálogo.
 *
 * ShopPage lee los parámetros de la URL en el cliente (filtros, medida buscada),
 * así que sin esto el HTML prearmado de /catalogo salía vacío: sin título, sin
 * un solo producto ni enlace. Los buscadores que no ejecutan JavaScript y los
 * rastreadores de IA veían una página en blanco. Este bloque se muestra hasta
 * que carga el catálogo interactivo, que lo reemplaza; es el mismo contenido
 * (modelo, medida, precio y enlace a la ficha), no un texto aparte.
 */
export function CatalogoCrawlable({ productos, titulo = "Catálogo de neumáticos y cubiertas" }: { productos: TireProduct[]; titulo?: string }) {
  const porRodado = new Map<number, TireProduct[]>();
  for (const p of productos) {
    const rim = p.size?.rim;
    if (!rim) continue;
    porRodado.set(rim, [...(porRodado.get(rim) ?? []), p]);
  }
  const rodados = [...porRodado.keys()].sort((a, b) => a - b);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-black text-navy-900">{titulo}</h1>
      <p className="mb-6 text-slate-600">
        {productos.length} modelos con precio publicado y stock real. Retiro y colocación sin cargo en el local.
      </p>
      {rodados.map((rim) => (
        <section key={rim} className="mb-6">
          <h2 className="mb-2 text-xl font-black text-navy-900">Rodado {rim}</h2>
          <ul className="grid gap-x-8 gap-y-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {(porRodado.get(rim) ?? [])
              .slice()
              .sort((a, b) => a.price - b.price)
              .map((p) => (
                <li key={p.id}>
                  <a href={`/productos/${p.slug}`} className="hover:underline">
                    {p.model}
                  </a>{" "}
                  <span className="font-bold">${p.price.toLocaleString("es-AR")}</span>
                  {p.enStock ? "" : " · consultar stock"}
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
