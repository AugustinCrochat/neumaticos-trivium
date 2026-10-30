import type { TireSize } from "@/lib/types";

/**
 * Datos que se derivan de la medida sola (sin catálogo): para la ficha de la
 * landing y el bloque de /buscar. La fórmula de diámetro es la de
 * tire-sizes.ts, repetida acá a propósito: tire-sizes importa VEHICLE_DB y este
 * archivo se usa desde componentes de cliente.
 */
export function datosTecnicos(size: TireSize) {
  const flancoMm = size.width * (size.profile / 100);
  const diametroMm = size.rim * 25.4 + 2 * flancoMm;
  const circunferenciaMm = Math.PI * diametroMm;
  return {
    anchoMm: size.width,
    flancoMm: Math.round(flancoMm * 10) / 10,
    rodadoPulg: size.rim,
    diametroMm: Math.round(diametroMm),
    diametroPulg: Math.round((diametroMm / 25.4) * 10) / 10,
    anchoPulg: Math.round((size.width / 25.4) * 10) / 10,
    circunferenciaMm: Math.round(circunferenciaMm),
    /** Vueltas que da la rueda por kilómetro (sin carga, sin deformación). */
    vueltasPorKm: Math.round(1_000_000 / circunferenciaMm),
  };
}

const nf = new Intl.NumberFormat("es-AR");

/** Filas "dato / valor / qué significa" para mostrar en tabla. */
export function filasTecnicas(size: TireSize): { dato: string; valor: string; nota: string }[] {
  const d = datosTecnicos(size);
  return [
    { dato: "Ancho de sección", valor: `${d.anchoMm} mm (${String(d.anchoPulg).replace(".", ",")}″)`, nota: "De flanco a flanco, medido en el neumático nuevo." },
    { dato: "Alto del flanco", valor: `${String(d.flancoMm).replace(".", ",")} mm`, nota: `El ${size.profile}% del ancho: a menor perfil, andar más firme y menos amortiguación.` },
    { dato: "Rodado de llanta", valor: `${d.rodadoPulg} pulgadas`, nota: "Es el diámetro de la llanta donde se monta." },
    { dato: "Diámetro total", valor: `${d.diametroMm} mm (${String(d.diametroPulg).replace(".", ",")}″)`, nota: "Es el dato que hay que respetar al elegir una medida equivalente (±3%)." },
    { dato: "Circunferencia", valor: `${nf.format(d.circunferenciaMm)} mm`, nota: "Lo que avanza el auto en cada vuelta de rueda." },
    { dato: "Vueltas por kilómetro", valor: nf.format(d.vueltasPorKm), nota: "Cuántas veces gira la rueda por km; el velocímetro y el ABS se calculan con este número." },
  ];
}
