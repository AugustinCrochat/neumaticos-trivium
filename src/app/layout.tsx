import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SITE_URL, LEGAL_NAME, CUIT, CONTACT_EMAIL, INSTAGRAM_URL, FACEBOOK_URL, BRANCHES } from "@/lib/config";
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
  title: "Neumáticos Trivium — El outlet del neumático",
  description:
    "Neumáticos de importación directa a precios outlet.",
  keywords: ["neumáticos", "cubiertas", "outlet", "importación", "china", "baratos", "Argentina"],
  verification: {
    // Dos códigos: Search Console y Merchant Center — Next.js renderiza un
    // <meta name="google-site-verification"> por cada uno si es array.
    google: ["g5tLlITOx48HSWIByq6VoJlZbRq9ygS-k15x8CyA5BE", "IjV859G2Fl7OOkRcKjaRYy4PTgAAU0LE54aG7qTOZ4w"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Neumáticos Trivium",
  legalName: LEGAL_NAME,
  taxID: CUIT,
  url: SITE_URL,
  logo: `${SITE_URL}/logo-neumaticos-trivium.svg`,
  email: CONTACT_EMAIL,
  sameAs: [INSTAGRAM_URL, FACEBOOK_URL],
  address: {
    "@type": "PostalAddress",
    streetAddress: BRANCHES[0].address,
    addressLocality: BRANCHES[0].city,
    addressCountry: "AR",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: CONTACT_EMAIL,
    telephone: BRANCHES[0].phone,
    areaServed: "AR",
    availableLanguage: "Spanish",
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
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
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
