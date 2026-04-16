import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <section className="mx-auto grid max-w-5xl gap-8 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[30px] border border-line bg-panel/60 p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-accentSoft">Регистрация</p>
        <h1 className="mt-4 text-4xl font-semibold text-text">Создайте личный кабинет</h1>
        <p className="mt-4 text-base leading-8 text-textMuted">
          Зарегистрируйтесь, чтобы сохранять товары, отслеживать свои действия в магазине и
          быстрее оформлять заказы.
        </p>
      </div>
      <div>
        <AuthForm mode="register" />
        <p className="mt-4 text-sm text-textMuted">
          Уже есть аккаунт? <Link href="/auth/login" className="text-accentSoft">Войти</Link>
        </p>
      </div>
    </section>
  );
}
