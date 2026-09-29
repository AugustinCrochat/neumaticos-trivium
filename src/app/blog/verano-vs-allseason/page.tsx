import { ProductBlock } from '@/components/blog/ProductBlock';
import Link from 'next/link';

export default function VeranoVsAllSeasonArticle() {
  return (
    <article className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 prose lg:prose-xl">
      <Link href="/blog" className="text-blue-600 hover:underline mb-8 inline-block">&larr; Volver al blog</Link>
      
      <h1 className="text-4xl font-extrabold mb-6">Neumáticos de Verano vs. All-Season: ¿Qué te conviene en Argentina?</h1>
      
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
      
      <p className="mb-4">Mirá este ejemplo de un excelente neumático de verano:</p>
      
      <div className="my-8 not-prose">
        <ProductBlock 
          title="Continental PremiumContact 6" 
          brand="Continental"
          description="Neumático de verano premium diseñado para brindar máximo confort, agarre extremo en seco y bajo nivel de ruido. Ideal para autos de alta gama o para quienes buscan un manejo deportivo pero seguro en ruta."
          price={285000}
          decibels={71}
          wetGrip="A"
          fuelEfficiency="C"
        />
      </div>
      
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
      
      <p className="mb-4">Un gran ejemplo de un All-Season que siempre recomendamos en la gomería:</p>
      
      <div className="my-8 not-prose">
        <ProductBlock 
          title="Pirelli Cinturato All Season Plus" 
          brand="Pirelli"
          description="La solución inteligente para moverte en la ciudad y hacer viajes ocasionales a zonas frías. Cuenta con canales más profundos para drenaje y un compuesto que resiste bien las bajas temperaturas sin perder confort."
          price={270000}
          decibels={73}
          wetGrip="B"
          fuelEfficiency="C"
        />
      </div>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Conclusión: ¿Cuál compro?</h2>
      
      <ul className="list-disc pl-6 mb-8 space-y-2">
        <li>Si vivís en el centro del país, usás el auto para ir al trabajo, ir al súper y hacer algún viaje a la costa o a Córdoba en vacaciones, <strong>el neumático de Verano</strong> es para vos. Va a ser más silencioso, más barato y te va a gastar menos nafta.</li>
        <li>Si vivís en la Patagonia, o cruzás regularmente la cordillera, y querés evitar el dolor de cabeza de poner cadenas por unas heladas ligeras, andá por los <strong>All-Season</strong>.</li>
      </ul>
      
      <p className="mb-8 font-semibold">¡Pasá por nuestra gomería y te asesoramos con la opción exacta para tu rodado!</p>
    </article>
  );
}
