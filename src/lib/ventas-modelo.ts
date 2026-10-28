/**
 * Neumáticos que colocamos en el taller de Argüello por modelo de auto, según
 * las órdenes de trabajo del POS (generado con un script de solo lectura:
 * sólo totales por modelo y medida, sin datos de clientes). Incluye únicamente
 * los modelos con 20 o más neumáticos, para que el porcentaje signifique algo.
 * Cada "top" es [medida, unidades] de mayor a menor. Datos al 28/10/2026.
 *
 * Ojo: es lo que el cliente se llevó, no la medida de fábrica (muchos cambian
 * de rodado o usan una equivalente). Por eso la ficha lo muestra aparte de la
 * tabla de medidas originales. Para refrescarlo, volver a correr el script y
 * reemplazar el objeto.
 */
export type VentasModelo = { n: number; top: [string, number][] };

export const VENTAS_DATOS_AL = "octubre de 2026";

export const VENTAS_MODELO: Record<string, VentasModelo> = {
  "Chevrolet Agile": { n: 25, top: [["175/65 R14",10],["185/60 R15",4],["185/65 R15",4],["185/70 R14",2]] },
  "Chevrolet Corsa": { n: 138, top: [["175/70 R13",52],["165/70 R13",32],["175/65 R14",24],["185/60 R14",17]] },
  "Chevrolet Meriva": { n: 54, top: [["175/70 R14",34],["175/65 R14",8],["185/65 R14",6],["185/70 R14",2]] },
  "Chevrolet Onix": { n: 30, top: [["185/65 R15",19],["175/70 R14",6],["185/70 R14",3],["195/65 R15",2]] },
  "Chevrolet Prisma": { n: 38, top: [["185/65 R15",15],["185/70 R14",14],["195/65 R15",4],["175/70 R14",3]] },
  "Chevrolet S10": { n: 22, top: [["235/75 R15",12],["265/60 R18",4],["265/70 R16",4],["245/70 R16",2]] },
  "Citroen Berlingo": { n: 25, top: [["175/65 R14",13],["175/70 R14",4],["185/60 R15",4],["195/60 R15",4]] },
  "Citroen C3": { n: 38, top: [["195/60 R15",16],["185/65 R14",11],["185/60 R15",4],["185/65 R15",4]] },
  "Fiat Cronos": { n: 112, top: [["185/60 R15",64],["205/45 R17",29],["195/55 R16",11],["205/55 R16",4]] },
  "Fiat Fiorino": { n: 64, top: [["175/70 R14",30],["165/70 R13",19],["175/70 R13",11],["185/60 R14",2]] },
  "Fiat Mobi": { n: 23, top: [["175/65 R14",23]] },
  "Fiat Palio": { n: 175, top: [["175/65 R14",131],["175/70 R14",12],["175/70 R13",10],["185/60 R15",7]] },
  "Fiat Siena": { n: 103, top: [["175/65 R14",70],["175/70 R14",13],["185/60 R15",10],["185/60 R14",4]] },
  "Fiat Strada": { n: 20, top: [["205/65 R15",10],["175/70 R14",4],["185/65 R14",4],["175/65 R14",2]] },
  "Fiat Uno": { n: 48, top: [["165/70 R13",19],["175/70 R13",18],["175/65 R14",7],["175/70 R14",4]] },
  "Fiat Uno Way": { n: 24, top: [["175/70 R14",14],["175/65 R14",10]] },
  "Ford EcoSport": { n: 98, top: [["205/65 R15",79],["205/60 R16",5],["195/65 R15",4],["215/65 R16",4]] },
  "Ford Fiesta": { n: 72, top: [["175/65 R14",29],["175/70 R13",17],["195/55 R16",12],["195/50 R16",6]] },
  "Ford Focus": { n: 82, top: [["205/55 R16",50],["185/70 R14",24],["195/60 R15",6],["175/65 R14",2]] },
  "Ford Ka": { n: 80, top: [["175/65 R14",45],["175/70 R13",17],["165/70 R13",8],["195/55 R15",4]] },
  "Ford Ranger": { n: 54, top: [["235/75 R15",26],["265/70 R16",10],["265/60 R18",8],["265/65 R17",8]] },
  "Honda Fit": { n: 24, top: [["175/65 R14",8],["185/60 R15",8],["175/70 R14",4],["185/65 R15",4]] },
  "Peugeot 206": { n: 46, top: [["175/65 R14",22],["185/65 R14",16],["185/60 R14",6],["185/70 R14",2]] },
  "Peugeot 207": { n: 59, top: [["185/60 R15",22],["185/65 R14",17],["175/65 R14",10],["185/70 R14",6]] },
  "Peugeot 208": { n: 38, top: [["195/55 R16",12],["195/60 R15",8],["185/65 R15",6],["195/50 R16",4]] },
  "Peugeot 307": { n: 32, top: [["195/65 R15",14],["185/65 R15",8],["205/55 R16",6],["205/45 R17",4]] },
  "Peugeot 308": { n: 25, top: [["225/45 R17",16],["205/55 R16",8],["215/50 R17",1]] },
  "Peugeot Partner": { n: 103, top: [["175/65 R14",71],["175/70 R14",14],["185/65 R14",10],["185/65 R15",8]] },
  "Renault Clio": { n: 136, top: [["175/65 R14",79],["175/70 R13",38],["175/70 R14",7],["185/60 R14",6]] },
  "Renault Duster": { n: 85, top: [["215/65 R16",85]] },
  "Renault Oroch": { n: 21, top: [["215/65 R16",21]] },
  "Renault Kangoo": { n: 191, top: [["175/65 R14",116],["175/70 R14",38],["185/65 R15",27],["205/55 R16",8]] },
  "Renault Logan": { n: 68, top: [["185/65 R15",35],["185/70 R14",15],["195/60 R15",8],["205/45 R17",4]] },
  "Renault Megane": { n: 48, top: [["185/65 R14",8],["185/65 R15",8],["175/65 R14",6],["205/55 R17",6]] },
  "Renault Sandero": { n: 50, top: [["185/65 R15",35],["195/60 R16",4],["185/70 R14",4],["175/70 R14",3]] },
  "Renault Sandero Stepway": { n: 34, top: [["205/55 R16",23],["195/60 R16",11]] },
  "Toyota Corolla": { n: 66, top: [["205/55 R16",39],["225/45 R17",6],["195/60 R15",6],["195/65 R15",6]] },
  "Toyota Etios": { n: 24, top: [["185/60 R15",14],["175/65 R14",6],["175/70 R14",4]] },
  "Toyota Hilux": { n: 51, top: [["265/65 R17",32],["265/60 R18",7],["265/70 R16",6],["265/70 R17",4]] },
  "Volkswagen Amarok": { n: 42, top: [["265/65 R17",16],["265/60 R18",9],["245/70 R16",6],["245/65 R17",6]] },
  "Volkswagen Bora": { n: 20, top: [["195/65 R15",9],["225/45 R17",5],["205/60 R15",4],["205/45 R17",2]] },
  "Volkswagen Gol": { n: 167, top: [["175/70 R13",76],["175/70 R14",29],["175/65 R14",22],["185/60 R14",12]] },
  "Volkswagen Gol Trend": { n: 98, top: [["175/70 R14",53],["195/55 R15",28],["185/65 R15",6],["175/65 R14",5]] },
  "Volkswagen Golf": { n: 25, top: [["195/65 R15",10],["225/45 R17",8],["195/55 R15",4],["175/65 R14",2]] },
  "Volkswagen Polo": { n: 33, top: [["185/65 R15",12],["185/65 R14",6],["175/65 R14",6],["175/70 R13",6]] },
  "Volkswagen Saveiro": { n: 28, top: [["205/60 R15",8],["185/65 R15",4],["165/70 R13",4],["185/65 R14",2]] },
  "Volkswagen Suran": { n: 98, top: [["195/55 R15",70],["195/60 R15",18],["195/50 R16",4],["185/60 R15",4]] },
  "Volkswagen Up!": { n: 29, top: [["185/60 R15",17],["175/70 R14",12]] },
  "Volkswagen Vento": { n: 24, top: [["205/55 R16",14],["195/65 R15",4],["225/45 R17",4],["225/40 R18",2]] },
  "Volkswagen Voyage": { n: 32, top: [["175/70 R14",26],["195/55 R15",4],["175/65 R14",2]] },
};
