import { ProductBlock } from '@/components/blog/ProductBlock';
import { CatalogWidget } from '@/components/blog/CatalogWidget';
import Link from 'next/link';
import { blogMeta } from '@/lib/blog-meta';
import { BlogCover } from '@/components/blog/BlogCover';
import { BlogSearchStrip, BlogShopLinks } from '@/components/blog/BlogShop';
import { getProductosDesdePOS } from '@/lib/pos-api';
import { getTireLabel } from '@/lib/tire-labels';

export default async function VeranoVsAllSeasonArticle() {
  const productos = await getProductosDesdePOS('arguello');
  const pirelliProducts = productos?.filter(p => p.brand.toLowerCase() === 'pirelli' && p.imageUrl && p.enStock) || [];
  const grenlanderProducts = productos?.filter(p => p.brand.toLowerCase() === 'grenlander' && p.imageUrl && p.enStock) || [];

  let verano = null;
  let allSeason = null;

  for (const p of pirelliProducts) {
    const match = grenlanderProducts.find(g => 
      g.size.width === p.size.width && 
      g.size.profile === p.size.profile && 
      g.size.rim === p.size.rim
    );
    if (match) {
      verano = p;
      allSeason = match;
      break;
    }
  }

  // Fallback si no hay coincidencia exacta
  if (!verano || !allSeason) {
    verano = pirelliProducts[0];
    allSeason = grenlanderProducts[0];
  }

  const veranoLabel = verano ? getTireLabel(verano.slug) : null;
  const allSeasonLabel = allSeason ? getTireLabel(allSeason.slug) : null;

  return (
    <>
    <article className="max-w-3xl mx-auto pt-12 px-4 sm:px-6 lg:px-8 prose lg:prose-xl">
      <Link href="/blog" className="text-navy-600 hover:underline mb-8 inline-block">&larr; Volver al blog</Link>
      
      <h1 className="text-4xl font-extrabold mb-6 text-slate-800">Neumáticos de Verano vs. All-Season: ¿Qué te conviene en Argentina?</h1>
      <div className="not-prose -mx-4 mb-8 sm:mx-0">
        <BlogCover image={blogMeta("verano-vs-allseason").cover} priority sizes="(min-width: 768px) 768px, 100vw" className="aspect-[16/9] sm:rounded-2xl" />
        <div className="mt-5 px-4 sm:px-0"><BlogShopLinks slug="verano-vs-allseason" /></div>
      </div>
      
      <p className="mb-4">Si estás por cambiar las cubiertas de tu auto o camioneta, es probable que hayas escuchado los términos <strong>"Summer" (Verano)</strong> y <strong>"All-Season" (Todas las estaciones o Mixtos)</strong>. A simple vista, parecen solo etiquetas de marketing, pero la realidad es que el compuesto de goma y el dibujo cambian drásticamente el comportamiento de tu vehículo.</p>
      
      <p className="mb-8">En Argentina tenemos una variedad de climas enorme, pero ¿qué deberías elegir si vivís en la ciudad, viajás a la costa o te vas al sur en invierno? ¡Te lo contamos!</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Neumáticos de Verano: Los reyes del asfalto caliente</h2>
      
      <p className="mb-4">Contrario a lo que su nombre indica, no son solo "para cuando hace calor". Se llaman de verano porque están diseñados para operar de forma óptima a temperaturas superiores a los <strong>7°C</strong>.</p>
      
      <p className="mb-4">Su compuesto de caucho es más duro para no derretirse con el asfalto caliente. Tienen menos surcos, lo que les da una superficie de contacto mayor con el piso.</p>
      
      <strong className="block mb-2">Ventajas:</strong>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Menor distancia de frenado en piso seco.</li>
        <li>Son súper silenciosos.</li>
        <li>Menor resistencia a la rodadura (gastás menos combustible).</li>
        <li>Excelente evacuación de agua para evitar el <em>aquaplaning</em>.</li>
      </ul>
      
      <strong className="block mb-2">Desventajas:</strong>
      <ul className="list-disc pl-6 mb-8 space-y-2">
        <li>Si baja la temperatura de los 7°C, la goma se endurece como piedra y pierde muchísimo agarre.</li>
        <li>¡Prohibidos en hielo o nieve!</li>
      </ul>
      
      <p className="mb-4">Mirá este ejemplo de un excelente neumático de Pirelli, una marca premium que suele destacarse en compuestos de verano. Elegimos la medida <strong>{verano?.size.width}/{verano?.size.profile} R{verano?.size.rim}</strong> para esta comparación:</p>
      
      {verano && (
        <div className="my-8 not-prose">
          <ProductBlock 
            title={verano.model} 
            brand={verano.brand}
            description="Neumático premium diseñado para brindar máximo confort, agarre extremo en seco y precisión de manejo. Ideal para autos de alta gama o para quienes buscan un manejo seguro en ruta."
            price={verano.price}
            decibels={veranoLabel?.noiseDb || 71}
            wetGrip={veranoLabel?.wetGripClass || "B"}
            fuelEfficiency={veranoLabel?.energyClass || "C"}
            imageUrl={verano.imageUrl}
          />
        </div>
      )}
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Neumáticos All-Season: El comodín de todas las rutas</h2>
      
      <p className="mb-4">Los All-Season buscan el punto intermedio. Su compuesto de goma es más flexible, lo que les permite mantener sus propiedades tanto en verano (sin desgastarse tan rápido) como en invierno (sin cristalizarse por el frío extremo).</p>
      
      <p className="mb-4">El dibujo de la banda de rodadura es más "agresivo", con más canales y laminillas microscópicas diseñadas para morder la nieve ligera o el barro leve.</p>
      
      <strong className="block mb-2">Ventajas:</strong>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Versatilidad pura: te sirven para el calor porteño y para la escarcha matutina de la Patagonia (mientras no sea una tormenta de nieve extrema).</li>
        <li>Te ahorran tener que comprar dos juegos de neumáticos y cambiarlos cada temporada.</li>
      </ul>
      
      <strong className="block mb-2">Desventajas:</strong>
      <ul className="list-disc pl-6 mb-8 space-y-2">
        <li>Hacen un poco más de ruido al rodar que los de verano.</li>
        <li>Al no ser especialistas, no frenan <em>tan</em> rápido en piso seco caliente como uno de verano, ni traccionan <em>tan</em> bien en nieve profunda como uno 100% de invierno.</li>
      </ul>
      
      <p className="mb-4">Un gran ejemplo de un All-Season versátil que siempre recomendamos, de la marca Grenlander:</p>
      
      {allSeason && (
        <div className="my-8 not-prose">
          <ProductBlock 
            title={allSeason.model} 
            brand={allSeason.brand}
            description="La solución inteligente para moverte en la ciudad y hacer viajes ocasionales a zonas frías. Cuenta con canales profundos para drenaje y un compuesto que resiste bien las bajas temperaturas sin perder confort, con una relación precio-calidad insuperable."
            price={allSeason.price}
            decibels={allSeasonLabel?.noiseDb || 72}
            wetGrip={allSeasonLabel?.wetGripClass || "C"}
            fuelEfficiency={allSeasonLabel?.energyClass || "C"}
            imageUrl={allSeason.imageUrl}
          />
        </div>
      )}
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Conclusión: ¿Cuál compro?</h2>
      
      <ul className="list-disc pl-6 mb-8 space-y-2">
        <li>Si vivís en el centro del país, usás el auto para ir al trabajo, ir al súper y hacer algún viaje a la costa o a Córdoba en vacaciones, <strong>el neumático de Verano</strong> es para vos. Va a ser más silencioso, más barato y te va a gastar menos nafta.</li>
        <li>Si vivís en la Patagonia, o cruzás regularmente la cordillera, y querés evitar el dolor de cabeza de poner cadenas por unas heladas ligeras, andá por los <strong>All-Season</strong>.</li>
      </ul>
      
      <p className="mb-8 font-semibold">¡Pasá por nuestra gomería de Argüello y te asesoramos con la opción exacta para tu rodado!</p>

      <CatalogWidget title="Ofertas recomendadas" limit={4} />
    </article>
    <BlogSearchStrip slug="verano-vs-allseason" />
    <div className="pb-12" />
    </>
  );
}
