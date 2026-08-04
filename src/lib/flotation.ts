/**
 * Medida "flotation" (LT/A-T/M-T de camioneta), en pulgadas: diámetro total
 * armado x ancho de sección R rodado — ej. "31x10.5R15". El rodado coincide
 * 1 a 1 con el métrico (los dos lo expresan en pulgadas); lo que cambia es
 * que acá el ancho y el diámetro también van en pulgadas, no en mm/%.
 *
 * Réplica de pos-neumaticos/src/lib/tire.ts (parseFlotationDimensions /
 * flotationToMetric / formatFlotationSize) — si se toca acá, tocar allá
 * también. Sin imports a propósito: lo usa TireSizeSearch (client component)
 * y no queremos arrastrar nada pesado al bundle (ver size-href.ts).
 */
export interface FlotationSize {
  diameterIn: number;
  widthIn: number;
  rim: number;
}

/**
 * Convierte a métrico aproximado, redondeado a los pasos habituales de
 * fábrica (ancho de a 5mm, perfil de a 5%) para que coincida con cómo se
 * cargan los productos reales del catálogo.
 */
export function flotationToMetric(f: FlotationSize): { width: number; profile: number; rim: number } {
  const widthMm = f.widthIn * 25.4;
  const sidewallMm = ((f.diameterIn - f.rim) / 2) * 25.4;
  const profilePct = (sidewallMm / widthMm) * 100;
  return {
    width: Math.round(widthMm / 5) * 5,
    profile: Math.round(profilePct / 5) * 5,
    rim: f.rim,
  };
}

/** "31x10.50R15" — como se lee en el flanco. */
export function formatFlotationLabel(f: FlotationSize): string {
  const widthStr = f.widthIn.toFixed(2).replace(/0$/, '');
  return `${f.diameterIn}x${widthStr}R${f.rim}`;
}

/**
 * El cálculo inverso de flotationToMetric: dado un ancho/perfil/rodado
 * métrico, el diámetro y ancho equivalentes en pulgadas, redondeados a los
 * medios pasos habituales del sistema flotation (31, 31.5, 32... / 10, 10.5,
 * 11...). Solo tiene sentido mostrarlo para medidas de camioneta (LT/A-T/M-T)
 * — ver `esRangoFlotation`.
 */
export function metricToFlotation(size: { width: number; profile: number; rim: number }): FlotationSize {
  const sidewallMm = size.width * (size.profile / 100);
  const diameterIn = (size.rim * 25.4 + 2 * sidewallMm) / 25.4;
  const widthIn = size.width / 25.4;
  return {
    diameterIn: Math.round(diameterIn * 2) / 2,
    widthIn: Math.round(widthIn * 2) / 2,
    rim: size.rim,
  };
}

/** "31x10.5R15" — sin el cero final que arrastra formatFlotationLabel. */
export function formatFlotationEquivalent(f: FlotationSize): string {
  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
  return `${fmt(f.diameterIn)}x${fmt(f.widthIn)}R${f.rim}`;
}

/**
 * El formato flotation es el estándar de fábrica solo en neumáticos LT
 * (Light Truck) de camionetas/4x4 — anchos de auto de pasajeros no se
 * comercializan así y mostrar la conversión ahí sería ruido, no dato útil.
 */
export function esRangoFlotation(width: number): boolean {
  return width >= 215;
}
