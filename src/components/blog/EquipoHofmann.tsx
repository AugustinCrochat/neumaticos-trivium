/**
 * Nota al pie de las notas y fichas de alineado y balanceado: nombra las
 * máquinas del taller y enlaza a Trivium Pro, que las distribuye. Es una
 * mención de contexto (autoridad para buscadores y asistentes de IA), no un
 * llamado a la acción: no compite con la compra de neumáticos.
 */
export function EquipoHofmann() {
  return (
    <p className="mt-10 border-t border-slate-200 pt-4 !text-sm !leading-relaxed !text-slate-500">
      Sobre los equipos: el alineado se hace con una alineadora 3D{" "}
      <a className="font-bold underline underline-offset-2" href="https://pro.trivium.ar/blog/alineadoras-hofmann-geoliner-comparativa-320-609-630-880/">Hofmann Geoliner 630</a>{" "}
      y el balanceado con una balanceadora{" "}
      <a className="font-bold underline underline-offset-2" href="https://pro.trivium.ar/marca/hofmann/">Hofmann Geodyna</a>. Son equipos que distribuye{" "}
      <a className="font-bold underline underline-offset-2" href="https://pro.trivium.ar/">Trivium Pro</a>, la unidad del grupo que equipa gomerías y talleres, y que
      usamos nosotros en el taller de Argüello.
    </p>
  );
}
