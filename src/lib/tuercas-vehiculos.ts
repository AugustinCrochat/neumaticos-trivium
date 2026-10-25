import type { Accessory } from "./types";

export type TuercaVehiculo = {
  marca: string;
  /** Sin modelo = compatible con toda la marca (ej. "BMW" en la 66030). */
  modelo?: string;
};

// Compatibilidad estructurada por tuerca antirrobo, para poder matchear con
// el selector de vehículo sin depender de buscar texto libre dentro de la
// descripcion. Curado a mano a partir de esas mismas descripciones (ver
// scripts/add-accesorio-fotos-batch.mjs en pos-neumaticos). marca/modelo
// deben coincidir con pos-neumaticos/src/lib/vehiculos.json cuando ese
// modelo existe ahí — algunos (Marea, Doblo, C5 Picasso, Explorer) no están
// todavía en esa lista, quedan cargados igual para el día que se agreguen.
export const TUERCAS_VEHICULOS: Record<string, TuercaVehiculo[]> = {
  // ANTIRROBO FIAT PREMIUM Z3 (66010)
  "4020001": [
    { marca: "Fiat", modelo: "Idea" },
    { marca: "Fiat", modelo: "Linea" },
    { marca: "Fiat", modelo: "Marea" },
    { marca: "Fiat", modelo: "Uno" },
    { marca: "Fiat", modelo: "Stilo" },
    { marca: "Fiat", modelo: "Strada" },
  ],
  // ANTIRROBO VW AMAROK PREMIUM Z3 (66020)
  "4020002": [
    { marca: "Renault", modelo: "Laguna" },
    { marca: "Volkswagen", modelo: "Amarok" },
    { marca: "Peugeot", modelo: "Expert" },
  ],
  // ANTIRROBO AMAROK LLANTA CHAPA (66021) — misma Amarok, versión para llanta de chapa original.
  "4020003": [
    { marca: "Volkswagen", modelo: "Amarok" },
  ],
  // ANTIRROBO VW GOL PREMIUM Z3 (66030)
  "4020004": [
    { marca: "Volkswagen", modelo: "Gol" },
    { marca: "Volkswagen", modelo: "Saveiro" },
    { marca: "Volkswagen", modelo: "Voyage" },
    { marca: "Volkswagen", modelo: "Up!" },
    { marca: "BMW" },
    { marca: "Mercedes-Benz" },
  ],
  // ANTIRROBO RENAULT PREMIUM Z3 (66040) — "Volvo 850" no está en la lista del
  // POS; se agrega igual y getAllVehicleOptions lo suma al desplegable.
  "4020005": [
    { marca: "Renault", modelo: "Clio" },
    { marca: "Renault", modelo: "Megane" },
    { marca: "Renault", modelo: "Logan" },
    { marca: "Volvo", modelo: "850" },
  ],
  // ANTIRROBO CORSA PREMIUM Z3 (66080) — Corsa figura en el nombre del producto
  // pero no en la descripción del POS, por eso se agrega acá a mano.
  "4020006": [
    { marca: "Suzuki", modelo: "Fun" },
    { marca: "Renault", modelo: "Clio" },
    { marca: "Renault", modelo: "Megane" },
    { marca: "Renault", modelo: "Sandero" },
    { marca: "Renault", modelo: "Duster" },
    { marca: "Chevrolet", modelo: "Corsa" },
    { marca: "Chevrolet", modelo: "Celta" },
    { marca: "Chevrolet", modelo: "Agile" },
    { marca: "Chevrolet", modelo: "Vectra" },
    { marca: "Chevrolet", modelo: "Astra" },
  ],
  // ANTIRROBO FIAT 500/DOBLO PREMIUM Z3 (66090)
  "4020007": [
    { marca: "Fiat", modelo: "500" },
    { marca: "Fiat", modelo: "Qubo" },
    { marca: "Fiat", modelo: "Bravo" },
    { marca: "Fiat", modelo: "Doblo" },
    { marca: "Citroen", modelo: "C3 Aircross" },
    { marca: "Citroen", modelo: "C4" },
    { marca: "Citroen", modelo: "C5 Picasso" },
  ],
  // ANTIRROBO PALIO ADVENTURE PREMIUM Z3 (66091)
  "4020008": [
    { marca: "Fiat", modelo: "Punto" },
    { marca: "Fiat", modelo: "Palio" },
    { marca: "Fiat", modelo: "Toro" },
  ],
  // ANTIRROBO PALIO/SIENA PREMIUM Z3 (66110)
  "4020009": [
    { marca: "Fiat", modelo: "Palio" },
    { marca: "Fiat", modelo: "Siena" },
    { marca: "Alfa Romeo" },
  ],
  // ANTIRROBO FIESTA/KA PREMIUM Z3 (66160)
  "4020011": [
    { marca: "Ford", modelo: "Fiesta" },
    { marca: "Ford", modelo: "Ka" },
    { marca: "Ford", modelo: "Focus" },
    { marca: "Ford", modelo: "Mondeo" },
  ],
  // ANTIRROBO FORD FOCUS/MONDEO Z3 LINEA PREMIUM (66170)
  "4020012": [
    { marca: "Ford", modelo: "Fiesta" },
    { marca: "Ford", modelo: "Focus" },
    { marca: "Ford", modelo: "Mondeo" },
  ],
  // ANTIRROBO CHEV. AVEO/SPIN PREMIUM Z3 (66280) — la descripción también
  // menciona "Sonica" (typo de Sonic) y "Spark", pero Spark no existe en la
  // lista de vehículos del POS.
  "4020013": [
    { marca: "Chevrolet", modelo: "Sonic" },
    { marca: "Chevrolet", modelo: "Spark" },
    { marca: "Chevrolet", modelo: "Cruze" },
    { marca: "Chevrolet", modelo: "Aveo" },
    { marca: "Chevrolet", modelo: "Spin" },
    { marca: "Chevrolet", modelo: "Blazer" },
    { marca: "Chevrolet", modelo: "Captiva" },
    { marca: "Chevrolet", modelo: "Tracker" },
  ],
  // ANTIRROBO ONIX/RANGER NVA PREMIUM Z3 (66281)
  "4020014": [
    { marca: "Ford", modelo: "Ranger" },
    { marca: "Chevrolet", modelo: "Onix" },
    { marca: "Chevrolet", modelo: "S10" },
  ],
  // ANTIRROBO TRACKER M/NUEVO (66282)
  "4020015": [
    { marca: "Chevrolet", modelo: "Tracker" },
  ],
  // ANTIRROBO VW BORA VENTO PREMIUM Z3 (66290)
  "4020016": [
    { marca: "Volkswagen", modelo: "Bora" },
    { marca: "Volkswagen", modelo: "Fox" },
    { marca: "Volkswagen", modelo: "Golf" },
    { marca: "Volkswagen", modelo: "Beetle" },
    { marca: "Volkswagen", modelo: "Passat" },
    { marca: "Volkswagen", modelo: "Scirocco" },
    { marca: "Volkswagen", modelo: "Sharan" },
    { marca: "Volkswagen", modelo: "Suran" },
    { marca: "Volkswagen", modelo: "Tiguan" },
    { marca: "Volkswagen", modelo: "Touareg" },
    { marca: "Volkswagen", modelo: "Vento" },
    { marca: "Audi" },
    { marca: "Seat", modelo: "Leon" },
    { marca: "Seat", modelo: "Toledo" },
  ],
  // ANTIRROBO JOURNEY/KIA/ PREMIUM Z3 (66300) — "Rover" es toda la marca y no
  // existe en la lista del POS.
  "4020017": [
    { marca: "Chery", modelo: "Tiggo" },
    { marca: "Dodge", modelo: "Journey" },
    { marca: "Rover" },
    { marca: "Kia" },
  ],
  // ANTIRROBO RANGER PREMIUM Z3 (66310)
  "4020018": [
    { marca: "Ford", modelo: "Explorer" },
    { marca: "Ford", modelo: "Ranger" },
    { marca: "Jeep", modelo: "Cherokee" },
    { marca: "Dodge", modelo: "Dakota" },
  ],
  // ANTIRROBO PEUGEOT PREMIUM Z3 (66330)
  "4020019": [
    { marca: "Peugeot", modelo: "206" },
    { marca: "Peugeot", modelo: "306" },
    { marca: "Peugeot", modelo: "207" },
    { marca: "Peugeot", modelo: "208" },
    { marca: "Peugeot", modelo: "307" },
    { marca: "Peugeot", modelo: "308" },
    { marca: "Peugeot", modelo: "407" },
    { marca: "Peugeot", modelo: "607" },
    { marca: "Peugeot", modelo: "3008" },
    { marca: "Peugeot", modelo: "5008" },
    { marca: "Citroen", modelo: "Xsara" },
    { marca: "Citroen", modelo: "Berlingo" },
  ],
  // ANTIRROBO C4/PEUGEOT PREMIUM Z3 (66340)
  "4020020": [{ marca: "Peugeot" }, { marca: "Citroen" }],
  // ANTIRROBO TOYOTA A/PLANO PREMIUM Z3 (66390)
  "4020021": [
    { marca: "Toyota", modelo: "Corolla" },
    { marca: "Toyota", modelo: "Etios" },
    { marca: "Toyota", modelo: "Hilux" },
    { marca: "Toyota", modelo: "RAV4" },
  ],
  // ANTIRROBO NISSAN TIIDA PREMIUM Z3 (66420)
  "4020023": [
    { marca: "Renault", modelo: "Koleos" },
    { marca: "Nissan", modelo: "March" },
    { marca: "Nissan", modelo: "Tiida" },
    { marca: "Nissan", modelo: "Sentra" },
    { marca: "Nissan", modelo: "Frontier" },
  ],
  // ANTIRROBO ECOSPORT 5 TCAS. PREMIUM (66430)
  "4020024": [
    { marca: "Honda", modelo: "CR-V" },
    { marca: "Ford", modelo: "EcoSport" },
    { marca: "Chevrolet", modelo: "Spin" },
  ],
};

