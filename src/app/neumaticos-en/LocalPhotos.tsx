import Image from "next/image";
import Link from "next/link";

const FOTOS = [
  { src: "/images/local/fachada-local-neumaticos-trivium-cordoba.webp", alt: "Fachada del local de Neumáticos Trivium en Argüello, Córdoba" },
  { src: "/images/local/tecnicos-alineando-auto-elevador-gomeria-trivium-cordoba.webp", alt: "Técnicos alineando un auto en el elevador del taller de Trivium en Córdoba" },
  { src: "/images/local/tecnico-balanceando-rueda-balanceadora-trivium-cordoba.webp", alt: "Técnico balanceando una rueda en la balanceadora del taller de Trivium" },
  { src: "/images/local/pickup-4x4-en-elevador-alineacion-neumaticos-trivium-cordoba.webp", alt: "Pick-up 4x4 en el elevador para alineación en Neumáticos Trivium Córdoba" },
];

/** Fotos reales del local y el taller de Argüello (solo para sucursales ya abiertas). */
export function LocalPhotos({ zona }: { zona: string }) {
  return (
    <section className="mb-12">
      <h2 className="mb-2 text-2xl font-black text-navy-900">Conocé el local y el taller</h2>
      <p className="mb-5 max-w-3xl leading-relaxed text-slate-600">
        Así es Neumáticos Trivium, a pocos minutos de {zona}: local a la calle, stock a la vista y
        taller propio con alineación 3D y balanceo.
      </p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {FOTOS.map((f) => (
          <div key={f.src} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
            <Image src={f.src} alt={f.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
          </div>
        ))}
      </div>
      <Link href="/servicios" className="mt-4 inline-block text-sm font-black text-navy-700 underline underline-offset-2">
        Ver los servicios del taller →
      </Link>
    </section>
  );
}
