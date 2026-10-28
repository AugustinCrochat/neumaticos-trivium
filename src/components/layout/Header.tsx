"use client";

import { useEffect, useRef, useState } from "react";
import Link from "@/components/ui/Link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useBranch } from "@/contexts/branch-context";
import { SearchModal } from "@/components/ui/SearchModal";
import { isVisaMasterPromoDay } from "@/lib/promo-day";

const NAV_LINKS = [
  { href: "/ofertas", label: "% Ofertas", match: ["/ofertas"] },
  { href: "/catalogo", label: "Neumáticos", match: ["/catalogo", "/neumaticos", "/buscar", "/productos", "/marcas"] },
  { href: "/servicios", label: "Servicios", match: ["/servicios"] },
  { href: "/sucursales", label: "Sucursales", match: ["/sucursales"] },
  { href: "/contacto", label: "Contacto", match: ["/contacto"] },
];

// Enlaces del pie que no están en la barra principal, bajo "Más".
const MORE_LINKS = [
  { href: "/neumaticos-baratos", label: "Neumáticos baratos" },
  { href: "/neumaticos", label: "Neumáticos por medida" },
  { href: "/neumaticos/at", label: "Neumáticos A/T" },
  { href: "/neumaticos/carga", label: "Neumáticos de carga" },
  { href: "/blog", label: "Blog" },
];

const isActive = (pathname: string, match: string[]) =>
  match.some((m) => pathname === m || pathname.startsWith(`${m}/`));

