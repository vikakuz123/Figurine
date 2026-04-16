export function Footer() {
  return (
    <footer id="contact" className="border-t border-line bg-gradient-to-b from-panel/20 to-page py-10">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-textMuted">Figurium</p>
          <p className="mt-3 max-w-sm text-sm leading-7 text-textMuted">
            Онлайн-магазин декоративных 3D-объектов с удобным каталогом, корзиной и
            интерактивным просмотром товаров.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text">Контакты</h3>
          <p className="mt-3 text-sm text-textMuted">info@figurium.ru</p>
          <p className="mt-2 text-sm text-textMuted">+7 (999) 123-45-67</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text">Покупателям</h3>
          <p className="mt-3 text-sm text-textMuted">
            Доступны поиск по каталогу, регистрация, просмотр товаров в 3D и быстрое
            добавление в корзину.
          </p>
        </div>
      </div>
    </footer>
  );
}
