# Auditoría autónoma — 5/11/2026

Hecha mientras el dueño no estaba. Nada se subió (sin push). Los cambios están en el árbol de trabajo para revisar.

## Cambios hechos (en el código, sin publicar)

1. **Encabezados de seguridad** (`public/_headers`): `X-Content-Type-Options`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `Strict-Transport-Security`, `Permissions-Policy`. Antes ninguna página los traía. Sin CSP a propósito (Turnstile, GA, mapas, Mercado Pago). **Verificar tras el deploy** que Cloudflare aplique `_headers` a los assets: `curl -I https://neumaticos.trivium.ar/logo-neumaticos-trivium.svg`.
2. **Fichas de producto** (`/productos/[slug]`): título "Cubierta <modelo> a $X, colocación sin cargo" y descripción con precio, stock y garantía. Antes: "Neumático <modelo> | Trivium" y una descripción genérica ("Comprá… al mejor precio").
3. **/catalogo, /cordoba/catalogo, /buenos-aires/catalogo**: el HTML prearmado salía **vacío** (el catálogo se arma en el navegador: `BAILOUT_TO_CLIENT_SIDE_RENDERING`, sin h1 ni un solo producto). Ahora el `Suspense` trae una lista HTML con los 139 productos (modelo, precio, enlace a la ficha) y un h1. Importa para buscadores sin JS y para los rastreadores de IA.
4. **/servicios**: no tenía h1 (el título era un h2 de la sección). Ahora es h1.
5. **Worker (`worker.ts`)**: prueba primero los archivos de `.open-next/assets` (HTML prearmado, feeds, `/datos/*.json`) y recién después arranca OpenNext. Ver "Hallazgo grande" abajo. **No verificado en producción**: probar tras el deploy.
6. Buscador del catálogo: queda marcada la opción usada (medida/patente) y la chapa muestra el tipo de la patente buscada, sin animación.

## Hallazgo grande: los archivos estáticos no se están sirviendo

- El deploy copia ~970 páginas, los feeds y `datos/medidas.json` / `datos/vehiculos.json` a `.open-next/assets` y wrangler los sube (log del 5/11: "Uploaded 991 files").
- Pero en producción `GET /datos/vehiculos.json` da **404** (lo responde Next, header `x-opennext: 1`), `/datos/medidas.json` da 404/503, y las páginas llevan `x-opennext-cache: HIT` + `x-trivium-edge`: pasan por el Worker, no salen del borde como asset. Los archivos de `public/` (logo, imágenes) sí salen como asset (`cf-cache-status: HIT`).
- Consecuencia: la mejora "sin Worker" de la memoria del 28/10 no se está dando, y el buscador cae al respaldo `/api/*` (Worker). Hay 1102 intermitentes (`/vehiculos/marca/lexus` dio "error code: 1102" y 3 de cada 100 URLs del sitemap dieron 503 al pedirlas en serie).
- Causa no confirmada. Con el cambio de `worker.ts` el Worker devuelve el archivo si existe. Si después de publicar `/datos/vehiculos.json` sigue en 404, el problema es que los archivos copiados no entran al manifiesto de assets (investigar `wrangler versions view` / subir con `WRANGLER_LOG=debug`).
- Además, en el log del deploy: "Populating remote R2 incremental cache… Worker returned a 503" (4 reintentos). Hoy el caché R2 no hace falta para el HTML (se redespliega cada 2 h), pero es otro síntoma.

## Seguridad: lo que hay que decidir (no lo toqué)

| Tema | Detalle | Acción sugerida |
|---|---|---|
| **Secretos en el repo** | `wrangler.jsonc` trae en claro `MERCADOPAGO_ACCESS_TOKEN` (producción), `GOCUOTAS_API_KEY_PRODUCTION` y la de sandbox. Repo privado, pero cualquiera con acceso al repo o a un log los tiene. | Pasarlos a secrets del Worker (`wrangler secret put`) y rotar el token de MP. Cuidado: el deploy pisa las vars del dashboard (ver el comentario de `wrangler.jsonc`), por eso hay que usar secrets, no vars. |
| **Dependencias** | `npm audit`: 2 críticas (Next 16.2.10 → hay 16.4.5; maplibre-gl XSS en `DOM.sanitize`), 4 altas (sharp, source-map-js…). Las de Next afectan sobre todo Server Actions / Turbopack / middleware, que el sitio casi no usa; igual conviene subir. | Subir Next a 16.4.x en una rama y correr el build completo + deploy de prueba; maplibre a 6.x revisando el mapa de sucursales. |
| **Imágenes remotas** | `next.config.ts` permite `remotePatterns` con `**` (cualquier host). Con `images.unoptimized: true` no hay proxy de imágenes, así que el riesgo es bajo, pero es una puerta abierta si se activa el optimizador. | Limitar a los hosts reales (POS/Supabase). |
| **Linter** | 34 errores de `react-hooks` (reglas nuevas, p. ej. `setState` en efectos) + `@ts-ignore` en `worker.ts`. Ninguno rompe el build. | Limpiar de a poco; no urgente. |

