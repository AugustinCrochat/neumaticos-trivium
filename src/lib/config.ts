export type Branch = {
  id: string;
  name: string;
  shortName: string;
  address: string;
  city: string;
  phone: string;
  whatsapp: string;
  hours: string;
  mapUrl: string;
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
    id: "don-torcuato",
    name: "Autocenter Norte",
    shortName: "Don Torcuato",
    address: "Av. Ángel Torcuato de Alvear 2659",
    city: "Don Torcuato, Tigre",
    phone: "+54 11 0000-0001",
    whatsapp: "5491171279909",
    hours: "Lun–Vie 8:30–18:30 | Sáb 9–14",
    mapUrl: "https://maps.google.com/?q=Av.+Angel+Torcuato+de+Alvear+2659+Don+Torcuato+Tigre",
    coordinates: {
      lat: -34.4853,
      lng: -58.6206,
    },
    mapPosition: {
      x: 56,
      y: 36,
    },
  },
  {
    id: "cordoba",
    name: "Neumáticos Trivium",
    shortName: "Córdoba",
    address: "Tte. Gral. Donato Alvarez 7954–7994",
    city: "Córdoba Capital",
    phone: "+54 351 000-0002",
    whatsapp: "5493510000002",
    hours: "Lun–Vie 8:00–19:00 | Sáb 9–14",
    mapUrl: "https://maps.google.com/?q=Donato+Alvarez+7954+Cordoba+Argentina",
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

export const DEFAULT_BRANCH_ID = "don-torcuato";

export const TIRE_WIDTHS = [
  155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285,
];

export const TIRE_PROFILES = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];

export const TIRE_RIMS = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
