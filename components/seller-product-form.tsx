"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const modelTypes = [
  { value: "house", label: "Домик" },
  { value: "cat", label: "Животное" },
  { value: "chair", label: "Стул" },
  { value: "lamp", label: "Лампа" },
  { value: "bunny", label: "Игрушка" },
  { value: "mug", label: "Предмет" }
] as const;

export function SellerProductForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload = Object.fromEntries(formData.entries());
      const response = await fetch("/api/seller/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "Не удалось добавить модель");
        setLoading(false);
        return;
      }

      setSuccess("Модель добавлена в каталог.");
      setLoading(false);
      router.refresh();
    } catch {
      setError("Не удалось отправить форму. Попробуйте снова.");
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="grid gap-4 rounded-[30px] border border-line bg-panel/70 p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="name"
          placeholder="Название модели"
          className="w-full rounded-2xl border border-line bg-page px-4 py-3 text-sm text-text outline-none placeholder:text-textMuted focus:border-blue-400/30"
        />
        <input
          name="category"
          placeholder="Категория"
          className="w-full rounded-2xl border border-line bg-page px-4 py-3 text-sm text-text outline-none placeholder:text-textMuted focus:border-blue-400/30"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <input
          name="price"
          type="number"
          min="1"
          step="1"
          placeholder="Цена"
          className="w-full rounded-2xl border border-line bg-page px-4 py-3 text-sm text-text outline-none placeholder:text-textMuted focus:border-blue-400/30"
        />
        <input
          name="material"
          placeholder="Материал"
          className="w-full rounded-2xl border border-line bg-page px-4 py-3 text-sm text-text outline-none placeholder:text-textMuted focus:border-blue-400/30"
        />
        <input
          name="height"
          placeholder="Размер, например 18 см"
          className="w-full rounded-2xl border border-line bg-page px-4 py-3 text-sm text-text outline-none placeholder:text-textMuted focus:border-blue-400/30"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_260px]">
        <input
          name="tags"
          placeholder="Теги через запятую"
          className="w-full rounded-2xl border border-line bg-page px-4 py-3 text-sm text-text outline-none placeholder:text-textMuted focus:border-blue-400/30"
        />
        <select
          name="modelType"
          defaultValue="house"
          className="w-full rounded-2xl border border-line bg-page px-4 py-3 text-sm text-text outline-none focus:border-blue-400/30"
        >
          {modelTypes.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <input
        name="shortDescription"
        placeholder="Короткое описание"
        className="w-full rounded-2xl border border-line bg-page px-4 py-3 text-sm text-text outline-none placeholder:text-textMuted focus:border-blue-400/30"
      />
      <textarea
        name="description"
        rows={5}
        placeholder="Подробное описание модели"
        className="w-full rounded-2xl border border-line bg-page px-4 py-3 text-sm text-text outline-none placeholder:text-textMuted focus:border-blue-400/30"
      />

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-300">{success}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Публикуем..." : "Опубликовать модель"}
      </button>
    </form>
  );
}
