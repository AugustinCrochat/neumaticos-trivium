import NextLink from "next/link";
import type { AnchorHTMLAttributes, ComponentProps } from "react";

/**
 * Link del sitio: un `<a>` común (carga completa) para las rutas internas.
 *
 * Las páginas prearmadas se sirven como archivos estáticos desde el borde de
 * Cloudflare, sin pasar por el Worker (ver scripts/copy-prerendered-html.mjs):
 * eso es lo que las hace rápidas desde la primera visita, también para quien
 * llega por primera vez. Esos archivos solo tienen HTML —no la versión RSC que
 * pide la navegación del router de Next—, así que un `next/link` terminaría
 * pidiendo la página dos veces. Con un `<a>` se pide una sola vez, y el HTML
 * estático y el JS (cacheado) cargan casi al instante.
 *
 * Las props propias de next/link (prefetch, scroll, replace…) se aceptan y se
 * ignoran, para que los usos existentes sigan compilando.
 */
type Props = ComponentProps<typeof NextLink>;

export default function Link({ href, prefetch, scroll, replace, shallow, passHref, legacyBehavior, locale, ...rest }: Props) {
  void [prefetch, scroll, replace, shallow, passHref, legacyBehavior, locale];
  if (typeof href === "string") {
    return <a href={href} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} />;
  }
  // href como objeto (pathname/query): casi no se usa; se deja a next/link.
  return <NextLink href={href} prefetch={false} {...rest} />;
}
