"use client";

import { useEffect, useState } from "react";
import Link from "@/components/ui/Link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useBranch } from "@/contexts/branch-context";
import { SearchModal } from "@/components/ui/SearchModal";
import { isVisaMasterPromoDay } from "@/lib/promo-day";
import { PriceTagIcon } from "@/components/ui/PriceTagIcon";
import { restoDelDia } from "@/lib/fin-del-dia";

const NAV_LINKS = [
  { href: "/ofertas", label: "Ofertas", match: ["/ofertas"] },
  { href: "/catalogo", label: "Neumáticos", match: ["/catalogo", "/neumaticos", "/buscar", "/productos", "/marcas"] },
  { href: "/servicios", label: "Servicios", match: ["/servicios"] },
  { href: "/sucursales", label: "Sucursales", match: ["/sucursales"] },
];

const isActive = (pathname: string, match: string[]) =>
  match.some((m) => pathname === m || pathname.startsWith(`${m}/`));

/** Cuenta regresiva hasta el fin del día para el botón Ofertas (arranca vacía: el sitio es estático). */
function OfertasReloj({ activo = false }: { activo?: boolean }) {
  const [resto, setResto] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setResto(restoDelDia());
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  const dos = (n: number) => String(n).padStart(2, "0");
  const txt =
    resto == null
      ? "--:--:--"
      : `${dos(Math.floor(resto / 3600_000))}:${dos(Math.floor((resto % 3600_000) / 60_000))}:${dos(Math.floor((resto % 60_000) / 1000))}`;
  return (
    <span
      aria-label="Tiempo que queda de las ofertas de hoy"
      className={`rounded px-1.5 py-[3px] font-display text-[13px] font-bold leading-none tracking-wider tabular-nums text-white ${activo ? "bg-[#ff1e00]" : "bg-black"}`}
    >
      {txt}
    </span>
  );
}

