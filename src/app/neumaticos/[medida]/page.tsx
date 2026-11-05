import type { Metadata } from "next";
import { poolShare } from "@/lib/share-image";
import { notFound } from "next/navigation";
import { DEFAULT_BRANCH_ID, TIRE_RIMS } from "@/lib/config";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { canonical, SITE_NAME, resumen } from "@/lib/seo";
import {
  MEDIDAS_PRIORITARIAS,
  anchosYPerfiles,
  formatSize,
  parseProfileSlug,
  parseRimSlug,
  parseWidthSlug,
  profileSlug,
  parseSizeSlug,
  rimSlug,
  sizeSlug,
  sizesEqual,
  sizesFromCatalog,
  vehiclesUsingSize,
  widthSlug,
} from "@/lib/tire-sizes";
import { sortVehiclesByPopularity } from "@/lib/vehicles";
import { SizeLanding } from "./SizeLanding";
import { RimLanding } from "./RimLanding";
import { EjeLanding } from "./EjeLanding";

/**
 * Landings por medida (/neumaticos/205-55-r16), por rodado
 * (/neumaticos/rodado-16), por ancho (/neumaticos/ancho-195) y por perfil
 * (/neumaticos/perfil-65).
 *
 * Los dos casos comparten segmento porque son el mismo eje de navegación a dos
 * niveles de detalle, y separarlos obligaría a un prefijo artificial en la URL.
 *
 * A diferencia de /catalogo y /buscar, esta ruta NO lee la cookie de sucursal:
 * usa el catálogo de la sucursal por defecto. Eso es lo que le permite
 * prerenderizarse e ir por CDN. Una página que llama a cookies() se renderiza
 * de cero en cada request, y estas son justamente las que más veces va a pedir
 * el crawler.
 */

type Props = { params: Promise<{ medida: string }> };

// Solo las medidas prearmadas (catálogo + prioritarias + rodados/anchos/perfiles).
// Una medida que salió de stock y no se prearma se renderizaba on-demand en el
// Worker y devolvía 503 o se colgaba (Search Console mostraba 294 URLs con 5xx):
// con `false` responde un 404 inmediato y la medida vuelve sola en el próximo
// deploy (cada 2 h) si el catálogo la trae de nuevo.
export const dynamicParams = false;

