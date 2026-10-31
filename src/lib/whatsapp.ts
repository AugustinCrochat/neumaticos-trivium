/** Link a wa.me con el mensaje ya escrito. */
export function waHref(numero: string, texto: string) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

export const MENSAJE_GENERICO = "Hola! Estoy mirando la web y quería hacer una consulta";

/**
 * Mensaje de WhatsApp según la página que se está mirando: el título (H1) dice
 * qué medida, neumático, auto o servicio era. Así el cliente no tiene que
 * explicar qué busca y el vendedor contesta directo con precio y stock.
 * Se lee en el click (no en el render) porque los botones flotantes viven en
 * el layout y no conocen la página; en el href del render va MENSAJE_GENERICO
 * para que el HTML del servidor y el del cliente coincidan.
 */
export function mensajeSegunPagina(): string {
  const generico = MENSAJE_GENERICO;
  if (typeof document === "undefined" || window.location.pathname === "/") return generico;
  const h1 = document.querySelector("main h1")?.textContent?.replace(/\s+/g, " ").trim();
  if (!h1 || h1.length > 90) return generico;
  return `Hola! Estoy viendo "${h1}" en la web y quería consultar precio y disponibilidad`;
}

export function mensajeAvisameApertura(sucursal: string) {
  return `Hola! Quiero que me avisen cuando abra Neumáticos Trivium ${sucursal}`;
}

export function mensajeAvisameStock(producto: string, sucursal: string) {
  return `Hola! Quiero que me avisen cuando entre ${producto} en ${sucursal}`;
}
