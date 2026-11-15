import Link from "@/components/ui/Link";
import { PrecioTag } from "@/components/ui/PrecioTag";
import { WhatsAppSucursal } from "@/components/ui/SucursalBits";
import { preciosAncla } from "@/components/home/HeroTrustRow";
import { getProductosDesdePOS, getServiciosPrecios } from "@/lib/pos-api";
import { money, notaDeCamioneta } from "@/lib/precios-hoy";
import { COMBO_ID, preciosTaller } from "@/lib/servicios-seo";
import { formatSize, sizeSlug } from "@/lib/tire-sizes";

/**
 * Columna lateral de la nota en escritorio: usa el ancho que antes quedaba
 * vacío a los costados del texto y acompaña toda la lectura (queda fija al
 * bajar). Muestra precios de hoy con clic directo a cada página; en las notas
 * de taller el combo de alineado y balanceado va primero.
 */
export async function BlogSidebar({ title, deTaller, slug }: { title: string; deTaller: boolean; slug: string }) {
  const [productos, servicios] = await Promise.all([getProductosDesdePOS(), getServiciosPrecios()]);
  const taller = preciosTaller(servicios);
  const combo = taller.comboAuto;
  const filas = [
    ...preciosAncla(productos, 5).map((a) => ({ href: `/neumaticos/${sizeSlug(a.size)}`, label: formatSize(a.size), precio: a.precio })),
  ];
  const fa = combo ? [{ href: `/servicios/${COMBO_ID}`, label: "Alineado + balanceado · auto", precio: combo }] : [];
  const fc = taller.comboCamioneta ? [{ href: `/servicios/${COMBO_ID}`, label: "Alineado + balanceado · camioneta", precio: taller.comboCamioneta }] : [];
  const filaCombo = notaDeCamioneta(slug) ? [...fc, ...fa] : [...fa, ...fc];
  const todas = deTaller ? [...filaCombo, ...filas] : [...filas, ...filaCombo];
  if (todas.length === 0) return null;

  return (
    <div className="rounded-lg bg-black p-5 text-white ">
      <p className="font-display text-3xl font-extrabold uppercase italic leading-none">Precios de hoy</p>
      <p className="mt-1 text-sm text-slate-400">Con colocación y válvulas sin cargo.</p>
      <ul className="mt-4 divide-y divide-white/10">
        {todas.map((f) => (
          <li key={f.href}>
            <Link href={f.href} className="group flex items-center justify-between gap-3 py-2.5 !text-white !no-underline">
              <span className="text-sm font-black group-hover:underline">{f.label}</span>
              <PrecioTag size="sm">{money(f.precio)}</PrecioTag>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={deTaller ? `/servicios/${COMBO_ID}` : "/neumaticos"}
        className="mt-4 flex min-h-12 items-center justify-center rounded-md bg-orange-500 px-4 text-sm font-black !text-white !no-underline transition-colors hover:bg-orange-600"
      >
        {deTaller ? "Ver qué incluye el combo" : "Buscar mi medida"}
      </Link>
      <WhatsAppSucursal
        texto={`Hola! Leí la nota "${title}" y quiero consultar.`}
        className="mt-2.5 flex min-h-12 items-center justify-center rounded-md bg-[#25D366] px-4 text-sm font-black !text-white !no-underline hover:brightness-95"
      >
        Consultar por WhatsApp
      </WhatsAppSucursal>
    </div>
  );
}
