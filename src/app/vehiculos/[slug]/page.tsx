import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { VEHICLE_DB, sortVehiclesByPopularity, vehicleTireProfile, type VehicleTireProfile } from '@/lib/vehicles';
import { CatalogWidget } from '@/components/blog/CatalogWidget';
import Link from 'next/link';
import { canonical } from '@/lib/seo';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export async function generateStaticParams() {
  const populares = sortVehiclesByPopularity(VEHICLE_DB).slice(0, 30); // Top 30 most popular
  return populares.map(v => ({
    slug: slugify(`${v.brand} ${v.model}`)
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = VEHICLE_DB.find(v => slugify(`${v.brand} ${v.model}`) === slug);
  
  if (!vehicle) return {};

  return {
    title: `Neumáticos para ${vehicle.brand} ${vehicle.model} - Medidas y Precios`,
    description: `Encontrá las cubiertas originales y compatibles para tu ${vehicle.brand} ${vehicle.model}. Catálogo con precios reales y stock actualizado.`,
    alternates: canonical(`/vehiculos/${slug}`),
  };
}

function selectionCopy(profile: VehicleTireProfile) {
  if (profile === "commercial") {
    return "Mostramos sólo neumáticos comerciales (C), con carcasa y capacidad de carga aptas para esta versión de trabajo.";
  }
  if (profile === "pickup") {
    return "Mostramos neumáticos para pickup; puede incluir opciones A/T, pero no cubiertas comerciales C de utilitario.";
  }
  return "Mostramos neumáticos de auto: excluimos cubiertas comerciales C y A/T aunque compartan esta medida.";
}

export default async function VehiclePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = VEHICLE_DB.find(v => slugify(`${v.brand} ${v.model}`) === slug);
  
  if (!vehicle) {
    notFound();
  }

  // Find unique sizes for this vehicle
  const uniqueSizes = vehicle.sizes.reduce((acc, curr) => {
    const key = `${curr.w}-${curr.p}-${curr.r}`;
    if (!acc.find(s => `${s.w}-${s.p}-${s.r}` === key)) {
      acc.push(curr);
    }
    return acc;
  }, [] as typeof vehicle.sizes);

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-navy-950 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-orange-400 font-bold tracking-widest uppercase text-sm mb-4 block">
            Guía de medidas por vehículo
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
            Neumáticos para {vehicle.brand} {vehicle.model}
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto">
            Acá vas a encontrar las medidas originales de fábrica para todas las versiones del {vehicle.model}. 
            Elegí la tuya para ver qué tenemos en stock hoy mismo.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10">
          <div className="space-y-12">
            {uniqueSizes.map(size => (
              <div key={`${size.w}-${size.p}-${size.r}`} className="border-b border-slate-100 pb-12 last:border-0 last:pb-0">
                {(() => {
                  const versions = vehicle.sizes.filter(s => s.w === size.w && s.p === size.p && s.r === size.r);
                  const profile = vehicleTireProfile(vehicle, versions.map((s) => s.version).filter(Boolean).join(" / "));
                  return <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-navy-900 mb-2">
                    Medida {size.w}/{size.p} R{size.r}
                  </h2>
                  <p className="text-slate-500">
                    Suele venir de fábrica en versiones como: {
                      versions
                        .map(s => s.version || s.generation)
                        .filter(Boolean)
                        .join(", ") || "Varias versiones"
                    }.
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-600">{selectionCopy(profile)}</p>
                </div>
                
                <CatalogWidget 
                  size={{ width: Number(size.w), profile: Number(size.p), rim: Number(size.r) }} 
                  vehicleProfile={profile}
                  title={`En stock hoy`}
                />
                  </>;
                })()}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/" className="inline-block bg-white text-navy-800 font-bold py-3 px-6 rounded-xl border border-slate-200 hover:border-navy-300 hover:shadow-md transition-all">
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
