import type { Accessory, TireProduct } from "./types";
import { DEFAULT_BRANCH_ID } from "./config";
import productImagesManifest from "./product-images-manifest.json";
import { getAllVehicleOptions } from "./vehicles";

const AVAILABLE_IMAGES = new Set(productImagesManifest);

// Cache en memoria a nivel de Worker/Instancia para evitar exceder límites de CPU
const memoryCache = {
  productos: new Map<string, { data: TireProduct[]; expires: number }>(),
  accesorios: new Map<string, { data: Accessory[]; expires: number }>(),
  vehiculos: new Map<string, { data: VehiculoOption[]; expires: number }>(),
  servicios: new Map<string, { data: ServicioPrecio[]; expires: number }>(),
};

const CACHE_TTLS = {
  productos: 300 * 1000,   // 5 minutos
  accesorios: 300 * 1000,  // 5 minutos
  vehiculos: 1800 * 1000,  // 30 minutos
  servicios: 300 * 1000,   // 5 minutos
};

// .trim() por si la variable de entorno se pegó con un espacio o salto de
// línea de más al cargarla en el dashboard (rompe el fetch silenciosamente).
// Base sin sucursal — cada fetch arma /{sucursal}/productos, etc. (ver
// pos-neumaticos/src/app/api/public/[sucursal]/*), para poder mostrar el
// catálogo de la sucursal que el visitante tenga elegida en vez de una fija.
// Esta URL es pública y también debe existir durante `next build`: las
// variables de `wrangler.jsonc` se inyectan al Worker en runtime, pero no al
// prerender de Workers Builds. Sin el fallback, las rutas ISR se construyen
// con listas vacías y para evitarlo habría que volverlas dinámicas (demasiado
// costoso para el límite de CPU del plan Free).
const POS_API_BASE_URL =
  process.env.POS_API_BASE_URL?.trim() || "https://pos-neumaticos.vercel.app/api/public";

type PosProducto = {
  id: string;
  codigo_tango: string | null;
  nombre: string;
  marca: string | null;
  modelo: string | null;
  precio: number;
  neumatico_ancho: number | null;
  neumatico_perfil: number | null;
  neumatico_diametro: number | null;
  es_carga: boolean;
  es_at: boolean;
  imagen_url: string | null;
  en_stock: boolean;
  stock?: number;
};

export type ServicioPrecio = {
  id: string;
  nombre: string;
  precio: number;
  grupo: string;
  codigoTango: string | null;
};

// TEMPORAL: el POS no expone este servicio por un bug al guardar
// "servicio_grupo" en /admin/productos (probablemente falta política RLS de
// UPDATE en la tabla productos — el guardado no tira error pero no persiste).
// Hardcodeado con el id real de la tabla productos del POS, confirmado con
// Augustin el 2026-07-15 ($60.000 el combo, $10.000 el balanceo por rueda).
// Sacar este fallback cuando /servicios empiece a devolverlo solo.
export const COMBO_ALINEACION_BALANCEO_AUTO: ServicioPrecio = {
  id: "767b5aad-14c3-4d34-b318-bdc7695ed502",
  nombre: "Alineación + 4 balanceos (auto)",
  precio: 60000,
  grupo: "alineacion",
  codigoTango: "2010106",
};

// Sentinel usado por ProductCard/ProductPage para mostrar el ícono
// genérico de neumático cuando no hay foto real (ver hasImage en esos componentes).
const PLACEHOLDER_IMAGE = "/images/tire-placeholder.webp";

