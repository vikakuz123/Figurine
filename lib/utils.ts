import { clsx } from "clsx";

export function cn(...values: Array<string | undefined | false | null>) {
  return clsx(values);
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  }).format(price);
}
