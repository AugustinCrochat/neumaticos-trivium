import Image from "next/image";
import type { BlogImage } from "@/lib/blog-meta";

/**
 * Portada de una nota: foto apaisada que llena su caja. Las cubiertas
 * recortadas (fit "contain") van centradas sobre fondo claro para que no se
 * corten; las fotos de taller y local llenan todo el cuadro.
 */
export function BlogCover({
  image,
  className = "",
  sizes = "(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw",
  priority = false,
}: {
  image: BlogImage;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const contain = image.fit === "contain";
  return (
    <div className={`relative overflow-hidden ${contain ? "border border-slate-100 bg-white" : "bg-navy-950"} ${className}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={contain ? "object-contain p-3" : "object-cover"}
        style={image.position ? { objectPosition: image.position } : undefined}
      />
    </div>
  );
}
