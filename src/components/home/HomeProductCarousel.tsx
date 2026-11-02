import { LocalProductCarousel } from "@/app/neumaticos-en/LocalProductCarousel";
import { bestPriceByGroup } from "@/lib/best-price";
import type { TireProduct } from "@/lib/types";

/**
 * Cinta de neumáticos con stock arriba de "Elegí tu medida": se mueve sola,
 * despacio y en continuo (ver LocalProductCarousel `autoplay`). Abre con lo más
 * vendido y, a igual venta, lo más barato; se limita a 30 para no cargar de más
 * la home (la cinta duplica las tarjetas en el navegador).
 */
export function HomeProductCarousel({ productos }: { productos: TireProduct[] }) {
  const conStock = productos
    .filter((p) => p.enStock)
    .sort((a, b) => (b.vendidos ?? 0) - (a.vendidos ?? 0) || a.price - b.price)
    .slice(0, 30);
  if (conStock.length === 0) return null;
  const mejores = [...bestPriceByGroup(productos.filter((p) => p.enStock))];

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 2xl:max-w-[96rem]">
      <LocalProductCarousel autoplay productos={conStock} mejores={mejores} titulo="Neumáticos con stock y precio hoy" />
    </div>
  );
}
