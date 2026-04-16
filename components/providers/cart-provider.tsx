"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products } from "@/lib/products";

type CartItem = {
  productId: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  addItem: (productId: string) => void;
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
      setItems(JSON.parse(raw));
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
      addItem: (productId) => {
        setItems((current) => {
          const found = current.find((item) => item.productId === productId);
          if (found) {
            return current.map((item) =>
              item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
            );
          }
          return [...current, { productId, quantity: 1 }];
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

  const detailedItems = items
    .map((item) => {
      const product = products.find((candidate) => candidate.id === item.productId);
      if (!product) {
        return null;
      }
      return {
        ...item,
        product,
        total: product.price * item.quantity
      };
    })
    .filter(
      (
        item
      ): item is {
        productId: string;
        quantity: number;
        product: (typeof products)[number];
        total: number;
      } => Boolean(item)
    );

  return {
    items: detailedItems,
    ...rest
  };
}
