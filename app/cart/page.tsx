import { CartPageClient } from "@/components/cart-page-client";
import { SectionTitle } from "@/components/section-title";

export default function CartPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <SectionTitle
        eyebrow="Корзина"
        title="Проверьте выбранные товары перед оформлением"
        description="Все добавленные позиции собраны в одном месте: можно изменить количество, удалить товар или перейти к подтверждению заказа."
      />
      <div className="mt-10">
        <CartPageClient />
      </div>
    </section>
  );
}
