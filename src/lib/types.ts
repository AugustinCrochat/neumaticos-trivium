export type VehicleType = "auto" | "camioneta";

export type TireSize = {
  width: number;
  profile: number;
  rim: number;
};

export type TireBrand = {
  id: string;
  name: string;
  origin: string; // "china" | "argentina" | "korea" | etc
  logoUrl?: string;
  description?: string;
  fullDescription?: string;
};

export type TireProduct = {
  id: string;
  brand: string;
  brandId: string;
  model: string;
  /** Modelo sin marca ni medida (ej. "Colo H02"), tal como lo normaliza fixBrandAndModel. Para cruzar contra tire-labels.ts. */
  modeloBase: string;
  size: TireSize;
  vehicleType: VehicleType[];
  price: number;
  priceOld?: number;
  imageUrl: string;
  tags: string[];
  isEconomic: boolean;
  isImported: boolean;
  /** Neumático de carga/comercial (lleva "C" después del rodado, ej. R15C). */
  isCarga?: boolean;
  /** Neumático todo terreno (A/T). */
  isAT?: boolean;
  slug: string;
  enStock?: boolean;
  /** Cantidad disponible en la sucursal. */
  stock?: number;
  /** Ej: "91". Extraído del nombre cargado en el POS, no siempre está presente. En un neumático de carga con dos índices (ej. "90/88"), este es el simple (el más alto). */
  loadIndex?: string;
  /** Índice de carga en rodado dual (el más bajo de los dos), sólo presente en neumáticos de carga cuyo nombre trae el par "90/88". */
  loadIndexDual?: string;
  /** Ej: "W". Extraído del nombre cargado en el POS, no siempre está presente. */
  speedRating?: string;
};

export type Accessory = {
  id: string;
  codigoTango: string | null;
  nombre: string;
  descripcion: string | null;
  price: number;
  priceOld?: number;
  imageUrl: string | null;
  enStock: boolean;
  stock: number;
  slug: string;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  /** Aclaración corta sobre cómo se cotiza el precio, ej. "por rueda". */
  priceNote?: string;
};

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  slug: string;
  category: string;
};
