import { CartPageClient } from "@/components/cart-page-client";
import { SectionTitle } from "@/components/section-title";
import { getSessionUser } from "@/lib/auth";

export default async function CartPage() {
  const user = await getSessionUser();

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <SectionTitle
        eyebrow="Корзина"
        title="Проверьте выбранные товары перед оформлением"
        description="Здесь можно изменить количество, удалить позиции и сразу перейти к оформлению заказа."
      />
      <div className="mt-10">
        <CartPageClient user={user} />
      </div>
    </section>
  );
}
