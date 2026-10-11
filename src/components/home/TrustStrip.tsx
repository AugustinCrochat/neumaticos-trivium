const ITEMS = [
  { titulo: "Importación directa", detalle: "Sin intermediarios" },
  { titulo: "Garantía de 1 año", detalle: "Por defecto de fábrica" },
  { titulo: "Colocación incluida", detalle: "Retirando en el local" },
];

/** Franja de argumentos de confianza debajo del hero — lo que antes sólo
    estaba escondido en el FAQ. */
export function TrustStrip() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <ul className="mx-auto grid max-w-7xl 2xl:max-w-[96rem] grid-cols-1 gap-px bg-slate-200 sm:grid-cols-3">
        {ITEMS.map((item) => (
          <li key={item.titulo} className="bg-white px-4 py-5 text-center md:text-left">
            <span className="font-display block text-xl font-bold uppercase leading-tight tracking-wide text-navy-900">
              {item.titulo}
            </span>
            <span className="mt-0.5 block text-sm text-slate-500">{item.detalle}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
