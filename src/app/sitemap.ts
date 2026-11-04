import type { MetadataRoute } from "next";
import { SITE_URL, BRANCHES, DEFAULT_BRANCH_ID, TIRE_RIMS } from "@/lib/config";
import { BRANDS, SERVICES, BLOG_POSTS } from "@/lib/data";
import { COMBO_SERVICE, EXTRA_SERVICES } from "@/lib/servicios-seo";
import { LOCALIDADES } from "@/lib/localidades";
import { OTRAS_MARCAS } from "@/lib/marcas-chinas";
import { TUERCA_FOTO_LLAVES, TUERCA_FOTO_TALLER, TUERCA_FOTO_TALLER_2, tuercaCardPath } from "@/lib/tuercas-fotos";
import { MARCAS_PREMIUM } from "@/lib/marcas-premium";
import { cargaSlug } from "@/lib/carga";
import { LOAD_SPEED_CODES } from "@/lib/load-speed";
import { POPULAR_VEHICLES, vehicleSlug } from "@/lib/vehicles";
import { vehicleCardUrl } from "@/lib/vehicle-photos";
import { medidasConComparativa } from "@/lib/comparativas";
import { marcaSlug } from "@/lib/marcas-autos";
import { productImagePaths } from "@/lib/image-seo";
import { TOOLS, toolPath } from "@/lib/tools";
import { blogMeta } from "@/lib/blog-meta";
import { getProductosDesdePOS, getAccesoriosDesdePOS } from "@/lib/pos-api";
import {
  MEDIDAS_PRIORITARIAS,
  rimSlug,
  anchosYPerfiles,
  widthSlug,
  profileSlug,
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

  const abs = (src: string) => (src.startsWith("http") ? src : `${SITE_URL}${src}`);

  const estaticas: Entry[] = [
    url("", 1, "daily", undefined, [abs("/images/branches/arguello-fachada.webp"), abs("/images/local/fachada-local-neumaticos-trivium-cordoba.webp")]),
    url("/catalogo", 0.9, "daily"),
    url("/neumaticos", 0.9, "weekly"),
    url("/neumaticos/ht", 0.7, "weekly"),
    url("/neumaticos/at", 0.7, "weekly"),
    url("/neumaticos/carga", 0.7, "weekly", undefined, [abs("/images/local/cubierta-de-carga-nueva-colocada-en-fiat-ducato-trivium.webp"), abs("/images/local/tecnico-colocando-rueda-de-carga-en-fiat-ducato-trivium.webp"), abs("/images/local/fiat-ducato-con-cubiertas-de-carga-nuevas-en-el-taller-trivium.webp")]),
    url("/neumaticos-baratos", 0.9, "daily"),
    url("/opiniones-y-comparativas", 0.8, "weekly"),
    url("/neumaticos-para-remises-taxis-y-uber", 0.9, "daily", undefined, [abs("/images/local/remis-cambio-de-cuatro-neumaticos-con-alineacion-y-balanceo-trivium-cordoba.webp"), abs("/images/local/taxi-entrando-al-local-neumaticos-trivium-cordoba.webp"), abs("/images/local/remis-en-el-taller-con-balanceadora-y-neumaticos-trivium-cordoba.webp"), abs("/images/local/taxi-rueda-delantera-en-el-taller-neumaticos-trivium-cordoba.webp"), abs("/images/local/remis-chevrolet-classic-cambio-de-neumaticos-y-balanceo-trivium-cordoba.webp")]),
    url("/neumaticos-en", 0.7, "monthly"),
    url("/cordoba", 0.9, "monthly"),
    url("/buenos-aires", 0.9, "monthly"),
    url("/cordoba/catalogo", 0.8, "weekly"),
    url("/buenos-aires/catalogo", 0.7, "weekly"),
    url("/marcas", 0.7, "weekly"),
    url("/marcas-de-neumaticos-chinos", 0.8, "weekly"),
    url("/alternativas", 0.8, "weekly"),
    ...MARCAS_PREMIUM.map((m) => url(`/alternativas/${m.slug}`, 0.7, "weekly")),
    ...OTRAS_MARCAS.map((m) => url(`/marcas-de-neumaticos-chinos/${m.slug}`, 0.7, "weekly")),
    url("/vehiculos", 0.8, "weekly"),
    url("/vehiculos/todos", 0.7, "weekly"),
    url("/vehiculos/mas-atendidos", 0.7, "weekly"),
    ...[...new Set(POPULAR_VEHICLES.map((v) => v.brand))].map((b) => url(`/vehiculos/marca/${marcaSlug(b)}`, 0.7, "weekly")),
    ...POPULAR_VEHICLES.map((v) => {
      const slug = vehicleSlug(v.brand, v.model);
      const card = vehicleCardUrl(slug);
      return url(`/vehiculos/${slug}`, 0.8, "weekly", undefined, card ? [card, abs(`/images/vehiculos/${slug}.webp`)] : undefined);
    }),
    url("/calculadora-equivalencia-neumaticos", 0.8, "monthly"),
    url("/comprar-neumaticos-online-o-en-el-local", 0.7, "monthly"),
    url("/cotizador", 0.7, "monthly"),
    url("/buscador", 0.8, "monthly"),
    url("/neumaticos-por-patente", 0.8, "monthly"),
    url("/herramientas", 0.7, "monthly"),
    url("/utqg", 0.8, "weekly"),
    ...TOOLS.map((t) => url(toolPath(t.slug), 0.7, "monthly")),
    url("/servicios", 0.7, "monthly"),
    url("/sucursales", 0.8, "monthly"),
    url("/mapa-del-sitio", 0.3, "monthly"),
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
    url("/garantia-neumaticos", 0.6, "monthly"),
    url("/sobre-trivium", 0.5, "monthly"),
    url("/politica-de-devoluciones", 0.3, "yearly"),
    url("/arrepentimiento", 0.3, "yearly"),
  ];

  // Medidas: las que hay en catálogo más las prioritarias del parque automotor
  // argentino, deduplicadas. Las que tienen stock pesan más.
  const medidasConStock = new Set(
    sizesFromCatalog(productos.filter((p) => p.enStock)).map((s) => sizeSlug(s.size))
  );
  const medidas = new Map<string, Entry>();
  // Rodados decimales (17.5 de camión) no tienen landing de medida: son de carga.
  for (const { size } of sizesFromCatalog(productos)) {
    if (!Number.isInteger(size.rim)) continue;
    const slug = sizeSlug(size);
    medidas.set(slug, url(`/neumaticos/${slug}`, medidasConStock.has(slug) ? 0.9 : 0.6, "daily"));
  }
  for (const size of MEDIDAS_PRIORITARIAS) {
    const slug = sizeSlug(size);
    if (!medidas.has(slug)) medidas.set(slug, url(`/neumaticos/${slug}`, 0.6, "weekly"));
  }

  // Landings de medida C: una por medida de carga con producto en catálogo.
  const medidasCarga: Entry[] = [
    ...new Set(productos.filter((p) => p.isCarga && Number.isInteger(p.size.rim)).map((p) => cargaSlug(p.size))),
  ].map((slug) => url(`/neumaticos/carga/${slug}`, 0.8, "daily"));

  const rodados: Entry[] = TIRE_RIMS.map((rim) =>
    url(`/neumaticos/${rimSlug(rim)}`, 0.7, "weekly")
  );

  const { anchos, perfiles } = anchosYPerfiles(productos);
  const ejes: Entry[] = [
    ...anchos.map((a) => url(`/neumaticos/${widthSlug(a)}`, 0.6, "weekly")),
    ...perfiles.map((pf) => url(`/neumaticos/${profileSlug(pf)}`, 0.6, "weekly")),
  ];

  const localidades: Entry[] = LOCALIDADES.map((l) =>
    url(`/neumaticos-en/${l.slug}`, l.esCabecera ? 0.9 : 0.7, "monthly")
  );

  const sucursales: Entry[] = BRANCHES.map((b) =>
    url(`/sucursales/${b.id}`, 0.9, "monthly", undefined, b.id === "arguello" ? [abs("/images/branches/arguello-fachada.webp")] : undefined)
  );

  // Sólo marcas con productos: una página de marca vacía es contenido delgado y
  // manda al crawler a una URL sin valor.
  const marcasConProductos = new Set(productos.map((p) => p.brandId));
  const marcas: Entry[] = BRANDS.filter((b) => marcasConProductos.has(b.id)).map((b) =>
    url(`/marcas/${b.id}`, 0.7, "weekly")
  );

  // Fotos propias del taller, por servicio.
  const SERVICE_IMAGES: Record<string, string[]> = {
    alineacion: ["/images/servicios/alineacion.webp", "/images/local/tecnicos-alineando-auto-elevador-gomeria-trivium-cordoba.webp", "/images/local/alineadora-geoliner-630-taller-neumaticos-trivium-cordoba.webp", "/images/local/alineadora-3d-hofmann-geoliner-630-con-target-en-la-rueda-trivium-cordoba.webp", "/images/local/tecnico-colocando-target-de-alineacion-3d-en-auto-trivium-cordoba.webp", "/images/local/alineacion-3d-de-auto-rojo-target-en-la-rueda-trivium-cordoba.webp"],
    balanceo: ["/images/servicios/balanceo.webp", "/images/local/tecnico-balanceando-rueda-balanceadora-trivium-cordoba.webp", "/images/local/balanceadora-hofmann-geodyna-7800p-balanceando-rueda-de-camioneta-trivium-cordoba.webp"],
    "combo-alineado-y-balanceado": ["/images/servicios/alineacion.webp", "/images/local/alineadora-3d-hofmann-geoliner-630-con-target-en-la-rueda-trivium-cordoba.webp", "/images/local/balanceadora-hofmann-geodyna-7800p-balanceando-rueda-de-camioneta-trivium-cordoba.webp"],
    montaje: ["/images/servicios/arme-desarme.webp", "/images/local/cambio-de-cubiertas-en-camioneta-pickup-con-balanceadora-hofmann-trivium-cordoba.webp"],
    "reparacion-de-pinchaduras": ["/images/local/taxi-en-el-taller-neumaticos-trivium-cordoba.webp"],
    "tuercas-de-seguridad": ["/images/local/tuerca-antirrobo-de-seguridad-en-llanta-de-aleacion-trivium-cordoba.webp", "/images/local/tuerca-antirrobo-en-llanta-de-ford-con-cubierta-grenlander-kingpro-trivium-cordoba.webp", "/images/local/cubierta-perfil-bajo-grenlander-colocada-neumaticos-trivium.webp"],
    "rotacion-de-ruedas": ["/images/local/rotacion-de-neumaticos-pirelli-rueda-desmontada-trivium.webp"],
  };
  const servicios: Entry[] = [...SERVICES, COMBO_SERVICE, ...EXTRA_SERVICES].map((s) => url(`/servicios/${s.id}`, 0.7, "monthly", undefined, SERVICE_IMAGES[s.id]?.map(abs)));

  // Imágenes propias que queremos que se descubran en la búsqueda de imágenes.
  const POST_IMAGES: Record<string, string[]> = {
    "como-leer-medida-neumatico": [`${SITE_URL}/como-leer-medida-neumatico-205-55-r16.webp`],
    "neumaticos-de-marca-vs-importados-cual-conviene": [`${SITE_URL}/marca-premium-vs-alternativa-homologada-neumaticos.webp`],
  };
  const posts: Entry[] = BLOG_POSTS.map((p) =>
    url(`/blog/${p.slug}`, 0.6, "monthly", p.date, [
      ...new Set([...(POST_IMAGES[p.slug] ?? []), abs(blogMeta(p.slug).cover.src), abs(blogMeta(p.slug).figure.src)]),
    ])
  );

  const fichasProducto: Entry[] = productos.flatMap((p) => [
    url(`/productos/${p.slug}`, p.enStock ? 0.8 : 0.4, "daily", undefined, productImagePaths(p).map(abs)),
  ]);

  const comparativas: Entry[] = (await medidasConComparativa()).map((m) => url(`/comparativas/${m.slug}`, 0.7, "weekly"));

  const fichasAccesorio: Entry[] = accesorios.map((a) =>
    url(`/tuercas-antirrobo/${a.slug}`, a.enStock ? 0.6 : 0.3, "weekly", undefined, [
      ...(a.imageUrl ? [abs(a.imageUrl)] : []),
      ...(tuercaCardPath(a.codigoTango, a.slug) ? [abs(tuercaCardPath(a.codigoTango, a.slug)!)] : []),
      abs(TUERCA_FOTO_LLAVES.src),
      abs(TUERCA_FOTO_TALLER.src),
      abs(TUERCA_FOTO_TALLER_2.src),
    ])
  );

  return [
    ...estaticas,
    ...comparativas,
    ...medidas.values(),
    ...medidasCarga,
    ...rodados,
    ...ejes,
    ...localidades,
    ...sucursales,
    ...marcas,
    ...servicios,
    ...posts,
    ...fichasProducto,
    ...fichasAccesorio,
  ];
}