export async function generateStaticParams() {
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const slugs = new Set<string>();
  for (const { size } of sizesFromCatalog(productos)) slugs.add(sizeSlug(size));
  for (const size of MEDIDAS_PRIORITARIAS) slugs.add(sizeSlug(size));
  for (const rim of TIRE_RIMS) slugs.add(rimSlug(rim));
  const { anchos, perfiles } = anchosYPerfiles(productos);
  for (const ancho of anchos) slugs.add(widthSlug(ancho));
  for (const perfil of perfiles) slugs.add(profileSlug(perfil));
  return [...slugs].map((medida) => ({ medida }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { medida } = await params;

  const rim = parseRimSlug(medida);
  if (rim !== null) {
    // "Cubiertas rodado 13" (1.300 búsquedas/mes) y "cubiertas rodado 15"
    // (720): la gente dice cubiertas. El precio inicial real mejora el clic.
    const productosRim = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
    const preciosRim = productosRim.filter((p) => p.enStock && p.size.rim === rim).map((p) => p.price);
    const minimoRim = preciosRim.length ? Math.min(...preciosRim) : null;
    const title = minimoRim
      ? `Cubiertas rodado ${rim} desde $${minimoRim.toLocaleString("es-AR")} — medidas R${rim}`
      : `Cubiertas rodado ${rim} — precios y medidas R${rim}`;
    return {
      title,
      description: resumen(`Cubiertas y neumáticos rodado ${rim} (R${rim}) con stock y precio actualizado, para auto y camioneta. Importación directa, colocación sin cargo en el día y garantía de 1 año.`),
      alternates: canonical(`/neumaticos/${rimSlug(rim)}`),
      openGraph: { title: `${title} — ${SITE_NAME}`, url: `/neumaticos/${rimSlug(rim)}`, ...poolShare(medida).openGraph },
      twitter: poolShare(medida).twitter,
    };
  }

  const ancho = parseWidthSlug(medida);
  const perfil = parseProfileSlug(medida);
  if (ancho !== null || perfil !== null) {
    const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
    const eje = ancho !== null ? "ancho" : "perfil";
    const valor = (ancho ?? perfil) as number;
    const campo = eje === "ancho" ? "width" : "profile";
    const desde = productos.filter((p) => p.enStock && p.size[campo] === valor).map((p) => p.price);
    const minimo = desde.length ? Math.min(...desde) : null;
    const nombre = eje === "ancho" ? `ancho ${valor}` : `perfil ${valor}`;
    const title = minimo
      ? `Cubiertas ${nombre} desde $${minimo.toLocaleString("es-AR")}, todas las medidas`
      : `Cubiertas ${nombre} — medidas y precios`;
    const ruta = `/neumaticos/${eje === "ancho" ? widthSlug(valor) : profileSlug(valor)}`;
    return {
      title,
      description: resumen(`Todas las medidas de neumáticos de ${nombre} con stock y precio actualizado, y los autos que las usan. Cubiertas de importación directa con colocación sin cargo en el día.`),
      alternates: canonical(ruta),
      openGraph: { title: `${title} — ${SITE_NAME}`, url: ruta, ...poolShare(medida).openGraph },
      twitter: poolShare(medida).twitter,
    };
  }

  const size = parseSizeSlug(medida);
  if (!size) return {};

  const label = formatSize(size);
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const enStock = productos.filter((p) => sizesEqual(p.size, size) && p.enStock);
  const desde = enStock.length ? Math.min(...enStock.map((p) => p.price)) : null;
  const vehiculos = vehiclesUsingSize(size);

  // La descripción incluye precio y stock reales porque es lo que decide el
  // clic en la SERP frente a competidores que sólo repiten la medida. Los
  // modelos de auto entran cuando hay, para captar "neumáticos para <modelo>".
  const partesDescripcion = [
    desde
      ? `Neumáticos y cubiertas ${label} desde $${desde.toLocaleString("es-AR")} con stock disponible.`
      : `Neumáticos ${label}: precios, equivalencias y disponibilidad.`,
    "Colocación sin cargo en el día y garantía de 1 año.",
    vehiculos.length
      ? `Medida original de ${sortVehiclesByPopularity(vehiculos).slice(0, 3).map((v) => `${v.brand} ${v.model}`).join(", ")} y otros.`
      : "",
    "Importación directa, retiro en el local.",
  ].filter(Boolean);

  // "Cubiertas" es como se busca la medida en Argentina ("cubiertas 185 65
  // r15"); "neumáticos" ya está en el H1 y en la marca que suma el layout.
  const title = desde
    ? `Cubiertas ${label} desde $${desde.toLocaleString("es-AR")}, colocación sin cargo`
    : `Cubiertas ${label}: precios, equivalencias y stock`;

  return {
    title,
    description: resumen(partesDescripcion.join(" ")),
    alternates: canonical(`/neumaticos/${sizeSlug(size)}`),
    openGraph: { title: `${title} — ${SITE_NAME}`, url: `/neumaticos/${sizeSlug(size)}`, ...poolShare(medida).openGraph },
    twitter: poolShare(medida).twitter,
  };
}

export default async function MedidaPage({ params }: Props) {
  const { medida } = await params;
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);

  const rim = parseRimSlug(medida);
  if (rim !== null) return <RimLanding rim={rim} productos={productos} />;

  const ancho = parseWidthSlug(medida);
  const perfil = parseProfileSlug(medida);
  if (ancho !== null || perfil !== null) {
    const { anchos, perfiles } = anchosYPerfiles(productos);
    // Sin producto ni medida prioritaria con ese valor no hay página: se evita
    // indexar un "ancho 125" vacío que inventó un crawler o un link roto.
    if (ancho !== null) {
      if (!anchos.includes(ancho)) notFound();
      return <EjeLanding eje="ancho" valor={ancho} productos={productos} />;
    }
    if (!perfiles.includes(perfil as number)) notFound();
    return <EjeLanding eje="perfil" valor={perfil as number} productos={productos} />;
  }

  const size = parseSizeSlug(medida);
  if (!size) notFound();

  // Un slug canónico distinto al pedido (ej. mayúsculas) generaría dos URLs con
  // el mismo contenido; se 404ea en vez de servir el duplicado.
  if (sizeSlug(size) !== medida) notFound();

  return (
    <SizeLanding
      size={size}
      productos={productos.filter((p) => sizesEqual(p.size, size))}
      todos={productos}
    />
  );
}
