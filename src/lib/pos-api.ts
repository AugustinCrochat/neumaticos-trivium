import type { Accessory, TireProduct } from "./types";
import { DEFAULT_BRANCH_ID } from "./config";
import productImagesManifest from "./product-images-manifest.json";

const AVAILABLE_IMAGES = new Set(productImagesManifest);

// .trim() por si la variable de entorno se pegó con un espacio o salto de
// línea de más al cargarla en el dashboard (rompe el fetch silenciosamente).
// Base sin sucursal — cada fetch arma /{sucursal}/productos, etc. (ver
// pos-neumaticos/src/app/api/public/[sucursal]/*), para poder mostrar el
// catálogo de la sucursal que el visitante tenga elegida en vez de una fija.
const POS_API_BASE_URL = process.env.POS_API_BASE_URL?.trim();

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
  const model = `${medida} ${marca} ${modelo}`.trim().replace(/\s+/g, " ");
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
    slug,
    enStock: p.en_stock,
    stock: p.stock,
    loadIndex,
    speedRating,
  };
}

export async function getProductosDesdePOS(sucursalSlug: string = DEFAULT_BRANCH_ID): Promise<TireProduct[]> {
  if (!POS_API_BASE_URL) {
    console.error("[pos-api] Falta la variable de entorno POS_API_BASE_URL");
    return [];
  }
  try {
    // Sin timeout propio, un fetch colgado en Workers se lleva el request
    // entero hasta que Cloudflare mata la instancia ("exceeded resource
    // limits"). El POS a veces tarda o no responde bajo tráfico.
    const res = await fetch(`${POS_API_BASE_URL}/${sucursalSlug}/productos`, { next: { revalidate: 300 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      console.error(`[pos-api] Error ${res.status} al obtener productos del POS`);
      return [];
    }
    const data = (await res.json()) as { productos: PosProducto[] };
    return data.productos.map(toTireProduct).filter((p): p is TireProduct => p !== null);
  } catch (err) {
    console.error("[pos-api] Error de red al obtener productos del POS:", err);
    return [];
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
  if (!POS_API_BASE_URL) {
    console.error("[pos-api] Falta la variable de entorno POS_API_BASE_URL");
    return [];
  }
  try {
    const res = await fetch(`${POS_API_BASE_URL}/${sucursalSlug}/accesorios`, { next: { revalidate: 300 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      console.error(`[pos-api] Error ${res.status} al obtener accesorios del POS`);
      return [];
    }
    const data = (await res.json()) as { accesorios: PosAccesorio[] };
    return data.accesorios.map((a) => ({
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
  } catch (err) {
    console.error("[pos-api] Error de red al obtener accesorios del POS:", err);
    return [];
  }
}

export type VehiculoOption = { marca: string; modelo: string; label: string };

export async function getVehiculosDesdePOS(sucursalSlug: string = DEFAULT_BRANCH_ID): Promise<VehiculoOption[]> {
  if (!POS_API_BASE_URL) {
    console.error("[pos-api] Falta la variable de entorno POS_API_BASE_URL");
    return [];
  }
  try {
    const res = await fetch(`${POS_API_BASE_URL}/${sucursalSlug}/vehiculos`, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      console.error(`[pos-api] Error ${res.status} al obtener vehículos del POS`);
      return [];
    }
    const data = (await res.json()) as { vehiculos: VehiculoOption[] };
    return data.vehiculos;
  } catch (err) {
    console.error("[pos-api] Error de red al obtener vehículos del POS:", err);
    return [];
  }
}

export async function getServiciosPrecios(grupo?: string, sucursalSlug: string = DEFAULT_BRANCH_ID): Promise<ServicioPrecio[]> {
  if (!POS_API_BASE_URL) {
    console.error("[pos-api] Falta la variable de entorno POS_API_BASE_URL");
    return [];
  }
  try {
    const res = await fetch(`${POS_API_BASE_URL}/${sucursalSlug}/servicios`, { next: { revalidate: 300 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      console.error(`[pos-api] Error ${res.status} al obtener servicios del POS`);
      return [];
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
    return grupo ? servicios.filter((s) => s.grupo === grupo) : servicios;
  } catch (err) {
    console.error("[pos-api] Error de red al obtener servicios del POS:", err);
    return [];
  }
}