/**
 * El modelo del auto coincide con el de la tuerca si es el mismo o una variante
 * suya ("Corsa Classic" y "Corsa Wagon" cuentan para "Corsa"); una entrada sin
 * modelo vale para toda la marca.
 */
function coincide(c: TuercaVehiculo, marca: string, modelo: string): boolean {
  if (c.marca !== marca) return false;
  return !c.modelo || c.modelo === modelo || modelo.startsWith(`${c.modelo} `);
}

/** Todas las tuercas que declaran compatibilidad con el auto, con stock primero. */
export function getCompatibleAccessories(marca: string, modelo: string, accesorios: Accessory[]): Accessory[] {
  return accesorios
    .filter((accessory) => {
      const compatibles = accessory.codigoTango ? TUERCAS_VEHICULOS[accessory.codigoTango] : undefined;
      return !!compatibles?.some((c) => coincide(c, marca, modelo));
    })
    .sort((a, b) => Number(b.enStock) - Number(a.enStock) || a.price - b.price);
}

export function getCompatibleAccessory(marca: string, modelo: string, accesorios: Accessory[]): Accessory | null {
  return getCompatibleAccessories(marca, modelo, accesorios)[0] ?? null;
}

/** Modelos compatibles de una tuerca, agrupados por marca, para mostrarlos en su ficha. */
export function modelosCompatibles(codigoTango: string | null | undefined): { marca: string; modelos: string[] }[] {
  const lista = codigoTango ? TUERCAS_VEHICULOS[codigoTango] : undefined;
  if (!lista) return [];
  const porMarca = new Map<string, string[]>();
  for (const c of lista) {
    const actuales = porMarca.get(c.marca) ?? [];
    if (c.modelo) actuales.push(c.modelo);
    porMarca.set(c.marca, actuales);
  }
  return [...porMarca.entries()].map(([marca, modelos]) => ({ marca, modelos }));
}
