import { ZonasPorProvincia } from "@/components/seo/ZonasPorProvincia";
import { LocalSucursal } from "@/components/home/LocalSucursal";

/**
 * Bloque local de la home.
 *
 * La home es la página con más autoridad del dominio y, sin un bloque así, no
 * emite ninguna señal geográfica en el HTML visible: la dirección sólo aparecía
 * en el footer. Para el pack local de "neumáticos Córdoba" eso importa, y de
 * paso enlaza las landings de localidad desde arriba del árbol. El contenido
 * del local sigue a la sucursal elegida (ver LocalSucursal); las zonas son
 * las mismas para todos.
 */
export function LocalSection() {
  return <LocalSucursal zonas={<ZonasPorProvincia />} />;
}
