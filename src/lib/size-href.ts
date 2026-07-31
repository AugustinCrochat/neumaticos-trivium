/**
 * A dónde mandar una búsqueda por medida.
 *
 * Con los tres valores completos va a la landing estática /neumaticos/205-55-r16:
 * está renderizada en el servidor, es indexable y tiene equivalencias, autos
 * compatibles y FAQ. Con una medida parcial (sólo ancho, o ancho y perfil) sigue
 * yendo a /buscar, que es el buscador interactivo y sabe filtrar por coincidencia
 * parcial.
 *
 * Vive en su propio módulo, sin imports, porque lo usan componentes cliente:
 * si estuviera en tire-sizes.ts arrastraría VEHICLE_DB entero al bundle.
 */
export function sizeSearchHref(width: string, profile: string, rim: string): string {
  const completa = width.length === 3 && profile.length === 2 && rim.length === 2;
  const medida = `${width}-${profile}-r${rim}`;
  return completa ? `/neumaticos/${medida}` : `/buscar?medida=${medida}`;
}
