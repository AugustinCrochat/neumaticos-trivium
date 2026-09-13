"use client";

import { useCart } from "@/contexts/cart-context";

export function CartButton() {
  const { count, openCart } = useCart();
  return (
    <button onClick={openCart} className="relative text-zinc-200 hover:text-white p-2" aria-label={`Carrito con ${count} productos`}>
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
      {count > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-orange-500 text-white text-[10px] font-black leading-4">{count}</span>}
    </button>
  );
}
