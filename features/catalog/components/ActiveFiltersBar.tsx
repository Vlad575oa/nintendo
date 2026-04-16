"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X } from "lucide-react";

const COLOR_LABELS: Record<string, string> = {
  White: "Белый",
  Black: "Чёрный",
  Blue: "Синий",
  Red: "Красный",
};

const STATUS_LABELS: Record<string, string> = {
  inStock: "В наличии",
  onOrder: "Под заказ",
};

export const ActiveFiltersBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");
  const colors = searchParams.get("color")?.split(",").filter(Boolean) ?? [];
  const statuses = searchParams.get("status")?.split(",").filter(Boolean) ?? [];

  const removeParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      const current = params.get(key)?.split(",").filter(Boolean) ?? [];
      const next = current.filter((v) => v !== value);
      if (next.length) params.set(key, next.join(","));
      else params.delete(key);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAll = () => router.push(pathname);

  type Chip = { label: string; onRemove: () => void };
  const chips: Chip[] = [];

  if (priceMin) chips.push({ label: `от ${Number(priceMin).toLocaleString("ru-RU")} ₽`, onRemove: () => removeParam("priceMin") });
  if (priceMax) chips.push({ label: `до ${Number(priceMax).toLocaleString("ru-RU")} ₽`, onRemove: () => removeParam("priceMax") });
  colors.forEach((c) =>
    chips.push({ label: COLOR_LABELS[c] ?? c, onRemove: () => removeParam("color", c) })
  );
  statuses.forEach((s) =>
    chips.push({ label: STATUS_LABELS[s] ?? s, onRemove: () => removeParam("status", s) })
  );

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {chips.map((chip, i) => (
        <button
          key={i}
          onClick={chip.onRemove}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 border border-primary/20 text-primary rounded-full text-[12px] font-bold hover:bg-primary/10 active:scale-95 transition-all group"
        >
          {chip.label}
          <X size={11} className="group-hover:scale-110 transition-transform" />
        </button>
      ))}
      {chips.length > 1 && (
        <button
          onClick={clearAll}
          className="px-3 py-1.5 text-neutral-400 rounded-full text-[12px] font-bold hover:text-secondary hover:bg-neutral-100 transition-colors"
        >
          Сбросить все
        </button>
      )}
    </div>
  );
};
