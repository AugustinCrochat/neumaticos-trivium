import NextLink from "next/link";
import type { ComponentProps } from "react";

/**
 * `next/link` sin prefetch por defecto.
 *
 * Con el prefetch automático cada link visible dispara varios pedidos `?_rsc=`
 * al Worker (una portada con scroll llegaba a ~35 invocaciones), y en el plan
 * gratuito eso agotaba el límite de CPU (1102). La navegación sigue siendo
 * client-side, sólo que se pide al hacer clic. Para forzarlo en un link puntual
 * pasar `prefetch`.
 */
export default function Link({ prefetch = false, ...props }: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={prefetch} {...props} />;
}
