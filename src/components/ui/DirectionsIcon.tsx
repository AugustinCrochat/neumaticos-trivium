/**
 * Ícono de "Cómo llegar": rombo con la flecha que dobla (el de /contacto).
 * Relleno, toma el color del texto. Todos los botones "Cómo llegar" del sitio
 * usan este componente.
 */
export function DirectionsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.71 11.29l-9-9a1 1 0 00-1.42 0l-9 9a1 1 0 000 1.42l9 9a1 1 0 001.42 0l9-9a1 1 0 000-1.42zM14 14.5V12h-4v3H8v-4a1 1 0 011-1h5V7.5l3.5 3.5z" />
    </svg>
  );
}
