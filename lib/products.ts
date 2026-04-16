export type Product = {
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
  modelType: "house" | "cat" | "chair" | "lamp" | "bunny" | "mug";
};

export const products: Product[] = [
  {
    id: "p-1",
    slug: "scandi-house",
    name: "Scandi House",
    category: "Интерьер",
    price: 3900,
    rating: 4.9,
    image: "/catalog/neon-guardian.svg",
    accent: "#2f78ff",
    material: "Фотополимер",
    height: "18 см",
    tags: ["домик", "декор", "полка"],
    shortDescription: "Минималистичный декоративный домик для полки, стола или витрины.",
    description:
      "Аккуратная интерьерная фигурка в форме домика с чистыми линиями и гладкой поверхностью. Подходит для современного интерьера, подарочных наборов и уютного декора.",
    modelType: "house"
  },
  {
    id: "p-2",
    slug: "sleepy-cat",
    name: "Sleepy Cat",
    category: "Животные",
    price: 3500,
    rating: 4.8,
    image: "/catalog/abyss-mage.svg",
    accent: "#5bb2ff",
    material: "Смола",
    height: "14 см",
    tags: ["кот", "уют", "декор"],
    shortDescription: "Статуэтка спящего кота в спокойной округлой форме.",
    description:
      "Небольшая декоративная фигурка кота с мягким силуэтом и приятными пропорциями. Хорошо смотрится на рабочем столе, комоде или в домашней коллекции.",
    modelType: "cat"
  },
  {
    id: "p-3",
    slug: "mini-chair",
    name: "Mini Chair",
    category: "Мебель",
    price: 3200,
    rating: 4.7,
    image: "/catalog/cyber-cat-rider.svg",
    accent: "#6fb7ff",
    material: "PLA Premium",
    height: "16 см",
    tags: ["стул", "макет", "дизайн"],
    shortDescription: "Декоративная миниатюра стула с лаконичным современным силуэтом.",
    description:
      "Фигурка в виде дизайнерского стула с четкой геометрией и устойчивой формой. Отличный вариант для коллекций миниатюр, фотозон и интерьерных композиций.",
    modelType: "chair"
  },
  {
    id: "p-4",
    slug: "nordic-lamp",
    name: "Nordic Lamp",
    category: "Интерьер",
    price: 4100,
    rating: 5,
    image: "/catalog/sentinel-drone.svg",
    accent: "#94c7ff",
    material: "Литьевая смола",
    height: "22 см",
    tags: ["лампа", "декор", "сканди"],
    shortDescription: "Стильная фигурка лампы в скандинавском стиле.",
    description:
      "Элегантная декоративная модель настольной лампы с тонкой стойкой и широким плафоном. Подходит для интерьерных наборов и эстетичных витрин.",
    modelType: "lamp"
  },
  {
    id: "p-5",
    slug: "soft-bunny",
    name: "Soft Bunny",
    category: "Животные",
    price: 3400,
    rating: 4.6,
    image: "/catalog/blue-ronin.svg",
    accent: "#3f8cff",
    material: "Фотополимер",
    height: "15 см",
    tags: ["заяц", "детская", "декор"],
    shortDescription: "Небольшая фигурка зайца с мягким силуэтом и длинными ушами.",
    description:
      "Спокойная интерьерная фигурка зайца с компактной формой и аккуратной подставкой. Хорошо подходит для домашнего декора, подарков и сезонных композиций.",
    modelType: "bunny"
  },
  {
    id: "p-6",
    slug: "cozy-mug",
    name: "Cozy Mug",
    category: "Предметы",
    price: 2900,
    rating: 4.8,
    image: "/catalog/quantum-scout.svg",
    accent: "#7cc6ff",
    material: "PLA Premium",
    height: "13 см",
    tags: ["кружка", "кухня", "уют"],
    shortDescription: "Декоративная фигурка кружки с ручкой и плавными линиями.",
    description:
      "Минималистичная фигурка кружки для витрины, полки или подарочного набора. Сдержанная форма делает ее универсальной для разных интерьерных подборок.",
    modelType: "mug"
  }
];

export const categories = ["Все", ...new Set(products.map((product) => product.category))];
