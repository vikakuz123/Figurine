"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { StoreProduct } from "@/lib/products";

type CartItem = {
  productId: string;
  quantity: number;
  product: StoreProduct;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  addItem: (product: StoreProduct) => void;
  removeItem: (productId: string) => void;
  changeQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "figurine-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setItems(JSON.parse(raw));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loaded]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      addItem: (product) => {
        setItems((current) => {
          const found = current.find((item) => item.productId === product.id);
          if (found) {
            return current.map((item) =>
              item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
          }
          return [...current, { productId: product.id, quantity: 1, product }];
        });
      },
      removeItem: (productId) => {
        setItems((current) => current.filter((item) => item.productId !== productId));
      },
      changeQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          setItems((current) => current.filter((item) => item.productId !== productId));
          return;
        }

        setItems((current) =>
          current.map((item) => (item.productId === productId ? { ...item, quantity } : item))
        );
      },
      clearCart: () => setItems([])
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}

export function useCartDetails() {
  const { items, ...rest } = useCart();

  return {
    items: items.map((item) => ({
      ...item,
      total: item.product.price * item.quantity
    })),
    ...rest
  };
}
