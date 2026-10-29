import Image from "next/image";

const FOTO = "/donde-encontrar-la-medida-en-el-flanco-del-neumatico.webp";
const ALT =
  "Flanco de un neumático 195/65 R15 95T XL con cada código numerado: 1 ancho, 2 perfil, 3 radial, 4 llanta, 5 índice de carga, 6 velocidad, 7 XL, 8 M+S y 9 tubeless";

/** Centro de cada número sobre la foto (1600 × 1093 px), en % del ancho y del alto. */
const PUNTOS: Record<number, [number, number]> = {
  1: [21.7, 41.6],
  2: [30.4, 28.6],
  3: [35.7, 22.8],
  4: [40.9, 18.7],
  5: [50.4, 9.9],
  6: [56.6, 5.8],
  7: [65.1, 3.8],
  8: [85.4, 14.9],
  9: [7.4, 74.8],
};
/** Fila de cada número en el cuadro de la derecha: arriba de la fila, en % del alto. */
const FILA_ALTO = 6.6;
const filaTop = (n: number) => ((388 + (n - 1) * 72 - 36) / 1093) * 100;

/** La foto del flanco con el número que explica la nota marcado, en el neumático y en el cuadro. */
export function FlancoFoto({ numero, caption }: { numero: number; caption: string }) {
  const [x, y] = PUNTOS[numero];
  return (
    <figure className="my-8">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        <Image src={FOTO} alt={ALT} width={1600} height={1093} sizes="(min-width: 768px) 768px, 100vw" className="h-auto w-full" />
        <span
          aria-hidden
          className="pointer-events-none absolute aspect-square w-[9%] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-yellow-300 shadow-[0_0_0_3px_rgba(0,0,0,0.55)]"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute left-[46.5%] w-[48.5%] rounded-xl border-4 border-yellow-300 shadow-[0_0_0_3px_rgba(0,0,0,0.35)]"
          style={{ top: `${filaTop(numero)}%`, height: `${FILA_ALTO}%` }}
        />
      </div>
      <figcaption className="mt-2 text-sm text-slate-500">{caption}</figcaption>
    </figure>
  );
}
