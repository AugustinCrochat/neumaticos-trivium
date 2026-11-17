/**
 * Qué es cada modelo del catálogo, en palabras: para qué vehículo y uso está
 * pensado y qué lo distingue dentro de su marca. Sin números de laboratorio ni
 * promesas que no podamos sostener: sólo lo que se sabe del tipo de neumático
 * (calle, perfil bajo, todo terreno, carga) y lo que vemos en el mostrador.
 *
 * Alimenta la descripción de cada ficha, la del feed de Merchant Center y el
 * JSON-LD (ver describirFicha en tire-sizes.ts). Los modelos que no están acá
 * caen en un texto por tipo (A/T, carga, calle) y por marca.
 *
 * Clave: "<brandId>|<modelo en minúsculas sin acentos ni signos>". Se resuelve
 * con perfilDeModelo().
 */
export type PerfilModelo = {
  /** Frase corta (≤ 60 caracteres) para el meta description. */
  gancho: string;
  /** Qué es el modelo y cómo se comporta. */
  resumen: string;
  /** Para quién o para qué uso conviene. */
  ideal: string;
};

const PERFILES: Record<string, PerfilModelo> = {
  // — Grenlander (fábrica Zodo Tyre) —
  "grenlander|colo-h02": {
    gancho: "Cubierta de calle para el uso diario",
    resumen:
      "El Colo H02 es la cubierta de calle de Grenlander para autos chicos y medianos: carcasa radial de acero y un dibujo pensado para ciudad y ruta, con buen balance entre durabilidad y precio.",
    ideal: "Conviene si vas a renovar las cuatro cubiertas y querés una marca con respaldo sin pagar de más.",
  },
  "grenlander|kingpro-one": {
    gancho: "Opción de entrada para autos de calle",
    resumen:
      "El Kingpro One es la opción de entrada de la línea de calle de Grenlander: un neumático radial simple y previsible para el manejo de todos los días en ciudad y ruta liviana.",
    ideal: "Va bien en autos de uso urbano, segundos autos o cuando el presupuesto manda.",
  },
  "grenlander|estrella-88": {
    gancho: "Perfil bajo para autos de calle",
    resumen:
      "El Estrella 88 es el perfil bajo de Grenlander: pensado para llantas grandes (rodado 17), con una banda ancha que mejora el apoyo y la respuesta en curva respecto de un neumático de perfil alto.",
    ideal: "Es para quien cambió a llantas de 17 o quiere un auto más firme sin irse a las marcas premium.",
  },
  "grenlander|l-zeal56": {
    gancho: "Deportivo de perfil bajo, rodado 17",
    resumen:
      "El L-Zeal 56 es el neumático de alto rendimiento de Grenlander: medidas de perfil bajo para llantas grandes, con foco en el agarre y la estabilidad a velocidad de ruta.",
    ideal: "Pensado para autos de calle con aspiración deportiva y llantas de 17 o más.",
  },
  "grenlander|l-max9": {
    gancho: "Resistente, para trabajo y uso intenso",
    resumen:
      "El L-Max9 es el clásico de trabajo de Grenlander: una cubierta de carcasa reforzada, pensada para utilitarios, camionetas y vehículos que cargan y hacen muchos kilómetros.",
    ideal: "Sirve para flotas, reparto y uso laboral, donde importa la resistencia y el costo por kilómetro.",
  },
  "grenlander|greentour-a-s": {
    gancho: "Todo estación de carga para utilitarios",
    resumen:
      "El Greentour A/S es la versión de carga (serie C) de Grenlander con dibujo todo estación (A/S): banda cerrada con muchas laminillas finas, pensada para el reparto urbano con piso seco o mojado.",
    ideal: "Va bien en utilitarios chicos y furgones que trabajan todo el día en ciudad.",
  },
  "grenlander|stratour-e1": {
    gancho: "Confort de ruta para camionetas y utilitarios",
    resumen:
      "El Stratour E1 es un neumático de ruta y ciudad con perfil alto, orientado al confort y a soportar el peso de camionetas livianas y utilitarios.",
    ideal: "Va bien en uso mixto con carga moderada, con kilómetros de ruta.",
  },
  "grenlander|maga-a-t-two": {
    gancho: "Todo terreno para pickups y SUV",
    resumen:
      "El Maga A/T Two es el todo terreno (A/T) de Grenlander: bloques de banda más abiertos que muerden en tierra, ripio y barro, sin dejar de ser usable en ruta asfaltada.",
    ideal: "Es para pickups y SUV que alternan asfalto con camino de tierra, campo o pista.",
  },
  "grenlander|aa112": {
    gancho: "Neumático de camión mediano",
    resumen:
      "El AA112 es un neumático radial para camiones medianos (rodado 17,5), con una carcasa pensada para cargas altas y uso comercial continuo.",
    ideal: "Corresponde a camiones livianos y medianos de reparto, y transporte regional.",
  },
  // — Zmax (gama de entrada del mismo grupo) —
  "zmax|terra-xplorer": {
    gancho: "Todo terreno económico para pickups y SUV",
    resumen:
      "El Terra Xplorer es el todo terreno de Zmax: un dibujo de bloques abiertos para sumar tracción en tierra y ripio al precio más bajo de la categoría.",
    ideal: "Alcanza para camionetas que salen del asfalto de vez en cuando y no necesitan un A/T de gama alta.",
  },
  "zmax|landgema": {
    gancho: "Ruta y ciudad para SUV y camionetas",
    resumen:
      "El Landgema de Zmax es un neumático de calle para SUV y camionetas: perfil medio-alto, pensado para ruta asfaltada y uso urbano con buen confort.",
    ideal: "Es la opción económica para camionetas que casi no salen del asfalto.",
  },
  "zmax|landgema-terra-xplorer": {
    gancho: "Todo terreno económico para pickups y SUV",
    resumen:
      "El Landgema Terra Xplorer es el todo terreno de Zmax para camionetas y SUV: dibujo de bloques abiertos para sumar tracción en tierra y ripio, a un precio de entrada.",
    ideal: "Sirve para pickups de uso mixto, con algo de camino de tierra.",
  },
  "zmax|zealion": {
    gancho: "Perfil bajo de entrada para llantas de 16 y 17",
    resumen:
      "El Zealion es el neumático de perfil bajo de Zmax, para autos de calle con llantas de 16 y 17 pulgadas: la estética y el apoyo del perfil bajo a un precio contenido.",
    ideal: "Para quien tiene llantas grandes y no quiere pagar el precio de un neumático premium.",
  },
  // — Arivo —
  "arivo-premio|eco-6": {
    gancho: "Eficiente y duradero para uso urbano",
    resumen:
      "El Eco 6 de Arivo Premio es un neumático urbano orientado a rendir kilómetros: perfil de uso diario, pensado para ciudad y ruta liviana con un consumo contenido.",
    ideal: "Es una buena elección para autos de uso intensivo, como remises, taxis y aplicaciones.",
  },
  "arivo-premio|arzero": {
    gancho: "Urbano con dibujo asimétrico, buen mojado",
    resumen:
      "El Arzero de Arivo Premio combina un dibujo asimétrico con canales de evacuación amplios, que es lo que más se nota al frenar y doblar con el piso mojado.",
    ideal: "Va bien en autos chicos y medianos que combinan ciudad y ruta.",
  },
  "arivo-premio|arz1rt": {
    gancho: "Urbano para autos chicos, rodado 13",
    resumen:
      "El Arz1rt de Arivo Premio es la cubierta urbana para los autos más chicos del parque: rodado 13, de manejo simple y previsible.",
    ideal: "Para autos de ciudad de rodado chico que necesitan una cubierta nueva sin gastar de más.",
  },
  "arivo|terramax-arv-pro-a": {
    gancho: "Todo terreno para pickups y SUV de rodado 17",
    resumen:
      "El Terramax ARV Pro A es el todo terreno (A/T) de Arivo, con bloques de banda abiertos para tierra, ripio y barro y una carcasa pensada para camionetas.",
    ideal: "Es para pickups y SUV de uso mixto, campo y ruta.",
  },
  "arivo-terramax|a-t": {
    gancho: "Todo terreno para pickups, rodado 15",
    resumen:
      "El Terramax A/T de Arivo es un todo terreno de perfil alto y rodado 15 para pickups y utilitarios: bloques abiertos para tierra y ripio, y banda reforzada para el uso rural.",
    ideal: "Va bien en camionetas clásicas y utilitarios que trabajan en caminos de tierra.",
  },
  // — Nipon / Toledo —
  "nipon|rp68": {
    gancho: "Radial económico para autos chicos y medianos",
    resumen:
      "El RP68 de Nipon es un neumático radial de entrada para autos chicos y medianos: dibujo de calle de uso general, para ciudad y ruta liviana.",
    ideal: "Es para quien quiere renovar las cubiertas al precio más accesible del catálogo.",
  },
  "toledo|firoza-t5": {
    gancho: "Perfil bajo para autos de calle",
    resumen:
      "El Firoza T5 de Toledo es un neumático de perfil bajo para autos de calle: banda ancha para mejorar el apoyo y la respuesta en curva, con etiqueta europea de eficiencia declarada.",
    ideal: "Para autos con llantas de 17 que buscan un perfil bajo a un precio razonable.",
  },
  // — Pirelli —
  "pirelli|cinturato-p1": {
    gancho: "Pirelli de calle para autos chicos y medianos",
    resumen:
      "El Cinturato P1 es el neumático de calle de Pirelli para autos chicos y medianos: pensado para bajar el consumo y para frenar bien en mojado, con un desgaste parejo en el uso diario.",
    ideal: "Es una buena opción para quien hace muchos kilómetros por año y valora la marca.",
  },
  "pirelli|xl-cinturato-p1": {
    gancho: "Pirelli de calle con carcasa reforzada (XL)",
    resumen:
      "El Cinturato P1 XL es la versión de carga extra (XL) del neumático de calle de Pirelli: la misma línea del Cinturato P1, con una carcasa reforzada para soportar más peso por rueda.",
    ideal: "Corresponde a autos que la fábrica homologó con neumáticos XL o que viajan con carga.",
  },
  "pirelli|cinturato-p7": {
    gancho: "Pirelli touring: confort y frenada en mojado",
    resumen:
      "El Cinturato P7 es el neumático touring de Pirelli para sedanes y autos medianos y grandes: busca combinar confort de marcha, silencio y buena frenada en mojado.",
    ideal: "Es para quien hace mucha ruta y prioriza el confort de marcha.",
  },
  "pirelli|powergy": {
    gancho: "Pirelli de alto rendimiento, perfil bajo",
    resumen:
      "El Powergy es el neumático de alto rendimiento de Pirelli para autos de calle de perfil bajo: apunta a un buen agarre en seco y en mojado y a la estabilidad a velocidad de ruta.",
    ideal: "Conviene en sedanes y autos de llantas de 16 y 17 que se manejan con ganas.",
  },
  "pirelli|p400ev": {
    gancho: "Pirelli de ciudad para autos chicos",
    resumen:
      "El P400 EV de Pirelli está pensado para autos chicos de ciudad: un neumático de uso diario, cómodo y durable, con el respaldo de la marca.",
    ideal: "Es para el auto urbano de rodado 14 que se usa todos los días.",
  },
  "pirelli|scorpion": {
    gancho: "Pirelli de calle para SUV y camionetas",
    resumen:
      "El Scorpion es la línea de Pirelli para SUV y camionetas de calle: pensado para el asfalto, con un apoyo estable y un andar confortable en ruta.",
    ideal: "Va bien en SUV que casi no salen del asfalto.",
  },
  "pirelli|scorpion-atr-xl": {
    gancho: "Pirelli mixto asfalto/tierra con carcasa XL",
    resumen:
      "El Scorpion ATR XL es el neumático de uso mixto de Pirelli para SUV y camionetas: orientado a la ruta pero con un dibujo que se defiende en caminos de tierra, con carcasa reforzada (XL).",
    ideal: "Es para camionetas que hacen mucha ruta y algo de camino de tierra.",
  },
  "pirelli|scorpion-a-t": {
    gancho: "Pirelli todo terreno para pickups y SUV",
    resumen:
      "El Scorpion A/T+ es el todo terreno de Pirelli: bloques de banda más abiertos para tierra, ripio y barro, sin sacrificar el uso en ruta.",
    ideal: "Para pickups y SUV de uso mixto que quieren el respaldo de una marca premium.",
  },
  // — Yokohama —
  "yokohama|g018": {
    gancho: "Yokohama para SUV y camionetas grandes",
    resumen:
      "El Yokohama G018 en rodado 20 es un neumático de marca japonesa para SUV y camionetas grandes: pensado para la ruta y el uso urbano con un andar confortable.",
    ideal: "Corresponde a camionetas y SUV de llantas grandes que se usan en asfalto.",
  },
};

function slug(valor: string): string {
  return valor
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Variantes del mismo modelo físico que el POS carga con otro nombre.
const ALIAS: Record<string, string> = {
  "pirelli|pwrgy": "pirelli|powergy",
  "arivo-premio|eco-6r": "arivo-premio|eco-6",
  "pirelli|scorpion-a-t": "pirelli|scorpion-a-t",
  "pirelli|scorpion-atr": "pirelli|scorpion-atr-xl",
  "arivo|terramax-arv-a-t": "arivo-terramax|a-t",
};

export function perfilDeModelo(brandId: string, modeloBase: string): PerfilModelo | null {
  const limpio = modeloBase.replace(/\s*\([^)]*\)\s*/g, " ").trim();
  const clave = `${brandId}|${slug(limpio)}`;
  return PERFILES[ALIAS[clave] ?? clave] ?? null;
}
