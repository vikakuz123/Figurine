export function AboutGrid() {
  return (
    <div id="about" className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[30px] border border-line bg-panel/70 p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-accentSoft">О нас</p>
        <h3 className="mt-4 text-3xl font-semibold text-text">
          Коллекция простых форм, животных и предметов интерьера
        </h3>
        <p className="mt-4 text-base leading-8 text-textMuted">
          Figurium предлагает декоративные 3D-модели для дома, студии и рабочего
          пространства. В каталоге собраны понятные и универсальные объекты, которые легко
          вписываются в современный интерьер.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-[28px] border border-line bg-panel/55 p-6">
          <p className="text-4xl font-semibold text-text">6+</p>
          <p className="mt-3 text-sm leading-7 text-textMuted">
            моделей уже доступны в каталоге с изображениями, описанием и 3D-просмотром
          </p>
        </div>
        <div className="rounded-[28px] border border-line bg-panel/55 p-6">
          <p className="text-4xl font-semibold text-text">3D</p>
          <p className="mt-3 text-sm leading-7 text-textMuted">
            интерактивный просмотр помогает рассмотреть форму объекта с разных сторон
          </p>
        </div>
        <div className="rounded-[28px] border border-line bg-panel/55 p-6">
          <p className="text-4xl font-semibold text-text">Next.js</p>
          <p className="mt-3 text-sm leading-7 text-textMuted">
            быстрые страницы, структурированный каталог и удобная навигация по разделам
          </p>
        </div>
        <div className="rounded-[28px] border border-line bg-panel/55 p-6">
          <p className="text-4xl font-semibold text-text">Store</p>
          <p className="mt-3 text-sm leading-7 text-textMuted">
            корзина, профиль пользователя и оформление заказа собраны в едином интерфейсе
          </p>
        </div>
      </div>
    </div>
  );
}
