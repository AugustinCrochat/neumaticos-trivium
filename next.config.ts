import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sin esto, `next build` reparte la generación estática en varios workers
  // en paralelo, cada uno con su propia copia en memoria del catálogo
  // (memoryCache en pos-api.ts no se comparte entre procesos). Si el POS
  // cambia un precio o el stock mientras el build está corriendo (~5 min),
  // dos páginas del mismo deploy pueden terminar con dos fotos distintas del
  // mismo producto (ej. la ficha bien y el catálogo/relacionados con el dato
  // viejo, o viceversa) hasta el próximo redeploy. cpus: 1 fuerza un solo
  // proceso para que todas las páginas lean la misma foto congelada.
  experimental: {
    cpus: 1,
  },
  async redirects() {
    return [
      {
        source: "/blog/neumaticos-chinos-mitos-y-verdades",
        destination: "/blog/marcas-chinas-neumaticos-comparativa",
        permanent: true,
      },
      // Renombre de modelos Pirelli en el POS (14/09/26): "P1 CINT"/"P1CINT" ->
      // "Cinturato P1" (mismo cambio para P7), y "S/A/T+"/"XL S-I S-ATR" ->
      // "Scorpion A/T+"/"Scorpion ATR XL". El slug se arma con marca+modelo,
      // así que cambió para estos 11 productos — sin este redirect, los links
      // viejos (ads, bookmarks, Google) tiran 404.
      { source: "/productos/pirelli-p1-cinturato-195-60-r16-89h", destination: "/productos/pirelli-cinturato-p1-195-60-r16-89h", permanent: true },
      { source: "/productos/pirelli-p1-cinturato-195-55-r16-91v", destination: "/productos/pirelli-cinturato-p1-195-55-r16-91v", permanent: true },
      { source: "/productos/pirelli-p1-cinturato-175-65-r14-82t", destination: "/productos/pirelli-cinturato-p1-175-65-r14-82t", permanent: true },
      { source: "/productos/pirelli-p1-cinturato-175-70-r14-84t", destination: "/productos/pirelli-cinturato-p1-175-70-r14-84t", permanent: true },
      { source: "/productos/pirelli-p1-cinturato-185-65-r14-86t", destination: "/productos/pirelli-cinturato-p1-185-65-r14-86t", permanent: true },
      { source: "/productos/pirelli-p7-cinturato-195-50-r16-84v", destination: "/productos/pirelli-cinturato-p7-195-50-r16-84v", permanent: true },
      { source: "/productos/pirelli-p7-cinturato-215-50-r17-91w", destination: "/productos/pirelli-cinturato-p7-215-50-r17-91w", permanent: true },
      { source: "/productos/pirelli-p1-cinturato-185-60-r15-88h", destination: "/productos/pirelli-cinturato-p1-185-60-r15-88h", permanent: true },
      { source: "/productos/pirelli-p1-cinturato-185-65-r15-92h", destination: "/productos/pirelli-cinturato-p1-185-65-r15-92h", permanent: true },
      { source: "/productos/pirelli-s-a-t-225-65-r17-102h", destination: "/productos/pirelli-scorpion-a-t-225-65-r17-102h", permanent: true },
      { source: "/productos/pirelli-s-i-s-atr-225-65-r17-106h", destination: "/productos/pirelli-scorpion-atr-xl-225-65-r17-106h", permanent: true },
    ];
  },
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    contentDispositionType: "inline",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;

