import { ProductBlock } from '@/components/blog/ProductBlock';
import Link from 'next/link';

export default function RuidoNeumaticosArticle() {
  return (
    <article className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 prose lg:prose-xl">
      <Link href="/blog" className="text-blue-600 hover:underline mb-8 inline-block">&larr; Volver al blog</Link>
      
      <h1 className="text-4xl font-extrabold mb-6">¿Sabías que tus neumáticos hablan? Hablemos de los Decibeles y el Ruido al Rodar</h1>
      
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
      
      <p className="mb-4">Para que te des una idea de cómo se ve esto en la práctica, te dejo un par de ejemplos de cubiertas que podés encontrar en nuestro local.</p>
      
      <div className="my-8 not-prose">
        <ProductBlock 
          title="Michelin Primacy 4" 
          brand="Michelin"
          description="El rey del confort. Un neumático de verano pensado para autos de turismo que ofrece una frenada excelente en mojado y, sobre todo, un andar súper silencioso."
          price={245000}
          decibels={68}
          wetGrip="A"
          fuelEfficiency="C"
        />
      </div>
      
      <p className="mb-8">Como podés ver, el Primacy 4 está en los 68 dB. Es ideal si sos de los que viaja en familia y quiere ir charlando sin levantar la voz.</p>
      
      <div className="my-8 not-prose">
        <ProductBlock 
          title="Pirelli Scorpion ATR" 
          brand="Pirelli"
          description="Un clásico para las camionetas. Es un neumático mixto (All-Terrain) que se banca la tierra y el barro, pero que lógicamente, hace un poco más de ruido en el asfalto."
          price={310000}
          decibels={74}
          wetGrip="C"
          fuelEfficiency="D"
        />
      </div>
      
      <p className="mb-8">En el caso del Scorpion ATR, subimos a los 74 dB. Al tener tacos más grandes para el barro, el golpe contra el pavimento se hace notar un poco más. ¡Es el precio a pagar por la aventura!</p>
      
      <p className="mb-8 font-semibold">¿Qué te pareció esta info? La próxima vez que vengas a cambiar las gomas, acordate de preguntarnos por los decibeles. ¡Te esperamos!</p>
    </article>
  );
}
