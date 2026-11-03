import { BRANCHES, type Branch } from "./config";

/**
 * Regiones del sitio: cada una es un portal propio (/cordoba, /buenos-aires)
 * con su sucursal, zonas y texto. El selector de sucursal navega entre ellas.
 * Las páginas comunes (sin prefijo) siguen siendo agnósticas.
 */
export type Region = {
  slug: string;
  nombre: string;
  /** Sucursal que se preselecciona al entrar (la primera si hay varias). */
  branchIds: string[];
  titulo: string;
  descripcion: string;
  intro: string;
  /** Texto propio de la región: evita que los portales sean doorway pages. */
  contexto: string;
};

export const REGIONES: Region[] = [
  {
    slug: "cordoba",
    nombre: "Córdoba",
    branchIds: ["arguello"],
    titulo: "Neumáticos en Córdoba: local en Argüello, precios y stock",
    descripcion:
      "Neumáticos nuevos con precio publicado y colocación sin cargo en nuestro local de Argüello, Córdoba. Mirá zonas que atendemos, horarios, cómo llegar y el catálogo.",
    intro:
      "Nuestro local de Córdoba está en Argüello, sobre Av. Donato Álvarez. Atiende la capital y las Sierras Chicas con neumáticos de importación directa, precio publicado en la web y taller propio.",
    contexto:
      "Desde Argüello se llega rápido al norte de la ciudad y a Villa Allende, Saldán, La Calera y las Sierras Chicas. Si venís de otro barrio, mirá la página de tu zona para saber cómo llegar y cuánto tardás.",
  },
  {
    slug: "buenos-aires",
    nombre: "Buenos Aires",
    branchIds: ["lomas-del-mirador", "san-justo"],
    titulo: "Neumáticos en Buenos Aires: locales en Lomas del Mirador y San Justo",
    descripcion:
      "Nuestros locales de Buenos Aires: Lomas del Mirador (pegado a la General Paz) y San Justo, La Matanza. Zonas que atendemos, direcciones y catálogo con precios publicados.",
    intro:
      "Estamos abriendo dos locales en el oeste del Gran Buenos Aires: Lomas del Mirador, pegado a la General Paz, y San Justo, en La Matanza. Mientras tanto podés ver el catálogo y consultar por WhatsApp.",
    contexto:
      "La zona oeste y el oeste de Capital están a minutos de estos locales. Cada uno atiende las localidades y barrios cercanos; abajo está el detalle de cada zona.",
  },
];

export function getRegion(slug: string): Region | undefined {
  return REGIONES.find((r) => r.slug === slug);
}

export function sucursalesDeRegion(region: Region): Branch[] {
  return region.branchIds.map((id) => BRANCHES.find((b) => b.id === id)).filter((b): b is Branch => !!b);
}

/** Región de una sucursal (para que el selector sepa a qué portal ir). */
export function regionDeSucursal(branchId: string): Region | undefined {
  return REGIONES.find((r) => r.branchIds.includes(branchId));
}

/** Región a la que pertenece una ruta ("/cordoba", "/cordoba/x"), si la hay. */
export function regionDePath(pathname: string): Region | undefined {
  const first = pathname.split("/")[1];
  return REGIONES.find((r) => r.slug === first);
}
