import Link from "next/link";
import { ShoppingBag, UserRound } from "lucide-react";
import { HeaderCartCount } from "@/components/header-cart-count";
import { getSessionUser } from "@/lib/auth";

export async function Header() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-page/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-lg font-semibold text-accentSoft shadow-glow">
            F
          </div>
          <div className="min-w-0">
            <p className="text-sm uppercase tracking-[0.35em] text-textMuted">Figurium</p>
            <p className="truncate text-lg font-semibold text-text">3D Figure Store</p>
          </div>
        </Link>

        <div className="order-2 flex items-center gap-2 sm:gap-3 md:order-3">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 text-sm text-text transition hover:border-blue-400/30 hover:bg-blue-500/10 sm:px-4"
          >
            <UserRound size={16} />
            <span className="hidden sm:inline">{user ? user.name : "Войти"}</span>
          </Link>
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-400 sm:px-4"
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Корзина</span>
            <HeaderCartCount />
          </Link>
        </div>

        <nav className="order-3 flex w-full items-center justify-between gap-4 overflow-x-auto text-sm text-textMuted md:order-2 md:w-auto md:justify-start md:gap-8">
          <Link href="/catalog" className="whitespace-nowrap transition hover:text-text">
            Каталог
          </Link>
          <a href="/#about" className="whitespace-nowrap transition hover:text-text">
            О нас
          </a>
          {user?.role === "buyer" ? (
            <Link href="/orders" className="whitespace-nowrap transition hover:text-text">
              Мои покупки
            </Link>
          ) : null}
          {user?.role === "seller" ? (
            <Link href="/seller" className="whitespace-nowrap transition hover:text-text">
              Кабинет продавца
            </Link>
          ) : null}
          <a href="/#contact" className="whitespace-nowrap transition hover:text-text">
            Контакты
          </a>
        </nav>
      </div>
    </header>
  );
}
