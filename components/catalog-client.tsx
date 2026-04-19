"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import type { StoreProduct } from "@/lib/products";

type SortMode = "popular" | "price-asc" | "price-desc" | "name";

export function CatalogClient({
  products,
  categories
}: {
  products: StoreProduct[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все");
  const [sort, setSort] = useState<SortMode>("popular");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const prepared = products.filter((product) => {
      const matchesCategory = category === "Все" || product.category === category;
      const haystack = [
        product.name,
        product.category,
        product.shortDescription,
        product.tags.join(" "),
        product.sellerName || ""
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && haystack.includes(normalized);
    });

    const sorted = [...prepared];

    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        sorted.sort((a, b) => b.rating - a.rating);
    }

    return sorted;
  }, [category, products, query, sort]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 rounded-[28px] border border-line bg-panel/60 p-4 sm:p-5 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Найти модель по названию, категории, тегу или автору"
          className="rounded-2xl border border-line bg-page px-4 py-3 text-sm text-text outline-none transition placeholder:text-textMuted focus:border-blue-400/30"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-2xl border border-line bg-page px-4 py-3 text-sm text-text outline-none transition focus:border-blue-400/30"
        >
          {categories.map((item) => (
            <option key={item} value={item} className="bg-page text-text">
              {item}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as SortMode)}
          className="rounded-2xl border border-line bg-page px-4 py-3 text-sm text-text outline-none transition focus:border-blue-400/30"
        >
          <option value="popular" className="bg-page text-text">
            Сначала популярные
          </option>
          <option value="price-asc" className="bg-page text-text">
            Цена по возрастанию
          </option>
          <option value="price-desc" className="bg-page text-text">
            Цена по убыванию
          </option>
          <option value="name" className="bg-page text-text">
            По названию
          </option>
        </select>
      </div>

      <p className="text-sm text-textMuted">Найдено товаров: {filtered.length}</p>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
