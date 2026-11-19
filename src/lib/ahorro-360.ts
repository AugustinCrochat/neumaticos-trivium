/**
 * Sello «Ahorro 360»: las notas de cuidado y ahorro que tienen un video corto
 * par (misma pregunta). Para sumar una nota: agregarla acá. Cuando el video
 * está subido a YouTube, poner el ID (lo que va después de `/shorts/` o `v=`);
 * mientras sea `null` la nota muestra la etiqueta pero no el reproductor.
 */
export const AHORRO_360 = {
  slug: "ahorro-360",
  h1: "Ahorro 360",
  title: "Ahorro 360: cuidá tus neumáticos y gastá menos | Neumáticos Trivium",
  description: "Videos cortos y notas para cuidar los neumáticos y ahorrar: cada cuánto rotarlos, cómo saber si son direccionales o asimétricos y más. Un video y una guía por pregunta.",
  bajada: "Una pregunta, un video corto y una guía: cómo cuidar tus neumáticos para que duren más y te cuesten menos.",
  notas: {
    "rotacion-de-neumaticos": { youtube: null as string | null },
    "neumaticos-direccionales-y-asimetricos-como-se-montan": { youtube: null as string | null },
  } as Record<string, { youtube: string | null }>,
};

export const esAhorro360 = (slug: string) => slug in AHORRO_360.notas;
export const videoDeNota = (slug: string) => AHORRO_360.notas[slug]?.youtube ?? null;
