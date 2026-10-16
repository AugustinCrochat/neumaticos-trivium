"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Accessory, TireProduct } from "@/lib/types";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE } from "@/lib/config";

export type TireCartItem = Pick<TireProduct, "id" | "brand" | "model" | "price" | "imageUrl" | "slug"> & {
  kind: "tire";
  /** Opcional: los ítems que vienen del cotizador (búsqueda liviana) no traen la medida. */
  size?: TireProduct["size"];
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

export type DeliveryMethod = "pickup" | "shipping";

export type ShippingAddress = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
};

// Las claves componen kind+id porque un id de servicio del POS podría coincidir
// con un id de neumático (son catálogos distintos).
function itemKey(item: Pick<CartItem, "kind" | "id">) {
  return `${item.kind}:${item.id}`;
}

type CartContextType = {
  items: CartItem[];
  count: number;
  itemsTotal: number;
  shippingCost: number;
  total: number;
  isOpen: boolean;
  deliveryMethod: DeliveryMethod;
  shippingAddress: ShippingAddress | null;
  addTire: (product: TireProduct, quantity: number) => void;
  /** Para el cotizador, que arma el ítem desde la búsqueda y no tiene el TireProduct entero. */
  addTireLine: (line: Pick<TireProduct, "id" | "brand" | "model" | "price" | "imageUrl" | "slug">, quantity: number) => void;
  addService: (service: { id: string; nombre: string; price: number }, quantity: number) => void;
  addAccessory: (accessory: Accessory, quantity: number) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  setShippingAddress: (address: ShippingAddress) => void;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "trivium-cart";
const DELIVERY_STORAGE_KEY = "trivium-delivery";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasLoadedCart, setHasLoadedCart] = useState(false);
  const [deliveryMethod, setDeliveryMethodState] = useState<DeliveryMethod>("pickup");
  const [shippingAddress, setShippingAddressState] = useState<ShippingAddress | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // El carrito vive sólo en el navegador; se hidrata después del primer render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setItems(JSON.parse(stored) as CartItem[]);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    try {
      const storedDelivery = localStorage.getItem(DELIVERY_STORAGE_KEY);
      if (storedDelivery) {
        const parsed = JSON.parse(storedDelivery) as { deliveryMethod?: DeliveryMethod; shippingAddress?: ShippingAddress };
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (parsed.deliveryMethod) setDeliveryMethodState(parsed.deliveryMethod);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (parsed.shippingAddress) setShippingAddressState(parsed.shippingAddress);
      }
    } catch {
      localStorage.removeItem(DELIVERY_STORAGE_KEY);
    }
    setHasLoadedCart(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedCart) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hasLoadedCart, items]);

  useEffect(() => {
    if (!hasLoadedCart) return;
    localStorage.setItem(DELIVERY_STORAGE_KEY, JSON.stringify({ deliveryMethod, shippingAddress }));
  }, [hasLoadedCart, deliveryMethod, shippingAddress]);

  const value = useMemo<CartContextType>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost =
      deliveryMethod === "shipping" && itemsTotal < FREE_SHIPPING_THRESHOLD ? SHIPPING_FLAT_RATE : 0;
    const total = itemsTotal + shippingCost;

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
      itemsTotal,
      shippingCost,
      total,
      isOpen,
      deliveryMethod,
      shippingAddress,
      addTire: (product, quantity) => {
        const { id, brand, model, size, price, imageUrl, slug } = product;
        upsert({ kind: "tire", id, brand, model, size, price, imageUrl, slug, quantity: Math.min(quantity, 8) });
      },
      addTireLine: (line, quantity) => {
        const { id, brand, model, price, imageUrl, slug } = line;
        upsert({ kind: "tire", id, brand, model, price, imageUrl, slug, quantity: Math.min(quantity, 8) });
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
      setDeliveryMethod: (method) => setDeliveryMethodState(method),
      setShippingAddress: (address) => setShippingAddressState(address),
    };
  }, [isOpen, items, deliveryMethod, shippingAddress]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
}

export { itemKey };
