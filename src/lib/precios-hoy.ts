import type { TireProduct } from "./types";
import type { PreciosTaller } from "./servicios-seo";

export const money = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

const minimo = (ps: TireProduct[]) => (ps.length ? Math.min(...ps.map((p) => p.price)) : null);

/**
 * Precio "desde" de la página a la que apunta un enlace, con el catálogo y los
 * precios del taller del build. Sirve para que un atajo del blog diga
 * "Rodado 15 · desde $82.000" en vez de sólo "Rodado 15": el número es lo que
 * hace que alguien que vino a leer pase a mirar productos. Devuelve null si la
 * ruta no tiene un precio claro o no hay stock (el atajo se muestra sin número).
 */
export function precioDesde(href: string, productos: TireProduct[], taller: PreciosTaller): number | null {
  const stock = productos.filter((p) => p.enStock !== false);
  const calle = stock.filter((p) => !p.isCarga);
  if (href.startsWith("/servicios")) return taller.comboAuto ?? null;
  const medida = href.match(/^\/neumaticos\/(\d{3})-(\d{2})-r(\d{2})$/);
  if (medida) {
    const [w, p, r] = medida.slice(1).map(Number);
    return minimo(calle.filter((x) => x.size.width === w && x.size.profile === p && x.size.rim === r));
  }
  const rodado = href.match(/^\/neumaticos\/rodado-(\d{2})$/);
  if (rodado) return minimo(calle.filter((x) => x.size.rim === Number(rodado[1])));
  if (href === "/neumaticos/at") return minimo(stock.filter((x) => x.isAT));
  if (href === "/neumaticos/ht") return minimo(calle.filter((x) => !x.isAT));
  if (href === "/neumaticos/carga") return minimo(stock.filter((x) => x.isCarga));
  const marca = href.match(/^\/marcas\/([a-z0-9-]+)$/);
  if (marca) return minimo(stock.filter((x) => x.brandId === marca[1]));
  if (href === "/catalogo") return minimo(calle);
  return null;
}

/** ¿La nota habla de camionetas/SUV (por el slug)? Ahí el precio del combo que se muestra es el de camioneta. */
export const notaDeCamioneta = (slug: string) =>
  /camioneta|suv|pick-?up|4x4|awd|hilux|amarok|ranger|s10|frontier|toro|tracker|duster|ecosport|kicks|territory|corolla-cross|hr-v|crv|cr-v|rav4|tiguan|taos|t-cross|nivus/i.test(slug);

/**
 * ¿La nota habla de utilitarios, furgones o neumáticos C (por el slug)? Ahí la
 * vidriera y la columna de precios muestran cubiertas de carga en vez de las de
 * auto, que no le sirven a quien tiene un furgón.
 */
export const notaDeCarga = (slug: string) => /utilitario|furgon|reparto|neumaticos?-c(-|$)|cubiertas-de-carga|carga-simple/i.test(slug);

/** Precio más bajo con stock de cada medida de carga, de menor a mayor rodado y ancho. */
export function preciosAnclaCarga(productos: TireProduct[], max = 5) {
  const porMedida = new Map<string, { size: TireProduct["size"]; precio: number }>();
  for (const p of productos) {
    if (!p.isCarga || p.enStock === false) continue;
    const k = `${p.size.width}-${p.size.profile}-${p.size.rim}`;
    const prev = porMedida.get(k);
    if (!prev || p.price < prev.precio) porMedida.set(k, { size: p.size, precio: p.price });
  }
  return [...porMedida.values()].sort((a, b) => a.size.rim - b.size.rim || a.size.width - b.size.width).slice(0, max);
}
