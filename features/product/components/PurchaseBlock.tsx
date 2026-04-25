"use client";

import { cn, formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { Info, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductVariantOption } from "@/lib/queries";

interface PurchaseBlockProps {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    priceOld?: number | null;
    inStock: boolean;
    brand?: string | null;
    images: string[];
  };
  variants?: ProductVariantOption[];
  categorySlug?: string;
}

type VariantCardItem = {
  id: number;
  name: string;
  slug: string;
  price: number;
  priceOld: number | null;
  inStock: boolean;
  images: string[];
  memory: string | null;
  color: string | null;
};

const pickBestMatch = (
  items: VariantCardItem[],
  memory: string | null,
  color: string | null
) => {
  const exact = items.find(
    (item) =>
      (memory ? item.memory === memory : true) && (color ? item.color === color : true)
  );
  if (exact) return exact;

  const byMemory = memory ? items.find((item) => item.memory === memory) : null;
  if (byMemory) return byMemory;

  const byColor = color ? items.find((item) => item.color === color) : null;
  if (byColor) return byColor;

  return items[0];
};

export function PurchaseBlock({ product, variants = [], categorySlug }: PurchaseBlockProps) {
  const router = useRouter();
  const variantItems = useMemo<VariantCardItem[]>(() => {
    if (!variants.length) {
      return [
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          priceOld: product.priceOld ?? null,
          inStock: product.inStock,
          images: product.images,
          memory: null,
          color: null,
        },
      ];
    }
    return variants;
  }, [product, variants]);

  const [selectedVariantId, setSelectedVariantId] = useState(product.id);

  const selectedVariant = useMemo(
    () =>
      variantItems.find((variant) => variant.id === selectedVariantId) ?? variantItems[0],
    [selectedVariantId, variantItems]
  );

  const memoryOptions = useMemo(
    () =>
      Array.from(
        new Set(variantItems.map((variant) => variant.memory).filter(Boolean) as string[])
      ),
    [variantItems]
  );

  const colorOptions = useMemo(
    () =>
      Array.from(
        new Set(variantItems.map((variant) => variant.color).filter(Boolean) as string[])
      ),
    [variantItems]
  );

  const canSelectVariants = memoryOptions.length > 1 || colorOptions.length > 1;

  const availableMemories = useMemo(() => {
    if (!selectedVariant.color) return new Set(memoryOptions);
    const matches = variantItems
      .filter((item) => item.color === selectedVariant.color)
      .map((item) => item.memory)
      .filter(Boolean) as string[];
    return matches.length > 0 ? new Set(matches) : new Set(memoryOptions);
  }, [variantItems, selectedVariant.color, memoryOptions]);

  const availableColors = useMemo(() => {
    if (!selectedVariant.memory) return new Set(colorOptions);
    const matches = variantItems
      .filter((item) => item.memory === selectedVariant.memory)
      .map((item) => item.color)
      .filter(Boolean) as string[];
    return matches.length > 0 ? new Set(matches) : new Set(colorOptions);
  }, [variantItems, selectedVariant.memory, colorOptions]);

  const applyVariant = (next: VariantCardItem) => {
    setSelectedVariantId(next.id);
    if (categorySlug && next.slug !== product.slug) {
      router.push(`/catalog/${categorySlug}/${next.slug}`);
    }
  };

  const onMemoryChange = (memory: string) => {
    const next = pickBestMatch(variantItems, memory, selectedVariant.color);
    applyVariant(next);
  };

  const onColorChange = (color: string) => {
    const next = pickBestMatch(variantItems, selectedVariant.memory, color);
    applyVariant(next);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Main card */}
      <div className="bg-white rounded-3xl border border-neutral-100 p-8 shadow-sm">
        {/* Pricing */}
        <div className="space-y-4 mb-8">
          <div>
            <p className="text-[10px] text-neutral-400 font-bold uppercase mb-1">При оплате наличными</p>
            <p className="text-4xl font-black text-secondary leading-none">
              {formatPrice(selectedVariant.price)}
            </p>
          </div>
          
          {selectedVariant.priceOld && (
            <div>
              <p className="text-[10px] text-neutral-400 font-bold uppercase mb-1">Другие способы оплаты</p>
              <p className="text-lg font-bold text-neutral-300">
                {formatPrice(selectedVariant.priceOld)}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-4 mb-6">
          <AddToCartButton
            product={selectedVariant}
            className="w-full h-14 rounded-2xl text-lg font-black bg-[#FF6B00] hover:bg-[#e65a00] border-none shadow-lg shadow-orange-500/20"
          />
          <div className="flex items-center gap-2 px-1 text-sm font-bold text-neutral-400">
             <span className={selectedVariant.inStock ? "text-green-500" : "text-yellow-500"}>
                {selectedVariant.inStock ? "● В наличии" : "○ Под заказ"}
             </span>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex items-center justify-between py-4 border-t border-neutral-50 mb-4">
           <span className="text-xs font-bold text-neutral-400">Артикул: L0{product.id + 4000}</span>
           {product.brand && (
             <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
                <span className="text-[10px] font-black uppercase text-secondary">{product.brand}</span>
             </div>
           )}
        </div>

        {/* Info Box */}
        <div className="bg-neutral-50 rounded-2xl p-4 flex gap-3 text-[11px] leading-relaxed text-neutral-500 font-medium">
            <Info size={16} className="text-neutral-300 flex-shrink-0 mt-0.5" />
            <p>
                <b>О заказе:</b> Цена, условия, комплектация и внешний вид являются предварительными и могут быть изменены в момент поступления товара на склад.
            </p>
        </div>
      </div>

      {/* Additional Options */}
      <div className="space-y-3">
         {canSelectVariants && (
          <div className="space-y-3">
            {memoryOptions.length > 1 && (
              <div className="bg-[#f0f9ff] rounded-2xl p-4">
                <label className="text-[10px] text-blue-500 font-bold uppercase mb-3 block">
                  Объем памяти
                </label>
                <div className="flex flex-wrap gap-2">
                  {memoryOptions.map((memory) => {
                    const isSelected = selectedVariant.memory === memory;
                    const isAvailable = availableMemories.has(memory);
                    return (
                      <button
                        key={memory}
                        onClick={() => onMemoryChange(memory)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                          isSelected
                            ? "bg-secondary text-white border-secondary"
                            : isAvailable
                            ? "bg-white text-secondary border-neutral-200 hover:border-secondary hover:shadow-sm"
                            : "bg-white text-neutral-300 border-neutral-100 line-through"
                        )}
                      >
                        {memory}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {colorOptions.length > 1 && (
              <div className="bg-[#f0f9ff] rounded-2xl p-4">
                <label className="text-[10px] text-blue-500 font-bold uppercase mb-3 block">
                  Цвет
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => {
                    const isSelected = selectedVariant.color === color;
                    const isAvailable = availableColors.has(color);
                    return (
                      <button
                        key={color}
                        onClick={() => onColorChange(color)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                          isSelected
                            ? "bg-secondary text-white border-secondary"
                            : isAvailable
                            ? "bg-white text-secondary border-neutral-200 hover:border-secondary hover:shadow-sm"
                            : "bg-white text-neutral-300 border-neutral-100 line-through"
                        )}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
         )}

         <div className="bg-white border border-neutral-100 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-neutral-300" />
                <span className="text-sm font-bold text-secondary">Гарантия 1 год</span>
            </div>
            <Info size={18} className="text-neutral-200" />
         </div>
      </div>

      {/* Seller info */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center font-black text-neutral-400 text-xs">IS</div>
          <div>
              <p className="text-sm font-black text-secondary leading-tight">Gameshop24</p>
              <p className="text-[10px] text-neutral-400 font-bold">Официальный продавец</p>
          </div>
      </div>
    </div>
  );
}
