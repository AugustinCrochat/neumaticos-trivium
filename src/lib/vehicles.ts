import allVehicles from "./vehiculos.json";

export type VehicleDBEntry = {
  brand: string;
  model: string;
  sizes: {
    w: string;
    p: string;
    r: string;
    /** Trim/versión dentro de una generación, ej. "GLS", "Highline". */
    version?: string;
    /** Nombre de la generación, ej. "Corolla XI". Ausente = dato no separado por generación todavía. */
    generation?: string;
    /** Rango de años de esa generación en el mercado argentino, ej. "2014-2019". */
    years?: string;
  }[];
};

/**
 * Orden de popularidad para los resúmenes truncados ("Usado en: ...", la
 * descripción meta de una medida): sin esto, `vehiclesUsingSize` devuelve
 * alfabético y el resumen de 3-5 autos podía mostrar una marca rara antes que
 * el Hilux o el Amarok, que es lo que la mayoría de la gente reconoce de un
 * vistazo.
 *
 * Es una lista curada a mano en base al mercado argentino en general (patrón
 * más o menos estable de los rankings de patentamiento de ACARA), no un dato
 * en vivo — no hay fuente de ventas reales en este repo. Si en el local se ve
 * que otro modelo se pregunta más seguido, mover esa entrada más arriba.
 * `"Marca Modelo"` tiene que coincidir exacto con `brand`+`model` en
 * VEHICLE_DB de más abajo.
 */
const ORDEN_POPULARIDAD = [
  "Toyota Hilux",
  "Volkswagen Amarok",
  "Fiat Cronos",
  "Peugeot 208",
  "Renault Kwid",
  "Chevrolet Onix",
  "Chevrolet Onix Plus",
  "Toyota Corolla Cross",
  "Fiat Toro",
  "Ford Ranger",
  "Citroen C3",
  "Fiat Pulse",
  "Renault Duster",
  "Volkswagen T-Cross",
  "Volkswagen Taos",
  "Chevrolet Tracker",
  "Nissan Kicks",
  "Jeep Compass",
  "Peugeot 2008",
  "Renault Sandero",
  "Renault Sandero Stepway",
  "Volkswagen Nivus",
  "Chevrolet Montana",
  "Volkswagen Gol Trend",
  "Volkswagen Polo",
  "Toyota Corolla",
  "Renault Logan",
  "Renault Kangoo",
  "Nissan Frontier",
  "Fiat Mobi",
  "Jeep Renegade",
  "Volkswagen Gol",
  "Ford EcoSport",
  "Fiat Argo",
];

/** Reordena una lista de `VehicleUsingSize` poniendo primero los modelos de
    `ORDEN_POPULARIDAD`, en ese orden, y dejando el resto como venían (ver
    `vehiclesUsingSize`, que ya los entrega alfabético). Pensada para
    resúmenes truncados; el listado completo de una medida sigue alfabético
    porque ahí lo que importa es que alguien encuentre su auto rápido, no que
    los primeros sean los más comunes. */
export function sortVehiclesByPopularity<T extends { brand: string; model: string }>(
  vehiculos: T[]
): T[] {
  const rango = (v: T) => {
    const i = ORDEN_POPULARIDAD.indexOf(`${v.brand} ${v.model}`);
    return i === -1 ? ORDEN_POPULARIDAD.length : i;
  };
  return [...vehiculos].sort((a, b) => rango(a) - rango(b));
}