## SEO / LLM — pendientes con datos

- 136 URLs con título de más de 70 caracteres y 72 con descripción de más de 175 (Google corta ~60/155). Son sobre todo `/vehiculos/marca/*`, `/neumaticos-en/*`, comparativas. Conviene acortar la plantilla, no una por una.
- `/vehiculos/volvo-c30` sin descripción ni canonical en la prueba (revisar si es un caso único).
- Ideas de marcado: `FAQPage` en las fichas de servicio ya existe; falta `Offer` con `availability` por sucursal en el JSON-LD del producto (hoy una sola oferta) y `AggregateRating` desde las 52 reseñas de Google (solo si se pueden mostrar de forma visible y verificable).
- `llms.txt` está bien armado. Sumar al final un bloque "Datos que podés citar" (precios del combo con fecha, garantía, horarios) ayuda a que los asistentes lo repitan sin inventar.

## Ideas de otros sitios (Tire Rack, Blackcircles, Kwik Fit)

- **Precio instalado, no solo del neumático**: Blackcircles muestra el precio con la colocación incluida. Nosotros ya la tenemos sin cargo: ponerlo en la tarjeta ("$X, colocado") en vez de solo en la ficha.
- **Comparador lado a lado** (Tire Rack compara hasta 4 modelos con specs y pruebas): una página `/comparar?ids=` con 2–3 cubiertas de la misma medida (precio, índice de carga/velocidad, etiqueta UE, garantía). Reusa los datos que ya hay.
- **"Mi garage"**: guardar el auto elegido (ya se recuerda en la pestaña) y mostrarlo fijo en el encabezado con un botón "cambiar".
- **Reseñas en la ficha**: ya hay 4,9 con 52 reseñas en Google; mostrarlas con el enlace a la ficha de Maps.
- **Disponibilidad de colocación**: Blackcircles muestra "primer horario disponible". Nosotros atendemos por orden de llegada: la herramienta de "horario tranquilo" ya cubre esto; destacarla en la ficha de producto.

## Oportunidades para la empresa

**Córdoba**
- Competidores locales que aparecen en la prensa: Ingelmo (casa central Maipú, nueva gomería en Recta Martinolli), Neumáticos Martín (distribuidor Pirelli), Castagno, Levis Oldani. La Cámara Cordobesa de Neumáticos (preside Ingelmo) habla de oferta reducida por importaciones: un ángulo de nota sobre importación directa y stock real, citando fuentes.
- Verificación técnica: la prensa cordobesa reportó gomerías que alquilan cubiertas para pasar la VTV. Una nota/guía "cubiertas para la VTV: qué mide el control" con fuentes públicas es contenido útil y estacional.
- Ficha de Google: pedir reseñas con el enlace directo y subir fotos del taller cada semana; es lo que decide "gomería cerca de mí" (246.000 búsquedas/mes).

**Buenos Aires (San Justo, enero; Lomas del Mirador, diciembre)**
- Crear la ficha de Google Business de cada local **antes** de abrir (se puede verificar con anticipación) y la landing `/neumaticos-en/<localidad>` ya existe: sumar el cartel "Abrimos en <mes>" con aviso por WhatsApp (el sitio ya tiene "avisame").
- Alianzas rápidas: remises/taxis y apps (ya hay landing) y flotas chicas del conurbano; ofrecer cuenta con precio fijo.

**Marca**
- Instagram/Facebook enlazados desde cada local, y un video corto del taller (alineado 3D en 30 s) para la ficha y el sitio.

## pro.trivium.ar (B2B) — revisión rápida

- Sitio estático ordenado: 296 páginas HTML sin duplicados de título, `robots.txt` con reglas para bots de IA, `llms.txt` y `llms-full.txt`, `_headers` con noindex en las páginas privadas.
- Pendientes menores: `preview_icons.html` y `preview_icons_inline.html` están publicados sin título (borrarlos o noindexarlos); 15 títulos de guías de más de 65 caracteres; 9 descripciones de más de 170; `marcas.html` sin h1. Sin cambios hechos en ese repo.
- Oportunidad: las notas de gomería de pro y las de neumáticos se enlazan entre sí (25 enlaces); sumar una página "Equipá tu gomería" en neumaticos.trivium.ar que lleve a `/equipos/` para captar a quien busca abrir una gomería (decidir antes cómo se presenta Trivium Pro en el sitio de consumo; hoy solo hay una mención de autoridad en las notas de ahorro).
