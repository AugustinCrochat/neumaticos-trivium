"use client";

import { useCart } from "@/contexts/cart-context";

export function CartButton() {
  const { count, openCart } = useCart();
  return (
    <button onClick={openCart} className="relative text-zinc-200 hover:text-white p-2" aria-label={`Carrito con ${count} productos`}>
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17M17 17a2 2 0 100 4 2 2 0 000-4ZM9 19a2 2 0 100 4 2 2 0 000-4Z" /></svg>
      {count > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-orange-500 text-white text-[10px] font-black leading-4">{count}</span>}
    </button>
  );
}
