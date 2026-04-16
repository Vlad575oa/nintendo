"use client";

import { useEffect, useState } from "react";
import { useRecentlyViewed } from "@/features/product/hooks/useRecentlyViewed";
import { ProductCard } from "@/features/product/components/ProductCard";
import { cn } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  priceOld?: number | null;
  images: string[];
  isNew?: boolean;
  isSale?: boolean;
  inStock?: boolean;
  category?: { slug: string; name: string };
}

export function RecentlyViewed() {
  const { getIds } = useRecentlyViewed();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = getIds();
    if (ids.length === 0) {
      setLoading(false);
      return;
    }
    fetch(`/api/products/recent?ids=${ids.join(",")}`)
      .then((r) => r.json())
      .then((data: Product[]) => setProducts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || products.length === 0) return null;

  // Build unique category tabs from fetched products
  const categorySet = new Map<string, string>();
  products.forEach((p) => {
    if (p.category) categorySet.set(p.category.slug, p.category.name);
  });
  const tabs = [
    { label: "Все категории", slug: null },
    ...Array.from(categorySet.entries()).map(([slug, name]) => ({ label: name, slug })),
  ];

  const filtered =
    activeSlug ? products.filter((p) => p.category?.slug === activeSlug) : products;

  return (
    <section className="mt-28">
      <div className="flex items-end justify-between mb-8 px-4">
        <div>
          <h2 className="text-3xl font-black text-neutral-900 leading-tight">
            Вы просматривали
          </h2>
          <p className="text-neutral-500 mt-2">Товары, которые вас заинтересовали</p>
        </div>
      </div>

      {/* Category tabs — only show when there are 2+ categories */}
      {tabs.length > 2 && (
        <div className="flex items-center gap-2 mb-6 px-4 overflow-x-auto no-scrollbar">
          {tabs.map(({ label, slug }) => (
            <button
              key={String(slug)}
              onClick={() => setActiveSlug(slug)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all",
                activeSlug === slug
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-neutral-50 text-neutral-500 hover:bg-neutral-100"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="px-4">
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
          {filtered.map((product) => (
            <div key={product.id} className="min-w-[240px] snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
