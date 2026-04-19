import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createSellerProduct, initializeDatabase, isDatabaseReady } from "@/lib/db";
import { getProductBySlug } from "@/lib/products";
import { sellerProductSchema } from "@/lib/validators";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/ё/g, "e");
}

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Сначала войдите в аккаунт" }, { status: 401 });
  }

  if (user.role !== "seller") {
    return NextResponse.json(
      { error: "Добавлять товары может только продавец" },
      { status: 403 }
    );
  }

  const dbReady = await isDatabaseReady();
  if (!dbReady) {
    const initialized = await initializeDatabase();
    if (!initialized) {
      return NextResponse.json(
        { error: "База данных недоступна. Попробуйте позже." },
        { status: 503 }
      );
    }
  }

  const body = await request.json();
  const parsed = sellerProductSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Некорректные данные модели" },
      { status: 400 }
    );
  }

  const slug = slugify(parsed.data.name);
  const existing = await getProductBySlug(slug);

  if (existing) {
    return NextResponse.json(
      { error: "Модель с таким названием уже есть в каталоге" },
      { status: 409 }
    );
  }

  const product = await createSellerProduct({
    sellerId: user.id,
    slug,
    name: parsed.data.name,
    category: parsed.data.category,
    price: parsed.data.price,
    accent: "#2f78ff",
    material: parsed.data.material,
    height: parsed.data.height,
    tags: parsed.data.tags
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    shortDescription: parsed.data.shortDescription,
    description: parsed.data.description,
    modelType: parsed.data.modelType
  });

  if (!product) {
    return NextResponse.json(
      { error: "Не удалось добавить модель. Попробуйте еще раз." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, product });
}