export function Header() {
  const { selectedBranch, hasConfirmedBranch, openModal } = useBranch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  // Al bajar el header se achica (sin la franja roja, barra y logo más bajos).
  // Histéresis: se achica pasados 60px y vuelve a crecer recién cerca del tope,
  // porque el cambio de alto mueve el contenido y de otro modo parpadearía.
  const [compact, setCompact] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement | null>(null);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  // Franja roja: los miércoles y sábados alterna entre "colocación sin cargo"
  // y "hoy 3 cuotas sin interés". Arranca en false y se corrige al montar
  // (el sitio es estático: calcularlo en el build lo congelaría).
  const [promoHoy, setPromoHoy] = useState(false);
  const [slide, setSlide] = useState(0);
  const [rotacionAuto, setRotacionAuto] = useState(true);
  useEffect(() => {
    const update = () => setPromoHoy(isVisaMasterPromoDay());
    update();
  }, []);
  const haySlides = promoHoy && !selectedBranch.apertura;
  useEffect(() => {
    if (!haySlides || !rotacionAuto || compact) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setSlide((n) => (n + 1) % 2), 5000);
    return () => clearInterval(t);
  }, [haySlides, rotacionAuto, compact]);
  const cambiarSlide = () => {
    setRotacionAuto(false);
    setSlide((n) => (n + 1) % 2);
  };
  useEffect(() => {
    if (!moreOpen) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent) {
        if (e.key === "Escape") setMoreOpen(false);
      } else if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [moreOpen]);
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
        className={`relative overflow-hidden bg-[#ff1e00] text-white transition-all duration-200 ${
          compact ? "max-h-0 py-0" : "max-h-8 py-1"
        }`}
      >
        {haySlides && slide === 1 ? (
          <Link
            href="/ofertas"
            tabIndex={compact ? -1 : 0}
            className="flex items-center justify-center gap-2 px-9 text-center text-[11px] font-bold hover:bg-[#cc1800] md:text-xs"
          >
            <span>
              Hoy 3 cuotas sin interés<span className="hidden md:inline"> con Visa o Mastercard</span>
            </span>
            <span className="flex shrink-0 items-center gap-1 rounded bg-white px-1.5 py-px">
              <Image src="/images/payments/visa.svg" alt="Visa" width={32} height={20} className="h-3 w-auto" />
              <Image src="/images/payments/mastercard.svg" alt="Mastercard" width={32} height={20} className="h-4 w-auto" />
            </span>
          </Link>
        ) : (
          <Link
            href="/servicios"
            tabIndex={compact ? -1 : 0}
            className="block px-9 text-center text-[11px] font-bold hover:bg-[#cc1800] md:text-xs"
          >
            {selectedBranch.apertura
              ? `Neumáticos Trivium ${selectedBranch.shortName} abre ${selectedBranch.apertura}`
              : "Colocación y válvulas sin cargo en nuestros locales"}
          </Link>
        )}
        {haySlides && !compact && (
          <>
            <button
              type="button"
              onClick={cambiarSlide}
              aria-label="Mensaje anterior"
              className="absolute inset-y-0 left-0 flex w-8 items-center justify-center text-sm font-black text-white/80 hover:text-white"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={cambiarSlide}
              aria-label="Mensaje siguiente"
              className="absolute inset-y-0 right-0 flex w-8 items-center justify-center text-sm font-black text-white/80 hover:text-white"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Main nav */}
      <nav className="bg-black shadow-lg">
        <div className="max-w-7xl 2xl:max-w-[96rem] mx-auto px-4">
          <div className={`flex items-center gap-6 transition-[height] duration-200 md:gap-12 lg:gap-16 ${compact ? "h-[3.25rem] md:h-14" : "h-14 md:h-[4.5rem]"}`}>
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo-neumaticos-trivium.svg"
                alt="Neumáticos Trivium"
                width={175}
                height={60}
                className={`w-auto transition-[height] duration-200 ${compact ? "h-9 md:h-11" : "h-10 md:h-16"}`}
                priority
              />
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1.5 flex-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(pathname, link.match);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={
                      link.href === "/ofertas"
                        ? `px-4 py-2 rounded-lg text-sm font-black text-white transition-colors ${
                            active ? "bg-white !text-[#ff1e00]" : "bg-[#ff1e00] hover:bg-[#cc1800]"
                          }`
                        : // Seleccionado: fondo tenue, texto blanco en negrita y barra roja
                          // debajo; al pasar el mouse la barra crece desde la izquierda.
                          `relative rounded-lg px-5 py-2 text-sm transition-colors after:absolute after:inset-x-5 after:bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-[#ff1e00] after:transition-transform after:duration-200 ${
                            active
                              ? "bg-white/10 font-bold text-white after:scale-x-100"
                              : "font-medium text-zinc-300 hover:bg-white/5 hover:text-white after:scale-x-0 hover:after:scale-x-100"
                          }`
                    }
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div
                ref={moreRef}
                className="relative"
                onMouseEnter={() => setMoreOpen(true)}
                onMouseLeave={() => setMoreOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setMoreOpen((o) => !o)}
                  aria-haspopup="menu"
                  aria-expanded={moreOpen}
                  className={`flex items-center gap-1 rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
                    moreOpen || isActive(pathname, ["/blog", "/neumaticos-baratos"])
                      ? "bg-white/10 text-white"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  Más
                  <svg className={`h-3.5 w-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {moreOpen && (
                  <div role="menu" className="absolute left-0 top-full z-50 w-60 pt-2">
                    <div className="overflow-hidden rounded-xl border border-white/10 bg-black py-1.5 shadow-2xl">
                      {MORE_LINKS.map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          role="menuitem"
                          onClick={() => setMoreOpen(false)}
                          className="block px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto md:ml-0">
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
                      ? `block px-4 py-2.5 rounded-lg text-sm font-black text-white transition-colors ${
                          active ? "bg-white !text-[#ff1e00]" : "bg-[#ff1e00] hover:bg-[#cc1800]"
                        }`
                      : `block rounded-lg border-l-4 px-4 py-2.5 text-sm transition-colors ${
                          active
                            ? "border-[#ff1e00] bg-white/10 font-bold text-white"
                            : "border-transparent font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
                        }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => setMobileMoreOpen((o) => !o)}
              aria-expanded={mobileMoreOpen}
              className="flex w-full items-center justify-between rounded-lg border-l-4 border-transparent px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              Más
              <svg className={`h-4 w-4 transition-transform ${mobileMoreOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mobileMoreOpen &&
              MORE_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg border-l-4 border-transparent py-2.5 pl-8 pr-4 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
          </div>
        )}
      </nav>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </header>
  );
}
