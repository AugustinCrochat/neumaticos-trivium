import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/config";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const vehiculos = await getVehiculosDesdePOS();
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
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
