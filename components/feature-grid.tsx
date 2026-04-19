const features = [
  {
    title: "3D-просмотр каждой модели",
    text: "Каждый товар открывается на отдельной странице с интерактивной 3D-сценой и основными характеристиками."
  },
  {
    title: "Поиск и сортировка",
    text: "Каталог помогает быстро находить нужные объекты по названию, категории и тегам, а также сортировать по цене."
  },
  {
    title: "Профиль и корзина",
    text: "Покупатель может зарегистрироваться, войти в аккаунт, сохранить товары в корзине и перейти к оформлению."
  }
];

export function FeatureGrid() {
  return (
    <div id="features" className="grid gap-5 lg:grid-cols-3">
      {features.map((feature) => (
        <article key={feature.title} className="rounded-[28px] border border-line bg-panel/60 p-6 transition hover:border-blue-400/20 hover:bg-panelStrong/70">
          <div className="mb-4 h-12 w-12 rounded-2xl bg-blue-500/10" />
          <h3 className="text-xl font-semibold text-text">{feature.title}</h3>
          <p className="mt-3 text-sm leading-7 text-textMuted">{feature.text}</p>
        </article>
      ))}
    </div>
  );
}
