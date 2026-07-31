/**
 * Inyecta un bloque de structured data.
 *
 * El escape de "<" evita que un nombre de producto con una etiqueta adentro
 * cierre el <script> antes de tiempo (XSS clásico de JSON-LD). El JSON queda
 * igual de válido: "<" es la misma barra angular para cualquier parser.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
