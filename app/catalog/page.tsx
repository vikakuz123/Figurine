import { CatalogClient } from "@/components/catalog-client";
import { SectionTitle } from "@/components/section-title";
import { getCategories, getProducts } from "@/lib/products";

export default async function CatalogPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionTitle
        eyebrow="Каталог"
        title="Найдите подходящую 3D-модель по названию, тегам, автору и категории"
        description="Каталог поддерживает поиск и сортировку, а каждая карточка ведет на страницу с 3D-просмотром и условиями скачивания."
      />
      <div className="mt-10">
        <CatalogClient products={products} categories={categories} />
      </div>
    </section>
  );
}
