import Link from "@/components/ui/Link";
import { GoogleRatingBadge } from "@/components/ui/GoogleRatingBadge";
import { MEDIDAS_PRIORITARIAS, formatSize, sizeSlug, sizesEqual } from "@/lib/tire-sizes";
import type { TireProduct } from "@/lib/types";

const money = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

/** El neumático más barato con stock de la medida más pedida que tenga stock:
    un precio real ("175/65 R14 a $71.000") convence más que un "desde". */
export function precioAncla(productos: TireProduct[]) {
  for (const size of MEDIDAS_PRIORITARIAS) {
    const precios = productos
      .filter((p) => p.enStock !== false && !p.isCarga && sizesEqual(p.size, size))
      .map((p) => p.price);
    if (precios.length) return { size, precio: Math.min(...precios) };
  }
  return null;
}

/**
 * Fila de confianza en la primera pantalla de la home: puntaje de Google, un
 * precio real de la medida más pedida y lo que diferencia al local (colocación
 * sin cargo, sin turno; la garantía ya está en la franja de abajo). Antes sólo estaba la marca: nada que dijera
 * "barato" o "confiable" sin bajar.
 */
export function HeroTrustRow({ productos }: { productos: TireProduct[] }) {
  const ancla = precioAncla(productos);
  const chip = "rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-sm";

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      <GoogleRatingBadge className={`${chip} text-white`} />
      {ancla && (
        <Link
          href={`/neumaticos/${sizeSlug(ancla.size)}`}
          className="rounded-full bg-orange-500 px-3 py-1.5 text-sm font-black !text-white !no-underline transition-colors hover:bg-orange-600"
        >
          {formatSize(ancla.size)} a {money(ancla.precio)}
        </Link>
      )}
      <span className={chip}>Colocación sin cargo</span>
      <span className={chip}>Sin turno</span>
    </div>
  );
}
