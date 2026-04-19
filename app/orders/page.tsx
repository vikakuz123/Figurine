import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getOrdersByUser } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export default async function OrdersPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (user.role !== "buyer") {
    redirect("/profile");
  }

  const orders = await getOrdersByUser(user.id);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.35em] text-accentSoft">История покупок</p>
        <h1 className="mt-4 text-4xl font-semibold text-text">Ваши оформленные заказы</h1>
        <p className="mt-4 text-base leading-8 text-textMuted">
          После оформления заказа файлы моделей становятся доступны здесь и на странице товара.
        </p>
      </div>

      <div className="mt-10 space-y-6">
        {orders.length ? (
          orders.map((order) => (
            <article key={order.id} className="rounded-[30px] border border-line bg-panel/70 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-textMuted">
                    Заказ {order.id.slice(0, 8)}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-text">
                    {new Intl.DateTimeFormat("ru-RU", {
                      dateStyle: "medium",
                      timeStyle: "short"
                    }).format(order.createdAt)}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
                    Заказ оформлен
                  </p>
                  <p className="mt-3 text-lg font-semibold text-text">
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-[24px] border border-line bg-page/40 p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-textMuted">Получатель</p>
                  <p className="mt-2 text-text">{order.customerName}</p>
                  <p className="mt-1 text-sm text-textMuted">{order.customerEmail}</p>
                  <p className="mt-1 text-sm text-textMuted">{order.phone}</p>
                  <p className="mt-1 text-sm text-textMuted">
                    {order.city}, {order.address}
                  </p>
                </div>
                <div className="rounded-[24px] border border-line bg-page/40 p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-textMuted">Файлы</p>
                  <div className="mt-3 space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="rounded-2xl border border-line px-4 py-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-medium text-text">{item.productName}</p>
                            <p className="text-sm text-textMuted">
                              {item.quantity} шт. • {formatPrice(item.unitPrice)}
                            </p>
                          </div>
                          <Link
                            href={`/catalog/${item.productSlug}`}
                            className="text-sm text-accentSoft"
                          >
                            Открыть модель
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[30px] border border-line bg-panel/70 p-8">
            <h2 className="text-2xl font-semibold text-text">Пока нет оформленных заказов</h2>
            <p className="mt-3 text-textMuted">
              После покупки модели появятся здесь вместе с доступом к скачиванию.
            </p>
            <Link
              href="/catalog"
              className="mt-6 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-400"
            >
              Перейти в каталог
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
