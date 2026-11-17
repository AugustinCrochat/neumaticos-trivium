# Bing y citaciones (directorios)

Objetivo: que Bing y Google vean el mismo negocio, con los mismos datos, en varios sitios independientes. Importa la **consistencia** (NAP idéntico), no el tráfico del directorio.

## Datos canónicos (copiar tal cual en todos lados)

Fuente: `src/lib/config.ts`. Si algo cambia allá, cambia acá.

| Campo | Valor |
|---|---|
| Nombre | Neumáticos Trivium |
| Dirección | Av. Donato Alvarez 7971, Argüello, Córdoba (CP X5147, sin verificar contra factura) |
| Teléfono / WhatsApp | +54 9 351 757-0422 |
| Horario | Lun–Sáb 9 a 19 h, de corrido; domingo cerrado |
| Web | https://neumaticos.trivium.ar |
| Email | info@trivium.ar |
| Categoría principal | Tienda de neumáticos (secundaria: taller de alineación y balanceo) |
| Redes | https://www.instagram.com/neumaticos.trivium/ · https://www.facebook.com/profile.php?id=61589579136727 |

Descripción corta (sin precios, sin URLs, sin promos): "Neumáticos nuevos de todas las marcas, colocación y válvulas sin cargo, alineación y balanceo en Argüello, Córdoba. Lunes a sábado de 9 a 19 h."

Solo Argüello está abierta. Lomas del Mirador y San Justo se cargan recién al abrir (diciembre/enero), cada una con su propia ficha.

## Orden de prioridad

1. **Bing Places** (bing.com/forbusiness): importar desde Google Business Profile, tildar sincronización. Si el perfil de Google está verificado, Bing verifica solo. Publica en ~10–14 días. Es lo que más mueve Bing, DuckDuckGo y Copilot.
2. **Bing Webmaster Tools** (bing.com/webmasters): importar el sitio desde Search Console, enviar `https://neumaticos.trivium.ar/sitemap.xml`. IndexNow ya está activo (clave en `public/`, script `scripts/indexnow.mjs`; `--all` avisa todo el sitemap; se corrió el 2026-11-17 con 1.005 URLs, HTTP 200).
3. **Apple Business Connect** (Apple Maps; DuckDuckGo lo usa).
4. **Facebook e Instagram**: completar dirección, teléfono, horario y web idénticos. Ya figuran en `sameAs`.
5. **Foursquare** (alimenta Bing, Apple y otros).
6. **Argentinos**: Páginas Amarillas (paginasamarillas.com.ar), Argentino.com (alta gratis según su página para empresas), Guía Clarín, Cuit Online, Argentina Empresas. Verificar en cada sitio si el alta es gratis; no pagar planes por esto.
7. Waze, Yelp, Cylex, Hotfrog: opcionales, solo si el alta es gratis y rápida.

## Reglas

- Nunca poner un teléfono o dirección distintos "por tracking".
- No pagar "paquetes de citaciones" ni cargas masivas de terceros: ensucian el NAP.
- Si ya existe una ficha duplicada (pasó con San Justo, ex Ruedas Bojanich), reclamarla, no crear otra.
- Cada perfil nuevo con URL propia se suma a `sameAs` en `src/lib/seo.ts` (Organization) y a `llms.txt` si corresponde.
- Registro de lo cargado: completar la tabla de abajo.

## Registro

| Sitio | Estado | Fecha | URL del perfil |
|---|---|---|---|
| Google Business | activo, 57 reseñas | — | https://maps.app.goo.gl/tQrXVQCQ5VviAYY46 |
| Bing Places | importado de Google, publicación pendiente (~10–14 días) | 2026-11-17 | bing.com/forbusiness |
| Bing Webmaster | sitio agregado, sitemap enviado (procesando), IndexNow activo | 2026-11-17 | bing.com/webmasters |
| Apple Business Connect | pendiente | | |
| Facebook / Instagram | activos, revisar NAP | | |
| Foursquare | pendiente | | |
| Páginas Amarillas | pendiente | | |
| Argentino.com | pendiente | | |

Nota 2026-11-17: Google/Bing Places muestran el CP de Argüello como **X5022IFB** (Bing lo importó así). Nuestro config.ts tiene X5147. Confirmar con una factura y unificar en todos los sitios.
