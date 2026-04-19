import Link from "next/link";
import { redirect } from "next/navigation";
import { SellerProductForm } from "@/components/seller-product-form";
import { getSessionUser } from "@/lib/auth";
import { getSellerProductsByUser } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export default async function SellerPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (user.role !== "seller") {
    redirect("/profile");
  }

  const products = await getSellerProductsByUser(user.id);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.35em] text-accentSoft">Кабинет продавца</p>
        <h1 className="mt-4 text-4xl font-semibold text-text">Публикация и управление моделями</h1>
        <p className="mt-4 text-base leading-8 text-textMuted">
          Добавьте карточку товара, загрузите обложку и файлы модели. Формат `GLB`
          используется для 3D-просмотра на сайте, а `OBJ` и `STL` покупатель сможет
          скачать после оформления заказа.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.95fr]">
        <SellerProductForm />

        <div className="space-y-4">
          <div className="rounded-[30px] border border-line bg-panel/70 p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-textMuted">Ваши модели</p>
            <h2 className="mt-3 text-2xl font-semibold text-text">Опубликовано: {products.length}</h2>
          </div>

          {products.length ? (
            products.map((product) => (
              <article key={product.id} className="rounded-[28px] border border-line bg-panel/65 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-textMuted">
                      {product.category}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-text">{product.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-textMuted">
                      {product.shortDescription}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-text">{formatPrice(product.price)}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-100"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <Link href={`/catalog/${product.slug}`} className="mt-4 inline-flex text-sm text-accentSoft">
                  Открыть карточку товара
                </Link>
              </article>
            ))
          ) : (
            <div className="rounded-[28px] border border-line bg-panel/65 p-6">
              <p className="text-textMuted">
                Пока у вас нет опубликованных моделей. Заполните форму слева, и товар
                появится в каталоге.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
