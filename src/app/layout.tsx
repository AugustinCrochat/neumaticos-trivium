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
import { FloatingSearchWidget } from "@/components/ui/FloatingSearchWidget";
import { FloatingWhatsAppButton } from "@/components/ui/FloatingWhatsAppButton";
import { GoogleReviewsBadge } from "@/components/ui/GoogleReviewsBadge";
import { getAllVehicleOptions } from "@/lib/vehicles";

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
    // "Neumáticos" y "cubiertas" significan lo mismo — juntarlos con "y" en el
    // mismo título no suma alcance, diluye la frase exacta "neumáticos
    // baratos" (que sí tiene volumen de búsqueda propio) y no ayuda a
    // aparecer para quien busca sólo "cubiertas". Van por separado: éste dice
    // "neumáticos", la descripción de abajo dice "cubiertas".
    default: "Neumáticos baratos al mejor precio — Neumáticos Trivium",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Lista estática, sin red: el listado completo del POS se carga desde el
  // cliente (VehicleProvider hace fetch a /api/vehiculos) para no bloquear
  // el render de todas las páginas del sitio con un fetch al POS en el
  // layout raíz — ver memoria cache-incremental-sin-r2 y el error 1102.
  const vehiculos = getAllVehicleOptions();
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              /* Cada deploy borra los _next/static/* del build anterior, así que
                 quien tenga HTML viejo pide chunks que ya no existen. Una recarga
                 trae HTML nuevo y lo arregla.

                 La versión anterior de esto borraba el guard 10s después del load,
                 o sea que no recargaba una vez: recargaba una vez cada 10s, para
                 siempre. Con un chunk que falla de verdad (deploy nuevo + HTML
                 viejo, o red mala) eso es un bucle de recargas, que es lo que
                 Chrome termina cortando con "This page couldn't load".

                 Ahora el guard persiste: máximo 2 recargas por sesión y nunca dos
                 seguidas en menos de 30s. Si a la tercera sigue roto, no es un
                 chunk viejo y recargar no lo va a arreglar. */
              window.addEventListener('error', function(e) {
                var target = e.target;
                if (!target || (target.tagName !== 'LINK' && target.tagName !== 'SCRIPT')) return;
                var src = target.src || target.href;
                if (!src || src.indexOf('_next/static') === -1) return;

                var key = 'trivium-chunk-reload';
                var state = { n: 0, t: 0 };
                try { state = JSON.parse(sessionStorage.getItem(key)) || state; } catch (err) {}

                var now = Date.now();
                if (state.n >= 2 || now - state.t < 30000) return;

                try { sessionStorage.setItem(key, JSON.stringify({ n: state.n + 1, t: now })); } catch (err) {}
                window.location.reload();
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
              <FloatingSearchWidget />
              <FloatingWhatsAppButton />
              <GoogleReviewsBadge />
              <main className="flex-1">{children}</main>
              <Footer />
            </CartProvider>
          </VehicleProvider>
        </BranchProvider>
      </body>
    </html>
  );
}
