import { BRANDS } from "./data";

export function getBrandLogo(brandId: string) {
  const brand = BRANDS.find((b) => b.id === brandId);
  return brand?.logoUrl || null;
}
