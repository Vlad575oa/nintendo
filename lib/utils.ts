import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Форматирует цену из копеек в рубли
 * @param priceInCents Цена в копейках (Integer)
 * @returns Отформатированная строка (например, "450 ₽")
 */
export function formatPrice(priceInCents: number): string {
  const rubles = priceInCents / 100;
  return rubles.toLocaleString("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
