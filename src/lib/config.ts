/** URL canonica del sitio en produccion (sin barra final). Usada para SEO y QR. */
export const SITE_URL = "https://neumaticos.trivium.ar";

/** Identidad legal de la empresa que opera el sitio — requerida por Google
    Merchant Center (política de Misrepresentation) y por defensa del
    consumidor en Argentina, para que la razón social detrás de la marca de
    fantasía "Neumáticos Trivium" sea verificable. */
export const LEGAL_NAME = "TRIVIUM CENTER S.A.";
export const CUIT = "30-71212718-6";
export const CONTACT_EMAIL = "info@trivium.ar";
/** ID de la cuenta de Google Merchant Center — lo usa el módulo de aceptación
    de Reseñas de Clientes en Google en la página de confirmación de pago. */
export const GOOGLE_MERCHANT_ID = 5832097672;
export const GOOGLE_ADS_ID = "AW-969578983";
/** Medición de Google Analytics 4 (se carga con el mismo gtag.js de Ads). */
export const GA4_MEASUREMENT_ID = "G-82XSN6MC9C";
/** Etiqueta de conversión de Ads para "clic en WhatsApp" — la usa
    gtag_report_conversion en GoogleAdsTag. */
export const GOOGLE_ADS_WHATSAPP_CONVERSION_LABEL = "AW-969578983/MmToCLy20JsdEOezqs4D";
export const INSTAGRAM_URL = "https://www.instagram.com/neumaticos.trivium/";
export const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61589579136727";
export const YOUTUBE_URL = "https://www.youtube.com/@neumaticos-trivium";
/** Link de Data Fiscal AFIP (RG 4291) — badge de verificación fiscal
    obligatorio en el sitio, generado desde el portal de AFIP para este CUIT. */
export const AFIP_DATA_FISCAL_QR = "http://qr.afip.gob.ar/?qr=TQSpqR8zs2JCASa4zM5M3A,,";

/** Costo fijo de envío a domicilio a todo el país (ARS). Alternativa al
    retiro gratis en sucursal. Se cobra sólo por debajo de
    FREE_SHIPPING_THRESHOLD — ver ahí. */
export const SHIPPING_FLAT_RATE = 30000;

/** Monto de subtotal (ARS, productos + servicios + accesorios, sin contar el
    envío) a partir del cual el envío a domicilio sale gratis. Por debajo se
    cobra SHIPPING_FLAT_RATE. */
export const FREE_SHIPPING_THRESHOLD = 120000;

/** Nombre de la cookie de sucursal elegida — la escribe branch-context.tsx
    (cliente) y la lee branch-server.ts (Server Components/route handlers).
    Vive acá, no en branch-server.ts, para que un componente cliente pueda
    usar el nombre sin arrastrar el import de "next/headers" al bundle. */
export const BRANCH_COOKIE = "trivium-branch";

export type ScheduleRule = {
  /** Dias de la semana segun Date.getDay(): 0=Domingo ... 6=Sabado */
  days: number[];
  /** Hora de apertura en formato "HH:MM" (24h) */
  open: string;
  /** Hora de cierre en formato "HH:MM" (24h) */
  close: string;
};

export type Branch = {
  id: string;
  name: string;
  shortName: string;
  address: string;
  city: string;
  /** Provincia — `addressRegion` en el schema local. Google lo usa para
      desambiguar ciudades homónimas (hay Córdoba en varios países). */
  province: string;
  /** Código postal (CPA). Otro campo que refuerza la ficha local. */
  postalCode?: string;
  /** Barrio/zona puntual donde está el local. Se usa en los títulos locales
      ("gomería en Argüello") y como `containedInPlace` conceptual. */
  neighborhood?: string;
  /** Localidades que atiende esta sucursal — alimenta `areaServed` del schema
      y las páginas de /neumaticos-en. Los nombres tienen que coincidir con el
      `name` de las entradas de localidades.ts. */
  areaServed: string[];
  /** true mientras el horario o los servicios (taller, stock, orden de
      llegada) de la sucursal no estén confirmados. Las landings locales
      (/neumaticos-en) no muestran el horario ni prometen esos servicios hasta
      que se saque. */
  provisorio?: boolean;
  phone: string;
  whatsapp: string;
  hours: string;
  /** Horario estructurado para calcular el estado abierto/cerrado en vivo */
  schedule: ScheduleRule[];
  /** Link a la ficha de Google Maps (para ver ubicacion y como llegar) */
  mapUrl: string;
  /** Foto de la fachada del local, para dar confianza de que existe físicamente. */
  facadePhoto?: string;
  /** Link directo para dejar una resena en Google Maps */
  reviewUrl?: string;
  /** URL de embed de Google Maps (Compartir > Insertar un mapa) para el mapa
      estatico de la ficha de esta sucursal — trae la ficha real de Google
      (nombre, fotos, resenas) en vez de solo el pin. El mapa de pines con
      todas las sucursales (BranchesMap) sigue en MapLibre/OSM porque ese si
      necesita marcadores y estilo personalizados. */
  googleMapsEmbedUrl?: string;
  /** Rating y cantidad de resenas en Google Maps de esta sucursal — se
      muestra como badge de confianza en el sitio (pedido explicito de la
      politica de Misrepresentation de Merchant Center: "promote your online
      reputation by showing reviews"). Actualizar a mano cuando cambien. */
  googleRating?: { value: number; count: number };
  coordinates: {
    lat: number;
    lng: number;
  };
  mapPosition: {
    x: number;
    y: number;
  };
  /** Store code de esta sucursal en Google Business Profile / Merchant Center
      (Perfiles de empresa vinculados) — usado por el feed de inventario
      local (/feed/google-local-inventory.xml). Sin esto, esa sucursal no
      puede tener fichas locales sin coste ni anuncios de inventario local. */
  googleStoreCode?: string;
};

