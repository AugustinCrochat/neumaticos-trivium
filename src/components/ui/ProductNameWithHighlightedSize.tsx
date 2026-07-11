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
}: {
  product: TireProduct;
  className?: string;
  sizeClassName?: string;
}) {
  const match = product.model.match(sizePattern(product));

  if (!match || match.index === undefined) {
    return <span className={className}>{product.model}</span>;
  }

  const before = product.model.slice(0, match.index);
  const size = match[0];
  const after = product.model.slice(match.index + size.length);

  return (
    <span className={className}>
      {before}
      <span className={sizeClassName || "font-black text-slate-900"}>
        {size}
      </span>
      {after}
    </span>
  );
}
