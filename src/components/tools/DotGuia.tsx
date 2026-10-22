import Image from "next/image";

const FOTO = "/images/herramientas/codigo-dot-flanco-neumatico.webp";

/**
 * Dónde está el DOT: la foto de un flanco real con el lugar marcado y, al lado,
 * el código ampliado con la semana y el año señalados. Las coordenadas son
 * proporciones de la foto (960 x 1280); el recorte amplía la zona del "1226".
 */
export function DotGuia() {
  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)] md:items-start">
      <figure>
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border-2 border-slate-300 bg-slate-100">
          <Image src={FOTO} alt="Flanco de un neumático con el código DOT de fabricación marcado" fill sizes="(min-width: 768px) 260px, 100vw" className="object-cover" priority />
          <div className="absolute rounded-lg border-[3px] border-orange-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" style={{ left: "37%", top: "60.8%", width: "21%", height: "6.8%" }} />
          <span className="absolute rounded-md bg-orange-500 px-2 py-1 text-xs font-black uppercase tracking-wide text-white" style={{ left: "37%", top: "54%" }}>
            Acá está el DOT
          </span>
        </div>
        <figcaption className="mt-2 text-xs text-slate-500">En el flanco, cerca de la llanta, junto a las letras DOT.</figcaption>
      </figure>

      <div>
        <p className="mb-2 text-sm font-black uppercase tracking-wide text-slate-500">El código, de cerca</p>
        <div className="relative aspect-[260/120] overflow-hidden rounded-2xl border-2 border-slate-300 bg-black">
          <Image
            src={FOTO}
            alt="Código 1226 grabado en el flanco, ampliado"
            width={960}
            height={1280}
            sizes="(min-width: 768px) 520px, 100vw"
            className="absolute max-w-none"
            style={{ width: "369.2%", left: "-126.9%", top: "-637.5%" }}
          />
          <div className="absolute rounded-md border-[3px] border-orange-500 bg-orange-500/15" style={{ left: "17%", top: "24%", width: "29%", height: "56%" }} />
          <div className="absolute rounded-md border-[3px] border-white bg-white/10" style={{ left: "50%", top: "24%", width: "32%", height: "56%" }} />
        </div>
        <div className="mt-2 grid grid-cols-[17%_29%_4%_32%] text-center">
          <span />
          <span className="rounded-lg bg-orange-500 px-1 py-1.5 text-sm font-black text-white">12 = semana</span>
          <span />
          <span className="rounded-lg bg-black px-1 py-1.5 text-sm font-black text-white">26 = año 2026</span>
        </div>
        <p className="mt-4 text-slate-700">
          Este neumático dice <strong>1226</strong>: se fabricó en la <strong>semana 12 de 2026</strong>, es decir, a fines de marzo. Los dos primeros números son la semana y los dos últimos, el año.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Buscá las letras <strong>DOT</strong> en el flanco: los 4 números finales de esa serie son la fecha. A veces sólo están en uno de los dos lados, así que si no lo ves, mirá el otro.
        </p>
      </div>
    </div>
  );
}
