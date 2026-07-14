import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

const routes = [
  "",
  "/catalogo",
  "/calculadora-equivalencia-neumaticos",
  "/servicios",
  "/sucursales",
  "/contacto",
  "/blog",
  "/blog/como-leer-medida-neumatico",
  "/blog/equivalencias",
  "/blog/grenlander",
  "/blog/marcas-chinas-neumaticos-comparativa",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route.startsWith("/blog") ? "monthly" : "weekly",
    priority: route === "/calculadora-equivalencia-neumaticos" ? 0.9 : 0.8,
  }));
}