// Arma el texto de medida con la "C" (norma ETRTO "Commercial") después del
// rodado para neumáticos de carga — ej. "205/70 R15C" vs "205/70 R15".
// Réplica de pos-neumaticos/src/lib/tire.ts (formatMedida) — si se toca acá,
// tocar allá también.
function formatMedida(ancho: number, perfil: number, diametro: number, esCarga: boolean): string {
  return `${ancho}/${perfil} R${diametro}${esCarga ? "C" : ""}`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Corrige la abreviatura "CINT" cargada en el POS por error: el nombre real es "Cinturato".
function fixModelName(modelo: string): string {
  return modelo.replace(/\s*cint/gi, " Cinturato").replace(/\s+/g, " ").trim();
}

// Correcciones de marca/modelo mal cargados en el POS. Solo afectan lo que se
// muestra y el slug de la URL: localImageFallback sigue usando marca+modelo
// crudos del POS, porque las fotos ya están guardadas con esos nombres de archivo.
function fixBrandAndModel(rawMarca: string, rawModelo: string): { marca: string; modelo: string } {
  const marcaUpper = rawMarca.trim().toUpperCase();

  // Greentour A/S está cargado bajo la marca ZMAX, pero es un modelo de
  // Grenlander (mismo fabricante, Zodo Tire Group).
  if (marcaUpper === "ZMAX" && /greentour/i.test(rawModelo)) {
    return { marca: "Grenlander", modelo: fixModelName(rawModelo) };
  }

  // "Terra Xplorer C2 A/T" quedó cargado como si fuera la marca; en realidad
  // es un modelo de Zmax. Los dos modelos cargados (TERRA X AT / TERRAX AT)
  // son el mismo producto.
  if (/terra xplorer/i.test(rawMarca)) {
    return { marca: "Zmax", modelo: "Terra Xplorer" };
  }
  
  if (marcaUpper === "ZMAX") {
    if (/terra xplorer/i.test(rawModelo)) {
      return { marca: "Zmax", modelo: "Terra Xplorer" };
    }
    if (/landgema/i.test(rawModelo)) {
      return { marca: "Zmax", modelo: "Landgema" };
    }
  }

  return { marca: rawMarca, modelo: fixModelName(rawModelo) };
}

// Mientras el POS no tenga imagen_url cargada, usamos la foto que ya subimos
// nosotros a /public/images/products (ver scripts/add-tire-photo*.mjs), buscando
// por marca+modelo+medida original del POS (sin la corrección de fixBrandAndModel).
// El manifiesto se genera en build-time (scripts/lib/generate-image-manifest.mjs)
// en vez de chequear con fs.existsSync en runtime, que no existe en Cloudflare Workers.
function localImageFallback(p: PosProducto): string | null {
  const brandSlug = slugify(p.marca || "");
  const modelSlug = slugify(p.modelo || "");
  const filename = `${brandSlug}-${modelSlug}-${p.neumatico_ancho}-${p.neumatico_perfil}-r${p.neumatico_diametro}.webp`;
  return AVAILABLE_IMAGES.has(filename) ? `/images/products/${filename}` : null;
}

// El nombre cargado en el POS suele terminar en "<carga><velocidad>", ej.
// "PIRELLI POWERGY 225/45 R17 91W" -> carga 91, velocidad W. No siempre está.
const LOAD_SPEED_SUFFIX = /(\d{2,3})([A-Z]{1,2})\s*$/;

function parseLoadSpeed(nombre: string): { loadIndex?: string; speedRating?: string } {
  const match = nombre.trim().match(LOAD_SPEED_SUFFIX);
  if (!match) return {};
  return { loadIndex: match[1], speedRating: match[2] };
}

function toTireProduct(p: PosProducto): TireProduct | null {
  if (!p.neumatico_ancho || !p.neumatico_perfil || !p.neumatico_diametro) {
    // No es un neumático con medida completa — no se puede mostrar en el catálogo de la web
    return null;
  }
  const { marca, modelo } = fixBrandAndModel(p.marca || "", p.modelo || "");
  const { loadIndex, speedRating } = parseLoadSpeed(p.nombre || "");
  const brandId = slugify(marca) || "otras-marcas";
  const medida = formatMedida(p.neumatico_ancho, p.neumatico_perfil, p.neumatico_diametro, p.es_carga);
  // "A/T" en el nombre solo si marca+modelo no lo traen ya — fixBrandAndModel
  // le saca el "A/T" al modelo "Terra Xplorer" (ver arriba), así que sin esto
  // esos productos mostrarían un nombre que no dice que son todo terreno.
  const atSuffix = p.es_at && !/\bA\/T\b|\bAT\b/i.test(`${marca} ${modelo}`) ? " A/T" : "";
  const model = `${medida} ${marca} ${modelo}${p.es_carga ? " De Carga" : ""}${atSuffix}`.trim().replace(/\s+/g, " ");
  const loadSpeedSlug = loadIndex && speedRating ? `-${loadIndex}${speedRating}` : "";
  // La "r{diametro}c" tiene que coincidir con el slug que arma buildProductLink
  // en pos-neumaticos/src/lib/whatsapp-catalog-sync.ts — si se toca acá, tocar allá.
  const rodadoSlug = `r${p.neumatico_diametro}${p.es_carga ? "c" : ""}`;
  const slug = slugify(`${marca}-${modelo}-${p.neumatico_ancho}-${p.neumatico_perfil}-${rodadoSlug}${loadSpeedSlug}`);

  return {
    id: p.id,
    brand: marca,
    brandId,
    model,
    size: { width: p.neumatico_ancho, profile: p.neumatico_perfil, rim: p.neumatico_diametro },
    // El POS no distingue tipo de vehículo todavía — se muestra para ambos por defecto.
    vehicleType: ["auto", "camioneta"],
    price: p.precio,
    imageUrl: p.imagen_url || localImageFallback(p) || PLACEHOLDER_IMAGE,
    tags: [],
    isEconomic: false,
    isImported: true,
    isCarga: p.es_carga,
    isAT: p.es_at,
    slug,
    enStock: p.en_stock,
    stock: p.stock,
    loadIndex,
    speedRating,
  };
}

/**
 * `fresh: true` saltea las dos capas de caché (la de memoria del Worker y la
 * del fetch) para las páginas cuyo único valor es que el número de unidades
 * esté al día — hoy /stock/[medida], que es la que le mandamos al cliente por
 * WhatsApp. En el resto de las páginas NO usarlo: son las que se sirven
 * cacheadas y el catálogo entero son cientos de productos.
 */
export async function getProductosDesdePOS(
  sucursalSlug: string = DEFAULT_BRANCH_ID,
  opciones: { fresh?: boolean } = {}
): Promise<TireProduct[]> {
  const cacheKey = sucursalSlug;
  const now = Date.now();
  const cached = memoryCache.productos.get(cacheKey);
  if (cached && cached.expires > now && !opciones.fresh) {
    return cached.data;
  }

  if (!POS_API_BASE_URL) {
    console.error("[pos-api] Falta la variable de entorno POS_API_BASE_URL");
    return cached ? cached.data : [];
  }
  try {
    // "force-cache" sin revalidate, acá y en los demás fetches al POS: los
    // datos se congelan en el build y se refrescan con el redeploy programado
    // (ver .github/workflows/deploy.yml). No volver a next.revalidate — un solo
    // fetch con revalidate reactiva la cola ISR de OpenNext, que necesita el
    // Durable Object que agotaba el límite gratuito de Cloudflare.
    const res = await fetch(`${POS_API_BASE_URL}/${sucursalSlug}/productos`, {
      ...(opciones.fresh ? { cache: "no-store" as const } : { cache: "force-cache" as const }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`[pos-api] Error ${res.status} al obtener productos del POS`);
      return cached ? cached.data : [];
    }
    const data = (await res.json()) as { productos: PosProducto[] };
    const mapped = data.productos.map(toTireProduct).filter((p): p is TireProduct => p !== null);
    
    memoryCache.productos.set(cacheKey, {
      data: mapped,
      expires: now + CACHE_TTLS.productos,
    });
    return mapped;
  } catch (err) {
    console.error("[pos-api] Error de red al obtener productos del POS:", err);
    return cached ? cached.data : [];
  }
}

type PosAccesorio = {
  id: string;
  codigo_tango: string | null;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagen_url: string | null;
  en_stock: boolean;
  stock: number;
};

export async function getAccesoriosDesdePOS(sucursalSlug: string = DEFAULT_BRANCH_ID): Promise<Accessory[]> {
  const cacheKey = sucursalSlug;
  const now = Date.now();
  const cached = memoryCache.accesorios.get(cacheKey);
  if (cached && cached.expires > now) {
    return cached.data;
  }

  if (!POS_API_BASE_URL) {
    console.error("[pos-api] Falta la variable de entorno POS_API_BASE_URL");
    return cached ? cached.data : [];
  }
  try {
    const res = await fetch(`${POS_API_BASE_URL}/${sucursalSlug}/accesorios`, { cache: "force-cache", signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      console.error(`[pos-api] Error ${res.status} al obtener accesorios del POS`);
      return cached ? cached.data : [];
    }
    const data = (await res.json()) as { accesorios: PosAccesorio[] };
    const mapped = data.accesorios.map((a) => ({
      id: a.id,
      codigoTango: a.codigo_tango,
      nombre: a.nombre,
      descripcion: a.descripcion,
      price: a.precio,
      imageUrl: a.imagen_url,
      enStock: a.en_stock,
      stock: a.stock,
      slug: slugify(a.nombre),
    }));

    memoryCache.accesorios.set(cacheKey, {
      data: mapped,
      expires: now + CACHE_TTLS.accesorios,
    });
    return mapped;
  } catch (err) {
    console.error("[pos-api] Error de red al obtener accesorios del POS:", err);
    return cached ? cached.data : [];
  }
}

export type VehiculoOption = { marca: string; modelo: string; label: string };

export async function getVehiculosDesdePOS(sucursalSlug: string = DEFAULT_BRANCH_ID): Promise<VehiculoOption[]> {
  const cacheKey = sucursalSlug;
  const now = Date.now();
  const cached = memoryCache.vehiculos.get(cacheKey);
  if (cached && cached.expires > now) {
    return cached.data;
  }

  const staticVehicles = getAllVehicleOptions();
  if (!POS_API_BASE_URL) {
    return staticVehicles;
  }
  try {
    const res = await fetch(`${POS_API_BASE_URL}/${sucursalSlug}/vehiculos`, { cache: "force-cache", signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      console.error(`[pos-api] Error ${res.status} al obtener vehículos del POS, usando base local`);
      return cached ? cached.data : staticVehicles;
    }
    const data = (await res.json()) as { vehiculos: VehiculoOption[] };
    const posVehiculos = data.vehiculos || [];

    const mergedMap = new Map<string, VehiculoOption>();
    for (const v of staticVehicles) {
      mergedMap.set(`${v.marca.toLowerCase()}-${v.modelo.toLowerCase()}`, v);
    }
    for (const v of posVehiculos) {
      const key = `${v.marca.toLowerCase()}-${v.modelo.toLowerCase()}`;
      if (!mergedMap.has(key)) {
        mergedMap.set(key, v);
      }
    }

    // Optimización: ordenamiento rápido con string compare directo
    const sorted = Array.from(mergedMap.values()).sort((a, b) => {
      const la = a.label;
      const lb = b.label;
      return la > lb ? 1 : la < lb ? -1 : 0;
    });

    memoryCache.vehiculos.set(cacheKey, {
      data: sorted,
      expires: now + CACHE_TTLS.vehiculos,
    });
    return sorted;
  } catch (err) {
    console.error("[pos-api] Error de red al obtener vehículos del POS, usando base local:", err);
    return cached ? cached.data : staticVehicles;
  }
}

export async function getServiciosPrecios(grupo?: string, sucursalSlug: string = DEFAULT_BRANCH_ID): Promise<ServicioPrecio[]> {
  const cacheKey = `${sucursalSlug}-${grupo || "all"}`;
  const now = Date.now();
  const cached = memoryCache.servicios.get(cacheKey);
  if (cached && cached.expires > now) {
    return cached.data;
  }

  if (!POS_API_BASE_URL) {
    console.error("[pos-api] Falta la variable de entorno POS_API_BASE_URL");
    return cached ? cached.data : [];
  }
  try {
    const res = await fetch(`${POS_API_BASE_URL}/${sucursalSlug}/servicios`, { cache: "force-cache", signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      console.error(`[pos-api] Error ${res.status} al obtener servicios del POS`);
      return cached ? cached.data : [];
    }
    const data = (await res.json()) as {
      servicios: { id: string; nombre: string; precio: number; servicio_grupo: string; codigo_tango?: string | null }[];
    };
    const servicios = data.servicios.map((s) => ({
      id: s.id,
      nombre: s.nombre,
      precio: s.precio,
      grupo: s.servicio_grupo,
      codigoTango: s.codigo_tango ?? null,
    }));
    
    const result = grupo ? servicios.filter((s) => s.grupo === grupo) : servicios;
    
    memoryCache.servicios.set(cacheKey, {
      data: result,
      expires: now + CACHE_TTLS.servicios,
    });
    return result;
  } catch (err) {
    console.error("[pos-api] Error de red al obtener servicios del POS:", err);
    return cached ? cached.data : [];
  }
}
