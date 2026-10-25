import { getTreadCloseup } from "./tread-closeups";
import { getExtraPhotos } from "./product-extra-photos";
import type { TireProduct } from "./types";

type Photoed = Pick<TireProduct, "imageUrl" | "brandId" | "modeloBase" | "size">;
type Described = Pick<TireProduct, "brand" | "model">;

/** Rutas de todas las fotos de un producto: la principal, la banda y otros ángulos. */
export function productImagePaths(p: Photoed): string[] {
  const tread = getTreadCloseup(p.imageUrl);
  const paths = [p.imageUrl, ...(tread ? [tread] : []), ...getExtraPhotos(p.brandId, p.modeloBase, p.size)];
  return [...new Set(paths.filter((s) => s && s !== "/images/tire-placeholder.webp"))];
}

/** Alt de la foto principal. `model` ya arranca con la medida ("205/55 R16 91V ..."). */
export function productAlt(p: Described): string {
  return `Neumático ${p.brand} ${p.model}`;
}

/** Alt de las fotos extra: dice qué se ve y de qué medida, no sólo "otro ángulo". */
export function productExtraAlt(p: Pick<TireProduct, "brand" | "modeloBase" | "size">, src: string, n: number): string {
  const medida = `${p.size.width}/${p.size.profile} R${p.size.rim}`;
  const base = `${p.brand} ${p.modeloBase} ${medida}`;
  if (src.includes("-etiqueta")) return `Neumático ${base} con la etiqueta del flanco: medida, índice de carga y etiqueta de eficiencia`;
  return src.includes("/products-tread/")
    ? `Banda de rodamiento del neumático ${base}, primer plano del dibujo`
    : `Neumático ${base}, vista ${n + 1}`;
}

/**
 * Miniatura de 480 px para las grillas (la genera scripts/generate-og-share-images.mjs
 * en el prebuild). En desarrollo, donde el prebuild no corrió, se usa la original.
 */
export function productThumb(imageUrl: string): string {
  if (process.env.NODE_ENV !== "production") return imageUrl;
  const m = imageUrl.match(/^(?:https?:\/\/[^/]+)?\/images\/products\/([^/?#]+)\.webp$/i);
  return m ? `/og-cache/thumbs/products/${m[1]}.webp` : imageUrl;
}
