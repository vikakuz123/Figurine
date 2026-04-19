import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createSellerProduct, initializeDatabase, isDatabaseReady } from "@/lib/db";
import { getProductBySlug } from "@/lib/products";
import { isStorageConfigured, uploadObject } from "@/lib/storage";
import { sellerProductSchema } from "@/lib/validators";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/ё/g, "e");
}

function sanitizeFileName(fileName: string, fallbackExtension: string) {
  const extension = fileName.includes(".") ? fileName.split(".").pop() || fallbackExtension : fallbackExtension;
  return extension.toLowerCase().replace(/[^a-z0-9]+/g, "") || fallbackExtension;
}

async function fileToBuffer(file: File) {
  return Buffer.from(await file.arrayBuffer());
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

  if (!isStorageConfigured()) {
    return NextResponse.json(
      { error: "Хранилище файлов не настроено. Проверьте переменные Bucket в Railway." },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const parsed = sellerProductSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    price: formData.get("price"),
    material: formData.get("material"),
    height: formData.get("height"),
    tags: formData.get("tags"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    modelType: formData.get("modelType")
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Некорректные данные модели" },
      { status: 400 }
    );
  }

  const glbFile = formData.get("glbFile");
  const objFile = formData.get("objFile");
  const stlFile = formData.get("stlFile");
  const previewImage = formData.get("previewImage");

  if (!(glbFile instanceof File) || !glbFile.size) {
    return NextResponse.json(
      { error: "Добавьте GLB-файл для 3D-просмотра" },
      { status: 400 }
    );
  }

  if (!(objFile instanceof File) || !objFile.size) {
    return NextResponse.json(
      { error: "Добавьте OBJ-файл для скачивания" },
      { status: 400 }
    );
  }

  if (!(stlFile instanceof File) || !stlFile.size) {
    return NextResponse.json(
      { error: "Добавьте STL-файл для скачивания" },
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

  const folder = `seller-products/${user.id}/${slug}`;
  const previewExtension =
    previewImage instanceof File && previewImage.size
      ? sanitizeFileName(previewImage.name, "png")
      : "";

  const previewImageKey =
    previewImage instanceof File && previewImage.size
      ? `${folder}/preview.${previewExtension}`
      : null;
  const glbKey = `${folder}/model.glb`;
  const objKey = `${folder}/model.obj`;
  const stlKey = `${folder}/model.stl`;

  try {
    if (previewImageKey && previewImage instanceof File) {
      await uploadObject({
        key: previewImageKey,
        body: await fileToBuffer(previewImage),
        contentType: previewImage.type || "image/png"
      });
    }

    await uploadObject({
      key: glbKey,
      body: await fileToBuffer(glbFile),
      contentType: glbFile.type || "model/gltf-binary"
    });

    await uploadObject({
      key: objKey,
      body: await fileToBuffer(objFile),
      contentType: objFile.type || "text/plain; charset=utf-8"
    });

    await uploadObject({
      key: stlKey,
      body: await fileToBuffer(stlFile),
      contentType: stlFile.type || "model/stl"
    });
  } catch {
    return NextResponse.json(
      { error: "Не удалось загрузить файлы модели в хранилище" },
      { status: 500 }
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
    modelType: parsed.data.modelType,
    previewImageKey,
    glbKey,
    objKey,
    stlKey
  });

  if (!product) {
    return NextResponse.json(
      { error: "Не удалось добавить модель. Попробуйте еще раз." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, product });
}
