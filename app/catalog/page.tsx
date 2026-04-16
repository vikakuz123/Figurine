import { CatalogClient } from "@/components/catalog-client";
import { SectionTitle } from "@/components/section-title";

export default function CatalogPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionTitle
        eyebrow="Каталог"
        title="Найдите подходящий объект по названию, тегам и категории"
        description="Страница каталога помогает искать нужные модели, сортировать их по цене и переходить к карточке товара с 3D-просмотром и файлами для скачивания."
      />
      <div className="mt-10">
        <CatalogClient />
      </div>
    </section>
  );
}
