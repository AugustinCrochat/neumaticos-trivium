/**
 * Logos de marcas de autos (public/images/marcas-autos/*.svg, de simple-icons,
 * licencia CC0; las marcas son de sus dueños y se usan sólo para identificar
 * el vehículo). Faltan las que simple-icons no tiene (Lexus, BYD, Chery...): esas se muestran sólo con el nombre.
 */
const LOGO_SLUG: Record<string, string> = {
  "Alfa Romeo": "alfaromeo",
  Audi: "audi",
  BMW: "bmw",
  Chevrolet: "chevrolet",
  Chrysler: "chrysler",
  Citroen: "citroen",
  "Citroën": "citroen",
  "DS Automobiles": "dsautomobiles",
  Fiat: "fiat",
  Ford: "ford",
  Honda: "honda",
  Hyundai: "hyundai",
  Jeep: "jeep",
  Jaguar: "jaguar",
  Kia: "kia",
  "Land Rover": "landrover",
  "Mercedes-Benz": "mercedes-benz",
  MG: "mg",
  Mini: "mini",
  Mitsubishi: "mitsubishi",
  Nissan: "nissan",
  Peugeot: "peugeot",
  Porsche: "porsche",
  RAM: "ram",
  Renault: "renault",
  Seat: "seat",
  SEAT: "seat",
  Smart: "smart",
  Subaru: "subaru",
  Suzuki: "suzuki",
  Toyota: "toyota",
  Volkswagen: "volkswagen",
  Volvo: "volvo",
};

/** Ruta del logo de la marca, o null si no tenemos. */
export function marcaLogo(brand: string): string | null {
  const s = LOGO_SLUG[brand];
  return s ? `/images/marcas-autos/${s}.svg` : null;
}

/** Slug de URL de la página de una marca: "Citroen" -> "citroen". */
export function marcaSlug(brand: string): string {
  return brand.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}
