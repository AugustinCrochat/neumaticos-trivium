"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useBranch } from "@/contexts/branch-context";

const NAV_LINKS = [
  { href: "/catalogo", label: "Neumáticos" },
  { href: "/servicios", label: "Servicios" },
  { href: "/sucursales", label: "Sucursales" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const { selectedBranch, hasConfirmedBranch, openModal } = useBranch();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full">
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

            {/* Branch selector — always visible */}
            <button
              onClick={openModal}
              className="flex items-center gap-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white pl-3 pr-2.5 py-2 rounded-lg text-sm font-medium transition-all group ml-auto md:ml-0"
              title="Cambiar sucursal"
            >
              <svg
                className="w-4 h-4 text-[#e30613] flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
              </svg>
              <span className="truncate max-w-[90px] sm:max-w-none">
                {hasConfirmedBranch ? selectedBranch.shortName : "Sucursal"}
              </span>
              <svg
                className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-200 transition-colors flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
    </header>
  );
}
