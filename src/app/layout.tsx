import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/config";
import { SITE_NAME, siteGraphJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { BranchProvider } from "@/contexts/branch-context";
import { BranchModal } from "@/components/ui/BranchModal";
import { VehicleProvider } from "@/contexts/vehicle-context";
import { VehicleModal } from "@/components/ui/VehicleModal";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/contexts/cart-context";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { getVehiculosDesdePOS } from "@/lib/pos-api";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // Cada página define su título propio y hereda el sufijo de marca; sin el
    // template había que repetir "— Neumáticos Trivium" a mano en cada archivo
    // (y varias páginas se lo olvidaban).
    default: "Neumáticos y cubiertas al mejor precio — Neumáticos Trivium",
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Outlet de neumáticos con importación directa: comprá cubiertas para auto y camioneta con stock real, precio publicado y envío a todo el país. Local y taller propio en Córdoba.",
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "es_AR",
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    // max-image-preview:large habilita la miniatura grande en resultados de
    // Google Imágenes y Discover; sin esto se sirve una miniatura chica.
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    // Códigos de verificación: Search Console, Merchant Center (dominio) y
    // Merchant Center (esta URL puntual) — Next.js renderiza un
    // <meta name="google-site-verification"> por cada uno si es array.
    google: [
      "g5tLlITOx48HSWIByq6VoJlZbRq9ygS-k15x8CyA5BE",
      "IjV859G2Fl7OOkRcKjaRYy4PTgAAU0LE54aG7qTOZ4w",
      "sz-Oag0F3S4bJmAzoSG3rTGEf-ZlG0r67FZ_obLhhgQ",
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const vehiculos = await getVehiculosDesdePOS();
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                var target = e.target;
                if (target && (target.tagName === 'LINK' || target.tagName === 'SCRIPT')) {
                  var src = target.src || target.href;
                  if (src && src.indexOf('_next/static') !== -1) {
                    window.location.reload();
                  }
                }
              }, true);
            `
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <JsonLd data={siteGraphJsonLd()} />
        <BranchProvider>
          <VehicleProvider vehiculos={vehiculos}>
            <CartProvider>
              <Header />
              <BranchModal />
              <VehicleModal />
              <CartDrawer />
              <main className="flex-1">{children}</main>
              <Footer />
            </CartProvider>
          </VehicleProvider>
        </BranchProvider>
      </body>
    </html>
  );
}
