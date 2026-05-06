const VALUE_ITEMS = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Precios Outlet",
    description:
      "Importamos directamente de fábrica. Sin intermediarios, el ahorro es tuyo. Hasta un 40% más barato que la competencia.",
    highlight: "–40% vs. mercado",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Marcas de Importación Directa",
    description:
      "Trabajamos con las mejores marcas de importación directa. Todas con garantía y certificación.",
    highlight: "+8 marcas importadas",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Garantía Verificada",
    description:
      "Todos nuestros neumáticos cuentan con garantía del fabricante y pasan por un control de calidad antes de salir al mercado.",
    highlight: "Garantía de fábrica",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "2 Sucursales",
    description:
      "Presente en Don Torcuato (Tigre) y Córdoba Capital. Montaje profesional en el momento con técnicos certificados.",
    highlight: "Don Torcuato • Córdoba",
  },
];

export function ValueSection() {
  return (
    <section className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-navy-900 mb-3">
            ¿Por qué elegir Trivium?
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Somos el canal de venta directa de neumáticos de importación más
            accesible del país.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUE_ITEMS.map((item) => (
            <div
              key={item.title}
              className="group p-6 rounded-2xl border border-slate-100 hover:border-navy-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-white"
            >
              <div className="w-14 h-14 bg-navy-50 group-hover:bg-navy-100 text-navy-700 rounded-2xl flex items-center justify-center mb-4 transition-colors">
                {item.icon}
              </div>
              <h3 className="font-bold text-navy-900 mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-3">
                {item.description}
              </p>
              <span className="inline-block bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">
                {item.highlight}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
