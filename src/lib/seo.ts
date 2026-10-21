import {
  SITE_URL,
  LEGAL_NAME,
  CUIT,
  CONTACT_EMAIL,
  INSTAGRAM_URL,
  FACEBOOK_URL,
  BRANCHES,
  type Branch,
} from "./config";
import { SERVICES } from "./data";
import { ROTACION_SERVICE } from "./servicios-seo";

/** Nombre comercial — el que Google tiene que asociar a la marca. */
export const SITE_NAME = "Neumáticos Trivium";

/** URL absoluta a partir de una ruta interna ("/catalogo" -> "https://.../catalogo").
    Los canonical y el JSON-LD tienen que ser absolutos sí o sí: Google descarta
    los relativos en structured data y en <link rel="canonical"> cross-origin. */
export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Bloque `alternates` listo para pegar en un objeto Metadata. */
export function canonical(path: string) {
  return { canonical: absoluteUrl(path) };
}

/** Metadata de páginas que no deben indexarse (carrito, checkout, buscador
    interactivo). `follow` sigue en true para que el crawler igual recorra los
    links internos hacia las páginas que sí queremos posicionar. */
export const NOINDEX = {
  robots: { index: false, follow: true },
} as const;

/** Horario schema.org — Date.getDay() (0=Domingo) al nombre que espera Google. */
const SCHEMA_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** @id estable de la ficha local de una sucursal, para poder referenciarla
    desde otros nodos (páginas de localidad, breadcrumbs) sin duplicar el nodo. */
export function branchNodeId(branch: Branch): string {
  return `${SITE_URL}/sucursales/${branch.id}#tienda`;
}

/**
 * Ficha local de una sucursal como `TireShop` — subtipo de LocalBusiness que
 * describe exactamente el rubro. Antes usábamos `AutoRepair`, que sirve para el
 * taller pero no para la venta de neumáticos, que es el término por el que
 * queremos aparecer en el pack local.
 */
export function tireShopJsonLd(branch: Branch) {
  return {
    "@type": "TireShop",
    "@id": branchNodeId(branch),
    name: `${SITE_NAME} ${branch.shortName}`,
    url: absoluteUrl(`/sucursales/${branch.id}`),
    image: absoluteUrl("/opengraph-image"),
    logo: absoluteUrl("/logo-neumaticos-trivium.svg"),
    telephone: branch.phone,
    email: CONTACT_EMAIL,
    priceRange: "$$",
    currenciesAccepted: "ARS",
    paymentAccepted: "Efectivo, Tarjeta de débito, Tarjeta de crédito, Mercado Pago, Transferencia",
    hasMap: branch.mapUrl,
    parentOrganization: { "@id": ORGANIZATION_ID },
    address: {
      "@type": "PostalAddress",
      streetAddress: branch.address,
      addressLocality: branch.city,
      addressRegion: branch.province,
      postalCode: branch.postalCode,
      addressCountry: "AR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: branch.coordinates.lat,
      longitude: branch.coordinates.lng,
    },
    // Una sucursal que todavía no abrió no declara horario: publicarlo diría
    // que ya atiende.
    ...(branch.apertura
      ? {}
      : {
          openingHoursSpecification: branch.schedule.map((rule) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: rule.days.map((d) => SCHEMA_DAYS[d]),
            opens: rule.open,
            closes: rule.close,
          })),
        }),
    // Catálogo de servicios de la gomería: nombra, con su URL, lo que Google
    // tiene que asociar al negocio (alineación, balanceo, rotación, montaje).
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Neumáticos y gomería",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Neumáticos",
          url: absoluteUrl("/neumaticos-baratos"),
        },
        ...[...SERVICES, ROTACION_SERVICE].map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.title,
            url: absoluteUrl(`/servicios/${service.id}`),
          },
        })),
      ],
    },
    knowsAbout: [
      "Neumáticos",
      "Cubiertas",
      "Neumáticos A/T",
      "Neumáticos de carga",
      "Alineación",
      "Balanceo",
      "Rotación de ruedas",
    ],
    // Las localidades que atiende esta sucursal — le da a Google el radio real
    // de servicio en vez de dejarlo inferir sólo por la dirección.
    areaServed: branch.areaServed.map((name) => ({
      "@type": "City",
      name,
    })),
    ...(branch.mapUrl ? { sameAs: [branch.mapUrl] } : {}),
    // Sin aggregateRating a propósito. El puntaje que tenemos es de Google Maps,
    // y las guías de review snippets prohíben publicar como propio un rating
    // recolectado por un tercero: es motivo de acción manual. Además no aporta
    // nada, porque para una ficha local Google ya muestra sus propias estrellas
    // desde el Business Profile. El puntaje se sigue mostrando en el sitio como
    // badge visual (GoogleRatingBadge), que sí es un uso legítimo.
  };
}

