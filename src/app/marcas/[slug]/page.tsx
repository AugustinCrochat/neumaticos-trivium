import { BRANDS } from "@/lib/data";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { getSelectedBranchSlug } from "@/lib/branch-server";
import { ProductCard } from "@/components/ui/ProductCard";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { getBrandLogo } from "@/lib/brand-utils";
import { DEFAULT_BRANCH_ID } from "@/lib/config";
import { canonical, itemListJsonLd, SITE_NAME } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

// El set de marcas se conoce en build time (BRANDS es estático). Sin esto la
// ruta sale con `no-cache, no-store` y hace SSR en cada request — ver el
// comentario largo en /productos/[slug]/page.tsx.
export function generateStaticParams() {
  return BRANDS.map((b) => ({ slug: b.id }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = BRANDS.find((b) => b.id === slug);
  if (!brand) return { title: "Marca no encontrada" };

  // El precio "desde" en la descripción es lo que más mueve el CTR en consultas
  // de marca, donde el usuario ya decidió qué quiere y está comparando dónde.
  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const enStock = productos.filter((p) => p.brandId === brand.id && p.enStock);
  const desde = enStock.length ? Math.min(...enStock.map((p) => p.price)) : null;

  const description = desde
    ? `Neumáticos ${brand.name} desde $${desde.toLocaleString("es-AR")} con stock disponible. ${brand.description ?? `Cubiertas ${brand.name} de importación directa`} Envío a todo el país o retiro sin cargo en Córdoba.`
    : `Catálogo de neumáticos ${brand.name}: medidas, precios y disponibilidad. ${brand.description ?? ""} Importación directa con garantía de 1 año.`;

  return {
    title: `Neumáticos ${brand.name} — precios y medidas`,
    description: description.replace(/\s+/g, " ").slice(0, 300),
    alternates: canonical(`/marcas/${brand.id}`),
    openGraph: {
      title: `Neumáticos ${brand.name} — ${SITE_NAME}`,
      url: `/marcas/${brand.id}`,
    },
  };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = BRANDS.find((b) => b.id === slug);
  if (!brand) notFound();

  const productos = await getProductosDesdePOS(await getSelectedBranchSlug());
  const brandProducts = productos.filter((p) => p.brandId === brand.id);
  const brandLogo = getBrandLogo(brand.id);

  return (
    <div className="min-h-screen bg-white">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Marcas", path: "/marcas" },
          { name: brand.name, path: `/marcas/${brand.id}` },
        ])}
      />
      {brandProducts.length > 0 && (
        <JsonLd
          data={itemListJsonLd(
            brandProducts.map((p) => ({
              name: `${p.brand} ${p.model}`,
              path: `/productos/${p.slug}`,
            }))
          )}
        />
      )}
      {/* Brand Header */}
      <header className="bg-slate-50 border-b border-slate-100 pt-12 md:pt-20 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-16">
            <div className="shrink-0 flex items-center justify-center py-4">
              {brandLogo ? (
                // Se acota por alto Y por ancho: con `w-auto` solo, el ancho
                // sale de la proporción del SVG y los wordmarks alargados se
                // desbordan (Grenlander llegó a ocupar 979 px de ancho contra
                // 490 de Pirelli). Con las dos cotas, `object-contain` escala
                // por la dimensión que primero toca el límite y cualquier logo
                // entra parejo, sin importar su proporción.
                //
                // El `rounded-xl` es por el logo de Grenlander, que trae una
                // placa de fondo sólida en vez de fondo transparente: sin
                // redondear se ve como un rectángulo cortado sobre el fondo
                // claro de la cabecera. En los logos transparentes no se nota.
                <img
                  src={brandLogo}
                  alt={brand.name}
                  className="h-16 md:h-24 w-auto max-w-[260px] md:max-w-[380px] rounded-xl object-contain"
                />
              ) : (
                <div className="py-4">
                  <h2 className="text-4xl md:text-6xl font-black text-navy-900 tracking-tighter uppercase">{brand.name}</h2>
                </div>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <nav className="flex items-center justify-center md:justify-start gap-2 mb-6 text-sm font-bold text-slate-400">
                <Link href="/" className="hover:text-navy-600 transition-colors">Inicio</Link>
                <span>/</span>
                <Link href="/marcas" className="hover:text-navy-600 transition-colors">Marcas</Link>
                <span>/</span>
                <span className="text-navy-900">{brand.name}</span>
              </nav>
              
              <div className="flex flex-col md:flex-row items-center md:items-baseline gap-3 md:gap-4 mb-6">
                <h1 className="text-4xl md:text-6xl font-black text-navy-950 tracking-tight">{brand.name}</h1>
                <span className="bg-black text-white text-[10px] md:text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-navy-900/20">
                  {brand.origin}
                </span>
              </div>
              
              <p className="text-lg md:text-xl text-slate-600 font-medium mb-8 max-w-2xl leading-relaxed">
                {brand.fullDescription || brand.description || `Descubrí la excelencia en neumáticos ${brand.name}. Ingeniería de precisión diseñada para ofrecer el máximo rendimiento, seguridad y durabilidad en cada trayecto.`}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                 <div className="bg-white border border-slate-200 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-navy-50 flex items-center justify-center text-navy-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Disponibles</p>
                      <p className="text-lg font-black text-navy-900 leading-none">{brandProducts.length} <span className="text-sm font-bold text-slate-500">modelos</span></p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-black text-navy-950 mb-2">Modelos en stock</h2>
            <p className="text-slate-500 font-medium">Resultados filtrados para {brand.name}</p>
          </div>
          <Link 
            href="/catalogo" 
            className="group flex items-center gap-3 bg-white border-2 border-slate-100 hover:border-navy-200 px-6 py-3 rounded-2xl transition-all shadow-sm active:scale-[0.98]"
          >
            <span className="font-black text-navy-900">Ver todas las marcas</span>
            <svg className="w-5 h-5 text-navy-600 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        
        {brandProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {brandProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-200 mb-6 shadow-sm">
               <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
               </svg>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Sin stock disponible</h3>
            <p className="text-slate-500 max-w-md mb-8">
              Actualmente no tenemos neumáticos {brand.name} en stock, pero recibimos mercadería semanalmente.
            </p>
            <Link href="/contacto" className="bg-black text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-navy-900/20 hover:scale-105 transition-transform active:scale-95">
              Consultar ingresos
            </Link>
          </div>
        )}
      </main>

      {/* Brand Footer CTA */}
      <section className="bg-black py-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
           {brandLogo && <img src={brandLogo} alt="" className="w-full h-full object-contain grayscale invert scale-150 translate-x-1/4" />}
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center md:text-left">
           <div className="md:flex items-center justify-between gap-12">
              <div className="mb-10 md:mb-0 max-w-2xl">
                 <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">¿No encontrás la medida que buscás?</h2>
                 <p className="text-slate-300 text-lg md:text-xl font-medium">
                    Nuestro equipo técnico puede asesorarte sobre las mejores alternativas y equivalencias para tu vehículo en la marca {brand.name}.
                 </p>
              </div>
              <Link 
                href="/contacto" 
                className="inline-flex items-center gap-3 bg-white text-navy-950 font-black px-10 py-5 rounded-[2rem] text-lg shadow-2xl hover:scale-105 transition-transform active:scale-95 whitespace-nowrap"
              >
                Hablar con un experto
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </Link>
           </div>
        </div>
      </section>
    </div>
  );
}
