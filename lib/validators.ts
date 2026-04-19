import { z } from "zod";

const roleSchema = z.enum(["buyer", "seller"]);
const modelTypeSchema = z.enum(["house", "cat", "chair", "lamp", "bunny", "mug"]);

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Введите имя"),
  email: z.string().trim().email("Некорректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
  role: roleSchema
});

export const loginSchema = z.object({
  email: z.string().trim().email("Некорректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
  role: roleSchema
});

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Укажите имя получателя"),
  customerEmail: z.string().trim().email("Укажите корректный email"),
  phone: z.string().trim().min(6, "Укажите телефон"),
  city: z.string().trim().min(2, "Укажите город"),
  address: z.string().trim().min(5, "Укажите адрес"),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        productSlug: z.string().min(1),
        productName: z.string().min(1),
        quantity: z.number().int().min(1),
        unitPrice: z.number().positive()
      })
    )
    .min(1, "Корзина пуста")
});

export const sellerProductSchema = z.object({
  name: z.string().trim().min(2, "Введите название модели"),
  category: z.string().trim().min(2, "Введите категорию"),
  price: z.coerce.number().positive("Цена должна быть больше нуля"),
  material: z.string().trim().min(2, "Укажите материал"),
  height: z.string().trim().min(2, "Укажите размер"),
  tags: z.string().trim().min(2, "Добавьте теги"),
  shortDescription: z.string().trim().min(10, "Короткое описание слишком короткое"),
  description: z.string().trim().min(20, "Полное описание слишком короткое"),
  modelType: modelTypeSchema
});
