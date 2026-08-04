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
