import Link from "@/components/ui/Link";
import { SizeOrVehicleSearch } from "@/components/ui/SizeOrVehicleSearch";
import { MEDIDAS_PRIORITARIAS, formatSize, sizeSlug } from "@/lib/tire-sizes";

/**
 * Cierre de las fichas de alineado y balanceado: quien viene a alinear suele
 * estar por cambiar cubiertas. Buscador por medida o auto, atajos a las
 * medidas más pedidas y el recordatorio de que la colocación va sin cargo.
 */
export function UpsellNeumaticos() {
  return (
    <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-7">
      <h2 className="text-xl font-black text-navy-900">¿Las cubiertas ya dieron lo que tenían que dar?</h2>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">
        Si vas a cambiarlas, hacelo en la misma visita: comprando las cubiertas en el local, la colocación y las
        válvulas van sin cargo, y las dejamos alineadas y balanceadas.
      </p>
      <div className="mt-4">
        <SizeOrVehicleSearch compact hideLearnLink />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {MEDIDAS_PRIORITARIAS.slice(0, 8).map((size) => (
          <Link
            key={sizeSlug(size)}
            href={`/neumaticos/${sizeSlug(size)}`}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-navy-900 transition-colors hover:border-navy-400"
          >
            {formatSize(size)}
          </Link>
        ))}
        <Link
          href="/neumaticos"
          className="rounded-xl bg-navy-900 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-black"
        >
          Ver todas las medidas
        </Link>
      </div>
    </section>
  );
}
