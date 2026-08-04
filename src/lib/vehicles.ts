import allVehicles from "./vehiculos.json";

export type VehicleDBEntry = {
  brand: string;
  model: string;
  sizes: {
    w: string;
    p: string;
    r: string;
    version?: string;
  }[];
};

export const VEHICLE_DB: VehicleDBEntry[] = [
  // Alfa Romeo
  { brand: "Alfa Romeo", model: "147", sizes: [{ w: "195", p: "60", r: "15", version: "Distinctive" }, { w: "205", p: "55", r: "16", version: "Selespeed" }] },
  { brand: "Alfa Romeo", model: "156", sizes: [{ w: "205", p: "55", r: "16" }] },
  { brand: "Alfa Romeo", model: "Giulia", sizes: [{ w: "225", p: "50", r: "17" }, { w: "225", p: "45", r: "18" }] },
  { brand: "Alfa Romeo", model: "Giulietta", sizes: [{ w: "225", p: "45", r: "17", version: "Distinctive" }, { w: "225", p: "40", r: "18", version: "Quadrifoglio Verde" }] },
  { brand: "Alfa Romeo", model: "Mito", sizes: [{ w: "215", p: "45", r: "17" }] },
  { brand: "Alfa Romeo", model: "Stelvio", sizes: [{ w: "235", p: "60", r: "18" }, { w: "235", p: "55", r: "19" }] },

  // Audi
  { brand: "Audi", model: "A1", sizes: [{ w: "215", p: "45", r: "16", version: "Attraction" }, { w: "215", p: "40", r: "17", version: "S-Line / 1.4 TFSI" }] },
  { brand: "Audi", model: "A3", sizes: [{ w: "205", p: "55", r: "16", version: "Base" }, { w: "225", p: "45", r: "17", version: "S-Line" }, { w: "225", p: "40", r: "18", version: "S3 / RS3" }] },
  { brand: "Audi", model: "A4", sizes: [{ w: "225", p: "50", r: "17", version: "Base" }, { w: "245", p: "40", r: "18", version: "S-Line" }] },
  { brand: "Audi", model: "A5", sizes: [{ w: "225", p: "50", r: "17" }, { w: "245", p: "40", r: "18" }] },
  { brand: "Audi", model: "A6", sizes: [{ w: "225", p: "55", r: "17" }, { w: "245", p: "45", r: "18" }] },
  { brand: "Audi", model: "Q2", sizes: [{ w: "215", p: "55", r: "17" }] },
  { brand: "Audi", model: "Q3", sizes: [{ w: "235", p: "55", r: "17", version: "Base" }, { w: "235", p: "50", r: "18", version: "Sport" }] },
  { brand: "Audi", model: "Q5", sizes: [{ w: "235", p: "60", r: "18", version: "Base" }, { w: "235", p: "55", r: "19", version: "S-Line" }] },
  { brand: "Audi", model: "Q7", sizes: [{ w: "255", p: "55", r: "19" }, { w: "285", p: "45", r: "20" }] },
  { brand: "Audi", model: "Q8", sizes: [{ w: "275", p: "50", r: "20" }, { w: "285", p: "45", r: "21" }] },
  { brand: "Audi", model: "TT", sizes: [{ w: "225", p: "50", r: "17" }, { w: "245", p: "40", r: "18" }] },

  // BAIC
  { brand: "BAIC", model: "BJ40", sizes: [{ w: "265", p: "65", r: "17" }] },
  { brand: "BAIC", model: "X35", sizes: [{ w: "215", p: "50", r: "17" }] },
  { brand: "BAIC", model: "X55", sizes: [{ w: "225", p: "55", r: "19" }] },

  // BMW
  { brand: "BMW", model: "Serie 1", sizes: [{ w: "205", p: "55", r: "16", version: "118i" }, { w: "225", p: "45", r: "17", version: "120i M Sport" }] },
  { brand: "BMW", model: "Serie 2", sizes: [{ w: "205", p: "55", r: "16" }, { w: "225", p: "45", r: "17" }] },
  { brand: "BMW", model: "Serie 3", sizes: [{ w: "225", p: "50", r: "17", version: "320i" }, { w: "225", p: "45", r: "18", version: "330i M Sport" }] },
  { brand: "BMW", model: "Serie 4", sizes: [{ w: "225", p: "45", r: "18" }, { w: "255", p: "40", r: "18" }] },
  { brand: "BMW", model: "Serie 5", sizes: [{ w: "225", p: "55", r: "17" }, { w: "245", p: "45", r: "18" }] },
  { brand: "BMW", model: "Serie 7", sizes: [{ w: "245", p: "50", r: "18" }] },
  { brand: "BMW", model: "X1", sizes: [{ w: "225", p: "55", r: "17", version: "sDrive20i" }, { w: "225", p: "50", r: "18", version: "xDrive25i" }] },
  { brand: "BMW", model: "X2", sizes: [{ w: "225", p: "55", r: "17" }, { w: "225", p: "50", r: "18" }] },
  { brand: "BMW", model: "X3", sizes: [{ w: "225", p: "60", r: "17" }, { w: "245", p: "50", r: "19" }] },
  { brand: "BMW", model: "X4", sizes: [{ w: "245", p: "50", r: "19" }] },
  { brand: "BMW", model: "X5", sizes: [{ w: "255", p: "55", r: "18" }, { w: "275", p: "45", r: "20" }] },
  { brand: "BMW", model: "X6", sizes: [{ w: "275", p: "45", r: "20" }, { w: "315", p: "35", r: "20" }] },
  { brand: "BMW", model: "Z4", sizes: [{ w: "225", p: "45", r: "17" }, { w: "225", p: "40", r: "18" }] },

  // BYD
  { brand: "BYD", model: "Dolphin", sizes: [{ w: "195", p: "60", r: "16" }] },
  { brand: "BYD", model: "Song Plus", sizes: [{ w: "235", p: "50", r: "19" }] },
  { brand: "BYD", model: "Tang", sizes: [{ w: "265", p: "45", r: "21" }] },
  { brand: "BYD", model: "Yuan Plus", sizes: [{ w: "215", p: "55", r: "18" }] },

  // Changan
  { brand: "Changan", model: "CS15", sizes: [{ w: "205", p: "55", r: "16" }] },
  { brand: "Changan", model: "CS35", sizes: [{ w: "215", p: "55", r: "17" }] },
  { brand: "Changan", model: "CS35 Plus", sizes: [{ w: "215", p: "55", r: "17" }] },
  { brand: "Changan", model: "CS55", sizes: [{ w: "225", p: "55", r: "18" }] },
  { brand: "Changan", model: "CS75", sizes: [{ w: "225", p: "60", r: "18" }] },
  { brand: "Changan", model: "MD201", sizes: [{ w: "175", p: "70", r: "14" }] },

  // Chery
  { brand: "Chery", model: "Arrizo 5", sizes: [{ w: "205", p: "55", r: "16" }] },
  { brand: "Chery", model: "Face", sizes: [{ w: "175", p: "60", r: "14" }] },
  { brand: "Chery", model: "QQ", sizes: [{ w: "155", p: "65", r: "13", version: "Light / Basic" }, { w: "155", p: "65", r: "14", version: "Confort" }] },
  { brand: "Chery", model: "Skin", sizes: [{ w: "195", p: "55", r: "15" }] },
  { brand: "Chery", model: "Tiggo", sizes: [{ w: "215", p: "65", r: "16" }] },
  { brand: "Chery", model: "Tiggo 2", sizes: [{ w: "205", p: "55", r: "16" }] },
  { brand: "Chery", model: "Tiggo 3", sizes: [{ w: "215", p: "60", r: "17" }] },
  { brand: "Chery", model: "Tiggo 4", sizes: [{ w: "215", p: "60", r: "17" }] },
  { brand: "Chery", model: "Tiggo 4 Pro", sizes: [{ w: "215", p: "60", r: "17", version: "Comfort" }, { w: "215", p: "55", r: "18", version: "Luxury" }] },
  { brand: "Chery", model: "Tiggo 5", sizes: [{ w: "225", p: "60", r: "17" }] },
  { brand: "Chery", model: "Tiggo 7 Pro", sizes: [{ w: "225", p: "60", r: "18" }] },
  { brand: "Chery", model: "Tiggo 8", sizes: [{ w: "235", p: "55", r: "18" }] },

  // Chevrolet
  { brand: "Chevrolet", model: "Agile", sizes: [{ w: "185", p: "60", r: "15", version: "LS / LT" }, { w: "195", p: "55", r: "16", version: "LTZ / Effect" }] },
  { brand: "Chevrolet", model: "Astra", sizes: [{ w: "195", p: "60", r: "15", version: "GL / GLS" }, { w: "205", p: "55", r: "16", version: "GSI" }] },
  { brand: "Chevrolet", model: "Aveo", sizes: [{ w: "185", p: "60", r: "14", version: "LS" }, { w: "185", p: "55", r: "15", version: "LT" }] },
  { brand: "Chevrolet", model: "Camaro", sizes: [{ w: "245", p: "40", r: "20", version: "Front" }, { w: "275", p: "40", r: "20", version: "Rear" }] },
  { brand: "Chevrolet", model: "Celta", sizes: [{ w: "165", p: "70", r: "13", version: "LS" }, { w: "175", p: "65", r: "14", version: "LT" }] },
  { brand: "Chevrolet", model: "Chevy", sizes: [{ w: "195", p: "70", r: "14" }] },
  { brand: "Chevrolet", model: "Classic", sizes: [{ w: "165", p: "70", r: "13", version: "LS (Base)" }, { w: "185", p: "60", r: "14", version: "LT / GLS" }] },
  { brand: "Chevrolet", model: "Corsa", sizes: [{ w: "165", p: "70", r: "13", version: "LS (Base)" }, { w: "185", p: "60", r: "14", version: "LT / GLS" }] },
  { brand: "Chevrolet", model: "Cruze", sizes: [{ w: "205", p: "60", r: "16", version: "LT" }, { w: "215", p: "50", r: "17", version: "LTZ / Premier" }] },
  { brand: "Chevrolet", model: "Equinox", sizes: [{ w: "225", p: "65", r: "17", version: "FWD" }, { w: "235", p: "50", r: "19", version: "AWD Premier" }] },
  { brand: "Chevrolet", model: "Meriva", sizes: [{ w: "185", p: "60", r: "15" }] },
  { brand: "Chevrolet", model: "Montana", sizes: [{ w: "215", p: "60", r: "17" }] },
  { brand: "Chevrolet", model: "Onix", sizes: [{ w: "185", p: "70", r: "14", version: "Joy / LS" }, { w: "185", p: "65", r: "15", version: "LT" }, { w: "195", p: "55", r: "16", version: "LTZ / Premier" }] },
  { brand: "Chevrolet", model: "Onix Plus", sizes: [{ w: "185", p: "65", r: "15", version: "LT" }, { w: "195", p: "55", r: "16", version: "LTZ / Premier" }] },
  { brand: "Chevrolet", model: "Prisma", sizes: [{ w: "185", p: "70", r: "14", version: "Joy / LS" }, { w: "185", p: "65", r: "15", version: "LT" }, { w: "195", p: "55", r: "16", version: "LTZ / Premier" }] },
  { brand: "Chevrolet", model: "S10", sizes: [{ w: "245", p: "70", r: "16", version: "LS" }, { w: "255", p: "65", r: "17", version: "LT" }, { w: "265", p: "60", r: "18", version: "LTZ / High Country" }] },
  { brand: "Chevrolet", model: "Spin", sizes: [{ w: "195", p: "65", r: "15", version: "LT / LTZ" }, { w: "205", p: "60", r: "16", version: "Activ" }] },
  { brand: "Chevrolet", model: "Tracker", sizes: [{ w: "205", p: "60", r: "16", version: "LT (2013-2020)" }, { w: "215", p: "55", r: "17", version: "Tracker MT / AT (2020+)" }, { w: "215", p: "55", r: "18", version: "Premier (2020+)" }] },
  { brand: "Chevrolet", model: "Trailblazer", sizes: [{ w: "265", p: "60", r: "18" }] },
  { brand: "Chevrolet", model: "Vectra", sizes: [{ w: "195", p: "65", r: "15", version: "GL" }, { w: "205", p: "55", r: "16", version: "GLS / CD" }, { w: "215", p: "50", r: "17", version: "GTX" }] },
  { brand: "Chevrolet", model: "Zafira", sizes: [{ w: "195", p: "65", r: "15", version: "GL / GLS" }, { w: "205", p: "55", r: "16", version: "CD" }] },

  // Chrysler
  { brand: "Chrysler", model: "Caravan", sizes: [{ w: "215", p: "65", r: "15" }, { w: "215", p: "65", r: "16" }] },
  { brand: "Chrysler", model: "Grand Caravan", sizes: [{ w: "225", p: "65", r: "16" }, { w: "225", p: "65", r: "17" }] },
  { brand: "Chrysler", model: "Neon", sizes: [{ w: "185", p: "65", r: "14" }, { w: "195", p: "55", r: "15" }] },
  { brand: "Chrysler", model: "PT Cruiser", sizes: [{ w: "195", p: "65", r: "15" }, { w: "205", p: "55", r: "16" }] },

  // Citroën
  { brand: "Citroen", model: "Berlingo", sizes: [{ w: "175", p: "65", r: "14", version: "Furgón" }, { w: "185", p: "65", r: "15", version: "Multispace" }] },
  { brand: "Citroen", model: "C3", sizes: [{ w: "175", p: "65", r: "14", version: "Gen 1" }, { w: "185", p: "60", r: "15", version: "Origine / Tendance" }, { w: "195", p: "55", r: "16", version: "Exclusive" }, { w: "195", p: "65", r: "15", version: "C3 (2022+)" }] },
  { brand: "Citroen", model: "C3 Aircross", sizes: [{ w: "205", p: "60", r: "16" }] },
  { brand: "Citroen", model: "C4", sizes: [{ w: "205", p: "55", r: "16", version: "Origine" }, { w: "225", p: "45", r: "17", version: "Tendance / Exclusive" }] },
  { brand: "Citroen", model: "C4 Lounge", sizes: [{ w: "205", p: "55", r: "16", version: "Origine" }, { w: "225", p: "45", r: "17", version: "Tendance / Exclusive" }] },
  { brand: "Citroen", model: "C4 Cactus", sizes: [{ w: "205", p: "55", r: "17" }] },
  { brand: "Citroen", model: "C4 Picasso", sizes: [{ w: "205", p: "60", r: "16" }, { w: "215", p: "50", r: "17" }] },
  { brand: "Citroen", model: "C5 Aircross", sizes: [{ w: "225", p: "55", r: "18" }] },
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
  { brand: "DS Automobiles", model: "DS 4", sizes: [{ w: "205", p: "55", r: "19" }] },
  { brand: "DS Automobiles", model: "DS 7 Crossback", sizes: [{ w: "235", p: "50", r: "19" }, { w: "235", p: "45", r: "20" }] },

  // FAW
  { brand: "FAW", model: "N5", sizes: [{ w: "175", p: "65", r: "14" }] },
  { brand: "FAW", model: "X40", sizes: [{ w: "215", p: "55", r: "17" }] },

  // Fiat
  { brand: "Fiat", model: "125", sizes: [{ w: "155", p: "80", r: "13", version: "Standard" }, { w: "175", p: "70", r: "13", version: "Mirafiori" }] },
  { brand: "Fiat", model: "128", sizes: [{ w: "145", p: "80", r: "13" }] },
  { brand: "Fiat", model: "500", sizes: [{ w: "185", p: "55", r: "15", version: "Cult / Lounge" }, { w: "195", p: "45", r: "16", version: "Sport / Cabrio" }] },
  { brand: "Fiat", model: "600", sizes: [{ w: "145", p: "80", r: "12" }] },
  { brand: "Fiat", model: "Argo", sizes: [{ w: "185", p: "60", r: "15", version: "Drive 1.3" }, { w: "195", p: "55", r: "16", version: "Precision / HGT" }] },
  { brand: "Fiat", model: "Cronos", sizes: [{ w: "185", p: "60", r: "15", version: "Drive 1.3" }, { w: "195", p: "55", r: "16", version: "Precision 1.8" }, { w: "205", p: "45", r: "17", version: "Precision AT" }] },
  { brand: "Fiat", model: "Ducato", sizes: [{ w: "215", p: "75", r: "16", version: "Furgón" }, { w: "225", p: "75", r: "16", version: "Minibus / Maxicargo" }] },
  { brand: "Fiat", model: "Duna", sizes: [{ w: "165", p: "70", r: "13" }] },
  { brand: "Fiat", model: "Fastback", sizes: [{ w: "205", p: "50", r: "17", version: "Audace / Impetus" }, { w: "215", p: "45", r: "18", version: "Abarth" }] },
  { brand: "Fiat", model: "Fiorino", sizes: [{ w: "175", p: "70", r: "14" }] },
  { brand: "Fiat", model: "Freemont", sizes: [{ w: "225", p: "65", r: "17" }] },
  { brand: "Fiat", model: "Grand Siena", sizes: [{ w: "175", p: "65", r: "14", version: "Attractive" }, { w: "185", p: "60", r: "15", version: "Essence" }] },
  { brand: "Fiat", model: "Idea", sizes: [{ w: "185", p: "60", r: "15", version: "Attractive / Essence" }, { w: "205", p: "70", r: "15", version: "Adventure" }] },
  { brand: "Fiat", model: "Linea", sizes: [{ w: "195", p: "65", r: "15", version: "Essence" }, { w: "205", p: "55", r: "16", version: "Absolute" }] },
  { brand: "Fiat", model: "Mobi", sizes: [{ w: "175", p: "65", r: "14" }] },
  { brand: "Fiat", model: "Palio", sizes: [{ w: "175", p: "65", r: "14", version: "Attractive" }, { w: "185", p: "60", r: "15", version: "Essence" }] },
  { brand: "Fiat", model: "Palio Weekend", sizes: [{ w: "175", p: "65", r: "14", version: "Attractive" }, { w: "185", p: "60", r: "15", version: "Essence" }, { w: "205", p: "70", r: "15", version: "Adventure" }] },
  { brand: "Fiat", model: "Pulse", sizes: [{ w: "195", p: "60", r: "16", version: "Drive 1.3" }, { w: "205", p: "50", r: "17", version: "Audace / Impetus" }] },
  { brand: "Fiat", model: "Punto", sizes: [{ w: "195", p: "55", r: "16", version: "Attractive / Essence" }, { w: "205", p: "55", r: "16", version: "Sporting" }] },
  { brand: "Fiat", model: "Siena", sizes: [{ w: "175", p: "65", r: "14", version: "Attractive" }, { w: "185", p: "60", r: "15", version: "Essence" }] },
  { brand: "Fiat", model: "Strada", sizes: [{ w: "175", p: "70", r: "14", version: "Working / Endurance" }, { w: "205", p: "60", r: "15", version: "Trekking / Freedom" }, { w: "205", p: "55", r: "16", version: "Adventure / Volcano" }] },
  { brand: "Fiat", model: "Titano", sizes: [{ w: "265", p: "65", r: "17" }, { w: "265", p: "60", r: "18" }] },
  { brand: "Fiat", model: "Toro", sizes: [{ w: "215", p: "65", r: "16", version: "Freedom" }, { w: "225", p: "60", r: "18", version: "Volcano / Ranch" }] },
  { brand: "Fiat", model: "Uno", sizes: [{ w: "165", p: "70", r: "13", version: "Fire" }, { w: "175", p: "70", r: "13", version: "Way" }, { w: "175", p: "65", r: "14", version: "Novo Uno Way" }] },
  { brand: "Fiat", model: "Uno Way", sizes: [{ w: "175", p: "70", r: "13" }, { w: "175", p: "65", r: "14", version: "Novo Uno Way" }] },

  // Ford
  { brand: "Ford", model: "Bronco", sizes: [{ w: "255", p: "75", r: "17" }, { w: "315", p: "70", r: "17", version: "Wildtrak" }] },
  { brand: "Ford", model: "Bronco Sport", sizes: [{ w: "225", p: "65", r: "17", version: "Big Bend" }, { w: "225", p: "60", r: "18", version: "Wildtrak" }] },
  { brand: "Ford", model: "EcoSport", sizes: [{ w: "205", p: "65", r: "15", version: "S / SE (Gen 2)" }, { w: "205", p: "60", r: "16", version: "Freestyle" }, { w: "205", p: "50", r: "17", version: "Titanium" }] },
  { brand: "Ford", model: "Edge", sizes: [{ w: "245", p: "50", r: "20" }] },
  { brand: "Ford", model: "F-100", sizes: [{ w: "215", p: "80", r: "16" }, { w: "235", p: "75", r: "15" }] },
  { brand: "Ford", model: "F-150", sizes: [{ w: "275", p: "65", r: "18", version: "XLT" }, { w: "275", p: "60", r: "20", version: "Lariat / Raptor" }] },
  { brand: "Ford", model: "Falcon", sizes: [{ w: "185", p: "80", r: "14", version: "Standard" }, { w: "195", p: "70", r: "14", version: "Futura / Sprint" }] },
  { brand: "Ford", model: "Fiesta", sizes: [{ w: "185", p: "60", r: "14", version: "Fiesta Max / One" }, { w: "185", p: "60", r: "15", version: "S / SE" }, { w: "195", p: "50", r: "16", version: "Titanium" }] },
  { brand: "Ford", model: "Fiesta Kinetic", sizes: [{ w: "185", p: "60", r: "15", version: "S / SE" }, { w: "195", p: "50", r: "16", version: "Titanium" }] },
  { brand: "Ford", model: "Focus", sizes: [{ w: "195", p: "65", r: "15", version: "Focus I / II S" }, { w: "205", p: "55", r: "16", version: "S / SE Gen 2/3" }, { w: "215", p: "50", r: "17", version: "SE Plus / Titanium" }] },
  { brand: "Ford", model: "Fusion", sizes: [{ w: "225", p: "50", r: "17" }, { w: "235", p: "45", r: "18" }] },
  { brand: "Ford", model: "Ka", sizes: [{ w: "165", p: "70", r: "13", version: "Gen 1" }, { w: "175", p: "65", r: "14", version: "S / SE Gen 3" }, { w: "195", p: "55", r: "15", version: "SEL / Freestyle" }] },
  { brand: "Ford", model: "Kuga", sizes: [{ w: "235", p: "55", r: "17", version: "SE" }, { w: "235", p: "50", r: "18", version: "Titanium" }] },
  { brand: "Ford", model: "Maverick", sizes: [{ w: "225", p: "65", r: "17", version: "XLT" }, { w: "225", p: "60", r: "18", version: "Lariat" }] },
  { brand: "Ford", model: "Mustang", sizes: [{ w: "255", p: "40", r: "19", version: "GT Front" }, { w: "275", p: "40", r: "19", version: "GT Rear" }] },
  { brand: "Ford", model: "Ranger", sizes: [{ w: "255", p: "70", r: "16", version: "XL" }, { w: "265", p: "65", r: "17", version: "XLT" }, { w: "265", p: "60", r: "18", version: "Limited" }, { w: "255", p: "55", r: "20", version: "Limited Plus (2023+)" }] },
  { brand: "Ford", model: "Ranger Raptor", sizes: [{ w: "285", p: "70", r: "17" }] },
  { brand: "Ford", model: "Taunus", sizes: [{ w: "175", p: "70", r: "13" }] },
  { brand: "Ford", model: "Territory", sizes: [{ w: "235", p: "50", r: "18", version: "SEL" }, { w: "235", p: "55", r: "19", version: "Titanium" }] },
  { brand: "Ford", model: "Transit", sizes: [{ w: "215", p: "75", r: "16" }] },

  // Foton
  { brand: "Foton", model: "Gratour", sizes: [{ w: "175", p: "70", r: "14" }] },
  { brand: "Foton", model: "Tunland", sizes: [{ w: "265", p: "70", r: "16" }, { w: "265", p: "65", r: "17" }] },

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
  { brand: "Haval", model: "Jolion", sizes: [{ w: "215", p: "60", r: "17" }, { w: "225", p: "55", r: "18" }] },

  // Honda
  { brand: "Honda", model: "Accord", sizes: [{ w: "215", p: "60", r: "16" }, { w: "225", p: "50", r: "17" }] },
  { brand: "Honda", model: "City", sizes: [{ w: "175", p: "65", r: "15", version: "LX" }, { w: "185", p: "55", r: "16", version: "EXL" }] },
  { brand: "Honda", model: "Civic", sizes: [{ w: "195", p: "65", r: "15", version: "Gen 7 / 8 LX" }, { w: "205", p: "55", r: "16", version: "LXS / EXS (Gen 8/9)" }, { w: "215", p: "50", r: "17", version: "EX / EXT (Gen 10)" }] },
  { brand: "Honda", model: "CR-V", sizes: [{ w: "225", p: "65", r: "17", version: "LX / EX (Gen 4)" }, { w: "235", p: "60", r: "18", version: "EXT (Gen 5)" }] },
  { brand: "Honda", model: "Fit", sizes: [{ w: "175", p: "65", r: "15", version: "LX" }, { w: "185", p: "55", r: "16", version: "EX / EXL" }] },
  { brand: "Honda", model: "HR-V", sizes: [{ w: "215", p: "55", r: "17" }] },
  { brand: "Honda", model: "WR-V", sizes: [{ w: "195", p: "60", r: "16" }] },
  { brand: "Honda", model: "ZR-V", sizes: [{ w: "215", p: "60", r: "17" }] },

  // Hyundai
  { brand: "Hyundai", model: "Atos", sizes: [{ w: "155", p: "70", r: "13" }] },
  { brand: "Hyundai", model: "Creta", sizes: [{ w: "205", p: "65", r: "16", version: "GL" }, { w: "215", p: "60", r: "17", version: "GLS" }] },
  { brand: "Hyundai", model: "Elantra", sizes: [{ w: "205", p: "55", r: "16" }] },
  { brand: "Hyundai", model: "Genesis", sizes: [{ w: "225", p: "45", r: "18" }, { w: "245", p: "45", r: "18" }] },
  { brand: "Hyundai", model: "Grand i10", sizes: [{ w: "165", p: "65", r: "14" }] },
  { brand: "Hyundai", model: "H1", sizes: [{ w: "215", p: "70", r: "16" }] },
  { brand: "Hyundai", model: "i10", sizes: [{ w: "165", p: "65", r: "14" }] },
  { brand: "Hyundai", model: "i30", sizes: [{ w: "205", p: "55", r: "16" }, { w: "225", p: "45", r: "17" }] },
  { brand: "Hyundai", model: "Santa Fe", sizes: [{ w: "235", p: "65", r: "17", version: "GLS 2.4" }, { w: "235", p: "60", r: "18", version: "GLS 3.3 / Diesel" }] },
  { brand: "Hyundai", model: "Tucson", sizes: [{ w: "225", p: "60", r: "17", version: "GL" }, { w: "225", p: "55", r: "18", version: "GLS Full Premium" }] },
  { brand: "Hyundai", model: "Veloster", sizes: [{ w: "215", p: "45", r: "17" }, { w: "225", p: "40", r: "18" }] },

  // Ika
  { brand: "Ika", model: "Torino", sizes: [{ w: "185", p: "80", r: "15", version: "S / L" }, { w: "195", p: "70", r: "15", version: "TS / TSX / ZX" }] },

  // ISUZU
  { brand: "ISUZU", model: "D-Max", sizes: [{ w: "245", p: "70", r: "16" }, { w: "255", p: "65", r: "17" }] },
  { brand: "ISUZU", model: "Pickup", sizes: [{ w: "215", p: "80", r: "16" }] },

  // JAC
  { brand: "JAC", model: "J4", sizes: [{ w: "185", p: "65", r: "15" }] },
  { brand: "JAC", model: "S2", sizes: [{ w: "205", p: "55", r: "16" }] },
  { brand: "JAC", model: "S3", sizes: [{ w: "205", p: "55", r: "16" }] },
  { brand: "JAC", model: "S5", sizes: [{ w: "225", p: "60", r: "17" }] },
  { brand: "JAC", model: "T6", sizes: [{ w: "245", p: "70", r: "16" }] },
  { brand: "JAC", model: "T8", sizes: [{ w: "265", p: "60", r: "18" }] },

  // Jaguar
  { brand: "Jaguar", model: "F-Pace", sizes: [{ w: "255", p: "55", r: "19" }, { w: "255", p: "50", r: "20" }] },
  { brand: "Jaguar", model: "XE", sizes: [{ w: "225", p: "50", r: "17" }, { w: "225", p: "45", r: "18" }] },
  { brand: "Jaguar", model: "XF", sizes: [{ w: "225", p: "55", r: "17" }, { w: "245", p: "45", r: "18" }] },

  // Jeep
  { brand: "Jeep", model: "Cherokee", sizes: [{ w: "225", p: "75", r: "15" }, { w: "235", p: "70", r: "16" }] },
  { brand: "Jeep", model: "Commander", sizes: [{ w: "235", p: "50", r: "19" }] },
  { brand: "Jeep", model: "Compass", sizes: [{ w: "225", p: "55", r: "18", version: "Sport / Longitude" }, { w: "235", p: "45", r: "19", version: "Limited" }] },
  { brand: "Jeep", model: "Gladiator", sizes: [{ w: "255", p: "70", r: "18" }, { w: "285", p: "70", r: "17" }] },
  { brand: "Jeep", model: "Grand Cherokee", sizes: [{ w: "265", p: "60", r: "18", version: "Laredo" }, { w: "265", p: "50", r: "20", version: "Limited / Overland" }] },
  { brand: "Jeep", model: "Renegade", sizes: [{ w: "215", p: "65", r: "16", version: "Sport" }, { w: "215", p: "60", r: "17", version: "Trailhawk" }, { w: "225", p: "55", r: "18", version: "Longitude / Limited" }] },
  { brand: "Jeep", model: "Wrangler", sizes: [{ w: "245", p: "75", r: "17", version: "Sport" }, { w: "255", p: "70", r: "18", version: "Sahara" }, { w: "285", p: "70", r: "17", version: "Rubicon" }] },

  // Jetour
  { brand: "Jetour", model: "Dashing", sizes: [{ w: "235", p: "55", r: "19" }] },
  { brand: "Jetour", model: "X70", sizes: [{ w: "235", p: "60", r: "18", version: "Comfort" }, { w: "255", p: "45", r: "20", version: "Luxury" }] },
  { brand: "Jetour", model: "X70 Plus", sizes: [{ w: "235", p: "55", r: "19" }] },

  // JMC
  { brand: "JMC", model: "Carrying", sizes: [{ w: "185", p: "75", r: "16" }] },
  { brand: "JMC", model: "Grand Avenue", sizes: [{ w: "265", p: "65", r: "17" }] },

  // Kia
  { brand: "Kia", model: "Carnival", sizes: [{ w: "235", p: "60", r: "18" }] },
  { brand: "Kia", model: "Cerato", sizes: [{ w: "205", p: "55", r: "16", version: "EX" }, { w: "215", p: "45", r: "17", version: "SX" }] },
  { brand: "Kia", model: "Picanto", sizes: [{ w: "165", p: "60", r: "14" }] },
  { brand: "Kia", model: "Rio", sizes: [{ w: "185", p: "65", r: "15", version: "EX" }, { w: "205", p: "45", r: "17", version: "SX" }] },
  { brand: "Kia", model: "Sorento", sizes: [{ w: "235", p: "60", r: "18" }] },
  { brand: "Kia", model: "Soul", sizes: [{ w: "205", p: "60", r: "16" }, { w: "215", p: "55", r: "17" }] },
  { brand: "Kia", model: "Sportage", sizes: [{ w: "225", p: "60", r: "17", version: "EX" }, { w: "225", p: "55", r: "18", version: "GT-Line" }] },

  // KyC
  { brand: "KyC", model: "Mamut", sizes: [{ w: "185", p: "70", r: "14" }] },

  // Land Rover
  { brand: "Land Rover", model: "Defender", sizes: [{ w: "255", p: "70", r: "18" }, { w: "255", p: "60", r: "20" }] },
  { brand: "Land Rover", model: "Discovery", sizes: [{ w: "255", p: "55", r: "19" }, { w: "255", p: "50", r: "20" }] },
  { brand: "Land Rover", model: "Discovery Sport", sizes: [{ w: "235", p: "60", r: "18" }, { w: "235", p: "55", r: "19" }] },
  { brand: "Land Rover", model: "Range Rover Evoque", sizes: [{ w: "235", p: "60", r: "18" }, { w: "235", p: "55", r: "19" }] },
  { brand: "Land Rover", model: "Range Rover Velar", sizes: [{ w: "255", p: "55", r: "19" }, { w: "255", p: "50", r: "20" }] },

  // Lexus
  { brand: "Lexus", model: "ES", sizes: [{ w: "215", p: "55", r: "17" }, { w: "235", p: "45", r: "18" }] },
  { brand: "Lexus", model: "IS", sizes: [{ w: "225", p: "45", r: "17" }, { w: "225", p: "40", r: "18" }] },
  { brand: "Lexus", model: "NX", sizes: [{ w: "225", p: "60", r: "18" }, { w: "235", p: "50", r: "20" }] },
  { brand: "Lexus", model: "RX", sizes: [{ w: "235", p: "65", r: "18" }, { w: "235", p: "55", r: "20" }] },
  { brand: "Lexus", model: "UX", sizes: [{ w: "215", p: "60", r: "17" }, { w: "225", p: "50", r: "18" }] },

  // Lifan
  { brand: "Lifan", model: "Foison", sizes: [{ w: "175", p: "70", r: "14" }] },
  { brand: "Lifan", model: "Myway", sizes: [{ w: "215", p: "65", r: "16" }] },
  { brand: "Lifan", model: "X50", sizes: [{ w: "195", p: "60", r: "15" }] },
  { brand: "Lifan", model: "X60", sizes: [{ w: "215", p: "65", r: "16" }] },
  { brand: "Lifan", model: "X70", sizes: [{ w: "215", p: "60", r: "17" }] },

  // Mercedes-Benz
  { brand: "Mercedes-Benz", model: "Clase A", sizes: [{ w: "205", p: "55", r: "16", version: "A200 Style" }, { w: "225", p: "45", r: "17", version: "A200 Urban" }] },
  { brand: "Mercedes-Benz", model: "Clase B", sizes: [{ w: "205", p: "55", r: "16" }] },
  { brand: "Mercedes-Benz", model: "Clase C", sizes: [{ w: "225", p: "50", r: "17", version: "C200" }, { w: "225", p: "45", r: "18", version: "C250 / C300" }] },
  { brand: "Mercedes-Benz", model: "Clase E", sizes: [{ w: "225", p: "55", r: "17" }, { w: "245", p: "45", r: "18" }] },
  { brand: "Mercedes-Benz", model: "CLA", sizes: [{ w: "225", p: "45", r: "17" }, { w: "225", p: "40", r: "18" }] },
  { brand: "Mercedes-Benz", model: "GLA", sizes: [{ w: "235", p: "50", r: "18" }] },
  { brand: "Mercedes-Benz", model: "GLB", sizes: [{ w: "215", p: "65", r: "17" }, { w: "235", p: "55", r: "18" }] },
  { brand: "Mercedes-Benz", model: "GLC", sizes: [{ w: "235", p: "60", r: "18" }] },
  { brand: "Mercedes-Benz", model: "GLE", sizes: [{ w: "255", p: "50", r: "19" }, { w: "275", p: "45", r: "20" }] },
  { brand: "Mercedes-Benz", model: "Sprinter", sizes: [{ w: "225", p: "75", r: "16" }] },
  { brand: "Mercedes-Benz", model: "Vito", sizes: [{ w: "205", p: "65", r: "16", version: "Furgón" }, { w: "225", p: "55", r: "17", version: "Tourer" }] },

  // MG
  { brand: "MG", model: "GT", sizes: [{ w: "215", p: "50", r: "17" }] },
  { brand: "MG", model: "HS", sizes: [{ w: "235", p: "50", r: "18" }] },
  { brand: "MG", model: "ZS", sizes: [{ w: "215", p: "50", r: "17" }] },

  // Mini
  { brand: "Mini", model: "Clubman", sizes: [{ w: "205", p: "55", r: "16" }, { w: "225", p: "45", r: "17" }] },
  { brand: "Mini", model: "Cooper", sizes: [{ w: "175", p: "65", r: "15" }, { w: "195", p: "55", r: "16" }, { w: "205", p: "45", r: "17" }] },
  { brand: "Mini", model: "Countryman", sizes: [{ w: "205", p: "65", r: "16" }, { w: "225", p: "55", r: "17" }] },

  // Mitsubishi
  { brand: "Mitsubishi", model: "L200", sizes: [{ w: "245", p: "70", r: "16" }, { w: "265", p: "65", r: "17" }] },
  { brand: "Mitsubishi", model: "Lancer", sizes: [{ w: "205", p: "60", r: "16" }] },
  { brand: "Mitsubishi", model: "Montero", sizes: [{ w: "265", p: "70", r: "16" }, { w: "265", p: "65", r: "17" }] },
  { brand: "Mitsubishi", model: "Outlander", sizes: [{ w: "215", p: "70", r: "16" }, { w: "225", p: "55", r: "18" }] },

  // Nissan
  { brand: "Nissan", model: "Frontier", sizes: [{ w: "255", p: "70", r: "16", version: "S / SE" }, { w: "255", p: "60", r: "18", version: "XE / LE / Pro-4X" }] },
  { brand: "Nissan", model: "Kicks", sizes: [{ w: "205", p: "60", r: "16", version: "Sense" }, { w: "205", p: "55", r: "17", version: "Advance / Exclusive" }] },
  { brand: "Nissan", model: "Livina", sizes: [{ w: "185", p: "65", r: "15" }] },
  { brand: "Nissan", model: "March", sizes: [{ w: "175", p: "60", r: "15" }] },
  { brand: "Nissan", model: "Murano", sizes: [{ w: "235", p: "65", r: "18" }, { w: "235", p: "55", r: "20" }] },
  { brand: "Nissan", model: "Note", sizes: [{ w: "185", p: "65", r: "15", version: "Sense" }, { w: "195", p: "55", r: "16", version: "Advance / Exclusive" }] },
  { brand: "Nissan", model: "Pathfinder", sizes: [{ w: "255", p: "60", r: "18" }] },
  { brand: "Nissan", model: "Sentra", sizes: [{ w: "205", p: "55", r: "16", version: "Advance" }, { w: "215", p: "50", r: "17", version: "SR / Exclusive" }] },
  { brand: "Nissan", model: "Tiida", sizes: [{ w: "185", p: "65", r: "15", version: "Visia / Acenta" }, { w: "195", p: "65", r: "15", version: "Tekna" }] },
  { brand: "Nissan", model: "Versa", sizes: [{ w: "195", p: "65", r: "15", version: "Sense" }, { w: "205", p: "55", r: "16", version: "Advance / Exclusive" }] },
  { brand: "Nissan", model: "X-Trail", sizes: [{ w: "225", p: "65", r: "17", version: "Sense" }, { w: "225", p: "60", r: "18", version: "Exclusive" }] },

  // Peugeot
  { brand: "Peugeot", model: "2008", sizes: [{ w: "205", p: "60", r: "16", version: "Active / Allure" }, { w: "215", p: "60", r: "17", version: "Feline / Sport" }] },
  { brand: "Peugeot", model: "206", sizes: [{ w: "175", p: "65", r: "14", version: "XR / XS" }, { w: "185", p: "65", r: "14", version: "XT" }, { w: "185", p: "60", r: "15", version: "XS / XT / GTI" }] },
  { brand: "Peugeot", model: "207", sizes: [{ w: "185", p: "65", r: "14", version: "Active" }, { w: "185", p: "60", r: "15", version: "Allure / Feline" }] },
  { brand: "Peugeot", model: "207 Compact", sizes: [{ w: "185", p: "65", r: "14", version: "Active" }, { w: "185", p: "60", r: "15", version: "Allure / Feline" }] },
  { brand: "Peugeot", model: "208", sizes: [{ w: "185", p: "65", r: "15", version: "Like (Gen 2)" }, { w: "195", p: "55", r: "16", version: "Active / Allure (Gen 1 & 2)" }, { w: "205", p: "45", r: "17", version: "GT / Feline" }] },
  { brand: "Peugeot", model: "3008", sizes: [{ w: "225", p: "55", r: "18" }] },
  { brand: "Peugeot", model: "301", sizes: [{ w: "185", p: "65", r: "15" }] },
  { brand: "Peugeot", model: "307", sizes: [{ w: "195", p: "65", r: "15", version: "XR / XS" }, { w: "205", p: "55", r: "16", version: "XT / XS Premium" }, { w: "205", p: "50", r: "17", version: "Feline" }] },
  { brand: "Peugeot", model: "308", sizes: [{ w: "205", p: "55", r: "16", version: "Active" }, { w: "225", p: "45", r: "17", version: "Allure / Feline" }] },
  { brand: "Peugeot", model: "405", sizes: [{ w: "175", p: "70", r: "14", version: "GL / GR" }, { w: "185", p: "65", r: "14", version: "SR / SRI" }] },
  { brand: "Peugeot", model: "408", sizes: [{ w: "205", p: "55", r: "16", version: "Active" }, { w: "225", p: "45", r: "17", version: "Allure / Feline" }] },
  { brand: "Peugeot", model: "5008", sizes: [{ w: "225", p: "55", r: "18" }] },
  { brand: "Peugeot", model: "504", sizes: [{ w: "175", p: "80", r: "14" }] },
  { brand: "Peugeot", model: "505", sizes: [{ w: "185", p: "70", r: "14" }] },
  { brand: "Peugeot", model: "508", sizes: [{ w: "215", p: "55", r: "17" }] },
  { brand: "Peugeot", model: "Boxer", sizes: [{ w: "215", p: "75", r: "16" }] },
  { brand: "Peugeot", model: "Expert", sizes: [{ w: "215", p: "65", r: "16" }] },
  { brand: "Peugeot", model: "Partner", sizes: [{ w: "175", p: "65", r: "14", version: "Confort" }, { w: "185", p: "65", r: "15", version: "Patagónica" }] },

  // Porsche
  { brand: "Porsche", model: "911", sizes: [{ w: "235", p: "40", r: "19", version: "Front" }, { w: "295", p: "35", r: "20", version: "Rear" }] },
  { brand: "Porsche", model: "Boxster", sizes: [{ w: "235", p: "45", r: "18" }, { w: "265", p: "45", r: "18" }] },
  { brand: "Porsche", model: "Cayenne", sizes: [{ w: "255", p: "55", r: "19" }, { w: "275", p: "45", r: "20" }] },
  { brand: "Porsche", model: "Cayman", sizes: [{ w: "235", p: "45", r: "18" }, { w: "265", p: "45", r: "18" }] },
  { brand: "Porsche", model: "Macan", sizes: [{ w: "235", p: "60", r: "18" }, { w: "255", p: "55", r: "19" }] },
  { brand: "Porsche", model: "Panamera", sizes: [{ w: "245", p: "50", r: "18" }, { w: "275", p: "45", r: "18" }] },

  // RAM
  { brand: "RAM", model: "RAM 1500", sizes: [{ w: "275", p: "60", r: "20" }] },
  { brand: "RAM", model: "RAM 2500", sizes: [{ w: "275", p: "70", r: "18" }] },
  { brand: "RAM", model: "Rampage", sizes: [{ w: "235", p: "60", r: "17", version: "Rebel" }, { w: "235", p: "55", r: "18", version: "Laramie / R/T" }] },

  // Renault
  { brand: "Renault", model: "Alaskan", sizes: [{ w: "255", p: "60", r: "18" }] },
  { brand: "Renault", model: "Captur", sizes: [{ w: "215", p: "60", r: "17" }] },
  { brand: "Renault", model: "Clio", sizes: [{ w: "165", p: "70", r: "13", version: "RL / RN / Base (1996-2006)" }, { w: "175", p: "65", r: "14", version: "RT / Dynamique (2000-2016)" }, { w: "185", p: "60", r: "14", version: "RSI / Sport 1.6" }, { w: "185", p: "55", r: "15", version: "Sport 2.0 / Williams" }] },
  { brand: "Renault", model: "Clio Mio", sizes: [{ w: "175", p: "65", r: "14", version: "Expression / Dynamique" }] },
  { brand: "Renault", model: "Duster", sizes: [{ w: "215", p: "65", r: "16" }] },
  { brand: "Renault", model: "Duster Oroch", sizes: [{ w: "215", p: "65", r: "16" }] },
  { brand: "Renault", model: "Fluence", sizes: [{ w: "205", p: "60", r: "16", version: "Dynamique" }, { w: "205", p: "55", r: "17", version: "Privilege / GT" }] },
  { brand: "Renault", model: "Kangoo", sizes: [{ w: "175", p: "70", r: "14", version: "Kangoo 1 (1998-2018)" }, { w: "185", p: "65", r: "15", version: "Kangoo 2 (2018+)" }] },
  { brand: "Renault", model: "Kardian", sizes: [{ w: "205", p: "60", r: "16", version: "Evolution" }, { w: "205", p: "55", r: "17", version: "Techno / Premiere Edition" }] },
  { brand: "Renault", model: "Kwid", sizes: [{ w: "165", p: "70", r: "14", version: "Zen / Intense / Outsider" }] },
  { brand: "Renault", model: "Logan", sizes: [{ w: "185", p: "65", r: "15" }] },
  { brand: "Renault", model: "Master", sizes: [{ w: "225", p: "65", r: "16" }] },
  { brand: "Renault", model: "Megane", sizes: [{ w: "185", p: "60", r: "14", version: "Megane I" }, { w: "185", p: "65", r: "15", version: "Megane I / II" }, { w: "205", p: "55", r: "16", version: "Megane II / III Luxe" }, { w: "225", p: "45", r: "17", version: "Megane III Privilege / RS" }] },
  { brand: "Renault", model: "Oroch", sizes: [{ w: "215", p: "65", r: "16" }] },
  { brand: "Renault", model: "Sandero", sizes: [{ w: "185", p: "65", r: "15", version: "Life/Zen/Intens" }, { w: "195", p: "55", r: "16", version: "RS" }] },
  { brand: "Renault", model: "Sandero Stepway", sizes: [{ w: "195", p: "55", r: "16" }] },
  { brand: "Renault", model: "Stepway", sizes: [{ w: "195", p: "55", r: "16" }] },
  { brand: "Renault", model: "Symbol", sizes: [{ w: "185", p: "65", r: "15" }] },
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
  { brand: "Suzuki", model: "Grand Vitara", sizes: [{ w: "235", p: "60", r: "16" }, { w: "225", p: "65", r: "17" }] },
  { brand: "Suzuki", model: "Jimny", sizes: [{ w: "195", p: "80", r: "15" }, { w: "205", p: "70", r: "15" }] },
  { brand: "Suzuki", model: "Swift", sizes: [{ w: "185", p: "55", r: "16" }] },
  { brand: "Suzuki", model: "Vitara", sizes: [{ w: "215", p: "55", r: "17" }] },

  // Toyota
  { brand: "Toyota", model: "Camry", sizes: [{ w: "215", p: "60", r: "16" }, { w: "215", p: "55", r: "17" }] },
  { brand: "Toyota", model: "Corolla", sizes: [{ w: "195", p: "65", r: "15", version: "Corolla (2003-2008)" }, { w: "205", p: "55", r: "16", version: "XLI / XEI" }, { w: "225", p: "45", r: "17", version: "SEG / GR-Sport" }] },
  { brand: "Toyota", model: "Corolla Cross", sizes: [{ w: "215", p: "60", r: "17", version: "XLI" }, { w: "225", p: "50", r: "18", version: "XEI / SEG / GR-S" }] },
  { brand: "Toyota", model: "Etios", sizes: [{ w: "175", p: "65", r: "14", version: "X" }, { w: "185", p: "60", r: "15", version: "XS / XLS" }] },
  { brand: "Toyota", model: "GR Yaris", sizes: [{ w: "225", p: "40", r: "18" }] },
  { brand: "Toyota", model: "Hiace", sizes: [{ w: "195", p: "80", r: "15", version: "Furgón / Commuter" }, { w: "215", p: "65", r: "16", version: "Wagon / Executive" }] },
  { brand: "Toyota", model: "Hilux", sizes: [{ w: "225", p: "70", r: "17", version: "DX" }, { w: "265", p: "65", r: "17", version: "SR / SRV" }, { w: "265", p: "60", r: "18", version: "SRX / GR-Sport" }] },
  { brand: "Toyota", model: "Hilux SW4", sizes: [{ w: "265", p: "65", r: "17", version: "SR" }, { w: "265", p: "60", r: "18", version: "SRX" }] },
  { brand: "Toyota", model: "Land Cruiser", sizes: [{ w: "285", p: "65", r: "17" }, { w: "285", p: "60", r: "18" }] },
  { brand: "Toyota", model: "Prius", sizes: [{ w: "195", p: "65", r: "15" }] },
  { brand: "Toyota", model: "RAV4", sizes: [{ w: "225", p: "65", r: "17", version: "XLE / VX" }, { w: "235", p: "55", r: "18", version: "Limited / Hybrid" }] },
  { brand: "Toyota", model: "SW4", sizes: [{ w: "265", p: "65", r: "17", version: "SR" }, { w: "265", p: "60", r: "18", version: "SRX" }] },
  { brand: "Toyota", model: "Yaris", sizes: [{ w: "185", p: "60", r: "15", version: "XS" }, { w: "195", p: "50", r: "16", version: "XLS / S" }] },

  // Volkswagen
  { brand: "Volkswagen", model: "Amarok", sizes: [{ w: "245", p: "70", r: "16", version: "Trendline" }, { w: "245", p: "65", r: "17", version: "Comfortline" }, { w: "255", p: "60", r: "18", version: "Highline" }, { w: "255", p: "50", r: "20", version: "Extreme / V6" }] },
  { brand: "Volkswagen", model: "Bora", sizes: [{ w: "195", p: "65", r: "15", version: "Trendline 2.0 / 1.9 TDI" }, { w: "225", p: "45", r: "17", version: "1.8T Highline" }] },
  { brand: "Volkswagen", model: "Caddy", sizes: [{ w: "175", p: "65", r: "14" }, { w: "185", p: "65", r: "15" }] },
  { brand: "Volkswagen", model: "Crossfox", sizes: [{ w: "195", p: "55", r: "15" }] },
  { brand: "Volkswagen", model: "Fox", sizes: [{ w: "195", p: "55", r: "15", version: "Comfortline" }, { w: "195", p: "50", r: "16", version: "Highline" }] },
  { brand: "Volkswagen", model: "Gol", sizes: [{ w: "175", p: "70", r: "14", version: "Trendline / Power" }, { w: "185", p: "60", r: "14", version: "Comfortline" }, { w: "195", p: "55", r: "15", version: "Highline" }] },
  { brand: "Volkswagen", model: "Gol Trend", sizes: [{ w: "175", p: "70", r: "14", version: "Trendline / Power" }, { w: "185", p: "60", r: "14", version: "Comfortline" }, { w: "195", p: "55", r: "15", version: "Highline" }] },
  { brand: "Volkswagen", model: "Golf", sizes: [{ w: "195", p: "65", r: "15", version: "Trendline" }, { w: "205", p: "55", r: "16", version: "Comfortline" }, { w: "225", p: "45", r: "17", version: "Highline / GTI" }] },
  { brand: "Volkswagen", model: "Nivus", sizes: [{ w: "205", p: "60", r: "16", version: "Comfortline" }, { w: "205", p: "55", r: "17", version: "Highline" }] },
  { brand: "Volkswagen", model: "Passat", sizes: [{ w: "215", p: "55", r: "16", version: "Comfortline" }, { w: "235", p: "45", r: "17", version: "Highline" }] },
  { brand: "Volkswagen", model: "Polo", sizes: [{ w: "185", p: "65", r: "15", version: "Track / Trendline" }, { w: "195", p: "55", r: "16", version: "Comfortline" }, { w: "205", p: "50", r: "17", version: "Highline / GTS" }] },
  { brand: "Volkswagen", model: "Polo Track", sizes: [{ w: "185", p: "65", r: "15" }] },
  { brand: "Volkswagen", model: "Saveiro", sizes: [{ w: "205", p: "60", r: "15" }] },
  { brand: "Volkswagen", model: "Scirocco", sizes: [{ w: "225", p: "45", r: "17", version: "1.4 TSI" }, { w: "235", p: "40", r: "18", version: "2.0 TSI" }] },
  { brand: "Volkswagen", model: "Suran", sizes: [{ w: "195", p: "55", r: "15" }] },
  { brand: "Volkswagen", model: "Taos", sizes: [{ w: "215", p: "55", r: "18" }] },
  { brand: "Volkswagen", model: "Tera", sizes: [{ w: "195", p: "65", r: "15", version: "Trendline" }, { w: "205", p: "60", r: "16", version: "Comfortline" }] },
  { brand: "Volkswagen", model: "T-Cross", sizes: [{ w: "205", p: "60", r: "16", version: "Trendline / Comfortline" }, { w: "205", p: "55", r: "17", version: "Highline" }] },
  { brand: "Volkswagen", model: "Tiguan", sizes: [{ w: "215", p: "65", r: "17", version: "Trendline" }, { w: "235", p: "55", r: "18", version: "Comfortline" }, { w: "235", p: "50", r: "19", version: "Highline / R-Line" }] },
  { brand: "Volkswagen", model: "Up!", sizes: [{ w: "175", p: "70", r: "14", version: "Take / Move" }, { w: "185", p: "60", r: "15", version: "High / Pepper" }] },
  { brand: "Volkswagen", model: "Vento", sizes: [{ w: "205", p: "55", r: "16", version: "Advance / Comfortline" }, { w: "225", p: "45", r: "17", version: "Highline / GLI" }] },
  { brand: "Volkswagen", model: "Virtus", sizes: [{ w: "185", p: "65", r: "15" }] },
  { brand: "Volkswagen", model: "Voyage", sizes: [{ w: "175", p: "70", r: "14" }] },

  // Volvo
  { brand: "Volvo", model: "C30", sizes: [{ w: "205", p: "55", r: "16" }, { w: "205", p: "50", r: "17" }] },
  { brand: "Volvo", model: "S60", sizes: [{ w: "215", p: "55", r: "16" }, { w: "225", p: "50", r: "17" }] },
  { brand: "Volvo", model: "V40", sizes: [{ w: "205", p: "55", r: "16" }, { w: "225", p: "45", r: "17" }] },
  { brand: "Volvo", model: "XC40", sizes: [{ w: "235", p: "55", r: "18" }, { w: "235", p: "50", r: "19" }] },
  { brand: "Volvo", model: "XC60", sizes: [{ w: "235", p: "60", r: "18" }, { w: "235", p: "55", r: "19" }] },
  { brand: "Volvo", model: "XC90", sizes: [{ w: "235", p: "60", r: "18" }, { w: "275", p: "45", r: "20" }] },

  // Zotye
  { brand: "Zotye", model: "Z100", sizes: [{ w: "165", p: "60", r: "14" }] }
].sort((a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model));

export function getSizesForVehicle(brand: string, model: string): VehicleDBEntry["sizes"] | null {
  const entry = VEHICLE_DB.find((v) => v.brand === brand && v.model === model);
  return entry ? entry.sizes : null;
}

export function getAllVehicleOptions(): { marca: string; modelo: string; label: string }[] {
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

  return Array.from(mergedMap.values()).sort((a, b) => {
    const la = a.label;
    const lb = b.label;
    return la > lb ? 1 : la < lb ? -1 : 0;
  });
}
