"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCartDetails } from "@/components/providers/cart-provider";
import { formatPrice } from "@/lib/utils";

export function CartPageClient() {
  const { items, changeQuantity, removeItem, clearCart } = useCartDetails();
  const [ordered, setOrdered] = useState(false);
  const total = items.reduce((sum, item) => sum + item.total, 0);

  if (!items.length) {
    return (
      <div className="rounded-[28px] border border-line bg-panel/60 p-8 text-center">
        <h2 className="text-2xl font-semibold text-text">Корзина пока пустая</h2>
        <p className="mt-3 text-textMuted">
          Добавьте понравившиеся товары из каталога, чтобы перейти к оформлению заказа.
        </p>
        <Link href="/catalog" className="mt-6 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-400">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-4">
        {items.map((item) => (
          <article key={item.product.id} className="grid gap-4 rounded-[28px] border border-line bg-panel/65 p-5 md:grid-cols-[180px_1fr]">
            <Image src={item.product.image} alt={item.product.name} width={400} height={300} className="h-40 w-full rounded-3xl object-cover" />
            <div className="flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-text">{item.product.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-textMuted">{item.product.shortDescription}</p>
                </div>
                <p className="text-lg font-semibold text-text">{formatPrice(item.total)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center overflow-hidden rounded-full border border-line">
                  <button type="button" onClick={() => changeQuantity(item.product.id, item.quantity - 1)} className="px-4 py-2 text-text">-</button>
                  <span className="border-x border-line px-4 py-2 text-sm text-text">{item.quantity}</span>
                  <button type="button" onClick={() => changeQuantity(item.product.id, item.quantity + 1)} className="px-4 py-2 text-text">+</button>
                </div>
                <button type="button" onClick={() => removeItem(item.product.id)} className="rounded-full border border-line px-4 py-2 text-sm text-text transition hover:border-rose-400/30 hover:text-rose-200">
                  Удалить
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="rounded-[30px] border border-line bg-panel/75 p-6">
        <p className="text-sm uppercase tracking-[0.35em] text-accentSoft">Оформление</p>
        <h2 className="mt-4 text-3xl font-semibold text-text">Ваш заказ</h2>
        <div className="mt-6 space-y-4 border-t border-line pt-6">
          <div className="flex items-center justify-between text-sm text-textMuted">
            <span>Позиций</span>
            <span>{items.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-textMuted">
            <span>Итог</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
        <button type="button" onClick={() => { setOrdered(true); clearCart(); }} className="mt-8 w-full rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-400">
          Подтвердить заказ
        </button>
        {ordered ? (
          <p className="mt-4 text-sm leading-6 text-emerald-300">
            Заказ принят. Менеджер свяжется с вами для уточнения деталей доставки и оплаты.
          </p>
        ) : null}
      </aside>
    </div>
  );
}
