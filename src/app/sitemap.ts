import type { MetadataRoute } from "next";
import { SITE_URL, BRANCHES, DEFAULT_BRANCH_ID, TIRE_RIMS } from "@/lib/config";
import { BRANDS, SERVICES, BLOG_POSTS } from "@/lib/data";
import { ROTACION_SERVICE } from "@/lib/servicios-seo";
import { LOCALIDADES } from "@/lib/localidades";
import { cargaSlug } from "@/lib/carga";
import { LOAD_SPEED_CODES } from "@/lib/load-speed";
import { POPULAR_VEHICLES, vehicleSlug } from "@/lib/vehicles";
import { getProductosDesdePOS, getAccesoriosDesdePOS } from "@/lib/pos-api";
import {
  MEDIDAS_PRIORITARIAS,
  rimSlug,
  sizeSlug,
  sizesFromCatalog,
} from "@/lib/tire-sizes";

// El sitemap sale congelado con el catálogo del build: los productos nuevos se
// descubren en el próximo deploy (hay uno programado cada 2 horas hábiles, ver
// .github/workflows/deploy.yml). Antes tenía `revalidate = 3600`, pero eso
// necesitaba la cola ISR con Durable Object que agotaba el free tier.

type Entry = MetadataRoute.Sitemap[number];

/**
 * Una URL del sitemap.
 *
 * `lastModified` es opcional y se omite salvo que sepamos la fecha real de
 * modificación. Antes se ponía `new Date()` por defecto, con lo cual cada
 * regeneración declaraba que las 178 URLs habían cambiado en ese instante.
 * Google compara ese valor contra lo que ve al rastrear y, si no coincide,
 * deja de creerle al lastmod de todo el sitemap — justo la señal que sirve
 * para pedir un recrawl. Mejor no decir nada que mentir.
 */
function url(
  path: string,
  priority: number,
  changeFrequency: Entry["changeFrequency"],
  lastModified?: Date | string,
  images?: string[]
): Entry {
  return {
    url: `${SITE_URL}${path}`,
    ...(lastModified ? { lastModified } : {}),
    ...(images ? { images } : {}),
    changeFrequency,
    priority,
  };
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
    url("/neumaticos/ht", 0.7, "weekly"),
    url("/neumaticos/at", 0.7, "weekly"),
    url("/neumaticos/carga", 0.7, "weekly"),
    url("/neumaticos-baratos", 0.9, "daily"),
    url("/neumaticos-en", 0.7, "monthly"),
    url("/marcas", 0.7, "weekly"),
    url("/vehiculos", 0.8, "weekly"),
    ...POPULAR_VEHICLES.map((v) => url(`/vehiculos/${vehicleSlug(v.brand, v.model)}`, 0.8, "weekly")),
    url("/calculadora-equivalencia-neumaticos", 0.8, "monthly"),
    url("/cotizador", 0.7, "monthly"),
    url("/servicios", 0.7, "monthly"),
    url("/sucursales", 0.8, "monthly"),
    url("/tuercas-antirrobo", 0.7, "weekly"),
    url("/contacto", 0.5, "yearly"),
    url("/blog", 0.6, "weekly"),
    ...LOAD_SPEED_CODES.map((code) =>
      url(`/indice-carga-velocidad/${code.toLowerCase()}`, 0.6, "monthly")
    ),
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

  // Landings de medida C: una por medida de carga con producto en catálogo.
  const medidasCarga: Entry[] = [
    ...new Set(productos.filter((p) => p.isCarga).map((p) => cargaSlug(p.size))),
  ].map((slug) => url(`/neumaticos/carga/${slug}`, 0.8, "daily"));

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

  const servicios: Entry[] = [...SERVICES, ROTACION_SERVICE].map((s) => url(`/servicios/${s.id}`, 0.7, "monthly"));

  // Imágenes propias que queremos que se descubran en la búsqueda de imágenes.
  const POST_IMAGES: Record<string, string[]> = {
    "como-leer-medida-neumatico": [`${SITE_URL}/como-leer-medida-neumatico-205-55-r16.webp`],
    "neumaticos-de-marca-vs-importados-cual-conviene": [`${SITE_URL}/marca-premium-vs-alternativa-homologada-neumaticos.webp`],
  };
  const posts: Entry[] = BLOG_POSTS.map((p) =>
    url(`/blog/${p.slug}`, 0.6, "monthly", p.date, POST_IMAGES[p.slug])
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
    ...medidasCarga,
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
