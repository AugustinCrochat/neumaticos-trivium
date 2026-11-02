# Test A/B de portadas de las fichas de vehículo

Dos portadas 1200x630 por modelo (`python scripts/vehicle-photo.py --cards` las regenera todas, también las de marca con `--brand-cards`):

- **A** `public/images/vehiculos/share/<slug>.jpg`: fondo blanco, medida en grande a la izquierda, auto y neumático a la derecha.
- **B** `public/images/vehiculos/share/b/<slug>.jpg`: estilo "panel diagonal": título a la izquierda con el neumático grande, auto sobre fondo oscuro y la medida en overlay.
- **Marca** `public/images/vehiculos/share/marca/<marca>.jpg`: para `/vehiculos/marca/<marca>`.

El neumático de la tarjeta es una foto propia de Trivium en la medida exacta (en pickups, la A/T); si no hay, el Pirelli o Grenlander más parecido. No se usan fotos del catálogo de Autocenter Norte (archivos con código numérico delante, ni los packs x2/x4).

## Dónde se mide
1. **En la página (por visitante)**: `PortadaAB.tsx` muestra A o B (50/50, queda en localStorage) y manda a GA4 `portada_ab_view` y `portada_ab_click` con `variant` y `vehiculo`. Registrar `variant` como dimensión personalizada de evento y comparar clics / vistas por variante.
2. **En Google y redes (por modelo)**: la miniatura la elige el rastreador, no el visitante. `cardVariant(slug)` en `src/lib/vehicle-photos.ts` asigna A o B según un hash del slug. Comparar en Search Console el CTR del grupo A contra el del grupo B (mismo período, misma cantidad de impresiones). Los OG de WhatsApp/Facebook se cachean: el efecto se ve recién cuando se reescrapea.

## Cerrar el test
Poner `PORTADA_TEST = false` en `src/lib/vehicle-photos.ts` (todo A), o cambiar `cardVariant` y `PortadaAB` para dejar B.
