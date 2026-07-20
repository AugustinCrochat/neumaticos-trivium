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
  { brand: "Alfa Romeo", model: "Giulietta", sizes: [{ w: "225", p: "45", r: "17", version: "Distinctive" }, { w: "225", p: "40", r: "18", version: "Quadrifoglio Verde" }] },
  { brand: "Alfa Romeo", model: "Mito", sizes: [{ w: "215", p: "45", r: "17" }] },
  
  // Audi
  { brand: "Audi", model: "A1", sizes: [{ w: "215", p: "45", r: "16", version: "Attraction" }, { w: "215", p: "40", r: "17", version: "S-Line / 1.4 TFSI" }] },
  { brand: "Audi", model: "A3", sizes: [{ w: "205", p: "55", r: "16", version: "Base" }, { w: "225", p: "45", r: "17", version: "S-Line" }, { w: "225", p: "40", r: "18", version: "S3" }] },
  { brand: "Audi", model: "A4", sizes: [{ w: "225", p: "50", r: "17", version: "Base" }, { w: "245", p: "40", r: "18", version: "S-Line" }] },
  { brand: "Audi", model: "Q3", sizes: [{ w: "235", p: "55", r: "17", version: "Base" }, { w: "235", p: "50", r: "18", version: "Sport" }] },
  { brand: "Audi", model: "Q5", sizes: [{ w: "235", p: "60", r: "18", version: "Base" }, { w: "235", p: "55", r: "19", version: "S-Line" }] },

  // BAIC
  { brand: "BAIC", model: "X35", sizes: [{ w: "215", p: "50", r: "17" }] },
  { brand: "BAIC", model: "X55", sizes: [{ w: "225", p: "55", r: "19" }] },
  
  // BMW
  { brand: "BMW", model: "Serie 1", sizes: [{ w: "205", p: "55", r: "16", version: "118i" }, { w: "225", p: "45", r: "17", version: "120i M Sport" }] },
  { brand: "BMW", model: "Serie 3", sizes: [{ w: "225", p: "50", r: "17", version: "320i" }, { w: "225", p: "45", r: "18", version: "330i M Sport" }] },
  { brand: "BMW", model: "X1", sizes: [{ w: "225", p: "55", r: "17", version: "sDrive20i" }, { w: "225", p: "50", r: "18", version: "xDrive25i" }] },

  // Changan
  { brand: "Changan", model: "CS15", sizes: [{ w: "205", p: "55", r: "16" }] },
  { brand: "Changan", model: "CS55", sizes: [{ w: "225", p: "55", r: "18" }] },

  // Chery
  { brand: "Chery", model: "Tiggo", sizes: [{ w: "215", p: "65", r: "16" }] },
  { brand: "Chery", model: "Tiggo 3", sizes: [{ w: "215", p: "60", r: "17" }] },
  { brand: "Chery", model: "Tiggo 4", sizes: [{ w: "215", p: "60", r: "17" }] },
  { brand: "Chery", model: "Tiggo 8", sizes: [{ w: "235", p: "55", r: "18" }] },
  { brand: "Chery", model: "QQ", sizes: [{ w: "155", p: "65", r: "13", version: "Light / Basic" }, { w: "155", p: "65", r: "14", version: "Confort" }] },

  // Chevrolet
  { brand: "Chevrolet", model: "Agile", sizes: [{ w: "185", p: "60", r: "15", version: "LS / LT" }, { w: "195", p: "55", r: "16", version: "LTZ / Effect" }] },
  { brand: "Chevrolet", model: "Astra", sizes: [{ w: "195", p: "60", r: "15" }] },
  { brand: "Chevrolet", model: "Camaro", sizes: [{ w: "245", p: "40", r: "20", version: "Front" }, { w: "275", p: "40", r: "20", version: "Rear" }] },
  { brand: "Chevrolet", model: "Chevy", sizes: [{ w: "195", p: "70", r: "14" }] },
  { brand: "Chevrolet", model: "Classic", sizes: [{ w: "165", p: "70", r: "13", version: "LS (Base)" }, { w: "185", p: "60", r: "14", version: "LT / GLS" }] },
  { brand: "Chevrolet", model: "Corsa", sizes: [{ w: "165", p: "70", r: "13", version: "LS (Base)" }, { w: "185", p: "60", r: "14", version: "LT / GLS" }] },
  { brand: "Chevrolet", model: "Cruze", sizes: [{ w: "205", p: "60", r: "16", version: "LT" }, { w: "215", p: "50", r: "17", version: "LTZ / Premier" }] },
  { brand: "Chevrolet", model: "Equinox", sizes: [{ w: "225", p: "65", r: "17", version: "FWD" }, { w: "235", p: "50", r: "19", version: "AWD Premier" }] },
  { brand: "Chevrolet", model: "Montana", sizes: [{ w: "215", p: "60", r: "17" }] },
  { brand: "Chevrolet", model: "Onix", sizes: [{ w: "185", p: "70", r: "14", version: "Joy / LS" }, { w: "185", p: "65", r: "15", version: "LT" }, { w: "195", p: "55", r: "16", version: "LTZ / Premier" }] },
  { brand: "Chevrolet", model: "Prisma", sizes: [{ w: "185", p: "70", r: "14", version: "Joy / LS" }, { w: "185", p: "65", r: "15", version: "LT" }, { w: "195", p: "55", r: "16", version: "LTZ / Premier" }] },
  { brand: "Chevrolet", model: "S10", sizes: [{ w: "245", p: "70", r: "16", version: "LS" }, { w: "255", p: "65", r: "17", version: "LT" }, { w: "265", p: "60", r: "18", version: "LTZ / High Country" }] },
  { brand: "Chevrolet", model: "Spin", sizes: [{ w: "195", p: "65", r: "15" }] },
  { brand: "Chevrolet", model: "Tracker", sizes: [{ w: "205", p: "60", r: "16", version: "LT (2013-2020)" }, { w: "215", p: "55", r: "17", version: "Tracker MT / AT (2020+)" }, { w: "215", p: "55", r: "18", version: "Premier (2020+)" }] },
  { brand: "Chevrolet", model: "Trailblazer", sizes: [{ w: "265", p: "60", r: "18" }] },

  // Citroën
  { brand: "Citroen", model: "Berlingo", sizes: [{ w: "175", p: "65", r: "14", version: "Furgón" }, { w: "185", p: "65", r: "15", version: "Multispace" }] },
  { brand: "Citroen", model: "C3", sizes: [{ w: "185", p: "60", r: "15", version: "Origine / Tendance" }, { w: "195", p: "55", r: "16", version: "Exclusive" }] },
  { brand: "Citroen", model: "C3 Aircross", sizes: [{ w: "205", p: "60", r: "16" }] },
  { brand: "Citroen", model: "C4", sizes: [{ w: "205", p: "55", r: "16", version: "Origine" }, { w: "225", p: "45", r: "17", version: "Tendance / Exclusive" }] },
  { brand: "Citroen", model: "C4 Lounge", sizes: [{ w: "205", p: "55", r: "16", version: "Origine" }, { w: "225", p: "45", r: "17", version: "Tendance / Exclusive" }] },
  { brand: "Citroen", model: "C4 Cactus", sizes: [{ w: "205", p: "55", r: "17" }] },
  { brand: "Citroen", model: "C5 Aircross", sizes: [{ w: "225", p: "55", r: "18" }] },

  // Dodge
  { brand: "Dodge", model: "Journey", sizes: [{ w: "225", p: "65", r: "17", version: "SXT 2.4" }, { w: "225", p: "55", r: "19", version: "R/T 3.6" }] },
  { brand: "Dodge", model: "RAM", sizes: [{ w: "275", p: "60", r: "20" }] },

  // Fiat
  { brand: "Fiat", model: "125", sizes: [{ w: "155", p: "80", r: "13", version: "Standard" }, { w: "175", p: "70", r: "13", version: "Mirafiori" }] },
  { brand: "Fiat", model: "128", sizes: [{ w: "145", p: "80", r: "13" }] },
  { brand: "Fiat", model: "600", sizes: [{ w: "145", p: "80", r: "12" }] },
  { brand: "Fiat", model: "Argo", sizes: [{ w: "185", p: "60", r: "15", version: "Drive 1.3" }, { w: "195", p: "55", r: "16", version: "Precision / HGT" }] },
  { brand: "Fiat", model: "Cronos", sizes: [{ w: "185", p: "60", r: "15", version: "Drive 1.3" }, { w: "195", p: "55", r: "16", version: "Precision 1.8" }, { w: "205", p: "45", r: "17", version: "Precision AT" }] },
  { brand: "Fiat", model: "Ducato", sizes: [{ w: "215", p: "75", r: "16", version: "Furgón" }, { w: "225", p: "75", r: "16", version: "Minibus / Maxicargo" }] },
  { brand: "Fiat", model: "Duna", sizes: [{ w: "165", p: "70", r: "13" }] },
  { brand: "Fiat", model: "Fiorino", sizes: [{ w: "175", p: "70", r: "14" }] },
  { brand: "Fiat", model: "Mobi", sizes: [{ w: "175", p: "65", r: "14" }] },
  { brand: "Fiat", model: "Palio", sizes: [{ w: "175", p: "65", r: "14", version: "Attractive" }, { w: "185", p: "60", r: "15", version: "Essence" }] },
  { brand: "Fiat", model: "Siena", sizes: [{ w: "175", p: "65", r: "14", version: "Attractive" }, { w: "185", p: "60", r: "15", version: "Essence" }] },
  { brand: "Fiat", model: "Pulse", sizes: [{ w: "195", p: "60", r: "16", version: "Drive 1.3" }, { w: "205", p: "50", r: "17", version: "Audace / Impetus" }] },
  { brand: "Fiat", model: "Punto", sizes: [{ w: "195", p: "55", r: "16" }] },
  { brand: "Fiat", model: "Strada", sizes: [{ w: "175", p: "70", r: "14", version: "Working / Endurance" }, { w: "205", p: "60", r: "15", version: "Trekking / Freedom" }, { w: "205", p: "55", r: "16", version: "Adventure / Volcano" }] },
  { brand: "Fiat", model: "Toro", sizes: [{ w: "215", p: "65", r: "16", version: "Freedom" }, { w: "225", p: "60", r: "18", version: "Volcano / Ranch" }] },
  { brand: "Fiat", model: "Uno", sizes: [{ w: "165", p: "70", r: "13", version: "Fire" }, { w: "175", p: "70", r: "13", version: "Way" }, { w: "175", p: "65", r: "14", version: "Novo Uno Way" }] },

  // Ford
  { brand: "Ford", model: "Bronco Sport", sizes: [{ w: "225", p: "65", r: "17", version: "Big Bend" }, { w: "225", p: "60", r: "18", version: "Wildtrak" }] },
  { brand: "Ford", model: "EcoSport", sizes: [{ w: "205", p: "65", r: "15", version: "S / SE (Gen 2)" }, { w: "205", p: "60", r: "16", version: "Freestyle" }, { w: "205", p: "50", r: "17", version: "Titanium" }] },
  { brand: "Ford", model: "Kuga", sizes: [{ w: "235", p: "55", r: "17", version: "SE" }, { w: "235", p: "50", r: "18", version: "Titanium" }] },
  { brand: "Ford", model: "F-150", sizes: [{ w: "275", p: "65", r: "18", version: "XLT" }, { w: "275", p: "60", r: "20", version: "Lariat / Raptor" }] },
  { brand: "Ford", model: "Falcon", sizes: [{ w: "185", p: "80", r: "14", version: "Standard" }, { w: "195", p: "70", r: "14", version: "Futura / Sprint" }] },
  { brand: "Ford", model: "Fiesta", sizes: [{ w: "185", p: "60", r: "15", version: "S / SE" }, { w: "195", p: "50", r: "16", version: "Titanium" }] },
  { brand: "Ford", model: "Fiesta Kinetic", sizes: [{ w: "185", p: "60", r: "15", version: "S / SE" }, { w: "195", p: "50", r: "16", version: "Titanium" }] },
  { brand: "Ford", model: "Focus", sizes: [{ w: "205", p: "55", r: "16", version: "S / SE" }, { w: "215", p: "50", r: "17", version: "SE Plus / Titanium" }] },
  { brand: "Ford", model: "Ka", sizes: [{ w: "175", p: "65", r: "14", version: "S / SE" }, { w: "195", p: "55", r: "15", version: "SEL / Freestyle" }] },
  { brand: "Ford", model: "Maverick", sizes: [{ w: "225", p: "65", r: "17", version: "XLT" }, { w: "225", p: "60", r: "18", version: "Lariat" }] },
  { brand: "Ford", model: "Mustang", sizes: [{ w: "255", p: "40", r: "19", version: "GT Front" }, { w: "275", p: "40", r: "19", version: "GT Rear" }] },
  { brand: "Ford", model: "Ranger", sizes: [{ w: "255", p: "70", r: "16", version: "XL" }, { w: "265", p: "65", r: "17", version: "XLT" }, { w: "265", p: "60", r: "18", version: "Limited" }, { w: "255", p: "55", r: "20", version: "Limited Plus (2023+)" }] },
  { brand: "Ford", model: "Taunus", sizes: [{ w: "175", p: "70", r: "13" }] },
  { brand: "Ford", model: "Territory", sizes: [{ w: "235", p: "50", r: "18", version: "SEL" }, { w: "235", p: "55", r: "19", version: "Titanium" }] },
  { brand: "Ford", model: "Transit", sizes: [{ w: "215", p: "75", r: "16" }] },

  // Great Wall
  { brand: "Great Wall", model: "Wingle 5", sizes: [{ w: "235", p: "70", r: "16" }] },
  { brand: "Great Wall", model: "Wingle 7", sizes: [{ w: "245", p: "70", r: "16" }] },
  { brand: "Great Wall", model: "Poer", sizes: [{ w: "265", p: "60", r: "18" }] },

  // Haval
  { brand: "Haval", model: "H2", sizes: [{ w: "235", p: "55", r: "18" }] },
  { brand: "Haval", model: "H6", sizes: [{ w: "235", p: "55", r: "19" }] },

  // Honda
  { brand: "Honda", model: "City", sizes: [{ w: "175", p: "65", r: "15", version: "LX" }, { w: "185", p: "55", r: "16", version: "EXL" }] },
  { brand: "Honda", model: "Civic", sizes: [{ w: "205", p: "55", r: "16", version: "LXS / EXS (Gen 8/9)" }, { w: "215", p: "50", r: "17", version: "EX / EXT (Gen 10)" }] },
  { brand: "Honda", model: "CR-V", sizes: [{ w: "225", p: "65", r: "17", version: "LX / EX (Gen 4)" }, { w: "235", p: "60", r: "18", version: "EXT (Gen 5)" }] },
  { brand: "Honda", model: "Fit", sizes: [{ w: "175", p: "65", r: "15", version: "LX" }, { w: "185", p: "55", r: "16", version: "EX / EXL" }] },
  { brand: "Honda", model: "HR-V", sizes: [{ w: "215", p: "55", r: "17" }] },

  // Hyundai
  { brand: "Hyundai", model: "Creta", sizes: [{ w: "205", p: "65", r: "16", version: "GL" }, { w: "215", p: "60", r: "17", version: "GLS" }] },
  { brand: "Hyundai", model: "i10", sizes: [{ w: "165", p: "65", r: "14" }] },
  { brand: "Hyundai", model: "H1", sizes: [{ w: "215", p: "70", r: "16" }] },
  { brand: "Hyundai", model: "Santa Fe", sizes: [{ w: "235", p: "65", r: "17", version: "GLS 2.4" }, { w: "235", p: "60", r: "18", version: "GLS 3.3 / Diesel" }] },
  { brand: "Hyundai", model: "Tucson", sizes: [{ w: "225", p: "60", r: "17", version: "GL" }, { w: "225", p: "55", r: "18", version: "GLS Full Premium" }] },

  // Ika
  { brand: "Ika", model: "Torino", sizes: [{ w: "185", p: "80", r: "15", version: "S / L" }, { w: "195", p: "70", r: "15", version: "TS / TSX / ZX" }] },

  // Jeep
  { brand: "Jeep", model: "Commander", sizes: [{ w: "235", p: "50", r: "19" }] },
  { brand: "Jeep", model: "Compass", sizes: [{ w: "225", p: "55", r: "18", version: "Sport / Longitude" }, { w: "235", p: "45", r: "19", version: "Limited" }] },
  { brand: "Jeep", model: "Grand Cherokee", sizes: [{ w: "265", p: "60", r: "18", version: "Laredo" }, { w: "265", p: "50", r: "20", version: "Limited / Overland" }] },
  { brand: "Jeep", model: "Renegade", sizes: [{ w: "215", p: "65", r: "16", version: "Sport" }, { w: "215", p: "60", r: "17", version: "Trailhawk" }, { w: "225", p: "55", r: "18", version: "Longitude / Limited" }] },

  // Kia
  { brand: "Kia", model: "Carnival", sizes: [{ w: "235", p: "60", r: "18" }] },
  { brand: "Kia", model: "Cerato", sizes: [{ w: "205", p: "55", r: "16", version: "EX" }, { w: "215", p: "45", r: "17", version: "SX" }] },
  { brand: "Kia", model: "Rio", sizes: [{ w: "185", p: "65", r: "15", version: "EX" }, { w: "205", p: "45", r: "17", version: "SX" }] },
  { brand: "Kia", model: "Sorento", sizes: [{ w: "235", p: "60", r: "18" }] },
  { brand: "Kia", model: "Sportage", sizes: [{ w: "225", p: "60", r: "17", version: "EX" }, { w: "225", p: "55", r: "18", version: "GT-Line" }] },

  // Mercedes-Benz
  { brand: "Mercedes-Benz", model: "Clase A", sizes: [{ w: "205", p: "55", r: "16", version: "A200 Style" }, { w: "225", p: "45", r: "17", version: "A200 Urban" }] },
  { brand: "Mercedes-Benz", model: "Clase C", sizes: [{ w: "225", p: "50", r: "17", version: "C200" }, { w: "225", p: "45", r: "18", version: "C250 / C300" }] },
  { brand: "Mercedes-Benz", model: "GLA", sizes: [{ w: "235", p: "50", r: "18" }] },
  { brand: "Mercedes-Benz", model: "Sprinter", sizes: [{ w: "225", p: "75", r: "16" }] },
  { brand: "Mercedes-Benz", model: "Vito", sizes: [{ w: "205", p: "65", r: "16", version: "Furgón" }, { w: "225", p: "55", r: "17", version: "Tourer" }] },

  // MG
  { brand: "MG", model: "ZS", sizes: [{ w: "215", p: "50", r: "17" }] },
  { brand: "MG", model: "HS", sizes: [{ w: "235", p: "50", r: "18" }] },

  // Nissan
  { brand: "Nissan", model: "Frontier", sizes: [{ w: "255", p: "70", r: "16", version: "S / SE" }, { w: "255", p: "60", r: "18", version: "XE / LE / Pro-4X" }] },
  { brand: "Nissan", model: "Kicks", sizes: [{ w: "205", p: "60", r: "16", version: "Sense" }, { w: "205", p: "55", r: "17", version: "Advance / Exclusive" }] },
  { brand: "Nissan", model: "March", sizes: [{ w: "175", p: "60", r: "15" }] },
  { brand: "Nissan", model: "Sentra", sizes: [{ w: "205", p: "55", r: "16", version: "Advance" }, { w: "215", p: "50", r: "17", version: "SR / Exclusive" }] },
  { brand: "Nissan", model: "Versa", sizes: [{ w: "195", p: "65", r: "15", version: "Sense" }, { w: "205", p: "55", r: "16", version: "Advance / Exclusive" }] },

  // Peugeot
  { brand: "Peugeot", model: "2008", sizes: [{ w: "205", p: "60", r: "16", version: "Active / Allure" }, { w: "215", p: "60", r: "17", version: "Feline / Sport" }] },
  { brand: "Peugeot", model: "207 Compact", sizes: [{ w: "185", p: "65", r: "14", version: "Active" }, { w: "185", p: "60", r: "15", version: "Allure / Feline" }] },
  { brand: "Peugeot", model: "208", sizes: [{ w: "195", p: "55", r: "16", version: "Active / Allure (Gen 1 & 2)" }, { w: "185", p: "65", r: "15", version: "Like (Gen 2)" }, { w: "205", p: "45", r: "17", version: "GT / Feline" }] },
  { brand: "Peugeot", model: "3008", sizes: [{ w: "225", p: "55", r: "18" }] },
  { brand: "Peugeot", model: "308", sizes: [{ w: "205", p: "55", r: "16", version: "Active" }, { w: "225", p: "45", r: "17", version: "Allure / Feline" }] },
  { brand: "Peugeot", model: "405", sizes: [{ w: "175", p: "70", r: "14", version: "GL / GR" }, { w: "185", p: "65", r: "14", version: "SR / SRI" }] },
  { brand: "Peugeot", model: "408", sizes: [{ w: "205", p: "55", r: "16", version: "Active" }, { w: "225", p: "45", r: "17", version: "Allure / Feline" }] },
  { brand: "Peugeot", model: "504", sizes: [{ w: "175", p: "80", r: "14" }] },
  { brand: "Peugeot", model: "Partner", sizes: [{ w: "175", p: "65", r: "14", version: "Confort" }, { w: "185", p: "65", r: "15", version: "Patagónica" }] },

  // Renault
  { brand: "Renault", model: "Alaskan", sizes: [{ w: "255", p: "60", r: "18" }] },
  { brand: "Renault", model: "Captur", sizes: [{ w: "215", p: "60", r: "17" }] },
  { brand: "Renault", model: "Clio", sizes: [{ w: "165", p: "70", r: "13", version: "RL / RN / Base (1996-2006)" }, { w: "175", p: "65", r: "14", version: "RT / Dynamique / Mio (2000-2016)" }, { w: "185", p: "60", r: "14", version: "RSI / Sport 1.6" }, { w: "185", p: "55", r: "15", version: "Sport 2.0 / Williams" }] },
  { brand: "Renault", model: "Duster", sizes: [{ w: "215", p: "65", r: "16" }] },
  { brand: "Renault", model: "Fluence", sizes: [{ w: "205", p: "60", r: "16", version: "Dynamique" }, { w: "205", p: "55", r: "17", version: "Privilege / GT" }] },
  { brand: "Renault", model: "Kangoo", sizes: [{ w: "175", p: "70", r: "14", version: "Kangoo 1 (1998-2018)" }, { w: "185", p: "65", r: "15", version: "Kangoo 2 (2018+)" }] },
  { brand: "Renault", model: "Kardian", sizes: [{ w: "205", p: "60", r: "16", version: "Evolution" }, { w: "205", p: "55", r: "17", version: "Techno / Premiere Edition" }] },
  { brand: "Renault", model: "Logan", sizes: [{ w: "185", p: "65", r: "15" }] },
  { brand: "Renault", model: "Master", sizes: [{ w: "225", p: "65", r: "16" }] },
  { brand: "Renault", model: "Oroch", sizes: [{ w: "215", p: "65", r: "16" }] },
  { brand: "Renault", model: "Sandero", sizes: [{ w: "185", p: "65", r: "15", version: "Life/Zen/Intens" }, { w: "195", p: "55", r: "16", version: "RS" }] },
  { brand: "Renault", model: "Stepway", sizes: [{ w: "195", p: "55", r: "16" }] },

  // Toyota
  { brand: "Toyota", model: "Corolla", sizes: [{ w: "205", p: "55", r: "16", version: "XLI / XEI" }, { w: "225", p: "45", r: "17", version: "SEG / GR-Sport" }] },
  { brand: "Toyota", model: "Corolla Cross", sizes: [{ w: "215", p: "60", r: "17", version: "XLI" }, { w: "225", p: "50", r: "18", version: "XEI / SEG / GR-S" }] },
  { brand: "Toyota", model: "Etios", sizes: [{ w: "175", p: "65", r: "14", version: "X" }, { w: "185", p: "60", r: "15", version: "XS / XLS" }] },
  { brand: "Toyota", model: "Hilux", sizes: [{ w: "225", p: "70", r: "17", version: "DX" }, { w: "265", p: "65", r: "17", version: "SR / SRV" }, { w: "265", p: "60", r: "18", version: "SRX / GR-Sport" }] },
  { brand: "Toyota", model: "SW4", sizes: [{ w: "265", p: "65", r: "17", version: "SR" }, { w: "265", p: "60", r: "18", version: "SRX" }] },
  { brand: "Toyota", model: "Yaris", sizes: [{ w: "185", p: "60", r: "15", version: "XS" }, { w: "195", p: "50", r: "16", version: "XLS / S" }] },

  // Volkswagen
  { brand: "Volkswagen", model: "Amarok", sizes: [{ w: "245", p: "70", r: "16", version: "Trendline" }, { w: "245", p: "65", r: "17", version: "Comfortline" }, { w: "255", p: "60", r: "18", version: "Highline" }, { w: "255", p: "50", r: "20", version: "Extreme / V6" }] },
  { brand: "Volkswagen", model: "Bora", sizes: [{ w: "195", p: "65", r: "15", version: "Trendline 2.0 / 1.9 TDI" }, { w: "225", p: "45", r: "17", version: "1.8T Highline" }] },
  { brand: "Volkswagen", model: "Fox", sizes: [{ w: "195", p: "55", r: "15", version: "Comfortline" }, { w: "195", p: "50", r: "16", version: "Highline" }] },
  { brand: "Volkswagen", model: "Gol", sizes: [{ w: "175", p: "70", r: "14", version: "Trendline / Power" }, { w: "185", p: "60", r: "14", version: "Comfortline" }, { w: "195", p: "55", r: "15", version: "Highline" }] },
  { brand: "Volkswagen", model: "Gol Trend", sizes: [{ w: "175", p: "70", r: "14", version: "Trendline / Power" }, { w: "185", p: "60", r: "14", version: "Comfortline" }, { w: "195", p: "55", r: "15", version: "Highline" }] },
  { brand: "Volkswagen", model: "Golf", sizes: [{ w: "195", p: "65", r: "15", version: "Trendline" }, { w: "205", p: "55", r: "16", version: "Comfortline" }, { w: "225", p: "45", r: "17", version: "Highline / GTI" }] },
  { brand: "Volkswagen", model: "Nivus", sizes: [{ w: "205", p: "60", r: "16", version: "Comfortline" }, { w: "205", p: "55", r: "17", version: "Highline" }] },
  { brand: "Volkswagen", model: "Polo", sizes: [{ w: "185", p: "65", r: "15", version: "Track / Trendline" }, { w: "195", p: "55", r: "16", version: "Comfortline" }, { w: "205", p: "50", r: "17", version: "Highline / GTS" }] },
  { brand: "Volkswagen", model: "Saveiro", sizes: [{ w: "205", p: "60", r: "15" }] },
  { brand: "Volkswagen", model: "Suran", sizes: [{ w: "195", p: "55", r: "15" }] },
  { brand: "Volkswagen", model: "Taos", sizes: [{ w: "215", p: "55", r: "18" }] },
  { brand: "Volkswagen", model: "Tera", sizes: [{ w: "195", p: "65", r: "15", version: "Trendline" }, { w: "205", p: "60", r: "16", version: "Comfortline" }] },
  { brand: "Volkswagen", model: "Tiguan", sizes: [{ w: "215", p: "65", r: "17", version: "Trendline" }, { w: "235", p: "55", r: "18", version: "Comfortline" }, { w: "235", p: "50", r: "19", version: "Highline / R-Line" }] },
  { brand: "Volkswagen", model: "T-Cross", sizes: [{ w: "205", p: "60", r: "16", version: "Trendline / Comfortline" }, { w: "205", p: "55", r: "17", version: "Highline" }] },
  { brand: "Volkswagen", model: "Up!", sizes: [{ w: "175", p: "70", r: "14", version: "Take / Move" }, { w: "185", p: "60", r: "15", version: "High / Pepper" }] },
  { brand: "Volkswagen", model: "Vento", sizes: [{ w: "205", p: "55", r: "16", version: "Advance / Comfortline" }, { w: "225", p: "45", r: "17", version: "Highline / GLI" }] }
].sort((a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model));

// brand/model deben coincidir exacto con pos-neumaticos/src/lib/vehiculos.json
// (misma lista que usa el POS para cargar el vehículo de una orden de
// trabajo), para que el lookup sea por igualdad de string sin fuzzy matching.
export function getSizesForVehicle(brand: string, model: string): VehicleDBEntry["sizes"] | null {
  const entry = VEHICLE_DB.find((v) => v.brand === brand && v.model === model);
  return entry ? entry.sizes : null;
}
