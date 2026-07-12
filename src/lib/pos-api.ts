import type { TireProduct } from "./types";

const POS_API_URL = process.env.POS_API_URL;

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
  imagen_url: string | null;
  en_stock: boolean;
};

export type ServicioPrecio = {
  id: string;
  nombre: string;
  precio: number;
  grupo: string;
};

// Sentinel usado por ProductCard/ProductPage para mostrar el ícono
// genérico de neumático cuando no hay foto real (ver hasImage en esos componentes).
const PLACEHOLDER_IMAGE = "/images/tire-placeholder.webp";

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

function toTireProduct(p: PosProducto): TireProduct | null {
  if (!p.neumatico_ancho || !p.neumatico_perfil || !p.neumatico_diametro) {
    // No es un neumático con medida completa — no se puede mostrar en el catálogo de la web
    return null;
  }
  const marca = p.marca || "";
  const modelo = fixModelName(p.modelo || "");
  const brandId = slugify(marca) || "otras-marcas";
  const model = `${p.neumatico_ancho}/${p.neumatico_perfil} R${p.neumatico_diametro} ${marca} ${modelo}`
    .trim()
    .replace(/\s+/g, " ");
  const slug = slugify(`${marca}-${modelo}-${p.neumatico_ancho}-${p.neumatico_perfil}-r${p.neumatico_diametro}`);

  return {
    id: p.id,
    brand: marca,
    brandId,
    model,
    size: { width: p.neumatico_ancho, profile: p.neumatico_perfil, rim: p.neumatico_diametro },
    // El POS no distingue tipo de vehículo todavía — se muestra para ambos por defecto.
    vehicleType: ["auto", "camioneta"],
    price: p.precio,
    imageUrl: p.imagen_url || PLACEHOLDER_IMAGE,
    tags: [],
    isEconomic: false,
    isImported: true,
    slug,
    enStock: p.en_stock,
  };
}

export async function getProductosDesdePOS(): Promise<TireProduct[]> {
  if (!POS_API_URL) {
    console.error("[pos-api] Falta la variable de entorno POS_API_URL");
    return [];
  }
  try {
    const res = await fetch(`${POS_API_URL}/productos`, { next: { revalidate: 300 } });
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

export async function getServiciosPrecios(grupo?: string): Promise<ServicioPrecio[]> {
  if (!POS_API_URL) {
    console.error("[pos-api] Falta la variable de entorno POS_API_URL");
    return [];
  }
  try {
    const res = await fetch(`${POS_API_URL}/servicios`, { next: { revalidate: 300 } });
    if (!res.ok) {
      console.error(`[pos-api] Error ${res.status} al obtener servicios del POS`);
      return [];
    }
    const data = (await res.json()) as {
      servicios: { id: string; nombre: string; precio: number; servicio_grupo: string }[];
    };
    const servicios = data.servicios.map((s) => ({
      id: s.id,
      nombre: s.nombre,
      precio: s.precio,
      grupo: s.servicio_grupo,
    }));
    return grupo ? servicios.filter((s) => s.grupo === grupo) : servicios;
  } catch (err) {
    console.error("[pos-api] Error de red al obtener servicios del POS:", err);
    return [];
  }
}
