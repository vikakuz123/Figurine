import { getSellerProducts, type ModelType, type SellerProductRecord } from "@/lib/db";

export type StoreProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  accent: string;
  material: string;
  height: string;
  tags: string[];
  shortDescription: string;
  description: string;
  modelType: ModelType;
  source: "catalog" | "seller";
  sellerId?: string;
  sellerName?: string;
  fileBase: string;
};

const productVisuals: Record<
  ModelType,
  { image: string; accent: string; fileBase: string }
> = {
  house: {
    image: "/catalog/neon-guardian.svg",
    accent: "#2f78ff",
    fileBase: "scandi-house"
  },
  cat: {
    image: "/catalog/abyss-mage.svg",
    accent: "#5bb2ff",
    fileBase: "sleepy-cat"
  },
  chair: {
    image: "/catalog/cyber-cat-rider.svg",
    accent: "#6fb7ff",
    fileBase: "mini-chair"
  },
  lamp: {
    image: "/catalog/sentinel-drone.svg",
    accent: "#94c7ff",
    fileBase: "nordic-lamp"
  },
  bunny: {
    image: "/catalog/blue-ronin.svg",
    accent: "#3f8cff",
    fileBase: "soft-bunny"
  },
  mug: {
    image: "/catalog/quantum-scout.svg",
    accent: "#7cc6ff",
    fileBase: "cozy-mug"
  }
};

const baseProducts: StoreProduct[] = [
  {
    id: "p-1",
    slug: "scandi-house",
    name: "Scandi House",
    category: "Интерьер",
    price: 3900,
    rating: 4.9,
    image: productVisuals.house.image,
    accent: productVisuals.house.accent,
    material: "Фотополимер",
    height: "18 см",
    tags: ["домик", "декор", "полка"],
    shortDescription: "Минималистичный декоративный домик для полки, стола или витрины.",
    description:
      "Аккуратная интерьерная фигурка в форме домика с чистыми линиями и гладкой поверхностью. Подходит для современного интерьера, подарочных наборов и уютного декора.",
    modelType: "house",
    source: "catalog",
    fileBase: productVisuals.house.fileBase
  },
  {
    id: "p-2",
    slug: "sleepy-cat",
    name: "Sleepy Cat",
    category: "Животные",
    price: 3500,
    rating: 4.8,
    image: productVisuals.cat.image,
    accent: productVisuals.cat.accent,
    material: "Смола",
    height: "14 см",
    tags: ["кот", "уют", "декор"],
    shortDescription: "Статуэтка спящего кота в спокойной округлой форме.",
    description:
      "Небольшая декоративная фигурка кота с мягким силуэтом и приятными пропорциями. Хорошо смотрится на рабочем столе, комоде или в домашней коллекции.",
    modelType: "cat",
    source: "catalog",
    fileBase: productVisuals.cat.fileBase
  },
  {
    id: "p-3",
    slug: "mini-chair",
    name: "Mini Chair",
    category: "Мебель",
    price: 3200,
    rating: 4.7,
    image: productVisuals.chair.image,
    accent: productVisuals.chair.accent,
    material: "PLA Premium",
    height: "16 см",
    tags: ["стул", "макет", "дизайн"],
    shortDescription: "Декоративная миниатюра стула с лаконичным современным силуэтом.",
    description:
      "Фигурка в виде дизайнерского стула с четкой геометрией и устойчивой формой. Отличный вариант для коллекций миниатюр, фотозон и интерьерных композиций.",
    modelType: "chair",
    source: "catalog",
    fileBase: productVisuals.chair.fileBase
  },
  {
    id: "p-4",
    slug: "nordic-lamp",
    name: "Nordic Lamp",
    category: "Интерьер",
    price: 4100,
    rating: 5,
    image: productVisuals.lamp.image,
    accent: productVisuals.lamp.accent,
    material: "Литьевая смола",
    height: "22 см",
    tags: ["лампа", "декор", "сканди"],
    shortDescription: "Стильная фигурка лампы в скандинавском стиле.",
    description:
      "Элегантная декоративная модель настольной лампы с тонкой стойкой и широким плафоном. Подходит для интерьерных наборов и эстетичных витрин.",
    modelType: "lamp",
    source: "catalog",
    fileBase: productVisuals.lamp.fileBase
  },
  {
    id: "p-5",
    slug: "soft-bunny",
    name: "Soft Bunny",
    category: "Животные",
    price: 3400,
    rating: 4.6,
    image: productVisuals.bunny.image,
    accent: productVisuals.bunny.accent,
    material: "Фотополимер",
    height: "15 см",
    tags: ["заяц", "детская", "декор"],
    shortDescription: "Небольшая фигурка зайца с мягким силуэтом и длинными ушами.",
    description:
      "Спокойная интерьерная фигурка зайца с компактной формой и аккуратной подставкой. Хорошо подходит для домашнего декора, подарков и сезонных композиций.",
    modelType: "bunny",
    source: "catalog",
    fileBase: productVisuals.bunny.fileBase
  },
  {
    id: "p-6",
    slug: "cozy-mug",
    name: "Cozy Mug",
    category: "Предметы",
    price: 2900,
    rating: 4.8,
    image: productVisuals.mug.image,
    accent: productVisuals.mug.accent,
    material: "PLA Premium",
    height: "13 см",
    tags: ["кружка", "кухня", "уют"],
    shortDescription: "Декоративная фигурка кружки с ручкой и плавными линиями.",
    description:
      "Минималистичная фигурка кружки для витрины, полки или подарочного набора. Сдержанная форма делает ее универсальной для разных интерьерных подборок.",
    modelType: "mug",
    source: "catalog",
    fileBase: productVisuals.mug.fileBase
  }
];

function sellerToStoreProduct(product: SellerProductRecord): StoreProduct {
  const visuals = productVisuals[product.modelType];

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: product.price,
    rating: product.rating,
    image: visuals.image,
    accent: product.accent || visuals.accent,
    material: product.material,
    height: product.height,
    tags: product.tags,
    shortDescription: product.shortDescription,
    description: product.description,
    modelType: product.modelType,
    source: "seller",
    sellerId: product.sellerId,
    sellerName: product.sellerName,
    fileBase: visuals.fileBase
  };
}

export function getBaseProducts() {
  return baseProducts;
}

export async function getProducts() {
  const sellerProducts = await getSellerProducts();
  return [...baseProducts, ...sellerProducts.map(sellerToStoreProduct)];
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find((item) => item.slug === slug) || null;
}

export async function getProductById(id: string) {
  const products = await getProducts();
  return products.find((item) => item.id === id) || null;
}

export async function getCategories() {
  const products = await getProducts();
  return ["Все", ...new Set(products.map((product) => product.category))];
}
