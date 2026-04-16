"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Stars } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/providers/cart-provider";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <article className="group overflow-hidden rounded-[28px] border border-line bg-panel/70 transition hover:-translate-y-1 hover:border-blue-400/25 hover:shadow-glow">
      <div className="relative border-b border-line bg-gradient-to-br from-white/5 to-blue-500/5 p-5">
        <div
          className="absolute inset-x-5 top-5 h-20 rounded-full blur-3xl"
          style={{ backgroundColor: `${product.accent}33` }}
        />
        <Image
          src={product.image}
          alt={product.name}
          width={700}
          height={500}
          className="relative h-56 w-full rounded-[22px] object-cover"
        />
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full border border-blue-400/20 px-3 py-1 text-xs uppercase tracking-[0.25em] text-accentSoft">
            {product.category}
          </span>
          <span className="flex items-center gap-1 text-sm text-textMuted">
            <Stars size={16} className="text-yellow-300" />
            {product.rating}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-text">{product.name}</h3>
          <p className="mt-2 text-sm leading-6 text-textMuted">{product.shortDescription}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-100"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg font-semibold text-text">{formatPrice(product.price)}</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href={`/catalog/${product.slug}`}
              className="rounded-full border border-line px-4 py-2 text-center text-sm text-text transition hover:border-blue-400/25 hover:bg-blue-500/10"
            >
              3D обзор
            </Link>
            <button
              type="button"
              onClick={() => addItem(product.id)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400"
            >
              <ShoppingCart size={16} />
              В корзину
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
