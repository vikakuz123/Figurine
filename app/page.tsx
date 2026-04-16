import { Hero } from "@/components/hero";
import { SectionTitle } from "@/components/section-title";
import { AboutGrid } from "@/components/about-grid";
import { FeatureGrid } from "@/components/feature-grid";
import { CtaBanner } from "@/components/cta-banner";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionTitle
          eyebrow="Каталог"
          title="Популярные предметы для дома, полки и рабочего стола"
          description="В подборке собраны самые востребованные модели с удобным просмотром, карточками товаров и быстрым переходом в каталог."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionTitle
          eyebrow="О магазине"
          title="Лаконичные 3D-объекты в черно-синей витрине"
          description="На главной странице собраны ключевые разделы магазина: каталог, информация о бренде, преимущества и контакты."
        />
        <div className="mt-10">
          <AboutGrid />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionTitle
          eyebrow="Преимущества"
          title="Удобный выбор, аккуратная подача и интерактивный просмотр"
          description="Каждая модель доступна в каталоге, на отдельной карточке и в интерактивном 3D-окне."
        />
        <div className="mt-10">
          <FeatureGrid />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <CtaBanner />
      </section>
    </>
  );
}
