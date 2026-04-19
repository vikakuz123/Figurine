import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ModelDownloads } from "@/components/model-downloads";
import { ProductViewer3D } from "@/components/product-viewer-3d";
import { getSessionUser } from "@/lib/auth";
import { hasUserPurchasedSlug } from "@/lib/db";
import { getProductBySlug, getProducts } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const user = await getSessionUser();
  const purchased =
    user?.role === "buyer" ? await hasUserPurchasedSlug(user.id, product.slug) : false;
  const canDownload =
    purchased ||
    (user?.role === "seller" &&
      product.source === "seller" &&
      product.sellerId === user.id);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <ProductViewer3D modelType={product.modelType} accent={product.accent} />
        <div className="rounded-[30px] border border-line bg-panel/65 p-5 sm:p-8">
          <p className="text-sm uppercase tracking-[0.35em] text-accentSoft">{product.category}</p>
          <h1 className="mt-4 text-3xl font-semibold text-text sm:text-4xl">{product.name}</h1>
          <p className="mt-4 text-base leading-8 text-textMuted">{product.description}</p>
          {product.sellerName ? (
            <p className="mt-4 text-sm text-blue-200/80">Автор модели: {product.sellerName}</p>
          ) : null}

          <div className="mt-8 grid gap-4 rounded-[24px] border border-line bg-page/50 p-5 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-textMuted">Материал</p>
              <p className="mt-2 text-lg text-text">{product.material}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-textMuted">Высота</p>
              <p className="mt-2 text-lg text-text">{product.height}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-textMuted">Рейтинг</p>
              <p className="mt-2 text-lg text-text">{product.rating}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-textMuted">Цена</p>
              <p className="mt-2 text-lg text-text">{formatPrice(product.price)}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <AddToCartButton product={product} />
            <ModelDownloads
              fileBase={product.fileBase}
              name={product.name}
              canDownload={Boolean(canDownload)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