export const BRANCHES: Branch[] = [
  {
    id: "arguello",
    name: "Neumáticos Trivium Argüello",
    shortName: "Argüello",
    address: "Av. Donato Alvarez 7971",
    city: "Córdoba",
    province: "Córdoba",
    // CPA de Argüello (Córdoba Capital). Verificar contra la factura antes de
    // cargarlo también en Google Business Profile.
    postalCode: "X5147",
    neighborhood: "Argüello",
    areaServed: [
      "Argüello",
      "Córdoba",
      "Villa Allende",
      "Saldán",
      "La Calera",
      "Mendiolaza",
      "Unquillo",
      "Río Ceballos",
      "Villa Warcalde",
    ],
    phone: "+54 9 3517 57-0422",
    whatsapp: "5493517570422",
    hours: "Lun–Sáb 9–19h (de corrido)",
    schedule: [{ days: [1, 2, 3, 4, 5, 6], open: "09:00", close: "19:00" }],
    mapUrl: "https://maps.app.goo.gl/tQrXVQCQ5VviAYY46",
    facadePhoto: "/images/branches/arguello-fachada.webp",
    reviewUrl: "https://g.page/r/CWBPMZ1uJwaREBI/review",
    googleMapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3408.039257943254!2d-64.2649636!3d-31.3302889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94329d0062c9b4d7%3A0x9106276e9d314f60!2sNeum%C3%A1ticos%20Trivium%20-%20El%20Outlet%20del%20Neum%C3%A1tico!5e0!3m2!1ses!2sar!4v1785420975436!5m2!1ses!2sar",
    googleRating: { value: 4.9, count: 2 },
    coordinates: {
      lat: -31.3302015,
      lng: -64.2650135,
    },
    mapPosition: {
      x: 31,
      y: 22,
    },
    googleStoreCode: "14523860207436626950",
  },
  {
    id: "san-justo",
    name: "Neumáticos Trivium San Justo",
    shortName: "San Justo",
    address: "Pres. Juan Domingo Perón 2847",
    city: "San Justo",
    province: "Buenos Aires",
    // CPA B1754AZW tal como figura en Google Maps. Antes era Ruedas Bojanich -
    // Sucursal San Justo: al crear el perfil de Google Business hay que
    // reclamar/actualizar esa ficha, no duplicarla.
    postalCode: "B1754AZW",
    neighborhood: "San Justo",
    provisorio: true,
    areaServed: [
      "San Justo",
      "La Matanza",
      "Ramos Mejía",
      "Villa Luzuriaga",
      "Isidro Casanova",
      "Laferrere",
      "González Catán",
      "Hurlingham",
      "Tres de Febrero",
      "Morón",
      "San Martín",
      "Esteban Echeverría",
      "Merlo",
      "Ituzaingó",
      "Ezeiza",
      "Capital Federal",
    ],
    // WhatsApp/teléfono: número personal de Augustin, provisorio hasta tener el
    // de la sucursal. El horario sigue siendo el de Argüello (sin confirmar).
    // Pendiente de googleStoreCode, reviewUrl y googleMapsEmbedUrl (salen del
    // perfil de Google Business); sin googleStoreCode queda fuera del feed de
    // inventario local.
    phone: "+54 9 11 4037-0322",
    whatsapp: "5491140370322",
    hours: "Lun–Sáb 9–19h (de corrido)",
    schedule: [{ days: [1, 2, 3, 4, 5, 6], open: "09:00", close: "19:00" }],
    mapUrl: "https://www.google.com/maps/search/?api=1&query=-34.6736285,-58.5606326",
    coordinates: { lat: -34.6736285, lng: -58.5606326 },
    mapPosition: { x: 52, y: 62 },
  },
];

export const DEFAULT_BRANCH_ID = "arguello";

export const TIRE_WIDTHS = [
  155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285,
];

export const TIRE_PROFILES = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];

export const TIRE_RIMS = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
