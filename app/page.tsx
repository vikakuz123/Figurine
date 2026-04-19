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
          title="Актуальные модели на основе твоих файлов"
          description="Старые фигурки убраны из основного каталога. Теперь на главной странице показываются домик, кот, стул, лампа и кружка."
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
          title="Витрина 3D-моделей для покупки, просмотра и дальнейшей доработки"
          description="Сайт уже подготовлен под реальные объекты из Blender и больше не привязан к старой коллекции фигурок."
        />
        <div className="mt-10">
          <AboutGrid />
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <SectionTitle
          eyebrow="Преимущества"
          title="Поиск, карточки товаров и 3D-просмотр в одном интерфейсе"
          description="Каталог можно дальше развивать: добавлять рендеры, новые товары и реальные экспортированные файлы моделей."
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
