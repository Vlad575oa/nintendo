"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const FilterSidebar = ({ currentCategory }: { currentCategory: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [priceMin, setPriceMin] = useState(searchParams.get("priceMin") || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") || "");

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "") {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });
      return newParams.toString();
    },
    [searchParams]
  );

  const handleApply = () => {
    router.push(`${pathname}?${createQueryString({ priceMin, priceMax })}`);
  };

  const colors = ["Black", "White", "Red", "Blue", "Gray"];

  return (
    <div className="space-y-10">
      {/* Categories */}
      <div>
        <h3 className="text-lg font-black text-secondary mb-6">Категории</h3>
        <ul className="space-y-4">
          {["All", "PlayStation", "Xbox", "Nintendo", "Accessories"].map((cat) => (
            <li key={cat}>
              <button
                onClick={() => router.push(`/catalog/${cat.toLowerCase()}`)}
                className={`text-sm font-bold transition-colors ${
                  currentCategory === cat.toLowerCase() ? "text-primary" : "text-neutral-500 hover:text-secondary"
                }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-lg font-black text-secondary mb-6">Цена, ₽</h3>
        <div className="flex items-center gap-3">
          <input
            type="number"
            placeholder="От"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-bold placeholder:font-medium"
          />
          <span className="text-neutral-300">—</span>
          <input
            type="number"
            placeholder="До"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-bold placeholder:font-medium"
          />
        </div>
        <button
          onClick={handleApply}
          className="mt-4 w-full py-3 bg-neutral-100 text-neutral-600 font-bold rounded-2xl hover:bg-primary hover:text-white transition-all text-sm"
        >
          Применить
        </button>
      </div>

      {/* Colors */}
      <div>
        <h3 className="text-lg font-black text-secondary mb-6">Цвет</h3>
        <div className="space-y-3">
          {colors.map((color) => (
            <label key={color} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={searchParams.get("color") === color}
                onChange={(e) => {
                  router.push(`${pathname}?${createQueryString({ color: e.target.checked ? color : null })}`);
                }}
                className="w-5 h-5 rounded-lg border-2 border-neutral-200 text-primary focus:ring-primary/20 transition-all cursor-pointer"
              />
              <span className="text-sm font-bold text-neutral-500 group-hover:text-secondary transition-colors">
                {color}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