export const VEHICLE_DB: VehicleDBEntry[] = [
  // Alfa Romeo
  { brand: "Alfa Romeo", model: "147", sizes: [{ w: "195", p: "60", r: "15", version: "1.6/1.9 base", generation: "147", years: "2001-2010" }, { w: "205", p: "55", r: "16", version: "2.0 TS / Selespeed", generation: "147", years: "2001-2010" }] },
  { brand: "Alfa Romeo", model: "156", sizes: [{ w: "205", p: "60", r: "15", version: "2.0 TS base", generation: "156", years: "1999-2005" }, { w: "205", p: "55", r: "16", version: "2.5 V6 Sport", generation: "156", years: "1999-2005" }] },
  { brand: "Alfa Romeo", model: "Giulia", sizes: [{ w: "225", p: "50", r: "17", version: "2.0T 200", generation: "Giulia", years: "2018-2023" }, { w: "245", p: "35", r: "19", version: "Quadrifoglio - Delantero", generation: "Giulia", years: "2018-2023" }, { w: "285", p: "30", r: "19", version: "Quadrifoglio - Trasero", generation: "Giulia", years: "2018-2023" }] },
  { brand: "Alfa Romeo", model: "Giulietta", sizes: [{ w: "225", p: "45", r: "17", version: "Distinctive", generation: "Giulietta", years: "2011-2020" }, { w: "225", p: "40", r: "18", version: "Quadrifoglio Verde", generation: "Giulietta", years: "2011-2020" }] },
  { brand: "Alfa Romeo", model: "Mito", sizes: [{ w: "195", p: "55", r: "16", version: "1.4 Progression", generation: "Mito", years: "2010-2016" }, { w: "215", p: "40", r: "18", version: "T-Jet QV", generation: "Mito", years: "2010-2016" }] },
  { brand: "Alfa Romeo", model: "Stelvio", sizes: [{ w: "235", p: "60", r: "18", version: "2.0T 200", generation: "Stelvio", years: "2018-2024" }, { w: "255", p: "45", r: "20", version: "Quadrifoglio - Delantero", generation: "Stelvio", years: "2018-2024" }, { w: "285", p: "40", r: "20", version: "Quadrifoglio - Trasero", generation: "Stelvio", years: "2018-2024" }] },

  // Audi
  { brand: "Audi", model: "A1", sizes: [{ w: "215", p: "45", r: "16", version: "Attraction", generation: "A1 8X", years: "2011-2018" }, { w: "215", p: "40", r: "17", version: "S-Line / 1.4 TFSI", generation: "A1 8X", years: "2011-2018" }] },
  { brand: "Audi", model: "A3", sizes: [{ w: "205", p: "55", r: "16", version: "Base", generation: "A3 8V/8Y", years: "2013-2024" }, { w: "225", p: "45", r: "17", version: "S-Line", generation: "A3 8V/8Y", years: "2013-2024" }, { w: "225", p: "40", r: "18", version: "S3 / RS3" }] },
  { brand: "Audi", model: "A4", sizes: [{ w: "225", p: "55", r: "16", version: "Base", generation: "A4 B8", years: "2009-2016" }, { w: "225", p: "50", r: "17", version: "S-Line", generation: "A4 B8", years: "2009-2016" }, { w: "245", p: "40", r: "18", version: "45 TFSI S-Line", generation: "A4 B9", years: "2017-2024" }] },
  { brand: "Audi", model: "A5", sizes: [{ w: "225", p: "50", r: "17", version: "Base", generation: "A5 B9", years: "2018-2024" }, { w: "255", p: "35", r: "19", version: "45 TFSI S-Line", generation: "A5 B9", years: "2018-2024" }] },
  { brand: "Audi", model: "A6", sizes: [{ w: "225", p: "55", r: "17", version: "Base", generation: "A6 C7/C8", years: "2012-2024" }, { w: "245", p: "45", r: "19", version: "55 TFSI S-Line", generation: "A6 C8", years: "2019-2024" }] },
  { brand: "Audi", model: "Q2", sizes: [{ w: "215", p: "55", r: "17", version: "Base / S-Tronic", generation: "Q2", years: "2017-2022" }] },
  { brand: "Audi", model: "Q3", sizes: [{ w: "235", p: "55", r: "18", version: "Base 35 TFSI", generation: "Q3 F3", years: "2020-2024" }, { w: "235", p: "50", r: "19", version: "40 Quattro S-Line", generation: "Q3 F3", years: "2020-2024" }] },
  { brand: "Audi", model: "Q5", sizes: [{ w: "235", p: "65", r: "17", version: "2.0 TFSI base", generation: "Q5 8R", years: "2009-2017" }, { w: "235", p: "60", r: "18", version: "45 TFSI S-Line", generation: "Q5 FY", years: "2018-2024" }] },
  { brand: "Audi", model: "Q7", sizes: [{ w: "235", p: "60", r: "18", version: "3.0 TDI base", generation: "Q7 4L", years: "2007-2015" }, { w: "285", p: "45", r: "20", version: "55 TFSI S-Line", generation: "Q7 4M", years: "2016-2024" }] },
  { brand: "Audi", model: "Q8", sizes: [{ w: "285", p: "45", r: "21", version: "55 TFSI Quattro", generation: "Q8", years: "2019-2024" }] },
  { brand: "Audi", model: "TT", sizes: [{ w: "245", p: "40", r: "18", version: "2.0 TFSI Coupe", generation: "TT 8J", years: "2009-2016" }] },

  // BAIC
  { brand: "BAIC", model: "BJ40", sizes: [{ w: "265", p: "65", r: "17" }] },
  { brand: "BAIC", model: "X35", sizes: [{ w: "215", p: "50", r: "17" }] },
  { brand: "BAIC", model: "X55", sizes: [{ w: "215", p: "50", r: "17", generation: "X55 (1ra gen)", years: "2018-2023" }, { w: "225", p: "55", r: "19", generation: "X55 II", years: "2024-presente" }] },

  // BMW
  { brand: "BMW", model: "Serie 1", sizes: [{ w: "225", p: "45", r: "17", version: "118i Advantage" }, { w: "205", p: "60", r: "15", version: "120i (E87)" }] },
  { brand: "BMW", model: "Serie 2", sizes: [{ w: "205", p: "60", r: "16", version: "220i Active Tourer" }, { w: "225", p: "40", r: "18", version: "220i Coupe M Sport" }] },
  { brand: "BMW", model: "Serie 3", sizes: [{ w: "225", p: "50", r: "17", version: "320i", generation: "Serie 3 F30/G20", years: "2012-2024" }, { w: "225", p: "45", r: "18", version: "330i M Sport - Delantero", generation: "Serie 3 G20", years: "2019-2024" }, { w: "255", p: "40", r: "18", version: "330i M Sport - Trasero", generation: "Serie 3 G20", years: "2019-2024" }] },
  { brand: "BMW", model: "Serie 4", sizes: [{ w: "225", p: "50", r: "17", version: "430i Coupe" }, { w: "225", p: "45", r: "18", version: "440i Gran Coupe" }] },
  { brand: "BMW", model: "Serie 5", sizes: [{ w: "245", p: "50", r: "18", version: "530i Sportline" }, { w: "245", p: "40", r: "19", version: "540i M Sport - Delantero" }, { w: "275", p: "35", r: "19", version: "540i M Sport - Trasero" }] },
  { brand: "BMW", model: "Serie 7", sizes: [{ w: "245", p: "55", r: "17", version: "730d" }, { w: "245", p: "40", r: "20", version: "750i M Sport - Delantero" }, { w: "275", p: "35", r: "20", version: "750i M Sport - Trasero" }] },
  { brand: "BMW", model: "X1", sizes: [{ w: "225", p: "55", r: "17", version: "sDrive20i" }, { w: "225", p: "50", r: "18", version: "xDrive25i" }] },
  { brand: "BMW", model: "X2", sizes: [{ w: "225", p: "55", r: "17", version: "sDrive20i" }, { w: "225", p: "40", r: "20", version: "xDrive M35i" }] },
  { brand: "BMW", model: "X3", sizes: [{ w: "245", p: "55", r: "17", version: "xDrive20i" }, { w: "245", p: "45", r: "20", version: "M40i - Delantero" }, { w: "275", p: "40", r: "20", version: "M40i - Trasero" }] },
  { brand: "BMW", model: "X4", sizes: [{ w: "245", p: "50", r: "18", version: "xDrive28i X Line" }, { w: "245", p: "45", r: "20", version: "M40i - Delantero" }, { w: "275", p: "40", r: "20", version: "M40i - Trasero" }] },
  { brand: "BMW", model: "X5", sizes: [{ w: "255", p: "50", r: "19", version: "xDrive30d" }, { w: "275", p: "45", r: "20", version: "xDrive40i M Sport - Delantero" }, { w: "305", p: "40", r: "20", version: "xDrive40i M Sport - Trasero" }] },
  { brand: "BMW", model: "X6", sizes: [{ w: "275", p: "45", r: "20", version: "40i M Sport - Delantero" }, { w: "315", p: "35", r: "21", version: "40i M Sport - Trasero" }] },
  { brand: "BMW", model: "Z4", sizes: [{ w: "225", p: "45", r: "17", version: "sDrive30i" }] },

  // BYD
  { brand: "BYD", model: "Dolphin", sizes: [{ w: "185", p: "55", r: "16" }] },
  { brand: "BYD", model: "Song Plus", sizes: [{ w: "225", p: "60", r: "18" }] },
  { brand: "BYD", model: "Tang", sizes: [{ w: "265", p: "45", r: "21" }] },
  { brand: "BYD", model: "Yuan Plus", sizes: [{ w: "215", p: "60", r: "17" }] },

  // Changan
  { brand: "Changan", model: "CS15", sizes: [{ w: "205", p: "55", r: "16" }] },
  { brand: "Changan", model: "CS35", sizes: [{ w: "215", p: "55", r: "17" }] },
  { brand: "Changan", model: "CS35 Plus", sizes: [{ w: "215", p: "55", r: "17" }] },
  { brand: "Changan", model: "CS55", sizes: [{ w: "225", p: "50", r: "19" }] },
  { brand: "Changan", model: "CS75", sizes: [{ w: "225", p: "60", r: "18" }] },
  { brand: "Changan", model: "MD201", sizes: [{ w: "175", p: "70", r: "14" }] },

  // Chery
  { brand: "Chery", model: "Arrizo 5", sizes: [{ w: "205", p: "55", r: "16" }] },
  { brand: "Chery", model: "Face", sizes: [{ w: "175", p: "60", r: "14" }] },
  { brand: "Chery", model: "QQ", sizes: [{ w: "155", p: "65", r: "13", version: "Light / Basic" }, { w: "155", p: "65", r: "14", version: "Confort" }] },
  { brand: "Chery", model: "Skin", sizes: [{ w: "195", p: "55", r: "15" }] },
  { brand: "Chery", model: "Tiggo", sizes: [{ w: "215", p: "60", r: "17" }] },
  { brand: "Chery", model: "Tiggo 2", sizes: [{ w: "205", p: "55", r: "16" }] },
  { brand: "Chery", model: "Tiggo 3", sizes: [{ w: "215", p: "65", r: "16" }] },
  { brand: "Chery", model: "Tiggo 4", sizes: [{ w: "215", p: "60", r: "17" }] },
  { brand: "Chery", model: "Tiggo 4 Pro", sizes: [{ w: "215", p: "60", r: "17", version: "Comfort" }, { w: "215", p: "55", r: "18", version: "Luxury" }] },
  { brand: "Chery", model: "Tiggo 5", sizes: [{ w: "225", p: "65", r: "17" }] },
  { brand: "Chery", model: "Tiggo 7 Pro", sizes: [{ w: "225", p: "60", r: "18" }] },
  { brand: "Chery", model: "Tiggo 8", sizes: [{ w: "235", p: "55", r: "18" }] },

  // Chevrolet
  { brand: "Chevrolet", model: "Agile", sizes: [{ w: "185", p: "60", r: "15", version: "LS / LT", generation: "Agile (base Corsa)", years: "2009-2015" }, { w: "195", p: "55", r: "16", version: "LTZ / Effect", generation: "Agile (base Corsa)", years: "2009-2015" }] },
  { brand: "Chevrolet", model: "Astra", sizes: [{ w: "195", p: "60", r: "15", version: "GL / GLS", generation: "Astra G (Brasil)", years: "1998-2006" }, { w: "205", p: "55", r: "16", version: "GSI / GTX", generation: "Astra G (Brasil)", years: "1998-2006" }] },
  { brand: "Chevrolet", model: "Aveo", sizes: [{ w: "185", p: "60", r: "14", version: "LS (sedán, México)", generation: "Aveo G3", years: "2008-2017" }, { w: "185", p: "55", r: "15", version: "LT (sedán, México)", generation: "Aveo G3", years: "2008-2017" }] },
  { brand: "Chevrolet", model: "Camaro", sizes: [{ w: "245", p: "45", r: "20", version: "SS - Delantero", generation: "5ta gen", years: "2013-2016" }, { w: "275", p: "40", r: "20", version: "SS - Trasero", generation: "5ta gen", years: "2013-2016" }, { w: "245", p: "40", r: "20", version: "1SS / 2SS - Delantero", generation: "6ta gen", years: "2019-2022" }, { w: "275", p: "35", r: "20", version: "1SS / 2SS - Trasero", generation: "6ta gen", years: "2019-2022" }] },
  { brand: "Chevrolet", model: "Celta", sizes: [{ w: "165", p: "70", r: "13", version: "LS" }, { w: "175", p: "65", r: "14", version: "LT" }] },
  { brand: "Chevrolet", model: "Chevy", sizes: [{ w: "195", p: "70", r: "14", version: "Std / SS / Malibú", generation: "Chevy (sedán/coupé basado en Nova, no el \"Chevy\" mexicano del Corsa)", years: "1969-1978" }] },
  { brand: "Chevrolet", model: "Classic", sizes: [{ w: "165", p: "70", r: "13", version: "LS (Base)" }, { w: "185", p: "60", r: "14", version: "LT / GLS" }] },
  { brand: "Chevrolet", model: "Corsa", sizes: [{ w: "165", p: "70", r: "13", version: "GL / LS (Base)", generation: "Corsa B", years: "1997-2002" }, { w: "185", p: "60", r: "14", version: "GLS / LT", generation: "Corsa B", years: "1997-2002" }] },
  { brand: "Chevrolet", model: "Cruze", sizes: [{ w: "205", p: "60", r: "16", version: "LT", generation: "1ra gen (J300)", years: "2011-2016" }, { w: "215", p: "50", r: "17", version: "LTZ / Premier", generation: "1ra gen (J300)", years: "2011-2016" }, { w: "205", p: "60", r: "16", version: "LT", generation: "2da gen", years: "2016-2019" }, { w: "215", p: "50", r: "17", version: "LTZ / Premier", generation: "2da gen", years: "2016-2019" }] },
  { brand: "Chevrolet", model: "Equinox", sizes: [{ w: "225", p: "65", r: "17", version: "LT FWD" }, { w: "235", p: "50", r: "19", version: "Premier AWD" }] },
  { brand: "Chevrolet", model: "Meriva", sizes: [{ w: "185", p: "60", r: "15" }] },
  { brand: "Chevrolet", model: "Montana", sizes: [{ w: "185", p: "60", r: "14", version: "LS / LT", generation: "1ra gen (base Corsa)", years: "2003-2010" }, { w: "185", p: "60", r: "15", version: "LS / LT", generation: "2da gen (base Agile)", years: "2010-2021" }, { w: "195", p: "55", r: "16", version: "LTZ", generation: "2da gen (base Agile)", years: "2010-2021" }, { w: "185", p: "65", r: "15", version: "LS / LT", generation: "3ra gen (pickup global)", years: "2023-presente" }, { w: "205", p: "60", r: "16", version: "Premier", generation: "3ra gen (pickup global)", years: "2023-presente" }] },
  { brand: "Chevrolet", model: "Onix", sizes: [{ w: "185", p: "70", r: "14", version: "Joy / LS", generation: "1ra gen", years: "2012-2019" }, { w: "185", p: "65", r: "15", version: "LT", generation: "1ra gen", years: "2012-2019" }, { w: "195", p: "55", r: "16", version: "LTZ", generation: "1ra gen", years: "2012-2019" }, { w: "185", p: "70", r: "14", version: "Base", generation: "2da gen", years: "2019-presente" }, { w: "185", p: "65", r: "15", version: "LT", generation: "2da gen", years: "2019-presente" }, { w: "195", p: "55", r: "16", version: "Premier", generation: "2da gen", years: "2019-presente" }] },
  { brand: "Chevrolet", model: "Onix Plus", sizes: [{ w: "185", p: "65", r: "15", version: "LT", generation: "2da gen Onix sedán", years: "2020-presente" }, { w: "195", p: "55", r: "16", version: "LTZ / Premier", generation: "2da gen Onix sedán", years: "2020-presente" }] },
  { brand: "Chevrolet", model: "Prisma", sizes: [{ w: "185", p: "70", r: "14", version: "Joy / LS", generation: "1ra gen Onix sedán", years: "2013-2019" }, { w: "185", p: "65", r: "15", version: "LT", generation: "1ra gen Onix sedán", years: "2013-2019" }, { w: "195", p: "55", r: "16", version: "LTZ / Premier", generation: "1ra gen Onix sedán", years: "2013-2019" }] },
  { brand: "Chevrolet", model: "S10", sizes: [{ w: "205", p: "75", r: "15", version: "LS / DLX", generation: "Carrocería antigua", years: "1995-2011" }, { w: "245", p: "70", r: "16", version: "LS", generation: "2da/3ra gen (base Colorado)", years: "2012-presente" }, { w: "255", p: "65", r: "17", version: "LT", generation: "2da/3ra gen (base Colorado)", years: "2012-presente" }, { w: "265", p: "60", r: "18", version: "LTZ / High Country", generation: "2da/3ra gen (base Colorado)", years: "2012-presente" }] },
  { brand: "Chevrolet", model: "Spin", sizes: [{ w: "195", p: "65", r: "15", version: "LT / Activ" }, { w: "205", p: "60", r: "16", version: "LTZ / Premier" }] },
  { brand: "Chevrolet", model: "Tracker", sizes: [{ w: "205", p: "60", r: "16", version: "LT (Trax-based)", generation: "1ra gen", years: "2013-2020" }, { w: "215", p: "60", r: "16", version: "LT", generation: "2da gen", years: "2020-presente" }, { w: "215", p: "55", r: "17", version: "MT / AT", generation: "2da gen", years: "2020-presente" }, { w: "215", p: "55", r: "18", version: "Premier", generation: "2da gen", years: "2020-presente" }] },
  { brand: "Chevrolet", model: "Trailblazer", sizes: [{ w: "265", p: "60", r: "18", version: "LTZ / Premier / High Country", generation: "2da gen (base Colorado)", years: "2012-2020" }] },
  { brand: "Chevrolet", model: "Vectra", sizes: [{ w: "195", p: "65", r: "15", version: "GL", generation: "2da gen (Brasil)", years: "1996-2007" }, { w: "205", p: "55", r: "16", version: "GLS / CD", generation: "2da gen (Brasil)", years: "1996-2007" }, { w: "215", p: "50", r: "17", version: "GSi / GTX", generation: "2da gen (Brasil)", years: "1996-2007" }] },
  { brand: "Chevrolet", model: "Zafira", sizes: [{ w: "195", p: "65", r: "15", version: "GL / GLS", generation: "Zafira A", years: "2001-2012" }, { w: "205", p: "55", r: "16", version: "CD", generation: "Zafira A", years: "2001-2012" }] },

  // Chrysler
  { brand: "Chrysler", model: "Caravan", sizes: [{ w: "215", p: "65", r: "15" }, { w: "215", p: "65", r: "16" }] },
  { brand: "Chrysler", model: "Grand Caravan", sizes: [{ w: "225", p: "65", r: "16" }, { w: "225", p: "65", r: "17" }] },
  { brand: "Chrysler", model: "Neon", sizes: [{ w: "185", p: "65", r: "14" }, { w: "195", p: "55", r: "15" }] },
  { brand: "Chrysler", model: "PT Cruiser", sizes: [{ w: "195", p: "65", r: "15" }, { w: "205", p: "55", r: "16" }] },

  // Citroën
  { brand: "Citroen", model: "Berlingo", sizes: [{ w: "175", p: "65", r: "14", version: "Furgón" }, { w: "185", p: "65", r: "15", version: "Multispace" }] },
  { brand: "Citroen", model: "C3", sizes: [{ w: "175", p: "65", r: "14", version: "Base", generation: "C3 I", years: "2003-2009" }, { w: "185", p: "60", r: "15", version: "Origine / Tendance", generation: "C3 II (restyle)", years: "2012-2017" }, { w: "195", p: "55", r: "16", version: "Exclusive", generation: "C3 II (restyle)", years: "2012-2017" }, { w: "185", p: "65", r: "15", version: "Live / Feel", generation: "C3 IV (Brasil)", years: "2024-presente" }] },
  { brand: "Citroen", model: "C3 Aircross", sizes: [{ w: "215", p: "65", r: "16", generation: "C3 Aircross (CMP, Brasil)", years: "2024-presente" }] },
  { brand: "Citroen", model: "C4", sizes: [{ w: "205", p: "55", r: "16", version: "Origine" }, { w: "225", p: "45", r: "17", version: "Tendance / Exclusive" }] },
  { brand: "Citroen", model: "C4 Lounge", sizes: [{ w: "205", p: "55", r: "16", version: "Origine / Tendance", years: "2013-2020" }, { w: "225", p: "45", r: "17", version: "Exclusive", years: "2013-2020" }] },
  { brand: "Citroen", model: "C4 Cactus", sizes: [{ w: "205", p: "55", r: "17", version: "Feel / Feel Pack / Shine", years: "2019-2023" }] },
  { brand: "Citroen", model: "C4 Picasso", sizes: [{ w: "205", p: "60", r: "16" }, { w: "215", p: "50", r: "17" }] },
  { brand: "Citroen", model: "C5 Aircross", sizes: [{ w: "225", p: "55", r: "19" }] },
  { brand: "Citroen", model: "Jumper", sizes: [{ w: "215", p: "75", r: "16" }, { w: "225", p: "75", r: "16" }] },
  { brand: "Citroen", model: "Jumpy", sizes: [{ w: "215", p: "65", r: "16" }] },
  { brand: "Citroen", model: "Xsara", sizes: [{ w: "185", p: "65", r: "14" }, { w: "195", p: "55", r: "15" }] },
  { brand: "Citroen", model: "Xsara Picasso", sizes: [{ w: "185", p: "65", r: "15" }] },

  // DFSK
  { brand: "DFSK", model: "C31", sizes: [{ w: "185", p: "70", r: "14" }] },
  { brand: "DFSK", model: "C32", sizes: [{ w: "185", p: "70", r: "14" }] },
  { brand: "DFSK", model: "Glory 580", sizes: [{ w: "225", p: "60", r: "17" }] },
  { brand: "DFSK", model: "K01H", sizes: [{ w: "165", p: "70", r: "13" }] },

  // Dodge
  { brand: "Dodge", model: "Durango", sizes: [{ w: "265", p: "60", r: "18" }, { w: "265", p: "50", r: "20" }] },
  { brand: "Dodge", model: "Journey", sizes: [{ w: "225", p: "65", r: "17", version: "SXT 2.4" }, { w: "225", p: "55", r: "19", version: "R/T 3.6" }] },
  { brand: "Dodge", model: "RAM", sizes: [{ w: "275", p: "60", r: "20" }] },

  // DS Automobiles
  { brand: "DS Automobiles", model: "DS 3", sizes: [{ w: "205", p: "45", r: "17" }] },
  { brand: "DS Automobiles", model: "DS 3 Crossback", sizes: [{ w: "215", p: "60", r: "17" }, { w: "215", p: "55", r: "18" }] },
  { brand: "DS Automobiles", model: "DS 4", sizes: [{ w: "225", p: "45", r: "19" }] },
  { brand: "DS Automobiles", model: "DS 7 Crossback", sizes: [{ w: "235", p: "50", r: "19" }, { w: "235", p: "45", r: "20" }] },

  // FAW
  { brand: "FAW", model: "N5", sizes: [{ w: "175", p: "65", r: "14" }] },
  { brand: "FAW", model: "X40", sizes: [{ w: "215", p: "55", r: "17" }] },

  // Fiat
  { brand: "Fiat", model: "125", sizes: [{ w: "155", p: "80", r: "13", version: "Standard", generation: "125", years: "1969-1982" }, { w: "175", p: "70", r: "13", version: "Mirafiori", generation: "125 Mirafiori", years: "1978-1982" }] },
  { brand: "Fiat", model: "128", sizes: [{ w: "145", p: "80", r: "13", generation: "128", years: "1971-1990" }] },
  { brand: "Fiat", model: "500", sizes: [{ w: "185", p: "55", r: "15", version: "Cult / Lounge", generation: "500 (2007-)", years: "2008-2020" }, { w: "195", p: "45", r: "16", version: "Sport / Cabrio / Abarth", generation: "500 (2007-)", years: "2008-2020" }] },
  { brand: "Fiat", model: "600", sizes: [{ w: "145", p: "80", r: "12", generation: "600 clásico", years: "1960-1982" }] },
  { brand: "Fiat", model: "Argo", sizes: [{ w: "185", p: "65", r: "15", version: "Drive 1.3", generation: "Argo", years: "2017-2023" }, { w: "195", p: "55", r: "16", version: "Precision / HGT", generation: "Argo", years: "2017-2023" }, { w: "205", p: "60", r: "15", version: "Trekking", generation: "Argo", years: "2019-2023" }, { w: "205", p: "50", r: "17", version: "HGT (opcional 17\")", generation: "Argo", years: "2019-2023" }, { w: "185", p: "65", r: "15", version: "Drive 1.3", generation: "Argo (restyling)", years: "2023-presente" }, { w: "195", p: "55", r: "16", version: "Precision / HGT", generation: "Argo (restyling)", years: "2023-presente" }] },
  { brand: "Fiat", model: "Cronos", sizes: [{ w: "185", p: "60", r: "15", version: "Like / Drive 1.3", generation: "Cronos", years: "2018-presente" }, { w: "195", p: "55", r: "16", version: "Precision 1.8", generation: "Cronos", years: "2018-presente" }, { w: "205", p: "45", r: "17", version: "Precision AT", generation: "Cronos (restyling)", years: "2023-presente" }] },
  { brand: "Fiat", model: "Ducato", sizes: [{ w: "215", p: "70", r: "15", version: "Furgón (Serie 4/5)", generation: "Ducato Series 4/5 (230/244)", years: "1994-2014" }, { w: "225", p: "75", r: "16", version: "Furgón / Minibus", generation: "Ducato (250)", years: "2014-presente" }, { w: "235", p: "65", r: "16", version: "Maxicargo / Combi", generation: "Ducato (250)", years: "2014-presente" }] },
  { brand: "Fiat", model: "Duna", sizes: [{ w: "165", p: "70", r: "13", version: "Base / S", generation: "Duna", years: "1987-1999" }, { w: "175", p: "70", r: "13", version: "SDL / Weekend", generation: "Duna", years: "1990-1999" }] },
  { brand: "Fiat", model: "Fastback", sizes: [{ w: "205", p: "50", r: "17", version: "Audace / Impetus", generation: "Fastback", years: "2022-presente" }, { w: "215", p: "45", r: "18", version: "Impetus (opcional) / Abarth", generation: "Fastback", years: "2022-presente" }] },
  { brand: "Fiat", model: "Fiorino", sizes: [{ w: "165", p: "70", r: "13", version: "Fiorino Uno-based (Fase 1/2/3)", generation: "Fiorino (Uno-based)", years: "1988-2013" }, { w: "175", p: "70", r: "14", version: "Furgón", generation: "Fiorino (III, Brasil)", years: "2014-presente" }] },
  { brand: "Fiat", model: "Freemont", sizes: [{ w: "225", p: "65", r: "17", version: "Precision / Emotion", generation: "Freemont", years: "2011-2016" }] },
  { brand: "Fiat", model: "Grand Siena", sizes: [{ w: "175", p: "65", r: "14", version: "Attractive", generation: "Grand Siena", years: "2013-2021" }, { w: "185", p: "60", r: "15", version: "Essence", generation: "Grand Siena", years: "2013-2021" }] },
  { brand: "Fiat", model: "Idea", sizes: [{ w: "175", p: "70", r: "14", version: "Attractive / ELX", generation: "Idea", years: "2006-2016" }, { w: "185", p: "60", r: "15", version: "Essence / HLX", generation: "Idea", years: "2010-2016" }, { w: "195", p: "60", r: "15", version: "Adventure", generation: "Idea", years: "2010-2016" }] },
  { brand: "Fiat", model: "Linea", sizes: [{ w: "195", p: "65", r: "15", version: "Essence", generation: "Linea", years: "2008-2016" }, { w: "205", p: "55", r: "16", version: "Absolute", generation: "Linea", years: "2013-2016" }] },
  { brand: "Fiat", model: "Mobi", sizes: [{ w: "175", p: "65", r: "14", version: "Easy / Like", generation: "Mobi", years: "2017-2021" }, { w: "175", p: "65", r: "14", version: "Trekking", generation: "Mobi (restyling)", years: "2022-presente" }] },
  { brand: "Fiat", model: "Palio", sizes: [{ w: "165", p: "70", r: "13", version: "EX / Fire (Fase 1/2)", generation: "Palio", years: "1996-2004" }, { w: "175", p: "70", r: "14", version: "Attractive / ELX (Fase 3, Nueva Palio)", generation: "Palio (restyling)", years: "2004-2017" }, { w: "185", p: "60", r: "15", version: "Essence / Sporting", generation: "Palio (restyling)", years: "2004-2017" }] },
  { brand: "Fiat", model: "Palio Weekend", sizes: [{ w: "165", p: "70", r: "13", version: "EX / Fire", generation: "Palio Weekend", years: "1997-2004" }, { w: "175", p: "70", r: "14", version: "Attractive / ELX", generation: "Palio Weekend (restyling)", years: "2004-2017" }, { w: "185", p: "60", r: "15", version: "Essence", generation: "Palio Weekend (restyling)", years: "2004-2017" }, { w: "205", p: "70", r: "15", version: "Adventure", generation: "Palio Weekend (restyling)", years: "2004-2017" }] },
  { brand: "Fiat", model: "Pulse", sizes: [{ w: "195", p: "60", r: "16", version: "Drive 1.3", generation: "Pulse", years: "2021-presente" }, { w: "205", p: "50", r: "17", version: "Audace / Impetus / Turbo", generation: "Pulse", years: "2021-presente" }] },
  { brand: "Fiat", model: "Punto", sizes: [{ w: "185", p: "65", r: "15", version: "Attractive", generation: "Punto (Grande Punto/Linea III)", years: "2007-2018" }, { w: "195", p: "55", r: "16", version: "Essence", generation: "Punto (Grande Punto/Linea III)", years: "2007-2018" }, { w: "205", p: "55", r: "16", version: "Sporting / Blackmotion", generation: "Punto (Grande Punto/Linea III)", years: "2012-2018" }] },
  { brand: "Fiat", model: "Siena", sizes: [{ w: "165", p: "70", r: "13", version: "EX / Fire", generation: "Siena", years: "1997-2004" }, { w: "175", p: "70", r: "14", version: "Attractive / ELX", generation: "Siena (restyling)", years: "2004-2013" }, { w: "185", p: "60", r: "15", version: "Essence / HLX", generation: "Siena (restyling)", years: "2004-2013" }] },
  { brand: "Fiat", model: "Strada", sizes: [{ w: "165", p: "70", r: "13", version: "Fase 1", generation: "Strada I", years: "1998-2004" }, { w: "175", p: "70", r: "14", version: "Working / Trekking", generation: "Strada II", years: "2004-2012" }, { w: "205", p: "60", r: "15", version: "Adventure", generation: "Strada II", years: "2004-2012" }, { w: "195", p: "65", r: "15", version: "Working / Endurance / Freedom", generation: "Strada III", years: "2012-2020" }, { w: "205", p: "55", r: "16", version: "Adventure / Volcano", generation: "Strada III", years: "2012-2020" }, { w: "195", p: "65", r: "15", version: "Endurance / Freedom", generation: "Strada IV", years: "2020-presente" }, { w: "205", p: "60", r: "15", version: "Volcano / Ranch", generation: "Strada IV", years: "2020-presente" }] },
  { brand: "Fiat", model: "Titano", sizes: [{ w: "265", p: "65", r: "17", version: "Freedom / Endurance", generation: "Titano", years: "2022-presente" }, { w: "265", p: "60", r: "18", version: "Volcano / Ranch", generation: "Titano", years: "2022-presente" }] },
  { brand: "Fiat", model: "Toro", sizes: [{ w: "215", p: "65", r: "16", version: "Freedom / Endurance", generation: "Toro", years: "2016-2021" }, { w: "225", p: "65", r: "17", version: "Volcano", generation: "Toro", years: "2016-2021" }, { w: "225", p: "60", r: "18", version: "Ranch / Volcano AT9", generation: "Toro", years: "2016-2021" }, { w: "215", p: "65", r: "16", version: "Freedom / Endurance", generation: "Toro (restyling)", years: "2021-presente" }, { w: "225", p: "65", r: "17", version: "Volcano", generation: "Toro (restyling)", years: "2021-presente" }, { w: "225", p: "60", r: "18", version: "Ranch / Ultra", generation: "Toro (restyling)", years: "2021-presente" }] },
  { brand: "Fiat", model: "Uno", sizes: [{ w: "155", p: "80", r: "13", version: "S / SL (Fase 1)", generation: "Uno (Fase 1)", years: "1984-1993" }, { w: "175", p: "70", r: "13", version: "Fire / SCR / Mille", generation: "Uno (Fase 2/3)", years: "1993-2000" }, { w: "185", p: "60", r: "14", version: "ELX", generation: "Uno (Fase 3, tardío)", years: "2000-2004" }, { w: "175", p: "65", r: "14", version: "Way / Attractive", generation: "Uno (Novo Uno)", years: "2010-2021" }] },
  { brand: "Fiat", model: "Uno Way", sizes: [{ w: "175", p: "70", r: "13", version: "Way (Fase 3)", generation: "Uno (Fase 3)", years: "2000-2010" }, { w: "175", p: "65", r: "14", version: "Way", generation: "Uno (Novo Uno)", years: "2010-2021" }] },

  // Ford
  { brand: "Ford", model: "Bronco", sizes: [{ w: "315", p: "70", r: "17", version: "Wildtrak Sasquatch", generation: "6ta gen (U725)", years: "2024-presente" }] },
  { brand: "Ford", model: "Bronco Sport", sizes: [{ w: "225", p: "65", r: "17", version: "Big Bend", generation: "1ra gen", years: "2021-2024" }, { w: "225", p: "60", r: "18", version: "Wildtrak", generation: "1ra gen", years: "2021-2024" }, { w: "225", p: "60", r: "18", version: "Big Bend", generation: "1ra gen facelift", years: "2025-presente" }, { w: "225", p: "65", r: "17", version: "Badlands", generation: "1ra gen facelift", years: "2025-presente" }] },
  { brand: "Ford", model: "EcoSport", sizes: [{ w: "195", p: "65", r: "15", version: "Base / Ambiente", generation: "1ra gen (Pacheco)", years: "2003-2012" }, { w: "195", p: "60", r: "15", version: "XLS / XLT", generation: "1ra gen (Pacheco)", years: "2003-2012" }, { w: "205", p: "65", r: "15", version: "S / SE", generation: "2da gen", years: "2013-2022" }, { w: "205", p: "60", r: "16", version: "Freestyle / SE Plus", generation: "2da gen", years: "2013-2022" }, { w: "205", p: "50", r: "17", version: "Titanium", generation: "2da gen", years: "2013-2022" }] },
  { brand: "Ford", model: "Edge", sizes: [{ w: "245", p: "50", r: "20" }] },
  { brand: "Ford", model: "F-100", sizes: [{ w: "235", p: "75", r: "15", version: "Standard", generation: "Carrocería clásica", years: "1961-1982" }, { w: "235", p: "85", r: "16", version: "XL", generation: "\"Cabezona\" Duty Diesel", years: "1988-1996" }, { w: "265", p: "75", r: "16", version: "XLT", generation: "\"Cabezona\" Duty Diesel", years: "1988-1996" }] },
  { brand: "Ford", model: "F-150", sizes: [{ w: "275", p: "55", r: "20", version: "Lariat 5.0L V8", generation: "P702", years: "2020-2021" }, { w: "275", p: "60", r: "20", version: "Lariat Luxury PowerBoost Hybrid", generation: "P702", years: "2022-presente" }] },
  { brand: "Ford", model: "Falcon", sizes: [{ w: "185", p: "80", r: "13", version: "Standard / Deluxe", generation: "Falcon I / restyle 1969", years: "1962-1972" }, { w: "195", p: "70", r: "14", version: "Deluxe / Futura (freno a disco)", generation: "Restyle 1969", years: "1969-1972" }, { w: "205", p: "70", r: "14", version: "Sprint", generation: "Sprint", years: "1973-1981" }, { w: "195", p: "70", r: "14", version: "Ghia / Deluxe tardío", generation: "Restyle 1978 / Ghia final", years: "1978-1991" }] },
  { brand: "Ford", model: "Fiesta", sizes: [{ w: "175", p: "70", r: "13", version: "CLX / Ghia", generation: "Fiesta (importado)", years: "1996-2002" }, { w: "175", p: "70", r: "13", version: "One / Max", generation: "Fiesta Max", years: "2003-2008" }, { w: "185", p: "65", r: "14", version: "Ambiente / Edge", generation: "Fiesta hatch (última gen importada)", years: "2018-2021" }, { w: "195", p: "55", r: "16", version: "SE / Titanium", generation: "Fiesta hatch (última gen importada)", years: "2018-2021" }] },
  { brand: "Ford", model: "Fiesta Kinetic", sizes: [{ w: "185", p: "60", r: "15", version: "S / SE", generation: "Fiesta Kinetic Design", years: "2009-2013" }, { w: "195", p: "50", r: "16", version: "Titanium", generation: "Fiesta Kinetic Design", years: "2009-2013" }, { w: "185", p: "60", r: "15", version: "S", generation: "Fiesta Kinetic Sedán", years: "2013-2019" }] },
  { brand: "Ford", model: "Focus", sizes: [{ w: "185", p: "65", r: "14", version: "CLX / Ambiente", generation: "Focus I", years: "1999-2004" }, { w: "195", p: "60", r: "15", version: "Ghia / Trend", generation: "Focus I", years: "1999-2004" }, { w: "195", p: "60", r: "15", version: "Ambiente / Edge", generation: "Focus II", years: "2005-2008" }, { w: "205", p: "55", r: "16", version: "Ghia / Trend / SE", generation: "Focus II / II Restyling", years: "2005-2012" }, { w: "205", p: "55", r: "16", version: "S / SE", generation: "Focus III", years: "2012-2018" }, { w: "215", p: "50", r: "17", version: "Titanium", generation: "Focus III", years: "2012-2018" }] },
  { brand: "Ford", model: "Fusion", sizes: [{ w: "225", p: "50", r: "17" }, { w: "235", p: "45", r: "18" }] },
  { brand: "Ford", model: "Ka", sizes: [{ w: "175", p: "70", r: "13", version: "Base / CLX", generation: "Ka (plataforma Fiesta Mk1)", years: "1997-2007" }, { w: "175", p: "65", r: "14", version: "Base / S", generation: "Ka facelift", years: "2008-2014" }, { w: "175", p: "65", r: "14", version: "S / SE", generation: "Ka+ (3ra gen)", years: "2015-2021" }, { w: "185", p: "55", r: "15", version: "SEL / Titanium", generation: "Ka+ (3ra gen)", years: "2015-2021" }] },
  { brand: "Ford", model: "Kuga", sizes: [{ w: "235", p: "55", r: "17", version: "SEL 4x2 / 4x4", generation: "Kuga II facelift", years: "2016-2019" }, { w: "235", p: "50", r: "18", version: "Titanium 4x4", generation: "Kuga II facelift", years: "2016-2019" }] },
  { brand: "Ford", model: "Maverick", sizes: [{ w: "225", p: "65", r: "17", version: "XLT / Lariat 2.0 EcoBoost", generation: "1ra gen (lanzamiento AR)", years: "2022-2023" }, { w: "225", p: "65", r: "17", version: "XLT", generation: "1ra gen facelift", years: "2024-presente" }, { w: "235", p: "65", r: "17", version: "Tremor", generation: "1ra gen facelift", years: "2024-presente" }] },
  { brand: "Ford", model: "Mustang", sizes: [{ w: "255", p: "40", r: "19", version: "GT Front" }, { w: "275", p: "40", r: "19", version: "GT Rear" }] },
  { brand: "Ford", model: "Ranger", sizes: [{ w: "255", p: "70", r: "16", version: "XL / XLS", generation: "T6 facelift", years: "2016-2022" }, { w: "265", p: "65", r: "17", version: "XLT / XLT AT", generation: "T6 facelift", years: "2016-2022" }, { w: "265", p: "60", r: "18", version: "FX4 / Limited", generation: "T6 facelift", years: "2016-2022" }, { w: "255", p: "70", r: "16", version: "XL", generation: "Next-Gen T6.2", years: "2023-presente" }, { w: "255", p: "70", r: "17", version: "XLS / XLT", generation: "Next-Gen T6.2", years: "2023-presente" }, { w: "255", p: "65", r: "18", version: "Limited", generation: "Next-Gen T6.2", years: "2023-presente" }, { w: "255", p: "55", r: "20", version: "Limited Plus", generation: "Next-Gen T6.2", years: "2023-presente" }] },
  { brand: "Ford", model: "Ranger Raptor", sizes: [{ w: "285", p: "70", r: "17", version: "2.0 Bi-Turbo Diesel", generation: "T6 1ra gen Raptor", years: "2019-2022" }, { w: "285", p: "70", r: "17", version: "3.0 V6 Nafta", generation: "Next-Gen T6.2 Raptor", years: "2024-presente" }] },
  { brand: "Ford", model: "Taunus", sizes: [{ w: "175", p: "70", r: "13", version: "Ghia" }, { w: "185", p: "70", r: "13", version: "GT / GT SP / GT SP5" }] },
  { brand: "Ford", model: "Territory", sizes: [{ w: "235", p: "55", r: "18", version: "SEL", generation: "2da gen (China/JMC, Brasil)", years: "2023-presente" }, { w: "235", p: "50", r: "19", version: "Titanium", generation: "2da gen (China/JMC, Brasil)", years: "2023-presente" }] },
  { brand: "Ford", model: "Transit", sizes: [{ w: "215", p: "75", r: "16" }] },

  // Foton
  { brand: "Foton", model: "Gratour", sizes: [{ w: "175", p: "70", r: "14" }] },
  { brand: "Foton", model: "Tunland", sizes: [{ w: "265", p: "70", r: "16" }, { w: "265", p: "65", r: "17" }, { w: "265", p: "60", r: "18", version: "G7" }] },

  // Geely
  { brand: "Geely", model: "515", sizes: [{ w: "185", p: "60", r: "15" }] },
  { brand: "Geely", model: "Emgrand 7", sizes: [{ w: "205", p: "55", r: "16" }] },
  { brand: "Geely", model: "Emgrand GS", sizes: [{ w: "215", p: "50", r: "17" }] },
  { brand: "Geely", model: "Emgrand X7 Sport", sizes: [{ w: "225", p: "65", r: "17" }] },
  { brand: "Geely", model: "GX3 Pro", sizes: [{ w: "205", p: "60", r: "16" }] },
  { brand: "Geely", model: "LC", sizes: [{ w: "165", p: "60", r: "14" }] },
  { brand: "Geely", model: "LC Cross", sizes: [{ w: "175", p: "65", r: "14" }] },

  // Great Wall
  { brand: "Great Wall", model: "Poer", sizes: [{ w: "265", p: "60", r: "18" }] },
  { brand: "Great Wall", model: "Wingle 5", sizes: [{ w: "235", p: "70", r: "16" }] },
  { brand: "Great Wall", model: "Wingle 6", sizes: [{ w: "235", p: "70", r: "16" }] },
  { brand: "Great Wall", model: "Wingle 7", sizes: [{ w: "245", p: "70", r: "16" }] },

  // Haval
  { brand: "Haval", model: "H1", sizes: [{ w: "205", p: "60", r: "16" }] },
  { brand: "Haval", model: "H2", sizes: [{ w: "235", p: "55", r: "18" }] },
  { brand: "Haval", model: "H6", sizes: [{ w: "235", p: "55", r: "19" }] },
  { brand: "Haval", model: "Jolion", sizes: [{ w: "215", p: "60", r: "17", version: "Deluxe" }, { w: "225", p: "55", r: "18", version: "Supreme" }] },

  // Honda
  { brand: "Honda", model: "Accord", sizes: [{ w: "225", p: "50", r: "17", version: "EXL", generation: "9na Gen (CR)", years: "2013-2015" }, { w: "235", p: "45", r: "18", version: "Advanced Hybrid", generation: "11va Gen", years: "2024-presente" }] },
  { brand: "Honda", model: "City", sizes: [{ w: "175", p: "65", r: "15", version: "LX", generation: "1ra Gen (GM2, Brasil)", years: "2009-2015" }, { w: "185", p: "55", r: "16", version: "EX / EXL", generation: "1ra Gen (GM2, Brasil)", years: "2009-2015" }] },
  { brand: "Honda", model: "Civic", sizes: [{ w: "195", p: "65", r: "15", version: "LXS", generation: "Gen 8 (FA/FD)", years: "2006-2011" }, { w: "205", p: "55", r: "16", version: "EXS", generation: "Gen 8 (FA/FD)", years: "2006-2011" }, { w: "205", p: "55", r: "16", version: "LXS / EXS", generation: "Gen 9 (FB)", years: "2012-2016" }, { w: "215", p: "50", r: "17", version: "EX / EXL / EXT", generation: "Gen 10", years: "2017-2021" }, { w: "215", p: "50", r: "17", version: "EXL", generation: "Gen 11", years: "2022-presente" }] },
  { brand: "Honda", model: "CR-V", sizes: [{ w: "225", p: "65", r: "17", version: "LX / EX", generation: "Gen 4 (RM)", years: "2012-2016" }, { w: "235", p: "65", r: "17", version: "LX / EX", generation: "Gen 5 (RW)", years: "2017-2022" }, { w: "235", p: "60", r: "18", version: "EXL / Touring", generation: "Gen 5 (RW)", years: "2017-2022" }, { w: "235", p: "60", r: "18", version: "LX / EX", generation: "Gen 6", years: "2023-presente" }, { w: "235", p: "55", r: "19", version: "EXL", generation: "Gen 6", years: "2023-presente" }] },
  { brand: "Honda", model: "Fit", sizes: [{ w: "175", p: "65", r: "15", version: "LX / EX", generation: "Gen 2 (GE/GP, Brasil)", years: "2009-2014" }, { w: "175", p: "65", r: "15", version: "LX", generation: "Gen 3 (GK, Brasil)", years: "2015-2020" }, { w: "185", p: "55", r: "16", version: "EXL", generation: "Gen 3 (GK, Brasil)", years: "2015-2020" }] },
  { brand: "Honda", model: "HR-V", sizes: [{ w: "215", p: "55", r: "17", version: "LX / EX / EXL", generation: "Gen 1 (RU)", years: "2015-2022" }, { w: "215", p: "60", r: "17", version: "LX / EXL", generation: "New HR-V (RV facelift, Brasil)", years: "2024-presente" }] },
  { brand: "Honda", model: "WR-V", sizes: [{ w: "195", p: "60", r: "16", version: "LX / EX / EXL", generation: "Gen 1", years: "2018-2025" }, { w: "215", p: "55", r: "17", version: "EXL", generation: "New WR-V", years: "2026-presente" }] },
  { brand: "Honda", model: "ZR-V", sizes: [{ w: "225", p: "55", r: "18", version: "Touring", generation: "Única gen. vendida en AR", years: "2023-presente" }] },

  // Hyundai
  { brand: "Hyundai", model: "Atos", sizes: [{ w: "155", p: "70", r: "13", version: "Base / GL", generation: "1997-2011 (incl. Atos Prime 1999-2008)" }] },
  { brand: "Hyundai", model: "Creta", sizes: [{ w: "205", p: "65", r: "16", version: "GL / normal (1.6 MPI)", generation: "2017-2021 (India-built)" }, { w: "215", p: "60", r: "17", version: "GLS / Safety+ (1.5 Smartstream)", generation: "2021-presente (All-new Creta)" }] },
  { brand: "Hyundai", model: "Elantra", sizes: [{ w: "205", p: "55", r: "16", version: "GLS Full Seguridad Premium (1.8)", generation: "2011-2016 (MD/UD)" }] },
  { brand: "Hyundai", model: "Genesis", sizes: [{ w: "225", p: "45", r: "18", version: "Coupe 2.0T / 3.8 V6 (delantero)", generation: "2013-2017 (Genesis Coupe, importado)" }, { w: "245", p: "45", r: "18", version: "Coupe 2.0T / 3.8 V6 (trasero)", generation: "2013-2017 (Genesis Coupe, importado)" }] },
  { brand: "Hyundai", model: "Grand i10", sizes: [{ w: "165", p: "65", r: "14", version: "GLS Hatch / Sedán (1.2 16V)", generation: "2015-presente" }] },
  { brand: "Hyundai", model: "H1", sizes: [{ w: "215", p: "70", r: "16" }] },
  { brand: "Hyundai", model: "i10", sizes: [{ w: "165", p: "65", r: "14" }] },
  { brand: "Hyundai", model: "i30", sizes: [{ w: "205", p: "55", r: "16", version: "GL" }, { w: "225", p: "45", r: "17", version: "GLS" }] },
  { brand: "Hyundai", model: "Santa Fe", sizes: [{ w: "235", p: "65", r: "17", version: "GLS 2.4", generation: "2007-2012 (CM)" }, { w: "235", p: "60", r: "18", version: "GLS 3.3 / Diesel", generation: "2007-2012 (CM)" }, { w: "235", p: "60", r: "18", version: "4x2 Nafta 2.4 6AT / 4x4 Diesel 2.2 8AT (7 asientos)", generation: "2019-2023 (TM, All-new Santa Fe)" }] },
  { brand: "Hyundai", model: "Tucson", sizes: [{ w: "215", p: "65", r: "16", version: "2.0 MPFi", generation: "2005-2009 (JM, primera gen.)" }, { w: "225", p: "60", r: "17", version: "GL", generation: "2010-2015 (LM) / 2016-2021 (TL)" }, { w: "225", p: "55", r: "18", version: "GLS Full Premium", generation: "2016-2021 (TL)" }] },
  { brand: "Hyundai", model: "Veloster", sizes: [{ w: "215", p: "45", r: "17", version: "GDI / 2.0 Tech", generation: "2012-2017 y 2019-2021 (All-new)" }, { w: "225", p: "40", r: "18", version: "Turbo / 1.6T Sport-Ultimate", generation: "2012-2017 y 2019-2021 (All-new)" }] },

  // Ika
  { brand: "Ika", model: "Torino", sizes: [{ w: "185", p: "80", r: "15", version: "S / L" }, { w: "195", p: "70", r: "15", version: "TS / TSX / ZX" }] },

  // ISUZU
  { brand: "ISUZU", model: "D-Max", sizes: [{ w: "245", p: "70", r: "16" }, { w: "255", p: "65", r: "17" }] },
  { brand: "ISUZU", model: "Pickup", sizes: [{ w: "215", p: "80", r: "16" }] },

  // JAC
  { brand: "JAC", model: "J4", sizes: [{ w: "185", p: "65", r: "15" }] },
  { brand: "JAC", model: "S2", sizes: [{ w: "195", p: "60", r: "16" }] },
  { brand: "JAC", model: "S3", sizes: [{ w: "205", p: "55", r: "16" }] },
  { brand: "JAC", model: "S5", sizes: [{ w: "225", p: "60", r: "17" }] },
  { brand: "JAC", model: "T6", sizes: [{ w: "245", p: "70", r: "16" }] },
  { brand: "JAC", model: "T8", sizes: [{ w: "265", p: "60", r: "18" }] },

  // Jaguar
  { brand: "Jaguar", model: "F-Pace", sizes: [{ w: "255", p: "55", r: "19", version: "2.0 TDI Prestige" }, { w: "255", p: "50", r: "20", version: "3.0 Supercharged R-Sport" }] },
  { brand: "Jaguar", model: "XE", sizes: [{ w: "225", p: "50", r: "17", version: "2.0T Pure" }, { w: "225", p: "40", r: "19", version: "2.0T R-Sport - Delantero" }, { w: "255", p: "35", r: "19", version: "2.0T R-Sport - Trasero" }] },
  { brand: "Jaguar", model: "XF", sizes: [{ w: "245", p: "45", r: "18", version: "2.0 Prestige" }, { w: "255", p: "35", r: "20", version: "3.0 S" }] },

  // Jeep
  { brand: "Jeep", model: "Cherokee", sizes: [{ w: "225", p: "60", r: "17", generation: "Cherokee KL", years: "2014-2018" }, { w: "225", p: "60", r: "18", version: "Limited / Trailhawk", generation: "Cherokee KL", years: "2014-2018" }] },
  { brand: "Jeep", model: "Commander", sizes: [{ w: "235", p: "50", r: "19" }] },
  { brand: "Jeep", model: "Compass", sizes: [{ w: "215", p: "60", r: "17", version: "Sport", generation: "Compass MP (facelift)", years: "2021-presente" }, { w: "225", p: "55", r: "18", version: "Longitude", generation: "Compass MP (facelift)", years: "2021-presente" }, { w: "235", p: "45", r: "19", version: "Limited / Serie-S / Blackhawk", generation: "Compass MP (facelift)", years: "2021-presente" }, { w: "215", p: "65", r: "17", version: "Trailhawk (diesel 4x4)", generation: "Compass MP (facelift)", years: "2021-presente" }, { w: "215", p: "65", r: "17", version: "Sport / Longitude", generation: "Compass MP", years: "2017-2021" }, { w: "225", p: "55", r: "18", version: "Limited / Trailhawk", generation: "Compass MP", years: "2017-2021" }] },
  { brand: "Jeep", model: "Gladiator", sizes: [{ w: "255", p: "70", r: "18" }, { w: "285", p: "70", r: "17" }] },
  { brand: "Jeep", model: "Grand Cherokee", sizes: [{ w: "265", p: "60", r: "18", version: "Laredo / Altitude" }, { w: "265", p: "50", r: "20", version: "Limited / Overland / Summit" }] },
  { brand: "Jeep", model: "Renegade", sizes: [{ w: "225", p: "55", r: "18", version: "Longitude / Sahara", generation: "Renegade BU (facelift)", years: "2022-presente" }, { w: "225", p: "60", r: "17", version: "Willys / Altitude", generation: "Renegade BU (facelift)", years: "2022-presente" }, { w: "215", p: "65", r: "16", version: "Sport", generation: "Renegade BU", years: "2015-2021" }, { w: "215", p: "60", r: "17", version: "Trailhawk", generation: "Renegade BU", years: "2015-2021" }, { w: "225", p: "55", r: "18", version: "Longitude / Limited", generation: "Renegade BU", years: "2015-2021" }] },
  { brand: "Jeep", model: "Wrangler", sizes: [{ w: "245", p: "75", r: "17", version: "Sport" }, { w: "255", p: "70", r: "18", version: "Sahara" }, { w: "285", p: "70", r: "17", version: "Rubicon" }] },

  // Jetour
  { brand: "Jetour", model: "Dashing", sizes: [{ w: "235", p: "55", r: "19" }] },
  { brand: "Jetour", model: "X70", sizes: [{ w: "235", p: "60", r: "18", version: "Comfort" }, { w: "255", p: "45", r: "20", version: "Luxury" }] },
  { brand: "Jetour", model: "X70 Plus", sizes: [{ w: "235", p: "55", r: "19" }] },

  // JMC
  { brand: "JMC", model: "Carrying", sizes: [{ w: "185", p: "75", r: "16" }] },
  { brand: "JMC", model: "Grand Avenue", sizes: [{ w: "265", p: "65", r: "17" }] },

  // Kia
  { brand: "Kia", model: "Carnival", sizes: [{ w: "235", p: "65", r: "17", version: "Full", generation: "2da gen (YP)", years: "2019-2020" }, { w: "235", p: "60", r: "18", version: "Full Premium / Full Premium T/C", generation: "2da gen (YP)", years: "2019-2020" }, { w: "235", p: "65", r: "17", version: "EX / SX", generation: "3ra gen (KA4)", years: "2023-2026" }] },
  { brand: "Kia", model: "Cerato", sizes: [{ w: "215", p: "45", r: "17", version: "EX", generation: "3ra gen (YD)", years: "2013-2018" }, { w: "225", p: "45", r: "17", version: "SX", generation: "3ra gen (YD)", years: "2013-2018" }, { w: "205", p: "55", r: "16", version: "EX", generation: "4ta gen (BD)", years: "2020-2026" }, { w: "225", p: "45", r: "17", version: "SX GT-Line", generation: "4ta gen (BD)", years: "2020-2026" }] },
  { brand: "Kia", model: "Picanto", sizes: [{ w: "165", p: "60", r: "14", generation: "2da gen (TA)", years: "2012-2017" }] },
  { brand: "Kia", model: "Rio", sizes: [{ w: "185", p: "65", r: "15", version: "EX", generation: "4ta gen (YB)", years: "2017-2020" }, { w: "205", p: "45", r: "17", version: "SX", generation: "4ta gen (YB)", years: "2017-2020" }] },
  { brand: "Kia", model: "Sorento", sizes: [{ w: "235", p: "65", r: "17", version: "Standard / Full", generation: "2da gen (XM)", years: "2010-2014" }, { w: "235", p: "60", r: "18", version: "Premium", generation: "2da/3ra gen (XM/UM)", years: "2010-2020" }, { w: "245", p: "50", r: "19", version: "GT Line", generation: "3ra gen facelift (UM)", years: "2018-2020" }] },
  { brand: "Kia", model: "Soul", sizes: [{ w: "195", p: "65", r: "15", version: "Classic", generation: "1ra gen (AM)", years: "2009-2013" }, { w: "205", p: "55", r: "16", version: "Pop", generation: "1ra gen (AM)", years: "2009-2013" }, { w: "225", p: "45", r: "18", version: "Rock", generation: "1ra gen (AM)", years: "2009-2013" }] },
  { brand: "Kia", model: "Sportage", sizes: [{ w: "215", p: "70", r: "16", version: "Basic", generation: "3ra gen (SL)", years: "2011-2015" }, { w: "225", p: "60", r: "17", version: "LX", generation: "3ra gen (SL)", years: "2011-2015" }, { w: "235", p: "55", r: "18", version: "EX", generation: "3ra gen (SL)", years: "2011-2015" }, { w: "225", p: "60", r: "17", version: "EX", generation: "4ta gen (QL)", years: "2016-2022" }, { w: "225", p: "55", r: "18", version: "GT-Line", generation: "4ta gen (QL)", years: "2016-2022" }, { w: "235", p: "55", r: "18", version: "EX / X-Line", generation: "5ta gen (NQ5)", years: "2023-2026" }] },

  // KyC
  { brand: "KyC", model: "Mamut", sizes: [{ w: "185", p: "70", r: "14" }] },

  // Land Rover
  { brand: "Land Rover", model: "Defender", sizes: [{ w: "255", p: "60", r: "20", version: "P400e HSE X-Dynamic", generation: "Defender (2020+)", years: "2020-2024" }] },
  { brand: "Land Rover", model: "Discovery", sizes: [{ w: "255", p: "55", r: "18", version: "4.0 V8 ES Auto" }] },
  { brand: "Land Rover", model: "Discovery Sport", sizes: [{ w: "235", p: "60", r: "18", version: "Si4 SE" }, { w: "235", p: "55", r: "19", version: "Si4 HSE" }] },
  { brand: "Land Rover", model: "Range Rover Evoque", sizes: [{ w: "235", p: "55", r: "19", version: "Si4 Dynamic", generation: "Evoque (2012-2018)", years: "2012-2018" }, { w: "235", p: "50", r: "20", version: "MHEV SE", generation: "Evoque (2019+)", years: "2019-2024" }] },
  { brand: "Land Rover", model: "Range Rover Velar", sizes: [{ w: "255", p: "50", r: "20", version: "2.0 S" }, { w: "265", p: "40", r: "22", version: "3.0 R-Dynamic" }] },

  // Lexus
  { brand: "Lexus", model: "ES", sizes: [{ w: "235", p: "45", r: "18", version: "300h Luxury" }] },
  { brand: "Lexus", model: "IS", sizes: [{ w: "235", p: "40", r: "19", version: "300 F-Sport - Delantero" }, { w: "265", p: "35", r: "19", version: "300 F-Sport - Trasero" }] },
  { brand: "Lexus", model: "NX", sizes: [{ w: "235", p: "50", r: "20", version: "350 F-Sport" }] },
  { brand: "Lexus", model: "RX", sizes: [{ w: "235", p: "50", r: "21", version: "350 F-Sport" }] },
  { brand: "Lexus", model: "UX", sizes: [{ w: "225", p: "50", r: "18", version: "250h" }] },

  // Lifan
  { brand: "Lifan", model: "Foison", sizes: [{ w: "175", p: "70", r: "14" }] },
  { brand: "Lifan", model: "Myway", sizes: [{ w: "215", p: "65", r: "16" }] },
  { brand: "Lifan", model: "X50", sizes: [{ w: "195", p: "60", r: "15" }] },
  { brand: "Lifan", model: "X60", sizes: [{ w: "215", p: "65", r: "16" }] },
  { brand: "Lifan", model: "X70", sizes: [{ w: "215", p: "60", r: "17" }] },

  // Mercedes-Benz
  { brand: "Mercedes-Benz", model: "Clase A", sizes: [{ w: "205", p: "60", r: "16", version: "A200 Style" }, { w: "225", p: "45", r: "18", version: "A250 AMG Line" }] },
  { brand: "Mercedes-Benz", model: "Clase B", sizes: [{ w: "205", p: "60", r: "16", version: "B200 Style" }] },
  { brand: "Mercedes-Benz", model: "Clase C", sizes: [{ w: "225", p: "50", r: "17", version: "C200 Avantgarde" }, { w: "225", p: "45", r: "18", version: "C300 AMG-Line - Delantero" }, { w: "245", p: "40", r: "18", version: "C300 AMG-Line - Trasero" }] },
  { brand: "Mercedes-Benz", model: "Clase E", sizes: [{ w: "245", p: "45", r: "17", version: "E350 Elegance (generación anterior)" }, { w: "245", p: "40", r: "19", version: "E400 4Matic AMG Line - Delantero" }, { w: "275", p: "35", r: "19", version: "E400 4Matic AMG Line - Trasero" }] },
  { brand: "Mercedes-Benz", model: "CLA", sizes: [{ w: "225", p: "45", r: "17", version: "CLA200" }, { w: "225", p: "40", r: "18", version: "CLA250" }] },
  { brand: "Mercedes-Benz", model: "GLA", sizes: [{ w: "235", p: "55", r: "18", version: "GLA200 Urban" }] },
  { brand: "Mercedes-Benz", model: "GLB", sizes: [{ w: "215", p: "65", r: "17", version: "GLB200 Advance" }] },
  { brand: "Mercedes-Benz", model: "GLC", sizes: [{ w: "235", p: "55", r: "19", version: "GLC300 4Matic - Delantero" }, { w: "255", p: "50", r: "19", version: "GLC300 4Matic - Trasero" }] },
  { brand: "Mercedes-Benz", model: "GLE", sizes: [{ w: "275", p: "50", r: "20", version: "GLE450 4Matic AMG-Line" }] },
  { brand: "Mercedes-Benz", model: "Sprinter", sizes: [{ w: "225", p: "75", r: "16" }] },
  { brand: "Mercedes-Benz", model: "Vito", sizes: [{ w: "205", p: "65", r: "16", version: "Furgón" }, { w: "225", p: "55", r: "17", version: "Tourer" }] },

  // MG
  { brand: "MG", model: "GT", sizes: [{ w: "205", p: "55", r: "16" }, { w: "215", p: "50", r: "17" }] },
  { brand: "MG", model: "HS", sizes: [{ w: "235", p: "50", r: "18" }] },
  { brand: "MG", model: "ZS", sizes: [{ w: "215", p: "60", r: "16" }, { w: "215", p: "55", r: "17" }, { w: "215", p: "50", r: "18" }] },

  // Mini
  { brand: "Mini", model: "Clubman", sizes: [{ w: "205", p: "55", r: "16", version: "Pepper" }, { w: "225", p: "40", r: "18", version: "Chili S" }] },
  { brand: "Mini", model: "Cooper", sizes: [{ w: "195", p: "55", r: "16", version: "Classic" }, { w: "205", p: "40", r: "18", version: "JCW" }] },
  { brand: "Mini", model: "Countryman", sizes: [{ w: "205", p: "55", r: "16", version: "1.6 Auto (1ra gen)" }, { w: "245", p: "45", r: "19", version: "S All4 Favoured (2da/3ra gen)" }] },

  // Mitsubishi
  { brand: "Mitsubishi", model: "L200", sizes: [{ w: "245", p: "70", r: "16" }, { w: "265", p: "65", r: "17" }] },
  { brand: "Mitsubishi", model: "Lancer", sizes: [{ w: "205", p: "60", r: "16" }] },
  { brand: "Mitsubishi", model: "Montero", sizes: [{ w: "265", p: "70", r: "16" }, { w: "265", p: "65", r: "17" }] },
  { brand: "Mitsubishi", model: "Outlander", sizes: [{ w: "215", p: "70", r: "16" }, { w: "225", p: "55", r: "18" }] },

  // Nissan
  { brand: "Nissan", model: "Frontier", sizes: [{ w: "265", p: "70", r: "16", version: "SE (4x2/4x4)", generation: "D40", years: "2005-2021" }, { w: "235", p: "75", r: "15", version: "S (motor 2.5)", generation: "D40", years: "2005-2020" }, { w: "255", p: "70", r: "16", version: "XE", generation: "D23 (actual)", years: "2020-2023" }, { w: "255", p: "60", r: "18", version: "LE", generation: "D23 (actual)", years: "2020-2023" }, { w: "255", p: "65", r: "17", version: "S / Platinum", generation: "D23 MY24+", years: "2023-2026" }, { w: "255", p: "65", r: "18", version: "PRO-4X", generation: "D23 MY24+", years: "2023-2026" }] },
  { brand: "Nissan", model: "Kicks", sizes: [{ w: "205", p: "60", r: "16", version: "Sense", generation: "P15", years: "2017-2024" }, { w: "205", p: "55", r: "17", version: "Advance / Exclusive", generation: "P15", years: "2017-2024" }, { w: "205", p: "60", r: "16", version: "Sense", generation: "CMF-B (nueva)", years: "2025-2026" }, { w: "205", p: "55", r: "17", version: "Advance / Advance Plus / Exclusive", generation: "CMF-B (nueva)", years: "2025-2026" }] },
  { brand: "Nissan", model: "Livina", sizes: [{ w: "185", p: "65", r: "15" }] },
  { brand: "Nissan", model: "March", sizes: [{ w: "165", p: "70", r: "14", version: "Active / Visia" }, { w: "185", p: "60", r: "15", version: "Sense" }, { w: "185", p: "55", r: "16", version: "Advance" }] },
  { brand: "Nissan", model: "Murano", sizes: [{ w: "235", p: "65", r: "18", version: "SE / Advance" }, { w: "235", p: "55", r: "20", version: "Exclusive" }] },
  { brand: "Nissan", model: "Note", sizes: [{ w: "185", p: "65", r: "15", version: "Sense", generation: "E12", years: "2013-2018" }, { w: "195", p: "55", r: "16", version: "Advance / Exclusive / SR", generation: "E12", years: "2013-2018" }] },
  { brand: "Nissan", model: "Pathfinder", sizes: [{ w: "255", p: "65", r: "16", version: "3.3 V6 (SE/Wide)", generation: "R50", years: "1996-2004" }, { w: "255", p: "65", r: "17", version: "4.0 V6 LE", generation: "R51", years: "2005-2012" }] },
  { brand: "Nissan", model: "Sentra", sizes: [{ w: "185", p: "65", r: "14", version: "GXE / GSX", generation: "B13/B15", years: "1995-2006" }, { w: "205", p: "60", r: "16", version: "Advance", generation: "B17", years: "2012-2019" }, { w: "205", p: "50", r: "17", version: "Exclusive", generation: "B17", years: "2012-2019" }, { w: "215", p: "45", r: "18", version: "SR", generation: "B17", years: "2012-2019" }] },
  { brand: "Nissan", model: "Tiida", sizes: [{ w: "195", p: "65", r: "15", version: "Tekna (Hatchback y Sedán)" }] },
  { brand: "Nissan", model: "Versa", sizes: [{ w: "185", p: "65", r: "15", version: "Sense / Visia (MT)" }, { w: "195", p: "65", r: "15", version: "Sense CVT" }, { w: "205", p: "55", r: "16", version: "Advance CVT" }, { w: "205", p: "50", r: "17", version: "Exclusive CVT" }] },
  { brand: "Nissan", model: "X-Trail", sizes: [{ w: "215", p: "65", r: "16", version: "Visia" }, { w: "215", p: "60", r: "17", version: "Acenta / Tekna" }, { w: "225", p: "65", r: "17", version: "Advance (opción 1)" }, { w: "235", p: "60", r: "18", version: "Advance (opción 2)" }, { w: "225", p: "60", r: "18", version: "Exclusive (opción 1)" }, { w: "235", p: "55", r: "19", version: "Exclusive (opción 2) / e-Power", generation: "T33", years: "2023-2026" }] },

  // Peugeot
  { brand: "Peugeot", model: "2008", sizes: [{ w: "205", p: "60", r: "16", version: "Active / Allure", generation: "2008 I", years: "2016-2023" }, { w: "215", p: "60", r: "17", version: "Feline / Sport", generation: "2008 I", years: "2016-2023" }] },
  { brand: "Peugeot", model: "206", sizes: [{ w: "175", p: "65", r: "14", version: "XR / XS" }, { w: "185", p: "65", r: "14", version: "XT" }, { w: "185", p: "60", r: "15", version: "XS / XT / GTI" }] },
  { brand: "Peugeot", model: "207", sizes: [{ w: "185", p: "65", r: "14", version: "Active" }, { w: "185", p: "60", r: "15", version: "Allure / Feline" }] },
  { brand: "Peugeot", model: "207 Compact", sizes: [{ w: "185", p: "65", r: "14", version: "Active" }, { w: "185", p: "60", r: "15", version: "Allure / Feline" }] },
  { brand: "Peugeot", model: "208", sizes: [{ w: "185", p: "65", r: "15", version: "Like" }, { w: "195", p: "55", r: "16", version: "Active / Allure" }, { w: "205", p: "45", r: "17", version: "GT / Feline" }] },
  { brand: "Peugeot", model: "3008", sizes: [{ w: "215", p: "65", r: "17", version: "Active" }, { w: "225", p: "55", r: "18", version: "Allure / GT" }] },
  { brand: "Peugeot", model: "301", sizes: [{ w: "185", p: "65", r: "15", version: "Active" }, { w: "195", p: "55", r: "16", version: "Allure" }] },
  { brand: "Peugeot", model: "307", sizes: [{ w: "195", p: "65", r: "15", version: "XR / XS" }, { w: "205", p: "55", r: "16", version: "XT / XS Premium" }, { w: "205", p: "50", r: "17", version: "Feline" }] },
  { brand: "Peugeot", model: "308", sizes: [{ w: "205", p: "55", r: "16", version: "Active" }, { w: "225", p: "45", r: "17", version: "Allure / Feline" }] },
  { brand: "Peugeot", model: "405", sizes: [{ w: "175", p: "70", r: "14", version: "GL / GR" }, { w: "185", p: "65", r: "14", version: "SR / SRI" }] },
  { brand: "Peugeot", model: "408", sizes: [{ w: "205", p: "55", r: "16", version: "Active", generation: "408 sedán (308-based)", years: "2011-2020" }, { w: "225", p: "45", r: "17", version: "Allure / Feline", generation: "408 sedán (308-based)", years: "2011-2020" }, { w: "245", p: "40", r: "20", version: "GT", generation: "408 Fastback", years: "2023-presente" }] },
  { brand: "Peugeot", model: "5008", sizes: [{ w: "225", p: "55", r: "18" }] },
  { brand: "Peugeot", model: "504", sizes: [{ w: "175", p: "80", r: "14" }] },
  { brand: "Peugeot", model: "505", sizes: [{ w: "185", p: "70", r: "14" }] },
  { brand: "Peugeot", model: "508", sizes: [{ w: "215", p: "55", r: "17" }] },
  { brand: "Peugeot", model: "Boxer", sizes: [{ w: "215", p: "75", r: "16" }] },
  { brand: "Peugeot", model: "Expert", sizes: [{ w: "215", p: "65", r: "16" }] },
  { brand: "Peugeot", model: "Partner", sizes: [{ w: "175", p: "65", r: "14", version: "Confort" }, { w: "185", p: "65", r: "15", version: "Patagónica" }] },

  // Porsche
  { brand: "Porsche", model: "911", sizes: [{ w: "235", p: "40", r: "19", version: "Carrera - Delantero" }, { w: "295", p: "35", r: "20", version: "Carrera - Trasero" }, { w: "245", p: "35", r: "20", version: "Carrera S - Delantero" }, { w: "305", p: "30", r: "20", version: "Carrera S - Trasero" }] },
  { brand: "Porsche", model: "Boxster", sizes: [{ w: "205", p: "55", r: "16", version: "2.7 - Delantero (base)" }, { w: "225", p: "50", r: "16", version: "2.7 - Trasero (base)" }, { w: "235", p: "40", r: "18", version: "S Cabriolet - Delantero" }, { w: "265", p: "40", r: "18", version: "S Cabriolet - Trasero" }] },
  { brand: "Porsche", model: "Cayenne", sizes: [{ w: "255", p: "55", r: "18", version: "3.6 V6 base" }, { w: "285", p: "40", r: "21", version: "4.0 V8 Turbo - Delantero" }, { w: "315", p: "35", r: "21", version: "4.0 V8 Turbo - Trasero" }] },
  { brand: "Porsche", model: "Cayman", sizes: [{ w: "235", p: "40", r: "18", version: "2.7 - Delantero" }, { w: "265", p: "40", r: "18", version: "2.7 - Trasero" }] },
  { brand: "Porsche", model: "Macan", sizes: [{ w: "265", p: "45", r: "20", version: "2.0 T - Delantero" }, { w: "295", p: "40", r: "20", version: "2.0 T - Trasero" }, { w: "265", p: "40", r: "21", version: "3.6 Turbo - Delantero" }, { w: "295", p: "35", r: "21", version: "3.6 Turbo - Trasero" }] },
  { brand: "Porsche", model: "Panamera", sizes: [{ w: "265", p: "45", r: "19", version: "2.9 V6 - Delantero" }, { w: "295", p: "40", r: "19", version: "2.9 V6 - Trasero" }, { w: "275", p: "35", r: "21", version: "4.0 V8 Turbo - Delantero" }, { w: "315", p: "30", r: "21", version: "4.0 V8 Turbo - Trasero" }] },

  // RAM
  { brand: "RAM", model: "RAM 1500", sizes: [{ w: "275", p: "60", r: "20", version: "Laramie / Limited" }, { w: "275", p: "70", r: "18", version: "Rebel" }] },
  { brand: "RAM", model: "RAM 2500", sizes: [{ w: "275", p: "70", r: "18" }] },
  { brand: "RAM", model: "Rampage", sizes: [{ w: "235", p: "65", r: "17", version: "Rebel" }, { w: "235", p: "60", r: "18", version: "Laramie / Laramie Night Edition" }, { w: "235", p: "55", r: "19", version: "R/T" }] },

  // Renault
  { brand: "Renault", model: "Alaskan", sizes: [{ w: "245", p: "70", r: "16", version: "Zen" }, { w: "255", p: "60", r: "18", version: "Intens / Iconic" }] },
  { brand: "Renault", model: "Captur", sizes: [{ w: "205", p: "60", r: "16", version: "Zen" }, { w: "215", p: "55", r: "17", version: "Intens / Iconic" }] },
  { brand: "Renault", model: "Clio", sizes: [{ w: "165", p: "70", r: "13", version: "RL / RN", generation: "Clio I", years: "1996-2000" }, { w: "175", p: "65", r: "14", version: "RT / Authentique / Dynamique", generation: "Clio II", years: "2000-2013" }, { w: "185", p: "60", r: "14", version: "RSi / Sport 1.6", generation: "Clio II", years: "2000-2013" }, { w: "185", p: "55", r: "15", version: "Sport 2.0 / Privilege", generation: "Clio II", years: "2000-2013" }] },
  { brand: "Renault", model: "Clio Mio", sizes: [{ w: "175", p: "65", r: "14", version: "Expression / Dynamique", years: "2013-2016" }] },
  { brand: "Renault", model: "Duster", sizes: [{ w: "215", p: "65", r: "16", version: "Expression / Zen / Intens / Iconic", years: "2012-2023" }, { w: "215", p: "65", r: "16", version: "New Duster", years: "2024-presente" }] },
  { brand: "Renault", model: "Duster Oroch", sizes: [{ w: "215", p: "65", r: "16" }] },
  { brand: "Renault", model: "Fluence", sizes: [{ w: "205", p: "60", r: "16", version: "Confort / Dynamique" }, { w: "205", p: "55", r: "17", version: "Privilege / GT / Luxe" }] },
  { brand: "Renault", model: "Kangoo", sizes: [{ w: "175", p: "70", r: "14", version: "Kangoo 1", generation: "Kangoo I", years: "1998-2010" }, { w: "175", p: "70", r: "14", version: "Confort / Authentique", generation: "Kangoo II", years: "2010-2021" }, { w: "195", p: "55", r: "16", version: "Stepway", generation: "Kangoo II", years: "2010-2021" }] },
  { brand: "Renault", model: "Kardian", sizes: [{ w: "205", p: "65", r: "16", version: "Evolution" }, { w: "205", p: "60", r: "16", version: "Techno / Premiere Edition" }, { w: "205", p: "55", r: "17", version: "Iconic" }] },
  { brand: "Renault", model: "Kwid", sizes: [{ w: "165", p: "70", r: "14", version: "Zen / Intense / Iconic", years: "2019-2022" }, { w: "175", p: "70", r: "14", version: "Outsider (facelift)", years: "2022-presente" }] },
  { brand: "Renault", model: "Logan", sizes: [{ w: "175", p: "70", r: "14", version: "Authentique / Expression", generation: "Logan I", years: "2007-2014" }, { w: "185", p: "65", r: "15", version: "Privilege", generation: "Logan I", years: "2007-2014" }, { w: "185", p: "65", r: "15", version: "Life / Zen / Intens", generation: "Logan II / Nuevo Logan", years: "2014-presente" }] },
  { brand: "Renault", model: "Master", sizes: [{ w: "225", p: "65", r: "16" }] },
  { brand: "Renault", model: "Megane", sizes: [{ w: "175", p: "65", r: "14", version: "RN / RL", generation: "Megane I / Classic", years: "1996-2010" }, { w: "185", p: "65", r: "15", version: "RT / RXE", generation: "Megane I / Classic", years: "1996-2010" }, { w: "195", p: "65", r: "15", version: "Authentique", generation: "Megane II", years: "2003-2010" }, { w: "205", p: "55", r: "16", version: "Dynamique / Privilege", generation: "Megane II", years: "2003-2010" }, { w: "205", p: "50", r: "17", version: "Sport / Coupe", generation: "Megane II", years: "2003-2010" }, { w: "205", p: "55", r: "16", version: "Luxe", generation: "Megane III", years: "2011-2016" }, { w: "225", p: "45", r: "17", version: "Privilege / GT", generation: "Megane III", years: "2011-2016" }] },
  { brand: "Renault", model: "Oroch", sizes: [{ w: "215", p: "65", r: "16" }] },
  { brand: "Renault", model: "Sandero", sizes: [{ w: "175", p: "70", r: "14", version: "Authentique / Expression", generation: "Sandero I", years: "2008-2014" }, { w: "185", p: "65", r: "15", version: "Privilege", generation: "Sandero I", years: "2008-2014" }, { w: "185", p: "65", r: "15", version: "Life / Zen / Intens", generation: "Sandero II / Nuevo Sandero", years: "2014-presente" }, { w: "195", p: "55", r: "16", version: "RS / Intens Plus", generation: "Sandero II / Nuevo Sandero", years: "2014-presente" }] },
  { brand: "Renault", model: "Sandero Stepway", sizes: [{ w: "205", p: "55", r: "16", generation: "Stepway I / II", years: "2009-2020" }, { w: "205", p: "60", r: "16", generation: "New Stepway", years: "2021-presente" }] },
  { brand: "Renault", model: "Stepway", sizes: [{ w: "205", p: "55", r: "16", generation: "Stepway I / II", years: "2009-2020" }, { w: "205", p: "60", r: "16", generation: "New Stepway", years: "2021-presente" }] },
  { brand: "Renault", model: "Symbol", sizes: [{ w: "175", p: "70", r: "14", version: "Authentique" }, { w: "185", p: "65", r: "15", version: "Privilege / Luxe" }] },
  { brand: "Renault", model: "Trafic", sizes: [{ w: "185", p: "80", r: "14" }, { w: "195", p: "70", r: "15" }] },
  { brand: "Renault", model: "Twingo", sizes: [{ w: "155", p: "70", r: "13" }] },

  // Seat
  { brand: "Seat", model: "Cordoba", sizes: [{ w: "185", p: "60", r: "14" }, { w: "195", p: "55", r: "15" }] },
  { brand: "Seat", model: "Ibiza", sizes: [{ w: "185", p: "60", r: "14" }, { w: "195", p: "55", r: "15" }] },
  { brand: "Seat", model: "Leon", sizes: [{ w: "205", p: "55", r: "16" }, { w: "225", p: "45", r: "17" }] },
  { brand: "Seat", model: "Toledo", sizes: [{ w: "195", p: "65", r: "15" }] },

  // Shineray
  { brand: "Shineray", model: "T30", sizes: [{ w: "175", p: "70", r: "14" }] },
  { brand: "Shineray", model: "T32", sizes: [{ w: "175", p: "70", r: "14" }] },
  { brand: "Shineray", model: "X30", sizes: [{ w: "175", p: "70", r: "14" }] },

  // Subaru
  { brand: "Subaru", model: "Crosstrek", sizes: [{ w: "225", p: "60", r: "17" }, { w: "225", p: "55", r: "18" }] },
  { brand: "Subaru", model: "Forester", sizes: [{ w: "225", p: "60", r: "17" }, { w: "225", p: "55", r: "18" }] },
  { brand: "Subaru", model: "Impreza", sizes: [{ w: "195", p: "65", r: "15" }, { w: "205", p: "55", r: "16" }] },
  { brand: "Subaru", model: "Legacy", sizes: [{ w: "205", p: "60", r: "16" }, { w: "215", p: "50", r: "17" }] },
  { brand: "Subaru", model: "Outback", sizes: [{ w: "225", p: "65", r: "17" }, { w: "225", p: "60", r: "18" }] },
  { brand: "Subaru", model: "XV", sizes: [{ w: "225", p: "60", r: "17" }, { w: "225", p: "55", r: "18" }] },

  // Suzuki
  { brand: "Suzuki", model: "Fun", sizes: [{ w: "165", p: "70", r: "13", version: "Base" }, { w: "175", p: "65", r: "14" }] },
  { brand: "Suzuki", model: "Grand Vitara", sizes: [{ w: "215", p: "60", r: "17", generation: "Grand Vitara JIII", years: "2024-presente" }, { w: "235", p: "60", r: "16", generation: "Grand Vitara JT/JB", years: "2006-2015" }, { w: "225", p: "65", r: "17", generation: "Grand Vitara JT/JB", years: "2006-2015" }] },
  { brand: "Suzuki", model: "Jimny", sizes: [{ w: "195", p: "80", r: "15", generation: "Jimny (JB74/JB64)", years: "2019-presente" }, { w: "205", p: "70", r: "15", generation: "Jimny JB43", years: "2005-2011" }] },
  { brand: "Suzuki", model: "Swift", sizes: [{ w: "175", p: "65", r: "14", version: "GL" }, { w: "185", p: "55", r: "16", version: "GLX" }] },
  { brand: "Suzuki", model: "Vitara", sizes: [{ w: "215", p: "60", r: "16" }, { w: "215", p: "55", r: "17" }] },

  // Toyota
  { brand: "Toyota", model: "Camry", sizes: [{ w: "215", p: "60", r: "16" }, { w: "215", p: "55", r: "17" }] },
  { brand: "Toyota", model: "Corolla", sizes: [{ w: "185", p: "70", r: "14", version: "XLI", generation: "E130", years: "2003-2008" }, { w: "195", p: "60", r: "15", version: "XEI / SE-G", generation: "E130", years: "2003-2008" }, { w: "205", p: "55", r: "16", version: "XLI / XEI / SE-G", generation: "E140/150", years: "2008-2013" }, { w: "205", p: "55", r: "16", version: "XLI / XEI", generation: "E170/180", years: "2014-2018" }, { w: "225", p: "45", r: "17", version: "SE-G", generation: "E170/180", years: "2014-2018" }, { w: "205", p: "55", r: "16", version: "XLI / XEI", generation: "E210", years: "2019-presente" }, { w: "225", p: "45", r: "17", version: "SEG / GR-Sport", generation: "E210", years: "2019-presente" }] },
  { brand: "Toyota", model: "Corolla Cross", sizes: [{ w: "215", p: "60", r: "17", version: "XLI" }, { w: "215", p: "60", r: "17", version: "XEI" }, { w: "225", p: "50", r: "18", version: "SEG / GR-S" }] },
  { brand: "Toyota", model: "Etios", sizes: [{ w: "175", p: "65", r: "14", version: "X" }, { w: "185", p: "60", r: "15", version: "XS / XLS" }] },
  { brand: "Toyota", model: "GR Yaris", sizes: [{ w: "225", p: "40", r: "18" }] },
  { brand: "Toyota", model: "Hiace", sizes: [{ w: "195", p: "80", r: "15", version: "Furgón / Commuter", generation: "H200", years: "2005-2019" }, { w: "215", p: "65", r: "16", version: "Wagon / Executive", generation: "H200", years: "2005-2019" }, { w: "215", p: "70", r: "16", version: "Furgón / Commuter", generation: "H300", years: "2019-presente" }] },
  { brand: "Toyota", model: "Hilux", sizes: [{ w: "265", p: "70", r: "16", version: "DX", generation: "VII", years: "2005-2015" }, { w: "265", p: "65", r: "17", version: "SR / SRV", generation: "VII", years: "2005-2015" }, { w: "265", p: "70", r: "16", version: "DX", generation: "VIII", years: "2015-presente" }, { w: "265", p: "65", r: "17", version: "SR / SRV", generation: "VIII", years: "2015-presente" }, { w: "265", p: "60", r: "18", version: "SRX / GR-Sport", generation: "VIII", years: "2015-presente" }] },
  { brand: "Toyota", model: "Hilux SW4", sizes: [{ w: "265", p: "70", r: "16", version: "SR (base)", generation: "I (AN50/60)", years: "2005-2015" }, { w: "265", p: "65", r: "17", version: "SRV / SRX", generation: "I (AN50/60)", years: "2005-2015" }, { w: "265", p: "65", r: "17", version: "SR", generation: "II (AN150/160)", years: "2015-presente" }, { w: "265", p: "60", r: "18", version: "SRX / Diamond / GR-Sport", generation: "II (AN150/160)", years: "2015-presente" }] },
  { brand: "Toyota", model: "Land Cruiser", sizes: [{ w: "285", p: "65", r: "17", version: "Prado" }, { w: "285", p: "60", r: "18", version: "Prado" }, { w: "265", p: "60", r: "20", version: "VX", generation: "300", years: "2022-presente" }] },
  { brand: "Toyota", model: "Prius", sizes: [{ w: "195", p: "65", r: "15" }] },
  { brand: "Toyota", model: "RAV4", sizes: [{ w: "225", p: "65", r: "17", version: "XLE / VX", generation: "XA40", years: "2016-2022" }, { w: "235", p: "55", r: "18", version: "Limited", generation: "XA40", years: "2016-2022" }, { w: "225", p: "60", r: "18", version: "HEV / PHEV", generation: "XA50", years: "2023-presente" }] },
  { brand: "Toyota", model: "SW4", sizes: [{ w: "265", p: "70", r: "16", version: "SR (base)", generation: "I (AN50/60)", years: "2005-2015" }, { w: "265", p: "65", r: "17", version: "SRV / SRX", generation: "I (AN50/60)", years: "2005-2015" }, { w: "265", p: "65", r: "17", version: "SR", generation: "II (AN150/160)", years: "2015-presente" }, { w: "265", p: "60", r: "18", version: "SRX / Diamond / GR-Sport", generation: "II (AN150/160)", years: "2015-presente" }] },
  { brand: "Toyota", model: "Yaris", sizes: [{ w: "185", p: "60", r: "15", version: "XS" }, { w: "195", p: "50", r: "16", version: "XLS / S" }] },

  // Volkswagen
  { brand: "Volkswagen", model: "Amarok", sizes: [{ w: "245", p: "70", r: "16", version: "Trendline / Startline", generation: "Amarok I", years: "2010-2020" }, { w: "245", p: "65", r: "17", version: "Comfortline", generation: "Amarok I", years: "2010-2020" }, { w: "255", p: "60", r: "18", version: "Highline", generation: "Amarok I", years: "2010-2020" }, { w: "255", p: "55", r: "19", version: "V6 Extreme", generation: "Amarok I", years: "2017-2020" }, { w: "245", p: "70", r: "16", version: "Trendline 4x2/4x4", generation: "Amarok II", years: "2023-presente" }, { w: "245", p: "65", r: "17", version: "Comfortline", generation: "Amarok II", years: "2023-presente" }, { w: "255", p: "60", r: "18", version: "V6 Comfortline / Highline", generation: "Amarok II", years: "2023-presente" }, { w: "255", p: "55", r: "19", version: "V6 Highline / Extreme", generation: "Amarok II", years: "2023-presente" }] },
  { brand: "Volkswagen", model: "Bora", sizes: [{ w: "195", p: "65", r: "15", version: "Trendline 2.0 / 1.9 TDI", generation: "Bora", years: "1999-2009" }, { w: "205", p: "55", r: "16", version: "1.8T Highline / 2.8 V6", generation: "Bora", years: "1999-2009" }] },
  { brand: "Volkswagen", model: "Caddy", sizes: [{ w: "175", p: "70", r: "14", version: "Furgón / Life", generation: "Caddy (2K)", years: "2005-2015" }, { w: "195", p: "70", r: "15", version: "Furgón / Trendline", generation: "Caddy (SA)", years: "2016-presente" }] },
  { brand: "Volkswagen", model: "Crossfox", sizes: [{ w: "205", p: "60", r: "15", version: "Único", generation: "CrossFox", years: "2005-2015" }] },
  { brand: "Volkswagen", model: "Fox", sizes: [{ w: "195", p: "55", r: "15", version: "Comfortline / Trendline", generation: "Fox", years: "2004-2015" }, { w: "195", p: "50", r: "16", version: "Highline / Prime", generation: "Fox (restyling)", years: "2010-2015" }] },
  { brand: "Volkswagen", model: "Gol", sizes: [{ w: "165", p: "70", r: "14", version: "Base / CL", generation: "Gol G3", years: "1999-2005" }, { w: "175", p: "65", r: "14", version: "Power / GTi", generation: "Gol G3", years: "1999-2005" }, { w: "185", p: "55", r: "15", version: "GTi / 16V", generation: "Gol G3", years: "1999-2005" }, { w: "175", p: "70", r: "14", version: "Trendline / Power", generation: "Gol G4", years: "2005-2008" }, { w: "185", p: "60", r: "14", version: "Comfortline", generation: "Gol G4", years: "2005-2008" }] },
  { brand: "Volkswagen", model: "Gol Trend", sizes: [{ w: "175", p: "70", r: "14", version: "Trendline / Pack I", generation: "Gol Trend (G5)", years: "2008-2016" }, { w: "185", p: "65", r: "14", version: "Comfortline / Pack II", generation: "Gol Trend (G5)", years: "2008-2016" }, { w: "195", p: "55", r: "15", version: "Highline / Pack III", generation: "Gol Trend (G5)", years: "2008-2016" }, { w: "185", p: "65", r: "14", version: "Trendline / Comfortline", generation: "Gol Trend (última generación)", years: "2017-2023" }, { w: "195", p: "55", r: "15", version: "Highline", generation: "Gol Trend (última generación)", years: "2017-2023" }, { w: "195", p: "50", r: "16", version: "Highline i-Motion", generation: "Gol Trend (última generación)", years: "2017-2023" }] },
  { brand: "Volkswagen", model: "Golf", sizes: [{ w: "195", p: "65", r: "15", version: "1.6 Trendline", generation: "Golf IV", years: "1998-2006" }, { w: "205", p: "55", r: "16", version: "2.0 Comfortline", generation: "Golf IV", years: "1998-2006" }, { w: "225", p: "45", r: "17", version: "1.8T GTI", generation: "Golf IV", years: "1999-2006" }, { w: "205", p: "55", r: "16", version: "Comfortline", generation: "Golf V / VI", years: "2006-2013" }, { w: "225", p: "45", r: "17", version: "Highline / GTI", generation: "Golf V / VI", years: "2006-2013" }, { w: "205", p: "55", r: "16", version: "Trendline / Comfortline", generation: "Golf VII", years: "2013-2020" }, { w: "225", p: "45", r: "17", version: "Highline / GTI", generation: "Golf VII", years: "2013-2020" }] },
  { brand: "Volkswagen", model: "Nivus", sizes: [{ w: "205", p: "60", r: "16", version: "Comfortline", generation: "Nivus", years: "2020-presente" }, { w: "205", p: "55", r: "17", version: "Highline", generation: "Nivus", years: "2020-presente" }, { w: "215", p: "45", r: "18", version: "Highline (opcional)", generation: "Nivus (restyling)", years: "2024-presente" }] },
  { brand: "Volkswagen", model: "Passat", sizes: [{ w: "205", p: "55", r: "16", version: "Trendline / Comfortline (B5/B6)", generation: "Passat B5/B6", years: "1998-2011" }, { w: "215", p: "55", r: "16", version: "Comfortline", generation: "Passat B7", years: "2011-2014" }, { w: "235", p: "45", r: "17", version: "Highline", generation: "Passat B7 / B8", years: "2011-presente" }] },
  { brand: "Volkswagen", model: "Polo", sizes: [{ w: "185", p: "65", r: "15", version: "Track / Trendline", generation: "Polo (MQB, Brasil)", years: "2018-presente" }, { w: "195", p: "55", r: "16", version: "Comfortline / Highline", generation: "Polo (MQB, Brasil)", years: "2018-presente" }, { w: "205", p: "45", r: "17", version: "GTS / Highline (opcional)", generation: "Polo (MQB, Brasil)", years: "2018-presente" }] },
  { brand: "Volkswagen", model: "Polo Track", sizes: [{ w: "185", p: "65", r: "15", version: "Trendline / MSI", generation: "Polo Track", years: "2023-presente" }] },
  { brand: "Volkswagen", model: "Saveiro", sizes: [{ w: "175", p: "70", r: "14", version: "Base (G4)", generation: "Saveiro G4", years: "2005-2009" }, { w: "205", p: "60", r: "15", version: "Trendline / Comfortline", generation: "Saveiro G5 / G6", years: "2009-presente" }, { w: "205", p: "55", r: "16", version: "Highline / Cross", generation: "Saveiro G6", years: "2016-presente" }] },
  { brand: "Volkswagen", model: "Scirocco", sizes: [{ w: "225", p: "45", r: "17", version: "1.4 TSI", generation: "Scirocco III", years: "2009-2017" }, { w: "235", p: "40", r: "18", version: "2.0 TSI", generation: "Scirocco III", years: "2009-2017" }] },
  { brand: "Volkswagen", model: "Suran", sizes: [{ w: "185", p: "60", r: "15", version: "Trendline / Comfortline", generation: "Suran", years: "2006-2017" }, { w: "195", p: "55", r: "16", version: "Highline", generation: "Suran (restyling)", years: "2011-2017" }] },
  { brand: "Volkswagen", model: "Taos", sizes: [{ w: "215", p: "55", r: "18", version: "Comfortline", generation: "Taos", years: "2021-presente" }, { w: "235", p: "45", r: "19", version: "Highline / Hero", generation: "Taos", years: "2021-presente" }] },
  { brand: "Volkswagen", model: "Tera", sizes: [{ w: "205", p: "60", r: "16", version: "Comfortline", generation: "Tera", years: "2024-presente" }, { w: "205", p: "55", r: "17", version: "Highline", generation: "Tera", years: "2024-presente" }] },
  { brand: "Volkswagen", model: "T-Cross", sizes: [{ w: "205", p: "60", r: "16", version: "Trendline / Comfortline", generation: "T-Cross", years: "2019-presente" }, { w: "205", p: "55", r: "17", version: "Highline", generation: "T-Cross", years: "2019-presente" }] },
  { brand: "Volkswagen", model: "Tiguan", sizes: [{ w: "215", p: "65", r: "17", version: "Trendline", generation: "Tiguan I", years: "2009-2016" }, { w: "235", p: "55", r: "18", version: "Comfortline / Life", generation: "Tiguan Allspace", years: "2018-presente" }, { w: "235", p: "50", r: "19", version: "Highline / R-Line", generation: "Tiguan Allspace", years: "2018-presente" }] },
  { brand: "Volkswagen", model: "Up!", sizes: [{ w: "175", p: "70", r: "14", version: "Take / Move", generation: "Up!", years: "2014-2019" }, { w: "185", p: "60", r: "15", version: "High / Pepper", generation: "Up!", years: "2014-2019" }] },
  { brand: "Volkswagen", model: "Vento", sizes: [{ w: "205", p: "55", r: "16", version: "Advance / Comfortline", generation: "Vento I", years: "2010-2015" }, { w: "225", p: "45", r: "17", version: "Highline / Sportline", generation: "Vento I", years: "2010-2015" }, { w: "205", p: "55", r: "16", version: "Comfortline", generation: "Vento II", years: "2016-presente" }, { w: "225", p: "45", r: "17", version: "Highline", generation: "Vento II", years: "2016-presente" }, { w: "225", p: "40", r: "18", version: "GLI", generation: "Vento II", years: "2016-presente" }] },
  { brand: "Volkswagen", model: "Virtus", sizes: [{ w: "185", p: "65", r: "15", version: "Trendline", generation: "Virtus", years: "2018-presente" }, { w: "195", p: "55", r: "16", version: "Comfortline", generation: "Virtus", years: "2018-presente" }, { w: "205", p: "45", r: "17", version: "Highline / GTS", generation: "Virtus", years: "2018-presente" }] },
  { brand: "Volkswagen", model: "Voyage", sizes: [{ w: "175", p: "70", r: "14", version: "Trendline (G4-based)", generation: "Voyage I", years: "2008-2012" }, { w: "175", p: "70", r: "14", version: "Trendline", generation: "Voyage II", years: "2012-2019" }, { w: "185", p: "65", r: "14", version: "Comfortline", generation: "Voyage II", years: "2012-2019" }, { w: "195", p: "55", r: "15", version: "Highline", generation: "Voyage II", years: "2012-2019" }] },

  // Volvo
  { brand: "Volvo", model: "C30", sizes: [{ w: "205", p: "55", r: "16", version: "2.4i" }, { w: "205", p: "50", r: "17", version: "2.5 Turbo T5" }] },
  { brand: "Volvo", model: "S60", sizes: [{ w: "215", p: "55", r: "16", version: "2.4D (1ra gen)" }, { w: "215", p: "50", r: "17", version: "T6 Momentum (2da gen)" }] },
  { brand: "Volvo", model: "V40", sizes: [{ w: "205", p: "50", r: "17", version: "T4 Momentum" }] },
  { brand: "Volvo", model: "XC40", sizes: [{ w: "235", p: "55", r: "18", version: "T4 Kinetic" }, { w: "245", p: "45", r: "20", version: "T5 AWD R-Design" }] },
  { brand: "Volvo", model: "XC60", sizes: [{ w: "235", p: "60", r: "18", version: "T5 Momentum" }, { w: "255", p: "45", r: "20", version: "T6 Inscription" }] },
  { brand: "Volvo", model: "XC90", sizes: [{ w: "275", p: "45", r: "20", version: "T6 Momentum" }] },

  // Zotye
  { brand: "Zotye", model: "Z100", sizes: [{ w: "165", p: "60", r: "14" }] }
].sort((a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model));

