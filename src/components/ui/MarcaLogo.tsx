import { marcaLogo, marcaLogoSobreNegro } from "@/lib/marcas-autos";

/**
 * Logo de una marca de auto, decorativo (el nombre va siempre al lado). null si
 * no hay logo. Con `sobreNegro` elige la versión que se ve en un fondo negro:
 * el logo oscuro en blanco, o en un recuadro blanco si tiene detalle interno.
 */
export function MarcaLogo({ brand, className = "h-6 w-6", sobreNegro = false }: { brand: string; className?: string; sobreNegro?: boolean }) {
  const v = sobreNegro ? marcaLogoSobreNegro(brand) : null;
  const src = v ? v.src : marcaLogo(brand);
  if (!src) return null;
  // eslint-disable-next-line @next/next/no-img-element
  const img = <img src={src} alt="" aria-hidden="true" loading="lazy" decoding="async" className={v?.recuadro ? "h-full w-full object-contain" : `${className} shrink-0 object-contain`} />;
  return v?.recuadro ? <span className={`${className} inline-flex shrink-0 rounded-2xl bg-white p-2.5`}>{img}</span> : img;
}
