/** URL canonica del sitio en produccion (sin barra final). Usada para SEO y QR. */
export const SITE_URL = "https://neumaticos.trivium.ar";

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
  coordinates: {
    lat: number;
    lng: number;
  };
  mapPosition: {
    x: number;
    y: number;
  };
};

export const BRANCHES: Branch[] = [
  {
    id: "arguello",
    name: "Neumáticos Trivium Argüello",
    shortName: "Argüello",
    address: "Av. Donato Alvarez 7971",
    city: "Córdoba",
    phone: "+54 351 000-0002",
    whatsapp: "5493510000002",
    hours: "Lun–Vie 8:00–19:00 | Sáb 9–14",
    schedule: [
      { days: [1, 2, 3, 4, 5], open: "08:00", close: "19:00" },
      { days: [6], open: "09:00", close: "14:00" },
    ],
    mapUrl: "https://maps.app.goo.gl/tQrXVQCQ5VviAYY46",
    reviewUrl: "https://g.page/r/CWBPMZ1uJwaREBI/review",
    coordinates: {
      lat: -31.3486,
      lng: -64.2501,
    },
    mapPosition: {
      x: 31,
      y: 22,
    },
  },
];

export const DEFAULT_BRANCH_ID = "arguello";

export const TIRE_WIDTHS = [
  155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285,
];

export const TIRE_PROFILES = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];

export const TIRE_RIMS = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
