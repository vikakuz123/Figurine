"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    try {
      setLoading(true);
      setError("");

      const payload = Object.fromEntries(formData.entries());
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "Не удалось выполнить запрос");
        setLoading(false);
        return;
      }

      router.push("/profile");
      router.refresh();
    } catch {
      setError("Не удалось отправить форму. Проверьте подключение и попробуйте снова.");
      setLoading(false);
    }
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-4 rounded-[28px] border border-line bg-panel/70 p-5 sm:p-6"
    >
      {mode === "register" ? (
        <input
          name="name"
          placeholder="Ваше имя"
          className="w-full rounded-2xl border border-line bg-page px-4 py-3 text-sm text-text outline-none placeholder:text-textMuted focus:border-blue-400/30"
        />
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="rounded-2xl border border-line bg-page px-4 py-3 text-sm text-text">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-textMuted">
            Тип аккаунта
          </span>
          <select
            name="role"
            defaultValue="buyer"
            className="w-full bg-transparent text-sm text-text outline-none"
          >
            <option value="buyer">Покупатель</option>
            <option value="seller">Продавец</option>
          </select>
        </label>

        <div className="rounded-2xl border border-line bg-page px-4 py-3 text-sm text-text">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-textMuted">
            Режим
          </span>
          <p>{mode === "register" ? "Создание аккаунта" : "Вход в аккаунт"}</p>
        </div>
      </div>

      <input
        name="email"
        type="email"
        placeholder="Email"
        className="w-full rounded-2xl border border-line bg-page px-4 py-3 text-sm text-text outline-none placeholder:text-textMuted focus:border-blue-400/30"
      />

      <input
        name="password"
        type="password"
        placeholder="Пароль"
        className="w-full rounded-2xl border border-line bg-page px-4 py-3 text-sm text-text outline-none placeholder:text-textMuted focus:border-blue-400/30"
      />

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading
          ? "Подождите..."
          : mode === "register"
            ? "Создать аккаунт"
            : "Войти"}
      </button>
    </form>
  );
}
