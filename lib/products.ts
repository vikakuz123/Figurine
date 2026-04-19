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
    image: "/catalog/house-cover.svg",
    accent: "#4aa3ff",
    fileBase: "house"
  },
  cat: {
    image: "/catalog/cat-cover.svg",
    accent: "#79c1ff",
    fileBase: "cat"
  },
  chair: {
    image: "/catalog/chair-cover.svg",
    accent: "#5cb7ff",
    fileBase: "chair"
  },
  lamp: {
    image: "/catalog/lamp-cover.svg",
    accent: "#a4d8ff",
    fileBase: "lamp"
  },
  bunny: {
    image: "/catalog/cat-cover.svg",
    accent: "#8cc5ff",
    fileBase: "bunny"
  },
  mug: {
    image: "/catalog/mug-cover.svg",
    accent: "#8ad0ff",
    fileBase: "mag"
  }
};

const baseProducts: StoreProduct[] = [
  {
    id: "p-1",
    slug: "house",
    name: "House",
    category: "Интерьер",
    price: 3900,
    rating: 4.9,
    image: productVisuals.house.image,
    accent: productVisuals.house.accent,
    material: "Blender model",
    height: "18 см",
    tags: ["домик", "интерьер", "декор"],
    shortDescription: "Декоративная модель домика для полки, витрины или интерьерной композиции.",
    description:
      "Компактная 3D-модель домика с аккуратным силуэтом и чистой формой. Подходит для интерьерных наборов, декоративной печати и оформления домашнего пространства.",
    modelType: "house",
    source: "catalog",
    fileBase: productVisuals.house.fileBase
  },
  {
    id: "p-2",
    slug: "cat",
    name: "Cat",
    category: "Животные",
    price: 3500,
    rating: 4.8,
    image: productVisuals.cat.image,
    accent: productVisuals.cat.accent,
    material: "Blender model",
    height: "14 см",
    tags: ["кот", "фигурка", "декор"],
    shortDescription: "Модель кота для домашнего декора, коллекции или печати.",
    description:
      "Выразительная 3D-модель кота с мягким силуэтом и спокойной посадкой. Хорошо подходит для интерьерных фигурок, сувенирных наборов и небольших коллекций.",
    modelType: "cat",
    source: "catalog",
    fileBase: productVisuals.cat.fileBase
  },
  {
    id: "p-3",
    slug: "chair",
    name: "Chair",
    category: "Мебель",
    price: 3200,
    rating: 4.7,
    image: productVisuals.chair.image,
    accent: productVisuals.chair.accent,
    material: "Blender model",
    height: "16 см",
    tags: ["стул", "мебель", "миниатюра"],
    shortDescription: "Лаконичная модель стула для визуализации, витрины или 3D-печати.",
    description:
      "Минималистичная 3D-модель стула с понятной геометрией и аккуратными пропорциями. Подходит для предметных подборок, макетов интерьера и декоративных проектов.",
    modelType: "chair",
    source: "catalog",
    fileBase: productVisuals.chair.fileBase
  },
  {
    id: "p-4",
    slug: "lamp",
    name: "Lamp",
    category: "Интерьер",
    price: 4100,
    rating: 4.9,
    image: productVisuals.lamp.image,
    accent: productVisuals.lamp.accent,
    material: "Blender model",
    height: "22 см",
    tags: ["лампа", "освещение", "декор"],
    shortDescription: "Декоративная модель лампы для интерьерной сцены или 3D-печати.",
    description:
      "Аккуратная 3D-модель лампы с простой и выразительной формой. Подходит для визуализации интерьера, настольного декора и самостоятельной печати.",
    modelType: "lamp",
    source: "catalog",
    fileBase: productVisuals.lamp.fileBase
  },
  {
    id: "p-5",
    slug: "mag",
    name: "Mug",
    category: "Предметы",
    price: 2900,
    rating: 4.8,
    image: productVisuals.mug.image,
    accent: productVisuals.mug.accent,
    material: "Blender model",
    height: "13 см",
    tags: ["кружка", "предмет", "кухня"],
    shortDescription: "Простая 3D-модель кружки для коллекции, рендера или печати.",
    description:
      "Универсальная 3D-модель кружки с плавным силуэтом и удобной формой. Хорошо смотрится в каталоге предметов, декоративных сценах и проектах для печати.",
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
