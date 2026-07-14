"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { TireProduct } from "@/lib/types";

export type CartItem = Pick<TireProduct, "id" | "brand" | "model" | "size" | "price" | "imageUrl" | "slug"> & {
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  addItem: (product: TireProduct) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "trivium-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasLoadedCart, setHasLoadedCart] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // El carrito vive sólo en el navegador; se hidrata después del primer render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setItems(JSON.parse(stored) as CartItem[]);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setHasLoadedCart(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedCart) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hasLoadedCart, items]);

  const value = useMemo<CartContextType>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items,
      count,
      total,
      isOpen,
      addItem: (product) => {
        setItems((current) => {
          const existing = current.find((item) => item.id === product.id);
          if (existing) {
            return current.map((item) =>
              item.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, 8) } : item
            );
          }
          const { id, brand, model, size, price, imageUrl, slug } = product;
          return [...current, { id, brand, model, size, price, imageUrl, slug, quantity: 1 }];
        });
        setIsOpen(true);
      },
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          setItems((current) => current.filter((item) => item.id !== productId));
          return;
        }
        setItems((current) =>
          current.map((item) => item.id === productId ? { ...item, quantity: Math.min(quantity, 8) } : item)
        );
      },
      removeItem: (productId) => setItems((current) => current.filter((item) => item.id !== productId)),
      clearCart: () => setItems([]),
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    };
  }, [isOpen, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
}
