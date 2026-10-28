# Checklist de apertura de un local nuevo (web, SEO y contenido)

Sirve para San Justo (apertura prevista: primera semana de diciembre de 2026) y para cada local que venga después. Está pensado para un modelo de locales alquilados, con poca inversión y arranque rápido: casi todo sale de **cargar datos**, no de programar.

Convención: **Día D** = día de apertura. ✅ = ya está hecho en el código. ⬜ = pendiente. Los ítems marcados *(código)* se verificaron en el repo el 2026-10-28.

---

## Estado de San Justo al 2026-10-28

✅ Entrada en `BRANCHES` (`src/lib/config.ts`) con `provisorio: true` y `apertura: "en diciembre"` *(código)*
✅ 29 localidades con página propia en `/neumaticos-en/…` apuntando a esta sucursal *(código: `localidades.ts`)*
✅ Nota `/blog/gomeria-en-san-justo-buenos-aires` y enlace desde `/servicios`
✅ Banner del header ("abre en diciembre"), pie de página y estado de la sucursal ("Abrimos en diciembre") ya contemplan `apertura`
⬜ Teléfono y WhatsApp: hoy es un número personal provisorio, falta el de la sucursal
⬜ Foto de fachada (`facadePhoto`), `reviewUrl`, `googleMapsEmbedUrl` y `googleStoreCode`: salen del perfil de Google Business y todavía no están
⬜ Horario y servicios confirmados (por eso sigue `provisorio`)
⬜ Stock y precios de la sucursal en el POS (el sitio lee `/<slug>/productos`)
⬜ QR de la sucursal y de reseñas (`public/qr`, `npm run generate-qr`)

---

## Fase 1 · Antes de abrir (de ahora a D-7)

### Datos que hay que conseguir (no los inventamos)
- [ ] Dirección exacta, código postal, coordenadas y link de Google Maps.
- [ ] Teléfono y WhatsApp **propios del local** (hoy está el personal de Augustin).
- [ ] Horario real y qué días abre.
- [ ] Qué se hace en el local el día 1: ¿solo venta?, ¿colocación?, ¿alineado y balanceo? ¿Con qué equipos? **No afirmar equipos ni servicios hasta confirmarlos** (en Argüello los equipos están documentados; en San Justo todavía no).
- [ ] Orden de llegada o turnos: cómo se atiende.
- [ ] Fotos: fachada y local por dentro (aunque sea mínimo). Una foto real da confianza y evita el "¿existe?".

### Google Business Profile
- [ ] La dirección corresponde a un perfil que ya existía con otro nombre ("Ruedas Bojanich - Sucursal San Justo", según el comentario de `config.ts`): **reclamar y actualizar ese perfil, no crear uno duplicado**.
- [ ] Nombre, categoría principal "Tienda de neumáticos", categorías secundarias (gomería, alineación, etc. según lo que se ofrezca).
- [ ] Horario, teléfono, sitio web (`/sucursales/san-justo`), fotos, descripción y servicios.
- [ ] Con el perfil activo, copiar `googleStoreCode`, `reviewUrl` y `googleMapsEmbedUrl` a `config.ts`.
- [ ] Vincular el perfil a Merchant Center (feed de inventario local `/feed/google-local-inventory.xml`, que ya existe).

### POS
- [ ] Crear/confirmar la sucursal en el POS con el slug que usa el sitio (`san-justo`) y cargar stock y precios. Sin eso el catálogo del sitio queda vacío para esa sucursal.
- [ ] Revisar fotos y `imagen_url` de los productos cargados (ver nota del proyecto sobre el campo manual).

### Sitio (cargar datos)
- [ ] Completar la entrada en `config.ts`: teléfono, WhatsApp, horario, `schedule`, `mapUrl`, coordenadas, `facadePhoto`, `reviewUrl`, `googleMapsEmbedUrl`, `googleStoreCode`.
- [ ] Subir la foto de fachada a `public/images/branches/san-justo-fachada.webp` (el prebuild genera la versión para compartir).
- [ ] Ajustar `mapPosition` para el mapa de pines si hace falta.
- [ ] Generar los QR: `npm run generate-qr` (necesita `reviewUrl`).
- [ ] Revisar las 29 localidades: **cada una necesita `intro` y `porQue` propios**; si dos comparten texto Google puede tratarlas como páginas duplicadas y dejar de indexarlas.
- [ ] Revisar `areaServed` y los tiempos de viaje (`minutosHastaSucursal`) con datos reales.

