export function AboutGrid() {
  return (
    <div id="about" className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[30px] border border-line bg-panel/70 p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-accentSoft">О магазине</p>
        <h3 className="mt-4 text-3xl font-semibold text-text">
          Подборка лаконичных предметов и фигур для 3D-каталога
        </h3>
        <p className="mt-4 text-base leading-8 text-textMuted">
          Figurine объединяет простые и выразительные 3D-объекты: домик, кота, стул, лампу и
          кружку. Каждая модель доступна в каталоге, на отдельной странице и после покупки может
          быть скачана в нескольких форматах.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-[28px] border border-line bg-panel/55 p-6">
          <p className="text-4xl font-semibold text-text">5</p>
          <p className="mt-3 text-sm leading-7 text-textMuted">
            базовых моделей уже представлены в каталоге с изображениями, описанием и 3D-просмотром
          </p>
        </div>
        <div className="rounded-[28px] border border-line bg-panel/55 p-6">
          <p className="text-4xl font-semibold text-text">3D</p>
          <p className="mt-3 text-sm leading-7 text-textMuted">
            интерактивный просмотр помогает быстро оценить форму объекта с разных ракурсов
          </p>
        </div>
        <div className="rounded-[28px] border border-line bg-panel/55 p-6">
          <p className="text-4xl font-semibold text-text">Formats</p>
          <p className="mt-3 text-sm leading-7 text-textMuted">
            после оформления заказа модели доступны для скачивания в форматах GLB, OBJ и STL
          </p>
        </div>
        <div className="rounded-[28px] border border-line bg-panel/55 p-6">
          <p className="text-4xl font-semibold text-text">Store</p>
          <p className="mt-3 text-sm leading-7 text-textMuted">
            каталог, корзина, профиль и история покупок собраны в едином удобном интерфейсе
          </p>
        </div>
      </div>
    </div>
  );
}
