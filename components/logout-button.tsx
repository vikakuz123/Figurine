"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.push("/");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-full border border-line px-5 py-3 text-sm text-text transition hover:border-blue-400/25 hover:bg-blue-500/10"
    >
      Выйти из профиля
    </button>
  );
}
