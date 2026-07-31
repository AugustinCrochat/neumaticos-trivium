import type { MetadataRoute } from "next";
import { SITE_URL, BRANCHES, DEFAULT_BRANCH_ID, TIRE_RIMS } from "@/lib/config";
import { BRANDS, SERVICES, BLOG_POSTS } from "@/lib/data";
import { LOCALIDADES } from "@/lib/localidades";
import { getProductosDesdePOS, getAccesoriosDesdePOS } from "@/lib/pos-api";
import {
  MEDIDAS_PRIORITARIAS,
  rimSlug,
  sizeSlug,
  sizesFromCatalog,
} from "@/lib/tire-sizes";

/**
 * El sitemap se regenera cada hora. Es un Route Handler cacheado, así que sin
 * este revalidate quedaría congelado con el catálogo del build y los productos
 * nuevos no se descubrirían hasta el próximo deploy.
 */
export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

function url(
  path: string,
  priority: number,
  changeFrequency: Entry["changeFrequency"],
  lastModified: Date | string = new Date()
): Entry {
  return { url: `${SITE_URL}${path}`, lastModified, changeFrequency, priority };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Se usa el catálogo de la sucursal por defecto a propósito: el sitemap es
  // único para todo el sitio y no puede depender de la cookie de sucursal del
  // visitante (los crawlers no la mandan).
  const [productos, accesorios] = await Promise.all([
    getProductosDesdePOS(DEFAULT_BRANCH_ID),
    getAccesoriosDesdePOS(DEFAULT_BRANCH_ID),
  ]);

  const estaticas: Entry[] = [
    url("", 1, "daily"),
    url("/catalogo", 0.9, "daily"),
    url("/neumaticos", 0.9, "weekly"),
    url("/neumaticos-en", 0.7, "monthly"),
    url("/marcas", 0.7, "weekly"),
    url("/calculadora-equivalencia-neumaticos", 0.8, "monthly"),
    url("/servicios", 0.7, "monthly"),
    url("/sucursales", 0.8, "monthly"),
    url("/tuercas-antirrobo", 0.7, "weekly"),
    url("/contacto", 0.5, "yearly"),
    url("/blog", 0.6, "weekly"),
    // Legales: prioridad baja pero indexables. Google las usa como señal de
    // confianza del comercio (y Merchant Center las exige).
    url("/terminos", 0.2, "yearly"),
    url("/privacidad", 0.2, "yearly"),
    url("/politica-de-devoluciones", 0.3, "yearly"),
    url("/arrepentimiento", 0.3, "yearly"),
  ];

  // Medidas: las que hay en catálogo más las prioritarias del parque automotor
  // argentino, deduplicadas. Las que tienen stock pesan más.
  const medidasConStock = new Set(
    sizesFromCatalog(productos.filter((p) => p.enStock)).map((s) => sizeSlug(s.size))
  );
  const medidas = new Map<string, Entry>();
  for (const { size } of sizesFromCatalog(productos)) {
    const slug = sizeSlug(size);
    medidas.set(slug, url(`/neumaticos/${slug}`, medidasConStock.has(slug) ? 0.9 : 0.6, "daily"));
  }
  for (const size of MEDIDAS_PRIORITARIAS) {
    const slug = sizeSlug(size);
    if (!medidas.has(slug)) medidas.set(slug, url(`/neumaticos/${slug}`, 0.6, "weekly"));
  }

  const rodados: Entry[] = TIRE_RIMS.map((rim) =>
    url(`/neumaticos/${rimSlug(rim)}`, 0.7, "weekly")
  );

  const localidades: Entry[] = LOCALIDADES.map((l) =>
    url(`/neumaticos-en/${l.slug}`, l.esCabecera ? 0.9 : 0.7, "monthly")
  );

  const sucursales: Entry[] = BRANCHES.map((b) =>
    url(`/sucursales/${b.id}`, 0.9, "monthly")
  );

  // Sólo marcas con productos: una página de marca vacía es contenido delgado y
  // manda al crawler a una URL sin valor.
  const marcasConProductos = new Set(productos.map((p) => p.brandId));
  const marcas: Entry[] = BRANDS.filter((b) => marcasConProductos.has(b.id)).map((b) =>
    url(`/marcas/${b.id}`, 0.7, "weekly")
  );

  const servicios: Entry[] = SERVICES.map((s) => url(`/servicios/${s.id}`, 0.6, "monthly"));

  const posts: Entry[] = BLOG_POSTS.map((p) =>
    url(`/blog/${p.slug}`, 0.6, "monthly", p.date)
  );

  const fichasProducto: Entry[] = productos.map((p) =>
    url(`/productos/${p.slug}`, p.enStock ? 0.8 : 0.4, "daily")
  );

  const fichasAccesorio: Entry[] = accesorios.map((a) =>
    url(`/tuercas-antirrobo/${a.slug}`, a.enStock ? 0.6 : 0.3, "weekly")
  );

  return [
    ...estaticas,
    ...medidas.values(),
    ...rodados,
    ...localidades,
    ...sucursales,
    ...marcas,
    ...servicios,
    ...posts,
    ...fichasProducto,
    ...fichasAccesorio,
  ];
}
