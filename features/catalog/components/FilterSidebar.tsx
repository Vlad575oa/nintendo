"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PriceRangeSlider } from "./PriceRangeSlider";

const MAX_PRICE = 200000; // rubles

const COLOR_OPTIONS = [
  { label: "Белый", value: "White", hex: "#FFFFFF" },
  { label: "Чёрный", value: "Black", hex: "#1A1A1A" },
  { label: "Синий", value: "Blue", hex: "#2563EB" },
];

const STATUS_OPTIONS = [
  { label: "В наличии", value: "inStock" },
  { label: "Под заказ", value: "onOrder" },
];

const CATEGORIES = [
  { label: "Все товары", slug: "all" },
  { label: "PlayStation", slug: "playstation" },
  { label: "Xbox", slug: "xbox" },
  { label: "Nintendo", slug: "nintendo" },
  { label: "Аксессуары", slug: "accessories" },
];

interface FilterSidebarProps {
  currentCategory: string;
  totalCount: number;
}

export const FilterSidebar = ({ currentCategory, totalCount }: FilterSidebarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Initialize all state from URL params
  const [priceMin, setPriceMin] = useState(
    Number(searchParams.get("priceMin") ?? 0)
  );
  const [priceMax, setPriceMax] = useState(
    Number(searchParams.get("priceMax") ?? MAX_PRICE)
  );
  const [colors, setColors] = useState<string[]>(
    searchParams.get("color")?.split(",").filter(Boolean) ?? []
  );
  const [statuses, setStatuses] = useState<string[]>(
    searchParams.get("status")?.split(",").filter(Boolean) ?? []
  );

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    color: true,
    status: true,
  });

  const toggleSection = (id: string) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleValue = (
    arr: string[],
    setArr: (v: string[]) => void,
    value: string
  ) =>
    setArr(
      arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
    );

  const hasActiveFilters =
    priceMin > 0 || priceMax < MAX_PRICE || colors.length > 0 || statuses.length > 0;

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([k, v]) => {
        if (!v) next.delete(k);
        else next.set(k, v);
      });
      return next.toString();
    },
    [searchParams]
  );

  const handleApply = () => {
    router.push(
      `${pathname}?${createQueryString({
        priceMin: priceMin > 0 ? String(priceMin) : null,
        priceMax: priceMax < MAX_PRICE ? String(priceMax) : null,
        color: colors.length ? colors.join(",") : null,
        status: statuses.length ? statuses.join(",") : null,
      })}`
    );
  };

  const handleClear = () => {
    setPriceMin(0);
    setPriceMax(MAX_PRICE);
    setColors([]);
    setStatuses([]);
    router.push(pathname);
  };

  // ─── Sub-components ────────────────────────────────────────────────────────

  const FilterSection = ({
    title,
    id,
    children,
  }: {
    title: string;
    id: string;
    children: React.ReactNode;
  }) => {
    const isOpen = openSections[id];
    return (
      <div className="border-b border-neutral-100 last:border-0">
        <button
          onClick={() => toggleSection(id)}
          className="flex items-center justify-between w-full py-5 text-left group"
        >
          <h3 className="text-sm font-black text-secondary group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
          <div
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
              isOpen ? "bg-primary/8 rotate-180" : "bg-neutral-50 rotate-0"
            )}
          >
            <ChevronDown
              size={14}
              className={cn(
                "transition-colors duration-300",
                isOpen ? "text-primary" : "text-neutral-300"
              )}
            />
          </div>
        </button>

        {/* grid-rows accordion — animates to actual content height, no overflow clipping */}
        <div
          style={{
            display: "grid",
            gridTemplateRows: isOpen ? "1fr" : "0fr",
            opacity: isOpen ? 1 : 0,
            transition: "grid-template-rows 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <div className="pb-5 space-y-3">{children}</div>
          </div>
        </div>
      </div>
    );
  };

  const CheckboxOption = ({
    label,
    checked,
    onChange,
    colorHex,
  }: {
    label: string;
    checked: boolean;
    onChange: () => void;
    colorHex?: string;
  }) => (
    <label className="flex items-center gap-3 cursor-pointer group px-1">
      <div
        className={cn(
          "w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center flex-shrink-0",
          checked
            ? "bg-primary border-primary"
            : "border-neutral-200 group-hover:border-primary/40"
        )}
        onClick={onChange}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {colorHex && (
        <div
          className="w-4 h-4 rounded-full flex-shrink-0 border border-neutral-200 shadow-sm"
          style={{ backgroundColor: colorHex }}
        />
      )}
      <span
        className={cn(
          "text-[13px] font-bold transition-colors",
          checked
            ? "text-secondary"
            : "text-neutral-400 group-hover:text-secondary"
        )}
      >
        {label}
      </span>
    </label>
  );

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="bg-white rounded-[32px] border border-neutral-100 p-6 shadow-sm sticky top-24">
      {/* ── Категории ── */}
      <FilterSection title="Категория" id="category">
        <ul className="space-y-1">
          {CATEGORIES.map(({ label, slug }) => (
            <li key={slug}>
              <button
                onClick={() => router.push(`/catalog/${slug}`)}
                className={cn(
                  "text-[13px] font-bold transition-all w-full text-left py-2 px-3 rounded-xl",
                  currentCategory === slug
                    ? "text-primary bg-primary/5"
                    : "text-neutral-400 hover:text-secondary hover:bg-neutral-50"
                )}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </FilterSection>

      {/* ── Цена ── */}
      <FilterSection title="Цена" id="price">
        <div className="space-y-4">
          {/* Number inputs */}
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="number"
                placeholder="0"
                value={priceMin === 0 ? "" : priceMin}
                onChange={(e) => {
                  const v = Math.max(0, Math.min(Number(e.target.value) || 0, priceMax - 1000));
                  setPriceMin(v);
                }}
                className="w-full pl-4 pr-7 py-3 bg-neutral-50 border border-neutral-100 focus:border-primary/30 focus:bg-white rounded-2xl text-[13px] font-black transition-all placeholder:text-neutral-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-neutral-300 font-bold pointer-events-none">
                ₽
              </span>
            </div>
            <span className="text-neutral-200 font-bold text-sm">—</span>
            <div className="flex-1 relative">
              <input
                type="number"
                placeholder={MAX_PRICE.toLocaleString("ru-RU")}
                value={priceMax === MAX_PRICE ? "" : priceMax}
                onChange={(e) => {
                  const v = Math.min(MAX_PRICE, Math.max(Number(e.target.value) || MAX_PRICE, priceMin + 1000));
                  setPriceMax(v);
                }}
                className="w-full pl-4 pr-7 py-3 bg-neutral-50 border border-neutral-100 focus:border-primary/30 focus:bg-white rounded-2xl text-[13px] font-black transition-all placeholder:text-neutral-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-neutral-300 font-bold pointer-events-none">
                ₽
              </span>
            </div>
          </div>

          {/* Slider */}
          <PriceRangeSlider
            min={0}
            max={MAX_PRICE}
            valueMin={priceMin}
            valueMax={priceMax}
            onChangeMin={setPriceMin}
            onChangeMax={setPriceMax}
          />
        </div>
      </FilterSection>

      {/* ── Цвет ── */}
      <FilterSection title="Цвет" id="color">
        {COLOR_OPTIONS.map(({ label, value, hex }) => (
          <CheckboxOption
            key={value}
            label={label}
            checked={colors.includes(value)}
            onChange={() => toggleValue(colors, setColors, value)}
            colorHex={hex}
          />
        ))}
      </FilterSection>

      {/* ── Статус ── */}
      <FilterSection title="Статус товара" id="status">
        {STATUS_OPTIONS.map(({ label, value }) => (
          <CheckboxOption
            key={value}
            label={label}
            checked={statuses.includes(value)}
            onChange={() => toggleValue(statuses, setStatuses, value)}
          />
        ))}
      </FilterSection>

      {/* ── Кнопки ── */}
      <div className="pt-6 space-y-3">
        <button
          onClick={handleApply}
          className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-red-700 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all text-sm uppercase tracking-wide"
        >
          Показать {totalCount} товаров
        </button>
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="w-full py-4 bg-neutral-50 text-neutral-400 font-bold rounded-2xl hover:bg-neutral-100 hover:text-secondary transition-all text-sm flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <X size={15} />
            Очистить фильтры
          </button>
        )}
      </div>
    </div>
  );
};
