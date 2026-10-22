import type { RecargoTarjeta } from "@/lib/pos-api";

export type Plan = { id: string; cuotas: string; coeficiente: number | null };

export const CONTADO_ID = "__contado__";
export const MERCADO_PAGO_GRUPO = "Mercado Pago";
export const GOCUOTAS_GRUPO = "GOcuotas";

/** El grupo de un plan puede venir cargado en el POS como "Cuota Mipyme" (la
    categoría de tarifa del comercio) — es un dato interno que no le dice
    nada al cliente, así que en la web se muestra genérico. */
export function displayGrupoLabel(grupo: string): string {
  return esBanco(grupo) ? "Visa o Master de banco" : grupo;
}

export function esBanco(grupo: string): boolean {
  return /mipyme/i.test(grupo);
}

export function esNaranja(grupo: string): boolean {
  return /naranja/i.test(grupo);
}

/** El grupo viejo, dedicado, de "3 cuotas sin interés" quedó sin uso en el
    POS al pasar esa lógica a un override por día (ver aplicarOverrides) —
    filtrarlo acá evita mostrar un método de pago fantasma mientras no lo
    borren de recargos_tarjeta. */
export function esGrupoObsoleto(grupo: string): boolean {
  // El viejo grupo dedicado de "3 cuotas sin interés" (ver aplicarOverrides).
  if (/sin\s*inter[eé]s/i.test(grupo)) return true;
  // "Promoción Especial": grupo cargado en el POS sin coeficiente (no hay tasa
  // que calcular), que acá aparecía como un medio de pago sin explicación.
  if (/promoci[oó]n\s*especial/i.test(grupo)) return true;
  // "Cuotas" a secas es el genérico que en el POS es sólo la fuente de la
  // que Visa/Master "toma prestada" la tasa a 12 cuotas (ver planesParaGrupo)
  // — no es un medio de pago que el cliente pueda elegir por su cuenta acá,
  // así que no se lista como grupo propio.
  if (grupo.trim().toLowerCase() === "cuotas") return true;
  return false;
}

/**
 * Cuotas de Mercado Pago con tarjeta de crédito Mercado Pago: no vienen de
 * recargos_tarjeta (esa tabla es para tarjetas cobradas en el local), así
 * que van hardcodeadas acá según las reglas vigentes:
 * - 2 cuotas sin interés se activan a partir de $50.000.
 * - 3 cuotas sin interés se activan a partir de $150.000; por debajo de eso
 *   sigue habiendo 3 cuotas, pero con el coeficiente 1.0471 (con interés).
 * - 6 y 12 cuotas son siempre con interés (1.1148 y 1.2422), no hay monto que
 *   las vuelva sin interés.
 * Los coeficientes son los "S/IVA" del simulador de coeficientes de Mercado
 * Pago (el IVA no se suma acá).
 */
export function mercadoPagoPlanes(amount: number): Plan[] {
  const planes: Plan[] = [{ id: "mp-1", cuotas: "1 pago", coeficiente: 1 }];
  if (amount > 50000) {
    planes.push({ id: "mp-2", cuotas: "2 cuotas sin interés", coeficiente: 1 });
  }
  planes.push({
    id: "mp-3",
    cuotas: amount > 150000 ? "3 cuotas sin interés" : "3 cuotas",
    coeficiente: amount > 150000 ? 1 : 1.0471,
  });
  planes.push({ id: "mp-6", cuotas: "6 cuotas", coeficiente: 1.1148 });
  planes.push({ id: "mp-12", cuotas: "12 cuotas", coeficiente: 1.2422 });
  return planes;
}

/**
 * "3 cuotas sin interés" sólo existe como tal en dos casos puntuales, así
 * que se fuerza acá en vez de depender de cómo esté cargado el coeficiente
 * en el POS:
 * - Visa/Master de banco ("mipyme"): únicamente los miércoles y sábados.
 * - Plan Z de Naranja: siempre, es la definición del plan.
 * Cualquier otro día, el plan de 3 cuotas de banco se muestra tal cual está
 * cargado (con su recargo real).
 */
export function aplicarOverrides(grupo: string, planes: Plan[], esDiaPromo: boolean): Plan[] {
  const naranja = esNaranja(grupo);
  if (!esBanco(grupo) && !naranja) return planes;
  return planes.map((p) => {
    if (esBanco(grupo) && esDiaPromo && parseInt(p.cuotas, 10) === 3) {
      return { ...p, cuotas: "3 cuotas sin interés", coeficiente: 1 };
    }
    if (naranja && /plan\s*z/i.test(p.cuotas)) {
      return { ...p, cuotas: "3 cuotas sin interés", coeficiente: 1 };
    }
    return p;
  });
}

/** Logo(s) del medio de pago seleccionado — el banco muestra Visa y
    Mastercard juntas porque el plan de "mipyme" aplica a ambas. */
export function logosDelGrupo(grupo: string): string[] {
  if (grupo === MERCADO_PAGO_GRUPO) return ["/images/payments/mercadopago.svg"];
  if (grupo === GOCUOTAS_GRUPO) return ["/images/payments/gocuotas.svg"];
  if (esNaranja(grupo)) return ["/images/payments/naranja-x.svg"];
  if (esBanco(grupo)) return ["/images/payments/visa.svg", "/images/payments/mastercard.svg"];
  return [];
}

/**
 * Planes de cuotas para un grupo dado, mismo criterio en todos lados donde
 * se calculan cuotas (InstallmentCalculator y el hover de PaymentMethodsSection):
 * Mercado Pago y GOcuotas tienen reglas fijas; el resto sale de recargos del
 * POS (recargosPOS), con los overrides de "sin interés" ya aplicados.
 */
export function planesParaGrupo(
  grupo: string,
  basePrice: number,
  recargosPOS: RecargoTarjeta[] | null,
  esDiaPromo: boolean
): Plan[] {
  if (grupo === MERCADO_PAGO_GRUPO) return mercadoPagoPlanes(basePrice);
  if (grupo === GOCUOTAS_GRUPO) return [{ id: "goc-3", cuotas: "3 cuotas sin interés", coeficiente: 1 }];
  return aplicarOverrides(
    grupo,
    [
      { id: CONTADO_ID, cuotas: "1 pago", coeficiente: 1 },
      ...(recargosPOS ?? []).filter((r) => r.grupo === grupo),
      // El banco (Visa/Master) no tiene tasa Mipyme propia a 12 cuotas — el
      // POS le presta la del grupo genérico "Cuotas" (mismo criterio que
      // planesTarjetaCredito en pos-neumaticos).
      ...(esBanco(grupo) ? (recargosPOS ?? []).filter((r) => r.grupo === "Cuotas" && parseInt(r.cuotas, 10) === 12) : []),
    ],
    esDiaPromo
  );
}
