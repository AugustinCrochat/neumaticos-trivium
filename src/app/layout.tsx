import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { BranchProvider } from "@/contexts/branch-context";
import { BranchModal } from "@/components/ui/BranchModal";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neumáticos Trivium — El outlet del neumático",
  description:
    "Neumáticos de importación directa a precios outlet.",
  keywords: ["neumáticos", "cubiertas", "outlet", "importación", "china", "baratos", "Argentina"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <BranchProvider>
          <Header />
          <BranchModal />
          <main className="flex-1">{children}</main>
          <Footer />
        </BranchProvider>
      </body>
    </html>
  );
}
