import Link from "next/link";

export function CtaBanner() {
  return (
    <div className="rounded-[32px] border border-blue-400/15 bg-[linear-gradient(135deg,rgba(47,120,255,0.2),rgba(6,11,28,0.92))] p-8 shadow-glow">
      <p className="text-sm uppercase tracking-[0.35em] text-accentSoft">Коллекция</p>
      <h3 className="mt-4 max-w-2xl text-3xl font-semibold text-text">
        Выберите 3D-модель для интерьера, коллекции или печати
      </h3>
      <p className="mt-4 max-w-2xl text-base leading-7 text-blue-50/80">
        В каталоге собраны лаконичные объекты, которые удобно просматривать онлайн, добавлять в
        корзину и скачивать после оформления заказа.
      </p>
      <div className="mt-8">
        <Link
          href="/catalog"
          className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-blue-100"
        >
          Смотреть каталог
        </Link>
      </div>
    </div>
  );
}
