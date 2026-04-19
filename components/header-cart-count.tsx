"use client";

import { useCart } from "@/components/providers/cart-provider";

export function HeaderCartCount() {
  const { totalItems } = useCart();
  return (
    <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs text-white">
      {totalItems}
    </span>
  );
}