export function Header() {
  const { selectedBranch, hasConfirmedBranch, openModal } = useBranch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  // Al bajar el header se achica (sin la franja roja, barra y logo más bajos).
  // Histéresis: se achica pasados 60px y vuelve a crecer recién cerca del tope,
  // porque el cambio de alto mueve el contenido y de otro modo parpadearía.
  const [compact, setCompact] = useState(false);
  // Franja roja: alterna sola, en celular y en escritorio, entre "colocación
  // sin cargo" y las cuotas con Visa o Mastercard. Los miércoles y sábados el
  // mensaje de cuotas dice "Hoy 3 cuotas sin interés"; los demás días sólo
  // "Pagá en cuotas" (sin mencionar el sin interés, que no rige). El cambio es
  // instantáneo (sin animación), por eso no se frena con la preferencia de
  // reducir movimiento. `promoHoy` arranca en false y se corrige al montar (el
  // sitio es estático: calcularlo en el build lo congelaría).
  const [promoHoy, setPromoHoy] = useState(false);
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const update = () => setPromoHoy(isVisaMasterPromoDay());
    update();
  }, []);
  const haySlides = true;
  useEffect(() => {
    if (!haySlides || compact) return;
    const t = setInterval(() => setSlide((n) => (n + 1) % 2), 5000);
    return () => clearInterval(t);
  }, [haySlides, compact]);
  const slideActivo = haySlides ? slide : 0;
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setCompact((c) => (c ? y > 12 : y > 80));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Franja de colocación sin cargo: lo primero que se ve al entrar,
          antes que el selector de sucursal, porque es un diferencial frente
          a comprar en otro lado sin taller propio. */}
      <div
        aria-hidden={compact}
        className={`relative overflow-hidden transition-all duration-200 ${compact ? "h-0" : "h-7"} ${
          slideActivo === 1 ? "bg-white text-navy-900" : "bg-[#ff1e00] text-white"
        }`}
      >
        {slideActivo === 1 ? (
          <Link
            href="/ofertas"
            tabIndex={compact ? -1 : 0}
            className="flex h-7 items-center justify-center gap-2 px-4 text-center text-[11px] font-bold hover:bg-slate-100 md:text-xs"
          >
            <span>
              {promoHoy ? "Hoy 3 cuotas sin interés" : "Pagá en cuotas"}
              <span className="hidden md:inline"> con Visa o Mastercard</span>
            </span>
            {/* Mismas proporciones que en Medios de pago de la ficha: Visa a la mitad de alto que Mastercard. */}
            <span className="flex shrink-0 items-center gap-1.5">
              <Image src="/images/payments/visa.svg" alt="Visa" width={32} height={20} className="h-2.5 w-auto" />
              <Image src="/images/payments/mastercard.svg" alt="Mastercard" width={32} height={20} className="h-5 w-auto" />
            </span>
          </Link>
        ) : (
          <Link
            href="/servicios"
            tabIndex={compact ? -1 : 0}
            className="flex h-7 items-center justify-center px-4 text-center text-[11px] font-bold hover:bg-[#cc1800] md:text-xs"
          >
            {selectedBranch.apertura
              ? `Neumáticos Trivium ${selectedBranch.shortName} abre ${selectedBranch.apertura}`
              : "Colocación y válvulas sin cargo en nuestros locales"}
          </Link>
        )}
      </div>

      {/* Main nav */}
      <nav className="bg-black shadow-lg">
        <div className="max-w-7xl 2xl:max-w-[96rem] mx-auto px-4">
          <div className={`flex items-center gap-6 transition-[height] duration-200 md:gap-4 lg:gap-12 xl:gap-16 ${compact ? "h-[3.25rem] md:h-14" : "h-14 md:h-[4.5rem]"}`}>
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo-neumaticos-trivium.svg"
                alt="Neumáticos Trivium"
                width={175}
                height={60}
                className={`w-auto transition-[height] duration-200 ${compact ? "h-9 md:h-9 lg:h-11" : "h-10 md:h-12 lg:h-16"}`}
                priority
              />
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex min-w-0 flex-1 items-center gap-1 lg:gap-1.5">
              {NAV_LINKS.map((link) => {
                const active = isActive(pathname, link.match);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={
                      link.href === "/ofertas"
                        ? `flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-black lg:px-3.5 uppercase tracking-wide text-white shadow-md transition-transform hover:scale-[1.04] ${
                            active ? "bg-white !text-[#ff1e00]" : "bg-gradient-to-r from-[#ff1e00] to-[#ff5a2e]"
                          }`
                        : // Seleccionado: fondo tenue, texto blanco en negrita y barra roja
                          // debajo; al pasar el mouse la barra crece desde la izquierda.
                          `relative rounded-lg px-3 py-2 text-sm transition-colors after:absolute after:inset-x-3 lg:px-5 lg:after:inset-x-5 after:bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-[#ff1e00] after:transition-transform after:duration-200 ${
                            active
                              ? "bg-white/10 font-bold text-white after:scale-x-100"
                              : "font-medium text-zinc-300 hover:bg-white/5 hover:text-white after:scale-x-0 hover:after:scale-x-100"
                          }`
                    }
                  >
                    {link.href === "/ofertas" ? (
                      <>
                        <PriceTagIcon className="h-9 w-auto drop-shadow" />
                        <span className="flex flex-col gap-1">
                          <span className="leading-none">{link.label}</span>
                          <OfertasReloj activo={active} />
                        </span>
                      </>
                    ) : (
                      link.label
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="flex shrink-0 items-center gap-2 lg:gap-3 ml-auto md:ml-0">
              <button
                onClick={openModal}
                className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-navy-900 pl-2.5 pr-2 py-1 rounded-full text-xs font-bold transition-colors group shadow-sm"
                title="Cambiar sucursal"
              >
                <svg className="w-3.5 h-3.5 text-[#ff1e00] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
                </svg>
                <span className="truncate min-w-0 max-w-[90px]">
                  {hasConfirmedBranch ? selectedBranch.shortName : "Sucursal"}
                </span>
                <svg className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <button
                onClick={() => setSearchOpen(true)}
                className="text-zinc-200 hover:text-white p-1.5"
                aria-label="Buscar productos"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
              </button>

              {/* Mobile hamburger */}
              <button
                className="md:hidden text-white p-1.5 flex-shrink-0"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menú"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-zinc-900 bg-black px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.match);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    link.href === "/ofertas"
                      ? `flex items-center gap-2.5 rounded-lg px-4 py-2 text-sm font-black uppercase tracking-wide text-white ${
                          active ? "bg-white !text-[#ff1e00]" : "bg-gradient-to-r from-[#ff1e00] to-[#ff5a2e]"
                        }`
                      : `block rounded-lg border-l-4 px-4 py-2.5 text-sm transition-colors ${
                          active
                            ? "border-[#ff1e00] bg-white/10 font-bold text-white"
                            : "border-transparent font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
                        }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {link.href === "/ofertas" ? (
                    <>
                      <PriceTagIcon className="h-9 w-auto drop-shadow" />
                      <span className="flex flex-col gap-0.5">
                        <span className="leading-none">{link.label}</span>
                        <OfertasReloj activo={active} />
                      </span>
                    </>
                  ) : (
                    link.label
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </header>
  );
}
