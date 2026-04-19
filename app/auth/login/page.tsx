import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <section className="mx-auto grid max-w-5xl gap-8 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[30px] border border-line bg-panel/60 p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-accentSoft">Авторизация</p>
        <h1 className="mt-4 text-4xl font-semibold text-text">Вход в личный кабинет</h1>
        <p className="mt-4 text-base leading-8 text-textMuted">
          Войдите как покупатель или продавец, чтобы управлять корзиной, заказами и своими
          моделями.
        </p>
        <p className="mt-8 text-sm text-textMuted">
          Тестовый покупатель: <span className="text-text">demo@figuriverse.ru / demo1234</span>
        </p>
      </div>
      <div>
        <AuthForm mode="login" />
        <p className="mt-4 text-sm text-textMuted">
          Нет аккаунта?{" "}
          <Link href="/auth/register" className="text-accentSoft">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </section>
  );
}
