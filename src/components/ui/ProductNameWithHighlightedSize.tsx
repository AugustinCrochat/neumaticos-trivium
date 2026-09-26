import type { ReactNode } from "react";
import type { TireProduct } from "@/lib/types";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sizePattern(product: TireProduct) {
  const { width, profile, rim } = product.size;
  return new RegExp(
    `(${escapeRegex(String(width))}\\s*/\\s*${escapeRegex(String(profile))}\\s*(?:Z?R)\\s*${escapeRegex(String(rim))}[A-Z]*)`,
    "i",
  );
}

export function ProductNameWithHighlightedSize({
  product,
  className = "",
  sizeClassName = "",
  afterSize,
  hideBrand = false,
}: {
  product: TireProduct;
  className?: string;
  sizeClassName?: string;
  /** Contenido a insertar justo después de la medida resaltada, ej. índice de carga/velocidad. */
  afterSize?: ReactNode;
  /** Saca la marca del texto (queda medida + modelo). Para el h1 de la ficha
      de producto, donde la marca ya se muestra aparte con su logo — repetirla
      en el título es ruido. El <title> de SEO y las tarjetas de listado
      siguen mostrando el nombre completo. */
  hideBrand?: boolean;
}) {
  const modelText = hideBrand
    ? product.model.replace(new RegExp(`\\b${escapeRegex(product.brand)}\\b\\s*`, "i"), "").replace(/\s+/g, " ").trim()
    : product.model;
  const match = modelText.match(sizePattern(product));

  if (!match || match.index === undefined) {
    return <span className={className}>{modelText}{afterSize}</span>;
  }

  const before = modelText.slice(0, match.index);
  const size = match[0];
  const after = modelText.slice(match.index + size.length);

  return (
    <span className={className}>
      {before}
      <span className={sizeClassName || "font-black text-slate-900"}>
        {size}
      </span>
      {afterSize}
      {after}
    </span>
  );
}
