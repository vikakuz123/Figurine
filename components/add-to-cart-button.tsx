"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import type { StoreProduct } from "@/lib/products";

export function AddToCartButton({ product }: { product: StoreProduct }) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-400"
    >
      <ShoppingCart size={16} />
      Добавить в корзину
    </button>
  );
}
