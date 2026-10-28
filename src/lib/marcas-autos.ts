/**
 * Logos de marcas de autos a color (public/images/marcas-autos/*.webp, con
 * fondo transparente). Vienen del dataset público car-logos-dataset y, para las
 * marcas que vende Carone, de su sitio (versiones vigentes). Son marcas de sus
 * dueños y se usan sólo para identificar el vehículo. Faltan DFSK, Shineray,
 * KyC e Ika: esas se muestran sólo con el nombre. Al sumar una marca, agregar
 * acá su nombre exacto (y los alias con que aparezca en los datos).
 */
const LOGO_FILE: Record<string, string> = {
  "Alfa Romeo": "alfa-romeo",
  "Arcfox": "arcfox",
  "Audi": "audi",
  "BAIC": "baic",
  "BMW": "bmw",
  "BYD": "byd",
  "Changan": "changan",
  "Chery": "chery",
  "Chevrolet": "chevrolet",
  "Chrysler": "chrysler",
  "Citroen": "citroen",
  "Cupra": "cupra",
  "DS Automobiles": "ds-automobiles",
  "Dodge": "dodge",
  "Dongfeng": "dongfeng",
  "FAW": "faw",
  "Ferrari": "ferrari",
  "Fiat": "fiat",
  "Ford": "ford",
  "Foton": "foton",
  "GAC": "gac",
  "Geely": "geely",
  "Great Wall": "great-wall",
  "Haval": "haval",
  "Honda": "honda",
  "Hyundai": "hyundai",
  "Isuzu": "isuzu",
  "Iveco": "iveco",
  "JAC": "jac",
  "JMC": "jmc",
  "JMEV": "jmev",
  "Jaguar": "jaguar",
  "Jeep": "jeep",
  "Jetour": "jetour",
  "Kia": "kia",
  "Lamborghini": "lamborghini",
  "Land Rover": "land-rover",
  "Leapmotor": "leapmotor",
  "Lexus": "lexus",
  "Lifan": "lifan",
  "Lynk & Co": "lynk-co",
  "MG": "mg",
  "Mahindra": "mahindra",
  "Maserati": "maserati",
  "Maxus": "maxus",
  "Mercedes-Benz": "mercedes-benz",
  "Mini": "mini",
  "Mitsubishi": "mitsubishi",
  "Nissan": "nissan",
  "Omoda": "omoda",
  "Peugeot": "peugeot",
  "Porsche": "porsche",
  "RAM": "ram",
  "Renault": "renault",
  "Seat": "seat",
  "Smart": "smart",
  "SsangYong": "ssangyong",
  "Subaru": "subaru",
  "Suzuki": "suzuki",
  "Tesla": "tesla",
  "Toyota": "toyota",
  "Volkswagen": "volkswagen",
  "Volvo": "volvo",
  "Zotye": "zotye",
  "Škoda": "skoda",
  "Citroën": "citroen",
  "SEAT": "seat",
  "ISUZU": "isuzu",
  "GWM": "great-wall",
  "Omoda / Jaecoo": "omoda",
  "Jaecoo": "omoda",
  "DS": "ds-automobiles",
  "Skoda": "skoda",
  "KGM": "ssangyong",
  "Mercedes": "mercedes-benz",
  "Great Wall Motors": "great-wall",
};

/** Ruta del logo de la marca, o null si no tenemos. */
export function marcaLogo(brand: string): string | null {
  const f = LOGO_FILE[brand];
  return f ? `/images/marcas-autos/${f}.webp` : null;
}

/** Marcas cuyo logo es oscuro: sobre fondo negro se ven con una silueta blanca detrás. */
const LOGO_OSCURO = new Set(["arcfox","audi","changan","citroen","cupra","dongfeng","fiat","gac","great-wall","isuzu","jaguar","jeep","jmc","jmev","kia","lamborghini","leapmotor","lifan","lynk-co","maserati","mitsubishi","nissan","omoda","peugeot","porsche","renault","ssangyong","suzuki","toyota","volkswagen"]);
export function marcaLogoOscuro(brand: string): boolean {
  const f = LOGO_FILE[brand];
  return !!f && LOGO_OSCURO.has(f);
}

/** Slug de URL de la página de una marca: "Citroen" -> "citroen". */
export function marcaSlug(brand: string): string {
  return brand.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}
