import Image from "next/image";
import { EuStars } from "@/components/ui/EuLabelBadge";
import type { Utqg } from "@/lib/utqg";

/**
 * Etiqueta UE sobre un lienzo blanco: franja "Homologadas en Europa" arriba,
 * la etiqueta contenida (sin deformarla) en el medio y, si hay dato verificado,
 * la franja UTQG abajo. Ocupa todo el cuadro que le den, así la miniatura, el
 * panel de zoom y la imagen ampliada se ven iguales.
 */
export function EuLabelCard({ src, alt, utqg, sizes }: { src: string; alt: string; utqg?: Utqg | null; sizes: string }) {
  return (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="flex h-9 shrink-0 items-center justify-center gap-2 border-b border-slate-200 px-2 text-xs font-black uppercase tracking-wide text-navy-900">
        <EuStars className="h-5 w-5 shrink-0" />
        Homologadas en Europa
      </div>
      <div className="relative min-h-0 flex-1">
        <Image src={src} alt={alt} fill sizes={sizes} className="object-contain p-2" />
      </div>
      {utqg && (
        <div className="flex h-9 shrink-0 items-center justify-center border-t border-slate-200 px-2 text-center text-xs font-black tracking-wide text-navy-900">
          UTQG {utqg.treadwear} {utqg.traction} {utqg.temperature}
        </div>
      )}
    </div>
  );
}
