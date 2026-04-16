import Link from "next/link";
import { products } from "@/lib/products";
import { ProductViewer3D } from "@/components/product-viewer-3d";

export function Hero() {
  const spotlight = products[0];

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="absolute inset-0 bg-hero-grid bg-hero-grid opacity-70" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.45em] text-accentSoft">
            3D Store Objects
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-tight text-text md:text-7xl">
            3D-каталог декоративных фигурок и базовых предметов
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-textMuted">
            Выбирайте домики, животных, лампы, кружки и другие интерьерные объекты,
            рассматривайте их в 3D и добавляйте понравившиеся модели в корзину.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/catalog" className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-400">
              Открыть каталог
            </Link>
            <a href="#about" className="rounded-full border border-line px-6 py-3 text-sm text-text transition hover:border-blue-400/30 hover:bg-blue-500/10">
              О магазине
            </a>
          </div>
        </div>

        <div className="rounded-[32px] border border-blue-400/15 bg-panel/70 p-5 shadow-glow">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-textMuted">3D Preview</p>
              <h2 className="mt-2 text-2xl font-semibold text-text">{spotlight.name}</h2>
            </div>
            <div className="rounded-full border border-blue-400/20 px-3 py-1 text-sm text-accentSoft">
              New
            </div>
          </div>
          <ProductViewer3D modelType={spotlight.modelType} accent={spotlight.accent} />
        </div>
      </div>
    </section>
  );
}
