"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCartDetails } from "@/components/providers/cart-provider";
import type { SessionUser } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";

export function CartPageClient({ user }: { user: SessionUser | null }) {
  const { items, changeQuantity, removeItem, clearCart } = useCartDetails();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const total = items.reduce((sum, item) => sum + item.total, 0);

  async function handleCheckout(formData: FormData) {
    if (!items.length) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        customerName: String(formData.get("customerName") || ""),
        customerEmail: String(formData.get("customerEmail") || ""),
        phone: String(formData.get("phone") || ""),
        city: String(formData.get("city") || ""),
        address: String(formData.get("address") || ""),
        items: items.map((item) => ({
          productId: item.product.id,
          productSlug: item.product.slug,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.price
        }))
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "Не удалось оформить заказ");
        setLoading(false);
        return;
      }

      clearCart();
      setSuccess("Заказ успешно оформлен. Теперь файлы доступны в истории покупок.");
      setLoading(false);
    } catch {
      setError("Не удалось отправить заказ. Попробуйте еще раз.");
      setLoading(false);
    }
  }

  if (!items.length) {
    return (
      <div className="rounded-[28px] border border-line bg-panel/60 p-8 text-center">
        <h2 className="text-2xl font-semibold text-text">Корзина пока пустая</h2>
        <p className="mt-3 text-textMuted">
          Добавьте понравившиеся товары из каталога, чтобы перейти к оформлению заказа.
        </p>
        <Link
          href="/catalog"
          className="mt-6 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-400"
        >
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-4">
        {items.map((item) => (
          <article
            key={item.product.id}
            className="grid gap-4 rounded-[28px] border border-line bg-panel/65 p-5 md:grid-cols-[180px_1fr]"
          >
            <Image
              src={item.product.image}
              alt={item.product.name}
              width={400}
              height={300}
              className="h-40 w-full rounded-3xl object-cover"
            />
            <div className="flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-text">{item.product.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-textMuted">
                    {item.product.shortDescription}
                  </p>
                </div>
                <p className="text-lg font-semibold text-text">{formatPrice(item.total)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center overflow-hidden rounded-full border border-line">
                  <button
                    type="button"
                    onClick={() => changeQuantity(item.product.id, item.quantity - 1)}
                    className="px-4 py-2 text-text"
                  >
                    -
                  </button>
                  <span className="border-x border-line px-4 py-2 text-sm text-text">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => changeQuantity(item.product.id, item.quantity + 1)}
                    className="px-4 py-2 text-text"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.product.id)}
                  className="rounded-full border border-line px-4 py-2 text-sm text-text transition hover:border-rose-400/30 hover:text-rose-200"
                >
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

        {!user ? (
          <div className="mt-8 rounded-[24px] border border-line bg-page/40 p-5">
            <p className="text-sm leading-6 text-textMuted">
              Чтобы оформить заказ и получить доступ к файлам модели, войдите в аккаунт покупателя.
            </p>
            <Link
              href="/auth/login"
              className="mt-4 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-400"
            >
              Войти
            </Link>
          </div>
        ) : user.role === "seller" ? (
          <div className="mt-8 rounded-[24px] border border-line bg-page/40 p-5">
            <p className="text-sm leading-6 text-textMuted">
              Сейчас вы вошли как продавец. Для оформления заказа нужен аккаунт покупателя.
            </p>
          </div>
        ) : (
          <form action={handleCheckout} className="mt-8 space-y-4">
            <input
              name="customerName"
              defaultValue={user.name}
              placeholder="Имя получателя"
              className="w-full rounded-2xl border border-line bg-page px-4 py-3 text-sm text-text outline-none placeholder:text-textMuted focus:border-blue-400/30"
            />
            <input
              name="customerEmail"
              type="email"
              defaultValue={user.email}
              placeholder="Email"
              className="w-full rounded-2xl border border-line bg-page px-4 py-3 text-sm text-text outline-none placeholder:text-textMuted focus:border-blue-400/30"
            />
            <input
              name="phone"
              placeholder="Телефон"
              className="w-full rounded-2xl border border-line bg-page px-4 py-3 text-sm text-text outline-none placeholder:text-textMuted focus:border-blue-400/30"
            />
            <input
              name="city"
              placeholder="Город"
              className="w-full rounded-2xl border border-line bg-page px-4 py-3 text-sm text-text outline-none placeholder:text-textMuted focus:border-blue-400/30"
            />
            <textarea
              name="address"
              placeholder="Адрес доставки или комментарий к заказу"
              rows={4}
              className="w-full rounded-2xl border border-line bg-page px-4 py-3 text-sm text-text outline-none placeholder:text-textMuted focus:border-blue-400/30"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Оформляем..." : "Подтвердить заказ"}
            </button>

            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            {success ? (
              <div className="space-y-3">
                <p className="text-sm leading-6 text-emerald-300">{success}</p>
                <Link href="/orders" className="text-sm text-accentSoft">
                  Перейти в историю покупок
                </Link>
              </div>
            ) : null}
          </form>
        )}
      </aside>
    </div>
  );
}
