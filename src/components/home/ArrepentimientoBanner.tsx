import Link from "@/components/ui/Link";

export function ArrepentimientoBanner() {
  return (
    <section className="bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl 2xl:max-w-[96rem] mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
        <p className="text-sm text-slate-600">
          Comprá con la tranquilidad de tu derecho de arrepentimiento (Ley 24.240).
        </p>
        <Link
          href="/arrepentimiento"
          className="text-sm font-black text-navy-900 underline underline-offset-4 hover:text-navy-700 transition-colors"
        >
          Botón de Arrepentimiento
        </Link>
      </div>
    </section>
  );
}
