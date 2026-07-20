"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useBranch } from "@/contexts/branch-context";
import { useVehicle } from "@/contexts/vehicle-context";
import { CartButton } from "@/components/ui/CartButton";
import { SearchModal } from "@/components/ui/SearchModal";

const NAV_LINKS = [
  { href: "/catalogo", label: "Neumáticos" },
  { href: "/tuercas-antirrobo", label: "Tuercas antirrobo" },
  { href: "/servicios", label: "Servicios" },
  { href: "/sucursales", label: "Sucursales" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const { selectedBranch, hasConfirmedBranch, openModal } = useBranch();
  const { selectedVehicle, openModal: openVehicleModal } = useVehicle();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Utility bar — vehículo + sucursal, en su propia franja para que
          siempre entren cómodos sin pelear espacio con el logo/menú/carrito.
          Negra como la nav principal (con un divisor sutil), con los botones
          como chips claros que se despegan del fondo. */}
      <div className="bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 h-11">
            <button
              onClick={openVehicleModal}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-navy-900 pl-2.5 pr-2 py-1.5 rounded-full text-xs font-bold transition-colors group shadow-sm"
              title="Elegir mi vehículo"
            >
              <svg className="w-3.5 h-3.5 text-[#e30613] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
                <circle cx="6.5" cy="16.5" r="2.5" />
                <circle cx="16.5" cy="16.5" r="2.5" />
              </svg>
              <span className="truncate min-w-0 max-w-[100px]">
                {selectedVehicle ? `${selectedVehicle.marca} ${selectedVehicle.modelo}` : "Mi auto"}
              </span>
              <svg className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <span className="w-px h-4 bg-zinc-700 shrink-0" aria-hidden="true" />

            <button
              onClick={openModal}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-navy-900 pl-2.5 pr-2 py-1.5 rounded-full text-xs font-bold transition-colors group shadow-sm"
              title="Cambiar sucursal"
            >
              <svg className="w-3.5 h-3.5 text-[#e30613] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
              </svg>
              <span className="truncate min-w-0 max-w-[90px]">
                {hasConfirmedBranch ? selectedBranch.shortName : "Sucursal"}
              </span>
              <svg className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="bg-black shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16 gap-6">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo-neumaticos-trivium.svg"
                alt="Neumáticos Trivium"
                width={240}
                height={60}
                className="h-9 md:h-14 w-auto"
                priority
              />
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1 flex-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-zinc-200 hover:text-white hover:bg-zinc-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3 ml-auto md:ml-0">
              <button
                onClick={() => setSearchOpen(true)}
                className="text-zinc-200 hover:text-white p-2"
                aria-label="Buscar productos"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
              </button>

              <CartButton />

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
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-zinc-200 hover:text-white hover:bg-zinc-900 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </header>
  );
}
