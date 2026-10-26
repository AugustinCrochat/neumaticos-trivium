import Link from "@/components/ui/Link";

// Next.js sirve esta página (dentro del layout raíz, con header y footer)
// para cualquier notFound() o ruta inexistente. Sin este archivo, mostraba el
// "This page could not be found." en inglés por defecto.
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <span className="text-sm font-black uppercase tracking-widest text-orange-500">Error 404</span>
      <h1 className="mt-3 text-3xl font-black text-navy-900 md:text-4xl">
        No encontramos esta página
      </h1>
      <p className="mt-4 max-w-md text-slate-500">
        El link puede estar roto o la página pudo haberse movido. Probá desde el catálogo o
        volvé al inicio.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/catalogo"
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-black px-6 text-sm font-black text-white transition-transform active:scale-[0.98]"
        >
          Ver catálogo
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-slate-200 px-6 text-sm font-black text-navy-800 transition-colors hover:border-navy-300"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
