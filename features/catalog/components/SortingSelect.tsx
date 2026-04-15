"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export const SortingSelect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-bold text-neutral-400">Сортировка:</span>
      <select
        value={searchParams.get("sort") || ""}
        onChange={(e) => handleSortChange(e.target.value)}
        className="bg-neutral-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-secondary focus:ring-2 focus:ring-primary/20 cursor-pointer"
      >
        <option value="newest">По новизне</option>
        <option value="price-asc">Дешевле</option>
        <option value="price-desc">Дороже</option>
      </select>
    </div>
  );
};
