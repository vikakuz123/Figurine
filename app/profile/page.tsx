import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

export default async function ProfilePage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-[30px] border border-line bg-panel/70 p-8">
          <p className="text-sm uppercase tracking-[0.35em] text-accentSoft">Профиль</p>
          <h1 className="mt-4 text-4xl font-semibold text-text">Войдите в аккаунт</h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-textMuted">
            После входа будут доступны профиль, сохраненные данные и быстрый переход к
            оформлению заказа.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/auth/login" className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-400">
              Войти
            </Link>
            <Link href="/auth/register" className="rounded-full border border-line px-6 py-3 text-sm text-text transition hover:border-blue-400/25 hover:bg-blue-500/10">
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
            <p className="mt-3 text-lg text-text">{new Intl.DateTimeFormat("ru-RU").format(user.createdAt)}</p>
          </div>
          <div className="rounded-[24px] border border-line bg-page/50 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-textMuted">Статус</p>
            <p className="mt-3 text-lg text-text">Активный</p>
          </div>
          <div className="rounded-[24px] border border-line bg-page/50 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-textMuted">Доступ</p>
            <p className="mt-3 text-lg text-text">Профиль и корзина</p>
          </div>
        </div>
        <div className="mt-8">
          <LogoutButton />
        </div>
      </div>
    </section>
  );
}
