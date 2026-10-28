/**
 * Navega a otra página con una carga completa.
 *
 * Las páginas prearmadas se sirven como archivos estáticos (ver
 * scripts/copy-prerendered-html.mjs): una carga completa es de lo más rápido
 * que hay (HTML del borde + JS ya cacheado). La navegación del router de Next
 * (`router.push`) pide la versión RSC de la página, que los archivos estáticos
 * no tienen: recibiría el HTML, lo detectaría y recargaría igual, pero tras un
 * pedido de más.
 */
export function irA(href: string) {
  window.location.assign(href);
}
