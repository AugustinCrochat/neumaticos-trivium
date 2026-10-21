"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useBranch } from "@/contexts/branch-context";
import { SearchModal } from "@/components/ui/SearchModal";

const NAV_LINKS = [
  { href: "/ofertas", label: "% Ofertas", match: ["/ofertas"] },
  { href: "/catalogo", label: "Neumáticos", match: ["/catalogo", "/neumaticos", "/buscar", "/productos", "/marcas", "/tuercas-antirrobo"] },
  { href: "/servicios", label: "Servicios", match: ["/servicios"] },
  { href: "/sucursales", label: "Sucursales", match: ["/sucursales"] },
  { href: "/contacto", label: "Contacto", match: ["/contacto"] },
];

const isActive = (pathname: string, match: string[]) =>
  match.some((m) => pathname === m || pathname.startsWith(`${m}/`));

export function Header() {
  const { selectedBranch, hasConfirmedBranch, openModal } = useBranch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Franja de colocación sin cargo: lo primero que se ve al entrar,
          antes que el selector de sucursal, porque es un diferencial frente
          a comprar en otro lado sin taller propio. */}
      <Link
        href="/servicios"
        className="block bg-[#ff1e00] px-4 py-1 text-center text-[11px] font-bold text-white transition-colors hover:bg-[#cc1800] md:text-xs"
      >
        {selectedBranch.apertura
          ? `Neumáticos Trivium ${selectedBranch.shortName} abre ${selectedBranch.apertura}`
          : "Colocación y válvulas sin cargo en nuestros locales"}
      </Link>

      {/* Main nav */}
      <nav className="bg-black shadow-lg">
        <div className="max-w-7xl 2xl:max-w-[96rem] mx-auto px-4">
          <div className="flex items-center h-14 gap-6 md:h-[4.5rem] md:gap-12 lg:gap-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo-neumaticos-trivium.svg"
                alt="Neumáticos Trivium"
                width={175}
                height={60}
                className="h-9 md:h-16 w-auto"
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
          </div>
        )}
      </nav>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </header>
  );
}
