import { MEDIDAS_PRIORITARIAS, formatSize, sizeSlug, sizesEqual } from "@/lib/tire-sizes";
import type { TireProduct } from "@/lib/types";
import { HeroChips } from "@/components/home/HeroChips";

const money = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

/** El neumático más barato con stock de cada una de las medidas más pedidas
    (hasta `max`): un precio real ("175/65 R14 a $71.000") convence más que un
    "desde", y la píldora de la portada los va rotando. */
export function preciosAncla(productos: TireProduct[], max = 6) {
  const out: { size: TireProduct["size"]; precio: number }[] = [];
  for (const size of MEDIDAS_PRIORITARIAS) {
    const precios = productos
      .filter((p) => p.enStock !== false && !p.isCarga && sizesEqual(p.size, size))
      .map((p) => p.price);
    if (precios.length) out.push({ size, precio: Math.min(...precios) });
    if (out.length === max) break;
  }
  return out;
}

/**
 * Fila de confianza en la primera pantalla de la home: puntaje de Google, un
 * precio real de la medida más pedida y lo que diferencia al local. El precio
 * se calcula acá (catálogo del build); lo que depende de la sucursal elegida
 * lo resuelve HeroChips en el cliente.
 */
export function HeroTrustRow({ productos }: { productos: TireProduct[] }) {
  const anclas = preciosAncla(productos).map((a) => ({
    href: `/neumaticos/${sizeSlug(a.size)}`,
    texto: `${formatSize(a.size)} a ${money(a.precio)}`,
  }));
  return <HeroChips anclas={anclas} />;
}
