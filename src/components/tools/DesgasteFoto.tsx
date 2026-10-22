import Image from "next/image";

/**
 * Foto real de un neumático gastado hasta los testigos, con la banda marcada.
 * Se usa en la herramienta de desgaste y en las notas sobre cuándo cambiar.
 */
export function DesgasteFoto({ className = "" }: { className?: string }) {
  return (
    <figure className={className}>
      <div className="relative mx-auto aspect-[9/10] max-w-md overflow-hidden rounded-2xl border-2 border-slate-300 bg-slate-100">
        <Image
          src="/images/herramientas/neumatico-desgastado-testigo.webp"
          alt="Neumático gastado hasta los testigos de desgaste: la banda de rodamiento casi no tiene dibujo"
          fill
          sizes="(min-width: 768px) 448px, 100vw"
          className="object-cover object-[50%_72%]"
        />
        <span className="absolute left-3 top-3 rounded-md bg-orange-500 px-2 py-1 text-xs font-black uppercase tracking-wide text-white">
          Banda gastada hasta el testigo
        </span>
      </div>
      <figcaption className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        Así llega un neumático que se usó de más: el dibujo casi desapareció y ya no evacúa el agua. Con las telas o los alambres a la vista, no se puede circular.
      </figcaption>
    </figure>
  );
}
