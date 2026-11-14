import type { ReactNode } from "react";

const TAMANOS = {
  sm: "text-xl",
  md: "text-[1.75rem]",
  lg: "text-5xl",
  xl: "text-6xl",
} as const;

/**
 * Etiqueta de precio del sitio: amarillo de góndola, texto negro, inclinada
 * como el logo. Es la única forma en que se muestra un precio destacado, así
 * el ojo aprende que "amarillo = precio" en cualquier página.
 */
export function PrecioTag({ children, size = "md", className = "" }: { children: ReactNode; size?: keyof typeof TAMANOS; className?: string }) {
  return (
    <span className={`inline-block -skew-x-6 bg-precio-400 px-2 py-1 ${className}`}>
      <span className={`block skew-x-6 font-display font-extrabold italic leading-none tracking-tight text-black ${TAMANOS[size]}`}>{children}</span>
    </span>
  );
}
