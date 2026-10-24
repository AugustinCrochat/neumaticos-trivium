import { marcaLogo } from "@/lib/marcas-autos";

/** Logo de una marca de auto, decorativo (el nombre va siempre al lado). null si no hay logo. */
export function MarcaLogo({ brand, className = "h-6 w-6" }: { brand: string; className?: string }) {
  const src = marcaLogo(brand);
  if (!src) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" aria-hidden="true" loading="lazy" decoding="async" className={`${className} shrink-0 object-contain`} />;
}
