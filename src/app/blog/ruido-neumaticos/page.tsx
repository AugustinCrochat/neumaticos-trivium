import { ProductBlock } from '@/components/blog/ProductBlock';
import { CatalogWidget } from '@/components/blog/CatalogWidget';
import Link from 'next/link';
import { blogMeta } from '@/lib/blog-meta';
import { BlogCover } from '@/components/blog/BlogCover';
import { BlogSearchStrip, BlogShopLinks } from '@/components/blog/BlogShop';
import { getProductosDesdePOS } from '@/lib/pos-api';
import { getTireLabel } from '@/lib/tire-labels';

export default async function RuidoNeumaticosArticle() {
  const productos = await getProductosDesdePOS('arguello');
  const pirelliProducts = productos?.filter(p => p.brand.toLowerCase() === 'pirelli' && p.imageUrl && p.enStock) || [];
  const grenlanderProducts = productos?.filter(p => p.brand.toLowerCase() === 'grenlander' && p.imageUrl && p.enStock) || [];

  let pirelli = null;
  let grenlander = null;

  for (const p of pirelliProducts) {
    const match = grenlanderProducts.find(g => 
      g.size.width === p.size.width && 
      g.size.profile === p.size.profile && 
      g.size.rim === p.size.rim
    );
    if (match) {
      pirelli = p;
      grenlander = match;
      break;
    }
  }

  // Fallback si no hay coincidencia exacta de medida
  if (!pirelli || !grenlander) {
    pirelli = pirelliProducts[0];
    grenlander = grenlanderProducts[0];
  }

  const pirelliLabel = pirelli ? getTireLabel(pirelli.slug) : null;
  const grenlanderLabel = grenlander ? getTireLabel(grenlander.slug) : null;

  return (
    <>
    <article className="max-w-3xl mx-auto pt-12 px-4 sm:px-6 lg:px-8 prose lg:prose-xl">
      <Link href="/blog" className="text-navy-600 hover:underline mb-8 inline-block">&larr; Volver al blog</Link>
      
      <h1 className="text-4xl font-extrabold mb-6 text-slate-800">¿Sabías que tus neumáticos hablan? Hablemos de los Decibeles y el Ruido al Rodar</h1>
      <div className="not-prose -mx-4 mb-8 sm:mx-0">
        <BlogCover image={blogMeta("ruido-neumaticos").cover} priority sizes="(min-width: 768px) 768px, 100vw" className="aspect-[16/9] sm:rounded-2xl" />
        <div className="mt-5 px-4 sm:px-0"><BlogShopLinks slug="ruido-neumaticos" /></div>
      </div>
      
      <p className="mb-4">¡Hola a todos! Hoy quiero hablarles de algo que muchas veces pasamos por alto cuando compramos cubiertas nuevas: <strong>el ruido</strong>.</p>
      
      <p className="mb-4">Sí, así como lo escuchás (y valga la redundancia). Cuando venís a la gomería, lo primero que miramos juntos es la medida, si es para asfalto o para tierra, y por supuesto, el precio. Pero, ¿alguna vez te pusiste a pensar en los decibeles (dB) que genera ese neumático al rodar?</p>
      
      <p className="mb-8">A velocidades medias y altas, el zumbido de las cubiertas rozando el asfalto es, en muchos casos, ¡más fuerte que el propio motor de tu auto!</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">¿Cómo se mide este ruido? (Y por qué 3 decibeles es un MONTÓN)</h2>
      
      <p className="mb-4">A nivel mundial (y sobre todo con el etiquetado europeo que solemos ver en las ruedas importadas), el ruido se clasifica así:</p>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Clase A (Menos de 71 dB):</strong> Son un susurro. Súper silenciosos.</li>
        <li><strong>Clase B (Nivel medio):</strong> Cumplen con lo justo, no te van a volver loco en la ruta.</li>
        <li><strong>Clase C (Más de 72 dB):</strong> Son bastante ruidosos, y de hecho, superan los nuevos límites permitidos en Europa.</li>
      </ul>
      
      <p className="mb-8">Acá viene el dato loco: la escala de decibeles no es lineal. <strong>Un aumento de solo 3 dB significa que el ruido externo se DUPLICA.</strong> Así que pasar de un neumático de 68 dB a uno de 71 dB es literalmente el doble de ruido. ¡Tremendo!</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">¿Y qué pasa en Argentina con las regulaciones de ruido?</h2>
      
      <p className="mb-4">Seguro te preguntás si acá te pueden hacer una multa por tener ruedas ruidosas. La realidad es que en <strong>Argentina no existe una ley que mida únicamente el ruido del neumático</strong>.</p>
      
      <p className="mb-4">Lo que sí tenemos es la Ley de Tránsito (Ley 24.449) y leyes locales que miden la <strong>contaminación acústica total del vehículo</strong>. Es decir, si tu auto en conjunto (motor, escape y ruedas) supera los decibeles permitidos para tu modelo, podrías tener problemas. Pero al momento de fabricar o importar, nos guiamos por las normas IRAM (113320 y 113321), que se enfocan mucho más en la seguridad y la resistencia que en si la cubierta te deja escuchar la radio tranquilo.</p>
      
      <p className="mb-8">De todas formas, para los que hacemos mucha ruta, elegir una cubierta silenciosa es una inversión en paz mental.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Algunos de los neumáticos que tenemos y cuánto ruido hacen</h2>
      
      <p className="mb-4">Para que te des una idea de cómo se ve esto en la práctica, comparamos dos neumáticos <strong>de la misma medida ({grenlander?.size.width}/{grenlander?.size.profile} R{grenlander?.size.rim})</strong> de nuestro stock, con sus precios reales y etiquetas europeas.</p>
      
      {grenlander && (
        <div className="my-8 not-prose">
          <ProductBlock 
            title={grenlander.model} 
            brand={grenlander.brand}
            description="Una excelente opción que demuestra que no hace falta gastar una fortuna para tener un neumático silencioso. Cumple con exigentes estándares europeos ofreciendo un andar muy confortable en la ciudad."
            price={grenlander.price}
            decibels={grenlanderLabel?.noiseDb || 71}
            wetGrip={grenlanderLabel?.wetGripClass || "C"}
            fuelEfficiency={grenlanderLabel?.energyClass || "C"}
            imageUrl={grenlander.imageUrl}
          />
        </div>
      )}
      
      <p className="mb-8">Como podés ver, la marca Grenlander sorprende con niveles de ruido muy contenidos, ideales si sos de los que viaja en familia y quiere ir charlando sin levantar la voz.</p>
      
      {pirelli && (
        <div className="my-8 not-prose">
          <ProductBlock 
            title={pirelli.model} 
            brand={pirelli.brand}
            description="Un clásico y referente de la industria. Pirelli invierte millones en desarrollo para ofrecer cubiertas de altísima performance y diseño de banda de rodadura optimizado."
            price={pirelli.price}
            decibels={pirelliLabel?.noiseDb || 72}
            wetGrip={pirelliLabel?.wetGripClass || "B"}
            fuelEfficiency={pirelliLabel?.energyClass || "C"}
            imageUrl={pirelli.imageUrl}
          />
        </div>
      )}
      
      <p className="mb-8 font-semibold">¿Qué te pareció esta info? La próxima vez que vengas a cambiar las gomas, acordate de preguntarnos por los decibeles. ¡Te esperamos en nuestra sucursal de Argüello!</p>

      <CatalogWidget title="Neumáticos recomendados" limit={4} />
    </article>
    <BlogSearchStrip slug="ruido-neumaticos" />
    <div className="pb-12" />
    </>
  );
}