/** Organización + sitio web + todas las sucursales, en un solo grafo. Va en el
    layout raíz, así que se emite una única vez por página y el resto de los
    nodos puede referenciarlo por @id en lugar de repetirlo. */
export function siteGraphJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: SITE_NAME,
        legalName: LEGAL_NAME,
        taxID: CUIT,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/logo-neumaticos-trivium.svg"),
        },
        image: absoluteUrl("/opengraph-image"),
        email: CONTACT_EMAIL,
        sameAs: [INSTAGRAM_URL, FACEBOOK_URL],
        areaServed: { "@type": "Country", name: "Argentina" },
        address: {
          "@type": "PostalAddress",
          streetAddress: BRANCHES[0].address,
          addressLocality: BRANCHES[0].city,
          addressRegion: BRANCHES[0].province,
          postalCode: BRANCHES[0].postalCode,
          addressCountry: "AR",
        },
        contactPoint: BRANCHES.map((branch) => ({
          "@type": "ContactPoint",
          contactType: "customer service",
          email: CONTACT_EMAIL,
          telephone: branch.phone,
          areaServed: "AR",
          availableLanguage: "Spanish",
        })),
        // Trivium Center S.A. (trivium.ar) es el grupo; su @id es el mismo que
        // declara el institucional, así Google une las tres entidades en un grafo.
        parentOrganization: { "@id": "https://trivium.ar/#organization" },
        // Sin subOrganization, cada ficha local queda huérfana del nodo de marca
        // y Google no puede unificar la entidad "Neumáticos Trivium".
        subOrganization: BRANCHES.map((branch) => ({ "@id": branchNodeId(branch) })),
      },
      ...BRANCHES.map(tireShopJsonLd),
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        // Google deriva el nombre por dominio raíz; sin alternateName hereda el
        // del sitio principal ("Trivium Center") en vez del de este subdominio.
        alternateName: ["Trivium Neumáticos", "neumaticos.trivium.ar"],
        inLanguage: "es-AR",
        publisher: { "@id": ORGANIZATION_ID },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/busqueda?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

export type Crumb = { name: string; path: string };

/** Migas de pan. Google las usa para reemplazar la URL cruda en el resultado de
    búsqueda por una ruta legible, y para entender la jerarquía del sitio. */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/** Ficha de un servicio de taller (alineación, balanceo, montaje) como
    `Service` de schema.org, colgado del `TireShop` que lo presta. Sin esto,
    "gomería" y los servicios de taller no tenían ningún nodo propio en el
    grafo — sólo texto suelto en la página. */
export function serviceJsonLd(service: {
  id: string;
  title: string;
  description: string;
}) {
  const branch = BRANCHES[0];
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/servicios/${service.id}#servicio`,
    name: service.title,
    description: service.description,
    url: absoluteUrl(`/servicios/${service.id}`),
    serviceType: service.title,
    provider: { "@id": branchNodeId(branch) },
    areaServed: branch.areaServed.map((name) => ({ "@type": "City", name })),
  };
}

/**
 * Landing de una localidad: un Service (venta de neumáticos y gomería) cuyo
 * área de servicio es esa localidad y cuyo proveedor es la sucursal que la
 * atiende. Le da a buscadores y a LLMs la relación explícita "esta zona ->
 * este local" que el texto de la página dice en prosa.
 */
export function localidadJsonLd(localidad: { slug: string; name: string; province: string }, branch: Branch) {
  const path = `/neumaticos-en/${localidad.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}${path}#servicio`,
    name: `Neumáticos baratos en ${localidad.name}`,
    serviceType: "Venta de neumáticos",
    url: absoluteUrl(path),
    provider: { "@id": branchNodeId(branch) },
    areaServed: {
      "@type": "City",
      name: localidad.name,
      containedInPlace: { "@type": "AdministrativeArea", name: localidad.province },
    },
  };
}

export type Faq = { question: string; answer: string };

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/** Listado de productos de una página de categoría/medida. Le dice a Google que
    la página es un listado real y en qué orden están los ítems. */
export function itemListJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}
