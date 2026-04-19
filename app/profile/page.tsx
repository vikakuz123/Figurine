import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { getSessionUser } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-[30px] border border-line bg-panel/70 p-8">
          <p className="text-sm uppercase tracking-[0.35em] text-accentSoft">Профиль</p>
          <h1 className="mt-4 text-4xl font-semibold text-text">Войдите в аккаунт</h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-textMuted">
            После входа будут доступны профиль, история заказов покупателя или кабинет продавца
            для публикации собственных моделей.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/auth/login"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-400"
            >
              Войти
            </Link>
            <Link
              href="/auth/register"
              className="rounded-full border border-line px-6 py-3 text-sm text-text transition hover:border-blue-400/25 hover:bg-blue-500/10"
            >
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="rounded-[32px] border border-line bg-panel/70 p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-accentSoft">Личный кабинет</p>
        <h1 className="mt-4 text-4xl font-semibold text-text">{user.name}</h1>
        <p className="mt-4 text-base text-textMuted">{user.email}</p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-[24px] border border-line bg-page/50 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-textMuted">Дата регистрации</p>
            <p className="mt-3 text-lg text-text">
              {new Intl.DateTimeFormat("ru-RU").format(user.createdAt)}
            </p>
          </div>
          <div className="rounded-[24px] border border-line bg-page/50 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-textMuted">Роль</p>
            <p className="mt-3 text-lg text-text">
              {user.role === "seller" ? "Продавец" : "Покупатель"}
            </p>
          </div>
          <div className="rounded-[24px] border border-line bg-page/50 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-textMuted">Доступ</p>
            <p className="mt-3 text-lg text-text">
              {user.role === "seller" ? "Публикация моделей" : "Заказы и загрузки"}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {user.role === "seller" ? (
            <Link
              href="/seller"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-400"
            >
              Открыть кабинет продавца
            </Link>
          ) : (
            <Link
              href="/orders"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-400"
            >
              История покупок
            </Link>
          )}
          <LogoutButton />
        </div>
      </div>
    </section>
  );
}