export function getSizesForVehicle(brand: string, model: string): VehicleDBEntry["sizes"] | null {
  const entry = VEHICLE_DB.find((v) => v.brand === brand && v.model === model);
  return entry ? entry.sizes : null;
}

let cachedOptions: { marca: string; modelo: string; label: string }[] | null = null;

export function getAllVehicleOptions(): { marca: string; modelo: string; label: string }[] {
  if (cachedOptions) return cachedOptions;

  const mergedMap = new Map<string, { marca: string; modelo: string; label: string }>();

  // Agregar primero los vehículos con medidas mapeadas (VEHICLE_DB)
  for (const v of VEHICLE_DB) {
    const key = `${v.brand.toLowerCase()}-${v.model.toLowerCase()}`;
    mergedMap.set(key, {
      marca: v.brand,
      modelo: v.model,
      label: `${v.brand} ${v.model}`,
    });
  }

  // Integrar el listado completo de respaldo, rellenando lo faltante (por ej. marcas chinas)
  for (const v of allVehicles) {
    const key = `${v.marca.toLowerCase()}-${v.modelo.toLowerCase()}`;
    if (!mergedMap.has(key)) {
      mergedMap.set(key, {
        marca: v.marca,
        modelo: v.modelo,
        label: v.label,
      });
    }
  }

  cachedOptions = Array.from(mergedMap.values()).sort((a, b) => {
    const la = a.label;
    const lb = b.label;
    return la > lb ? 1 : la < lb ? -1 : 0;
  });

  return cachedOptions;
}
