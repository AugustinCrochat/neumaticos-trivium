import { BRANCHES, type Branch } from "@/lib/config";

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Sucursal más cercana a unas coordenadas, con las `coordinates` de cada una en config.ts. */
export function getNearestBranch(lat: number, lng: number): Branch {
  return BRANCHES.reduce((nearest, branch) => {
    const distNearest = haversineKm(lat, lng, nearest.coordinates.lat, nearest.coordinates.lng);
    const distThis = haversineKm(lat, lng, branch.coordinates.lat, branch.coordinates.lng);
    return distThis < distNearest ? branch : nearest;
  });
}

/** Distancia en línea recta (km) desde unas coordenadas a cada sucursal. */
export function getBranchDistances(lat: number, lng: number): Record<string, number> {
  return Object.fromEntries(
    BRANCHES.map((b) => [b.id, haversineKm(lat, lng, b.coordinates.lat, b.coordinates.lng)])
  );
}

/** "850 m", "3,4 km", "27 km": la distancia en línea recta, redondeada para leerse de un vistazo. */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.max(50, Math.round((km * 1000) / 50) * 50)} m`;
  if (km < 10) return `${km.toFixed(1).replace(".", ",")} km`;
  return `${Math.round(km)} km`;
}
