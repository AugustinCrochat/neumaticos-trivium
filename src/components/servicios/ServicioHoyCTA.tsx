import { getServiciosPrecios } from "@/lib/pos-api";
import { DEFAULT_BRANCH_ID } from "@/lib/config";
import { COMBO_ID, preciosTaller } from "@/lib/servicios-seo";
import { ServicioHoyBox } from "@/components/servicios/ServicioHoyBox";

/**
 * Recuadro "¿Lo necesitás hoy?" para las notas de gomería. Esas notas rankean
 * para "alineación y balanceo" y "gomería" por encima de la ficha del
 * servicio, pero quien busca eso casi siempre quiere ir hoy: el recuadro le da
 * el precio y lo lleva a la ficha, y a Google le marca cuál es la página del
 * servicio. Precios del POS en el build (sitio estático); lo que depende de la
 * sucursal elegida lo resuelve ServicioHoyBox.
 */
export async function ServicioHoyCTA() {
  const p = preciosTaller(await getServiciosPrecios(undefined, DEFAULT_BRANCH_ID));
  return <ServicioHoyBox href={`/servicios/${COMBO_ID}`} auto={p.comboAuto} camioneta={p.comboCamioneta} />;
}
