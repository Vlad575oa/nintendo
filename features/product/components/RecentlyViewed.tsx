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
      <div className="flex items-end justify-between mb-10 px-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight uppercase tracking-tighter italic">
            Вы <span className="text-primary not-italic">просматривали</span>
          </h2>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-2">Товары, которые вас заинтересовали</p>
        </div>
      </div>

      {/* Category tabs — Elite Glassmorphism styling */}
      {tabs.length > 2 && (
        <div className="flex items-center gap-3 mb-10 px-4 overflow-x-auto no-scrollbar">
          {tabs.map(({ label, slug }) => (
            <button
              key={String(slug)}
              onClick={() => setActiveSlug(slug)}
              className={cn(
                "px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 border",
                activeSlug === slug
                  ? "bg-primary border-primary text-white shadow-xl shadow-primary/20"
                  : "bg-white/5 border-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"
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
