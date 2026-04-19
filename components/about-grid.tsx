export function AboutGrid() {
  return (
    <div id="about" className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[30px] border border-line bg-panel/70 p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-accentSoft">О проекте</p>
        <h3 className="mt-4 text-3xl font-semibold text-text">
          Подборка базовых предметов и фигур по твоим моделям из Blender
        </h3>
        <p className="mt-4 text-base leading-8 text-textMuted">
          Figurine показывает понятные 3D-объекты без лишней стилизации: домик, кот, стул, лампа и
          кружка. Каталог можно развивать дальше, добавляя новые модели, обложки и экспорт в
          разные форматы.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-[28px] border border-line bg-panel/55 p-6">
          <p className="text-4xl font-semibold text-text">5</p>
          <p className="mt-3 text-sm leading-7 text-textMuted">
            базовых моделей уже заменили старый каталог и стали основной коллекцией сайта
          </p>
        </div>
        <div className="rounded-[28px] border border-line bg-panel/55 p-6">
          <p className="text-4xl font-semibold text-text">3D</p>
          <p className="mt-3 text-sm leading-7 text-textMuted">
            интерактивный просмотр помогает быстро оценить форму объекта на отдельной странице
          </p>
        </div>
        <div className="rounded-[28px] border border-line bg-panel/55 p-6">
          <p className="text-4xl font-semibold text-text">Blender</p>
          <p className="mt-3 text-sm leading-7 text-textMuted">
            исходные `.blend`-файлы сохранены в проекте для дальнейшего экспорта и обновлений
          </p>
        </div>
        <div className="rounded-[28px] border border-line bg-panel/55 p-6">
          <p className="text-4xl font-semibold text-text">Store</p>
          <p className="mt-3 text-sm leading-7 text-textMuted">
            каталог, корзина, профиль и заказ уже готовы для дальнейшей доработки под твои модели
          </p>
        </div>
      </div>
    </div>
  );
}
