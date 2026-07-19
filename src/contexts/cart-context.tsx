"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Accessory, TireProduct } from "@/lib/types";

export type TireCartItem = Pick<TireProduct, "id" | "brand" | "model" | "size" | "price" | "imageUrl" | "slug"> & {
  kind: "tire";
  quantity: number;
};

export type ServiceCartItem = {
  kind: "service";
  id: string;
  nombre: string;
  price: number;
  quantity: number;
};

export type AccessoryCartItem = Pick<Accessory, "id" | "nombre" | "price" | "imageUrl"> & {
  kind: "accessory";
  quantity: number;
};

export type CartItem = TireCartItem | ServiceCartItem | AccessoryCartItem;

// Las claves componen kind+id porque un id de servicio del POS podría coincidir
// con un id de neumático (son catálogos distintos).
function itemKey(item: Pick<CartItem, "kind" | "id">) {
  return `${item.kind}:${item.id}`;
}

type CartContextType = {
  items: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  addTire: (product: TireProduct, quantity: number) => void;
  addService: (service: { id: string; nombre: string; price: number }, quantity: number) => void;
  addAccessory: (accessory: Accessory, quantity: number) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
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

    function upsert(newItem: CartItem) {
      setItems((current) => {
        const key = itemKey(newItem);
        const existing = current.find((item) => itemKey(item) === key);
        if (existing) {
          return current.map((item) =>
            itemKey(item) === key ? { ...item, quantity: Math.min(item.quantity + newItem.quantity, 8) } as CartItem : item
          );
        }
        return [...current, newItem];
      });
      setIsOpen(true);
    }

    return {
      items,
      count,
      total,
      isOpen,
      addTire: (product, quantity) => {
        const { id, brand, model, size, price, imageUrl, slug } = product;
        upsert({ kind: "tire", id, brand, model, size, price, imageUrl, slug, quantity: Math.min(quantity, 8) });
      },
      addService: (service, quantity) => {
        upsert({ kind: "service", id: service.id, nombre: service.nombre, price: service.price, quantity: Math.min(quantity, 8) });
      },
      addAccessory: (accessory, quantity) => {
        const { id, nombre, price, imageUrl } = accessory;
        upsert({ kind: "accessory", id, nombre, price, imageUrl, quantity: Math.min(quantity, 8) });
      },
      updateQuantity: (key, quantity) => {
        if (quantity < 1) {
          setItems((current) => current.filter((item) => itemKey(item) !== key));
          return;
        }
        setItems((current) =>
          current.map((item) => itemKey(item) === key ? { ...item, quantity: Math.min(quantity, 8) } as CartItem : item)
        );
      },
      removeItem: (key) => setItems((current) => current.filter((item) => itemKey(item) !== key)),
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

export { itemKey };