### Contenido programado (usa la publicación programada del blog)
- [ ] Nota de noticia: "Abre Neumáticos Trivium San Justo" (fecha = Día D). Con dirección, horario, qué se ofrece y cómo llegar.
- [ ] Nota "Cómo llegar a Neumáticos Trivium San Justo" desde las zonas principales (Ramos Mejía, Morón, La Matanza, etc.).
- [ ] Revisar `/blog/gomeria-en-san-justo-buenos-aires` y alinearla con lo confirmado.
- [ ] Notas de medidas y de servicio con enfoque nacional siguen su calendario normal.

---

## Fase 2 · El Día D

- [ ] En `config.ts` de San Justo: **sacar `apertura`** (el banner del header, el pie y el estado "Abrimos…" desaparecen solos) y **sacar `provisorio`** cuando horario y servicios estén confirmados (las landings locales empiezan a mostrar horario, fotos y servicios).
- [ ] Verificar que `/sucursales/san-justo`, `/neumaticos-en/san-justo` y las localidades muestren el estado "Abierto" y el horario correcto.
- [ ] Verificar el selector de sucursal del sitio: el catálogo y el precio deben ser los de San Justo al elegirla.
- [ ] Publicar la nota de apertura (programada para ese día) y compartirla en redes y en el perfil de Google (publicación de novedad).
- [ ] Enviar el sitemap actualizado en Search Console y pedir indexación de `/sucursales/san-justo` y `/neumaticos-en/san-justo`.
- [ ] Foto y video de apertura para redes y para el perfil de Google.
- [ ] QR de reseñas visible en el mostrador.

---

## Fase 3 · Primeras semanas (D+1 a D+30)

- [ ] Pedir reseñas de Google a los primeros clientes (con el QR). Es lo que más pesa en las búsquedas locales.
- [ ] Subir fotos reales del local y de trabajos al perfil de Google, una o dos por semana.
- [ ] Responder todas las reseñas.
- [ ] Medir en Search Console y en el perfil de Google: búsquedas de "gomería san justo", "neumáticos san justo", llamadas y "cómo llegar".
- [ ] Ajustar anuncios de Google Ads con ubicación en la zona (ver abajo).
- [ ] Sumar notas locales reales (por ejemplo, casos de clientes de la zona, con permiso) y enlazarlas desde las landings de localidades.
- [ ] Revisar a los 30 días: qué palabras traen visitas, qué localidades no indexan y qué texto hay que diferenciar.

---

## Medición y publicidad

- [ ] GA4: confirmar que `click_whatsapp`, `como_llegar` y las llamadas se registran por sucursal (hoy no están marcados como eventos clave, ver nota del proyecto).
- [ ] Google Ads: campañas por sucursal con radio razonable y palabras clave de medidas (las de más volumen) más "gomería" y "neumáticos" + zona. El presupuesto lo define el negocio.
- [ ] Definir 3 números de seguimiento por local: visitas a la ficha de sucursal, clics en "cómo llegar" y WhatsApp.

---

## Plantilla para el próximo local (vale para cualquier ciudad)

1. **Datos del local** (ver "Datos que hay que conseguir").
2. **Perfil de Google Business** reclamado o creado; copiar `googleStoreCode`, `reviewUrl`, `googleMapsEmbedUrl`.
3. **Entrada en `BRANCHES`** con `provisorio: true` y `apertura: "<fecha>"`.
4. **Entradas en `localidades.ts`** de la zona, cada una con `intro` y `porQue` únicos.
5. **POS**: crear la sucursal y cargar stock.
6. **Contenido**: una nota "gomería/neumáticos en <ciudad>" y la nota de apertura, programadas.
7. **Día D**: sacar `apertura` y `provisorio`.
8. **Primer mes**: reseñas, fotos, medición.

**Regla de oro:** no prometer equipos, servicios ni precios de un local antes de que existan. Es mejor una página que diga "abrimos en diciembre" que una que anuncie algo que no se puede cumplir, y evita problemas con Google (inconsistencias de datos entre el sitio y el perfil).

## Pendientes de decisión (necesitan respuesta del negocio)
- ¿Qué servicios ofrece San Justo desde el día 1?
- ¿Qué horario va a tener?
- ¿Cuál es el teléfono y WhatsApp del local?
- ¿Hay fecha exacta de apertura (para programar la nota)?
- ¿Quién saca las fotos de la fachada y del local?
