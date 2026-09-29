import Link from 'next/link';

export default function BlogIndex() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8">Blog de Neumáticos</h1>
      <div className="grid gap-6">
        <Link href="/blog/ruido-neumaticos" className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold mb-2">¿Sabías que tus neumáticos hablan? Hablemos de los Decibeles</h2>
          <p className="text-gray-600">Descubrí cómo se mide el ruido de las cubiertas y por qué elegir una cubierta silenciosa puede cambiar tu viaje.</p>
        </Link>
        <Link href="/blog/verano-vs-allseason" className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold mb-2">Neumáticos de Verano vs. All-Season: ¿Qué te conviene en Argentina?</h2>
          <p className="text-gray-600">Te explicamos las diferencias para que elijas la mejor opción según por dónde manejes.</p>
        </Link>
      </div>
    </div>
  );
}
