import { AboutGrid } from "@/components/about-grid";
import { CtaBanner } from "@/components/cta-banner";
import { FeatureGrid } from "@/components/feature-grid";
import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import { SectionTitle } from "@/components/section-title";
import { getProducts } from "@/lib/products";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionTitle
          eyebrow="Каталог"
          title="Популярные модели для дома, полки и рабочего пространства"
          description="В подборке собраны востребованные 3D-модели с карточками товаров, просмотром в 3D и доступом к файлам после покупки."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-6 py-20">
        <SectionTitle
          eyebrow="О магазине"
          title="Черно-синяя витрина 3D-моделей для покупки и публикации"
          description="Покупатели выбирают модели, оформляют заказ и скачивают файлы после подтверждения. Продавцы публикуют свои работы прямо через сайт."
        />
        <div className="mt-10">
          <AboutGrid />
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <SectionTitle
          eyebrow="Преимущества"
          title="Поиск, сортировка, 3D-просмотр и история покупок в одном интерфейсе"
          description="Каждая модель доступна в каталоге, на отдельной странице и в личном кабинете покупателя или продавца."
        />
        <div className="mt-10">
          <FeatureGrid />
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-6 py-20">
        <CtaBanner />
      </section>
    </>
  );
}
