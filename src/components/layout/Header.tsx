"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useBranch } from "@/contexts/branch-context";

const NAV_LINKS = [
  { href: "/catalogo", label: "Neumáticos" },
  { href: "/servicios", label: "Servicios" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const { selectedBranch, openModal } = useBranch();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Main nav */}
      <nav className="bg-navy-800 shadow-lg">
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
                  className="text-navy-100 hover:text-white hover:bg-navy-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Branch selector — always visible */}
            <button
              onClick={openModal}
              className="flex items-center gap-1.5 bg-navy-700 hover:bg-navy-600 border border-navy-600 hover:border-navy-500 text-white pl-3 pr-2.5 py-2 rounded-lg text-sm font-medium transition-all group ml-auto md:ml-0"
              title="Cambiar sucursal"
            >
              <svg
                className="w-4 h-4 text-orange-500 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="truncate max-w-[90px] sm:max-w-none">
                {selectedBranch.shortName}
              </span>
              <svg
                className="w-3.5 h-3.5 text-navy-400 group-hover:text-navy-200 transition-colors flex-shrink-0"
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
          <div className="md:hidden border-t border-navy-700 bg-navy-900 px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-navy-100 hover:text-white hover:bg-navy-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
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
