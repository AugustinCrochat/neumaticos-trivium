import { BRANDS } from "./data";

export function getBrandLogo(brandId: string) {
  const brand = BRANDS.find((b) => b.id === brandId);
  if (brand?.logoUrl) return brand.logoUrl;

  const domains: Record<string, string> = {
    michelin: "michelin.com",
    bridgestone: "bridgestone.com",
    pirelli: "pirelli.com",
    goodyear: "goodyear.com",
    continental: "continental-tires.com",
    fate: "fate.com.ar",
    hankook: "hankooktire.com",
    kumho: "kumhotire.com",
    yokohama: "yokohamatire.com",
    nexen: "nexentire.com",
    linglong: "linglongtire.com",
    firemax: "firemaxtire.com",
    bfgoodrich: "bfgoodrichtires.com",
    zmax: "zmax-tire.com",
  };
  const domain = domains[brandId];
  if (!domain) return null;
  return `https://logo.clearbit.com/${domain}`;
}
