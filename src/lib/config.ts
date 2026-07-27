/** URL canonica del sitio en produccion (sin barra final). Usada para SEO y QR. */
export const SITE_URL = "https://neumaticos.trivium.ar";

/** Identidad legal de la empresa que opera el sitio — requerida por Google
    Merchant Center (política de Misrepresentation) y por defensa del
    consumidor en Argentina, para que la razón social detrás de la marca de
    fantasía "Neumáticos Trivium" sea verificable. */
export const LEGAL_NAME = "TRIVIUM CENTER S.A.";
export const CUIT = "30-71212718-6";
export const CONTACT_EMAIL = "info@trivium.ar";
export const INSTAGRAM_URL = "https://www.instagram.com/neumaticos.trivium/";
export const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61589579136727";
/** Link de Data Fiscal AFIP (RG 4291) — badge de verificación fiscal
    obligatorio en el sitio, generado desde el portal de AFIP para este CUIT. */
export const AFIP_DATA_FISCAL_QR = "http://qr.afip.gob.ar/?qr=TQSpqR8zs2JCASa4zM5M3A,,";

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
  phone: string;
  whatsapp: string;
  hours: string;
  /** Horario estructurado para calcular el estado abierto/cerrado en vivo */
  schedule: ScheduleRule[];
  /** Link a la ficha de Google Maps (para ver ubicacion y como llegar) */
  mapUrl: string;
  /** Link directo para dejar una resena en Google Maps */
  reviewUrl?: string;
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
    phone: "+54 9 3517 57-0422",
    whatsapp: "5493517570422",
    hours: "Lun–Sáb 9–19h (de corrido)",
    schedule: [{ days: [1, 2, 3, 4, 5, 6], open: "09:00", close: "19:00" }],
    mapUrl: "https://maps.app.goo.gl/tQrXVQCQ5VviAYY46",
    reviewUrl: "https://g.page/r/CWBPMZ1uJwaREBI/review",
    googleRating: { value: 5, count: 2 },
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
];

export const DEFAULT_BRANCH_ID = "arguello";

export const TIRE_WIDTHS = [
  155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285,
];

export const TIRE_PROFILES = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];

export const TIRE_RIMS = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
